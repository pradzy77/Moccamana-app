import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import {
  Heart, Plus, ThumbsUp, Check, X, Link2, CheckCircle2, AlertCircle, ExternalLink,
  MessageSquare, Send, Clock
} from 'lucide-react';
import { getTripDays } from './TripDetailView';

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

export const WishlistPanel = () => {
  const {
    selectedTrip, addWishlistProposal, voteWishlist, addWishlistComment, acceptWishlistToItinerary, user
  } = useTravel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayTab, setSelectedDayTab] = useState(1);

  // Time picker modal state for "+ Itinerary"
  const [acceptingItem, setAcceptingItem] = useState(null);
  const [acceptTimeStart, setAcceptTimeStart] = useState('10:00');

  // Expanded comment sections state: { [wishlistId]: boolean }
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const [proposal, setProposal] = useState({
    day: 1,
    title: '',
    cost: '',
    notes: '',
    gmapsUrl: '',
    lat: -8.6212,
    lng: 115.0868
  });

  const [parseStatus, setParseStatus] = useState(null);

  if (!selectedTrip) return null;

  const tripDays = getTripDays(selectedTrip);
  const currentUserId = user.email || user.name || 'self';

  const handleGmapsUrlChange = (url) => {
    setProposal(prev => ({ ...prev, gmapsUrl: url }));
    const parsed = parseGoogleMapsUrl(url);
    if (parsed) {
      setProposal(prev => ({ ...prev, gmapsUrl: url, lat: parsed.lat, lng: parsed.lng }));
      setParseStatus('success');
    } else if (url.trim().length > 0) {
      setParseStatus('error');
    } else {
      setParseStatus(null);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!proposal.title) return;
    addWishlistProposal(selectedTrip.id, {
      ...proposal,
      day: Number(proposal.day) || selectedDayTab
    });
    setProposal({ day: selectedDayTab, title: '', cost: '', notes: '', gmapsUrl: '', lat: -8.6212, lng: 115.0868 });
    setParseStatus(null);
    setIsModalOpen(false);
  };

  const toggleComments = (id) => {
    setOpenComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendComment = (wishlistId) => {
    const text = commentInputs[wishlistId] || '';
    if (!text.trim()) return;
    addWishlistComment(selectedTrip.id, wishlistId, text);
    setCommentInputs(prev => ({ ...prev, [wishlistId]: '' }));
  };

  const handleOpenAcceptModal = (item) => {
    setAcceptingItem(item);
    setAcceptTimeStart('10:00');
  };

  const handleConfirmAccept = (e) => {
    e.preventDefault();
    if (!acceptingItem) return;
    acceptWishlistToItinerary(selectedTrip.id, acceptingItem.id, acceptTimeStart);
    setAcceptingItem(null);
  };

  const wishlistItems = selectedTrip.wishlist || [];
  const filteredItems = wishlistItems.filter(item => item.day === selectedDayTab);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-pink-950/40 p-4 rounded-2xl border border-rose-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            Wishlist Destinasi Grup
          </h2>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Kolaborasikan destinasimu dengan tim
          </p>
        </div>
        <button
          onClick={() => {
            setProposal(prev => ({ ...prev, day: selectedDayTab }));
            setParseStatus(null);
            setIsModalOpen(true);
          }}
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 shadow-md shadow-rose-600/20 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Usulan</span>
        </button>
      </div>

      {/* Dynamic Day Switcher Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {tripDays.map((dNum) => (
          <button
            key={dNum}
            onClick={() => setSelectedDayTab(dNum)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              selectedDayTab === dNum
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            HARI {dNum}
          </button>
        ))}
      </div>

      {/* Wishlist Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-6 text-center">
            <Heart className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-300">Belum ada usulan destinasi untuk Hari Ke-{selectedDayTab}</p>
            <p className="text-[11px] text-slate-500 mt-1">Klik "Tambah Usulan" untuk mengusulkan tempat menarik.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const gmapsTargetUrl = item.gmapsUrl || (item.lat ? `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}` : null);
            const isCommentsOpen = openComments[item.id];
            const commentsList = item.comments || [];
            const hasVoted = (item.votedBy || []).includes(currentUserId);

            return (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 rounded-2xl overflow-hidden transition-all shadow-md"
              >
                <div className="p-3.5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-800/40">
                          HARI KE-{item.day}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Diusulkan oleh: <strong className="text-slate-200">{item.proposedBy}</strong>
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white mt-1">{item.title}</h3>
                    </div>

                    {/* 1. Vote Button (1 vote per user limit) */}
                    <button
                      onClick={() => voteWishlist(selectedTrip.id, item.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-sm ${
                        hasVoted
                          ? 'bg-rose-600 text-white border border-rose-400'
                          : 'bg-slate-800 hover:bg-rose-950/60 text-rose-400 border border-slate-700 hover:border-rose-500/50'
                      }`}
                      title={hasVoted ? 'Anda sudah memilih tempat ini (Klik untuk batalkan vote)' : 'Klik untuk memilih tempat ini (1x vote per user)'}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{item.votes || 0} Vote</span>
                      {hasVoted && <span className="text-[9px] bg-rose-950 px-1 rounded">✓ Voted</span>}
                    </button>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-300 italic bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                      "{item.notes}"
                    </p>
                  )}

                  {/* Bottom Row: Cost, Map Link, Komen Toggle, + Itinerary Button */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-emerald-400">
                        {item.cost > 0 ? `Rp ${item.cost.toLocaleString('id-ID')}` : 'Gratis'}
                      </span>

                      {gmapsTargetUrl && (
                        <a
                          href={gmapsTargetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-rose-400 hover:text-rose-200 flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800"
                          title="Buka di Google Maps"
                        >
                          <ExternalLink className="w-3 h-3 text-rose-400" />
                          <span>Lokasi</span>
                        </a>
                      )}

                      {/* 2. Komen Toggle Button */}
                      <button
                        onClick={() => toggleComments(item.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                          isCommentsOpen
                            ? 'bg-rose-950/80 text-rose-300 border-rose-700'
                            : 'bg-slate-800 text-slate-300 hover:text-rose-400 border-slate-700'
                        }`}
                      >
                        <MessageSquare className="w-3 h-3 text-rose-400" />
                        <span>{commentsList.length} Komen</span>
                      </button>
                    </div>

                    {/* 3. Button "+ Itinerary" */}
                    <button
                      onClick={() => handleOpenAcceptModal(item)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md shadow-emerald-600/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Itinerary</span>
                    </button>
                  </div>
                </div>

                {/* 2. Comment Section Expanded in the Red Box Area below card */}
                {isCommentsOpen && (
                  <div className="bg-slate-950/90 border-t border-slate-800 p-3 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                        Komentar Rombongan ({commentsList.length})
                      </h4>
                      <button
                        onClick={() => toggleComments(item.id)}
                        className="text-[10px] text-slate-400 hover:text-white"
                      >
                        Tutup
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-44 overflow-y-auto no-scrollbar">
                      {commentsList.length === 0 ? (
                        <p className="text-[10px] text-slate-500 italic py-1">Belum ada komentar. Tulis komentar pertama untuk tempat ini!</p>
                      ) : (
                        commentsList.map(c => (
                          <div key={c.id} className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 text-xs space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-rose-300 text-[11px]">{c.user}</span>
                              <span className="text-[9px] text-slate-500">{c.time}</span>
                            </div>
                            <p className="text-slate-200 text-[11px]">{c.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        placeholder="Tulis komentar kamu..."
                        value={commentInputs[item.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [item.id]: e.target.value })}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendComment(item.id); }}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                      />
                      <button
                        onClick={() => handleSendComment(item.id)}
                        className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Time Picker for "+ Itinerary" */}
      {acceptingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                Tambah ke Itinerary Hari Ke-{acceptingItem.day}
              </h3>
              <button
                onClick={() => setAcceptingItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs">
              <p className="font-bold text-white text-sm">{acceptingItem.title}</p>
              <p className="text-emerald-400 font-semibold mt-0.5">
                {acceptingItem.cost > 0 ? `Rp ${acceptingItem.cost.toLocaleString('id-ID')}` : 'Gratis'}
              </p>
            </div>

            <form onSubmit={handleConfirmAccept} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Masukkan Waktu / Jam Mulai Kegiatan
                </label>
                <input
                  type="text"
                  required
                  placeholder="14:00"
                  value={acceptTimeStart}
                  onChange={(e) => setAcceptTimeStart(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  💡 Jam mulai akan menentukan urutan kegiatan pada itinerary & peta lokasi.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAcceptingItem(null)}
                  className="flex-1 bg-slate-800 text-slate-300 py-2 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  + Tambahkan ke Itinerary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Wishlist Proposal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl relative space-y-3 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              Tambah Usulan Destinasi Grup
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Nama Tempat / Destinasi</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Warung Kopi Gunung Ubud"
                  value={proposal.title}
                  onChange={(e) => setProposal({ ...proposal, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Link Google Maps / Location Presisi Input */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-rose-400" />
                  Link Google Maps / Lokasi Presisi
                </label>
                <input
                  type="text"
                  placeholder="Tempel link Google Maps (misal: https://maps.app.goo.gl/... atau @-8.6212,115.0868)"
                  value={proposal.gmapsUrl}
                  onChange={(e) => handleGmapsUrlChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                />

                {parseStatus === 'success' && (
                  <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/60 p-1.5 rounded-lg border border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    Koordinat Presisi Terdeteksi: {proposal.lat.toFixed(5)}, {proposal.lng.toFixed(5)}
                  </p>
                )}

                {parseStatus === 'error' && (
                  <p className="text-[10px] text-amber-400 font-medium flex items-center gap-1 bg-amber-950/60 p-1.5 rounded-lg border border-amber-800/60">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    Link dimasukkan. Isi koordinat Latitude & Longitude di bawah jika perlu penyesuaian.
                  </p>
                )}

                {/* Precision Coordinates Manual inputs */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={proposal.lat}
                      onChange={(e) => setProposal({ ...proposal, lat: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-rose-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={proposal.lng}
                      onChange={(e) => setProposal({ ...proposal, lng: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-rose-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Usulkan Untuk Hari</label>
                  <select
                    value={proposal.day}
                    onChange={(e) => setProposal({ ...proposal, day: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {tripDays.map(d => (
                      <option key={d} value={d}>Hari Ke-{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Estimasi Biaya (IDR)</label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={proposal.cost}
                    onChange={(e) => setProposal({ ...proposal, cost: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Catatan / Alasan Mengusulkan</label>
                <input
                  type="text"
                  placeholder="Tempatnya bagus untuk nongkrong sunset..."
                  value={proposal.notes}
                  onChange={(e) => setProposal({ ...proposal, notes: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 text-slate-300 py-2 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-rose-600/20"
                >
                  Kirim Usulan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
