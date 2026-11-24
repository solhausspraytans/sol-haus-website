/* =====================================================================
   SOL HAUS — SITE SETTINGS  (the ONLY file you need to edit day-to-day)
   ---------------------------------------------------------------------
   • Text goes inside "quotes". Keep the commas at the end of lines.
   • Leave a link as "" until you have it — the site will show that
     button as "coming soon" instead of a dead link.
   • Photos: drop your file into the matching /images/ folder and
     update the "src" below (or just overwrite the placeholder file
     using the exact same file name).
   ===================================================================== */

window.SOL_HAUS = {

  /* ---------- BUSINESS BASICS ---------- */
  business: {
    name: "Sol Haus Spray Tans",
    email: "hangtanspray@gmail.com",
    serviceArea: "Long Island, all five boroughs of New York City and New Jersey",
    serviceAreaShort: "Long Island, NYC & NJ",
    siteUrl: "https://solhaustans.com",   // used for SEO/sharing once you have a domain
  },

  /* ---------- LINKS (paste full URLs, starting with https://) ---------- */
  links: {
    booking: "https://docs.google.com/forms/d/e/1FAIpQLScczJ8CsfUhvcMOomrldfiLPhXD8DcqrQ85XWCphSdLLVo4Fw/viewform",   // Sol Haus · Spray Tan Booking
    bookingBridal: "https://docs.google.com/forms/d/e/1FAIpQLSeHwhaUL3mSLrUfJ-DtXMFspeXqqYX8UvW1_9301mgXQaYkzQ/viewform",   // Sol Haus · Group Tan Booking (has Wedding / Bridal trial)
    bookingCompetition: "https://docs.google.com/forms/d/e/1FAIpQLSfpZBOyPAtxB5bN94TUkHPYXPSLj_gx7rVUa34xgah_A5i6Jg/viewform",   // Sol Haus · Competition Tan Booking
    bookingGroup: "https://docs.google.com/forms/d/e/1FAIpQLSeHwhaUL3mSLrUfJ-DtXMFspeXqqYX8UvW1_9301mgXQaYkzQ/viewform",   // Sol Haus · Group Tan Booking
    instagram: "https://www.instagram.com/_solhaus/",
    tiktok: "",                // leave "" to hide TikTok everywhere; paste your link here to show it
    googleReviewsRead: "https://g.page/r/CfN1ICi5wqvrEAE",     // your Google Business Profile reviews link
    googleReviewLeave: "https://g.page/r/CfN1ICi5wqvrEAE/review",     // your "Ask for reviews" link from Google Business Profile
    consentForm: "https://docs.google.com/forms/d/e/1FAIpQLSfsMyGn_XaRYroTlcnLCLgGzzrOvj0APBELCBOCPXGSOd1JvA/viewform",   // Spray Tan Client Agreement
    giftCards: "",             // gift card purchase link — the gift card section appears once this is filled
  },

  /* ---------- FORMS ----------
     Free option: create forms at formspree.io (free tier), then paste each
     form's endpoint, e.g. "https://formspree.io/f/abcdwxyz".
     Until an endpoint is added, that form shows a friendly "email us" note
     instead of pretending to send. Submissions are stored by Formspree,
     never in this website's code. */
  forms: {
    bridal: "",
    group: "",
    competition: "",
    newsletter: "",            // optional email sign-up (Formspree or Buttondown form action). Hidden if "".
  },

  /* ---------- HOMEPAGE VIDEO (optional) ----------
     Put a video file in images/montage/ (e.g. "images/montage/hero.mp4") and
     add its path below. It plays full-screen at the top, silent and looping,
     instead of the photo slideshow. Leave "" to keep the slideshow.
     poster: a still photo shown while the video loads.                  */
  heroVideo: {
    src: "images/montage/hero.mp4",
    poster: "images/montage/hero-poster.jpg",
    link: "https://www.instagram.com/reel/DPR3t5RgXbM/",
  },

  /* ---------- FEATURED INSTAGRAM REEL (homepage "On the feed") ----------
     url:   the reel's link.
     video: OPTIONAL — save the reel as an .mp4 in images/social/ and put the
            path here (e.g. "images/social/reel.mp4") to make it play on its own,
            silently, on a loop. Without it, Instagram's player is shown (tap to play). */
  reel: {
    url: "https://www.instagram.com/reel/DSEBg_4Ef55/",
    video: "",
    poster: "",
  },

  /* ---------- ANNOUNCEMENT BAR (top of every page) ---------- */
  announcement: {
    show: true,
    text: "Now booking spray tans across Long Island, the five boroughs & NJ",
  },

  /* ---------- SETUP HELPERS ---------- */
  showSetupNotice: false,       // small "preview" chip listing missing links — set to false at launch
  showApprovalFlags: false,     // shows "Draft — needs Sol Haus approval" tags on care instructions

  /* ---------- SERVICES & PRICES ----------
     price: "" shows "Pricing coming soon". Example: price: "$75"           */
  services: [
    {
      id: "traditional", edit: "everyday", name: "Traditional Spray Tan", kicker: "The signature glow",
      description: "A fully custom airbrush spray tan with a shade chosen for your skin tone and the look you want — natural, golden, or a deeper bronze.",
      processing: "Develops over several hours, typically worn overnight before your first rinse. Your exact timing is confirmed at your appointment.",
      price: "$50 <small>· $55 with darker solutions</small>", image: "images/everyday/everyday-01.jpg", bookingKey: "booking",
    },
    {
      id: "express", edit: "everyday", name: "Express Spray Tan", kicker: "Glow on your schedule",
      description: "The same custom application with a rapid-development formula, so you can rinse sooner and get on with your day.",
      processing: "Rinse after a shorter development window — the longer you wait, the deeper the result. Your timing is tailored at your appointment.",
      price: "$50 <small>· $55 with darker solutions</small>", image: "", bookingKey: "booking",
    },
    {
      id: "contouring", edit: "everyday", name: "Custom Contouring", kicker: "Sculpted with shade",
      description: "An add-on that uses strategic layering of tan to add soft dimension and definition where you'd like it. Contouring is a cosmetic, temporary effect — it enhances light and shadow; it doesn't change your body.",
      processing: "Applied during your tan and develops with it.",
      price: "+$6 <small>add-on</small>", image: "", bookingKey: "booking",
    },
    {
      id: "special", edit: "everyday", name: "Special Occasion Tan", kicker: "For the big nights",
      description: "Galas, proms, vacations, photo shoots and milestone birthdays — timed so you're glowing at your best on the day.",
      processing: "We'll plan timing together based on your event date.",
      price: "$50 <small>· $55 with darker solutions</small>", image: "", bookingKey: "booking",
    },
    {
      id: "bridal", edit: "bridal", name: "Bridal Spray Tan", kicker: "The glow before ‘I do’",
      description: "Trial appointments to perfect your shade, a carefully timed wedding-week tan, and optional tanning for your wedding party.",
      processing: "Trial and final appointment timing is planned around your wedding date.",
      price: "From $60 <small>· solo bride, tailored by consultation</small>", image: "images/bridal/bridal-01.jpg", bookingKey: "bookingBridal", page: "bridal.html",
    },
    {
      id: "competition", edit: "competition", name: "Competition Tan", kicker: "Made for the spotlight",
      description: "Stage-ready tanning for Irish dancers at feiseanna, regional Oireachtas and major championships, with group appointments for schools and teams.",
      processing: "Timing is planned around your competition schedule.",
      price: "$45–$55 <small>· depending on shade</small>", image: "images/competition/competition-01.jpg", bookingKey: "bookingCompetition", page: "competition.html",
    },
    {
      id: "group", edit: "everyday", name: "Group Tanning", kicker: "Glow together",
      description: "Bridal parties, birthdays, dance schools, teams and special events — we come to you and tan the whole group.",
      processing: "Group size, location and timing are arranged in advance.",
      price: "Custom quote <small>· by consultation</small>", image: "images/behind-the-scenes/behind-the-scenes-01.jpg", bookingKey: "bookingGroup",
    },
  ],

  /* ---------- COMPETITION EVENT CALENDAR ----------
     Copy the example block, remove the // marks, and fill it in.
     status: "Open", "Waitlist", "Coming soon" or "Fully booked"           */
  events: [
    // {
    //   name: "Competition name",
    //   dates: "Event dates",
    //   location: "City, State",
    //   bookingDates: "When appointments are available",
    //   status: "Open",
    //   url: "https://link-to-book",
    // },
  ],

  /* ---------- CLIENT LOVE LETTERS (REAL reviews only) ----------
     Copy from your Google reviews with the client's permission.
     stars: leave out if the review didn't include a star rating.         */
  reviews: [
    // { text: "Paste the client's review here.", name: "First name or initials", stars: 5, source: "Google" },
    { text: "Katie is the best!!!!! Only person I will get spray tans from… never orange & always comes out super even. She makes you feel so comfortable too. If I could give 10 stars I would!!!!", name: "Google review", stars: 5 },
    { text: "Katie leaves me golden & glowing every time I go to her! Thank you for helping me GLOW UP. Love it!!", name: "Google review", stars: 5 },
    { text: "First time world qualifying and she looked amazing on stage!", name: "Competition parent" },
    { text: "Im very picky with who I get tans from but Katie is my go to girl. She does an amazing job every time!", name: "Google review", stars: 5 },
    { text: "The tan was perfect ✨✨", name: "Sol Haus bride" },
    { text: "The absolute best tan & experience 10/10, I trust this girl with my life!!!!!!", name: "Google review", stars: 5 },
    { text: "Bye never getting a spray tan anywhere else again", name: "Client text" },
    { text: "Katie is the best tan artist! I use her for every event!", name: "Google review", stars: 5 },
    { text: "Also can I permanently be this color the rest of my life", name: "Client text" },
    { text: "Thank you so much for always making us all look and feel our best 🥰", name: "Client text" },
  ],

  /* ---------- PHOTO GALLERIES ----------
     shape controls the montage size: "tall", "wide", "square" or "small".
     alt: describe the photo for screen readers and Google.               */
  galleries: {
    montage: [
      { src: "images/everyday/everyday-01.jpg", shape: "tall", alt: "Client with a golden Sol Haus glow on a night out" },
      { src: "images/competition/competition-01.jpg", shape: "tall", alt: "Irish dancer on stage at the Mid-Atlantic Oireachtas with a Sol Haus glow" },
      { src: "images/behind-the-scenes/behind-the-scenes-01.jpg", shape: "wide", alt: "Sol Haus mobile set-up in a hotel suite with the pop-up tent and neon sign" },
      { src: "images/bridal/bridal-01.jpg", shape: "square", alt: "Bride with a soft Sol Haus glow" },
      { src: "images/everyday/glow-01.jpg", shape: "tall", alt: "Client with a glowy Sol Haus tan in a white tee" },
      { src: "images/competition/competition-06.jpg", shape: "small", alt: "Irish dancer reacting with joy on stage at results" },
      { src: "images/behind-the-scenes/behind-the-scenes-03.jpg", shape: "tall", alt: "Katie airbrushing a client in the Sol Haus pop-up tent" },
      { src: "images/competition/competition-02.jpg", shape: "square", alt: "Two Irish dancers by a city window before competing" },
      { src: "images/competition/competition-07.jpg", shape: "tall", alt: "Katie of Sol Haus with an Irish dancer at the Mid-Atlantic Oireachtas" },
    ],
    glow: [
      { src: "images/behind-the-scenes/behind-the-scenes-03.jpg", shape: "tall", alt: "Katie airbrushing a client in the Sol Haus pop-up tent" },
      { src: "images/everyday/glow-03.jpg", shape: "tall", alt: "Client in a cream dress with a golden Sol Haus glow" },
      { src: "images/everyday/glow-04.jpg", shape: "wide", alt: "Client glowing at her celebration behind marquee letters" },
      { src: "images/everyday/glow-01.jpg", shape: "tall", alt: "Client with a soft, glowy Sol Haus tan in a white tee" },
    ],
    everyday: [
      { src: "images/everyday/glow-03.jpg", shape: "tall", alt: "Client in a cream dress with a golden Sol Haus glow" },
      { src: "images/everyday/glow-01.jpg", shape: "tall", alt: "Client with a glowy Sol Haus tan in a white tee" },
      { src: "images/everyday/glow-04.jpg", shape: "wide", alt: "Client glowing at her celebration" },
      { src: "images/everyday/everyday-01.jpg", shape: "tall",   alt: "Client with a natural, golden Sol Haus glow on a night out" },
    ],
    bridal: [
      { src: "images/bridal/bridal-01.jpg", shape: "tall", alt: "Bride with a soft, custom Sol Haus glow on her wedding morning" },
      { src: "images/bridal/bridal-05.jpg", shape: "tall", alt: "Client in a white strapless dress with a soft Sol Haus glow" },
    ],
    competition: [
      { src: "images/competition/competition-09.jpg", shape: "tall", alt: "Behind the scenes: photographing a fresh Sol Haus competition tan" },
      { src: "images/competition/competition-06.jpg", shape: "tall", alt: "Irish dancer reacting with joy on stage at results" },
      { src: "images/competition/competition-08.jpg", shape: "tall", alt: "Young Irish dancer in a red solo dress holding her medal" },
      { src: "images/competition/competition-07.jpg", shape: "tall", alt: "Katie of Sol Haus with an Irish dancer at the Mid-Atlantic Oireachtas" },
      { src: "images/competition/competition-01.jpg", shape: "small", alt: "Irish dancer on stage at the Mid-Atlantic Oireachtas with a Sol Haus competition glow" },
      { src: "images/competition/competition-05.jpg", shape: "tall", alt: "Irish dancer with a World qualifier sash and medal" },
      { src: "images/competition/competition-03.jpg", shape: "small", alt: "Irish dancer smiling on stage holding a medal ribbon" },
      { src: "images/competition/competition-02.jpg", shape: "tall", alt: "Two Irish dancers in solo dresses sitting by a city window before competing" },
      { src: "images/competition/competition-04.jpg", shape: "small", alt: "Katie of Sol Haus with a young Irish dancer and her medal" },
    ],
    behindTheScenes: [
      { src: "images/behind-the-scenes/behind-the-scenes-01.jpg", shape: "wide",   alt: "A Sol Haus mobile spray tan set-up in a hotel suite, with the pop-up tent and neon Sol Haus sign" },
      { src: "images/behind-the-scenes/behind-the-scenes-03.jpg", shape: "tall",   alt: "Katie airbrushing a client in the Sol Haus pop-up tent" },
    ],
    about: [
      { src: "images/about/about-01.jpg", shape: "tall", alt: "Katie, founder of Sol Haus, in a white crop top and wide-leg denim" },
    ],
    social: [
      { src: "images/social/kinda-chic.jpg", alt: "Kinda chic for a custom color — be a text away" },
      { src: "images/social/guest-check.jpg", alt: "Guest check review: spray tan was fire, would definitely spray again, five stars", position: "center 40%" },
      { src: "images/social/flyer.jpg", alt: "Sol Haus flyer: Enhance your good genes — custom mobile airbrush sprays", position: "center top" },
      { src: "images/behind-the-scenes/behind-the-scenes-03.jpg", alt: "Katie airbrushing a client in the Sol Haus pop-up tent" },
      { src: "images/social/airbrush-benefits.jpg", alt: "Benefits of airbrush tanning: long-lasting, even and streak-free, effortless fading, shape flattering, suitable for all skin types, only takes 10 minutes", position: "center top" },
    ],
  },
};
