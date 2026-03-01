export interface Quote {
    id: string;
    text: string;
    wordBank?: string[]; // For shared word bank
    decoys?: string[];   // For shared word bank
    missing?: string;    // For missing word levels (comma separated for multi)
    options?: string[];  // For MCQ
    emoji?: string[];    // For Emoji decipher
    sequence?: string[]; // For sequencing
    sequenceCorrect?: string[]; // For sequencing
    insight?: string;    // Insight/Explanation for Result Modal
    mechanic?: GameMechanic; // For mixed levels
}

export type GameMechanic =
    | 'unscramble'
    | 'unscramble_timed'
    | 'unscramble_sprint'
    | 'missing_word_mcq'
    | 'missing_word_bank'
    | 'missing_word_multi'
    | 'missing_word_typed'
    | 'missing_word_typed_sprint'
    | 'emoji_decipher'
    | 'rapid_fire'
    | 'sequencing'; // Added for L10

export interface QuoteLevelConfig {
    id: number;
    title: string;
    description: string;
    mechanic: GameMechanic;
    quotes: Quote[];
    timeLimit?: number; // Seconds per quote or total for sprint
    passingScore?: number; // If applicable
    unlockThreshold: number; // Number of quotes to solve/score to unlock next
    specialButton?: {
        label: string;
        cost: number;
        limitPerQuote?: number;
        limitPerLevel?: number;
        action: 'hint_first' | 'hint_last' | 'pause' | '50_50' | 'remove_decoy' | 'auto_fill' | 'reveal_letter';
    };
    levelIcon?: string; // Optional custom icon class (FontAwesome)
    meta?: { // Extra config for specific levels
        bankWords?: string[]; // For L5
        decoys?: string[];    // For L5
    };
}

export const QUOTES_POOL = [
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

export const QUOTE_LEVELS: QuoteLevelConfig[] = [
    {
        id: 1,
        title: "The Word Weaver",
        levelIcon: "fa-puzzle-piece",
        description: "Reconstruct quotes from shuffled word tiles. No timer, just practice.",
        mechanic: 'unscramble',
        unlockThreshold: 10,
        specialButton: {
            label: "Hint",
            cost: 10,
            limitPerQuote: 1,
            limitPerLevel: 3,
            action: 'hint_first'
        },
        quotes: [
            { id: "1-1", text: "Be good, see good and do good.", insight: "Goodness in thought, vision, and action is the triplet of spiritual life." },
            { id: "1-2", text: "Love All Serve All.", insight: "The core message of Swami's avataric mission." },
            { id: "1-3", text: "Help Ever Hurt Never.", insight: "A guideline for daily conduct in thought, word, and deed." },
            { id: "1-4", text: "Talk less, work more.", insight: "Silence conserves energy and improves concentration on duty." },
            { id: "1-5", text: "Work is worship. Duty is God.", insight: "Transform every act into an offering to the Divine." },
            { id: "1-6", text: "Be simple and sincere.", insight: "Simplicity and sincerity are the hallmarks of a true seeker." },
            { id: "1-7", text: "As you think, so you become.", insight: "Your thoughts shape your reality and character." },
            { id: "1-8", text: "Real happiness lies within you.", insight: "External objects only give fleeting pleasure; true joy is internal." },
            { id: "1-9", text: "Start early, Drive slowly, Reach safely.", insight: "A metaphor for the spiritual journey: start young, proceed with care, reach liberation." },
            { id: "1-10", text: "Example is better than Precept.", insight: "Living the teachings is more powerful than preaching them." }
        ]
    },
    {
        id: 2,
        title: "The Trial of Clarity",
        levelIcon: "fa-hourglass-half",
        description: "Reconstruct quotes against the clock. 90 seconds per quote.",
        mechanic: 'unscramble_timed',
        timeLimit: 90,
        unlockThreshold: 10,
        specialButton: {
            label: "Pause (+10s)",
            cost: 10,
            limitPerQuote: 1,
            limitPerLevel: 3,
            action: 'pause'
        },
        quotes: [
            { id: "2-1", text: "All is one; be alike to everyone.", insight: "Perceive the same Divinity residing in every being." },
            { id: "2-2", text: "Hands that serve are holier than lips that pray.", insight: "Practical service is often more valuable than mere vocal prayer." },
            { id: "2-3", text: "Service to Mankind is Service to God.", insight: "Serving others is the highest form of worship." },
            { id: "2-4", text: "Truth has no fear; Untruth shivers at every shadow.", insight: "Truth is bold and fearless; falsehood is always insecure." },
            { id: "2-5", text: "Unity is divinity; purity is enlightenment.", insight: "Unity leads to purity, which in turn reveals our Divine nature." },
            { id: "2-6", text: "Love seeks no reward; Love is its own reward.", insight: "True love is unconditional and expects nothing in return." },
            { id: "2-7", text: "Less luggage, more comfort makes travel a pleasure.", insight: "Reduce desires to make the journey of life more comfortable." },
            { id: "2-8", text: "Tell me your company, I shall tell you what you are!", insight: "The company you keep influences your character." },
            { id: "2-9", text: "God is the hero, rest are Zeros.", insight: "Without God (the 1), the world (the 0s) has no value." },
            { id: "2-10", text: "Discipline is the mark of intelligent living.", insight: "Discipline regulates life and channels energy towards higher goals." }
        ]
    },
    {
        id: 3,
        title: "The Sprint of Insight",
        levelIcon: "fa-bolt",
        description: "Solve as many quotes as possible in 2 minutes!",
        mechanic: 'unscramble_sprint',
        timeLimit: 120, // Total sprint time
        unlockThreshold: 1,
        specialButton: {
            label: "Hint",
            cost: 10,
            limitPerLevel: 3,
            action: 'hint_first'
        },
        quotes: [] // Will use pool
    },
    {
        id: 4,
        title: "The Missing Word Oracle",
        levelIcon: "fa-bullseye",
        description: "Choose the correct missing word.",
        mechanic: 'missing_word_mcq',
        timeLimit: 120,
        unlockThreshold: 10,
        specialButton: {
            label: "50:50",
            cost: 10,
            limitPerQuote: 1,
            limitPerLevel: 3,
            action: '50_50'
        },
        quotes: [
            { id: "4-1", text: "As you think, so you become.", missing: "think", options: ["think", "act", "believe", "see"], insight: "Thought is the seed of action and character." },
            { id: "4-2", text: "Talk less, work more.", missing: "more", options: ["more", "hard", "smart", "fast"], insight: "Action speaks louder than words." },
            { id: "4-3", text: "Work is worship. Duty is God.", missing: "worship", options: ["worship", "prayer", "life", "love"], insight: "Sanctify your daily work by dedicating it to God." },
            { id: "4-4", text: "Service to Mankind is Service to God.", missing: "God", options: ["God", "Nature", "Self", "Society"], insight: "Narayana Seva is the most effective Sadhana." },
            { id: "4-5", text: "Hands that serve are holier than lips that pray.", missing: "serve", options: ["serve", "help", "work", "give"], insight: "Selfless service is a direct path to the Divine." },
            { id: "4-6", text: "Help Ever Hurt Never.", missing: "Never", options: ["Never", "Always", "Sometimes", "Forever"], insight: "The fundamental axiom of non-violence." },
            { id: "4-7", text: "Truth has no fear; Untruth shivers at every shadow.", missing: "fear", options: ["fear", "doubt", "pain", "end"], insight: "Truth is invincible." },
            { id: "4-8", text: "Unity is divinity; purity is enlightenment.", missing: "divinity", options: ["divinity", "strength", "peace", "power"], insight: "Realize the Oneness of all." },
            { id: "4-9", text: "Real happiness lies within you.", missing: "within", options: ["within", "around", "above", "with"], insight: "Look inward for the source of Bliss." },
            { id: "4-10", text: "Be simple and sincere.", missing: "sincere", options: ["sincere", "honest", "kind", "true"], insight: "Simplicity is closeness to God." }
        ]
    },
    {
        id: 5,
        title: "The Sacred Word Bank",
        levelIcon: "fa-book",
        description: "10 Quotes, One Word Bank. Choose wisely.",
        mechanic: 'missing_word_bank',
        timeLimit: 60, // Per quote
        unlockThreshold: 10,
        specialButton: {
            label: "Eliminate Decoy",
            cost: 10,
            limitPerLevel: 2,
            action: 'remove_decoy'
        },
        meta: {
            bankWords: ["think", "more", "worship", "God", "serve", "never", "fear", "divinity", "within", "message"],
            decoys: ["wealth", "anger"]
        },
        quotes: [
            { id: "5-1", text: "As you think, so you become.", missing: "think", insight: "Thought power." },
            { id: "5-2", text: "Talk less, work more.", missing: "more", insight: "Karma Yoga." },
            { id: "5-3", text: "Work is worship. Duty is God.", missing: "worship", insight: "Consecrated action." },
            { id: "5-4", text: "Service to Mankind is Service to God.", missing: "God", insight: "Manava Seva is Madhava Seva." },
            { id: "5-5", text: "Hands that serve are holier than lips that pray.", missing: "serve", insight: "Hands of Janaka." },
            { id: "5-6", text: "Help Ever Hurt Never.", missing: "never", insight: "Ahimsa." },
            { id: "5-7", text: "Truth has no fear; Untruth shivers at every shadow.", missing: "fear", insight: "Satyameva Jayate." },
            { id: "5-8", text: "Unity is divinity; purity is enlightenment.", missing: "divinity", insight: "Adwaita Darshanam." },
            { id: "5-9", text: "Real happiness lies within you.", missing: "within", insight: "Atman." },
            { id: "5-10", text: "My Life is My Message.", missing: "message", insight: "His Life." }
        ]
    },
    {
        id: 6,
        title: "The Wisdom Mosaic",
        levelIcon: "fa-th-large",
        description: "Fill in multiple blanks per quote.",
        mechanic: 'missing_word_multi',
        timeLimit: 120,
        unlockThreshold: 5,
        specialButton: {
            label: "Auto-Fill One",
            cost: 10,
            limitPerQuote: 1,
            limitPerLevel: 3,
            action: 'auto_fill'
        },
        quotes: [
            { id: "6-1", text: "Love as thought is Truth, Love as action is Righteous Conduct, Love as feeling is Peace, Love as understanding is Non-Violence.", missing: "thought,action,feeling,understanding", insight: "The five human values extracted from Love." },
            { id: "6-2", text: "Love lives by giving and forgiving, selfishness lives by getting and forgetting.", missing: "giving,forgiving,getting,forgetting", insight: "The dynamic of Love vs Selfishness." },
            { id: "6-3", text: "Human heart is the lock. Mind is the key.", missing: "lock,key", insight: "Unlock your heart with your mind." },
            { id: "6-4", text: "Where there is unity, there shall be purity. Where there is purity, there is Divinity.", missing: "unity,purity,Divinity", insight: "The progression from Sangha to Dharma to Moksha." },
            { id: "6-5", text: "There is only one language, the language of the Heart. There is only one religion, the religion of Love.", missing: "language,Heart,religion,Love", insight: "Universal Oneness." }
        ]
    },
    {
        id: 7,
        title: "The Seeker’s Script",
        levelIcon: "fa-feather-alt",
        description: "Type the answer manually. Spelling counts!",
        mechanic: 'missing_word_typed',
        timeLimit: 90,
        unlockThreshold: 10,
        specialButton: {
            label: "Reveal Letter",
            cost: 10,
            limitPerQuote: 2,
            limitPerLevel: 6,
            action: 'reveal_letter'
        },
        quotes: [
            { id: "7-1", text: "As you think, so you become.", missing: "think", insight: "Mind is the master." },
            { id: "7-2", text: "Truth has no fear; Untruth shivers at every shadow.", missing: "fear", insight: "Truth is strength." },
            { id: "7-3", text: "Real happiness lies within you.", missing: "within", insight: "Inner peace." },
            { id: "7-4", text: "Be simple and sincere.", missing: "sincere", insight: "Virtues of a devotee." },
            { id: "7-5", text: "Help Ever Hurt Never.", missing: "never", insight: "Cardinal rule." },
            { id: "7-6", text: "Hands that serve are holier than lips that pray.", missing: "serve", insight: "Karma vs Bhakti." },
            { id: "7-7", text: "Work is worship. Duty is God.", missing: "worship", insight: "Dedication." },
            { id: "7-8", text: "Unity is divinity; purity is enlightenment.", missing: "divinity", insight: "Goal of life." },
            { id: "7-9", text: "Talk less, work more.", missing: "more", insight: "Efficiency." },
            { id: "7-10", text: "My Life is My Message.", missing: "message", insight: "Avatars standard." }
        ]
    },
    {
        id: 8,
        title: "The Rapid Recall",
        levelIcon: "fa-stopwatch",
        description: "Type as many missing words as you can in 2 minutes.",
        mechanic: 'missing_word_typed_sprint',
        timeLimit: 120,
        unlockThreshold: 1,
        quotes: [] // Pool
    },
    {
        id: 9,
        title: "The Symbol Seer",
        levelIcon: "fa-eye",
        description: "Guess the quote from emojis.",
        mechanic: 'emoji_decipher',
        timeLimit: 60,
        unlockThreshold: 10,
        specialButton: {
            label: "50:50",
            cost: 10,
            limitPerLevel: 3,
            action: '50_50'
        },
        quotes: [
            { id: "9-1", text: "Love All Serve All", emoji: ["❤️", "🌎", "🤝", "🌎"], options: ["Love All Serve All", "Help Ever Hurt Never", "Work is Worship", "Unity is Divinity"], insight: "Universal Love." },
            { id: "9-2", text: "Help Ever Hurt Never", emoji: ["🆘", "∞", "🚫", "🤕"], options: ["Help Ever Hurt Never", "Love All Serve All", "Talk Less Work More", "Be Good Do Good"], insight: "Compassion." },
            { id: "9-3", text: "Hands that serve are holier than lips that pray", emoji: ["👐", "🤝", "✨", "👄", "🙏"], options: ["Hands that serve are holier than lips that pray", "Work is Worship", "Service to Man is Service to God", "Duty is God"], insight: "Sanctity of Service." },
            { id: "9-4", text: "Work is worship. Duty is God", emoji: ["🔨", "🙏", "📋", "🕉️"], options: ["Work is worship. Duty is God", "Start Early Drive Slowly", "Less Luggage More Comfort", "Life is a Game"], insight: "Divinizing work." },
            { id: "9-5", text: "Start early, Drive slowly, Reach safely", emoji: ["🌅", "🚗", "🐢", "🏁", "✅"], options: ["Start early, Drive slowly, Reach safely", "Slow and Steady Wins", "Life is a Journey", "Less Luggage More Comfort"], insight: "Spiritual Journey." },
            { id: "9-6", text: "Shut your mind and open your heart", emoji: ["🔒", "🧠", "🔓", "❤️"], options: ["Shut your mind and open your heart", "Love All Serve All", "Follow the Heart", "Mind is a Monkey"], insight: "Heart over Head." },
            { id: "9-7", text: "Silence is the speech of the spiritual seeker", emoji: ["🤫", "🗣️", "🧘", "🔍"], options: ["Silence is the speech of the spiritual seeker", "Talk Less Work More", "Silence is Golden", "Peace begins with a smile"], insight: "Value of Silence." },
            { id: "9-8", text: "As you think, so you become", emoji: ["💭", "➡️", "🧑"], options: ["As you think, so you become", "You are what you eat", "Think Good Do Good", "Mind is Everything"], insight: "Power of Thought." },
            { id: "9-9", text: "Real happiness lies within you", emoji: ["😊", "📍", "🧘"], options: ["Real happiness lies within you", "Happiness is a choice", "Be Happy Always", "Love is God"], insight: "Inner Joy." },
            { id: "9-10", text: "Unity is divinity; purity is enlightenment", emoji: ["🤝", "✨", "💧", "💡"], options: ["Unity is divinity; purity is enlightenment", "Love is Unity", "Truth is God", "Purity is Power"], insight: "Path to Enlightenment." }
        ]
    },
    {
        id: 10,
        title: "The Quotescape Mastery",
        levelIcon: "fa-crown",
        description: "A mix of all challenges. Prove you are a Sai Quote Champion!",
        mechanic: 'rapid_fire',
        timeLimit: 60, // Per question
        unlockThreshold: 10,
        quotes: [
            { id: "10-1", text: "All is one; be alike to everyone.", mechanic: 'unscramble', insight: "Oneness." } as any,
            { id: "10-2", text: "Follow the master, face the devil, fight to the end, finish the game.", mechanic: 'unscramble', insight: "The GAME of life." } as any,
            { id: "10-3", text: "Truth has no fear; Untruth shivers at every shadow.", missing: "fear", options: ["fear", "doubt", "love", "light"], mechanic: 'missing_word_mcq', insight: "Fearlessness of Truth." } as any,
            { id: "10-4", text: "Hands that serve are holier than lips that pray.", missing: "serve", options: ["serve", "help", "work", "give"], mechanic: 'missing_word_mcq', insight: "Service." } as any,
            { id: "10-5", text: "Real happiness lies within you.", missing: "within", mechanic: 'missing_word_typed', insight: "Internal Bliss." } as any,
            { id: "10-6", text: "Be simple and sincere.", missing: "sincere", mechanic: 'missing_word_typed', insight: "Sincerity." } as any,
            { id: "10-7", text: "Love All Serve All", emoji: ["❤️", "🌎", "🤝", "🌎"], options: ["Love All Serve All", "Help Ever Hurt Never", "Work is Worship", "Unity is Divinity"], mechanic: 'emoji_decipher', insight: "The Motto." } as any,
            { id: "10-8", text: "Help Ever Hurt Never", emoji: ["🆘", "∞", "🚫", "🤕"], options: ["Help Ever Hurt Never", "Love All Serve All", "Talk Less Work More", "Be Good Do Good"], mechanic: 'emoji_decipher', insight: "The Practice." } as any,
            { id: "10-9", text: "Self-confidence > self-satisfaction > self-sacrifice > self-realization.", sequence: ["Self-confidence", "self-satisfaction", "self-sacrifice", "self-realization"], sequenceCorrect: ["Self-confidence", "self-satisfaction", "self-sacrifice", "self-realization"], mechanic: 'sequencing', insight: "The 4 S's of Sadhana." } as any,
            { id: "10-10", text: "Righteousness in heart > beauty in character > harmony at home > order in society > unity in nation > peace in world.", sequence: ["Righteousness in heart", "beauty in character", "harmony at home", "order in society", "unity in nation", "peace in world"], sequenceCorrect: ["Righteousness in heart", "beauty in character", "harmony at home", "order in society", "unity in nation", "peace in world"], mechanic: 'sequencing', insight: "Peace Recipe." } as any
        ]
    }
];
