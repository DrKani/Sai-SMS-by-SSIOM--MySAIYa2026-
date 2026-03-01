import React from 'react';

const CommunityGuidelines: React.FC = () => {
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
        <h1>Sai SMS by SSIOM — Community Guidelines</h1>
        <div className="effective-date">EFFECTIVE DATE (LAST REVISED DATE): 27TH JANUARY 2026</div>

        <div className="salutation">Om Sai Ram.</div>
        <div className="dedication">
          At the outset, we offer our loving salutations and the "Sai SMS-Sadhana Made Simple" platform at the Divine Lotus Feet of Bhagawan Sri Sathya Sai Baba.
        </div>

        <div className="section-content">
          This page sets out the <strong>Community Guidelines</strong> to be followed while engaging with the Sathya Sai International Organisation of Malaysia’s (SSIOM) Sai SMS- Sadhana Made Simple online platform, a web application created and managed by the National Young Adult Wing and the Spiritual Wing of SSIOM, specifically for empowering the spiritual practice of members of SSIOM. The tenets in this document applies to constitute a legally binding agreement agreed by the visitors, guests, non registered and registered users linked to, or otherwise associated with Sai SMS-Sadhana Made Simple or any other media form, media channel, mobile website, or mobile application related to SSIOM (collectively referred to herein as the "site"), and extends to actions taken personally or on behalf of an entity (primarily referenced as “you” within this page).
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

        <h2 className="section-title">1. Who These Guidelines Apply To</h2>
        <div className="section-content">
          <p>These Community Guidelines apply to <strong>all users</strong> and to all interactive features on Sai SMS – Sadhana Made Simple, including (but not limited to):</p>
          <ul>
            <li>Public Book Club reflections (where sharing is enabled)</li>
            <li>Comments, when enabled in future</li>
            <li>Any interactive prompts, polls, or testimonial submissions.</li>
          </ul>
          <p>By using these features, you agree to follow these rules.</p>
        </div>

        <h2 className="section-title">2. Our Core Standard: Respect, Humility, Helpfulness</h2>
        <div className="section-content">
          <p>Sai SMS is a spiritual offering rooted in the teachings of Bhagawan Sri Sathya Sai Baba and is meant to serve a <strong>diverse Malaysian community</strong>.</p>
          <p className="mt-4">We expect users to:</p>
          <ul>
            <li>Speak with respect, even when you disagree.</li>
            <li>Assume good intent; ask clarifying questions gently.</li>
            <li>Share in a way that helps, inspires, or adds value.</li>
            <li>Keep the tone uplifting and constructive, not mocking or hostile.</li>
          </ul>
        </div>

        <h2 className="section-title">3. Zero-Tolerance Behaviour (Not Allowed)</h2>
        <div className="section-content">
          <p>To protect safety and unity, the following are <strong>strictly prohibited</strong>:</p>
          <ul>
            <li><strong>Harassment or bullying:</strong> threats, intimidation, stalking, doxxing, or repeated unwanted contact.</li>
            <li><strong>Hate or discrimination:</strong> content attacking people based on religion, race, nationality, disability, gender, or any protected trait.</li>
            <li><strong>Sexual content or exploitation:</strong> especially involving minors, or anything explicit or suggestive.</li>
            <li><strong>Violence or incitement:</strong> glorifying violence, encouraging harm, or providing instructions to hurt oneself or others.</li>
            <li><strong>Self-harm encouragement:</strong> any content that promotes self-harm or suicide.</li>
            <li><strong>Scams or fraud:</strong> impersonation, phishing, or misleading fundraising.</li>
            <li><strong>Spam:</strong> repetitive posts, irrelevant promotion, or link farming.</li>
          </ul>
        </div>

        <h2 className="section-title">4. Faith and Interfaith Sensitivity</h2>
        <div className="section-content">
          <p>Sai SMS reflects a <strong>universal, values-based approach</strong>. Interfaith sharing is welcome when respectful and educational.</p>
          <p className="mt-4">Not allowed:</p>
          <ul>
            <li>Proselytising or pressuring others to convert.</li>
            <li>“My religion is superior” style arguments.</li>
            <li>Mocking any religion, scripture, or sacred figure.</li>
            <li>Using spiritual discourse to shame, belittle, or control others.</li>
          </ul>
        </div>

        <h2 className="section-title">5. Fundraising and Solicitation</h2>
        <div className="section-content">
          <p>Sai SMS is a non-commercial, spiritual platform.</p>
          <ul>
            <li>No personal fundraising, donation requests, or commercial advertising are allowed, unless explicitly posted through <strong>official SSIOM channels</strong> and clearly identified as such.</li>
          </ul>
        </div>

        <h2 className="section-title">6. Privacy and Personal Safety</h2>
        <div className="section-content">
          <p>Protect yourself and others:</p>
          <ul>
            <li>Do not post sensitive personal information (NRIC/ passport, home address, private phone numbers, etc.).</li>
            <li>Do not share confidential information from private groups or closed meetings.</li>
            <li>Only share photos or stories involving others if you have their consent; be extra cautious with minors.</li>
          </ul>
        </div>

        <h2 className="section-title">7. Moderation and Enforcement</h2>
        <div className="section-content">
          <p>To maintain a safe, devotional environment, moderators may:</p>
          <ul>
            <li>Review, hide, or remove content that violates these guidelines or appears harmful.</li>
            <li>Limit or suspend interactive access for repeat or serious violations.</li>
            <li>In severe cases, report issues to relevant authorities where safety or legality demands it.</li>
          </ul>
          <p>We will strive to be fair and proportionate, but <strong>community safety and spiritual integrity come first</strong>.</p>
        </div>

        <h2 className="section-title">8. Reporting Concerns</h2>
        <div className="section-content">
          <p>If you see content that you believe violates these guidelines:</p>
          <ul>
            <li>Use any available report function in the Site (if implemented), or</li>
            <li>Email: <strong>ssio.malaysia@gmail.com</strong> with:
              <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
                <li>Screenshot(s)</li>
                <li>Date and time</li>
                <li>Brief description of the concern</li>
              </ul>
            </li>
          </ul>
          <p>Avoid “public shaming” or escalating conflicts in public spaces. Report it and allow moderators to handle it thoughtfully.</p>
        </div>

        <h2 className="section-title">9. Values-Based Posting</h2>
        <div className="section-content">
          <p>Before you submit or share anything on Sai SMS, ask yourself:</p>
          <ul>
            <li><strong>Is it true?</strong> (or clearly framed as your personal experience/opinion)</li>
            <li><strong>Is it kind?</strong></li>
            <li><strong>Is it useful and appropriate for a diverse spiritual community?</strong></li>
          </ul>
          <p>If the answer is “no” to any of these, reconsider posting.</p>
        </div>

        <h2 className="section-title">10. Updates to These Guidelines</h2>
        <div className="section-content">
          <p>We may revise these Community Guidelines as Sai SMS grows and additional interactive features (e.g., comments, more gamified elements, forums) are introduced.</p>
          <p>Updates will be posted on this page with an updated <strong>Effective Date</strong>. Continued use of the Site after changes implies acceptance.</p>
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

export default CommunityGuidelines;
