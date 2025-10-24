"use client";
import { useState } from "react";
import ImportModal from "@/components/modal/import";
import { Button } from "@/components/ui/button";

export default function ImportData() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const fields = [
    { key: "question", label: "Câu hỏi", required: true },
    { key: "answer_a", label: "Đáp án A", required: true },
    { key: "answer_b", label: "Đáp án B", required: true },
    { key: "answer_c", label: "Đáp án C", required: false },
    { key: "answer_d", label: "Đáp án D", required: false },
    { key: "correct", label: "Đáp án đúng", required: true },
  ];

  return (
    <div className="p-6 space-y-4">
      <Button onClick={() => setOpen(true)}>Import Excel</Button>

      <ImportModal
        open={open}
        onOpenChange={setOpen}
        onImport={setData}
        fields={fields}
        sampleFileName="mau_cau_hoi"
      />

      {data.length > 0 && (
        <div className="mt-4 border rounded-md p-3">
          <h3 className="font-semibold mb-2">Dữ liệu đã import:</h3>
          <pre className="text-xs">{JSON.stringify(data.slice(0, 3), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
