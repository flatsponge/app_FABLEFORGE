import React from 'react';
import { Play, Clock } from 'lucide-react';
import { Book } from '../types';
import { BOOKS } from '../constants';

interface FeaturedCardProps {
  onRead?: (book: Book) => void;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({ onRead }) => {
  // Find "The Magic Forest" or fallback to first book
  const featuredBook = BOOKS.find(b => b.id === 5) || BOOKS[0];

  return (
    <div className="px-6 mb-8 animate-in fade-in slide-in-from-right duration-700">
      <div className="mb-4 px-1">
        <h2 className="text-lg font-bold text-slate-700">Continue Reading</h2>
      </div>

      <div 
        onClick={() => onRead && onRead(featuredBook)}
        className="group bg-white p-3 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex gap-5 cursor-pointer hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] hover:border-purple-100 transition-all active:scale-[0.99]"
      >
        {/* Minimalist Cover with Play Button */}
        <div className="relative w-28 aspect-[3/4] rounded-[1.5rem] overflow-hidden shrink-0 shadow-sm">
            <img 
                src={featuredBook.coverImage} 
                alt={featuredBook.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
            
            {/* Centered Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-purple-600">
                     <Play className="w-5 h-5 fill-current ml-0.5" />
                 </div>
            </div>
        </div>

        {/* Content Side */}
        <div className="flex-1 py-1 pr-2 flex flex-col justify-center">
             
             {/* Meta Tags */}
             <div className="flex items-center gap-2 mb-2">
                 <div className="bg-purple-50 text-purple-600 text-[10px] font-black px-2 py-1 rounded-lg border border-purple-100 uppercase tracking-wide">
                     Chapter 3
                 </div>
                 <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                     <Clock className="w-3 h-3" />
                     <span>12m left</span>
                 </div>
             </div>
             
             <h3 className="text-lg font-extrabold text-slate-800 leading-tight mb-1 group-hover:text-purple-600 transition-colors">
                {featuredBook.title}
             </h3>
             <p className="text-xs font-bold text-slate-400 mb-5">by {featuredBook.author}</p>

             {/* Minimal Progress Bar */}
             <div className="w-full">
                 <div className="flex justify-between items-end mb-1.5">
                     <span className="text-[10px] font-bold text-slate-400">Progress</span>
                     <span className="text-[11px] font-black text-slate-800">60%</span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                     <div className="h-full bg-purple-500 rounded-full w-[60%] shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};