import React from 'react';

const Copyright: React.FC = () => {
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
        <h1>Sai SMS by SSIOM — Copyright Notice</h1>
        <div className="effective-date">EFFECTIVE DATE (LAST REVISED DATE): 27TH JANUARY 2026</div>

        <div className="salutation">Om Sai Ram.</div>
        <div className="dedication">
          At the outset, we offer our loving salutations and the "Sai SMS-Sadhana Made Simple" platform at the Divine Lotus Feet of Bhagawan Sri Sathya Sai Baba.
        </div>

        <div className="section-content">
          This page sets out the <strong>Copyright Notice</strong> governing the use of the Sathya Sai International Organisation of Malaysia’s (SSIOM) Sai SMS- Sadhana Made Simple online platform, a web application created and managed by the National Young Adult Wing and the Spiritual Wing of SSIOM, specifically for empowering the spiritual practice of members of SSIOM. The details and terms in this document applies to constitute a legally binding agreement agreed by the visitors, guests, non registered and registered users linked to, or otherwise associated with Sai SMS-Sadhana Made Simple or any other media form, media channel, mobile website, or mobile application related to SSIOM (collectively referred to herein as the "site"), and extends to actions taken personally or on behalf of an entity (primarily referenced as “you” within this page).
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

        <h2 className="section-title">Acknowledgements</h2>
        <div className="section-content">
          <p>The materials made available through the Sai SMS – Sadhana Made Simple platform—including text, images, graphics, audio, video, reflective prompts, quizzes, and other digital content—are curated with deep respect for intellectual property and spiritual integrity. They are intended solely for educational, devotional, and humanitarian purposes, and not for commercial gain.</p>
          <p className="mt-4">We acknowledge and honour the authors, publishers, photographers, speakers, and other creators whose works enrich this platform. A significant portion of the content references or is inspired by numerous Swami-related and Radio Sai websites, Google Images for relevant images, and a recently published work on Swami's original content. While we have attempted to attribute credit appropriately, we acknowledge that we may not have done so consistently. We sincerely hope that we have not inadvertently infringed upon anyone's copyright, and if such an infringement has occurred, we kindly request that those affected show understanding and leniency.</p>
        </div>

        <h2 className="section-title">Copyrighted Material</h2>
        <div className="section-content">
          <p>From time to time, this Site may display or reference materials protected by copyright for which explicit authorisation may not always have been obtained. Such usage is limited and carefully considered under principles of fair dealing/fair use for non-commercial, educational, research, and spiritual purposes.</p>
          <p className="mt-4">If you wish to use copyrighted materials found on this Site beyond such fair use—for example, in commercial publications, products, or monetised media—please obtain permission directly from the copyright owner.</p>
        </div>

        <h2 className="section-title">Images of Bhagawan Sri Sathya Sai Baba</h2>
        <div className="section-content">
          <p>Images of Bhagawan Sri Sathya Sai Baba are held in the highest reverence. While SSIOM does not claim ownership of these sacred images, we recognise that many may be protected by copyright. Our use of such images is solely for devotional upliftment and spiritual education.</p>
          <p className="mt-4">If you believe that any image of Bhagawan Sri Sathya Sai Baba or other copyrighted material on this Site infringes your rights, please contact us with:</p>
          <ul>
            <li>A link or screenshot of the material</li>
            <li>Evidence of ownership or authorised representation</li>
          </ul>
          <p>We will review and, where appropriate, remove or replace the material as soon as reasonably possible.</p>
        </div>

        <h2 className="section-title">Use of Sai SMS Content</h2>
        <div className="section-content">
          <p>Unless otherwise indicated:</p>
          <ul>
            <li>You may view, read, and download Sai SMS content for personal, non-commercial spiritual use.</li>
            <li>You may share short excerpts or screenshots with proper attribution to SSIOM and without alteration.</li>
          </ul>
          <h3 className="sub-title">You must not:</h3>
          <ul>
            <li>Use Sai SMS content for commercial products, paywalled courses, or monetised channels.</li>
            <li>Alter materials in a way that misrepresents the teachings of Bhagawan Sri Sathya Sai Baba or SSIOM.</li>
            <li>Use SSIOM or Sai SMS names/logos in a way that suggests endorsement of unrelated products or entities.</li>
          </ul>
        </div>

        <h2 className="section-title">Disclaimer</h2>
        <div className="section-content">
          <p>While the editorial team strives for accuracy, completeness, and clarity, all articles, notes, and supporting materials are offered “as-is” and are for reference and inspiration only. They are not intended as professional legal, medical, psychological, or financial advice. Use of this Site and reliance on any information is entirely at your own discretion and risk.</p>
        </div>

        <h2 className="section-title">Your Support</h2>
        <div className="section-content">
          <p>By engaging respectfully with the content on Sai SMS – Sadhana Made Simple, you support a values-based movement towards love, understanding, and selfless service. We encourage you to share only in the spirit of education and spiritual upliftment, not for personal profit.</p>
        </div>

        <div className="contact-card">
          <h3>Contact Us</h3>
          <div className="space-y-4 text-sm">
            <p>For any queries about usage beyond what is described here, please contact us at:</p>
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

export default Copyright;