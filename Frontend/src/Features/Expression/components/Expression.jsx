import { useEffect, useRef, useState } from "react";
import { initialize, detect } from "../utils/utils.js";

export default function Expression() {
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState("Loading...");


  useEffect(() => {
    initialize({ videoRef, setEmotion });

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Expression Detector</h1>

      <video ref={videoRef} autoPlay playsInline muted width="640" />

      <h2>{emotion}</h2>
      <button onClick={() => detect({ videoRef, setEmotion })}>Detect Expression</button>
    </div>
  );
}
