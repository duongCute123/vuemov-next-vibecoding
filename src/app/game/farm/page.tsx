"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Position = { x: number; y: number };

type Crop = {
  id: string;
  name: string;
  emoji: string;
  growTime: number;
  sellPrice: number;
  buyPrice: number;
};

type Animal = {
  id: string;
  name: string;
  emoji: string;
  buyPrice: number;
  product: string;
  productPrice: number;
  collectTime: number;
};

type FarmEntity = {
  id: number;
  type: "plot" | "pen" | "house" | "tree" | "pond";
  x: number;
  y: number;
  width: number;
  height: number;
  cropId?: string;
  plantedAt?: number;
  ready?: boolean;
  animalId?: string;
  lastCollect?: number;
  animalReady?: boolean;
};

type MovingEntity = {
  id: string;
  emoji: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  direction: number;
};

const GRID_SIZE = 40;
const FARM_WIDTH = 20;
const FARM_HEIGHT = 15;

const crops: Crop[] = [
  { id: "lua", name: "Lúa", emoji: "🌾", growTime: 30, sellPrice: 10, buyPrice: 5 },
  { id: "cachua", name: "Cà chua", emoji: "🍅", growTime: 60, sellPrice: 25, buyPrice: 10 },
  { id: "carot", name: "Cà rốt", emoji: "🥕", growTime: 90, sellPrice: 40, buyPrice: 15 },
  { id: "kho", name: "Khoai", emoji: "🍠", growTime: 120, sellPrice: 60, buyPrice: 25 },
  { id: "nho", name: "Nho", emoji: "🍇", growTime: 180, sellPrice: 100, buyPrice: 40 },
  { id: "ke", name: "Khế", emoji: "⭐", growTime: 240, sellPrice: 150, buyPrice: 60 },
  { id: "tao", name: "Táo", emoji: "🍎", growTime: 300, sellPrice: 200, buyPrice: 80 },
];

const animalTypes: Animal[] = [
  { id: "ga", name: "Gà", emoji: "🐔", buyPrice: 50, product: "trung", productPrice: 15, collectTime: 60 },
  { id: "bo", name: "Bò", emoji: "🐄", buyPrice: 200, product: "sua", productPrice: 30, collectTime: 120 },
  { id: "heo", name: "Lợn", emoji: "🐷", buyPrice: 150, product: "thit", productPrice: 50, collectTime: 180 },
  { id: "cahieu", name: "Cá heo", emoji: "🐬", buyPrice: 500, product: "ngoc", productPrice: 100, collectTime: 300 },
  { id: "khoanglong", name: "Khủng long", emoji: "🦖", buyPrice: 1000, product: "trungvang", productPrice: 250, collectTime: 600 },
];

const initialEntities: FarmEntity[] = [
  { id: 1, type: "house", x: 2, y: 2, width: 3, height: 2 },
  { id: 2, type: "plot", x: 7, y: 2, width: 2, height: 2 },
  { id: 3, type: "plot", x: 10, y: 2, width: 2, height: 2 },
  { id: 4, type: "plot", x: 13, y: 2, width: 2, height: 2 },
  { id: 5, type: "plot", x: 7, y: 5, width: 2, height: 2 },
  { id: 6, type: "plot", x: 10, y: 5, width: 2, height: 2 },
  { id: 7, type: "plot", x: 13, y: 5, width: 2, height: 2 },
  { id: 8, type: "pond", x: 16, y: 2, width: 3, height: 3 },
  { id: 9, type: "pen", x: 2, y: 7, width: 2, height: 2 },
  { id: 10, type: "pen", x: 5, y: 7, width: 2, height: 2 },
  { id: 11, type: "pen", x: 8, y: 7, width: 2, height: 2 },
  { id: 12, type: "tree", x: 2, y: 11, width: 2, height: 2 },
  { id: 13, type: "tree", x: 5, y: 11, width: 2, height: 2 },
  { id: 14, type: "tree", x: 8, y: 11, width: 2, height: 2 },
  { id: 15, type: "tree", x: 11, y: 11, width: 2, height: 2 },
];

export default function FarmGame() {
  const [money, setMoney] = useState(500);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 10, y: 7 });
  const [entities, setEntities] = useState<FarmEntity[]>(initialEntities);
  const [movingAnimals, setMovingAnimals] = useState<MovingEntity[]>([]);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [selectedSeed, setSelectedSeed] = useState<string | null>(null);
  const [showShop, setShowShop] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showRecipes, setShowRecipes] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [direction, setDirection] = useState(0);
  const keysPressed = useRef<Set<string>>(new Set());

  const recipes = [
    { name: "Bánh táo", ingredients: ["tao", "lua"], price: 80 },
    { name: "Nước ép nho", ingredients: ["nho"], price: 50 },
    { name: "Xiên khế", ingredients: ["ke"], price: 100 },
    { name: "Salad rau", ingredients: ["cachua", "carot"], price: 60 },
  ];

  const addNotification = useCallback((msg: string) => {
    setNotifications(prev => [...prev, msg]);
    setTimeout(() => setNotifications(prev => prev.slice(1)), 2000);
  }, []);

  const getEntityAt = (x: number, y: number) => {
    return entities.find(e => 
      x >= e.x && x < e.x + e.width && 
      y >= e.y && y < e.y + e.height
    );
  };

  const isWalkable = (x: number, y: number) => {
    if (x < 0 || x >= FARM_WIDTH || y < 0 || y >= FARM_HEIGHT) return false;
    const entity = getEntityAt(x, y);
    if (entity && ["house", "tree", "pond", "pen"].includes(entity.type)) return false;
    if (entity?.type === "plot" && entity.cropId) {
      return entities.some(e => e.type === "plot" && e.cropId && 
        playerPos.x >= e.x && playerPos.x < e.x + e.width &&
        playerPos.y >= e.y && playerPos.y < e.y + e.height);
    }
    return true;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      const keys = keysPressed.current;
      let newX = playerPos.x;
      let newY = playerPos.y;
      let newDir = direction;

      if (keys.has("w") || keys.has("arrowup")) { newY--; newDir = 0; }
      else if (keys.has("s") || keys.has("arrowdown")) { newY++; newDir = 2; }
      else if (keys.has("a") || keys.has("arrowleft")) { newX--; newDir = 3; }
      else if (keys.has("d") || keys.has("arrowright")) { newX++; newDir = 1; }

      if ((newX !== playerPos.x || newY !== playerPos.y) && isWalkable(newX, newY)) {
        setPlayerPos({ x: newX, y: newY });
        setDirection(newDir);
      }
    }, 150);
    return () => clearInterval(moveInterval);
  }, [playerPos, direction]);

  useEffect(() => {
    const growInterval = setInterval(() => {
      const now = Date.now();
      setEntities(prev => prev.map(e => {
        if (e.type === "plot" && e.cropId && e.plantedAt && !e.ready) {
          const crop = crops.find(c => c.id === e.cropId);
          if (crop && (now - e.plantedAt) / 1000 >= crop.growTime) {
            return { ...e, ready: true };
          }
        }
        if (e.type === "pen" && e.animalId && e.lastCollect && !e.animalReady) {
          const animal = animalTypes.find(a => a.id === e.animalId);
          if (animal && (now - e.lastCollect) / 1000 >= animal.collectTime) {
            return { ...e, animalReady: true };
          }
        }
        return e;
      }));
    }, 1000);
    return () => clearInterval(growInterval);
  }, []);

  useEffect(() => {
    const animalMoveInterval = setInterval(() => {
      setMovingAnimals(prev => {
        const updated = prev.map(animal => {
          const dx = animal.targetX - animal.x;
          const dy = animal.targetY - animal.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 0.5) {
            const newTarget = {
              x: Math.max(0, Math.min(FARM_WIDTH - 1, animal.x + (Math.random() - 0.5) * 4)),
              y: Math.max(0, Math.min(FARM_HEIGHT - 1, animal.y + (Math.random() - 0.5) * 4)),
            };
            return { ...animal, targetX: newTarget.x, targetY: newTarget.y };
          }
          
          const moveX = (dx / dist) * 0.15;
          const moveY = (dy / dist) * 0.15;
          
          return {
            ...animal,
            x: animal.x + moveX,
            y: animal.y + moveY,
            direction: Math.atan2(dy, dx),
          };
        });
        return updated;
      });
    }, 100);
    return () => clearInterval(animalMoveInterval);
  }, []);

  useEffect(() => {
    entities.forEach(e => {
      if (e.type === "pen" && e.animalId && !movingAnimals.find(a => a.id === `pen-${e.id}`)) {
        const animal = animalTypes.find(a => a.id === e.animalId);
        if (animal) {
          setMovingAnimals(prev => [...prev, {
            id: `pen-${e.id}`,
            emoji: animal.emoji,
            x: e.x + e.width / 2,
            y: e.y + e.height / 2,
            targetX: e.x + Math.random() * e.width,
            targetY: e.y + Math.random() * e.height,
            speed: 0.05,
            direction: 0,
          }]);
        }
      }
    });
  }, [entities]);

  const interact = () => {
    const entity = getEntityAt(playerPos.x, playerPos.y);
    if (!entity) return;

    if (entity.type === "plot") {
      if (entity.ready) {
        const crop = crops.find(c => c.id === entity.cropId);
        if (crop) {
          setInventory(prev => ({ ...prev, [entity.cropId!]: (prev[entity.cropId!] || 0) + 1 }));
          setEntities(prev => prev.map(e => e.id === entity.id ? { ...e, cropId: undefined, plantedAt: undefined, ready: false } : e));
          addNotification(`Thu hoạch ${crop.name}! +1 ${crop.emoji}`);
        }
      } else if (entity.cropId === null) {
        if (!selectedSeed) {
          addNotification("Chọn hạt giống trước!");
          return;
        }
        const seedCount = inventory[selectedSeed] || 0;
        if (seedCount <= 0) {
          addNotification("Bạn cần mua hạt giống!");
          return;
        }
        const crop = crops.find(c => c.id === selectedSeed);
        if (crop) {
          setInventory(prev => ({ ...prev, [selectedSeed]: prev[selectedSeed] - 1 }));
          setEntities(prev => prev.map(e => e.id === entity.id ? { ...e, cropId: selectedSeed, plantedAt: Date.now(), ready: false } : e));
          addNotification(`Đã trồng ${crop.name}!`);
        }
      }
    }

    if (entity.type === "pen" && entity.animalReady) {
      const animal = animalTypes.find(a => a.id === entity.animalId);
      if (animal) {
        setMoney(prev => prev + animal.productPrice);
        setEntities(prev => prev.map(e => e.id === entity.id ? { ...e, lastCollect: Date.now(), animalReady: false } : e));
        addNotification(`Thu hoạch ${animal.product} ${animal.id === "ga" ? "🥚" : animal.id === "bo" ? "🥛" : "🥩"} +${animal.productPrice} coin`);
      }
    }

    if (entity.type === "house") {
      setShowShop(true);
    }
  };

  const buySeed = (cropId: string) => {
    const crop = crops.find(c => c.id === cropId);
    if (!crop) return;
    if (money < crop.buyPrice) {
      addNotification("Không đủ tiền!");
      return;
    }
    setMoney(prev => prev - crop.buyPrice);
    setInventory(prev => ({ ...prev, [cropId]: (prev[cropId] || 0) + 1 }));
    addNotification(`Mua hạt ${crop.name}!`);
  };

  const buyAnimal = (animalId: string) => {
    const animal = animalTypes.find(a => a.id === animalId);
    if (!animal) return;
    if (money < animal.buyPrice) {
      addNotification("Không đủ tiền!");
      return;
    }
    const emptyPen = entities.find(e => e.type === "pen" && !e.animalId);
    if (!emptyPen) {
      addNotification("Hết chuồng trống!");
      return;
    }
    setMoney(prev => prev - animal.buyPrice);
    setEntities(prev => prev.map(e => e.id === emptyPen.id ? { ...e, animalId, lastCollect: Date.now(), animalReady: false } : e));
    setMovingAnimals(prev => [...prev, {
      id: `pen-${emptyPen.id}`,
      emoji: animal.emoji,
      x: emptyPen.x + 1,
      y: emptyPen.y + 1,
      targetX: emptyPen.x + Math.random() * 2,
      targetY: emptyPen.y + Math.random() * 2,
      speed: 0.05,
      direction: 0,
    }]);
    addNotification(`Mua ${animal.name} thành công!`);
  };

  const sellCrop = (cropId: string) => {
    const qty = inventory[cropId] || 0;
    if (qty === 0) return;
    const crop = crops.find(c => c.id === cropId);
    if (!crop) return;
    const total = qty * crop.sellPrice;
    setMoney(prev => prev + total);
    setInventory(prev => ({ ...prev, [cropId]: 0 }));
    addNotification(`Bán ${qty} ${crop.name} +${total} coin`);
  };

  const makeRecipe = (recipe: typeof recipes[0]) => {
    const canMake = recipe.ingredients.every(ing => (inventory[ing] || 0) > 0);
    if (!canMake) {
      addNotification("Thiếu nguyên liệu!");
      return;
    }
    recipe.ingredients.forEach(ing => {
      setInventory(prev => ({ ...prev, [ing]: (prev[ing] || 0) - 1 }));
    });
    setMoney(prev => prev + recipe.price);
    addNotification(`Làm ${recipe.name} thành công! +${recipe.price} coin`);
  };

  const getProgress = (plantedAt: number | undefined, growTime: number) => {
    if (!plantedAt) return 0;
    const elapsed = (Date.now() - plantedAt) / 1000;
    return Math.min(100, (elapsed / growTime) * 100);
  };

  const getCellType = (x: number, y: number) => {
    const entity = entities.find(e => x >= e.x && x < e.x + e.width && y >= e.y && y < e.y + e.height);
    if (!entity) return "grass";
    return entity.type;
  };

  const playerEmoji = ["⬆️", "➡️", "⬇️", "⬅️"][direction];

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-zinc-900/80">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black">🌾 Nông Trại Vui Vẻ</h1>
          <span className="text-zinc-400 text-sm">Dùng WASD hoặc Arrow keys để di chuyển, Space để tương tác</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-500/40">
            <span className="text-xl">💰</span>
            <span className="font-bold text-yellow-400">{money}</span>
          </div>
          <button onClick={() => setShowInventory(true)} className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-xl font-semibold">
            🎒 Kho
          </button>
          <button onClick={() => setShowShop(true)} className="bg-cyan-500 hover:bg-cyan-400 px-4 py-2 rounded-xl font-semibold">
            🏠 Shop
          </button>
        </div>
      </div>

      <div className="flex gap-4 p-4">
        <div className="bg-green-900/30 rounded-2xl p-4 overflow-auto">
          <h2 className="font-semibold mb-3">🌱 Hạt giống</h2>
          <div className="flex flex-wrap gap-2">
            {crops.map(crop => (
              <button
                key={crop.id}
                onClick={() => setSelectedSeed(crop.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                  selectedSeed === crop.id
                    ? "bg-green-500 border-green-400"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <span>{crop.emoji}</span>
                <span className="text-sm">{crop.name}</span>
                <span className="text-xs text-zinc-400">({inventory[crop.id] || 0})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-900/30 rounded-2xl p-4">
          <h2 className="font-semibold mb-3">🏠 Mua động vật</h2>
          <div className="flex flex-wrap gap-2">
            {animalTypes.map(animal => (
              <button
                key={animal.id}
                onClick={() => buyAnimal(animal.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
              >
                <span>{animal.emoji}</span>
                <span>{animal.name}</span>
                <span className="text-yellow-400 text-sm">{animal.buyPrice}💰</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center p-4">
        <div 
          className="relative bg-green-800 rounded-xl overflow-hidden"
          style={{ 
            width: FARM_WIDTH * GRID_SIZE, 
            height: FARM_HEIGHT * GRID_SIZE,
            backgroundImage: `
              radial-gradient(circle at 20% 80%, #4ade80 0%, transparent 30%),
              radial-gradient(circle at 80% 20%, #22c55e 0%, transparent 25%),
              repeating-linear-gradient(90deg, transparent 0px, transparent 39px, #16653440 39px, #16653440 40px),
              repeating-linear-gradient(0deg, transparent 0px, transparent 39px, #16653440 39px, #16653440 40px)
            `
          }}
        >
          {Array.from({ length: FARM_HEIGHT }).map((_, y) => (
            Array.from({ length: FARM_WIDTH }).map((_, x) => {
              const cellType = getCellType(x, y);
              return (
                <div
                  key={`${x}-${y}`}
                  className="absolute"
                  style={{
                    left: x * GRID_SIZE,
                    top: y * GRID_SIZE,
                    width: GRID_SIZE,
                    height: GRID_SIZE,
                  }}
                >
                  {cellType === "house" && x === 2 && y === 2 && (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>
                  )}
                  {cellType === "tree" && (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🌳</div>
                  )}
                  {cellType === "pond" && (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🌊</div>
                  )}
                  {cellType === "plot" && (
                    <div className="w-full h-full flex items-center justify-center">
                      {(() => {
                        const entity = entities.find(e => e.type === "plot" && x >= e.x && x < e.x + e.width && y >= e.y && y < e.y + e.height);
                        if (!entity) return null;
                        if (!entity.cropId) return <span className="text-2xl opacity-30">🟫</span>;
                        const crop = crops.find(c => c.id === entity.cropId);
                        if (!crop) return null;
                        return (
                          <div className="relative">
                            <span className="text-xl">{entity.ready ? crop.emoji : "🌱"}</span>
                            {!entity.ready && (
                              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-600 rounded-full overflow-hidden">
                                <div className="h-full bg-green-400" style={{ width: `${getProgress(entity.plantedAt, crop.growTime)}%` }} />
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  {cellType === "pen" && (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🚧</div>
                  )}
                </div>
              );
            })
          ))}

          {movingAnimals.map(animal => (
            <motion.div
              key={animal.id}
              animate={{ x: animal.x * GRID_SIZE + GRID_SIZE / 2 - 16, y: animal.y * GRID_SIZE + GRID_SIZE / 2 - 16 }}
              transition={{ type: "tween", duration: 0.1 }}
              className="absolute text-2xl"
              style={{ width: 32, height: 32 }}
            >
              {animal.emoji}
            </motion.div>
          ))}

          <motion.div
            animate={{ x: playerPos.x * GRID_SIZE, y: playerPos.y * GRID_SIZE }}
            transition={{ type: "tween", duration: 0.1 }}
            className="absolute text-3xl z-10"
            style={{ width: GRID_SIZE, height: GRID_SIZE, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            👨‍🌾
          </motion.div>

          {entities.filter(e => e.type === "pen" && e.animalId).map(pen => (
            pen.animalReady && (
              <div
                key={`ready-${pen.id}`}
                className="absolute animate-bounce"
                style={{
                  left: pen.x * GRID_SIZE + pen.width * GRID_SIZE / 2 - 12,
                  top: pen.y * GRID_SIZE + pen.height * GRID_SIZE - 20,
                }}
              >
                ✨
              </div>
            )
          ))}
        </div>
      </div>

      <div className="text-center text-zinc-500 text-sm p-2">
        Nhấn <kbd className="bg-zinc-800 px-2 py-1 rounded">Space</kbd> để trồng/thu hoạch/tương tác
      </div>

      <AnimatePresence>
        {showShop && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setShowShop(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">🏠 Shop - Mua hạt giống</h2>
              <div className="space-y-2">
                {crops.map(crop => (
                  <button key={crop.id} onClick={() => buySeed(crop.id)} className="flex items-center justify-between w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{crop.emoji}</span>
                      <div className="text-left">
                        <div className="font-semibold">{crop.name}</div>
                        <div className="text-xs text-zinc-400">Bán: {crop.sellPrice} coin</div>
                      </div>
                    </div>
                    <span className="text-yellow-400 font-bold">{crop.buyPrice}💰</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowShop(false)} className="mt-4 w-full py-2 bg-zinc-700 rounded-lg hover:bg-zinc-600">Đóng</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInventory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setShowInventory(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">🎒 Kho</h2>
                <button onClick={() => setShowRecipes(true)} className="text-sm bg-purple-500/30 px-3 py-1 rounded-lg hover:bg-purple-500/50">🍰 Làm bánh</button>
              </div>
              <div className="space-y-2">
                {Object.keys(inventory).length === 0 && <span className="text-zinc-500">Chưa có gì...</span>}
                {Object.entries(inventory).filter(([_, qty]) => qty > 0).map(([cropId, qty]) => {
                  const crop = crops.find(c => c.id === cropId);
                  if (!crop) return null;
                  return (
                    <div key={cropId} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{crop.emoji}</span>
                        <span>{crop.name} x{qty}</span>
                      </div>
                      <button onClick={() => sellCrop(cropId)} className="text-yellow-400 hover:text-yellow-300">Bán {crop.sellPrice * qty}💰</button>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setShowInventory(false)} className="mt-4 w-full py-2 bg-zinc-700 rounded-lg hover:bg-zinc-600">Đóng</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRecipes && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setShowRecipes(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">🍰 Làm bánh & Chế biến</h2>
              <div className="space-y-3">
                {recipes.map((recipe, idx) => (
                  <button key={idx} onClick={() => makeRecipe(recipe)} className="flex items-center justify-between w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">
                    <div className="text-left">
                      <div className="font-semibold">{recipe.name}</div>
                      <div className="text-xs text-zinc-400">Cần: {recipe.ingredients.map(i => crops.find(c => c.id === i)?.emoji).join(" + ")}</div>
                    </div>
                    <span className="text-yellow-400 font-bold">+{recipe.price}💰</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowRecipes(false)} className="mt-4 w-full py-2 bg-zinc-700 rounded-lg hover:bg-zinc-600">Đóng</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notifications.map((msg, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg">
            {msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}