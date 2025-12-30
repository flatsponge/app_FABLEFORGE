import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Mic, 
  PenTool, 
  Smile, 
  Zap, 
  Trees, 
  GraduationCap, 
  Plus,
  BookOpen, 
  Sparkles,
  RotateCcw,
  ListChecks,
  ArrowRight,
  Camera,
  Check,
  Crown,
  Diamond,
  Dices,
  Pencil,
  User,
  MapPin,
  Keyboard,
  Heart,
  Shield,
  Gift,
  Hourglass,
  Search,
  Lightbulb,
  Scale,
  Users,
  Sun,
  ClipboardList,
  Puzzle,
  FolderCog,
  X,
  Clock,
  BatteryCharging,
  Flame,
  Infinity,
  MessageCircle,
  Play,
  Calendar
} from 'lucide-react';
import { AvatarConfig } from '../types';
import { OUTFITS, HATS, PRESET_LOCATIONS, FRIENDS, VOICE_PRESETS } from '../constants';
import { AssetStudio } from './AssetStudio';
import { ManageAssetsView } from './ManageAssetsView';

interface CreateStoryViewProps {
  avatarConfig: AvatarConfig;
}

const TEACHING_VALUES = [
    { id: 'compassion', name: 'Compassion', icon: Heart, color: 'bg-rose-50 text-rose-500', border: 'border-rose-200', desc: 'Understanding feelings' },
    { id: 'bravery', name: 'Bravery', icon: Shield, color: 'bg-amber-50 text-amber-500', border: 'border-amber-200', desc: 'Finding courage' },
    { id: 'sharing', name: 'Sharing', icon: Gift, color: 'bg-purple-50 text-purple-500', border: 'border-purple-200', desc: 'The joy of giving' },
    { id: 'honesty', name: 'Honesty', icon: Scale, color: 'bg-blue-50 text-blue-500', border: 'border-blue-200', desc: 'Telling the truth' },
    { id: 'patience', name: 'Patience', icon: Hourglass, color: 'bg-emerald-50 text-emerald-500', border: 'border-emerald-200', desc: 'Waiting calmly' },
    { id: 'teamwork', name: 'Teamwork', icon: Users, color: 'bg-indigo-50 text-indigo-500', border: 'border-indigo-200', desc: 'Working together' },
    { id: 'curiosity', name: 'Curiosity', icon: Search, color: 'bg-cyan-50 text-cyan-500', border: 'border-cyan-200', desc: 'Discovering new things' },
    { id: 'gratitude', name: 'Gratitude', icon: Sun, color: 'bg-yellow-50 text-yellow-500', border: 'border-yellow-200', desc: 'Being thankful' },
    { id: 'responsibility', name: 'Responsibility', icon: ClipboardList, color: 'bg-slate-100 text-slate-500', border: 'border-slate-200', desc: 'Doing your part' },
    { id: 'problem_solving', name: 'Problem Solving', icon: Puzzle, color: 'bg-teal-50 text-teal-500', border: 'border-teal-200', desc: 'Finding solutions' },
    { id: 'creativity', name: 'Creativity', icon: Sparkles, color: 'bg-fuchsia-50 text-fuchsia-500', border: 'border-fuchsia-200', desc: 'Thinking big' },
];

const CHILD_REQUESTS = [
    { id: 'r1', text: "Leo played in the room we just took a picture of...", date: "Just now", duration: "0:15", isNew: true },
    { id: 'r2', text: "A big red dragon that eats ice cream", date: "2 hours ago", duration: "0:42", isNew: false },
    { id: 'r3', text: "The time I lost my tooth at school", date: "Yesterday", duration: "0:20", isNew: false },
    { id: 'r4', text: "Swimming with dolphins in the sky", date: "2 days ago", duration: "0:12", isNew: false },
];

// Crystal System Constants
const MAX_CRYSTALS = 160;
const REGEN_TIME_SECONDS = 1800; // 30 Minutes

// --- SUB-COMPONENT: Crystal Modal (Defined OUTSIDE to prevent re-renders) ---

interface CrystalModalProps {
    balance: number;
    max: number;
    timeToNext: number;
    onClose: () => void;
    onRefill: (amount: number) => void;
}

const CrystalModal: React.FC<CrystalModalProps> = ({ balance, max, timeToNext, onClose, onRefill }) => {
    
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const formatFullTimer = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m ${s}s`;
    };

    return (
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div 
             className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
             onClick={onClose}
          ></div>

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-white sm:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in duration-300 overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide">
              
              {/* Close Button */}
              <button 
                  onClick={onClose}
                  className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
               >
                   <X className="w-5 h-5" />
               </button>

              {/* Header / Current Status */}
              <div className="bg-[#FDFBF7] p-8 pb-10 border-b border-slate-100 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                   
                   <div className="relative z-10 flex flex-col items-center text-center">
                       <div className="mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Current Balance</div>
                       <div className="flex items-center gap-2 mb-4">
                           <Diamond className="w-8 h-8 text-cyan-500 fill-cyan-500 animate-pulse" />
                           <span className="text-5xl font-black text-slate-800 tracking-tight">{balance}</span>
                           <span className="text-2xl font-bold text-slate-300">/{max}</span>
                       </div>

                       {/* Timer Pill */}
                       {balance < max ? (
                           <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-cyan-500" />
                                    <span className="text-xs font-bold text-slate-600">
                                        +1 in <span className="font-mono text-cyan-600">{formatTime(timeToNext)}</span>
                                    </span>
                                </div>
                                <div className="w-px h-3 bg-slate-200"></div>
                                <div className="flex items-center gap-1.5">
                                    <BatteryCharging className="w-3.5 h-3.5 text-purple-500" />
                                    <span className="text-xs font-bold text-slate-600">
                                        Full in <span className="font-mono text-purple-600">{formatFullTimer((max - balance - 1) * 1800 + timeToNext)}</span>
                                    </span>
                                </div>
                           </div>
                       ) : (
                           <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                               <Check className="w-4 h-4" /> Fully Charged
                           </div>
                       )}
                   </div>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-6 bg-white">
                  
                  {/* HERO UPSELL: MAX TIER */}
                  <div className="relative group cursor-pointer overflow-hidden rounded-[2rem] p-[2px]">
                       {/* Animated Border Gradient */}
                       <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-purple-500 to-rose-500 animate-[spin_4s_linear_infinite] opacity-100"></div>
                       
                       <div className="relative bg-slate-900 rounded-[1.9rem] p-6 text-white overflow-hidden">
                           {/* Background FX */}
                           <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                           <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>

                           <div className="relative z-10">
                               <div className="flex justify-between items-start mb-4">
                                   <div>
                                       <div className="flex items-center gap-2 mb-1">
                                            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide">
                                                Best Value
                                            </div>
                                       </div>
                                       <h3 className="text-2xl font-black italic tracking-wide">
                                           STORY<span className="text-amber-400">MAX</span>
                                       </h3>
                                   </div>
                                   <Crown className="w-10 h-10 text-amber-400 fill-amber-400/20" />
                               </div>

                               <div className="space-y-3 mb-6">
                                   <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                           <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                                       </div>
                                       <div>
                                           <div className="font-bold text-sm">2x Faster Generation</div>
                                           <div className="text-[10px] text-slate-400">Crystals refill every 15m</div>
                                       </div>
                                   </div>
                                   <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                           <Infinity className="w-4 h-4 text-purple-400" />
                                       </div>
                                       <div>
                                           <div className="font-bold text-sm">2x Cap Increase</div>
                                           <div className="text-[10px] text-slate-400">Hold up to 320 Crystals</div>
                                       </div>
                                   </div>
                                   <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                           <Diamond className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                                       </div>
                                       <div>
                                           <div className="font-bold text-sm">+1000 Instant Boost</div>
                                           <div className="text-[10px] text-slate-400">One-time bonus</div>
                                       </div>
                                   </div>
                               </div>

                               <button 
                                  onClick={() => onRefill(1000)}
                                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-black text-sm shadow-lg shadow-amber-900/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                               >
                                   Upgrade to MAX <span className="bg-black/10 px-1.5 py-0.5 rounded text-xs opacity-70">$9.99/mo</span>
                               </button>
                           </div>
                       </div>
                  </div>

                  <div className="flex items-center gap-4 my-2">
                      <div className="h-px bg-slate-100 flex-1"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or Top Up</span>
                      <div className="h-px bg-slate-100 flex-1"></div>
                  </div>

                  {/* Standard Refill Options */}
                  <div className="grid grid-cols-2 gap-4">
                      <button 
                         onClick={() => onRefill(100)}
                         className="bg-slate-50 p-4 rounded-3xl border border-slate-200 flex flex-col items-center gap-3 hover:bg-slate-100 transition-colors active:scale-95"
                      >
                          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                              <Diamond className="w-6 h-6 text-cyan-400 fill-cyan-400/50" />
                          </div>
                          <div className="text-center">
                              <div className="font-bold text-slate-800 text-lg">100</div>
                              <div className="text-xs font-bold text-slate-400">Crystals</div>
                          </div>
                          <div className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full w-full">
                              $1.99
                          </div>
                      </button>

                      <button 
                         onClick={() => onRefill(500)}
                         className="bg-slate-50 p-4 rounded-3xl border border-slate-200 flex flex-col items-center gap-3 hover:bg-slate-100 transition-colors active:scale-95 relative overflow-hidden"
                      >
                          {/* Badge */}
                          <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-xl">
                              POPULAR
                          </div>
                          
                          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center relative">
                              <Diamond className="absolute w-6 h-6 text-cyan-500 fill-cyan-500 ml-2 mt-1 opacity-50" />
                              <Diamond className="relative w-6 h-6 text-cyan-400 fill-cyan-400 z-10" />
                          </div>
                          <div className="text-center">
                              <div className="font-bold text-slate-800 text-lg">500</div>
                              <div className="text-xs font-bold text-slate-400">Crystals</div>
                          </div>
                          <div className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full w-full">
                              $4.99
                          </div>
                      </button>
                  </div>
                  
                  <p className="text-center text-[10px] text-slate-400 font-medium pt-2 pb-4">
                      Purchase is restored automatically. Cancel anytime.
                  </p>
              </div>
          </div>
      </div>
    );
};


// --- MAIN COMPONENT ---

export const CreateStoryView: React.FC<CreateStoryViewProps> = ({ avatarConfig }) => {
  const [step, setStep] = useState<'input' | 'generating-outline' | 'outline-review' | 'generating-story' | 'preview'>('input');
  
  // UI State
  const [showStudio, setShowStudio] = useState(false);
  const [showAssetManager, setShowAssetManager] = useState(false);
  const [studioTab, setStudioTab] = useState<'places' | 'faces' | 'voices' | null>(null);
  const [inputMode, setInputMode] = useState<'requests' | 'text' | 'values'>('requests');
  const [textPrompt, setTextPrompt] = useState('');
  const [selectedValueId, setSelectedValueId] = useState<string | null>(null);
  
  // Economy State
  const [crystalBalance, setCrystalBalance] = useState(150);
  const [showCrystalModal, setShowCrystalModal] = useState(false);
  const [timeToNext, setTimeToNext] = useState(REGEN_TIME_SECONDS); 
  
  // Selection State (Defaults set to first items)
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(PRESET_LOCATIONS[0].id);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(['me']);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(VOICE_PRESETS[0].id);

  // Get current objects for display
  const currentOutfit = OUTFITS.find(o => o.id === avatarConfig.outfitId) || OUTFITS[0];
  const currentHat = HATS.find(h => h.id === avatarConfig.hatId) || HATS[0];
  const currentLocation = PRESET_LOCATIONS.find(l => l.id === selectedLocationId);
  const currentVoice = VOICE_PRESETS.find(v => v.id === selectedVoiceId);
  const currentFriends = FRIENDS.filter(f => selectedCharacterIds.includes(f.id));
  const isMeSelected = selectedCharacterIds.includes('me');

  // --- Crystal Regeneration Logic ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (crystalBalance < MAX_CRYSTALS) {
        interval = setInterval(() => {
            setTimeToNext((prev) => {
                if (prev <= 1) {
                    setCrystalBalance(b => Math.min(b + 1, MAX_CRYSTALS));
                    return REGEN_TIME_SECONDS; // Reset timer
                }
                return prev - 1;
            });
        }, 1000);
    } else {
        setTimeToNext(REGEN_TIME_SECONDS); // Reset if full
    }

    return () => {
        if (interval) clearInterval(interval);
    };
  }, [crystalBalance]);

  // Format Helpers
  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatFullTimer = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      
      if (h > 0) {
          return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
      }
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Helper for Character Summary Text
  const getCharacterSummary = () => {
    const parts = [];
    if (isMeSelected) parts.push('Me');
    if (currentFriends.length > 0) {
        if (currentFriends.length === 1 && !isMeSelected) {
            parts.push(currentFriends[0].name);
        } else {
            parts.push(`${currentFriends.length} Friend${currentFriends.length > 1 ? 's' : ''}`);
        }
    }
    if (parts.length === 0) return 'None';
    return parts.join(' & ');
  };

  // --- Calculations ---

  const calculateTotalCost = () => {
    let cost = 5; // Base generation cost
    
    // Location Costs
    if (selectedLocationId) {
        const loc = PRESET_LOCATIONS.find(l => l.id === selectedLocationId);
        if (loc) cost += loc.cost;
    }

    // Character Costs
    selectedCharacterIds.forEach(id => {
        if (id === 'me') return; // Self is free included in base
        const char = FRIENDS.find(c => c.id === id);
        if (char) cost += char.cost;
    });

    // Voice Costs
    const voice = VOICE_PRESETS.find(v => v.id === selectedVoiceId);
    if (voice) cost += voice.cost;

    return cost;
  };

  const totalCost = calculateTotalCost();

  // --- Handlers ---

  const handleSelectLocation = (id: string) => {
      setSelectedLocationId(prev => (prev === id ? null : id));
  };

  const handleToggleCharacter = (id: string) => {
      setSelectedCharacterIds(prev => {
          if (prev.includes(id)) return prev.filter(p => p !== id);
          return [...prev, id];
      });
  };

  const handleSelectVoice = (id: string) => {
      setSelectedVoiceId(id);
  };

  const handleRandomize = () => {
      // Pick 1 random location
      const randomLoc = PRESET_LOCATIONS[Math.floor(Math.random() * PRESET_LOCATIONS.length)];
      setSelectedLocationId(randomLoc.id);

      // Pick random friends (50% chance for each)
      const randomChars = ['me']; // Always include self
      FRIENDS.forEach(f => {
          if (Math.random() > 0.5) randomChars.push(f.id);
      });
      setSelectedCharacterIds(randomChars);

      // Pick random voice
      const randomVoice = VOICE_PRESETS[Math.floor(Math.random() * VOICE_PRESETS.length)];
      setSelectedVoiceId(randomVoice.id);
  };

  const handleAddTag = (label: string) => {
      if (inputMode !== 'text') setInputMode('text');
      setTextPrompt(prev => prev + (prev.length > 0 ? ' ' : '') + label);
  };

  const handleValueSelect = (id: string) => {
      setSelectedValueId(prev => prev === id ? null : id);
  };

  const handleCreateOutline = () => {
    if (crystalBalance < totalCost) {
        // Trigger modal to show they are low
        setShowCrystalModal(true);
        return;
    }
    setCrystalBalance(prev => prev - totalCost);
    setStep('generating-outline');
    setTimeout(() => {
        setStep('outline-review');
    }, 2000);
  };

  const handleApproveOutline = () => {
      setStep('generating-story');
      setTimeout(() => {
          setStep('preview');
      }, 3000);
  }

  const handleBack = () => {
      if (step === 'outline-review') setStep('input');
      if (step === 'preview') setStep('outline-review');
  };

  const handleRefill = (amount: number) => {
      setCrystalBalance(prev => prev + amount); // Should handle capping based on tier in real app
      setShowCrystalModal(false);
  }

  const handleUseRequest = (text: string) => {
    setTextPrompt(text);
    setInputMode('text');
  };

  // --- LOADING STATES ---
  if (step === 'generating-outline' || step === 'generating-story') {
      const isOutline = step === 'generating-outline';
      return (
          <div className="h-full flex flex-col items-center justify-center pb-32 animate-in fade-in duration-700 bg-[#FDFBF7] relative overflow-hidden">
              
              {/* Background Ambience */}
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>

              {/* Central Magic Element */}
              <div className="relative mb-12">
                  {/* Rotating Rings */}
                  <div className="absolute inset-[-20px] border-2 border-dashed border-purple-200 rounded-full animate-spin-slow opacity-50"></div>
                  <div className="absolute inset-[-40px] border border-dashed border-cyan-200 rounded-full animate-spin-slow opacity-30" style={{ animationDirection: 'reverse', animationDuration: '12s' }}></div>
                  
                  {/* Floating Icon Container */}
                  <div className="relative w-28 h-28 bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(124,58,237,0.3)] flex items-center justify-center z-10 animate-float border-2 border-white">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-cyan-50/50 rounded-[2.3rem]"></div>
                      
                      {/* Animated Icon */}
                      <div className="relative z-10 transform transition-all duration-500">
                        {isOutline ? (
                            <div className="relative">
                                <Sparkles className="w-12 h-12 text-purple-500 fill-purple-500/20" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
                            </div>
                        ) : (
                            <div className="relative">
                                <BookOpen className="w-12 h-12 text-cyan-600 fill-cyan-100" />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                            </div>
                        )}
                      </div>

                      {/* Sparkles Decoration */}
                      <div className="absolute -top-4 -right-4 text-yellow-400 animate-float" style={{ animationDelay: '0.5s' }}>
                          <Sparkles className="w-6 h-6 fill-current" />
                      </div>
                      <div className="absolute -bottom-2 -left-4 text-pink-400 animate-float" style={{ animationDelay: '1.5s' }}>
                          <Sparkles className="w-4 h-4 fill-current" />
                      </div>
                  </div>
              </div>

              {/* Text & Progress */}
              <div className="text-center z-10 px-8 max-w-xs">
                  <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight animate-pulse">
                    {isOutline ? "Summoning Ideas..." : "Weaving Magic..."}
                  </h2>
                  
                  <div className="bg-white/60 p-5 rounded-3xl border border-slate-100 backdrop-blur-md shadow-sm">
                      <div className="flex items-center gap-2 mb-3 justify-center">
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                            {isOutline ? "Consulting the creative spirits" : "Writing chapters & drawing art"}
                          </p>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 w-[200%] animate-shimmer"></div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- OUTLINE REVIEW STEP ---
  if (step === 'outline-review') {
      return (
        <div className="px-6 pt-8 pb-10 h-full bg-[#FDFBF7] animate-in slide-in-from-right duration-500 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 transition-colors bg-white shadow-sm">
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step 2 of 3</span>
                    <span className="text-sm font-bold text-slate-800">Review Outline</span>
                </div>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide pb-4">
                {/* Proposed Title Card */}
                <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <BookOpen className="w-24 h-24 text-purple-500" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-wider mb-3">
                        Proposed Title
                    </span>
                    <h2 className="text-3xl font-extrabold text-slate-800 leading-tight mb-2">
                        Leo's Park <br/><span className="text-purple-500">Adventure</span>
                    </h2>
                    <div className="flex gap-2 mt-4">
                        <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-slate-500">
                            Friendship
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-bold text-slate-500">
                            Bravery
                        </div>
                    </div>
                </div>

                {/* Plot Outline */}
                <div className="mb-4 pl-2">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
                        <ListChecks className="w-4 h-4 text-slate-400" />
                        Story Structure
                    </h3>
                    
                    <div className="space-y-4 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-100"></div>

                        {[
                            { title: "The Arrival", desc: "Leo arrives at the Magic Castle on a sunny afternoon." },
                            { title: "The Discovery", desc: "He hears a mysterious sound behind the big door." },
                            { title: "New Friend", desc: "Leo meets Barky the dog and overcomes his shyness." },
                            { title: "Happy Ending", desc: "They play fetch and Leo goes home with a new story." }
                        ].map((point, idx) => (
                            <div key={idx} className="relative flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-white border-2 border-purple-100 flex items-center justify-center shrink-0 z-10 shadow-sm">
                                    <span className="text-xs font-bold text-purple-500">{idx + 1}</span>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex-1">
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">{point.title}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{point.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-auto">
                <div className="flex gap-3">
                    <button 
                        onClick={() => setStep('input')}
                        className="flex-1 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Edit Plan
                    </button>
                    <button 
                        onClick={handleApproveOutline}
                        className="flex-[2] py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Sparkles className="w-4 h-4 text-purple-300" />
                        Write Story
                        <ArrowRight className="w-4 h-4 opacity-50" />
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // --- FINAL PREVIEW STEP ---
  if (step === 'preview') {
      return (
        <div className="px-6 pt-8 pb-10 h-full bg-[#FDFBF7] animate-in slide-in-from-right duration-500 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 transition-colors bg-white shadow-sm">
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-purple-500 uppercase tracking-widest flex items-center gap-1">
                        <Check className="w-3 h-3" /> Ready
                    </span>
                </div>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
                {/* Generated Book Cover */}
                <div className="w-full aspect-[3/4] max-h-[340px] mx-auto bg-gradient-to-br from-indigo-400 to-purple-500 rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 flex flex-col items-center justify-center mb-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
                    
                    <div className="transform transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3">
                        <BookOpen className="w-20 h-20 text-white drop-shadow-lg opacity-90" />
                    </div>

                    <div className="absolute bottom-0 inset-x-0 p-8 pt-12 bg-gradient-to-t from-black/40 to-transparent text-center">
                        <h2 className="text-white text-2xl font-bold leading-tight drop-shadow-md">Leo's Park<br/>Adventure</h2>
                    </div>
                </div>

                {/* Story Snippet */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Story Snippet</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-serif text-lg italic opacity-80">
                        "The sun was shining brightly over Greenleaf Park when Leo arrived. He spotted a wagging tail behind the big oak tree. It was Barky, ready for an adventure..."
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
                <button 
                    onClick={() => setStep('input')} 
                    className="flex-1 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    <RotateCcw className="w-4 h-4" />
                    New
                </button>
                <button className="flex-[2] py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                    <BookOpen className="w-4 h-4" />
                    Read Now
                </button>
            </div>
        </div>
      );
  }

  // --- INPUT STEP (Default) ---
  return (
    <>
    {/* Crystal Details Modal */}
    {showCrystalModal && (
        <CrystalModal 
            balance={crystalBalance} 
            max={MAX_CRYSTALS} 
            timeToNext={timeToNext} 
            onClose={() => setShowCrystalModal(false)} 
            onRefill={handleRefill}
        />
    )}

    {/* Full Screen Selection Studio */}
    {studioTab && (
        <AssetStudio 
            onClose={() => setStudioTab(null)} 
            initialTab={studioTab}
            selectedLocationId={selectedLocationId}
            onSelectLocation={handleSelectLocation}
            selectedCharacterIds={selectedCharacterIds}
            onToggleCharacter={handleToggleCharacter}
            selectedVoiceId={selectedVoiceId}
            onSelectVoice={handleSelectVoice}
            avatarConfig={avatarConfig}
        />
    )}

    {/* Manage Assets View */}
    {showAssetManager && (
        <ManageAssetsView onClose={() => setShowAssetManager(false)} />
    )}
    
    <div className="flex flex-col h-full bg-[#FDFBF7] relative overflow-hidden animate-in fade-in duration-500">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[80%] h-[60%] bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header with Crystal Balance */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-20 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-slate-100/50">
         <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Story</h1>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                Turn memories into magic
            </p>
         </div>
         <div className="flex items-center gap-2">
            <button 
                onClick={() => setShowAssetManager(true)}
                className="bg-white p-2 rounded-full border border-slate-100 shadow-sm active:scale-95 transition-all hover:bg-orange-50 hover:text-orange-500 group"
                title="Manage Assets"
            >
                <FolderCog className="w-5 h-5 text-slate-500 group-hover:text-orange-500" />
            </button>
            <button 
                onClick={handleRandomize}
                className="bg-white p-2 rounded-full border border-slate-100 shadow-sm active:scale-95 transition-all hover:bg-purple-50 hover:text-purple-600"
                title="Randomize"
            >
                <Dices className="w-5 h-5 text-slate-500" />
            </button>
            <button
                onClick={() => setShowCrystalModal(true)}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm border border-slate-100 active:scale-95 transition-transform hover:bg-slate-50"
            >
                <Diamond className={`w-4 h-4 text-cyan-400 fill-cyan-400 ${crystalBalance < MAX_CRYSTALS ? 'animate-pulse' : ''}`} />
                <span className="font-bold text-slate-800 text-sm">
                    {crystalBalance}<span className="text-slate-300 text-xs font-normal">/{MAX_CRYSTALS}</span>
                </span>
            </button>
         </div>
      </div>

      <div className="px-6 flex-1 overflow-y-auto scrollbar-hide pb-36">
          
          {/* Section 1: Scene & Cast Minimal Selector */}
          <div className="mt-6 mb-8">
             <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-bold text-slate-800">Scene & Cast</h2>
                 <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">Step 1</span>
             </div>

             <div className="grid grid-cols-3 gap-3">
                 {/* Location Selector */}
                 <button 
                    onClick={() => setStudioTab('places')}
                    className="relative h-28 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center p-2 overflow-hidden group hover:border-indigo-300 transition-all active:scale-95"
                 >
                    {currentLocation ? (
                        <>
                             <div className="absolute inset-0">
                                <img src={currentLocation.image} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity blur-[1px]" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent"></div>
                             </div>
                             <div className="relative z-10 w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                                 <MapPin className="w-5 h-5 text-indigo-500" />
                             </div>
                             <div className="relative z-10 text-center">
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Scene</div>
                                 <div className="text-xs font-extrabold text-slate-700 truncate max-w-[90px] px-1 leading-tight">
                                     {currentLocation.name}
                                 </div>
                             </div>
                        </>
                    ) : (
                        // Empty state
                         <>
                             <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                                 <MapPin className="w-5 h-5 text-slate-300" />
                             </div>
                             <span className="text-xs font-bold text-slate-400">Select</span>
                         </>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="w-3 h-3 text-slate-400" />
                    </div>
                 </button>

                 {/* Character Selector */}
                 <button 
                    onClick={() => setStudioTab('faces')}
                    className="relative h-28 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center p-2 overflow-hidden group hover:border-orange-300 transition-all active:scale-95"
                 >
                    <div className="relative z-10 w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                         {selectedCharacterIds.length > 0 ? <User className="w-5 h-5 text-orange-500" /> : <User className="w-5 h-5 text-slate-300" />}
                    </div>
                    <div className="relative z-10 text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Cast</div>
                        <div className="text-xs font-extrabold text-slate-700 truncate max-w-[90px] px-1 leading-tight">
                            {getCharacterSummary()}
                        </div>
                    </div>
                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="w-3 h-3 text-slate-400" />
                    </div>
                 </button>

                 {/* Voice Selector */}
                 <button 
                    onClick={() => setStudioTab('voices')}
                    className="relative h-28 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center p-2 overflow-hidden group hover:border-rose-300 transition-all active:scale-95"
                 >
                     {currentVoice ? (
                        <>
                            <div className={`relative z-10 w-10 h-10 rounded-full ${currentVoice.color} bg-opacity-20 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform`}>
                                 <span className="text-lg">{currentVoice.icon}</span>
                            </div>
                            <div className="relative z-10 text-center">
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Voice</div>
                                 <div className="text-xs font-extrabold text-slate-700 truncate max-w-[90px] px-1 leading-tight">
                                     {currentVoice.name}
                                 </div>
                            </div>
                        </>
                     ) : (
                        <>
                             <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                                 <Mic className="w-5 h-5 text-slate-300" />
                             </div>
                             <span className="text-xs font-bold text-slate-400">Select</span>
                        </>
                     )}
                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="w-3 h-3 text-slate-400" />
                    </div>
                 </button>
             </div>
          </div>

          {/* Section 2: Story Prompt & Mode Toggle */}
          <div className="mt-8 mb-6">
             <div className="flex items-center justify-between mb-3">
                 <h2 className="text-lg font-bold text-slate-800 leading-tight">
                    What happened?
                 </h2>
                 
                 <div className="flex items-center bg-white p-1 rounded-full border border-slate-200 shadow-sm">
                    <button 
                        onClick={() => setInputMode('requests')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all ${inputMode === 'requests' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <MessageCircle className="w-3 h-3" />
                        Requests
                    </button>
                    <button 
                        onClick={() => setInputMode('text')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all ${inputMode === 'text' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <PenTool className="w-3 h-3" />
                        Text
                    </button>
                    <button 
                        onClick={() => setInputMode('values')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all ${inputMode === 'values' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <GraduationCap className="w-3 h-3" />
                        Values
                    </button>
                 </div>
             </div>
             
             {inputMode === 'requests' && (
                /* Requests List */
                <div className="space-y-3 mb-8 animate-in fade-in duration-300">
                    {CHILD_REQUESTS.map((req) => (
                        <div 
                            key={req.id} 
                            onClick={() => handleUseRequest(req.text)}
                            className="bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.05)] flex items-center gap-4 cursor-pointer hover:border-purple-200 hover:shadow-md transition-all group active:scale-[0.98]"
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${req.isNew ? 'bg-red-50' : 'bg-slate-50'}`}>
                                {req.isNew ? (
                                     <div className="relative w-full h-full flex items-center justify-center">
                                         <div className="absolute w-full h-full bg-red-400 rounded-full animate-ping opacity-20"></div>
                                         <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                     </div>
                                ) : (
                                    <Play className="w-5 h-5 ml-1 text-slate-400 fill-slate-400" />
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-800 text-sm truncate leading-tight mb-1">{req.text}</h3>
                                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {req.date}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {req.duration}</span>
                                </div>
                            </div>

                            <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-purple-50 group-hover:text-purple-500 group-hover:border-purple-100 transition-colors">
                                <Plus className="w-4 h-4" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {inputMode === 'text' && (
                /* Text Input Area */
                <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 mb-8 relative shadow-sm focus-within:ring-4 focus-within:ring-purple-50 focus-within:border-purple-300 transition-all animate-in fade-in duration-300">
                     <textarea 
                        className="w-full h-32 resize-none outline-none text-slate-700 text-lg font-medium placeholder:text-slate-300 bg-transparent leading-relaxed"
                        placeholder="Once upon a time..."
                        value={textPrompt}
                        onChange={(e) => setTextPrompt(e.target.value)}
                        autoFocus
                    />
                     {/* Character Count */}
                    <div className="absolute bottom-6 right-6 text-[10px] font-bold text-slate-300 bg-slate-50 px-2 py-1 rounded-full border border-slate-100 flex items-center gap-1">
                        <Keyboard className="w-3 h-3" />
                        {textPrompt.length} chars
                    </div>
                </div>
            )}
            
            {inputMode === 'values' && (
                /* Values Selection Grid */
                <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 mb-8 shadow-sm animate-in fade-in duration-300">
                    <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select a Value to Teach</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {TEACHING_VALUES.map((val) => {
                            const isSelected = selectedValueId === val.id;
                            return (
                                <button
                                    key={val.id}
                                    onClick={() => handleValueSelect(val.id)}
                                    className={`
                                        p-4 rounded-3xl border-2 transition-all duration-300 text-left relative overflow-hidden group
                                        ${isSelected 
                                            ? `bg-slate-900 border-slate-900 shadow-md` 
                                            : `bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200`
                                        }
                                    `}
                                >
                                    <div className={`
                                        w-10 h-10 rounded-2xl flex items-center justify-center mb-3 transition-colors
                                        ${isSelected ? 'bg-white/20 text-white' : `${val.color}`}
                                    `}>
                                        <val.icon className="w-5 h-5" />
                                    </div>
                                    <div className={`font-bold text-sm mb-0.5 ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                        {val.name}
                                    </div>
                                    <div className={`text-[10px] font-bold ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                                        {val.desc}
                                    </div>
                                    
                                    {isSelected && (
                                        <div className="absolute top-4 right-4 text-white animate-in zoom-in duration-200">
                                            <Check className="w-4 h-4" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Quick Tags (Only visible for Voice/Text) */}
            {inputMode !== 'values' && (
                <div className="animate-in fade-in duration-500">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Quick Add</h3>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        <Tag 
                            icon={<Smile className="w-3.5 h-3.5" />} 
                            label="Happy" 
                            color="text-blue-500" 
                            onClick={() => handleAddTag('Happy')} 
                        />
                        <Tag 
                            icon={<Zap className="w-3.5 h-3.5" />} 
                            label="Energetic" 
                            color="text-orange-500" 
                            onClick={() => handleAddTag('Energetic')} 
                        />
                        <Tag 
                            icon={<Trees className="w-3.5 h-3.5" />} 
                            label="Park" 
                            color="text-green-500" 
                            onClick={() => handleAddTag('Park')} 
                        />
                        <Tag 
                            icon={<GraduationCap className="w-3.5 h-3.5" />} 
                            label="School" 
                            color="text-indigo-500" 
                            onClick={() => handleAddTag('School')} 
                        />
                        <button className="w-9 h-9 rounded-full bg-white border border-slate-200 border-dashed flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors active:scale-95">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
          </div>
      </div>

      {/* Footer Action */}
      <div className="p-6 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7] to-transparent sticky bottom-0 z-20 pb-28">
        <button 
            onClick={handleCreateOutline}
            className="w-full py-5 rounded-[1.8rem] bg-slate-900 text-white font-bold text-lg shadow-xl shadow-slate-300 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
            <span className="relative z-10">Create Magic</span>
            <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-sm backdrop-blur-sm border border-white/10">
                <Diamond className="w-3 h-3 fill-current" />
                {totalCost}
            </div>
        </button>
      </div>

    </div>
    </>
  )
}

interface TagProps {
    icon: React.ReactNode;
    label: string;
    color: string;
    onClick?: () => void;
}

const Tag: React.FC<TagProps> = ({ icon, label, color, onClick }) => (
    <div 
        onClick={onClick}
        className={`flex items-center gap-2 pl-2 pr-3 py-2 rounded-full border border-slate-200 bg-white hover:border-slate-300 transition-all cursor-pointer active:scale-95 group shadow-sm`}
    >
        <div className={`${color} group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <span className="text-xs font-bold text-slate-600">{label}</span>
    </div>
);