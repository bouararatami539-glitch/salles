import React from 'react';
import { Room } from '../types/campus';
import { Bookmark, Building, Layers, ArrowRight, Trash2 } from 'lucide-react';

interface FavoritesScreenProps {
  favoriteIds: string[];
  allRooms: Room[];
  onSelectRoom: (roomId: string) => void;
  onRemoveFavorite: (roomId: string) => void;
  onClearAll: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  favoriteIds,
  allRooms,
  onSelectRoom,
  onRemoveFavorite,
  onClearAll,
}) => {
  const favoriteRooms = allRooms.filter(r => favoriteIds.includes(r.id));

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
            Mes Salles Enregistrées
          </h1>
          <p className="text-xs text-slate-400">
            {favoriteRooms.length} {favoriteRooms.length > 1 ? 'salles favorites' : 'salle favorite'}
          </p>
        </div>

        {favoriteRooms.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Tout effacer
          </button>
        )}
      </div>

      <div className="p-4 sm:p-5 max-w-2xl mx-auto w-full pb-24">
        {favoriteRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl bg-slate-800/40 border border-dashed border-slate-700 mt-6">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <Bookmark className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">
              Aucune salle enregistrée
            </h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Cliquez sur l'icône marque-page sur n'importe quelle salle (ex: Amphi A, Salle 102) pour la retrouver ici en un clic.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteRooms.map(room => (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className="p-4 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/70 cursor-pointer transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold">
                      {room.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {room.code}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Building className="w-3.5 h-3.5 text-blue-400" />
                      {room.building}
                    </span>
                    <span>·</span>
                    <span className="text-sky-300 font-medium">
                      {room.floor}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onRemoveFavorite(room.id);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-full hover:bg-slate-700/60 transition-colors"
                    title="Retirer des favoris"
                    aria-label="Retirer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
