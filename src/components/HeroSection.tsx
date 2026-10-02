import React from 'react';
import { Search, Sparkles, Star, Layers, Palette, Eye, ArrowRight } from 'lucide-react';
import { playGentleClick } from '../utils/sound';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activePreset: string;
  onSelectPreset: (preset: string) => void;
  onOpenPlayground: () => void;
  totalPalettes: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  activePreset,
  onSelectPreset,
  onOpenPlayground,
  totalPalettes
}) => {
  const presets = [
    { id: 'featured', label: '⭐ Designer Favorites', desc: 'Most used for modern web UI & branding' },
    { id: 'high-contrast', label: '⚡ High Contrast', desc: 'Accessible pairs with strong visual hierarchy' },
    { id: 'two-color', label: '2-Color Chords', desc: 'Minimal duotones & clean hero sections' },
    { id: 'three-color', label: '3-Color Triads', desc: 'Balanced background, card, and action tones' },
    { id: 'four-color', label: '4-Color Cruciforms', desc: 'Full application design systems' },
    { id: 'minimalist', label: '🪨 Minimal & Earthy', desc: 'Quiet washi, tea, and slate harmonies' },
    { id: 'luxury-dark', label: '🌙 Midnight Dark UI', desc: 'Deep sumi indigo with glowing accents' },
    { id: 'soft-pastel', label: '🌸 Soft Editorial', desc: 'Blush, lavender, and celestial tints' },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-10 border-b border-[#e7e1d3] dark:border-[#2b2722] bg-gradient-to-b from-[#fbf8f2] via-[#f7f3ea] to-[#f4efe4] dark:from-[#171513] dark:via-[#141210] dark:to-[#11100e]">
      
      {/* Decorative vertical Japanese calligraphy watermark */}
      <div className="absolute right-8 top-10 pointer-events-none select-none opacity-[0.06] dark:opacity-[0.04] text-right">
        <div className="vertical-text font-japanese text-7xl font-bold tracking-widest text-[#2c2825] dark:text-[#f8f5ee]">
          配色事典大正昭和色彩ノート
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl">
          
          {/* Metadata Tagline */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#eee7d8] dark:bg-[#25221d] border border-[#ded5c2] dark:border-[#38332b] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#cb3550] animate-pulse"></span>
            <span className="text-xs font-mono font-medium text-[#6e675c] dark:text-[#b4aba0]">
              Sanzo Wada (和田三造) • 1933–1934 Haishoku Soukan
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1b1916] dark:text-[#faf6ee] leading-[1.18] tracking-tight">
            Traditional Japanese Colors <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#cb3550] dark:text-[#f3637b]">for Modern Web & Digital Design</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#615a4f] dark:text-[#ada395] leading-relaxed max-w-2xl font-sans">
            In 1933, avant-garde artist and Oscar-winning costume designer <strong className="font-semibold text-[#1e1c19] dark:text-[#f1ebe0]">Sanzo Wada</strong> published his seminal 6-volume color dictionary. Unlike algorithmic palettes, these 348 chords were created using traditional mineral pigments, botanical dyes, and the intuitive Japanese concept of <span className="italic">Ma</span> (negative space) and area hierarchy.
          </p>

          {/* Live Action Strip: Search + Playground Button */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8376] dark:text-[#787166]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by color, kanji (e.g. 洗朱), hex (#), or mood..."
                className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-white dark:bg-[#1f1d19] border border-[#d8cfbe] dark:border-[#3a352c] focus:outline-none focus:border-[#cb3550] dark:focus:border-[#cb3550] text-sm text-[#1e1c19] dark:text-[#ece6dc] placeholder:text-[#9c9385] dark:placeholder:text-[#6a645b] shadow-sm transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-[#d6ccb9] dark:border-[#3c372e] bg-[#f7f3ea] dark:bg-[#282520] text-[10px] font-mono text-[#8b8275] dark:text-[#888074]">
                /
              </span>
            </div>

            {/* Test in UI Playground Button */}
            <button
              onClick={() => {
                playGentleClick();
                onOpenPlayground();
              }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#201d1a] dark:bg-[#f6f2e9] text-[#fdfaf5] dark:text-[#181614] text-xs font-semibold hover:bg-[#342f2a] dark:hover:bg-white shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <Palette className="w-4 h-4 text-[#cb3550]" />
              <span>Interactive UI Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Presets for Web Designers */}
          <div className="mt-5">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#8b8376] dark:text-[#847c70] mb-2 flex items-center gap-1.5">
              <span>Curated for Designers:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <button
                onClick={() => {
                  playGentleClick();
                  onSelectPreset('all');
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activePreset === 'all'
                    ? 'bg-[#cb3550] text-white shadow-sm'
                    : 'bg-white/80 dark:bg-[#1f1d19]/80 border border-[#dbd2c2] dark:border-[#38332b] text-[#554e44] dark:text-[#c4bbb0] hover:border-[#cb3550]'
                }`}
              >
                All 348
              </button>
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    playGentleClick();
                    onSelectPreset(preset.id);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    activePreset === preset.id
                      ? 'bg-[#cb3550] text-white shadow-sm'
                      : 'bg-white/80 dark:bg-[#1f1d19]/80 border border-[#dbd2c2] dark:border-[#38332b] text-[#554e44] dark:text-[#c4bbb0] hover:border-[#cb3550]'
                  }`}
                  title={preset.desc}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
