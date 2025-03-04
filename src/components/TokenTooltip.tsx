import React from "react";

interface TokenTooltipProps {
  token: {
    id: string;
    name?: string;
    initiative?: number;
    ac?: number;
    hp?: number;
    damage?: number;
    type: "ally" | "enemy" | "boss";
    x: number;
    y: number;
    color: string;
  };
}

const TokenTooltip: React.FC<TokenTooltipProps> = ({ token }) => {
  return (
    <div className="token-tooltip">
      <div className="font-bold">{token.name || `Token ${token.id}`}</div>
      <div>Initiative: {token.initiative || "N/A"}</div>
      <div>AC: {token.ac || "N/A"}</div>
      <div>HP: {token.hp || "N/A"}</div>
      <div>Damage: {token.damage || "N/A"}</div>
    </div>
  );
};

export default TokenTooltip;
