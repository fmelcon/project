import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Minus,
  Move,
  Trash2,
  Save,
  Upload,
  RefreshCw,
  Square,
  Pencil,
  Eraser,
  PaintBucket,
} from "lucide-react";
import GridComponent from "./components/GridComponent";
import TokenPanel from "./components/TokenPanel";
import DrawingTools from "./components/DrawingTools";
import ApiSection from "./components/ApiSection";
import InitiativeList from "./components/InitiativeList"; // Importar el nuevo componente
import DiceRoller from "./components/DiceRoller"; // Importar el nuevo componente
import "./App.css";

function App() {
  const [gridType, setGridType] = useState<"square" | "octagonal">("square");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [tokens, setTokens] = useState<
    Array<{
      id: string;
      type: "ally" | "enemy";
      x: number;
      y: number;
      color: string;
    }>
  >([]);
  const [selectedTool, setSelectedTool] = useState<
    "move" | "draw" | "erase" | "fill" | "square"
  >("move");
  const [selectedColor, setSelectedColor] = useState<string>("#ff0000");
  const [drawingData, setDrawingData] = useState<
    Array<{ type: string; points: number[]; color: string }>
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedToken, setDraggedToken] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearDrawing = () => {
    setDrawingData([]);
  };

  const addToken = (type: "ally" | "enemy" | "boss", tokenData: any) => {
    const newToken = {
      id: `token-${Date.now()}`,
      type,
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
      color:
        type === "ally" ? "#3498db" : type === "enemy" ? "#e74c3c" : "#f1c40f",
      name: tokenData.name || "",
      initiative: tokenData.initiative || undefined,
      ac: tokenData.ac || undefined,
      hp: tokenData.hp || undefined,
      damage: tokenData.damage || undefined,
    };
    setTokens([...tokens, newToken]);
  };

  const updateTokenName = (id: string, newName: string) => {
    setTokens(
      tokens.map((token) =>
        token.id === id ? { ...token, name: newName } : token
      )
    );
  };

  const moveToken = (id: string, x: number, y: number) => {
    setTokens(
      tokens.map((token) => (token.id === id ? { ...token, x, y } : token))
    );
  };

  const removeToken = (id: string) => {
    setTokens(tokens.filter((token) => token.id !== id));
  };

  const resetGrid = () => {
    setTokens([]);
    setDrawingData([]);
    setBackgroundImage(null);
  };

  const saveGame = () => {
    const gameData = {
      gridType,
      backgroundImage,
      tokens,
      drawingData,
    };

    localStorage.setItem("dndCombatGrid", JSON.stringify(gameData));
    alert("Game saved successfully!");
  };

  const loadGame = () => {
    const savedGame = localStorage.getItem("dndCombatGrid");
    if (savedGame) {
      const gameData = JSON.parse(savedGame);
      setGridType(gameData.gridType);
      setBackgroundImage(gameData.backgroundImage);
      setTokens(gameData.tokens);
      setDrawingData(gameData.drawingData);
    } else {
      alert("No saved game found!");
    }
  };

  const handleDrawing = (newDrawingData: {
    type: string;
    points: number[];
    color: string;
  }) => {
    setDrawingData([...drawingData, newDrawingData]);
  };

  const updateToken = (id: string, newData: any) => {
    setTokens(
      tokens.map((token) =>
        token.id === id ? { ...token, ...newData } : token
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header
        className="p-4 shadow-lg"
        style={{ background: "linear-gradient(145deg, #1a1a1a, #2d2d2d)" }}
      >
        <h1 className="text-2xl font-bold text-center">D&D Combat Grid</h1>
      </header>

      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4">
        {/* Columna izquierda: Lista de iniciativa y dados */}
        <div className="w-full md:w-1/4 flex flex-col gap-4">
          <InitiativeList tokens={tokens} />{" "}
          {/* Mostrar la lista de iniciativa */}
          <DiceRoller /> {/* Mostrar el lanzador de dados */}
          <TokenPanel
            addToken={addToken}
            removeToken={removeToken}
            resetGrid={resetGrid}
            saveGame={saveGame}
            loadGame={loadGame}
            updateToken={updateToken} // Nueva función para actualizar los datos del token
            tokens={tokens}
          />
        </div>

        {/* Columna central: Grilla y herramientas de dibujo */}
        <div className="flex flex-col gap-4 w-full">
          <div
            className="p-4 rounded-lg shadow-lg"
            style={{ background: "linear-gradient(145deg, #1a1a1a, #2d2d2d)" }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded ${
                    gridType === "square" ? "bg-purple-600" : "bg-gray-700"
                  }`}
                  onClick={() => setGridType("square")}
                >
                  Square Grid
                </button>
                <button
                  className={`px-3 py-1 rounded ${
                    gridType === "octagonal" ? "bg-purple-600" : "bg-gray-700"
                  }`}
                  onClick={() => setGridType("octagonal")}
                >
                  Octagonal Grid
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded flex items-center gap-1 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} /> Upload Map
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                />
              </div>
            </div>

            <div className="relative border-2 border-gray-600 rounded overflow-hidden">
              <GridComponent
                gridType={gridType}
                backgroundImage={backgroundImage}
                tokens={tokens}
                drawingData={drawingData}
                selectedTool={selectedTool}
                selectedColor={selectedColor}
                onDrawing={handleDrawing}
                onTokenMove={moveToken}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                draggedToken={draggedToken}
                setDraggedToken={setDraggedToken}
              />
            </div>
          </div>

          <DrawingTools
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            clearDrawing={clearDrawing}
          />
        </div>
      </main>

      <ApiSection />

      <footer
        className="p-4 text-center text-sm"
        style={{ background: "linear-gradient(145deg, #1a1a1a, #2d2d2d)" }}
      >
        D&D Combat Grid © 2025 - Powered by Franco Melcon
      </footer>
    </div>
  );
}

export default App;
