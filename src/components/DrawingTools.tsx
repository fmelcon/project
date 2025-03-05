import React from "react";
import { Pencil, PaintBucket, Square, Move, Trash2 } from "lucide-react";

interface DrawingToolsProps {
  selectedTool: "move" | "draw" | "fill" | "square";
  setSelectedTool: React.Dispatch<
    React.SetStateAction<"move" | "draw" | "fill" | "square">
  >;
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  clearDrawing: () => void;
}

const DrawingTools: React.FC<DrawingToolsProps> = ({
  selectedTool,
  setSelectedTool,
  selectedColor,
  setSelectedColor,
  clearDrawing,
}) => {
  const colors = [
    "#e74c3c", // Red
    "#e67e22", // Orange
    "#f1c40f", // Yellow
    "#2ecc71", // Green
    "#3498db", // Blue
    "#9b59b6", // Purple
    "#1abc9c", // Teal
    "#ecf0f1", // White
    "#95a5a6", // Gray
    "#000000", // Black
  ];

  return (
    <div
      className="p-4 rounded-lg shadow-lg initiative-list"
      style={{ background: "linear-gradient(145deg, #1a1a1a, #2d2d2d)" }}
    >
      <h2 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4">
        Drawing Tools
      </h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`tool-button ${selectedTool === "move" ? "active" : ""}`}
          onClick={() => setSelectedTool("move")}
          title="Move Tokens"
        >
          <Move size={20} />
        </button>
        <button
          className={`tool-button ${selectedTool === "draw" ? "active" : ""}`}
          onClick={() => setSelectedTool("draw")}
          title="Draw Lines"
        >
          <Pencil size={20} />
        </button>
        <button
          className={`tool-button ${selectedTool === "fill" ? "active" : ""}`}
          onClick={() => setSelectedTool("fill")}
          title="Fill"
        >
          <PaintBucket size={20} />
        </button>
        <button
          className={`tool-button ${selectedTool === "square" ? "active" : ""}`}
          onClick={() => setSelectedTool("square")}
          title="Draw Square"
        >
          <Square size={20} />
        </button>
        <button
          className="tool-button"
          onClick={clearDrawing}
          title="Clear Drawing"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <div
              key={color}
              className={`color-option ${
                selectedColor === color ? "selected" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrawingTools;
