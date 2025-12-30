import React from 'react';
import { ChevronLeft, Star, Play, Baby, Glasses, Clock, Heart, Zap, Sparkles } from 'lucide-react';
import { Book } from '../types';

interface BookDetailsViewProps {
  book: Book;
  onBack: () => void;
  onSelectMode: (mode: 'autoplay' | 'child' | 'parent') => void;
}

export const BookDetailsView: React.FC<BookDetailsViewProps> = ({ book, onBack, onSelectMode }) => {
  const getDifficultyColor = (level: string) => {
      switch(level) {
          case 'Beginner': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
          case 'Intermediate': return 'bg-amber-50 text-amber-700 border-amber-100';
          case 'Advanced': return 'bg-rose-50 text-rose-700 border-rose-100';
          default: return 'bg-slate-50 text-slate-600';
      }
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#FDFBF7] overflow-y-auto scrollbar-hide animate-in slide-in-from-right duration-300">
      
      {/* Floating Navbar */}
      <div className="fixed top-0 max-w-md w-full left-0 right-0 mx-auto p-6 pt-12 flex justify-between items-center z-50 pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto w-11 h-11 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/30 transition-all active:scale-95 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className={`pointer-events-auto w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center transition-all active:scale-95 shadow-lg ${book.isLiked ? 'bg-white text-rose-500 border-white' : 'bg-black/20 text-white border-white/20 hover:bg-black/30'}`}>
          <Heart className={`w-5 h-5 ${book.isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] flex items-end justify-center overflow-hidden bg-slate-900">
          {/* Cover Image Background */}
          <img 
            src={book.coverImage} 
            alt={book.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
          
      </div>

      {/* Content Card */}
      <div className="relative z-20 -mt-32 px-0 pb-safe">
        <div className="bg-gradient-to-b from-transparent to-[#FDFBF7] pt-32 px-8 pb-12">
            
            {/* Header Info */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-2 leading-tight tracking-tight drop-shadow-sm">{book.title}</h1>
                <p className="text-slate-500 font-bold text-lg mb-6 tracking-wide">by {book.author}</p>
                
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-slate-700 font-bold text-sm">{book.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700 font-bold text-sm">{book.duration}</span>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-sm ${getDifficultyColor(book.vocabularyLevel)}`}>
                        <Zap className="w-4 h-4" />
                        <span className="font-bold text-sm">{book.vocabularyLevel}</span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mb-10 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <h3 className="text-xs font-black text-slate-900 mb-3 uppercase tracking-widest pl-1 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    Story Synopsis
                </h3>
                <p className="text-slate-600 text-base leading-relaxed font-medium">
                    {book.description}
                </p>
            </div>

            {/* Reading Modes */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-widest text-center">Start Reading</h3>
                
                {/* 1. Handover / Autoplay */}
                <button 
                    onClick={() => onSelectMode('autoplay')}
                    className="w-full p-1 rounded-[2rem] bg-slate-900 shadow-xl shadow-slate-300 active:scale-95 transition-all group relative overflow-hidden"
                >
                    <div className="relative bg-slate-800 rounded-[1.8rem] p-5 flex items-center gap-5 border border-white/10">
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-slate-900 text-slate-900 pl-1" />
                        </div>
                        <div className="text-left text-white">
                            <div className="font-extrabold text-xl tracking-tight">Auto-Play</div>
                            <div className="text-slate-400 text-sm font-medium">Listen & Watch</div>
                        </div>
                    </div>
                </button>

                <div className="grid grid-cols-2 gap-4">
                    {/* 2. Child Manual */}
                    <button 
                        onClick={() => onSelectMode('child')}
                        className="p-5 rounded-[2rem] bg-white border border-slate-200 hover:border-slate-300 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all group shadow-sm"
                    >
                        <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Baby className="w-7 h-7" />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">Read Myself</span>
                    </button>

                    {/* 3. Parent Readalong */}
                    <button 
                        onClick={() => onSelectMode('parent')}
                        className="p-5 rounded-[2rem] bg-white border border-slate-200 hover:border-slate-300 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all group shadow-sm"
                    >
                        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Glasses className="w-7 h-7" />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">Read Together</span>
                    </button>
                </div>
            </div>

            <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
};