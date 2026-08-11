import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import {
  ArrowLeft, Plus, Calendar, Clock, MapPin, Trash2, Map,
  Sun, CloudSun, Link2, CheckCircle2, AlertCircle, Edit3, ExternalLink, X, Search, RefreshCw, Copy
} from 'lucide-react';

// Helper to calculate total days of a trip accurately using UTC dates
export function getTripDays(trip) {
  if (!trip) return [1];
  if (!trip.startDate || !trip.endDate) return [1, 2, 3];

  const [y1, m1, d1] = trip.startDate.split('-').map(Number);
  const [y2, m2, d2] = trip.endDate.split('-').map(Number);

  if (!y1 || !y2) return [1, 2, 3];

  const date1 = Date.UTC(y1, m1 - 1, d1);
  const date2 = Date.UTC(y2, m2 - 1, d2);

  const diffDays = Math.round((date2 - date1) / (1000 * 60 * 60 * 24)) + 1;
  const count = Math.max(1, isNaN(diffDays) ? 1 : diffDays);

  return Array.from({ length: count }, (_, i) => i + 1);
}

// Helper to compute driving distance between lat/lng coordinates
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
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

// Helper to parse Google Maps URL
function parseGoogleMapsUrl(input) {
  if (!input) return null;
  const str = input.trim();

  const atMatch = str.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };

  const qMatch = str.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };

  const llMatch = str.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };

  const rawMatch = str.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
  if (rawMatch) return { lat: parseFloat(rawMatch[1]), lng: parseFloat(rawMatch[2]) };

  return null;
}

// Helper to calculate duration hours
function calculateDurationHours(timeStartStr, timeEndStr) {
  if (!timeStartStr || !timeEndStr) return 0;
  const [h1, m1] = timeStartStr.split(':').map(Number);
  let [h2, m2] = timeEndStr.split(':').map(Number);
  if (isNaN(h1)) return 0;
  if (timeEndStr === '24:00' || isNaN(h2)) {
    h2 = 24;
    m2 = 0;
  }

  const startMin = (h1 || 0) * 60 + (m1 || 0);
  const endMin = (h2 || 0) * 60 + (m2 || 0);

  const diffMin = endMin - startMin;
  return diffMin > 0 ? diffMin / 60 : 0;
}

// Real-time live weather fetcher (matching Google Weather via Open-Meteo & Geocoding)
async function fetchRealTimeWeather(cityName) {
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=id&format=json`
    );
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      return null;
    }

    const { latitude, longitude, name } = geoData.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weatherData = await weatherRes.json();

    const curr = weatherData.current_weather;
    const tempStr = `${Math.round(curr.temperature)}°C`;

    let condition = 'Cerah';
    const code = curr.weathercode;
    if (code === 0) condition = 'Cerah';
    else if (code >= 1 && code <= 3) condition = 'Cerah Berawan';
    else if (code >= 45 && code <= 48) condition = 'Kabut';
    else if (code >= 51 && code <= 67) condition = 'Hujan Ringan';
    else if (code >= 80 && code <= 82) condition = 'Hujan Deras';
    else if (code >= 95) condition = 'Badai Petir';

    return {
      location: name,
      temp: tempStr,
      condition: condition
    };
  } catch {
    return null;
  }
}

export const TripDetailView = () => {
  const {
    selectedTrip, setTripViewMode, addActivityToTrip, duplicateActivityInTrip, updateActivityInTrip, updateTripWeather, deleteActivityFromTrip, setActiveTab
  } = useTravel();

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [selectedDayTab, setSelectedDayTab] = useState(1);

  // Live Google Weather Modal State
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [searchCityInput, setSearchCityInput] = useState('');
  const [liveWeatherResult, setLiveWeatherResult] = useState(null);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const [actForm, setActForm] = useState({
    day: 1,
    time: '10:00',
    title: '',
    cost: '',
    countTime: true,
    gmapsUrl: '',
    lat: -8.6212,
    lng: 115.0868
  });

  const [parseStatus, setParseStatus] = useState(null);

  if (!selectedTrip) {
    return (
      <div className="p-6 text-center text-slate-400">
        <p>Rencana perjalanan tidak ditemukan.</p>
        <button
          onClick={() => setTripViewMode('list')}
          className="mt-3 bg-cyan-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  const tripDays = getTripDays(selectedTrip);

  const handleOpenAddModal = () => {
    setEditingActivityId(null);
    setActForm({
      day: selectedDayTab,
      time: '10:00',
      title: '',
      cost: '',
      countTime: true,
      gmapsUrl: '',
      lat: -8.6212,
      lng: 115.0868
    });
    setParseStatus(null);
    setIsActivityModalOpen(true);
  };

  const handleOpenEditModal = (act) => {
    setEditingActivityId(act.id);
    setActForm({
      day: act.day || selectedDayTab,
      time: act.time || '10:00',
      title: act.title || '',
      cost: act.cost || '',
      countTime: act.countTime !== false,
      gmapsUrl: act.gmapsUrl || '',
      lat: act.lat || -8.6212,
      lng: act.lng || 115.0868
    });
    setParseStatus(act.gmapsUrl ? 'success' : null);
    setIsActivityModalOpen(true);
  };

  const handleGmapsUrlChange = (url) => {
    setActForm(prev => ({ ...prev, gmapsUrl: url }));
    const parsed = parseGoogleMapsUrl(url);
    if (parsed) {
      setActForm(prev => ({ ...prev, gmapsUrl: url, lat: parsed.lat, lng: parsed.lng }));
      setParseStatus('success');
    } else if (url.trim().length > 0) {
      setParseStatus('error');
    } else {
      setParseStatus(null);
    }
  };

  const handleSubmitActivity = (e) => {
    e.preventDefault();
    if (!actForm.title || !actForm.title.trim()) return;

    const safeLat = isNaN(Number(actForm.lat)) ? -8.6212 : Number(actForm.lat);
    const safeLng = isNaN(Number(actForm.lng)) ? 115.0868 : Number(actForm.lng);

    if (editingActivityId) {
      updateActivityInTrip(selectedTrip.id, editingActivityId, {
        ...actForm,
        lat: safeLat,
        lng: safeLng,
        day: selectedDayTab
      });
    } else {
      addActivityToTrip(selectedTrip.id, {
        ...actForm,
        lat: safeLat,
        lng: safeLng,
        day: selectedDayTab,
        category: 'Destinasi',
        notes: ''
      });
    }

    setIsActivityModalOpen(false);
    setEditingActivityId(null);
  };

  const handleDeleteActivity = () => {
    if (!editingActivityId) return;
    if (confirm('Hapus kegiatan ini dari rencana perjalanan?')) {
      deleteActivityFromTrip(selectedTrip.id, editingActivityId);
      setIsActivityModalOpen(false);
      setEditingActivityId(null);
    }
  };

  const handleDuplicateActivityFromModal = () => {
    if (!editingActivityId) return;
    duplicateActivityInTrip(selectedTrip.id, editingActivityId);
    setIsActivityModalOpen(false);
    setEditingActivityId(null);
  };

  const handleFetchWeather = async (e) => {
    if (e) e.preventDefault();
    const city = searchCityInput.trim();
    if (!city) return;

    setIsFetchingWeather(true);
    setWeatherError(null);

    const res = await fetchRealTimeWeather(city);
    setIsFetchingWeather(false);

    if (res) {
      setLiveWeatherResult(res);
    } else {
      setWeatherError(`Kota "${city}" tidak ditemukan. Coba ketik nama kota resmi.`);
    }
  };

  const handleApplyLiveWeather = () => {
    if (!liveWeatherResult) return;
    updateTripWeather(selectedTrip.id, liveWeatherResult);
    setIsWeatherModalOpen(false);
  };

  const activities = selectedTrip.activities || [];
  const dayActivities = activities
    .filter(a => a.day === selectedDayTab)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Daily Stats calculation
  const dailyCost = dayActivities.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  let totalDailyTimeHours = 0;
  dayActivities.forEach((act, idx) => {
    if (act.countTime !== false) {
      const nextTime = idx < dayActivities.length - 1 ? dayActivities[idx + 1].time : '24:00';
      totalDailyTimeHours += calculateDurationHours(act.time, nextTime);
    }
  });

  // Distance calculation
  let dailyDistanceKm = 0;
  for (let i = 0; i < dayActivities.length - 1; i++) {
    dailyDistanceKm += calculateDistanceKm(
      dayActivities[i].lat, dayActivities[i].lng,
      dayActivities[i + 1].lat, dayActivities[i + 1].lng
    );
  }

  const weather = selectedTrip.weather || { location: selectedTrip.destination || 'Sukabumi', temp: '27°C', condition: 'Cerah' };

  return (
    <div className="flex-1 overflow-y-auto pb-6 no-scrollbar">
      {/* Top Banner Cover */}
      <div className="h-40 w-full relative">
        <img
          src={selectedTrip.coverImage}
          alt={selectedTrip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(15,23,42,0.90) 0%, rgba(15,23,42,0.45) 50%, transparent 100%)'}} />

        {/* Navigation Controls */}
        <div className="absolute top-3 left-3 z-10">
          <button
            onClick={() => setTripViewMode('list')}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 backdrop-blur-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Location */}
        <div className="absolute bottom-3 left-4 right-4">
          <h1 className="text-lg font-extrabold text-white tracking-tight leading-tight">{selectedTrip.title}</h1>
          <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-cyan-400" /> {selectedTrip.destination} • {selectedTrip.startDate} - {selectedTrip.endDate}
          </p>
        </div>
      </div>

      <div className="px-4 mt-3 space-y-4">
        {/* Dynamic Day Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {tripDays.map((dNum) => (
            <button
              key={dNum}
              onClick={() => setSelectedDayTab(dNum)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedDayTab === dNum
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              HARI {dNum}
            </button>
          ))}
        </div>

        {/* Daily Summary Stats Bar */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
          <div className="text-center border-r border-slate-800 pr-1">
            <p className="text-[9px] text-slate-400 font-semibold uppercase">Biaya Hari Ini</p>
            <p className="text-[11px] font-extrabold text-cyan-400 mt-0.5">Rp {(dailyCost/1000).toFixed(0)}k</p>
          </div>
          <div className="text-center border-r border-slate-800 px-1">
            <p className="text-[9px] text-slate-400 font-semibold uppercase">Waktu Kegiatan</p>
            <p className="text-[11px] font-extrabold text-amber-400 mt-0.5">{totalDailyTimeHours.toFixed(1)} Jam</p>
          </div>
          <div className="text-center border-r border-slate-800 px-1">
            <p className="text-[9px] text-slate-400 font-semibold uppercase">Jarak Tempuh</p>
            <p className="text-[11px] font-extrabold text-blue-400 mt-0.5">{dailyDistanceKm.toFixed(1)} km</p>
          </div>

          {/* Interactive Live Google Weather City Box */}
          <div
            onClick={() => {
              setSearchCityInput(weather.location || selectedTrip.destination || 'Sukabumi');
              setLiveWeatherResult(null);
              setWeatherError(null);
              setIsWeatherModalOpen(true);
            }}
            className="text-center pl-1 cursor-pointer hover:bg-slate-800/80 p-0.5 rounded-xl transition-colors group relative"
            title="Klik untuk mencari cuaca real-time (Google Cuaca)"
          >
            <p className="text-[9px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-0.5">
              <span>CUACA HARI INI</span>
              <Edit3 className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 text-cyan-400" />
            </p>
            <p className="text-[11px] font-extrabold text-emerald-400 mt-0.5 flex items-center justify-center gap-0.5">
              <Sun className="w-3 h-3 text-amber-400 shrink-0" />
              {weather.temp}
            </p>
            <p className="text-[8px] text-cyan-300 font-medium truncate max-w-full">
              {weather.location}
            </p>
          </div>
        </div>

        {/* Action Header: Only "+ Tambah Kegiatan" Button */}
        <div className="flex items-center justify-end pt-1">
          <button
            onClick={handleOpenAddModal}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kegiatan</span>
          </button>
        </div>

        {dayActivities.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-6 text-center">
            <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-400">Belum ada kegiatan pada Hari Ke-{selectedDayTab}.</p>
            <p className="text-[11px] text-slate-500 mt-1">Klik "+ Tambah Kegiatan" untuk mengisi agenda harian Anda.</p>
          </div>
        ) : (
          <div className="space-y-2.5 w-full">
            {dayActivities.map((act, idx) => {
              const nextTime = idx < dayActivities.length - 1 ? dayActivities[idx + 1].time : '24:00';
              const isCounted = act.countTime !== false;
              const durationHrs = calculateDurationHours(act.time, nextTime);

              const gmapsTargetUrl = act.gmapsUrl || `https://www.google.com/maps/search/?api=1&query=${act.lat},${act.lng}`;

              return (
                <div
                  key={act.id}
                  onClick={() => handleOpenEditModal(act)}
                  className="bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-3.5 cursor-pointer transition-all relative group shadow-md space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {/* Connected Time Badge — gray if not counted */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isCounted
                            ? 'text-cyan-300 bg-cyan-950 border-cyan-800/40'
                            : 'text-slate-400 bg-slate-800/60 border-slate-700/40'
                        }`}>
                          <Clock className={`w-3 h-3 inline mr-1 ${isCounted ? 'text-cyan-400' : 'text-slate-500'}`} />
                          {act.time} - {nextTime}
                        </span>

                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                          isCounted
                            ? 'text-emerald-400 bg-emerald-950 border-emerald-800/40'
                            : 'text-slate-400 bg-slate-800/60 border-slate-700/40'
                        }`}>
                          +{durationHrs.toFixed(1)}j
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1.5 group-hover:text-cyan-300 transition-colors">
                        {act.title}
                      </h4>
                    </div>

                    {/* Top Right Action Icons Group: Copy, Edit, Delete (Uniform Cyan Style & No Text!) */}
                    <div className="flex items-center gap-1 z-10">
                      {/* Copy Icon Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateActivityInTrip(selectedTrip.id, act.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors"
                        title="Salin Kegiatan"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Icon Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(act);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors"
                        title="Edit Kegiatan"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Icon Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Hapus kegiatan "${act.title}"?`)) {
                            deleteActivityFromTrip(selectedTrip.id, act.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/80 text-red-400 hover:text-red-300 border border-slate-700 hover:border-red-800/60 transition-colors"
                        title="Hapus Kegiatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
                    {act.cost > 0 ? (
                      <p className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
                        <span>Rp {act.cost.toLocaleString('id-ID')}</span>
                      </p>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-semibold">Gratis</span>
                    )}

                    <a
                      href={gmapsTargetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] font-bold text-cyan-400 hover:text-cyan-200 flex items-center gap-1 bg-slate-950 hover:bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-cyan-700/60 transition-colors"
                      title="Buka lokasi di Google Maps"
                    >
                      <ExternalLink className="w-3 h-3 text-cyan-400" />
                      <span>Lihat Lokasi</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Live Google Weather Search */}
      {isWeatherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setIsWeatherModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" />
              Cari Cuaca Kota (Sesuai Google Cuaca)
            </h3>

            <form onSubmit={handleFetchWeather} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Masukkan Nama Kota
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sukabumi, Bandung, Bali, Jakarta..."
                    value={searchCityInput}
                    onChange={(e) => setSearchCityInput(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={isFetchingWeather}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-md shadow-amber-500/20 whitespace-nowrap"
                  >
                    {isFetchingWeather ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    <span>Cari Cuaca</span>
                  </button>
                </div>
              </div>
            </form>

            {weatherError && (
              <p className="text-xs text-rose-400 bg-rose-950/60 p-2.5 rounded-xl border border-rose-800/60 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {weatherError}
              </p>
            )}

            {/* Live Weather Card Result */}
            {liveWeatherResult && (
              <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-emerald-950/30 p-4 rounded-xl border border-amber-500/40 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Hasil Cuaca Real-Time
                    </span>
                    <h4 className="text-base font-extrabold text-white mt-0.5">
                      {liveWeatherResult.location}
                    </h4>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-emerald-400 flex items-center gap-1">
                      <Sun className="w-5 h-5 text-amber-400 inline" />
                      {liveWeatherResult.temp}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-300">
                      {liveWeatherResult.condition}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <a
                    href={`https://www.google.com/search?q=cuaca+${encodeURIComponent(liveWeatherResult.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-cyan-400 hover:text-cyan-200 flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
                  >
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                    <span>Buka Google Cuaca</span>
                  </a>

                  <button
                    onClick={handleApplyLiveWeather}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Gunakan Cuaca Ini</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Add / Edit Activity */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto no-scrollbar">
            <h3 className="text-sm font-bold text-white">
              {editingActivityId ? 'Edit Kegiatan' : `Tambah Kegiatan Hari Ke-${selectedDayTab}`}
            </h3>

            <form onSubmit={handleSubmitActivity} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Waktu / Jam Mulai</label>
                <input
                  type="text"
                  placeholder="10:00"
                  required
                  value={actForm.time}
                  onChange={(e) => setActForm({ ...actForm, time: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="countTimeCheck"
                  checked={actForm.countTime}
                  onChange={(e) => setActForm({ ...actForm, countTime: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-800 border-slate-700 cursor-pointer"
                />
                <label htmlFor="countTimeCheck" className="text-xs font-semibold text-slate-200 cursor-pointer">
                  Hitung waktu kegiatan (masuk ke Total Waktu Kegiatan)
                </label>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Nama Tempat / Kegiatan</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pantai Pandawa"
                  value={actForm.title}
                  onChange={(e) => setActForm({ ...actForm, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                  Link Google Maps / Lokasi Presisi (Terhubung ke Peta)
                </label>
                <input
                  type="text"
                  placeholder="Tempel link Google Maps (misal: https://maps.app.goo.gl/... atau @-8.6212,115.0868)"
                  value={actForm.gmapsUrl}
                  onChange={(e) => handleGmapsUrlChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                />

                {parseStatus === 'success' && (
                  <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/60 p-1.5 rounded-lg border border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    Koordinat Presisi Terdeteksi: {actForm.lat.toFixed(5)}, {actForm.lng.toFixed(5)}
                  </p>
                )}

                {parseStatus === 'error' && (
                  <p className="text-[10px] text-amber-400 font-medium flex items-center gap-1 bg-amber-950/60 p-1.5 rounded-lg border border-amber-800/60">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    Link dimasukkan. Isi koordinat Latitude & Longitude di bawah jika perlu penyesuaian.
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={actForm.lat}
                      onChange={(e) => setActForm({ ...actForm, lat: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={actForm.lng}
                      onChange={(e) => setActForm({ ...actForm, lng: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Estimasi Biaya (IDR)</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={actForm.cost}
                  onChange={(e) => setActForm({ ...actForm, cost: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                {editingActivityId ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleDeleteActivity}
                      className="bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white border border-red-800/60 px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Hapus Kegiatan Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDuplicateActivityFromModal}
                      className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Salin / Duplikat Kegiatan Ini"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </button>
                  </div>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsActivityModalOpen(false);
                      setEditingActivityId(null);
                    }}
                    className="bg-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20"
                  >
                    {editingActivityId ? 'Simpan Perubahan' : 'Simpan Kegiatan'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
