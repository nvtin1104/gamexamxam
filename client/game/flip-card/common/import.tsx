"use client";
import { useState } from "react";
import ImportModal from "@/components/modal/import";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ImportData() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const t = useTranslations("games.flipCard");

  const fields = [
    { key: "question", label: t("question"), required: true },
  ];

  return (
    <>
    
    </>
  );
}
