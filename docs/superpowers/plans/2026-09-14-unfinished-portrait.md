# The Unfinished Portrait — implementation plan

**Goal:** A reviewable working portfolio using the approved unfinished-portrait narrative, theatrical scroll motion, genuine existing portfolio content, and a separate dramatic library.

**Architecture:** Retain Vite, React, Router and the existing content JSON. Add a shared editorial shell, a narrative home page, and a lazy-loaded Three.js library. Keep existing article routes. Use generated paintings as local assets, GSAP for scroll scenes, and HTML for all readable content and controls.

**Design:** Luminous ivory, antique gold, dark forest green; oversized Cormorant Garamond with restrained Manrope labels. A monumental painted portrait at the entrance, quieter personal introduction, interactive exhibits of real projects, layered experience, and a dark reading room.

**Approved scope:** The user selected the Unfinished Portrait with theatrical staging and requested a working visual first version. They authorize useful libraries. No new factual biography, claimed reading history, or fabricated reviews. Preserve repository data and links. Preview locally for review; deployment is outside this iteration.

- [ ] Root: build `PortraitShell.jsx`, `PortraitPage.jsx`, and `portrait.css`; wire `/`, `/projects`, `/library`, `/library/:slug` in App. Navigation, project selection/details and contact links must work.
- [ ] Asset worker: produce two original painterly backgrounds. Root inspects, copies optimized originals into `public/art`, and records prompts.
- [ ] Library worker: own `LibraryPage.jsx`, `BookScene.jsx`, `library.css`, and `books.js`. Create reusable lit 3D books and pillars, cover/page opening, readable HTML review, direct review URLs and Back/Escape/focus handling. Add a small runnable check for page geometry.
- [ ] Root: build and exercise home scroll, all project choices, library navigation, opening/closing a book, direct review route, mobile layout and reduced motion in browser. Inspect desktop/mobile screenshots and fix visible issues.
- [ ] Reviewer: inspect new motion cleanup, resource disposal, routing, accessibility and preservation of factual content. Root resolves actionable findings and opens the local preview.

## Verification

`npm run build`; the worker's Node check; browser interaction checks at desktop and mobile sizes. No claim of deployment, real reading history or user likeness. The generated figure is allegorical artwork, not a portrait likeness.
