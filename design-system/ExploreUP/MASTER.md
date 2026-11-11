# ExploreUP — Master Design System

## Product direction
ExploreUP is an editorial, district-by-district travel guide to Uttar Pradesh. The interface should feel trustworthy, culturally rooted, image-led, easy to scan, and useful on mobile while preserving the existing vanilla HTML/CSS/JavaScript architecture.

## Visual concept
**Heritage editorial + modern travel utility.** Use deep indigo/navy as the trust anchor, warm antique gold for cultural emphasis, paper-white surfaces for readability, and real destination photography. Avoid generic SaaS gradients, excessive glass effects, decorative emoji as primary icons, and oversized empty hero areas.

## Design tokens
| Token | Value | Usage |
|---|---|---|
| Ink / primary text | #102B4D | Headings, core text |
| Deep navy | #08264B | Navigation, hero overlays, primary surfaces |
| Heritage gold | #C9A24B | Highlights, primary accents |
| Paper | #F7F8FB | Page background |
| White | #FFFFFF | Cards and content surfaces |
| Muted | #687B92 | Supporting text |
| Border | #E2E9F2 | Dividers and card outlines |
| Primary blue | #1769C2 | Interactive links and focus states |

## Typography
- Display: Georgia / Georgia-like serif for occasional editorial hero titles and destination storytelling.
- Interface: Inter with system sans-serif fallbacks.
- Body: 16px baseline, line-height 1.5–1.7.
- Labels: 12–14px, semibold; avoid tiny low-contrast body copy.

## Layout and components
- Mobile-first responsive layout; no horizontal page overflow.
- Sticky navigation with clear hierarchy and visible active state.
- Search should be the primary hero action with a visible label/accessible name and clear focus treatment.
- Region cards use distinct but restrained tints and a minimum 44px interaction target.
- Featured destination cards use real, locally hosted destination images and consistent image ratios.
- District discovery is a single-column list to make 75 districts easy to scan; each row uses a real thumbnail, title, concise context, and clear open action.
- Destination detail pages keep a predictable sub-navigation and a clear close/back affordance.
- Preserve Arya AI as an optional assistant; it must not open automatically or obscure navigation.

## Interaction and accessibility
- All interactive targets should be at least 44×44 CSS px where practical.
- Provide keyboard focus-visible styles and semantic button/link roles.
- Never rely on hover as the only interaction cue.
- Use loading feedback for async actions and place errors beside the relevant field.
- Respect prefers-reduced-motion; keep transitions purposeful and subtle.
- Keep text contrast at WCAG AA where possible; provide alt text for informative destination imagery.
- Lazy-load below-the-fold images and set decoding="async"; reserve image dimensions to avoid layout shift.

## Performance
- Prefer local optimized WebP/AVIF/JPEG assets over remote hotlinked images.
- Keep hero imagery eager/high priority; lazy-load district thumbnails.
- Avoid layout shifts by reserving image dimensions/aspect ratios.
- Do not add a new UI framework to this static site without a separate migration decision.

## Anti-patterns
- Do not remove existing destination photos and replace them with generic placeholders.
- Do not introduce duplicate search bars or competing hero CTAs.
- Do not hide focus outlines, disable browser zoom, or use hover-only menus.
- Do not rewrite district data, SEO metadata, authentication, or Arya AI behavior as part of a visual-only change.
- Do not force horizontal scrolling on mobile.

## Implementation source
The UI/UX Pro Max skill is pinned as a Git submodule at `vendor/ui-ux-pro-max-skill` and exposed at `.agents/skills/ui-ux-pro-max`. Initialize it with `git submodule update --init --recursive`.
