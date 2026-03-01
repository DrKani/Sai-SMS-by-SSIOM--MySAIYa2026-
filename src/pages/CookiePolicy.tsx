import React from 'react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="page-wrapper bg-white py-16 px-4">
      <style>{`
        .page-wrapper { font-family: 'Poppins', sans-serif; line-height: 1.8; color: #102A43; }
        .policy-container { max-width: 900px; margin: 0 auto; }
        .policy-container h1 { color: #002e5b; font-family: 'Playfair Display', serif; font-size: 2.5rem; text-align: center; margin-bottom: 10px; font-weight: bold; }
        .effective-date { text-align: center; color: #7a2582; font-weight: 600; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.85rem; }
        .salutation { margin-bottom: 10px; text-align: center; font-weight: 600; font-size: 1.1rem; }
        .dedication { text-align: center; font-style: italic; margin-bottom: 40px; color: #334E68; padding: 0 20px; font-size: 0.95rem; }
        .section-title { color: #002e5b; font-family: 'Playfair Display', serif; font-size: 1.75rem; margin-top: 40px; margin-bottom: 15px; font-weight: bold; border-bottom: 2px solid #D2AC47; display: inline-block; padding-bottom: 5px; }
        .sub-title { color: #102A43; font-weight: bold; margin-top: 25px; margin-bottom: 10px; font-size: 1.1rem; }
        .section-content { margin-bottom: 30px; }
        .box-highlight { background: #F0F4F8; padding: 30px; border-radius: 1.5rem; margin-bottom: 25px; border-left: 5px solid #002e5b; }
        .restriction-box { background: #FFF9E6; border: 2px solid #F7EF8A; padding: 30px; border-radius: 1.5rem; margin: 40px 0; }
        ul { padding-left: 20px; list-style-type: disc; margin-bottom: 25px; }
        li { margin-bottom: 12px; }
        .contact-card { background: #102A43; color: #fff; padding: 40px; border-radius: 2rem; margin-top: 60px; }
        .contact-card h3 { color: #D2AC47; margin-bottom: 20px; font-family: 'Playfair Display', serif; font-size: 1.5rem; border-bottom: 1px solid rgba(210,172,71,0.3); padding-bottom: 10px; }
      `}</style>

      <div className="policy-container">
        <h1>Sai SMS by SSIOM — Cookie Policy</h1>
        <div className="effective-date">EFFECTIVE DATE (LAST REVISED DATE): 27TH JANUARY 2026</div>

        <div className="salutation">Om Sai Ram.</div>
        <div className="dedication">
          At the outset, we offer our loving salutations and the "Sai SMS-Sadhana Made Simple" platform at the Divine Lotus Feet of Bhagawan Sri Sathya Sai Baba.
        </div>

        <div className="section-content">
          This page sets out the <strong>Cookie Policy</strong> governing the use of the Sathya Sai International Organisation of Malaysia’s (SSIOM) Sai SMS – Sadhana Made Simple online platform, a web application created and managed by the National Young Adult Wing and the Spiritual Wing of SSIOM specifically to empower the spiritual practice of members of SSIOM. The details and terms in this document constitute a legally binding agreement between visitors, guests, non-registered and registered users of the Sai SMS – Sadhana Made Simple platform or any other media form, media channel, mobile website, or mobile application related to SSIOM (collectively referred to as the “Site”), and extend to actions taken personally or on behalf of an entity (primarily referenced as “you” within this page).
        </div>

        <div className="box-highlight">
          <h3 className="font-bold text-navy-900 mb-2 uppercase text-xs tracking-widest">SSIOM</h3>
          <p className="text-sm">
            The Sathya Sai International Organisation of Malaysia (SSIOM) is a Malaysian non-profit organisation listed under the Societies Act 1966, with licence number PPM-001-14-10081983, and has been established and registered with the Registrar of Societies Malaysia (ROS) since October 1983. As a multifaceted spiritual movement with service as its core practice, SSIOM provides the platform for its multicultural, multi-religious and multiracial members to put into practice the inspiring teachings of one of the world's revered spiritual teachers, Bhagawan Sri Sathya Sai Baba through its vibrant mosaic of social welfare, humanitarian, traditional, devotional, youth development, philosophical, community improvements, educational outreach, cultural nourishment, and nation-building endeavours aimed for elevating the collective consciousness of the society.
          </p>
        </div>

        <div className="box-highlight">
          <h3 className="font-bold text-navy-900 mb-2 uppercase text-xs tracking-widest">SAI SMS-SADHANA MADE SIMPLE</h3>
          <p className="text-sm">
            The Sai SMS-Sadhana Made Simple digital hub is an online platform created by the Sathya Sai International Organisation of Malaysia (SSIOM) to support and nurture Malaysian Sai devotees on their spiritual journeys. It provides a space for exploration, learning, discussion, sharing, and spiritual growth. Staying true to its mission and values, the platform adheres to a non-solicitation and non-proselytising universal approach.
          </p>
        </div>

        <div className="restriction-box">
          <h3 className="font-black text-[0.7rem] uppercase tracking-widest text-amber-800 mb-3">ACCESS RESTRICTION (MALAYSIAN LAW)</h3>
          <p className="text-sm leading-relaxed text-amber-900">
            Please note that, in compliance with Article 11(4) of the Federal Constitution of Malaysia and relevant state enactments (such as Sections 5 and 6 of the Non-Islamic Religions (Control of Propagation Among Muslims) Enactment), registration to site membership and full engagement (e.g., commenting, user profiles) on this platform are limited exclusively to non-Muslim Malaysians. Muslim brothers and sisters interested in joining a spiritual community are respectfully encouraged to participate in activities within Islamic organisations and institutions across Malaysia. However, our community services, societal commitments, and general non-religious initiatives are available to all individuals, regardless of their religious beliefs, ethnicity, gender, or age.
          </p>
        </div>

        <h2 className="section-title">1. Introduction</h2>
        <div className="section-content">
          <p>This Cookie Policy explains how Sai SMS by SSIOM uses cookies and similar technologies on the Sai SMS – Sadhana Made Simple web application (“the Site”). By continuing to browse or use this Site, you agree to the placement and use of cookies as described in this policy.</p>
        </div>

        <h2 className="section-title">2. What Are Cookies?</h2>
        <div className="section-content">
          <p>Cookies are small text files stored on your device when you visit a website or web app. They help the Site function effectively, remember your preferences, and improve your overall experience. Cookies do not give us access to your device or any information you have not voluntarily shared.</p>
        </div>

        <h2 className="section-title">3. Types of Cookies We Use</h2>
        <div className="section-content">
          <h3 className="sub-title">a. Essential Cookies (Strictly Necessary)</h3>
          <p>These enable the core functionality of the Site, such as:</p>
          <ul>
            <li>Loading pages correctly</li>
            <li>Maintaining session information</li>
            <li>Enabling secure login and authentication</li>
            <li>Ensuring that chanting trackers, dashboards, book club views, and forms function smoothly</li>
          </ul>
          <p>Without these cookies, the Site cannot operate properly.</p>

          <h3 className="sub-title">b. Performance & Analytics Cookies</h3>
          <p>These help us understand how users interact with the Site so we can keep improving it. We may use services such as Google Analytics or Firebase Analytics to collect anonymised data such as:</p>
          <ul>
            <li>Page views and screen views</li>
            <li>Time spent on pages</li>
            <li>Device/browser type</li>
            <li>Navigation patterns and general usage trends</li>
          </ul>
          <p>No personally identifiable information is stored in these analytics cookies.</p>

          <h3 className="sub-title">c. Functionality Cookies</h3>
          <p>These remember your preferences and enhance convenience, for example:</p>
          <ul>
            <li>Language or region settings</li>
            <li>Saved display or interface preferences</li>
            <li>Remembering that you are logged in on a device</li>
          </ul>

          <h3 className="sub-title">d. Third-Party Cookies</h3>
          <p>Our Site may embed or integrate services from third parties, such as:</p>
          <ul>
            <li>YouTube (for devotional videos and bhajans)</li>
            <li>Google login authentication (OAuth)</li>
            <li>Social media links and sharing widgets</li>
          </ul>
          <p>These external services may set their own cookies. We do not control third-party cookies, and you are encouraged to review their respective cookie and privacy policies.</p>
        </div>

        <h2 className="section-title">4. Why We Use Cookies</h2>
        <div className="section-content">
          <p>Sai SMS – Sadhana Made Simple uses cookies to:</p>
          <ul>
            <li>Ensure the Site functions reliably and securely</li>
            <li>Improve loading speed and responsiveness</li>
            <li>Personalise your experience (e.g., remembering your login on a trusted device)</li>
            <li>Enable secure login and account features</li>
            <li>Analyse usage patterns and identify which modules (Namasmarana, Likitha Japam, Book Club, etc.) are most used</li>
            <li>Support interactive features such as trackers, quizzes, dashboards, and user reflections</li>
          </ul>
        </div>

        <h2 className="section-title">5. How You Can Manage Cookies</h2>
        <div className="section-content">
          <p className="mb-4">You have control over your cookie preferences. You may:</p>
          <ul>
            <li>Adjust your web browser settings to block or delete cookies</li>
            <li>Use any in-Site “Manage Cookie Settings” controls (if enabled)</li>
            <li>Opt out of non-essential cookies where such options are provided</li>
          </ul>
          <p className="mb-4 font-bold">Please note:</p>
          <p className="mb-4">Blocking or deleting essential cookies may cause parts of the Site to malfunction, especially:</p>
          <ul>
            <li>Login and session functions</li>
            <li>Namasmarana and Likitha Japam trackers</li>
            <li>Personal sadhana dashboards</li>
            <li>Book Club reading and progress logging</li>
            <li>General page rendering and navigation</li>
          </ul>
        </div>

        <h2 className="section-title">6. Changes to This Policy</h2>
        <div className="section-content">
          <p>We may update this Cookie Policy periodically. The “Effective Date” at the top of this page reflects the latest revision. We encourage you to review this page from time to time. Continued use of the Site after such changes signifies acceptance.</p>
        </div>

        <div className="contact-card">
          <h3>Contact Us</h3>
          <div className="space-y-4 text-sm">
            <p>For any questions about usage beyond what is described here, please contact us at:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p><strong>Organisation:</strong> Sathya Sai International Organisation of Malaysia (SSIOM)/ Pertubuhan Sathya Sai Malaysia (PPM-001-14-10081983)</p>
                <p><strong>Email:</strong> ssio.malaysia@gmail.com</p>
                <p><strong>Person in charge:</strong> SSIOM Vice President, Spiritual</p>
              </div>
              <div>
                <p><strong>Address:</strong> B3-20, Pusat Perdagangan Seksyen 8, Jalan Sungai Jernih 8/1, 46050 Petaling Jaya, Selangor</p>
                <p><strong>Phone:</strong> +603-7499 3159, Whatsapp: +6012 666 3284</p>
                <p><strong>Website:</strong> ssiomalaysia.org.my</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 italic text-navy-900 font-bold">Om Sai Ram.</div>
      </div>
    </div>
  );
};

export default CookiePolicy;