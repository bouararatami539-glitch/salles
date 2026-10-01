import React, { useState } from 'react';
import { Room } from '../types/campus';
import { FloorPlanView } from './FloorPlanView';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  MapPin,
  Clock,
  Users,
  Accessibility,
  Footprints,
  Copy,
  Building,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  CornerDownLeft,
  CornerDownRight,
  MoveRight,
  DoorOpen,
} from 'lucide-react';

interface RoomDetailScreenProps {
  room: Room;
  onBack: () => void;
  onSelectRoom: (roomId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (roomId: string) => void;
  allRooms: Room[];
}

export const RoomDetailScreen: React.FC<RoomDetailScreenProps> = ({
  room,
  onBack,
  onSelectRoom,
  isFavorite,
  onToggleFavorite,
  allRooms,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyItinerary = () => {
    const text = `${room.name} (${room.building} - ${room.floor})\n\nComment s'y rendre :\n${room.accessInstructions}\n\nÉtapes :\n${room.steps.map(s => `${s.stepNumber}. ${s.title}: ${s.instruction}`).join('\n')}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Plan d'accès - ${room.name}`,
        text: `Retrouve-moi à ${room.name} (${room.building}, ${room.floor}) : ${room.accessInstructions}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopyItinerary();
    }
  };

  // Nearby rooms in the same building
  const nearbyRooms = allRooms.filter(
    r => r.building === room.building && r.id !== room.id
  ).slice(0, 3);

  const getStepIcon = (iconType: string) => {
    switch (iconType) {
      case 'entrance':
        return <DoorOpen className="w-4 h-4 text-emerald-400" />;
      case 'stairs':
        return <Footprints className="w-4 h-4 text-amber-400" />;
      case 'elevator':
        return <Layers className="w-4 h-4 text-sky-400" />;
      case 'turn-left':
        return <CornerDownLeft className="w-4 h-4 text-blue-400" />;
      case 'turn-right':
        return <CornerDownRight className="w-4 h-4 text-blue-400" />;
      case 'door':
        return <MapPin className="w-4 h-4 text-red-400" />;
      default:
        return <MoveRight className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Android Material 3 TopAppBar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-3 py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 -ml-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors active:scale-95"
            aria-label="Retour"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-white tracking-tight line-clamp-1">
              {room.name}
            </h1>
            <p className="text-[11px] text-slate-400">
              {room.building} · {room.floor}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            title="Partager l'accès"
            aria-label="Partager"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleFavorite(room.id)}
            className={`p-2 rounded-full transition-colors ${
              isFavorite
                ? 'text-amber-400 bg-amber-400/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Enregistrer en favori"
            aria-label="Favori"
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5 max-w-2xl mx-auto w-full pb-24">
        {/* Hero Card with Category & Quick Metrics */}
        <div className="relative rounded-2xl bg-gradient-to-br from-blue-900/40 via-slate-800/80 to-slate-900 border border-blue-800/40 p-5 shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {room.category}
              </span>
              <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                {room.code}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {room.name}
            </h2>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-sm text-slate-300">
              <div className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-400" />
                <span>{room.building}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-sky-400" />
                <span className="font-medium text-white">{room.floor}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{room.capacity} places</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/60">
              <button
                onClick={handleCopyItinerary}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition-colors shadow-sm active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Itinéraire copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier l'itinéraire</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 rounded-xl text-xs text-slate-300 border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>~{room.estimatedWalkMinutes} min à pied</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Plan d'illustration interactif de l'étage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              Plan d'illustration de l'étage
            </h3>
            <span className="text-[11px] text-slate-400">Zoom interactif & Balise</span>
          </div>

          <FloorPlanView currentRoom={room} onSelectRoom={onSelectRoom} />
          <p className="text-[11px] text-slate-400 italic">
            Visualisation schématique des accès du campus. La balise rouge pulsante indique l'emplacement de votre salle.
          </p>
        </div>

        {/* Section 2: Description textuelle pour s'y rendre (Exigence prompt) */}
        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-blue-400">
            <Info className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-white">
              Guide d'accès direct
            </h3>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              "{room.accessInstructions}"
            </p>
          </div>
        </div>

        {/* Section 3: Étapes détaillées du parcours */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Footprints className="w-4 h-4 text-emerald-400" />
            Étapes pas-à-pas du parcours
          </h3>

          <div className="space-y-2.5">
            {room.steps.map((step, idx) => (
              <div
                key={step.stepNumber}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-400">
                  {step.stepNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      {getStepIcon(step.icon)}
                      {step.title}
                    </span>
                    {step.highlight && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                        {step.highlight}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {step.instruction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Équipements & Accessibilité */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Équipements & Accessibilité
          </h3>

          <div className="flex flex-wrap gap-2">
            {room.equipment.map((item, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-blue-400" />
                {item}
              </span>
            ))}
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs text-slate-300">
            <Accessibility className={`w-4 h-4 ${room.hasAccessibility ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>
              {room.hasAccessibility
                ? 'Accès adapté aux personnes à mobilité réduite (PMR, ascenseur disponible)'
                : 'Accès par escalier classique (accès PMR sur demande à la loge)'}
            </span>
          </div>
        </div>

        {/* Section 5: Autres salles dans ce bâtiment */}
        {nearbyRooms.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Aussi dans {room.building}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {nearbyRooms.map(nr => (
                <button
                  key={nr.id}
                  onClick={() => onSelectRoom(nr.id)}
                  className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-left hover:border-blue-500 transition-colors group"
                >
                  <p className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {nr.name}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {nr.floor}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/60 text-[10px] text-slate-400">
                    <span>{nr.category}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
