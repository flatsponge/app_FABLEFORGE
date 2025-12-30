import React, { useState } from 'react';
import { Search, Heart, Clock, Sparkles, Loader2, Hourglass } from 'lucide-react';
import { Book } from '../types';
import { BOOKS } from '../constants';
import { BookCard } from './BookCard';

interface LibraryViewProps {
  onBookClick: (book: Book) => void;
  isHome?: boolean;
}

// Mock Data for Queue
const QUEUED_BOOKS = [
  { id: 'q1', title: 'The Brave Little Toaster', task: 'Writing Chapter 3...', progress: 65, color: 'from-orange-300 to-amber-300' },
  { id: 'q2', title: 'Galaxy Quest', task: 'Waiting in queue', progress: 0, color: 'from-slate-200 to-slate-300' },
];

const QueuedBookCard = ({ book }: { book: typeof QUEUED_BOOKS[0] }) => (
    <div className="relative w-full aspect-[4/5] rounded-[2rem] p-5 shadow-sm border-2 border-dashed border-purple-200/60 flex flex-col justify-between overflow-hidden bg-purple-50/30 group">
        {/* Animated Background Gradient for active ones */}
        {book.progress > 0 && (
             <div className={`absolute inset-0 bg-gradient-to-br ${book.color} opacity-5`}></div>
        )}
        
        <div className="relative z-10 flex justify-between items-start">
             <div className="p-2 bg-white rounded-full shadow-sm border border-slate-100">
                {book.progress > 0 ? (
                    <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                ) : (
                    <Hourglass className="w-5 h-5 text-slate-400" />
                )}
             </div>
        </div>

        <div className="relative z-10">
            <h3 className="font-bold text-slate-700 text-lg leading-tight mb-2 line-clamp-2">{book.title}</h3>
            <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  {book.progress > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${book.progress > 0 ? 'bg-purple-500' : 'bg-slate-300'}`}></span>
                </span>
                <p className="text-xs font-bold text-purple-500 uppercase tracking-wide truncate">
                    {book.task}
                </p>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="relative z-10 w-full bg-white h-2 rounded-full overflow-hidden mt-4 border border-purple-100">
             <div 
                className={`h-full rounded-full transition-all duration-1000 ${book.progress > 0 ? 'bg-purple-400 w-full' : 'bg-slate-200'}`}
                style={{ width: `${Math.max(book.progress, 5)}%` }}
             ></div>
        </div>
    </div>
  );

// Helper to sort relative date strings
const getRecencyScore = (dateStr: string) => {
    const lower = dateStr.toLowerCase();
    if (lower.includes('just now')) return 0;
    if (lower.includes('today')) return 1;
    if (lower.includes('yesterday')) return 2;
    if (lower.includes('day')) {
        const match = lower.match(/(\d+)/);
        return match ? parseInt(match[0]) + 2 : 3;
    }
    if (lower.includes('week')) return 14;
    if (lower.includes('month')) return 30;
    return 999;
};

export const LibraryView: React.FC<LibraryViewProps> = ({ onBookClick, isHome = false }) => {
  const [filter, setFilter] = useState<'all' | 'favorites' | 'unfinished' | 'newest'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  let filteredBooks = BOOKS.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filter === 'favorites') return book.isLiked;
    if (filter === 'unfinished') return book.progress > 0 && book.progress < 100;
    return true;
  });

  // Apply sorting if 'newest' is selected
  if (filter === 'newest') {
      filteredBooks = [...filteredBooks].sort((a, b) => 
          getRecencyScore(a.generatedDate) - getRecencyScore(b.generatedDate)
      );
  }

  return (
    <div className={`bg-[#FDFBF7] animate-in fade-in duration-500 flex flex-col ${isHome ? 'pb-24' : 'min-h-full pb-32'}`}>
      {/* Sticky Header Section */}
      <div className={`px-6 pt-4 pb-4 bg-[#FDFBF7]/95 backdrop-blur-sm sticky z-10 flex flex-col gap-4 ${isHome ? 'top-0' : 'top-0 pt-12 border-b border-slate-100/50'}`}>
        
        {!isHome && (
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Library</h1>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                        {filteredBooks.length} {filteredBooks.length === 1 ? 'Adventure' : 'Adventures'} Collected
                    </p>
                </div>
                <div className="bg-purple-100 p-2.5 rounded-2xl">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
            </div>
        )}
        
        {/* Search Input */}
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            </div>
            <input 
                type="text" 
                placeholder="Find a story..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-slate-600 focus:outline-none focus:border-purple-300 focus:bg-purple-50/30 transition-all shadow-sm placeholder-slate-400"
            />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 pt-1 -mx-6 px-6">
            {[
                { id: 'all', label: 'All Books' },
                { id: 'newest', label: 'Newest', icon: Sparkles },
                { id: 'favorites', label: 'Favorites', icon: Heart },
                { id: 'unfinished', label: 'Continue', icon: Clock },
            ].map((f) => {
                const isActive = filter === f.id;
                const Icon = f.icon;
                return (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id as any)}
                        className={`
                            flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all active:scale-95
                            ${isActive 
                                ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200' 
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }
                        `}
                    >
                        {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'fill-current' : ''}`} />}
                        {f.label}
                    </button>
                )
            })}
        </div>
      </div>

      {/* Books Grid */}
      <div className={`px-6 py-2 flex-1 ${!isHome && 'overflow-y-auto scrollbar-hide'}`}>
        
        {/* Queue Section (Only show on All Books when not searching) */}
        {(filter === 'all' && !searchQuery) && (
            <div className="mb-8">
                 <div className="flex items-center gap-2 mb-4 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        Generating Now
                    </h2>
                 </div>
                 <div className="grid grid-cols-2 gap-x-5 gap-y-8">
                    {QUEUED_BOOKS.map(qb => (
                        <QueuedBookCard key={qb.id} book={qb} />
                    ))}
                 </div>
            </div>
        )}

        {/* Section Title if showing queue to distinguish */}
        {(filter === 'all' && !searchQuery) && (
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">
                Your Collection
            </h2>
        )}

        <div className="grid grid-cols-2 gap-x-5 gap-y-8">
            {filteredBooks.length > 0 ? (
                filteredBooks.map((book, index) => (
                    <BookCard 
                        key={book.id} 
                        book={book} 
                        onClick={onBookClick} 
                        showNewBadge={filter === 'newest' && index < 3}
                    />
                ))
            ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-20 opacity-50 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-slate-600 font-bold mb-1">No stories found</h3>
                    <p className="text-slate-400 text-xs max-w-[200px]">Try adjusting your search or create a new story!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};