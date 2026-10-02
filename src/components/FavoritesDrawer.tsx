import React from 'react';
import { WadaPalette } from '../types';
import { X, Trash2, Download, Copy, Bookmark, ExternalLink } from 'lucide-react';
import { playCopyChime, playGentleClick } from '../utils/sound';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoritePalettes: WadaPalette[];
  onRemoveFavorite: (id: number) => void;
  onSelectPalette: (palette: WadaPalette) => void;
  onCopyNotice: (title: string, subtitle?: string, colorHex?: string) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favoritePalettes,
  onRemoveFavorite,
  onSelectPalette,
  onCopyNotice,
}) => {
  if (!isOpen) return null;

  const handleCopyAllHexes = () => {
    const list = favoritePalettes.map(p => `/* № ${p.code} ${p.name} */\n` + p.colors.map(c => `${c.nameEn}: ${c.hex}`).join(', ')).join('\n\n');
    navigator.clipboard.writeText(list);
    playCopyChime();
    onCopyNotice('Copied All Favorites', `${favoritePalettes.length} palettes copied`);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(favoritePalettes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wada-favorite-palettes.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    playCopyChime();
    onCopyNotice('Exported Favorites', 'Downloaded wada-favorite-palettes.json');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#fcfaf6] dark:bg-[#161412] border-l border-[#e4dcce] dark:border-[#2f2b25] h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-[#eae2d3] dark:border-[#2d2923] flex items-center justify-between bg-[#f8f4ec] dark:bg-[#1c1a17]">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-4 h-4 text-[#cb3550] fill-current" />
            <h3 className="font-serif font-bold text-base text-[#1e1c19] dark:text-[#f8f5ee]">
              Saved Palettes ({favoritePalettes.length})
            </h3>
          </div>

          <button
            onClick={() => { playGentleClick(); onClose(); }}
            className="p-1.5 rounded-lg text-[#6e675b] dark:text-[#a1998c] hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Strip (if has favorites) */}
        {favoritePalettes.length > 0 && (
          <div className="px-5 py-2.5 bg-[#f5efe2] dark:bg-[#1f1d19] border-b border-[#e9e0d0] dark:border-[#2c2822] flex items-center justify-between gap-2">
            <button
              onClick={handleCopyAllHexes}
              className="flex items-center gap-1 text-xs font-mono font-medium text-[#5c5549] dark:text-[#c4bbb0] hover:text-[#1c1a17]"
            >
              <Copy className="w-3 h-3" />
              <span>Copy All Hexes</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1 text-xs font-mono font-medium text-[#cb3550] hover:underline"
            >
              <Download className="w-3 h-3" />
              <span>Export JSON</span>
            </button>
          </div>
        )}

        {/* List of Favorites */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {favoritePalettes.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-[#8a8274] dark:text-[#888176]">
              <Bookmark className="w-10 h-10 stroke-1 mb-2 opacity-50" />
              <p className="font-serif text-sm font-semibold text-[#3a352c] dark:text-[#dfd7cc]">
                No Saved Palettes Yet
              </p>
              <p className="text-xs mt-1 max-w-xs font-sans">
                Click the bookmark star on any palette card to curate your personal collection for client projects.
              </p>
            </div>
          ) : (
            favoritePalettes.map((palette) => (
              <div
                key={palette.id}
                onClick={() => {
                  playGentleClick();
                  onSelectPalette(palette);
                }}
                className="group p-3.5 rounded-xl border border-[#ded5c2] dark:border-[#2f2b25] bg-white dark:bg-[#1e1c18] hover:border-[#cb3550] transition-all cursor-pointer shadow-2xs hover:shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif font-bold text-sm text-[#1e1c19] dark:text-[#f8f5ee]">
                      № {palette.code}
                    </span>
                    <span className="font-japanese font-semibold text-xs text-[#524b40] dark:text-[#c9c1b5]">
                      {palette.nameJa}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playGentleClick();
                      onRemoveFavorite(palette.id);
                    }}
                    className="p-1 rounded text-[#999] hover:text-red-600 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Swatch stripe */}
                <div className="flex h-8 rounded-lg overflow-hidden border border-black/10">
                  {palette.colors.map((c, i) => (
                    <div
                      key={i}
                      className="flex-1 h-full"
                      style={{ backgroundColor: c.hex }}
                      title={`${c.nameJa} (${c.hex})`}
                    />
                  ))}
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#787165] dark:text-[#9e968a]">
                  <span>{palette.count} Colors</span>
                  <span>{palette.colors.map(c => c.hex.toUpperCase()).join(' ')}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
