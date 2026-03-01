import React from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin, Globe, Phone, MessageCircle, Mail,
    Youtube, Facebook, Instagram, Music
} from 'lucide-react';
import { UserProfile, BrandingConfig, SiteContent } from '../types';
import { APP_CONFIG } from '../constants';

interface FooterProps {
    user: UserProfile | null;
    branding: BrandingConfig;
    siteContent: SiteContent;
}

// SVG Lotus icon using gold gradient
const LotusIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
        <defs>
            <linearGradient id="lotus-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C9A84C" />
                <stop offset="50%" stopColor="#F5D78E" />
                <stop offset="100%" stopColor="#C9A84C" />
            </linearGradient>
        </defs>
        <path fill="url(#lotus-gold)" d="M12 2C10.5 5.5 7 7 4 7c1 3.5 4 5.5 8 5.5S19 10.5 20 7c-3 0-6.5-1.5-8-5z" />
        <path fill="url(#lotus-gold)" d="M12 2C13.5 5.5 17 7 20 7c-1 3.5-4 5.5-8 5.5S5 10.5 4 7c3 0 6.5-1.5 8-5z" opacity="0.7" />
        <path fill="url(#lotus-gold)" d="M12 12.5C10 16 7 17.5 4 17c1.5 3 5 4 8 4s6.5-1 8-4c-3 .5-6-1-8-4.5z" />
        <path fill="url(#lotus-gold)" d="M12 12.5C14 16 17 17.5 20 17c-1.5 3-5 4-8 4s-6.5-1-8-4c3 .5 6-1 8-4.5z" opacity="0.7" />
        <ellipse cx="12" cy="21" rx="2" ry="1" fill="url(#lotus-gold)" opacity="0.5" />
    </svg>
);

const Footer: React.FC<FooterProps> = ({ user, branding, siteContent }) => {
    const isGuest = !user || user.isGuest;

    const quickLinks = [
        { label: 'Home', to: '/', disabled: false },
        { label: 'Sai SMS Dash', to: '/dashboard', disabled: isGuest },
        { label: 'Sai SMS Chants', to: '/namasmarana', disabled: false },
        { label: 'Sai SMS Book Club', to: '/book-club', disabled: false },
        { label: 'Sai SMS Events', to: '/calendar', disabled: false },
        { label: 'Sai SMS Games', to: '/games', disabled: false },
        { label: 'Sai SMS Briefcase', to: '/briefcase', disabled: isGuest },
        { label: 'Sai SMS Admin', to: '/admin', disabled: false },
    ];

    const legalLinks = [
        { label: 'Terms of Use', to: '/terms' },
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Cookie Policy', to: '/cookies' },
        { label: 'Copyright Notice', to: '/copyright' },
        { label: 'Community Guideline', to: '/community-guidelines' },
        { label: 'Content Submission Guideline', to: '/submission-guidelines' },
    ];

    return (
        <footer style={{ background: '#002e5b', color: 'white', borderTop: '4px solid #C9A84C', fontFamily: "'Poppins', sans-serif" }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 2rem' }}>

                {/* ═══ ROW 1: Three equal columns ═══ */}
                <div className="footer-row-1">

                    {/* Column 1: Brand Block */}
                    <div className="footer-col footer-col-brand">
                        <div style={{ marginBottom: '1.25rem' }}>
                            <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: 'white', padding: '2px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', display: 'inline-block', overflow: 'hidden' }}>
                                <img src={branding.logoFooter} alt="SSIOM Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                        </div>
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '2rem',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #C9A84C, #F5D78E, #C9A84C)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            lineHeight: 1.2,
                            marginBottom: '1rem',
                        }}>
                            {APP_CONFIG.NAME}
                        </h2>
                        <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                            {siteContent.footerAboutText}
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="footer-col footer-col-links">
                        <h4 className="footer-section-heading">Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {/* Home */}
                            <li>
                                <Link to="/" title="Go to the Sai SMS Home page" aria-label="Go to the Sai SMS Home page" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#F5D78E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>Home</Link>
                            </li>
                            {/* Sai SMS Dash — conditional tooltip based on auth */}
                            <li>
                                {isGuest ? (
                                    <span title="Sign in to access your Personal Sai SMS Dashboard" aria-label="Sign in to access your Personal Sai SMS Dashboard" aria-disabled="true" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.28)', cursor: 'not-allowed' }}>Sai SMS Dash</span>
                                ) : (
                                    <Link to="/dashboard" title="Go to your Personal Sai SMS Dashboard" aria-label="Go to your Personal Sai SMS Dashboard" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#F5D78E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>Sai SMS Dash</Link>
                                )}
                            </li>
                            {/* Sai SMS Chants */}
                            <li>
                                <Link to="/namasmarana" title="Submit your daily Mantra Count and Likitha Japam" aria-label="Submit your daily Mantra Count and Likitha Japam" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#F5D78E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>Sai SMS Chants</Link>
                            </li>
                            {/* Sai SMS Book Club */}
                            <li>
                                <Link to="/book-club" title="Explore our curated Sai SMS reading community" aria-label="Explore our curated Sai SMS reading community" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#F5D78E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>Sai SMS Book Club</Link>
                            </li>
                            {/* Sai SMS Events */}
                            <li>
                                <Link to="/calendar" title="Browse upcoming SSIOM spiritual events" aria-label="Browse upcoming SSIOM spiritual events" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#F5D78E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>Sai SMS Events</Link>
                            </li>
                            {/* Sai SMS Games */}
                            <li>
                                <Link to="/games" title="Explore spiritually enriching games and quizzes" aria-label="Explore spiritually enriching games and quizzes" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#F5D78E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>Sai SMS Games</Link>
                            </li>
                            {/* Sai SMS Briefcase — conditional tooltip based on auth */}
                            <li>
                                {isGuest ? (
                                    <span title="Sign in to access your personal Sai SMS Briefcase" aria-label="Sign in to access your personal Sai SMS Briefcase" aria-disabled="true" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.28)', cursor: 'not-allowed' }}>Sai SMS Briefcase</span>
                                ) : (
                                    <Link to="/briefcase" title="Go to your personal Sai SMS Briefcase" aria-label="Go to your personal Sai SMS Briefcase" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#F5D78E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>Sai SMS Briefcase</Link>
                                )}
                            </li>
                            {/* Sai SMS Admin */}
                            <li>
                                <Link to="/admin" title="Access the Sai SMS Admin Dashboard" aria-label="Access the Sai SMS Admin Dashboard" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#F5D78E')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>Sai SMS Admin</Link>
                            </li>
                        </ul>

                        {/* CTA Buttons — only for guests */}
                        {isGuest && (
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                                <Link
                                    to="/signup"
                                    title="Create your free Sai SMS account"
                                    aria-label="Create your free Sai SMS account"
                                    style={{
                                        padding: '0.5rem 1.25rem',
                                        background: 'linear-gradient(135deg, #C9A84C, #F5D78E, #C9A84C)',
                                        color: '#0a1628',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        borderRadius: '999px',
                                        textDecoration: 'none',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        lineHeight: 1,
                                        transition: 'opacity 0.2s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                                >
                                    Sign Up
                                </Link>
                                <Link
                                    to="/signin"
                                    title="Sign in to your existing Sai SMS account"
                                    aria-label="Sign in to your existing Sai SMS account"
                                    style={{
                                        padding: '0.5rem 1.25rem',
                                        background: 'transparent',
                                        color: '#F5D78E',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        borderRadius: '999px',
                                        textDecoration: 'none',
                                        border: '1.5px solid #C9A84C',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        lineHeight: 1,
                                        transition: 'background 0.2s, color 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.15)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Column 3: Contact + Social */}
                    <div className="footer-col footer-col-contact">
                        <h4 className="footer-section-heading">Contact SSIOM</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                    <MapPin size={17} className="footer-icon" style={{ flexShrink: 0 }} />
                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=Unit+B-3-20+Pusat+Perdagangan+Sek+8+Jalan+Sg+Jernih+8%2F1+46050+Petaling+Jaya+Selangor+Malaysia"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Click to view our location on Google Map"
                                        aria-label="Click to view our location on Google Map"
                                        style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white', textDecoration: 'none', transition: 'text-decoration 0.2s' }}
                                        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                                        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                                    >
                                        Pertubuhan Sathya Sai Malaysia [PPM-001-14-10081983]
                                    </a>
                                </div>
                            </li>
                            {/* Website + Phone on the same row */}
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                <a href="https://ssiomalaysia.org.my/Home" target="_blank" rel="noopener noreferrer" title="Visit the official SSIOM website" aria-label="Visit the official SSIOM website" className="footer-contact-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                    <Globe size={17} className="footer-icon" style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>ssiomalaysia.org.my</span>
                                </a>
                                <a href="tel:+60374993159" title="Click to call SSIOM office" aria-label="Click to call SSIOM office" className="footer-contact-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                    <Phone size={17} className="footer-icon" style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>+603-7499 3159</span>
                                </a>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <a href="https://wa.me/60126663284?text=OmSaiRam" target="_blank" rel="noopener noreferrer" title="Click to open WhatsApp chat with SSIOM" aria-label="Click to open WhatsApp chat with SSIOM" className="footer-contact-link" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
                                    <MessageCircle size={17} className="footer-icon" style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>+6012-666 3284 [WhatsApp]</span>
                                </a>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <a href="mailto:ssio.malaysia@gmail.com" title="Click to send an email to SSIOM" aria-label="Click to send an email to SSIOM" className="footer-contact-link" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
                                    <Mail size={17} className="footer-icon" style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>ssio.malaysia@gmail.com</span>
                                </a>
                            </li>
                        </ul>

                        {/* Social Icons — separated from contact list with generous top margin */}
                        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', marginTop: '1.375rem', justifyContent: 'flex-start' }}>
                            {[
                                { href: 'https://youtube.com/@SSIOMalaysia?si=64l_t-JtzwjWlWZb', icon: <Youtube size={18} />, label: 'YouTube', tooltip: 'Watch SSIOM on YouTube' },
                                { href: 'https://www.facebook.com/SaiCouncil', icon: <Facebook size={18} />, label: 'Facebook', tooltip: 'Follow SSIOM on Facebook' },
                                { href: 'https://www.instagram.com/ssiomalaysia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', icon: <Instagram size={18} />, label: 'Instagram', tooltip: 'Follow SSIOM Instagram' },
                                { href: 'https://on.soundcloud.com/VWhWv', icon: <Music size={18} />, label: 'SoundCloud', tooltip: 'Listen to SSIOM SoundCloud' },
                            ].map(({ href, icon, label, tooltip }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={tooltip}
                                    aria-label={tooltip}
                                    style={{
                                        width: '2.25rem', height: '2.25rem',
                                        borderRadius: '50%',
                                        border: '1.5px solid rgba(201,168,76,0.35)',
                                        background: 'rgba(255,255,255,0.04)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'rgba(255,255,255,0.55)',
                                        transition: 'all 0.25s',
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #C9A84C, #F5D78E)';
                                        (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                                        (e.currentTarget as HTMLElement).style.color = '#0a1628';
                                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.35)';
                                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
                                        (e.currentTarget as HTMLElement).style.transform = 'none';
                                    }}
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider between Row 1 and Row 2 */}
                <div style={{ borderTop: '1px solid rgba(201,168,76,0.18)', margin: '2.5rem 0 1.75rem' }} />

                {/* ═══ ROW 2: Copyright + Legal Links — stacked vertically, left aligned ═══ */}
                <div className="footer-row2-bar">
                    <p title="Om Sri Sai Ram" style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', margin: 0, whiteSpace: 'nowrap' }}>
                        © {new Date().getFullYear()} SSIOM Malaysia. All Rights Reserved.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.35rem 0.45rem' }}>
                        {legalLinks.map((link, i) => (
                            <React.Fragment key={link.to}>
                                <Link
                                    to={link.to}
                                    title={`Read our ${link.label}`}
                                    aria-label={`Read our ${link.label}`}
                                    style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.2s', flexShrink: 0 }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#F5D78E')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                                >
                                    {link.label}
                                </Link>
                                {i < legalLinks.length - 1 && (
                                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', flexShrink: 0 }}>|</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Divider between Row 2 and Row 3 */}
                <div style={{ borderTop: '1px solid rgba(201,168,76,0.18)', margin: '1.75rem 0 1.5rem' }} />

                {/* ═══ ROW 3: Full-width Dedication Statement ═══ */}
                <div style={{ textAlign: 'center' }}>
                    <p title="Om Sri Sai Ram" aria-label="Om Sri Sai Ram" style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                        <span title="Om Sri Sai Ram" aria-label="Om Sri Sai Ram"><LotusIcon size={18} /></span>
                        <span>Offered with Love and Gratitude to the Divine Lotus Feet of Bhagawan Sri Sathya Sai Baba.</span>
                        <span title="Om Sri Sai Ram" aria-label="Om Sri Sai Ram"><LotusIcon size={18} /></span>
                    </p>
                </div>

            </div>

            {/* ── Embedded responsive CSS ── */}
            <style>{`
        .footer-row-1 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 3rem;
          align-items: stretch;
        }
        .footer-row-2 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .footer-col-links, .footer-col-contact {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .footer-col-links {
          text-align: left;
          align-items: flex-start;
        }
        .footer-col-links ul {
          align-items: flex-start;
        }
        .footer-col-contact {
          text-align: left;
          align-items: flex-start;
        }
        .footer-col-contact ul {
          align-items: flex-start;
        }
        .footer-row2-copy  { flex: 2; min-width: 200px; }
        .footer-row2-legal { flex: 1; min-width: 200px; }
        .footer-row2-bar {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .footer-section-heading {
          font-family: 'Poppins', sans-serif !important;
          font-size: 0.75rem !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          background: linear-gradient(135deg, #C9A84C, #F5D78E, #C9A84C) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
          margin: 0 0 1.25rem 0 !important;
          display: inline-block !important;
        }
        .footer-icon {
          color: #C9A84C;
          transition: color 0.2s;
        }
        /* Keyboard focus ring for accessibility */
        .footer-col a:focus-visible,
        .footer-row2-bar a:focus-visible {
          outline: 2px solid #F5D78E;
          outline-offset: 3px;
          border-radius: 3px;
        }
        .footer-contact-link:hover .footer-icon,
        .footer-contact-link:hover span {
          color: #F5D78E !important;
        }

        /* Tablet */
        @media (max-width: 1023px) {
          .footer-row-1 {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            align-items: flex-start;
          }
          .footer-col-brand {
            grid-column: 1 / -1;
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .footer-row-1 {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .footer-col-links, .footer-col-contact {
            text-align: left;
            align-items: flex-start;
          }
          .footer-col-contact ul, .footer-col-contact li, .footer-col-contact div {
            justify-content: flex-start;
            align-items: flex-start;
          }
          .footer-row2-bar {
            gap: 0.75rem;
          }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
