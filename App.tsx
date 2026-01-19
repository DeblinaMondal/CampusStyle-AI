import React, { useState } from 'react';
import InputForm from './components/InputForm';
import WeeklyPlan from './components/WeeklyPlan';
import { UserPreferences, DailyPlan } from './types';
import { generateWeeklyPlan } from './services/geminiService';
import { Shirt, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<DailyPlan[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (prefs: UserPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generateWeeklyPlan(prefs);
      setCurrentPlan(plan);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while generating your plan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Shirt className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
              CampusStyle AI
            </span>
          </div>
          <div className="flex items-center text-sm font-medium text-slate-500">
             <Sparkles className="w-4 h-4 mr-1 text-amber-500" />
             <span>Powered by Gemini 3.0</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-900 font-bold hover:underline">Dismiss</button>
          </div>
        )}

        {!currentPlan ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Dress smarter for <span className="text-indigo-600">College</span>
              </h1>
              <p className="text-lg text-slate-600">
                Stop worrying about what to wear. Let AI curate your weekly wardrobe based on your classes, the weather, and your unique vibe.
              </p>
            </div>
            <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-500">
             <WeeklyPlan 
                plan={currentPlan} 
                onUpdatePlan={setCurrentPlan} 
                onReset={handleReset} 
             />
          </div>
        )}
      </main>
      
      {/* Footer */}
      {!currentPlan && (
        <footer className="py-8 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} CampusStyle AI. Designed for Students.</p>
        </footer>
      )}
    </div>
  );
};

export default App;
