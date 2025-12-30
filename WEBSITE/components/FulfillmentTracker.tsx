import React from 'react';
import { ChevronRight, TrendingUp } from 'lucide-react';

export const FulfillmentTracker = () => {
    // Mock Data
    const score = 84;
    const remaining = 100 - score;
    
    // Fitness Ring Calculations
    const size = 52;
    const strokeWidth = 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="px-6 mb-6 animate-in slide-in-from-right duration-500">
            <div className="bg-white py-3 px-4 pr-5 rounded-[1.8rem] border border-slate-100 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.05)] flex items-center justify-between group cursor-pointer hover:border-slate-200 transition-all active:scale-[0.99]">
                
                <div className="flex items-center gap-4">
                     {/* Minimalist Fitness Ring */}
                     <div className="relative w-[52px] h-[52px] flex items-center justify-center shrink-0">
                        {/* Background Track */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="26"
                                cy="26"
                                r={radius}
                                fill="none"
                                stroke="#F1F5F9"
                                strokeWidth={strokeWidth}
                            />
                            {/* Progress Arc */}
                            <circle
                                cx="26"
                                cy="26"
                                r={radius}
                                fill="none"
                                stroke="#10B981" 
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        
                        {/* Center Icon */}
                        <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                             <TrendingUp className="w-5 h-5 fill-emerald-100" />
                        </div>
                     </div>

                     {/* Metrics Text */}
                     <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                                {score}%
                            </h3>
                            <div className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-emerald-100 uppercase tracking-wide">
                                Well Adjusted
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400">
                            {remaining}% left to <span className="text-slate-600">Optimal Score</span>
                        </p>
                     </div>
                </div>

                {/* Arrow Action */}
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
};