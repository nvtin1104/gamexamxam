import { AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DEFAULT_FLIP_CARD_SETTINGS,
    useSettingStore,
    type FlipCardSettings,
} from "@/store/setting";

type NumericSettingField = {
    key: Exclude<keyof FlipCardSettings, "isMultiplayer">;
    min: number;
    max: number;
    step: number;
    type: "duration" | "count";
};

type BooleanSettingField = {
    key: "isMultiplayer";
    type: "boolean";
};

type SettingField = NumericSettingField | BooleanSettingField;

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
    const { flipCardSettings, setFlipCardSettings } = useSettingStore((state) => state);
    const t = useTranslations("games.flipCard");

    const settingFields = useMemo<SettingField[]>(
        () => [
            { key: "isMultiplayer", type: "boolean" },
            { key: "delay", min: 0, max: 3000, step: 50, type: "duration" },
            { key: "shuffleCount", min: 1, max: 10, step: 1, type: "count" },
            { key: "shuffleDelay", min: 0, max: 2000, step: 50, type: "duration" },
            { key: "animationDuration", min: 100, max: 2000, step: 50, type: "duration" },
        ],
        []
    );

    const formatValue = (
        key: keyof FlipCardSettings,
        value: FlipCardSettings[keyof FlipCardSettings]
    ) => {
        if (typeof value === "boolean") {
            return t(`settingsPanel.${key}.${value ? "on" : "off"}`);
        }

        if (key === "shuffleCount") {
            return value.toString();
        }

        const seconds = value / 1000;
        const formatted = seconds.toFixed(2).replace(/\.0+$/, "").replace(/\.([1-9])0$/, ".$1");
        return `${formatted} s`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-0 top-0 h-full w-80 bg-background shadow-lg p-5 flex flex-col gap-5 border-l border-border"
                >
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-primary">
                            <Settings className="h-5 w-5" />
                            <h2 className="text-lg font-semibold">
                                {t("settings")}
                            </h2>
                        </div>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                            aria-label={t("close")}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 space-y-5 overflow-y-auto pr-1">
                        {settingFields.map((field) => {
                            const value = flipCardSettings[field.key];

                            if (field.type === "boolean") {
                                const boolValue = Boolean(value);
                                return (
                                    <div key={field.key} className="space-y-3">
                                        <div className="flex items-center justify-between text-sm font-medium">
                                            <span>{t(`settingsPanel.${field.key}.label`)}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatValue(field.key, boolValue)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {t(`settingsPanel.${field.key}.description`)}
                                        </p>
                                        <label className="flex items-center gap-3 rounded border border-input bg-background px-3 py-2 text-sm">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 accent-primary"
                                                checked={boolValue}
                                                onChange={(event) => {
                                                    setFlipCardSettings({
                                                        [field.key]: event.target.checked,
                                                    } as Partial<FlipCardSettings>);
                                                }}
                                            />
                                            <span>{t(`settingsPanel.${field.key}.toggleLabel`)}</span>
                                        </label>
                                    </div>
                                );
                            }

                            const { min, max, step, type } = field;
                            const numericValue = Number(value);
                            const isDurationField = type === "duration";
                            const displayValue = isDurationField ? numericValue / 1000 : numericValue;
                            const minDisplay = isDurationField ? min / 1000 : min;
                            const maxDisplay = isDurationField ? max / 1000 : max;
                            const stepDisplay = isDurationField ? step / 1000 : step;

                            return (
                                <div key={field.key} className="space-y-3">
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span>{t(`settingsPanel.${field.key}.label`)}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatValue(field.key, numericValue)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {t(`settingsPanel.${field.key}.description`)}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min={minDisplay}
                                            max={maxDisplay}
                                            step={stepDisplay}
                                            value={displayValue}
                                            onChange={(event) => {
                                                const nextValue = Number(event.target.value);
                                                if (Number.isNaN(nextValue)) return;
                                                const rawValue = isDurationField
                                                    ? nextValue * 1000
                                                    : nextValue;
                                                const clampedValue = Math.min(max, Math.max(min, rawValue));
                                                const snappedValue = Math.round(clampedValue / step) * step;
                                                setFlipCardSettings({
                                                    [field.key]: isDurationField
                                                        ? snappedValue
                                                        : Math.round(snappedValue),
                                                } as Partial<FlipCardSettings>);
                                            }}
                                            className="flex-1 accent-primary"
                                        />
                                        <input
                                            type="number"
                                            min={minDisplay}
                                            max={maxDisplay}
                                            step={stepDisplay}
                                            value={displayValue}
                                            onChange={(event) => {
                                                const nextValue = Number(event.target.value);
                                                if (Number.isNaN(nextValue)) return;
                                                const rawValue = isDurationField
                                                    ? nextValue * 1000
                                                    : nextValue;
                                                const clampedValue = Math.min(max, Math.max(min, rawValue));
                                                const snappedValue = Math.round(clampedValue / step) * step;
                                                setFlipCardSettings({
                                                    [field.key]: isDurationField
                                                        ? snappedValue
                                                        : Math.round(snappedValue),
                                                } as Partial<FlipCardSettings>);
                                            }}
                                            className="w-20 rounded border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFlipCardSettings({ ...DEFAULT_FLIP_CARD_SETTINGS })}
                        >
                            {t("settingsPanel.restoreDefaults")}
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
export default GameSetting;