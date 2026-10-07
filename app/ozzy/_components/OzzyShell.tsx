"use client";

// ─────────────────────────────────────────────────────────────
// Shell ของเว็บ TheOzzy — เจ้าของ state ทั้งหมด และวาดโต๊ะไพ่ค้างไว้ตลอด
//
// ทำไมต้องมี shell: app/ozzy/layout.tsx ไม่ถูก remount ตอนสลับ route ลูก
// state ที่เก็บตรงนี้ (รัน แต้ม รีลิค แป้ง เพลง ภาษา) เลยอยู่รอดตอนสลับหน้าต่าง
// หน้าต่างแต่ละบาน (route ลูก) อ่าน/สั่งผ่าน useOzzy() — ไม่มีใครถือ state ซ้ำ
//
// แต้มอยู่ใน runReducer (เพราะการซื้อรีลิคต้องเช็กแต้มในจังหวะเดียวกับกติกา)
// ส่วน save (แต้ม + สถิติ) เป็นสำเนาที่ sync ลง localStorage — sync ทางเดียวจาก reducer → save
// ─────────────────────────────────────────────────────────────

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type Dispatch,
} from "react";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/content";
import type { CardId } from "@/lib/ozzy/content";
import { initialRun, runReducer, type RunAction, type RunState } from "@/lib/ozzy/game";
import { DEFAULT_SAVE, loadSave, welcome, writeSave, type Save } from "@/lib/ozzy/save";
import MusicDock from "./MusicDock";
import Powder from "./Powder";
import Table from "./Table";
import TopBar from "./TopBar";

/** สีพื้นของโซนนี้ — ต้องตรงกับ --oz-night ใน globals.css */
const NIGHT = "#12112c";

interface OzzyCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  run: RunState;
  dispatch: Dispatch<RunAction>;
  save: Save;
  updateSave: (fn: (s: Save) => Save) => void;
  /** ทาแป้งทั้งเว็บ (วงล้อ/ร้านเรียก) */
  powder: () => void;
  music: boolean;
  setMusic: (on: boolean) => void;
  /** แนบ ?lang=th ให้ลิงก์ในโซนนี้เมื่อกำลังเป็นภาษาไทย */
  href: (path: string) => string;
  /** จำว่าไพ่ใบไหนเปิดหน้าต่าง จะได้คืนโฟกัสให้ถูกใบตอนปิด */
  setOpener: (id: CardId | null) => void;
}

const Ctx = createContext<OzzyCtx | null>(null);

export function useOzzy(): OzzyCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useOzzy() ต้องอยู่ใต้ <OzzyShell>");
  return c;
}

export default function OzzyShell({
  weeklyClips,
  children,
}: {
  weeklyClips: number;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>("en");
  const [run, dispatch] = useReducer(runReducer, initialRun);
  const [save, setSave] = useState<Save>(DEFAULT_SAVE);
  const [ready, setReady] = useState(false);
  const [powdered, setPowdered] = useState(false);
  const [music, setMusic] = useState(false);
  const [opener, setOpener] = useState<CardId | null>(null);
  const counted = useRef(0);

  const pathname = usePathname();
  const windowOpen = pathname !== "/ozzy";

  // โหลด save ครั้งเดียว + แจกแต้มเริ่มต้นถ้าเป็นครั้งแรก · ภาษาจาก ?lang
  useEffect(() => {
    const s = welcome(loadSave());
    setSave(s);
    dispatch({ type: "load", points: s.points });
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "th" || q === "en") setLangState(q);
    setReady(true);
  }, []);

  // แต้มเปลี่ยนใน reducer → ตามไปที่ save
  useEffect(() => {
    if (ready) setSave((s) => (s.points === run.points ? s : { ...s, points: run.points }));
  }, [run.points, ready]);

  // จบรัน (ชนะ/แพ้) → นับสถิติครั้งเดียวต่อรัน (ref กันนับซ้ำตอน re-render)
  useEffect(() => {
    if ((run.status === "won" || run.status === "lost") && counted.current !== run.runId) {
      counted.current = run.runId;
      setSave((s) => ({ ...s, runs: s.runs + 1, bestRunPoints: Math.max(s.bestRunPoints, run.runPoints) }));
    }
  }, [run.status, run.runId, run.runPoints]);

  // save เปลี่ยนเมื่อไหร่ เขียนลงเครื่อง (ไม่เขียนก่อนโหลดเสร็จ — กันทับของเดิมด้วยค่าว่าง)
  useEffect(() => {
    if (ready) writeSave(save);
  }, [save, ready]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // พื้น body เป็นสีน้ำตาลของพอร์ต — เลื่อนเกินขอบบนมือถือจะเห็นแถบน้ำตาล เลยเปลี่ยนเป็นครามระหว่างอยู่โซนนี้
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = NIGHT;
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    const url = new URL(window.location.href);
    if (l === "th") url.searchParams.set("lang", "th");
    else url.searchParams.delete("lang");
    window.history.replaceState(null, "", url);
  }, []);

  const href = useCallback((path: string) => (lang === "th" ? `${path}?lang=th` : path), [lang]);

  const powder = useCallback(() => {
    setPowdered(true);
    setSave((s) => ({ ...s, powdered: s.powdered + 1 }));
  }, []);

  const value = useMemo<OzzyCtx>(
    () => ({ lang, setLang, run, dispatch, save, updateSave: setSave, powder, music, setMusic, href, setOpener }),
    [lang, setLang, run, save, powder, music, href],
  );

  return (
    <Ctx.Provider value={value}>
      <main className={`oz oz-grid oz-main min-h-screen ${powdered ? "oz-powdered" : ""}`}>
        <TopBar />
        <Table weeklyClips={weeklyClips} inert={windowOpen} opener={opener} onFocused={() => setOpener(null)} />
        {children}
      </main>
      {powdered && <Powder lang={lang} times={save.powdered} onWash={() => setPowdered(false)} />}
      {music && <MusicDock lang={lang} onClose={() => setMusic(false)} />}
    </Ctx.Provider>
  );
}
