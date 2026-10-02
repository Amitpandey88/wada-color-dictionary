# 配色事典 • A Dictionary of Color Combinations (1933–1934)
### Digital Archive & Interactive Design Studio for Web & UI Designers
*Based on the seminal 6-volume masterwork by Sanzo Wada (和田三造)*

---

## 🎨 Overview

In 1933, avant-garde painter, color theorist, and later Academy Award-winning costume designer **Sanzo Wada** published *Haishoku Soukan* (『配色總鑑』), later republished as *A Dictionary of Color Combinations* (『配色事典』). 

Unlike digital color generators that assemble mathematically arbitrary RGB hexes, Sanzo Wada cataloged **159 traditional Japanese mineral pigments and botanical dyes**, organizing them into **348 harmonious chords**:
- **120 Two-Color Chords** (№ 001 – 120)
- **120 Three-Color Triads** (№ 121 – 240)
- **108 Four-Color Cruciforms** (№ 241 – 348)

This project digitizes and elevates the entire dictionary into an **artisan, human-crafted design tool for modern web designers, brand identity creators, and digital product teams**, free from generic AI templates.

---

## 🚀 Key Features for Web & Digital Designers

1. **Curated for Web UI & Branding**:
   - Quick filters for the palettes most frequently utilized by professional designers (e.g. *№ 006 Deep Indigo & Grenadine Pink*, *№ 001 English Red & Cerulean Blue*, *№ 027 Corinthian Pink & Slate*, *№ 060 Tyrian Blue & Pale Lemon*, *№ 139 Product Blue Triad*, *№ 241 The Cruciform Masterwork*).
   - Filter by number of colors (2, 3, or 4), dominant hue (Red, Yellow, Green, Blue, Purple, Neutral), or aesthetic vibe (High Contrast, Minimalist, Earthy Wabi-Sabi, Luxury Dark, Soft Pastel).

2. **Interactive UI Component Playground (Live Studio)**:
   - Preview ANY palette instantly across 4 realistic, production-grade digital mockups:
     - **Modern SaaS Landing Page** (Hero headline, navigation, CTA buttons, metrics card, tags).
     - **Application Dashboard** (KPI counters, trend indicators, progress bar, area volume preview).
     - **High-Fashion Editorial Poster** (Bilingual Japanese/English typography, barcode, artistic grid).
     - **Mobile App Interface** (Smartphone frame, product card, status bar, interactive action chips).
   - **Interactive Color Role Swapper**: Assign which palette color acts as Background, Surface Card, Heading Text, Primary CTA button, or Accent.
   - **"Auto-Balance for WCAG" Button**: Automatically assigns roles to achieve maximum WCAG contrast.

3. **WCAG 2.1 Accessibility & Contrast Matrix**:
   - Computes live contrast ratios for every color pair in the palette.
   - Badges: `AAA Pass` (≥ 7:1), `AA Pass` (≥ 4.5:1), `AA Large` (≥ 3:1).

4. **1933 Book Plate Fidelity**:
   - **Book Plate View**: Renders combinations using Wada's authentic layout formats:
     - *2-Color*: Side-by-side rectangular cloth blocks with subtle stitching borders.
     - *3-Color*: Proportional stacked ribbons.
     - *4-Color*: Wada's iconic geometric cruciform layout (central vertical spine flanked by horizontal wings).
   - **Modern Studio View** and **Compact Grid View** for high-density scanning.

5. **Complete 159 Traditional Japanese Swatches Encyclopedia**:
   - Dedicated browser for all 159 individual traditional colors.
   - Detailed inspector modal with Kanji, Furigana reading, Romaji, historical English name, cultural background, 1933 CMYK recipe, RGB, HEX, HSL, and cross-references to every palette containing that color.

6. **Instant Developer & Designer Exports**:
   - 1-Click Copy HEX (with pleasant audio chime and visual swatch toast).
   - Tailwind CSS Config (`tailwind.config.js`).
   - CSS Custom Properties (`:root { ... }`).
   - SCSS Variables.
   - Design Tokens JSON.
   - High-Resolution SVG Swatch Cards (ready to import into Figma or Adobe Illustrator).

7. **Sanzo Wada Color Theory & History ("概説と其活用")**:
   - Dedicated interactive essay on the **Volume & Area Rule** (the historical 60-30-10 rule derived from kimono layering: kimono body vs obi sash vs inner collar).
   - Modulation (同色調) vs Contrast (異色調).
   - Biography of Sanzo Wada (1954 Oscar winner for *Gate of Hell*).

---

## 🛠️ Tech Stack & Architecture

- **React 19** + **TypeScript**
- **Vite 6** (sub-second HMR and production build)
- **Tailwind CSS** (custom washi paper design system, warm typography, dark mode)
- **Lucide Icons**
- **Web Audio API Synthesizer** (tactile auditory micro-feedback without external audio assets)

---

## 🏃 Getting Started

```bash
# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.
