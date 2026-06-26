import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let faceLandmarker;
export const initialize = async ({videoRef, setEmotion}) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;

      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = resolve;
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
    } catch (err) {
      console.error(err);
      setEmotion("Error loading model");
    }
  };

export const detect = ({videoRef, setEmotion}) => {
    if (!faceLandmarker || !videoRef.current) {
      return;
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

      if (smileLeft > 0.5 && smileRight > 0.5) {
        setEmotion("😊 Happy");
      } else if (frownLeft > 0.004 && frownRight > 0.004) {
        setEmotion("😔 Sad");
      } else if (jawOpen > 0.2 && browUp > 0.3) {
        setEmotion("😲 Surprised");
      } else {
        setEmotion("😐 Neutral");
      }
    }
  };