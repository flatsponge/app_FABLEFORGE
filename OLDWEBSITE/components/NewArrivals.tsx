import React from 'react';
import { ChevronRight } from 'lucide-react';
import { BOOKS } from '../constants';
import { BookCard } from './BookCard';
import { Book } from '../types';

interface NewArrivalsProps {
  onBookClick?: (book: Book) => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ onBookClick }) => (
  <div className="px-6 pb-28">
    <div className="flex justify-between items-end mb-4">
      <h2 className="text-lg font-bold text-slate-700">New Adventures</h2>
      <ChevronRight className="w-5 h-5 text-slate-400" />
    </div>
    <div className="grid grid-cols-2 gap-5">
      {BOOKS.map((book) => (
        <BookCard key={book.id} book={book} onClick={onBookClick} />
      ))}
    </div>
  </div>
);