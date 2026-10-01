import React, { useState } from 'react';
import { KOTLIN_PROJECT_FILES, KotlinFile } from '../data/kotlinCodeSnippets';
import { Check, Copy, Download, FileCode, Folder, Terminal, Sparkles, X } from 'lucide-react';

interface KotlinCodeViewerProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const KotlinCodeViewer: React.FC<KotlinCodeViewerProps> = ({ onClose, isModal = false }) => {
  const [selectedFile, setSelectedFile] = useState<KotlinFile>(KOTLIN_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedFile.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={`flex flex-col h-full bg-slate-950 text-slate-100 ${isModal ? 'p-4 sm:p-6' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            KT
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              Code Source Android Natif (Kotlin + Jetpack Compose)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                100% Local / Client
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Architecture Material 3, Navigation Compose, StateFlow et Canvas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
            title="Copier le code actuel"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
            title="Télécharger le fichier .kt"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Télécharger</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* File Explorer Sidebar */}
        <div className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto">
          <div className="text-[11px] font-semibold uppercase text-slate-400 px-2 py-1 tracking-wider hidden md:block">
            Fichiers du Projet
          </div>
          {KOTLIN_PROJECT_FILES.map(file => {
            const isSelected = selectedFile.name === file.name;
            return (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left transition-colors whitespace-nowrap md:whitespace-normal w-full ${
                  isSelected
                    ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileCode className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                <div className="truncate">
                  <div className="truncate font-mono">{file.name}</div>
                  <div className="text-[10px] text-slate-400 truncate hidden md:block">
                    {file.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Code Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>{selectedFile.path}</span>
            <span>Kotlin / Jetpack Compose</span>
          </div>

          <pre className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 leading-relaxed selection:bg-blue-500/30">
            <code>{selectedFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
