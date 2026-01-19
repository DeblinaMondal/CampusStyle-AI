import React, { useState } from 'react';
import { DailyPlan, DayOfWeek, OutfitItem } from '../types';
import { ShoppingBag, Plus, Trash2, Calendar, Sun, CloudRain, Wind, Snowflake, Info } from 'lucide-react';
import ShoppingModal from './ShoppingModal';

interface WeeklyPlanProps {
  plan: DailyPlan[];
  onUpdatePlan: (newPlan: DailyPlan[]) => void;
  onReset: () => void;
}

const WeeklyPlan: React.FC<WeeklyPlanProps> = ({ plan, onUpdatePlan, onReset }) => {
  const [shoppingQuery, setShoppingQuery] = useState<string | null>(null);

  const removeItem = (dayIndex: number, itemId: string) => {
    const newPlan = [...plan];
    newPlan[dayIndex].outfitItems = newPlan[dayIndex].outfitItems.filter(item => item.id !== itemId);
    onUpdatePlan(newPlan);
  };

  const addItem = (dayIndex: number) => {
    const name = prompt("Enter the name of the item (e.g., 'White Sneakers'):");
    if (!name) return;
    
    const newItem: OutfitItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type: 'other' // simplified for manual add
    };

    const newPlan = [...plan];
    newPlan[dayIndex].outfitItems.push(newItem);
    onUpdatePlan(newPlan);
  };

  const getWeatherIcon = (tip: string) => {
    const t = tip.toLowerCase();
    if (t.includes('rain') || t.includes('umbrella')) return <CloudRain className="w-4 h-4 text-blue-500" />;
    if (t.includes('snow') || t.includes('cold')) return <Snowflake className="w-4 h-4 text-cyan-500" />;
    if (t.includes('wind')) return <Wind className="w-4 h-4 text-slate-500" />;
    return <Sun className="w-4 h-4 text-amber-500" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'top': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'bottom': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'shoes': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'outerwear': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'accessory': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Your Weekly Wardrobe</h2>
          <p className="text-slate-500 mt-1">Curated AI selections for your schedule.</p>
        </div>
        <button 
          onClick={onReset}
          className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 hover:text-red-600 transition-colors"
        >
          Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plan.map((dayPlan, index) => (
          <div 
            key={dayPlan.day} 
            className={`flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-100 overflow-hidden ${dayPlan.hasCollege ? 'ring-1 ring-indigo-50' : 'opacity-90'}`}
          >
            <div className={`p-4 flex items-center justify-between border-b ${dayPlan.hasCollege ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white'}`}>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 opacity-80" />
                <span className="font-bold text-lg">{dayPlan.day}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${dayPlan.hasCollege ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-200'}`}>
                {dayPlan.hasCollege ? 'COLLEGE' : 'OFF DAY'}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col gap-4">
              
              {/* Weather & Reason */}
              <div className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                <div className="mt-0.5">{getWeatherIcon(dayPlan.weatherTip)}</div>
                <div>
                   <p className="font-medium text-slate-800 mb-1">{dayPlan.reasoning}</p>
                   <p className="text-xs text-slate-500 italic">{dayPlan.weatherTip}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-end mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Outfit & Accessories</h4>
                  <button onClick={() => addItem(index)} className="text-indigo-600 hover:text-indigo-800 p-1">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {dayPlan.outfitItems.map((item) => (
                  <div key={item.id} className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${getTypeColor(item.type)}`}>
                        {item.type.slice(0, 3)}
                      </span>
                      <div className="flex flex-col min-w-0">
                         <span className="text-sm font-medium text-slate-800 truncate pr-2">{item.name}</span>
                         {item.color && <span className="text-xs text-slate-400">{item.color}</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setShoppingQuery(`${item.name} ${item.color || ''} fashion`)}
                        title="Shop this item"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => removeItem(index, item.id)}
                        title="Remove item"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {dayPlan.outfitItems.length === 0 && (
                   <div className="text-center py-6 text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-lg">
                     No items added yet.
                   </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {shoppingQuery && (
        <ShoppingModal 
          query={shoppingQuery} 
          onClose={() => setShoppingQuery(null)} 
        />
      )}
    </div>
  );
};

export default WeeklyPlan;
