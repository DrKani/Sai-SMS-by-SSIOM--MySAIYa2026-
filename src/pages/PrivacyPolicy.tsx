import React from 'react';

const PrivacyPolicy: React.FC = () => {
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
        <h1>Sai SMS by SSIOM — Privacy Policy</h1>
        <div className="effective-date">EFFECTIVE DATE (LAST REVISED DATE): 27TH JANUARY 2026</div>

        <div className="salutation">Om Sai Ram.</div>
        <div className="dedication">
          At the outset, we offer our loving salutations and the "Sai SMS-Sadhana Made Simple" platform at the Divine Lotus Feet of Bhagawan Sri Sathya Sai Baba.
        </div>

        <div className="section-content">
          This page sets out the <strong>Privacy Policy</strong> governing the use of the Sathya Sai International Organisation of Malaysia’s (SSIOM) Sai SMS- Sadhana Made Simple online platform, a web application created and managed by the National Young Adult Wing and the Spiritual Wing of SSIOM, specifically for empowering the spiritual practice of members of SSIOM. The details and terms in this document applies to constitute a legally binding agreement agreed by the visitors, guests, non registered and registered users linked to, or otherwise associated with Sai SMS-Sadhana Made Simple or any other media form, media channel, mobile website, or mobile application related to SSIOM (collectively referred to herein as the "site"), and extends to actions taken personally or on behalf of an entity (primarily referenced as “you” within this page).
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
          <p>This Privacy Policy explains how Sai SMS – Sadhana Made Simple, operated by the Sathya Sai International Organisation of Malaysia (SSIOM), collects, uses, stores, and protects your personal data when you use the Site.</p>
          <p className="mt-4">By accessing or using the Site, you agree to the practices described in this Privacy Policy, in line with Malaysian law, including the Personal Data Protection Act 2010 (PDPA).</p>
        </div>

        <h2 className="section-title">2. What Data We Collect</h2>
        <div className="section-content">
          <p>We may collect the following categories of data depending on your level of interaction.</p>

          <h3 className="sub-title">Data you provide directly:</h3>
          <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Age range and gender (where voluntarily submitted)</li>
            <li>Sai Centre affiliation (optional)</li>
            <li>Profile details (bio, avatar, interests)</li>
            <li>Quiz participation, event registration, submissions, or feedback</li>
            <li>Your chanting counts (Gayatri, Sri Sathya Sai Gayatri, “Om Sai Ram”)</li>
            <li>Your Book Club progress and voluntary reflections</li>
            <li>Your journal entries (where saved)</li>
            <li>Photos, videos, or testimonials you voluntarily upload</li>
            <li>Account login information (for Google login)</li>
          </ul>

          <h3 className="sub-title">Device & Usage Data (Automatically Collected):</h3>
          <ul>
            <li>IP address and general location (region/ country)</li>
            <li>Browser type, operating system, device type</li>
            <li>Language settings</li>
            <li>Access time and date</li>
            <li>Pages and screens visited</li>
            <li>Time and duration of sessions and Interactions with features (e.g., trackers, quizzes, book club, dashboards)</li>
            <li>Clickstream data</li>
            <li>Cookies and analytics identifiers</li>
          </ul>
        </div>

        <h2 className="section-title">3. How We Collect Your Data</h2>
        <div className="section-content">
          <p>This data may be collected through cookies, analytics tools (e.g., Google/Firebase Analytics), and standard server logs. Specifically, we collect your data through:</p>
          <ul>
            <li>Account creation (Google login)</li>
            <li>Website forms (feedback, submissions, blog contributions)</li>
            <li>Event registration forms</li>
            <li>Interactive features (quizzes, polls, reports)</li>
            <li>Cookies and analytics tools such as Google Analytics</li>
            <li>Voluntary uploads such as stories, photos, reflections, or articles</li>
          </ul>
          <p>No biometric or sensitive personal data is collected.</p>
        </div>

        <h2 className="section-title">4. Cookies and tracking technologies</h2>
        <div className="section-content">
          <p>The Site uses cookies to:</p>
          <ul>
            <li>Improve loading speed and user experience</li>
            <li>Remember your language or display preferences</li>
            <li>Enable analytics via Google Analytics or similar tools</li>
            <li>Enhance accessibility and navigation</li>
          </ul>
          <p>You may disable cookies in your browser settings, but certain features may not function optimally.</p>
        </div>

        <h2 className="section-title">5. How We Use Your Data</h2>
        <div className="section-content">
          <p>We use your data to:</p>
          <ul>
            <li>Provide and maintain the Sai SMS (Sadhana Made Simple) platform.</li>
            <li>Register and manage user accounts.</li>
            <li>Support core features such as Namasmarana trackers, Likitha Japam logging, personal sadhana dashboards, and Book Club reading and reflection.</li>
            <li>Improve user experience and site performance.</li>
            <li>Monitor aggregate participation statistics at the national and state levels.</li>
            <li>Communicate important updates, including announcements and the Book Club schedule.</li>
            <li>Maintain security and prevent misuse of the site.</li>
            <li>Offer personalised platform features.</li>
            <li>Manage user profiles and dashboards.</li>
            <li>Track quiz scores, badges, achievements, and contributions.</li>
            <li>Enable commenting, voting, and other interactive features.</li>
            <li>Support event sign-ups and volunteer participation.</li>
            <li>Enhance website functionality and user experience.</li>
            <li>Send important updates, newsletters, and announcements.</li>
            <li>Detect fraud, secure accounts, and maintain site integrity.</li>
            <li>Generate anonymised insights to enhance SSIOM programs.</li>
          </ul>
          <p>We do not sell your data or use it for commercial advertising.</p>
        </div>

        <h2 className="section-title">6. Legal Basis and Access Restriction</h2>
        <div className="section-content">
          <p>The platform is designed for non-Muslim Malaysians aged 18 and above who voluntarily register to participate in SSIOM’s spiritual and educational programmes.</p>
          <p className="mt-4">By using the Site, you consent to the collection and use of your data as described in this Privacy Policy, consistent with PDPA principles. We process data based on:</p>
          <ul>
            <li>Your consent (e.g., creating an account, submitting content)</li>
            <li>Legitimate interests (e.g., improving platform services, maintaining security)</li>
            <li>Performance of a service (e.g., providing interactive features)</li>
            <li>Compliance with Malaysian law where required</li>
          </ul>
          <p>You may withdraw your consent at any time.</p>
        </div>

        <h2 className="section-title">7. Data Storage and Security</h2>
        <div className="section-content">
          <p>We use trusted, industry-standard services such as Firebase (Google Cloud) for authentication, database (e.g., Firestore), and hosting. We take reasonable technical and organisational measures to protect your data against unauthorised access, accidental loss, or misuse. We implement technical and organisational security measures, including:</p>
          <ul>
            <li>Secure hosting with firewalls</li>
            <li>SSL-encrypted forms</li>
            <li>Role-based access to administrative areas</li>
            <li>Routine backups and integrity checks</li>
            <li>Account authentication via Google</li>
          </ul>
          <p className="mt-4">However, no online platform can guarantee perfect security. Please exercise caution when sharing sensitive data online. You are encouraged to use strong, unique passwords and log out on shared devices.</p>
          <p>Our Site may use hosting or digital tools that store data on servers located outside Malaysia. Where this occurs, we ensure that appropriate safeguards are in place to protect your information.</p>
        </div>

        <h2 className="section-title">8. Data Sharing and Third Parties</h2>
        <div className="section-content">
          <p>We do not sell or rent your personal data. We may share data internally within SSIOM for spiritual programme planning and reporting, and with trusted service providers (e.g., Google/Firebase) strictly for operational needs. We do not share your personal data with third parties for their independent marketing or commercial purposes. Aggregated, anonymised statistics may be shared in reports or communications.</p>
          <p className="mt-4">Your data may be shared only with:</p>
          <ul>
            <li>Authorised SSIOM administrators and volunteers</li>
            <li>IT service providers supporting the Site</li>
            <li>Third-party authentication providers (e.g., Google)</li>
            <li>Cloud hosting and analytics services</li>
            <li>Government authorities only when legally required</li>
          </ul>
          <p>All partners handling data are bound by confidentiality and data protection obligations.</p>
          <p>The Site may link to third-party websites (e.g., YouTube, event tools, forms). We are not responsible for their privacy practices or content. You are encouraged to review the policies of external sites before sharing your information.</p>
        </div>

        <h2 className="section-title">9. Your Rights</h2>
        <div className="section-content">
          <p>Subject to PDPA and applicable law, you may request to access, correct, or request deletion of the personal data we hold about you. You have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate or outdated information</li>
            <li>Withdraw consent for optional data usage</li>
            <li>Request deletion (where not restricted by legal/operational needs)</li>
            <li>Request information on how your data is processed</li>
            <li>Lodge a complaint with Malaysian data protection authorities</li>
          </ul>
          <p>To exercise your rights, please contact SSIOM via the contact details provided below or email info@ssiomya.com.</p>
        </div>

        <h2 className="section-title">10. Data Retention</h2>
        <div className="section-content">
          <p>We retain your personal data for as long as your account is active and for a reasonable period (not more than 3 years) thereafter to support programme evaluation and compliance.</p>
        </div>

        <h2 className="section-title">11. Children’s Data</h2>
        <div className="section-content">
          <p>Sai SMS is intended for an adult audience (18+). This platform is not designed for unsupervised use by minors. While minors may access general content, they should not create accounts or submit personal information without parental consent. If the content is utilised with youth or children, it must be done under the guidance of parents or authorised coordinators.</p>
        </div>

        <h2 className="section-title">12. Changes to This Privacy Policy</h2>
        <div className="section-content">
          <p>We may update this Privacy Policy periodically to reflect technological, legal, or organisational changes. Changes will be indicated by the “Effective date” at the top of this page. Continued use of the Site after such changes signifies acceptance.</p>
        </div>

        <div className="contact-card">
          <h3>Contact Us</h3>
          <div className="space-y-4 text-sm">
            <p>For any questions, complaints, or to report content that you believe violates these Terms, please contact us at:</p>
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

export default PrivacyPolicy;