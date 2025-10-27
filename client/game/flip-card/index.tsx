"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { FolderOpen, Play, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import GameSetting from "./common/setting";
import ImportModal from "@/components/modal/import";
import { TableCard } from "./common/table";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const ANIMATION_DURATION = 500;

const SHUFFLE_COUNT = 4;
const SHUFFLE_DELAY = 500;
type Card = {
  id: number;
  text: string;
  revealed: boolean;
};
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
export default function FlipCardGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [questions, setQuestions] = useState<string[]>(QUESTIONS);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [open, setOpen] = useState(false);

  const t = useTranslations("games.flipCard");
  const fields = [
    { key: "question", label: t("question"), required: true },
  ];


  const initGame = () => {
    const shuffled = [...questions].map((q, i) => ({
      id: i,
      text: q,
      revealed: true,
    }));
    setCards(shuffled);
    setGameOver(false);
    setStarted(false);
    setOpen(false);
  };

  useEffect(() => initGame(), []);

  const startGame = async () => {
    setStarted(true);
    setGameOver(false);

    setCards((prev) => {
      return prev.map((c) => ({ ...c, revealed: false }));
    });

    await delay(ANIMATION_DURATION);

    for (let i = 0; i < SHUFFLE_COUNT; i++) {
      setCards((prev) => {
        return [...prev].sort(() => Math.random() - 0.5);
      });

      await delay(SHUFFLE_DELAY);
    }
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
  const flipAllCards = () => {
    setCards((prev) => prev.map((c) => ({ ...c, revealed: true })));
  };

  const toggleSettings = () => setShowSettings((prev) => !prev);

  return (
    <div className="relative transition-colors duration-300">

      <div className="flex md:flex-row flex-col items-center justify-center p-3 gap-3">
        <div>
          tesst
        </div>
        <div className="space-y-6 flex flex-col items-center justify-center w-full">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            <AnimatePresence>
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  layout

                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}

                  className="relative h-52 w-full md:h-48 cursor-pointer perspective"
                  onClick={() => revealCard(card.id)}
                >
                  <motion.div
                    animate={{ rotateY: card.revealed ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="absolute inset-0"
                  >
                    <div className="absolute inset-0 bg-[#ffcc80] rounded-xl shadow-inner flex items-center justify-center text-xl font-bold backface-hidden">
                      ❓
                    </div>

                    <div
                      className="absolute p-3 inset-0 bg-card rounded-xl shadow flex flex-col justify-start text-xs sm:text-sm text-center backface-hidden overflow-auto break-words hyphens-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      {card.text}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex gap-3">
            {!started && (
              <Button
                onClick={startGame}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
              >
                <Play />
                Bắt đầu
              </Button>
            )}
            {gameOver && (
              <div className="flex gap-3">
                <Button
                  onClick={startGame}
                  variant="outline"
                >
                  <RefreshCcw />
                  {t("restart")}
                </Button>
                <Button
                  onClick={flipAllCards}
                  variant="outline"
                >
                  <FolderOpen />
                  {t("viewAnswer")}
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-start flex-col self-stretch gap-3">
          <div>
            <Button
              onClick={toggleSettings}
              variant="outline"
              className="w-full"
            >
              ⚙️
              {t("settings")}
            </Button>
            <Button
              onClick={toggleSettings}
              variant="outline"
              className="w-full"
            >
              👨‍💻
              {t("dataonline")}
            </Button>
            <Button
              onClick={toggleSettings}
              variant="outline"
              className="w-full"
            >
              💾
              {t("data")}
            </Button>
            <Button onClick={() => setOpen(true)}>Import Excel</Button>
          </div>
          <TableCard fields={fields} data={questions} />
        </div>
      </div>

      <GameSetting showSettings={showSettings} setShowSettings={setShowSettings} />
      <ImportModal
        open={open}
        onOpenChange={setOpen}
        onImport={(data) => {
          setQuestions(data.map((q) => q.question));
          initGame();
        }}
        fields={fields}
        sampleFileName="data"
      />
    </div>
  );
}
