"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { FileUp, FolderOpen, Play, RefreshCcw, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import GameSetting from "./common/setting";
import ImportModal from "@/components/modal/import";
import TextareaModal from "@/components/modal/textarea";
import { PlayTab } from "./common/tab";
import { BasicTable } from "@/components/table/basesic";
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
  "Câu hỏi 1",
  "Câu hỏi 2",
  "Câu hỏi 3",
  "Câu hỏi 4",
  "Câu hỏi 5",
  "Câu hỏi 6",
  "Câu hỏi 7",
  "Câu hỏi 8",
  "Câu hỏi 9",
];
export default function FlipCardGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [questions, setQuestions] = useState<string[]>(QUESTIONS);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [open, setOpen] = useState(false);
  const [isShuffle, setIsShuffle] = useState(true);
  const [playerData, setPlayerData] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);

  const t = useTranslations("games.flipCard");
  const fields = [
    { key: "question", label: t("question"), required: true },
  ];

  const historyFields = [
    { key: "turn", label: t("turn"), required: true },
    { key: "question", label: t("question"), required: true },
    { key: "player", label: t("player"), required: true },
  ];


  const initGame = (sourceQuestions?: string[]) => {
    const baseQuestions = sourceQuestions ?? questions;
    const shuffled = [...baseQuestions].map((q, i) => ({
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
    setIsShuffle(true);

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
    setIsShuffle(false);
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
      <motion.div layout className="flex md:flex-row flex-col items-center justify-center p-3 gap-3">
        <PlayTab historyFields={historyFields} historyData={historyData} onAddPlayer={setPlayerData} />
        <motion.div layout className="space-y-6 flex flex-col items-center justify-center flex-1 w-full">
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
                  onClick={() => !isShuffle && revealCard(card.id)}
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
        </motion.div>
        <div className="flex justify-start flex-col self-stretch gap-3">
          <div className="flex flex-wrap gap-3 sm:flex-nowrap">
            <Button
              onClick={toggleSettings}
              className="flex-1 min-w-[120px]"
            >
              <Settings className="mr-1" />
              {t("settings")}
            </Button>

            <div className="flex-1 min-w-[120px]">
              <TextareaModal
                title={t("addQuestion")}
                placeholder={t("addQuestionPlaceholder")}
                button={t("addQuestion")}
                onSubmit={async (data) => {
                  const nextQuestions = [
                    ...questions,
                    ...data,
                  ].filter((q, i, self) => self.indexOf(q) === i);
                  setQuestions(nextQuestions);
                  initGame(nextQuestions);
                }}
              />
            </div>

            <Button
              onClick={() => setOpen(true)}
              className="flex-1 min-w-[120px]"
            >
              <FileUp className="mr-1" />
              {t("import")}
            </Button>
          </div>
          <BasicTable fields={fields} data={questions.map((q, i) => ({ id: i, question: q }))} />
        </div>
      </motion.div>

      <GameSetting showSettings={showSettings} setShowSettings={setShowSettings} />
      <ImportModal
        open={open}
        onOpenChange={setOpen}
        onImport={async (data) => {
          const nextQuestions = data.map((q) => q.question);
          setQuestions(nextQuestions);
          initGame(nextQuestions);
        }}
        fields={fields}
        sampleFileName="data"
      />
    </div>
  );
}
