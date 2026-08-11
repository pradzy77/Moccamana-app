import React from 'react';
import { useTravel } from '../../context/TravelContext';
import { Wifi, Battery, Signal } from 'lucide-react';

export const MobileFrame = ({ children }) => {
  const { isMobileFrame } = useTravel();

  if (!isMobileFrame) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-4 px-2 md:py-8 flex flex-col items-center justify-center relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      {/* Ambient background blur circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Phone Frame Device Container */}
      <div className="w-full max-w-[430px] h-[880px] bg-slate-900 rounded-[50px] p-3 shadow-[0_0_50px_rgba(0,0,0,0.8)] border-[6px] border-slate-800 ring-1 ring-slate-700/50 flex flex-col relative overflow-hidden">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-2.5 shadow-sm border border-slate-800/80">
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800" />
          <div className="w-2.5 h-2.5 bg-blue-900/60 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-cyan-400 rounded-full" />
          </div>
        </div>

        {/* Top Status Bar */}
        <div className="w-full h-8 px-6 pt-1 flex items-center justify-between text-slate-300 text-xs font-semibold z-30 select-none">
          <span>09:41</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Mobile Viewport Screen Content */}
        <div className="flex-1 bg-slate-950 rounded-[40px] overflow-hidden flex flex-col relative shadow-inner border border-slate-800/50">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="w-full h-4 flex items-center justify-center pt-1 z-30">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
