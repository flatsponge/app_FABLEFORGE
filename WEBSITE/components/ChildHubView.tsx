import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Unlock, 
  Shirt, 
  Palette, 
  Star, 
  Crown,
  Gift,
  Mic,
  Sparkles,
  ArrowUp,
  Music,
  Send,
  Keyboard,
  X,
  RotateCcw,
  BookOpen,
  Play
} from 'lucide-react';
import { AvatarConfig, Book } from '../types';
import { SKIN_TONES, OUTFITS, HATS, TOYS, BOOKS } from '../constants';

interface ChildHubViewProps {
  isLocked: boolean;
  onToggleLock: (locked: boolean) => void;
  avatarConfig: AvatarConfig;
  onUpdateAvatar: (config: AvatarConfig) => void;
  onReadBook: (book: Book) => void;
}

export const ChildHubView: React.FC<ChildHubViewProps> = ({ 
    isLocked, 
    onToggleLock, 
    avatarConfig, 
    onUpdateAvatar,
    onReadBook
}) => {
  const [activeRoom, setActiveRoom] = useState<'wardrobe' | 'well' | 'read'>('wardrobe');
  
  // Wardrobe State
  const [wardrobeTab, setWardrobeTab] = useState<'clothes' | 'hats' | 'toys' | 'skin'>('clothes');
  
  // Wishing Well State
  const [wishState, setWishState] = useState<'idle' | 'recording' | 'typing' | 'review' | 'sent'>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [wishText, setWishText] = useState('');
  
  // Lock State
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showUnlockHint, setShowUnlockHint] = useState(false);

  // Audio Mock
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Helper getters
  const currentOutfit = OUTFITS.find(o => o.id === avatarConfig.outfitId) || OUTFITS[0];
  const currentHat = HATS.find(h => h.id === avatarConfig.hatId) || HATS[0];
  const currentToy = TOYS.find(t => t.id === avatarConfig.toyId) || TOYS[0];

  // --- Avatar Component ---
  const Avatar = ({ scale = 1 }: { scale?: number }) => (
    <div className="relative w-48 h-64 mx-auto transition-transform duration-500" style={{ transform: `scale(${scale})` }}>
      {/* Body */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-32 rounded-[2rem] shadow-sm z-10 border-4 border-black/10"
        style={{ backgroundColor: avatarConfig.skinColor }}
      ></div>

      {/* Clothes */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-24 rounded-t-[2rem] rounded-b-[2.5rem] z-20 ${currentOutfit.color} shadow-inner flex items-center justify-center border-4 border-black/5`}>
         <div className="opacity-20 text-white text-3xl">
             <Star className="w-8 h-8 animate-spin-slow" />
         </div>
      </div>
      
      {/* Head */}
      <div 
        className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-36 rounded-[3rem] shadow-sm z-30 flex flex-col items-center justify-center pt-6 border-4 border-black/10"
        style={{ backgroundColor: avatarConfig.skinColor }}
      >
        <div className="flex gap-4 mb-2">
            <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
            <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
        </div>
        <div className="w-6 h-3 border-b-4 border-slate-800 rounded-full"></div>
        <div className="w-5 h-2 bg-pink-400/30 rounded-full blur-sm absolute top-20 left-4"></div>
        <div className="w-5 h-2 bg-pink-400/30 rounded-full blur-sm absolute top-20 right-4"></div>
      </div>

      {/* Hat */}
      {currentHat.id !== 'none' && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-40 transform scale-90">
             {currentHat.id === 'crown' && <Crown className="w-20 h-20 text-yellow-400 fill-yellow-400 drop-shadow-md stroke-2 stroke-yellow-600" />}
             {currentHat.id === 'cap' && <div className="w-32 h-16 bg-blue-500 rounded-t-full border-4 border-blue-600 shadow-md"></div>}
             {currentHat.id === 'bow' && (
                 <div className="flex items-center justify-center">
                    <div className="w-10 h-10 bg-pink-400 rounded-full border-4 border-pink-500"></div>
                    <div className="w-8 h-8 bg-pink-400 rounded-full -ml-2 border-4 border-pink-500"></div>
                    <div className="w-8 h-8 bg-pink-400 rounded-full -mr-2 order-first border-4 border-pink-500"></div>
                 </div>
             )}
          </div>
      )}

      {/* Toy */}
      {currentToy.id !== 'none' && (
          <div className="absolute bottom-16 -right-6 z-50 animate-bounce-slow">
             <div className="bg-white p-2.5 rounded-full shadow-[0_4px_0_#cbd5e1] border-4 border-slate-200 transform rotate-12">
                {currentToy.icon}
             </div>
          </div>
      )}
    </div>
  );

  // --- Lock Logic ---
  const handleLockPressStart = () => {
    if (isLocked) {
        const timer = setTimeout(() => {
            onToggleLock(false);
            setShowUnlockHint(false);
        }, 1500); 
        setLongPressTimer(timer);
    } else {
        onToggleLock(true);
    }
  };

  const handleLockPressEnd = () => {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
    }
    if (isLocked) {
        setShowUnlockHint(true);
        setTimeout(() => setShowUnlockHint(false), 2000);
    }
  };

  // --- Wishing Well Logic ---
  const handleStartRecording = () => {
      setWishText('');
      setWishState('recording');
      setRecordingTime(0);
      intervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
      }, 1000);
  };

  const handleStartTyping = () => {
      setWishText('');
      setRecordingTime(0);
      setWishState('typing');
  };

  const handleStopRecording = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setWishState('review');
  };

  const handleSendWish = () => {
      setWishState('sent');
      setTimeout(() => {
          setWishState('idle');
          setRecordingTime(0);
          setWishText('');
      }, 3000);
  };

  useEffect(() => {
      return () => {
          if (intervalRef.current) clearInterval(intervalRef.current);
      }
  }, []);

  return (
    <div className={`absolute inset-0 bg-[#FFD54F] z-50 flex flex-col font-sans transition-all duration-500 overflow-hidden ${isLocked ? 'p-0' : 'pb-28'}`}>
       
       {/* Toy-like Background */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#4FC3F7]">
          {/* Floor */}
          <div className="absolute bottom-0 inset-x-0 h-1/2 bg-[#81C784]"></div>
          
          {/* Clouds */}
          <div className="absolute top-10 left-10 text-white/40 animate-float opacity-80">
             <div className="w-20 h-10 bg-white rounded-full"></div>
             <div className="w-14 h-14 bg-white rounded-full -mt-8 ml-4"></div>
          </div>
          <div className="absolute top-20 right-20 text-white/40 animate-float-delayed opacity-80">
             <div className="w-24 h-12 bg-white rounded-full"></div>
             <div className="w-16 h-16 bg-white rounded-full -mt-10 ml-6"></div>
          </div>
       </div>

       {/* Top Bar: Navigation & Lock */}
       <div className="relative z-50 px-4 pt-4 flex justify-between items-start">
           {/* Room Switcher (Big Blocky Buttons) */}
           {!isLocked && (
               <div className="flex gap-2">
                   <button 
                      onClick={() => setActiveRoom('wardrobe')}
                      className={`
                        flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-b-[6px] border-r-4 border-l-4 border-t-4 transition-all active:translate-y-1 active:border-b-4
                        ${activeRoom === 'wardrobe' 
                            ? 'bg-[#FFF176] border-yellow-600 text-yellow-800' 
                            : 'bg-white border-slate-300 text-slate-400'
                        }
                      `}
                   >
                       <Shirt className="w-6 h-6 mb-0.5" strokeWidth={2.5} />
                       <span className="text-[9px] font-black uppercase tracking-wide">Me</span>
                   </button>

                   <button 
                      onClick={() => setActiveRoom('read')}
                      className={`
                        flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-b-[6px] border-r-4 border-l-4 border-t-4 transition-all active:translate-y-1 active:border-b-4
                        ${activeRoom === 'read' 
                            ? 'bg-[#A5D6A7] border-green-700 text-green-900' 
                            : 'bg-white border-slate-300 text-slate-400'
                        }
                      `}
                   >
                       <BookOpen className="w-6 h-6 mb-0.5" strokeWidth={2.5} />
                       <span className="text-[9px] font-black uppercase tracking-wide">Read</span>
                   </button>

                   <button 
                      onClick={() => setActiveRoom('well')}
                      className={`
                        flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-b-[6px] border-r-4 border-l-4 border-t-4 transition-all active:translate-y-1 active:border-b-4
                        ${activeRoom === 'well' 
                            ? 'bg-[#4DD0E1] border-cyan-700 text-cyan-900' 
                            : 'bg-white border-slate-300 text-slate-400'
                        }
                      `}
                   >
                       <Sparkles className="w-6 h-6 mb-0.5" strokeWidth={2.5} />
                       <span className="text-[9px] font-black uppercase tracking-wide">Wish</span>
                   </button>
               </div>
           )}

           {/* Parent Lock Button */}
           <div className="flex flex-col items-end">
                <button 
                    onMouseDown={handleLockPressStart}
                    onMouseUp={handleLockPressEnd}
                    onTouchStart={handleLockPressStart}
                    onTouchEnd={handleLockPressEnd}
                    className={`
                        w-14 h-14 rounded-2xl border-b-8 border-r-4 border-l-4 border-t-4 flex items-center justify-center transition-all active:translate-y-1 active:border-b-4
                        ${isLocked 
                            ? 'bg-red-500 border-red-700 text-white' 
                            : 'bg-white border-slate-300 text-slate-400 hover:bg-slate-50'
                        }
                    `}
                >
                    {isLocked ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
                </button>
                {showUnlockHint && isLocked && (
                    <div className="mt-2 text-xs font-black text-white bg-red-500 px-2 py-1 rounded-lg border-2 border-red-700 animate-bounce">
                        HOLD!
                    </div>
                )}
           </div>
       </div>

       {/* === MODE: WARDROBE === */}
       {activeRoom === 'wardrobe' && (
           <div className="flex-1 flex flex-col relative z-10 animate-in fade-in zoom-in duration-300">
               
               {/* Avatar Display */}
               <div className="flex-1 flex items-center justify-center pt-8">
                   <div className="bg-white/30 backdrop-blur-sm p-8 rounded-full border-4 border-white/50 shadow-2xl">
                        <Avatar scale={1.2} />
                   </div>
               </div>

               {/* Customization Grid */}
               <div className="px-4 pb-4">
                   {/* Category Tabs */}
                   <div className="flex gap-2 mb-4 justify-center">
                       {[
                           { id: 'clothes', icon: Shirt, color: 'bg-blue-400', border: 'border-blue-600' },
                           { id: 'hats', icon: Crown, color: 'bg-yellow-400', border: 'border-yellow-600' },
                           { id: 'toys', icon: Gift, color: 'bg-purple-400', border: 'border-purple-600' },
                           { id: 'skin', icon: Palette, color: 'bg-orange-400', border: 'border-orange-600' },
                       ].map(cat => (
                           <button
                                key={cat.id}
                                onClick={() => setWardrobeTab(cat.id as any)}
                                className={`
                                    w-14 h-14 rounded-xl border-b-4 border-r-2 border-l-2 border-t-2 flex items-center justify-center transition-all active:translate-y-1 active:border-b-2
                                    ${wardrobeTab === cat.id 
                                        ? `${cat.color} ${cat.border} text-white scale-110 z-10` 
                                        : 'bg-white border-slate-300 text-slate-300'
                                    }
                                `}
                           >
                               <cat.icon className="w-6 h-6" strokeWidth={3} />
                           </button>
                       ))}
                   </div>

                   {/* Item Selector */}
                   <div className="bg-white rounded-3xl p-4 border-4 border-slate-200 shadow-xl overflow-x-auto scrollbar-hide">
                        <div className="flex gap-3 min-w-min">
                             {wardrobeTab === 'clothes' && OUTFITS.map(item => (
                                 <button
                                    key={item.id}
                                    onClick={() => onUpdateAvatar({ ...avatarConfig, outfitId: item.id })}
                                    className={`
                                        w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border-4 transition-transform active:scale-95
                                        ${item.color}
                                        ${currentOutfit.id === item.id ? 'border-black/20 ring-4 ring-blue-300' : 'border-transparent opacity-90'}
                                    `}
                                 >
                                     {item.icon}
                                 </button>
                             ))}
                             
                             {wardrobeTab === 'hats' && HATS.map(item => (
                                 <button
                                    key={item.id}
                                    onClick={() => onUpdateAvatar({ ...avatarConfig, hatId: item.id })}
                                    className={`
                                        w-20 h-20 rounded-2xl flex items-center justify-center bg-slate-100 border-4 transition-transform active:scale-95
                                        ${currentHat.id === item.id ? 'border-yellow-400 ring-4 ring-yellow-200 bg-white' : 'border-slate-200'}
                                    `}
                                 >
                                     {item.icon}
                                 </button>
                             ))}

                             {wardrobeTab === 'toys' && TOYS.map(item => (
                                 <button
                                    key={item.id}
                                    onClick={() => onUpdateAvatar({ ...avatarConfig, toyId: item.id })}
                                    className={`
                                        w-20 h-20 rounded-2xl flex items-center justify-center bg-slate-100 border-4 transition-transform active:scale-95
                                        ${currentToy.id === item.id ? 'border-purple-400 ring-4 ring-purple-200 bg-white' : 'border-slate-200'}
                                    `}
                                 >
                                     {item.icon}
                                 </button>
                             ))}

                             {wardrobeTab === 'skin' && SKIN_TONES.map(color => (
                                 <button
                                    key={color}
                                    onClick={() => onUpdateAvatar({ ...avatarConfig, skinColor: color })}
                                    style={{ backgroundColor: color }}
                                    className={`
                                        w-20 h-20 rounded-full border-4 transition-transform active:scale-95
                                        ${avatarConfig.skinColor === color ? 'border-white ring-4 ring-black/10' : 'border-transparent'}
                                    `}
                                 />
                             ))}
                        </div>
                   </div>
               </div>
           </div>
       )}

       {/* === MODE: STORIES (READ) === */}
       {activeRoom === 'read' && (
           <div className="flex-1 flex flex-col relative z-10 animate-in slide-in-from-right duration-300 overflow-y-auto scrollbar-hide px-4 pt-4 pb-4">
               {/* Header Bubble */}
               <div className="bg-white px-6 py-4 rounded-3xl border-b-8 border-slate-200 shadow-sm mb-6 text-center transform -rotate-1 sticky top-0 z-20">
                    <h2 className="text-2xl font-black text-slate-700 tracking-tight">My Stories 📚</h2>
               </div>

               {/* Books Grid */}
               <div className="space-y-6 pb-20">
                   {BOOKS.slice(0, 5).map(book => (
                       <button 
                          key={book.id}
                          onClick={() => onReadBook(book)}
                          className="w-full bg-white p-4 rounded-[2.5rem] border-b-[12px] border-slate-200 shadow-lg flex items-center gap-5 active:scale-[0.98] active:border-b-4 active:translate-y-2 transition-all group hover:border-green-200"
                       >
                           <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden border-4 border-slate-100 shrink-0 shadow-inner">
                               <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1 text-left py-2">
                               <h3 className="text-xl font-black text-slate-800 leading-tight mb-2 line-clamp-2">{book.title}</h3>
                               <div className="flex items-center gap-2">
                                   <div className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-wide inline-block border-2 border-green-200">
                                       Read Now
                                   </div>
                               </div>
                           </div>
                           <div className="w-16 h-16 rounded-full bg-green-500 border-b-8 border-green-700 flex items-center justify-center shrink-0 group-hover:bg-green-400 group-hover:scale-105 transition-all shadow-md">
                               <Play className="w-8 h-8 text-white fill-white ml-1" />
                           </div>
                       </button>
                   ))}
               </div>
           </div>
       )}

       {/* === MODE: WISHING WELL === */}
       {activeRoom === 'well' && (
           <div className="flex-1 flex flex-col items-center justify-between relative z-10 pt-8 pb-4 px-4 animate-in fade-in slide-in-from-right duration-300">
               
               {/* Title Bubble */}
               {wishState !== 'typing' && (
                    <div className="bg-white px-8 py-4 rounded-3xl border-b-8 border-slate-200 shadow-sm mb-4 transform -rotate-1">
                        <h2 className="text-2xl font-black text-slate-700 text-center tracking-tight">Make a Wish! ✨</h2>
                    </div>
               )}

               {/* The Well Visualization - Hidden when typing */}
               {wishState !== 'typing' && (
                   <div className="relative flex-1 w-full flex items-center justify-center">
                       {/* Well Structure */}
                       <div className="relative w-64 h-56 transform scale-110">
                            {/* Well Roof */}
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#8D6E63] rounded-t-full border-4 border-[#5D4037] z-20 shadow-lg flex items-center justify-center">
                                <div className="w-full h-full opacity-20 bg-[radial-gradient(circle,transparent_2px,#5D4037_2px)] [background-size:10px_10px]"></div>
                            </div>
                            {/* Posts */}
                            <div className="absolute top-0 left-6 w-4 h-32 bg-[#A1887F] border-2 border-[#5D4037] z-10"></div>
                            <div className="absolute top-0 right-6 w-4 h-32 bg-[#A1887F] border-2 border-[#5D4037] z-10"></div>
                            
                            {/* Well Base */}
                            <div className="absolute bottom-0 w-full h-32 bg-slate-300 rounded-[2rem] border-4 border-slate-500 z-10 flex flex-col items-center overflow-hidden shadow-2xl">
                                 {/* Bricks Pattern */}
                                 <div className="w-full h-full opacity-30 bg-[linear-gradient(45deg,transparent_25%,#000_25%,#000_50%,transparent_50%,transparent_75%,#000_75%,#000_100%)] [background-size:20px_20px]"></div>
                                 <div className="absolute top-4 w-48 h-12 bg-black/40 rounded-full blur-xl"></div>
                            </div>

                            {/* Magic Particles when Idle */}
                            {wishState === 'idle' && (
                                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-0 animate-pulse">
                                    <div className="w-32 h-32 bg-cyan-300/30 rounded-full blur-2xl"></div>
                                </div>
                            )}

                            {/* Sparkles if sent */}
                            {wishState === 'sent' && (
                                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30">
                                    <Sparkles className="w-24 h-24 text-yellow-300 animate-ping fill-current" />
                                </div>
                            )}
                       </div>
                   </div>
               )}

               {/* Controls Area */}
               <div className="w-full max-w-sm pb-4">
                   
                   {/* State: IDLE */}
                   {wishState === 'idle' && (
                       <div className="grid grid-cols-2 gap-4 w-full">
                           <button 
                              onClick={handleStartRecording}
                              className="aspect-square bg-rose-500 rounded-[2.5rem] border-b-[12px] border-r-4 border-rose-700 shadow-xl flex flex-col items-center justify-center transition-all active:translate-y-3 active:border-b-4 hover:bg-rose-400 group"
                           >
                               <div className="bg-white/20 p-4 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                   <Mic className="w-12 h-12 text-white" strokeWidth={3} />
                               </div>
                               <span className="text-white font-black text-2xl tracking-wide uppercase drop-shadow-md">Talk</span>
                           </button>
                           
                           <button 
                              onClick={handleStartTyping}
                              className="aspect-square bg-sky-500 rounded-[2.5rem] border-b-[12px] border-r-4 border-sky-700 shadow-xl flex flex-col items-center justify-center transition-all active:translate-y-3 active:border-b-4 hover:bg-sky-400 group"
                           >
                               <div className="bg-white/20 p-4 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                   <Keyboard className="w-12 h-12 text-white" strokeWidth={3} />
                               </div>
                               <span className="text-white font-black text-2xl tracking-wide uppercase drop-shadow-md">Type</span>
                           </button>
                       </div>
                   )}

                   {/* State: RECORDING */}
                   {wishState === 'recording' && (
                       <div className="flex flex-col items-center gap-6 w-full animate-in slide-in-from-bottom-10 duration-300">
                           <div className="bg-white px-8 py-6 rounded-3xl border-4 border-slate-200 flex items-center justify-center gap-4 w-full shadow-lg">
                               <div className="w-6 h-6 rounded-full bg-rose-500 animate-pulse ring-4 ring-rose-200"></div>
                               <span className="text-4xl font-black text-slate-700 font-mono tracking-widest">00:0{recordingTime}</span>
                           </div>
                           
                           <button 
                              onClick={handleStopRecording}
                              className="w-full h-24 rounded-[2.5rem] bg-rose-500 border-b-[12px] border-rose-800 text-white font-black text-3xl uppercase tracking-wider active:translate-y-2 active:border-b-4 flex items-center justify-center gap-3 shadow-xl hover:bg-rose-400 transition-colors"
                           >
                               <div className="w-8 h-8 bg-white rounded-md"></div>
                               Stop
                           </button>
                       </div>
                   )}

                   {/* State: TYPING */}
                   {wishState === 'typing' && (
                       <div className="flex flex-col gap-4 animate-in zoom-in duration-300 w-full h-full">
                           <div className="bg-white p-6 rounded-[2.5rem] border-8 border-sky-200 shadow-xl relative flex-1 flex flex-col">
                               <textarea
                                   value={wishText}
                                   onChange={(e) => setWishText(e.target.value)}
                                   placeholder="I wish for..."
                                   className="w-full flex-1 text-3xl font-black text-slate-700 placeholder:text-slate-300 outline-none resize-none bg-transparent text-center leading-normal"
                                   autoFocus
                               />
                               <div className="text-center text-slate-300 font-bold text-sm uppercase tracking-widest mt-2">
                                   Type your story idea
                               </div>
                           </div>
                           
                           <div className="flex gap-4">
                               <button 
                                  onClick={() => {
                                      setWishState('idle');
                                      setWishText('');
                                  }}
                                  className="w-24 h-24 flex items-center justify-center rounded-[2rem] bg-slate-200 border-b-8 border-slate-300 text-slate-500 font-black active:translate-y-2 active:border-b-4 hover:bg-slate-300 transition-colors"
                               >
                                   <X className="w-10 h-10" strokeWidth={4} />
                               </button>
                               <button 
                                  onClick={() => setWishState('review')}
                                  disabled={!wishText.trim()}
                                  className="flex-1 h-24 rounded-[2rem] bg-sky-500 border-b-[12px] border-sky-700 text-white font-black text-3xl uppercase tracking-wider active:translate-y-2 active:border-b-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-b-4 flex items-center justify-center gap-3 shadow-xl hover:bg-sky-400 transition-colors"
                               >
                                   Done
                               </button>
                           </div>
                       </div>
                   )}

                   {/* State: REVIEW */}
                   {wishState === 'review' && (
                       <div className="flex flex-col gap-6 w-full animate-in slide-in-from-bottom duration-300">
                           <div className="bg-white p-8 rounded-[2.5rem] border-b-8 border-slate-200 text-center shadow-lg transform rotate-1">
                               {wishText ? (
                                   <>
                                     <span className="block text-slate-400 font-black text-xs uppercase tracking-widest mb-3">Your Wish</span>
                                     <span className="text-slate-800 font-black text-2xl leading-tight">"{wishText}"</span>
                                   </>
                               ) : (
                                   <div className="flex flex-col items-center gap-2">
                                     <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-2">
                                        <Mic className="w-8 h-8" strokeWidth={3} />
                                     </div>
                                     <span className="text-slate-800 font-black text-2xl">Voice Wish Ready!</span>
                                   </div>
                               )}
                           </div>
                           <div className="flex gap-4">
                               <button 
                                  onClick={() => {
                                      if (wishText) {
                                          setWishState('typing');
                                      } else {
                                          setWishState('idle');
                                      }
                                  }}
                                  className="flex-1 py-6 rounded-[2rem] bg-white border-b-8 border-slate-300 text-slate-500 font-black text-lg uppercase active:translate-y-2 active:border-b-4 hover:bg-slate-50 transition-colors"
                               >
                                   <div className="flex flex-col items-center">
                                       <RotateCcw className="w-6 h-6 mb-1" strokeWidth={3} />
                                       <span>Again</span>
                                   </div>
                               </button>
                               <button 
                                  onClick={handleSendWish}
                                  className="flex-[2] py-6 rounded-[2rem] bg-emerald-500 border-b-[12px] border-emerald-700 text-white font-black text-2xl uppercase tracking-wider flex items-center justify-center gap-3 active:translate-y-2 active:border-b-4 shadow-xl hover:bg-emerald-400 transition-colors"
                               >
                                   <span>Throw It!</span>
                                   <Send className="w-8 h-8" strokeWidth={3} />
                               </button>
                           </div>
                       </div>
                   )}

                   {/* State: SENT */}
                   {wishState === 'sent' && (
                       <div className="bg-white p-10 rounded-[3rem] border-8 border-yellow-400 text-center animate-bounce shadow-2xl">
                           <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-14 h-14 text-yellow-500 fill-yellow-500 animate-spin-slow" />
                           </div>
                           <h3 className="text-3xl font-black text-slate-800 mb-2">Wish Sent!</h3>
                           <p className="text-slate-400 font-bold text-lg">Magic is happening...</p>
                       </div>
                   )}

               </div>
           </div>
       )}

    </div>
  );
};