import React from 'react';
import SongCard from './SongCard';

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

interface PlaylistSectionProps {
  title: string;
  songs: Song[];
  onSongSelect: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  size?: 'small' | 'medium' | 'large';
}

const PlaylistSection: React.FC<PlaylistSectionProps> = ({
  title,
  songs,
  onSongSelect,
  currentSong,
  isPlaying,
  size = 'medium'
}) => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200">
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            isPlaying={isPlaying}
            currentSong={currentSong}
            onPlay={onSongSelect}
            size={size}
          />
        ))}
      </div>
    </section>
  );
};

export default PlaylistSection;