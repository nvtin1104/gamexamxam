"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Card = {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

const EMOJIS = ["🐥","🐸","🐱","🐶","🐰","🐢","🐠","🐝"];

export default function MemoryGamePage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // khởi tạo bộ thẻ
  const newGame = () => {
    const deck = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({
        id: i,
        emoji,
        flipped: false,
        matched: false,
      }));
    setCards(deck);
    setFlipped([]);
    setMoves(0);
    setScore(0);
    setIsDone(false);
  };

  useEffect(() => newGame(), []);

  const flipCard = (id: number) => {
    if (isDone) return;
    const selected = cards.find((c) => c.id === id);
    if (!selected || selected.flipped || flipped.length === 2) return;

    const updated = cards.map((c) =>
      c.id === id ? { ...c, flipped: true } : c
    );
    setCards(updated);
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newFlipped.map(
        (fid) => updated.find((c) => c.id === fid)!
      );
      if (a.emoji === b.emoji) {
        // match!
        const next = updated.map((c) =>
          c.emoji === a.emoji ? { ...c, matched: true } : c
        );
        setCards(next);
        setFlipped([]);
        setScore((s) => s + 10);
      } else {
        // không match, tự úp lại sau delay
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c
            )
          );
          setFlipped([]);
        }, 900);
      }
    }
  };

  useEffect(() => {
    if (cards.length && cards.every((c) => c.matched)) setIsDone(true);
  }, [cards]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-200 p-6 text-neutral-900">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">🎴 Game Mở Thẻ</h1>

      <div className="mb-4 text-center">
        <p className="font-medium">
          Lượt: <span className="font-bold">{moves}</span> · Điểm:{" "}
          <span className="font-bold text-emerald-600">{score}</span>
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="relative w-20 h-24 sm:w-24 sm:h-28 cursor-pointer perspective"
            onClick={() => flipCard(card.id)}
          >
            <motion.div
              className="absolute inset-0 rounded-xl flex items-center justify-center text-3xl sm:text-4xl font-bold"
              animate={{
                rotateY: card.flipped || card.matched ? 180 : 0,
              }}
              transition={{ duration: 0.4 }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Mặt trước */}
              <div className="absolute inset-0 bg-white rounded-xl shadow-inner flex items-center justify-center backface-hidden">
                ❓
              </div>
              {/* Mặt sau */}
              <div
                className="absolute inset-0 rounded-xl flex items-center justify-center backface-hidden"
                style={{
                  transform: "rotateY(180deg)",
                  background: card.matched ? "#a7f3d0" : "#fef08a",
                }}
              >
                {card.emoji}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {isDone && (
        <div className="mt-6 p-4 bg-white rounded-xl shadow">
          <p className="font-semibold text-lg mb-2">
            🎉 Hoàn thành! Điểm: {score} | Lượt: {moves}
          </p>
          <button
            onClick={newGame}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
          >
            Chơi lại
          </button>
        </div>
      )}
    </div>
  );
}
