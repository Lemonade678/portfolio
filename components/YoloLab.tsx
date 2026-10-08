"use client";

// ─────────────────────────────────────────────────────────────
// ห้องทดลอง YOLO ในหน้า playground — ผู้ชมเลือกรูปของตัวเอง แล้ว yolo11n ตีกล่องให้ดู
//
// ความเป็นส่วนตัว (หน้าเว็บเขียนบอกผู้ชมด้วย):
//   รูปอ่านด้วย URL.createObjectURL → อยู่ในหน่วยความจำของเบราว์เซอร์ ไม่มีการอัปโหลดไปไหน
//   สิ่งเดียวที่ดาวน์โหลดคือไฟล์โมเดล (จากเว็บเรา) กับ onnxruntime (จาก CDN) ตัวเดียวกับรูปโปรไฟล์หน้าแรก
//
// <input type="file" accept="image/*"> ตัวเดียว: บนมือถือเบราว์เซอร์ให้เลือกเองว่าจะถ่ายใหม่หรือเลือกจากคลัง
// ไฟล์ที่ไม่ใช่รูป / รูปที่เปิดไม่ได้ → บอกตรง ๆ ไม่พัง · เลือกรูปใหม่ → คืนหน่วยความจำของ URL เก่าทุกครั้ง
// รูปใหญ่แค่ไหนก็ได้ (12 MP จากมือถือ) — letterbox ย่อเหลือ 640×640 ก่อนเข้าโมเดลอยู่แล้ว
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { DETECTOR, PLAYGROUND, type L10n, type Lang } from "@/lib/content";
import { LAB_FOOD, labVerdict } from "@/lib/lab";
import { COCO, decode, getSession, letterbox, loadOrt, type Det } from "@/lib/yolo";

const t = (s: L10n, lang: Lang) => s[lang];
const L = PLAYGROUND.lab;
/** ใช้ชื่อคลาสชุดเดียวกับรูปโปรไฟล์ — ถ้าวันหนึ่งสลับไปโมเดลที่เทรนเอง ชื่อจะตามไปด้วย */
const CLASS_NAMES: readonly string[] = DETECTOR.classNames ?? COCO;

type Status = "idle" | "loading" | "running" | "done" | "notImage" | "failed";

export default function YoloLab({ lang }: { lang: Lang }) {
  const [status, setStatus] = useState<Status>("idle");
  const [url, setUrl] = useState<string | null>(null);
  const [dets, setDets] = useState<Det[]>([]);
  const [ms, setMs] = useState<number | null>(null);
  /** ความสูงรูปที่แสดงจริง — เส้นสแกนต้องรู้ว่าวิ่งลงไกลแค่ไหน (ดู .scanline ใน globals.css) */
  const [shownH, setShownH] = useState(0);
  const img = useRef<HTMLImageElement>(null);
  const urlRef = useRef<string | null>(null);

  // ออกจากหน้า → คืนหน่วยความจำของรูปที่เลือกไว้
  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // เลือกไฟล์เดิมซ้ำก็ยังทำงาน
    if (!file) return;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setDets([]);
    setMs(null);
    if (!file.type.startsWith("image/")) {
      setUrl(null);
      setStatus("notImage");
      return;
    }
    const u = URL.createObjectURL(file);
    urlRef.current = u;
    setUrl(u);
    setStatus("loading");
  };

  // รูปโหลดเสร็จ (onLoad) ค่อยรันโมเดล — ต้องรู้ขนาดจริงของรูปก่อน letterbox
  const run = async () => {
    const el = img.current;
    if (!el) return;
    setShownH(el.clientHeight);
    try {
      setStatus("loading");
      const [ort, session] = await Promise.all([loadOrt(), getSession()]);
      setStatus("running");
      const meta = letterbox(el, DETECTOR.inputSize);
      const feeds = {
        [session.inputNames[0]]: new ort.Tensor("float32", meta.input, [1, 3, DETECTOR.inputSize, DETECTOR.inputSize]),
      };
      const t0 = performance.now();
      const outputs = await session.run(feeds);
      const elapsed = performance.now() - t0;
      const tensor = outputs[session.outputNames[0]];
      setDets(decode(tensor.data as Float32Array, tensor.dims, meta, DETECTOR.confThreshold, DETECTOR.iouThreshold, CLASS_NAMES));
      setMs(Math.round(elapsed));
      setStatus("done");
    } catch {
      // ไม่ log รายละเอียดรูปลง console — แค่บอกผู้ชมว่าโหลดโมเดลไม่ได้
      setStatus("failed");
    }
  };

  const verdict = status === "done" ? labVerdict(dets) : null;
  const line = !verdict
    ? null
    : verdict.kind === "food"
      ? t(LAB_FOOD[verdict.label], lang)
      : verdict.kind === "person"
        ? t(L.person, lang)
        : verdict.kind === "other"
          ? t(L.other, lang).replace("{label}", verdict.label)
          : t(L.none, lang);
  const busy = status === "loading" || status === "running";

  return (
    <section className="mt-4 rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{t(L.title, lang)}</h3>
      <p className="mt-3 max-w-[58ch] text-[14px] leading-relaxed text-ink2">{t(L.intro, lang)}</p>

      <label
        className={`mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors ${
          busy ? "pointer-events-none opacity-60" : ""
        } border-yellow bg-yellow text-bg hover:brightness-105`}
      >
        📷 {url ? t(L.another, lang) : t(L.choose, lang)}
        <input type="file" accept="image/*" onChange={pick} disabled={busy} className="sr-only" />
      </label>
      <p className="mt-2 text-[12px] text-muted">🔒 {t(L.privacy, lang)}</p>

      {url && (
        <div className="mt-6">
          {/* กรอบเท่ารูปที่แสดง — กล่องผลวางด้วย % ของรูปจริง เลยตรงกันทุกขนาดจอ */}
          <div
            className="relative inline-block max-w-full overflow-hidden rounded-xl border border-line"
            style={{ "--scan-h": `${shownH}px` } as React.CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={img}
              src={url}
              alt=""
              onLoad={run}
              onError={() => setStatus("notImage")}
              className="block max-h-[60dvh] w-auto max-w-full"
            />
            {busy && <span className="scanline pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-yellow/90" />}
            {dets.map((d, i) => (
              <span
                key={`${d.label}-${i}`}
                className="detbox pointer-events-none absolute border-2"
                style={{
                  left: `${d.box[0] * 100}%`,
                  top: `${d.box[1] * 100}%`,
                  width: `${(d.box[2] - d.box[0]) * 100}%`,
                  height: `${(d.box[3] - d.box[1]) * 100}%`,
                  borderColor: d.label in LAB_FOOD ? "#F5B92E" : "#7BA0FF",
                }}
              >
                <span
                  className="absolute left-[-2px] top-[-17px] whitespace-nowrap px-1 py-px font-mono text-[10px] font-semibold leading-[1.35] text-bg"
                  style={{ background: d.label in LAB_FOOD ? "#F5B92E" : "#7BA0FF" }}
                >
                  {d.label} {d.score.toFixed(2)}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ผลลัพธ์ — ประกาศให้ screen reader ด้วย */}
      <div aria-live="polite" className="mt-4 min-h-[24px]">
        {status === "loading" && <p className="font-mono text-[12px] text-muted">{t(L.loading, lang)}</p>}
        {status === "running" && <p className="font-mono text-[12px] text-muted">{t(L.running, lang)}</p>}
        {status === "notImage" && <p className="text-[13.5px] text-pink">{t(L.notImage, lang)}</p>}
        {status === "failed" && <p className="text-[13.5px] text-pink">{t(L.failed, lang)}</p>}
        {status === "done" && line && (
          <>
            <p className="text-[clamp(17px,2.6vw,21px)] font-bold text-yellow">{line}</p>
            <p className="mt-1 font-mono text-[11px] text-muted">
              {dets.length} {t(L.found, lang)} · yolo11n · {ms} ms
            </p>
          </>
        )}
      </div>
    </section>
  );
}
