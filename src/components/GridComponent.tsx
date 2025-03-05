import React, { useRef, useEffect, useState } from "react";
import TokenTooltip from "./TokenTooltip"; // Asegúrate de importar el componente TokenTooltip

interface GridComponentProps {
  gridType: "square" | "octagonal";
  backgroundImage: string | null;
  tokens: Array<{
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
  }>;
  drawingData: Array<{ type: string; points: number[]; color: string }>;
  selectedTool: "move" | "draw" | "erase" | "fill" | "square";
  selectedColor: string;
  onDrawing: (drawingData: {
    type: string;
    points: number[];
    color: string;
  }) => void;
  onTokenMove: (id: string, x: number, y: number) => void;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  draggedToken: string | null;
  setDraggedToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const getContrastColor = (hexcolor: string): string => {
  // Convertir el color hex a RGB
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);

  // Calcular el brillo usando la fórmula YIQ
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Retornar blanco o negro según el contraste
  return yiq >= 128 ? "#000000" : "#FFFFFF";
};

const GridComponent: React.FC<GridComponentProps> = ({
  gridType,
  backgroundImage,
  tokens,
  drawingData,
  selectedTool,
  selectedColor,
  onDrawing,
  onTokenMove,
  isDragging,
  setIsDragging,
  draggedToken,
  setDraggedToken,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [squareStart, setSquareStart] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const GRID_SIZE = 20;
  const CELL_SIZE = 50;
  const GRID_WIDTH = GRID_SIZE * CELL_SIZE;
  const GRID_HEIGHT = GRID_SIZE * CELL_SIZE;

  // Draw the canvas elements (lines, shapes, etc.)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all saved paths
    drawingData.forEach((item) => {
      if (item.type === "line") {
        drawLine(ctx, item.points, item.color);
      } else if (item.type === "square") {
        drawSquare(ctx, item.points, item.color);
      } else if (item.type === "fill") {
        const x = item.points[0];
        const y = item.points[1];
        fillCell(ctx, x, y, item.color);
      }
    });

    // Draw current path if drawing
    if (isDrawing && currentPath.length >= 2) {
      if (selectedTool === "draw") {
        drawLine(ctx, currentPath, selectedColor);
      } else if (selectedTool === "square" && squareStart) {
        const lastX = currentPath[currentPath.length - 2];
        const lastY = currentPath[currentPath.length - 1];
        const points = [squareStart.x, squareStart.y, lastX, lastY];
        drawSquare(ctx, points, selectedColor);
      }
    }
  }, [
    drawingData,
    isDrawing,
    currentPath,
    selectedTool,
    selectedColor,
    squareStart,
  ]);

  const drawLine = (
    ctx: CanvasRenderingContext2D,
    points: number[],
    color: string
  ) => {
    if (points.length < 4) return;

    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);

    for (let i = 2; i < points.length; i += 2) {
      ctx.lineTo(points[i], points[i + 1]);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const [hoveredToken, setHoveredToken] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterToken = (tokenId: string, x: number, y: number) => {
    // Limpiar el timeout anterior si existe
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Establecer un nuevo timeout para mostrar el tooltip después de 0.3 segundos
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredToken({ id: tokenId, x, y });
      setShowTooltip(true);
    }, 300); // 0.3 segundos de retraso
  };

  const handleMouseLeaveToken = () => {
    // Limpiar el timeout si el mouse sale del token antes de que se muestre el tooltip
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Esperar un pequeño retraso antes de ocultar el tooltip
    setTimeout(() => {
      setHoveredToken(null);
      setShowTooltip(false);
    }, 100); // 0.1 segundos de retraso para ocultar el tooltip
  };

  const drawSquare = (
    ctx: CanvasRenderingContext2D,
    points: number[],
    color: string
  ) => {
    if (points.length < 4) return;

    const startX = points[0];
    const startY = points[1];
    const endX = points[2];
    const endY = points[3];

    ctx.beginPath();
    ctx.rect(startX, startY, endX - startX, endY - startY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const fillCell = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string
  ) => {
    const cellX = Math.floor(x / CELL_SIZE) * CELL_SIZE;
    const cellY = Math.floor(y / CELL_SIZE) * CELL_SIZE;

    ctx.fillStyle = color;
    ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === "move") {
      // Check if clicking on a token
      const clickedToken = tokens.find((token) => {
        const tokenX = token.x * CELL_SIZE + CELL_SIZE / 2;
        const tokenY = token.y * CELL_SIZE + CELL_SIZE / 2;
        const distance = Math.sqrt(
          Math.pow(tokenX - x, 2) + Math.pow(tokenY - y, 2)
        );
        return distance < CELL_SIZE / 2;
      });

      if (clickedToken) {
        setIsDragging(true);
        setDraggedToken(clickedToken.id);
      }
    } else {
      setIsDrawing(true);

      if (selectedTool === "square") {
        setSquareStart({ x, y });
      }

      setCurrentPath([x, y]);

      if (selectedTool === "fill") {
        onDrawing({
          type: "fill",
          points: [x, y],
          color: selectedColor,
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging && draggedToken) {
      // Move token
      const gridX = Math.floor(x / CELL_SIZE);
      const gridY = Math.floor(y / CELL_SIZE);

      // Ensure token stays within grid bounds
      const boundedX = Math.max(0, Math.min(gridX, GRID_SIZE - 1));
      const boundedY = Math.max(0, Math.min(gridY, GRID_SIZE - 1));

      onTokenMove(draggedToken, boundedX, boundedY);
    } else if (isDrawing) {
      // Drawing
      if (
        selectedTool === "draw" ||
        selectedTool === "erase" ||
        selectedTool === "square"
      ) {
        setCurrentPath([...currentPath, x, y]);
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedToken(null);
    }

    if (isDrawing) {
      setIsDrawing(false);

      if (selectedTool === "draw" && currentPath.length >= 4) {
        onDrawing({
          type: "line",
          points: currentPath,
          color: selectedTool === "erase" ? "rgba(0,0,0,0)" : selectedColor,
        });
      } else if (
        selectedTool === "square" &&
        squareStart &&
        currentPath.length >= 2
      ) {
        const lastX = currentPath[currentPath.length - 2];
        const lastY = currentPath[currentPath.length - 1];

        onDrawing({
          type: "square",
          points: [squareStart.x, squareStart.y, lastX, lastY],
          color: selectedColor,
        });

        setSquareStart(null);
      }

      setCurrentPath([]);
    }
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
    setCurrentPath([]);
    setSquareStart(null);
  };

  // Render grid cells
  const renderGrid = () => {
    const cells = [];

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cellStyle: React.CSSProperties = {
          width: `${CELL_SIZE}px`,
          height: `${CELL_SIZE}px`,
          position: "absolute",
          left: `${x * CELL_SIZE}px`,
          top: `${y * CELL_SIZE}px`,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          pointerEvents: "none",
        };

        if (gridType === "octagonal") {
          cellStyle.clipPath =
            "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)";
        }

        cells.push(
          <div key={`cell-${x}-${y}`} className="grid-cell" style={cellStyle} />
        );
      }
    }

    return cells;
  };

  // Render tokens
  const renderTokens = () => {
    return tokens.map((token) => {
      const isBoss = token.type === "boss";
      const tokenSize = isBoss ? CELL_SIZE * 2 : CELL_SIZE;
      const tokenColor =
        token.color ||
        (token.type === "ally"
          ? "#3498db"
          : token.type === "enemy"
          ? "#e74c3c"
          : "#f1c40f");
      const contrastColor = getContrastColor(tokenColor);

      const tokenStyle: React.CSSProperties = {
        width: `${tokenSize}px`,
        height: `${tokenSize}px`,
        borderRadius: isBoss ? "10%" : "50%",
        backgroundColor: tokenColor,
        position: "absolute",
        left: `${token.x * CELL_SIZE}px`,
        top: `${token.y * CELL_SIZE}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: contrastColor,
        fontWeight: "bold",
        fontSize: "12px",
        border: `2px solid ${contrastColor}`,
        boxShadow: `0 0 10px rgba(0, 0, 0, 0.3)`,
        zIndex: 10,
        cursor: selectedTool === "move" ? "grab" : "default",
        pointerEvents: selectedTool === "move" ? "auto" : "none",
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
      };

      if (isDragging && token.id === draggedToken) {
        tokenStyle.cursor = "grabbing";
        tokenStyle.transform = "scale(1.1)";
        tokenStyle.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
      }

      return (
        <div
          key={token.id}
          className="token"
          data-type={token.type}
          style={tokenStyle}
          onMouseEnter={() =>
            handleMouseEnterToken(
              token.id,
              token.x * CELL_SIZE,
              token.y * CELL_SIZE
            )
          }
          onMouseLeave={handleMouseLeaveToken}
        >
          {token.name
            ? token.name.charAt(0).toUpperCase()
            : token.type === "ally"
            ? "A"
            : token.type === "enemy"
            ? "E"
            : "B"}
        </div>
      );
    });
  };

  return (
    <div
      ref={gridRef}
      style={{
        width: `${GRID_WIDTH}px`,
        height: `${GRID_HEIGHT}px`,
        position: "relative",
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        margin: "0 auto",
        cursor: selectedTool === "move" ? "default" : "crosshair",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background layer */}
      {!backgroundImage && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#2d3748",
            position: "absolute",
          }}
        />
      )}

      {/* Grid layer */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 1,
        }}
      >
        {renderGrid()}
      </div>

      {/* Drawing canvas */}
      <canvas
        ref={canvasRef}
        width={GRID_WIDTH}
        height={GRID_HEIGHT}
        style={{
          position: "absolute",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Tokens layer */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 3,
        }}
      >
        {renderTokens()}
      </div>

      {/* Tooltip */}
      {showTooltip && hoveredToken && (
        <div
          style={{
            position: "absolute",
            left: `${hoveredToken.x + 20}px`, // Ajustar la posición del tooltip
            top: `${hoveredToken.y + 20}px`,
            zIndex: 20,
            pointerEvents: "none", // Evitar que el tooltip interfiera con los eventos del mouse
          }}
        >
          <TokenTooltip
            token={tokens.find((token) => token.id === hoveredToken.id)!}
          />
        </div>
      )}
    </div>
  );
};

export default GridComponent;
