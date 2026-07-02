import { useEffect, useRef, useState } from "react";
import { initialize, detect } from "../utils/utils.js";
import { useSong } from "../../home/hooks/useSong.js";
import Player from "../../home/components/Player.jsx";
import Logout from "../../home/components/Logout.jsx";

export default function Expression() {
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState("Loading...");
  const { handleSong } = useSong();

  const startCamera = () => {
    setEmotion("Loading...");
    initialize({ videoRef, setEmotion });
  };

  const handleDetect = () => {
    const mood = detect({ videoRef, setEmotion });
    const validMoods = ["sad", "happy", "surprised"];

    // Fetch and play song immediately on button click if a valid mood is detected
    if (mood && validMoods.includes(mood)) {
      handleSong({ mood });
    }
  };

  return (
    <div
      className="w-full min-h-screen text-white bg-zinc-800 flex items-center justify-center relative pb-32 p-4 sm:p-8"
      style={{ textAlign: "center" }}
    >
      {/* Top Right Logout */}
      <div className="absolute top-4 right-4 md:top-6 md:right-8 z-50">
        <Logout/>
      </div>

      {/* Moodify Logo */}
      <div className="absolute top-4 left-4 md:top-6 md:left-8 z-50">
        <div className="flex items-center gap-2 justify-center">
          <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
            <img src="/Moodify%202.png" alt="Moodify Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <span className="text-[#f2ede4] font-semibold tracking-tight text-lg drop-shadow-md">
            Moodify
          </span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col md:flex-row landscape:flex-row items-center justify-center gap-6 md:gap-10 landscape:gap-8 w-full max-w-5xl">
        {/* Left Side: Video */}
        <div className="flex flex-col items-center w-full md:w-1/2 landscape:w-1/2 max-w-[640px]">
          <h1 className="text-2xl font-bold mb-4 md:hidden landscape:hidden">
            Expression Detector
          </h1>
          <video
            className="rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-2 border-gray-600 w-full aspect-video object-cover bg-black"
            ref={videoRef}
            autoPlay
            playsInline
            muted
          />
        </div>

        {/* Right Side: Controls */}
        <div className="flex flex-col items-center md:items-start landscape:items-start text-center md:text-left landscape:text-left w-full md:w-1/2 landscape:w-1/2">
          <h1 className="hidden md:block landscape:block text-3xl md:text-4xl font-bold mb-4 md:mb-6">
            Expression Detector
          </h1>

          <h2 className="text-lg md:text-xl font-medium mb-6 text-orange-400 bg-gray-900/60 px-5 md:px-6 py-2 rounded-full border border-gray-700 shadow-inner">
            {emotion}
          </h2>

          <div className="flex flex-row gap-3 md:gap-4 flex-wrap justify-center md:justify-start landscape:justify-start w-full">
            <button
              className="flex-1 md:flex-none px-4 py-3 md:px-6 md:py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-bold shadow-lg"
              onClick={startCamera}
            >
              Start Camera
            </button>
            <button
              className="flex-1 md:flex-none px-4 py-3 md:px-6 md:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition font-bold shadow-lg"
              onClick={handleDetect}
            >
              Detect
            </button>
          </div>
        </div>
      </div>

      <Player />
    </div>
  );
}
