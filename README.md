# Sol Haus Spray Tans — Website

A fast, free, static website (HTML + CSS + JavaScript). No database, no paid services.

```
index.html  everyday.html  bridal.html  competition.html  before-your-glow.html  shop.html
reviews.html  social.html  forms.html  about.html  policies.html  404.html
assets/js/config.js   ← EDIT THIS: links, email, prices, events, reviews, photos
assets/css/styles.css ← colours & fonts (top of file)
assets/js/main.js     ← site behaviour (no need to edit)
images/               ← montage, everyday, bridal, competition, behind-the-scenes, about, social, brand
downloads/            ← prep & aftercare PDFs (DRAFTS — approve or replace)
sitemap.xml  robots.txt
```

---

## 1. Publish it for free (Cloudflare Pages — recommended)

1. Create a free account at **pages.cloudflare.com**.
2. **Workers & Pages → Create → Pages → Upload assets** (direct upload).
3. Name the project (e.g. `solhaus`) and drag the whole `sol-haus` folder in. Deploy.
4. Your site is live at `https://solhaus.pages.dev`.
5. Optional: **Custom domains** → add a domain you own (domains cost ~$10–15/yr; hosting stays free).
6. To update later: open the project → **Create new deployment** → upload the folder again.

**GitHub Pages alternative:** create a free GitHub account → new public repository → *Add file → Upload files* (drag in everything inside the folder) → *Settings → Pages → Deploy from branch → main / root*. Live at `https://USERNAME.github.io/REPO`.

After you have your final web address, find-and-replace `https://YOUR-DOMAIN.com` in all `.html` files, `sitemap.xml`, `robots.txt` and `config.js`, then submit `sitemap.xml` in Google Search Console (free).

---

## 2. Updating the site yourself

Open `assets/js/config.js` in any text editor (TextEdit in plain-text mode, Notepad, or VS Code). Keep the quotes and commas.

| To change… | Edit in config.js |
|---|---|
| Booking link | `links.booking` (plus optional bridal/competition/group links) |
| Instagram / TikTok | `links.instagram`, `links.tiktok` |
| Google review buttons (Love Letters section) | `links.googleReviewsRead`, `links.googleReviewLeave` |
| Email | `business.email` |
| Prices & descriptions | `services` → `price: "$75"`, `description: "…"` |
| Competition calendar | `events` — copy the example block, remove the `//` |
| Reviews | `reviews` — real reviews only, with permission |
| Announcement bar | `announcement.show` (true/false) and `text` |
| Gift cards | `links.giftCards` — the section appears once filled |

**Photos:** easiest way — save your photo with the *same file name* as a placeholder (e.g. `images/montage/montage-03.jpg`) and replace the file. To add more, put the file in the right folder and add a line to `galleries` in config.js, e.g.
`{ src: "images/bridal/sarah-wedding.jpg", shape: "tall", alt: "Bride with a soft golden glow" },`
Shapes: `tall`, `wide`, `square`, `small` (mixing them creates the editorial collage). Resize photos to ~1600px on the long edge and export as JPG ~80% quality (free: squoosh.app) so the site stays fast.

**Your illustration:** save the original as a transparent PNG at `images/brand/illustration.png` (overwrite the placeholder). It then appears on the homepage, Glow Guide, About and footer automatically. Need a transparent background? Canva's background remover works, or ask me.

**Glow Guide, bridal timeline, competition prep, policies, About text:** edit directly in the `.html` files (search for the wording). Anything in pink dashed boxes on the About/Policies pages is a placeholder for you to fill in.

**Approval tags:** once you've checked all care instructions, set `showApprovalFlags: false`.
**Preview chip:** at launch, set `showSetupNotice: false`.

---

## 3. Forms (free)

1. Make a free account at **formspree.io** (free tier: limited monthly submissions — check their current plan).
2. Create three forms (Bridal, Group, Competition). Copy each endpoint (`https://formspree.io/f/xxxx`) into `forms` in config.js.
3. Submit a test from the live site and confirm the email arrives.

Until an endpoint is added, each form displays a "not connected yet" note and its button is disabled — nothing pretends to send.
**Consent & intake form:** use your booking platform's intake form, or a free Jotform/Google Form, and paste the link into `links.consentForm`. Health information should only be collected there, never by email or on this site.
**Newsletter (optional):** paste a Formspree or Buttondown form endpoint into `forms.newsletter`; a sign-up with consent checkbox appears in the footer.

---

## 4. What's built in

- Full-width continuously moving hero montage (seamless loop, pause button, drag/swipe, pauses off-screen, becomes a swipeable row when "reduce motion" is on)
- Opposite-direction client montage, bridal & competition montages, swipe carousels, editorial asymmetric gallery, Instagram-style grid
- Mobile menu, sticky mobile "Book" button, back-to-top, dismissible announcement bar
- Any link you haven't set yet shows as a dimmed "soon" button — never a dead link
- SEO titles/descriptions per page, social share image, structured data, sitemap, robots.txt
- Keyboard navigation, visible focus, skip link, alt text, accessible forms & accordions

**Fonts:** free Google Fonts — *Bodoni Moda* (stands in for The Seasons / Safira March), *Parisienne* (script), *Cormorant Garamond*, *Jost*. If you own web licences for The Seasons or Safira March, they can be swapped in at the top of `styles.css`.

---

## 5. Go-live checklist

- [ ] Booking link (and optional separate bridal / competition / group links)
- [ ] TikTok URL
- [ ] Google Business Profile "read reviews" and "leave a review" links
- [ ] Real reviews you have permission to post
- [ ] Prices for each service (or keep "Pricing coming soon")
- [ ] Your photos for every folder (with client permission), plus alt text
- [x] Service area: Long Island + all five NYC boroughs
- [x] Instagram (@_solhaus) and email (hangtanspray@gmail.com) added
- [x] Original illustration added (transparent PNG)
- [ ] Approve or edit all prep/aftercare/timeline/FAQ wording, then `showApprovalFlags: false`
- [ ] Replace the two draft PDFs in `/downloads` with approved versions (same file names)
- [ ] Cancellation & booking policy, privacy contact, About page (name, bio, certifications, story)
- [ ] Consent & intake form link; three Formspree endpoints, each tested
- [ ] Competition events (or leave the "dates coming soon" state)
- [ ] Domain → replace `YOUR-DOMAIN.com` everywhere; submit sitemap to Google Search Console
- [ ] Set `showSetupNotice: false`
- [ ] Test on your iPhone: menu, montage swipe, Book buttons, forms
