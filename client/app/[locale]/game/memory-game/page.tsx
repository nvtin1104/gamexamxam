import MemoryGame from "@/game/memory-game";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Locale } from "@/i18n/routing";

export async function generateMetadata({
    params,
}: {
    params: { locale: Locale };
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "games.memoryGame.metadata" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default function MemoryGamePage() {
    return <div>
        <MemoryGame />
    </div>;
}