import React from 'react';
import { WadaPalette, WadaColor, ViewMode } from '../types';
import { Copy, Bookmark, Palette, Check, Info, Sparkles } from 'lucide-react';
import { playCopyChime, playGentleClick } from '../utils/sound';
import { getContrastRatio, getWCAGRating, isLightColor } from '../utils/colorUtils';

interface PaletteCardProps {
  palette: WadaPalette;
  viewMode: ViewMode;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onSelectPalette: (palette: WadaPalette) => void;
  onOpenPlayground: (palette: WadaPalette) => void;
  onOpenDetail: (palette: WadaPalette) => void;
  onCopyColor: (hex: string, name: string) => void;
  onCopyPalette: (palette: WadaPalette) => void;
}

export const PaletteCard: React.FC<PaletteCardProps> = ({
  palette,
  viewMode,
  isFavorite,
  onToggleFavorite,
  onOpenPlayground,
  onOpenDetail,
  onCopyColor,
  onCopyPalette,
}) => {
  const [copiedHex, setCopiedHex] = React.useState<string | null>(null);

  const handleCopySingle = (e: React.MouseEvent, color: WadaColor) => {
    e.stopPropagation();
    navigator.clipboard.writeText(color.hex);
    playCopyChime();
    setCopiedHex(color.hex);
    onCopyColor(color.hex, `${color.nameJa} (${color.nameEn})`);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleCopyAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    const hexList = palette.colors.map(c => c.hex).join(', ');
    navigator.clipboard.writeText(hexList);
    playCopyChime();
    onCopyPalette(palette);
  };

  // Compute best contrast ratio between any two colors in the palette
  let maxContrast = 1;
  for (let i = 0; i < palette.colors.length; i++) {
    for (let j = i + 1; j < palette.colors.length; j++) {
      const ratio = getContrastRatio(palette.colors[i].hex, palette.colors[j].hex);
      if (ratio > maxContrast) maxContrast = ratio;
    }
  }
  const wcag = getWCAGRating(maxContrast);

  // Render original 1933 Book Plate geometry
  const renderBookPlateSwatches = () => {
    if (palette.count === 2) {
      return (
        <div className="flex h-36 sm:h-40 w-full overflow-hidden rounded-md border border-black/10 shadow-inner">
          {palette.colors.map((color, idx) => (
            <div
              key={idx}
              onClick={(e) => handleCopySingle(e, color)}
              className="flex-1 h-full relative cursor-pointer group/swatch transition-transform duration-200 active:scale-[0.99] stitched-border"
              style={{ backgroundColor: color.hex }}
              title={`Click to copy ${color.hex}`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/swatch:opacity-100 bg-black/25 backdrop-blur-[1px] transition-opacity">
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded shadow ${
                  isLightColor(color.hex) ? 'text-black bg-white/90' : 'text-white bg-black/60'
                }`}>
                  {copiedHex === color.hex ? 'Copied!' : color.hex.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (palette.count === 3) {
      return (
        <div className="flex flex-col h-36 sm:h-40 w-full overflow-hidden rounded-md border border-black/10 shadow-inner">
          {palette.colors.map((color, idx) => (
            <div
              key={idx}
              onClick={(e) => handleCopySingle(e, color)}
              className="flex-1 w-full relative cursor-pointer group/swatch transition-transform duration-200 active:scale-[0.99] stitched-border"
              style={{ backgroundColor: color.hex }}
              title={`Click to copy ${color.hex}`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/swatch:opacity-100 bg-black/25 backdrop-blur-[1px] transition-opacity">
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded shadow ${
                  isLightColor(color.hex) ? 'text-black bg-white/90' : 'text-white bg-black/60'
                }`}>
                  {copiedHex === color.hex ? 'Copied!' : color.hex.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // 4-Color Wada Cruciform layout (Iconic layout from pages 152–259 of the book)
    const [c0, c1, c2, c3] = palette.colors;
    return (
      <div className="relative h-36 sm:h-40 w-full overflow-hidden rounded-md border border-black/10 bg-[#eae5d8] dark:bg-[#1a1815] flex items-center justify-center p-3 shadow-inner">
        {/* Cruciform Composition */}
        <div className="relative w-full h-full max-w-[240px] flex items-center justify-center">
          {/* Top vertical bar */}
          <div
            onClick={(e) => handleCopySingle(e, c0)}
            className="absolute top-0 w-24 h-14 rounded-sm cursor-pointer z-10 hover:brightness-105 transition-all shadow-sm stitched-border"
            style={{ backgroundColor: c0.hex }}
            title={`Click to copy ${c0.nameEn}: ${c0.hex}`}
          />
          {/* Left horizontal wing */}
          <div
            onClick={(e) => handleCopySingle(e, c1)}
            className="absolute left-0 w-28 h-14 rounded-sm cursor-pointer z-20 hover:brightness-105 transition-all shadow-sm stitched-border"
            style={{ backgroundColor: c1.hex }}
            title={`Click to copy ${c1.nameEn}: ${c1.hex}`}
          />
          {/* Right horizontal wing */}
          <div
            onClick={(e) => handleCopySingle(e, c2)}
            className="absolute right-0 w-28 h-14 rounded-sm cursor-pointer z-20 hover:brightness-105 transition-all shadow-sm stitched-border"
            style={{ backgroundColor: c2.hex }}
            title={`Click to copy ${c2.nameEn}: ${c2.hex}`}
          />
          {/* Bottom vertical bar */}
          <div
            onClick={(e) => handleCopySingle(e, c3)}
            className="absolute bottom-0 w-24 h-14 rounded-sm cursor-pointer z-10 hover:brightness-105 transition-all shadow-sm stitched-border"
            style={{ backgroundColor: c3.hex }}
            title={`Click to copy ${c3.nameEn}: ${c3.hex}`}
          />
        </div>
      </div>
    );
  };

  // Modern Studio View layout
  const renderModernSwatches = () => (
    <div className="flex h-24 w-full overflow-hidden rounded-md border border-black/10 shadow-sm">
      {palette.colors.map((color, idx) => (
        <div
          key={idx}
          onClick={(e) => handleCopySingle(e, color)}
          className="flex-1 h-full relative cursor-pointer group/swatch transition-all duration-150 hover:flex-[1.4]"
          style={{ backgroundColor: color.hex }}
        >
          <div className="absolute inset-x-0 bottom-0 py-1 px-1.5 flex flex-col items-center justify-end bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-80 group-hover/swatch:opacity-100 transition-opacity">
            <span className="text-[10px] font-mono font-bold text-white tracking-wider truncate">
              {color.hex.toUpperCase()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  // Compact Grid Swatch
  const renderCompactSwatches = () => (
    <div className="flex h-16 w-full overflow-hidden rounded border border-black/10">
      {palette.colors.map((color, idx) => (
        <div
          key={idx}
          onClick={(e) => handleCopySingle(e, color)}
          className="flex-1 h-full cursor-pointer hover:opacity-90 transition-opacity"
          style={{ backgroundColor: color.hex }}
          title={`${color.nameJa} (${color.nameEn}) - ${color.hex}`}
        />
      ))}
    </div>
  );

  return (
    <div
      onClick={() => onOpenDetail(palette)}
      className="group relative bg-[#fdfcf9] dark:bg-[#1a1815] border border-[#e8e1d2] dark:border-[#2e2a24] hover:border-[#cb3550]/60 dark:hover:border-[#cb3550]/60 rounded-xl p-4 sm:p-5 shadow-swatch hover:shadow-plate transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Header Strip: Plate Number, Type Badge, Star */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {/* Book Plate Number */}
            <span className="font-serif font-bold text-base sm:text-lg text-[#1f1d1a] dark:text-[#f8f5ee] tracking-tight">
              № {palette.code}
            </span>
            {palette.featured && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium font-sans px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                <Sparkles className="w-2.5 h-2.5 fill-current" />
                <span>Designer Pick</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Contrast Ratio Pill */}
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${wcag.badgeColor}`} title={`Max contrast ratio: ${wcag.ratio}:1`}>
              {wcag.badgeText} ({wcag.ratio}:1)
            </span>

            {/* Bookmark Favorite */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playGentleClick();
                onToggleFavorite(palette.id);
              }}
              className="p-1.5 rounded-lg text-[#847c70] dark:text-[#9e968a] hover:text-[#cb3550] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-[#cb3550] text-[#cb3550]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Swatch Visualization Area */}
        <div className="mb-4">
          {viewMode === 'book' && renderBookPlateSwatches()}
          {viewMode === 'modern' && renderModernSwatches()}
          {viewMode === 'compact' && renderCompactSwatches()}
        </div>

        {/* Color Labels (Japanese Kanji, Reading, English Name, CMYK) */}
        <div className="grid grid-cols-2 gap-2 text-xs border-t border-[#ede7da] dark:border-[#2a2621] pt-3">
          {palette.colors.map((color, idx) => (
            <div
              key={idx}
              onClick={(e) => handleCopySingle(e, color)}
              className="group/item flex items-start gap-1.5 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div
                className="w-3 h-3 rounded-full mt-0.5 shrink-0 border border-black/15 shadow-2xs"
                style={{ backgroundColor: color.hex }}
              />
              <div className="min-w-0">
                <div className="flex items-baseline gap-1 truncate">
                  <span className="font-japanese font-semibold text-[#1e1c19] dark:text-[#eee7dc] text-[13px]">
                    {color.nameJa}
                  </span>
                  <span className="font-sans text-[11px] text-[#787165] dark:text-[#9e9689] truncate">
                    {color.nameEn}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-[#938a7c] dark:text-[#888174] flex items-center gap-1.5 mt-0.5">
                  <span>{color.hex.toUpperCase()}</span>
                  <span className="text-[9px] opacity-75">C{color.cmyk[0]}M{color.cmyk[1]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card Footer: Action Strip */}
      <div className="mt-4 pt-3 border-t border-[#ede7da] dark:border-[#2a2621] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium font-mono text-[#544d42] dark:text-[#c4bbb0] hover:text-[#1e1c19] dark:hover:text-white bg-[#f4eee2] dark:bg-[#25221d] hover:bg-[#eae3d4] dark:hover:bg-[#2f2b24] transition-colors"
            title="Copy all HEX codes"
          >
            <Copy className="w-3 h-3" />
            <span>Copy HEX</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              playGentleClick();
              onOpenDetail(palette);
            }}
            className="p-1 rounded-md text-[#7c7568] dark:text-[#999184] hover:text-[#1e1c19] dark:hover:text-white transition-colors"
            title="Palette details & color lore"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live UI Test Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playGentleClick();
            onOpenPlayground(palette);
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#cb3550] dark:text-[#f76a82] bg-[#cb3550]/10 hover:bg-[#cb3550]/15 dark:bg-[#cb3550]/20 dark:hover:bg-[#cb3550]/30 transition-colors"
        >
          <Palette className="w-3 h-3" />
          <span>Test in UI</span>
        </button>
      </div>
    </div>
  );
};
