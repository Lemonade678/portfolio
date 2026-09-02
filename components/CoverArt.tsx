import { ACCENT_HEX } from "@/lib/content";

/**
 * แบนเนอร์หัวเว็บ — วาดเป็น SVG ไม่ใช้ไฟล์รูป
 * ไอเดียคือทำให้หน้าแรกดูเหมือนภาพที่ผ่านโมเดล detection มาแล้ว
 * ซึ่งเป็นสิ่งที่เราทำงานด้วยทุกวัน ไม่ใช่ลายกราฟิกลอย ๆ
 */

type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  opacity: number;
  label?: string;
};

const BOXES: Box[] = [
  { x: 90, y: 52, w: 150, h: 96, color: ACCENT_HEX.blue, opacity: 0.55, label: "detect 0.94" },
  { x: 300, y: 120, w: 118, h: 118, color: ACCENT_HEX.yellow, opacity: 0.5, label: "track 0.88" },
  { x: 470, y: 40, w: 196, h: 120, color: ACCENT_HEX.pink, opacity: 0.45, label: "lane 0.91" },
  { x: 712, y: 140, w: 132, h: 88, color: ACCENT_HEX.blue, opacity: 0.4, label: "defect 0.85" },
  { x: 900, y: 58, w: 168, h: 140, color: ACCENT_HEX.yellow, opacity: 0.35, label: "frame 0417" },
  { x: 205, y: 180, w: 86, h: 72, color: ACCENT_HEX.pink, opacity: 0.3 },
  { x: 628, y: 196, w: 72, h: 60, color: ACCENT_HEX.yellow, opacity: 0.25 },
];

const LINKS = [
  "M240 100 L300 179",
  "M418 179 L470 100",
  "M666 100 L712 184",
  "M844 184 L900 128",
  "M291 216 L628 226",
];

export default function CoverArt() {
  return (
    <div
      className="relative h-[clamp(190px,30vw,300px)] overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 140% at 15% 0%, #33251C 0%, #1A1310 60%)",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <g fill="none" strokeWidth={1.2}>
          {BOXES.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              stroke={b.color}
              opacity={b.opacity}
            />
          ))}
        </g>

        <g stroke="#5C4638" strokeWidth={1} opacity={0.7}>
          {LINKS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        <g fontFamily="var(--font-mono)" fontSize={9} letterSpacing={1}>
          {BOXES.filter((b) => b.label).map((b, i) => (
            <text
              key={i}
              x={b.x}
              y={b.y - 7}
              fill={b.color}
              opacity={Math.min(b.opacity + 0.3, 0.85)}
            >
              {b.label}
            </text>
          ))}
        </g>
      </svg>

      {/* ไล่เฉดลงพื้นหลัง เพื่อให้รูปโปรไฟล์ทับได้เนียน */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-bg" />
    </div>
  );
}
