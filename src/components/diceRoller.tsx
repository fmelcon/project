import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import diceSound from "../dice-sound.mp3"; // Importa el archivo de sonido

const DiceRoller: React.FC<{ onRoll: (sides: number) => void }> = ({
  onRoll,
}) => {
  const playSound = () => {
    const audio = new Audio(diceSound); // Crea un nuevo objeto de audio
    audio.play(); // Reproduce el sonido
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold border-b border-gray-700 pb-2 mb-4 text-center ">
        Dice Roller
      </h2>
      <div className="grid grid-cols-3 gap-2">
        <button
          className="dice-button bg-green-500 font-bold"
          onClick={() => {
            playSound(); // Reproduce el sonido al presionar el botón
            onRoll(4);
          }}
        >
          D4
        </button>
        <button
          className="dice-button bg-red-500 font-bold"
          onClick={() => {
            playSound();
            onRoll(6);
          }}
        >
          D6
        </button>
        <button
          className="dice-button bg-black font-bold"
          onClick={() => {
            playSound();
            onRoll(8);
          }}
        >
          D8
        </button>
        <button
          className="dice-button bg-orange-600 font-bold"
          onClick={() => {
            playSound();
            onRoll(10);
          }}
        >
          D10
        </button>
        <button
          className="dice-button bg-amber-400 font-bold"
          onClick={() => {
            playSound();
            onRoll(12);
          }}
        >
          D12
        </button>
        <button
          className="dice-button bg-sky-900 font-bold"
          onClick={() => {
            playSound();
            onRoll(20);
          }}
        >
          D20
        </button>
      </div>
    </div>
  );
};

const DiceScene: React.FC<{
  sides: number;
  onAnimationEnd: (result: number) => void;
  onComplete: () => void;
}> = ({ sides, onAnimationEnd, onComplete }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const diceRef = useRef<THREE.Mesh | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [animationEnded, setAnimationEnded] = useState(false);
  const [showDice, setShowDice] = useState(true); // Controlar la visibilidad del dado

  useEffect(() => {
    if (!sceneRef.current) return;

    // Configuración de la escena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);

    // Crear el dado según el número de caras
    let geometry;
    switch (sides) {
      case 4:
        geometry = new THREE.TetrahedronGeometry(1); // D4 (Tetraedro)
        break;
      case 6:
        geometry = new THREE.BoxGeometry(1, 1, 1); // D6 (Cubo)
        break;
      case 8:
        geometry = new THREE.OctahedronGeometry(1); // D8 (Octaedro)
        break;
      case 10:
        geometry = new THREE.DodecahedronGeometry(1); // D10 (Dodecaedro)
        break;
      case 12:
        geometry = new THREE.DodecahedronGeometry(1); // D12 (Icosaedro)
        break;
      case 20:
        geometry = new THREE.IcosahedronGeometry(1); // D20 (Icosaedro)
        break;
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1); // Por defecto, un cubo
    }

    // Material con degradado
    const material = new THREE.MeshStandardMaterial({
      color: 0x21ff00,
      roughness: 0.3,
      metalness: 0.7,
    });

    const dice = new THREE.Mesh(geometry, material);
    scene.add(dice);
    diceRef.current = dice;

    // Configurar la cámara
    camera.position.z = 6;
    camera.position.y = 1;
    camera.lookAt(0, 0, 0);

    // Agregar luces
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 1).normalize();
    scene.add(light1);

    const light2 = new THREE.AmbientLight(0x404040); // Luz ambiental
    scene.add(light2);

    const light3 = new THREE.PointLight(0xffffff, 1, 10);
    light3.position.set(0, 3, 3);
    scene.add(light3);

    // Animación del dado
    const startTime = Date.now();
    const animationDuration = 1500; // 1.5 segundos de animación
    const resultDisplayDuration = 1000; // Mostrar resultado durante 1 segundo
    const rotations = 1.5; // Número de vueltas completas (reducción para que no sea demasiado)

    const animate = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < animationDuration) {
        // Calcular la rotación basada en el tiempo transcurrido
        const progress = elapsedTime / animationDuration;
        const angle = progress * Math.PI * 2 * rotations; // 2 vueltas completas

        if (diceRef.current) {
          diceRef.current.rotation.x = angle;
          diceRef.current.rotation.y = angle;
          diceRef.current.rotation.z = angle;
        }

        requestAnimationFrame(animate);
      } else {
        // Detener la rotación y mostrar el resultado
        const result = Math.floor(Math.random() * sides) + 1;
        setResult(result); // Solo se actualiza una vez al terminar la animación
        setAnimationEnded(true); // Marcar que la animación terminó

        // Mostrar el resultado durante 1 segundo
        setTimeout(() => {
          setShowDice(false); // Ocultar el dado después de 1 segundo
          onAnimationEnd(result); // Pasar el resultado final al padre
          onComplete(); // Llamar a la función de "completar"
        }, resultDisplayDuration);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Limpieza
    return () => {
      sceneRef.current?.removeChild(renderer.domElement);
    };
  }, [sides, onAnimationEnd, onComplete]);

  return (
    <div
      ref={sceneRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0)", // Fondo transparente
        zIndex: 1000,
      }}
    >
      {showDice && !animationEnded && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold">
          Rolling...
        </div>
      )}
      {animationEnded && result !== null && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold">
          Result: {result}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [showScene, setShowScene] = useState(false);
  const [diceType, setDiceType] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const handleRoll = (sides: number) => {
    setDiceType(sides);
    setShowScene(true);
  };

  const handleAnimationEnd = (result: number) => {
    setResult(result); // Solo se actualiza una vez después de la animación
  };

  const handleComplete = () => {
    setShowScene(false); // Ocultar la escena cuando termine la animación
  };

  return (
    <div className="bg-gray-900 text-white flex flex-col justify-center">
      <DiceRoller onRoll={handleRoll} />
      {showScene && diceType && (
        <DiceScene
          sides={diceType}
          onAnimationEnd={handleAnimationEnd}
          onComplete={handleComplete}
        />
      )}
      {result !== null && !showScene && (
        <div className="mt-4 text-2xl text-white text-center bg-gray-700 px-4 rounded-lg m-auto">
          Last roll result: {result}
        </div>
      )}
    </div>
  );
};

export default App;
