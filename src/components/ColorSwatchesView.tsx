import React, { useState } from 'react';
import { WADA_COLORS } from '../data/colors';
import { WadaColor, ColorCategory } from '../types';
import { Search, Copy, Check, Filter, Layers, BookOpen } from 'lucide-react';
import { playCopyChime, playGentleClick } from '../utils/sound';
import { isLightColor } from '../utils/colorUtils';

interface ColorSwatchesViewProps {
  onSelectPaletteById: (id: number) => void;
  onCopyNotice: (title: string, subtitle?: string, colorHex?: string) => void;
}

export const ColorSwatchesView: React.FC<ColorSwatchesViewProps> = ({
  onSelectPaletteById,
  onCopyNotice,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ColorCategory>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories: { id: 'all' | ColorCategory; label: string; dotColor?: string }[] = [
    { id: 'all', label: 'All 159 Colors' },
    { id: 'red', label: 'Red / Vermilion (赤・赤紫)', dotColor: '#d53018' },
    { id: 'yellow', label: 'Yellow / Ocher (黄・黄赤)', dotColor: '#d9ad2a' },
    { id: 'green', label: 'Green / Bamboo (緑・黄緑)', dotColor: '#286b30' },
    { id: 'blue', label: 'Blue / Indigo (青・青緑)', dotColor: '#0058a9' },
    { id: 'purple', label: 'Purple / Violet (紫・青紫)', dotColor: '#52368a' },
    { id: 'neutral', label: 'Neutral / Sumi (白・灰・黒)', dotColor: '#28353b' },
  ];

  const filteredColors = WADA_COLORS.filter(c => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.nameEn.toLowerCase().includes(q) ||
        c.nameJa.includes(q) ||
        c.reading.includes(q) ||
        c.romaji.toLowerCase().includes(q) ||
        c.hex.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyHex = (color: WadaColor) => {
    navigator.clipboard.writeText(color.hex);
    playCopyChime();
    setCopiedId(color.id);
    onCopyNotice(`Copied ${color.hex}`, `${color.nameJa} (${color.nameEn})`, color.hex);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { playGentleClick(); setSelectedCategory(cat.id); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#1e1c19] text-white dark:bg-[#ede7dc] dark:text-[#181614] shadow-sm font-semibold'
                  : 'bg-white dark:bg-[#1f1d19] border border-[#dbd1bf] dark:border-[#332f27] text-[#554e43] dark:text-[#c4bbb0] hover:border-[#cb3550]'
              }`}
            >
              {cat.dotColor && (
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.dotColor }} />
              )}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8274]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 159 pigments..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#1f1d19] border border-[#d8cfbe] dark:border-[#38332b] text-xs text-[#1e1c19] dark:text-[#ece6dc] focus:outline-none focus:border-[#cb3550]"
          />
        </div>
      </div>

      {/* Grid of 159 Colors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {filteredColors.map((color) => {
          const isLight = isLightColor(color.hex);
          return (
            <div
              key={color.id}
              className="group bg-[#fdfcf9] dark:bg-[#1a1815] border border-[#e5ded0] dark:border-[#2f2b25] hover:border-[#cb3550] rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              {/* Swatch color block */}
              <div
                onClick={() => handleCopyHex(color)}
                className="h-28 sm:h-32 w-full relative cursor-pointer group/block transition-all flex flex-col justify-between p-2.5 stitched-border"
                style={{ backgroundColor: color.hex }}
                title="Click to copy HEX"
              >
                <span
                  className="font-japanese font-bold text-sm self-start px-1.5 py-0.5 rounded shadow-2xs"
                  style={{
                    backgroundColor: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.6)',
                    color: isLight ? '#111' : '#fff'
                  }}
                >
                  {color.nameJa}
                </span>

                <div className="self-end opacity-0 group-hover/block:opacity-100 transition-opacity">
                  <span
                    className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1"
                    style={{
                      backgroundColor: isLight ? '#1e1c19' : '#ffffff',
                      color: isLight ? '#ffffff' : '#1e1c19'
                    }}
                  >
                    {copiedId === color.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{color.hex.toUpperCase()}</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Color Details underneath */}
              <div className="p-3 space-y-1 bg-[#faf7f0] dark:bg-[#181614] border-t border-[#ede6d8] dark:border-[#2b2721] flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="font-japanese font-bold text-sm text-[#1e1c19] dark:text-[#f2ebe0]">
                      {color.nameJa}
                    </span>
                    <span className="text-[10px] font-mono text-[#8a8274] dark:text-[#91897d]">
                      {color.reading}
                    </span>
                  </div>
                  <div className="font-serif text-xs text-[#524b41] dark:text-[#c4bbb0] truncate mt-0.5">
                    {color.nameEn}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#ede6d8] dark:border-[#27241e] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#787165] dark:text-[#9a9184]">
                    <span>{color.hex.toUpperCase()}</span>
                    <span>C{color.cmyk[0]} M{color.cmyk[1]}</span>
                  </div>

                  {/* Palette appearances pill */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-[#867e71] dark:text-[#90887c]">
                      In {color.palettes.length} chords
                    </span>
                    <button
                      onClick={() => onSelectPaletteById(color.palettes[0])}
                      className="text-[10px] font-mono text-[#cb3550] hover:underline flex items-center gap-0.5"
                      title="Open first palette"
                    >
                      <span>№ {String(color.palettes[0]).padStart(3, '0')}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
