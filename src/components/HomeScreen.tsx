import React, { useState, useMemo } from 'react';
import { Room, CategoryType, BuildingType } from '../types/campus';
import { QUICK_SEARCH_SHORTCUTS } from '../data/campusData';
import {
  Search,
  X,
  Building,
  Layers,
  Users,
  ChevronRight,
  Bookmark,
  MapPin,
  Sparkles,
  LayoutGrid,
  List,
  Filter,
  Check,
  Clock,
  Compass,
  ArrowUpRight,
  Smartphone,
} from 'lucide-react';

interface HomeScreenProps {
  rooms: Room[];
  onSelectRoom: (roomId: string) => void;
  favorites: string[];
  onToggleFavorite: (roomId: string) => void;
  onOpenInstallModal?: () => void;
}

const CATEGORIES: Array<{ id: CategoryType | 'Tous'; label: string; countBadge?: number }> = [
  { id: 'Tous', label: 'Tous' },
  { id: 'Amphithéâtres', label: 'Amphithéâtres' },
  { id: 'Salles de TD', label: 'Salles de TD' },
  { id: 'Laboratoires', label: 'Laboratoires' },
  { id: 'Bâtiments', label: 'Bâtiments' },
];

const BUILDINGS: Array<{ id: BuildingType | 'Tous'; label: string }> = [
  { id: 'Tous', label: 'Tous les bâtiments' },
  { id: 'Bâtiment Central', label: 'Bâtiment Central' },
  { id: 'Bâtiment Informatique', label: 'Bâtiment Informatique' },
  { id: 'Bâtiment Sciences', label: 'Bâtiment Sciences' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  rooms,
  onSelectRoom,
  favorites,
  onToggleFavorite,
  onOpenInstallModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'Tous'>('Tous');
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | 'Tous'>('Tous');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      // Category filter
      if (selectedCategory !== 'Tous' && room.category !== selectedCategory) {
        return false;
      }

      // Building filter
      if (selectedBuilding !== 'Tous' && room.building !== selectedBuilding) {
        return false;
      }

      // Search text filter
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchName = room.name.toLowerCase().includes(q);
      const matchBuilding = room.building.toLowerCase().includes(q);
      const matchFloor = room.floor.toLowerCase().includes(q);
      const matchCode = room.code.toLowerCase().includes(q);
      const matchTags = room.tags?.some(tag => tag.toLowerCase().includes(q));
      const matchCategory = room.category.toLowerCase().includes(q);

      return matchName || matchBuilding || matchFloor || matchCode || matchTags || matchCategory;
    });
  }, [rooms, selectedCategory, selectedBuilding, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Tous: rooms.length };
    rooms.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, [rooms]);

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Tous');
    setSelectedBuilding('Tous');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Material 3 App Header */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 pt-3 pb-3 space-y-3">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                CampusNav
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Android MD3
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Trouvez facilement vos salles, amphis et labos
              </p>
            </div>
          </div>

          {/* View Mode Toggle: Cards vs List */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-800 border border-slate-700">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Affichage en cartes"
              aria-label="Affichage en cartes"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Affichage en liste compacte"
              aria-label="Affichage en liste compacte"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. Barre de recherche textuelle (Exigence 1 & Recherche rapide) */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-blue-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Rechercher une salle (ex: Amphi A, Salle 102, Labo)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 focus:border-blue-500 focus:bg-slate-800 text-sm text-white placeholder-slate-400 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors"
                aria-label="Effacer la recherche"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Suggestions when typing */}
          {isSearchFocused && searchQuery.length > 0 && filteredRooms.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 rounded-xl bg-slate-800 border border-slate-700 shadow-xl z-30 max-h-48 overflow-y-auto">
              {filteredRooms.slice(0, 4).map(r => (
                <button
                  key={r.id}
                  onMouseDown={() => onSelectRoom(r.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-slate-700/80 text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-white">{r.name}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-400 truncate">{r.building}</span>
                  </div>
                  <span className="text-blue-400 text-[11px] shrink-0 font-medium">
                    {r.floor}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* * Fonction de recherche rapide par nom de salle (Shortcuts) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-medium text-slate-400 shrink-0 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Accès rapide :
          </span>
          {QUICK_SEARCH_SHORTCUTS.map(sc => {
            const isActive = searchQuery.toLowerCase() === sc.query.toLowerCase();
            return (
              <button
                key={sc.name}
                onClick={() => handleQuickSearch(sc.query)}
                className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/80'
                }`}
              >
                {sc.name}
              </button>
            );
          })}
        </div>

        {/* 2. Système de filtres par catégories : 'Amphithéâtres', 'Salles de TD', 'Laboratoires', 'Bâtiments' */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700/80 hover:bg-slate-700/80'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-blue-700/80 text-blue-100' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {categoryCounts[cat.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 max-w-4xl mx-auto w-full pb-24">
        {/* Banner: Tester sur mon téléphone (APK & QR Code) */}
        {onOpenInstallModal && (
          <div
            onClick={onOpenInstallModal}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/50 via-indigo-900/30 to-slate-800/80 border border-blue-500/40 hover:border-blue-400 cursor-pointer transition-all shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 group-hover:scale-105 transition-transform">
                <Smartphone className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-2">
                  Tester sur votre téléphone Android
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    APK & QR Code
                  </span>
                </p>
                <p className="text-[11px] text-slate-300">
                  Installer en 10s sur mobile ou télécharger le projet Android natif
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-blue-400 group-hover:text-blue-300">
              <span className="hidden sm:inline">Installer</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        )}

        {/* Building Filter Bar & Results Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              {filteredRooms.length} {filteredRooms.length > 1 ? 'salles trouvées' : 'salle trouvée'}
            </span>
            {(selectedCategory !== 'Tous' || selectedBuilding !== 'Tous' || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                (Réinitialiser)
              </button>
            )}
          </div>

          {/* Building dropdown filter */}
          <div className="flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedBuilding}
              onChange={e => setSelectedBuilding(e.target.value as BuildingType | 'Tous')}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {BUILDINGS.map(b => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Liste déroulante ou cartes cliquables affichant les salles disponibles */}
        {filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-slate-800/40 border border-dashed border-slate-700 mt-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <Search className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">
              Aucune salle ne correspond à votre recherche
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              Essayez avec un mot-clé plus court ou réinitialisez les filtres de catégorie.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition-colors"
            >
              Afficher toutes les salles
            </button>
          </div>
        ) : viewMode === 'cards' ? (
          /* Cards Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredRooms.map(room => {
              const isFav = favorites.includes(room.id);
              return (
                <div
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className="group relative rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/70 p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Category and Bookmark */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {room.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {room.code}
                        </span>
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onToggleFavorite(room.id);
                        }}
                        className={`p-1.5 rounded-full hover:bg-slate-700/70 transition-colors ${
                          isFav ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Favori"
                        aria-label="Favori"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>

                    {/* Room Name */}
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                      <span>{room.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </h3>

                    {/* Location Metadata */}
                    <div className="flex items-center gap-2 text-xs text-slate-300 mt-2">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Building className="w-3.5 h-3.5 text-blue-400" />
                        {room.building}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="flex items-center gap-1 font-medium text-sky-300">
                        <Layers className="w-3.5 h-3.5 text-sky-400" />
                        {room.floor}
                      </span>
                    </div>

                    {/* Route preview snippet */}
                    <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed bg-slate-900/50 p-2 rounded-xl border border-slate-800">
                      "{room.accessInstructions}"
                    </p>
                  </div>

                  {/* Footer Row */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{room.capacity} places</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-400 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>~{room.estimatedWalkMinutes} min</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Compact Tap List View */
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700/80 divide-y divide-slate-700/60 overflow-hidden shadow-sm">
            {filteredRooms.map(room => {
              const isFav = favorites.includes(room.id);
              return (
                <div
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className="flex items-center justify-between p-3.5 hover:bg-slate-700/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                          {room.name}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                          {room.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {room.building} · <span className="text-sky-300">{room.floor}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      {room.capacity} pl.
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onToggleFavorite(room.id);
                      }}
                      className={`p-1.5 rounded-full hover:bg-slate-600/60 transition-colors ${
                        isFav ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                      }`}
                      aria-label="Favori"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
