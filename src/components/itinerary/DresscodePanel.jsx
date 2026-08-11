import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { Shirt, Edit3, Palette, Copy, Check, Clock } from 'lucide-react';
import { getTripDays } from './TripDetailView';

export const DresscodePanel = () => {
  const { selectedTrip, updateDresscode } = useTravel();
  const [selectedDayTab, setSelectedDayTab] = useState(1);
  const [editingKey, setEditingKey] = useState(null); // 'act_Y'
  const [editForm, setEditForm] = useState({ color: '', notes: '' });
  const [copiedKey, setCopiedKey] = useState(null);

  if (!selectedTrip) return null;

  const tripDays = getTripDays(selectedTrip);
  const dresscodeObj = selectedTrip.dresscode || {};
  const activities = selectedTrip.activities || [];

  // Day activities sorted chronologically
  const dayActivities = activities
    .filter(a => a.day === selectedDayTab)
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleStartEdit = (key, currentData) => {
    setEditingKey(key);
    setEditForm({
      color: currentData?.color || 'White & Sky Blue',
      notes: currentData?.notes || 'Pakaian santai dan nyaman.'
    });
  };

  const handleSaveEdit = (key) => {
    updateDresscode(selectedTrip.id, key, editForm);
    setEditingKey(null);
  };

  // Copy dresscode from previous activity
  const handleCopyPrevActivity = (actIdx, currentActKey) => {
    let sourceDc = null;

    if (actIdx > 0) {
      const prevAct = dayActivities[actIdx - 1];
      sourceDc = dresscodeObj[`act_${prevAct.id}`];
    } else if (selectedDayTab > 1) {
      const prevDayActs = activities
        .filter(a => a.day === selectedDayTab - 1)
        .sort((a, b) => a.time.localeCompare(b.time));
      if (prevDayActs.length > 0) {
        const lastPrevAct = prevDayActs[prevDayActs.length - 1];
        sourceDc = dresscodeObj[`act_${lastPrevAct.id}`];
      }
    }

    if (!sourceDc) {
      sourceDc = { color: 'White & Blue', notes: 'Pakaian santai adem.' };
    }

    updateDresscode(selectedTrip.id, currentActKey, sourceDc);
    setCopiedKey(currentActKey);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 p-4 rounded-2xl border border-blue-500/30 shadow-lg">
        <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
          <Shirt className="w-4 h-4 text-blue-400" />
          Dresscode
        </h2>
        <p className="text-[11px] text-slate-300 mt-0.5">
          Atur dresscode kegiatan kalian agar foto makin seragam!
        </p>
      </div>

      {/* Dynamic Day Switcher Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {tripDays.map((dNum) => (
          <button
            key={dNum}
            onClick={() => setSelectedDayTab(dNum)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              selectedDayTab === dNum
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            HARI {dNum}
          </button>
        ))}
      </div>

      {/* Per-Activity Dresscode Cards List */}
      <div className="space-y-3">
        {dayActivities.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-6 text-center">
            <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-400">Belum ada kegiatan pada Hari Ke-{selectedDayTab}</p>
            <p className="text-[11px] text-slate-500 mt-1">Tambahkan kegiatan pada menu Rencana terlebih dahulu.</p>
          </div>
        ) : (
          dayActivities.map((act, idx) => {
            const actKey = `act_${act.id}`;
            const actDc = dresscodeObj[actKey] || {
              color: 'White & Blue',
              notes: `Outfit untuk ${act.title}`
            };

            // Connected end time
            const nextTime = idx < dayActivities.length - 1 ? dayActivities[idx + 1].time : '24:00';
            const isEditing = editingKey === actKey;

            const canCopy = idx > 0 || selectedDayTab > 1;
            const copyLabel = idx > 0 ? `copy dc #${idx}` : `copy dc (Hari H-${selectedDayTab - 1})`;

            return (
              <div
                key={act.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 transition-all shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800/40 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-400" />
                        #{idx + 1} • {act.time} - {nextTime}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white mt-1.5">{act.title}</h4>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {canCopy && (
                      <button
                        onClick={() => handleCopyPrevActivity(idx, actKey)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-[10px] font-bold flex items-center gap-1 border border-slate-700 transition-colors"
                        title={`Salin Dresscode dari kegiatan #${idx}`}
                      >
                        {copiedKey === actKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === actKey ? 'Tersalin!' : copyLabel}</span>
                      </button>
                    )}

                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(actKey, actDc)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold"
                        title="Edit Dresscode Kegiatan Ini"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {!isEditing ? (
                  <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <Palette className="w-3.5 h-3.5 text-blue-400" />
                        Dresscode / Warna:
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                        {actDc.color}
                      </span>
                    </div>
                    {actDc.notes && (
                      <p className="text-[11px] text-slate-300 italic pt-0.5">
                        "{actDc.notes}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Warna Dominan / Dresscode</label>
                      <input
                        type="text"
                        value={editForm.color}
                        onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Catatan Outfit</label>
                      <input
                        type="text"
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setEditingKey(null)}
                        className="flex-1 bg-slate-800 text-slate-300 py-1 rounded-lg text-xs font-semibold"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => handleSaveEdit(actKey)}
                        className="flex-1 bg-blue-600 text-white py-1 rounded-lg text-xs font-bold"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
