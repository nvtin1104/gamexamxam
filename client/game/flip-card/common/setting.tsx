import { AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const GameSetting = ({
    showSettings,
    setShowSettings,
}: {
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        setIsOpen(showSettings);
    }, [showSettings]);
    const [autoShuffle, setAutoShuffle] = useState(true);
    const t = useTranslations("games.flipCard");
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-0 top-0 h-full w-64 bg-background shadow-lg p-5 flex flex-col gap-4 border-l border-gray-300"
                >
                    <h2 className="text-xl font-semibold mb-2 text-primary">⚙️ {t("settings")}</h2>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={autoShuffle}
                            onChange={() => setAutoShuffle((v) => !v)}
                        />
                        <span>Tự động xáo bài khi chơi lại</span>
                    </label>
                    <button
                        onClick={() => setShowSettings(false)}
                        className="mt-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
                    >
                        ✖️ {t("close")}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
export default GameSetting;