import React from 'react';

const TermsOfUse: React.FC = () => {
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
        <h1>Sai SMS by SSIOM — Terms of Use</h1>
        <div className="effective-date">EFFECTIVE DATE (LAST REVISED DATE): 27TH JANUARY 2026</div>

        <div className="salutation">Om Sai Ram.</div>
        <div className="dedication">
          At the outset, we offer our loving salutations and the "Sai SMS-Sadhana Made Simple" platform at the Divine Lotus Feet of Bhagawan Sri Sathya Sai Baba.
        </div>

        <div className="section-content">
          This page sets out the <strong>Terms of Use</strong> governing the use of the Sathya Sai International Organisation of Malaysia’s (SSIOM) Sai SMS- Sadhana Made Simple online platform, a web application created and managed by the National Young Adult Wing and the Spiritual Wing of SSIOM, specifically for empowering the spiritual practice of members of SSIOM. The details and terms in this document applies to constitute a legally binding agreement agreed by the visitors, guests, non registered and registered users linked to, or otherwise associated with Sai SMS-Sadhana Made Simple or any other media form, media channel, mobile website, or mobile application related to SSIOM (collectively referred to herein as the "site"), and extends to actions taken personally or on behalf of an entity (primarily referenced as “you” within this page).
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

        <h2 className="section-title">1. User Eligibility</h2>
        <div className="section-content">
          <p className="mb-4 font-bold">These Terms are governed by Malaysian law.</p>
          <p className="mb-4">By using the Site, you represent and warrant that:</p>
          <ul>
            <li>You are at least 18 years of age and have the legal capacity to enter these Terms (Age of Majority Act 1971).</li>
            <li>You are not a Malaysian Muslim, in compliance with local regulations.</li>
            <li>All registration information you submit is truthful and accurate and will be updated as needed.</li>
            <li>Your use of the Site complies with all Malaysian laws and regulations.</li>
            <li>You will not use automated systems (bots/scripts) unless explicitly permitted by SSIOM.</li>
            <li>You will not use the Site for illegal, commercial, or unauthorised purposes.</li>
          </ul>
        </div>

        <h2 className="section-title">2. Permitted use</h2>
        <div className="section-content">
          <p className="mb-4">You are welcome to use the content (text, images, audio, video) available on this site for personal, spiritual, and educational use. Specifically, you may:</p>
          <ul>
            <li>Access and read content for non-commercial benefit, including <strong>personal, educational, and spiritual</strong> use.</li>
            <li>Download materials for personal, non-commercial use.</li>
            <li>Share publicly available resources, provided you give appropriate credit to SSIOM.</li>
          </ul>
          <p>Account registration may be required. You agree to keep your password confidential and are responsible for all activity under your account. We reserve the right to remove or change any username we deem inappropriate or objectionable. The site’s admin may suspend/terminate access to the Site, or delete your account and any related content, at any time for any reason, without notice or liability, including for violations, misuse, or breaches of these Terms.</p>
        </div>

        <h2 className="section-title">3. Prohibited Activities</h2>
        <div className="section-content">
          <p className="mb-4">Access to or use of the Site is permitted only for the purposes for which it has been made available. The Site is intended solely for the spiritual benefit of its members and must not be utilised for any commercial or illegal activities.</p>
          <p className="mb-4">As a user, you agree not to engage in the following prohibited activities:</p>
          <ul>
            <li>Employing the Site or its content for commercial purposes, profit generation, or any revenue-producing activities, including but not limited to resale or promotional initiatives.</li>
            <li>Modifying content in a manner that misrepresents the teachings of Bhagawan Sri Sathya Sai Baba or misleads others regarding such teachings.</li>
            <li>Presenting materials as officially endorsed by the Sri Sathya Sai Organisation Malaysia (SSIOM) without obtaining explicit written consent.</li>
            <li>Creating frames around any web pages or utilising the Site’s logo or branding for hyperlinking without prior written authorisation.</li>
            <li>Using SSIOM logos or branding without securing written consent.</li>
            <li>Collecting user data for the purpose of sending unsolicited emails or establishing fraudulent accounts.</li>
            <li>Circumventing or disabling any security features present on the Site.</li>
            <li>Misleading or deceiving other users.</li>
            <li>Interfering with the Site’s functionality or its networks.</li>
            <li>Impersonating any individuals or organisations.</li>
            <li>Engaging in harassment, abuse, or any form of harm directed towards others.</li>
            <li>Removing copyright notices.</li>
            <li>Engaging in reverse engineering of the Site’s software.</li>
            <li>Violating any applicable Malaysian laws.</li>
          </ul>
        </div>

        <h2 className="section-title">4. Intellectual Property Rights</h2>
        <div className="section-content">
          <p className="mb-4">Unless otherwise specified, the Site constitutes the proprietary property of SSIOM, with all source code, databases, functionalities, software, website designs, audiovisual materials, text, photographs, and graphics (collectively referred to as the “Content”) owned or controlled by SSIOM or licensed to SSIOM.</p>
          <p className="mb-4">As the authors of this Site, we acknowledge our human capacity for error, and we extend our apologies in advance for any mistakes that may occur. Our primary objective is to collect and organise pertinent information to assist SSIOM members and volunteers in their engagement with SSIOM. We wish to clarify that there is no commercial motivation behind this initiative. We have endeavoured to compile and present information efficiently for our audience. We recognise that the content may not be fully organised, and some crucial information may still be missing. One notable oversight on our part involved the cutting and pasting of materials and images from various sources. While we have attempted to attribute credit appropriately, we acknowledge that we may not have done so consistently. We express our sincere gratitude to the internet for providing access to valuable content. We sincerely hope that we have not inadvertently infringed upon anyone's copyright, and if such an infringement has occurred, we kindly request that those affected show understanding and leniency.</p>
          <p className="mb-4">Our website utilises Google Images to source relevant images; however, the majority of our content originates from numerous Swami-related and Radio Sai websites, as well as from a recently published work on Swami's original content. Despite our efforts to refine and reorganise the material, we concede that certain sections would benefit from enhanced presentation. We trust that our enthusiastic volunteer readers will be forgiving of any shortcomings in this aspect. This Site is a work in progress; it will continue to evolve and serve various purposes. Although additional uses for this Site may emerge organically, our initial focus was the Sai SMS program.</p>
          <p>Images of Bhagawan Sri Sathya Sai Baba are held with the highest reverence. While SSIOM does not assert copyright over Swami’s photographs, all images should be utilised with respect, devotion, and in accordance with His universal message.</p>
        </div>

        <h2 className="section-title">5. User generated contents</h2>
        <div className="section-content">
          <p className="mb-4">You are solely responsible for all material (“Contributions”) you post. By posting, you warrant and represent that:</p>
          <ul>
            <li>You are the creator and owner of the content or have all necessary licenses and consents to post it.</li>
            <li>Your Contributions do not infringe any intellectual property rights (e.g., copyright, trademark) or privacy rights of any third party.</li>
            <li>Your Contributions are not false, inaccurate, misleading, obscene, unlawful, libellous, or defamatory.</li>
            <li>Your content does not contain offensive comments related to race, national origin, gender, sexual preference, or physical handicap.</li>
            <li>Your contributions will not be used to solicit business, promote commercial activities, contain unlawful material or contain hateful/offensive content.</li>
          </ul>
          <p className="mb-4">SSIOM does not endorse or review contributions before they appear. They reflect the views of the poster, not of the site’s authors or SSIOM.</p>
          <p className="mb-4">By submitting your content, you grant SSIOM a non-exclusive, perpetual license to use, reproduce, edit, and authorise others to use your Contributions in any format or media for purposes consistent with SSIOM's mission.</p>
          <p>The authors of the site reserve the right to monitor, edit, remove, or refuse to post any contribution deemed inappropriate, offensive, in breach of these Terms, or inconsistent with our spiritual values, at our sole discretion and without liability.</p>
        </div>

        <h2 className="section-title">6. Disclaimer</h2>
        <div className="section-content">
          <p className="mb-4">You agree that your use of the Site is at your sole risk. The Site is provided “as is” and “as available” basis. We disclaim all warranties, express or implied, including the implied warranties of merchantability and fitness for a particular purpose or the content of any websites linked to the Site, including:</p>
          <ul>
            <li>Accuracy</li>
            <li>Completeness</li>
            <li>Timeliness</li>
            <li>Reliability</li>
            <li>Fitness for a particular purpose</li>
          </ul>
          <p>SSIOM is <strong>not liable</strong> for any direct, indirect, incidental, punitive, or consequential damages (including lost profits, lost data) arising from your use of the Site. You agree to defend and indemnify SSIOM, its members, its affliates and its volunteers against claims arising from:</p>
          <ul>
            <li>Your use of the Site</li>
            <li>Your breach of Terms</li>
            <li>Your violation of others' rights, including intellectual property rights.</li>
          </ul>
        </div>

        <h2 className="section-title">7. Modifications</h2>
        <div className="section-content">
          <p>We may revise these Terms at any time. Updated versions will display the latest <strong>Effective Date</strong>. Continued use of the Site signifies acceptance.</p>
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

export default TermsOfUse;