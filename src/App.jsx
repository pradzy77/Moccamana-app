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

const MainContent = () => {
  const { activeTab, tripViewMode, settings, user } = useTravel();
  const isDark = settings.appearance.darkMode;

  // Apply dark-mode class to <body> so CSS global overrides work
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDark]);

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
            {activeTab === 'account' && <AccountView />}
            {activeTab === 'report' && (
              <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                <TotalCostPanel />
              </div>
            )}
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
