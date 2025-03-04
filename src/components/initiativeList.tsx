import React from "react";

interface InitiativeListProps {
  tokens: Array<{
    id: string;
    name?: string;
    initiative?: number;
    color: string; // Añadir el color del token
  }>;
}

const InitiativeList: React.FC<InitiativeListProps> = ({ tokens }) => {
  // Ordenar los tokens por iniciativa (de mayor a menor)
  const sortedTokens = [...tokens].sort(
    (a, b) => (b.initiative || 0) - (a.initiative || 0)
  );

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4">
        Initiative Order
      </h2>
      <ul>
        {sortedTokens.map((token) => (
          <li key={token.id} className="flex justify-between items-center mb-2">
            {/* Mostrar el color del token junto con el nombre */}
            <div
              className="px-3 rounded-full flex items-center gap-2"
              style={{ backgroundColor: token.color }}
            >
              <span>{token.name || `Token ${token.id}`}</span>
            </div>
            <span>{token.initiative || "N/A"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InitiativeList;
