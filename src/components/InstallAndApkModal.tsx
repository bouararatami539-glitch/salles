import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateAndroidProjectZip } from '../utils/zipGenerator';
import {
  Smartphone,
  Download,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  X,
  FileArchive,
  Terminal,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  Globe,
  Share2,
  CloudLightning,
  Cpu,
} from 'lucide-react';

interface InstallAndApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAndApkModal: React.FC<InstallAndApkModalProps> = ({ isOpen, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  // The Shared App URL for anyone with the link
  const sharedAppUrl = 'https://ais-pre-rnvt6q5uw2qbhqcfpnhlar-599821509267.europe-west2.run.app';

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(sharedAppUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsGeneratingZip(true);
      const blob = await generateAndroidProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CampusNav-Android-Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Erreur génération ZIP:', err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <CloudLightning className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Générer et Installer l'APK Android
              </h2>
              <p className="text-xs text-slate-400">
                Services en ligne gratuits (sans installer Android Studio)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* SECTION 1: WEBSITES THAT GENERATE APK IN 1 CLICK */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-950/40 via-blue-950/30 to-slate-900 border border-indigo-500/40 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Sites web gratuits pour générer le .APK
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 100% en ligne
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              Il existe d'excellents services web en ligne qui prennent votre projet ou le lien et compilent directement le fichier <strong>.APK</strong> pour vous :
            </p>

            {/* List of online generators */}
            <div className="space-y-3">
              {/* 1. PWABuilder (Microsoft) */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/60 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                    <h4 className="text-xs font-bold text-white">PWABuilder (par Microsoft) — Recommandé</h4>
                  </div>
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Ouvrir le site <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                  Collez simplement le lien de l'application (<code className="text-emerald-300 select-all">{sharedAppUrl}</code>), cliquez sur <strong>Start</strong> puis <strong>Package for Stores &gt; Android &gt; Generate APK</strong>. Le site compile et vous télécharge directement l'APK !
                </p>
              </div>

              {/* 2. WebIntoApp */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/60 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                    <h4 className="text-xs font-bold text-white">WebIntoApp.com</h4>
                  </div>
                  <a
                    href="https://www.webintoapp.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Ouvrir le site <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                  Entrez l'URL, nommez votre application <strong>CampusNav</strong>, choisissez une icône et cliquez sur <strong>Make App</strong> pour télécharger le fichier <code>.apk</code> en 1 minute.
                </p>
              </div>

              {/* 3. GitHub Actions Cloud Compiler */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/60 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-700 text-white font-bold text-xs flex items-center justify-center">3</span>
                    <h4 className="text-xs font-bold text-white">GitHub Actions (Compiler le code Kotlin gratuitement)</h4>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-medium">Inclus dans le ZIP</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                  Le projet ZIP contient un script <strong>GitHub Actions</strong> prêt à l'emploi. Déposez simplement le projet sur votre compte GitHub gratuit : les serveurs cloud de GitHub compilent automatiquement le code Kotlin et vous fournissent le fichier <code>app-debug.apk</code> dans l'onglet <em>Actions</em> !
                </p>
              </div>
            </div>

            {/* Quick copy link for those sites */}
            <div className="pt-2 border-t border-slate-800">
              <label className="text-[11px] text-slate-400 font-medium">Lien à coller sur PWABuilder ou WebIntoApp :</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  readOnly
                  value={sharedAppUrl}
                  className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono select-all truncate"
                />
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors shrink-0 shadow-sm"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier le lien</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: DOWNLOAD SOURCE ZIP FOR COMPILATION */}
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white">
                  Télécharger le code source Android (.zip)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Avec script GitHub Actions & Gradle</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Téléchargez l'archive complète pour la donner à un compilateur en ligne (GitHub Actions, Bitrise, AppCircle) ou l'ouvrir dans Android Studio :
            </p>

            <button
              onClick={handleDownloadZip}
              disabled={isGeneratingZip}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-[0.98]"
            >
              {isGeneratingZip ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Création du fichier ZIP...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Projet téléchargé ! (CampusNav-Android-Project.zip)</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Télécharger CampusNav-Android-Project.zip</span>
                </>
              )}
            </button>
          </div>

          {/* SECTION 3: QR CODE & MOBILE INSTALLATION */}
          <div className="rounded-2xl bg-slate-800/40 border border-slate-700/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  Ou installez directement en 10 secondes depuis votre téléphone
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shrink-0">
                <QRCodeSVG value={sharedAppUrl} size={64} level="M" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Scannez simplement ce QR Code avec l'appareil photo de votre téléphone Android et appuyez sur <strong>« Installer l'application »</strong> dans Chrome.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tous les services listés sont 100% gratuits</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
