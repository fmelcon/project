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
  addToken: (type: "ally" | "enemy" | "boss", tokenData: unknown) => void;
  removeToken: (id: string) => void;
  resetGrid: () => void;
  saveGame: () => void;
  loadGame: () => void;
  updateToken: (id: string, newData: unknown) => void; // Nueva función para actualizar los datos del token
  tokens: Array<{
    id: string;
    type: "ally" | "enemy" | "boss";
    x: number;
    y: number;
    color: string;
    name?: string;
    initiative?: number;
    ac?: number;
    hp?: number;
    damage?: number;
  }>;
}

const TokenPanel: React.FC<TokenPanelProps> = ({
  addToken,
  removeToken,
  resetGrid,
  saveGame,
  loadGame,
  updateToken,
  tokens,
}) => {
  const [editingTokenId, setEditingTokenId] = useState<string | null>(null);
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenInitiative, setTokenInitiative] = useState<number | undefined>(
    undefined
  );
  const [tokenAC, setTokenAC] = useState<number | undefined>(undefined);
  const [tokenHP, setTokenHP] = useState<number | undefined>(undefined);
  const [tokenDamage, setTokenDamage] = useState<number | undefined>(undefined);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  const handleEditToken = (tokenId: string, tokenData: any) => {
    setEditingTokenId(tokenId);
    setTokenName(tokenData.name || "");
    setTokenInitiative(tokenData.initiative || undefined);
    setTokenAC(tokenData.ac || undefined);
    setTokenHP(tokenData.hp || undefined);
    setTokenDamage(tokenData.damage || undefined);
  };

  const handleSaveToken = (tokenId: string) => {
    updateToken(tokenId, {
      name: tokenName,
      initiative: tokenInitiative,
      ac: tokenAC,
      hp: tokenHP,
      damage: tokenDamage,
    });
    setEditingTokenId(null);
    setTokenName("");
    setTokenInitiative(undefined);
    setTokenAC(undefined);
    setTokenHP(undefined);
    setTokenDamage(undefined);
  };

  const handleColorChange = (tokenId: string, color: string) => {
    updateToken(tokenId, { color });
    setShowColorPicker(null);
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
    <div className="w-full bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col gap-4">
      <h2 className="text-xl font-bold border-b border-gray-700 pb-2">
        Token Management
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <button
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded flex items-center justify-center gap-1"
          onClick={() => addToken("ally", {})}
        >
          <Plus size={16} /> Add Ally
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 p-2 rounded flex items-center justify-center gap-1"
          onClick={() => addToken("enemy", {})}
        >
          <Plus size={16} /> Add Enemy
        </button>
        <button
          className="bg-yellow-600 hover:bg-yellow-700 p-2 rounded flex items-center justify-center gap-1 col-span-2"
          onClick={() => addToken("boss", {})}
        >
          <Plus size={16} /> Add Large Boss
        </button>
        <p className="warning-message col-span-2">
          Remember to take the boss token from the top-left side to move it.
        </p>
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
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          value={tokenName}
                          onChange={(e) => setTokenName(e.target.value)}
                          className="bg-gray-700 text-white p-1 rounded"
                          placeholder="Name"
                        />
                        <input
                          type="number"
                          value={tokenInitiative || ""}
                          onChange={(e) =>
                            setTokenInitiative(Number(e.target.value))
                          }
                          className="bg-gray-700 text-white p-1 rounded"
                          placeholder="Initiative"
                        />
                        <input
                          type="number"
                          value={tokenAC || ""}
                          onChange={(e) => setTokenAC(Number(e.target.value))}
                          className="bg-gray-700 text-white p-1 rounded"
                          placeholder="AC"
                        />
                        <input
                          type="number"
                          value={tokenHP || ""}
                          onChange={(e) => setTokenHP(Number(e.target.value))}
                          className="bg-gray-700 text-white p-1 rounded"
                          placeholder="HP"
                        />
                        <input
                          type="number"
                          value={tokenDamage || ""}
                          onChange={(e) =>
                            setTokenDamage(Number(e.target.value))
                          }
                          className="bg-gray-700 text-white p-1 rounded"
                          placeholder="Damage"
                        />
                      </div>
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
                        onClick={() => handleSaveToken(token.id)}
                      >
                        <Check size={16} />
                      </button>
                    ) : (
                      <button
                        className="text-blue-500 hover:text-blue-300"
                        onClick={() => handleEditToken(token.id, token)}
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

        {/* Botón de Cafecito */}
        <div className="p-2 rounded flex items-center justify-center gap-1">
          <a href="https://cafecito.app/fmelcon" rel="noopener" target="_blank">
            <img
              srcset="https://cdn.cafecito.app/imgs/buttons/button_1.png 1x, https://cdn.cafecito.app/imgs/buttons/button_1_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_1_3.75x.png 3.75x"
              src="https://cdn.cafecito.app/imgs/buttons/button_1.png"
              alt="Invitame un café en cafecito.app"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TokenPanel;
