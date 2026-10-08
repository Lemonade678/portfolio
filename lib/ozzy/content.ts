// ─────────────────────────────────────────────────────────────
// เนื้อหาทั้งหมดของเว็บ TheOzzy (`/ozzy`) — แยกจาก lib/content.ts ตั้งใจ
// เพราะนี่คืออีกเว็บหนึ่งที่แค่อาศัยอยู่ใต้โดเมนพอร์ต และ content.ts ของพอร์ตใหญ่พอแล้ว
//
// กฎถ้อยคำ (สำคัญที่สุดในไฟล์นี้):
//   เจ้าของเว็บบอกแค่ว่า "งานต่อไปคือการสร้างเว็บไซต์ให้ theozzy213" ทุกบรรทัดพูดแค่นั้น
//   ไม่เขียนว่าเป็นเว็บ "ทางการ" ไม่เขียนว่า "ได้รับว่าจ้าง" ไม่เขียนว่า "ร่วมมือกับ"
//   ถ้าวันหนึ่งตกลงกับเจ้าตัวเป็นทางการแล้ว ค่อยเปลี่ยน — เขียนน้อยไว้ก่อนแก้ง่ายกว่าถอนคำพูด
//
// ข้อเท็จจริงเกี่ยวกับช่อง: มาจากเจ้าของเว็บ + หน้าเพจ/ช่องของเขาเอง (ต.ค. 2026)
// ลิงก์ทุกอันตรวจแล้วว่าเป็นของเขา (หน้าโดเนทลิงก์กลับไปหา YouTube/Facebook ตัวเดียวกัน)
// ไม่ใส่ยอดผู้ติดตาม (เปลี่ยนทุกวัน) และไม่ใส่ตารางไลฟ์ (หาเจอแต่ของปี 2022 ยืนยันไม่ได้)
//
// รูปถ่ายของเขา รูปตัวละคร และ emote เป็นของเจ้าของแต่ละราย ใส่ในฐานะแฟน มีเครดิตในหน้าต่างที่ใช้
// ─────────────────────────────────────────────────────────────

import type { L10n } from "@/lib/content";

export type OzHeroId = "pepe" | "dooley" | "mbaku";
export type OzSliceId = "powder" | "gold" | "luck" | "feelsbad" | "again" | "jackpot" | "nothing";
export type RelicId = "glasses" | "heart" | "ban" | "pma" | "sek" | "scarf";
export type FunId = "powder" | "music" | "vip";
export type CardId = "profile" | "clips" | "run" | "wheel" | "collection" | "shop";

export interface OzHero {
  id: OzHeroId;
  name: string;
  img: string;
  alt: L10n;
  from: L10n;
  perk: L10n;
  perkText: L10n;
  /** กดเลือกแล้วเปิดเพลงเปิดตัว (มีตัวเดียวคือ M'Baku) */
  music?: boolean;
}

export interface OzFloor {
  emoji: string;
  name: L10n;
  /** แต้มขั้นต่ำบน d20 (รวมโบนัสแล้ว) ของทางเซฟ / ทางไฮโรล */
  safe: number;
  high: number;
  /** แต้มที่ได้ถ้าผ่านแต่ละทาง */
  safePoints: number;
  highPoints: number;
}

/** ของในร้าน — รีลิคกับของสนุกใช้หน้าตาเดียวกัน (ช่องสีแบบหน้า Channel Points ของช่อง) */
export interface OzItem<Id extends string> {
  id: Id;
  emoji: string;
  /** สีพื้นช่องในร้าน */
  color: string;
  name: L10n;
  effect: L10n;
  price: number;
}

export interface OzCard {
  id: CardId;
  /** ขึ้นต้นด้วย "/" = รูป · นอกนั้นเป็นอีโมจิ */
  art: string;
  name: L10n;
  blurb: L10n;
}

export interface OzPhoto {
  id: "selfie" | "giraffe" | "stream" | "duo" | "meetup" | "setup";
  src: string;
  w: number;
  h: number;
  alt: L10n;
}

export interface OzEmote {
  id: string;
  src: string;
  name: L10n;
}

export const OZZY = {
  streamer: {
    name: "TheOzzy",
    handle: "@TheOzzy213",
    /** คำโปรยจากหน้าเพจ Facebook ของเขาเอง */
    tagline: { en: "Card games and aimless chatting", th: "เล่นเกมการ์ด คุยเรื่อยเปื่อย" },
  },

  links: {
    youtube: "https://www.youtube.com/@TheOzzy213",
    facebook: "https://www.facebook.com/TheOzzy213/",
    instagram: "https://www.instagram.com/theozzy213213/",
    donate: "https://easydonate.app/theozzy",
  },

  /** สกุลเงินเดียวของเว็บ — เก็บในเบราว์เซอร์ของคนเล่นเท่านั้น */
  points: {
    name: { en: "points", th: "แต้ม" },
    notReal: {
      en: "Points live in this browser only. They are not TheOzzy's real channel points.",
      th: "แต้มเก็บในเบราว์เซอร์นี้เท่านั้น ไม่เกี่ยวกับแต้มช่องจริงของ Ozzy",
    },
  },

  /** โต๊ะไพ่ (หน้า /ozzy) */
  table: {
    back: { en: "← portfolio", th: "← กลับหน้าพอร์ต" },
    deckTitle: { en: "Ozzy's deck · 6 cards", th: "เด็คของ Ozzy · 6 ใบ" },
    deckHint: { en: "Play a card to open its window.", th: "ลงไพ่ใบไหน หน้าต่างของใบนั้นจะเปิดขึ้นมา" },
    donate: { en: "Support Ozzy", th: "สนับสนุน Ozzy" },
    fanNote: {
      en: "A fan-built site by Nutt (Lemon). Building him a website is my next project.",
      th: "เว็บที่แฟนทำ โดย Nutt (Lemon) · งานชิ้นถัดไปของผมคือทำเว็บไซต์ให้เขา",
    },
    close: { en: "Close", th: "ปิด" },
    hearts: { en: "hearts", th: "หัวใจ" },
    powdered: { en: "powdered", th: "โดนทาแป้ง" },
    stopMusic: { en: "Stop music", th: "ปิดเพลง" },
  },

  cards: [
    {
      id: "profile",
      art: "/ozzy/photos/stream.webp",
      name: { en: "Profile", th: "โปรไฟล์" },
      blurb: { en: "Photos · about · links", th: "รูป · แนะนำตัว · ลิงก์" },
    },
    {
      id: "clips",
      art: "/ozzy/characters/dooley.webp",
      name: { en: "Clips", th: "คลิป" },
      blurb: { en: "Latest · highlights · memes", th: "ล่าสุด · ไฮไลต์ · มีม" },
    },
    {
      id: "run",
      art: "/ozzy/characters/mbaku.webp",
      name: { en: "Dungeon", th: "ดันเจี้ยน" },
      blurb: { en: "Four rooms of high rolls", th: "ลุ้นไฮโรล 4 ห้อง" },
    },
    {
      id: "wheel",
      art: "🎡",
      name: { en: "Wheel", th: "วงล้อ" },
      blurb: { en: "Mind the baby powder", th: "ระวังโดนแป้ง" },
    },
    {
      id: "collection",
      art: "/ozzy/characters/pepe.webp",
      name: { en: "Collection", th: "คอลเลกชัน" },
      blurb: { en: "Emotes · characters", th: "emote · ตัวละคร" },
    },
    {
      id: "shop",
      art: "🛒",
      name: { en: "Points shop", th: "ร้านแต้ม" },
      blurb: { en: "Relics · fun stuff", th: "รีลิค · ของสนุก" },
    },
  ] satisfies OzCard[],

  /** เลือกฮีโร่ — สามตัวโปรดของเขา แต่ละตัวมีความสามารถติดตัวที่เปลี่ยนวิธีออกของลูกเต๋า */
  heroesTitle: { en: "Choose your hero", th: "เลือกฮีโร่" },
  heroesNote: {
    en: "Three of his favourites. Each one bends the dice a different way.",
    th: "สามตัวโปรดของเขา แต่ละตัวโกงลูกเต๋าคนละแบบ",
  },
  picked: { en: "In your party", th: "อยู่ในทีมแล้ว" },
  musicBadge: { en: "comes with entrance music", th: "มีเพลงเปิดตัว" },
  heroes: [
    {
      id: "pepe",
      name: "Pepe",
      img: "/ozzy/characters/pepe.webp",
      alt: { en: "Pepe the Frog, looking sad", th: "Pepe the Frog หน้าเศร้า" },
      from: { en: "The channel's emote", th: "อีโมตประจำช่อง" },
      perk: { en: "Feels bad → feels good", th: "ฟีลแบดแล้วฟีลกู๊ด" },
      perkText: { en: "After a missed roll, the next one gets +4.", th: "ทอยพลาดเมื่อไหร่ ครั้งถัดไป +4" },
    },
    {
      id: "dooley",
      name: "Dooley",
      img: "/ozzy/characters/dooley.webp",
      alt: { en: "Dooley, a one-eyed robot in an orange scarf", th: "Dooley หุ่นยนต์ตาเดียวพันผ้าพันคอสีส้ม" },
      from: { en: "His favourite in The Bazaar", th: "ลูกรักจาก The Bazaar" },
      perk: { en: "Core charge", th: "ชาร์จคอร์" },
      perkText: { en: "Every third roll is a natural 20.", th: "ทอยครบทุกสามครั้ง ได้ 20 เต็ม" },
    },
    {
      id: "mbaku",
      name: "M'Baku",
      img: "/ozzy/characters/mbaku.webp",
      alt: { en: "M'Baku from his Marvel Snap card, roaring", th: "M'Baku จากการ์ด Marvel Snap กำลังคำราม" },
      from: { en: "His favourite in Marvel Snap", th: "ลูกรักจาก Marvel Snap" },
      perk: { en: "Jabari strength", th: "พลังเผ่าจาบารี" },
      perkText: { en: "+2 to every roll.", th: "ทอยทุกครั้ง +2" },
      music: true,
    },
  ] satisfies OzHero[],

  /** เพลงเปิดตัว M'Baku — คลิปจากช่องของเขาเอง · iframe สร้างตอนสั่งเปิดเท่านั้น */
  music: {
    videoId: "4ZI_mGuXtaE",
    title: "สวัสดีอะไร?? — TheOzzy213 (Official MV)",
    nowPlaying: { en: "Now playing", th: "กำลังเล่น" },
    stop: { en: "Stop music", th: "ปิดเพลง" },
  },

  /** ลงดันเจี้ยน — 4 ห้อง (ห้องสุดท้ายบอส) · ทุกห้องเลือกเล่นเซฟหรือลุ้นไฮโรล */
  run: {
    title: { en: "The run", th: "ลงดันเจี้ยน" },
    intro: {
      en: "Four rooms, three hearts, a merchant halfway. In every room you choose: play it safe, or go for the high roll. A miss costs a heart either way.",
      th: "สี่ห้อง สามหัวใจ มีพ่อค้ากลางทาง ทุกห้องต้องเลือกว่าจะเล่นเซฟ หรือจะลุ้นไฮโรล — พลาดทางไหนก็เสียหนึ่งหัวใจเท่ากัน",
    },
    pickFirst: { en: "Pick a hero above to start.", th: "เลือกฮีโร่ข้างบนก่อน แล้วค่อยเริ่ม" },
    room: { en: "Room", th: "ห้อง" },
    boss: { en: "Boss", th: "บอส" },
    safe: { en: "Play it safe", th: "เล่นเซฟ" },
    high: { en: "Go for the high roll", th: "ลุ้นไฮโรล" },
    need: { en: "need", th: "ต้องได้" },
    rolling: { en: "Rolling…", th: "กำลังทอย…" },
    hit: { en: "hit", th: "ผ่าน" },
    miss: { en: "miss", th: "พลาด" },
    highHit: { en: "HIGH ROLL!", th: "ไฮโรล!" },
    bonuses: { en: "On your next roll", th: "ทอยครั้งหน้าได้เพิ่ม" },
    natural: { en: "natural 20", th: "ได้ 20 เต็ม" },
    charge: { en: "core charge", th: "ชาร์จคอร์" },
    saved: { en: "PMA — heart kept", th: "PMA — หัวใจไม่หาย" },
    rerolled: { en: "เสก — rerolled", th: "เสก — ทอยใหม่" },
    banned: { en: "BAN — room skipped", th: "ค้อน BAN — ข้ามห้อง" },
    useBan: { en: "Use the BAN hammer", th: "ใช้ค้อน BAN" },
    relicsTitle: { en: "Relics this run", th: "รีลิคในรันนี้" },
    bossStays: { en: "The boss is still standing — roll again.", th: "บอสยังไม่ล้ม — ทอยอีกที" },
    won: { en: "Run cleared", th: "ผ่านดันเจี้ยนแล้ว" },
    lost: { en: "Run over", th: "รันจบแล้ว" },
    lostNote: { en: "Feels bad, man.", th: "ฟีลแบดแมน" },
    again: { en: "New run", th: "เริ่มรันใหม่" },
    earned: { en: "Points from rooms", th: "แต้มจากห้องต่าง ๆ" },
    highRate: { en: "High rolls landed", th: "ลุ้นไฮโรลติด" },
    rank: { en: "Rank", th: "แรงก์" },
    best: { en: "Best ever", th: "ดีที่สุดที่เคยได้" },
    /** แรงก์ดูจากแต้มที่ได้ในห้องของรันนี้เท่านั้น (วงล้อไม่นับ) · เต็มที่ 230 ถ้าไฮโรลติดทุกห้อง */
    ranks: [
      { min: 180, label: { en: "S+ — certified high roller", th: "S+ — สายไฮโรลตัวจริง" } },
      { min: 100, label: { en: "A — bold", th: "A — กล้าได้กล้าเสีย" } },
      { min: 0, label: { en: "B — played it safe", th: "B — เล่นเซฟไปหน่อย" } },
    ],
    lootTitle: { en: "The boss chest", th: "หีบสมบัติบอส" },
    lootNote: { en: "The boss chest only drops legendaries. Obviously.", th: "หีบบอสดรอปแต่การ์ดทอง แน่นอนอยู่แล้ว" },
  },

  floors: [
    { emoji: "🟢", name: { en: "Low-Roll Slime", th: "สไลม์ดวงตก" }, safe: 6, high: 14, safePoints: 10, highPoints: 40 },
    { emoji: "🗿", name: { en: "Tilt Golem", th: "โกเลมหัวร้อน" }, safe: 8, high: 15, safePoints: 10, highPoints: 40 },
    { emoji: "💬", name: { en: "Backseat Chat", th: "แชทบอกบท" }, safe: 9, high: 16, safePoints: 15, highPoints: 50 },
    { emoji: "🎲", name: { en: "RNG Itself", th: "เทพเจ้า RNG" }, safe: 11, high: 17, safePoints: 25, highPoints: 100 },
  ] satisfies OzFloor[],

  /** พ่อค้ากลางทาง — โผล่หลังห้องที่ 2 */
  merchant: {
    title: { en: "A merchant on the way", th: "พ่อค้ากลางทาง" },
    note: {
      en: "Three relics, 20% off. Buy what you like, or walk on.",
      th: "รีลิค 3 ชิ้น ลด 20% อยากได้ชิ้นไหนซื้อเลย หรือจะเดินผ่านก็ได้",
    },
    leave: { en: "Walk on", th: "เดินต่อ" },
  },

  /** รีลิค — ใช้ได้เฉพาะรันที่ซื้อ ถือได้สูงสุด 3 ชิ้น · ชื่อมาจาก emote และของในช่อง */
  relics: [
    {
      id: "glasses",
      emoji: "👓",
      color: "#fec501",
      name: { en: "Electric glasses", th: "แว่นไฟฟ้า" },
      effect: { en: "+1 to every roll", th: "ทอยทุกครั้ง +1" },
      price: 150,
    },
    {
      id: "heart",
      emoji: "❤️",
      color: "#1ea8f8",
      name: { en: "Spare heart", th: "หัวใจสำรอง" },
      effect: { en: "+1 heart this run", th: "หัวใจ +1 ในรันนี้" },
      price: 200,
    },
    {
      id: "ban",
      emoji: "🔨",
      color: "#ffaa77",
      name: { en: "BAN hammer", th: "ค้อน BAN" },
      effect: { en: "Skip one room as a safe pass (not the boss)", th: "ข้ามห้องหนึ่ง นับว่าผ่านแบบเซฟ (ใช้กับบอสไม่ได้)" },
      price: 250,
    },
    {
      id: "pma",
      emoji: "😌",
      color: "#5454c1",
      name: { en: "PMA", th: "PMA" },
      effect: { en: "Your first miss costs no heart", th: "พลาดครั้งแรกไม่เสียหัวใจ" },
      price: 200,
    },
    {
      id: "sek",
      emoji: "✨",
      color: "#f4f2ff",
      name: { en: "เสก", th: "เสก" },
      effect: { en: "Your first miss is rerolled once", th: "พลาดครั้งแรกได้ทอยใหม่ 1 ครั้ง" },
      price: 300,
    },
    {
      id: "scarf",
      emoji: "🧣",
      color: "#ff4a1a",
      name: { en: "Dooley's scarf", th: "ผ้าพันคอ Dooley" },
      effect: { en: "Your next roll is a natural 20", th: "ทอยครั้งหน้าได้ 20 เต็ม" },
      price: 350,
    },
  ] satisfies OzItem<RelicId>[],

  /** ของสนุก — ซื้อได้ทุกเวลา */
  fun: [
    {
      id: "powder",
      emoji: "🧴",
      color: "#f4f2ff",
      name: { en: "Powder yourself", th: "ทาแป้งตัวเอง" },
      effect: { en: "The whole site gets baby powder", th: "ทั้งหน้าเว็บโดนแป้งทันที" },
      price: 50,
    },
    {
      id: "music",
      emoji: "🎵",
      color: "#4c8199",
      name: { en: "Play “สวัสดีอะไร??”", th: "เปิดเพลงสวัสดีอะไร??" },
      effect: { en: "His official MV, in the corner", th: "MV จากช่องของเขา เล่นมุมจอ" },
      price: 100,
    },
    {
      id: "vip",
      emoji: "🎟️",
      color: "#fec501",
      name: { en: "VIP TICKET", th: "VIP TICKET" },
      effect: { en: "Same price as on his channel. Good luck.", th: "ราคาเดียวกับในช่องจริง ขอให้โชคดี" },
      price: 200000,
    },
  ] satisfies OzItem<FunId>[],

  shop: {
    title: { en: "Points shop", th: "ร้านแต้ม" },
    relicsTitle: { en: "Relics · this run only", th: "รีลิค · ใช้ได้เฉพาะรันนี้" },
    funTitle: { en: "Fun stuff", th: "ของสนุก" },
    held: { en: "Holding", th: "ถืออยู่" },
    max: { en: "max 3", th: "สูงสุด 3 ชิ้น" },
    owned: { en: "owned", th: "มีแล้ว" },
    buy: { en: "Buy", th: "ซื้อ" },
    short: { en: "Not enough", th: "แต้มไม่พอ" },
    full: { en: "Slots full", th: "ช่องเต็ม" },
    runOnly: { en: "Run only", th: "เฉพาะในรัน" },
    startRun: { en: "Start a run to buy relics.", th: "เริ่มรันก่อนถึงซื้อรีลิคได้" },
    goRun: { en: "Go to the dungeon →", th: "ไปดันเจี้ยน →" },
    vipBadge: { en: "VIP", th: "VIP" },
  },

  /** หน้าการ์ดในหีบบอส — สุ่ม 5 จาก 8 และทุกใบเป็นการ์ดทอง (มุกของหีบนี้) */
  faces: [
    { glyph: "+2000%", label: { en: "luck", th: "โชค" } },
    { glyph: "★★★", label: { en: "three-star", th: "สามดาว" } },
    { glyph: "×67", label: { en: "multiplier", th: "ตัวคูณ" } },
    { glyph: "∞", label: { en: "infinite combo", th: "คอมโบไม่รู้จบ" } },
    { glyph: "100%", label: { en: "crit chance", th: "โอกาสคริ" } },
    { glyph: "MAX", label: { en: "rolled max", th: "ทอยได้เต็ม" } },
    { glyph: "1st", label: { en: "first-try pull", th: "สุ่มติดครั้งแรก" } },
    { glyph: "S+", label: { en: "tier", th: "ระดับ" } },
  ] satisfies { glyph: string; label: L10n }[],

  /** วงล้อ — แปดช่องเท่ากันจริง สุ่มช่องก่อนแล้วค่อยหมุนไปหยุด · ทาแป้ง 2/8 = 25% */
  wheel: {
    title: { en: "The wheel", th: "วงล้อ" },
    note: {
      en: "Eight equal slices, and you can read every one before you spin. Two of them are baby powder.",
      th: "แปดช่องเท่ากัน อ่านได้ทุกช่องก่อนหมุน — มีสองช่องที่เป็นทาแป้ง",
    },
    spin: { en: "Spin", th: "หมุน" },
    spinning: { en: "Spinning…", th: "กำลังหมุน…" },
    slices: [
      { id: "powder", label: { en: "Powder", th: "ทาแป้ง" } },
      { id: "gold", label: { en: "+100 points", th: "+100 แต้ม" } },
      { id: "luck", label: { en: "High roll", th: "ไฮโรล" } },
      { id: "feelsbad", label: { en: "Feels bad", th: "ฟีลแบด" } },
      { id: "powder", label: { en: "Powder", th: "ทาแป้ง" } },
      { id: "again", label: { en: "Spin again", th: "หมุนใหม่" } },
      { id: "jackpot", label: { en: "Jackpot", th: "แจ็กพอต" } },
      { id: "nothing", label: { en: "Nothing", th: "แห้ว" } },
    ] satisfies { id: OzSliceId; label: L10n }[],
    results: {
      powder: { en: "Baby powder! The whole site gets it.", th: "โดนทาแป้ง! ทั้งหน้าเว็บเลย" },
      gold: { en: "+100 points, straight into your purse.", th: "+100 แต้ม เข้ากระเป๋าเลย" },
      luck: { en: "Lucky — your next roll in the dungeon gets +5.", th: "ดวงขึ้น — ทอยครั้งถัดไปในดันเจี้ยน +5" },
      feelsbad: { en: "Feels bad, man.", th: "ฟีลแบดแมน" },
      again: { en: "Free spin. Go again.", th: "ได้หมุนฟรี หมุนอีกรอบเลย" },
      jackpot: { en: "JACKPOT — +300 points.", th: "แจ็กพอต — +300 แต้ม" },
      nothing: { en: "Nothing. Better luck next spin.", th: "แห้ว รอบหน้าเอาใหม่" },
    } satisfies Record<OzSliceId, L10n>,
    wash: { en: "Wash it off", th: "ล้างหน้า" },
  },

  /** หน้าต่างโปรไฟล์ */
  profile: {
    title: { en: "Profile", th: "โปรไฟล์" },
    about: {
      en: "TheOzzy — Ozzy for short — is a Thai streamer who plays card games and roguelikes, chats about whatever comes up, and always plays for the high roll.",
      th: "TheOzzy หรือออซซี่ สตรีมเมอร์ไทยสายเกมการ์ดกับ roguelike คุยเรื่อยเปื่อย และเล่นแบบลุ้นไฮโรลเสมอ",
    },
    hello: { en: "His channel greeting:", th: "คำทักทายประจำช่อง:" },
    helloQuote: "สวัสดีครับ ออซซี่ครับ ฝากตัวด้วยครับ 🫡",
    gamesTitle: { en: "Playing lately", th: "ช่วงนี้เล่น" },
    linksTitle: { en: "Find him", th: "ช่องทางติดตาม" },
    linkLabels: {
      youtube: { en: "YouTube", th: "YouTube" },
      facebook: { en: "Facebook", th: "Facebook" },
      instagram: { en: "Instagram", th: "Instagram" },
      donate: { en: "Donate (EasyDonate)", th: "โดเนท (EasyDonate)" },
    },
    credit: {
      en: "Photos are from TheOzzy's own public pages.",
      th: "รูปถ่ายมาจากหน้าเพจสาธารณะของ TheOzzy เอง",
    },
  },

  /** หน้าต่างคลิป */
  clips: {
    title: { en: "Clips", th: "คลิป" },
    tabs: {
      latest: { en: "Latest", th: "ล่าสุด" },
      games: { en: "By game", th: "ไฮไลต์ตามเกม" },
      memes: { en: "Memes", th: "มีม" },
      featured: { en: "Featured", th: "คลิปเด่น" },
    },
    other: { en: "Other", th: "อื่น ๆ" },
    views: { en: "views", th: "วิว" },
    play: { en: "Play", th: "เล่น" },
    all: { en: "All videos on YouTube ↗", th: "ดูทั้งหมดบน YouTube ↗" },
    down: {
      en: "The latest clips can't be loaded right now. Here are the featured ones.",
      th: "โหลดคลิปล่าสุดไม่ได้ตอนนี้ ดูคลิปเด่นไปก่อน",
    },
    credit: { en: "All clips belong to TheOzzy's channel.", th: "คลิปทั้งหมดเป็นของช่อง TheOzzy" },
  },

  /** คลิปเด่น — เจ้าของเว็บเลือกเอง (RSS เห็นแค่ 15 คลิปล่าสุด คลิปเก่าที่เป็นตำนานต้องใส่ที่นี่) */
  featured: [{ videoId: "4ZI_mGuXtaE", title: "สวัสดีอะไร?? — TheOzzy213 (Official MV)" }],

  /** หน้าต่างคอลเลกชัน */
  collection: {
    title: { en: "Collection", th: "คอลเลกชัน" },
    emotesTitle: { en: "Channel emotes", th: "emote ของช่อง" },
    charactersTitle: { en: "Characters", th: "ตัวละคร" },
    note: {
      en: "Members-only emotes are left out on purpose.",
      th: "emote ที่ล็อกไว้ให้สมาชิกช่อง ไม่ได้เอามาโชว์ตั้งใจ",
    },
    credit: {
      en: "Emotes belong to TheOzzy's channel and their artists. Pepe the Frog is by Matt Furie. Dooley is from The Bazaar. M'Baku is a Marvel character; the art is from his Marvel Snap card.",
      th: "emote เป็นของช่อง TheOzzy และผู้วาด · Pepe the Frog เป็นผลงานของ Matt Furie · Dooley มาจากเกม The Bazaar · M'Baku เป็นตัวละครของ Marvel ภาพจากการ์ดในเกม Marvel Snap",
    },
  },

  /** รูปถ่ายของเขา — ทำด้วย tools/ozzy_assets.py · ขนาดต้องตรงกับไฟล์จริง (กันหน้ากระโดด) */
  photos: [
    {
      id: "selfie",
      src: "/ozzy/photos/selfie.webp",
      w: 675,
      h: 900,
      alt: { en: "TheOzzy in a selfie at home, silver hair and glasses", th: "TheOzzy เซลฟี่ที่บ้าน ผมสีเงิน ใส่แว่น" },
    },
    {
      id: "giraffe",
      src: "/ozzy/photos/giraffe.webp",
      w: 900,
      h: 1200,
      alt: {
        en: "TheOzzy pointing at a giant giraffe head in a purple-lit museum, on a trip",
        th: "TheOzzy ชี้หัวยีราฟยักษ์ในพิพิธภัณฑ์แสงม่วง ระหว่างทริป",
      },
    },
    {
      id: "stream",
      src: "/ozzy/photos/stream.webp",
      w: 640,
      h: 360,
      alt: { en: "TheOzzy live on stream, laughing at the mic", th: "TheOzzy ระหว่างไลฟ์ หัวเราะหน้าไมค์" },
    },
    // สามรูปข้างล่างมาจากอัลบั้มแชร์ "OOOO…ZZY" ของเจ้าของเว็บ (ทุกคนในรูปยินยอมแล้ว — ยืนยัน 8 ต.ค. 2026)
    // alt เขียนแค่สิ่งที่เห็น + วันที่จาก EXIF · ไม่ระบุว่าใครเป็นใครในเซลฟี่ เพราะไม่ได้ยืนยันไว้
    {
      id: "duo",
      src: "/ozzy/photos/duo.webp",
      w: 1200,
      h: 900,
      alt: {
        en: "A two-person selfie at a busy event — big white glasses on the right, a peace sign on the left",
        th: "เซลฟี่สองคนในงานที่คนเยอะ — คนขวาใส่แว่นกรอบขาวอันใหญ่ คนซ้ายชูสองนิ้ว",
      },
    },
    {
      id: "meetup",
      src: "/ozzy/photos/meetup.webp",
      w: 1200,
      h: 900,
      alt: {
        en: "A TheOzzy fan meetup at an event booth, October 2022",
        th: "งานมีตติ้งแฟน ๆ TheOzzy ที่บูธในงานอีเวนต์ ต.ค. 2022",
      },
    },
    {
      id: "setup",
      src: "/ozzy/photos/setup.webp",
      w: 1200,
      h: 548,
      alt: {
        en: "A laptop with a TheOzzy stream open, his face cam in the corner, May 2022",
        th: "แล็ปท็อปเปิดสตรีมของ TheOzzy เห็นกล้องหน้าเขาที่มุมจอ พ.ค. 2022",
      },
    },
  ] satisfies OzPhoto[],
  /** emote ของช่อง (เฉพาะที่ไม่ล็อกให้สมาชิก) ตัดจากภาพหน้าจอด้วย tools/ozzy_assets.py
   *  ชื่อเป็นคำบนอีโมต หรือคำบรรยายถ้าเป็นรูป — ชื่อเรียกจริงในช่องเป็นอะไร แก้ที่นี่ได้เลย */
  emotes: [
    { id: "e01", src: "/ozzy/emotes/e01.png", name: { en: "Believe", th: "เชื่อ" } },
    { id: "e02", src: "/ozzy/emotes/e02.png", name: { en: "Spin", th: "หมุน" } },
    { id: "e03", src: "/ozzy/emotes/e03.png", name: { en: "Conjure", th: "เสก" } },
    { id: "e04", src: "/ozzy/emotes/e04.png", name: { en: "Please", th: "ขอ" } },
    { id: "e05", src: "/ozzy/emotes/e05.png", name: { en: "No", th: "ไม่" } },
    { id: "e06", src: "/ozzy/emotes/e06.png", name: { en: "PMA", th: "PMA" } },
    { id: "e07", src: "/ozzy/emotes/e07.png", name: { en: "Nope", th: "โน้" } },
    { id: "e08", src: "/ozzy/emotes/e08.png", name: { en: "6 7", th: "6 7" } },
    { id: "e09", src: "/ozzy/emotes/e09.png", name: { en: "BAN hammer", th: "ค้อน BAN" } },
    { id: "e10", src: "/ozzy/emotes/e10.png", name: { en: "Black & white", th: "ขาวดำ" } },
    { id: "e11", src: "/ozzy/emotes/e11.png", name: { en: "Dooley", th: "Dooley" } },
    { id: "e12", src: "/ozzy/emotes/e12.png", name: { en: "Dooley close-up", th: "Dooley ซูม" } },
    { id: "e13", src: "/ozzy/emotes/e13.png", name: { en: "Dooley pat", th: "ลูบหัว Dooley" } },
    { id: "e14", src: "/ozzy/emotes/e14.png", name: { en: "Cheeky cat", th: "แมวแลบลิ้น" } },
    { id: "e15", src: "/ozzy/emotes/e15.png", name: { en: "Pepe GG", th: "Pepe GG" } },
    { id: "e16", src: "/ozzy/emotes/e16.png", name: { en: "Pepe heart", th: "Pepe ให้ใจ" } },
    { id: "e17", src: "/ozzy/emotes/e17.png", name: { en: "Big eyes", th: "ตาโต" } },
    { id: "e18", src: "/ozzy/emotes/e18.png", name: { en: "Dancing hamster", th: "แฮมสเตอร์เต้น" } },
    { id: "e19", src: "/ozzy/emotes/e19.png", name: { en: "Pepe nerd", th: "Pepe แว่น" } },
  ] satisfies OzEmote[],

  /** ห้าสีที่ดูดมาจากรูปบนช่อง — ต้องตรงกับตัวแปร --oz-* ใน globals.css */
  palette: [
    { hex: "#1EA8F8", label: { en: "Electric blue — the glow from his glasses in the banner", th: "น้ำเงินไฟฟ้า — แสงจากแว่นในแบนเนอร์" } },
    { hex: "#FEC501", label: { en: "Bolt yellow — the lightning beside him in the banner", th: "เหลืองสายฟ้า — สายฟ้าข้างตัวในแบนเนอร์" } },
    { hex: "#5454C1", label: { en: "Indigo — behind him in his profile picture", th: "คราม — พื้นหลังในรูปโปรไฟล์" } },
    { hex: "#4C8199", label: { en: "Teal — his shirt in the profile picture", th: "ฟ้าอมเขียว — เสื้อในรูปโปรไฟล์" } },
    { hex: "#131014", label: { en: "Ink — the outlines of his cartoon self", th: "หมึก — เส้นตัดขอบของตัวการ์ตูน" } },
  ],
};
