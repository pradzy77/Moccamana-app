import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { Plus, Search, Star, MapPin, Tag, Compass, Check, Calendar } from 'lucide-react';
import { AddSpotModal } from './AddSpotModal';

export const SpotList = () => {
  const { spots, selectedTrip, addActivityToTrip, setActiveTab } = useTravel();
  const [isAddSpotModalOpen, setIsAddSpotModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedSpotIds, setAddedSpotIds] = useState({});

  const categories = ['Semua', 'Alam', 'Kuliner', 'Budaya', 'Belanja', 'Transportasi'];

  const filteredSpots = spots.filter(spot => {
    const matchesCat = activeCategory === 'Semua' || spot.category === activeCategory;
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (spot.address && spot.address.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleAddToItinerary = (spot) => {
    if (!selectedTrip) {
      alert('Silakan buat atau pilih rencana perjalanan terlebih dahulu!');
      setActiveTab('trips');
      return;
    }
    addActivityToTrip(selectedTrip.id, {
      day: 1,
      time: '11:00',
      title: spot.name,
      category: spot.category,
      cost: spot.price,
      lat: spot.lat,
      lng: spot.lng,
      notes: spot.description || `Dikunjungi dari rekomendasi ${spot.name}`
    });
    setAddedSpotIds(prev => ({ ...prev, [spot.id]: true }));
    setTimeout(() => {
      setAddedSpotIds(prev => ({ ...prev, [spot.id]: false }));
    }, 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-teal-900/40 p-4 rounded-2xl border border-emerald-500/30 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500 text-slate-950 uppercase tracking-wide">
                Fase 2
              </span>
              <span className="text-xs text-emerald-300 font-medium">Direktori Wisata</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">Tempat Wisata</h2>
            <p className="text-xs text-slate-300 mt-0.5">Eksplorasi & pengelompokkan destinasi impian.</p>
          </div>
          <button
            onClick={() => setIsAddSpotModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tempat</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari tempat wisata, pantai, pura, cafe..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Category Pills (Sub-fitur: Kelompokkan Tempat) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-emerald-400" /> Kelompokkan Tempat:
          </span>
          <span className="text-[11px]">{filteredSpots.length} Tempat</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-105'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Spots Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredSpots.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 p-6">
            <Compass className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Tempat wisata tidak ditemukan</p>
            <p className="text-xs text-slate-500 mt-1">Coba kata kunci lain atau tambah tempat baru.</p>
          </div>
        ) : (
          filteredSpots.map((spot) => {
            const isAdded = addedSpotIds[spot.id];
            return (
              <div
                key={spot.id}
                className="bg-slate-800/60 border border-slate-700/70 hover:border-emerald-500/40 rounded-2xl p-3 flex gap-3 shadow-md hover:shadow-emerald-500/5 transition-all"
              >
                <img
                  src={spot.image}
                  alt={spot.name}
                  className="w-24 h-24 rounded-xl object-cover shrink-0"
                />
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                        {spot.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{spot.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-white mt-1 leading-snug">{spot.name}</h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 line-clamp-1">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      {spot.address || spot.destination}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/50">
                    <span className="text-xs font-extrabold text-emerald-400">
                      {spot.price === 0 ? 'Gratis' : `Rp ${spot.price.toLocaleString('id-ID')}`}
                    </span>

                    <button
                      onClick={() => handleAddToItinerary(spot)}
                      disabled={isAdded}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                        isAdded
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-700 hover:bg-emerald-600 text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Ditambahkan!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          <span>+ Rencana</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <AddSpotModal isOpen={isAddSpotModalOpen} onClose={() => setIsAddSpotModalOpen(false)} />
    </div>
  );
};
