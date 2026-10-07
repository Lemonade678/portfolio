// ─────────────────────────────────────────────────────────────
// คลิปล่าสุดของช่อง TheOzzy จาก RSS ของ YouTube
//
// ทำไม RSS ไม่ใช่ YouTube Data API: RSS เป็นของสาธารณะ ไม่ต้องมี API key ไม่มีโควตา
// แลกกับข้อจำกัดคือได้แค่ 15 คลิปล่าสุด — คลิปเก่าที่เป็นตำนานไปใส่เองใน OZZY.featured
//
// แบ่งเป็นสองชั้นตั้งใจ:
//   - ฟังก์ชันล้วน (decodeEntities · gameOf · parseFeed · weeklyCount) เทสต์ได้โดยไม่ต้องต่อเน็ต
//   - fetchFeed() ฝั่งเซิร์ฟเวอร์เท่านั้น แคชไว้ชั่วโมงละครั้ง (ISR) และไม่ throw ออกไปถึงหน้าเว็บเด็ดขาด
//
// ไม่ใช้ไลบรารี XML: feed ของ YouTube โครงตายตัวมาหลายปี regex ทีละ <entry> พอ
// ถ้าวันหนึ่งโครงเปลี่ยน parseFeed จะคืน [] แล้วหน้าต่างคลิปขึ้นข้อความสำรอง ไม่ใช่หน้าพัง
// ─────────────────────────────────────────────────────────────

export const FEED_URL =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCFTHMGDbsXFPMbfi1TCeBGw";

export interface Video {
  id: string;
  title: string;
  /** ISO 8601 ตามที่ feed ให้มา */
  published: string;
  views: number;
  isShort: boolean;
  thumb: string;
  /** ชื่อเกมจากท้ายชื่อคลิป · null = จับไม่ได้ (UI โชว์ว่า "อื่น ๆ") */
  game: string | null;
}

export interface Feed {
  ok: boolean;
  videos: Video[];
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&lt;": "<",
  "&gt;": ">",
};

/** ถอด entity ที่ feed ใช้จริง + รูปตัวเลข (&#...;) — &amp; ถอดทีเดียว ไม่ถอดซ้ำ */
export function decodeEntities(s: string): string {
  return s.replace(/&(?:amp|quot|#39|apos|lt|gt);|&#(\d+);|&#x([0-9a-f]+);/gi, (m, dec, hex) => {
    if (dec) return String.fromCodePoint(Number(dec));
    if (hex) return String.fromCodePoint(parseInt(hex, 16));
    return ENTITIES[m.toLowerCase()] ?? m;
  });
}

/** ชื่อเกมที่รู้จัก — key เป็นตัวพิมพ์ใหญ่ไว้เทียบ ค่าคือชื่อที่โชว์บนเว็บ */
const GAMES: [test: (s: string) => boolean, name: string][] = [
  [(s) => s === "MARVEL SNAP", "Marvel Snap"],
  [(s) => s === "THE BAZAAR", "The Bazaar"],
  [(s) => s === "BATOMON SHOWDOWN", "Batomon Showdown"],
  [(s) => s === "SIZE IT UP", "Size it up"],
  [(s) => s.startsWith("TFT"), "TFT"],
];

/**
 * ชื่อคลิปของเขาลงท้ายด้วย " - ชื่อเกม" แทบทุกคลิป
 * ใช้ขีดตัวสุดท้ายที่ "ตามด้วยช่องว่าง" ไม่ใช่ " - " เพราะบางชื่อมีอีโมจิติดหน้าขีด
 * เช่น "ยุคสมัยของหมูควงค้อน🔥- THE BAZAAR"
 */
export function gameOf(title: string): string | null {
  const m = title.match(/-\s+([^-]+)$/);
  if (!m) return null;
  // ตัดอีโมจิ/สัญลักษณ์ที่อาจห้อยท้าย แล้วเทียบแบบไม่สนตัวพิมพ์
  const tail = m[1].replace(/[^\p{L}\p{N}\s']/gu, "").trim().toUpperCase();
  for (const [test, name] of GAMES) if (test(tail)) return name;
  return null;
}

const pick = (block: string, re: RegExp) => block.match(re)?.[1] ?? "";

export function parseFeed(xml: string): Video[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  return entries
    .map((e): Video | null => {
      const id = pick(e, /<yt:videoId>([^<]+)<\/yt:videoId>/);
      if (!id) return null;
      const title = decodeEntities(pick(e, /<title>([^<]*)<\/title>/));
      const link = pick(e, /<link rel="alternate" href="([^"]+)"/);
      return {
        id,
        title,
        published: pick(e, /<published>([^<]+)<\/published>/),
        views: Number(pick(e, /<media:statistics views="(\d+)"/)) || 0,
        isShort: link.includes("/shorts/"),
        thumb: pick(e, /<media:thumbnail url="([^"]+)"/),
        game: gameOf(title),
      };
    })
    .filter((v): v is Video => v !== null);
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** จำนวนคลิปที่ลงภายใน 7 วันก่อน now — ใช้เป็นตัวเลขบนไพ่ "คลิป" */
export function weeklyCount(videos: Video[], now: number): number {
  return videos.filter((v) => {
    const t = Date.parse(v.published);
    return Number.isFinite(t) && t > now - WEEK_MS && t <= now;
  }).length;
}

/**
 * ดึง feed จริง (เรียกจาก server component เท่านั้น)
 * OZZY_FEED_URL ไว้ทดสอบกรณี feed ล่ม — ชี้ไป URL ที่ไม่มีอยู่แล้วดูว่าหน้าไม่พัง
 */
export async function fetchFeed(): Promise<Feed> {
  const url = process.env.OZZY_FEED_URL ?? FEED_URL;
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { ok: false, videos: [] };
    const videos = parseFeed(await res.text());
    return { ok: videos.length > 0, videos };
  } catch {
    return { ok: false, videos: [] };
  }
}
