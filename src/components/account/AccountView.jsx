import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { User, LogIn, LogOut, RefreshCw, Database, Cloud, ShieldCheck, Mail, Phone, Edit3, Save, CheckCircle2, UserCheck, UserX, Clock, Shield } from 'lucide-react';

export const AccountView = () => {
  const { user, loginUser, logoutUser, updateUser, settings, syncDataCloud, usersList, approveUser, rejectUser } = useTravel();
  const [isEditing, setIsEditing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUsersPanelOpen, setIsUsersPanelOpen] = useState(true);
  const [userFilterTab, setUserFilterTab] = useState('Semua'); // 'Semua' | 'Menunggu' | 'Disetujui'
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    bio: user.bio,
    avatar: user.avatar
  });

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [authForm, setAuthForm] = useState({ email: '', name: '', password: '' });
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser(editForm);
    setIsEditing(false);
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      syncDataCloud();
      setIsSyncing(false);
    }, 1200);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    loginUser(authForm.email, authForm.name);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
      {/* Header Banner tanpa Fase 4 */}
      <div className="bg-gradient-to-r from-amber-900/60 via-slate-900 to-yellow-900/40 p-4 rounded-2xl border border-amber-500/30 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-amber-300 font-medium flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            Profil &amp; Autentikasi
          </span>
          {user.role === 'admin' && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase tracking-wider flex items-center gap-1 ml-auto">
              <Shield className="w-3 h-3" /> Admin
            </span>
          )}
        </div>
        <h2 className="text-xl font-extrabold text-white">Akun Saya</h2>
        <p className="text-xs text-slate-300 mt-0.5">Kelola informasi pribadi dan sinkronisasi data cloud.</p>
      </div>

      {!user.isLoggedIn ? (
        /* Login / Register Card (Sub-Fitur: Daftar Akun, Masuk) */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              {isRegisterMode ? 'Daftar Akun Jelajah Baru' : 'Masuk ke Akun Saya'}
            </h3>
            <p className="text-xs text-slate-400">
              {isRegisterMode ? 'Buat profil baru untuk menyimpan rencana Anda.' : 'Akses kembali semua itinerary perjalanan Anda.'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-3">
            {isRegisterMode && (
              <div>
                <label className="block text-xs text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Budi Pratama"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-300 mb-1">Alamat Email</label>
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Kata Sandi</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md shadow-amber-500/20"
            >
              {isRegisterMode ? 'Daftar Sekarang' : 'Masuk Akun'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800">
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs text-amber-400 hover:underline font-medium"
            >
              {isRegisterMode ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar Akun Baru'}
            </button>
          </div>
        </div>
      ) : (
        /* Logged In Profile Card */
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 relative">
            <div className="flex items-center gap-3.5">
              <div className="relative group cursor-pointer" onClick={() => setIsEditing(true)}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500/50 shadow-md group-hover:opacity-80 transition-opacity"
                />
                <label className="absolute -bottom-1 -right-1 bg-amber-500 hover:bg-amber-400 text-slate-950 p-1 rounded-lg cursor-pointer shadow-md" title="Ganti Foto Profil">
                  <Edit3 className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarFileChange} />
                </label>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white">{user.name}</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                    title="Ubah Profil"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3 text-amber-400" /> {user.email}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-amber-400" /> {user.phone}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 italic">
              "{user.bio}"
            </p>

            {/* Profile Edit Form */}
            {isEditing && (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-2 border-t border-slate-800 animate-fadeIn">
                <h4 className="text-xs font-bold text-amber-400">Edit Info Profil</h4>
                
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Ganti Foto Profil</label>
                  <div className="flex items-center gap-2">
                    <label className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 shrink-0">
                      <Edit3 className="w-3.5 h-3.5" /> Pilih File Gambar
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarFileChange} />
                    </label>
                    <span className="text-[10px] text-slate-400">atau paste link URL foto di bawah</span>
                  </div>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={editForm.avatar}
                    onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white mt-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400">Nama</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400">Nomor Telepon</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400">Bio Ringkas</label>
                  <input
                    type="text"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-slate-800 text-slate-300 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-amber-500 text-slate-950 py-1.5 rounded-lg text-xs font-bold"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            )}

            {/* Logout Button (Sub-Fitur: Keluar) */}
            <button
              onClick={logoutUser}
              className="w-full bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun</span>
            </button>
          </div>

          {/* Sub-Fitur 3: Sinkronkan Data Cloud */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-amber-400" />
                3. Sinkronkan Data Cloud
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Online
              </span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Status Sinkronisasi:</span>
                <span className="font-bold text-amber-400">{settings.sync.status}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Terakhir Dibarui:</span>
                <span>{settings.sync.lastSynced}</span>
              </div>
            </div>

            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
            </button>
          </div>

          {/* Special Feature: Kelola User (Khusus Admin) */}
          {user.role === 'admin' && (
            <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl overflow-hidden shadow-lg">
              <button
                onClick={() => setIsUsersPanelOpen(!isUsersPanelOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/60 transition-colors"
              >
                <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <Shield className="w-4 h-4 text-amber-400" />
                  Panel Admin: Kelola User &amp; Persetujuan Login
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                    {usersList.filter(u => u.status === 'pending').length} Pending
                  </span>
                  <span className="text-amber-400 text-xs">{isUsersPanelOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {isUsersPanelOpen && (
                <div className="p-4 pt-2 border-t border-slate-800 space-y-3">
                  {/* Search & Filter Bar */}
                  <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
                    <input
                      type="text"
                      placeholder="Cari username/email..."
                      value={userSearchQuery}
                      onChange={e => setUserSearchQuery(e.target.value)}
                      className="w-full sm:w-48 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-400"
                    />
                    <div className="flex bg-slate-800 p-0.5 rounded-xl border border-slate-700 w-full sm:w-auto">
                      {['Semua', 'Menunggu', 'Disetujui'].map(tab => (
                        <button
                          key={tab}
                          onClick={() => setUserFilterTab(tab)}
                          className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            userFilterTab === tab
                              ? 'bg-amber-500 text-slate-950 shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable Container with Max Height */}
                  <div className="max-h-64 overflow-y-auto pr-1 space-y-2 no-scrollbar">
                    {(() => {
                      const filteredList = usersList.filter(u => {
                        const q = userSearchQuery.toLowerCase();
                        const matchQ = u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
                        if (userFilterTab === 'Menunggu') return matchQ && u.status === 'pending';
                        if (userFilterTab === 'Disetujui') return matchQ && u.status === 'approved';
                        return matchQ;
                      });

                      if (filteredList.length === 0) {
                        return (
                          <div className="text-center py-4 bg-slate-800/40 rounded-xl border border-slate-800">
                            <p className="text-xs text-slate-400 font-medium">
                              {userFilterTab === 'Menunggu' ? 'Tidak ada pendaftaran user yang menunggu persetujuan.' : 'Belum ada user yang disetujui.'}
                            </p>
                          </div>
                        );
                      }

                      return filteredList.map((uItem) => (
                        <div key={uItem.id} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center justify-between gap-3 hover:border-slate-600 transition-colors">
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white truncate">{uItem.username}</span>
                              {uItem.role === 'admin' ? (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                  Admin
                                </span>
                              ) : uItem.status === 'approved' ? (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-0.5">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Disetujui
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 flex items-center gap-0.5 animate-pulse">
                                  <Clock className="w-2.5 h-2.5" /> Menunggu Admin
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">{uItem.email} • {uItem.registeredAt}</p>
                          </div>

                          {uItem.role !== 'admin' && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              {uItem.status === 'pending' ? (
                                <>
                                  <button
                                    onClick={() => approveUser(uItem.id)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm"
                                    title="Setujui User Login"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" /> Setujui
                                  </button>
                                  <button
                                    onClick={() => rejectUser(uItem.id)}
                                    className="px-2 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-[10px] font-semibold flex items-center gap-1 border border-red-800/40"
                                    title="Tolak Pendaftaran"
                                  >
                                    <UserX className="w-3.5 h-3.5" /> Tolak
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => rejectUser(uItem.id)}
                                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 text-[10px] font-medium"
                                  title="Hapus Akses User"
                                >
                                  Hapus
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
