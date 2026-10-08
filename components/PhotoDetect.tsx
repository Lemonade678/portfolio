"use client";

// ─────────────────────────────────────────────────────────────
// รูปโปรไฟล์ + ของเล่นเล็ก ๆ: กดแล้วรัน YOLOv11 ตรวจจับจริงในเบราว์เซอร์
//
// ทำไมต้อง "กดก่อนถึงรัน":
//   โมเดล yolo11n.onnx หนัก ~10 MB ถ้าโหลดอัตโนมัติทุกคนที่เปิดเว็บ
//   จะเสีย bandwidth และทำให้ LCP แย่ ทั้งที่คนส่วนใหญ่เข้ามาอ่านข้อความเฉย ๆ
//   → โหลดตอนกดเท่านั้น (lazy) และ cache session ไว้ที่ module scope กดซ้ำไม่โหลดใหม่
//
// ทำไมพิกัดกล่องถึงแปลงง่าย:
//   public/me.jpg มีสัดส่วน 284:459 และกรอบบนหน้าเว็บล็อก aspect-ratio ตัวเดียวกันเป๊ะ
//   → object-cover ไม่ได้ครอปอะไรเพิ่ม พิกัด 0..1 จากโมเดลจึงกลายเป็น % บน CSS ได้ตรง ๆ
//   ถ้าเปลี่ยนรูปใหม่ ต้องแก้ DETECTOR.photoW / photoH ใน content.ts ด้วย ไม่งั้นกล่องเพี้ยน
//
// ถ้าโหลดโมเดลไม่ได้ (เน็ตช้า / CDN ล่ม / เบราว์เซอร์ไม่รองรับ wasm):
//   fallback ไปใช้ผลที่รันไว้ล่วงหน้าใน content.ts แล้ว "บอกตรง ๆ" บน UI ว่าเป็นค่าที่บันทึกไว้
//   ไม่แอบเนียนว่าเพิ่งรันสด เพราะพอร์ตนี้ขายเรื่องความซื่อสัตย์กับตัวเลขเป็นหลัก
// ─────────────────────────────────────────────────────────────

import { useCallback, useRef, useState, type CSSProperties } from "react";
import { DETECTOR, PERSON, type Lang, type L10n } from "@/lib/content";
import { COCO, decode, getSession, letterbox, loadOrt, type Det } from "@/lib/yolo";

const t = (s: L10n, lang: Lang) => s[lang];

type Status = "idle" | "loading" | "running" | "done" | "fallback";

/** ความกว้างของกรอบรูปบนหน้าเว็บ (px) — ความสูงคิดจากสัดส่วนรูปจริง */
const FRAME_W = 132;

/** ชื่อคลาสที่ใช้จริง — ถ้า content.ts กำหนด classNames มา (เช่นตอนสลับไปใช้โมเดล
 *  ที่เทรนเองด้วย lemon_detector/) ให้ใช้ตัวนั้น ไม่งั้นถอยกลับไปใช้ COCO */
const CLASS_NAMES: string[] = DETECTOR.classNames ?? COCO;

/** คลาสแรกของโมเดลคือตัวที่เว็บอยากเน้น (COCO = person · โมเดลเรา = Lemon(me):3)
 *  ใช้ตัดสินสีกล่อง แทนที่จะเทียบกับสตริง "person" ตรง ๆ
 *  ซึ่งจะเน้นผิดกล่องทันทีที่เปลี่ยนโมเดล */
const HERO_LABEL = CLASS_NAMES[0];

// โหลดโมเดล + pre/post-processing อยู่ใน lib/yolo.ts (ใช้ร่วมกับห้องทดลองใน playground และพิพิธภัณฑ์ YOLO)

// ── ตัวคอมโพเนนต์ ─────────────────────────────────────────────

export default function PhotoDetect({ lang }: { lang: Lang }) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [dets, setDets] = useState<Det[]>([]);
  const [ms, setMs] = useState<number | null>(null);

  const run = useCallback(async () => {
    // กดซ้ำตอนกล่องขึ้นอยู่ = ปิดกล่อง จะได้ดูรูปเปล่า ๆ ได้
    if (status === "done" || status === "fallback") {
      setDets([]);
      setStatus("idle");
      return;
    }
    if (status === "loading" || status === "running") return;

    const img = imgRef.current;
    if (!img) return;

    try {
      setStatus("loading");
      const [ort, session] = await Promise.all([loadOrt(), getSession()]);

      setStatus("running");
      // รอให้รูปโหลดเสร็จก่อน ไม่งั้น naturalWidth เป็น 0 แล้วสเกลพัง
      if (!img.complete) {
        await new Promise((res) => {
          img.onload = res;
          img.onerror = res;
        });
      }

      const meta = letterbox(img, DETECTOR.inputSize);
      const feeds = {
        [session.inputNames[0]]: new ort.Tensor("float32", meta.input, [
          1,
          3,
          DETECTOR.inputSize,
          DETECTOR.inputSize,
        ]),
      };

      const t0 = performance.now();
      const outputs = await session.run(feeds);
      const elapsed = performance.now() - t0;

      const tensor = outputs[session.outputNames[0]];
      const found = decode(tensor.data as Float32Array, tensor.dims, meta, DETECTOR.confThreshold, DETECTOR.iouThreshold, CLASS_NAMES);

      setDets(found);
      setMs(Math.round(elapsed));
      setStatus("done");
    } catch {
      // ไม่ log ลง console — พังแล้วก็แค่แสดงผลที่รันไว้ล่วงหน้า
      // และติดป้ายให้ชัดว่าเป็นค่าที่บันทึกไว้ ไม่ใช่ผลสด
      setDets(DETECTOR.fallback as Det[]);
      setMs(null);
      setStatus("fallback");
    }
  }, [status]);

  const busy = status === "loading" || status === "running";
  const showing = dets.length > 0;

  // ความสูงจริงของกรอบ ใช้บอกระยะที่เส้นสแกนต้องวิ่ง (CSS เดาเองไม่ได้
  // เพราะตัวเส้นสูงแค่ 2px การ translateY(100%) จะขยับแค่ 2px)
  const frameH = Math.round((FRAME_W * DETECTOR.photoH) / DETECTOR.photoW);

  const chipText =
    status === "loading"
      ? t(DETECTOR.ui.loading, lang)
      : status === "running"
        ? t(DETECTOR.ui.running, lang)
        : status === "fallback"
          ? t(DETECTOR.ui.cached, lang)
          : status === "done"
            ? `yolo11n · ${ms} ms`
            : t(DETECTOR.ui.idle, lang);

  return (
    <div className="relative z-10" style={{ width: FRAME_W }}>
      <button
        type="button"
        onClick={run}
        aria-label={t(DETECTOR.ui.aria, lang)}
        aria-busy={busy}
        className="group block w-full cursor-pointer text-left"
      >
        <div
          className="relative overflow-hidden rounded-2xl border-[3px] border-bg bg-surface2 shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
          style={
            {
              aspectRatio: `${DETECTOR.photoW} / ${DETECTOR.photoH}`,
              "--scan-h": `${frameH}px`,
            } as CSSProperties
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={PERSON.photo ?? ""}
            alt={PERSON.name}
            className="h-full w-full object-cover"
          />

          {/* เส้นสแกนตอนกำลังคิด — บอกว่ายังไม่ค้าง ไม่ได้เป็นตัวชี้วัดอะไร */}
          {busy && (
            <span className="scanline pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-yellow/90" />
          )}

          {/* กล่องผลตรวจจับ — วางด้วย % จากสัดส่วน 0..1 ที่ decode ไว้ */}
          {dets.map((d, i) => (
            <span
              key={`${d.label}-${i}`}
              className="detbox pointer-events-none absolute border-[1.5px]"
              style={{
                left: `${d.box[0] * 100}%`,
                top: `${d.box[1] * 100}%`,
                width: `${(d.box[2] - d.box[0]) * 100}%`,
                height: `${(d.box[3] - d.box[1]) * 100}%`,
                borderColor: d.label === HERO_LABEL ? "#F5B92E" : "#7BA0FF",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.35)",
              }}
            >
              <span
                className="absolute -top-[15px] left-[-1.5px] whitespace-nowrap px-1 py-px font-mono text-[8.5px] font-semibold leading-[1.35] text-bg"
                style={{ background: d.label === HERO_LABEL ? "#F5B92E" : "#7BA0FF" }}
              >
                {d.label} {d.score.toFixed(2)}
              </span>
            </span>
          ))}
        </div>

        <span
          className={`mt-2 block truncate rounded-md border px-2 py-1 text-center font-mono text-[9.5px] uppercase tracking-[0.1em] transition-colors ${
            showing
              ? "border-yellow/45 bg-yellow/10 text-yellow"
              : "border-line bg-surface2 text-muted group-hover:border-yellow/45 group-hover:text-yellow"
          }`}
        >
          {chipText}
        </span>
      </button>
    </div>
  );
}
