import React from 'react';
import { Link } from 'react-router-dom';
import {
    Heart, Users, BookOpen, Activity, Globe, Mail, Shield,
    Star, Target, Mic, Gamepad2, ArrowRight, Quote,
    CheckCircle, Sparkles, ScrollText, Trophy
} from 'lucide-react';
import { APP_CONFIG } from '../constants';

const AboutPage: React.FC = () => {
    const features = [
        {
            icon: <Mic size={22} />,
            title: 'Namasmarana',
            desc: 'Log your daily Gayathri, Sai Gayathri and Likitha Japa counts and contribute to the national collective offering.',
            link: '/namasmarana',
            accent: '#F97316',
            bgClass: 'bg-orange-50',
            textClass: 'text-orange-600',
        },
        {
            icon: <BookOpen size={22} />,
            title: 'Sai Lit Club',
            desc: 'A guided 52-week reading journey through Swami\'s divine discourses with weekly reflections and quizzes.',
            link: '/book-club',
            accent: '#9333EA',
            bgClass: 'bg-purple-50',
            textClass: 'text-purple-600',
        },
        {
            icon: <Activity size={22} />,
            title: 'Personal Dashboard',
            desc: 'Visualise your personal sadhana journey with streaks, milestones, badges, and national rankings.',
            link: '/dashboard',
            accent: '#3B82F6',
            bgClass: 'bg-blue-50',
            textClass: 'text-blue-600',
        },
        {
            icon: <Gamepad2 size={22} />,
            title: 'Sai SMS Games',
            desc: 'Engage the mind and awaken the heart through Quotescapes, Parikshya quizzes, Word Search and Sacred Crossword.',
            link: '/games',
            accent: '#D2AC47',
            bgClass: 'bg-amber-50',
            textClass: 'text-amber-700',
        },
        {
            icon: <ScrollText size={22} />,
            title: 'Sai Journal',
            desc: 'A private spiritual journal to capture your daily reflections, insights, and devotional thoughts.',
            link: '/journal',
            accent: '#14B8A6',
            bgClass: 'bg-teal-50',
            textClass: 'text-teal-600',
        },
        {
            icon: <Trophy size={22} />,
            title: 'Leaderboard',
            desc: 'See the national collective chant count grow in real time — centres, states and individual devotees united.',
            link: '/leaderboard',
            accent: '#16A34A',
            bgClass: 'bg-green-50',
            textClass: 'text-green-700',
        },
    ];

    const missionPoints = [
        {
            icon: <Target size={20} />,
            title: 'National Sadhana Mission',
            desc: 'Every Malaysian Sai Devotee embark in a journey of putting into practice some spiritual discipline in their words, thoughts and deeds',
        },
        {
            icon: <Users size={20} />,
            title: 'Community of Devotees',
            desc: 'Uniting members of Sai Centres across Malaysia in a single digital platform',
        },
        {
            icon: <Shield size={20} />,
            title: 'By SSIOM',
            desc: 'Built and maintained by the Spiritual Wing and the Malaysian Sai Young Adults of SSIOM 2026',
        },
    ];

    return (
        <div className="min-h-screen">

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section
                className="relative overflow-hidden py-28 px-4"
                style={{ background: 'linear-gradient(160deg, #FAF8F5 0%, #FDF6E8 40%, #F5F0FF 100%)' }}
            >
                {/* Subtle radial decoration */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-10 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #D2AC47 0%, transparent 70%)' }}
                />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    {/* Org subtitle */}
                    <p className="text-navy-600 font-semibold text-sm md:text-base mb-6 leading-relaxed">
                        Sathya Sai International Organisation of Malaysia<br />
                        <span className="font-bold">Spiritual Wing | MySAIYa 2026</span>
                    </p>

                    {/* Main heading */}
                    <h1 className="font-serif font-bold text-navy-900 leading-none mb-8"
                        style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)' }}>
                        About Sai SMS by SSIOM
                    </h1>

                    {/* Coloured description */}
                    <p className="text-navy-700 text-base md:text-lg font-medium leading-relaxed max-w-3xl mx-auto mb-10"
                        style={{ color: '#1E3A6E' }}>
                        Sai Sadhana Made Simple (Sai SMS) — a digital platform by the Sathya Sai International Organisation of Malaysia
                        crafted to support every Malaysian Sai devotee in their spiritual journey, collectively and individually
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/namasmarana"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-navy-800 hover:-translate-y-0.5 shadow-xl shadow-navy-900/20 transition-all"
                        >
                            Begin Your Sadhana <ArrowRight size={14} />
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-900 rounded-2xl font-black uppercase tracking-widest text-[11px] border-2 border-navy-100 hover:border-navy-300 hover:-translate-y-0.5 shadow-md transition-all"
                        >
                            <Mail size={14} /> Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── DIVIDER ─────────────────────────────────────────────────── */}
            <div className="h-px bg-gradient-to-r from-transparent via-navy-200 to-transparent" />

            {/* ── MISSION ─────────────────────────────────────────────────── */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Left */}
                        <div>
                            <div className="flex items-center gap-2 text-navy-500 mb-5">
                                <Heart size={15} />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Our Mission</span>
                            </div>
                            <h2 className="font-serif font-bold text-navy-900 text-3xl md:text-4xl leading-tight mb-6">
                                Digital Tools for the<br />Spiritual Journey
                            </h2>
                            <p className="text-navy-600 leading-relaxed mb-5 text-[15px]">
                                Sai SMS (Sai Sadhana Made Simple) is a digital platform by SSIOM
                                equipped with tools for tracking personal and collective spiritual
                                practices. Each feature empowers us to explore, learn, discuss,
                                share, and grow spiritually, drawing us closer to Sai.
                            </p>
                            <p className="text-navy-600 leading-relaxed text-[15px]">
                                The aim is to aspire for collective self-transformation and touch the
                                hearts of fellow Malaysians through our thoughts, words and deeds on
                                a daily basis.
                            </p>

                            <div className="mt-10 pt-8 border-t border-navy-50">
                                <p className="text-[10px] font-black uppercase tracking-widest text-navy-300 mb-4">Official Links</p>
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    {[
                                        { label: 'ssiomya.org', url: 'https://ssiomya.org' },
                                        { label: 'sathyasai.org', url: 'https://www.sathyasai.org' },
                                        { label: 'ssiomalaysia.org.my', url: 'https://ssiomalaysia.org.my' },
                                    ].map(l => (
                                        <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                                            className="text-sm font-bold text-navy-600 hover:text-gold-600 underline decoration-dotted transition-colors">
                                            {l.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right — Mission Points */}
                        <div className="space-y-8">
                            {missionPoints.map((item, i) => (
                                <div key={i} className="flex items-start gap-5 group">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                        style={{ background: 'rgba(210,172,71,0.12)', color: '#B8941F' }}
                                    >
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-bold text-navy-900 text-sm mb-1">{item.title}</p>
                                        <p className="text-navy-500 text-[13px] leading-relaxed"
                                            style={{ color: '#3B62A3' }}>
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Contact strip */}
                            <div className="mt-10 pt-8 border-t border-navy-50">
                                <p className="text-[10px] font-black uppercase tracking-widest text-navy-300 mb-3">Contact Us</p>
                                <div className="text-[13px] text-navy-600 space-y-1">
                                    <p>Web: <a href="https://ssiomalaysia.org.my" target="_blank" rel="noopener noreferrer"
                                        className="font-semibold hover:text-gold-600 transition-colors">ssiomalaysia.org.my</a></p>
                                    <p>Office: <span className="font-semibold">+603 7499 3159</span></p>
                                    <p>WhatsApp: <span className="font-semibold">+012 666 3284</span></p>
                                    <p>Email: <a href="mailto:ssio.malaysia@gmail.com"
                                        className="font-semibold hover:text-gold-600 transition-colors">ssio.malaysia@gmail.com</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── WHAT SAI SMS OFFERS ─────────────────────────────────────── */}
            <section className="py-24 px-4" style={{ background: '#F9F7F4' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-gold-50 text-gold-700 px-5 py-2 rounded-full border border-gold-200 mb-5">
                            <Sparkles size={13} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Features</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 mb-4">What Sai SMS Offers</h2>
                        <p className="text-navy-500 max-w-xl mx-auto text-base font-medium">
                            A complete digital sadhana ecosystem — all in one place.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f) => (
                            <Link
                                key={f.title}
                                to={f.link}
                                className="group bg-white rounded-3xl p-8 border border-navy-50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 ${f.bgClass} ${f.textClass} rounded-2xl flex items-center justify-center mb-6`}>
                                    {f.icon}
                                </div>
                                <h3 className="font-bold text-navy-900 mb-2 group-hover:text-gold-600 transition-colors">{f.title}</h3>
                                <p className="text-sm text-navy-500 leading-relaxed">{f.desc}</p>
                                <div className={`mt-5 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${f.textClass} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                    Explore <ArrowRight size={12} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DIVINE QUOTE ────────────────────────────────────────────── */}
            <section className="py-24 px-4 bg-navy-900 relative overflow-hidden">
                <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: 'linear-gradient(90deg, #D2AC47, #FFD700, #bf0449)' }}
                />
                {/* SSIOM Logo */}
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center p-2 overflow-hidden">
                        <img
                            src={APP_CONFIG.LOGO}
                            alt="SSIOM Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gold-400 mb-6">
                        Sathya Sai International Organisation of Malaysia
                    </p>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">Sri Sathya Sai Baba</h2>

                    <div className="relative">
                        <Quote size={48} className="text-gold-400/20 mx-auto mb-4" />
                        <p className="text-white/80 text-lg md:text-xl leading-relaxed italic font-serif font-medium mb-6">
                            "There is only one religion, the religion of Love.
                            There is only one language, the language of the Heart."
                        </p>
                        <p className="text-gold-400 font-bold text-sm tracking-wide">
                            — Bhagawan Sri Sathya Sai Baba
                        </p>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/namasmarana"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-gradient text-navy-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all"
                        >
                            Begin Your Sadhana
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all border border-white/10"
                        >
                            <Mail size={14} /> Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── CONTACT STRIP ──────────────────────────────────────────── */}
            <section className="py-8 px-4 bg-navy-50 text-center border-t border-navy-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-navy-400 mb-2">Contact Us</p>
                <p className="text-sm text-navy-600 font-medium">
                    Web: ssiomalaysia.org.my &nbsp;|&nbsp; Office: +603 7499 3159 &nbsp;|&nbsp; WhatsApp: +012 666 3284 &nbsp;|&nbsp; Email: ssio.malaysia@gmail.com
                </p>
            </section>
        </div>
    );
};

export default AboutPage;
