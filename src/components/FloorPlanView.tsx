import React, { useState } from 'react';
import { Room } from '../types/campus';
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Navigation, Compass, Layers } from 'lucide-react';

interface FloorPlanViewProps {
  currentRoom: Room;
  onSelectRoom?: (roomId: string) => void;
}

export const FloorPlanView: React.FC<FloorPlanViewProps> = ({ currentRoom, onSelectRoom }) => {
  const [zoom, setZoom] = useState(1);
  const [selectedFloor, setSelectedFloor] = useState<number>(currentRoom.floorLevel);

  // Sync floor if current room changes
  React.useEffect(() => {
    setSelectedFloor(currentRoom.floorLevel);
  }, [currentRoom.floorLevel, currentRoom.id]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleReset = () => setZoom(1);

  // Determine which architectural layout to draw based on currentRoom.building and selectedFloor
  const isCentral = currentRoom.building === 'Bâtiment Central';
  const isInfo = currentRoom.building === 'Bâtiment Informatique';
  const isSciences = currentRoom.building === 'Bâtiment Sciences';

  return (
    <div className="relative rounded-2xl bg-slate-900 border border-slate-700/60 overflow-hidden shadow-lg">
      {/* Top Bar with Floor Switcher & Controls */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800/90 border-b border-slate-700/80 backdrop-blur-sm z-10 text-xs text-slate-300">
        <div className="flex items-center gap-1.5 font-medium">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-200">{currentRoom.building}</span>
          <span className="text-slate-500">·</span>
          <span className="text-blue-400 font-semibold">{currentRoom.floor}</span>
        </div>

        {/* Floor selector buttons */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-lg border border-slate-700">
          {isSciences && (
            <button
              onClick={() => setSelectedFloor(-1)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                selectedFloor === -1 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              -1
            </button>
          )}
          <button
            onClick={() => setSelectedFloor(0)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              selectedFloor === 0 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            RDC
          </button>
          <button
            onClick={() => setSelectedFloor(1)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              selectedFloor === 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            1er
          </button>
          <button
            onClick={() => setSelectedFloor(2)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              selectedFloor === 2 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            2ème
          </button>
        </div>
      </div>

      {/* Blueprint Visual Canvas */}
      <div className="relative w-full h-[280px] sm:h-[320px] bg-[#0B132B] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#3B82F6 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        <div
          className="transition-transform duration-300 ease-out origin-center w-full h-full flex items-center justify-center"
          style={{ transform: `scale(${zoom})` }}
        >
          <svg
            viewBox="0 0 500 300"
            className="w-full max-w-[480px] h-auto drop-shadow-md"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background Floor Slab */}
            <rect
              x="20"
              y="20"
              width="460"
              height="260"
              rx="12"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="2"
            />

            {/* Central Hallway / Circulation Area */}
            <rect
              x="40"
              y="130"
              width="420"
              height="45"
              fill="#0F172A"
              stroke="#1E293B"
              strokeWidth="1"
            />
            <text x="250" y="157" fill="#64748B" fontSize="10" textAnchor="middle" letterSpacing="2" fontWeight="500">
              COULOIR PRINCIPAL DE CIRCULATION
            </text>

            {/* Entrance indicator */}
            <g transform="translate(40, 140)">
              <polygon points="0,12 14,5 14,19" fill="#10B981" />
              <text x="20" y="15" fill="#34D399" fontSize="9" fontWeight="600">ENTRÉE</text>
            </g>

            {/* Stairwell A */}
            <g transform="translate(60, 40)">
              <rect x="0" y="0" width="55" height="70" rx="4" fill="#1e2238" stroke="#475569" strokeWidth="1.5" />
              <line x1="0" y1="18" x2="55" y2="18" stroke="#64748B" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="0" y1="35" x2="55" y2="35" stroke="#64748B" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="0" y1="52" x2="55" y2="52" stroke="#64748B" strokeWidth="1" strokeDasharray="3 2" />
              <text x="27" y="38" fill="#94A3B8" fontSize="8" textAnchor="middle" fontWeight="bold">ESCALIER A</text>
            </g>

            {/* Elevator (Ascenseur) */}
            <g transform="translate(125, 40)">
              <rect x="0" y="0" width="40" height="70" rx="4" fill="#1e2238" stroke="#475569" strokeWidth="1.5" />
              <rect x="6" y="8" width="28" height="54" rx="2" fill="#334155" />
              <text x="20" y="32" fill="#E2E8F0" fontSize="7" textAnchor="middle" fontWeight="bold">ASC.</text>
              <text x="20" y="44" fill="#38BDF8" fontSize="10" textAnchor="middle">↕</text>
            </g>

            {/* Stairwell B */}
            <g transform="translate(405, 40)">
              <rect x="0" y="0" width="55" height="70" rx="4" fill="#1e2238" stroke="#475569" strokeWidth="1.5" />
              <line x1="0" y1="18" x2="55" y2="18" stroke="#64748B" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="0" y1="35" x2="55" y2="35" stroke="#64748B" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="0" y1="52" x2="55" y2="52" stroke="#64748B" strokeWidth="1" strokeDasharray="3 2" />
              <text x="27" y="38" fill="#94A3B8" fontSize="8" textAnchor="middle" fontWeight="bold">ESCALIER B</text>
            </g>

            {/* Restrooms (Sanitaires) */}
            <g transform="translate(60, 190)">
              <rect x="0" y="0" width="60" height="70" rx="4" fill="#1e2238" stroke="#475569" strokeWidth="1" />
              <text x="30" y="38" fill="#94A3B8" fontSize="8" textAnchor="middle">WC PMR</text>
            </g>

            {/* === SCENARIO SPECIFIC ROOM LAYOUTS === */}

            {/* If Central Building */}
            {isCentral && (
              <>
                {/* Amphi A on RDC */}
                <g 
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => onSelectRoom && onSelectRoom('amphi-a')}
                >
                  <rect
                    x="180"
                    y="190"
                    width="170"
                    height="75"
                    rx="6"
                    fill={currentRoom.id === 'amphi-a' ? '#1D4ED8' : '#1E293B'}
                    stroke={currentRoom.id === 'amphi-a' ? '#60A5FA' : '#3B82F6'}
                    strokeWidth={currentRoom.id === 'amphi-a' ? '2.5' : '1.5'}
                  />
                  {/* Seats rows representation */}
                  <path d="M195,225 Q265,215 335,225" stroke="#93C5FD" strokeWidth="1.5" fill="none" opacity="0.6" />
                  <path d="M195,240 Q265,230 335,240" stroke="#93C5FD" strokeWidth="1.5" fill="none" opacity="0.6" />
                  <text x="265" y="210" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">
                    AMPHI A
                  </text>
                  <text x="265" y="258" fill="#BFDBFE" fontSize="8" textAnchor="middle">
                    350 places · Rez-de-chaussée
                  </text>
                </g>

                {/* Salle 003 */}
                <g
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => onSelectRoom && onSelectRoom('salle-003')}
                >
                  <rect
                    x="180"
                    y="40"
                    width="95"
                    height="70"
                    rx="4"
                    fill={currentRoom.id === 'salle-003' ? '#1D4ED8' : '#1E293B'}
                    stroke={currentRoom.id === 'salle-003' ? '#60A5FA' : '#475569'}
                    strokeWidth={currentRoom.id === 'salle-003' ? '2.5' : '1'}
                  />
                  <text x="227" y="72" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Salle 003
                  </text>
                  <text x="227" y="86" fill="#94A3B8" fontSize="8" textAnchor="middle">
                    TD Langues
                  </text>
                </g>

                {/* Cafeteria */}
                <rect x="365" y="190" width="95" height="75" rx="4" fill="#182338" stroke="#475569" strokeWidth="1" />
                <text x="412" y="232" fill="#CBD5E1" fontSize="10" textAnchor="middle" fontWeight="bold">CAFÉTÉRIA</text>
                <text x="412" y="246" fill="#64748B" fontSize="8" textAnchor="middle">CROUS</text>
              </>
            )}

            {/* If Informatique Building */}
            {isInfo && (
              <>
                {/* Amphi Turing (RDC) */}
                <g
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => onSelectRoom && onSelectRoom('amphi-turing')}
                >
                  <rect
                    x="180"
                    y="190"
                    width="140"
                    height="75"
                    rx="6"
                    fill={currentRoom.id === 'amphi-turing' ? '#1D4ED8' : '#1E293B'}
                    stroke={currentRoom.id === 'amphi-turing' ? '#60A5FA' : '#475569'}
                    strokeWidth={currentRoom.id === 'amphi-turing' ? '2.5' : '1'}
                  />
                  <text x="250" y="228" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                    AMPHI TURING
                  </text>
                  <text x="250" y="244" fill="#93C5FD" fontSize="8" textAnchor="middle">
                    200 places
                  </text>
                </g>

                {/* Salle 102 (1er étage) */}
                <g
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => onSelectRoom && onSelectRoom('salle-102')}
                >
                  <rect
                    x="290"
                    y="40"
                    width="100"
                    height="70"
                    rx="6"
                    fill={currentRoom.id === 'salle-102' ? '#1D4ED8' : '#1E293B'}
                    stroke={currentRoom.id === 'salle-102' ? '#60A5FA' : '#3B82F6'}
                    strokeWidth={currentRoom.id === 'salle-102' ? '2.5' : '1.5'}
                  />
                  <text x="340" y="70" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                    SALLE 102
                  </text>
                  <text x="340" y="85" fill="#BFDBFE" fontSize="8" textAnchor="middle">
                    TD Info · 36 places
                  </text>
                </g>

                {/* Salle 101 */}
                <rect x="180" y="40" width="95" height="70" rx="4" fill="#182338" stroke="#475569" strokeWidth="1" />
                <text x="227" y="78" fill="#94A3B8" fontSize="10" textAnchor="middle">Salle 101</text>

                {/* Labo Réseaux (2ème étage) */}
                <g
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => onSelectRoom && onSelectRoom('labo-reseaux')}
                >
                  <rect
                    x="335"
                    y="190"
                    width="125"
                    height="75"
                    rx="6"
                    fill={currentRoom.id === 'labo-reseaux' ? '#1D4ED8' : '#1E293B'}
                    stroke={currentRoom.id === 'labo-reseaux' ? '#60A5FA' : '#475569'}
                    strokeWidth={currentRoom.id === 'labo-reseaux' ? '2.5' : '1'}
                  />
                  <text x="397" y="226" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                    LAB RÉSEAUX
                  </text>
                  <text x="397" y="242" fill="#93C5FD" fontSize="8" textAnchor="middle">
                    Salle 212 · Cisco
                  </text>
                </g>
              </>
            )}

            {/* If Sciences Building */}
            {isSciences && (
              <>
                {/* Labo Chimie (2ème étage) */}
                <g
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => onSelectRoom && onSelectRoom('labo-chimie')}
                >
                  <rect
                    x="300"
                    y="40"
                    width="95"
                    height="70"
                    rx="6"
                    fill={currentRoom.id === 'labo-chimie' ? '#1D4ED8' : '#1E293B'}
                    stroke={currentRoom.id === 'labo-chimie' ? '#60A5FA' : '#3B82F6'}
                    strokeWidth={currentRoom.id === 'labo-chimie' ? '2.5' : '1.5'}
                  />
                  <text x="347" y="70" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                    LAB CHIMIE
                  </text>
                  <text x="347" y="85" fill="#FDE047" fontSize="8" textAnchor="middle">
                    Porte 208 ⚠️
                  </text>
                </g>

                {/* Amphi Curie (RDC) */}
                <g
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => onSelectRoom && onSelectRoom('amphi-curie')}
                >
                  <rect
                    x="180"
                    y="190"
                    width="150"
                    height="75"
                    rx="6"
                    fill={currentRoom.id === 'amphi-curie' ? '#1D4ED8' : '#1E293B'}
                    stroke={currentRoom.id === 'amphi-curie' ? '#60A5FA' : '#475569'}
                    strokeWidth={currentRoom.id === 'amphi-curie' ? '2.5' : '1'}
                  />
                  <text x="255" y="228" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                    AMPHI CURIE
                  </text>
                  <text x="255" y="244" fill="#93C5FD" fontSize="8" textAnchor="middle">
                    280 places
                  </text>
                </g>

                {/* Salle 204 (1er étage) */}
                <g
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onClick={() => onSelectRoom && onSelectRoom('salle-204')}
                >
                  <rect
                    x="180"
                    y="40"
                    width="105"
                    height="70"
                    rx="6"
                    fill={currentRoom.id === 'salle-204' ? '#1D4ED8' : '#1E293B'}
                    stroke={currentRoom.id === 'salle-204' ? '#60A5FA' : '#475569'}
                    strokeWidth={currentRoom.id === 'salle-204' ? '2.5' : '1'}
                  />
                  <text x="232" y="70" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                    SALLE 204
                  </text>
                  <text x="232" y="85" fill="#94A3B8" fontSize="8" textAnchor="middle">
                    TD Math
                  </text>
                </g>
              </>
            )}

            {/* DOTTED WALKING PATH LINE TO CURRENT ROOM */}
            {currentRoom.id === 'amphi-a' && (
              <g>
                <path
                  d="M 50 152 L 265 152 L 265 190"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  fill="none"
                />
                {/* Target Beacon Pin */}
                <circle cx="265" cy="190" r="7" fill="#EF4444" />
                <circle cx="265" cy="190" r="14" fill="#EF4444" opacity="0.4" className="animate-ping" />
              </g>
            )}

            {currentRoom.id === 'salle-102' && (
              <g>
                <path
                  d="M 432 110 L 432 145 L 340 145 L 340 110"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  fill="none"
                />
                <circle cx="340" cy="110" r="7" fill="#EF4444" />
                <circle cx="340" cy="110" r="14" fill="#EF4444" opacity="0.4" className="animate-ping" />
              </g>
            )}

            {currentRoom.id === 'labo-chimie' && (
              <g>
                <path
                  d="M 145 110 L 145 145 L 347 145 L 347 110"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  fill="none"
                />
                <circle cx="347" cy="110" r="7" fill="#EF4444" />
                <circle cx="347" cy="110" r="14" fill="#EF4444" opacity="0.4" className="animate-ping" />
              </g>
            )}

            {currentRoom.id === 'amphi-turing' && (
              <g>
                <path
                  d="M 50 152 L 250 152 L 250 190"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  fill="none"
                />
                <circle cx="250" cy="190" r="7" fill="#EF4444" />
                <circle cx="250" cy="190" r="14" fill="#EF4444" opacity="0.4" className="animate-ping" />
              </g>
            )}

            {currentRoom.id === 'salle-204' && (
              <g>
                <path
                  d="M 87 110 L 87 145 L 232 145 L 232 110"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  fill="none"
                />
                <circle cx="232" cy="110" r="7" fill="#EF4444" />
                <circle cx="232" cy="110" r="14" fill="#EF4444" opacity="0.4" className="animate-ping" />
              </g>
            )}

            {currentRoom.id === 'labo-reseaux' && (
              <g>
                <path
                  d="M 145 110 L 145 152 L 397 152 L 397 190"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  fill="none"
                />
                <circle cx="397" cy="190" r="7" fill="#EF4444" />
                <circle cx="397" cy="190" r="14" fill="#EF4444" opacity="0.4" className="animate-ping" />
              </g>
            )}

            {currentRoom.id === 'amphi-curie' && (
              <g>
                <path
                  d="M 50 152 L 255 152 L 255 190"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  fill="none"
                />
                <circle cx="255" cy="190" r="7" fill="#EF4444" />
                <circle cx="255" cy="190" r="14" fill="#EF4444" opacity="0.4" className="animate-ping" />
              </g>
            )}

            {currentRoom.id === 'salle-003' && (
              <g>
                <path
                  d="M 50 152 L 227 152 L 227 110"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  fill="none"
                />
                <circle cx="227" cy="110" r="7" fill="#EF4444" />
                <circle cx="227" cy="110" r="14" fill="#EF4444" opacity="0.4" className="animate-ping" />
              </g>
            )}

            {/* Compass Rose */}
            <g transform="translate(450, 40)">
              <circle cx="0" cy="0" r="12" fill="#0F172A" stroke="#475569" strokeWidth="1" />
              <text x="0" y="-3" fill="#EF4444" fontSize="8" textAnchor="middle" fontWeight="bold">N</text>
              <line x1="0" y1="2" x2="0" y2="9" stroke="#94A3B8" strokeWidth="1.5" />
            </g>
          </svg>
        </div>

        {/* Zoom Controls Overlay */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 shadow-md">
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Zoomer"
            aria-label="Zoomer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Dézoomer"
            aria-label="Dézoomer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Réinitialiser"
            aria-label="Réinitialiser"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-2 left-2 flex items-center gap-3 bg-slate-900/85 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-slate-200">Destination</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-sky-400" />
            <span>Itinéraire</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-blue-600" />
            <span>Votre salle</span>
          </div>
        </div>
      </div>
    </div>
  );
};
