import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

const socket = io("http://localhost:5000");

export default function Whiteboard() {
  const { roomId } = useParams();

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const videoRef = useRef(null);

  const [mode, setMode] = useState("DRAW");

  // smoothing
  const lastPoint = useRef({ x: null, y: null });

  useEffect(() => {
    socket.emit("join-room", roomId);

    const canvas = canvasRef.current;
    canvas.width = 900;
    canvas.height = 500;

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctxRef.current = ctx;

    socket.on("draw", (data) => drawFromSocket(data));
    socket.on("clear-board", clearBoard);

    return () => {
      socket.off("draw");
      socket.off("clear-board");
    };
  }, []);

  // ✅ MediaPipe setup
  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();
  }, []);

  // ✅ Determine finger up/down (very accurate)
  function fingersUp(lm) {
    const tips = [4, 8, 12, 16, 20];
    const pip = [3, 6, 10, 14, 18];

    // Thumb is sideways so treat differently
    const thumbUp = lm[tips[0]].x > lm[pip[0]].x;

    const indexUp = lm[tips[1]].y < lm[pip[1]].y;
    const middleUp = lm[tips[2]].y < lm[pip[2]].y;
    const ringUp = lm[tips[3]].y < lm[pip[3]].y;
    const pinkyUp = lm[tips[4]].y < lm[pip[4]].y;

    return { thumbUp, indexUp, middleUp, ringUp, pinkyUp };
  }

  // ✅ Gesture handler
  function onResults(results) {
    if (!results.multiHandLandmarks?.length) {
      lastPoint.current = { x: null, y: null };
      return;
    }

    const lm = results.multiHandLandmarks[0];
    const { indexUp, middleUp, ringUp, pinkyUp } = fingersUp(lm);

    // index finger tip
    let x = lm[8].x * 900;
    let y = lm[8].y * 500;

    // ✅ Smooth movement (reduce shake)
    const smoothFactor = 0.3;
    if (lastPoint.current.x !== null) {
      x = lastPoint.current.x + (x - lastPoint.current.x) * smoothFactor;
      y = lastPoint.current.y + (y - lastPoint.current.y) * smoothFactor;
    }

    // ✋ Clear board (all fingers up)
    if (indexUp && middleUp && ringUp && pinkyUp) {
      clearBoard();
      socket.emit("clear-board", roomId);
      lastPoint.current = { x: null, y: null };
      return;
    }

    // ✌ Erase (index + middle up only)
    if (indexUp && middleUp && !ringUp && !pinkyUp) {
      setMode("ERASE");
      drawLine(x, y, "white", 25);
      socket.emit("draw", { roomId, data: { x, y, mode: "ERASE" } });
      lastPoint.current = { x, y };
      return;
    }

    // ☝ Draw (only index up)
    if (indexUp && !middleUp && !ringUp && !pinkyUp) {
      setMode("DRAW");
      drawLine(x, y, "black", 4);
      socket.emit("draw", { roomId, data: { x, y, mode: "DRAW" } });
      lastPoint.current = { x, y };
      return;
    }

    // ✊ Stop drawing (fist)
    lastPoint.current = { x: null, y: null };
  }

  function drawFromSocket({ x, y, mode }) {
    if (mode === "ERASE") drawLine(x, y, "white", 25);
    else drawLine(x, y, "black", 4);
  }

  function drawLine(x, y, color, width) {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    if (lastPoint.current.x === null || lastPoint.current.y === null) {
      lastPoint.current = { x, y };
      return;
    }

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function clearBoard() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-3 text-center">
        Room: <span className="text-blue-600">{roomId}</span>
      </h2>

      <p className="text-center mb-4 text-gray-700">
        Mode:{" "}
        <span className="font-bold">
          {mode === "DRAW" ? "✍ Draw" : "🧽 Erase"}
        </span>
      </p>

      <div className="flex justify-center gap-4">
        <video
          ref={videoRef}
          className="w-64 h-48 border rounded shadow"
          autoPlay
          playsInline
        />

        <canvas ref={canvasRef} className="border bg-white rounded shadow" />
      </div>

      <p className="text-center mt-4 text-sm text-gray-600">
        ☝ Draw (Index Up) | ✌ Erase (Index+Middle) | ✋ Clear (All fingers up) |
        ✊ Stop (Fist)
      </p>
    </div>
  );
}
