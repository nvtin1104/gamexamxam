"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Card = {
  id: number;
  text: string;
  revealed: boolean;
};

export default function FlipCardGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  // nội dung mỗi thẻ — có thể là câu hỏi, từ vựng, điểm thưởng,...
  const QUESTIONS = [
    "Câu hỏi 1️⃣: Nêu công thức tính diện tích tam giác?",
    "Câu hỏi 2️⃣: Thủ đô của Nhật Bản là gì?",
    "Câu hỏi 3️⃣: Giải thích khái niệm môi trường?",
    "Câu hỏi 4️⃣: Tác giả của Truyện Kiều?",
    "Câu hỏi 5️⃣: 5 x 8 = ?",
    "Câu hỏi 6️⃣: Nguyên tố H có số hiệu nguyên tử là?",
    "Câu hỏi 7️⃣: Nêu 3 ví dụ về vật dẫn điện.",
    "Câu hỏi 8️⃣: Ai là người đầu tiên đặt chân lên Mặt Trăng?",
    "Câu hỏi 9️⃣: Tên tiếng Anh của ‘máy tính’?",
  ];

  const initGame = () => {
    const shuffled = [...QUESTIONS]
      .map((q, i) => ({ id: i, text: q, revealed: true }));
    setCards(shuffled);
    setGameOver(false);
    setStarted(false);
  };

  useEffect(() => initGame(), []);

  const startGame = () => {
    setStarted(true);
    setCards((prev) => prev
      .sort(() => Math.random() - 0.5)
      .map((c) => ({ ...c, revealed: false })));
  };

  const revealCard = (id: number) => {
    if (!started || gameOver) return;
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, revealed: true } : { ...c, revealed: false }
      )
    );
    setGameOver(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-200 p-6 text-neutral-900">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">🎓 Game Mở 1 Thẻ</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="relative w-28 h-36 sm:w-32 sm:h-40 cursor-pointer perspective"
            onClick={() => revealCard(card.id)}
          >
            <motion.div
              animate={{ rotateY: card.revealed ? 180 : 0 }}
              transition={{ duration: 0.5 }}
              style={{ transformStyle: "preserve-3d" }}
              className="absolute inset-0"
            >
              {/* Mặt trước */}
              <div className="absolute inset-0 bg-amber-400 rounded-xl shadow-inner flex items-center justify-center text-xl font-bold backface-hidden">
                ❓
              </div>
              {/* Mặt sau */}
              <div
                className="absolute inset-0 bg-white rounded-xl shadow flex items-center justify-center text-sm sm:text-base px-2 text-center backface-hidden"
                style={{ transform: "rotateY(180deg)" }}
              >
                {card.text}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        {!started && (
          <button
            onClick={startGame}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
          >
            ▶️ Bắt đầu
          </button>
        )}
        {gameOver && (
          <button
            onClick={initGame}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
          >
            🔁 Chơi lại
          </button>
        )}
      </div>

      {gameOver && (
        <p className="mt-4 text-lg font-medium text-emerald-700">
          🏁 Kết thúc lượt chơi — chỉ được chọn 1 thẻ!
        </p>
      )}
    </div>
  );
}
