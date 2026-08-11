import React from 'react';
import { useTravel } from '../../context/TravelContext';
import { Compass, Moon, Sun, Smartphone, Monitor, Home } from 'lucide-react';

export const HeaderBar = () => {
  const { activeTab, setActiveTab, setTripViewMode, settings, toggleDarkMode, isMobileFrame, setIsMobileFrame } = useTravel();
  const isDark = settings.appearance.darkMode;

  const getPhaseBadge = () => {
    if (isDark) {
      switch (activeTab) {
        case 'trips': return { label: 'RENCANA', name: 'Rencana Perjalanan', bg: 'rgba(6,182,212,0.15)', color: '#22d3ee', border: 'rgba(6,182,212,0.3)' };
        case 'wishlist': return { label: 'WISHLIST', name: 'Wishlist Destinasi', bg: 'rgba(244,63,94,0.15)', color: '#fb7185', border: 'rgba(244,63,94,0.3)' };
        case 'map': return { label: 'PETA', name: 'Peta Lokasi', bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'rgba(59,130,246,0.3)' };
        case 'dresscode': return { label: 'DRESSCODE', name: 'Dresscode Guide', bg: 'rgba(99,102,241,0.15)', color: '#a78bfa', border: 'rgba(99,102,241,0.3)' };
        case 'account': return { label: 'AKUN', name: 'Akun Saya', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' };
        case 'report': return { label: 'REPORT', name: 'Total Cost & Report', bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)' };
        default: return { label: 'UTAMA', name: 'Perencanaan', bg: 'rgba(51,65,85,0.4)', color: '#94a3b8', border: 'rgba(51,65,85,0.6)' };
      }
    } else {
      // Light mode — warm mocha tones
      switch (activeTab) {
        case 'trips': return { label: 'RENCANA', name: 'Rencana Perjalanan', bg: 'rgba(176,122,78,0.15)', color: '#8b5e3c', border: 'rgba(176,122,78,0.35)' };
        case 'wishlist': return { label: 'WISHLIST', name: 'Wishlist Destinasi', bg: 'rgba(180,80,80,0.12)', color: '#9b3a3a', border: 'rgba(180,80,80,0.3)' };
        case 'map': return { label: 'PETA', name: 'Peta Lokasi', bg: 'rgba(58,107,158,0.12)', color: '#3a6b9e', border: 'rgba(58,107,158,0.3)' };
        case 'dresscode': return { label: 'DRESSCODE', name: 'Dresscode Guide', bg: 'rgba(110,80,160,0.12)', color: '#6e50a0', border: 'rgba(110,80,160,0.3)' };
        case 'account': return { label: 'AKUN', name: 'Akun Saya', bg: 'rgba(176,122,46,0.12)', color: '#9a6c20', border: 'rgba(176,122,46,0.3)' };
        case 'report': return { label: 'REPORT', name: 'Total Cost & Report', bg: 'rgba(74,124,89,0.12)', color: '#4a7c59', border: 'rgba(74,124,89,0.3)' };
        default: return { label: 'UTAMA', name: 'Perencanaan', bg: 'rgba(176,122,78,0.1)', color: '#8b5e3c', border: 'rgba(176,122,78,0.25)' };
      }
    }
  };

  const badge = getPhaseBadge();

  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-lg"
      style={{
        background: 'var(--bg-header)',
        borderBottom: '1px solid var(--border-primary)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <img 
          src="/mocca_happy_explorer.png" 
          alt="Mocca" 
          className="w-10 h-10 object-contain drop-shadow-sm shrink-0 hover:scale-110 transition-transform"
          onError={(e) => { e.target.src = '/mocca_logo.png'; }}
        />
        <div>
          <h1
            className="font-extrabold text-base tracking-tight flex items-center gap-1.5"
            style={{ color: 'var(--text-primary)' }}
          >
            Moccamana
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Home Button */}
        <button
          onClick={() => { setActiveTab('trips'); setTripViewMode('list'); }}
          className="p-2 rounded-xl border transition-colors"
          style={{
            background: activeTab === 'trips' ? 'var(--accent-bg)' : 'var(--bg-card)',
            borderColor: activeTab === 'trips' ? 'var(--accent-border)' : 'var(--border-primary)',
          }}
          title="Beranda"
        >
          <Home className="w-4 h-4" style={{ color: activeTab === 'trips' ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl border transition-colors"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-muted)'
          }}
          title="Ganti Tema"
        >
          {isDark
            ? <Sun className="w-4 h-4" style={{ color: '#fbbf24' }} />
            : <Moon className="w-4 h-4" style={{ color: '#8b5e3c' }} />
          }
        </button>

        <button
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          className="p-2 rounded-xl border transition-colors hidden md:flex items-center gap-1 text-xs"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-muted)'
          }}
          title="Toggle Tampilan Frame Mobile / Layar Penuh"
        >
          {isMobileFrame
            ? <Monitor className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            : <Smartphone className="w-4 h-4" style={{ color: 'var(--emerald)' }} />
          }
        </button>
      </div>
    </header>
  );
};
