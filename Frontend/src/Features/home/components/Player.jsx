import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';
import { useSong } from '../hooks/useSong';

const Player = () => {
  const { song } = useSong();
  const audioRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Update audio when song changes
  useEffect(() => {
    if (audioRef.current && song?.url) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(e => {
            if (e.name !== 'AbortError') {
              console.error("Auto-play prevented", e);
            }
          });
      }
    }
  }, [song]);

  // Update speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  if (!song || !song.url) return null;

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 5, duration);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 5, 0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleProgressChange = (e) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(Number(e.target.value));
    if (isMuted && Number(e.target.value) > 0) setIsMuted(false);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const changeSpeed = (rate) => {
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t-[3px] border-orange-500 shadow-[0_-8px_30px_rgba(249,115,22,0.15)] p-2 md:p-3 z-50 rounded-t-2xl md:rounded-t-3xl text-gray-200 transition-all">
      <audio 
        ref={audioRef} 
        src={song.url} 
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      
      {/* Progress Bar (Centered on top border) */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[92%] md:w-[98%] max-w-4xl group">
        <input 
          type="range" 
          min="0" 
          max={duration} 
          value={currentTime} 
          onChange={handleProgressChange}
          className="w-full h-1.5 md:h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-orange-500 hover:h-2 md:hover:h-3 transition-all outline-none shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
        />
      </div>

      <div className="max-w-4xl mx-auto flex flex-row items-center justify-between mt-2 md:mt-3 px-3 md:px-4 gap-2 md:gap-0">
        
        {/* Song Info (Mobile: Left, Desktop: Left) */}
        <div className="flex items-center gap-3 flex-1 min-w-0 md:flex-none md:w-1/4 order-1 md:order-1">
          {song.posterUrl ? (
            <img src={song.posterUrl} alt="Poster" className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl object-cover shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-gray-700" />
          ) : (
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gray-800 shadow-md border border-gray-700"></div>
          )}
          <div className="truncate flex-1">
            <h3 className="font-bold text-sm md:text-lg truncate text-orange-400 drop-shadow-md">{song.title || "Unknown Song"}</h3>
            <p className="text-orange-500/70 text-[10px] md:text-sm font-medium capitalize">{song.mood ? `${song.mood} Mood` : ""}</p>
          </div>
        </div>

        {/* Extra Controls (Mobile: Center-Right, Desktop: Right) */}
        <div className="flex items-center justify-end gap-3 order-2 md:order-3 shrink-0 md:w-1/4 relative">
            
           {/* Volume Control (hidden on mobile) */}
           <div className="hidden md:flex items-center gap-2 group">
              <button onClick={toggleMute} className="text-orange-500/80 hover:text-orange-400 transition">
                {isMuted || volume === 0 ? <VolumeX size={18} className="md:w-5 md:h-5" strokeWidth={2.5}/> : <Volume2 size={18} className="md:w-5 md:h-5" strokeWidth={2.5}/>}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={isMuted ? 0 : volume} 
                onChange={handleVolumeChange}
                className="w-16 md:w-20 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 outline-none"
              />
           </div>

           {/* Speed Control */}
           <button 
             onClick={() => setShowSpeedMenu(!showSpeedMenu)}
             className="text-orange-400 hover:text-white hover:bg-orange-500 transition text-[10px] md:text-sm font-bold px-2 py-1 md:px-3 rounded-lg bg-gray-800 border border-gray-700 shadow-sm"
           >
             {playbackRate}x
           </button>
           
           {showSpeedMenu && (
             <div className="absolute bottom-10 md:bottom-12 right-0 bg-gray-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-gray-700 overflow-hidden flex flex-col min-w-[80px] md:min-w-[100px] z-50">
               {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                 <button
                   key={rate}
                   onClick={() => changeSpeed(rate)}
                   className={`px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-bold text-left hover:bg-gray-700 transition ${playbackRate === rate ? 'text-orange-400 bg-gray-700/50 border-l-4 border-orange-500' : 'text-gray-300'}`}
                 >
                   {rate}x
                 </button>
               ))}
             </div>
           )}
        </div>

        {/* Play Controls (Mobile: Right, Desktop: Center) */}
        <div className="flex flex-col items-end md:items-center justify-center order-3 md:order-2 shrink-0 md:w-1/2">
          <div className="flex items-center gap-2 md:gap-6">
            <button 
              onClick={skipBackward} 
              className="text-orange-500/80 hover:text-orange-400 transition hover:-translate-y-1 hidden sm:block"
              title="Backward 5s"
            >
              <RotateCcw size={22} className="md:w-6 md:h-6" strokeWidth={2.5} />
            </button>
            
            <button 
              onClick={togglePlayPause} 
              className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-gradient-to-tr from-orange-600 to-orange-400 text-white rounded-xl md:rounded-2xl hover:scale-105 hover:shadow-[0_4px_15px_rgba(249,115,22,0.4)] transition-all transform shadow-lg"
            >
              {isPlaying ? <Pause size={20} className="fill-white md:w-7 md:h-7" strokeWidth={0} /> : <Play size={20} className="fill-white ml-1 md:w-7 md:h-7" strokeWidth={0} />}
            </button>
            
            <button 
              onClick={skipForward} 
              className="text-orange-500/80 hover:text-orange-400 transition hover:-translate-y-1 hidden sm:block"
              title="Forward 5s"
            >
              <RotateCw size={22} className="md:w-6 md:h-6" strokeWidth={2.5} />
            </button>
          </div>
          
          {/* Time Display */}
          <div className="hidden sm:flex justify-between text-[10px] md:text-xs font-bold text-orange-500/60 w-full px-4 md:px-8 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Player;