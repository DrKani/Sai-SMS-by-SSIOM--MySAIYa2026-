import React from 'react';

const ContentSubmissionGuidelines: React.FC = () => {
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
        <h1>Sai SMS by SSIOM — Content Submission Guidelines</h1>
        <div className="effective-date">EFFECTIVE DATE (LAST REVISED DATE): 27TH JANUARY 2026</div>

        <div className="salutation">Om Sai Ram.</div>
        <div className="dedication">
          At the outset, we offer our loving salutations and the "Sai SMS-Sadhana Made Simple" platform at the Divine Lotus Feet of Bhagawan Sri Sathya Sai Baba.
        </div>

        <div className="section-content">
          This page sets out the <strong>Content Submission Guidelines</strong>, which explain what content you may submit to the Sai SMS – Sadhana Made Simple platform (e.g., reflections, testimonies, quotes) and how Sathya Sai International Organisation of Malaysia (SSIOM) may review and use such content in the Sai SMS- Sadhana Made Simple online platform, a web application created and managed by the National Young Adult Wing and the Spiritual Wing of SSIOM, specifically for empowering the spiritual practice of members of SSIOM. The tenets in this document applies to constitute a legally binding agreement agreed by the visitors, guests, non registered and registered users linked to, or otherwise associated with Sai SMS-Sadhana Made Simple or any other media form, media channel, mobile website, or mobile application related to SSIOM (collectively referred to herein as the "site"), and extends to actions taken personally or on behalf of an entity (primarily referenced as “you” within this page).
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

        <h2 className="section-title">Introduction</h2>
        <div className="section-content">
          <p>Thank you for contributing to the Sai SMS-Sadhana Made Simple digital hub. These guidelines explain what you can submit, how to submit responsibly, and what happens after submission. These guidelines apply to all features that allow users to submit text or media, including:</p>
          <ul>
            <li>Book Club reflections (publicly shareable)</li>
            <li>Testimonies, stories, and spiritual sharing</li>
            <li>Suggestions or content proposals submitted through forms</li>
          </ul>
        </div>

        <h2 className="section-title">What You Can Submit</h2>
        <div className="section-content">
          <p>We welcome content aligned with SSIOM’s purpose: spiritual upliftment, service inspiration, youth development, cultural understanding, and community impact.</p>
          <p className="mt-4 font-bold">Examples:</p>
          <ul>
            <li>Reflections and personal stories (service, learning, transformation)</li>
            <li>Event recaps and centre highlights</li>
            <li>Human values articles (truth, right conduct, peace, love, non-violence)</li>
            <li>Educational explainers (Sai teachings applied in daily life)</li>
            <li>Creative media: photos, videos, audio, infographics</li>
            <li>Interactive ideas: polls, quizzes, challenges, prompts</li>
            <li>Namasmarana and sadhana</li>
            <li>Understanding of Sai teachings and universal human values</li>
            <li>Reflections on Ramakatha Rasavahini and other Sai literature</li>
            <li>Devotional or contemplative insights that uplift and inspire</li>
          </ul>
          <p className="mt-4 font-bold">Book Club Examples:</p>
          <ul>
            <li>Short monthly reflections on the Book Club readings</li>
            <li>Experiences of peace, transformation, or service inspired by Swami</li>
            <li>Simple stories or incidents that highlight love, truth, right conduct, peace, non-violence</li>
          </ul>
        </div>

        <h2 className="section-title">Quality and Tone</h2>
        <div className="section-content">
          <p>We ask that you keep submissions:</p>
          <ul>
            <li><strong>Spiritually grounded and value-aligned</strong></li>
            <li>Respectful of all faiths and communities</li>
            <li>Clear and concise (so they can be easily read on mobile)</li>
            <li>Focused on <strong>learning, gratitude, transformation, and unity</strong></li>
          </ul>
          <p className="mt-4 mb-2 font-bold text-red-800">Avoid:</p>
          <ul>
            <li>Mocking or attacking individuals, communities, or institutions</li>
            <li>Using the platform to criticise specific centres or persons</li>
            <li>Sensationalising experiences for attention</li>
          </ul>
        </div>

        <h2 className="section-title">Originality, Ownership, and Permission</h2>
        <div className="section-content">
          <p>By submitting content, you confirm that:</p>
          <ul>
            <li>The content is your <strong>original work</strong>, or you have permission to share it.</li>
            <li>Any quotes from books or talks are reasonably short and, where possible, attributed.</li>
            <li>If you include images, audio, or video, you have permission to use them and to feature any identifiable individuals.</li>
            <li>If you share factual claims (event numbers, outcomes, “research says,” etc.), cite credible sources where possible</li>
          </ul>
          <p className="mt-4 mb-2 font-bold text-red-800">Do not upload:</p>
          <ul>
            <li>Copyrighted music tracks, images, or videos that you do not have rights to use.</li>
            <li>Confidential documents or restricted materials.</li>
          </ul>
        </div>

        <h2 className="section-title">Safety, Privacy, and Minors</h2>
        <div className="section-content">
          <p className="mb-2">Protect your privacy and the privacy of others:</p>
          <ul>
            <li>Do not share NRIC/passport numbers, home addresses, phone numbers, or highly sensitive personal details.</li>
            <li>Do not include recognisable minors (children) in photos or videos <strong>without parental/guardian consent</strong>.</li>
          </ul>
          <p className="mt-4 mb-2">If you describe a personal struggle (health, mental, family issues), please do so:</p>
          <ul>
            <li>With discretion, and</li>
            <li>Without exposing identifiable third parties without their consent.</li>
          </ul>
        </div>

        <h2 className="section-title">Prohibited Content</h2>
        <div className="section-content">
          <p>Submissions will be removed or rejected if they contain:</p>
          <ul>
            <li>Hate, discrimination, harassment, or threats</li>
            <li>Explicit sexual content or exploitation</li>
            <li>Promotion or encouragement of violence or self-harm</li>
            <li>Defamation or unverified serious allegations against individuals or organisations</li>
            <li>Political campaigning or partisan messaging</li>
            <li>Fundraising, commercial promotion, or financial solicitation not authorised by SSIOM</li>
          </ul>
        </div>

        <h2 className="section-title">Editorial Review and Publication</h2>
        <div className="section-content">
          <p>All content submitted may be reviewed by <strong>SSIOM moderators</strong>. We may:</p>
          <ul>
            <li>Correct minor spelling or formatting</li>
            <li>Shorten content for clarity while retaining your meaning</li>
            <li>Add a heading, tags, or a short note for context</li>
            <li>Decline to publish submissions that do not fit the mission, tone, or quality standards</li>
          </ul>
          <p>We cannot guarantee that every submission will be published.</p>
        </div>

        <h2 className="section-title">How Sai SMS May Use Your Content</h2>
        <div className="section-content">
          <p>By submitting content, you grant SSIOM a <strong>non-exclusive, royalty-free licence</strong> to:</p>
          <ul>
            <li>Display your content on the Sai SMS platform</li>
            <li>Reuse it in SSIOM reports, presentations, newsletters, or social media, with appropriate attribution where applicable</li>
          </ul>
          <p>If you wish to use a particular name (full name, initials, or a pseudonym), please specify this in your submission where possible.</p>
        </div>

        <h2 className="section-title">Removal Requests</h2>
        <div className="section-content">
          <p>If you later wish a published reflection or contribution to be removed, you may contact SSIOM with:</p>
          <ul>
            <li>The content link (or screenshot)</li>
            <li>Your name and reason for removal</li>
          </ul>
          <p>We will do our best to accommodate, noting that some content (e.g., printed reports or offline archives) may not be fully retractable.</p>
        </div>

        <div className="contact-card">
          <h3>Contact Us</h3>
          <div className="space-y-4 text-sm">
            <p>For questions about content submissions or to request removal:</p>
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

export default ContentSubmissionGuidelines;