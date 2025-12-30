import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FeaturedCard } from './components/FeaturedCard';
import { BottomNav } from './components/BottomNav';
import { ReadingView, ReadingMode } from './components/ReadingView';
import { CreateStoryView } from './components/CreateStoryView';
import { StatsView } from './components/StatsView';
import { ChildHubView } from './components/ChildHubView';
import { BookDetailsView } from './components/BookDetailsView';
import { LibraryView } from './components/LibraryView';
import { SettingsView } from './components/SettingsView';
import { FulfillmentTracker } from './components/FulfillmentTracker';
import { Book, AvatarConfig } from './types';
import { OUTFITS, HATS, TOYS, SKIN_TONES } from './constants';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Navigation State
  const [viewState, setViewState] = useState<'home' | 'details' | 'reading'>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readingMode, setReadingMode] = useState<ReadingMode>('parent');
  
  const [isAppLocked, setIsAppLocked] = useState(false);

  // Avatar State (Lifted Up)
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
      skinColor: SKIN_TONES[1],
      outfitId: OUTFITS[0].id,
      hatId: HATS[0].id,
      toyId: TOYS[0].id,
  });

  // Simple entry animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 1. User Clicks a Book -> Go to Details View
  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setViewState('details');
  };

  // 2. User selects a Mode in Details View -> Go to Reading View
  const handleModeSelect = (mode: ReadingMode) => {
    setReadingMode(mode);
    setViewState('reading');
  };

  // 3. Child directly reads a book from their hub -> Go to Reading View (Child Mode)
  const handleChildRead = (book: Book) => {
    setSelectedBook(book);
    setReadingMode('child');
    setViewState('reading');
  };

  // Back from Details to Home
  const handleBackToHome = () => {
    setViewState('home');
    setSelectedBook(null);
  };

  // Back from Reading to Home (or Details, but usually Home/Done)
  const handleCloseReading = () => {
    setViewState('home');
    setSelectedBook(null);
  };

  return (
    <div className={`h-screen bg-slate-50 font-sans selection:bg-purple-100 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} overflow-hidden`}>
      
      <div className="relative z-10 max-w-md mx-auto bg-slate-50 h-full shadow-2xl shadow-slate-200/50 overflow-hidden border-x border-slate-100 flex flex-col">
        
        {/* VIEW 3: READING */}
        {viewState === 'reading' && selectedBook && (
            <ReadingView 
                book={selectedBook} 
                mode={readingMode} 
                onClose={handleCloseReading} 
            />
        )}

        {/* VIEW 2: DETAILS */}
        {viewState === 'details' && selectedBook && (
            <BookDetailsView 
                book={selectedBook}
                onBack={handleBackToHome}
                onSelectMode={handleModeSelect}
            />
        )}

        {/* VIEW 1: MAIN TAB CONTENT */}
        {viewState === 'home' && (
            <>
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {activeTab === 'home' && (
                        <div className="pb-32 bg-[#FDFBF7]">
                            <Header />
                            <FeaturedCard onRead={handleBookClick} />
                            
                            {/* Fulfillment Score Section */}
                            <FulfillmentTracker />
                            
                            {/* Replaced NewArrivals with LibraryView as the main list */}
                            <LibraryView onBookClick={handleBookClick} isHome={true} />
                        </div>
                    )}
                    
                    {activeTab === 'create' && (
                        <CreateStoryView avatarConfig={avatarConfig} />
                    )}

                    {activeTab === 'stats' && (
                        <StatsView />
                    )}
                    
                    {activeTab === 'child-hub' && (
                        <ChildHubView 
                            isLocked={isAppLocked} 
                            onToggleLock={setIsAppLocked} 
                            avatarConfig={avatarConfig}
                            onUpdateAvatar={setAvatarConfig}
                            onReadBook={handleChildRead}
                        />
                    )}

                    {activeTab === 'settings' && (
                        <SettingsView />
                    )}

                    {/* Placeholder for other tabs */}
                    {(activeTab !== 'home' && activeTab !== 'create' && activeTab !== 'stats' && activeTab !== 'child-hub' && activeTab !== 'settings') && (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-50">
                            <h2 className="text-2xl font-bold text-slate-300 mb-2">Coming Soon</h2>
                            <p className="text-slate-400">This feature is still in development.</p>
                        </div>
                    )}
                </div>

                {/* Bottom Navigation - Hidden when locked */}
                {!isAppLocked && (
                    <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
                )}
            </>
        )}
      </div>
    </div>
  );
}