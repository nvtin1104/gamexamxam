"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileUp, FolderOpen, Play, RefreshCcw, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import GameSetting from "./common/setting";
import ImportModal from "@/components/modal/import";
import TextareaModal from "@/components/modal/textarea";
import { PlayTab } from "./common/tab";
import { BasicTable } from "@/components/table/basesic";
import { useSettingStore } from "@/store/setting";
import { usePlayerStore } from "@/store/player";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
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
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successCard, setSuccessCard] = useState<string | null>(null);
  const shuffleSoundRef = useRef<HTMLAudioElement | null>(null);
  const flipSoundRef = useRef<HTMLAudioElement | null>(null);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);

  const t = useTranslations("games.flipCard");
  const flipCardSettings = useSettingStore((state) => state.flipCardSettings);
  const players = usePlayerStore((state) => state.players);
  const isMultiplayer = flipCardSettings.isMultiplayer;

  const fields = [
    { key: "question", label: t("question"), required: true },
  ];

  const historyFields = [
    { key: "turn", label: t("turn"), required: true },
    { key: "question", label: t("question"), required: true },
    { key: "player", label: t("player"), required: true },
  ];


  const getDefaultPlayerName = () => t("defaultPlayerName");

  const getActivePlayers = () => {
    if (isMultiplayer && players.length > 0) {
      return players;
    }
    return [{ id: "solo", name: getDefaultPlayerName() }];
  };

  const getCurrentPlayerName = () => {
    const activePlayers = getActivePlayers();
    if (activePlayers.length === 0) {
      return getDefaultPlayerName();
    }
    return activePlayers[currentPlayerIndex % activePlayers.length].name || getDefaultPlayerName();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    shuffleSoundRef.current = new Audio("/sound/shuffle.mp3");
    flipSoundRef.current = new Audio("/sound/page-flip.mp3");
    successSoundRef.current = new Audio("/sound/wow.mp3");

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        shuffleSoundRef.current?.pause();
        shuffleSoundRef.current && (shuffleSoundRef.current.currentTime = 0);
        flipSoundRef.current?.pause();
        flipSoundRef.current && (flipSoundRef.current.currentTime = 0);
        successSoundRef.current?.pause();
        successSoundRef.current && (successSoundRef.current.currentTime = 0);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      shuffleSoundRef.current?.pause();
      flipSoundRef.current?.pause();
      successSoundRef.current?.pause();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const playAudio = (audio: HTMLAudioElement | null) => {
    if (!audio) return;
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  };

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
    setShowSuccessModal(false);
    setSuccessCard(null);
  };

  useEffect(() => initGame(), []);

  useEffect(() => {
    if (!isMultiplayer) {
      setCurrentPlayerIndex(0);
      return;
    }
    if (players.length === 0) {
      setCurrentPlayerIndex(0);
      return;
    }
    setCurrentPlayerIndex((prev) => prev % players.length);
  }, [isMultiplayer, players.length]);

  useEffect(
    () => () => {
      if (shuffleSoundRef.current) {
        shuffleSoundRef.current.pause();
        shuffleSoundRef.current = null;
      }
      if (flipSoundRef.current) {
        flipSoundRef.current.pause();
        flipSoundRef.current = null;
      }
      if (successSoundRef.current) {
        successSoundRef.current.pause();
        successSoundRef.current = null;
      }
    },
    []
  );

  const startGame = async () => {
    setStarted(true);
    setGameOver(false);
    setIsShuffle(true);
    playAudio(flipSoundRef.current);

    setCards((prev) => {
      return prev.map((c) => ({ ...c, revealed: false }));
    });

    await delay(flipCardSettings.delay);

    for (let i = 0; i < flipCardSettings.shuffleCount; i++) {
      setCards((prev) => {
        return [...prev].sort(() => Math.random() - 0.5);
      });
      playAudio(shuffleSoundRef.current);

      await delay(flipCardSettings.shuffleDelay);
    }
    setIsShuffle(false);
  };

  const revealCard = (id: number) => {
    if (!started || gameOver) return;
    const selectedCard = cards.find((c) => c.id === id);
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, revealed: true } : { ...c, revealed: false }
      )
    );

    const playerName = getCurrentPlayerName();
    setHistoryData((prev) => [
      ...prev,
      {
        turn: prev.length + 1,
        question: selectedCard?.text ?? t("unknownQuestion"),
        player: playerName,
      },
    ]);

    if (isMultiplayer && players.length > 0) {
      setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    }

    setGameOver(true);
    setSuccessCard(selectedCard?.text ?? t("unknownQuestion"));
    setShowSuccessModal(true);
    playAudio(flipSoundRef.current);
    playAudio(successSoundRef.current);
  };
  const flipAllCards = () => {
    setCards((prev) => prev.map((c) => ({ ...c, revealed: true })));
  };

  const toggleSettings = () => setShowSettings((prev) => !prev);

  const currentPlayerName = getCurrentPlayerName();
  const hasActivePlayers = !isMultiplayer || players.length > 0;

  const handleSuccessModalChange = (open: boolean) => {
    if (open) {
      setShowSuccessModal(true);
      return;
    }

    setShowSuccessModal(false);
    setSuccessCard(null);
  };

  const handleSuccessContinue = () => {
    handleSuccessModalChange(false);
  };



  return (
    <div className="relative transition-colors duration-300">
      <motion.div layout className="flex md:flex-row flex-col items-center justify-center p-3 gap-3">
        <PlayTab historyFields={historyFields} historyData={historyData} />
        <motion.div layout className="space-y-6 flex flex-col items-center justify-center flex-1 w-full">
          <div className="grid gap-4 w-full grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
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
                    transition={{ duration: flipCardSettings.animationDuration / 1000 }}
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
                {`${t("start")} - ${currentPlayerName}`}
              </Button>
            )}
            {gameOver && (
              <div className="flex gap-3">
                {
                  !hasActivePlayers ? (
                    <Button
                      onClick={startGame}
                      variant="outline"
                    >
                      <RefreshCcw />
                      {t("restart")}
                    </Button>
                  ) : (
                    <Button
                      onClick={startGame}
                      variant="outline"
                    >
                      <ChevronRight />
                      {`${t("start")} - ${currentPlayerName}`}
                    </Button>
                  )
                }
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

      <Dialog open={showSuccessModal} onOpenChange={handleSuccessModalChange}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle>{t("successModalTitle")}</DialogTitle>
            <DialogDescription>
              {t("successModalDescription", {
                card: successCard ?? t("unknownQuestion"),
              })}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
