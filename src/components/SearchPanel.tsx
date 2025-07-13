import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

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

interface SearchPanelProps {
  songs: Song[];
  onSongSelect: (song: Song) => void;
  currentSong: Song | null;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ songs, onSongSelect, currentSong }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(songs);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSongs(songs);
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      const filtered = songs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.album.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSongs(filtered);

      // Generate suggestions
      const titleSuggestions = songs
        .filter(song => song.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(song => song.title)
        .slice(0, 3);
      
      const artistSuggestions = songs
        .filter(song => song.artist.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(song => song.artist)
        .slice(0, 3);

      setSuggestions([...new Set([...titleSuggestions, ...artistSuggestions])]);
      setShowSuggestions(true);
    }
  }, [searchTerm, songs]);

  const clearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for songs, artists, albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm && setShowSuggestions(true)}
            className="w-full pl-12 pr-12 py-4 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl overflow-hidden z-10">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 flex items-center space-x-3"
              >
                <Search size={16} className="text-gray-500" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Search Results ({filteredSongs.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => onSongSelect(song)}
                className={`bg-gray-800/50 backdrop-blur-md p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-gray-700/50 group ${
                  currentSong?.id === song.id ? 'ring-2 ring-purple-500 bg-purple-900/20' : ''
                }`}
              >
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {currentSong?.id === song.id && (
                    <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>
                <h4 className="text-white font-semibold text-sm mb-1 truncate">{song.title}</h4>
                <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                <p className="text-gray-500 text-xs mt-1">{song.duration}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPanel;