"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

const playAlarm = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.4);
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.6);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
};

interface Alarm {
    id: string;
    time: string;
    isActive: boolean;
    label: string;
}

export default function AlarmClient() {
    const t = useTranslations("layout.alarm");
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [newTime, setNewTime] = useState("");
    const [newLabel, setNewLabel] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
            const currentSeconds = now.getSeconds();

            if (currentSeconds === 0) {
                alarms.forEach((alarm) => {
                    if (alarm.isActive && alarm.time === currentTime) {
                        playAlarm();
                        // Optional: Notification
                        if (Notification.permission === "granted") {
                            new Notification(t("title"), { body: alarm.label || t("alarmTriggered") });
                        }
                    }
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [alarms, t]);

    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    const addAlarm = () => {
        if (newTime) {
            setAlarms([
                ...alarms,
                {
                    id: Date.now().toString(),
                    time: newTime,
                    isActive: true,
                    label: newLabel,
                },
            ]);
            setNewTime("");
            setNewLabel("");
        }
    };

    const deleteAlarm = (id: string) => {
        setAlarms(alarms.filter((alarm) => alarm.id !== id));
    };

    const toggleAlarm = (id: string) => {
        setAlarms(
            alarms.map((alarm) =>
                alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
            )
        );
    };

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-3xl shadow-2xl border-none bg-background/60 backdrop-blur-xl">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {t("title")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex flex-col space-y-6 max-w-md mx-auto">
                        <div className="flex gap-2">
                            <Input
                                type="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="text-lg"
                            />
                            <Input
                                type="text"
                                placeholder={t("labelPlaceholder")}
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                            />
                            <Button onClick={addAlarm} disabled={!newTime}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence initial={false}>
                                {alarms.map((alarm) => (
                                    <motion.div
                                        key={alarm.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-3xl font-mono font-bold text-foreground">
                                                {alarm.time}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {alarm.label || t("noLabel")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => toggleAlarm(alarm.id)}
                                                className={`transition-colors ${alarm.isActive ? "text-primary" : "text-muted-foreground"
                                                    }`}
                                            >
                                                {alarm.isActive ? (
                                                    <ToggleRight className="h-8 w-8" />
                                                ) : (
                                                    <ToggleLeft className="h-8 w-8" />
                                                )}
                                            </button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteAlarm(alarm.id)}
                                                className="text-destructive hover:text-destructive/90"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {alarms.length === 0 && (
                                <div className="text-center text-muted-foreground py-8">
                                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                    <p>{t("noAlarms")}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
