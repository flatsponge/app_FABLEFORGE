import React, { useState } from 'react';
import { 
  X, 
  Map, 
  Users, 
  Mic, 
  Plus, 
  Upload, 
  Trash2, 
  Pencil,
  Image as ImageIcon,
  MoreVertical,
  CloudLightning,
  Sparkles
} from 'lucide-react';
import { PRESET_LOCATIONS, FRIENDS, VOICE_PRESETS } from '../constants';

interface ManageAssetsViewProps {
  onClose: () => void;
}

export const ManageAssetsView: React.FC<ManageAssetsViewProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'places' | 'faces' | 'voices'>('faces');

  // Tabs Configuration
  const tabs = [
    { id: 'faces', label: 'Characters', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'places', label: 'Places', icon: Map, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'voices', label: 'Voices', icon: Mic, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="absolute inset-0 z-50 bg-[#FDFBF7] flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <div>
           <div className="flex items-center gap-2 mb-1">
                <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Parent Zone</span>
           </div>
           <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
             My Assets
           </h2>
           <p className="text-xs font-bold text-slate-400">Manage your custom story elements</p>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
           {tabs.map((tab) => {
             const isActive = activeTab === tab.id;
             return (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-xs font-bold transition-all ${isActive ? `${tab.bg} ${tab.color} shadow-sm` : 'text-slate-400 hover:bg-slate-50'}`}
               >
                 <tab.icon className={`w-5 h-5 ${isActive ? 'fill-current opacity-20' : ''}`} strokeWidth={2.5} />
                 {tab.label}
               </button>
             )
           })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-20 scrollbar-hide">
        
        {/* CHARACTERS TAB */}
        {activeTab === 'faces' && (
          <div className="space-y-6">
            
            {/* Upload Action */}
            <button className="w-full h-32 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-3 hover:bg-white hover:border-orange-300 hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6" />
                </div>
                <div className="text-center">
                    <div className="font-bold text-slate-700">Create New Character</div>
                    <div className="text-xs font-bold text-slate-400">Upload photo or design avatar</div>
                </div>
            </button>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {FRIENDS.map((friend) => (
                    <div key={friend.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl ${friend.color} flex items-center justify-center text-3xl shrink-0`}>
                            {friend.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-lg">{friend.name}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{friend.type}</p>
                        </div>
                        <div className="flex gap-2">
                             <button className="w-9 h-9 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 transition-colors">
                                <Pencil className="w-4 h-4" />
                             </button>
                             <button className="w-9 h-9 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                             </button>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* PLACES TAB */}
        {activeTab === 'places' && (
          <div className="space-y-6">
             {/* Upload Action */}
            <button className="w-full h-24 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center gap-4 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all group px-6">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                    <div className="font-bold text-slate-700">Upload Location Photo</div>
                    <div className="text-xs font-bold text-slate-400">Use real places from your life</div>
                </div>
            </button>

            <div className="grid grid-cols-2 gap-4">
                {PRESET_LOCATIONS.map((loc) => (
                    <div key={loc.id} className="bg-white p-3 rounded-3xl border border-slate-100 shadow-sm group">
                        <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                            <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-slate-600 hover:text-red-500">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        <div className="px-1">
                            <h3 className="font-bold text-slate-800 text-sm truncate">{loc.name}</h3>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Preset</span>
                                <button className="text-slate-300 hover:text-indigo-500">
                                    <Pencil className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* VOICES TAB */}
        {activeTab === 'voices' && (
           <div className="relative">
               {/* Disabled Layer */}
               <div className="space-y-4 opacity-40 pointer-events-none select-none filter grayscale">
                   {/* Clone Action */}
                   <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-6 rounded-3xl text-white shadow-lg shadow-rose-200">
                       <div className="flex items-start justify-between mb-4">
                           <div>
                               <h3 className="font-bold text-xl">Clone a Voice</h3>
                               <p className="text-white/80 text-sm font-medium">Create a custom narrator using your own voice.</p>
                           </div>
                           <div className="bg-white/20 p-2 rounded-xl">
                               <CloudLightning className="w-6 h-6 text-white" />
                           </div>
                       </div>
                       <button className="w-full py-3 bg-white text-rose-600 rounded-xl font-bold text-sm shadow-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2">
                           <Mic className="w-4 h-4" />
                           Start Recording
                       </button>
                   </div>

                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Your Voices</h3>

                   {VOICE_PRESETS.map((voice) => (
                       <div key={voice.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl ${voice.color} bg-opacity-20 flex items-center justify-center text-xl`}>
                                {voice.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800">{voice.name}</h4>
                                <p className="text-xs font-bold text-slate-400">{voice.style}</p>
                            </div>
                            <button className="p-2 text-slate-300 hover:text-slate-600">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                       </div>
                   ))}
               </div>
               
               {/* Overlay */}
               <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-200 shadow-2xl text-center max-w-[240px] transform rotate-3">
                       <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                           <Sparkles className="w-7 h-7 text-rose-500 fill-rose-500" />
                       </div>
                       <h3 className="font-extrabold text-slate-800 text-xl mb-2">Coming Soon</h3>
                       <p className="text-xs font-bold text-slate-500 leading-relaxed">
                           Voice Cloning is currently under development. Stay tuned for updates!
                       </p>
                    </div>
               </div>
           </div>
        )}

      </div>
    </div>
  );
};