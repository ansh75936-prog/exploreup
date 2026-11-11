# ExploreUP — Modern Heritage Design System

## Product direction
ExploreUP is a district-by-district travel discovery guide for all 75 districts of Uttar Pradesh. The experience combines an editorial travel magazine with practical discovery tools. Preserve the existing static HTML/CSS/JavaScript architecture until a separately approved Next.js migration.

## Design strategy
**Primary pattern:** Storytelling-driven travel discovery.
**Secondary pattern:** Feature-rich destination showcase.
**Supporting treatment:** Restrained glassmorphism for navigation, search, map details and Arya AI only.

The interface should feel culturally rooted, premium but accessible, image-led, trustworthy and easy to use on mobile.

## Brand palette
| Token | Hex | Usage |
|---|---|---|
| Heritage saffron / primary | #A94F0B | Primary actions and emphasis |
| Bright saffron | #FF9933 | Decorative accents and highlights |
| Deep maroon | #5B1F2A | Brand, navigation and editorial sections |
| Deep maroon surface | #3E1020 | Dark surfaces and overlays |
| Antique gold | #8A5A12 | Small accents and separators |
| Warm cream | #FFF8EC | Main page background |
| Sandstone | #F2E6D3 | Secondary surfaces |
| Charcoal ink | #241A18 | Main text |
| Muted brown | #62564F | Supporting text |
| Forest green | #23483D | Nature and eco-travel content |
| White | #FFFFFF | Cards and elevated surfaces |
| Focus blue | #245A78 | Keyboard focus indicator |

Use WCAG AA contrast: 4.5:1 for normal text and 3:1 for large text and meaningful UI graphics. Bright saffron is decorative; use the darker primary saffron for text and controls.

## Typography
- Display: **Playfair Display** (Google Fonts) for hero, district and editorial headings.
- Interface/body: **Inter** for navigation, paragraphs, forms, cards and controls.
- Hindi: **Noto Sans Devanagari** for Hindi and mixed-language content.
- Body: 16px baseline, line-height 1.5–1.75, readable measure around 65–75 characters.
- Use no more than these three families; Devanagari is a language fallback, not a competing brand font.

## Landing page pattern
1. Glass/sticky navigation with clear active and keyboard states.
2. Cinematic hero with destination photography, readable overlay, concise headline and one primary district-search action.
3. District discovery for all 75 districts with search and region filters.
4. Interactive Uttar Pradesh SVG map with keyboard-accessible list alternative.
5. Featured destinations and editorial stories.
6. Experience categories: heritage, spiritual, food, nature, craft, festivals and outdoors.
7. Food trails and festival calendar.
8. Journey planner and shareable itineraries.
9. Optional Arya AI assistant; never auto-open.
10. Practical travel information, essential services and footer.

## Layout and spacing
- 4px base / 8px rhythm.
- Container max: 1280px.
- Desktop gutters: 40–64px; tablet: 24–32px; mobile: 16–20px.
- Section spacing: 72–112px desktop, 48–64px mobile.
- Card radius: 16–24px; controls: 10–14px.
- Mobile bottom navigation: maximum five destinations.
- Touch targets: at least 44 CSS px; aim for 48 CSS px on Android-sized controls.

## Components
- Buttons: primary dark saffron, secondary cream with maroon border, tertiary text action. Include hover, active, focus, disabled and loading states.
- Destination cards: authentic photography, consistent aspect ratio, title, short context, region and clear open action.
- Search: visible accessible label, keyboard suggestions, clear action, empty and no-result states.
- Filters: selected state, clear-all action, mobile-friendly wrapping or horizontal scrolling.
- District list: keep every district discoverable without relying only on the map.
- Icons: one consistent SVG family (Lucide or custom SVG); never use emoji as structural icons.
- Glass: translucent cream/white, moderate blur, subtle border; never compromise text contrast.

## Motion
- Micro-interactions: 150–300ms; tap feedback target 80–150ms.
- Scroll reveals: opacity + 16–24px translate, 250–450ms, stagger related items.
- Card hover: image scale 1.03–1.05 and subtle elevation; hover is never required for mobile.
- Map: restrained district highlight and selected state; no continuous decorative motion.
- Arya: user-triggered panel, short opacity/translate transition.
- Respect prefers-reduced-motion: disable parallax, pointer tilt and continuous animation; preserve functionality.

## Accessibility
- WCAG AA contrast.
- Semantic HTML and logical heading hierarchy.
- Keyboard navigation and visible focus indicators.
- Escape closes menus/dialogs; dialogs manage focus correctly.
- Descriptive labels and alt text.
- SVG icons have accessible names when informative; decorative SVGs are hidden from assistive technology.
- Interactive map has a searchable list alternative.
- No hover-only actions; test at 200% zoom.

## Photography
Use authentic Uttar Pradesh destination, architecture, food, craft, nature and festival imagery. Prefer optimized local WebP/AVIF/JPEG assets. Keep image focal points responsive, provide alt text, reserve aspect ratio, prioritize hero media and lazy-load below-the-fold images.

## Anti-patterns
- Generic AI purple gradients, neon palettes and random gradients.
- Emoji used as navigation or structural icons.
- Mixing unrelated icon families.
- Flat and skeuomorphic visual styles mixed without a system.
- Excessive glassmorphism, shadows, parallax or decorative patterns.
- More than five mobile bottom-navigation items.
- Duplicate search bars, auto-opening assistant, map-only discovery or hover-only controls.
- Tiny touch targets, low-contrast text, hidden focus outlines or disabled zoom.
- Unoptimized giant videos, eager loading every district image, layout shifts and unnecessary JavaScript.

## Implementation notes
- Current production site remains vanilla HTML/CSS/JavaScript. Do not add Next.js, Tailwind or Framer Motion dependencies as part of this visual foundation.
- `css/exploreup-design-system.css` is the production token and accessibility layer.
- Google Fonts are loaded in `index.html`.
- Keep the existing district data, route structure, search, map, authentication, SEO and Arya AI behavior unchanged.
- A future Next.js migration should be a separate project with route-by-route parity and regression tests.
