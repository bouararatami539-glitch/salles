import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, BatteryMedium, Signal, Sparkles } from 'lucide-react';

interface AndroidDeviceShellProps {
  children: React.ReactNode;
  onOpenInstallModal?: () => void;
}

export const AndroidDeviceShell: React.FC<AndroidDeviceShellProps> = ({ children, onOpenInstallModal }) => {
  const [deviceMode, setDeviceMode] = useState<'phone' | 'fullscreen'>('phone');
  const [currentTime, setCurrentTime] = useState('12:30');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start p-2 sm:p-4 text-slate-100">
      {/* Top Controls Bar */}
      <header className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-2 py-2 px-3 sm:px-4 mb-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-tight flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            CampusNav Android
          </span>
          <span className="text-slate-500 hidden sm:inline">·</span>
          <span className="text-slate-400 hidden sm:inline">
            Kotlin / Jetpack Compose & Material Design 3
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-200" />
              <span>Tester sur mon téléphone (APK)</span>
            </button>
          )}

          {/* View Switcher: Phone simulator vs Responsive full view */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDeviceMode('phone')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                deviceMode === 'phone'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Format Mobile</span>
            </button>
            <button
              onClick={() => setDeviceMode('fullscreen')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                deviceMode === 'fullscreen'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Plein Écran</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      {deviceMode === 'phone' ? (
        /* Realistic Android Phone Device Simulator */
        <div className="relative w-full max-w-[420px] h-[840px] max-h-[calc(100vh-80px)] rounded-[40px] bg-slate-900 border-[7px] border-slate-800 shadow-2xl shadow-blue-950/40 flex flex-col overflow-hidden ring-1 ring-slate-700/50">
          {/* Android Status Bar */}
          <div className="flex-shrink-0 h-8 px-6 bg-slate-900 flex items-center justify-between text-xs text-slate-400 select-none z-40 border-b border-slate-800/40">
            {/* Clock */}
            <span className="font-semibold text-white text-[11px]">{currentTime}</span>

            {/* Camera Punch Hole */}
            <div className="w-3 h-3 rounded-full bg-black border border-slate-800 shadow-inner" />

            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-mono text-slate-300">89%</span>
                <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Phone Content Screen */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 relative">
            {children}
          </div>

          {/* Android Gesture Navigation Bar Pill */}
          <div className="flex-shrink-0 h-5 bg-slate-900 flex items-center justify-center z-40 select-none">
            <div className="w-28 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      ) : (
        /* Fullscreen Web Container */
        <div className="w-full max-w-5xl h-[calc(100vh-90px)] rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
};
