import React, { useState } from 'react';
import { Settings, Bell, Volume2, Moon, Shield, HelpCircle, LogOut, ChevronRight, Crown, CreditCard, User, Mail, Pencil } from 'lucide-react';

export const SettingsView = () => {
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className="bg-[#FDFBF7] min-h-screen pb-32 animate-in fade-in duration-500">
            {/* Header */}
            <div className="px-6 pt-12 pb-6 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Settings</h1>
            </div>

            <div className="p-6 space-y-8">
                {/* Profile Section */}
                <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden relative">
                         <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                            <User className="w-8 h-8 text-slate-400" />
                         </div>
                         <img 
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" 
                            alt="Profile" 
                            className="w-full h-full object-cover relative z-10" 
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-800">Leo's Parent</h2>
                        <p className="text-xs font-medium text-slate-400">Free Plan</p>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-indigo-500 bg-slate-50 rounded-full">
                        <Pencil className="w-4 h-4" />
                    </button>
                </div>

                {/* Premium Banner */}
                <div className="relative overflow-hidden rounded-3xl p-6 bg-slate-900 text-white shadow-xl shadow-slate-200 group cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-500/40 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-amber-400">
                            <Crown className="w-5 h-5 fill-current" />
                            <span className="text-xs font-black uppercase tracking-widest">Premium</span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">Upgrade to StoryTime+</h3>
                        <p className="text-sm text-slate-300 mb-4 font-medium">Unlock unlimited stories, voice cloning, and 4K images.</p>
                        <button className="w-full py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-50 transition-colors">
                            View Plans
                        </button>
                    </div>
                </div>

                {/* Settings Groups */}
                <div className="space-y-6">
                    <section>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-2">App Settings</h3>
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <SettingItem 
                                icon={Bell} 
                                label="Notifications" 
                                color="text-blue-500" 
                                bg="bg-blue-50"
                                action={<Toggle checked={notifications} onChange={setNotifications} />}
                            />
                            <SettingItem 
                                icon={Volume2} 
                                label="Sound Effects" 
                                color="text-rose-500" 
                                bg="bg-rose-50"
                                action={<Toggle checked={sound} onChange={setSound} />}
                            />
                            <SettingItem 
                                icon={Moon} 
                                label="Dark Mode" 
                                color="text-indigo-500" 
                                bg="bg-indigo-50"
                                action={<Toggle checked={darkMode} onChange={setDarkMode} />}
                            />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Account</h3>
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <SettingItem 
                                icon={Shield} 
                                label="Parental Controls" 
                                color="text-emerald-500" 
                                bg="bg-emerald-50"
                                action={<ChevronRight className="w-5 h-5 text-slate-300" />}
                            />
                            <SettingItem 
                                icon={CreditCard} 
                                label="Subscription" 
                                color="text-purple-500" 
                                bg="bg-purple-50"
                                action={<ChevronRight className="w-5 h-5 text-slate-300" />}
                            />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Support</h3>
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <SettingItem 
                                icon={HelpCircle} 
                                label="Help & FAQ" 
                                color="text-amber-500" 
                                bg="bg-amber-50"
                                action={<ChevronRight className="w-5 h-5 text-slate-300" />}
                            />
                            <SettingItem 
                                icon={Mail} 
                                label="Contact Us" 
                                color="text-cyan-500" 
                                bg="bg-cyan-50"
                                action={<ChevronRight className="w-5 h-5 text-slate-300" />}
                            />
                        </div>
                    </section>

                     <button className="w-full py-4 rounded-3xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 hover:text-red-500 transition-colors flex items-center justify-center gap-2 group">
                        <LogOut className="w-4 h-4 group-hover:text-red-500" />
                        Log Out
                    </button>
                    
                    <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pb-4">
                        Version 1.2.0 (Build 405)
                    </div>
                </div>
            </div>
        </div>
    );
}

interface SettingItemProps {
    icon: React.ElementType;
    label: string;
    color: string;
    bg: string;
    action: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon: Icon, label, color, bg, action }) => (
    <div className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <span className="font-bold text-slate-700 text-sm">{label}</span>
        </div>
        <div>{action}</div>
    </div>
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button 
        onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
        className={`w-12 h-7 rounded-full transition-colors relative ${checked ? 'bg-purple-500' : 'bg-slate-200'}`}
    >
        <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : ''}`}></div>
    </button>
);