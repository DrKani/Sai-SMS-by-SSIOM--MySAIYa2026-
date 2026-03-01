
import { Quote, Announcement, Event, BookClubWeek, SiteContent } from './types';

/** 
 * APP IDENTITY CONFIGURATION
 */
export const APP_CONFIG = {
  NAME: "Sai SMS by SSIOM",
  TAGLINE: "Sai Sadhana Made Simple by SSIOM",
  OFFICIAL_URL: "https://sms.ssiomya.org/",
  // Note: Ensure this is a direct image link
  LOGO: "/assets/logo.png",
  LOGO_FOOTER: "https://www.sathyasai.org/sites/default/files/pages/organisation/logo/ssio-logo-english.png",
  AVATAR_MALE: "/assets/avatar_male_2026.png",
  AVATAR_FEMALE: "/assets/avatar_female_2026.png",
  VERSION: "2026.1.5",
  GOAL_TOTAL_CHANTS: 1000000
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  homeWelcomeText: "Om Sai Ram, Welcome to Sai Sadhana Made Simple by SSIOM, a growing platform designed to cherish and support every Malaysian Sai devotee in their spiritual journey. Feel free to dive in, explore, and join us on this beautiful, transformative spiritual journey.",
  footerAboutText: "Sai Sadhana Made Simple (Sai SMS) is a digital platform by SSIOM equipped with digital tools for tracking personal and collective spiritual practices, fostering and unifying our spiritual journey. Each feature empowers us to explore, learn, discuss, share, and grow spiritually, drawing us closer to Sai. The aim is to aspire for collective self-transformation and touch the hearts of fellow Malaysians through our thoughts, words and deeds on a daily basis.",
  chantingIntroText: "Your journey of devotion, one chant at a time"
};

/** 
 * ADMIN & SECURITY CONFIGURATION
 */
export const ADMIN_CONFIG = {
  MASTER_PASSWORD: "Spiritual2026",
  AUTHORIZED_EMAILS: [
    "kani@ssiomya.com",
    "anushkaa@ssiomya.com",
    "nalini@ssiomya.com",
    "ssio.malaysia@gmail.com",
    "admin@ssiomya.com"
  ]
};

export const STATES_OF_MALAYSIA = [
  'Johor', 'Kedah & Perlis', 'Kelantan & Terengganu', 'Melaka & Negeri Sembilan', 'Pahang', 'Perak',
  'Pulau Pinang', 'Sabah & Sarawak', 'Selangor & Kuala Lumpur'
];

export const QUOTES_LIST: string[] = [
  "Help ever. Hurt never.",
  "Start the day with love, spend the day with love, fill the day with love and end the day with love. That is the way to God.",
  "Work is worship. Duty is God.",
  "Truth has no fear; Untruth shivers at every shadow.",
  "Unity is divinity; purity is enlightenment.",
  "All is one; be alike to everyone.",
  "Be good, see good and do good.",
  "Our life becomes one of fulfillment when we live in morality.",
  "Money comes and goes; but morality comes and grows!",
  "All is one; be alike to everyone. The world is one; be good to everyone.",
  "As you think, so you become.",
  "Be in the world, but do not let the world be in you.",
  "Be simple and sincere.",
  "Before you speak, ask yourself: Is it kind, is it necessary, is it true, does it improve the silence?",
  "Body is like a water bubble, mind is like a mad monkey. Don't follow the body, don't follow the mind. Follow the conscience. Only then can you experience the Truth.",
  "Develop self-confidence, which will lead to self-satisfaction. When you have self-satisfaction, you will be prepared for self-sacrifice. Only through self-sacrifice, can one attain self-realization. Self-realization means to realize that you are everything. Self-confidence is the foundation, self-satisfaction is the wall, self-sacrifice is the roof and self-realization is life.",
  "Duty without love is deplorable. Duty with love is desirable. Love without duty is Divine.",
  "Example is better than Precept.",
  "Fatherhood of God and Brotherhood of Man.",
  "Follow the master, face the devil, fight to the end, finish the game.",
  "God is all Names and all forms.",
  "God is neither distant nor distinct from you.",
  "God is the hero, rest are Zeros.",
  "God, if you think, God you are. Dust if you think, dust you are. As you think, so you become. Think God, be God.",
  "Hands in society and head in the forest.",
  "Hands that serve are holier than lips that pray.",
  "Help Ever Hurt Never.",
  "Human heart is the lock. Mind is the key. Turn towards God for liberation, turn towards the world for bondage.",
  "I shall be with you, wherever you are, guarding you and guiding you. March on, have no fear.",
  "Learn to speak what you feel, and act what you speak.",
  "Less luggage, more comfort makes travel a pleasure.",
  "Love All Serve All.",
  "Love as thought is Truth, Love as action is Righteous Conduct, Love as feeling is Peace, Love as understanding is Non-Violence.",
  "Love is selflessness, Selfishness is Lovelessness.",
  "Love lives by giving and forgiving, selfishness lives by getting and forgetting.",
  "Mind is the sole cause for either liberation or bondage. When the mind is turned God wards, one is liberated; on the other hand when the mind and the activities are centred on the nature and world, it leads to bondage.",
  "Money comes and goes, Morality comes and grows.",
  "My birthday is the date when divinity blossoms in your heart.",
  "My Life is My Message.",
  "Neither by penance nor by undertaking pilgrimages nor by going through sacred texts nor by Japa can one cross the ocean of Samsara. Only through service of the noble can one redeem oneself.",
  "Practise silence, for the voice of God can be heard in the region of your heart only when the tongue and the inner storm are stilled, and the waves (of the mind) are calmed.",
  "See no evil, See what is good. Hear no evil, Hear what is good. Talk no evil, Talk what is good. Think no evil, Think what is good. Do no evil, Do what is good.",
  "Service to Mankind is Service to God.",
  "Shut your mind and open your heart.",
  "Spiritual discipline is the cultivation of Love. Be full of Love. Taste the exhilaration that Love can confer. Let everyone see you exuberant with light and joy.",
  "Start early, Drive slowly, Reach safely.",
  "Start the day with love, spend the day with love, fill the day with love, and end the day with love. This is the way to God.",
  "Talk less, work more.",
  "Tell me your company, I shall tell you what you are!",
  "The end of Wisdom is freedom. The end of culture is perfection. The end of knowledge is love. The end of education is character.",
  "The greatest spiritual practice is to transform love into service.",
  "The Proper Study of Mankind is Man.",
  "There is only one language, the language of the Heart. There is only one religion, the religion of Love.",
  "Think Good, See Good, Do Good.",
  "Truth has no fear; Untruth shivers at every shadow.",
  "Unity is divinity; purity is enlightenment.",
  "Watch your Words, Action, Thoughts, Character and Heart.",
  "We do not need different kinds of 'information'. We need 'transformation'.",
  "When the mind is turned Godward, the heart develops detachment. When the mind is turned towards the world, the heart develops attachment.",
  "When the sun rises and shines, not all the lotus buds in the lakes and ponds bloom, only those that are ready, do. The rest have to bide their time, but all are destined to bloom, all have to fulfill that destiny. There is no need to despair.",
  "When there is righteousness in the heart, there is beauty in the character. When there is beauty in character, there is harmony at home. When there is harmony at home, there is order in the Society. When there is order in the Society, there is Unity in the Nation. When there Unity in the Nation's, there is peace in the World.",
  "Where there is Self-confidence, there is truth. Where there is truth, there is bliss. Where there is bliss, there is peace. Where there is peace, there is God. Hence you must cultivate Self-confidence.",
  "Where there is unity, there shall be purity. Where there is purity, there is Divinity.",
  "Work is worship. Duty is God.",
  "You cannot always oblige, but you can always speak obligingly.",
  "You must possess the Head of Sankara; the Heart of Buddha; and the Hands of Janaka.",
  "Love seeks no reward; Love is its own reward.",
  "Silence is the speech of the spiritual seeker.",
  "Real happiness lies within you.",
  "Discipline is the mark of intelligent living.",
  "Every experience is a lesson, every loss is a gain.",
  "I shall be with you, where ever you are, guarding you and guiding you.",
  "Yesterday has deceived you and gone; Tomorrow is a doubtful visitor. Today is a fast friend - hold fast to it.",
  "A characterless man is like a pot with many holes, useless for carrying water or storing it.",
  "A clean uncontaminated mind is like a fully blossomed fragrant rose. It refreshes and pleases. It can raise and reach the foot-stool of God in heaven.",
  "A discontented man is as bad as lost. A man without love is as good as dead.",
  "Act and then advise. Practice first precept next.",
  "You cannot see Me, but I am the Light you see by. You cannot hear Me, but I am the Sound you hear by. You cannot know Me, but I am the Truth by which you live.",
  "Bear all and do nothing; Hear all and say nothing; Give all and take nothing; Serve all and be nothing.",
  "Make your life a rose that speaks silently in the language of the heart."
];

export const QUOTES: Quote[] = QUOTES_LIST.map((q, i) => ({
  id: String(i),
  text: q,
  author: "Sathya Sai Baba"
}));

/**
 * FIXED NATIONAL CALENDAR 2026
 */
export const MOCK_EVENTS: Event[] = [
  { id: 'f1', title: 'SPIRITUAL WING: SILENT SATURDAY', date: new Date('2026-01-03').toDateString(), category: 'Spiritual', description: 'National silent contemplation day.' },
  { id: 'f2', title: 'Ponggal / Makara Sankranthi', date: new Date('2026-01-14').toDateString(), category: 'Festival', description: 'Traditional harvest festival celebration.' },
  { id: 'f3', title: 'Thaiusam 9-Day Sadhana Commencement', date: new Date('2026-01-23').toDateString(), category: 'Sadhana', description: 'Beginning of the 9-day discipline for Thaipusam.' },
  { id: 'f4', title: '136th Council Meeting', date: new Date('2026-01-24').toDateString(), time: '09:30 AM - 01:00 PM', location: 'Sekolah Rendah Sathya Sai', category: 'Administrative', description: 'Quarterly national council meeting.' },
  { id: 'e1', title: 'Thaipusam Paal Kudam Procession 2026', date: new Date('2026-01-31').toDateString(), time: '07.30 PM', location: 'Under Flyover (Opposite Batu Caves Temple)', category: 'Festival', description: 'Participants are requested to gather at 7:30pm at the Blood Donation Area (Batu Caves). The blessing ceremony will commence at 7:30pm, followed by the procession at 9:30pm. Those interested, please bring a kudam, a suitable amount of milk to fill the kudam, a piece of clean, unused cloth to cover the Kudam opening, a rubber band to hold the cloth, and a flower garland for the kudam. Participants are encouraged to wear traditional yellow attire. It is advised to observe fasting or at least a vegetarian diet for 3 days (including Saturday) minimum.' },
  { id: 'e2', title: 'Thaipusam Blood Donation Drive - Batu Caves', date: new Date('2026-01-31').toDateString(), time: 'Jan 31 (4pm)- Feb 01 (11pm)', location: 'Under Flyover (Opposite Batu Caves Temple)', category: 'Service', description: 'Join us for the Thaipusam Blood Donation Drive at Batu Caves (Batu malai) on 31st Jan (4pm) until 01st Feb 11pm & 2nd Feb (8am to 2pm). We need volunteers as well as blood donors during these periods. Kindly contact Nagen (012 345 3140) or Mohana (012 278 6091) for further details.', mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!4v1769704663942!6m8!1m7!1sklqtK8u06haGBX0QQsrvtQ!2m2!1d3.235252606107312!2d101.6821204897922!3f64.06003790607056!4f-17.09915573854171!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' },
  { id: 'e3', title: 'Thaipusam Blood Donation Drive - Batu Caves', date: new Date('2026-02-02').toDateString(), time: 'Feb 2 (8am to 2pm)', location: 'Under Flyover (Opposite Batu Caves Temple)', category: 'Service', description: 'Join us for the Thaipusam Blood Donation Drive at Batu Caves (Batu Malai) on 31st Jan (4pm) until 01st Feb 11pm & 2nd Feb (8am to 2pm). We need volunteers as well as blood donors during these periods. Kindly contact Nagen (012 345 3140) or Mohana (012 278 6091) for further details.', mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!4v1769704663942!6m8!1m7!1sklqtK8u06haGBX0QQsrvtQ!2m2!1d3.235252606107312!2d101.6821204897922!3f64.06003790607056!4f-17.09915573854171!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' },
  { id: 'e4', title: 'Thaipusam Blood Donation Drive - Pulau Pinang', date: new Date('2026-01-31').toDateString(), time: '8:30am - 6pm', location: 'Beside SJK (T) Azad, Jalan Kebun Bungah', category: 'Service', description: 'Join us for the Thaipusam Blood Donation Drive at Pulau Pinang (Thaneermalai) on 31st Jan & 01st Feb from 8.30 am till 6pm both the days.  We need volunteers as well as blood donors during these periods. Kindly contact Gunalen (0164203967) or Krishna Kumar (0194486417) for further details.', mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!4v1769704738383!6m8!1m7!1so8oNSzV-NtdZPpDYkHDB7A!2m2!1d5.433326786124404!2d100.2971026532076!3f202.3568399189449!4f-6.662135158197827!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' },
  { id: 'e5', title: 'Thaipusam Blood Donation Drive - Pulau Pinang', date: new Date('2026-02-01').toDateString(), time: '8:30am - 6pm', location: 'Beside SJK (T) Azad, Jalan Kebun Bungah', category: 'Service', description: 'Join us for the Thaipusam Blood Donation Drive at Pulau Pinang (Thaneermalai) on 31st Jan & 01st Feb from 8.30 am till 6pm both the days.  We need volunteers as well as blood donors during these periods. Kindly contact Gunalen (0164203967) or Krishna Kumar (0194486417) for further details.', mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!4v1769704738383!6m8!1m7!1so8oNSzV-NtdZPpDYkHDB7A!2m2!1d5.433326786124404!2d100.2971026532076!3f202.3568399189449!4f-6.662135158197827!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' },
  { id: 'e6', title: 'Thaipusam Blood Donation Drive - Ipoh', date: new Date('2026-01-31').toDateString(), time: '4pm-10pm', location: 'Wedding Hall, Kallumalai Arulmigu Subramaniyar Temple', category: 'Service', description: 'Join us for the Thaipusam Blood Donation Drive at Ipoh (Kallumalai) on 31st Jan: 4pm-10pm, 1st Feb: 9am-4pm. We need volunteers as well as blood donors during these periods. Kindly contact Ruvanesh (0165211316) or Prithiviraj (0135201920) for further details.', mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!4v1769704919936!6m8!1m7!1sWioTluBRXxPPDwBq8EI3oQ!2m2!1d4.607941164582952!2d101.0840140833839!3f44.05806814592479!4f15.437223915872423!5f1.2042569652068404" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' },
  { id: 'e7', title: 'Thaipusam Blood Donation Drive - Ipoh', date: new Date('2026-02-01').toDateString(), time: '9am-4pm', location: 'Wedding Hall, Kallumalai Arulmigu Subramaniyar Temple', category: 'Service', description: 'Join us for the Thaipusam Blood Donation Drive at Ipoh (Kallumalai) on 31st Jan: 4pm-10pm, 1st Feb: 9am-4pm. We need volunteers as well as blood donors during these periods. Kindly contact Ruvanesh (0165211316) or Prithiviraj (0135201920) for further details.', mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!4v1769704919936!6m8!1m7!1sWioTluBRXxPPDwBq8EI3oQ!2m2!1d4.607941164582952!2d101.0840140833839!3f44.05806814592479!4f15.437223915872423!5f1.2042569652068404" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' },
  { id: 'e8', title: 'Thaipusam Blood Donation Drive - Seremban', date: new Date('2026-02-01').toDateString(), time: '9:00 AM - 2:30 PM', location: 'Sri Balathandayuthapani Temple, Seremban', category: 'Service', description: 'Join us for the Thaipusam Blood Donation Drive at Seremban on 01st Feb: 9.00 am - 2.30 pm. Contact Pamila (01133634071) or Raman (0199158563).', mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!4v1769705040717!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJREVtWURUUXc.!2m2!1d2.72115583588967!2d101.9411462612823!3f285.53199754198357!4f0.09572507369333039!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' },
  { id: 'e9', title: 'Thaipusam Blood Donation Drive - Segamat', date: new Date('2026-02-01').toDateString(), time: '9:00 AM - 2:00 PM', location: 'Kuil Sri Muniswarar, Segamat', category: 'Service', description: 'Join us for the Thaipusam Blood Donation Drive at Segamat on 01st Feb: 9.00 am - 2.00 pm. Contact 0167276372 for further details.', mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!4v1769705144870!6m8!1m7!1so_x8Wj9zikBEks1objvedQ!2m2!1d2.510052753596095!2d102.8180616740461!3f181.13691843946896!4f0!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' },
  { id: 'f5', title: 'Maha Shivaratri', date: new Date('2026-02-15').toDateString(), category: 'Festival', description: 'Sacred night of Shiva.' },
  { id: 'f6', title: 'Chinese New Year', date: new Date('2026-02-17').toDateString(), category: 'Festival', description: 'Lunar New Year celebrations.' },
  { id: 'f7', title: 'Holi', date: new Date('2026-03-04').toDateString(), category: 'Festival', description: 'Festival of colors.' },
  { id: 'f8', title: 'Ugadi', date: new Date('2026-03-19').toDateString(), category: 'Festival', description: 'Telugu New Year.' },
  { id: 'f9', title: 'Hari Raya Aidilfitri', date: new Date('2026-03-20').toDateString(), category: 'Festival', description: 'Eid al-Fitr celebrations.' },
  { id: 'f10', title: 'Sri Rama Navami', date: new Date('2026-03-26').toDateString(), category: 'Festival', description: 'Birthday of Lord Rama.' },
  { id: 'f11', title: 'Hanuman Jayanthi', date: new Date('2026-04-02').toDateString(), category: 'Festival', description: 'Birthday of Hanuman.' },
  { id: 'f12', title: 'Earth Day', date: new Date('2026-04-22').toDateString(), category: 'Service', description: 'Global environmental awareness day.' },
  { id: 'f13', title: 'Sri Sathya Sai Aradhana Mahotsavam', date: new Date('2026-04-24').toDateString(), category: 'Spiritual', description: 'Human Values Day and Aradhana Mahotsavam.' },
  { id: 'f14', title: 'Buddha Poornima', date: new Date('2026-05-01').toDateString(), category: 'Festival', description: 'Vesak Day celebration.' },
  { id: 'f15', title: 'Easwaramma Day', date: new Date('2026-05-06').toDateString(), category: 'Festival', description: 'Honoring the Divine Mother and Children.' },
  { id: 'f16', title: 'Guru Poornima', date: new Date('2026-07-29').toDateString(), category: 'Festival', description: 'Honoring the Primordial Guru.' },
  { id: 'f17', title: 'Onam', date: new Date('2026-08-26').toDateString(), category: 'Festival', description: 'Harvest festival of Kerala.' },
  { id: 'f18', title: 'Sri Krishna Janmashtami', date: new Date('2026-09-04').toDateString(), category: 'Festival', description: 'Birthday of Lord Krishna.' },
  { id: 'f19', title: 'Ganesh Chaturthi', date: new Date('2026-09-14').toDateString(), category: 'Festival', description: 'Festival of Lord Ganesha.' },
  { id: 'f20', title: 'International Day of Peace', date: new Date('2026-09-21').toDateString(), category: 'Service', description: 'Global peace meditation and prayers.' },
  { id: 'f21', title: 'Vijayadashami (Dasara)', date: new Date('2026-10-20').toDateString(), category: 'Festival', description: 'Avatar Declaration Day & Serve the Planet Day.' },
  { id: 'f22', title: 'Deepavali (Diwali)', date: new Date('2026-11-08').toDateString(), category: 'Festival', description: 'Festival of lights.' },
  { id: 'f23', title: 'Worldwide Akhanda Bhajans', date: new Date('2026-11-14').toDateString(), category: 'Festival', description: '24-hour continuous global bhajans.' },
  { id: 'f24', title: 'Ladies\' Day', date: new Date('2026-11-19').toDateString(), category: 'Spiritual', description: 'Celebrating the role of women in spirituality.' },
  { id: 'f25', title: 'Bhagawan’s Birthday', date: new Date('2026-11-23').toDateString(), category: 'Festival', description: '101st Birthday Celebration of Bhagawan Sri Sathya Sai Baba.' },
  { id: 'f26', title: 'Guru Nanak Jayanthi', date: new Date('2026-11-24').toDateString(), category: 'Festival', description: 'Honoring the first Sikh Guru.' },
  { id: 'f27', title: 'Christmas', date: new Date('2026-12-25').toDateString(), category: 'Festival', description: 'Celebrating the birth of Jesus Christ.' },
];


const getPublishDate = (weekIndex: number) => {
  const startDate = new Date('2026-02-26T00:00:00+08:00');
  const d = new Date(startDate.getTime() + weekIndex * 7 * 24 * 60 * 60 * 1000);
  return d.toISOString();
};

export const ANNUAL_STUDY_PLAN: BookClubWeek[] = [
  {
    weekId: "W01",
    book: "Ramakatha Rasavahini Part 1",
    chapterTitle: "Inner Meaning & Prologue",
    topic: "Rama as the inner Atma — alegory, detachment and Divine presence in all beings.",
    pages: "The Inner Meaning · Foreword by Kasturi · Chapter 1: Rama—Prince and Principle",
    imageUrl: "/assets/ramakatha-cover.png",
    complexity: "Medium",
    learningOutcomes: [
      "Understand Rama as the Atmarama — the Source of Bliss indwelling every being.",
      "Recognise the two core teachings: Detachment and Awareness of the Divine in every being.",
      "Learn the symbolic meaning of key characters: Lakshmana = intellect, Sugriva = discrimination, Hanuman = courage, Sita = Brahma-jnana."
    ],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "In the inner meaning, what does Hanuman represent?",
        options: ["Intellect", "Discrimination (Viveka)", "Courage", "Humility"],
        correctAnswer: 2,
        explanation: "Baba explicitly states, \"Hanuman is the embodiment of courage.\" Lakshmana represents intellect, Sugriva represents discrimination, and Vali represents despair.",
        citation: "Ramakatha Rasavahini Part 1, The Inner Meaning",
        points: 100
      },
      {
        question: "According to \"The Inner Meaning\", what are the TWO master lessons of the Ramayana?",
        options: ["Love and Relationship", "Filial Piety and Familial responsibilities", "Detachment and Awareness of the Divine in every being", "Governance and Leadership qualities"],
        correctAnswer: 2,
        explanation: "Baba states clearly: \"The Ramayana, the Rama story, teaches two lessons: the value of detachment and the need to become aware of the Divine in every being.\"",
        citation: "Ramakatha Rasavahini Part 1, The Inner Meaning",
        points: 100
      },
      {
        question: "What does the statement \"If there is no Rama, there will be no Panorama\" mean?",
        options: ["Rama founded the universe", "Rama is the attractive principle that holds the universe together", "Rama controls all visual beauty", "Rama is the creator god separate from creation"],
        correctAnswer: 1,
        explanation: "Baba explains: \"Rama is the Principle which attracts — and endears through that attraction — the disparate elements in Nature. That is the Rama principle, without which the cosmos will become chaos.\"",
        citation: "Ramakatha Rasavahini Part 1, Chapter 1: Rama—Prince And Principle",
        points: 100
      },
      {
        question: "In the inner meaning, who is Sita?",
        options: ["The Princess of Mithila seeking marriage", "A symbol of feminine duty and female wisdom", "Brahma-jnana — Awareness of the Universal Absolute, to be acquired through life's trials", "Daughter of Janaka and Princess of Mithila"],
        correctAnswer: 2,
        explanation: "Baba states: \"Sita is the Awareness of the Universal Divinity (Brahma-jnana), which the individual must acquire and regain while undergoing travails in the crucible of life.\"",
        citation: "Ramakatha Rasavahini Part 1, The Inner Meaning",
        points: 100
      }
    ],
    reflectionPrompts: [
      "How does viewing the characters as inner qualities — rather than as distant mythic figures — change the way you read and relate to the story?",
      "When my own life \"meanders through twists and curves\" of sadness, do I lose my inner sweetness and compassion?"
    ],
    interestingBit: "Rama is the Principle which attracts and endears through that attraction the disparate elements in Nature — without which the cosmos will become chaos.",
    publishAt: getPublishDate(0),
    status: "published",
    contentRaw: "",
    summaryRaw: "<p>Ramakatha Rasavahini opens not with a story, but with a key. Baba invites us to read the Ramayana not as history, but as an inner journey. Rama is the <strong>Atmarama</strong> — the Source of Bliss dwelling in every heart. His story teaches two master lessons: the <em>value of detachment</em> and the <em>need to recognise the Divine in every being</em>.</p><p>Every character is a faculty of the human soul. Dasaratha (Ten-Sensed One) is our body. The three queens are the three Gunas. The four sons are the four Purusharthas. Lakshmana is the intellect; Sugriva is discrimination; Hanuman is courage; Sita is Brahma-jnana — the divine awareness we must recover through life's trials.</p><p>This week: read the <em>Inner Meaning</em>, the Foreword, and Chapter 1 to lay the allegorical foundation for the entire 52-week journey.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/rama-prince-and-principle"
  },
  {
    weekId: "W02",
    book: "Ramakatha Rasavahini Part 1",
    chapterTitle: "Lineage & Dharma: The Solar Dynasty",
    topic: "True rulership and leadership require selfless sacrifice, divine grace is won through humility.",
    pages: "Chapter 2: The Imperial Line — Raghu",
    imageUrl: "/assets/ramakatha-cover.png",
    complexity: "Medium",
    learningOutcomes: [
      "Learn about the lineage of Rama through kings Dilipa, Raghu, and Aja.",
      "Recognise that true rulership requires selfless sacrifice, as demonstrated by King Dilipa.",
      "Learn how divine grace is won through humility and service.",
      "Value the promotion of righteous living over personal comfort."
    ],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Why did the divine cow Kamadhenu curse King Dilipa to be childless?",
        options: ["He hunted her calf for sport", "He ignored her in his pride while caught in the tangle of worldly pleasures", "He refused to offer her grass and water", "He banished her from the kingdom of Ayodhya"],
        correctAnswer: 1,
        explanation: "Vasishta revealed that Dilipa had drawn the curse upon himself because, during a journey, he passed by the divine wish-fulfilling cow Kamadhenu without offering his respects, completely engrossed in his own worldly affairs.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 2",
        points: 100
      },
      {
        question: "What did King Dilipa offer the lion in exchange for the calf Nandini?",
        options: ["Half his kingdom", "His entire treasury", "His own body as food", "An army of warriors"],
        correctAnswer: 2,
        explanation: "Dilipa fearlessly offered his own body as a sacrifice to the lion to save Nandini, demonstrating the spirit of self-surrender for a higher cause.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 2",
        points: 100
      },
      {
        question: "How did Indumathi — King Aja's queen — die?",
        options: ["She was struck by an arrow in battle", "She fell gravely ill", "A flower from Sage Narada's wreath dropped on her, releasing her from her mortal body", "She was cursed by a demon"],
        correctAnswer: 2,
        explanation: "A flower from Sage Narada's wreath dropped onto her, instantly releasing Indumathi from her mortal body. Source: Ramakatha Rasavahini Part 1, Chapter 2.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 2",
        points: 100
      },
      {
        question: "What were the twin objectives of Emperor Raghu's rule?",
        options: ["Conquering demons and building temples", "Expanding the empire and gaining wealth", "The happiness of his subjects and the promotion of righteous living", "Defeating Ravana and protecting sages"],
        correctAnswer: 2,
        explanation: "\"Emperor Raghu ruled the kingdom with twin objectives: the happiness of his subjects and the promotion of righteous living.\"",
        citation: "Ramakatha Rasavahini Part 1, Chapter 2",
        points: 100
      }
    ],
    reflectionPrompts: [
      "How do I handle power or leadership in my own life? Do I use it to promote the happiness of those around me?",
      "King Dilipa's cure from childlessness was not a ritual — it was an act of selfless surrender. When he offered his life for Nandini's calf, grace flowed naturally. What 'Nandini' (sacred duty or vulnerable person) are you being called to protect, and what comfort might you need to sacrifice to do so?"
    ],
    interestingBit: "King Dilipa's cure from childlessness was not a ritual — it was an act of selfless surrender. When he offered his life for Nandini's calf, grace flowed naturally.",
    publishAt: getPublishDate(1),
    status: "scheduled",
    contentRaw: "",
    summaryRaw: "<p>This week we trace the noble Solar Dynasty through three remarkable kings who forged the lineage of Rama. <strong>King Dilipa</strong> drew a curse upon himself through pride and inattention, then redeemed himself through total self-surrender — offering his own body to save the divine cow's calf. <strong>Emperor Raghu</strong> ruled with a singular twin purpose: the happiness of his subjects and the promotion of righteousness. <strong>King Aja</strong> loved Indumathi so deeply that when she departed, he could not survive long without her.</p><p>Through these stories we see that great lineages are built not on conquest, but on sacrifice, humility, and devotion to Dharma.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-imperial-line"
  },
  {
    weekId: "W03",
    book: "Ramakatha Rasavahini Part 1",
    chapterTitle: "The Sacrifice: Putrakameshti Yajna",
    topic: "The inner meaning of Dasaratha and the spiritual significance of the Putrakameshti Yajna.",
    pages: "Chapter 3: No Progeny From His Loins",
    imageUrl: "/assets/ramakatha-cover.png",
    complexity: "Medium",
    learningOutcomes: [
      "Understand the symbolic inner meaning of Emperor Dasaratha and his three queens.",
      "Recognise how human desires set the stage for the divine masterplan.",
      "Learn the spiritual significance of the Putrakameshti Yajna and the distribution of divine Payasam.",
      "See how the four goals of human life (Purusharthas) manifest as the four brothers."
    ],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Who was brought to Ayodhya to officiate the Putrakameshti Yajna?",
        options: ["Sage Viswamitra", "Sage Agastya", "Sage Rishyasringa", "Sage Valmiki"],
        correctAnswer: 2,
        explanation: "Vasishta advised Dasaratha to invite Sage Rishyasringa to serve as the high priest for the sacrifice. Wherever Rishyasringa set foot, peace, prosperity, and timely rains followed.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 3",
        points: 100
      },
      {
        question: "How did Dasaratha respond to Ravana's demand for tribute?",
        options: ["He sent a vast amount of gold.", "He surrendered Ayodhya.", "He shot arrows that fastened the gates of Lanka.", "He ignored the messenger."],
        correctAnswer: 2,
        explanation: "\"He shot sharp deadly arrows, which reached Lanka itself and fastened the gates of that city! 'That is the tribute I pay to your impertinent lord.'\"",
        citation: "Ramakatha Rasavahini Part 1, Chapter 3",
        points: 100
      },
      {
        question: "What does King Dasaratha symbolise in the inner meaning?",
        options: ["The ideal king who conquers all enemies", "The merely physical man with the ten senses", "The cosmic creator with unlimited power", "The devoted disciple surrendered to God"],
        correctAnswer: 1,
        explanation: "Baba teaches: \"Dasaratha is the representative of the merely physical, with the ten senses.\" The ten senses (five of knowledge, five of action) are his ten chariots.",
        citation: "Ramakatha Rasavahini Part 1, The Inner Meaning",
        points: 100
      },
      {
        question: "Why did the King of Kekaya place conditions on offering his daughter Kaikeyi to Dasaratha?",
        options: ["He wanted to secure his kingdom's alliance", "He feared Dasaratha's power", "He wanted his grandson to inherit the throne of Ayodhya", "He did not trust Dasaratha's intentions"],
        correctAnswer: 2,
        explanation: "The King of Kekaya stipulated that Kaikeyi's son must be declared heir to the throne — a condition that Dasaratha, blinded by love, agreed to, setting the stage for the eventual exile of Rama.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 3",
        points: 100
      }
    ],
    reflectionPrompts: [
      "When faced with unreasonable demands or arrogance, do I respond with clear, detached strength, or do I react with fear?",
      "Dasaratha's agreement to Kekaya's condition — made out of love — later caused immense suffering. Have you made a promise driven by emotion that you later regretted?"
    ],
    interestingBit: "The Putrakameshti Yajna fire directly produced the divine Payasam (sacred nectar pudding) — proof that sincere sacrifice can invoke a divine response beyond what ritual alone can accomplish.",
    publishAt: getPublishDate(2),
    status: "scheduled",
    contentRaw: "",
    summaryRaw: "<p>After tracing the glorious lineage, we arrive at Emperor Dasaratha — mighty in battle, revered by gods and sages, yet childless. Ravana himself had first tried to conquer Dasaratha and failed. But inside the palace, a deeper longing gnawed at the king's heart: the desire for an heir.</p><p>Guided by Sage Vasishta, Dasaratha arranges the <strong>Putrakameshti Yajna</strong> — a grand sacrifice officiated by the pure sage Rishyasringa. From the sacred fire emerges a golden vessel of divine Payasam, to be shared among the three queens. This week's reading covers the king's childlessness, his fearless defiance of Ravana, and the initiation of the most significant yajna in the Solar Dynasty's history.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/no-progeny-from-his-loins"
  },
  {
    weekId: "W04",
    book: "Ramakatha Rasavahini Part 1",
    chapterTitle: "Birth of Dasaratha's Four Sons",
    topic: "The divine birth of Rama, Bharatha, Lakshmana, and Satrughna from the sacred payasam.",
    pages: "Chapter 4: The Sons",
    imageUrl: "/assets/ramakatha-cover.png",
    complexity: "Medium",
    learningOutcomes: [
      "Grasp the spiritual significance of the four brothers' names and their divine origins.",
      "Understand that the individual soul (Lakshmana) remains restless until united with the Absolute Self (Rama).",
      "Recognise the motherly devotion and awe of the queens as they witness the boys' divine nature."
    ],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did Sumitra end up having twins?",
        options: ["She drank from two different holy rivers.", "An eagle stole her cup of payasam, so Kausalya and Kaikeyi shared their portions with her.", "She performed a special dual-sacrifice.", "Sage Rishyasringa gave her two cups."],
        correctAnswer: 1,
        explanation: "After an eagle whisked off her cup, Kausalya and Kaikeyi poured portions of their own shares into a new cup for Sumitra, resulting in her having twins.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 4",
        points: 100
      },
      {
        question: "According to Vasishta, what does the name \"Rama\" mean?",
        options: ["The Valiant Warrior", "The Supreme Sovereign", "He who pleases", "The Destroyer of Demons"],
        correctAnswer: 2,
        explanation: "Vasishta declared that the child would bring joy and contentment to all mankind, so his name would be Rama, or 'he who pleases.'",
        citation: "Ramakatha Rasavahini Part 1, Chapter 4",
        points: 100
      },
      {
        question: "Why did baby Lakshmana cry continuously until placed in Rama's cradle?",
        options: ["He was frightened by a demonic presence.", "He was physically ill.", "The individual self is restless until united with the Absolute Self.", "He was hungry."],
        correctAnswer: 2,
        explanation: "Vasishta explained that Lakshmana and Rama shared the same divine aspect, and like a fish out of water, the individual soul cannot find peace until united with its source.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 4",
        points: 100
      },
      {
        question: "What did Kausalya see when she watched Rama rolling something on his tongue?",
        options: ["A golden toy", "The entire universe revolving therein", "A venomous snake", "A blinding flash of lightning"],
        correctAnswer: 1,
        explanation: "She saw the entire universe revolving in His face and stood transfixed, losing all consciousness of herself.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 4",
        points: 100
      }
    ],
    reflectionPrompts: [
      "Lakshmana only found peace when placed beside Rama. In what ways do you experience a 'restlessness of the soul' when disconnected from your spiritual centre?",
      "Kausalya witnessed the universe in her child's mouth but often dismissed it as delusion. How often do we dismiss the divine miracles in our own lives as mere coincidence?"
    ],
    interestingBit: "Baby Lakshmana cried ceaselessly until placed in Rama's cradle — the individual soul is truly restless until it rests in the Absolute.",
    publishAt: getPublishDate(3),
    status: "scheduled",
    contentRaw: "",
    summaryRaw: "<p>The Putrakameshti Yajna bears fruit. From the sacred fire emerges divine Payasam which Dasaratha distributes among his queens — and nine months later, the palace of Ayodhya resounds with the joyful cries of four newborns. The entire universe rejoices.</p><p>Sage Vasishta performs the naming ceremony: <strong>Rama</strong> (He who pleases), <strong>Bharatha</strong> (He who sustains), <strong>Lakshmana</strong> and <strong>Satrughna</strong>. The cosmic bonds between Rama-Lakshmana and Bharatha-Satrughna are inseparable — for they are not merely brothers, but aspects of the Divine expressing themselves in four forms.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-sons"
  },
  {
    weekId: "W05",
    book: "Ramakatha Rasavahini Part 1",
    chapterTitle: "The Guru and the Pupils",
    topic: "The role of the Guru in spiritual transformation; character is the foundation of education.",
    pages: "Chapter 5: The Guru and the Pupils",
    imageUrl: "/assets/ramakatha-cover.png",
    complexity: "Medium",
    learningOutcomes: [
      "Value the role of the Guru in spiritual transformation.",
      "Understand that true learning requires simple living and service.",
      "Recognise that character is the foundation of education."
    ],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did the young princes live while studying with Sage Vasishta?",
        options: ["In royal luxury with their maids.", "Only studying during the day and returning to the palace at night.", "Renouncing palace comforts and undergoing hardships.", "Traveling the world on a ship."],
        correctAnswer: 2,
        explanation: "The brothers lived in the preceptor's hermitage, renouncing all royal comforts, performing daily chores, studying the Vedas, and undergoing the rigors of ashrama life.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 5",
        points: 100
      },
      {
        question: "What philosophical dialogue did Rama engage in after returning from his pilgrimage?",
        options: ["The Bhagavad Gita", "The Yoga Vasistha — a dialogue on the illusory nature of the universe", "The Upanishads on the nature of Atma", "The Ramayana itself as told by Valmiki"],
        correctAnswer: 1,
        explanation: "After the long pilgrimage, Rama developed profound detachment and engaged Dasaratha and Vasishta in a deep philosophical dialogue — the Yoga Vasistha — about the illusory nature of the universe and the reality of the Supreme Soul.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 5",
        points: 100
      }
    ],
    reflectionPrompts: [
      "The princes left the palace comforts to truly learn. What comforts or conveniences am I holding on to that might be preventing my spiritual growth?",
      "Rama's deep pilgrimage led to profound detachment. What happens in your own life when you step away from routines and seek a broader perspective?"
    ],
    interestingBit: "Rama's famous philosophical dialogue with his father and guru — the Yoga Vasishta — arose not in a classroom, but after a long transformative pilgrimage across the breadth of India.",
    publishAt: getPublishDate(4),
    status: "scheduled",
    contentRaw: "",
    summaryRaw: "<p>The four divine princes grow up and are sent to study under the great Sage <strong>Vasishta</strong> — not in comfort, but in the discipline of the hermitage. They forsake royal luxuries, perform daily chores, study the Vedas, and undergo the rigors of ashrama life.</p><p>After years of study, the brothers embark on a long pilgrimage across India. When Rama returns, he is profoundly transformed — detached from the world, asking deep questions about the nature of reality. This leads to the famous <strong>Yoga Vasishta</strong>, Rama's philosophical inquiry into the illusory nature of the universe, which Vasishta answers with profound wisdom.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-guru-and-the-pupils"
  },
  {
    weekId: "W06",
    book: "Ramakatha Rasavahini Part 1",
    chapterTitle: "Viswamitra's Call",
    topic: "Rama's first mission — protecting the yajna, confronting Thataka, surrendering divine weapons.",
    pages: "Chapter 6: Viswamitra's Mission",
    imageUrl: "/assets/ramakatha-cover.png",
    complexity: "Medium",
    learningOutcomes: [
      "Understand that surrender to the Guru's will is the beginning of the hero's journey.",
      "Reflect on the ethics of using force to protect the virtuous.",
      "See how divine weapons (talents) must ultimately be surrendered back to the Divine."
    ],
    durationMinutes: 25,
    quizCutoff: 100,
    questions: [
      {
        question: "Why did Dasaratha struggle with sending Rama with Viswamitra?",
        options: ["He did not trust Viswamitra", "He feared Rama was not ready", "He was deeply attached to Rama and did not want to be separated", "He wanted Lakshmana to go instead"],
        correctAnswer: 2,
        explanation: "Dasaratha struggled intensely between his parental attachment and his duty to honour Viswamitra's request — a classic conflict between personal love and higher dharmic obligation.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 6",
        points: 100
      },
      {
        question: "Why did Rama kill the demoness Thataka?",
        options: ["She attacked him first", "To protect the spiritual progression of the sages — an act of dharma, not violence", "She had stolen Vasishta's cows", "Because she had stolen his weapons"],
        correctAnswer: 1,
        explanation: "Viswamitra explained that killing Thataka was necessary for the promotion of dharma and removal of wickedness. Violence used for preserving the peace of the world draws no sin.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 6",
        points: 100
      },
      {
        question: "How did Rama dispose of the demon Maricha during the yajna?",
        options: ["He burned him to ashes with the fire-arrow", "He shot a mind-arrow that carried Maricha's body hundreds of miles into the ocean", "He sliced off his head with a sword", "He buried him under a mountain"],
        correctAnswer: 1,
        explanation: "Rama understood that if the corpse dropped on the holy region, it would be polluted. His arrow carried the vicious body hundreds of miles and cast it into the ocean alive but struggling.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 6",
        points: 100
      }
    ],
    reflectionPrompts: [
      "Dasaratha struggled between his parental attachment and his duty to keep his word to Viswamitra. Have you ever faced a situation where personal attachment conflicted with a higher moral duty?",
      "Viswamitra irrevocably surrendered his hard-won mystic weapons to Rama. What 'weapons' (talents, resources, skills) have you acquired that you need to consciously surrender to the Divine?"
    ],
    interestingBit: "Sage Viswamitra — once a fierce warrior king — surrendered all the divine weapons he had earned through intense austerities, handing them permanently to Rama.",
    publishAt: getPublishDate(5),
    status: "scheduled",
    contentRaw: "",
    summaryRaw: "<p>A pivotal moment arrives when the great sage <strong>Viswamitra</strong> appears at Dasaratha's court with an urgent request: he needs the young prince Rama to protect his sacred yajna from demonic disruption. Dasaratha, torn between parental attachment and duty, ultimately consents.</p><p>Rama's first mission begins. He and Lakshmana follow Viswamitra into the forest, where they encounter and defeat the fearsome demoness <strong>Thataka</strong>. Viswamitra then teaches them divine weapons and initiates Rama into his first protection of a yajna — culminating in the defeat of Maricha and Subahu. As a mark of complete trust, Viswamitra surrenders all his hard-won mystic weapons to Rama forever.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/viswamitras-mission"
  },
  {
    weekId: "W07",
    book: "Ramakatha Rasavahini Part 1",
    chapterTitle: "Sacred Unions",
    topic: "Bhagiratha's penance, Ahalya's redemption, the marriage of Rama and Sita.",
    pages: "Chapter 7: Winning Sita",
    imageUrl: "/assets/ramakatha-cover.png",
    complexity: "Medium",
    learningOutcomes: [
      "Understand the power of persistence and austerity through the story of Bhagiratha.",
      "Understand the purifying power of divine grace through Ahalya's redemption.",
      "Witness the cosmic significance of Rama winning Sita's hand by breaking Siva's bow."
    ],
    durationMinutes: 25,
    quizCutoff: 100,
    questions: [
      {
        question: "Who was responsible for bringing the celestial Ganga down to earth?",
        options: ["King Sagara", "King Amsumanta", "King Bhagiratha", "King Dilipa"],
        correctAnswer: 2,
        explanation: "Bhagiratha performed severe austerities to propitiate Siva to receive the Ganga on his head so that its waters could flow to earth and save his ancestors' ashes from hell.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 7",
        points: 100
      },
      {
        question: "How was Ahalya released from her curse of existing invisibly like a stone?",
        options: ["By the vision, touch, and speech of Rama.", "By bathing in the Ganga.", "By Viswamitra's mantras.", "By performing 100 years of penance."],
        correctAnswer: 0,
        explanation: "Gautama had foretold she would be cleansed when Rama came, showered grace, allowed her to touch His feet, and spoke with her in compassion.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 7",
        points: 100
      },
      {
        question: "What happened when Rama attempted to string the indomitable bow of Siva?",
        options: ["He struggled for hours but finally succeeded.", "He asked Lakshmana to help him lift it.", "The bow snapped into two pieces with a strange, unexpected explosion.", "The bow turned into a garland of flowers."],
        correctAnswer: 2,
        explanation: "Rama lifted it effortlessly with his left arm, strung it, and drew the string back, causing the bow to snap with a sound that shocked everyone into confusion.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 7",
        points: 100
      },
      {
        question: "What was the result of Vishnu appearing as a charming damsel during the churning of the ocean?",
        options: ["They shared the nectar equally.", "The demons stole it and ran to Patala.", "The nectar disappeared, and Aditi's sons destroyed Diti's sons.", "Siva drank it to save the world."],
        correctAnswer: 2,
        explanation: "Vishnu appeared as an entrancing damsel who captivated the demons' hearts. During this distraction, the nectar disappeared and Aditi's sons destroyed Diti's sons.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 7",
        points: 100
      }
    ],
    reflectionPrompts: [
      "Ahalya waited years in silent austerity for the Lord's touch to liberate her. How can we cultivate patient, unwavering faith during our own periods of hardship or feeling 'stuck'?",
      "Rama broke the massive bow of Siva 'with delightful ease.' When we align our actions with divine will, do our heavy burdens suddenly become light?"
    ],
    interestingBit: "Ahalya's 'stone' curse is not a literal transformation — she existed invisibly, unseen by eye or mind, sustained only by the inner fire of faith, waiting for Rama's liberating grace.",
    publishAt: getPublishDate(6),
    status: "scheduled",
    contentRaw: "",
    summaryRaw: "<p>Viswamitra takes the brothers on a journey toward Mithila, narrating cosmic stories along the way — the descent of the <strong>Ganga</strong> to earth through Bhagiratha's penance, and the churning of the ocean. En route, Rama encounters the ashrama of Ahalya — cursed by her husband to exist as an invisible, unloved stone. One glance, one touch, one compassionate word from Rama, and she is restored.</p><p>In Mithila, King Janaka has set the challenge: whoever can string Siva's mighty bow shall win the hand of his daughter. Rama lifts it effortlessly, strings it — and it snaps in two. Dasaratha is summoned, and a grand four-fold marriage ceremony unites the royal brothers with the princesses of Mithila.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/winning-sita"
  },
  {
    weekId: "W08",
    book: "Ramakatha Rasavahini Part 1",
    chapterTitle: "Parasurama's Challenge",
    topic: "The transition of divine power between Avatars — serenity in the face of pride.",
    pages: "Chapter 8: Another Challenge",
    imageUrl: "/assets/ramakatha-cover.png",
    complexity: "Medium",
    learningOutcomes: [
      "Witness the inexplicable mystery of Avatarhood as divine power transfers from Parasurama to Rama.",
      "See how Rama responds with serene calmness even in the face of aggressive pride and anger.",
      "Appreciate that true victory is the inevitable concomitant of righteousness."
    ],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Who intercepted Dasaratha's entourage on their way back to Ayodhya?",
        options: ["The demon Ravana.", "Sage Viswamitra.", "Parasurama.", "King Janaka."],
        correctAnswer: 2,
        explanation: "Parasurama, with a giant double-edged axe and eyes like glowing cinders, stood before them, furious that Rama had broken Siva's bow.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 8",
        points: 100
      },
      {
        question: "What challenge did Parasurama present to Rama?",
        options: ["To fight him with a mace.", "To string and fix an arrow on the divinely consecrated bow of Vishnu.", "To recite the Vedas from memory.", "To bring the dead back to life."],
        correctAnswer: 1,
        explanation: "Parasurama brought the bow of Vishnu (which belonged to his father Jamadagni) and challenged Rama to string it to prove his strength.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 8",
        points: 100
      },
      {
        question: "How did Rama react to Parasurama's furious anger and insults?",
        options: ["He drew his sword to attack him.", "He hid behind his father Dasaratha.", "He reacted with a charming smile and profound calm.", "He yelled insults back at him."],
        correctAnswer: 2,
        explanation: "Rama was unaffected by the anger, took things coolly and calmly, and even pacified Lakshmana's rage with soft speech.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 8",
        points: 100
      },
      {
        question: "What did Parasurama offer to Rama after Rama took hold of Vishnu's bow?",
        options: ["All the power he had earned through his austerities.", "The kingdom of the earth.", "His giant double-edged axe.", "A chariot of gold."],
        correctAnswer: 0,
        explanation: "Recognising Rama's divine splendour, Parasurama declared, 'I am offering to you the power earned by me,' and three facets of Divinity merged from him into Rama.",
        citation: "Ramakatha Rasavahini Part 1, Chapter 8",
        points: 100
      }
    ],
    reflectionPrompts: [
      "Parasurama's immense power was completely debilitated the moment he handed the bow to Rama. In what areas of your life do you need to surrender your ego and hand over control to the Divine?",
      "Despite Parasurama's verbal abuse, Rama remained perfectly serene and smiling. How can you practise remaining unruffled when faced with someone else's unprovoked anger?"
    ],
    interestingBit: "The meeting of Parasurama and Rama is the only moment in scripture where two Avatars of Vishnu stand face to face — and one recognises and surrenders to the other.",
    publishAt: getPublishDate(7),
    status: "scheduled",
    contentRaw: "",
    summaryRaw: "<p>On the journey back to Ayodhya after the grand wedding, the royal party is intercepted by the fearsome sage <strong>Parasurama</strong> — an earlier Avatar of Vishnu, eyes blazing, giant axe in hand, outraged that Siva's bow has been broken.</p><p>He challenges Rama to string the divine bow of Vishnu. Rama — calm, smiling, unhurried — takes the bow effortlessly. In that moment, Parasurama recognises the Supreme Divinity before him. His accumulated ascetic powers flow from him into Rama, and he departs in peace. This extraordinary episode reveals the mystery of Avatarhood: one form of the Divine yielding to a higher expression of itself.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/another-challenge"
  },

  {
    weekId: "W09",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Rama exhibits profound wisdom",
    topic: "Understand that the body is merely an image of the Supreme Soul.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand that the body is merely an image of the Supreme Soul.", "Grasp the concept of the five elements and the Absolute Reality.", "Learn to question worldly attachments."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "What did Rama state the human body is an image of?",
        options: ["The five elements", "The physical parents", "The Supreme Soul", "Maya (Illusion)"],
        correctAnswer: 2,
        explanation: "Rama asks, \"Is this objective world real? Or is the Supreme Soul real? This body is but the image of the Supreme Soul, isn’t it?\"",
        citation: "Part 1, Ch 5.",
        points: 100
      }
    ],
    reflectionPrompts: ["Where in my life am I treating the \"container\" (body/status) as more important than the \"contents\" (the Supreme Soul)?"],
    interestingBit: "",
    publishAt: getPublishDate(8),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/rama-exhibits-profound-wisdom"
  },
  {
    weekId: "W10",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "The Call and the First Victory",
    topic: "Understand Viswamitra's demand for Rama's help.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand Viswamitra's demand for Rama's help.", "See how the Divine pretends to need help to empower His devotees.", "Learn the"],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Why did Viswamitra need Rama and Lakshmana?",
        options: ["To fight a neighboring kingdom", "To guard his Yajna (rite) from demons", "To build a new hermitage", "To rule the forest"],
        correctAnswer: 1,
        explanation: "He needed the Where in my life do I act like I need to \"protect\" God/Religion, forgetting that the Divine is omnipotent and only uses me as an instrument? ---PAGE--- value of keeping one's promised word. boys to ward off demons who were desecrating his sacrificial rites with pieces of flesh.",
        citation: "Part 1, Ch 6.",
        points: 100
      }
    ],
    reflectionPrompts: ["What spiritual lesson did you derive from this chapter?"],
    interestingBit: "",
    publishAt: getPublishDate(9),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-call-and-the-first-victory"
  },
  {
    weekId: "W11",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Viswamitra offers Rama his weapons",
    topic: "Realize that all weapons and skills must ultimately be surrendered to the Divine.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Realize that all weapons and skills must ultimately be surrendered to the Divine.", "See how detachment (thyaga) and dedication operate in sages.", "Value the successful protection of sacred spaces."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "What did Sage Viswamitra do immediately after Rama killed Thataki?",
        options: ["He crowned Rama as the King of the forest.", "He gave Rama his entire arsenal of mystic weapons.", "He returned to Ayodhya.", "He asked Rama to leave the forest."],
        correctAnswer: 1,
        explanation: "Realizing Rama's absolute divinity, Viswamitra irrevocably gifted all his hard-won mystic weapons to Rama, stating they would fulfil their destiny What \"weapons\" (talents, resources, skills) have I acquired that I need to consciously surrender to the Divine for higher use? ---PAGE--- best in His hands.",
        citation: "Part 1, Ch 6.",
        points: 100
      }
    ],
    reflectionPrompts: ["What spiritual lesson did you derive from this chapter?"],
    interestingBit: "",
    publishAt: getPublishDate(10),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/viswamitra-offers-rama-his-weapons"
  },
  {
    weekId: "W12",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Winning Sita (Story of the Ganga)",
    topic: "Learn that spiritual persistence and effort draw down Divine Grace.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Learn that spiritual persistence and effort draw down Divine Grace.", "Note the story of Bhagiratha’s extreme austerity.", "Recognize the power of repentance and continuous effort."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Who was the king responsible for bringing the sacred river Ganga down from heaven to earth?",
        options: ["King Sagara", "King Amsumanta", "King Bhagiratha", "King Dilipa"],
        correctAnswer: 2,
        explanation: "Bhagiratha, through severe and unwavering austerity, propitiated Lord Shiva and Brahma to bring the heavenly river Ganga down to earth.",
        citation: "Part 1, Ch 7.  ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["What \"celestial Ganga\" (wisdom/grace) am I trying to bring into my own \"dry\" life through persistent effort?"],
    interestingBit: "",
    publishAt: getPublishDate(11),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/winning-sita-story-of-the-ganga"
  },
  {
    weekId: "W13",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Breaking the Siva-bow",
    topic: "Witness the power of purity in overcoming massive obstacles.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Witness the power of purity in overcoming massive obstacles.", "See how effortlessness is a hallmark of divine action.", "Understand that true strength is spiritual, not merely physical."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did Rama handle the indomitable bow of Siva?",
        options: ["He struggled for hours to string it.", "He lifted it with his left arm and snapped it while stringing it.", "He used a magical weapon to break it.", "He asked Lakshmana to lift it first."],
        correctAnswer: 1,
        explanation: "\"Rama quickly approached the vehicle and lifted up the iron cover with his left arm. With his right, he raised the bow... With delightful ease he fixed an arrow! ... But the bow snapped!\"",
        citation: "Part 1, Ch 7.  ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["What \"heavy bow\" (habit or challenge) am I trying to lift with ego instead of grace?"],
    interestingBit: "",
    publishAt: getPublishDate(12),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/breaking-the-siva-bow"
  },
  {
    weekId: "W14",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Preparations for Rama’s Coronation",
    topic: "Recognise ideal leadership as selfless service and compassion.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Recognise ideal leadership as selfless service and compassion.", "Learn the value of a cool, unruffled mind in authority.", "See how a true leader never remembers harm done to him."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did Rama react to those who did him harm?",
        options: ["He punished them swiftly.", "He ignored them completely.", "He never remembered it against them.", "He exiled them."],
        correctAnswer: 2,
        explanation: "\"Though others might do him harm, he never remembered it against them. He sought only to be good and to be of service to them.\"",
        citation: "Part 1, Ch 9.  Do I forgive easily, or do I keep a mental ledger of wrongs done to me? ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["How do I handle power in my own life?"],
    interestingBit: "",
    publishAt: getPublishDate(13),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/preparations-for-rama-s-coronation"
  },
  {
    weekId: "W15",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Kaika and Dasaratha argue",
    topic: "See how the attachment to Truth (Sathya) is the highest Dharma.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["See how the attachment to Truth (Sathya) is the highest Dharma.", "Understand that yielding to attachment destroys spiritual standing.", "Learn to uphold promises even at great personal cost."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "According to Kaika's argument to Dasaratha, what is the highest Dharma?",
        options: ["Protecting the son", "Truth (Sathya)", "Ruling the kingdom", "Pleasing the wife"],
        correctAnswer: 1,
        explanation: "Kaika argued, \"Recollect the pronouncement of those who are masters of virtue (dharma) that truth (sathya) is the highest dharma... Truth is Brahman.\"",
        citation: "Part 1, Ch 10.",
        points: 100
      }
    ],
    reflectionPrompts: ["Have I ever broken a difficult promise because my personal attachments or comforts got in the way? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(14),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/kaika-and-dasaratha-argue"
  },
  {
    weekId: "W16",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Lakshmana Goes with Rama",
    topic: "Recognise that honor and dishonor must be faced with equal serenity.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Recognise that honor and dishonor must be faced with equal serenity.", "Learn to remain unhurt by the \"surging billows\" of joy and grief.", "Model Rama’s perfect peace during crisis."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did Rama react when Kausalya fell to the floor in grief?",
        options: ["He wept with her.", "He changed his mind about leaving.", "He sat like a well-set rock, unhurt by the billows.", "He became angry at Dasaratha."],
        correctAnswer: 2,
        explanation: "\"Like a huge well-set rock struck deep in the sea, Rama sat unhurt by the lashing of the surging billows around. He was above and beyond the blows of grief.\"",
        citation: "Part 1, Ch 11.",
        points: 100
      }
    ],
    reflectionPrompts: ["When my plans are suddenly cancelled or destroyed, do I lose my peace, or can I remain a \"well-set rock\" like Rama? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(15),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/lakshmana-goes-with-rama"
  },
  {
    weekId: "W17",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Rama talks to Kausalya",
    topic: "Grasp that Truth (Sathya) and Righteousness (Dharma) are interchangeable.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Grasp that Truth (Sathya) and Righteousness (Dharma) are interchangeable.", "Overcome the \"terror-creating\" mentality of anger.", "Value obedience to the highest moral law."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did Rama counsel Lakshmana regarding the foundation of Dharma?",
        options: ["It is based on military power.", "It is secure only on the foundation of truth.", "It is based on wealth.", "It depends on public opinion."],
        correctAnswer: 1,
        explanation: "Rama explained to Lakshmana, \"For all values of life, dharma, is the very root. And, dharma is secure only on the foundation of truth.\"",
        citation: "Part 1, Ch 11.",
        points: 100
      }
    ],
    reflectionPrompts: ["Am I taking \"shortcuts\" to solve my problems, or am I willing to do things the right way, even if it is harder? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(16),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/rama-talks-to-kausalya"
  },
  {
    weekId: "W18",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Sita Insists on Going with Rama",
    topic: "See how true joy comes from the Divine Presence, not external luxury.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["See how true joy comes from the Divine Presence, not external luxury.", "Understand Sita's complete detachment from palatial comforts.", "Recognize that the world is a \"dry pond\" without the Divine."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did Sita describe Ayodhya's wealth without Rama?",
        options: ["As a necessary comfort.", "As dry and cheap as grass.", "As her true home.", "As a heavy burden."],
        correctAnswer: 1,
        explanation: "Sita declared, \"Now, they appear to me as dry and as cheap as grass, without my Lord being with me.\"",
        citation: "Part 1, Ch 12.  ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["Where am I currently seeking happiness in \"dry grass\" (material comforts) instead of in my connection to the Divine?"],
    interestingBit: "",
    publishAt: getPublishDate(17),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/sita-insists-on-going-with-rama"
  },
  {
    weekId: "W19",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Entering into Exile",
    topic: "Understand that accepting God's will requires absolute serenity.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand that accepting God's will requires absolute serenity.", "Learn from Rama’s calm exit from the palace without anger.", "Cultivate the ability to remain unmoved by public praise or pity."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did Rama behave while walking through the weeping citizens of Ayodhya?",
        options: ["He cried with them.", "He walked with bowed head, maintaining his serenity.", "He asked them to fight for him.", "He ignored them completely."],
        correctAnswer: 1,
        explanation: "\"Rama didn’t raise his head to look at any of the faces around him... He was filled with as much equanimity now... as he had a few moments ago.\"",
        citation: "Part 1, Ch 13.",
        points: 100
      }
    ],
    reflectionPrompts: ["When others are panicking or pitying me during a crisis, can I maintain my inner silence and accept the situation with grace? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(18),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/entering-into-exile"
  },
  {
    weekId: "W20",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Into the Forest",
    topic: "Value devotion that is pure and unaffected by worldly rank.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Value devotion that is pure and unaffected by worldly rank.", "See how the forest dwellers perceived the divine charm of the brothers.", "Recognize the illusion of happiness and misery (Lakshmana's discourse)."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "According to Lakshmana's counsel to Guha, what are happiness and misery?",
        options: ["Gifts from the gods.", "Punishments from demons.", "Unreal and short-lived, like a dream.", "Permanent states of the soul."],
        correctAnswer: 2,
        explanation: "Lakshmana says: \"When they awake, they find that happiness and misery were unreal and short-lived. So too, the world is a dream, unreal, illusory.\"",
        citation: "Part 1, Ch 14.  ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["How often do my judgments of \"good\" and \"bad\" stem simply from my personal attachments rather than absolute Truth?"],
    interestingBit: "",
    publishAt: getPublishDate(19),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/into-the-forest"
  },
  {
    weekId: "W21",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Among Hermitages (Bharadwaja)",
    topic: "Realize that the true goal of austerity is the vision of the Divine.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Realize that the true goal of austerity is the vision of the Divine.", "Model the humility of Rama when interacting with sages.", "See how the presence of God cures the \"disease of birth-and-death\"."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "What did Sage Bharadwaja declare as the reason he chose that spot for his austerities?",
        options: ["Because it was near the river.", "Because he knew he could get the sight of the Lord there.", "Because there were no demons there.", "Because the weather was pleasant."],
        correctAnswer: 1,
        explanation: "\"I chose this holy spot for my hermitage and austerities because I knew that here I could get the sight of the Lord, which I had longed for for many years.\"",
        citation: "Part 1, Ch 15.",
        points: 100
      }
    ],
    reflectionPrompts: ["Is my spiritual practice too focused on \"doing\" (rituals/rules) rather than \"being\" in a state of deep yearning for God? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(20),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/among-hermitages-bharadwaja"
  },
  {
    weekId: "W22",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "The hermitage of Valmiki",
    topic: "Understand that the Divine resides in the hearts of devotees.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand that the Divine resides in the hearts of devotees.", "Learn the qualities of the heart that God chooses as His residence.", "Realize that the universe is the \"seen\" and God is the \"witness.\""],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "According to Valmiki, what is the best place for Rama to stay?",
        options: ["A golden palace.", "The highest mountain peak.", "The hearts of those who gladly receive His stories and name.", "A cave deep in the forest."],
        correctAnswer: 2,
        explanation: "Valmiki tells Rama to stay \"in the heart of the person who discards evil... whose ears receive gladly the streams of stories recounting your exploits.\"",
        citation: "Part 1, Ch 15.",
        points: 100
      }
    ],
    reflectionPrompts: ["If my heart were a \"hermitage,\" would it be clean enough and full of enough love to host the Lord? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(21),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-hermitage-of-valmiki"
  },
  {
    weekId: "W23",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Gloom over Ayodhya",
    topic: "Understand the severe consequences of breaking the bond of love.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand the severe consequences of breaking the bond of love.", "See how true detachment requires leaving even the body behind.", "Witness the effect of a society losing its moral compass (Rama)."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "What did Sumanthra report about the citizens who followed Rama's chariot?",
        options: ["They were angry and wanted to fight Rama.", "They happily returned home after a few miles.", "They declared that the forest where Rama resides is Ayodhya for them.", "They demanded money to return."],
        correctAnswer: 2,
        explanation: "\"The forest where you reside is the Ayodhya for us, they said... We will not falter in our resolution.\"",
        citation: "Part 1, Ch 13/16. Is my \"heart-home\" ( ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["Ayodhya) wherever my spiritual focus is today, regardless of my physical location?"],
    interestingBit: "",
    publishAt: getPublishDate(22),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/gloom-over-ayodhya"
  },
  {
    weekId: "W24",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "The Brothers Meet",
    topic: "Deepen understanding of fraternal love and self-reproach.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Deepen understanding of fraternal love and self-reproach.", "Learn to avoid finding fault with others (even one's mother).", "Value the power of prayer and surrender over enforcing one's will."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did Bharatha respond when the citizens prayed to him to bring Rama back?",
        options: ["He promised he would force Rama to return.", "He said praying is his task, but the result depends on Rama's grace.", "He told them to go back to Ayodhya.", "He said he didn't want Rama to return."],
        correctAnswer: 1,
        explanation: "\"Praying is my task; what happens to the prayer is dependent on Rama’s grace. I am but a slave; who am I to exert pressure on Rama?\"",
        citation: "Part 1, Ch 17.",
        points: 100
      }
    ],
    reflectionPrompts: ["When I want a specific outcome, do I try to force it, or do I pray sincerely and leave the result to Divine grace? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(23),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-brothers-meet"
  },
  {
    weekId: "W25",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Discussions about returning",
    topic: "Understand that duty (Dharma) must be obeyed regardless of personal pain.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand that duty (Dharma) must be obeyed regardless of personal pain.", "Note Rama's unwavering commitment to his father's command.", "Realize that trying to avoid one's duty is a spiritual failing."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Why did Rama refuse Bharatha's plea to swap places (Bharatha in the forest, Rama in Ayodhya)?",
        options: ["Rama liked the forest better.", "Rama said each must do the duty allotted to him by their father.", "Rama didn't trust Bharatha.", "Rama wanted to fight demons."],
        correctAnswer: 1,
        explanation: "Rama stated: \"My most appropriate action is to follow the orders issued to me; yours is to follow those issued to you... Return to Ayodhya... I will carry out the task allotted to me.\"",
        citation: "Part 1, Ch 17.  ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["Where am I trying to \"swap duties\" or avoid the specific responsibilities that have been placed on my shoulders?"],
    interestingBit: "",
    publishAt: getPublishDate(24),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/discussions-about-returning"
  },
  {
    weekId: "W26",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Sandals Enthroned",
    topic: "Learn the significance of placing the Divine \"Sandals\" on the throne.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Learn the significance of placing the Divine \"Sandals\" on the throne.", "Admire Bharatha’s asceticism and renunciation of luxury.", "Understand that true authority comes from surrendering to the Divine."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Where did Bharatha choose to live while ruling as Rama's representative?",
        options: ["The main palace in Ayodhya", "The hermitage of Vasishta", "A grass-thatched hut in the village of Nandigrama", "A fortress in Mithila"],
        correctAnswer: 2,
        explanation: "\"Bharatha, walked toward the village of Nandigrama, where he had a thatched hut made ready for his residence. He wore his hair braided in a knot... his apparel was made of the bark of trees.\"",
        citation: "Part 1, Ch 18.",
        points: 100
      }
    ],
    reflectionPrompts: ["Are the \"sandals\" (Divine commands) on my head, or is my ego on the throne of my life? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(25),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/sandals-enthroned"
  },
  {
    weekId: "W27",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "A visit to the sage Athri’s hermitage",
    topic: "Learn the spiritual truth behind the masculine and feminine principles.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Learn the spiritual truth behind the masculine and feminine principles.", "Recognise that the cosmos is an undifferentiated unity.", "Understand Rama as the Eternal Masculine (Purusha)."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did Sita describe Rama's nature to Anasuya?",
        options: ["A great warrior and king.", "The incarnation of the One and only masculine principle.", "A strict and unforgiving ruler.", "A normal human prince."],
        correctAnswer: 1,
        explanation: "Sita explained that \"her Lord, Rama, was the incarnation of the One and only masculine principle in the universe. In him... there was no trace of duality.\"",
        citation: "Part 2, Ch 1.  ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["How can I cultivate the \"fearlessness\" that comes from realizing the non-dual nature of the Divine?"],
    interestingBit: "",
    publishAt: getPublishDate(26),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/a-visit-to-the-sage-athri-s-hermitage"
  },
  {
    weekId: "W28",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Sutheekshna adores Rama",
    topic: "Understand that God is won by the path of pure, unalloyed love.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand that God is won by the path of pure, unalloyed love.", "Learn that yearning is the highest form of austerity.", "Witness Sutheekshna’s ecstatic state of mergence."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "What did Sage Sutheekshna declare as his only spiritual discipline?",
        options: ["Fasting for months.", "Vedic chanting.", "Yearning and love.", "Complex meditation."],
        correctAnswer: 2,
        explanation: "Sutheekshna told Rama, \"I know only that you, the embodiment of love, can be attained through love. Yearning is the only earning I have accumulated.\"",
        citation: "Part 2, Ch 1.",
        points: 100
      }
    ],
    reflectionPrompts: ["Is my spiritual practice too focused on \"doing\" (rituals) rather than \"being\" in a state of deep yearning and love for God? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(27),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/sutheekshna-adores-rama"
  },
  {
    weekId: "W29",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Agastya asks not to be deluded",
    topic: "See how Maya creates delusion and egotism.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["See how Maya creates delusion and egotism.", "Learn from Agastya’s refusal to be deluded by Rama’s \"human\" praise.", "Understand the universe as the \"seen\" and God as the \"witness.\""],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "What did Sage Agastya ask Rama not to do?",
        options: ["Fight the demons in the forest.", "Inveigle him into illusion (maya) and delude him into egotism.", "Build a hermitage near his own.", "Leave the forest too soon."],
        correctAnswer: 1,
        explanation: "Agastya recognized Rama's divine play and prayed, \"Father! Don’t inveigle me into your illusion (maya) and delude me into egotism, making me the target of your sport.\"",
        citation: "Part 2, Ch 1.",
        points: 100
      }
    ],
    reflectionPrompts: ["When people praise me, do I fall into the trap of egotism, or do I remain grounded in the awareness of the Divine Doer? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(28),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/agastya-asks-not-to-be-deluded"
  },
  {
    weekId: "W30",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Panchavati (Lakshmana's duty)",
    topic: "Realize that true surrender means having no will of one's own.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Realize that true surrender means having no will of one's own.", "Learn from Lakshmana's reaction to building the hut.", "Cultivate the attitude of a dedicated servant."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Why did Lakshmana cry when Rama asked him to choose a spot for the hut?",
        options: ["He didn't know the forest well enough.", "He felt he had no will or wish of his own.", "He was tired from the journey.", "He was afraid of demons."],
        correctAnswer: 1,
        explanation: "Lakshmana wept saying, \"I have no wish of my own; I have no will of my own. My wish, my will, is Rama’s wish... How then can I bear to listen to words that indicate that I have to choose...?\"",
        citation: "Part 2, Ch 2.  ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["Where am I stubbornly asserting \"my will\" instead of surrendering to what life (or the Divine) is asking of me right now?"],
    interestingBit: "",
    publishAt: getPublishDate(29),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/panchavati-lakshmana-s-duty"
  },
  {
    weekId: "W31",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Rama discourses on spiritual matters",
    topic: "Distinguish between knowledge-based and ignorance-based illusion.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Distinguish between knowledge-based and ignorance-based illusion.", "Understand that sensual pleasures are momentary and lead to grief.", "Learn the definition of a true monk (vairagi)."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "According to Rama, what is the nature of ignorance-based illusion (a-vidya-maya)?",
        options: ["It creates the cosmos.", "It causes boundless misery and binds one to joy and grief.", "It leads directly to liberation.", "It reflects the Trinity."],
        correctAnswer: 1,
        explanation: "Rama explains, \"The latter (a-vidya-maya) is very vicious; she causes boundless misery. Those drawn by it will sink into the depths of flux.\"",
        citation: "Part 2, Ch 2.",
        points: 100
      }
    ],
    reflectionPrompts: ["Which of my current attachments is rooted in ignorance-based illusion, causing me unnecessary anxiety or misery? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(30),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/rama-discourses-on-spiritual-matters"
  },
  {
    weekId: "W32",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "The Wily Villain (Rama and Sita discuss)",
    topic: "Realize the difference between the \"Gross\" and \"Subtle\" self.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Realize the difference between the \"Gross\" and \"Subtle\" self.", "Understand the concept of the \"Maya Sita\" in the divine drama.", "Note that spiritual power is useless if tainted by lust."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "What did Rama ask the real Sita to do before the golden deer arrived?",
        options: ["Hide in a cave.", "Return to Ayodhya.", "Deposit her divine attributes and splendour in the God of Fire (Agni).", "Fight Ravana directly."],
        correctAnswer: 2,
        explanation: "Rama told her: \"deposit all your divine attributes and splendour in fire and act as an ordinary human being hereafter... you will have to burn Lanka to ashes, emerging from the fire.\"",
        citation: "Part 2, Ch 3.  ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["How does understanding that the \"real\" soul cannot be harmed change my perspective on the physical hardships of life?"],
    interestingBit: "",
    publishAt: getPublishDate(31),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-wily-villain-rama-and-sita-discuss"
  },
  {
    weekId: "W33",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "The deer entices the brothers",
    topic: "Learn how external allurements distract the mind.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Learn how external allurements distract the mind.", "Recognise the danger of pursuing fleeting desires.", "Understand the consequences of crossing safety boundaries."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "What did the Golden Deer symbolize in the divine drama?",
        options: ["True spiritual wealth.", "The trap of sensual craving and illusion.", "A gift from the gods.", "The beauty of nature."],
        correctAnswer: 1,
        explanation: "Rama used the deer to show the world that \"devotion to God that is polluted by lust is as foul as dirt,\" and to highlight the trap of outward fascination.",
        citation: "Part 2, Ch 3.  ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["Where is a \"golden deer\" (a distracting, shiny, but ultimately harmful desire) pulling my focus away from my true spiritual goals?"],
    interestingBit: "",
    publishAt: getPublishDate(32),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-deer-entices-the-brothers"
  },
  {
    weekId: "W34",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Sabari tells her story",
    topic: "Understand that God values pure love above caste, status, or scholarship.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand that God values pure love above caste, status, or scholarship.", "Learn the essence of Sabari’s patient, expectation-free service.", "Realize that mind purity comes from not casting aspersions on others."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "According to Rama, why did he consider Sabari the highest in spiritual attainment?",
        options: ["She knew the Vedas perfectly.", "She followed all nine ways of devotion to the end.", "She was of high caste.", "She built a great temple."],
        correctAnswer: 1,
        explanation: "Rama tells her: \"Of the nine ways of evincing... devotion, I desire only that any one be followed... But I find you have followed all nine ways to the very end.\"",
        citation: "Part 2, Ch 3.  ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["How can I cultivate a love that \"doesn't blossom when 'good' comes and doesn't wither when 'bad' comes,\" like Sabari?"],
    interestingBit: "",
    publishAt: getPublishDate(33),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/sabari-tells-her-story"
  },
  {
    weekId: "W35",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "An Ally Accepted (Hanuman meets the brothers)",
    topic: "Understand the humility and dedication of Hanuman.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand the humility and dedication of Hanuman.", "See how the Divine responds to pure, unselfish service.", "Recognize the servant as an instrument of the Master."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did Hanuman respond when Rama asked him about his identity?",
        options: ["He boasted about his strength.", "He assumed his real form and declared he knew no activity other than adoring his Lord.", "He demanded to know Rama's lineage first.", "He challenged Lakshmana to a fight."],
        correctAnswer: 1,
        explanation: "Hanuman said, \"I know no activity other than adoring my Lord. When the servant is fostered and guarded by his Lord, why should he fear?\" And he assumed his real form.",
        citation: "Part 2, Ch 4.",
        points: 100
      }
    ],
    reflectionPrompts: ["Is my service to others \"conditional\" (expecting a reward) or is it a dedicated offering to the Divine within them? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(34),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/an-ally-accepted-hanuman-meets-the-brothers"
  },
  {
    weekId: "W36",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Rama exhibits his power",
    topic: "Understand how doubt weakens faith.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand how doubt weakens faith.", "See how the Divine humbles Himself to provide \"proof\" for the weak mind.", "Learn to avoid false friends."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Why did Sugriva ask Rama to shoot an arrow through seven giant palm trees?",
        options: ["To build a bridge.", "To test his strength and gain confidence that Rama could defeat Vali.", "To make a path through the forest.", "To prove his bow was real."],
        correctAnswer: 1,
        explanation: "Sugriva wanted to see if Rama had strength beyond Vali, who had felled five trees. \"I am most eager to find out whether you have that extra might...\"",
        citation: "Part 2, Ch 4.",
        points: 100
      }
    ],
    reflectionPrompts: ["Am I constantly \"testing\" God or my spiritual path because of my own inner insecurities and doubts? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(35),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/rama-exhibits-his-power"
  },
  {
    weekId: "W37",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Rama consoles Tara",
    topic: "Differentiate between the temporary body and the eternal Atma.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Differentiate between the temporary body and the eternal Atma.", "Learn to process grief through spiritual understanding.", "Heed Rama's counsel to Tara on the futility of weeping for the body."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did Rama explain the folly of weeping for the body to Tara?",
        options: ["The body is immortal.", "The body is just an instrument to achieve the supreme goal.", "The body feels no pain.", "The body becomes a god."],
        correctAnswer: 1,
        explanation: "Rama says, \"The body is a temporary phase... It is but an instrument to achieve the supreme goal, and if that end is not kept in view... the body is but a lump of coal.\"",
        citation: "Part 2, Ch 4.",
        points: 100
      }
    ],
    reflectionPrompts: ["If I truly believed I am the eternal Atma and not this temporary body, how would my daily fears and anxieties change? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(36),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/rama-consoles-tara"
  },
  {
    weekId: "W38",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Success in the Search (Swayamprab ha)",
    topic: "See how earnest spiritual effort is rewarded with Divine vision.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["See how earnest spiritual effort is rewarded with Divine vision.", "Understand that sincere search is never wasted.", "Value the help of unexpected guides."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "What did Swayamprabha tell the monkeys her ultimate wish was from Brahma?",
        options: ["To have eternal youth.", "To see God as man, moving on earth.", "To become a queen.", "To have wings like an eagle."],
        correctAnswer: 1,
        explanation: "\"I replied, ‘I wish to see God as man, moving on earth!’ He said, ‘Be here alone... From them, you can know of Rama, who is God come in human form.'\"",
        citation: "Part 2, Ch 5.",
        points: 100
      }
    ],
    reflectionPrompts: ["When I feel \"exhausted\" in my spiritual or life pursuits, am I open to receiving guidance from unexpected sources? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(37),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/success-in-the-search-swayamprab-ha"
  },
  {
    weekId: "W39",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Sampathi knows where Sita is",
    topic: "Understand how past mistakes (pride) can be redeemed through service.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand how past mistakes (pride) can be redeemed through service.", "See how chanting the Divine Name grants impossible strength.", "Value the power of service to God's emissaries."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did Sampathi regain his wings?",
        options: ["By eating magic fruit.", "By seeing the emissaries of God engaged in their holy mission (helping Rama).", "By sleeping for a hundred years.", "By bathing in the sea."],
        correctAnswer: 1,
        explanation: "The sage Chandramas predicted his wings would grow when he helped Rama's emissaries by giving them information about Sita.",
        citation: "Part 2, Ch 5.  ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["How does the story of Sampathi illustrate that service to a higher cause can \"regrow the wings\" of a broken spirit?"],
    interestingBit: "",
    publishAt: getPublishDate(38),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/sampathi-knows-where-sita-is"
  },
  {
    weekId: "W40",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Hanuman jumps the ocean",
    topic: "Learn to avoid distractions when on a divine mission.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Learn to avoid distractions when on a divine mission.", "See how focus and dedication overcome massive obstacles.", "Value the recital of the Name as the source of strength."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Why did Hanuman refuse to rest on the Mainaka Peak?",
        options: ["He was afraid of it.", "He had no thought of rest until he fulfilled Rama's errand.", "He was not tired at all.", "The peak was too small."],
        correctAnswer: 1,
        explanation: "Hanuman bowed to the peak but said, \"I am going on Rama’s errand; till I fulfil it, I can have no thought of rest... It is not proper for me to stay awhile on the way.\"",
        citation: "Part 2, Ch 5.  ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["What \"comfortable resting places\" (distractions) are preventing me from completing my spiritual or life purpose?"],
    interestingBit: "",
    publishAt: getPublishDate(39),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/hanuman-jumps-the-ocean"
  },
  {
    weekId: "W41",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Sita at last! & Thrijata’s dream",
    topic: "Unshakeable resolve in the face of intense pressure.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Unshakeable resolve in the face of intense pressure.", "See how true strength comes from inner purity, not weapons.", "Understand that the Divine sends comfort in the darkest times (Thrijata)."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did Sita react to Ravana's threats in the Ashokavana?",
        options: ["She begged for mercy.", "She agreed to his terms.", "She did not raise her eyes and called him a fool.", "She tried to run away."],
        correctAnswer: 2,
        explanation: "\"That frail feeble woman didn’t raise her eyes toward Ravana even once... She only said, 'Fool! Vile vicious fellow! Rama alone has rights over me...'\"",
        citation: "Part 2, Ch 5.",
        points: 100
      }
    ],
    reflectionPrompts: ["In the face of intense pressure or temptation to compromise my values, how can I channel Sita's unshakeable resolve? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(40),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/sita-at-last-thrijata-s-dream"
  },
  {
    weekId: "W42",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Sita refuses to go back with Hanuman",
    topic: "Learn why righteous means must be used for righteous ends.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Learn why righteous means must be used for righteous ends.", "Understand that actions must not draw ridicule and must preserve honor.", "Recognize that true heroism confronts evil openly."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Why did Sita refuse to let Hanuman carry her back to Rama?",
        options: ["Hanuman was too small.", "She wanted Rama to defeat Ravana openly to preserve his fair name.", "She was afraid of falling into the sea.", "She wanted to stay in Lanka."],
        correctAnswer: 1,
        explanation: "Sita stated, \"Getting out of here in the way you suggest would surely be treason... We should guard Rama’s fair name as our very breath.\"",
        citation: "Part 2, Ch 5.",
        points: 100
      }
    ],
    reflectionPrompts: ["Am I taking \"shortcuts\" to solve my problems, or am I willing to do things the right way, even if it is harder, to preserve my integrity? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(41),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/sita-refuses-to-go-back-with-hanuman"
  },
  {
    weekId: "W43",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Lanka on Fire (Hanuman and Ravana talk)",
    topic: "Understand the danger of arrogance and ego.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand the danger of arrogance and ego.", "See how a true messenger speaks truth to power fearlessly.", "Recognize that pride blinds one to good advice."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "What did Hanuman advise Ravana to do?",
        options: ["To fight Rama immediately.", "To give up his pride, adore Rama, and surrender Sita.", "To build a stronger fort.", "To kill Vibhishana."],
        correctAnswer: 1,
        explanation: "Hanuman said, \"Give up this delusion of accumulating pomp and power; adore in your heart the Destroyer of fear... Place Sita at Rama’s lotus feet and meditate on the grace...\"",
        citation: "Part 2, Ch 6.",
        points: 100
      }
    ],
    reflectionPrompts: ["Am I willing to speak the truth fearlessly, like Hanuman, even when facing someone with worldly power? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(42),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/lanka-on-fire-hanuman-and-ravana-talk"
  },
  {
    weekId: "W44",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Hanuman breaks free and sets Lanka afire",
    topic: "Interpret the burning of Lanka as the destruction of pride and lust.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Interpret the burning of Lanka as the destruction of pride and lust.", "See how Hanuman’s detachment protected him from the fire.", "Learn that ignoring wise counsel leads to self-destruction."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "What did Malyavantha say the fire destroying Lanka actually was?",
        options: ["The unbearable grief of Sita.", "A natural disaster.", "A trick of Indra.", "Rama's magical weapon."],
        correctAnswer: 0,
        explanation: "Malyavantha saw the plight and said, \"No, this fire cannot be put out by rain! This is the unbearable grief of Sita.\"",
        citation: "Part 2, Ch 6.  ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["What \"tail of pride\" am I carrying that might end up setting fire to my own peace and the peace of my household?"],
    interestingBit: "",
    publishAt: getPublishDate(43),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/hanuman-breaks-free-and-sets-lanka-afire"
  },
  {
    weekId: "W45",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "The Bridge (The ocean shows the way)",
    topic: "See how devotion makes heavy burdens light.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["See how devotion makes heavy burdens light.", "Understand the building of the bridge as cooperative, dedicated service.", "Learn that chanting the Name guarantees the success of the work."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did the monkeys manage to build the bridge across the ocean?",
        options: ["By using Ravana's stolen boats.", "By tying trees with giant ropes.", "By writing Rama's name on rocks that then floated.", "By freezing the water."],
        correctAnswer: 2,
        explanation: "The ocean advised, \"Have your name inscribed on every slab and rock. Your name is light, not heavy at all. Thus, even huge mountain peaks... would float.\"",
        citation: "Part 2, Ch 7.",
        points: 100
      }
    ],
    reflectionPrompts: ["When faced with an \"ocean\" of difficulties, am I trying to build the bridge with my own ego, or am I relying on the \"Name\" (Divine grace)? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(44),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-bridge-the-ocean-shows-the-way"
  },
  {
    weekId: "W46",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Rama's envoy, Angada, advises Ravana",
    topic: "Observe Angada’s complete lack of fear in Ravana’s court.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Observe Angada’s complete lack of fear in Ravana’s court.", "Understand that connection to God removes the fear of the worldly.", "Learn how to speak truth to power."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "What did Angada tell Ravana would liberate him from fear and bondage?",
        options: ["Giving up his wealth to the monkeys.", "Placing his hands on Rama's feet in genuine surrender.", "Fighting bravely until the end.", "Moving his capital to Patala."],
        correctAnswer: 1,
        explanation: "Angada laughed at Ravana's attempt to lift his feet and said, \"No, these are not the feet you have to hold. Place your hands on Rama’s feet, in the genuine gesture of surrender.\"",
        citation: "Part 2, Ch 7. When have I compromised my truth out of fear of someone's worldly power?  ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["How can I act with Angada's courage?"],
    interestingBit: "",
    publishAt: getPublishDate(45),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/rama-s-envoy-angada-advises-ravana"
  },
  {
    weekId: "W47",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "The Siege (Lakshmana is hurt)",
    topic: "Recognize that the Lord feels the pain of His devotees.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Recognize that the Lord feels the pain of His devotees.", "Understand the Sanjivi Hill as the life-giving power of devotion.", "See how service (Hanuman) brings healing to the injured."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Who brought the Sanjivi Hill to heal the unconscious Lakshmana?",
        options: ["Jambavan", "Sugriva", "Vibhishana", "Hanuman"],
        correctAnswer: 3,
        explanation: "\"Soon, Hanuman appeared carrying the Sanjivi Peak on his upraised palm... Sushena immediately secured the drugs he required... and administered them.\"",
        citation: "Part 2, Ch 8.",
        points: 100
      }
    ],
    reflectionPrompts: ["Who in my life is spiritually or emotionally \"unconscious,\" and how can I be the \"Hanuman\" that brings them the medicine of love and hope? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(46),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-siege-lakshmana-is-hurt"
  },
  {
    weekId: "W48",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "The Nether Region",
    topic: "Learn from Hanuman's single-pointed focus in Patala.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Learn from Hanuman's single-pointed focus in Patala.", "Understand that one must overcome internal guards to reach the goal.", "See how God plays a role to test and elevate His devotees."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Why did Rama allow himself to be kidnapped by Ahi-Ravana?",
        options: ["He was actually unconscious.", "He wanted to destroy the demon species in the nether regions.", "He lost his power temporarily.", "Hanuman asked him to."],
        correctAnswer: 1,
        explanation: "\"His purpose in so doing was to destroy the entire demon (rakshasa) species. His task would remain unfinished if Ravana’s descendents survived in the nether regions.\"",
        citation: "Part 2, Ch 9.",
        points: 100
      }
    ],
    reflectionPrompts: ["When I feel like I have been \"kidnapped\" by dark circumstances, can I trust that there is a divine plan for my ultimate victory? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(47),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-nether-region"
  },
  {
    weekId: "W49",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Ten Heads Roll",
    topic: "Distinguish between talkers, talker-doers, and silent workers.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Distinguish between talkers, talker-doers, and silent workers.", "Learn to emulate the \"jack tree\" which bears fruit without flowers.", "Understand that boasting is a sign of emptiness."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "According to Rama, what does the \"jack tree\" represent among people?",
        options: ["Those who talk but don't act.", "Those who only care for themselves.", "Those who are silent workers who act with no boast.", "Those who are cruel."],
        correctAnswer: 2,
        explanation: "Rama explained, \"The third type is like the jack tree —it has no flower, but only fruits. The best type are like this. They don’t prattle or boast... they are silent workers.\"",
        citation: "Part 2, Ch 10.",
        points: 100
      }
    ],
    reflectionPrompts: ["Am I a \"patali tree\" (all talk, no action), or am I striving to be a \"jack tree\" (silent, fruitful action)? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(48),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/ten-heads-roll"
  },
  {
    weekId: "W50",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Happy Ayodhya (Hanuman visits Bharatha)",
    topic: "See the intensity of Bharatha's devotion and yearning.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["See the intensity of Bharatha's devotion and yearning.", "Understand how the messenger of God brings supreme relief.", "Value the power of the Divine Name in sustaining life."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did Hanuman find Bharatha when he arrived in Ayodhya?",
        options: ["Ruling from the throne in luxury.", "Worn down by anxiety, with matted hair, repeating Rama's name.", "Angry and preparing an army.", "Asleep in his palace."],
        correctAnswer: 1,
        explanation: "\"His body had been very much reduced, he was worn down by anxiety. His hair had become matted... But he was repeating Rama’s name without intermission.\"",
        citation: "Part 2, Ch 11.",
        points: 100
      }
    ],
    reflectionPrompts: ["Am I as dedicated to my spiritual goal as Bharatha was, keeping my focus even when the \"wait\" seems endless? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(49),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/happy-ayodhya-hanuman-visits-bharatha"
  },
  {
    weekId: "W51",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "The Coronation (Hanuman and the silent gems)",
    topic: "Value the recitation of the Divine Name over material wealth.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Value the recitation of the Divine Name over material wealth.", "Witness Hanuman’s extreme dedication and singular focus on Rama.", "Understand that anything devoid of God's presence is worthless."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Why did Hanuman bite and throw away the gems from the necklace Sita gave him?",
        options: ["They were fake.", "He was looking for the sacred name of Rama inside them.", "He was angry with Vibhishana for bringing it.", "He didn't like jewelry."],
        correctAnswer: 1,
        explanation: "Hanuman said, \"I examined each gem in order to discover whether each had in it the sacred name of Rama... Without Rama’s name, they are but stones.\"",
        citation: "Part 2, Ch 12.",
        points: 100
      }
    ],
    reflectionPrompts: ["If I examined the \"gems\" of my life (career, hobbies, relationships), in how many of them would I find the Name and presence of God? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(50),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-coronation-hanuman-and-the-silent-gems"
  },
  {
    weekId: "W52",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Exile for Sita & Ending the Play",
    topic: "Understand that the Lord's play (leela) ends when the mission is fulfilled.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand that the Lord's play (leela) ends when the mission is fulfilled.", "See the valor of Lava and Kusa.", "Carry the message of Dharma and Love into daily action."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Who captured the sacrificial horse sent out by Rama?",
        options: ["Vali's son Angada.", "The demon Lavana.", "The ascetic boys Kusa and Lava.", "Satrughna."],
        correctAnswer: 2,
        explanation: "\"The two boys (Kusa and Lava) saw the horse, read the golden plate tied around its brow and led it away, to be bound and kept at the hermitage.\"",
        citation: "Part 2, Ch 13.",
        points: 100
      }
    ],
    reflectionPrompts: ["As I conclude this 52-week study, is Rama merely a character in a book to me, or has He become the living \"Atma-Rama\" guiding my daily actions? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(51),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/exile-for-sita-ending-the-play"
  }
];
