"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { useTranslations } from "next-intl";

interface TextareaModalProps {
    onSubmit: (items: string[]) => void;
    button?: string;
    title?: string;
    placeholder?: string;
}

export default function TextareaModal({
    onSubmit,
    button,
    title = "Nhập danh sách",
    placeholder = "Mỗi dòng là một mục...\nVí dụ:\nCâu hỏi 1\nCâu hỏi 2\nCâu hỏi 3",
}: TextareaModalProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const t = useTranslations("common");
    const items = useMemo(() => {
        return value
            .split(/\r?\n/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
    }, [value]);

    const handleSave = () => {
        onSubmit(items);
        setOpen(false);
        setValue("");
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Textarea
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={placeholder}
                            className="min-h-[240px] resize-none"
                            rows={12}
                        />
                        <div className="text-xs text-muted-foreground">Tổng mục: {items.length}</div>
                    </div>
                    <DialogFooter>
                        <Button variant="destructive" onClick={handleClose}>{t("cancel")}</Button>
                        <Button onClick={handleSave} disabled={items.length === 0}>{button}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button className="w-full" onClick={() => setOpen(true)}>{button}</Button>
        </>
    );
}