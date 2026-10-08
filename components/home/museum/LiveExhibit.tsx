"use client";

// นิทรรศการ 04 — สด: ความมั่นใจกับ NMS บนผลจริงของโมเดล
//
// กดรัน → yolo11n รันบนรูปโปรไฟล์ในเบราว์เซอร์ผู้ชม → เก็บ "ผลดิบก่อน NMS" ทุกกล่องที่คะแนน ≥ 0.05 ไว้
// จากนั้นแถบเลื่อนสองอันกรองผลดิบชุดนั้นใหม่สด ๆ ไม่ต้องรันโมเดลซ้ำ:
//   ความมั่นใจ  → ตัดกล่องที่คะแนนต่ำกว่าเกณฑ์
//   NMS IoU    → กล่องคลาสเดียวกันที่ทับกันเกินค่านี้ เก็บไว้แค่ตัวที่คะแนนสูงสุด
// กล่องหนาสีเหลือง = รอด NMS · เส้นจาง = ผ่านเกณฑ์แต่แพ้ NMS (ให้เห็นว่า NMS ลบอะไรทิ้งไปบ้าง)
//
// ใช้โมเดลก้อนเดียวกับปุ่มบนรูปโปรไฟล์และห้องทดลองใน playground (lib/yolo.ts) — กดที่ไหนก่อนก็โหลดครั้งเดียว

import { useMemo, useRef, useState } from "react";
import Exhibit, { Slider } from "@/components/home/museum/Exhibit";
import { t } from "@/components/home/ui";
import { DETECTOR, PERSON, YOLO_MUSEUM, type Lang } from "@/lib/content";
import { COCO, decodeRaw, getSession, letterbox, loadOrt, nms, type Det } from "@/lib/yolo";

const FLOOR = 0.05;
/** วาดเส้นจางไม่เกินเท่านี้ — กันหน้าเว็บหน่วงตอนตั้งเกณฑ์ต่ำมาก ๆ */
const MAX_FAINT = 250;
const CLASS_NAMES: readonly string[] = DETECTOR.classNames ?? COCO;

type Status = "idle" | "loading" | "ready" | "failed";

export default function LiveExhibit({ lang }: { lang: Lang }) {
  const E = YOLO_MUSEUM.live;
  const [status, setStatus] = useState<Status>("idle");
  const [raw, setRaw] = useState<Det[]>([]);
  const [conf, setConf] = useState(DETECTOR.confThreshold);
  const [thr, setThr] = useState(DETECTOR.iouThreshold);
  const photo = useRef<HTMLImageElement>(null);

  const run = async () => {
    if (status === "loading") return;
    try {
      setStatus("loading");
      const [ort, session] = await Promise.all([loadOrt(), getSession()]);
      // ใช้รูปที่โชว์อยู่ในนิทรรศการเลย (โหลดแล้ว ไม่ต้องขอไฟล์ซ้ำ) — ยังโหลดไม่เสร็จก็รอ onload
      // ไม่ใช้ new Image().decode(): Chrome ไม่ยอม decode รูปนอก DOM ตอนแท็บถูกพับไว้ ปุ่มจะค้าง "กำลังโหลด" ไปเรื่อย ๆ
      const im = photo.current;
      if (!im) throw new Error("no photo");
      if (!im.complete || im.naturalWidth === 0) {
        await new Promise((res, rej) => {
          im.addEventListener("load", res, { once: true });
          im.addEventListener("error", rej, { once: true });
        });
      }
      const meta = letterbox(im, DETECTOR.inputSize);
      const outputs = await session.run({
        [session.inputNames[0]]: new ort.Tensor("float32", meta.input, [1, 3, DETECTOR.inputSize, DETECTOR.inputSize]),
      });
      const tensor = outputs[session.outputNames[0]];
      setRaw(decodeRaw(tensor.data as Float32Array, tensor.dims, meta, FLOOR, CLASS_NAMES));
      setStatus("ready");
    } catch {
      setStatus("failed");
    }
  };

  const passed = useMemo(() => raw.filter((d) => d.score >= conf), [raw, conf]);
  const kept = useMemo(() => nms(passed, thr), [passed, thr]);
  const faint = useMemo(() => {
    const k = new Set(kept);
    return passed.filter((d) => !k.has(d)).slice(0, MAX_FAINT);
  }, [passed, kept]);
  const ready = status === "ready";
  const pct = (v: number) => `${v * 100}%`;

  return (
    <Exhibit n={E.n} title={E.title} body={E.body} note={E.note} lang={lang} className="md:col-span-2">
      <div className="flex flex-wrap items-start gap-6">
        <div
          className="relative w-[210px] flex-none overflow-hidden rounded-xl border border-line"
          style={{ aspectRatio: `${DETECTOR.photoW} / ${DETECTOR.photoH}` }}
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={photo} src={PERSON.photo ?? ""} alt="" className="h-full w-full object-cover" />
          {faint.map((d, i) => (
            <span
              key={`f${i}`}
              className="absolute border border-blue/40"
              style={{ left: pct(d.box[0]), top: pct(d.box[1]), width: pct(d.box[2] - d.box[0]), height: pct(d.box[3] - d.box[1]) }}
            />
          ))}
          {kept.map((d, i) => (
            <span
              key={`k${i}`}
              className="absolute border-2 border-yellow"
              style={{ left: pct(d.box[0]), top: pct(d.box[1]), width: pct(d.box[2] - d.box[0]), height: pct(d.box[3] - d.box[1]) }}
            >
              <span className="absolute left-[-2px] top-[-15px] whitespace-nowrap bg-yellow px-1 font-mono text-[9px] font-semibold leading-[1.4] text-bg">
                {d.label} {d.score.toFixed(2)}
              </span>
            </span>
          ))}
        </div>

        <div className="min-w-[220px] flex-1">
          {!ready && (
            <button
              type="button"
              onClick={run}
              disabled={status === "loading"}
              className="rounded-xl border border-yellow bg-yellow px-4 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-bg disabled:opacity-60"
            >
              ▶ {status === "loading" ? t(E.loading, lang) : t(E.run, lang)}
            </button>
          )}
          {status === "failed" && <p className="mt-3 text-[13px] text-pink">{t(E.failed, lang)}</p>}

          {/* จำนวนกล่องแต่ละขั้น: ผลดิบ → ผ่านเกณฑ์ → หลัง NMS */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-center" aria-live="polite">
            {[
              [raw.length, E.raw],
              [passed.length, E.kept],
              [kept.length, E.final],
            ].map(([n, label], i) => (
              <div key={i} className="rounded-lg border border-line bg-bg px-2 py-2">
                <div className={`font-mono text-[20px] font-bold ${i === 2 ? "text-yellow" : "text-ink"}`}>{ready ? (n as number) : "–"}</div>
                <div className="mt-0.5 text-[10.5px] leading-tight text-muted">{t(label as typeof E.raw, lang)}</div>
              </div>
            ))}
          </div>

          <Slider label={t(E.conf, lang)} value={conf} shown={conf.toFixed(2)} min={FLOOR} max={0.9} step={0.05} disabled={!ready} onChange={setConf} />
          <Slider label={t(E.nms, lang)} value={thr} shown={thr.toFixed(2)} min={0.1} max={0.9} step={0.05} disabled={!ready} onChange={setThr} />
        </div>
      </div>
    </Exhibit>
  );
}
