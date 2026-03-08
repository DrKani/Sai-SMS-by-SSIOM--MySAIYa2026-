
import { BookClubWeek } from '../types';

const getPublishDate = (weekIndex: number) => {
  const startDate = new Date('2026-02-12T00:00:00+08:00');
  const d = new Date(startDate.getTime() + weekIndex * 7 * 24 * 60 * 60 * 1000);
  return d.toISOString();
};

export const ANNUAL_STUDY_PLAN: BookClubWeek[] = [
  {
    weekId: "W01",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "The Inner Meaning",
    topic: "Understand Rama as the inner Atma.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand Rama as the inner Atma.", "Recognise detachment and Divine presence in all beings.", "Learn the symbolic meaning of key characters."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "What does Hanuman represent?",
        options: ["Intellect", "Discrimination", "Courage", "Despair"],
        correctAnswer: 2,
        explanation: "Baba explicitly states, \"Hanuman is the embodiment of courage.\" Lakshmana represents intellect, Sugriva represents discrimination, and Vali represents despair.",
        citation: "Part 1, The Inner Meaning.  ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["How does viewing the characters as inner qualities change the way you read and relate to the story?"],
    interestingBit: "",
    publishAt: getPublishDate(0),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-inner-meaning"
  },
  {
    weekId: "W02",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Rama—Prince and Principle",
    topic: "Understand the narrative of Rama as the story of the universe.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand the narrative of Rama as the story of the universe.", "Recognise Rama as the attractive principle keeping the cosmos from chaos.", "Learn to extract the \"sweet juice\" of the text."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "What does the text compare to the \"hard indigestible seeds\" of a fruit?",
        options: ["The names of the characters", "The wicked deeds of the evil people", "The geographical locations", "The worldly descriptions"],
        correctAnswer: 1,
        explanation: "\"In this Rama fruit called Ramayana, the tales of demons... form the rind; the wicked deeds of these evil people are the hard indigestible seeds.\"",
        citation: "Part 1, Ch 1.",
        points: 100
      }
    ],
    reflectionPrompts: ["When my own life \"meanders through twists and curves\" of sadness, do I lose my inner sweetness and compassion? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(1),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/rama-prince-and-principle"
  },
  {
    weekId: "W03",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "The Imperial Line: Raghu",
    topic: "Learn about the lineage of Rama.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Learn about the lineage of Rama.", "Recognise ideal leadership as selfless service and compassion.", "Value the promotion of righteous living over personal comfort."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "What were the twin objectives of Emperor Raghu's rule?",
        options: ["Conquering demons and building temples", "Expanding the empire and gaining wealth", "The happiness of his subjects and the promotion of righteous living", "Defeating Ravana and protecting sages"],
        correctAnswer: 2,
        explanation: "\"Emperor Raghu ruled the kingdom... with twin objectives: the happiness of his subjects and the promotion of righteous living.\"",
        citation: "Part 1, Ch 2.  Do I use it to promote the happiness of those around me? ---PAGE---",
        points: 100
      }
    ],
    reflectionPrompts: ["How do I handle power or leadership in my own life?"],
    interestingBit: "",
    publishAt: getPublishDate(2),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-imperial-line-raghu"
  },
  {
    weekId: "W04",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Curse of No Progeny for Dasaratha",
    topic: "Analyze the early rivalry of Ravana.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Analyze the early rivalry of Ravana.", "Understand how pride and ego lead to destruction.", "Note Dasaratha's fearlessness in the face of demonic threats."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did Dasaratha respond to Ravana's demand for tribute?",
        options: ["He sent a vast amount of gold.", "He surrendered Ayodhya.", "He shot arrows that fastened the gates of Lanka.", "He ignored the messenger."],
        correctAnswer: 2,
        explanation: "\"He shot sharp deadly arrows, which reached Lanka itself and fastened the gates of that city! ... 'That is the tribute I pay to your impertinent lord.'\"",
        citation: "Part 1, Ch 3.",
        points: 100
      }
    ],
    reflectionPrompts: ["When faced with unreasonable demands or arrogance, do I respond with clear, detached strength, or do I react with fear? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(3),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/curse-of-no-progeny-for-dasaratha"
  },
  {
    weekId: "W05",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Birth of Dasaratha’s Four Sons",
    topic: "Learn the meanings of the four brothers' names.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Learn the meanings of the four brothers' names.", "Understand the spiritual significance of their births."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "According to Sage Vasishta, what is the meaning of the name \"Rama\"?",
        options: ["He who pleases", "The Valiant", "The Supreme Ruler", "The Destroyer of Demons"],
        correctAnswer: 0,
        explanation: "Vasishta declared that the child would bring joy to all, so his name would be Rama, or \"he who pleases.\"",
        citation: "Part 1, Ch 4.",
        points: 100
      }
    ],
    reflectionPrompts: ["If Rama is \"He who pleases,\" what actions in my daily life currently displease my inner Self or conscience? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(4),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/birth-of-dasaratha-s-four-sons"
  },
  {
    weekId: "W06",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "Unhappiness at separation",
    topic: "Understand the deep bond between the brothers.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand the deep bond between the brothers.", "Discover how the individual soul pines for the Supreme Soul.", "Recognise the unity of the Divine forces."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Why did baby Lakshmana cry incessantly until placed in Rama's cradle?",
        options: ["He was hungry.", "The individual self is restless until united with the Absolute Self.", "He was frightened by a vision.", "He was unwell."],
        correctAnswer: 1,
        explanation: "Vasishta explained that Lakshmana and Rama shared the same divine aspect. Just as a fish cannot rest outside water, the individual soul (Lakshmana) could not find peace until united with its source (Rama).",
        citation: "Part 1, Ch 4.",
        points: 100
      }
    ],
    reflectionPrompts: ["In the midst of daily anxieties, what practical steps can I take to \"place myself in the cradle\" of Divine presence? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(5),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/unhappiness-at-separation"
  },
  {
    weekId: "W07",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "The Guru and the Pupils",
    topic: "Value the role of the Guru in spiritual transformation.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Value the role of the Guru in spiritual transformation.", "Understand that true learning requires simple living and service.", "Recognise that character is the foundation of education."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "How did the young princes live while studying with Vasishta?",
        options: ["In royal luxury", "Renouncing palace comforts and undergoing hardships", "Only studying during the day", "With a large entourage"],
        correctAnswer: 1,
        explanation: "\"They renounced the palace comforts and gladly underwent the hardships. They carried out the wishes of the master in humility and with loyalty.\"",
        citation: "Part 1, Ch 5.",
        points: 100
      }
    ],
    reflectionPrompts: ["In my pursuit of knowledge, have I prioritized comfort over discipline, humility, and service to my mentors? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(6),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-guru-and-the-pupils"
  },
  {
    weekId: "W08",
    book: "Ramakatha Rasavahini I",
    chapterTitle: "The pilgrimage",
    topic: "Understand that secular knowledge is incomplete without spiritual grounding.",
    pages: "",
    complexity: "Medium",
    learningOutcomes: ["Understand that secular knowledge is incomplete without spiritual grounding.", "Learn the value of reverence for holy places.", "See how inner transformation changes outward behavior."],
    durationMinutes: 20,
    quizCutoff: 100,
    questions: [
      {
        question: "Why did Dasaratha want the princes to learn the spiritual science of liberation (para-vidya)?",
        options: ["Only spiritual science gives the strength to carry out righteous duties.", "To make them famous scholars.", "To help them win wars.", "To impress the sages."],
        correctAnswer: 0,
        explanation: "Dasaratha stated \"that however proficient a person might be in secular sciences... only spiritual science could give the strength to carry out the person’s dharma.\"",
        citation: "Part 1, Ch 5.",
        points: 100
      }
    ],
    reflectionPrompts: ["Is my education purely secular (focused on making a living), or am I dedicating time to \"para-vidya\" (learning how to live righteously)? ---PAGE---"],
    interestingBit: "",
    publishAt: getPublishDate(7),
    status: "scheduled",
    contentRaw: "DEPRECATED",
    summaryRaw: "<p>Please read the official chapter text using the link provided.</p>",
    sourceUrl: "https://www.ssssahitya.org/vahinis/ramakatha-rasavahini/the-pilgrimage"
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
