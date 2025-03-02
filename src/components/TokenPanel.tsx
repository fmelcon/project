import React, { useState } from "react";
import {
  Plus,
  Trash2,
  RefreshCw,
  Save,
  Upload,
  Edit,
  Check,
  Palette,
} from "lucide-react";

interface TokenPanelProps {
  addToken: (type: "ally" | "enemy" | "boss") => void;
  removeToken: (id: string) => void;
  resetGrid: () => void;
  saveGame: () => void;
  loadGame: () => void;
  updateTokenName: (id: string, newName: string) => void;
  updateTokenColor: (id: string, newColor: string) => void; // Nueva función para actualizar el color
  tokens: Array<{
    id: string;
    type: "ally" | "enemy" | "boss";
    x: number;
    y: number;
    color: string;
    name?: string;
  }>;
}

const TokenPanel: React.FC<TokenPanelProps> = ({
  addToken,
  removeToken,
  resetGrid,
  saveGame,
  loadGame,
  updateTokenName,
  updateTokenColor, // Nueva prop
  tokens,
}) => {
  const [editingTokenId, setEditingTokenId] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState<string>("");
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null); // Estado para mostrar el selector de color

  const handleEditName = (tokenId: string, currentName: string) => {
    setEditingTokenId(tokenId);
    setTokenName(currentName);
  };

  const handleSaveName = (tokenId: string) => {
    updateTokenName(tokenId, tokenName);
    setEditingTokenId(null);
    setTokenName("");
  };

  const handleColorChange = (tokenId: string, color: string) => {
    updateTokenColor(tokenId, color);
    setShowColorPicker(null); // Ocultar el selector de color después de elegir
  };

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
    <div className="w-full md:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col gap-4">
      <h2 className="text-xl font-bold border-b border-gray-700 pb-2">
        Token Management
      </h2>

      <div className="grid grid-cols-2 gap-2">
        <button
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded flex items-center justify-center gap-1"
          onClick={() => addToken("ally")}
        >
          <Plus size={16} /> Add Ally
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 p-2 rounded flex items-center justify-center gap-1"
          onClick={() => addToken("enemy")}
        >
          <Plus size={16} /> Add Enemy
        </button>
        <button
          className="bg-yellow-600 hover:bg-yellow-700 p-2 rounded flex items-center justify-center gap-1 col-span-2"
          onClick={() => addToken("boss")}
        >
          <Plus size={16} /> Add Boss
        </button>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Tokens on Grid</h3>
        <div className="max-h-40 overflow-y-auto bg-gray-900 rounded p-2">
          {tokens.length === 0 ? (
            <p className="text-gray-500 text-center py-2">No tokens on grid</p>
          ) : (
            <ul className="space-y-2">
              {tokens.map((token) => (
                <li
                  key={token.id}
                  className="flex justify-between items-center"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: token.color }}
                    />
                    {editingTokenId === token.id ? (
                      <input
                        type="text"
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                        className="bg-gray-700 text-white p-1 rounded"
                      />
                    ) : (
                      <span>
                        {token.name ||
                          `${
                            token.type === "ally"
                              ? "Ally"
                              : token.type === "enemy"
                              ? "Enemy"
                              : "Boss"
                          } at (${token.x},${token.y})`}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    {editingTokenId === token.id ? (
                      <button
                        className="text-green-500 hover:text-green-300"
                        onClick={() => handleSaveName(token.id)}
                      >
                        <Check size={16} />
                      </button>
                    ) : (
                      <button
                        className="text-blue-500 hover:text-blue-300"
                        onClick={() =>
                          handleEditName(token.id, token.name || "")
                        }
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    <button
                      className="text-purple-500 hover:text-purple-300"
                      onClick={() =>
                        setShowColorPicker(
                          showColorPicker === token.id ? null : token.id
                        )
                      }
                    >
                      <Palette size={16} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-300"
                      onClick={() => removeToken(token.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {showColorPicker === token.id && (
                    <div className="absolute mt-8 bg-gray-700 p-2 rounded-lg shadow-lg flex flex-wrap gap-1">
                      {colors.map((color) => (
                        <div
                          key={color}
                          className="w-6 h-6 rounded-full cursor-pointer"
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorChange(token.id, color)}
                        />
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button
          className="bg-purple-600 hover:bg-purple-700 p-2 rounded flex items-center justify-center gap-1"
          onClick={saveGame}
        >
          <Save size={16} /> Save Game
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 p-2 rounded flex items-center justify-center gap-1"
          onClick={loadGame}
        >
          <Upload size={16} /> Load Game
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-700 p-2 rounded flex items-center justify-center gap-1"
          onClick={resetGrid}
        >
          <RefreshCw size={16} /> Reset Grid
        </button>
      </div>
    </div>
  );
};

export default TokenPanel;
