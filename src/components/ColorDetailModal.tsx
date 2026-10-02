import React from 'react';
import { WadaPalette, WadaColor } from '../types';
import { X, Copy, Check, ExternalLink, Sparkles, BookOpen, Layers, ShieldCheck, Share2 } from 'lucide-react';
import { playCopyChime, playGentleClick } from '../utils/sound';
import { getContrastRatio, getWCAGRating, isLightColor, hexToHsl } from '../utils/colorUtils';

interface ColorDetailModalProps {
  palette: WadaPalette | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectPaletteById: (id: number) => void;
  onCopyNotice: (title: string, subtitle?: string, colorHex?: string) => void;
}

export const ColorDetailModal: React.FC<ColorDetailModalProps> = ({
  palette,
  isOpen,
  onClose,
  onSelectPaletteById,
  onCopyNotice
}) => {
  if (!isOpen || !palette) return null;

  const [activeColorIndex, setActiveColorIndex] = React.useState(0);
  const activeColor = palette.colors[activeColorIndex] || palette.colors[0];

  const handleCopyValue = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    playCopyChime();
    onCopyNotice(`Copied ${label}`, val, activeColor.hex);
  };

  const hsl = hexToHsl(activeColor.hex);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#fcfaf6] dark:bg-[#161412] border border-[#e4dcce] dark:border-[#2f2b25] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e9e2d3] dark:border-[#2c2822] bg-[#f8f4ec] dark:bg-[#1c1a17]">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-xl text-[#1f1d19] dark:text-[#f7f4ee]">
              № {palette.code}
            </span>
            <span className="font-japanese font-bold text-lg text-[#3d372e] dark:text-[#dfd7cc]">
              {palette.nameJa}
            </span>
            <span className="text-xs text-[#7e7668] dark:text-[#9c9486] font-sans">
              • {palette.name}
            </span>
          </div>

          <button
            onClick={() => { playGentleClick(); onClose(); }}
            className="p-1.5 rounded-lg text-[#6e675b] dark:text-[#a1998c] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Swatch Selector Row */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#797265] dark:text-[#9b9386] mb-2 flex items-center justify-between">
              <span>Select Swatch to Inspect:</span>
              <span>{activeColorIndex + 1} of {palette.colors.length}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {palette.colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => { playGentleClick(); setActiveColorIndex(idx); }}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                    activeColorIndex === idx
                      ? 'border-[#cb3550] bg-white dark:bg-[#221f1a] shadow-sm ring-1 ring-[#cb3550]'
                      : 'border-[#dfd6c5] dark:border-[#332f28] bg-[#f9f5ed] dark:bg-[#1b1915] hover:bg-white'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-md border border-black/15 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="min-w-0">
                    <div className="font-japanese font-semibold text-xs text-[#1e1c19] dark:text-[#ede6dc] truncate">
                      {color.nameJa}
                    </div>
                    <div className="font-mono text-[10px] text-[#7d7568] dark:text-[#9c9386] uppercase truncate">
                      {color.hex}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Color Hero Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl border border-[#ded5c2] dark:border-[#2f2b25] bg-white dark:bg-[#1e1c18] shadow-sm">
            
            {/* Color preview box */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div
                className="w-full h-44 rounded-xl border border-black/15 shadow-inner relative flex flex-col justify-between p-4 stitched-border"
                style={{ backgroundColor: activeColor.hex }}
              >
                <span
                  className="font-japanese font-bold text-2xl self-start px-2 py-0.5 rounded shadow-2xs"
                  style={{
                    backgroundColor: isLightColor(activeColor.hex) ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.6)',
                    color: isLightColor(activeColor.hex) ? '#111' : '#fff'
                  }}
                >
                  {activeColor.nameJa}
                </span>

                <button
                  onClick={() => handleCopyValue(activeColor.hex, 'HEX')}
                  className="self-end flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
                  style={{
                    backgroundColor: isLightColor(activeColor.hex) ? '#1e1c19' : '#ffffff',
                    color: isLightColor(activeColor.hex) ? '#ffffff' : '#1e1c19'
                  }}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{activeColor.hex.toUpperCase()}</span>
                </button>
              </div>

              <div className="mt-3 text-center sm:text-left">
                <div className="font-japanese text-sm text-[#7e7668] dark:text-[#a09789]">
                  {activeColor.reading} • {activeColor.romaji}
                </div>
                <div className="font-serif font-bold text-lg text-[#1f1d19] dark:text-[#f8f5ee]">
                  {activeColor.nameEn}
                </div>
              </div>
            </div>

            {/* Technical values & Cultural Lore */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              
              {/* Cultural lore */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#797164] dark:text-[#999082] mb-1.5 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#cb3550]" />
                  <span>Cultural Lore & Meaning</span>
                </h4>
                <p className="text-sm text-[#4d473d] dark:text-[#d3cbbe] leading-relaxed font-sans bg-[#faf6ed] dark:bg-[#161411] p-3 rounded-xl border border-[#ece4d5] dark:border-[#2d2923]">
                  {activeColor.meaning}
                </p>
              </div>

              {/* Exact Formula Coordinates */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#ede6d8] dark:border-[#2b2721]">
                <div
                  onClick={() => handleCopyValue(activeColor.hex, 'HEX')}
                  className="p-2 rounded-lg bg-[#faf6ee] dark:bg-[#161411] border border-[#ded5c4] dark:border-[#2d2822] cursor-pointer hover:border-[#cb3550] transition-colors"
                >
                  <div className="text-[10px] font-mono text-[#7e7668] dark:text-[#999184]">HEX</div>
                  <div className="font-mono text-xs font-bold text-[#1f1d19] dark:text-[#ece5da] mt-0.5">{activeColor.hex.toUpperCase()}</div>
                </div>

                <div
                  onClick={() => handleCopyValue(`cmyk(${activeColor.cmyk.join(', ')})`, 'CMYK')}
                  className="p-2 rounded-lg bg-[#faf6ee] dark:bg-[#161411] border border-[#ded5c4] dark:border-[#2d2822] cursor-pointer hover:border-[#cb3550] transition-colors"
                  title="Sanzo Wada's 1933 offset print recipe"
                >
                  <div className="text-[10px] font-mono text-[#7e7668] dark:text-[#999184]">1933 CMYK</div>
                  <div className="font-mono text-xs font-bold text-[#1f1d19] dark:text-[#ece5da] mt-0.5">
                    {activeColor.cmyk[0]}/{activeColor.cmyk[1]}/{activeColor.cmyk[2]}/{activeColor.cmyk[3]}
                  </div>
                </div>

                <div
                  onClick={() => handleCopyValue(`rgb(${activeColor.rgb.join(', ')})`, 'RGB')}
                  className="p-2 rounded-lg bg-[#faf6ee] dark:bg-[#161411] border border-[#ded5c4] dark:border-[#2d2822] cursor-pointer hover:border-[#cb3550] transition-colors"
                >
                  <div className="text-[10px] font-mono text-[#7e7668] dark:text-[#999184]">RGB</div>
                  <div className="font-mono text-xs font-bold text-[#1f1d19] dark:text-[#ece5da] mt-0.5">
                    {activeColor.rgb.join(', ')}
                  </div>
                </div>

                <div
                  onClick={() => handleCopyValue(`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`, 'HSL')}
                  className="p-2 rounded-lg bg-[#faf6ee] dark:bg-[#161411] border border-[#ded5c4] dark:border-[#2d2822] cursor-pointer hover:border-[#cb3550] transition-colors"
                >
                  <div className="text-[10px] font-mono text-[#7e7668] dark:text-[#999184]">HSL</div>
                  <div className="font-mono text-xs font-bold text-[#1f1d19] dark:text-[#ece5da] mt-0.5">
                    {hsl[0]}° {hsl[1]}% {hsl[2]}%
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* WCAG Contrast Matrix for this Palette */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#797164] dark:text-[#999082] mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Accessibility & WCAG 2.1 Contrast Matrix</span>
            </h4>
            <div className="overflow-x-auto rounded-xl border border-[#ded5c2] dark:border-[#2f2b25] bg-white dark:bg-[#1b1915]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f7f2e7] dark:bg-[#23201b] border-b border-[#ded5c2] dark:border-[#2f2b25] text-[#6d665a] dark:text-[#aba295] font-mono text-[11px]">
                  <tr>
                    <th className="p-3">Background \ Text</th>
                    {palette.colors.map((c, i) => (
                      <th key={i} className="p-3 text-center">
                        <span className="font-japanese font-semibold">{c.nameJa}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ede6d8] dark:divide-[#26231e]">
                  {palette.colors.map((bgCol, rowIdx) => (
                    <tr key={rowIdx}>
                      <td className="p-3 font-medium flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: bgCol.hex }} />
                        <span className="font-japanese font-semibold">{bgCol.nameJa}</span>
                      </td>
                      {palette.colors.map((txtCol, colIdx) => {
                        if (rowIdx === colIdx) {
                          return (
                            <td key={colIdx} className="p-3 text-center text-[#999] dark:text-[#555] font-mono text-[10px]">
                              —
                            </td>
                          );
                        }
                        const ratio = getContrastRatio(bgCol.hex, txtCol.hex);
                        const wcag = getWCAGRating(ratio);
                        return (
                          <td key={colIdx} className="p-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[10px] ${wcag.badgeColor}`}>
                              {ratio}:1 ({wcag.badgeText})
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Related Palettes in Book that feature this color */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#797164] dark:text-[#999082] mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#cb3550]" />
              <span>Other Combinations Featuring {activeColor.nameJa} ({activeColor.palettes.length} total)</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeColor.palettes.map((pid) => (
                <button
                  key={pid}
                  onClick={() => {
                    playGentleClick();
                    onSelectPaletteById(pid);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
                    pid === palette.id
                      ? 'border-[#cb3550] bg-[#cb3550] text-white shadow-sm'
                      : 'border-[#ded5c2] dark:border-[#332f28] bg-white dark:bg-[#1f1d19] text-[#4d463d] dark:text-[#c4bbb0] hover:border-[#cb3550]'
                  }`}
                >
                  № {String(pid).padStart(3, '0')}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
