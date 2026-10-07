
export interface Texts {
  title: string;
  other?: string; 
  date: string;
  place: string;
  about?: string; 
}

export interface Job {
  id: number;
  category: string; 
  emoji?: string;
  color?: string;
  url?: string; 
  count?: number;
  mn: Texts;
  en?: Texts; 
}

export const categories = ["Байгаль", "Хүүхэд", "Тусламж", "Боловсрол", "Амьтан", "Бусад"];

export const looks: { [key: string]: { emoji: string; color: string } } = {
  Байгаль: { emoji: "🌿", color: "#dff5e3" },
  Хүүхэд: { emoji: "🧒", color: "#ffe9d6" },
  Тусламж: { emoji: "🤲", color: "#f9dfe9" },
  Боловсрол: { emoji: "📖", color: "#e4e0fa" },
  Амьтан: { emoji: "🐾", color: "#fff3c9" },
  Бусад: { emoji: "✨", color: "#e8e8ee" },
};

const site = "https://ivolunteer.mn/";


export const jobs: Job[] = [
  {
    id: 5,
    category: "Бусад",
    emoji: "🧩",
    color: "#e4f0ff",
    url: "https://forms.gle/xumnVGTeDczZ5FvJA",
    mn: {
      title: "Mongolian Open 2026 · сайн дурын шүүгч",
      other: "Рубик шоны тэмцээн",
      date: "Албан ёсны нээлттэй тэмцээн · 16+ нас",
      place: "Тэмцээнийг зохион байгуулахад сайн дурын шүүгчээр оролцох",
      about:
        "Рубик шоны албан ёсны нээлттэй тэмцээн удахгүй болно! Тэмцээнийг зохион байгуулахад сайн дурын шүүгчээр оролцох хүсэлтэй хүмүүсийг урьж байна.\n\nТавигдах шаардлага: 16 нас хүрсэн байх.",
    },
    en: {
      title: "Mongolian Open 2026 · Volunteer Judge",
      other: "Rubik's Cube competition",
      date: "Official open competition · 16+",
      place: "Help run the competition as a volunteer judge",
      about:
        "The official Rubik's Cube open competition is coming soon! We invite people who want to volunteer as judges to help organize the competition.\n\nRequirement: must be 16 or older.",
    },
  },
  {
    id: 6,
    category: "Бусад",
    emoji: "🎉",
    color: "#fde4f0",
    url: "https://forms.gle/r45V6Paj8FvrLnwV7",
    mn: {
      title: "SMART 2026 Volunteer Team",
      other: "Эвент, маркетинг",
      date: "SMART Creative Festival · бүртгэл эхэллээ",
      place: "Эвент менежмент, маркетингийн бодит туршлага хуримтлуулах",
      about:
        "SMART Creative Festival-ийн ард ажиллах багт нэгдэж, арга хэмжээний зохион байгуулалт, маркетинг, эвент менежментийн бодит туршлага хуримтлуулахыг хүсэж байна уу?\n\n• Шинэ зүйл сурна\n• Шинэ хүмүүстэй танилцана\n• Бодит эвент дээр ажиллана\n• Хөгжилтэй, эрч хүчтэй багийн нэг хэсэг болно\n\nХэрэв чи санаачлагатай, хариуцлагатай, идэвхтэй бол бид чамайг багтаа хүлээж байна!",
    },
    en: {
      title: "SMART 2026 Volunteer Team",
      other: "Events, marketing",
      date: "SMART Creative Festival · registration open",
      place: "Gain real experience in event management and marketing",
      about:
        "Want to join the team behind the SMART Creative Festival and gain real experience in event organizing, marketing and event management?\n\n• Learn new things\n• Meet new people\n• Work at a real event\n• Be part of a fun, energetic team\n\nIf you are proactive, responsible and motivated, we are waiting for you on the team!",
    },
  },
  {
    id: 1,
    category: "Байгаль",
    emoji: "🌍",
    url: site + "cop17-%d1%81%d0%b0%d0%b9%d0%bd-%d0%b4%d1%83%d1%80%d1%8b%d0%bd-%d0%b0%d0%b6%d0%b8%d0%bb%d1%82%d0%b0%d0%bd/",
    mn: {
      title: "COP17 сайн дурын ажилтан",
      date: "Зарласан: 2026/05/13",
      place: "Цөлжилттэй тэмцэх НҮБ-ын конвенцын COP17 бага хурал",
    },
    en: {
      title: "COP17 Volunteer",
      date: "Posted: 2026/05/13",
      place: "COP17, the UN Convention to Combat Desertification conference",
    },
  },
  {
    id: 2,
    category: "Бусад",
    emoji: "🕊️",
    color: "#fff3c9",
    url: site + "%d0%b1%d0%be%d0%bb%d0%be%d0%bc%d0%b6-3/",
    mn: {
      title: "Эмнести Интернэшнл Монгол",
      other: "Хүний эрх",
      date: "Долоо хоногт 2 удаа, 3–4 цаг",
      place: "Улаанбаатар · Ялгаатай байдлыг дэмжигч хүмүүсийг урьж байна",
      about:
        "Долоо хоногт 2 удаа, 3–4 цаг оролцох боломжтой байх.\nЯлгаатай байдлыг ойлгож, дэмжих чин сэтгэлтэй байх.\n\nБидэнтэй нэгдэж, өөрийн болон бусдын амьдралд үнэ цэн бүтээхийг урьж байна!",
    },
    en: {
      title: "Amnesty International Mongolia",
      other: "Human rights",
      date: "Twice a week, 3–4 hours",
      place: "Ulaanbaatar · Inviting people who support diversity",
      about:
        "Be able to take part twice a week, 3–4 hours each time.\nHave a sincere wish to understand and support diversity.\n\nJoin us and create value in your own life and the lives of others!",
    },
  },
  {
    id: 3,
    category: "Тусламж",
    emoji: "💛",
    color: "#ffe9d6",
    url: site + "%d0%b1%d0%be%d0%bb%d0%be%d0%bc%d0%b6-2/",
    mn: {
      title: "Монголын Дауны холбоо",
      date: "Бүртгэл эхэлсэн · 2026/01/17",
      place: "Дауны хам шинжтэй залуусын нийгмийн оролцоо, хөдөлмөр эрхлэлтийг дэмжих төсөл",
      about:
        "Сайн дурын ажилтны бүртгэл эхэллээ!\n\nМонголын Дауны Холбоо нь “Орон нутгийн санаачилгыг дэмжих Канад сан”-гийн дэмжлэгтэйгээр “Дауны хам шинжтэй залуусын нийгмийн оролцоо ба хөдөлмөр эрхлэлтийг дэмжих” төслийг хэрэгжүүлж байна.",
    },
    en: {
      title: "Mongolian Down Syndrome Association",
      date: "Registration open · 2026/01/17",
      place: "A project supporting social participation and employment of young people with Down syndrome",
      about:
        "Volunteer registration is now open!\n\nWith the support of the Canada Fund for Local Initiatives, the Mongolian Down Syndrome Association is running the project “Supporting the social participation and employment of young people with Down syndrome”.",
    },
  },
  {
    id: 4,
    category: "Бусад",
    emoji: "🕊️",
    color: "#e4e0fa",
    url: site + "%d0%b1%d0%be%d0%bb%d0%be%d0%bc%d0%b6-1/",
    mn: {
      title: "Монголын Эмнести Интернэшнл",
      other: "Хүний эрх",
      date: "Зарласан: 2026/01/17",
      place: "150 гаруй орны хүний эрх хамгаалагчдын хөдөлгөөн",
    },
    en: {
      title: "Amnesty International Mongolia",
      other: "Human rights",
      date: "Posted: 2026/01/17",
      place: "A movement of human rights defenders in more than 150 countries",
    },
  },
];
