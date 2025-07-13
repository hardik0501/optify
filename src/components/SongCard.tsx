import React from 'react';
import { Play, Pause } from 'lucide-react';

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

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  currentSong: Song | null;
  onPlay: (song: Song) => void;
  size?: 'small' | 'medium' | 'large';
}

const SongCard: React.FC<SongCardProps> = ({ 
  song, 
  isPlaying, 
  currentSong, 
  onPlay, 
  size = 'medium' 
}) => {
  const isCurrentSong = currentSong?.id === song.id;
  
  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };

  const imageSizeClasses = {
    small: 'aspect-square',
    medium: 'aspect-square',
    large: 'aspect-square'
  };

  const titleSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div
      onClick={() => onPlay(song)}
      className={`bg-gray-800/50 backdrop-blur-md ${sizeClasses[size]} rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-gray-700/50 group relative overflow-hidden ${
        isCurrentSong ? 'ring-2 ring-purple-500 bg-purple-900/20' : ''
      }`}
    >
      {/* Shimmer Loading Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="relative">
        <div className={`relative overflow-hidden rounded-lg mb-3 ${imageSizeClasses[size]}`}>
          <img
            src={song.cover}
            alt={song.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Play/Pause Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
              {isCurrentSong && isPlaying ? (
                <Pause className="text-white" size={20} />
              ) : (
                <Play className="text-white ml-1" size={20} />
              )}
            </div>
          </div>

          {/* Currently Playing Indicator */}
          {isCurrentSong && (
            <div className="absolute bottom-2 right-2">
              <div className="flex space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-purple-400 rounded-full ${
                      isPlaying ? 'animate-pulse' : ''
                    }`}
                    style={{
                      height: `${Math.random() * 16 + 8}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h4 className={`text-white font-semibold ${titleSizeClasses[size]} truncate`}>
            {song.title}
          </h4>
          <p className="text-gray-400 text-sm truncate">{song.artist}</p>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{song.genre}</span>
            <span>{song.duration}</span>
          </div>
        </div>

        {/* Glow Effect for Current Song */}
        {isCurrentSong && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 -z-10 blur-xl"></div>
        )}
      </div>
    </div>
  );
};

export default SongCard;