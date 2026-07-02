import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let faceLandmarker;
export const initialize = async ({videoRef, setEmotion}) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;
      
      // Some browsers require explicitly calling play
      videoRef.current.play().catch(e => console.error("Play failed:", e));

      await new Promise((resolve) => {
        if (videoRef.current.readyState >= 2) {
            resolve();
        } else {
            videoRef.current.addEventListener('loadeddata', resolve, { once: true });
        }
      });

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
      );

      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
        },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFaceBlendshapes: true,
      });
      setEmotion("Ready to detect");
    } catch (err) {
      console.error(err);
      if (err.name === 'NotAllowedError') {
        setEmotion("Camera permission denied. Please allow camera access.");
      } else {
        setEmotion("Error loading model");
      }
    }
  };

export const detect = ({videoRef, setEmotion}) => {
    if (!faceLandmarker || !videoRef.current) {
      return null;
    }

    const results = faceLandmarker.detectForVideo(
      videoRef.current,
      performance.now(),
    );

    if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
      const shapes = results.faceBlendshapes[0].categories;

      const smileLeft =
        shapes.find((s) => s.categoryName === "mouthSmileLeft")?.score || 0;

      const smileRight =
        shapes.find((s) => s.categoryName === "mouthSmileRight")?.score || 0;

      const frownLeft =
        shapes.find((s) => s.categoryName === "mouthFrownLeft")?.score || 0;

      const frownRight =
        shapes.find((s) => s.categoryName === "mouthFrownRight")?.score || 0;

      const jawOpen =
        shapes.find((s) => s.categoryName === "jawOpen")?.score || 0;

      const browUp =
        shapes.find((s) => s.categoryName === "browInnerUp")?.score || 0;

      if (smileLeft > 0.2 || smileRight > 0.2) {
        setEmotion("😊 Happy");
        return "happy";
      } else if (frownLeft > 0.005 || frownRight > 0.005) {
        setEmotion("😔 Sad");
        return "sad";
      } else if (jawOpen > 0.1 && browUp > 0.1) {
        setEmotion("😲 Surprised");
        return "surprised";
      } else {
        setEmotion("😐 Neutral");
        return "neutral";
      }
    }
    return null;
  };