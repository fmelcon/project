import React, { useState } from "react";

const DiceRoller: React.FC = () => {
  const [result, setResult] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);

  const rollDice = (sides: number, count: number = 1) => {
    setRolling(true);
    setTimeout(() => {
      let total = 0;
      for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * sides) + 1;
      }
      setResult(total);
      setRolling(false);
    }, 100);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4">
        Dice Roller
      </h2>
      <div className="grid grid-cols-3 gap-2">
        <button
          className="dice-button bg-green-500 font-bold"
          onClick={() => rollDice(4)}
          disabled={rolling}
        >
          D4
        </button>
        <button
          className="dice-button bg-red-500 font-bold"
          onClick={() => rollDice(6)}
          disabled={rolling}
        >
          D6
        </button>
        <button
          className="dice-button bg-black font-bold"
          onClick={() => rollDice(8)}
          disabled={rolling}
        >
          D8
        </button>
        <button
          className="dice-button bg-orange-600 font-bold"
          onClick={() => rollDice(10)}
          disabled={rolling}
        >
          D10
        </button>
        <button
          className="dice-button bg-amber-400 font-bold"
          onClick={() => rollDice(12)}
          disabled={rolling}
        >
          D12
        </button>
        <button
          className="dice-button bg-sky-900 font-bold"
          onClick={() => rollDice(20)}
          disabled={rolling}
        >
          D20
        </button>
        <button
          className="dice-button bg-emerald-900 font-bold"
          onClick={() => rollDice(100)}
          disabled={rolling}
        >
          D100
        </button>
      </div>
      {result !== null && (
        <div className="mt-4 text-center bg-slate-500 rounded-2xl m-auto w-[10rem]">
          <p className="text-lg font-bold">Result: {result}</p>
        </div>
      )}
    </div>
  );
};

export default DiceRoller;
