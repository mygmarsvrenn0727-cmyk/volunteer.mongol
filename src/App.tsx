import { useEffect, useState, ReactNode, ChangeEvent } from "react";
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

// Зүрх: хадгалсан бол улаан, үгүй бол хүрээтэй
function Heart(props: { on: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={props.on ? "#e0457b" : "none"} stroke={props.on ? "#e0457b" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}


function Pill(props: {
  icon: "tag" | "link";
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
        <Icon name={props.icon} />
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

// Зургийг 256x256 болгож жижигрүүлнэ (хадгалах зай хэмнэхийн тулд)
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

  useEffect(() => window.scrollTo(0, 0), [id]);
  useEffect(() => setName(props.userName), [props.userName]);

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
    // Энд мэдээллийг серверт илгээнэ
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
          <a className="dark big-btn" href={job.url} target="_blank" rel="noreferrer" onClick={() => props.onJoin(job.id)}>
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


function Profile(props: { jobs: Job[]; lang: Lang; user: User | null; joinedIds: number[]; savedIds: number[]; initialTab: "me" | "reg" | "saved"; onLogin: () => void; onUpdate: (changes: { name?: string; photo?: string }) => void }) {
  const [tab, setTab] = useState<"me" | "reg" | "saved">(props.initialTab);
  const [nameInput, setNameInput] = useState(props.user ? props.user.name : "");
  const [nameSaved, setNameSaved] = useState(false);
  const t = text[props.lang];

  if (!props.user) {
    return (
      <main className="page">
        <h1>{t.profile}</h1>
        <p className="meta">{t.mustLogin}</p>
        <button className="dark" style={{ marginTop: 16 }} onClick={props.onLogin}>{t.login}</button>
      </main>
    );
  }

  const ids = tab === "reg" ? props.joinedIds : tab === "saved" ? props.savedIds : [];
  const list = props.jobs.filter((j) => ids.includes(j.id));

  async function pickPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    props.onUpdate({ photo: await resizeImage(file) });
    e.target.value = "";
  }

  function saveName() {
    if (nameInput.trim() === "") return;
    props.onUpdate({ name: nameInput.trim() });
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  }

  return (
    <main className="page">
      <Link className="back" to="/">{t.back}</Link>
      <div className="avatar">
        {props.user.photo ? <img src={props.user.photo} alt="" /> : props.user.name.charAt(0).toUpperCase()}
      </div>
      <h1>{props.user.name}</h1>

      <div className="chips tabs">
        <button className={tab === "me" ? "chip on" : "chip"} onClick={() => setTab("me")}>{t.profile}</button>
        <button className={tab === "reg" ? "chip on" : "chip"} onClick={() => setTab("reg")}>
          {t.registeredList} ({props.joinedIds.length})
        </button>
        <button className={tab === "saved" ? "chip on" : "chip"} onClick={() => setTab("saved")}>
          {t.savedList} ({props.savedIds.length})
        </button>
      </div>

      {tab === "me" && (
        <div className="edit">
          <div className="photo-row">
            <label className="lg filebtn">
              {t.changePhoto}
              <input type="file" accept="image/*" hidden onChange={pickPhoto} />
            </label>
            {props.user.photo && (
              <button className="lg" onClick={() => props.onUpdate({ photo: "" })}>{t.removePhoto}</button>
            )}
          </div>
          <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder={t.fullName} />
          <div className="photo-row" style={{ marginTop: 12 }}>
            <button className="dark" onClick={saveName}>{t.save}</button>
            {nameSaved && <span className="ok" style={{ margin: 0 }}>{t.nameSaved}</span>}
          </div>
        </div>
      )}
      {tab !== "me" && list.length === 0 && <p className="meta">{tab === "reg" ? t.noRegistered : t.noSaved}</p>}

      {list.map((job) => {
        const tx = job[props.lang] || job.mn;
        return (
          <Link className="item" to={"/job/" + job.id} key={job.id}>
            <span className="item-ic" style={{ background: job.color || looks[job.category].color }}>
              {job.emoji || looks[job.category].emoji}
            </span>
            <span className="item-tx">
              <b>{tx.title}</b>
              <span className="meta">{tx.date}</span>
            </span>
            {tab === "reg" && <span className="tag">{t.registeredTag} ✓</span>}
          </Link>
        );
      })}
    </main>
  );
}

// ---------- Үндсэн апп ----------
export default function App() {
  const jobs = startJobs;
  const [filter, setFilter] = useState("Бүгд");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<Lang>("mn");
  const [joinedIds, setJoinedIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [menu, setMenu] = useState(false); // профайл цэс
  const [bell, setBell] = useState(false); // мэдэгдлийн цэс
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

 
  const shown = jobs.filter((job) => {
    const tx = job[lang] || job.mn;
    const okCategory = filter === "Бүгд" || job.category === filter;
    const okSearch = (tx.title + tx.place).toLowerCase().includes(search.toLowerCase());
    return okCategory && okSearch;
  });

  return (
    <HashRouter>
      <div className={dark ? "dark-mode" : ""}>
        <header>
          <Link to="/" className="logo">Volunteer</Link>
          <div className="search">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} />
          </div>
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
            path="/"
            element={
              <main>
                <h1>{t.title}</h1>

                <div className="filters">
                  <Pill
                    icon="tag"
                    label={filter === "Бүгд" ? t.anyCategory : t.categories[filter]}
                    active={filter !== "Бүгд"}
                    selected={filter}
                    onSelect={setFilter}
                    options={[
                      { value: "Бүгд", label: t.anyCategory },
                      ...categories.map((c) => ({ value: c, label: t.categories[c] })),
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
                        <div className="ph" style={{ background: job.color || looks[job.category].color }}>
                          {job.emoji || looks[job.category].emoji}
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
                initialTab="me"
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
