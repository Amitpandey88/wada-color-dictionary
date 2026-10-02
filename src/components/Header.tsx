import React from 'react';
import { ViewMode } from '../types';
import { BookOpen, LayoutGrid, Rows3, Bookmark, Volume2, VolumeX, Moon, Sun, Sparkles, HelpCircle } from 'lucide-react';
import { isSoundEnabled, toggleSound, playGentleClick } from '../utils/sound';

interface HeaderProps {
  activeTab: 'palettes' | 'colors';
  onTabChange: (tab: 'palettes' | 'colors') => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  onRandomPalette: () => void;
  onOpenTheory: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  favoritesCount,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  onRandomPalette,
  onOpenTheory,
  darkMode,
  onToggleDarkMode,
}) => {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fcfaf6]/95 dark:bg-[#151412]/95 backdrop-blur-md border-b border-[#e7e1d3] dark:border-[#2d2924] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3.5 shrink-0">
            {/* Traditional Hanko Seal Stamp */}
            <div className="hanko-seal w-10 h-10 text-base shadow-sm bg-[#cb3550]/5">
              和
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-japanese font-bold text-xl sm:text-2xl tracking-wider text-[#1e1c19] dark:text-[#f3ede3]">
                  配色事典
                </span>
                <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-[#cb3550]/40 text-[#cb3550] dark:text-[#f5657d] font-mono font-medium">
                  1933–34
                </span>
              </div>
              <p className="text-xs text-[#736c61] dark:text-[#a0988a] font-serif tracking-wide hidden sm:block">
                A Dictionary of Color Combinations by Sanzo Wada
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Palettes / All 159 Colors) */}
          <div className="flex items-center bg-[#efe9dc] dark:bg-[#23201b] p-1 rounded-lg border border-[#ded5c3] dark:border-[#353029]">
            <button
              onClick={() => {
                playGentleClick();
                onTabChange('palettes');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'palettes'
                  ? 'bg-white dark:bg-[#343029] text-[#1c1a17] dark:text-[#f8f5ee] shadow-sm font-semibold'
                  : 'text-[#6e675b] dark:text-[#a1998c] hover:text-[#1c1a17]'
              }`}
            >
              348 Palettes
            </button>
            <button
              onClick={() => {
                playGentleClick();
                onTabChange('colors');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'colors'
                  ? 'bg-white dark:bg-[#343029] text-[#1c1a17] dark:text-[#f8f5ee] shadow-sm font-semibold'
                  : 'text-[#6e675b] dark:text-[#a1998c] hover:text-[#1c1a17]'
              }`}
            >
              159 Swatches
            </button>
          </div>

          {/* View mode & action controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* View Mode Switcher (Visible on palettes tab) */}
            {activeTab === 'palettes' && (
              <div className="hidden md:flex items-center bg-[#f0eae0] dark:bg-[#22201b] p-0.5 rounded-lg border border-[#ded6c5] dark:border-[#332f29]">
                <button
                  onClick={() => { playGentleClick(); onViewModeChange('book'); }}
                  title="Book Plate View (Exact 1933 Layouts)"
                  className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1.5 ${
                    viewMode === 'book'
                      ? 'bg-white dark:bg-[#343028] text-[#1b1916] dark:text-[#f9f6ef] shadow-sm'
                      : 'text-[#70685b] dark:text-[#9e9688] hover:text-[#1b1916]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-[11px] font-medium">Book Plate</span>
                </button>
                <button
                  onClick={() => { playGentleClick(); onViewModeChange('modern'); }}
                  title="Modern Studio View"
                  className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1.5 ${
                    viewMode === 'modern'
                      ? 'bg-white dark:bg-[#343028] text-[#1b1916] dark:text-[#f9f6ef] shadow-sm'
                      : 'text-[#70685b] dark:text-[#9e9688] hover:text-[#1b1916]'
                  }`}
                >
                  <Rows3 className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-[11px] font-medium">Modern</span>
                </button>
                <button
                  onClick={() => { playGentleClick(); onViewModeChange('compact'); }}
                  title="Compact Grid View"
                  className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1.5 ${
                    viewMode === 'compact'
                      ? 'bg-white dark:bg-[#343028] text-[#1b1916] dark:text-[#f9f6ef] shadow-sm'
                      : 'text-[#70685b] dark:text-[#9e9688] hover:text-[#1b1916]'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-[11px] font-medium">Grid</span>
                </button>
              </div>
            )}

            {/* Random shuffle inspiration */}
            {activeTab === 'palettes' && (
              <button
                onClick={() => {
                  playGentleClick();
                  onRandomPalette();
                }}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#d9d0bf] dark:border-[#38332c] hover:border-[#cb3550] dark:hover:border-[#cb3550] bg-white/70 dark:bg-[#201d19] text-xs font-medium text-[#443f38] dark:text-[#dfd7cc] transition-colors"
                title="Random Palette (Shortcut: Space)"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#cb3550]" />
                <span className="hidden lg:inline">Inspire Me</span>
              </button>
            )}

            {/* Book Theory & Lore Modal Button */}
            <button
              onClick={() => {
                playGentleClick();
                onOpenTheory();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#d9d0bf] dark:border-[#38332c] hover:bg-white dark:hover:bg-[#25221d] text-xs font-medium text-[#474139] dark:text-[#ded5c8] transition-colors"
              title="Wada's Color Harmony Theory & History"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#736c61]" />
              <span className="hidden xl:inline">Color Theory</span>
            </button>

            {/* Favorites Starred Filter */}
            <button
              onClick={() => {
                playGentleClick();
                onToggleFavoritesOnly();
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                showFavoritesOnly
                  ? 'border-[#cb3550] bg-[#cb3550] text-white'
                  : 'border-[#d9d0bf] dark:border-[#38332c] hover:bg-white dark:hover:bg-[#25221d] text-[#474139] dark:text-[#ded5c8]'
              }`}
              title="Saved Favorites"
            >
              <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              <span>{favoritesCount}</span>
            </button>

            {/* Sound toggle */}
            <button
              onClick={handleSoundToggle}
              className="p-2 rounded-lg border border-[#d9d0bf] dark:border-[#38332c] hover:bg-white dark:hover:bg-[#25221d] text-[#554e44] dark:text-[#cfc6b8] transition-colors"
              title={soundOn ? 'Sound FX On (Click to Mute)' : 'Sound Muted (Click to Unmute)'}
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-50" />}
            </button>

            {/* Dark Mode toggle */}
            <button
              onClick={() => {
                playGentleClick();
                onToggleDarkMode();
              }}
              className="p-2 rounded-lg border border-[#d9d0bf] dark:border-[#38332c] hover:bg-white dark:hover:bg-[#25221d] text-[#554e44] dark:text-[#cfc6b8] transition-colors"
              title={darkMode ? 'Switch to Washi Light' : 'Switch to Ink Dark'}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
