import React, { useState, useEffect } from 'react';
import { useTravel } from '../../context/TravelContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Layers, ExternalLink, Calendar } from 'lucide-react';
import { getTripDays } from '../itinerary/TripDetailView';

const createCustomIcon = (number, color = '#0284c7') => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background-color: ${color};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 13px;
        border: 2.5px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.6);
      ">
        ${number}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Auto-recenter map when pins change
function MapRecenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      if (coords.length === 1) {
        map.setView(coords[0], 13);
      } else {
        const bounds = L.latLngBounds(coords);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [JSON.stringify(coords)]);
  return null;
}

export const InteractiveMap = () => {
  const { selectedTrip } = useTravel();
  const [selectedDayTab, setSelectedDayTab] = useState('all'); // 'all' | 1 | 2 | 3...
  const [showRoute, setShowRoute] = useState(true);
  const [mapTileStyle, setMapTileStyle] = useState('dark');
  const [drivingGeometry, setDrivingGeometry] = useState(null);
  const [drivingDistanceKm, setDrivingDistanceKm] = useState(null);

  if (!selectedTrip) return null;

  const tripDays = getTripDays(selectedTrip);
  const allActivities = selectedTrip.activities || [];

  // Filter activities by selected day tab
  const dayActivities = (selectedDayTab === 'all'
    ? allActivities
    : allActivities.filter(a => a.day === Number(selectedDayTab))
  ).sort((a, b) => a.time.localeCompare(b.time));

  const routeCoords = dayActivities.map(act => [act.lat, act.lng]);
  const defaultCenter = routeCoords.length > 0 ? routeCoords[0] : [-8.6212, 115.0868];

  // Fetch real car driving route geometry via OSRM API for active day
  useEffect(() => {
    if (routeCoords.length < 2) {
      setDrivingGeometry(null);
      setDrivingDistanceKm(null);
      return;
    }

    const osrmCoords = routeCoords.map(c => `${c[1]},${c[0]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${osrmCoords}?overview=full&geometries=geojson`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.routes && data.routes[0]) {
          const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setDrivingGeometry(coords);
          setDrivingDistanceKm((data.routes[0].distance / 1000).toFixed(1));
        } else {
          setDrivingGeometry(routeCoords);
        }
      })
      .catch(() => {
        setDrivingGeometry(routeCoords);
      });
  }, [JSON.stringify(routeCoords)]);

  const openGoogleMapsNavigation = () => {
    if (routeCoords.length === 0) {
      alert('Belum ada lokasi kegiatan pada itinerary.');
      return;
    }
    const origin = `${routeCoords[0][0]},${routeCoords[0][1]}`;
    const destination = `${routeCoords[routeCoords.length - 1][0]},${routeCoords[routeCoords.length - 1][1]}`;
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    if (routeCoords.length > 2) {
      const waypoints = routeCoords.slice(1, -1).map(c => `${c[0]},${c[1]}`).join('|');
      url += `&waypoints=${waypoints}`;
    }

    window.open(url, '_blank');
  };

  const tileUrl = mapTileStyle === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* Top Controls Bar Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Day Filter Dropdown */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={selectedDayTab}
            onChange={(e) => setSelectedDayTab(e.target.value)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-white">Semua Hari</option>
            {tripDays.map((dNum) => (
              <option key={dNum} value={dNum} className="bg-slate-900 text-white">
                Hari Ke-{dNum}
              </option>
            ))}
          </select>
        </div>

        {/* Right Action Buttons: "Navigasi" and Style Toggle */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={openGoogleMapsNavigation}
            className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md transition-colors"
            title="Buka Navigasi Rute di Google Maps"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Navigasi</span>
          </button>

          <button
            onClick={() => setMapTileStyle(mapTileStyle === 'dark' ? 'streets' : 'dark')}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 backdrop-blur-md transition-colors"
            title="Ubah Style Peta"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Leaflet Map Engine (Disabled Attribution Control!) */}
      <div className="flex-1 w-full h-full relative">
        <MapContainer
          center={defaultCenter}
          zoom={11}
          scrollWheelZoom={true}
          attributionControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer url={tileUrl} />

          <MapRecenter coords={routeCoords} />

          {/* OSRM Driving Polyline Route for active day */}
          {showRoute && (drivingGeometry || routeCoords).length > 1 && (
            <Polyline
              positions={drivingGeometry || routeCoords}
              color="#0284c7"
              weight={5}
              opacity={0.9}
            />
          )}

          {/* Pins for Day Activities */}
          {dayActivities.map((act, idx) => (
            <Marker
              key={act.id}
              position={[act.lat, act.lng]}
              icon={createCustomIcon(idx + 1, '#0284c7')}
            >
              <Popup>
                <div className="p-1 space-y-1 text-slate-100">
                  <span className="text-[10px] font-bold text-cyan-400">
                    HARI {act.day} • {act.time}
                  </span>
                  <h4 className="font-bold text-xs text-white">{act.title}</h4>
                  <p className="text-[11px] text-slate-300">Rp {(act.cost || 0).toLocaleString()}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Footer Info Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-20 bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 shadow-2xl space-y-1">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-200 font-bold">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>
              {selectedDayTab === 'all' ? 'Rute Seluruh Perjalanan' : `Rute Hari Ke-${selectedDayTab}`}
            </span>
          </div>

          <span className="text-xs font-extrabold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-lg border border-cyan-800/60">
            {dayActivities.length} Destinasi {drivingDistanceKm ? `• ${drivingDistanceKm} km` : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
