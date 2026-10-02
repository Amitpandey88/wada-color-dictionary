import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#e6dfd1] dark:border-[#2b2721] bg-[#f7f3ea] dark:bg-[#141210] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Colophon strip */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#e7e0d1] dark:border-[#28241e]">
          
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="hanko-seal w-9 h-9 text-base bg-[#cb3550]/10">
                和
              </div>
              <div>
                <h3 className="font-japanese font-bold text-lg text-[#1f1d19] dark:text-[#f8f5ee]">
                  配色事典 大正・昭和の色彩ノート
                </h3>
                <p className="text-xs text-[#7e7668] dark:text-[#9e968a] font-serif">
                  A Dictionary of Color Combinations by Sanzo Wada
                </p>
              </div>
            </div>
            <p className="text-xs text-[#5e574c] dark:text-[#b0a79a] leading-relaxed max-w-sm">
              Originally published 1933–1934 in Tokyo by Hakubisha as a 6-volume masterwork, and republished in 2010 by Seigensha Art Publishing, Kyoto. Digitally restored with exact 1933 offset CMYK formulations.
            </p>
          </div>

          {/* Designer Keyboard Shortcuts */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#797164] dark:text-[#999082]">
              Keyboard Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded border border-[#d6ccb9] dark:border-[#38332a] bg-white dark:bg-[#1f1d19] text-[10px] shadow-2xs">
                  Space
                </kbd>
                <span className="text-[#60584c] dark:text-[#a89f92]">Random Palette</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded border border-[#d6ccb9] dark:border-[#38332a] bg-white dark:bg-[#1f1d19] text-[10px] shadow-2xs">
                  /
                </kbd>
                <span className="text-[#60584c] dark:text-[#a89f92]">Focus Search</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded border border-[#d6ccb9] dark:border-[#38332a] bg-white dark:bg-[#1f1d19] text-[10px] shadow-2xs">
                  Esc
                </kbd>
                <span className="text-[#60584c] dark:text-[#a89f92]">Close Modals</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded border border-[#d6ccb9] dark:border-[#38332a] bg-white dark:bg-[#1f1d19] text-[10px] shadow-2xs">
                  C
                </kbd>
                <span className="text-[#60584c] dark:text-[#a89f92]">Quick Copy</span>
              </div>
            </div>
          </div>

          {/* Design Philosophy Note */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#797164] dark:text-[#999082]">
              Craftsmanship
            </h4>
            <p className="text-xs text-[#5e574c] dark:text-[#b0a79a] leading-relaxed">
              Designed with artisanal care: zero generic templates, authentic washi paper grain, and Wada's original geometric cruciform plates.
            </p>
          </div>

        </div>

        {/* Bottom Colophon credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#827a6d] dark:text-[#8d8578] font-mono gap-3">
          <div>
            Sanzo Wada (1883–1967) • Japan Standard Color Association
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>348 Harmonies</span>
            <span>159 Pigments</span>
            <span>WCAG 2.1 Calibrated</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
