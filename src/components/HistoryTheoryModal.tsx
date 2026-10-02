import React from 'react';
import { X, Award, BookOpen, Layers, Sparkles, Feather } from 'lucide-react';
import { playGentleClick } from '../utils/sound';

interface HistoryTheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryTheoryModal: React.FC<HistoryTheoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#fcfaf6] dark:bg-[#161412] border border-[#e4dcce] dark:border-[#2f2b25] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e9e2d3] dark:border-[#2c2822] bg-[#f8f4ec] dark:bg-[#1c1a17]">
          <div className="flex items-center gap-3">
            <div className="hanko-seal w-8 h-8 text-sm bg-[#cb3550]/10">
              和
            </div>
            <div>
              <h3 className="font-japanese font-bold text-lg text-[#1e1c19] dark:text-[#f8f5ee]">
                和田三造と『配色事典』の色彩理論
              </h3>
              <p className="text-xs text-[#7e7668] dark:text-[#9c9486] font-sans">
                Sanzo Wada (1883–1967) • Theory & Historical Background
              </p>
            </div>
          </div>

          <button
            onClick={() => { playGentleClick(); onClose(); }}
            className="p-1.5 rounded-lg text-[#6e675b] dark:text-[#a1998c] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-sans text-sm text-[#4d473d] dark:text-[#d3cbbe] leading-relaxed">
          
          {/* Biography Highlight */}
          <div className="p-5 rounded-2xl border border-[#ded5c2] dark:border-[#2e2a24] bg-white dark:bg-[#1c1a17] shadow-sm flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-14 h-14 rounded-2xl bg-[#cb3550]/10 text-[#cb3550] flex items-center justify-center shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-base text-[#1e1c19] dark:text-[#f8f5ee]">
                  The Pioneer Who Modernized Japanese Chromatics
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                  Academy Award Winner 1954
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#5d564a] dark:text-[#b3aba0] leading-relaxed">
                Born in Hyogo in 1883, <strong>Sanzo Wada</strong> was a Western-style painter, designer, and visionary color theorist. In 1954, Wada won the <strong>Academy Award for Best Costume Design</strong> for the classic film <em>Gate of Hell (地獄門)</em>, which also won the Grand Prix at Cannes. In 1927 he founded the Japan Standard Color Association, dedicating decades to standardizing traditional Japanese mineral pigments.
              </p>
            </div>
          </div>

          {/* Core Principle 1: The Kimono Area & Volume Rule */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-lg text-[#1e1c19] dark:text-[#f8f5ee] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#cb3550]" />
              <span>1. The Volume of Color (彩色の量と配色)</span>
            </h4>
            <p>
              In Chapter 3 of <em>Haishoku Soukan</em>, Wada emphasizes that colors in nature and clothing are never used in equal proportions:
            </p>
            <blockquote className="p-4 rounded-xl bg-[#faf6ed] dark:bg-[#1f1d19] border-l-4 border-[#cb3550] italic font-serif text-sm text-[#2f2b26] dark:text-[#e4ded4]">
              "In actual practice, using equal amounts and shapes of color is extremely rare, and is rather something that should be avoided. In a woman's kimono, the inner collar (半襟) is a minute quantity; the kimono robe and haori coat occupy the vast majority, and the obi sash is the bridge between them. Color changes radically depending on the surface area it covers."
            </blockquote>
            <p className="text-xs text-[#71695c] dark:text-[#9d9487]">
              This is the historical foundation of what modern UI and web designers now celebrate as the <strong>60-30-10 Rule</strong> (60% background canvas, 30% structural container, 10% focal point action CTA).
            </p>
          </div>

          {/* Core Principle 2: Modulation vs Contrast */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-lg text-[#1e1c19] dark:text-[#f8f5ee] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#cb3550]" />
              <span>2. Modulation (同色調) vs Contrast (異色調)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#ded5c2] dark:border-[#2f2a24] bg-white dark:bg-[#1a1815]">
                <h5 className="font-semibold text-xs font-mono uppercase tracking-wider text-[#cb3550] mb-1">
                  Modulation (同色調)
                </h5>
                <p className="text-xs text-[#524b40] dark:text-[#b4aba0] leading-relaxed">
                  Harmonies created by smooth transitions of tone, value, and saturation within the same chromatic family. Produces tranquility, subtle sophistication, and quiet luxury.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#ded5c2] dark:border-[#2f2a24] bg-white dark:bg-[#1a1815]">
                <h5 className="font-semibold text-xs font-mono uppercase tracking-wider text-[#cb3550] mb-1">
                  Contrast (異色調)
                </h5>
                <p className="text-xs text-[#524b40] dark:text-[#b4aba0] leading-relaxed">
                  Harmonies built by counterpointing completely different qualities (e.g., deep indigo with vermilion, or celadon with chestnut). Wada noted that contrast requires the highest sensitivity to balance.
                </p>
              </div>
            </div>
          </div>

          {/* Core Principle 3: Physical Fabric and Material Light */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-lg text-[#1e1c19] dark:text-[#f8f5ee] flex items-center gap-2">
              <Feather className="w-5 h-5 text-[#cb3550]" />
              <span>3. Why These Colors Outperform Pure Digital Hexes</span>
            </h4>
            <p>
              Modern digital color pickers generate mathematically cold RGB coordinates (like `#0000FF` or `#FF00FF`). Sanzo Wada's 159 pigments originate from real world materials:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#585145] dark:text-[#aba295]">
              <li><strong>Botanical Dyes:</strong> Safflower (紅), gromwell root (紫), fermented persimmon tannin (柿渋), turmeric (鬱金), and dayflower (露草).</li>
              <li><strong>Mineral Earths:</strong> Powdered malachite (白緑), cinnabar vermilion (朱), and lapis lazuli ultramarine (群青).</li>
              <li><strong>Atmospheric Grays (四十八茶百鼠):</strong> The celebrated Edo-period aesthetic of 48 browns and 100 grays, achieving rich chromatic restraint without visual fatigue.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
