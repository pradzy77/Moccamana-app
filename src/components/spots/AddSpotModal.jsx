import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { X, MapPin, Tag, DollarSign, Star, Image, FileText } from 'lucide-react';

export const AddSpotModal = ({ isOpen, onClose }) => {
  const { addSpot } = useTravel();
  const [spotData, setSpotData] = useState({
    name: '',
    category: 'Alam',
    destination: 'Bali',
    rating: 4.8,
    price: '',
    address: '',
    description: '',
    image: '',
    lat: -8.6212,
    lng: 115.0868
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!spotData.name) return;

    addSpot({
      ...spotData,
      image: spotData.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
    });
    onClose();
    setSpotData({ name: '', category: 'Alam', destination: 'Bali', rating: 4.8, price: '', address: '', description: '', image: '', lat: -8.6212, lng: 115.0868 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto no-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            FASE 2 - SUB FITUR
          </span>
          <h2 className="text-base font-bold text-white">Tambah Tempat Wisata</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Nama Tempat Wisata</label>
            <input
              type="text"
              required
              placeholder="e.g. Pantai Pandawa"
              value={spotData.name}
              onChange={(e) => setSpotData({ ...spotData, name: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-400" /> Kategori (Kelompok)
              </label>
              <select
                value={spotData.category}
                onChange={(e) => setSpotData({ ...spotData, category: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Alam">Wisata Alam</option>
                <option value="Kuliner">Kuliner & Cafe</option>
                <option value="Budaya">Budaya & Pura</option>
                <option value="Belanja">Belanja Oleh-Oleh</option>
                <option value="Transportasi">Transportasi / Dermaga</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" /> Tiket Masuk (IDR)
              </label>
              <input
                type="number"
                placeholder="0 untuk gratis"
                value={spotData.price}
                onChange={(e) => setSpotData({ ...spotData, price: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Lokasi / Kota</label>
            <input
              type="text"
              placeholder="e.g. Badung, Bali"
              value={spotData.address}
              onChange={(e) => setSpotData({ ...spotData, address: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">URL Gambar Foto</label>
            <input
              type="url"
              placeholder="https://..."
              value={spotData.image}
              onChange={(e) => setSpotData({ ...spotData, image: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Deskripsi Singkat</label>
            <textarea
              rows="2"
              placeholder="Keunikan tempat, pemandangan, fasilitas..."
              value={spotData.description}
              onChange={(e) => setSpotData({ ...spotData, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl font-semibold text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20"
            >
              Simpan Tempat Wisata
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
