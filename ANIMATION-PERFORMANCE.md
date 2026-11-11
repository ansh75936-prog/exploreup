# ExploreUP — Heritage Motion Layer

This release adds a visual and motion layer to the existing ExploreUP site without replacing its current static HTML/JavaScript architecture. The existing district data, Arya AI integration, map, search, favorites/compare, festival and food/travel content remain owned by their current modules.

## Visual direction
- Warm heritage palette: saffron, maroon, cream and muted gold.
- Glass-like discovery panels, soft depth, restrained grain texture and a subtle animated gradient mesh in the hero.
- Stronger focus states, responsive spacing and hover/focus feedback.

## Motion choices
- Native CSS keyframes for hero reveal, mesh drift, shimmer and card transitions.
- IntersectionObserver for one-time reveal-on-scroll.
- requestAnimationFrame scroll progress indicator.
- Pointer tilt is enabled only on fine-pointer devices; touch layouts stay simple.
- No animation is required for content to appear. Reduced-motion users receive static content and no reveal/tilt effects.

## Performance and accessibility
- No new runtime dependency, animation framework or smooth-scroll hijack was added.
- Observers unobserve elements after reveal; scroll updates are throttled with requestAnimationFrame.
- Existing content and feature scripts are not rewritten by this layer.
- Keyboard focus outlines and reduced-motion handling are retained.
- Test target viewports: 360px, 768px, 1024px and 1440px.
- Lighthouse >90 and CLS <0.1 are goals, not claimed results; run Lighthouse on the deployed build before treating them as verified.

## Architecture note
The current repository is a multi-page static HTML/JavaScript application and does not contain a Next.js App Router setup or a package manifest. A full Next.js + Tailwind + Framer Motion + Lenis migration is a separate architectural project. This release deliberately avoids a risky all-at-once migration so existing district guides and Arya AI remain functional.
