
import React, { useState, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, RotateCcw, Check, Sparkles, BookOpen, 
  Pause, Play, Lock, Timer, ThumbsUp, ThumbsDown, Send 
} from 'lucide-react';
import { Book } from '../types';
import { STORY_DATA } from '../constants';

export type ReadingMode = 'autoplay' | 'child' | 'parent';

interface ReadingViewProps {
  book: Book;
  mode: ReadingMode;
  onClose: () => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ book, mode, onClose }) => {
  const [page, setPage] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  
  // Logic States
  const [isAutoPlaying, setIsAutoPlaying] = useState(mode === 'autoplay');
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [canAdvance, setCanAdvance] = useState(true); // For Child Mode anti-spam
  
  // Feedback States
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  const stories = STORY_DATA[book.id] || ["Once upon a time... (Story content missing)"];
  
  // Mode Flags
  const isChildMode = mode === 'child';
  const isParentMode = mode === 'parent';
  const isAutoplayMode = mode === 'autoplay';

  // --- Sentence Parsing Logic for Parent Mode ---
  const getCurrentSentences = () => {
    const text = stories[page] || "";
    return text.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) || [text];
  };

  const currentSentences = getCurrentSentences();

  // Reset sentence index & Spam Block on page change
  useEffect(() => {
    setCurrentSentenceIdx(0);
    
    // Anti-Spam Logic for Child Mode
    if (isChildMode && !showCompletion) {
        setCanAdvance(false);
        const timer = setTimeout(() => {
            setCanAdvance(true);
        }, 2000); // 2 Second Block
        return () => clearTimeout(timer);
    } else {
        setCanAdvance(true);
    }
  }, [page, isChildMode, showCompletion]);

  // Autoplay Logic
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isAutoPlaying && !showCompletion) {
      // Calculate reading time based on length, min 4s
      const readingTime = Math.max(4000, stories[page].length * 60);
      
      timer = setTimeout(() => {
        if (page < stories.length - 1) {
          setPage(p => p + 1);
        } else {
          setIsAutoPlaying(false);
          setShowCompletion(true);
        }
      }, readingTime);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, page, stories, showCompletion]);

  // Parent Mode Highlight Animation
  useEffect(() => {
    let highlightTimer: ReturnType<typeof setTimeout>;
    
    if (isParentMode && !showCompletion && currentSentenceIdx < currentSentences.length) {
      const sentence = currentSentences[currentSentenceIdx];
      const wordCount = sentence.split(/\s+/).length;
      const duration = Math.max(1500, wordCount * 300 + 500);

      highlightTimer = setTimeout(() => {
         if (currentSentenceIdx < currentSentences.length - 1) {
            setCurrentSentenceIdx(prev => prev + 1);
         }
      }, duration);
    }

    return () => clearTimeout(highlightTimer);
  }, [isParentMode, currentSentenceIdx, currentSentences, showCompletion]);
  
  const handleNext = () => {
    if (!canAdvance && isChildMode) return; // Block spam

    if (page < stories.length - 1) {
      setPage(page + 1);
    } else {
      setShowCompletion(true);
      setIsAutoPlaying(false);
    }
  };

  const handleBack = () => {
    if (page > 0) {
      setPage(page - 1);
      setShowCompletion(false);
    }
  };

  const handleRestart = () => {
    setPage(0);
    setShowCompletion(false);
    setIsAutoPlaying(mode === 'autoplay');
    setRating(null);
    setFeedbackText('');
    setFeedbackSubmitted(false);
  };

  const progress = ((page + 1) / stories.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#FDFBF7] flex flex-row overflow-hidden animate-in fade-in duration-500">
      
      {/* --- LEFT PANEL: VISUALS (50%) --- */}
      <div className="relative w-1/2 h-full bg-slate-900 flex items-center justify-center overflow-hidden">
         {/* Ambient Background */}
         <div className="absolute inset-0 opacity-40">
            <img 
                src={book.coverImage} 
                className="w-full h-full object-cover blur-2xl scale-125 saturate-150" 
                alt="Ambient bg" 
            />
            <div className="absolute inset-0 bg-black/20"></div>
         </div>

         {/* Main Illustration Card */}
         <div className="relative z-10 w-[85%] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50 border-[6px] border-white/10 ring-1 ring-black/20 transform transition-all duration-700 hover:scale-[1.02]">
             <img 
                src={book.coverImage} 
                className="w-full h-full object-cover" 
                alt="Story Scene" 
             />
             
             {/* Mode Indicator Overlay */}
             <div className="absolute top-4 left-4 flex gap-2">
                 {isAutoPlaying && (
                    <div className="bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                        AUTOPLAY
                    </div>
                 )}
             </div>
         </div>

         {/* Page Indicator (Visual Side) */}
         <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-20">
             {stories.map((_, idx) => (
                 <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === page ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`}
                 />
             ))}
         </div>
      </div>

      {/* --- RIGHT PANEL: NARRATIVE (50%) --- */}
      <div className="relative w-1/2 h-full bg-white flex flex-col z-20 shadow-[-20px_0_60px_rgba(0,0,0,0.05)]">
         
         {/* Header Controls */}
         <div className="flex items-center justify-between p-6 z-30">
             <div className="flex items-center gap-3">
                 <button 
                    onClick={onClose}
                    className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all active:scale-95"
                 >
                    <X className="w-6 h-6" />
                 </button>
                 {isParentMode && (
                     <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-xs font-bold">
                        <BookOpen className="w-3.5 h-3.5" />
                        Parent Mode
                     </div>
                 )}
             </div>
         </div>

         {/* Story Content Area */}
         <div className="flex-1 flex flex-col justify-center px-10 lg:px-16 relative overflow-y-auto">
             {!showCompletion ? (
                 <div className="animate-in fade-in slide-in-from-right-4 duration-500 key={page}">
                     {isParentMode ? (
                        <p className="text-2xl lg:text-3xl leading-relaxed text-slate-800 font-serif font-medium">
                            {currentSentences.map((sentence, index) => (
                                <span 
                                    key={index} 
                                    className={`
                                        transition-colors duration-500 decoration-clone
                                        ${index === currentSentenceIdx 
                                            ? 'text-indigo-600 bg-indigo-50 rounded px-1 -mx-1 box-decoration-clone' 
                                            : 'text-slate-700'
                                        }
                                        ${index > currentSentenceIdx ? 'opacity-40' : 'opacity-100'}
                                    `}
                                >
                                    {sentence}{' '}
                                </span>
                            ))}
                        </p>
                     ) : (
                        <p className="text-3xl lg:text-5xl leading-snug text-slate-800 font-sans font-bold tracking-tight">
                            {stories[page]}
                        </p>
                     )}
                 </div>
             ) : (
                 <div className="flex flex-col items-center text-center animate-in zoom-in duration-300 w-full max-w-md mx-auto">
                     <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                         <Sparkles className="w-12 h-12 text-yellow-500 fill-yellow-500" />
                     </div>
                     <h2 className="text-4xl font-black text-slate-800 mb-2">The End!</h2>
                     <p className="text-slate-500 text-lg font-medium mb-8">What a wonderful adventure.</p>
                     
                     {/* Rating Section */}
                     {!feedbackSubmitted ? (
                         <div className="bg-slate-50 rounded-3xl p-6 mb-8 w-full border border-slate-100">
                             <h3 className="text-slate-700 font-bold mb-4">How was the story?</h3>
                             
                             <div className="flex justify-center gap-4 mb-4">
                                 <button 
                                     onClick={() => setRating('up')}
                                     className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${rating === 'up' ? 'bg-green-500 text-white shadow-lg scale-110' : 'bg-white text-slate-400 border border-slate-200 hover:border-green-400 hover:text-green-500'}`}
                                 >
                                     <ThumbsUp className={`w-8 h-8 ${rating === 'up' ? 'fill-current' : ''}`} />
                                 </button>
                                 <button 
                                     onClick={() => setRating('down')}
                                     className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${rating === 'down' ? 'bg-red-500 text-white shadow-lg scale-110' : 'bg-white text-slate-400 border border-slate-200 hover:border-red-400 hover:text-red-500'}`}
                                 >
                                     <ThumbsDown className={`w-8 h-8 ${rating === 'down' ? 'fill-current' : ''}`} />
                                 </button>
                             </div>

                             {/* Parent Feedback Form */}
                             {rating && isParentMode && (
                                 <div className="animate-in slide-in-from-bottom-2 duration-300 pt-2 text-left">
                                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                         {rating === 'up' ? 'What did you like?' : 'What can we improve?'}
                                     </label>
                                     <textarea
                                         value={feedbackText}
                                         onChange={(e) => setFeedbackText(e.target.value)}
                                         placeholder={rating === 'up' ? "The vocabulary was great..." : "It was too scary..."}
                                         className="w-full p-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium focus:outline-none focus:border-indigo-400 mb-3 resize-none h-24"
                                     />
                                     <button 
                                        onClick={() => setFeedbackSubmitted(true)}
                                        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                     >
                                         <Send className="w-4 h-4" />
                                         Submit Feedback
                                     </button>
                                 </div>
                             )}
                         </div>
                     ) : (
                         <div className="bg-green-50 rounded-3xl p-6 mb-8 w-full border border-green-100 flex flex-col items-center animate-in zoom-in duration-300">
                             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                                 <Check className="w-6 h-6" strokeWidth={3} />
                             </div>
                             <h3 className="text-green-800 font-bold">Feedback Sent!</h3>
                             <p className="text-green-600 text-xs font-bold mt-1">Thanks for helping us improve.</p>
                         </div>
                     )}
                     
                     <div className="flex gap-4">
                        <button 
                            onClick={handleRestart}
                            className="px-6 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Read Again
                        </button>
                        <button 
                            onClick={onClose}
                            className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                        >
                            Close Book
                        </button>
                     </div>
                 </div>
             )}
         </div>

         {/* --- FOOTER CONTROLS --- */}
         <div className="p-6 pt-0">
             
             {/* 1. AUTOPLAY CONTROLS */}
             {isAutoplayMode && !showCompletion && (
                 <div className="bg-slate-50 rounded-[2rem] p-4 flex items-center justify-between shadow-inner">
                     <button 
                        onClick={handleRestart}
                        className="w-14 h-14 rounded-full bg-white text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-colors active:scale-95"
                     >
                        <RotateCcw className="w-6 h-6" />
                     </button>

                     <div className="flex-1 px-6">
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                     </div>

                     <button 
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                        className="w-20 h-20 rounded-[1.5rem] bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 transition-all"
                     >
                        {isAutoPlaying ? (
                            <Pause className="w-8 h-8 fill-current" />
                        ) : (
                            <Play className="w-8 h-8 fill-current ml-1" />
                        )}
                     </button>
                 </div>
             )}

             {/* 2. CHILD MODE CONTROLS (Chunky Buttons) */}
             {isChildMode && !showCompletion && (
                 <div className="flex gap-4 items-stretch h-28">
                     <button 
                        onClick={handleBack}
                        disabled={page === 0}
                        className={`
                            flex-1 rounded-[2rem] border-b-[8px] border-r-2 border-l-2 border-t-2 text-2xl font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:translate-y-2 active:border-b-2
                            ${page === 0 
                                ? 'bg-slate-100 border-slate-200 text-slate-300 pointer-events-none' 
                                : 'bg-amber-400 border-amber-600 text-amber-900 hover:bg-amber-300'
                            }
                        `}
                     >
                        <ChevronLeft className="w-8 h-8" strokeWidth={4} />
                        Back
                     </button>

                     <button 
                        onClick={handleNext}
                        className={`
                            flex-[2] rounded-[2rem] border-b-[8px] border-r-2 border-l-2 border-t-2 text-3xl font-black uppercase tracking-wider flex items-center justify-center gap-3 transition-all active:translate-y-2 active:border-b-2
                            ${!canAdvance 
                                ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed' 
                                : 'bg-emerald-400 border-emerald-600 text-emerald-900 hover:bg-emerald-300 shadow-xl shadow-emerald-100'
                            }
                        `}
                     >
                        {!canAdvance ? (
                            <div className="flex items-center gap-2 animate-pulse">
                                <Timer className="w-8 h-8" />
                                <span>Wait...</span>
                            </div>
                        ) : (
                            <>
                                <span>Next</span>
                                <ChevronRight className="w-10 h-10" strokeWidth={4} />
                            </>
                        )}
                     </button>
                 </div>
             )}

             {/* 3. PARENT MODE CONTROLS (Ergonomic) */}
             {isParentMode && !showCompletion && (
                 <div className="flex items-center justify-between gap-6">
                     <button 
                        onClick={handleBack}
                        disabled={page === 0}
                        className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center border-2 border-slate-100 text-slate-400 transition-all ${page === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-slate-50 hover:border-slate-200 active:scale-95'}`}
                     >
                        <ChevronLeft className="w-8 h-8" strokeWidth={2.5} />
                     </button>

                     <div className="w-full max-w-[200px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div 
                            className="h-full bg-indigo-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                         ></div>
                     </div>

                     <button 
                        onClick={handleNext}
                        className="w-24 h-24 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all group"
                     >
                        {page === stories.length - 1 ? (
                            <Check className="w-10 h-10" strokeWidth={3} />
                        ) : (
                            <ChevronRight className="w-12 h-12 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                        )}
                     </button>
                 </div>
             )}
         </div>

      </div>
    </div>
  );
};
