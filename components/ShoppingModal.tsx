import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, ExternalLink, Loader2 } from 'lucide-react';
import { getShoppingSuggestions } from '../services/geminiService';
import { ShoppingSuggestion } from '../types';

interface ShoppingModalProps {
  query: string;
  onClose: () => void;
}

const ShoppingModal: React.FC<ShoppingModalProps> = ({ query, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ShoppingSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchItems = async () => {
      try {
        setLoading(true);
        const results = await getShoppingSuggestions(query);
        if (mounted) setItems(results);
      } catch (err) {
        if (mounted) setError("Could not fetch shopping suggestions.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchItems();
    return () => { mounted = false; };
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-indigo-700">
            <ShoppingBag className="w-5 h-5" />
            <h3 className="font-bold text-lg">Shop this look</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-600 mb-4 text-sm">
            Searching for: <span className="font-semibold text-slate-900">{query}</span>
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-sm text-slate-500">AI is finding the best matches...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 text-sm">
              {error}
            </div>
          ) : items.length === 0 ? (
             <div className="text-center py-8 text-slate-500 text-sm">
              No specific products found, but you can search manually.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium text-slate-900 truncate group-hover:text-indigo-700">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      {item.source}
                      {item.price && <span className="text-emerald-600 font-medium ml-2">• {item.price}</span>}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                </a>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
             <a 
                href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 hover:underline font-medium"
             >
                View more on Google Shopping &rarr;
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingModal;
