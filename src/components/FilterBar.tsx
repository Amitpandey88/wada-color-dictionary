import React from 'react';
import { ColorCategory, PaletteType, HarmonyType } from '../types';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { playGentleClick } from '../utils/sound';

interface FilterBarProps {
  countFilter: 'all' | 2 | 3 | 4;
  onCountFilterChange: (count: 'all' | 2 | 3 | 4) => void;
  categoryFilter: 'all' | ColorCategory;
  onCategoryFilterChange: (cat: 'all' | ColorCategory) => void;
  tagFilter: string;
  onTagFilterChange: (tag: string) => void;
  totalFiltered: number;
  totalAll: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  countFilter,
  onCountFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  tagFilter,
  onTagFilterChange,
  totalFiltered,
  totalAll,
  onResetFilters,
  hasActiveFilters,
}) => {
  const categories: { id: 'all' | ColorCategory; label: string; dotColor?: string }[] = [
    { id: 'all', label: 'All Hues' },
    { id: 'red', label: 'Red / Vermilion', dotColor: '#d53018' },
    { id: 'yellow', label: 'Yellow / Ocher', dotColor: '#d9ad2a' },
    { id: 'green', label: 'Green / Bamboo', dotColor: '#286b30' },
    { id: 'blue', label: 'Blue / Indigo', dotColor: '#0058a9' },
    { id: 'purple', label: 'Purple / Violet', dotColor: '#52368a' },
    { id: 'neutral', label: 'Neutral / Sumi', dotColor: '#28353b' },
  ];

  const tags = [
    'Web UI',
    'High Contrast',
    'Designer Favorite',
    'Minimalist',
    'Earthy Wabi-Sabi',
    'Luxury Dark',
    'Soft Pastel',
    'Warm Accent'
  ];

  return (
    <div className="bg-[#faf7f0] dark:bg-[#181614] border-b border-[#e9e2d3] dark:border-[#2b2722] py-4 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* Row 1: Color Count & Hue Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Palette Count Segmented Control */}
          <div className="flex items-center gap-1 bg-[#efe8db] dark:bg-[#23201b] p-1 rounded-xl border border-[#ded5c2] dark:border-[#332f28]">
            <span className="text-[11px] font-mono text-[#787165] dark:text-[#978e82] px-2 font-medium hidden sm:inline">
              Chords:
            </span>
            <button
              onClick={() => { playGentleClick(); onCountFilterChange('all'); }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                countFilter === 'all'
                  ? 'bg-white dark:bg-[#343029] text-[#1c1a17] dark:text-[#f8f5ee] shadow-sm font-semibold'
                  : 'text-[#6e675b] dark:text-[#a1998c] hover:text-[#1c1a17]'
              }`}
            >
              All (348)
            </button>
            <button
              onClick={() => { playGentleClick(); onCountFilterChange(2); }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                countFilter === 2
                  ? 'bg-white dark:bg-[#343029] text-[#1c1a17] dark:text-[#f8f5ee] shadow-sm font-semibold'
                  : 'text-[#6e675b] dark:text-[#a1998c] hover:text-[#1c1a17]'
              }`}
            >
              2 Colors (120)
            </button>
            <button
              onClick={() => { playGentleClick(); onCountFilterChange(3); }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                countFilter === 3
                  ? 'bg-white dark:bg-[#343029] text-[#1c1a17] dark:text-[#f8f5ee] shadow-sm font-semibold'
                  : 'text-[#6e675b] dark:text-[#a1998c] hover:text-[#1c1a17]'
              }`}
            >
              3 Colors (120)
            </button>
            <button
              onClick={() => { playGentleClick(); onCountFilterChange(4); }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                countFilter === 4
                  ? 'bg-white dark:bg-[#343029] text-[#1c1a17] dark:text-[#f8f5ee] shadow-sm font-semibold'
                  : 'text-[#6e675b] dark:text-[#a1998c] hover:text-[#1c1a17]'
              }`}
            >
              4 Colors (108)
            </button>
          </div>

          {/* Result Count and Reset Button */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs font-mono text-[#787165] dark:text-[#9e968a]">
              Showing <strong className="text-[#1c1a17] dark:text-[#f5f2eb]">{totalFiltered}</strong> of {totalAll}
            </span>
            {hasActiveFilters && (
              <button
                onClick={() => { playGentleClick(); onResetFilters(); }}
                className="flex items-center gap-1 text-xs text-[#cb3550] hover:text-[#a9223a] font-medium transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Hue Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#8c8477] dark:text-[#837b70] shrink-0 mr-1 hidden sm:inline">
            Dominant Hue:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playGentleClick();
                onCategoryFilterChange(cat.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-all ${
                categoryFilter === cat.id
                  ? 'bg-[#1e1c19] text-white dark:bg-[#ece6db] dark:text-[#181614] shadow-sm font-semibold'
                  : 'bg-white/80 dark:bg-[#201d19]/80 border border-[#dbd2c1] dark:border-[#342f27] text-[#554e43] dark:text-[#c4bbb0] hover:border-[#1e1c19] dark:hover:border-[#ece6db]'
              }`}
            >
              {cat.dotColor && (
                <span
                  className="w-2 h-2 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: cat.dotColor }}
                />
              )}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Row 3: Design Tag Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-0.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#8c8477] dark:text-[#837b70] shrink-0 mr-1 hidden sm:inline">
            Style / Tag:
          </span>
          <button
            onClick={() => { playGentleClick(); onTagFilterChange('all'); }}
            className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-all ${
              tagFilter === 'all'
                ? 'bg-[#cb3550] text-white font-medium'
                : 'bg-[#ede6d8] dark:bg-[#25221d] text-[#635c51] dark:text-[#a89f92] hover:bg-[#e4dccb]'
            }`}
          >
            All Tags
          </button>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => {
                playGentleClick();
                onTagFilterChange(tagFilter === t ? 'all' : t);
              }}
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono shrink-0 transition-all ${
                tagFilter === t
                  ? 'bg-[#cb3550] text-white font-medium'
                  : 'bg-[#ede6d8] dark:bg-[#25221d] text-[#635c51] dark:text-[#a89f92] hover:bg-[#e4dccb] dark:hover:bg-[#322d26]'
              }`}
            >
              #{t}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
