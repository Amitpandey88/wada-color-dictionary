import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WADA_PALETTES, FEATURED_PALETTES } from './data/palettes';
import { WADA_COLORS } from './data/colors';
import { WadaPalette, ViewMode, ColorCategory } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { PaletteCard } from './components/PaletteCard';
import { UIPlaygroundModal } from './components/UIPlaygroundModal';
import { ColorDetailModal } from './components/ColorDetailModal';
import { HistoryTheoryModal } from './components/HistoryTheoryModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { ColorSwatchesView } from './components/ColorSwatchesView';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Sparkles, Layers, ChevronDown } from 'lucide-react';
import { playCopyChime, playGentleClick } from './utils/sound';

export function App() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<'palettes' | 'colors'>('palettes');
  const [viewMode, setViewMode] = useState<ViewMode>('book');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [countFilter, setCountFilter] = useState<'all' | 2 | 3 | 4>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ColorCategory>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [activePreset, setActivePreset] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Pagination / Visible chunk
  const [visibleCount, setVisibleCount] = useState<number>(24);

  // Modals & Drawers
  const [selectedPalette, setSelectedPalette] = useState<WadaPalette | null>(null);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Favorites in localStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('wada_favorites');
      return saved ? JSON.parse(saved) : [1, 6, 27, 60, 122, 139, 151, 241];
    } catch {
      return [1, 6, 27, 60, 122, 139, 151, 241];
    }
  });

  // Dark mode in localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('wada_dark_mode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('wada_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('wada_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToast = (title: string, subtitle?: string, colorHex?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-3), { id, title, subtitle, colorHex }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      if (exists) {
        addToast('Removed from Favorites', `Palette № ${String(id).padStart(3, '0')}`);
        return prev.filter(item => item !== id);
      } else {
        addToast('Saved to Favorites', `Palette № ${String(id).padStart(3, '0')}`);
        return [...prev, id];
      }
    });
  };

  // Preset Selection Handler
  const handleSelectPreset = (preset: string) => {
    setActivePreset(preset);
    setVisibleCount(24);
    if (preset === 'all') {
      setCountFilter('all');
      setTagFilter('all');
      setCategoryFilter('all');
      setShowFavoritesOnly(false);
    } else if (preset === 'featured') {
      setCountFilter('all');
      setTagFilter('Designer Favorite');
      setCategoryFilter('all');
      setShowFavoritesOnly(false);
    } else if (preset === 'two-color') {
      setCountFilter(2);
      setTagFilter('all');
      setCategoryFilter('all');
    } else if (preset === 'three-color') {
      setCountFilter(3);
      setTagFilter('all');
      setCategoryFilter('all');
    } else if (preset === 'four-color') {
      setCountFilter(4);
      setTagFilter('all');
      setCategoryFilter('all');
    } else if (preset === 'high-contrast') {
      setCountFilter('all');
      setTagFilter('High Contrast');
    } else if (preset === 'minimalist') {
      setCountFilter('all');
      setTagFilter('Minimalist');
    } else if (preset === 'luxury-dark') {
      setCountFilter('all');
      setTagFilter('Luxury Dark');
    } else if (preset === 'soft-pastel') {
      setCountFilter('all');
      setTagFilter('Soft Pastel');
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setCountFilter('all');
    setCategoryFilter('all');
    setTagFilter('all');
    setActivePreset('all');
    setShowFavoritesOnly(false);
    setVisibleCount(24);
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    countFilter !== 'all' ||
    categoryFilter !== 'all' ||
    tagFilter !== 'all' ||
    showFavoritesOnly
  );

  // Filtered Palettes
  const filteredPalettes = useMemo(() => {
    return WADA_PALETTES.filter((p) => {
      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(p.id)) return false;

      // Count filter
      if (countFilter !== 'all' && p.count !== countFilter) return false;

      // Category filter (does any color in palette belong to category?)
      if (categoryFilter !== 'all' && !p.colors.some(c => c.category === categoryFilter)) return false;

      // Tag filter
      if (tagFilter !== 'all' && !p.tags.includes(tagFilter)) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesCode = p.code.includes(q) || String(p.id) === q;
        const matchesNameEn = p.name.toLowerCase().includes(q);
        const matchesNameJa = p.nameJa.includes(q);
        const matchesColors = p.colors.some(c => 
          c.nameEn.toLowerCase().includes(q) ||
          c.nameJa.includes(q) ||
          c.reading.includes(q) ||
          c.romaji.toLowerCase().includes(q) ||
          c.hex.toLowerCase().includes(q)
        );
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(q));

        if (!matchesCode && !matchesNameEn && !matchesNameJa && !matchesColors && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [countFilter, categoryFilter, tagFilter, searchQuery, showFavoritesOnly, favorites]);

  // Favorite Palettes objects
  const favoritePalettes = useMemo(() => {
    return WADA_PALETTES.filter(p => favorites.includes(p.id));
  }, [favorites]);

  // Pick Random Palette
  const handleRandomPalette = () => {
    playCopyChime();
    const pool = filteredPalettes.length > 0 ? filteredPalettes : WADA_PALETTES;
    const randomItem = pool[Math.floor(Math.random() * pool.length)];
    setSelectedPalette(randomItem);
    setIsPlaygroundOpen(true);
    addToast(`Selected № ${randomItem.code}`, randomItem.name, randomItem.colors[0].hex);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleRandomPalette();
      } else if (e.key === '/') {
        e.preventDefault();
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) input.focus();
      } else if (e.key === 'Escape') {
        setIsPlaygroundOpen(false);
        setIsDetailOpen(false);
        setIsTheoryOpen(false);
        setIsFavoritesOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredPalettes]);

  return (
    <div className="min-h-screen washi-grain flex flex-col transition-colors selection:bg-[#cb3550] selection:text-white">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        favoritesCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => {
          setShowFavoritesOnly(prev => !prev);
          if (activeTab !== 'palettes') setActiveTab('palettes');
        }}
        onRandomPalette={handleRandomPalette}
        onOpenTheory={() => setIsTheoryOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(prev => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'palettes' ? (
          <>
            {/* Hero Banner with Search & Web Designer Presets */}
            <HeroSection
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                setVisibleCount(24);
              }}
              activePreset={activePreset}
              onSelectPreset={handleSelectPreset}
              onOpenPlayground={() => {
                setSelectedPalette(selectedPalette || WADA_PALETTES[0]);
                setIsPlaygroundOpen(true);
              }}
              totalPalettes={WADA_PALETTES.length}
            />

            {/* Filter Bar Controls */}
            <FilterBar
              countFilter={countFilter}
              onCountFilterChange={(count) => {
                setCountFilter(count);
                setVisibleCount(24);
              }}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={(cat) => {
                setCategoryFilter(cat);
                setVisibleCount(24);
              }}
              tagFilter={tagFilter}
              onTagFilterChange={(tag) => {
                setTagFilter(tag);
                setVisibleCount(24);
              }}
              totalFiltered={filteredPalettes.length}
              totalAll={WADA_PALETTES.length}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Palette Cards Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {filteredPalettes.length === 0 ? (
                <div className="text-center py-20 bg-white/50 dark:bg-[#1a1815]/50 border border-dashed border-[#dcd3c2] dark:border-[#332f28] rounded-2xl p-8">
                  <Layers className="w-12 h-12 stroke-1 mx-auto text-[#948b7d] mb-3" />
                  <h3 className="font-serif font-bold text-lg text-[#231f1a] dark:text-[#ede6dc]">
                    No Matching Combinations Found
                  </h3>
                  <p className="text-xs text-[#71695c] dark:text-[#a09789] mt-1 max-w-sm mx-auto">
                    Try searching for another color name (e.g. "Indigo", "Persimmon", or "006"), or reset filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#cb3550] text-white text-xs font-semibold hover:bg-[#b02941] shadow-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className={`grid gap-4 sm:gap-6 ${
                    viewMode === 'compact'
                      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
                      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {filteredPalettes.slice(0, visibleCount).map((palette) => (
                      <PaletteCard
                        key={palette.id}
                        palette={palette}
                        viewMode={viewMode}
                        isFavorite={favorites.includes(palette.id)}
                        onToggleFavorite={toggleFavorite}
                        onSelectPalette={(p) => {
                          setSelectedPalette(p);
                          setIsDetailOpen(true);
                        }}
                        onOpenPlayground={(p) => {
                          setSelectedPalette(p);
                          setIsPlaygroundOpen(true);
                        }}
                        onOpenDetail={(p) => {
                          setSelectedPalette(p);
                          setIsDetailOpen(true);
                        }}
                        onCopyColor={(hex, name) => addToast(`Copied ${hex}`, name, hex)}
                        onCopyPalette={(p) => addToast(`Copied № ${p.code}`, p.colors.map(c => c.hex).join(', '))}
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {visibleCount < filteredPalettes.length && (
                    <div className="mt-12 text-center">
                      <button
                        onClick={() => {
                          playGentleClick();
                          setVisibleCount(prev => prev + 24);
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#d6ccb9] dark:border-[#38332a] bg-white dark:bg-[#1f1d19] hover:border-[#cb3550] dark:hover:border-[#cb3550] text-xs font-semibold text-[#3a352c] dark:text-[#dfd7cc] shadow-sm hover:shadow transition-all"
                      >
                        <span>Load Next 24 Palettes</span>
                        <ChevronDown className="w-4 h-4 text-[#cb3550]" />
                        <span className="text-[11px] font-mono text-[#8b8275] dark:text-[#888176]">
                          ({filteredPalettes.length - visibleCount} remaining)
                        </span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          /* Swatches Catalog Tab: All 159 Colors */
          <ColorSwatchesView
            onSelectPaletteById={(pid) => {
              const pal = WADA_PALETTES.find(p => p.id === pid);
              if (pal) {
                setSelectedPalette(pal);
                setIsDetailOpen(true);
              }
            }}
            onCopyNotice={addToast}
          />
        )}
      </main>

      {/* Footer Colophon */}
      <Footer />

      {/* Interactive UI Studio Modal */}
      <UIPlaygroundModal
        palette={selectedPalette || WADA_PALETTES[0]}
        allPalettes={WADA_PALETTES}
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
        onSelectPalette={setSelectedPalette}
        onCopyNotice={addToast}
      />

      {/* Palette & Swatch Detailed Inspector Modal */}
      <ColorDetailModal
        palette={selectedPalette}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSelectPaletteById={(pid) => {
          const pal = WADA_PALETTES.find(p => p.id === pid);
          if (pal) setSelectedPalette(pal);
        }}
        onCopyNotice={addToast}
      />

      {/* Sanzo Wada Biography and Color Theory Essay Modal */}
      <HistoryTheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoritePalettes={favoritePalettes}
        onRemoveFavorite={toggleFavorite}
        onSelectPalette={(p) => {
          setSelectedPalette(p);
          setIsPlaygroundOpen(true);
        }}
        onCopyNotice={addToast}
      />

      {/* Toast Feedbacks */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

    </div>
  );
}

export default App;
