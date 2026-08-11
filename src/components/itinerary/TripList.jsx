import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import {
  Plus, Calendar, MapPin, Search, Edit3, Share2, Map,
  Trash2, Copy, Check, X, ArrowRight, ExternalLink,
  Lightbulb, ChevronDown, ChevronUp, UserPlus
} from 'lucide-react';
import { CreateTripModal } from './CreateTripModal';
import { travelTips } from '../../mockData/initialData';

export const TripList = () => {
  const {
    trips, setSelectedTripId, setTripViewMode, updateTrip, deleteTrip, setActiveTab, joinTripByCode
  } = useTravel();

  const [activeFilter, setActiveFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinMsg, setJoinMsg] = useState({ type: '', text: '' });
  const [isJoining, setIsJoining] = useState(false);

  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [activeTipIdx, setActiveTipIdx] = useState(0);
  const [openGuideIdx, setOpenGuideIdx] = useState(null);

  // Edit Trip Modal state
  const [editingTrip, setEditingTrip] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    coverImage: '',
    status: 'Direncanakan'
  });

  // Share Trip Modal state
  const [sharingTrip, setSharingTrip] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // Filter Trips
  const filteredTrips = trips.filter((t) => {
    const matchesFilter = activeFilter === 'Semua' || t.status === activeFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSelectTrip = (tripId) => {
    setSelectedTripId(tripId);
    setTripViewMode('detail');
  };

  const handleOpenEditModal = (trip) => {
    setEditingTrip(trip);
    setEditForm({
      title: trip.title || '',
      destination: trip.destination || '',
      startDate: trip.startDate || '',
      endDate: trip.endDate || '',
      budget: trip.budget || '',
      coverImage: trip.coverImage || '',
      status: trip.status || 'Direncanakan'
    });
  };

  const handleSaveEditTrip = (e) => {
    e.preventDefault();
    if (!editingTrip) return;
    updateTrip(editingTrip.id, {
      ...editForm,
      budget: Number(editForm.budget) || 0
    });
    setEditingTrip(null);
  };

  const handleDeleteTripFromModal = () => {
    if (!editingTrip) return;
    if (confirm(`Hapus rencana "${editingTrip.title}" secara permanen?`)) {
      deleteTrip(editingTrip.id);
      setEditingTrip(null);
    }
  };

  const handleCopyShareLink = (code) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://moccamana.vercel.app';
    const link = `${baseUrl}?shareCode=${code}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">

      {/* Tips & Panduan — Collapsible */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => setIsTipsOpen(prev => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/60 transition-colors"
        >
          <span className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <img 
              src="/mocca_thinking_clean.png" 
              alt="Mocca" 
              className="w-6 h-6 object-contain shrink-0 drop-shadow-sm"
              onError={(e) => { e.target.src = '/mocca_happy_explorer.png'; }}
            />
            Tips &amp; Panduan Penggunaan
          </span>
          {isTipsOpen
            ? <ChevronUp className="w-4 h-4 text-slate-400" />
            : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {isTipsOpen && (
          <div className="px-4 pb-4 space-y-3 border-t border-slate-800">
            {/* Tips carousel */}
            <div className="mt-3 bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 min-h-[56px] flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-300 leading-relaxed">{travelTips[activeTipIdx]}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {travelTips.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTipIdx(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === activeTipIdx ? 'bg-cyan-400 w-4' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setActiveTipIdx(i => (i - 1 + travelTips.length) % travelTips.length)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[10px] text-slate-300 hover:bg-slate-700 font-semibold"
                >← Prev</button>
                <button
                  onClick={() => setActiveTipIdx(i => (i + 1) % travelTips.length)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 text-[10px] font-bold hover:bg-cyan-400"
                >Next →</button>
              </div>
            </div>

            {/* Collapsible Feature Guide List */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <p className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-wide">Panduan Fitur Aplikasi</p>
              
              {[
                {
                  id: 1,
                  num: '1. Itinerary – Jadwal Kegiatan',
                  points: [
                    'Navigasi Hari: Klik tab Hari 1, Hari 2, dst. untuk berpindah hari.',
                    'Kelola Jadwal: Klik + Tambah Kegiatan. Untuk mengubah, menyalin, atau menghapus, gunakan ikon Hapus, Edit, Copy di masing-masing kartu.',
                    'Akses Peta: Gunakan Lihat untuk melihat lokasi, foto, dan ulasan.'
                  ]
                },
                {
                  id: 2,
                  num: '2. Itinerary - Waktu & Cuaca',
                  points: [
                    'Hitung Jam Aktif: Centang opsi "Hitung sebagai jam kegiatan" agar durasi masuk ke total waktu. Jika tidak dicentang (untuk waktu bebas), kartu akan berwarna abu-abu.',
                    'Setel Cuaca: Klik ikon cuaca di bagian atas untuk mengganti nama kota dan melihat prakiraan cuaca khusus pada hari tersebut.'
                  ]
                },
                {
                  id: 3,
                  num: '3. Wishlist - Kolaborasi Grup',
                  points: [
                    'Wishlist Grup: Buka tab ini untuk mengusulkan destinasi dan biayanya, lalu lakukan pemungutan suara (voting) bersama anggota rombongan.',
                    'Hitung Patungan: Buka tab Total Cost, lalu masukkan jumlah anggota grup untuk melihat hasil pembagian tagihan (split bill) secara otomatis per orang.'
                  ]
                },
                {
                  id: 4,
                  num: '4. Peta – Rute Perjalanan',
                  points: [
                    'Menampilkan rute perjalanan harian.',
                    'Navigasi: Secara otomatis melakukan rute perjalanan melalui Google Maps.'
                  ]
                },
                {
                  id: 5,
                  num: '5. Pengaturan Pakaian (Dresscode)',
                  points: [
                    'Buka Rincian: Klik pada judul hari (Hari 1, Hari 2) untuk membuka atau menutup daftar kegiatan.',
                    'Salin Cepat: Klik Copy DC untuk menyamakan pakaian dengan kegiatan sebelumnya.'
                  ]
                },
                {
                  id: 6,
                  num: '6. Report - Pemantauan Biaya',
                  points: [
                    'Buka Rincian Biaya: Klik pada judul hari untuk membuka rincian tabel perbandingan harga per destinasi.',
                    'Estimasi vs Riil: Pantau perbandingan antara Estimated Cost (biaya rencana) dan Real Cost (pengeluaran asli). Sistem akan menampilkan status hemat atau over budget.'
                  ]
                }
              ].map((sec) => {
                const isOpen = openGuideIdx === sec.id;
                return (
                  <div key={sec.id} className="w-full bg-slate-800/60 rounded-xl border border-slate-700/60 overflow-hidden transition-all">
                    <button
                      onClick={() => setOpenGuideIdx(isOpen ? null : sec.id)}
                      className="w-full flex items-center justify-between px-3.5 py-3 text-left hover:bg-slate-700/50 transition-colors"
                    >
                      <h4 className="text-xs font-bold text-amber-300 tracking-wide">{sec.num}</h4>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-3.5 pb-3.5 pt-1.5 border-t border-slate-700/50 bg-slate-800/40">
                        <ul className="space-y-2">
                          {sec.points.map((pt, idx) => (
                            <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-2 leading-relaxed">
                              <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/40 p-4 rounded-2xl border border-cyan-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <img 
              src="/mocca_camera_suitcase.png" 
              alt="Mocca" 
              className="w-6 h-6 object-contain shrink-0"
              onError={(e) => { e.target.src = '/mocca_happy_explorer.png'; }}
            />
            Rencana Perjalanan Saya
          </h2>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Kelola jadwal liburan, rancang destinasi & bagikan ke rombongan.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 shadow-md shadow-cyan-500/20 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Trip</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari rencana atau destinasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['Semua', 'Direncanakan', 'Berjalan', 'Selesai'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === status
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Cards List */}
      <div className="space-y-3">
        {filteredTrips.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-8 text-center">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-300">Tidak ada rencana perjalanan.</p>
            <p className="text-[11px] text-slate-500 mt-1">Klik "+ Buat Trip" untuk mulai merencanakan liburanmu.</p>
          </div>
        ) : (
          filteredTrips.map((trip) => {
            const spent = trip.spent || 0;
            const budget = trip.budget || 1;
            const progress = Math.min(100, Math.round((spent / budget) * 100));

            return (
              <div
                key={trip.id}
                onClick={() => handleSelectTrip(trip.id)}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all shadow-md group relative"
              >
                {/* Cover Image Header */}
                <div className="h-32 w-full relative">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 55%, transparent 100%)'}} />

                  {/* Top Left Status Badge */}
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-cyan-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-800/60">
                    • {trip.status}
                  </span>

                  {/* Top Right Action Buttons: Edit Icon & Share Icon (NO trash bin!) */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                    {/* Share Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSharingTrip(trip);
                      }}
                      className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-cyan-950 text-cyan-400 border border-slate-700/80 backdrop-blur-md transition-colors"
                      title="Bagikan Rencana"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {/* Edit Button (Replaced Trash Bin) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditModal(trip);
                      }}
                      className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 backdrop-blur-md transition-colors"
                      title="Edit / Hapus Rencana"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Location */}
                  <div className="absolute bottom-2.5 left-3 right-3">
                    <h3 className="text-base font-extrabold text-white leading-tight group-hover:text-cyan-300 transition-colors">
                      {trip.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {trip.destination}
                    </p>
                  </div>
                </div>

                {/* Card Info Body */}
                <div className="p-3 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300 text-[11px]">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {trip.startDate} s/d {trip.endDate}
                    </span>
                  </div>

                  {/* Budget Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Pengeluaran: <strong className="text-white">Rp {spent.toLocaleString('id-ID')}</strong></span>
                      <span className="text-slate-400">Target: <strong className="text-slate-200">Rp {budget.toLocaleString('id-ID')}</strong></span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Card Footer Row: Buka di Peta & Ubah Detail */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[11px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTripId(trip.id);
                        setActiveTab('map');
                      }}
                      className="text-cyan-400 font-bold hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Map className="w-3.5 h-3.5" />
                      <span>Buka di Peta</span>
                    </button>

                    <span className="text-slate-400 group-hover:text-cyan-300 font-semibold flex items-center gap-1">
                      <span>Ubah Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal 1: Create Trip Modal */}
      <CreateTripModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {/* Modal 2: Edit Trip Modal (Includes Hapus Rencana button) */}
      {editingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl relative space-y-3 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setEditingTrip(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-cyan-400" />
              Edit Rencana Perjalanan
            </h3>

            <form onSubmit={handleSaveEditTrip} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Nama Perjalanan / Trip</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Destinasi</label>
                  <input
                    type="text"
                    required
                    value={editForm.destination}
                    onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Status Trip</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Direncanakan">Direncanakan</option>
                    <option value="Berjalan">Berjalan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    required
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    required
                    value={editForm.endDate}
                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Target Anggaran / Budget (IDR)</label>
                <input
                  type="number"
                  value={editForm.budget}
                  onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">URL Gambar Sampul (Cover)</label>
                <input
                  type="text"
                  value={editForm.coverImage}
                  onChange={(e) => setEditForm({ ...editForm, coverImage: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                />
              </div>

              {/* Modal Footer: Menu Hapus Rencana + Simpan Perubahan */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleDeleteTripFromModal}
                  className="bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white border border-red-800/60 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Rencana</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTrip(null)}
                    className="bg-slate-800 text-slate-300 px-3 py-2 rounded-xl text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Share Trip Modal */}
      {sharingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSharingTrip(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-cyan-400" />
              Bagikan Rencana Perjalanan
            </h3>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs space-y-1">
              <p className="font-bold text-white">{sharingTrip.title}</p>
              <p className="text-[11px] text-slate-400">Kode Undangan Rombongan:</p>
              <p className="text-sm font-mono font-bold text-cyan-300 bg-slate-950 p-2 rounded-lg text-center tracking-widest border border-slate-800">
                {sharingTrip.shareCode || 'TRIP-8472'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Tautan Undangan Langsung</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : 'https://moccamana.vercel.app'}?shareCode=${sharingTrip.shareCode || 'TRIP-8472'}`}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-cyan-300 font-mono"
                />
                <button
                  onClick={() => handleCopyShareLink(sharingTrip.shareCode || 'TRIP-8472')}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSharingTrip(null)}
                className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
