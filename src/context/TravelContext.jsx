import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialTrips, initialSpots, initialUser, initialSettings, travelTips } from '../mockData/initialData';
import { rtdb } from '../services/firebase';
import { ref, onValue, set } from 'firebase/database';

const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('trips'); // 'trips' | 'wishlist' | 'map' | 'dresscode' | 'account' | 'report'
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [tripViewMode, setTripViewMode] = useState('list'); // 'list' | 'detail'

  // Trips State
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('jelajah_trips');
    return saved ? JSON.parse(saved) : initialTrips;
  });

  // Spots State
  const [spots, setSpots] = useState(() => {
    const saved = localStorage.getItem('jelajah_spots');
    return saved ? JSON.parse(saved) : initialSpots;
  });

  // Registered & Pending Users State (for Admin Approval)
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('moccamana_users_list');
    return saved ? JSON.parse(saved) : [
      { id: 'u-1', username: 'ilprad', email: 'ilprad@moccamana.app', role: 'admin', status: 'approved', registeredAt: '11 Agt 2026' }
    ];
  });

  // User State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('jelajah_user');
    const loadedUser = saved ? JSON.parse(saved) : {
      name: 'ilprad',
      email: 'ilprad@moccamana.app',
      phone: '+62 812-3456-7890',
      bio: 'Administrator Moccamana Travel Planner ☕',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: 'admin',
      isLoggedIn: false
    };
    return { ...loadedUser, role: 'admin', isLoggedIn: false }; // Paksa login page aktif saat start
  });

  // Realtime Firebase Synchronization
  useEffect(() => {
    // 1. Sync Trips from Firebase
    const tripsRef = ref(rtdb, 'moccamana_trips');
    const unsubTrips = onValue(tripsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTrips(data);
      }
    });

    // 2. Sync UsersList from Firebase
    const usersRef = ref(rtdb, 'moccamana_users');
    const unsubUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let parsedList = [];
        if (typeof data === 'object') {
          parsedList = Object.values(data);
        } else if (Array.isArray(data)) {
          parsedList = data;
        }
        if (parsedList.length > 0) {
          setUsersList(parsedList);
        }
      }
    });

    // 3. Sync Spots from Firebase
    const spotsRef = ref(rtdb, 'moccamana_spots');
    const unsubSpots = onValue(spotsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSpots(data);
      }
    });

    return () => {
      unsubTrips();
      unsubUsers();
      unsubSpots();
    };
  }, []);

  // Write changes to Firebase & LocalStorage
  useEffect(() => {
    localStorage.setItem('jelajah_trips', JSON.stringify(trips));
    try {
      set(ref(rtdb, 'moccamana_trips'), trips);
    } catch (e) {
      console.error('Firebase sync error:', e);
    }
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('moccamana_users_list', JSON.stringify(usersList));
    try {
      set(ref(rtdb, 'moccamana_users'), usersList);
    } catch (e) {
      console.error('Firebase sync error:', e);
    }
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('jelajah_spots', JSON.stringify(spots));
    try {
      set(ref(rtdb, 'moccamana_spots'), spots);
    } catch (e) {
      console.error('Firebase sync error:', e);
    }
  }, [spots]);

  // Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('jelajah_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Mascot State
  const [mascotVisible, setMascotVisible] = useState(false);
  const [mascotBubble, setMascotBubble] = useState('');
  const [mascotEmotion, setMascotEmotion] = useState('😊');

  // Frame Simulation Toggle (Auto-disable mockup frame on actual mobile devices)
  const [isMobileFrame, setIsMobileFrame] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768; // Aktifkan frame jika di PC/Laptop, matikan di HP sungguhan
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobileFrame(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('jelajah_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('jelajah_spots', JSON.stringify(spots));
  }, [spots]);

  useEffect(() => {
    localStorage.setItem('jelajah_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('jelajah_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('moccamana_users_list', JSON.stringify(usersList));
  }, [usersList]);

  // Selected Trip
  const selectedTrip = selectedTripId ? (trips.find(t => t.id === selectedTripId) || null) : null;

  // Trip Actions
  const addTrip = (newTripData) => {
    const newTrip = {
      id: `trip-${Date.now()}`,
      title: newTripData.title || 'Perjalanan Baru',
      destination: newTripData.destination || 'Indonesia',
      weather: { location: newTripData.destination || 'Sukabumi', temp: '27°C', condition: 'Cerah' },
      startDate: newTripData.startDate || new Date().toISOString().split('T')[0],
      endDate: newTripData.endDate || new Date().toISOString().split('T')[0],
      budget: Number(newTripData.budget) || 1000000,
      spent: 0,
      status: 'Direncanakan',
      coverImage: newTripData.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      description: newTripData.description || '',
      shareCode: `TRIP-${Math.floor(1000 + Math.random() * 9000)}`,
      collaborators: [],
      activities: [],
      wishlist: [],
      dresscode: { 1: { theme: 'Casual Traveler', color: 'White & Blue', notes: 'Pakaian santai adem untuk perjalanan hari pertama.' } }
    };
    setTrips([newTrip, ...trips]);
    setSelectedTripId(newTrip.id);
  };

  const updateTrip = (tripId, updatedFields) => {
    setTrips(trips.map(t => t.id === tripId ? { ...t, ...updatedFields } : t));
  };

  const updateTripWeather = (tripId, weatherObj) => {
    setTrips(trips.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          weather: weatherObj
        };
      }
      return t;
    }));
  };

  const deleteTrip = (tripId) => {
    setTrips(trips.filter(t => t.id !== tripId));
    if (selectedTripId === tripId) {
      const remaining = trips.filter(t => t.id !== tripId);
      setSelectedTripId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const addActivityToTrip = (tripId, activityData) => {
    const newActivity = {
      id: `act-${Date.now()}`,
      day: Number(activityData.day) || 1,
      time: activityData.time || '10:00',
      title: activityData.title || 'Aktivitas Baru',
      category: activityData.category || 'Alam',
      cost: Number(activityData.cost) || 0,
      realCost: Number(activityData.realCost ?? activityData.cost) || 0,
      countTime: activityData.countTime !== false,
      gmapsUrl: activityData.gmapsUrl || '',
      lat: Number(activityData.lat) || -8.6212,
      lng: Number(activityData.lng) || 115.0868,
      notes: activityData.notes || ''
    };

    setTrips(trips.map(t => {
      if (t.id === tripId) {
        const updatedActivities = [...t.activities, newActivity];
        const newSpent = updatedActivities.reduce((acc, curr) => acc + (curr.cost || 0), 0);
        return {
          ...t,
          activities: updatedActivities,
          spent: newSpent
        };
      }
      return t;
    }));
  };

  const duplicateActivityInTrip = (tripId, activityId) => {
    setTrips(trips.map(t => {
      if (t.id === tripId) {
        const targetAct = t.activities.find(a => a.id === activityId);
        if (!targetAct) return t;

        const duplicatedAct = {
          ...targetAct,
          id: `act-${Date.now()}`,
          title: `${targetAct.title} (Salinan)`
        };

        const updatedActivities = [...t.activities, duplicatedAct];
        const newSpent = updatedActivities.reduce((acc, curr) => acc + (curr.cost || 0), 0);
        return {
          ...t,
          activities: updatedActivities,
          spent: newSpent
        };
      }
      return t;
    }));
  };

  const updateActivityInTrip = (tripId, activityId, updatedData) => {
    setTrips(trips.map(t => {
      if (t.id === tripId) {
        const updatedActivities = t.activities.map(a =>
          a.id === activityId
            ? {
                ...a,
                ...updatedData,
                cost: Number(updatedData.cost) || 0,
                realCost: Number(updatedData.realCost ?? updatedData.cost) || 0,
                lat: Number(updatedData.lat) || a.lat,
                lng: Number(updatedData.lng) || a.lng,
                countTime: updatedData.countTime !== false
              }
            : a
        );
        const newSpent = updatedActivities.reduce((acc, curr) => acc + (curr.cost || 0), 0);
        return {
          ...t,
          activities: updatedActivities,
          spent: newSpent
        };
      }
      return t;
    }));
  };

  const updateActivityRealCost = (tripId, activityId, realCostValue) => {
    setTrips(trips.map(t => {
      if (t.id === tripId) {
        const updatedActivities = t.activities.map(a =>
          a.id === activityId
            ? { ...a, realCost: Number(realCostValue) || 0 }
            : a
        );
        return {
          ...t,
          activities: updatedActivities
        };
      }
      return t;
    }));
  };

  const deleteActivityFromTrip = (tripId, activityId) => {
    setTrips(trips.map(t => {
      if (t.id === tripId) {
        const updatedActivities = t.activities.filter(a => a.id !== activityId);
        const newSpent = updatedActivities.reduce((acc, curr) => acc + (curr.cost || 0), 0);
        return {
          ...t,
          activities: updatedActivities,
          spent: newSpent
        };
      }
      return t;
    }));
  };

  // Wishlist Actions
  const addWishlistProposal = (tripId, proposal) => {
    const newWl = {
      id: `wl-${Date.now()}`,
      day: Number(proposal.day) || 1,
      title: proposal.title,
      cost: Number(proposal.cost) || 0,
      votes: 1,
      votedBy: [user.email || user.name || 'self'],
      proposedBy: user.name || 'Anda',
      notes: proposal.notes || '',
      gmapsUrl: proposal.gmapsUrl || '',
      lat: Number(proposal.lat) || -8.6212,
      lng: Number(proposal.lng) || 115.0868,
      comments: []
    };

    setTrips(trips.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          wishlist: [...(t.wishlist || []), newWl]
        };
      }
      return t;
    }));
  };

  const voteWishlist = (tripId, wishlistId) => {
    const currentUserId = user.email || user.name || 'self';
    setTrips(trips.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          wishlist: (t.wishlist || []).map(w => {
            if (w.id === wishlistId) {
              const votedBy = w.votedBy || [];
              const hasVoted = votedBy.includes(currentUserId);
              if (hasVoted) {
                return {
                  ...w,
                  votes: Math.max(0, (w.votes || 1) - 1),
                  votedBy: votedBy.filter(u => u !== currentUserId)
                };
              } else {
                return {
                  ...w,
                  votes: (w.votes || 0) + 1,
                  votedBy: [...votedBy, currentUserId]
                };
              }
            }
            return w;
          })
        };
      }
      return t;
    }));
  };

  const addWishlistComment = (tripId, wishlistId, commentText) => {
    if (!commentText.trim()) return;
    setTrips(trips.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          wishlist: (t.wishlist || []).map(w => {
            if (w.id === wishlistId) {
              const newComment = {
                id: `c-${Date.now()}`,
                user: user.name || 'Budi Pratama',
                avatar: user.avatar,
                text: commentText,
                time: 'Baru saja'
              };
              return {
                ...w,
                comments: [...(w.comments || []), newComment]
              };
            }
            return w;
          })
        };
      }
      return t;
    }));
  };

  const acceptWishlistToItinerary = (tripId, wishlistId, timeStart = '10:00') => {
    const targetTrip = trips.find(t => t.id === tripId);
    if (!targetTrip) return;
    const wlItem = (targetTrip.wishlist || []).find(w => w.id === wishlistId);
    if (!wlItem) return;

    addActivityToTrip(tripId, {
      day: wlItem.day,
      time: timeStart,
      title: wlItem.title,
      category: 'Destinasi',
      cost: wlItem.cost,
      realCost: wlItem.cost,
      countTime: true,
      gmapsUrl: wlItem.gmapsUrl || '',
      lat: wlItem.lat || -8.6212,
      lng: wlItem.lng || 115.0868,
      notes: `Diterima dari Wishlist (${wlItem.proposedBy}): ${wlItem.notes || ''}`
    });

    setTrips(trips.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          wishlist: (t.wishlist || []).filter(w => w.id !== wishlistId)
        };
      }
      return t;
    }));
  };

  // Dresscode Actions
  const updateDresscode = (tripId, key, dresscodeData) => {
    setTrips(trips.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          dresscode: {
            ...(t.dresscode || {}),
            [key]: dresscodeData
          }
        };
      }
      return t;
    }));
  };

  // Spot Actions
  const addSpot = (spotData) => {
    const newSpot = {
      id: `spot-${Date.now()}`,
      name: spotData.name || 'Tempat Baru',
      category: spotData.category || 'Alam',
      destination: spotData.destination || 'Indonesia',
      rating: spotData.rating || 4.5,
      price: Number(spotData.price) || 0,
      lat: Number(spotData.lat) || -8.6212,
      lng: Number(spotData.lng) || 115.0868,
      image: spotData.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      description: spotData.description || '',
      address: spotData.address || ''
    };
    setSpots([newSpot, ...spots]);
  };

  // Collaborator Actions
  const addCollaborator = (tripId, collabData) => {
    setTrips(trips.map(t => {
      if (t.id === tripId) {
        const newCollab = {
          id: `u-${Date.now()}`,
          name: collabData.name || collabData.email.split('@')[0],
          email: collabData.email,
          role: collabData.role || 'Lihat Saja',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${collabData.email}`
        };
        return {
          ...t,
          collaborators: [...t.collaborators, newCollab]
        };
      }
      return t;
    }));
  };

  // User Actions
  const updateUser = (updatedInfo) => {
    setUser({ ...user, ...updatedInfo });
  };

  const loginUser = (email, name) => {
    const isIlprad = email.includes('ilprad') || name === 'ilprad';
    setUser({
      name: name || 'ilprad',
      email: email || 'ilprad@moccamana.app',
      phone: '+62 812-3456-7890',
      bio: isIlprad ? 'Administrator Moccamana Travel Planner ☕' : 'Pengguna Terverifikasi Moccamana ✈️',
      avatar: isIlprad
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      role: isIlprad ? 'admin' : 'user',
      isLoggedIn: true
    });
  };

  const registerNewUser = (username) => {
    const userId = `u-${Date.now()}`;
    const newUser = {
      id: userId,
      username: username,
      email: `${username}@moccamana.app`,
      role: 'user',
      status: 'pending',
      registeredAt: 'Baru saja'
    };
    
    // 1. Update State Lokal
    setUsersList(prevList => [newUser, ...prevList]);

    // 2. Direct write per-user node to Firebase Realtime Database
    try {
      set(ref(rtdb, `moccamana_users/${userId}`), newUser);
    } catch (err) {
      console.error('Firebase register error:', err);
    }
  };

  const approveUser = (userId) => {
    const targetUser = usersList.find(u => u.id === userId);
    if (!targetUser) return;
    const updatedUser = { ...targetUser, status: 'approved' };

    setUsersList(usersList.map(u => u.id === userId ? updatedUser : u));
    try {
      set(ref(rtdb, `moccamana_users/${userId}`), updatedUser);
    } catch (err) {
      console.error('Firebase approve error:', err);
    }
  };

  const rejectUser = (userId) => {
    setUsersList(usersList.filter(u => u.id !== userId));
    try {
      set(ref(rtdb, `moccamana_users/${userId}`), null); // Hapus dari Firebase
    } catch (err) {
      console.error('Firebase reject error:', err);
    }
  };

  const logoutUser = () => {
    setUser({ ...user, isLoggedIn: false });
  };

  // Settings Actions
  const toggleNotification = (key) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
  };

  const toggleDarkMode = () => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        darkMode: !settings.appearance.darkMode
      }
    });
  };

  const syncDataCloud = () => {
    const nowStr = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB';
    setSettings({
      ...settings,
      sync: {
        ...settings.sync,
        lastSynced: nowStr,
        status: 'Tersinkronisasi'
      }
    });
  };

  // Mascot Actions
  const petMascot = () => {
    setMascotEmotion('😍');
    setMascotBubble('Woof! Terima kasih sudah mengelus Mocca! Semoga harimu menyenangkan! 🐾❤️');
    setTimeout(() => setMascotEmotion('😊'), 4000);
  };

  const triggerMascotTip = () => {
    const randomTip = travelTips[Math.floor(Math.random() * travelTips.length)];
    setMascotEmotion('💡');
    setMascotBubble(`Mocca Tips: ${randomTip}`);
    setTimeout(() => setMascotEmotion('😊'), 5000);
  };

  return (
    <TravelContext.Provider value={{
      activeTab,
      setActiveTab,
      selectedTripId,
      setSelectedTripId,
      selectedTrip,
      tripViewMode,
      setTripViewMode,
      trips,
      addTrip,
      updateTrip,
      updateTripWeather,
      deleteTrip,
      addActivityToTrip,
      duplicateActivityInTrip,
      updateActivityInTrip,
      updateActivityRealCost,
      deleteActivityFromTrip,
      addWishlistProposal,
      voteWishlist,
      addWishlistComment,
      acceptWishlistToItinerary,
      updateDresscode,
      spots,
      addSpot,
      addCollaborator,
      user,
      updateUser,
      loginUser,
      logoutUser,
      usersList,
      approveUser,
      rejectUser,
      registerNewUser,
      settings,
      toggleNotification,
      toggleDarkMode,
      syncDataCloud,
      isMobileFrame,
      setIsMobileFrame,
      mascotVisible,
      setMascotVisible,
      mascotBubble,
      setMascotBubble,
      mascotEmotion,
      petMascot,
      triggerMascotTip
    }}>
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => useContext(TravelContext);
