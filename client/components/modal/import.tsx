"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, AlertTriangle } from "lucide-react";
import { parseExcelFile } from "@/utils/parseExcel";
import * as XLSX from "xlsx";

interface ImportModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onImport: (data: any[]) => void;
  /** Danh sách trường: { key, label, required } */
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
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setErrors([]);

    try {
      const data = (await parseExcelFile(file)) as any[];

      const validationErrors: string[] = [];
      const requiredKeys = fields.filter(f => f.required).map(f => f.label);

      const headers = Object.keys(data[0] || {});
      for (const req of requiredKeys) {
        if (!headers.includes(req)) {
          validationErrors.push(`Thiếu cột bắt buộc: "${req}"`);
        }
      }

      data.forEach((row, index) => {
        requiredKeys.forEach(req => {
          if (!row[req] || String(row[req]).trim() === "") {
            validationErrors.push(`Dòng ${index + 2}: Cột "${req}" bị trống`);
          }
        });
      });

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setPreview([]);
        return;
      }

      setPreview(data.slice(0, 5));
      onImport(data);
    } catch (err) {
      console.error("Error reading Excel:", err);
      setErrors(["Không thể đọc file. Hãy chắc chắn rằng định dạng hợp lệ (.xlsx, .csv)."]);
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleFile = () => {
    // Tạo dữ liệu mẫu với các trường được định nghĩa
    const headers = fields.map(f => f.label);
    const sampleData = [
      // Dòng tiêu đề
      Object.fromEntries(headers.map(h => [h, h])),
      // Dòng mẫu với dữ liệu ví dụ
      Object.fromEntries(headers.map(h => [h, `Mẫu ${h}`])),
      // Dòng trống để người dùng điền
      Object.fromEntries(headers.map(h => [h, ""])),
    ];

    // Tạo workbook và worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sampleData);
    
    // Đặt độ rộng cột tự động
    const colWidths = headers.map(() => ({ wch: 20 }));
    ws['!cols'] = colWidths;

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, "Dữ liệu mẫu");

    // Xuất file XLSX
    XLSX.writeFile(wb, sampleFileName.replace('.csv', '.xlsx'));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>📥 Import dữ liệu từ Excel/CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload input + download sample */}
          <div className="flex gap-2">
            <Input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="flex-1"
            />
            <Button variant="outline" size="sm" onClick={downloadSampleFile} className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              Tải mẫu XLSX
            </Button>
          </div>

          {/* Thông tin field */}
          <div className="border rounded-md p-3 text-xs bg-muted/50">
            <div className="font-medium mb-2 text-muted-foreground">Cấu trúc file yêu cầu:</div>
            <ul className="grid grid-cols-2 gap-1">
              {fields.map((f) => (
                <li key={f.key}>
                  • {f.label} {f.required && <span className="text-red-500">*</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* Lỗi */}
          {errors.length > 0 && (
            <div className="border border-red-300 bg-red-50 text-red-600 rounded-md p-3 text-sm max-h-48 overflow-auto">
              <div className="flex items-center gap-1 font-medium mb-1">
                <AlertTriangle className="w-4 h-4" /> Lỗi import:
              </div>
              <ul className="list-disc pl-5 space-y-0.5">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div className="border rounded-md p-3 text-sm max-h-64 overflow-auto">
              <div className="font-medium mb-2 text-muted-foreground">Xem trước dữ liệu:</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      {Object.keys(preview[0] || {}).map((key, index) => (
                        <th key={index} className="border p-2 text-left font-medium">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, rowIndex) => (
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleImport} disabled={!file || loading}>
            {loading ? "Đang xử lý..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
