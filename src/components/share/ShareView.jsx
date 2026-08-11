import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { Share2, Link, QrCode, UserPlus, Shield, Copy, Check, Users, Trash2, ExternalLink } from 'lucide-react';

export const ShareView = () => {
  const { selectedTrip, addCollaborator, trips } = useTravel();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  // Invite friend form
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Bisa Mengedit');

  if (!selectedTrip) {
    return (
      <div className="p-6 text-center text-slate-400">
        <p>Pilih rencana perjalanan terlebih dahulu untuk dibagikan.</p>
      </div>
    );
  }

  const shareUrl = `https://jelajah.app/trip/${selectedTrip.shareCode || 'BALI-2026'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    addCollaborator(selectedTrip.id, {
      email: inviteEmail,
      role: inviteRole
    });
    setInviteEmail('');
    alert(`Undangan dikirim ke ${inviteEmail}!`);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-pink-900/40 p-4 rounded-2xl border border-purple-500/30 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-500 text-slate-950 uppercase tracking-wide">
            Fase 3
          </span>
          <span className="text-xs text-purple-300 font-medium">Kolaborasi & Akses</span>
        </div>
        <h2 className="text-xl font-extrabold text-white">Bagikan Rencana</h2>
        <p className="text-xs text-slate-300 mt-0.5">Undang teman dan atur izin akses untuk trip bersama.</p>
      </div>

      {/* Selected Trip Info Card */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 flex items-center gap-3">
        <img
          src={selectedTrip.coverImage}
          alt={selectedTrip.title}
          className="w-14 h-14 rounded-xl object-cover"
        />
        <div className="flex-1">
          <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider">
            Rencana Aktif
          </span>
          <h3 className="font-bold text-sm text-white leading-tight">{selectedTrip.title}</h3>
          <p className="text-[11px] text-slate-400">{selectedTrip.destination} • {selectedTrip.startDate}</p>
        </div>
      </div>

      {/* Sub-Fitur 1: Buat Tautan & QR Code */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <Link className="w-4 h-4 text-purple-400" />
          1. Buat Tautan Rencana
        </h3>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-purple-300 font-mono focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              copied
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>
        </div>

        <button
          onClick={() => setShowQR(!showQR)}
          className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <QrCode className="w-4 h-4 text-purple-400" />
          <span>{showQR ? 'Sembunyikan QR Code' : 'Tampilkan Kode QR'}</span>
        </button>

        {showQR && (
          <div className="bg-white p-4 rounded-xl w-44 h-44 mx-auto flex flex-col items-center justify-center shadow-lg animate-fadeIn">
            {/* Simulated QR Code SVG */}
            <div className="w-36 h-36 bg-slate-900 p-2 rounded-lg flex items-center justify-center text-center">
              <span className="text-[10px] font-mono text-cyan-400 font-bold leading-tight">
                [QR CODE]<br />
                {selectedTrip.shareCode}<br />
                SCAN UNTUK GABUNG
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sub-Fitur 2: Undang Teman */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <UserPlus className="w-4 h-4 text-purple-400" />
          2. Undang Teman (Kolaborator)
        </h3>

        <form onSubmit={handleInviteSubmit} className="space-y-2.5">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Email / Username Teman</label>
            <input
              type="email"
              required
              placeholder="teman@email.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Izin Akses Awal</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="Bisa Mengedit">Bisa Mengedit (Edit Itinerary)</option>
              <option value="Lihat Saja">Lihat Saja (Read Only)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-purple-600/20"
          >
            Kirim Undangan
          </button>
        </form>
      </div>

      {/* Sub-Fitur 3: Atur Izin Akses */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-purple-400" />
            3. Atur Izin Akses Anggota
          </h3>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            {(selectedTrip.collaborators || []).length + 1} Anggota
          </span>
        </div>

        <div className="space-y-2">
          {/* Owner */}
          <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                alt="Owner"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-white">Anda (Pemilik)</p>
                <p className="text-[10px] text-slate-400">budi.pratama@traveler.id</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Pemilik Rencana
            </span>
          </div>

          {/* Collaborators List */}
          {(selectedTrip.collaborators || []).map((collab) => (
            <div key={collab.id} className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <img
                  src={collab.avatar}
                  alt={collab.name}
                  className="w-8 h-8 rounded-full object-cover bg-slate-700"
                />
                <div>
                  <p className="text-xs font-bold text-white">{collab.name}</p>
                  <p className="text-[10px] text-slate-400">{collab.email}</p>
                </div>
              </div>

              {/* Role Toggle Selector */}
              <select
                value={collab.role}
                onChange={(e) => {
                  const newRole = e.target.value;
                  // update in context
                  alert(`Izin akses ${collab.name} diubah ke ${newRole}`);
                }}
                className="bg-slate-900 text-purple-300 text-[10px] font-bold border border-purple-800 rounded px-2 py-1 focus:outline-none"
              >
                <option value="Bisa Mengedit">Bisa Mengedit</option>
                <option value="Lihat Saja">Lihat Saja</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
