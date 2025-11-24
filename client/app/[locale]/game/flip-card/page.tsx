import FlipCardGame from "@/game/flip-card";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { Locale } from "@/i18n/routing";

export async function generateMetadata({
    params,
}: {
    params: { locale: Locale };
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "games.flipCard.metadata" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function FlipCardPage() {
    const t = await getTranslations("games.flipCard");
    return <div>
        <div className="flex items-center justify-between bg-background p-6">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-primary">{t("title")}</h1>
                <p className="text-sm text-muted-foreground">{t("description")}</p>
            </div>
        </div>
        <FlipCardGame />
    </div>;
}