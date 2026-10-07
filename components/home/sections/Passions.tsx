"use client";

// 06 แพชชั่น — ตัวชั่วคราว (ประโยคเปิด) จนกว่าจะทำการ์ดสามใบใน Task 5
import { HOME, type Lang } from "@/lib/content";
import { t } from "@/components/home/ui";

export default function Passions({ lang }: { lang: Lang }) {
  return <p className="max-w-[62ch] text-ink2">{t(HOME.passions.intro, lang)}</p>;
}
