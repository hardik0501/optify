import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  MoreHorizontal
} from 'lucide-react';

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

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  playlist: Song[];
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  playlist
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.audio;
      audioRef.current.load();
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        // Only play if the audio is ready and has loaded metadata
        if (audioRef.current.readyState >= 2) {
          audioRef.current.play().catch(console.error);
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      // If the player should be playing when metadata loads, start playback
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentSong) {
    return null;
  }

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />
      
      {/* Desktop Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800 p-4 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Song Info */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="relative">
                <img
                  src={currentSong.cover}
                  alt={currentSong.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-purple-600/20 rounded-lg animate-pulse"></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-white font-semibold truncate">{currentSong.title}</h4>
                <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
              </div>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Heart className={isLiked ? 'fill-red-500 text-red-500' : ''} size={20} />
              </button>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`transition-colors duration-200 ${
                    isShuffled ? 'text-purple-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Shuffle size={16} />
                </button>
                
                <button
                  onClick={onPrevious}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <SkipBack size={20} />
                </button>
                
                <button
                  onClick={onPlayPause}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200"
                >
                  {isPlaying ? (
                    <Pause className="text-black" size={20} />
                  ) : (
                    <Play className="text-black ml-1" size={20} />
                  )}
                </button>
                
                <button
                  onClick={onNext}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <SkipForward size={20} />
                </button>
                
                <button
                  onClick={() => setRepeatMode(
                    repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none'
                  )}
                  className={`transition-colors duration-200 ${
                    repeatMode !== 'none' ? 'text-purple-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Repeat size={16} />
                  {repeatMode === 'one' && (
                    <span className="absolute -mt-2 -mr-2 text-xs">1</span>
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center space-x-2 w-full">
                <span className="text-xs text-gray-400 min-w-[35px]">
                  {formatTime(currentTime)}
                </span>
                <div
                  ref={progressRef}
                  onClick={handleProgressClick}
                  className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group"
                >
                  <div
                    className="h-full bg-white rounded-full relative transition-all duration-300 group-hover:bg-purple-400"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                </div>
                <span className="text-xs text-gray-400 min-w-[35px]">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-3 flex-1 justify-end">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <div className="w-24 h-1 bg-gray-600 rounded-full cursor-pointer group">
                <div
                  className="h-full bg-white rounded-full relative group-hover:bg-purple-400"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                  onClick={(e) => {
                    const rect = e.currentTarget.parentElement!.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    setVolume(Math.max(0, Math.min(1, percent)));
                    setIsMuted(false);
                  }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors duration-200">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Mini Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800 p-4 z-50 md:hidden">
        <div className="flex items-center space-x-3">
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm truncate">{currentSong.title}</h4>
            <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
          </div>
          <button
            onClick={onPlayPause}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="text-black" size={16} />
            ) : (
              <Play className="text-black ml-0.5" size={16} />
            )}
          </button>
        </div>
        
        {/* Mobile Progress Bar */}
        <div className="mt-2">
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="w-full h-1 bg-gray-600 rounded-full cursor-pointer"
          >
            <div
              className="h-full bg-purple-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;