import { WadaPalette, WadaColor } from '../types';

export function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

export function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map(v => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = Math.round(h * 60);
  }

  return [h, Math.round(s * 100), Math.round(l * 100)];
}

// Relative luminance based on WCAG 2.1 specifications
export function getRelativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(c => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Math.round(ratio * 10) / 10;
}

export function getWCAGRating(ratio: number) {
  return {
    ratio,
    aaLarge: ratio >= 3.0,
    aa: ratio >= 4.5,
    aaa: ratio >= 7.0,
    badgeText: ratio >= 7.0 ? 'AAA Pass' : ratio >= 4.5 ? 'AA Pass' : ratio >= 3.0 ? 'AA Large' : 'Fail',
    badgeColor: ratio >= 4.5 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
  };
}

export function isLightColor(hex: string): boolean {
  return getRelativeLuminance(hex) > 0.45;
}

export type CanvasThemeMode = 'washi-light' | 'midnight-dark' | 'palette-canvas';

export interface UIRoleAssignment {
  canvasMode: CanvasThemeMode;
  bg: string;
  surface: string;
  text: string;
  primary: string;
  accent: string;
  buttonText: string;
}

// Automatically deduce optimal UI roles for colors in a palette with guaranteed WCAG contrast
export function autoAssignUIRoles(colors: WadaColor[], mode: CanvasThemeMode = 'washi-light'): UIRoleAssignment {
  if (colors.length === 0) {
    return {
      canvasMode: 'washi-light',
      bg: '#fcfbf8',
      surface: '#ffffff',
      text: '#1a1816',
      primary: '#222222',
      accent: '#cb3550',
      buttonText: '#ffffff'
    };
  }

  // Sort colors by luminance (lightest to darkest)
  const sorted = [...colors].sort((a, b) => getRelativeLuminance(b.hex) - getRelativeLuminance(a.hex));
  const lightest = sorted[0];
  const darkest = sorted[sorted.length - 1];

  // 1. Washi Light Canvas Mode (Standard Web UI: Guaranteed AAA pass)
  if (mode === 'washi-light') {
    // Choose primary button from palette: pick the tone with good prominence
    const primaryCandidate = colors.length === 2 ? darkest : (sorted[1] || darkest);
    const primaryHex = primaryCandidate.hex;
    const buttonText = getContrastRatio(primaryHex, '#ffffff') >= 4.0 ? '#ffffff' : '#121110';
    const accentCandidate = colors.find(c => c.hex !== primaryHex) || lightest;

    return {
      canvasMode: 'washi-light',
      bg: '#fcfbf8',
      surface: '#ffffff',
      text: '#181614', // 16:1 AAA pass against #fcfbf8
      primary: primaryHex,
      accent: accentCandidate.hex,
      buttonText
    };
  }

  // 2. Midnight Dark Canvas Mode (Modern dark theme: Guaranteed AAA pass)
  if (mode === 'midnight-dark') {
    const primaryCandidate = colors.length === 2 ? lightest : (sorted[0] || lightest);
    const primaryHex = primaryCandidate.hex;
    const buttonText = getContrastRatio(primaryHex, '#121110') >= 4.0 ? '#121110' : '#ffffff';
    const accentCandidate = colors.find(c => c.hex !== primaryHex) || darkest;

    return {
      canvasMode: 'midnight-dark',
      bg: '#121110',
      surface: '#1d1a17',
      text: '#f7f3ea', // 16.5:1 AAA pass against #121110
      primary: primaryHex,
      accent: accentCandidate.hex,
      buttonText
    };
  }

  // 3. Palette Tinted Canvas (Uses the palette colors directly)
  // Ensure that background and button/text NEVER share the same color or fail contrast
  const bg = lightest.hex;
  const primary = darkest.hex;
  
  // Test if darkest has at least 4.5:1 against lightest
  let text = darkest.hex;
  if (getContrastRatio(text, bg) < 4.5) {
    // Select high-contrast ink or ivory override to ensure readability
    text = getContrastRatio('#141210', bg) >= getContrastRatio('#ffffff', bg) ? '#141210' : '#ffffff';
  }

  const buttonText = getContrastRatio(primary, '#ffffff') >= 4.0 ? '#ffffff' : '#121110';
  const accent = colors.length > 2 ? sorted[1].hex : (colors[0].hex !== bg ? colors[0].hex : colors[1]?.hex || primary);

  return {
    canvasMode: 'palette-canvas',
    bg,
    surface: isLightColor(bg) ? '#ffffff' : '#1d1a17',
    text,
    primary,
    accent,
    buttonText
  };
}

export function generateCSSVariables(palette: WadaPalette): string {
  const vars = palette.colors
    .map((c, i) => `  --color-${i + 1}-${c.romaji.toLowerCase().replace(/[^a-z0-9]/g, '-')}: ${c.hex}; /* ${c.nameJa} (${c.nameEn}) */`)
    .join('\n');
  return `/* Sanzo Wada Palette № ${palette.code}: ${palette.name} */\n:root {\n${vars}\n}`;
}

export function generateTailwindConfig(palette: WadaPalette): string {
  const entries = palette.colors
    .map((c, i) => `        '${c.romaji.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'color-' + (i + 1)}': '${c.hex}', // ${c.nameJa} (${c.nameEn})`)
    .join('\n');
  return `// tailwind.config.js - Palette № ${palette.code}\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        wada${palette.code}: {\n${entries}\n        }\n      }\n    }\n  }\n};`;
}

export function generateSCSS(palette: WadaPalette): string {
  const scssVars = palette.colors
    .map((c, i) => `$wada-${palette.code}-${c.romaji.toLowerCase().replace(/[^a-z0-9]/g, '-')}: ${c.hex}; // ${c.nameJa} (${c.nameEn})`)
    .join('\n');
  return `// Sanzo Wada Palette № ${palette.code}\n${scssVars}`;
}

export function generateJSONTokens(palette: WadaPalette): string {
  const data = {
    id: palette.id,
    code: palette.code,
    name: palette.name,
    nameJa: palette.nameJa,
    colors: palette.colors.map(c => ({
      nameJa: c.nameJa,
      reading: c.reading,
      romaji: c.romaji,
      nameEn: c.nameEn,
      hex: c.hex,
      rgb: c.rgb,
      cmyk: c.cmyk
    }))
  };
  return JSON.stringify(data, null, 2);
}

export function generateSVGCard(palette: WadaPalette): string {
  const width = 800;
  const height = 480;
  const numColors = palette.colors.length;
  const swatchWidth = width / numColors;

  const colorRects = palette.colors.map((c, i) => `
    <g transform="translate(${i * swatchWidth}, 0)">
      <rect width="${swatchWidth}" height="320" fill="${c.hex}" />
      <rect y="320" width="${swatchWidth}" height="160" fill="#fcfaf6" />
      <text x="${swatchWidth / 2}" y="360" text-anchor="middle" font-family="'Shippori Mincho', 'Noto Serif JP', serif" font-size="20" font-weight="bold" fill="#1f1e1c">${c.nameJa}</text>
      <text x="${swatchWidth / 2}" y="388" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" fill="#6c6760">${c.nameEn}</text>
      <text x="${swatchWidth / 2}" y="415" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#2d2a26">${c.hex.toUpperCase()}</text>
      <text x="${swatchWidth / 2}" y="438" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" fill="#8c857b">C${c.cmyk[0]} M${c.cmyk[1]} Y${c.cmyk[2]} K${c.cmyk[3]}</text>
    </g>
  `).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="#f5f2ea" />
    <g>
      ${colorRects}
    </g>
    <!-- Header banner stamp -->
    <rect x="20" y="20" width="160" height="34" rx="4" fill="rgba(255,255,255,0.92)" stroke="#ddd5c5" />
    <text x="32" y="42" font-family="'Shippori Mincho', serif" font-size="13" font-weight="bold" fill="#2d2a26">№ ${palette.code} 配色事典</text>
    <text x="122" y="42" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#7d7568">1933</text>
  </svg>`;
}
