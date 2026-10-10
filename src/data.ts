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

export const categories = ["Байгаль", "Хүүхэд", "Тусламж", "Боловсрол", "Амьтан", "Эрүүл мэнд", "Бусад"];

export const looks: { [key: string]: { emoji: string; color: string } } = {
  Байгаль: { emoji: "🌿", color: "#dff5e3" },
  Хүүхэд: { emoji: "🧒", color: "#ffe9d6" },
  Тусламж: { emoji: "🤲", color: "#f9dfe9" },
  Боловсрол: { emoji: "📖", color: "#e4e0fa" },
  Амьтан: { emoji: "🐾", color: "#fff3c9" },
  "Эрүүл мэнд": { emoji: "💙", color: "#e0f2fe" },
  Бусад: { emoji: "✨", color: "#e8e8ee" },
};

const site = "https://ivolunteer.mn/";

export const jobs: Job[] = [
  {
    id: 8,
    category: "Боловсрол",
    emoji: "🧭",
    color: "#e4e0fa",
    url: "https://scholar-compass-youth-opportunities.vercel.app/#/",
    mn: {
      title: "Scholar Compass · Боломжуудын Платформ",
      other: "Тэтгэлэг, IELTS/SAT бэлтгэл, Сайн дурын ажил",
      date: "Үнэгүй сургалт · Өдөр бүр шинэчлэгдэнэ",
      place: "Онлайн платформ",
      about:
        "Гадаадад суралцах, тэтгэлэг авах, их сургуульд бэлдэх, өөрийгөө хөгжүүлэх боломжуудыг нэг дор төвлөрүүлсэн Scholar Compass вебсайт 100% үнэгүй!\n\nЮу хийж болох вэ?\n1. Үнэгүй сайн дурын ажил, залуучуудын хөтөлбөр, дадлага, тэтгэлэгт сургалтууд.\n2. IELTS болон SAT-ын Guide Lessons хичээлүүд.\n3. Залуучуудад зориулсан өөрийгөө хөгжүүлэх нийтлэлүүд.\n4. Тест ажиллангаа ахиц дэвшлээ түүх хэлбэрээр хянах.\n5. XP цуглуулан Leaderboard-д өРСӨЛДӨХ, долоо хоног бүрийн тэргүүлэгчдэд зориулсан шагналын систем.",
    },
    en: {
      title: "Scholar Compass · Youth Opportunities Platform",
      other: "Scholarships, IELTS/SAT Prep, Volunteering",
      date: "100% Free · Updated Daily",
      place: "Online Platform",
      about:
        "Scholar Compass brings together study abroad opportunities, scholarships, college prep, and self-development materials completely free!\n\nFeatures:\n1. Daily volunteer opportunities, internships, and scholarships.\n2. Free IELTS & SAT guide lessons.\n3. Educational articles for youth.\n4. Progress tracking history.\n5. Earn XP and compete on weekly leaderboards for rewards.",
    },
  },
  {
    id: 9,
    category: "Хүүхэд",
    emoji: "💜",
    color: "#f9dfe9",
    url: "https://www.volunteer.org.mn/#/event/30",
    mn: {
      title: "BECAUSE I AM A GIRL · Чуулганы төслийн уралдаан",
      other: "Охидын эрх, нийгмийн оролцоо",
      date: "Чуулган: 2026/10/10 · Бүртгэл: 10/09 19:00 хүртэл",
      place: "12–18 насны охид, хөвгүүд",
      about:
        "Охидын дуу хоолой, үзэл бодол, бүтээлч санаа, оролцоог дэмжих 'BECAUSE I AM A GIRL' нөлөөллийн чуулганд оролцох бүртгэл эхэллээ!\n\nЮу болох вэ?\n• Охидын эрх, оролцооны талаар ярилцах\n• Өөрийн үзэл бодол, санаагаа илэрхийлэх\n• Бүтээлч үе тэнгийнхэнтэйгээ танилцах\n• Төслийн уралдаанд оролцож, санаагаа бодит ажил болгох\n\nБүртгүүлэх линк: https://www.volunteer.org.mn/#/event/30\nТөслийн уралдаан: https://www.volunteer.org.mn/#/event/34",
    },
    en: {
      title: "BECAUSE I AM A GIRL · Youth Forum & Project Contest",
      other: "Girls' Rights & Social Participation",
      date: "Event: 2026/10/10 · Deadline: Oct 9, 19:00",
      place: "For youth aged 12–18",
      about:
        "Registration is open for the 'BECAUSE I AM A GIRL' advocacy forum supporting girls' empowerment and initiative!\n\nHighlights:\n• Discuss girls' rights and participation\n• Express your ideas and solutions\n• Network with creative peers\n• Enter the project contest and make an impact!",
    },
  },
  {
    id: 10,
    category: "Боловсрол",
    emoji: "🎓",
    color: "#ffe9d6",
    url: "https://hurteemj.github.io/.mn",
    mn: {
      title: "Sean Academy · Хүүхдүүдэд англи хэл заах",
      other: "Багшлах, нийгмийн халамж",
      date: "2026/10/10 – 12/20 · 7 хоногт 3 удаа, 1.5 цаг",
      place: "Сонгинохайрхан дүүрэг (Улаанчулуут)",
      about:
        "Сонгинохайрхан дүүргийн (Улаанчулуутын хогийн цэгийн ойролцоо) хүүхдүүдэд англи хэл заах сайн дурын ажилтан хайж байна. Англи хэлний дунд болон ахисан түвшний хүмүүсийг урьж байна (Нийт 6 хүн).\n\n🎁 Урамшуулал & Давуу тал:\n• Унааны мөнгө олгоно\n• Recommendation letter (Тодорхойлох захидал)\n• Гадаадад суралцах зөвлөгөө\n\n⚠️ Санамж: 18-аас доош насныхан туслах багшаар ажиллаж болох бөгөөд эцэг эхийн зөвшөөрлийн хуудас заавал шаардлагатай.",
    },
    en: {
      title: "Sean Academy · Volunteer English Teacher",
      other: "Teaching & Community Service",
      date: "Oct 10 – Dec 20 · 3x a week, 1.5 hrs each",
      place: "Songinokhairkhan District (Ulaanchuluut)",
      about:
        "We are looking for volunteer English teachers to teach children in Songinokhairkhan district near Ulaanchuluut. Intermediate to advanced English speakers are welcome (6 positions).\n\nBenefits:\n• Transportation stipend provided\n• Recommendation letter\n• Abroad study counseling\n\nNote: Applicants under 18 can join as assistant teachers with parental consent.",
    },
  },
  {
    id: 7,
    category: "Эрүүл мэнд",
    emoji: "🌱",
    color: "#e0f2fe",
    url: "https://docs.google.com/forms/d/1YkwHoi-PQJwxkrlqNZPjdr6rOXiRYKA1ZdlXgWL9Tbo/edit",
    mn: {
      title: "OPEN HEARTS · Шинэ гишүүдийн элсэлт",
      other: "Эрүүл мэнд, хүүхдийн эрх",
      date: "Бүртгэлийн хугацаа: 10.09 – 10.16 · 10–11-р анги",
      place: "Сэтгэцийн болон биеийн эрүүл мэнд, хүүхдийн эрхийн клуб",
      about:
        "Чи нийгэмдээ эерэг өөрчлөлт бий болгохыг хүсдэг үү? 🫶🏻\n\nХүүхдийн эрхийн төлөө дуу хоолойгоо хүргэж, сэтгэцийн болон биеийн эрүүл мэндийн талаар суралцан, өөрийгөө хөгжүүлэхийг хүсдэг бол манай клуб чамайг урьж байна! 💌\n\n✨ ТАВИГДАХ ШААРДЛАГА:\n💙 10–11-р ангийн сурагч байх\n💙 Хариуцлагатай, идэвх санаачилгатай байх\n💙 Багаар ажиллах чадвартай байх\n💙 Нээлттэй, бусдын үзэл бодлыг хүндэтгэдэг байх\n💙 Хүүхдийн эрхийн төлөө өөрийн үзэл бодол, санаачилгыг илэрхийлдэг байх\n💙 Сэтгэцийн болон биеийн эрүүл мэндийн талаар суралцаж, мэдлэгээ бусадтай хуваалцах хүсэлтэй байх\n\n🌿 МАНАЙ КЛУБТ ЭЛССЭНЭЭР:\n♡ Шинэ мэдлэг, ур чадвар эзэмшинэ.\n♡ Ижил зорилготой залуустай танилцаж, хамтран ажиллана.\n♡ Өөрийн санааг бодит ажил, төсөл болгон хэрэгжүүлнэ.\n♡ Хүүхэд, өсвөр үеийнхний сайн сайхны төлөө дуу хоолойгоо хүргэнэ.\n♡ Манлайлал, харилцаа, багаар ажиллах чадвараа хөгжүүлнэ.\n\n🫂 Бид төгс чадвартай хүнийг бус, суралцах хүсэлтэй, хариуцлагатай, өөрчлөлт хийх чин хүсэлтэй залуусыг хайж байна!\n\nYour voice matters. Your actions make a difference. 💙",
    },
    en: {
      title: "OPEN HEARTS · New Member Recruitment",
      other: "Health, Children's Rights",
      date: "Registration: Oct 9 – Oct 16 · Grades 10–11",
      place: "Health and Children's Rights Club",
      about:
        "Do you want to create positive change in society? 🫶🏻\n\nIf you want to advocate for children's rights, learn about mental and physical health, and grow yourself, our club invites you! 💌\n\n✨ REQUIREMENTS:\n💙 10th-11th grade student\n💙 Responsible and proactive\n💙 Team player\n💙 Open-minded and respectful of diverse opinions\n💙 Expressive about children's rights\n💙 Willing to learn and share knowledge about health\n\n🌿 WHAT YOU'LL GAIN:\n♡ Learn new skills & knowledge\n♡ Connect with like-minded peers\n♡ Turn your ideas into real projects\n♡ Become a voice for children & youth\n♡ Develop leadership and communication skills\n\n🫂 We look for responsible youth eager to learn and make a difference!\n\nYour voice matters. Your actions make a difference. 💙",
    },
  },
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
        "SMART Creative Festival-ийн ард ажиллах багт нэгдэж, арга хэмжээний зохион байгуулалт, маркетинг, эвент менежментийн бодит туршлага хуримтлуулахыг хүсэж байна уу?\n\n- Шинэ зүйл сурна\n- Шинэ хүмүүстэй танилцана\n- Бодит эвент дээр ажиллана\n- Хөгжилтэй, эрч хүчтэй багийн нэг хэсэг болно\n\nХэрэв чи санаачлагатай, хариуцлагатай, идэвхтэй бол бид чамайг багтаа хүлээж байна!",
    },
    en: {
      title: "SMART 2026 Volunteer Team",
      other: "Events, marketing",
      date: "SMART Creative Festival · registration open",
      place: "Gain real experience in event management and marketing",
      about:
        "Want to join the team behind the SMART Creative Festival and gain real experience in event organizing, marketing and event management?\n\n- Learn new things\n- Meet new people\n- Work at a real event\n- Be part of a fun, energetic team\n\nIf you are proactive, responsible and motivated, we are waiting for you on the team!",
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