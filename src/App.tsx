import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchPanel from './components/SearchPanel';
import SongCard from './components/SongCard';
import MusicPlayer from './components/MusicPlayer';
import PlaylistSection from './components/PlaylistSection';
import songsData from './data/songs.json';

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  audio: string;
  genre: string;
}

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist] = useState<Song[]>(songsData);

  // Featured playlists data
  const featuredSongs = playlist.slice(0, 6);
  const trendingSongs = playlist.slice(2, 8);
  const recommendedSongs = playlist.slice(1, 7);

  const handleSongSelect = (song: Song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentSong) {
      const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
      const nextIndex = (currentIndex + 1) % playlist.length;
      setCurrentSong(playlist[nextIndex]);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (currentSong) {
      const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
      const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
      setCurrentSong(playlist[prevIndex]);
      setIsPlaying(true);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'search':
        return (
          <div className="p-6">
            <SearchPanel
              songs={playlist}
              onSongSelect={handleSongSelect}
              currentSong={currentSong}
            />
          </div>
        );
      
      case 'discover':
        return (
          <div className="p-6 space-y-8">
            <PlaylistSection
              title="New Releases"
              songs={playlist.slice(3, 8)}
              onSongSelect={handleSongSelect}
              currentSong={currentSong}
              isPlaying={isPlaying}
            />
            <PlaylistSection
              title="Popular This Week"
              songs={playlist.slice(0, 5)}
              onSongSelect={handleSongSelect}
              currentSong={currentSong}
              isPlaying={isPlaying}
            />
          </div>
        );
      
      case 'library':
        return (
          <div className="p-6 space-y-8">
            <PlaylistSection
              title="Your Favorites"
              songs={playlist.slice(1, 6)}
              onSongSelect={handleSongSelect}
              currentSong={currentSong}
              isPlaying={isPlaying}
            />
            <PlaylistSection
              title="Recently Played"
              songs={playlist.slice(2, 7)}
              onSongSelect={handleSongSelect}
              currentSong={currentSong}
              isPlaying={isPlaying}
            />
          </div>
        );
      
      default: // home
        return (
          <div className="p-6 space-y-8">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 p-8 md:p-12">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  Listen Your Way
                </h1>
                <p className="text-xl text-purple-100 mb-8 max-w-2xl">
                  Discover millions of songs, create your perfect playlists, and enjoy music like never before.
                </p>
                <button 
                  onClick={() => handleSongSelect(playlist[0])}
                  className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-200"
                >
                  Start Listening
                </button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-pink-500/30 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-r from-purple-500/30 to-transparent rounded-full blur-3xl"></div>
            </section>

            {/* Featured Playlists */}
            <PlaylistSection
              title="Featured Playlists"
              songs={featuredSongs}
              onSongSelect={handleSongSelect}
              currentSong={currentSong}
              isPlaying={isPlaying}
              size="large"
            />

            {/* Trending Now */}
            <PlaylistSection
              title="Trending Now"
              songs={trendingSongs}
              onSongSelect={handleSongSelect}
              currentSong={currentSong}
              isPlaying={isPlaying}
            />

            {/* Recommended for You */}
            <PlaylistSection
              title="Recommended for You"
              songs={recommendedSongs}
              onSongSelect={handleSongSelect}
              currentSong={currentSong}
              isPlaying={isPlaying}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>
      
      <div className="relative z-10">
        <Navbar onNavClick={setActiveSection} activeSection={activeSection} />
        
        <main className="pb-32">
          {renderContent()}
        </main>

        <MusicPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          playlist={playlist}
        />
      </div>
    </div>
  );
}

export default App;