import React from 'react';
import { useTravel } from '../../context/TravelContext';
import { Calendar, Heart, Map, Shirt, User, Wallet } from 'lucide-react';

export const BottomNav = () => {
  const { activeTab, setActiveTab, settings } = useTravel();
  const isDark = settings.appearance.darkMode;

  const navItems = [
    { id: 'trips', label: 'Rencana', icon: Calendar },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'map', label: 'Peta', icon: Map },
    { id: 'dresscode', label: 'Dresscode', icon: Shirt },
    { id: 'report', label: 'Report', icon: Wallet },
    { id: 'account', label: 'Akun', icon: User },
  ];

  return (
    <nav
      className="backdrop-blur-md px-2 py-1.5 z-30 shrink-0"
      style={{
        background: 'var(--bg-nav)',
        borderTop: '1px solid var(--border-primary)',
      }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200"
              style={{
                background: isActive ? 'var(--accent-bg)' : 'transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                fontWeight: isActive ? '700' : '500',
              }}
            >
              <Icon
                className="w-5 h-5"
                style={{
                  strokeWidth: isActive ? 2.5 : 1.8,
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                }}
              />
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
