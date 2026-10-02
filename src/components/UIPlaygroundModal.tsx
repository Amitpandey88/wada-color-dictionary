import React, { useState, useEffect } from 'react';
import { WadaPalette, WadaColor, UIPreviewMode } from '../types';
import {
  X, Sparkles, Sliders, Check, Copy, Download, Share2, Layers,
  Smartphone, LayoutDashboard, Newspaper, Compass, RefreshCw,
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Box,
  Zap, Rocket, Plus, Minus, Search, ShieldCheck, Sun, Moon, Play
} from 'lucide-react';
import { playCopyChime, playGentleClick } from '../utils/sound';
import { ThreeCanvas } from './ThreeCanvas';
import {
  getContrastRatio,
  getWCAGRating,
  autoAssignUIRoles,
  CanvasThemeMode,
  UIRoleAssignment,
  generateCSSVariables,
  generateTailwindConfig,
  generateSCSS,
  generateJSONTokens,
  generateSVGCard,
  isLightColor
} from '../utils/colorUtils';

interface UIPlaygroundModalProps {
  palette: WadaPalette | null;
  allPalettes: WadaPalette[];
  isOpen: boolean;
  onClose: () => void;
  onSelectPalette: (palette: WadaPalette) => void;
  onCopyNotice: (title: string, subtitle?: string, colorHex?: string) => void;
}

export const UIPlaygroundModal: React.FC<UIPlaygroundModalProps> = ({
  palette,
  allPalettes,
  isOpen,
  onClose,
  onSelectPalette,
  onCopyNotice,
}) => {
  if (!isOpen || !palette) return null;

  const [previewMode, setPreviewMode] = useState<UIPreviewMode>('landing');
  const [exportTab, setExportTab] = useState<'css' | 'tailwind' | 'scss' | 'json'>('tailwind');
  const [canvasTheme, setCanvasTheme] = useState<CanvasThemeMode>('washi-light');

  // Custom UI roles assigned by user or auto-balanced
  const [roles, setRoles] = useState<UIRoleAssignment>(() =>
    autoAssignUIRoles(palette.colors, 'washi-light')
  );

  // Interactive SaaS landing states
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployStep, setDeployStep] = useState<number>(0);
  const [deployComplete, setDeployComplete] = useState<boolean>(false);
  
  // Interactive Live Building Sandbox states
  const [isBuildingMode, setIsBuildingMode] = useState<boolean>(false);
  const [buildingCounter, setBuildingCounter] = useState<number>(42);
  const [buildingSearch, setBuildingSearch] = useState<string>('');
  const [borderStyle, setBorderStyle] = useState<'rounded-xl' | 'rounded-full' | 'rounded-none'>('rounded-xl');
  const [activeChip, setActiveChip] = useState<string>('All');
  const [liveClicks, setLiveClicks] = useState<number>(0);
  const [activeNavTab, setActiveNavTab] = useState<'overview' | 'tokens' | 'accessibility'>('overview');

  // Re-initialize roles whenever palette changes
  useEffect(() => {
    if (palette) {
      const assigned = autoAssignUIRoles(palette.colors, canvasTheme);
      setRoles(assigned);
    }
  }, [palette, canvasTheme]);

  // Handle auto-balance and contrast fixing
  const handleAutoBalance = () => {
    playGentleClick();
    const assigned = autoAssignUIRoles(palette.colors, canvasTheme);
    setRoles(assigned);
    onCopyNotice('Auto-Balanced Roles', 'Calculated optimal WCAG contrast hierarchy');
  };

  const handleFixContrast = () => {
    playCopyChime();
    setCanvasTheme('washi-light');
    const assigned = autoAssignUIRoles(palette.colors, 'washi-light');
    setRoles(assigned);
    onCopyNotice('WCAG Contrast Fixed', 'Applied guaranteed AAA 16:1 text & button hierarchy');
  };

  // Change canvas theme
  const handleThemeChange = (mode: CanvasThemeMode) => {
    playGentleClick();
    setCanvasTheme(mode);
    const assigned = autoAssignUIRoles(palette.colors, mode);
    setRoles(assigned);
  };

  // Interactive Deployment Simulator
  const handleStartDeploy = () => {
    playCopyChime();
    setIsDeploying(true);
    setDeployStep(1);
    setDeployComplete(false);

    setTimeout(() => {
      setDeployStep(2);
      playGentleClick();
    }, 500);

    setTimeout(() => {
      setDeployStep(3);
      playGentleClick();
    }, 1100);

    setTimeout(() => {
      setDeployStep(4);
      playGentleClick();
    }, 1700);

    setTimeout(() => {
      setDeployStep(5);
      setDeployComplete(true);
      playCopyChime();
      onCopyNotice('Production Deployment Complete! 🚀', `№ ${palette.code} tokens deployed to edge CDN`);
    }, 2300);
  };

  // Navigate next / prev palette
  const handlePrevPalette = () => {
    playGentleClick();
    const currentIndex = allPalettes.findIndex(p => p.id === palette.id);
    const prevIndex = (currentIndex - 1 + allPalettes.length) % allPalettes.length;
    onSelectPalette(allPalettes[prevIndex]);
  };

  const handleNextPalette = () => {
    playGentleClick();
    const currentIndex = allPalettes.findIndex(p => p.id === palette.id);
    const nextIndex = (currentIndex + 1) % allPalettes.length;
    onSelectPalette(allPalettes[nextIndex]);
  };

  // Invert canvas (Dark/Light flip)
  const handleInvertCanvas = () => {
    playGentleClick();
    if (canvasTheme === 'washi-light') {
      handleThemeChange('midnight-dark');
    } else {
      handleThemeChange('washi-light');
    }
  };

  // Copy code helper
  const handleCopyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    playCopyChime();
    onCopyNotice(`Copied ${label}`, 'Ready to paste into your codebase');
  };

  // Download SVG
  const handleDownloadSVG = () => {
    const svgContent = generateSVGCard(palette);
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wada-palette-${palette.code}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    playCopyChime();
    onCopyNotice('Downloaded SVG Card', `Saved wada-palette-${palette.code}.svg`);
  };

  // Contrast calculations
  const textBgContrast = getContrastRatio(roles.text, roles.bg);
  const textBgWCAG = getWCAGRating(textBgContrast);

  // Button text inside the button fill
  const buttonLabelHex = roles.buttonText || (isLightColor(roles.primary) ? '#121110' : '#ffffff');
  const buttonTextContrast = getContrastRatio(buttonLabelHex, roles.primary);
  const buttonTextWCAG = getWCAGRating(buttonTextContrast);

  // Button fill against background
  const primaryBgContrast = getContrastRatio(roles.primary, roles.bg);
  const primaryBgWCAG = {
    ratio: primaryBgContrast,
    isPass: primaryBgContrast >= 3.0,
    badgeText: primaryBgContrast >= 3.0 ? 'Pass (UI Element)' : 'Low Contrast',
    badgeColor: primaryBgContrast >= 3.0
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
  };

  const isFailingAnyContrast = textBgContrast < 4.5 || primaryBgContrast < 3.0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#fcfaf6] dark:bg-[#161412] border border-[#e4dcce] dark:border-[#2f2b25] rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Studio Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e9e2d3] dark:border-[#2c2822] bg-[#f8f4ec] dark:bg-[#1c1a17]">
          
          <div className="flex items-center gap-3">
            <div className="hanko-seal w-8 h-8 text-sm bg-[#cb3550]/10">
              和
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-[#1f1d19] dark:text-[#f7f4ee]">
                  № {palette.code}
                </span>
                <span className="font-japanese font-semibold text-sm text-[#4d463d] dark:text-[#d3cbbe]">
                  {palette.nameJa}
                </span>
                <span className="text-xs text-[#81796d] dark:text-[#999083] font-sans hidden sm:inline">
                  • {palette.name}
                </span>
              </div>
              <p className="text-[11px] text-[#7d7568] dark:text-[#9b9285] font-sans">
                {palette.designerTip}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev/Next buttons */}
            <div className="flex items-center rounded-lg border border-[#dbd1bf] dark:border-[#353028] bg-white dark:bg-[#221f1a] p-0.5">
              <button
                onClick={handlePrevPalette}
                className="p-1 text-[#6b6457] dark:text-[#a8a092] hover:text-[#1c1a17] dark:hover:text-white"
                title="Previous palette"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextPalette}
                className="p-1 text-[#6b6457] dark:text-[#a8a092] hover:text-[#1c1a17] dark:hover:text-white"
                title="Next palette"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={() => {
                playGentleClick();
                onClose();
              }}
              className="p-2 rounded-lg text-[#6e675b] dark:text-[#a1998c] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split view (Left: Controls & Swatches, Right: Live Previews & Code) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Color Role Assignment & Palette Details (4 cols) */}
          <div className="lg:col-span-4 p-5 border-b lg:border-b-0 lg:border-r border-[#eae3d5] dark:border-[#292520] bg-[#faf6ee] dark:bg-[#181614] flex flex-col justify-between space-y-6">
            
            <div className="space-y-5">
              
              {/* Palette Swatches Bar */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-widest text-[#787164] dark:text-[#9c9487] block mb-2">
                  Palette Swatches ({palette.count} Colors)
                </label>
                <div className="flex h-14 rounded-lg overflow-hidden border border-black/10 shadow-sm">
                  {palette.colors.map((color, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        navigator.clipboard.writeText(color.hex);
                        playCopyChime();
                        onCopyNotice(`Copied ${color.hex}`, color.nameEn, color.hex);
                      }}
                      className="flex-1 h-full cursor-pointer relative group/sw hover:flex-[1.5] transition-all"
                      style={{ backgroundColor: color.hex }}
                      title={`Click to copy ${color.nameEn}: ${color.hex}`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/sw:opacity-100 bg-black/30 backdrop-blur-[1px] transition-opacity">
                        <span className="text-[10px] font-mono font-bold text-white px-1 py-0.5 rounded bg-black/60">
                          {color.hex.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Canvas Theme Preset Selector */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-widest text-[#787164] dark:text-[#9c9487] block mb-1.5">
                  Canvas Web System
                </label>
                <div className="grid grid-cols-3 gap-1 bg-[#ede6d8] dark:bg-[#221f1a] p-1 rounded-xl border border-[#ded5c2] dark:border-[#353028]">
                  <button
                    onClick={() => handleThemeChange('washi-light')}
                    className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      canvasTheme === 'washi-light'
                        ? 'bg-white dark:bg-[#343028] text-[#1c1a17] dark:text-[#f8f5ee] shadow-xs font-semibold'
                        : 'text-[#6e675b] dark:text-[#a0988a]'
                    }`}
                  >
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Washi Light</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange('midnight-dark')}
                    className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      canvasTheme === 'midnight-dark'
                        ? 'bg-white dark:bg-[#343028] text-[#1c1a17] dark:text-[#f8f5ee] shadow-xs font-semibold'
                        : 'text-[#6e675b] dark:text-[#a0988a]'
                    }`}
                  >
                    <Moon className="w-3 h-3 text-indigo-400" />
                    <span>Midnight</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange('palette-canvas')}
                    className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      canvasTheme === 'palette-canvas'
                        ? 'bg-white dark:bg-[#343028] text-[#1c1a17] dark:text-[#f8f5ee] shadow-xs font-semibold'
                        : 'text-[#6e675b] dark:text-[#a0988a]'
                    }`}
                  >
                    <Box className="w-3 h-3 text-[#cb3550]" />
                    <span>Palette Tint</span>
                  </button>
                </div>
              </div>

              {/* Role Assignment Controls */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-[#787164] dark:text-[#9c9487]">
                    Assign UI Component Roles
                  </label>
                  <button
                    onClick={handleAutoBalance}
                    className="flex items-center gap-1 text-[11px] font-medium text-[#cb3550] hover:underline"
                    title="Calculate optimal contrast roles"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Balance</span>
                  </button>
                </div>

                {/* Role: Canvas Background */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#201e19] border border-[#ded5c4] dark:border-[#332f27]">
                  <span className="text-xs font-sans text-[#524b41] dark:text-[#c7bfb3]">Canvas Background</span>
                  <div className="flex items-center gap-1.5">
                    {palette.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => { playGentleClick(); setRoles({ ...roles, bg: c.hex }); }}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          roles.bg === c.hex ? 'ring-2 ring-offset-1 ring-[#cb3550] scale-110' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={`Set background to ${c.nameEn}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Role: Typography Heading / Text */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#201e19] border border-[#ded5c4] dark:border-[#332f27]">
                  <span className="text-xs font-sans text-[#524b41] dark:text-[#c7bfb3]">Headings & Text</span>
                  <div className="flex items-center gap-1.5">
                    {palette.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => { playGentleClick(); setRoles({ ...roles, text: c.hex }); }}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          roles.text === c.hex ? 'ring-2 ring-offset-1 ring-[#cb3550] scale-110' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={`Set text to ${c.nameEn}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Role: Primary Button / CTA */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#201e19] border border-[#ded5c4] dark:border-[#332f27]">
                  <span className="text-xs font-sans text-[#524b41] dark:text-[#c7bfb3]">Primary Button (CTA)</span>
                  <div className="flex items-center gap-1.5">
                    {palette.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => { playGentleClick(); setRoles({ ...roles, primary: c.hex }); }}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          roles.primary === c.hex ? 'ring-2 ring-offset-1 ring-[#cb3550] scale-110' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={`Set primary CTA to ${c.nameEn}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Role: Accent / Badge */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#201e19] border border-[#ded5c4] dark:border-[#332f27]">
                  <span className="text-xs font-sans text-[#524b41] dark:text-[#c7bfb3]">Accent Highlight</span>
                  <div className="flex items-center gap-1.5">
                    {palette.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => { playGentleClick(); setRoles({ ...roles, accent: c.hex }); }}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          roles.accent === c.hex ? 'ring-2 ring-offset-1 ring-[#cb3550] scale-110' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={`Set accent to ${c.nameEn}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Invert Dark/Light flip */}
                <button
                  onClick={handleInvertCanvas}
                  className="w-full py-1.5 px-3 rounded-lg border border-[#dbd1bf] dark:border-[#353028] bg-white/70 dark:bg-[#201d18] text-xs font-medium text-[#5c5448] dark:text-[#c0b8ac] hover:bg-white dark:hover:bg-[#25221d] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Toggle Light / Dark Contrast</span>
                </button>
              </div>

              {/* Live WCAG Accessibility Score Box & Auto-Fixer */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#201e19] border border-[#ded5c4] dark:border-[#332f27] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-[#1f1d19] dark:text-[#f8f5ee]">
                      WCAG 2.1 Accessibility
                    </span>
                  </div>
                  {isFailingAnyContrast && (
                    <button
                      onClick={handleFixContrast}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#cb3550] text-white text-[10px] font-bold shadow-2xs hover:bg-[#b02941] animate-pulse"
                      title="Fix contrast to guaranteed AAA"
                    >
                      <Zap className="w-3 h-3 fill-current" />
                      <span>Fix Contrast (AAA)</span>
                    </button>
                  )}
                </div>

                {/* Metric 1: Text on Canvas */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#554e43] dark:text-[#c4bbb0]">Text on Canvas</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${textBgWCAG.badgeColor}`}>
                    {textBgWCAG.ratio}:1 ({textBgWCAG.badgeText})
                  </span>
                </div>

                {/* Metric 2: Button Text on Button */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#554e43] dark:text-[#c4bbb0]">Button Label Contrast</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${buttonTextWCAG.badgeColor}`}>
                    {buttonTextWCAG.ratio}:1 ({buttonTextWCAG.badgeText})
                  </span>
                </div>

                {/* Metric 3: Button on Canvas */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#554e43] dark:text-[#c4bbb0]">Button on Canvas</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${primaryBgWCAG.badgeColor}`}>
                    {primaryBgContrast}:1 ({primaryBgWCAG.badgeText})
                  </span>
                </div>

                {isFailingAnyContrast ? (
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 flex items-start gap-1.5 text-[10px] text-amber-800 dark:text-amber-300">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      Some colors have low relative contrast. Click <strong>"Fix Contrast (AAA)"</strong> to apply readable washi canvas & typography.
                    </span>
                  </div>
                ) : (
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>All core UI text passes WCAG 2.1 criteria.</span>
                  </div>
                )}
              </div>

            </div>

            {/* Quick Export Downloads */}
            <div className="pt-4 border-t border-[#ded5c2] dark:border-[#2e2a24] flex items-center gap-2">
              <button
                onClick={handleDownloadSVG}
                className="flex-1 py-2 px-3 rounded-lg bg-white dark:bg-[#221f1a] border border-[#dbd1bf] dark:border-[#38332b] text-xs font-medium text-[#3b362e] dark:text-[#d3cbbe] hover:border-[#cb3550] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#cb3550]" />
                <span>Export SVG Swatch</span>
              </button>
            </div>

          </div>

          {/* Right Column: Interactive UI Mockups & Code Exporter (8 cols) */}
          <div className="lg:col-span-8 p-5 sm:p-6 flex flex-col justify-between space-y-6">
            
            {/* View Mode Switcher for UI preview */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-1 bg-[#ede6d8] dark:bg-[#23201b] p-1 rounded-xl border border-[#ded5c2] dark:border-[#353029]">
                  <button
                    onClick={() => { playGentleClick(); setPreviewMode('landing'); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      previewMode === 'landing'
                        ? 'bg-white dark:bg-[#343029] text-[#1c1a17] dark:text-[#f8f5ee] shadow-sm font-semibold'
                        : 'text-[#6e675b] dark:text-[#a1998c]'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>SaaS Landing</span>
                  </button>
                  <button
                    onClick={() => { playGentleClick(); setPreviewMode('dashboard'); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      previewMode === 'dashboard'
                        ? 'bg-white dark:bg-[#343029] text-[#1c1a17] dark:text-[#f8f5ee] shadow-sm font-semibold'
                        : 'text-[#6e675b] dark:text-[#a1998c]'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => { playGentleClick(); setPreviewMode('editorial'); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      previewMode === 'editorial'
                        ? 'bg-white dark:bg-[#343029] text-[#1c1a17] dark:text-[#f8f5ee] shadow-sm font-semibold'
                        : 'text-[#6e675b] dark:text-[#a1998c]'
                    }`}
                  >
                    <Newspaper className="w-3.5 h-3.5" />
                    <span>Editorial Poster</span>
                  </button>
                  <button
                    onClick={() => { playGentleClick(); setPreviewMode('mobile'); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      previewMode === 'mobile'
                        ? 'bg-white dark:bg-[#343029] text-[#1c1a17] dark:text-[#f8f5ee] shadow-sm font-semibold'
                        : 'text-[#6e675b] dark:text-[#a1998c]'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile Screen</span>
                  </button>
                  <button
                    onClick={() => { playGentleClick(); setPreviewMode('spatial-3d'); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      previewMode === 'spatial-3d'
                        ? 'bg-white dark:bg-[#343029] text-[#1c1a17] dark:text-[#f8f5ee] shadow-sm font-semibold'
                        : 'text-[#6e675b] dark:text-[#a1998c]'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5 text-[#cb3550]" />
                    <span>3D Spatial & Packaging</span>
                  </button>
                </div>

                <div className="text-[11px] font-mono text-[#8a8274] dark:text-[#90887c]">
                  Live Responsive Engine
                </div>
              </div>

              {/* THE LIVE UI CANVAS CONTAINER */}
              <div
                className="rounded-2xl border border-black/15 shadow-plate overflow-hidden transition-all duration-300 min-h-[380px] flex flex-col justify-center relative"
                style={{ backgroundColor: roles.bg }}
              >
                {/* PREVIEW 1: SAAS LANDING PAGE (FULL INTERACTION) */}
                {previewMode === 'landing' && (
                  <div className="p-6 sm:p-8 space-y-6 relative">
                    
                    {/* Mock Interactive Navbar */}
                    <div className="flex items-center justify-between pb-4 border-b border-black/10">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onCopyNotice('Wada Soukan Brand', '1933 Historical Color Series')}>
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs shadow-sm"
                          style={{
                            backgroundColor: roles.primary,
                            color: buttonLabelHex
                          }}
                        >
                          W
                        </div>
                        <span className="font-serif font-bold text-sm tracking-wide" style={{ color: roles.text }}>
                          Soukan Studio
                        </span>
                      </div>

                      {/* Interactive Nav items */}
                      <div className="hidden sm:flex items-center gap-4 text-xs font-sans">
                        <button
                          onClick={() => { playGentleClick(); setActiveNavTab('overview'); }}
                          className={`transition-colors ${activeNavTab === 'overview' ? 'font-bold' : 'opacity-70 hover:opacity-100'}`}
                          style={{ color: roles.text }}
                        >
                          Overview
                        </button>
                        <button
                          onClick={() => { playGentleClick(); setActiveNavTab('tokens'); }}
                          className={`transition-colors ${activeNavTab === 'tokens' ? 'font-bold' : 'opacity-70 hover:opacity-100'}`}
                          style={{ color: roles.text }}
                        >
                          Tokens
                        </button>
                        <button
                          onClick={() => { playGentleClick(); setActiveNavTab('accessibility'); }}
                          className={`transition-colors ${activeNavTab === 'accessibility' ? 'font-bold' : 'opacity-70 hover:opacity-100'}`}
                          style={{ color: roles.text }}
                        >
                          Accessibility
                        </button>
                      </div>

                      {/* Interactive Start Building CTA */}
                      <button
                        onClick={() => {
                          playGentleClick();
                          setIsBuildingMode(!isBuildingMode);
                          onCopyNotice(isBuildingMode ? 'Exited Sandbox' : 'Entered Interactive Builder Sandbox', 'Try adjusting components and counters!');
                        }}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                        style={{
                          backgroundColor: roles.primary,
                          color: buttonLabelHex
                        }}
                      >
                        <Sliders className="w-3 h-3" />
                        <span>{isBuildingMode ? 'Close Sandbox' : 'Start Building'}</span>
                      </button>
                    </div>

                    {/* Hero Grid: Copy on Left, Interactive UI Card on Right */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      
                      <div className="md:col-span-7 space-y-3.5">
                        <div
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium border shadow-2xs"
                          style={{
                            backgroundColor: roles.surface,
                            borderColor: roles.accent,
                            color: roles.text
                          }}
                        >
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: roles.accent }}></span>
                          <span>№ {palette.code} Harmony Plate • {palette.count} Colors</span>
                        </div>

                        <h2
                          className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold leading-tight"
                          style={{ color: roles.text }}
                        >
                          Harmonious Craft for Modern Digital Web Apps.
                        </h2>

                        <p
                          className="text-xs sm:text-sm leading-relaxed"
                          style={{ color: roles.text, opacity: 0.85 }}
                        >
                          Extracted from Sanzo Wada's 1933 masterwork. Pure historical botanical & mineral color harmony ready to deploy to your code.
                        </p>

                        {/* Interactive Buttons Strip */}
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          
                          {/* Live Deploy Button */}
                          <button
                            onClick={handleStartDeploy}
                            className={`px-5 py-2.5 ${borderStyle} text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-2`}
                            style={{
                              backgroundColor: roles.primary,
                              color: buttonLabelHex
                            }}
                          >
                            <Rocket className="w-3.5 h-3.5" />
                            <span>Deploy Color Tokens</span>
                          </button>

                          {/* Interactive Builder Trigger */}
                          <button
                            onClick={() => {
                              playGentleClick();
                              setIsBuildingMode(!isBuildingMode);
                            }}
                            className={`px-4 py-2.5 ${borderStyle} text-xs font-semibold border-2 transition-all flex items-center gap-1.5 shadow-xs active:scale-95 ${
                              isBuildingMode
                                ? 'bg-[#cb3550] text-white border-[#cb3550] shadow-sm'
                                : 'bg-white/95 dark:bg-stone-900/95 hover:bg-white dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-700'
                            }`}
                          >
                            <Sliders className={`w-3.5 h-3.5 ${isBuildingMode ? 'text-white' : 'text-[#cb3550]'}`} />
                            <span>{isBuildingMode ? 'Exit Builder' : 'Start Building'}</span>
                          </button>

                        </div>

                        {/* Live Click simulation tracker */}
                        <div className="pt-1 flex items-center gap-2 text-[11px] font-mono font-medium" style={{ color: roles.text }}>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Interactive Clicks Registered: <strong className="font-bold">{liveClicks}</strong></span>
                        </div>
                      </div>

                      {/* Right: Clean Interactive Sandbox or Token Card */}
                      <div className="md:col-span-5 relative flex items-center justify-center">
                        <div
                          className="w-full rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-lg p-5 space-y-4"
                          style={{ backgroundColor: roles.surface }}
                        >
                          {/* Interactive Builder Mode */}
                          {isBuildingMode ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
                                <span className="font-serif font-bold text-xs flex items-center gap-1.5" style={{ color: roles.text }}>
                                  <Sliders className="w-3.5 h-3.5 text-[#cb3550]" />
                                  <span>Live Component Sandbox</span>
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold shadow-xs">
                                  LIVE
                                </span>
                              </div>

                              {/* Interactive Counter Widget */}
                              <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-between shadow-2xs" style={{ backgroundColor: roles.bg }}>
                                <div>
                                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider block text-stone-800 dark:text-stone-200">
                                    Interactive Counter
                                  </span>
                                  <span className="text-base font-bold font-mono" style={{ color: roles.text }}>
                                    {buildingCounter} units
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      playGentleClick();
                                      setBuildingCounter(c => Math.max(0, c - 1));
                                      setLiveClicks(c => c + 1);
                                    }}
                                    className="w-8 h-8 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 flex items-center justify-center font-bold text-stone-800 dark:text-stone-100 shadow-2xs hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 transition-all cursor-pointer"
                                    aria-label="Decrease counter"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      playGentleClick();
                                      setBuildingCounter(c => c + 1);
                                      setLiveClicks(c => c + 1);
                                    }}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-sm active:scale-95 transition-all hover:brightness-105 cursor-pointer"
                                    style={{ backgroundColor: roles.primary, color: buttonLabelHex }}
                                    aria-label="Increase counter"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Interactive Corner Radius Swapper */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#cb3550]" />
                                    Border Style:
                                  </span>
                                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-stone-700 dark:text-stone-300">
                                    {borderStyle === 'rounded-xl' ? 'Rounded (12px)' : borderStyle === 'rounded-full' ? 'Pill (Full)' : 'Sharp (0px)'}
                                  </span>
                                </div>

                                <div className="p-1 rounded-xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 grid grid-cols-3 gap-1.5">
                                  <button
                                    onClick={() => { playGentleClick(); setBorderStyle('rounded-xl'); }}
                                    className={`py-2 px-2.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                      borderStyle === 'rounded-xl'
                                        ? 'bg-[#cb3550] text-white font-bold shadow-sm'
                                        : 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 shadow-2xs'
                                    }`}
                                  >
                                    <span className={`w-2.5 h-2.5 rounded-xs border-2 ${borderStyle === 'rounded-xl' ? 'border-white' : 'border-stone-500'}`} />
                                    <span>Rounded</span>
                                  </button>

                                  <button
                                    onClick={() => { playGentleClick(); setBorderStyle('rounded-full'); }}
                                    className={`py-2 px-2.5 rounded-full text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                      borderStyle === 'rounded-full'
                                        ? 'bg-[#cb3550] text-white font-bold shadow-sm'
                                        : 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 shadow-2xs'
                                    }`}
                                  >
                                    <span className={`w-3.5 h-2 rounded-full border-2 ${borderStyle === 'rounded-full' ? 'border-white' : 'border-stone-500'}`} />
                                    <span>Pill</span>
                                  </button>

                                  <button
                                    onClick={() => { playGentleClick(); setBorderStyle('rounded-none'); }}
                                    className={`py-2 px-2.5 rounded-none text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                      borderStyle === 'rounded-none'
                                        ? 'bg-[#cb3550] text-white font-bold shadow-sm'
                                        : 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 shadow-2xs'
                                    }`}
                                  >
                                    <span className={`w-2.5 h-2.5 rounded-none border-2 ${borderStyle === 'rounded-none' ? 'border-white' : 'border-stone-500'}`} />
                                    <span>Sharp</span>
                                  </button>
                                </div>
                              </div>

                              {/* Interactive Action Button */}
                              <button
                                onClick={() => {
                                  playCopyChime();
                                  setLiveClicks(c => c + 1);
                                  onCopyNotice('Interactive CTA Clicked', `Total clicks: ${liveClicks + 1}`);
                                }}
                                className={`w-full py-2.5 ${borderStyle} text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer`}
                                style={{
                                  backgroundColor: roles.primary,
                                  color: buttonLabelHex
                                }}
                              >
                                <Zap className="w-3.5 h-3.5" />
                                <span>Test Click Action (+1)</span>
                              </button>
                            </div>
                          ) : (
                            /* Standard 2D Token Showcase Card */
                            <div className="space-y-3.5">
                              {/* Window header dots */}
                              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80"></span>
                                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></span>
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></span>
                                </div>
                                <span className="text-[10px] font-mono opacity-60" style={{ color: roles.text }}>
                                  tokens.config.ts
                                </span>
                              </div>

                              {/* Palette Swatches row */}
                              <div className="flex h-10 rounded-lg overflow-hidden border border-black/10 shadow-inner">
                                {palette.colors.map((c, i) => (
                                  <div
                                    key={i}
                                    onClick={() => {
                                      navigator.clipboard.writeText(c.hex);
                                      playCopyChime();
                                      onCopyNotice(`Copied ${c.hex}`, c.nameEn, c.hex);
                                    }}
                                    className="flex-1 h-full relative flex items-end p-1 cursor-pointer hover:flex-[1.4] transition-all"
                                    style={{ backgroundColor: c.hex }}
                                    title={`Click to copy ${c.hex}`}
                                  >
                                    <span className={`text-[8px] font-mono font-bold px-1 rounded shadow-2xs ${
                                      isLightColor(c.hex) ? 'text-black bg-white/80' : 'text-white bg-black/60'
                                    }`}>
                                      {c.hex}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Metrics stats */}
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2.5 rounded-lg border border-black/10 space-y-0.5" style={{ backgroundColor: roles.bg }}>
                                  <span className="text-[10px] font-mono opacity-70" style={{ color: roles.text }}>Accessibility</span>
                                  <div className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                    {textBgWCAG.ratio}:1 {textBgWCAG.badgeText}
                                  </div>
                                </div>
                                <div className="p-2.5 rounded-lg border border-black/10 space-y-0.5" style={{ backgroundColor: roles.bg }}>
                                  <span className="text-[10px] font-mono opacity-70" style={{ color: roles.text }}>Harmony Type</span>
                                  <div className="font-bold font-mono capitalize" style={{ color: roles.primary }}>
                                    {palette.harmonyType}
                                  </div>
                                </div>
                              </div>

                              {/* Click to start building hint */}
                              <button
                                onClick={() => { playGentleClick(); setIsBuildingMode(true); }}
                                className="w-full py-2 rounded-lg border border-dashed border-black/20 text-[11px] font-mono hover:bg-black/5 transition-colors flex items-center justify-center gap-1.5"
                                style={{ color: roles.text }}
                              >
                                <Play className="w-3 h-3 text-[#cb3550] fill-current" />
                                <span>Click to Launch Interactive Sandbox</span>
                              </button>
                            </div>
                          )}

                        </div>
                      </div>

                    </div>

                    {/* INTERACTIVE DEPLOYMENT OVERLAY MODAL */}
                    {isDeploying && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm rounded-2xl flex items-center justify-center p-6 animate-in fade-in duration-200 z-30">
                        <div className="w-full max-w-md bg-[#fcfaf6] dark:bg-[#1a1815] rounded-2xl p-6 border border-[#ded5c2] dark:border-[#332f28] shadow-2xl space-y-5 text-left">
                          
                          <div className="flex items-center justify-between pb-3 border-b border-[#e6dfd1] dark:border-[#2d2822]">
                            <div className="flex items-center gap-2">
                              <Rocket className="w-5 h-5 text-[#cb3550] animate-bounce" />
                              <h3 className="font-serif font-bold text-base text-[#1f1d19] dark:text-[#f8f5ee]">
                                Deploying Palette № {palette.code}
                              </h3>
                            </div>
                            {deployComplete && (
                              <button
                                onClick={() => setIsDeploying(false)}
                                className="p-1 rounded-md text-[#797265] hover:text-[#1c1a17]"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {/* Progress steps */}
                          <div className="space-y-3 text-xs font-mono">
                            <div className={`flex items-center gap-2.5 ${deployStep >= 1 ? 'text-[#1c1a17] dark:text-[#ede6dc]' : 'opacity-40'}`}>
                              {deployStep > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-[#cb3550] border-t-transparent animate-spin shrink-0" />}
                              <span>1. Parsing Sanzo Wada {palette.nameJa} ({palette.count} colors)...</span>
                            </div>

                            <div className={`flex items-center gap-2.5 ${deployStep >= 2 ? 'text-[#1c1a17] dark:text-[#ede6dc]' : 'opacity-40'}`}>
                              {deployStep > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : deployStep === 2 ? <div className="w-4 h-4 rounded-full border-2 border-[#cb3550] border-t-transparent animate-spin shrink-0" /> : <div className="w-4 h-4 rounded-full border border-gray-400 shrink-0" />}
                              <span>2. Validating WCAG 2.1 compliance ({textBgContrast}:1 {textBgWCAG.badgeText})...</span>
                            </div>

                            <div className={`flex items-center gap-2.5 ${deployStep >= 3 ? 'text-[#1c1a17] dark:text-[#ede6dc]' : 'opacity-40'}`}>
                              {deployStep > 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : deployStep === 3 ? <div className="w-4 h-4 rounded-full border-2 border-[#cb3550] border-t-transparent animate-spin shrink-0" /> : <div className="w-4 h-4 rounded-full border border-gray-400 shrink-0" />}
                              <span>3. Compiling Tailwind config & CSS custom variables...</span>
                            </div>

                            <div className={`flex items-center gap-2.5 ${deployStep >= 4 ? 'text-[#1c1a17] dark:text-[#ede6dc]' : 'opacity-40'}`}>
                              {deployStep >= 5 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : deployStep === 4 ? <div className="w-4 h-4 rounded-full border-2 border-[#cb3550] border-t-transparent animate-spin shrink-0" /> : <div className="w-4 h-4 rounded-full border border-gray-400 shrink-0" />}
                              <span>4. Generating production token artifacts...</span>
                            </div>
                          </div>

                          {/* Completion State */}
                          {deployComplete && (
                            <div className="pt-3 border-t border-[#e6dfd1] dark:border-[#2d2822] space-y-3">
                              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-sans">
                                <strong>🎉 Deployment Successful!</strong> Color system ready for production with zero runtime dependencies.
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(generateCSSVariables(palette));
                                    playCopyChime();
                                    onCopyNotice('Copied Production CSS', 'Pasted to clipboard');
                                  }}
                                  className="flex-1 py-2 px-3 rounded-lg bg-[#cb3550] text-white text-xs font-bold hover:bg-[#b02941] transition-colors"
                                >
                                  Copy CSS Variables
                                </button>
                                <button
                                  onClick={() => setIsDeploying(false)}
                                  className="py-2 px-4 rounded-lg border border-[#ded5c2] dark:border-[#332f28] text-xs font-medium text-[#494339] dark:text-[#cfc7ba] hover:bg-black/5"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* PREVIEW 2: WEB DASHBOARD */}
                {previewMode === 'dashboard' && (
                  <div className="p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-base" style={{ color: roles.text }}>
                        Product Analytics & Color Health
                      </span>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium"
                        style={{
                          backgroundColor: roles.accent,
                          color: isLightColor(roles.accent) ? '#111' : '#fff'
                        }}
                      >
                        Active Experiment
                      </span>
                    </div>

                    {/* Stats 3 cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-xl border border-black/10 shadow-sm" style={{ backgroundColor: roles.surface }}>
                        <div className="text-[11px] font-mono" style={{ color: roles.text, opacity: 0.7 }}>
                          Contrast Ratio
                        </div>
                        <div className="text-xl font-bold font-mono mt-1" style={{ color: roles.text }}>
                          {textBgContrast}:1
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium mt-0.5">WCAG {textBgWCAG.badgeText}</div>
                      </div>
                      <div className="p-3.5 rounded-xl border border-black/10 shadow-sm" style={{ backgroundColor: roles.surface }}>
                        <div className="text-[11px] font-mono" style={{ color: roles.text, opacity: 0.7 }}>
                          Conversion Velocity
                        </div>
                        <div className="text-xl font-bold font-mono mt-1" style={{ color: roles.primary }}>
                          +28.4%
                        </div>
                        <div className="text-[10px] font-mono" style={{ color: roles.text, opacity: 0.6 }}>Primary CTA clicks</div>
                      </div>
                      <div className="p-3.5 rounded-xl border border-black/10 shadow-sm" style={{ backgroundColor: roles.surface }}>
                        <div className="text-[11px] font-mono" style={{ color: roles.text, opacity: 0.7 }}>
                          Active Users
                        </div>
                        <div className="text-xl font-bold font-mono mt-1" style={{ color: roles.accent }}>
                          14,290
                        </div>
                        <div className="text-[10px] font-mono" style={{ color: roles.text, opacity: 0.6 }}>Design token users</div>
                      </div>
                    </div>

                    {/* Mock Progress / Sparkline bars */}
                    <div className="p-4 rounded-xl border border-black/10 shadow-sm" style={{ backgroundColor: roles.surface }}>
                      <div className="flex items-center justify-between text-xs mb-2" style={{ color: roles.text }}>
                        <span className="font-semibold">Kimono Area Volume Rule (Wada Distribution)</span>
                        <span className="font-mono text-[11px]">60% / 30% / 10%</span>
                      </div>
                      <div className="w-full h-3 rounded-full overflow-hidden flex bg-black/10">
                        <div className="h-full flex-[6]" style={{ backgroundColor: roles.bg }} />
                        <div className="h-full flex-[3]" style={{ backgroundColor: roles.primary }} />
                        <div className="h-full flex-[1]" style={{ backgroundColor: roles.accent }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* PREVIEW 3: EDITORIAL POSTER */}
                {previewMode === 'editorial' && (
                  <div className="p-8 sm:p-12 relative flex flex-col justify-between min-h-[380px]">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[11px] font-mono tracking-widest uppercase" style={{ color: roles.text, opacity: 0.7 }}>
                          TOKYO • SHOWA MODERNISM • 1933
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-serif font-black tracking-tight mt-1" style={{ color: roles.text }}>
                          {palette.nameJa}
                        </h2>
                      </div>
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center font-japanese text-xl font-bold border-2"
                        style={{ borderColor: roles.primary, color: roles.primary }}
                      >
                        三造
                      </div>
                    </div>

                    <div className="my-6 max-w-md">
                      <p className="text-sm font-serif italic leading-relaxed" style={{ color: roles.text, opacity: 0.85 }}>
                        "{palette.designerTip}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-black/15 flex items-end justify-between">
                      <div className="space-y-1">
                        <div className="text-[11px] font-mono font-bold" style={{ color: roles.text }}>
                          SEIGENSHA ART ARCHIVE • № {palette.code}
                        </div>
                        <div className="flex gap-2">
                          {palette.colors.map((c, i) => (
                            <span key={i} className="text-[10px] font-mono" style={{ color: roles.text, opacity: 0.7 }}>
                              {c.nameEn} ({c.hex})
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="w-16 h-8 bg-black/15 rounded flex items-center justify-center font-mono text-[9px] tracking-tighter" style={{ color: roles.text }}>
                        |||||||||||||
                      </div>
                    </div>
                  </div>
                )}

                {/* PREVIEW 4: MOBILE APP */}
                {previewMode === 'mobile' && (
                  <div className="p-6 flex justify-center">
                    <div
                      className="w-full max-w-[280px] rounded-3xl p-5 border-4 border-black/20 shadow-2xl flex flex-col justify-between space-y-4"
                      style={{ backgroundColor: roles.surface }}
                    >
                      {/* Top mobile bar */}
                      <div className="flex justify-between items-center text-[10px] font-mono" style={{ color: roles.text, opacity: 0.6 }}>
                        <span>9:41</span>
                        <span>5G 100%</span>
                      </div>

                      {/* Product image mock */}
                      <div
                        className="w-full h-32 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden"
                        style={{ backgroundColor: roles.bg }}
                      >
                        <span className="font-serif text-3xl font-bold opacity-30" style={{ color: roles.text }}>
                          № {palette.code}
                        </span>
                        <span
                          className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold"
                          style={{
                            backgroundColor: roles.accent,
                            color: isLightColor(roles.accent) ? '#111' : '#fff'
                          }}
                        >
                          PROTOTYPE
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-sm" style={{ color: roles.text }}>
                          {palette.name}
                        </h4>
                        <p className="text-[11px] font-sans line-clamp-2" style={{ color: roles.text, opacity: 0.75 }}>
                          Authentic 1933 Taisho chord tested for mobile screens.
                        </p>
                      </div>

                      <button
                        className="w-full py-2.5 rounded-xl text-xs font-bold shadow-md transition-transform active:scale-95"
                        style={{
                          backgroundColor: roles.primary,
                          color: buttonLabelHex
                        }}
                      >
                        Save Color Set
                      </button>
                    </div>
                  </div>
                )}

                {/* PREVIEW 5: 3D SPATIAL & PACKAGING STUDIO */}
                {previewMode === 'spatial-3d' && (
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-black/10 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base" style={{ color: roles.text }}>
                            3D Spatial Model & Packaging Studio
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#cb3550] text-white">
                            WebGL 3D
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: roles.text, opacity: 0.8 }}>
                          Real-time 3D rendering of Sanzo Wada's {palette.nameJa} chord ({palette.count} colors) mapped onto parametric physical geometries.
                        </p>
                      </div>
                      <div className="text-[11px] font-mono text-right" style={{ color: roles.text, opacity: 0.7 }}>
                        № {palette.code} • {palette.name}
                      </div>
                    </div>

                    {/* Interactive Three.js Canvas */}
                    <ThreeCanvas
                      palette={palette}
                      height={370}
                      interactive={true}
                      autoRotateDefault={true}
                      initialGeometry="crystal"
                      showControls={true}
                      onSnapshotNotice={(title, sub) => onCopyNotice(title, sub)}
                    />

                    {/* Material Lore Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                      <div className="p-2.5 rounded-xl border border-black/10 text-xs" style={{ backgroundColor: roles.surface }}>
                        <span className="font-bold block text-[11px] text-[#cb3550] font-mono">1. Urushi Lacquer (漆)</span>
                        <span className="text-[11px] opacity-80" style={{ color: roles.text }}>
                          High-gloss reflective sheen with clearcoat depth; mimics traditional Japanese lacquer boxes.
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-black/10 text-xs" style={{ backgroundColor: roles.surface }}>
                        <span className="font-bold block text-[11px] text-[#cb3550] font-mono">2. Washi Paper (和紙)</span>
                        <span className="text-[11px] opacity-80" style={{ color: roles.text }}>
                          Soft matte diffuse scattering, authentic to handmade mulberry fibers and printmaking.
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-black/10 text-xs" style={{ backgroundColor: roles.surface }}>
                        <span className="font-bold block text-[11px] text-[#cb3550] font-mono">3. Gilded Makie (蒔絵)</span>
                        <span className="text-[11px] opacity-80" style={{ color: roles.text }}>
                          Brushed metallic specular reflections inspired by gold leaf sprinkled over wet lacquer.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Code Export Box */}
            <div className="pt-4 border-t border-[#eae3d5] dark:border-[#2d2924]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-xs">
                  <span className="font-mono uppercase text-[11px] tracking-wider text-[#7a7266] dark:text-[#999082] mr-2">
                    Code Export:
                  </span>
                  <button
                    onClick={() => { playGentleClick(); setExportTab('tailwind'); }}
                    className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
                      exportTab === 'tailwind' ? 'bg-[#1f1d1a] text-white dark:bg-[#eae4d9] dark:text-[#181614] font-semibold' : 'text-[#6e675b] dark:text-[#a0988a] hover:bg-black/5'
                    }`}
                  >
                    Tailwind
                  </button>
                  <button
                    onClick={() => { playGentleClick(); setExportTab('css'); }}
                    className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
                      exportTab === 'css' ? 'bg-[#1f1d1a] text-white dark:bg-[#eae4d9] dark:text-[#181614] font-semibold' : 'text-[#6e675b] dark:text-[#a0988a] hover:bg-black/5'
                    }`}
                  >
                    CSS Variables
                  </button>
                  <button
                    onClick={() => { playGentleClick(); setExportTab('scss'); }}
                    className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
                      exportTab === 'scss' ? 'bg-[#1f1d1a] text-white dark:bg-[#eae4d9] dark:text-[#181614] font-semibold' : 'text-[#6e675b] dark:text-[#a0988a] hover:bg-black/5'
                    }`}
                  >
                    SCSS
                  </button>
                  <button
                    onClick={() => { playGentleClick(); setExportTab('json'); }}
                    className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
                      exportTab === 'json' ? 'bg-[#1f1d1a] text-white dark:bg-[#eae4d9] dark:text-[#181614] font-semibold' : 'text-[#6e675b] dark:text-[#a0988a] hover:bg-black/5'
                    }`}
                  >
                    JSON
                  </button>
                </div>

                <button
                  onClick={() => {
                    let code = '';
                    if (exportTab === 'tailwind') code = generateTailwindConfig(palette);
                    else if (exportTab === 'css') code = generateCSSVariables(palette);
                    else if (exportTab === 'scss') code = generateSCSS(palette);
                    else code = generateJSONTokens(palette);
                    handleCopyCode(code, exportTab.toUpperCase());
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#cb3550] text-white text-xs font-semibold hover:bg-[#b02941] shadow-2xs transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Snippet</span>
                </button>
              </div>

              {/* Code display terminal */}
              <pre className="p-3.5 rounded-xl bg-[#1b1916] text-[#dfd9ce] font-mono text-[11px] leading-relaxed overflow-x-auto max-h-36 border border-[#2f2b25]">
                <code>
                  {exportTab === 'tailwind' && generateTailwindConfig(palette)}
                  {exportTab === 'css' && generateCSSVariables(palette)}
                  {exportTab === 'scss' && generateSCSS(palette)}
                  {exportTab === 'json' && generateJSONTokens(palette)}
                </code>
              </pre>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
