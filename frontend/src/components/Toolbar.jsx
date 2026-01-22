import React from "react";
import {
  Pencil,
  Eraser,
  Trash2,
  Save,
  Undo2,
  Redo2,
  Moon,
  Sun
} from "lucide-react";

export default function Toolbar({
  mode,
  setMode,
  color,
  setColor,
  brushSize,
  setBrushSize,
  eraserSize,
  setEraserSize,
  undo,
  redo,
  clearBoard,
  saveBoard,
  darkMode,
  setDarkMode
}) {
  const colors = ["black", "red", "blue", "green", "orange", "purple"];

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-3 flex flex-wrap items-center justify-center gap-3">
      {/* Draw / Erase */}
      <button
        onClick={() => setMode("DRAW")}
        className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
          mode === "DRAW" ? "bg-black text-white" : "bg-gray-200"
        }`}
      >
        <Pencil size={18} /> Draw
      </button>

      <button
        onClick={() => setMode("ERASE")}
        className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
          mode === "ERASE" ? "bg-black text-white" : "bg-gray-200"
        }`}
      >
        <Eraser size={18} /> Erase
      </button>

      {/* Colors */}
      <div className="flex gap-2 items-center">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-7 h-7 rounded-full border-2 ${
              color === c ? "border-black scale-110" : "border-gray-300"
            }`}
            style={{ background: c }}
          />
        ))}

        {/* Custom color picker */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-8"
        />
      </div>

      {/* Brush Size */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-600">Brush</span>
        <input
          type="range"
          min="2"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />
      </div>

      {/* Eraser Size */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-600">Eraser</span>
        <input
          type="range"
          min="10"
          max="60"
          value={eraserSize}
          onChange={(e) => setEraserSize(Number(e.target.value))}
        />
      </div>

      {/* Undo / Redo */}
      <button onClick={undo} className="bg-gray-200 px-3 py-2 rounded-lg">
        <Undo2 size={18} />
      </button>

      <button onClick={redo} className="bg-gray-200 px-3 py-2 rounded-lg">
        <Redo2 size={18} />
      </button>

      {/* Clear / Save */}
      <button
        onClick={clearBoard}
        className="bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2"
      >
        <Trash2 size={18} /> Clear
      </button>

      <button
        onClick={saveBoard}
        className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-2"
      >
        <Save size={18} /> Save
      </button>

      {/* Dark mode */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-gray-200 px-3 py-2 rounded-lg"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}

