import React from 'react';
import { useTravel } from '../../context/TravelContext';
import { Settings, Bell, Moon, Sun, Globe, DollarSign, UserCheck, Shield, ChevronRight, Check } from 'lucide-react';

export const SettingsView = () => {
  const { settings, toggleNotification, toggleDarkMode, setLanguage, setCurrency, setActiveTab } = useTravel();

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900/60 via-slate-900 to-pink-900/40 p-4 rounded-2xl border border-rose-500/30 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-500 text-slate-950 uppercase tracking-wide">
            Fase 5
          </span>
          <span className="text-xs text-rose-300 font-medium">Konfigurasi Aplikasi</span>
        </div>
        <h2 className="text-xl font-extrabold text-white">Pengaturan</h2>
        <p className="text-xs text-slate-300 mt-0.5">Preferensi tampilan, notifikasi, dan profil pengguna.</p>
      </div>

      {/* Sub-Fitur 1: Atur Notifikasi */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-rose-400" />
          1. Atur Notifikasi
        </h3>

        <div className="space-y-2.5 divide-y divide-slate-800/80">
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs font-semibold text-slate-200">Pengingat Jadwal Perjalanan</p>
              <p className="text-[10px] text-slate-400">Pengingat H-1 dan jam berangkat itinerary</p>
            </div>
            <button
              onClick={() => toggleNotification('tripReminder')}
              className={`w-11 h-6 rounded-full transition-colors p-1 ${
                settings.notifications.tripReminder ? 'bg-rose-500' : 'bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.notifications.tripReminder ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2.5">
            <div>
              <p className="text-xs font-semibold text-slate-200">Rekomendasi Promo Wisata</p>
              <p className="text-[10px] text-slate-400">Info diskon tiket & voucher hotel terbaru</p>
            </div>
            <button
              onClick={() => toggleNotification('promoAlerts')}
              className={`w-11 h-6 rounded-full transition-colors p-1 ${
                settings.notifications.promoAlerts ? 'bg-rose-500' : 'bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.notifications.promoAlerts ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2.5">
            <div>
              <p className="text-xs font-semibold text-slate-200">Aktivitas Teman & Kolaborator</p>
              <p className="text-[10px] text-slate-400">Notifikasi saat teman mengubah rencana bersama</p>
            </div>
            <button
              onClick={() => toggleNotification('friendActivity')}
              className={`w-11 h-6 rounded-full transition-colors p-1 ${
                settings.notifications.friendActivity ? 'bg-rose-500' : 'bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.notifications.friendActivity ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Fitur 2: Ubah Profil */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-rose-400" />
          2. Ubah Profil
        </h3>

        <div
          onClick={() => setActiveTab('account')}
          className="flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl cursor-pointer transition-colors"
        >
          <div>
            <p className="text-xs font-bold text-white">Edit Informasi & Foto Profil</p>
            <p className="text-[10px] text-slate-400">Ubah nama, nomor telepon, dan bio profil Anda di menu Akun Saya</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Sub-Fitur 3: Preferensi Tampilan */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <Moon className="w-4 h-4 text-rose-400" />
          3. Preferensi Tampilan & Tema
        </h3>

        <div className="space-y-3">
          {/* Theme Selector */}
          <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl">
            <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
              {settings.appearance.darkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              Mode Tampilan (Gelap / Terang)
            </span>
            <button
              onClick={toggleDarkMode}
              className="text-xs font-bold px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30"
            >
              {settings.appearance.darkMode ? 'Mode Gelap (Dark)' : 'Mode Terang (Light)'}
            </button>
          </div>

          {/* Language Preference */}
          <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl">
            <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-rose-400" /> Bahasa Aplikasi
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              Bahasa Indonesia (ID)
            </span>
          </div>

          {/* Currency Preference */}
          <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl">
            <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Mata Uang
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              Rupiah (IDR - Rp)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
