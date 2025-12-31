import React from 'react';
import { Search, Volume2 } from 'lucide-react';

export const SearchBar: React.FC = () => (
    <div className="px-6 mb-6">
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            </div>
            <input 
                type="text" 
                className="block w-full pl-11 pr-4 py-4 rounded-3xl bg-white border-2 border-transparent focus:border-purple-300 focus:bg-purple-50 text-slate-700 placeholder-slate-400 focus:outline-none shadow-sm transition-all font-medium text-sm"
                placeholder="Find a story..." 
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="bg-purple-100 p-1.5 rounded-xl text-purple-600">
                    <Volume2 size={16} />
                </div>
            </div>
        </div>
    </div>
);