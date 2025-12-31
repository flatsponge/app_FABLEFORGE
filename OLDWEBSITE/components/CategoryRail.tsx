import React from 'react';
import { CATEGORIES } from '../constants';

export const CategoryRail: React.FC = () => (
  <div className="mb-8 pl-6">
    <h2 className="text-lg font-bold text-slate-700 mb-4 pr-6">Explore Worlds</h2>
    <div className="flex gap-4 overflow-x-auto pb-4 pr-6 scrollbar-hide snap-x">
      {CATEGORIES.map((cat) => (
        <button 
          key={cat.id} 
          className={`flex-shrink-0 snap-start flex flex-col items-center justify-center w-24 h-24 rounded-3xl ${cat.color} active:scale-95 transition-transform hover:shadow-md`}
        >
          <div className="mb-2 bg-white/60 p-2 rounded-full backdrop-blur-sm">
            {cat.icon}
          </div>
          <span className={`text-xs font-bold ${cat.text}`}>{cat.name}</span>
        </button>
      ))}
    </div>
  </div>
);