"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Monitor, Circle, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";

// --- Sound Utility ---
const playAlarm = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.5);

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
};

const playTick = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
};

// --- Timer Logic Hook ---
function useTimer() {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [initialTime, setInitialTime] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev > 1) playTick();
                    return prev - 1;
                });
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            playAlarm();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    const startTimer = () => {
        if (timeLeft === 0) {
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            if (totalSeconds > 0) {
                setTimeLeft(totalSeconds);
                setInitialTime(totalSeconds);
                setIsActive(true);
            }
        } else {
            setIsActive(true);
        }
    };

    const pauseTimer = () => setIsActive(false);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(0);
        setInitialTime(0);
    };

    return {
        hours, setHours,
        minutes, setMinutes,
        seconds, setSeconds,
        isActive,
        timeLeft,
        initialTime,
        startTimer,
        pauseTimer,
        resetTimer
    };
}

// --- Interfaces ---

function CircularTimer({ timer, t }: { timer: any, t: any }) {
    const progress = timer.initialTime > 0 ? ((timer.initialTime - timer.timeLeft) / timer.initialTime) * 100 : 0;

    const formatTime = (time: number) => {
        const h = Math.floor(time / 3600);
        const m = Math.floor((time % 3600) / 60);
        const s = time % 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex flex-col items-center space-y-8">
            <div className="relative flex items-center justify-center">
                <svg className="h-64 w-64 -rotate-90 transform">
                    <circle
                        className="text-muted-foreground/20"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="120"
                        cx="128"
                        cy="128"
                    />
                    <circle
                        className="text-primary transition-all duration-1000 ease-linear"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 120}
                        strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="120"
                        cx="128"
                        cy="128"
                    />
                </svg>
                <div className="absolute text-5xl font-bold tracking-tighter font-mono text-foreground">
                    {timer.timeLeft > 0 ? formatTime(timer.timeLeft) : "00:00:00"}
                </div>
            </div>
        </div>
    );
}

function DigitalTimer({ timer }: { timer: any }) {
    const formatTime = (time: number) => {
        const h = Math.floor(time / 3600);
        const m = Math.floor((time % 3600) / 60);
        const s = time % 60;
        return {
            h: h.toString().padStart(2, "0"),
            m: m.toString().padStart(2, "0"),
            s: s.toString().padStart(2, "0")
        };
    };

    const { h, m, s } = timer.timeLeft > 0 ? formatTime(timer.timeLeft) : { h: "00", m: "00", s: "00" };

    return (
        <div className="flex justify-center items-center space-x-4 py-12">
            <div className="bg-muted p-4 rounded-lg">
                <span className="text-7xl font-bold font-mono text-primary">{h}</span>
            </div>
            <span className="text-4xl font-bold text-muted-foreground">:</span>
            <div className="bg-muted p-4 rounded-lg">
                <span className="text-7xl font-bold font-mono text-primary">{m}</span>
            </div>
            <span className="text-4xl font-bold text-muted-foreground">:</span>
            <div className="bg-muted p-4 rounded-lg">
                <span className="text-7xl font-bold font-mono text-primary">{s}</span>
            </div>
        </div>
    );
}

function FlipCard({ digit }: { digit: string }) {
    return (
        <div className="relative w-20 h-32 bg-muted rounded-lg overflow-hidden shadow-lg border border-border">
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold font-mono text-foreground">{digit}</span>
            </div>
            <div className="absolute inset-x-0 top-1/2 h-px bg-background/50"></div>
        </div>
    );
}

function FlipTimer({ timer }: { timer: any }) {
    const formatTime = (time: number) => {
        const h = Math.floor(time / 3600);
        const m = Math.floor((time % 3600) / 60);
        const s = time % 60;
        return {
            h: h.toString().padStart(2, "0"),
            m: m.toString().padStart(2, "0"),
            s: s.toString().padStart(2, "0")
        };
    };

    const { h, m, s } = timer.timeLeft > 0 ? formatTime(timer.timeLeft) : { h: "00", m: "00", s: "00" };

    return (
        <div className="flex justify-center items-center space-x-2 py-12">
            <div className="flex space-x-1">
                <FlipCard digit={h[0]} />
                <FlipCard digit={h[1]} />
            </div>
            <span className="text-4xl font-bold text-muted-foreground mx-2">:</span>
            <div className="flex space-x-1">
                <FlipCard digit={m[0]} />
                <FlipCard digit={m[1]} />
            </div>
            <span className="text-4xl font-bold text-muted-foreground mx-2">:</span>
            <div className="flex space-x-1">
                <FlipCard digit={s[0]} />
                <FlipCard digit={s[1]} />
            </div>
        </div>
    );
}

// --- Main Page ---
export default function TimerClient() {
    const t = useTranslations("layout.timer");
    const timer = useTimer();

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-3xl shadow-2xl border-none bg-background/60 backdrop-blur-xl">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {t("title")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <Tabs defaultValue="circular" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted">
                            <TabsTrigger value="circular" className="text-lg">
                                <Circle className="mr-2 h-5 w-5" /> {t("circular")}
                            </TabsTrigger>
                            <TabsTrigger value="digital" className="text-lg">
                                <Monitor className="mr-2 h-5 w-5" /> {t("digital")}
                            </TabsTrigger>
                            <TabsTrigger value="flip" className="text-lg">
                                <Layers className="mr-2 h-5 w-5" /> {t("flip")}
                            </TabsTrigger>
                        </TabsList>

                        <div className="min-h-[300px] flex flex-col justify-center">
                            <TabsContent value="circular" className="mt-0">
                                <CircularTimer timer={timer} t={t} />
                            </TabsContent>
                            <TabsContent value="digital" className="mt-0">
                                <DigitalTimer timer={timer} />
                            </TabsContent>
                            <TabsContent value="flip" className="mt-0">
                                <FlipTimer timer={timer} />
                            </TabsContent>
                        </div>

                        <div className="flex flex-col items-center mt-8 space-y-6">
                            <div className="flex gap-4">
                                {!timer.isActive && timer.timeLeft === 0 && (
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder="HH"
                                            value={timer.hours}
                                            onChange={(e) => timer.setHours(Math.max(0, parseInt(e.target.value) || 0))}
                                            className="w-20 text-center text-lg bg-background text-foreground border-input"
                                        />
                                        <Input
                                            type="number"
                                            placeholder="MM"
                                            value={timer.minutes}
                                            onChange={(e) => timer.setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                                            className="w-20 text-center text-lg bg-background text-foreground border-input"
                                        />
                                        <Input
                                            type="number"
                                            placeholder="SS"
                                            value={timer.seconds}
                                            onChange={(e) => timer.setSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                                            className="w-20 text-center text-lg bg-background text-foreground border-input"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                {!timer.isActive ? (
                                    <Button size="lg" onClick={timer.startTimer} className="w-32">
                                        <Play className="mr-2 h-4 w-4" /> {t("start")}
                                    </Button>
                                ) : (
                                    <Button size="lg" variant="outline" onClick={timer.pauseTimer} className="w-32">
                                        <Pause className="mr-2 h-4 w-4" /> {t("pause")}
                                    </Button>
                                )}
                                <Button size="lg" variant="secondary" onClick={timer.resetTimer} className="w-32">
                                    <RotateCcw className="mr-2 h-4 w-4" /> {t("reset")}
                                </Button>
                            </div>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
