import React, { useState } from 'react';
import { Star, Clock, Heart, Play, Sparkles } from 'lucide-react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
  showNewBadge?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick, showNewBadge }) => {
  const [isLiked, setIsLiked] = useState(book.isLiked);

  const handleLike = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsLiked(!isLiked);
  };

  return (
    <div 
        className="group cursor-pointer flex flex-col h-full"
        onClick={() => onClick && onClick(book)}
    >
        <div className="relative w-full aspect-[4/5] rounded-[2rem] shadow-md shadow-slate-200/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col justify-between overflow-hidden bg-slate-100">
            
            {/* New Badge */}
            {showNewBadge && (
                <div className="absolute top-3 left-3 z-20 animate-in zoom-in duration-300">
                    <div className="bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/20 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 fill-current" />
                        NEW
                    </div>
                </div>
            )}
            
            {/* Cover Image */}
            <img 
                src={book.coverImage} 
                alt={book.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Header: Just Like Button */}
            <div className="relative z-10 flex justify-end p-4">
                 <button 
                    onClick={handleLike}
                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-90 ${isLiked ? 'bg-white text-rose-500 border-white shadow-sm' : 'bg-black/20 text-white border-white/20 hover:bg-black/30'}`}
                 >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                 </button>
            </div>

            {/* Bottom Info Area */}
            <div className="relative z-10 p-5">
                <h3 className="font-bold text-xl text-white leading-tight mb-2 drop-shadow-sm line-clamp-2">{book.title}</h3>
                
                <div className="flex items-center gap-3 text-white/90 text-xs font-bold">
                    <div className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                        <Clock className="w-3 h-3" />
                        <span>{book.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{book.rating}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {book.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40 backdrop-blur-sm">
                    <div className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${book.progress}%` }}></div>
                </div>
            )}
        </div>
    </div>
  );
};