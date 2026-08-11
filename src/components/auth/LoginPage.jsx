import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, X, AlertTriangle } from 'lucide-react';

export const LoginPage = () => {
  const { loginUser, registerNewUser, usersList } = useTravel();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ username: '', password: '' });
  
  // Modal states
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1, 2, or 3
  
  // Form states for Register/Forgot
  const [regForm, setRegForm] = useState({ username: '', password: '', confirmPassword: '', question: 'Apa nama hewan peliharaan pertama Anda?', answer: '' });
  const [forgotForm, setForgotForm] = useState({ username: '', answer: '', newPassword: '', confirmPassword: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    
    setTimeout(() => {
      // 1. Admin login ilprad
      if (form.username === 'ilprad' && form.password === 'shibainu11') {
        loginUser('ilprad@moccamana.app', 'ilprad');
        setIsLoading(false);
        return;
      }

      // 2. Cek user lain di usersList
      const targetUser = usersList.find(u => u.username === form.username);
      if (targetUser) {
        if (targetUser.status === 'pending') {
          setErrorMsg('Akun Anda masih menunggu persetujuan Admin ilprad untuk login!');
        } else if (targetUser.status === 'approved') {
          loginUser(targetUser.email, targetUser.username);
        } else {
          setErrorMsg('Akses akun Anda tidak disetujui!');
        }
      } else {
        setErrorMsg('Username atau Password salah!');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (regForm.password !== regForm.confirmPassword) {
      alert('Password konfirmasi tidak cocok!');
      return;
    }
    
    // Tambah ke daftar pendaftar yang butuh persetujuan admin
    registerNewUser(regForm.username);
    alert(`Pendaftaran ${regForm.username} berhasil!\nAkun Anda memerlukan persetujuan Admin (ilprad) sebelum dapat login.`);
    setIsRegisterOpen(false);
  };

  const handleForgotNext = () => {
    if (!forgotForm.username.trim()) return;
    setForgotStep(2);
  };

  const handleForgotVerify = () => {
    if (!forgotForm.answer.trim()) return;
    setForgotStep(3);
  };

  const handleForgotReset = () => {
    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      alert('Password baru tidak cocok!');
      return;
    }
    alert('Password berhasil diubah!');
    setIsForgotOpen(false);
    setForgotStep(1);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f5e6d3 0%, #ede0cf 40%, #e8d5be 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #c8945a, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #8b5e3c, transparent)' }} />

      <div className="w-full max-w-[440px] animate-fadeIn relative z-10">
        <div className="bg-white/75 border border-[#c8945a]/25 rounded-[28px] p-8 md:p-10 shadow-2xl backdrop-blur-md text-[#3a1f00]">
          
          {/* Avatar Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-[180px] h-[180px] rounded-[36px] bg-[#FFEDD8] border-[3.5px] border-[#D4A056] outline outline-[2.5px] outline-[#8B4A20] -outline-offset-4 shadow-lg flex flex-col items-center justify-start pt-3 pb-1 mb-4 overflow-hidden hover:scale-104 transition-transform duration-300 relative">
              <div className="text-[1.15rem] font-black text-[#4A2E1B] tracking-[1.5px] uppercase select-none z-10">
                MOCCAMANA
              </div>
              <img 
                src="/mocca_map_new.png" 
                alt="Moccamana Mascot" 
                className="w-[175px] h-[155px] object-contain scale-115 -translate-y-5 translate-x-2"
                onError={(e) => {
                  e.target.src = '/mocca_map.png';
                }}
              />
            </div>
            <p className="text-[0.92rem] text-[#8b5e3c] font-medium leading-relaxed max-w-[320px]">
              Rencanakan rute dan biaya perjalanan bersama Mocca
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#8b5e3c]">Username</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-[#c8945a]" />
                <input
                  type="text"
                  placeholder="Masukkan username"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#8b5e3c]/6 border border-[#c8945a]/25 rounded-xl text-sm text-[#3a1f00] placeholder-[#c8945a]/60 outline-none focus:bg-white focus:border-[#8b5e3c] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#8b5e3c]">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-[#c8945a]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full pl-10 pr-11 py-3 bg-[#8b5e3c]/6 border border-[#c8945a]/25 rounded-xl text-sm text-[#3a1f00] placeholder-[#c8945a]/60 outline-none focus:bg-white focus:border-[#8b5e3c] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#c8945a] hover:text-[#8b5e3c] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Form actions link */}
            <div className="flex items-center justify-between text-[0.78rem] pt-1">
              <button
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className="text-[#D4A056] hover:text-[#F5DEB3] font-bold hover:underline transition-colors flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                Daftar Akun Baru
              </button>
              <button
                type="button"
                onClick={() => { setIsForgotOpen(true); setForgotStep(1); }}
                className="text-[#D4A056] hover:text-[#F5DEB3] font-semibold hover:underline"
              >
                Lupa Password?
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#8b5e3c] hover:bg-[#724b2f] border border-[#8b5e3c]/30 text-white text-sm font-extrabold tracking-wide shadow-md shadow-[#8b5e3c]/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              <span>{isLoading ? 'MEMPROSES...' : 'LOGIN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-5 text-[0.75rem] text-[#8b5e3c] font-semibold text-center tracking-wide">
            Moccamana App v2.0 • by ilhamprad
          </p>

        </div>
      </div>

      {/* ================= REGISTER MODAL ================= */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-[11000] flex items-center justify-center p-4">
          <div className="bg-[#1C0F07]/96 border border-[#D4A056]/45 rounded-2xl w-full max-w-[480px] p-6 shadow-2xl text-[#FFF8F2]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-[#C07347]" />
                Daftar Akun Baru
              </h2>
              <button onClick={() => setIsRegisterOpen(false)} className="text-[#7A5C44] hover:text-[#FFF8F2]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-[#C9A882]">Username Baru</label>
                <input
                  type="text"
                  placeholder="contoh: userbaru123"
                  required
                  value={regForm.username}
                  onChange={e => setRegForm({ ...regForm, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FFF8F2]/8 border border-[#D4A056]/35 rounded-xl text-sm text-[#FFF8F2] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#C9A882]">Password</label>
                <input
                  type="password"
                  placeholder="Masukkan password"
                  required
                  value={regForm.password}
                  onChange={e => setRegForm({ ...regForm, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FFF8F2]/8 border border-[#D4A056]/35 rounded-xl text-sm text-[#FFF8F2] outline-none"
                />
                <div className="bg-[#D4A056]/8 border border-dashed border-[#D4A056]/35 rounded-xl p-3.5 mt-2 text-[0.76rem] text-left">
                  <strong className="block text-[#F5DEB3] mb-1">Ketentuan Password:</strong>
                  <ul className="list-disc pl-4 text-[#C9A882] space-y-0.5">
                    <li>Minimal 6 Karakter</li>
                    <li>Minimal 1 Huruf Kapital (A-Z)</li>
                    <li>Minimal 1 Angka (0-9)</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#C9A882]">Konfirmasi Password</label>
                <input
                  type="password"
                  placeholder="Ulangi password"
                  required
                  value={regForm.confirmPassword}
                  onChange={e => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FFF8F2]/8 border border-[#D4A056]/35 rounded-xl text-sm text-[#FFF8F2] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#C9A882]">Pertanyaan Keamanan Pemulihan</label>
                <select 
                  value={regForm.question}
                  onChange={e => setRegForm({ ...regForm, question: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#1C1008] border border-[#D4A056]/35 rounded-xl text-sm text-[#FFF8F2] outline-none"
                >
                  <option value="Apa nama hewan peliharaan pertama Anda?">Apa nama hewan peliharaan pertama Anda?</option>
                  <option value="Apa nama SD/Sekolah Dasar pertama Anda?">Apa nama SD/Sekolah Dasar pertama Anda?</option>
                  <option value="Siapa nama ibu kandung Anda?">Siapa nama ibu kandung Anda?</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#C9A882]">Jawaban Pertanyaan Keamanan</label>
                <input
                  type="text"
                  placeholder="Jawaban Anda (bebas/rahasia)"
                  required
                  value={regForm.answer}
                  onChange={e => setRegForm({ ...regForm, answer: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FFF8F2]/8 border border-[#D4A056]/35 rounded-xl text-sm text-[#FFF8F2] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 bg-transparent text-[#FFF8F2]/80 hover:text-white text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-[#C07347] to-[#8B4A20] border border-[#F5DEB3]/30 rounded-xl text-xs font-bold shadow-md shadow-[#C07347]/30 hover:from-[#D4A056] hover:to-[#A05E35] transition-all"
                >
                  Daftar &amp; Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= FORGOT MODAL ================= */}
      {isForgotOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-[11000] flex items-center justify-center p-4">
          <div className="bg-[#1C0F07]/96 border border-[#D4A056]/45 rounded-2xl w-full max-w-[480px] p-6 shadow-2xl text-[#FFF8F2]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#C07347]" />
                Pemulihan Password
              </h2>
              <button onClick={() => setIsForgotOpen(false)} className="text-[#7A5C44] hover:text-[#FFF8F2]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#C9A882]">Username Akun Anda</label>
                  <input
                    type="text"
                    placeholder="Masukkan username Anda"
                    required
                    value={forgotForm.username}
                    onChange={e => setForgotForm({ ...forgotForm, username: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FFF8F2]/8 border border-[#D4A056]/35 rounded-xl text-sm text-[#FFF8F2] outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="px-4 py-2 bg-transparent text-[#FFF8F2]/80 hover:text-white text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleForgotNext}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#C07347] to-[#8B4A20] border border-[#F5DEB3]/30 rounded-xl text-xs font-bold shadow-md shadow-[#C07347]/30 hover:from-[#D4A056] hover:to-[#A05E35] transition-all"
                  >
                    Lanjut
                  </button>
                </div>
              </div>
            )}

            {forgotStep === 2 && (
              <div className="space-y-4">
                <div className="p-3 bg-[#D4A056]/12 border border-dashed border-[#D4A056]/30 rounded-xl text-xs text-[#F5DEB3] leading-relaxed">
                  Pertanyaan: Apa nama hewan peliharaan pertama Anda?
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#C9A882]">Jawaban Anda</label>
                  <input
                    type="text"
                    placeholder="Jawaban Anda (bebas/rahasia)"
                    required
                    value={forgotForm.answer}
                    onChange={e => setForgotForm({ ...forgotForm, answer: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FFF8F2]/8 border border-[#D4A056]/35 rounded-xl text-sm text-[#FFF8F2] outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="px-4 py-2 bg-transparent text-[#FFF8F2]/80 hover:text-white text-xs font-semibold"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleForgotVerify}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#C07347] to-[#8B4A20] border border-[#F5DEB3]/30 rounded-xl text-xs font-bold shadow-md shadow-[#C07347]/30 hover:from-[#D4A056] hover:to-[#A05E35] transition-all"
                  >
                    Verifikasi
                  </button>
                </div>
              </div>
            )}

            {forgotStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#C9A882]">Password Baru</label>
                  <input
                    type="password"
                    placeholder="Masukkan password baru"
                    required
                    value={forgotForm.newPassword}
                    onChange={e => setForgotForm({ ...forgotForm, newPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FFF8F2]/8 border border-[#D4A056]/35 rounded-xl text-sm text-[#FFF8F2] outline-none"
                  />
                  <div className="bg-[#D4A056]/8 border border-dashed border-[#D4A056]/35 rounded-xl p-3.5 mt-2 text-[0.76rem] text-left">
                    <strong className="block text-[#F5DEB3] mb-1">Ketentuan Password:</strong>
                    <ul className="list-disc pl-4 text-[#C9A882] space-y-0.5">
                      <li>Minimal 6 Karakter</li>
                      <li>Minimal 1 Huruf Kapital (A-Z)</li>
                      <li>Minimal 1 Angka (0-9)</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#C9A882]">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    placeholder="Ulangi password baru"
                    required
                    value={forgotForm.confirmPassword}
                    onChange={e => setForgotForm({ ...forgotForm, confirmPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FFF8F2]/8 border border-[#D4A056]/35 rounded-xl text-sm text-[#FFF8F2] outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="px-4 py-2 bg-transparent text-[#FFF8F2]/80 hover:text-white text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleForgotReset}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#C07347] to-[#8B4A20] border border-[#F5DEB3]/30 rounded-xl text-xs font-bold shadow-md shadow-[#C07347]/30 hover:from-[#D4A056] hover:to-[#A05E35] transition-all"
                  >
                    Ubah Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
