"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, AlertTriangle } from "lucide-react";
import { parseExcelFile } from "@/utils/parseExcel";
import * as XLSX from "xlsx";
import { useTranslations } from "next-intl";

interface ImportModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onImport: (data: any[]) => void;
    fields: { key: string; label: string; required?: boolean }[];
    sampleFileName?: string;
}

export default function ImportModal({
    open,
    onOpenChange,
    onImport,
    fields,
    sampleFileName = "mau_import.csv",
}: ImportModalProps) {
    const t = useTranslations("common");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    const handleImport = async (f: File) => {
        if (!f) return;
        setLoading(true);
        setErrors([]);

        try {
            const data = (await parseExcelFile(f)) as any[];

            const validationErrors: string[] = [];
            const requiredKeys = fields.filter(f => f.required).map(f => f.key);

            const headers = Object.keys(data[0] || {});
            for (const req of requiredKeys) {
                if (!headers.includes(req)) {
                    validationErrors.push(`${t("import.missingColumn")}: "${req}"`);
                }
            }

            data.forEach((row, index) => {
                requiredKeys.forEach(req => {
                    if (!row[req] || String(row[req]).trim() === "") {
                        validationErrors.push(`${t("import.emptyRow")}: ${index + 2}: ${t("import.emptyColumn")}: "${req}"`);
                    }
                });
            });

            if (validationErrors.length > 0) {
                setErrors(validationErrors);
                setData([]);
                return;
            }

            setData(data);
        } catch (err) {
            console.error("Error reading Excel:", err);
            setErrors([t("import.errorReadingFile")]);
        } finally {
            setLoading(false);
        }
    };


    const downloadSampleFile = () => {
        const headers = fields.map(f => f.key);

        const sampleRow = Object.fromEntries(headers.map(h => [h, ""]));

        const ws = XLSX.utils.json_to_sheet([sampleRow], { header: headers });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, t("import.sampleFileName"));

        XLSX.writeFile(wb, `${sampleFileName}.xlsx`);
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>📥 {t("import.title")}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex gap-2 items-stretch">
                        <Input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={
                                (e) => {
                                    handleImport(e.target.files?.[0] as File);
                                }
                            }
                            className="h-10"
                        />
                        <Button
                            onClick={downloadSampleFile}
                            className="flex items-center gap-1 h-10"
                        >
                            <Download className="w-4 h-4" />
                            {t("import.sampleFileDescription")}
                        </Button>
                    </div>

                    <div className="border rounded-md p-3 text-xs bg-muted/50">
                        <div className="font-medium mb-2 text-muted-foreground">{t("import.requiredStructure")}</div>
                        <ul className="grid grid-cols-2 gap-1">
                            {fields.map((f) => (
                                <li key={f.key}>
                                    • {f.label} {f.required && <span className="text-red-500">*</span>}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {errors.length > 0 && (
                        <div className="border border-red-300 bg-red-50 text-red-600 rounded-md p-3 text-sm max-h-48 overflow-auto">
                            <div className="flex items-center gap-1 font-medium mb-1">
                                <AlertTriangle className="w-4 h-4" /> {t("import.error")}:
                            </div>
                            <ul className="list-disc pl-5 space-y-0.5">
                                {errors.map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {data.slice(0, 5).length > 0 && (
                        <div className="border rounded-md p-3 text-sm max-h-64 overflow-auto">
                            <div className="font-medium mb-2 text-muted-foreground">{t("import.preview")}:</div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-muted">
                                            {Object.keys(data.slice(0, 5)[0] || {}).map((key, index) => (
                                                <th key={index} className="border p-2 text-left font-medium">
                                                    {fields.find(f => f.key === key)?.label || key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.slice(0, 5).map((row, rowIndex) => (
                                            <tr key={rowIndex} className="border-b">
                                                {Object.values(row).map((value, cellIndex) => (
                                                    <td key={cellIndex} className="border p-2">
                                                        {String(value)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="destructive" onClick={() => onOpenChange(false)}>
                        {t("import.cancel")}
                    </Button>
                    <Button onClick={() => onImport(data)} disabled={loading}>
                        {loading ? t("loading") : t("save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
