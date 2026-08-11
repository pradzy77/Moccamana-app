import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import {
  Users, ChevronDown, ChevronUp, ScrollText
} from 'lucide-react';
import { getTripDays } from './TripDetailView';

// Helper to compute driving distance between lat/lng coordinates
function calculateDrivingDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c) * 1.32;
}

export const TotalCostPanel = () => {
  const { selectedTrip, updateActivityRealCost } = useTravel();
  const [peopleCount, setPeopleCount] = useState(1);

  // Closed / Collapsed by default for all days
  const [openDays, setOpenDays] = useState({});

  if (!selectedTrip) return null;

  const tripDays = getTripDays(selectedTrip);
  const activities = selectedTrip.activities || [];

  // Totals calculation
  const totalEstimatedCost = activities.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const totalRealCost = activities.reduce((acc, curr) => acc + (curr.realCost ?? curr.cost ?? 0), 0);
  const budgetDiff = totalEstimatedCost - totalRealCost; // positive = hemat, negative = over budget

  // Calculate total driving distance across all activities per day and overall
  let totalDistanceKm = 0;
  const dayStatsMap = {};

  tripDays.forEach(dNum => {
    const dayActs = activities
      .filter(a => a.day === dNum)
      .sort((a, b) => a.time.localeCompare(b.time));

    let dayDist = 0;
    for (let i = 0; i < dayActs.length - 1; i++) {
      dayDist += calculateDrivingDistanceKm(
        dayActs[i].lat, dayActs[i].lng,
        dayActs[i + 1].lat, dayActs[i + 1].lng
      );
    }
    totalDistanceKm += dayDist;

    const dayEst = dayActs.reduce((acc, curr) => acc + (curr.cost || 0), 0);
    const dayReal = dayActs.reduce((acc, curr) => acc + (curr.realCost ?? curr.cost ?? 0), 0);

    dayStatsMap[dNum] = {
      activities: dayActs,
      distanceKm: dayDist,
      estimatedCost: dayEst,
      realCost: dayReal
    };
  });

  const numPeople = Math.max(1, Number(peopleCount) || 1);
  const splitEstimated = Math.round(totalEstimatedCost / numPeople);
  const splitReal = Math.round(totalRealCost / numPeople);

  const toggleDayCollapse = (dNum) => {
    setOpenDays(prev => ({ ...prev, [dNum]: !prev[dNum] }));
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top 4 Summary Cards in 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Card 1: Estimated Cost */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-md space-y-1">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Estimated Cost
          </p>
          <p className="text-base font-extrabold text-white">
            Rp {totalEstimatedCost.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Card 2: Real Cost */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-md space-y-1">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Real Cost
          </p>
          <p className="text-base font-extrabold text-white">
            Rp {totalRealCost.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Card 3: Selisih Anggaran */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-md space-y-1">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Selisih Anggaran
          </p>
          <p className={`text-base font-extrabold ${budgetDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {budgetDiff >= 0 ? `+ Hemat Rp ${budgetDiff.toLocaleString('id-ID')}` : `- Lebih Rp ${Math.abs(budgetDiff).toLocaleString('id-ID')}`}
          </p>
        </div>

        {/* Card 4: Total Jarak Tempuh */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-md space-y-1">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Total Jarak Tempuh
          </p>
          <p className="text-base font-extrabold text-cyan-400">
            {totalDistanceKm.toFixed(1)} km
          </p>
        </div>
      </div>

      {/* 2. Simulasi Patungan Per Orang Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" />
              Simulasi Patungan Per Orang
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Hitung perkiraan biaya patungan rombongan berdasarkan Estimasi & Real Cost.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <label className="text-xs font-semibold text-slate-300">Jumlah Orang:</label>
            <input
              type="number"
              min="1"
              max="99"
              value={peopleCount}
              onChange={(e) => setPeopleCount(e.target.value)}
              className="w-14 bg-slate-800 border border-slate-700 rounded-lg text-center text-xs font-bold text-cyan-300 py-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Patungan Estimated:</p>
            <p className="text-sm font-extrabold text-cyan-400 mt-0.5">
              Rp {splitEstimated.toLocaleString('id-ID')} / Orang
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Patungan Real Cost:</p>
            <p className="text-sm font-extrabold text-amber-400 mt-0.5">
              Rp {splitReal.toLocaleString('id-ID')} / Orang
            </p>
          </div>
        </div>
      </div>

      {/* 3. Perbandingan Biaya Per Destinasi Section (Rapi & Bebas Overlap) */}
      <div className="space-y-3 pt-1">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <ScrollText className="w-4 h-4 text-cyan-400" />
          Perbandingan Biaya Per Destinasi
        </h3>

        <div className="space-y-3">
          {tripDays.map((dNum) => {
            const stats = dayStatsMap[dNum] || { activities: [], distanceKm: 0, estimatedCost: 0, realCost: 0 };
            const isOpen = !!openDays[dNum];

            return (
              <div
                key={dNum}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-md"
              >
                {/* Collapsible Header */}
                <div
                  onClick={() => toggleDayCollapse(dNum)}
                  className="p-3 bg-slate-900 hover:bg-slate-850 cursor-pointer flex flex-wrap items-center justify-between gap-2 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    <span className="font-extrabold text-xs text-white">HARI {dNum}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                    <span className="bg-blue-950/80 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800 font-bold">
                      {stats.distanceKm.toFixed(1)} km
                    </span>
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700 font-medium">
                      Estimasi: Rp {stats.estimatedCost.toLocaleString('id-ID')}
                    </span>
                    <span className="bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded-full border border-amber-800 font-bold">
                      Real: Rp {stats.realCost.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Activities List (Clean Card Layout - No Overlapping) */}
                {isOpen && (
                  <div className="p-3 space-y-2 bg-slate-950/60 border-t border-slate-800">
                    {stats.activities.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic py-2 text-center">Belum ada kegiatan di Hari Ke-{dNum}</p>
                    ) : (
                      stats.activities.map((act, idx) => {
                        const actRealCost = act.realCost ?? act.cost ?? 0;
                        const isFree = !act.cost || act.cost === 0;

                        return (
                          <div
                            key={act.id}
                            className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2 shadow-sm"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-xs text-white truncate">
                                {idx + 1}. {act.title}
                              </h4>
                            </div>

                            <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/60">
                              <div className="text-slate-400 text-[11px]">
                                Estimasi: <strong className={isFree ? 'text-emerald-400 font-semibold' : 'text-slate-200 font-bold'}>
                                  {isFree ? 'Gratis' : `Rp ${act.cost.toLocaleString('id-ID')}`}
                                </strong>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-bold text-amber-400">Riil: Rp</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={actRealCost}
                                  onChange={(e) => updateActivityRealCost(selectedTrip.id, act.id, e.target.value)}
                                  className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-right text-xs font-bold text-white focus:border-amber-400 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
