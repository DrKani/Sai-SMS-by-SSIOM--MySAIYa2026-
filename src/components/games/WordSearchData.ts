
export interface WordData {
    word: string;
    desc: string;
    clue?: string; // For bonus levels
    source?: string; // URL reference
}

export interface LevelConfig {
    id: number;
    title: string;
    description: string;
    icon: string; // FontAwesome class
    color: string; // Tailwind bg color
    theme: string; // CSS linear-gradient string
    type: 'standard' | 'bonus';
    words: WordData[];
    gridSize?: number; // Optional custom grid size
    passingScoreThreshold?: number; // Minimum score to pass (bonus levels)
}

export const WORD_SEARCH_LEVELS: LevelConfig[] = [
    {
        id: 1,
        title: "Things Around Us",
        description: "Simple analogies used by Swami to explain spiritual truths.",
        icon: "fa-leaf",
        color: "bg-green-600",
        theme: "linear-gradient(135deg, #22c55e, #15803d)",
        type: 'standard',
        passingScoreThreshold: 100,
        words: [
            { word: "TREE", desc: "Life is a tree: faith is its hidden root, values are the life‑giving rain, and character is the unseen sap that rises to blossom as selfless words, thoughts, and service.", source: "https://saispeaks.sathyasai.org/discourse/devotion-panacea" },
            { word: "OCEAN", desc: "Samsara is an endless ocean whose waves of pleasure and pain never stop; the Lord’s Name is the sturdy boat that carries us safely to the shore of peace.", source: "https://saispeaks.sathyasai.org/discourse/devotion-panacea" },
            { word: "SUN", desc: "The sun is God made visible: silently pouring light and warmth on all without preference, it teaches us to shine with the same steady, impartial love for every being.", source: "http://www.saidarshan.org/baba/docs/sarvav.html" },
            { word: "MOON", desc: "The moon is the presiding force of the mind—waxing with worldly wants, waning with detachment; on sacred nights like Shivaratri, the mind‑moon must be thinned and conquered so only Shiva‑consciousness remains.", source: "http://www.saidarshan.org/baba/docs/sarvav.html" },
            { word: "LION", desc: "In the spiritual field, be a lion: rule the forest of your senses, stride fearlessly through trials with the courage born of faith, and prove yourself a hero, not a zero.", source: "https://saispeaks.sathyasai.org/discourse/be-heroes-not-zeros" },
            { word: "BIRD", desc: "However high a bird may soar, it must return to a tree to rest; in the same way, however far we range in the world, we must return to the refuge of God to find true rest.", source: "http://www.saidarshan.org/baba/docs/sarvav.html" },
            { word: "BUBBLE", desc: "Man is like a water bubble rising on the ocean of the Divine—born from God, sustained in God, and destined to merge back into that limitless, formless water.", source: "https://www.saiprakashana.org/portfolio/the-illusionary-bubble-of-life/" },
            { word: "ROSE", desc: "Life is like a rose: fragrant with love yet ringed with thorns of trial; wisdom is to handle the flower of love carefully instead of bleeding ourselves on the thorns of desire and anger.", source: "http://www.saidarshan.org/baba/docs/sarvav.html" },
            { word: "COW", desc: "The cow chews dry grass yet gives nourishing milk; so too, a noble person takes in simple food and simple experiences, but returns to the world only sweetness, strength, and compassion.", source: "http://www.saidarshan.org/baba/docs/sarvav.html" },
            { word: "TRAIN", desc: "Life is a long train journey and desires are our luggage—when we travel light, with only what is truly needed, the ride becomes peaceful and the destination easier to reach.", source: "http://archive.sssmediacentre.org/journals/vol_11/01JUN13/Lessons-one-can-learn-from-a-train-journey-radiosai-article-sathya-sai-baba.htm" },
            { word: "DRIVER", desc: "In the car of the body, God is the unseen owner, the Atma; the mind is the steering that turns this way and that, and the discriminating intellect must be the driver that keeps the journey Godward.", source: "https://saispeaks.sathyasai.org/discourse/devotion-panacea" },
            { word: "CURRENT", desc: "God is the one current flowing through all; bodies and minds are like many bulbs of different shapes and colours, but the light that shines in each is the same divine presence.", source: "http://www.saibaba.org.hk/the_teachings-5.htm" }
        ]
    },
    {
        id: 2,
        title: "His Story",
        description: "Uncover the foundational pillars of the Sathya Sai Avatar: family, early devotees, and sacred places.",
        icon: "fa-users",
        color: "bg-blue-500",
        theme: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        type: 'standard',
        passingScoreThreshold: 100,
        words: [
            { word: "KONDAMA", desc: "The pious paternal grandfather of Sathya’s physical body..." },
            { word: "NAMAGIRIAMMA", desc: "The name given at birth to the chosen mother of the Avatar..." },
            { word: "VENKAPPA", desc: "(Pedda Venkama Raju) The father of the Avatar..." },
            { word: "VENKAAVADHOOTHA", desc: "A saintly ancestor of the Ratnakaram family..." },
            { word: "SESHAMA", desc: "The elder brother who took young Sathya to Kamalapuram..." },
            { word: "VENKAMMA", desc: "The devoted elder sister. She requested a picture of Shirdi Sai Baba..." },
            { word: "SUBBAMMA", desc: "Revered as the 'Yashoda' of the Avatar..." },
            { word: "GOLLAPALLI", desc: "The original name of the village of Puttaparthi..." },
            { word: "MEHBOOB KHAN", desc: "A perceptive teacher who recognized the 'Divine Wonder Child'..." },
            { word: "CHITRAVATHI", desc: "The holy river near Puttaparthi..." },
            { word: "URAVAKONDA", desc: "The place of the turning point. Swami attended high school here..." }
        ]
    },
    {
        id: 3,
        title: "His Message",
        description: "Core concepts and famous aphorisms from Bhagawan's discourses.",
        icon: "fa-envelope-open-text",
        color: "bg-purple-500",
        theme: "linear-gradient(135deg, #a855f7, #7e22ce)",
        type: 'standard',
        passingScoreThreshold: 100,
        words: [
            { word: "LOVE", desc: "Love is the very nature of God and of the Atma; when it flows without selfishness, it becomes the source, support, and fulfilment of every other virtue." },
            { word: "TRUTH", desc: "Truth is living and speaking from the heart filled with Love, aligning thought, word, and deed with the unchanging reality of the Divine within." },
            { word: "DHARMA", desc: "Dharma is love put into action, the right conduct that expresses Truth in daily life, guiding every role we play—from home to office—as an offering to God." },
            { word: "SHANTI", desc: "Shanti is the deep inner peace that arises when life moves in tune with Truth and Dharma, untouched by outer praise or blame." },
            { word: "PREMA", desc: "Prema is pure, selfless love that seeks no return, the radiance of a heart where God alone is loved and all beings are seen as His forms." },
            { word: "AHIMSA", desc: "Ahimsa is love refusing to hurt—through thought, word, or deed—because it recognises the same divinity shining in every living being." },
            { word: "WATCH", desc: "WATCH is Swami’s simple inner discipline: Watch your Words, Actions, Thoughts, Character, and Heart, so that every movement reflects purity and love." },
            { word: "PATIENCE", desc: "Patience is love stretched across time, the strength to endure trial without bitterness, trusting that God’s timing and justice never fail." },
            { word: "CHARACTER", desc: "Character is the unity of thought, word, and deed in goodness; it is the true wealth that makes spiritual knowledge shine and earns God’s grace." },
            { word: "SERVICE", desc: "Service is love in motion—seeing God in others and joyfully using our hands, head, and heart to relieve suffering and uplift lives." }
        ]
    },
    {
        id: 4,
        title: "His Words",
        description: "Find the missing words to complete these Golden Quotes.",
        icon: "fa-lightbulb",
        color: "bg-yellow-500",
        theme: "linear-gradient(135deg, #facc15, #f59e0b)",
        type: 'bonus',
        passingScoreThreshold: 300,
        words: [
            { word: "CHARACTER", clue: "The end of education is _________.", desc: "The end of education is Character." },
            { word: "LOVE", clue: "The end of knowledge is ____.", desc: "The end of knowledge is Love." },
            { word: "PERFECTION", clue: "The end of culture is __________.", desc: "The end of culture is Perfection." },
            { word: "FREEDOM", clue: "The end of wisdom is _______.", desc: "The end of wisdom is Freedom." },
            { word: "HANDS", clue: "______ that serve are holier than lips that pray.", desc: "Hands that serve are holier than lips that pray." },
            { word: "HEART", clue: "There is only one language, the language of the _____.", desc: "There is only one language, the language of the Heart." },
            { word: "MORALITY", clue: "Money comes and goes, _______comes and grows.", desc: "Money comes and goes, Morality comes and grows." },
            { word: "GAME", clue: "Life is a _______, play it!", desc: "Life is a GAME, play it!" },
            { word: "GOD", clue: "...This is the way to _______.", desc: "...This is the way to GOD." },
            { word: "COMPANY", clue: "Tell me your ________, I shall tell you what you are!.", desc: "Tell me your company, I shall tell you what you are!." }
        ]
    },
    {
        id: 5,
        title: "Unity of Faiths",
        description: "Exploring the Unity of Faiths: One God, many names, many paths.",
        icon: "fa-earth-americas",
        color: "bg-indigo-500",
        theme: "linear-gradient(135deg, #06b6d4, #0891b2)",
        type: 'standard',
        passingScoreThreshold: 100,
        words: [
            { word: "HINDUISM", desc: "Ancient way with no single founder, where Vedic rishis..." },
            { word: "BUDDHISM", desc: "Path taught by Siddhartha Gautama, who left his palace..." },
            { word: "JAINISM", desc: "Way of Mahavira, the conqueror of self..." },
            { word: "SIKHISM", desc: "Song of Guru Nanak and the subsequent 9 Gurus..." },
            { word: "JUDAISM", desc: "Covenant tradition shaped by prophets like Abraham..." },
            { word: "CHRISTIANITY", desc: "Good News of Jesus Christ, whose life and teachings..." },
            { word: "ISLAM", desc: "Surrender to the One God revealed to Prophet Muhammad..." },
            { word: "ZOROASTRIANISM", desc: "Fire‑faith of Zoroaster (Zarathustra)..." },
            { word: "BAHAI", desc: "Faith of Bahá’u’lláh, who renewed the call..." },
            { word: "TAOISM", desc: "Way of Laozi’s nameless Dao..." },
            { word: "CONFUCIANISM", desc: "Teaching of Confucius, the sage of propriety..." },
            { word: "SHINTO", desc: "Way of the kami in Japan, with no single founder..." }
        ]
    },
    {
        id: 6,
        title: "Puttaparthi",
        description: "Recollect the landmarks around Prasanthi Nilayam.",
        icon: "fa-monument",
        color: "bg-pink-500",
        theme: "linear-gradient(135deg, #ec4899, #e11d48)",
        type: 'standard',
        passingScoreThreshold: 100,
        words: [
            { word: "KONDAMA", desc: "The pious paternal grandfather..." },
            { word: "NAMAGIRIAMMA", desc: "Name given at birth to Mother Easwaramma..." },
            { word: "VENKAPPA", desc: "Father of the Avatar..." },
            { word: "VENKAAVADHOOTHA", desc: "Saintly ancestor..." },
            { word: "SESHAMA", desc: "Elder brother..." },
            { word: "JANAKIRAMIAH", desc: "Younger brother..." },
            { word: "VENKAMMA", desc: "Elder sister..." },
            { word: "PARVATHAMMA", desc: "Another sister..." },
            { word: "SUBBAMMA", desc: "Yashoda of the Avatar..." },
            { word: "KAMALAMMA", desc: "Second wife of the Karnam..." },
            { word: "GOLLAPALLI", desc: "Original name of Puttaparthi..." },
            { word: "MEHBOOB KHAN", desc: "Perceptive teacher..." },
            { word: "SUBBANNAACHAR", desc: "Teacher who saw Shirdi Sai..." },
            { word: "KONDAPPA", desc: "Another blessed teacher..." },
            { word: "PUTTAPARTHI", desc: "Sacred hamlet..." },
            { word: "CHITRAVATHI", desc: "Holy river..." },
            { word: "BUKKAPATNAM", desc: "Town where Swami attended middle school..." },
            { word: "KAMALAPURAM", desc: "Town where Swami went for further schooling..." },
            { word: "URAVAKONDA", desc: "Place of the turning point..." },
            { word: "KOTA SUBBANNA", desc: "Businessman in Kamalapuram..." }
        ]
    },
    {
        id: 7,
        title: "Sai Nine Codes",
        description: "The Nine Point Code of Conduct serves as a spiritual guideline for Sai devotees.",
        icon: "fa-question-circle",
        color: "bg-yellow-500",
        theme: "linear-gradient(135deg, #16a34a, #ca8a04)",
        type: 'bonus',
        passingScoreThreshold: 300,
        words: [
            { word: "MEDITATION", clue: "Daily __________ and prayer...", desc: "Daily meditation and prayer according to one’s own religion." },
            { word: "PRAYER", clue: "Daily meditation and __________...", desc: "Daily meditation and prayer according to one’s own religion." },
            { word: "BHAJANS", clue: "Devotional singing (__________) ...", desc: "Devotional singing (Bhajans) or prayer with family members." },
            { word: "FAMILY", clue: "...prayer together with __________ members...", desc: "...prayer together with family members at least once a week." },
            { word: "BALVIKAS", clue: "Participation of children in Sai Spiritual Education (__________).", desc: "Participation of children in Sai Spiritual Education (Bal Vikas)." },
            { word: "SERVICE", clue: "Participation in community __________...", desc: "Participation in community service and other programmes." },
            { word: "SAICENTRE", clue: "...organised by the __________.", desc: "Attendance... organised by the Sai Centre." },
            { word: "STUDY", clue: "Regular __________ of Sai literature...", desc: "Regular study of Sai literature and scriptures." },
            { word: "SOFTLY", clue: "Speaking __________ and lovingly...", desc: "Speaking softly and lovingly with everyone." },
            { word: "LOVINGLY", clue: "...speaking softly and __________...", desc: "Speaking softly and lovingly with everyone." },
            { word: "ILL", clue: "Not indulging in talking __________ of others...", desc: "Not indulging in talking ill of others." },
            { word: "DESIRES", clue: "Practising 'Ceiling on __________'...", desc: "Practising 'Ceiling on Desires' to avoid waste." }
        ]
    },
    {
        id: 8,
        title: "Ramayana",
        description: "Characters and events from the Treta Yuga, the divine story of Lord Rama.",
        icon: "fa-hands-holding-circle",
        color: "bg-amber-600",
        theme: "linear-gradient(135deg, #2563eb, #1e40af)",
        type: 'standard',
        passingScoreThreshold: 100,
        words: [
            { word: "RAMA", desc: "Rama is the embodiment of Dharma, the divine king who shows how God lives as an ideal son, brother, husband, friend and ruler.", source: "https://www.saitunes.org/wp-content/uploads/pdf/sssspeaks/Ramakatha%20Rasa%20Vahini,%20Vol%201.pdf" },
            { word: "SITA", desc: "Sita is the ideal of purity and patient strength, the Atma‑principle that remains untouched by Ravana‑like desire.", source: "https://saispeaks.sathyasai.org/discourse/search-sita" },
            { word: "LAKSHMANA", desc: "Lakshmana is the symbol of dedicated jiva, the ever‑alert companion who renounces comfort and kingdom to stay at Rama’s side.", source: "https://sathyasaiwithstudents.blogspot.com/2015/04/lessons-from-life-of-sri-rama-part-2.html" },
            { word: "HANUMAN", desc: "Hanuman is the perfect servant of God, where every thought, word, and limb exist only to obey Rama.", source: "https://saispeaks.sathyasai.org/discourse/play-divine" },
            { word: "DASARATHA", desc: "Dasaratha is the noble ruler whose life shows the cost of attachment and the sacredness of keeping one’s word.", source: "https://www.saitunes.org/wp-content/uploads/pdf/sssspeaks/Ramakatha%20Rasa%20Vahini,%20Vol%201.pdf" },
            { word: "JATAYU", desc: "Jatayu is the aged warrior‑bird whose final flight proves that even in weakness, a heart that risks everything for Sita and Rama attains liberation.", source: "https://saispeaks.sathyasai.org/discourse/search-sita" },
            { word: "SUGRIVA", desc: "Sugriva is the hesitant ally who, lifted by Rama’s compassion, turns from fear to courage and co‑operation.", source: "https://saispeaks.sathyasai.org/discourse/search-sita" },
            { word: "VIBHISHANA", desc: "Vibhishana is sattwa in the midst of darkness, the brother who walks out of Lanka to stand with Rama.", source: "https://sssbpt.info/ssspeaks/volume02/sss02-07.pdf" },
            { word: "RAVANA", desc: "Ravana is the genius ruined by greed, a mighty scholar‑devotee whose unchecked desire drags him into total destruction.", source: "https://www.saitunes.org/wp-content/uploads/pdf/sssspeaks/Ramakatha%20Rasa%20Vahini,%20Vol%201.pdf" },
            { word: "VISWAMITRA", desc: "Viswamitra is the tapasvi‑guru who calls young Rama out of Ayodhya’s comfort into the forest of trials.", source: "https://saispeaks.sathyasai.org/discourse/play-divine" },
            { word: "AYODHYA", desc: "Ayodhya is the city of “no conflict”, the inner kingdom where Rama‑like righteousness reigns.", source: "https://saispeaks.sathyasai.org/discourse/play-divine" },
            { word: "AHALYA", desc: "Ahalya is the stone‑like heart awakened; her redemption at Rama’s touch reveals that a single moment of contact with the Lord can dissolve error.", source: "https://www.saitunes.org/wp-content/uploads/pdf/sssspeaks/Ramakatha%20Rasa%20Vahini,%20Vol%201.pdf" }
        ]
    },
    {
        id: 9,
        title: "The Mahabharata",
        description: "Lessons from the Kurukshetra war and the Bhagavad Gita.",
        icon: "fa-bow-arrow",
        color: "bg-orange-500",
        theme: "linear-gradient(135deg, #f97316, #dc2626)",
        type: 'standard',
        passingScoreThreshold: 100,
        words: [
            { word: "KRISHNA", desc: "Krishna is the indwelling Lord, the heart of the Pandavas, the unseen source of their courage, wisdom, and victory.", source: "https://saispeaks.sathyasai.org/discourse/dharmakshetre-kurukshetre" },
            { word: "ARJUNA", desc: "Arjuna is the heroic seeker, the skilled warrior whose real greatness begins when he surrenders his confusion at Krishna’s feet.", source: "https://saispeaks.sathyasai.org/discourse/snippet/arjunas-faith-krishna" },
            { word: "KARNA", desc: "Karna is the radiant tragedy: a mighty warrior of immense charity whose outer brilliance is shadowed by attachment to adharma.", source: "" },
            { word: "DRAUPADI", desc: "DRAUPADI: Her helpless cry in the court becomes a direct call that draws Krishna’s protecting grace." },
            { word: "BHISHMA", desc: "Bhishma is the towering grandsire, a vow‑bound hero whose life teaches the danger of loyalty not aligned with dharma.", source: "https://saispeaks.sathyasai.org/discourse/dharmakshetre-kurukshetre" },
            { word: "DHARMARAJA", desc: "DHARMARAJA: The principle of dharma itself given human form." },
            { word: "BHIMA", desc: "BHIMA: Channeling physical strength in the service of dharma." },
            { word: "ABHIMANYU", desc: "ABHIMANYU: Youthful valour who enters the whirlpool of battle with fearless dedication." },
            { word: "GITA", desc: "The Bhagavad Gita is Krishna’s heart spoken aloud: a timeless manual of inner warfare.", source: "http://archive.sssmediacentre.org/journals/vol_09/01SEPT11/03-gita_01.htm" },
            { word: "KUNTI", desc: "KUNTI: The mother who asks for trials to keep her children close to Krishna." },
            { word: "KURUKSHETRA", desc: "Kurukshetra is the field of our own life where dharma and adharma clash.", source: "https://saispeaks.sathyasai.org/discourse/attention-world-prayer" },
            { word: "GANDIVA", desc: "GANDIVA: The God‑given strength to stand up for righteousness." }
        ]
    },
    {
        id: 10,
        title: "Spiritual IQ",
        description: "Deep dive into spiritual concepts of Sanathana Dharma",
        icon: "fa-brain",
        color: "bg-indigo-600",
        theme: "linear-gradient(135deg, #f59e0b, #d97706)",
        type: 'bonus',
        passingScoreThreshold: 300,
        words: [
            { word: "ATMAN", clue: "The immortal, scintillating spark of the Divine residing within...", desc: "ATMAN: The immortal, scintillating spark of the Divine residing within the heart of every being." },
            { word: "BRAHMAN", clue: "The formless, genderless, and infinite ocean of Reality...", desc: "BRAHMAN: The formless, genderless, and infinite ocean of Reality." },
            { word: "AVATAR", clue: "The miraculous descent of the Supreme Divinity into a visible form...", desc: "AVATAR: The miraculous descent of the Supreme Divinity into a visible form." },
            { word: "DHARMA", clue: "The eternal, cohesive force of righteousness that sustains the cosmos...", desc: "DHARMA: The eternal, cohesive force of righteousness." },
            { word: "GURU", clue: "The dispeller of darkness who serves as the living conduit of grace...", desc: "GURU: The dispeller of darkness." },
            { word: "KARMA", clue: "The universal law of cause and effect...", desc: "KARMA: The universal law of cause and effect." },
            { word: "MAYA", clue: "The mesmerizing power of the Divine that projects the illusion...", desc: "MAYA: The mesmerizing power of the Divine that projects the illusion." },
            { word: "MOKSHA", clue: "The ultimate spiritual triumph where the soul shatters the illusion...", desc: "MOKSHA: The ultimate spiritual triumph." },
            { word: "VEDA", clue: "The timeless wisdom of God revealed to ancient sages...", desc: "VEDA: The timeless wisdom of God." },
            { word: "YOGA", clue: "The spiritual discipline of 'yoking' the individual consciousness...", desc: "YOGA: The spiritual discipline of 'yoking'." },
            { word: "AHIMSA", clue: "The supreme virtue of non-violence...", desc: "AHIMSA: The supreme virtue of non-violence." },
            { word: "SAMSARA", clue: "The vast, cyclic ocean of birth, death, and rebirth...", desc: "SAMSARA: The vast, cyclic ocean of birth, death, and rebirth." },
            { word: "BRAHMACHARYA", clue: "The period of youth focused on acquiring education...", desc: "BRAHMACHARYA: The period of youth focused on acquiring education." },
            { word: "GRIHASTHA", clue: "The period after education, focused on family and worldly duties...", desc: "GRIHASTHA: The period after education." },
            { word: "VANAPRASTHA", clue: "The stage where one takes a 'back seat' from worldly affairs...", desc: "VANAPRASTHA: The stage where one takes a 'back seat' from worldly affairs." },
            { word: "SANNYASA", clue: "The stage focused entirely on Moksha, giving up personal family...", desc: "SANNYASA: The focus shifts entirely to Moksha." }
        ]
    },
    {
        id: 11,
        title: "Exemplars",
        description: "Great devotees and saints who demonstrated ideal devotion.",
        icon: "fa-star",
        color: "bg-violet-500",
        theme: "linear-gradient(135deg, #d946ef, #a21caf)",
        type: 'standard',
        passingScoreThreshold: 100,
        words: [
            { word: "PRAHLADA", desc: "The child whose unshakable remembrance of Narayana turns poison into grace." },
            { word: "DHRUVA", desc: "The boy who converted wounded pride into one‑pointed sadhana." },
            { word: "MIRA", desc: "The royal devotee who walked away from palace and poison, singing Krishna’s name." },
            { word: "RADHA", desc: "The very breath of Krishna‑consciousness, the inner longing of the soul." },
            { word: "SHABARI", desc: "Simple village devotion at its highest: patiently waiting for Rama." },
            { word: "VIDURA", desc: "The clear voice of conscience in a corrupt court." },
            { word: "KUCHELA", desc: "Poverty crowned by devotion, the friend who brings a tiny handful of beaten rice." },
            { word: "JESUS", desc: "The shining example of love, sacrifice, and forgiveness." },
            { word: "CHAITANYA", desc: "The flood of ecstatic nama‑smarana." },
            { word: "TYAGARAJA", desc: "Devotion set to melody, the saint‑composer who lived for Rama alone." },
            { word: "SHANKARA", desc: "The youthful monk who clarified the oneness of Atma and Brahman." },
            { word: "VIVEKANANDA", desc: "The lion‑voice of Vedanta, who carried India’s spiritual message across oceans." }
        ]
    },
    {
        id: 12,
        title: "Mind Matters",
        description: "Understand the glossary of Indian Psychological terms",
        icon: "fa-brain",
        color: "bg-teal-600",
        theme: "linear-gradient(135deg, #4f46e5, #3730a3)",
        type: 'standard',
        passingScoreThreshold: 100,
        words: [
            { word: "MANAS", desc: "The restless clerk of the inner office, running between the senses and the world." },
            { word: "BUDDHI", desc: "The royal judge seated above the noise of the mind." },
            { word: "AHAMKARA", desc: "The subtle thief that steals the Lord’s work and stamps it 'I, me, mine'." },
            { word: "CHITTA", desc: "The secret archive of the heart, storing every thought and wound." },
            { word: "VRITTI", desc: "The ripples on the lake of the mind." },
            { word: "VIKALPA", desc: "The mind’s cinema – imagination that can project shadows of fear." },
            { word: "SANKALPA", desc: "The seed‑resolve from which the whole mind‑tree grows." },
            { word: "MALA", desc: "The dust on the mirror of the mind – lust, anger, greed." },
            { word: "VIKSHEPA", desc: "The mind’s wild monkey‑jump, leaping from branch to branch." },
            { word: "AVARANA", desc: "The dark curtain drawn across the inner light." },
            { word: "RAGA", desc: "The sticky sweetness of attachment." },
            { word: "DVESHA", desc: "The inner recoil, the knot of hatred and aversion." },
            { word: "DOSHA", desc: "Currents of poison; Raga and Dvesha are the two main mental doshas." },
            { word: "TAMAS", desc: "The fog of inertia that pulls you into laziness and confusion." },
            { word: "RAJAS", desc: "The fever of constant doing, pushing you to run and compete." },
            { word: "SATTVA", desc: "The clear morning light within, where the mind becomes calm." }
        ]
    },
    {
        id: 13,
        title: "The 21 Omkar",
        description: "Understand why we recite 21 Omkars every dawn.",
        icon: "fa-heart",
        color: "bg-red-500",
        theme: "linear-gradient(135deg, #ef4444, #b91c1c)",
        type: 'standard',
        passingScoreThreshold: 100,
        gridSize: 20,
        words: [
            { word: "KARMENDRIYAS", desc: "Organs of action: speech, hands, feet, elimination, generation." },
            { word: "VOCAL", desc: "Vak: mouth of the heart; chant Om and speak truth." },
            { word: "HANDS", desc: "Hasta: God’s tool on loan – created to heal, help, and serve." },
            { word: "FEET", desc: "Pada: meant to walk only on dharmic paths." },
            { word: "ELIMINATION", desc: "Payu: teaches renunciation; discard toxic habits." },
            { word: "GENERATIVE", desc: "Upastha: sacred creative power; guarded by purity." },
            { word: "JNANENDRIYAS", desc: "Organs of perception: eye, ear, nose, tongue, skin." },
            { word: "EYE", desc: "Chakshus: trained by devotion, learns to see His form." },
            { word: "EAR", desc: "Shrotra: drinks bhajans and noble words." },
            { word: "NOSE", desc: "Ghraana: live in purity, where even the 'air' of thoughts is clean." },
            { word: "TONGUE", desc: "Jihva: must learn to taste the sweetness of the Name." },
            { word: "SKIN", desc: "Tvak: turns from craving sensation to offering healing contact." },
            { word: "PRANA", desc: "Vital air in the chest, the very rhythm of life." },
            { word: "APANA", desc: "Downward‑moving current that expels waste." },
            { word: "VYANA", desc: "All‑pervading current that circulates energy everywhere." },
            { word: "SAMANA", desc: "Digestive fire at the navel, equalising what you take in." },
            { word: "UDANA", desc: "Upward‑rising current that lifts speech and thought." },
            { word: "ANNAMAYA", desc: "Food‑sheath, the visible body woven from what you eat." },
            { word: "PRANAMAYA", desc: "Vital‑air sheath that makes the body vibrant." },
            { word: "MANOMAYA", desc: "Mind‑sheath of thoughts and feelings." },
            { word: "VIJNANAMAYA", desc: "Intellect‑sheath, the light of understanding." },
            { word: "ANANDAMAYA", desc: "Bliss‑sheath tasted in deep silence." },
            { word: "JAGRAT", desc: "Waking state (A); Viswa‑Self operates through Sthula Sharira." },
            { word: "SVAPNA", desc: "Dream state (U); Taijasa‑Self moves in Sukshma Sharira." },
            { word: "SUSHUPTI", desc: "Deep sleep state (M); Prajna‑Self rests in Karana Sharira." },
            { word: "TURIYA", desc: "The silent interval after Om; pure Awareness." },
            { word: "STHULA", desc: "Gross body, outer chariot made of food." },
            { word: "SUKSHMA", desc: "Subtle body of senses, pranas, mind and intellect." },
            { word: "KARANA", desc: "Causal body, the deep seed of ignorance." },
            { word: "PRANAVAYUS", desc: "Vital airs or five inner currents that keep the body-mind alive." }
        ]
    },
    {
        id: 14,
        title: "The 10 Principles",
        description: "The Ten Guiding Principles for a purposeful life.",
        icon: "fa-fire",
        color: "bg-orange-600",
        theme: "linear-gradient(135deg, #f97316, #ea580c)",
        type: 'bonus',
        passingScoreThreshold: 300,
        gridSize: 18,
        words: [
            { word: "LOVE", clue: "__W1___ and serve your country...", desc: "LOVE and serve your country." },
            { word: "SERVE", clue: "Love and __W2___ your country...", desc: "Love and SERVE your country." },
            { word: "HONOUR", clue: "__W3___ and respect all religions...", desc: "HONOUR and respect all religions." },
            { word: "RESPECT", clue: "Honour and __W4___ all religions...", desc: "Honour and RESPECT all religions." },
            { word: "DISTINCTION", clue: "Love all people without ___W5___...", desc: "Love all people without DISTINCTION." },
            { word: "HUMANITY", clue: "...know that ___W6___ is a single community.", desc: "...know that HUMANITY is a single community." },
            { word: "HOME", clue: "Keep your ___W7___ and its surroundings clean...", desc: "Keep your HOME and its surroundings clean." },
            { word: "SURROUNDINGS", clue: "Keep your home and its ___W8___ clean...", desc: "Keep your home and its SURROUNDINGS clean." },
            { word: "HEALTH", clue: "...this helps ensure ___W9___ and happiness...", desc: "...this helps ensure HEALTH and happiness." },
            { word: "HAPPINESS", clue: "...helps ensure health and ___W10___...", desc: "...helps ensure health and HAPPINESS." },
            { word: "NEEDY", clue: "Help the ___W11___ (especially the sick and aged)...", desc: "Help the NEEDY." },
            { word: "SELFRELIANT", clue: "...help them to become ___W12___.", desc: "...help them to become SELF-RELIANT." },
            { word: "HONESTY", clue: "Be examples of ___W13___...", desc: "Be examples of HONESTY." },
            { word: "CORRUPTION", clue: "Do not participate in any ___W14___...", desc: "Do not participate in any CORRUPTION." },
            { word: "JEALOUSY", clue: "Do not develop ___W15___, hatred or envy...", desc: "Do not develop JEALOUSY." },
            { word: "HATRED", clue: "Do not develop jealousy, ___W16___ or envy...", desc: "Do not develop HATRED." },
            { word: "ENVY", clue: "Do not develop jealousy, hatred or ___W17___...", desc: "Do not develop ENVY." },
            { word: "SERVANT", clue: "Become your own ___W18___ before serving others.", desc: "Become your own SERVANT." },
            { word: "GOD", clue: "Adore ___W19___, abhor sin.", desc: "Adore GOD." },
            { word: "SIN", clue: "Adore God, abhor ___W20___.", desc: "Abhor SIN." },
            { word: "LAWS", clue: "Observe the ___W21___, rules and regulations...", desc: "Observe the LAWS." },
            { word: "RULES", clue: "Observe the laws, ___W22___ and regulations...", desc: "Observe the RULES." },
            { word: "REGULATIONS", clue: "Observe the laws, rules and ___W23___...", desc: "Observe the REGULATIONS." },
            { word: "COUNTRY", clue: "...of your ___W24___...", desc: "...of your COUNTRY." },
            { word: "IDEAL", clue: "...and be an ___W25___ citizen.", desc: "...and be an IDEAL citizen." }
        ]
    }
];
