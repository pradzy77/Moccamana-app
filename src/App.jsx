import React, { useEffect } from 'react';
import { TravelProvider, useTravel } from './context/TravelContext';
import { MobileFrame } from './components/layout/MobileFrame';
import { HeaderBar } from './components/layout/HeaderBar';
import { BottomNav } from './components/layout/BottomNav';
import { TripList } from './components/itinerary/TripList';
import { TripDetailView } from './components/itinerary/TripDetailView';
import { WishlistPanel } from './components/itinerary/WishlistPanel';
import { DresscodePanel } from './components/itinerary/DresscodePanel';
import { TotalCostPanel } from './components/itinerary/TotalCostPanel';
import { InteractiveMap } from './components/map/InteractiveMap';
import { AccountView } from './components/account/AccountView';
import { LoginPage } from './components/auth/LoginPage';

const NoTripSelectedPrompt = () => {
  const { setActiveTab, setTripViewMode } = useTravel();
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fadeIn space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
        <img 
          src="/mocca_camera_suitcase.png" 
          alt="Mocca" 
          className="w-10 h-10 object-contain drop-shadow-sm"
          onError={(e) => { e.target.src = '/mocca_happy_explorer.png'; }}
        />
      </div>
      <div className="space-y-1.5 max-w-xs">
        <h3 className="text-base font-bold text-white">Pilih Rencana Trip Terlebih Dahulu</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Silakan buka tab <span className="text-amber-400 font-semibold">Rencana</span> dan pilih salah satu rencana trip liburan Anda untuk mengakses fitur ini.
        </p>
      </div>
      <button
        onClick={() => { setActiveTab('trips'); setTripViewMode('list'); }}
        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
      >
        <span>Buka Rencana Perjalanan</span>
      </button>
    </div>
  );
};

const MainContent = () => {
  const { activeTab, tripViewMode, settings, user, selectedTrip } = useTravel();
  const isDark = settings.appearance.darkMode;

  // Apply dark-mode class to <body> so CSS global overrides work
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDark]);

  const requiresTrip = ['wishlist', 'map', 'dresscode', 'report'].includes(activeTab);

  return (
    <>
      {!user.isLoggedIn ? (
        <LoginPage />
      ) : (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          <HeaderBar />

          <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            {activeTab === 'trips' && (
              tripViewMode === 'list' ? <TripList /> : <TripDetailView />
            )}

            {requiresTrip && !selectedTrip ? (
              <NoTripSelectedPrompt />
            ) : (
              <>
                {activeTab === 'wishlist' && (
                  <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                    <WishlistPanel />
                  </div>
                )}
                {activeTab === 'map' && <InteractiveMap />}
                {activeTab === 'dresscode' && (
                  <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                    <DresscodePanel />
                  </div>
                )}
                {activeTab === 'report' && (
                  <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                    <TotalCostPanel />
                  </div>
                )}
              </>
            )}

            {activeTab === 'account' && <AccountView />}
          </main>
          <BottomNav />
        </div>
      )}
    </>
  );
};

export default function App() {
  return (
    <TravelProvider>
      <MobileFrame>
        <MainContent />
      </MobileFrame>
    </TravelProvider>
  );
}
