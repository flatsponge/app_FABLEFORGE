import React from 'react';
import { BookOpen, Search } from 'lucide-react';

export const Header: React.FC = () => (
  <div className="flex justify-between items-center px-6 pt-12 pb-6 bg-slate-50/95 backdrop-blur-sm sticky top-0 z-20">
    <div className="flex items-center gap-3">
      <div className="bg-yellow-400 p-2 rounded-2xl shadow-sm rotate-3">
        <BookOpen className="text-white w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Story<span className="text-yellow-500">Time</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium">Good Morning, Leo! ☀️</p>
      </div>
    </div>
    <button className="bg-white p-2.5 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 border border-slate-100">
      <Search className="w-5 h-5 text-slate-400" />
    </button>
  </div>
);