import React from 'react';
import { Home, BarChart2, PlusCircle, Baby, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'stats', icon: BarChart2, label: 'Stats' },
    { id: 'create', icon: PlusCircle, label: 'Create' },
    { id: 'child-hub', icon: Baby, label: 'Me' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 pb-8 pt-4 px-4 rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50">
      <div className="flex justify-between items-center max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isCreate = tab.id === 'create';

          if (isCreate) {
               return (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative flex flex-col items-center justify-center w-12 h-12 -mt-8"
                >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${isActive ? 'bg-purple-600 scale-110' : 'bg-purple-500 hover:scale-105'}`}>
                        <PlusCircle className="w-8 h-8 text-white" />
                    </div>
                </button>
               )
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-12 h-12"
            >
              {isActive && (
                <span className="absolute -top-4 w-8 h-1 bg-purple-500 rounded-full animate-bounce"></span>
              )}
              <div className={`transition-all duration-300 ${isActive ? 'text-purple-600 transform -translate-y-1' : 'text-slate-400 hover:text-slate-600'}`}>
                <Icon className={`${isActive ? 'fill-purple-100' : ''} w-7 h-7`} strokeWidth={isActive ? 2.5 : 2} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};