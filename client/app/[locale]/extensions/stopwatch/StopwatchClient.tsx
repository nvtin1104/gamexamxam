"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

const playLap = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
};

export default function StopwatchClient() {
    const t = useTranslations("layout.countTime");
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive) {
            interval = setInterval(() => {
                setTime((prev) => prev + 10);
            }, 10);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive]);

    const formatTime = (ms: number) => {
        const m = Math.floor((ms / 60000) % 60);
        const s = Math.floor((ms / 1000) % 60);
        const cs = Math.floor((ms / 10) % 100);
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}`;
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTime(0);
        setLaps([]);
    };

    const addLap = () => {
        setLaps((prev) => [time, ...prev]);
        playLap();
    };

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-3xl shadow-2xl border-none bg-background/60 backdrop-blur-xl">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {t("stopwatch")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-8 w-full max-w-md mx-auto">
                        <div className="text-7xl font-bold tracking-tighter font-mono tabular-nums text-foreground">
                            {formatTime(time)}
                        </div>

                        <div className="flex gap-4 w-full justify-center">
                            <Button
                                size="lg"
                                variant={isActive ? "destructive" : "default"}
                                onClick={toggleTimer}
                                className="w-32"
                            >
                                {isActive ? (
                                    <>
                                        <Pause className="mr-2 h-4 w-4" /> {t("stop")}
                                    </>
                                ) : (
                                    <>
                                        <Play className="mr-2 h-4 w-4" /> {t("start")}
                                    </>
                                )}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={addLap}
                                disabled={!isActive}
                                className="w-32"
                            >
                                <Flag className="mr-2 h-4 w-4" /> {t("lap")}
                            </Button>
                            <Button size="lg" variant="secondary" onClick={resetTimer} className="w-32">
                                <RotateCcw className="mr-2 h-4 w-4" /> {t("reset")}
                            </Button>
                        </div>

                        <div className="w-full space-y-2 max-h-60 overflow-y-auto pr-2">
                            <AnimatePresence initial={false}>
                                {laps.map((lap, index) => (
                                    <motion.div
                                        key={laps.length - index}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border border-border"
                                    >
                                        <span className="text-muted-foreground">{t("lapColumn")} {laps.length - index}</span>
                                        <span className="font-mono font-medium text-foreground">{formatTime(lap)}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
