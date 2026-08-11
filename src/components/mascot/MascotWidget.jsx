import React from 'react';
import { useTravel } from '../../context/TravelContext';
import { Sparkles, MessageCircle, X, RefreshCcw } from 'lucide-react';

export const MascotWidget = () => {
  const {
    mascotVisible,
    setMascotVisible,
    mascotBubble,
    setMascotBubble,
    mascotEmotion,
    petMascot,
    triggerMascotTip
  } = useTravel();

  if (!mascotVisible) {
    return (
      <button
        onClick={() => setMascotVisible(true)}
        className="fixed bottom-20 right-4 z-40 bg-slate-900/90 border border-amber-500/50 p-2 rounded-full shadow-2xl hover:scale-110 transition-transform"
        title="Buka Maskot Mocca"
      >
        <span className="text-xl">🐕</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-16 right-3 z-40 flex flex-col items-end pointer-events-none group">
      {/* Speech Bubble */}
      <div className="bg-slate-900/95 border border-amber-500/40 rounded-2xl p-3 max-w-[220px] shadow-2xl mb-2 relative pointer-events-auto animate-bounce-slow">
        <button
          onClick={() => setMascotBubble('')}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-800 text-slate-400 hover:text-white text-[10px] flex items-center justify-center border border-slate-700"
        >
          <X className="w-3 h-3" />
        </button>

        <p className="text-[11px] text-amber-200 font-medium leading-relaxed">
          {mascotBubble || "Woof! Ada yang bisa Mocca bantu untuk liburanmu?"}
        </p>

        {/* Bubble pointer */}
        <div className="absolute -bottom-2 right-6 w-3 h-3 bg-slate-900 border-r border-b border-amber-500/40 rotate-45" />
      </div>

      {/* Shiba Inu Body */}
      <div className="relative pointer-events-auto flex flex-col items-center">
        {/* Emotion Badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-amber-500/50 px-1.5 py-0.5 rounded-full text-xs shadow">
          {mascotEmotion}
        </div>

        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 p-0.5 shadow-xl cursor-pointer hover:scale-105 transition-transform flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=150&q=80"
            alt="Mocca Shiba Inu"
            onClick={petMascot}
            className="w-full h-full object-cover rounded-full border-2 border-slate-900"
          />
        </div>

        {/* Floating Actions on Hover */}
        <div className="flex items-center gap-1.5 mt-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={petMascot}
            className="bg-slate-900/90 border border-slate-700 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full hover:bg-slate-800 shadow"
            title="Elus Mocca"
          >
            🤝 Elus
          </button>
          <button
            onClick={triggerMascotTip}
            className="bg-slate-900/90 border border-slate-700 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full hover:bg-slate-800 shadow"
            title="Tips Perjalanan"
          >
            💡 Tips
          </button>
          <button
            onClick={() => setMascotVisible(false)}
            className="bg-slate-900/90 border border-slate-700 text-slate-400 text-[10px] p-1 rounded-full hover:bg-slate-800 shadow"
            title="Sembunyikan"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
