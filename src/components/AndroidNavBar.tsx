import React from 'react';
import { Compass, Building2, Bookmark, Code2 } from 'lucide-react';

export type TabType = 'home' | 'campus' | 'favorites' | 'code';

interface AndroidNavBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  favoritesCount: number;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  currentTab,
  onTabChange,
  favoritesCount,
}) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: 'Salles',
      icon: Compass,
    },
    {
      id: 'campus' as TabType,
      label: 'Bâtiments',
      icon: Building2,
    },
    {
      id: 'favorites' as TabType,
      label: 'Favoris',
      icon: Bookmark,
      badge: favoritesCount > 0 ? favoritesCount : undefined,
    },
    {
      id: 'code' as TabType,
      label: 'Code Kotlin',
      icon: Code2,
      badgeText: 'Jetpack',
    },
  ];

  return (
    <div className="flex-shrink-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-3 py-1.5 z-30 select-none">
      <div className="grid grid-cols-4 max-w-md mx-auto">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center py-1 relative group focus:outline-none"
            >
              {/* Material 3 active pill background */}
              <div
                className={`relative px-4 py-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />

                {/* Badge count */}
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}

                {/* Badge text */}
                {tab.badgeText && !isActive && (
                  <span className="absolute -top-1 -right-2 text-[8px] px-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {tab.badgeText}
                  </span>
                )}
              </div>

              {/* Tab label */}
              <span
                className={`text-[10px] mt-0.5 tracking-tight font-medium transition-colors ${
                  isActive ? 'text-blue-400 font-semibold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
