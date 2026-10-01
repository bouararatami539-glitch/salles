import React, { useState, useEffect } from 'react';
import { INITIAL_ROOMS } from './data/campusData';
import { Room } from './types/campus';
import { HomeScreen } from './components/HomeScreen';
import { RoomDetailScreen } from './components/RoomDetailScreen';
import { CampusBuildingsView } from './components/CampusBuildingsView';
import { FavoritesScreen } from './components/FavoritesScreen';
import { KotlinCodeViewer } from './components/KotlinCodeViewer';
import { AndroidNavBar, TabType } from './components/AndroidNavBar';
import { AndroidDeviceShell } from './components/AndroidDeviceShell';
import { InstallAndApkModal } from './components/InstallAndApkModal';

export default function App() {
  const [rooms] = useState<Room[]>(INITIAL_ROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('campusnav_favorites');
      return saved ? JSON.parse(saved) : ['amphi-a', 'salle-102'];
    } catch {
      return ['amphi-a', 'salle-102'];
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('campusnav_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const handleToggleFavorite = (roomId: string) => {
    setFavorites(prev =>
      prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId]
    );
  };

  const handleRemoveFavorite = (roomId: string) => {
    setFavorites(prev => prev.filter(id => id !== roomId));
  };

  const handleClearFavorites = () => {
    setFavorites([]);
  };

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  const handleBackFromDetail = () => {
    setSelectedRoomId(null);
  };

  const currentRoom = selectedRoomId ? rooms.find(r => r.id === selectedRoomId) || null : null;

  return (
    <>
      <AndroidDeviceShell onOpenInstallModal={() => setIsInstallModalOpen(true)}>
        {/* If a room is selected, display RoomDetailScreen */}
        {currentRoom ? (
          <RoomDetailScreen
            room={currentRoom}
            onBack={handleBackFromDetail}
            onSelectRoom={handleSelectRoom}
            isFavorite={favorites.includes(currentRoom.id)}
            onToggleFavorite={handleToggleFavorite}
            allRooms={rooms}
          />
        ) : (
          /* Otherwise display the screen corresponding to the active tab */
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <div className="flex-1 overflow-hidden">
              {currentTab === 'home' && (
                <HomeScreen
                  rooms={rooms}
                  onSelectRoom={handleSelectRoom}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenInstallModal={() => setIsInstallModalOpen(true)}
                />
              )}

              {currentTab === 'campus' && (
                <CampusBuildingsView
                  rooms={rooms}
                  onSelectRoom={handleSelectRoom}
                />
              )}

              {currentTab === 'favorites' && (
                <FavoritesScreen
                  favoriteIds={favorites}
                  allRooms={rooms}
                  onSelectRoom={handleSelectRoom}
                  onRemoveFavorite={handleRemoveFavorite}
                  onClearAll={handleClearFavorites}
                />
              )}

              {currentTab === 'code' && (
                <KotlinCodeViewer />
              )}
            </div>

            {/* Android NavigationBar bottom bar */}
            <AndroidNavBar
              currentTab={currentTab}
              onTabChange={tab => {
                setCurrentTab(tab);
                setSelectedRoomId(null);
              }}
              favoritesCount={favorites.length}
            />
          </div>
        )}
      </AndroidDeviceShell>

      {/* Modal: Tester sur mon téléphone (APK & WebAPK) */}
      <InstallAndApkModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </>
  );
}
