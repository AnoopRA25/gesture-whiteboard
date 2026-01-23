import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

import Toolbar from "../components/Toolbar";

const socket = io("http://localhost:5000");

export default function Whiteboard() {
  const { roomId } = useParams();

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const videoRef = useRef(null);

  const [mode, setMode] = useState("DRAW");
  const [color, setColor] = useState("black");
  const [brushSize, setBrushSize] = useState(4);
  const [eraserSize, setEraserSize] = useState(25);
  const [darkMode, setDarkMode] = useState(false);

  // Undo/Redo stacks
  const undoStack = useRef([]);
  const redoStack = useRef([]);

  const lastPoint = useRef({ x: null, y: null });

  const gestureBuffer = useRef([]);
const clearHoldStart = useRef(null);


  useEffect(() => {
    socket.emit("join-room", roomId);

    const canvas = canvasRef.current;
    canvas.width = 1000;
    canvas.height = 600;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;

    ctxRef.current = ctx;

    // initial background
    fillBackground();

    socket.on("draw", (data) => drawFromSocket(data));
    socket.on("clear-board", clearBoard);

    startVoiceCommands();

    return () => {
      socket.off("draw");
      socket.off("clear-board");
    };
  }, []);

  useEffect(() => {
    fillBackground();
  }, [darkMode]);

  // ✅ fill board background
  function fillBackground() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.fillStyle = darkMode ? "#111827" : "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // ✅ Save canvas state
  function saveState() {
    const canvas = canvasRef.current;
    undoStack.current.push(canvas.toDataURL());
    if (undoStack.current.length > 20) undoStack.current.shift();
    redoStack.current = [];
  }

  // ✅ Undo
  function undo() {
    if (undoStack.current.length === 0) return;
    const canvas = canvasRef.current;
    redoStack.current.push(canvas.toDataURL());

    const last = undoStack.current.pop();
    loadImage(last);
  }

  // ✅ Redo
  function redo() {
    if (redoStack.current.length === 0) return;
    const canvas = canvasRef.current;
    undoStack.current.push(canvas.toDataURL());

    const last = redoStack.current.pop();
    loadImage(last);
  }

  function loadImage(dataUrl) {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }

  // ✅ clear board
  function clearBoard() {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fillBackground();
  }

  function handleClear() {
    saveState();
    clearBoard();
    socket.emit("clear-board", roomId);
  }

  // ✅ save image
  function saveBoard() {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL();
    link.click();
  }

  // ✅ Accurate finger detection
  function fingersUp(lm) {
    const tips = [4, 8, 12, 16, 20];
    const pip = [3, 6, 10, 14, 18];

    const thumbUp = lm[tips[0]].x > lm[pip[0]].x;
    const indexUp = lm[tips[1]].y < lm[pip[1]].y;
    const middleUp = lm[tips[2]].y < lm[pip[2]].y;
    const ringUp = lm[tips[3]].y < lm[pip[3]].y;
    const pinkyUp = lm[tips[4]].y < lm[pip[4]].y;

    return { thumbUp, indexUp, middleUp, ringUp, pinkyUp };
  }

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
  }, [mode, color, brushSize, eraserSize]);


  function getStableGesture(g) {
  gestureBuffer.current.push(g);
  if (gestureBuffer.current.length > 6) gestureBuffer.current.shift();

  const count = gestureBuffer.current.filter((x) => x === g).length;
  return count >= 5 ? g : "NONE";
}

function getGestureType({ indexUp, middleUp, ringUp, pinkyUp }) {
  // ✋ clear
  if (indexUp && middleUp && ringUp && pinkyUp) return "CLEAR";

  // ✌ erase
  if (indexUp && middleUp && !ringUp && !pinkyUp) return "ERASE";

  // ☝ draw
  if (indexUp && !middleUp && !ringUp && !pinkyUp) return "DRAW";

  return "NONE";
}
 
  // ✅ gesture results
  function onResults(results) {
    if (!results.multiHandLandmarks?.length) {
      lastPoint.current = { x: null, y: null };
      return;
    }

    const lm = results.multiHandLandmarks[0];
    const { indexUp, middleUp, ringUp, pinkyUp } = fingersUp(lm);

    let x = (1 - lm[8].x) * 1000;  // ✅ mirror corrected
let y = lm[8].y * 600;


    // smooth
    const smoothFactor = 0.35;
    if (lastPoint.current.x !== null) {
      x = lastPoint.current.x + (x - lastPoint.current.x) * smoothFactor;
      y = lastPoint.current.y + (y - lastPoint.current.y) * smoothFactor;
    }

    const gestureNow = getGestureType({ indexUp, middleUp, ringUp, pinkyUp });
const stable = getStableGesture(gestureNow);

// ✅ CLEAR (hold palm for 0.8 sec to prevent accidental clear)
if (stable === "CLEAR") {
  if (!clearHoldStart.current) clearHoldStart.current = Date.now();

  if (Date.now() - clearHoldStart.current > 800) {
    handleClear();
    clearHoldStart.current = null;
    lastPoint.current = { x: null, y: null };
  }
  return;
}
clearHoldStart.current = null;

// ✅ ERASE
if (stable === "ERASE") {
  if (mode !== "ERASE") saveState();
  setMode("ERASE");

  drawLine(x, y, "ERASE");
  socket.emit("draw", { roomId, data: { x, y, mode: "ERASE" } });
  lastPoint.current = { x, y };
  return;
}

// ✅ DRAW
if (stable === "DRAW") {
  if (mode !== "DRAW") saveState();
  setMode("DRAW");

  drawLine(x, y, "DRAW");
  socket.emit("draw", {
    roomId,
    data: { x, y, mode: "DRAW", color, brushSize },
  });
  lastPoint.current = { x, y };
  return;
}


    // stop
    lastPoint.current = { x: null, y: null };
  }

  // ✅ draw from socket
  function drawFromSocket({ x, y, mode, color, brushSize }) {
    if (mode === "ERASE") drawLine(x, y, "ERASE");
    else drawLine(x, y, "DRAW", color, brushSize);
  }

  function drawLine(x, y, type, c = color, b = brushSize) {
    const ctx = ctxRef.current;
    if (!ctx) return;

    if (type === "ERASE") {
      ctx.strokeStyle = darkMode ? "#111827" : "white";
      ctx.lineWidth = eraserSize;
    } else {
      ctx.strokeStyle = c;
      ctx.lineWidth = b;
    }

    if (lastPoint.current.x === null || lastPoint.current.y === null) {
      lastPoint.current = { x, y };
      return;
    }

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPoint.current = { x, y };
  }

  // ✅ voice commands
  function startVoiceCommands() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const command =
        event.results[event.results.length - 1][0].transcript.trim().toLowerCase();

      if (command.includes("clear")) handleClear();
      if (command.includes("undo")) undo();
      if (command.includes("redo")) redo();
      if (command.includes("save")) saveBoard();

      if (command.includes("eraser")) setMode("ERASE");
      if (command.includes("draw")) setMode("DRAW");

      if (command.includes("red")) setColor("red");
      if (command.includes("blue")) setColor("blue");
      if (command.includes("green")) setColor("green");
      if (command.includes("black")) setColor("black");
    };

    recognition.start();
  }

  return (
    <div className={`p-4 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
      <h2 className="text-2xl font-bold mb-3 text-center">
        Room: <span className="text-blue-500">{roomId}</span>
      </h2>

      <div className="flex justify-center mb-4">
        <Toolbar
          mode={mode}
          setMode={setMode}
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          eraserSize={eraserSize}
          setEraserSize={setEraserSize}
          undo={undo}
          redo={redo}
          clearBoard={handleClear}
          saveBoard={saveBoard}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>

      <div className="flex justify-center gap-4">
        <video
  ref={videoRef}
  className="w-72 h-52 border rounded shadow transform scale-x-[-1]"
  autoPlay
  playsInline
/>


        <canvas
          ref={canvasRef}
          className="border rounded shadow"
        />
      </div>

      <p className="text-center mt-4 text-sm opacity-80">
        Gestures: ☝ Draw | ✌ Erase | ✋ Clear | ✊ Stop
      </p>
      <p className="text-center text-sm opacity-80">
        Voice: "clear" "undo" "redo" "save" "red" "blue" "green"
      </p>
    </div>
  );
}
