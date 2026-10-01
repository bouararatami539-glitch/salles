import React, { useState } from 'react';
import { BUILDINGS_INFO } from '../data/campusData';
import { Room, BuildingType } from '../types/campus';
import { Building, MapPin, Clock, ArrowRight, Layers, Users, Sparkles, Check } from 'lucide-react';

interface CampusBuildingsViewProps {
  rooms: Room[];
  onSelectRoom: (roomId: string) => void;
}

export const CampusBuildingsView: React.FC<CampusBuildingsViewProps> = ({ rooms, onSelectRoom }) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<BuildingType>('Bâtiment Central');

  const selectedBuildingInfo = BUILDINGS_INFO.find(b => b.id === selectedBuildingId) || BUILDINGS_INFO[0];
  const buildingRooms = rooms.filter(r => r.building === selectedBuildingId);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <h1 className="text-base font-bold text-white flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-400" />
          Plan Général du Campus
        </h1>
        <p className="text-xs text-slate-400">
          Explorez les 3 pôles principaux et leurs infrastructures
        </p>

        {/* Building Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3">
          {BUILDINGS_INFO.map(b => {
            const isSelected = selectedBuildingId === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBuildingId(b.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700/80 hover:bg-slate-700'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
                <span>{b.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5 max-w-3xl mx-auto w-full pb-24">
        {/* Campus 2D Bird's-eye Map Preview */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 shadow-lg overflow-hidden relative">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span>Repérage Spatial du Campus</span>
            <span className="text-[11px] text-blue-400">Cliquez sur un pôle</span>
          </div>

          <svg viewBox="0 0 500 220" className="w-full h-auto rounded-xl bg-[#0F172A] border border-slate-800">
            {/* Campus ground paths */}
            <rect x="0" y="0" width="500" height="220" fill="#0B132B" />
            
            {/* Walkways / Esplanades */}
            <path d="M 0 110 L 500 110" stroke="#1E293B" strokeWidth="24" />
            <path d="M 250 0 L 250 220" stroke="#1E293B" strokeWidth="24" />
            <circle cx="250" cy="110" r="35" fill="#1E293B" />
            <text x="250" y="114" fill="#64748B" fontSize="9" textAnchor="middle" fontWeight="bold">AGORA / TRAM</text>

            {/* Bâtiment Central Block */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedBuildingId('Bâtiment Central')}
            >
              <rect
                x="50"
                y="35"
                width="130"
                height="80"
                rx="8"
                fill={selectedBuildingId === 'Bâtiment Central' ? '#1D4ED8' : '#1E293B'}
                stroke={selectedBuildingId === 'Bâtiment Central' ? '#60A5FA' : '#334155'}
                strokeWidth={selectedBuildingId === 'Bâtiment Central' ? '2.5' : '1.5'}
              />
              <text x="115" y="70" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                BÂT. CENTRAL
              </text>
              <text x="115" y="85" fill="#93C5FD" fontSize="8" textAnchor="middle">
                Amphi A · BU · Admin
              </text>
            </g>

            {/* Bâtiment Informatique Block */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedBuildingId('Bâtiment Informatique')}
            >
              <rect
                x="320"
                y="35"
                width="140"
                height="80"
                rx="8"
                fill={selectedBuildingId === 'Bâtiment Informatique' ? '#0284C7' : '#1E293B'}
                stroke={selectedBuildingId === 'Bâtiment Informatique' ? '#38BDF8' : '#334155'}
                strokeWidth={selectedBuildingId === 'Bâtiment Informatique' ? '2.5' : '1.5'}
              />
              <text x="390" y="70" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                BÂT. INFORMATIQUE
              </text>
              <text x="390" y="85" fill="#BAE6FD" fontSize="8" textAnchor="middle">
                Salle 102 · Amphi Turing
              </text>
            </g>

            {/* Bâtiment Sciences Block */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedBuildingId('Bâtiment Sciences')}
            >
              <rect
                x="170"
                y="145"
                width="160"
                height="65"
                rx="8"
                fill={selectedBuildingId === 'Bâtiment Sciences' ? '#0D9488' : '#1E293B'}
                stroke={selectedBuildingId === 'Bâtiment Sciences' ? '#2DD4BF' : '#334155'}
                strokeWidth={selectedBuildingId === 'Bâtiment Sciences' ? '2.5' : '1.5'}
              />
              <text x="250" y="175" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                BÂT. SCIENCES
              </text>
              <text x="250" y="190" fill="#99F6E4" fontSize="8" textAnchor="middle">
                Labo Chimie · Amphi Curie
              </text>
            </g>
          </svg>
        </div>

        {/* Selected Building Details */}
        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-700 text-blue-300">
                {selectedBuildingInfo.code}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                {selectedBuildingInfo.name}
              </h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
              {selectedBuildingInfo.floorsCount}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedBuildingInfo.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-700/60">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Horaires : {selectedBuildingInfo.openingHours}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>{buildingRooms.length} salles répertoriées</span>
            </div>
          </div>

          {/* Departments */}
          <div className="pt-2">
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Pôles d'enseignement & Services
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedBuildingInfo.primaryDepartments.map((dept, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Salles disponibles dans ce bâtiment */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center justify-between">
            <span>Salles & Amphis dans {selectedBuildingId}</span>
            <span className="text-xs text-blue-400">{buildingRooms.length} salles</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {buildingRooms.map(room => (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/80 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">
                      {room.category}
                    </span>
                    <span className="text-sky-400 font-medium">{room.floor}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    {room.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {room.accessInstructions}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
                  <span>{room.capacity} places</span>
                  <span className="text-blue-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Voir plan <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
