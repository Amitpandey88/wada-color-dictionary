export type ColorCategory = 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'neutral';

export type PaletteType = 'two-color' | 'three-color' | 'four-color';

export type HarmonyType = 'modulation' | 'contrast' | 'pan-tone';

export interface WadaColor {
  id: number;
  nameJa: string;
  reading: string;
  romaji: string;
  nameEn: string;
  cmyk: [number, number, number, number];
  rgb: [number, number, number];
  hex: string;
  lab?: [number, number, number];
  category: ColorCategory;
  palettes: number[];
  meaning: string;
}

export interface WadaPalette {
  id: number;
  code: string;
  count: 2 | 3 | 4;
  type: PaletteType;
  colors: WadaColor[];
  name: string;
  nameJa: string;
  tags: string[];
  featured: boolean;
  designerTip: string;
  harmonyType: HarmonyType;
  recommendedRoles?: {
    background: string;
    surface: string;
    text: string;
    primary: string;
    accent?: string;
  };
}

export type ViewMode = 'book' | 'modern' | 'compact';

export type UIPreviewMode = 'landing' | 'dashboard' | 'editorial' | 'mobile' | 'spatial-3d';

export interface FilterState {
  searchQuery: string;
  countFilter: 'all' | 2 | 3 | 4;
  categoryFilter: 'all' | ColorCategory;
  tagFilter: string;
  onlyFavorites: boolean;
  onlyFeatured: boolean;
}
