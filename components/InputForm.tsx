import React, { useState, ChangeEvent } from 'react';
import { UserPreferences, DayOfWeek, Season, StylePreference, Gender } from '../types';
import { Upload, X, Check, ArrowRight, Loader2 } from 'lucide-react';

interface InputFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [prefs, setPrefs] = useState<UserPreferences>({
    gender: Gender.FEMALE,
    collegeDays: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY],
    startTime: '09:00',
    endTime: '16:00',
    season: Season.SPRING,
    style: StylePreference.CASUAL,
    additionalInstructions: '',
    userPhotoBase64: undefined,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const toggleDay = (day: DayOfWeek) => {
    setPrefs(prev => {
      const exists = prev.collegeDays.includes(day);
      if (exists) {
        return { ...prev, collegeDays: prev.collegeDays.filter(d => d !== day) };
      } else {
        return { ...prev, collegeDays: [...prev.collegeDays, day] };
      }
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPrefs(prev => ({ ...prev, userPhotoBase64: base64 }));
        setPreviewUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPrefs(prev => ({ ...prev, userPhotoBase64: undefined }));
    setPreviewUrl(null);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Create Your Style Profile</h2>
        <p className="opacity-90">Tell us about your schedule and preferences so AI can curate your perfect week.</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Days Selection */}
        <section>
          <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
            College Days
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(DayOfWeek).map(day => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  prefs.collegeDays.includes(day)
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </section>

        {/* Time & Season Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
              Time Shift
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="time"
                value={prefs.startTime}
                onChange={(e) => setPrefs({ ...prefs, startTime: e.target.value })}
                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 p-2.5"
              />
              <span className="text-slate-400 font-medium">to</span>
              <input
                type="time"
                value={prefs.endTime}
                onChange={(e) => setPrefs({ ...prefs, endTime: e.target.value })}
                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
              Season
            </label>
            <select
              value={prefs.season}
              onChange={(e) => setPrefs({ ...prefs, season: e.target.value as Season })}
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 p-2.5"
            >
              {Object.values(Season).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Gender & Style Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
              Gender
            </label>
            <select
              value={prefs.gender}
              onChange={(e) => setPrefs({ ...prefs, gender: e.target.value as Gender })}
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 p-2.5"
            >
              {Object.values(Gender).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
              Style Aesthetic
            </label>
            <select
              value={prefs.style}
              onChange={(e) => setPrefs({ ...prefs, style: e.target.value as StylePreference })}
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 p-2.5"
            >
              {Object.values(StylePreference).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Photo Upload Section */}
        <section>
             <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
              Your Photo (Optional)
            </label>
            {!previewUrl ? (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-slate-400" />
                    <p className="text-sm text-slate-500"><span className="font-semibold">Click to upload</span></p>
                    <p className="text-xs text-slate-400">PNG, JPG (MAX. 5MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            ) : (
              <div className="relative w-full h-48 rounded-lg overflow-hidden group border border-slate-200">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain bg-slate-100" />
                <button 
                  onClick={removePhoto}
                  className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                  AI will analyze this for fit and style matching
                </div>
              </div>
            )}
        </section>

        {/* Additional Instructions */}
        <section>
          <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
            Additional Instructions
          </label>
          <textarea
            rows={3}
            value={prefs.additionalInstructions}
            onChange={(e) => setPrefs({ ...prefs, additionalInstructions: e.target.value })}
            placeholder="E.g., We have a formal seminar on Wednesday, I prefer sneakers over boots..."
            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 p-3"
          />
        </section>

        <div className="pt-4">
          <button
            onClick={() => onSubmit(prefs)}
            disabled={isLoading}
            className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Curating Wardrobe...
              </>
            ) : (
              <>
                Generate My Weekly Plan
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputForm;