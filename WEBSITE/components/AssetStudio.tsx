import React from 'react';
import { 
  X, 
  Check,
  Diamond,
  User,
  Mic,
  Map,
  Users,
  Play,
  Volume2
} from 'lucide-react';
import { PRESET_LOCATIONS, FRIENDS, VOICE_PRESETS } from '../constants';
import { AvatarConfig } from '../types';

interface AssetStudioProps {
  onClose: () => void;
  initialTab?: 'places' | 'faces' | 'voices';
  
  // Selection Props
  selectedLocationId?: string | null;
  onSelectLocation?: (id: string) => void;
  
  selectedCharacterIds?: string[];
  onToggleCharacter?: (id: string) => void;
  
  selectedVoiceId?: string;
  onSelectVoice?: (id: string) => void;
  
  avatarConfig?: AvatarConfig; // For rendering "Me" if needed
}

export const AssetStudio: React.FC<AssetStudioProps> = ({ 
  onClose, 
  initialTab = 'places',
  selectedLocationId,
  onSelectLocation,
  selectedCharacterIds = [],
  onToggleCharacter,
  selectedVoiceId,
  onSelectVoice,
}) => {
  
  const getHeaderInfo = () => {
      switch(initialTab) {
          case 'places': return { title: 'Select Scene', icon: Map, color: 'text-indigo-500', bg: 'bg-indigo-50' };
          case 'faces': return { title: 'Cast Characters', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' };
          case 'voices': return { title: 'Choose Narrator', icon: Mic, color: 'text-rose-500', bg: 'bg-rose-50' };
          default: return { title: 'Select Asset', icon: Diamond, color: 'text-slate-500', bg: 'bg-slate-50' };
      }
  };

  const { title, icon: Icon, color, bg } = getHeaderInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 sm:p-0">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div className="relative w-full max-w-sm mx-auto bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] flex flex-col max-h-[75vh] animate-in slide-in-from-bottom-10 duration-400 border border-white/40 ring-1 ring-black/5 overflow-hidden">
        
        {/* Drag Handle (Visual Only) */}
        <div className="w-full flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 rounded-full bg-slate-200/80"></div>
        </div>

        {/* Header */}
        <div className="px-6 pb-4 pt-2 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
               <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} strokeWidth={2.5} />
               </div>
               <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">{title}</h2>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100/50 hover:bg-slate-200/50 text-slate-400 flex items-center justify-center transition-colors active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 scrollbar-hide">
            
            {/* PLACES */}
            {initialTab === 'places' && (
              <div className="grid grid-cols-2 gap-3">
                {PRESET_LOCATIONS.map(loc => {
                  const isSelected = selectedLocationId === loc.id;
                  return (
                    <button 
                        key={loc.id} 
                        onClick={() => {
                            onSelectLocation?.(loc.id);
                            onClose(); 
                        }}
                        className={`group relative aspect-[4/5] rounded-[1.5rem] overflow-hidden transition-all duration-300 ${isSelected ? 'ring-4 ring-indigo-500/20 scale-[0.98]' : 'hover:scale-[1.02] active:scale-95'}`}
                    >
                       <img src={loc.image} className="w-full h-full object-cover" alt={loc.name} />
                       
                       {/* Overlay Gradient */}
                       <div className={`absolute inset-0 transition-opacity duration-300 ${isSelected ? 'bg-indigo-900/40' : 'bg-gradient-to-t from-black/60 to-transparent opacity-80'}`}></div>
                       
                       {/* Selection Check */}
                       {isSelected && (
                           <div className="absolute inset-0 flex items-center justify-center z-10">
                               <div className="bg-indigo-500 text-white p-2 rounded-full shadow-lg animate-in zoom-in duration-300">
                                   <Check className="w-6 h-6" strokeWidth={3} />
                               </div>
                           </div>
                       )}

                       {/* Label */}
                       <div className="absolute bottom-0 inset-x-0 p-3 text-left">
                          <div className="text-white font-bold text-sm leading-tight drop-shadow-md">{loc.name}</div>
                          {loc.cost > 0 && !isSelected && (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-300 mt-1">
                                  <Diamond className="w-3 h-3 fill-current" /> {loc.cost}
                              </div>
                          )}
                       </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* FACES */}
            {initialTab === 'faces' && (
              <div className="grid grid-cols-3 gap-3">
                {/* ME Option */}
                <button 
                   onClick={() => onToggleCharacter?.('me')}
                   className={`aspect-[3/4] rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 active:scale-95 ${selectedCharacterIds.includes('me') ? 'bg-orange-50 ring-2 ring-orange-500 ring-offset-2' : 'bg-slate-50 border border-slate-100'}`}
                >
                   <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-2">
                       <User className={`w-6 h-6 ${selectedCharacterIds.includes('me') ? 'text-orange-500' : 'text-slate-400'}`} />
                   </div>
                   <div className={`font-bold text-xs ${selectedCharacterIds.includes('me') ? 'text-orange-600' : 'text-slate-500'}`}>Me</div>
                </button>

                {/* Friends */}
                {FRIENDS.map(friend => {
                  const isSelected = selectedCharacterIds.includes(friend.id);
                  return (
                    <button 
                        key={friend.id} 
                        onClick={() => onToggleCharacter?.(friend.id)}
                        className={`aspect-[3/4] rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 active:scale-95 ${isSelected ? 'bg-white ring-2 ring-orange-500 ring-offset-2 shadow-md' : 'bg-white border border-slate-100'}`}
                    >
                       <div className={`text-3xl mb-1 transition-transform ${isSelected ? 'scale-110' : ''}`}>{friend.icon}</div>
                       <div className={`font-bold text-xs ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>{friend.name}</div>
                       
                       {isSelected && (
                           <div className="absolute -top-1 -right-1 bg-orange-500 text-white p-0.5 rounded-full shadow-sm z-10 border-2 border-white">
                               <Check className="w-2.5 h-2.5" strokeWidth={3} />
                           </div>
                       )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* VOICES */}
            {initialTab === 'voices' && (
              <div className="space-y-3">
                {VOICE_PRESETS.map(voice => {
                  const isSelected = selectedVoiceId === voice.id;
                  return (
                    <button 
                        key={voice.id} 
                        onClick={() => {
                            onSelectVoice?.(voice.id);
                            onClose();
                        }}
                        className={`w-full flex items-center gap-4 p-3 pr-4 rounded-[1.5rem] border transition-all duration-200 active:scale-[0.98] ${isSelected ? 'bg-rose-50 border-rose-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                    >
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${voice.color} bg-white shadow-sm border border-slate-50`}>
                          {voice.icon}
                       </div>
                       
                       <div className="flex-1 text-left">
                          <div className="font-bold text-slate-800 text-sm">{voice.name}</div>
                          <div className="text-xs font-bold text-slate-400">{voice.style}</div>
                       </div>

                       {/* Preview / Status */}
                       {isSelected ? (
                            <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center shadow-md animate-in zoom-in">
                                <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            </div>
                       ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                                <Play className="w-3 h-3 text-slate-400 ml-0.5 fill-slate-400" />
                            </div>
                       )}
                    </button>
                  )
                })}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
