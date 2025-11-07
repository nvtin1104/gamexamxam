"use client";

import { AppWindowIcon, ArrowLeftCircle, ArrowRightCircle, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { BasicTable } from "@/components/table/basesic"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import TextareaModal from "@/components/modal/textarea"
import { usePlayerStore } from "@/store/player"
import { useSettingStore } from "@/store/setting"
import { exportExcel } from "@/utils/excel";

export function PlayTab({
    historyFields,
    historyData,
}: {
    historyFields: {
        key: string;
        label: string;
    }[];
    historyData: any[];
}) {
    const [open, setOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const t = useTranslations("common.tab");
    const playerFields = [
        { key: "name", label: t("name") },
    ];
    const players = usePlayerStore((state) => state.players);
    const addPlayers = usePlayerStore((state) => state.addPlayers);
    const resetPlayers = usePlayerStore((state) => state.resetPlayers);
    const isMultiplayer = useSettingStore((state) => state.flipCardSettings.isMultiplayer);

    useEffect(() => {
        if (!isMultiplayer && players.length > 0) {
            resetPlayers();
        }
    }, [isMultiplayer, players.length, resetPlayers]);
    const exportHistory = () => {
        if (historyData.length === 0) {
            return;
        }

        const headers = [t("turn"), t("question"), t("player")];
        const rows = historyData.map((item) => [
            item.turn,
            item.question ?? "",
            item.player ?? "",
        ]);

        exportExcel(
            `flip-card-history-${new Date().toISOString().slice(0, 10)}.xlsx`,
            headers,
            rows,
            t("history")
        );
    };
    return (
        <div className="flex justify-center flex-row self-stretch gap-3 items-center">
            <Button
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className="hidden md:inline-flex"
                size="icon"
                title={open ? t("hideTable") : t("showTable")}
            >
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    <ChevronRight className="h-5 w-5" />
                </motion.div>
            </Button>
            <Button
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden"
                size="icon"
                title={mobileOpen ? t("hideTable") : t("showTable")}
            >
                <AppWindowIcon className="h-5 w-5" />
            </Button>
            <AnimatePresence>
                {mobileOpen && (
                    <div className="fixed left-0 top-0 h-full z-50 right-0 bg-background-overlay" onClick={() => setMobileOpen(false)}>
                        <motion.div
                            layout
                            initial={{ x: -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="h-full w-80 overflow-y-auto bg-background shadow-lg p-5"
                            style={{ willChange: "transform" }}
                            onClick={e => e.stopPropagation()}
                        >
                            <Tabs defaultValue="history" className="w-full">
                                <TabsList className="w-full justify-start overflow-x-auto gap-2">
                                    <TabsTrigger className="whitespace-nowrap" value="history">{t("history")}</TabsTrigger>
                                    {isMultiplayer && (
                                        <TabsTrigger className="whitespace-nowrap" value="player">{t("player")}</TabsTrigger>
                                    )}
                                </TabsList>
                                <TabsContent
                                    value="history"
                                    className="transition-opacity duration-300 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100"
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{t("history")}</CardTitle>
                                            <CardDescription>
                                                {t("historyDescription")}
                                            </CardDescription>
                                            <Button
                                                onClick={exportHistory}
                                                variant="outline"
                                                className="mt-2 flex items-center gap-2"
                                            >
                                                <Download/>
                                                {t("exportHistory")}
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="grid gap-6">
                                            <BasicTable
                                                fields={historyFields}
                                                data={historyData}
                                                emptyText={t("noHistory")}
                                            />
                                        </CardContent>
                                        <CardFooter>

                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                                {isMultiplayer && (
                                    <TabsContent
                                        value="player"
                                        className="transition-opacity duration-300 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100"
                                    >
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>{t("player")}</CardTitle>
                                                <CardDescription>
                                                    {t("playerDescription")}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="grid gap-6">
                                                <TextareaModal
                                                    title={t("addPlayer")}
                                                    placeholder={t("addPlayerPlaceholder")}
                                                    button={t("addPlayer")}
                                                    onSubmit={async (data) => {
                                                        addPlayers(data);
                                                    }}
                                                />
                                                <BasicTable
                                                    fields={playerFields}
                                                    data={players}
                                                    emptyText={t("noPlayer")}
                                                />
                                            </CardContent>
                                            <CardFooter>
                                                <Button onClick={() => setMobileOpen(false)}>Close</Button>
                                            </CardFooter>
                                        </Card>
                                    </TabsContent>
                                )}
                            </Tabs>
                        </motion.div>
                    </div>
                )}
                <div className={[
                    "hidden md:block overflow-hidden h-full",
                    open ? "md:w-[240px] lg:w-[360px]" : "md:w-0",
                ].join(" ")}
                >
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ type: "spring", stiffness: 250, damping: 25 }}
                                className="w-full h-full"
                                style={{ willChange: "transform,width" }}
                            >
                                <Tabs defaultValue="history" className="w-full h-full">
                                    <TabsList className="w-full justify-center md:justify-start overflow-x-auto md:overflow-visible gap-2">
                                        <TabsTrigger className="whitespace-nowrap" value="history">
                                            {t("history")}
                                        </TabsTrigger>
                                        {isMultiplayer && (
                                            <TabsTrigger className="whitespace-nowrap" value="player">
                                                {t("player")}
                                            </TabsTrigger>
                                        )}
                                    </TabsList>

                                    <TabsContent
                                        value="history"
                                        className="transition-opacity duration-300 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100"
                                    >
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>{t("history")}</CardTitle>
                                                <CardDescription>{t("historyDescription")}</CardDescription>
                                                <Button
                                                    onClick={exportHistory}
                                                    variant="outline"
                                                    className="mt-2 flex items-center gap-2"
                                                >
                                                    <Download />
                                                    {t("exportHistory")}
                                                </Button>
                                            </CardHeader>
                                            <CardContent className="grid gap-6">
                                                <BasicTable
                                                    fields={historyFields}
                                                    data={historyData}
                                                    emptyText={t("noHistory")}
                                                />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Player */}
                                    {isMultiplayer && (
                                        <TabsContent
                                            value="player"
                                            className="transition-opacity duration-300 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100"
                                        >
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>{t("player")}</CardTitle>
                                                    <CardDescription>{t("playerDescription")}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="grid gap-6">
                                                    <TextareaModal
                                                        title={t("addPlayer")}
                                                        placeholder={t("addPlayerPlaceholder")}
                                                        button={t("addPlayer")}
                                                        onSubmit={async (data) => {
                                                            addPlayers(data);
                                                        }}
                                                    />
                                                    <BasicTable
                                                        fields={playerFields}
                                                        data={players}
                                                        emptyText={t("noPlayer")}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                    )}
                                </Tabs>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </AnimatePresence>
        </div>
    )
}
