
import { useEffect, useState, ReactNode, ChangeEvent, CSSProperties, useRef } from "react";
import { HashRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { categories, looks, jobs as startJobs, Job } from "./data";
import { text, Lang } from "./i18n";
import { currentUser, login, signup, logout, updateProfile, User } from "./auth";

interface Notif {
  id: number;
  jobId: number;
  read: boolean;
}

function Icon(props: { name: "tag" | "link" | "share" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {props.name === "tag" && (
        <>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <circle cx="7" cy="7" r="1.5" />
        </>
      )}
      {props.name === "link" && (
        <>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </>
      )}
      {props.name === "share" && (
        <>
          <path d="M9 9H7a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3h-2" />
          <path d="M12 15V2.5" />
          <path d="M8 6.5l4-4 4 4" />
        </>
      )}
    </svg>
  );
}

function Chevron(props: { up?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: props.up ? "rotate(180deg)" : "none" }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function Heart(props: { on: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={props.on ? "#e0457b" : "none"} stroke={props.on ? "#e0457b" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function Pill(props: {
  icon?: "tag" | "link";
  label: string;
  active: boolean;
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="dd">
      <button className={props.active ? "pill act" : "pill"} onClick={() => setOpen(!open)}>
        {props.icon && <Icon name={props.icon} />}
        <span>{props.label}</span>
        <Chevron up={open} />
      </button>
      {open && (
        <>
          <div className="overlay" onClick={() => setOpen(false)} />
          <div className="menu">
            {props.options.map((o) => (
              <button
                key={o.value}
                className={o.value === props.selected ? "on" : ""}
                onClick={() => {
                  props.onSelect(o.value);
                  setOpen(false);
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const side = Math.min(img.width, img.height);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function ShareModal(props: { job: Job; lang: Lang; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const t = text[props.lang];
  const tx = props.job[props.lang] || props.job.mn;
  const url = window.location.href.split("#")[0] + "#/job/" + props.job.id;
  const link = encodeURIComponent(url);
  const title = encodeURIComponent(tx.title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy:", url);
    }
  }

  const items: { name: string; href: string; icon: ReactNode }[] = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/sharer/sharer.php?u=" + link,
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="11" fill="#1877f2" />
          <path d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.3-1.4 1.4-1.4h1.4V5.5c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.2H8.4V14h2.3v7z" fill="#fff" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      href: "https://t.me/share/url?url=" + link + "&text=" + title,
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="11" fill="#229ed9" />
          <path d="M5.2 11.8l12.3-4.9c.6-.2 1.1.1.9 1l-2 9.6c-.2.7-.6.9-1.2.6l-3.2-2.4-1.5 1.5c-.2.2-.3.3-.7.3l.2-3.3 6-5.4c.3-.2-.1-.4-.4-.2l-7.4 4.7-3.2-1c-.7-.2-.7-.7.2-1z" fill="#fff" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/sharing/share-offsite/?url=" + link,
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24">
          <rect x="1" y="1" width="22" height="22" rx="4" fill="#0a66c2" />
          <text x="12" y="17" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily="sans-serif">in</text>
        </svg>
      ),
    },
    {
      name: "X",
      href: "https://twitter.com/intent/tweet?url=" + link + "&text=" + title,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path d="M18.2 3h3.1l-6.8 7.7L22.5 21h-6.2l-4.9-6.3L5.8 21H2.7l7.2-8.3L2.2 3h6.3l4.4 5.8zm-1.1 16.2h1.7L7.7 4.7H5.9z" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: t.email,
      href: "mailto:?subject=" + title + "&body=" + link,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="modal" onClick={props.onClose}>
      <div className="box wide" onClick={(e) => e.stopPropagation()}>
        <div className="share-head">
          <h2>{t.share}</h2>
          <button className="x close" onClick={props.onClose}>✕</button>
        </div>

        <div className="share-row">
          <button className="share-item" onClick={copy}>
            <span className="circle"><Icon name="link" /></span>
            <span>{copied ? t.copied : t.copyLink}</span>
          </button>
          {items.map((i) => (
            <a key={i.name} className="share-item" href={i.href} target="_blank" rel="noreferrer">
              <span className="circle">{i.icon}</span>
              <span>{i.name}</span>
            </a>
          ))}
        </div>

        <div className="share-preview">
          <span className="item-ic" style={{ background: props.job.color || looks[props.job.category].color }}>
            {props.job.emoji || looks[props.job.category].emoji}
          </span>
          <span className="item-tx">
            <b>{tx.title}</b>
            <span className="meta">{tx.date}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function JobPage(props: { jobs: Job[]; lang: Lang; joinedIds: number[]; onJoin: (id: number) => void; userName: string; savedIds: number[]; onToggleSave: (id: number) => void; onShare: (job: Job) => void }) {
  const { id } = useParams();
  const [name, setName] = useState(props.userName);
  const [phone, setPhone] = useState("");
  const t = text[props.lang];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setName(props.userName);
  }, [props.userName]);

  const job = props.jobs.find((j) => j.id === Number(id));
  if (!job) {
    return (
      <main>
        <Link className="back" to="/">{t.back}</Link>
        <h1>{t.notFound}</h1>
      </main>
    );
  }

  const tx = job[props.lang] || job.mn;
  const joined = props.joinedIds.includes(job.id);

  function submit() {
    if (name === "" || phone === "") {
      alert(t.needInfo);
      return;
    }
    props.onJoin(job!.id);
    setName("");
    setPhone("");
  }

  return (
    <main className="page">
      <Link className="back" to="/">{t.back}</Link>

      <div className="banner" style={{ background: job.color || looks[job.category].color }}>
        {job.emoji || looks[job.category].emoji}
      </div>

      <h1>{tx.title}</h1>
      {tx.other && <div className="meta">🏷 {tx.other}</div>}
      <div className="meta">📅 {tx.date}</div>
      <div className="meta">📍 {tx.place}</div>

      <button className="lg save" onClick={() => props.onToggleSave(job.id)}>
        <Heart on={props.savedIds.includes(job.id)} />
        {props.savedIds.includes(job.id) ? t.unsave : t.save}
      </button>
      <button className="lg save" style={{ marginLeft: 10 }} onClick={() => props.onShare(job)}>
        <Icon name="share" />
        {t.share}
      </button>

      {tx.about && (
        <>
          <div className="lbl">{t.about}</div>
          <p className="about">{tx.about}</p>
        </>
      )}

      {job.url ? (
        <>
          {joined && <p className="ok">✓ {t.registeredTag}</p>}
          <a
            className="dark big-btn"
            href={job.url}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              if (job) props.onJoin(job.id);
            }}
          >
            {joined ? t.openForm : t.register + " ↗"}
          </a>
        </>
      ) : joined ? (
        <p className="ok">{t.thanks}</p>
      ) : (
        <div className="form">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.name} />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.phone} />
          <button className="dark big-btn" onClick={submit}>{t.register}</button>
        </div>
      )}
    </main>
  );
}

function GamesHub(props: { lang: Lang; user: User | null }) {
  const [selectedGame, setSelectedGame] = useState<"merge" | "wordle" | null>(null);
  const isMn = props.lang === "mn";

  if (selectedGame === "wordle") {
    return <VolunteerWordleGame lang={props.lang} user={props.user} onBack={() => setSelectedGame(null)} />;
  }

  if (selectedGame === "merge") {
    return <VolunteerMergeGame lang={props.lang} user={props.user} onBack={() => setSelectedGame(null)} />;
  }

  return (
    <main className="page" style={{ maxWidth: 800, margin: "0 auto", paddingBottom: 40 }}>
      <Link className="back" to="/">{isMn ? "← Буцах" : "← Back"}</Link>
      <h1 style={{ marginTop: 12 }}>🎮 {isMn ? "Сайн дурын мини тоглоомууд" : "Volunteer Mini Games"}</h1>
      <p className="meta">{isMn ? "Тоглоом тоглож өөрийн оноогоо өсгөн шилдэг лидерүүдийн жагсаалтад бичигдэнэ үү!" : "Play games, increase your score, and climb the leaderboard!"}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 30 }}>
        <div
          onClick={() => setSelectedGame("merge")}
          style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, padding: 24, cursor: "pointer", transition: "transform .2s", boxShadow: "0 4px 12px rgba(0,0,0,.05)" }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>🌱</div>
          <h3 style={{ marginBottom: 8 }}>{isMn ? "Сайн дурын Төсөл Нэгтгэх (4x4)" : "Volunteer Tiles Merge (4x4)"}</h3>
          <p className="meta" style={{ fontSize: 13 }}>{isMn ? "Ижил сайн дурын төсөл, бэлгэдлийг swipe хийж нэгтгэнэ." : "Swipe and merge matching volunteer tiles."}</p>
        </div>

        <div
          onClick={() => setSelectedGame("wordle")}
          style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, padding: 24, cursor: "pointer", transition: "transform .2s", boxShadow: "0 4px 12px rgba(0,0,0,.05)" }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>🧩</div>
          <h3 style={{ marginBottom: 8 }}>{isMn ? "Сайн дурын Үг Сүлжээ (Wordle)" : "Volunteer Wordle (5-Letter)"}</h3>
          <p className="meta" style={{ fontSize: 13 }}>{isMn ? "Сайн дуртай холбоотой 5 үсэгтэй нууц үгийг тааж оноо аваарай." : "Guess the 5-letter volunteer-related hidden word."}</p>
        </div>
      </div>
    </main>
  );
}

function VolunteerMergeGame(props: { lang: Lang; user: User | null; onBack: () => void }) {
  const isMn = props.lang === "mn";
  const [score, setScore] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  // 4x4 board state
  const [board, setBoard] = useState<number[][]>(() => {
    const b = Array(4).fill(0).map(() => Array(4).fill(0));
    addRandomTile(b);
    addRandomTile(b);
    return b;
  });

  const tileIcons = ["🌱", "🧒", "🤲", "📖", "🐾", "💙", "✨", "🌍"];
  const tileColors = ["#dff5e3", "#ffe9d6", "#f9dfe9", "#e4e0fa", "#fff3c9", "#e0f2fe", "#e8e8ee", "#dff5e3"];

  function addRandomTile(b: number[][]) {
    const empty: [number, number][] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) empty.push([r, c]);
      }
    }
    if (empty.length > 0) {
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];
      b[r][c] = Math.random() < 0.85 ? 1 : 2;
    }
  }

  function checkGameOver(b: number[][]): boolean {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) return false;
        if (c < 3 && b[r][c] === b[r][c + 1]) return false;
        if (r < 3 && b[r][c] === b[r + 1][c]) return false;
      }
    }
    return true;
  }

  function slide(row: number[]): { newRow: number[]; gained: number } {
    let arr = row.filter(v => v !== 0);
    let gained = 0;
    let newRow: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
        let mergedVal = arr[i] + 1;
        newRow.push(mergedVal);
        gained += mergedVal * 2;
        i++;
      } else {
        newRow.push(arr[i]);
      }
    }
    while (newRow.length < 4) newRow.push(0);
    return { newRow, gained };
  }

  function move(direction: "left" | "right" | "up" | "down") {
    if (gameOver) return;
    let newBoard = board.map(row => [...row]);
    let totalGained = 0;
    let moved = false;

    if (direction === "left" || direction === "right") {
      for (let r = 0; r < 4; r++) {
        let row = [...newBoard[r]];
        if (direction === "right") row.reverse();
        const { newRow, gained } = slide(row);
        let finalRow = direction === "right" ? newRow.reverse() : newRow;
        if (JSON.stringify(newBoard[r]) !== JSON.stringify(finalRow)) moved = true;
        newBoard[r] = finalRow;
        totalGained += gained;
      }
    } else {
      for (let c = 0; c < 4; c++) {
        let col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]];
        if (direction === "down") col.reverse();
        const { newRow, gained } = slide(col);
        let finalCol = direction === "down" ? newRow.reverse() : newRow;
        for (let r = 0; r < 4; r++) {
          if (newBoard[r][c] !== finalCol[r]) moved = true;
          newBoard[r][c] = finalCol[r];
        }
        totalGained += gained;
      }
    }

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      const newScore = score + totalGained;
      setScore(newScore);
      if (checkGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  }

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) move("right");
      else if (dx < -30) move("left");
    } else {
      if (dy > 30) move("down");
      else if (dy < -30) move("up");
    }
    touchStartRef.current = null;
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") move("left");
      if (e.key === "ArrowRight") move("right");
      if (e.key === "ArrowUp") move("up");
      if (e.key === "ArrowDown") move("down");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [board, gameOver, score]);

  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>(() => {
    try {
      const saved = localStorage.getItem("vol_merge_scores");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    if (props.user && score > 0) {
      const uName = props.user.name;
      const updated = leaderboard.map(p => p.name === uName ? { ...p, score: Math.max(p.score, score) } : p);
      if (!updated.some(p => p.name === uName)) {
        updated.push({ name: uName, score });
      }
      updated.sort((a, b) => b.score - a.score);
      const top10 = updated.slice(0, 10);
      setLeaderboard(top10);
      localStorage.setItem("vol_merge_scores", JSON.stringify(top10));
    }
  }, [score]);

  function restartGame() {
    const b = Array(4).fill(0).map(() => Array(4).fill(0));
    addRandomTile(b);
    addRandomTile(b);
    setBoard(b);
    setScore(0);
    setGameOver(false);
  }

  return (
    <main className="page" style={{ maxWidth: 900, margin: "0 auto", paddingBottom: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="back" onClick={props.onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {isMn ? "← Тоглоомын цэс рүү буцах" : "← Back to Games"}
        </button>
        <button onClick={() => setShowHelp(true)} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--line)", background: "var(--card)", cursor: "pointer", fontWeight: 700 }}>
          ?
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, flexWrap: "wrap", gap: 20 }}>
        <div>
          <h1>🌱 {isMn ? "Сайн дурын Төсөл Нэгтгэх (4x4)" : "Volunteer Tiles Merge (4x4)"}</h1>
          <p className="meta">{isMn ? "Swipe хийж эсвэл сумтай товчлуураар ижил дүрсүүдийг нэгтгэнэ!" : "Swipe or use arrow keys to match tiles!"}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", padding: "8px 16px", borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "gray" }}>SCORE</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{score}</div>
          </div>
          <button className="dark" onClick={restartGame}>
            {isMn ? "Дахин эхлэх" : "Restart"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, marginTop: 24, alignItems: "start" }}>
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ background: "var(--card)", padding: 24, borderRadius: 16, border: "1px solid var(--line)", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 75px)", gap: 10 }}>
            {board.map((row, r) =>
              row.map((val, c) => (
                <div
                  key={`${r}-${c}`}
                  style={{
                    width: 75,
                    height: 75,
                    borderRadius: 12,
                    background: val > 0 ? tileColors[(val - 1) % tileColors.length] : "var(--line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: val > 0 ? 32 : 0,
                    fontWeight: 700,
                    transition: "transform 0.1s ease",
                  }}
                >
                  {val > 0 ? tileIcons[(val - 1) % tileIcons.length] : ""}
                </div>
              ))
            )}
          </div>

          {gameOver && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: "#fff" }}>
              <h2>{isMn ? "Тоглоом дууслаа!" : "Game Over!"}</h2>
              <p>{isMn ? `Таны оноо: ${score}` : `Your Score: ${score}`}</p>
              <button className="dark" onClick={restartGame} style={{ background: "#fff", color: "#000", fontWeight: 700, padding: "10px 24px" }}>
                {isMn ? "Дахин тоглох (Play Again)" : "Play Again"}
              </button>
            </div>
          )}

          <p className="meta" style={{ textAlign: "center", fontSize: 12, marginTop: 16 }}>
            {isMn ? "Дэлгэц дээр swipe хийх эсвэл гарын сумнуудаар тоглоно." : "Swipe on screen or use keyboard arrow keys."}
          </p>
        </div>

        <div style={{ background: "var(--card)", padding: 16, borderRadius: 16, border: "1px solid var(--line)" }}>
          <h3 style={{ fontSize: 16, marginBottom: 12, borderBottom: "1px solid var(--line)", paddingBottom: 8 }}>
            🏆 {isMn ? "Шилдэг оролцогчид (Top 10)" : "Top 10 Leaderboard"}
          </h3>
          {leaderboard.length === 0 ? (
            <p className="meta" style={{ fontSize: 13, padding: "10px 0" }}>{isMn ? "Одоогоор оноо бүртгэгдээгүй байна." : "No scores recorded yet."}</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              {leaderboard.map((p, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="meta">{idx + 1}. {p.name}</span>
                  <b style={{ fontSize: 12 }}>{p.score.toLocaleString()}</b>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showHelp && (
        <div className="modal" onClick={() => setShowHelp(false)}>
          <div className="box" onClick={(e) => e.stopPropagation()}>
            <h2>{isMn ? "Хэрхэн тоглох вэ?" : "How to play"}</h2>
            <p style={{ margin: "14px 0", lineHeight: 1.5, fontSize: 14 }}>
              {isMn
                ? "Дэлгэц дээр баруун, зүүн, дээш, доош swipe хийж ижил дүрсүүдийг хооронд нь мөргөлдүүлэн нэгтгээрэй. Ижил дүрсүүд нийлэхэд оноо өсч шат ахина."
                : "Swipe left, right, up, or down to merge matching volunteer tiles and grow your score!"}
            </p>
            <button className="dark full" onClick={() => setShowHelp(false)}>Got it</button>
          </div>
        </div>
      )}
    </main>
  );
}

function VolunteerWordleGame(props: { lang: Lang; user: User | null; onBack: () => void }) {
  const isMn = props.lang === "mn";
  const targetWord = "YOUTH";
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(150);
  const [showHelp, setShowHelp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>(() => {
    try {
      const saved = localStorage.getItem("vol_wordle_scores");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    if (won && props.user) {
      const uName = props.user.name;
      const updated = leaderboard.map(p => p.name === uName ? { ...p, score: Math.max(p.score, score) } : p);
      if (!updated.some(p => p.name === uName)) {
        updated.push({ name: uName, score: score });
      }
      updated.sort((a, b) => b.score - a.score);
      const top10 = updated.slice(0, 10);
      setLeaderboard(top10);
      localStorage.setItem("vol_wordle_scores", JSON.stringify(top10));
    }
  }, [won]);

  function handleKey(key: string) {
    if (gameOver) return;
    setErrorMsg("");
    if (key === "ENTER") {
      if (currentGuess.length !== 5) {
        setErrorMsg(isMn ? "5 үсэг бүтэн бичнэ үү!" : "Type 5 letters!");
        return;
      }
      
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      if (currentGuess === targetWord) {
        setWon(true);
        setGameOver(true);
      } else if (newGuesses.length >= 6) {
        setGameOver(true);
      }
      setCurrentGuess("");
    } else if (key === "BACK") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else {
      if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
        setCurrentGuess(currentGuess + key);
      }
    }
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") handleKey("ENTER");
      else if (e.key === "Backspace") handleKey("BACK");
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentGuess, gameOver]);

  return (
    <main className="page" style={{ maxWidth: 900, margin: "0 auto", paddingBottom: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="back" onClick={props.onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {isMn ? "← Тоглоомын цэс рүү буцах" : "← Back to Games"}
        </button>
        <button onClick={() => setShowHelp(true)} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--line)", background: "var(--card)", cursor: "pointer", fontWeight: 700 }}>
          ?
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, flexWrap: "wrap", gap: 20 }}>
        <div>
          <h1>🧩 {isMn ? "Сайн дурын Үг Сүлжээ (Wordle)" : "Volunteer Wordle (5-Letter)"}</h1>
          <p className="meta">{isMn ? "Сайн дуртай холбоотой 5 үсэгтэй үгийг таагаарай!" : "Guess the 5-letter volunteer-related word!"}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", padding: "8px 16px", borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "gray" }}>SCORE</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{score}</div>
          </div>
          <button className="dark" onClick={() => { setGuesses([]); setCurrentGuess(""); setGameOver(false); setWon(false); setErrorMsg(""); }}>
            {isMn ? "Дахин эхлэх" : "Restart"}
          </button>
        </div>
      </div>

      {errorMsg && <div style={{ color: "#ef4444", fontWeight: 600, marginTop: 8, fontSize: 13 }}>{errorMsg}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, marginTop: 24, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "var(--card)", padding: 24, borderRadius: 16, border: "1px solid var(--line)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {Array.from({ length: 6 }).map((_, rIdx) => {
              const guess = guesses[rIdx] || (rIdx === guesses.length ? currentGuess : "");
              return (
                <div key={rIdx} style={{ display: "flex", gap: 8 }}>
                  {Array.from({ length: 5 }).map((_, cIdx) => {
                    const char = guess[cIdx] || "";
                    let bg = "transparent";
                    let border = "2px solid var(--line)";
                    let color = "var(--ink)";
                    
                    if (rIdx < guesses.length) {
                      if (targetWord[cIdx] === char) {
                        bg = "#22c55e"; color = "#fff"; border = "2px solid #22c55e";
                      } else if (targetWord.includes(char)) {
                        bg = "#eab308"; color = "#fff"; border = "2px solid #eab308";
                      } else {
                        bg = "#64748b"; color = "#fff"; border = "2px solid #64748b";
                      }
                    }
                    return (
                      <div key={cIdx} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, borderRadius: 8, background: bg, border: border, color: color }}>
                        {char}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {gameOver && (
            <div style={{ marginBottom: 16, textAlign: "center" }}>
              <h3 style={{ color: won ? "#22c55e" : "#ef4444" }}>
                {won ? (isMn ? "🎉 Баяр хүргэе! Та үгийг зөв таалаа!" : "🎉 You Won!") : (isMn ? "😔 Тоглоом дууслаа. Зөв үг: YOUTH" : "😔 Game Over. Word was: YOUTH")}
              </h3>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", maxWidth: 360 }}>
            {["Q W E R T Y U I O P".split(" "), "A S D F G H J K L".split(" "), ["Z", "X", "C", "V", "B", "N", "M", "BACK", "ENTER"]].map((row, rIdx) => (
              <div key={rIdx} style={{ display: "flex", justifyContent: "center", gap: 4 }}>
                {row.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleKey(key === "BACK" ? "BACK" : key === "ENTER" ? "ENTER" : key)}
                    style={{ padding: key.length > 1 ? "10px 10px" : "10px 11px", background: key === "ENTER" ? "var(--ink)" : "var(--line)", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: 11, color: key === "ENTER" ? "var(--bg)" : "var(--ink)" }}
                  >
                    {key === "BACK" ? "⌫" : key}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--card)", padding: 16, borderRadius: 16, border: "1px solid var(--line)" }}>
          <h3 style={{ fontSize: 16, marginBottom: 12, borderBottom: "1px solid var(--line)", paddingBottom: 8 }}>
            🏆 {isMn ? "Шилдэг оролцогчид (Top 10)" : "Top 10 Leaderboard"}
          </h3>
          {leaderboard.length === 0 ? (
            <p className="meta" style={{ fontSize: 13, padding: "10px 0" }}>{isMn ? "Одоогоор оноо бүртгэгдээгүй байна." : "No scores recorded yet."}</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              {leaderboard.map((p, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="meta">{idx + 1}. {p.name}</span>
                  <b style={{ fontSize: 12 }}>{p.score.toLocaleString()}</b>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showHelp && (
        <div className="modal" onClick={() => setShowHelp(false)}>
          <div className="box" onClick={(e) => e.stopPropagation()}>
            <h2>{isMn ? "Хэрхэн тоглох вэ?" : "How to play"}</h2>
            <p style={{ margin: "14px 0", lineHeight: 1.5, fontSize: 14 }}>
              {isMn
                ? "Сайн дурын үйл ажиллагаатай холбоотой 5 үсэгтэй нууц үгийг 6 оролдлогоор тааж олоорой. Үсэг зөв байрлалд байвал 🟩 ногоон, байрлал буруу ч үгэнд орсон бол 🟨 шар өнгөтэй харагдана."
                : "Guess the 5-letter volunteer-related word in 6 tries. Green means correct letter and spot, yellow means correct letter in wrong spot."}
            </p>
            <button className="dark full" onClick={() => setShowHelp(false)}>Got it</button>
          </div>
        </div>
      )}
    </main>
  );
}

const pencilStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: "50%",
  border: "1px solid var(--line)",
  background: "var(--card)",
  color: "var(--ink)",
  cursor: "pointer",
  padding: 0,
  boxShadow: "0 1px 3px rgba(0,0,0,.18)",
};

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function Profile(props: { jobs: Job[]; lang: Lang; user: User | null; joinedIds: number[]; savedIds: number[]; initialTab: "reg" | "saved" | "done"; onLogin: () => void; onUpdate: (changes: { name?: string; photo?: string }) => void }) {
  const [tab, setTab] = useState<"reg" | "saved" | "done">(props.initialTab);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(props.user ? props.user.name : "");
  const [doneIds, setDoneIds] = useState<number[]>([]);
  const t = text[props.lang];
  const mn = props.lang === "mn";

  const doneKey = props.user ? "vol_done_" + props.user.email : "";
  useEffect(() => {
    try {
      setDoneIds(doneKey ? JSON.parse(localStorage.getItem(doneKey) || "[]") : []);
    } catch {
      setDoneIds([]);
    }
  }, [doneKey]);

  function toggleDone(id: number) {
    const next = doneIds.includes(id) ? doneIds.filter((x) => x !== id) : [...doneIds, id];
    setDoneIds(next);
    if (doneKey) localStorage.setItem(doneKey, JSON.stringify(next));
  }

  if (!props.user) {
    return (
      <main className="page">
        <h1>{t.profile}</h1>
        <p className="meta">{t.mustLogin}</p>
        <button className="dark" style={{ marginTop: 16 }} onClick={props.onLogin}>{t.login}</button>
      </main>
    );
  }

  const ids = tab === "reg" ? props.joinedIds : tab === "saved" ? props.savedIds : doneIds;
  const list = props.jobs.filter((j) => ids.includes(j.id));

  async function pickPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    props.onUpdate({ photo: await resizeImage(file) });
    e.target.value = "";
  }

  function saveName() {
    const n = nameInput.trim();
    setEditing(false);
    if (n === "" || n === props.user!.name) {
      setNameInput(props.user!.name);
      return;
    }
    props.onUpdate({ name: n });
  }

  return (
    <main className="page">
      <Link className="back" to="/">{t.back}</Link>

      <div style={{ position: "relative", width: 72, marginTop: 18 }}>
        <div className="avatar" style={{ marginTop: 0 }}>
          {props.user.photo ? <img src={props.user.photo} alt="" /> : props.user.name.charAt(0).toUpperCase()}
        </div>
        <label title={t.changePhoto} style={{ ...pencilStyle, position: "absolute", right: -6, bottom: -6 }}>
          <PencilIcon />
          <input type="file" accept="image/*" hidden onChange={pickPhoto} />
        </label>
      </div>
      {props.user.photo && (
        <button className="x" style={{ width: "auto", textAlign: "left", margin: "8px 0 0", padding: 0 }} onClick={() => props.onUpdate({ photo: "" })}>
          {t.removePhoto}
        </button>
      )}

      {editing ? (
        <input
          autoFocus
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onBlur={saveName}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveName();
            if (e.key === "Escape") {
              setNameInput(props.user!.name);
              setEditing(false);
            }
          }}
          style={{ fontSize: 20, fontWeight: 600, margin: "24px 0 18px", padding: "6px 12px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--card)", color: "var(--ink)", width: "100%" }}
        />
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1>{props.user.name}</h1>
          <button
            type="button"
            title={t.fullName}
            style={pencilStyle}
            onClick={() => {
              if (props.user) {
                setNameInput(props.user.name);
                setEditing(true);
              }
            }}
          >
            <PencilIcon />
          </button>
        </div>
      )}

      <div className="chips tabs">
        <button className={tab === "reg" ? "chip on" : "chip"} onClick={() => setTab("reg")}>
          {mn ? "Орж харсан түүх" : "Watch history"} ({props.joinedIds.length})
        </button>
        <button className={tab === "saved" ? "chip on" : "chip"} onClick={() => setTab("saved")}>
          {t.savedList} ({props.savedIds.length})
        </button>
        <button className={tab === "done" ? "chip on" : "chip"} onClick={() => setTab("done")}>
          {mn ? "Миний хийсэн сайн дурын ажил" : "My completed work"} ({doneIds.length})
        </button>
      </div>

      {list.length === 0 && (
        <p className="meta">
          {tab === "saved"
            ? t.noSaved
            : tab === "reg"
            ? t.noRegistered
            : mn
            ? "Та хараахан сайн дурын ажил хийж дуусгаагүй байна. «Миний бүртгэл» табаас хийсэн ажлаа тэмдэглээрэй."
            : "Nothing completed yet. Mark jobs as done in the My registrations tab."}
        </p>
      )}

      {list.map((job) => {
        const tx = job[props.lang] || job.mn;
        const done = doneIds.includes(job.id);
        return (
          <Link className="item" to={"/job/" + job.id} key={job.id}>
            <span className="item-ic" style={{ background: job.color || looks[job.category].color }}>
              {job.emoji || looks[job.category].emoji}
            </span>
            <span className="item-tx">
              <b>{tx.title}</b>
              <span className="meta">{tx.date}</span>
            </span>
            {tab === "done" && <span className="tag">{mn ? "Хийсэн" : "Done"} ✓</span>}
            {tab === "reg" && (
              <button
                className="lg"
                style={{ height: 34, fontSize: 13, padding: "0 14px", whiteSpace: "nowrap" }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleDone(job.id);
                }}
              >
                {done ? (mn ? "Хийсэн ✓" : "Done ✓") : mn ? "Хийсэн гэж тэмдэглэх" : "Mark as done"}
              </button>
            )}
          </Link>
        );
      })}
    </main>
  );
}

export default function App() {
  const jobs = startJobs;
  const [filter, setFilter] = useState("Бүгд");
  const [sortOrder, setSortOrder] = useState("Бүгд");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<Lang>("mn");
  const [joinedIds, setJoinedIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [menu, setMenu] = useState(false); 
  const [bell, setBell] = useState(false); 
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [shareJob, setShareJob] = useState<Job | null>(null);

  const [user, setUser] = useState<User | null>(currentUser());
  const [authMode, setAuthMode] = useState<"" | "login" | "signup">("");
  const [aName, setAName] = useState("");
  const [aEmail, setAEmail] = useState("");
  const [aPass, setAPass] = useState("");
  const [aError, setAError] = useState("");

  const t = text[lang];

  const joinedKey = user ? "vol_joined_" + user.email : "";
  useEffect(() => {
    try {
      setJoinedIds(joinedKey ? JSON.parse(localStorage.getItem(joinedKey) || "[]") : []);
    } catch {
      setJoinedIds([]);
    }
  }, [joinedKey]);

  const savedKey = user ? "vol_saved_" + user.email : "";
  useEffect(() => {
    try {
      setSavedIds(savedKey ? JSON.parse(localStorage.getItem(savedKey) || "[]") : []);
    } catch {
      setSavedIds([]);
    }
  }, [savedKey]);

  function toggleSave(id: number) {
    if (!user) {
      setAuthMode("login");
      setAError(t.needLogin);
      return;
    }
    const next = savedIds.includes(id) ? savedIds.filter((x) => x !== id) : [...savedIds, id];
    setSavedIds(next);
    localStorage.setItem(savedKey, JSON.stringify(next));
  }

  const notifKey = user ? "vol_notifs_" + user.email : "";
  useEffect(() => {
    try {
      setNotifs(notifKey ? JSON.parse(localStorage.getItem(notifKey) || "[]") : []);
    } catch {
      setNotifs([]);
    }
  }, [notifKey]);

  function saveNotifs(next: Notif[]) {
    setNotifs(next);
    if (notifKey) localStorage.setItem(notifKey, JSON.stringify(next));
  }

  function openBell() {
    setMenu(false);
    setBell(!bell);
    saveNotifs(notifs.map((n) => ({ ...n, read: true })));
  }

  function updateUser(changes: { name?: string; photo?: string }) {
    if (!user) return;
    const updated = updateProfile(user.email, changes);
    if (updated) setUser(updated);
  }

  function joinJob(id: number) {
    if (joinedIds.includes(id)) return;
    if (notifKey) saveNotifs([{ id: Date.now(), jobId: id, read: false }, ...notifs]);
    const next = [...joinedIds, id];
    setJoinedIds(next);
    if (joinedKey) localStorage.setItem(joinedKey, JSON.stringify(next));
  }

  function openAuth(mode: "login" | "signup") {
    setAuthMode(mode);
    setAError("");
  }

  async function submitAuth() {
    const email = aEmail.trim().toLowerCase();
    if (!email || !aPass || (authMode === "signup" && !aName.trim())) return setAError(t.fillAll);
    if (!/^\S+@\S+\.\S+$/.test(email)) return setAError(t.badEmail);
    if (authMode === "signup" && aPass.length < 6) return setAError(t.shortPw);

    const result = authMode === "signup" ? await signup(aName.trim(), email, aPass) : await login(email, aPass);
    if (result === "exists") return setAError(t.exists);
    if (result === null) return setAError(t.wrong);

    setUser(result);
    setAuthMode("");
    setAName("");
    setAEmail("");
    setAPass("");
  }

  const shown = jobs
    .filter((job) => {
      const tx = job[lang] || job.mn;
      const okCategory = filter === "Бүгд" || job.category === filter;
      const okSearch = (tx.title + tx.place).toLowerCase().includes(search.toLowerCase());
      return okCategory && okSearch;
    })
    .sort((a, b) => {
      if (sortOrder === "Шинэ" || sortOrder === "New") return b.id - a.id;
      if (sortOrder === "Хуучин" || sortOrder === "Old") return a.id - b.id;
      return 0;
    });

  return (
    <HashRouter>
      <div className={dark ? "dark-mode" : ""}>
        <header>
          <Link to="/" className="logo">Volunteer</Link>
          <div className="search">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} />
          </div>
          <Link to="/games" className="lg" style={{ textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, height: 36 }}>
            <span>🎮</span>
            <span>{lang === "mn" ? "Тоглоом" : "Games"}</span>
          </Link>
          {user ? (
            <>
            <div className="acc">
              <button className="bell" onClick={openBell} aria-label={t.notifications}>
                <BellIcon />
                {notifs.some((n) => !n.read) && <span className="badge">{notifs.filter((n) => !n.read).length}</span>}
              </button>
              {bell && (
                <>
                  <div className="overlay" onClick={() => setBell(false)} />
                  <div className="menu right notifs">
                    <div className="menu-title">{t.notifications}</div>
                    {notifs.length === 0 && <p className="meta pad">{t.noNotifs}</p>}
                    {notifs.map((n) => {
                      const job = jobs.find((j) => j.id === n.jobId);
                      if (!job) return null;
                      const tx = job[lang] || job.mn;
                      return (
                        <Link key={n.id} to={"/job/" + job.id} onClick={() => setBell(false)}>
                          <b>✓ {t.notifRegistered}</b>
                          <br />
                          <span className="meta">{tx.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <div className="acc">
              <button className="avatar-btn" onClick={() => { setBell(false); setMenu(!menu); }}>
                <span className="av">
                  {user.photo ? <img src={user.photo} alt="" /> : user.name.charAt(0).toUpperCase()}
                </span>
                <Chevron up={menu} />
              </button>
              {menu && (
                <>
                  <div className="overlay" onClick={() => setMenu(false)} />
                  <div className="menu right">
                    <Link to="/profile/registered" onClick={() => setMenu(false)}>{t.myRegs}</Link>
                    <Link to="/profile/saved" onClick={() => setMenu(false)}>{t.mySaved}</Link>
                    <Link to="/profile" onClick={() => setMenu(false)}>{t.viewProfile}</Link>
                    <hr />
                    <button
                      onClick={() => {
                        logout();
                        setUser(null);
                        setMenu(false);
                      }}
                    >
                      {t.logout}
                    </button>
                  </div>
                </>
              )}
            </div>
            </>
          ) : (
            <>
              <button className="lg" onClick={() => openAuth("login")}>{t.login}</button>
              <button className="dark" onClick={() => openAuth("signup")}>{t.signup}</button>
            </>
          )}
          <button className="lg" onClick={() => setLang(lang === "mn" ? "en" : "mn")}>
            {lang === "mn" ? "EN" : "МН"}
          </button>
          <button className="tg" onClick={() => setDark(!dark)}>◐</button>
        </header>

        <Routes>
          <Route
            path="/games"
            element={<GamesHub lang={lang} user={user} />}
          />
          <Route
            path="/"
            element={
              <main>
                <h1>{t.title}</h1>

                <div className="filters" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <Pill
                    label={sortOrder === "Бүгд" ? (lang === "mn" ? "Бүгд" : "All") : sortOrder === "Шинэ" ? (lang === "mn" ? "Шинэ" : "New") : (lang === "mn" ? "Хуучин" : "Old")}
                    active={sortOrder !== "Бүгд"}
                    selected={sortOrder}
                    onSelect={setSortOrder}
                    options={[
                      { value: "Бүгд", label: lang === "mn" ? "Бүгд" : "All" },
                      { value: "Шинэ", label: lang === "mn" ? "Шинэ" : "New" },
                      { value: "Хуучин", label: lang === "mn" ? "Хуучин" : "Old" },
                    ]}
                  />

                  <Pill
                    icon="tag"
                    label={filter === "Бүгд" ? t.anyCategory : t.categories[filter] || filter}
                    active={filter !== "Бүгд"}
                    selected={filter}
                    onSelect={setFilter}
                    options={[
                      { value: "Бүгд", label: t.anyCategory },
                      ...categories.map((c) => ({ value: c, label: t.categories[c] || c })),
                    ]}
                  />
                </div>

                <div className="grid">
                  {shown.length === 0 && <div className="empty">{t.none}</div>}

                  {shown.map((job) => {
                    const tx = job[lang] || job.mn;
                    const joined = joinedIds.includes(job.id);
                    return (
                      <Link className="card" to={"/job/" + job.id} key={job.id}>
                        <div className="ph" style={{ background: job.color || looks[job.category]?.color || "#f0f0f0" }}>
                          {job.emoji || looks[job.category]?.emoji || "📌"}
                          <div className="ph-actions">
                            <button
                              className="heart"
                              aria-label={t.share}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShareJob(job);
                              }}
                            >
                              <Icon name="share" />
                            </button>
                            <button
                              className="heart"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleSave(job.id);
                              }}
                            >
                              <Heart on={savedIds.includes(job.id)} />
                            </button>
                          </div>
                        </div>
                        <div className="bd">
                          <h3>{tx.title}</h3>
                          {tx.other && <div className="meta">🏷 {tx.other}</div>}
                          <div className="meta">{tx.date}</div>
                          <div className="meta">{tx.place}</div>
                          <div className="row">
                            <span className="cnt">
                              {job.url ? job.url.split("/")[2] : (job.count || 0) + (joined ? 1 : 0) + " " + t.volunteers}
                            </span>
                            <span className="join">{t.register}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </main>
            }
          />
          <Route
            path="/job/:id"
            element={
              <JobPage
                jobs={jobs}
                lang={lang}
                joinedIds={joinedIds}
                onJoin={joinJob}
                userName={user ? user.name : ""}
                savedIds={savedIds}
                onToggleSave={toggleSave}
                onShare={setShareJob}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                key="me"
                jobs={jobs}
                lang={lang}
                user={user}
                joinedIds={joinedIds}
                savedIds={savedIds}
                initialTab="reg"
                onLogin={() => openAuth("login")}
                onUpdate={updateUser}
              />
            }
          />
          <Route
            path="/profile/registered"
            element={
              <Profile
                key="reg"
                jobs={jobs}
                lang={lang}
                user={user}
                joinedIds={joinedIds}
                savedIds={savedIds}
                initialTab="reg"
                onLogin={() => openAuth("login")}
                onUpdate={updateUser}
              />
            }
          />
          <Route
            path="/profile/saved"
            element={
              <Profile
                key="saved"
                jobs={jobs}
                lang={lang}
                user={user}
                joinedIds={joinedIds}
                savedIds={savedIds}
                initialTab="saved"
                onLogin={() => openAuth("login")}
                onUpdate={updateUser}
              />
            }
          />
        </Routes>

        <footer>{t.footer}</footer>

        {shareJob && <ShareModal job={shareJob} lang={lang} onClose={() => setShareJob(null)} />}

        {authMode !== "" && (
          <div className="modal">
            <div className="box">
              <h2>{authMode === "signup" ? t.signup : t.login}</h2>
              {authMode === "signup" && (
                <input value={aName} onChange={(e) => setAName(e.target.value)} placeholder={t.fullName} />
              )}
              <input type="email" value={aEmail} onChange={(e) => setAEmail(e.target.value)} placeholder={t.email} />
              <input type="password" value={aPass} onChange={(e) => setAPass(e.target.value)} placeholder={t.password} />
              {aError && <div className="err">{aError}</div>}
              <button className="dark full" onClick={submitAuth}>
                {authMode === "signup" ? t.signup : t.login}
              </button>
              <button className="x" onClick={() => openAuth(authMode === "signup" ? "login" : "signup")}>
                {authMode === "signup" ? t.haveAcc : t.noAcc}
              </button>
              <button className="x" onClick={() => setAuthMode("")}>{t.cancel}</button>
            </div>
          </div>
        )}

      </div>
    </HashRouter>
  );
}

