---
name: Editorial Intelligence
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#4c4546'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#bb0016'
  on-secondary: '#ffffff'
  secondary-container: '#e32228'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ac'
  on-secondary-fixed: '#410003'
  on-secondary-fixed-variant: '#93000e'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: clamp(48px, 8vw, 104px)
    fontWeight: '800'
    lineHeight: '0.95'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.05'
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-main:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.65'
  label-eyebrow:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.16em
  caption:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  section-v-lg: 200px
  section-v-md: 140px
  gutter-side: 80px
  grid-columns: '12'
  max-width: 1440px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system is a world-class editorial framework for OHOLO HUB, merging the precision of high-end finance with the rhythmic beauty of luxury publishing. It is built to feel institutional yet visionary, catering to a sophisticated B2B audience in Mozambique. 

The aesthetic is **Modern Minimalist with Editorial influence**, prioritizing high-contrast typography, expansive whitespace, and structural integrity. Depth is achieved through layering and scale rather than shadows. The UI behaves like a premium physical publication—confident, quiet, and authoritative.

- **Emotional Response:** Credibility, precision, exclusivity, and cultural resonance.
- **Visual Strategy:** Heavy emphasis on "The Rule of the Line"—using 1px hairlines to define space and "The Power of Red"—using a single vibrant accent to guide the eye through complex data and narratives.

## Colors
The palette is rooted in a high-contrast monochromatic base, punctuated by a singular, aggressive red accent.

- **The Ratio:** 60% White (space), 35% Ink/Black/Grey (structure and content), 5% Red (intent).
- **Ink & Graphite:** Use Ink (#0B0C0E) for large immersive sections or background photography containers to create "voids" of depth. 
- **The Red Accent:** #E01F26 is reserved strictly for active states, primary actions, and micro-labels. It should never be used for large surfaces to maintain its high-value status.
- **The Line:** Use #E4E6E9 for all structural borders. It must be subtle—invisible at a glance but present for organization.

## Typography
This design system utilizes **Inter** as a systematic workhorse, but treats it with editorial flair through extreme contrast in scale and tracking.

- **Display Text:** Headings must be tight. Negative letter-spacing is essential at large sizes to create a cohesive visual "block."
- **Body Text:** Body copy uses a generous line-height (1.65) and is set in Slate (#3A3E44) to reduce eye strain and provide a softer contrast against white backgrounds than pure black.
- **Micro-Typography:** Eyebrows and labels are the heartbeat of the system. They should be uppercase with wide tracking (0.16em) to act as structural markers.

## Layout & Spacing
The layout follows a strict 12-column fluid grid with significant "breathing room."

- **Vertical Rhythm:** Sections are separated by massive vertical paddings (140px to 200px) to force a focus on one concept at a time.
- **Horizontal Margins:** A fixed 80px side margin ensures content never feels cramped, regardless of screen width.
- **The Hairline:** Use 1px #E4E6E9 lines to separate logical sections. These lines should span the full width of their container.
- **Mobile Adaptivity:** At 768px and below, gutters reduce to 24px and vertical spacing scales down by 50%. Headlines must use the `clamp` function defined in typography to ensure legibility.

## Elevation & Depth
In this design system, **shadows are strictly forbidden.** 

- **Layering:** Depth is communicated through color blocking. A white surface over an "Ink" background indicates a higher elevation.
- **The Glass Effect:** While primarily a flat system, a subtle background blur (backdrop-filter) may be used on the fixed navigation bar to allow content to "ghost" beneath it without sacrificing legibility.
- **Structural Borders:** 1px hairlines are the primary tool for defining the boundaries of elements like cards and inputs.

## Shapes
The shape language is a mix of architectural rigidity and modern approachability.

- **Controls:** Buttons, inputs, and tags use a tight **4px radius**. This feels technical and precise.
- **Containers:** Cards and informational modules use a **16px radius**. This softer edge differentiates "content" from "actions."
- **Media:** Photography and video are always **0px (Sharp)** when full-bleed or hero-positioned, mimicking the edges of a printed photograph.

## Components

### Buttons
- **Primary:** Solid Red (#E01F26), White Text, 52px tall, 4px radius. No shadow. On hover, transition to Red Hover (#B0161C).
- **Secondary:** 1px Black outline, Black text, 52px tall. On hover, the button fills solid Black with White text.

### Cards
- **Editorial Card:** White background, 1px Line (#E4E6E9) border, 16px radius. Images within cards must use a 4:3 aspect ratio crop.
- **Interactive Card:** On hover, the border color changes to Graphite (#17191C).

### Navigation
- **Header:** Slim (64px), fixed position. White background with a 1px bottom border. 
- **Progress Indicator:** A 2px Red (#E01F26) progress bar sits on the absolute bottom edge of the header to track scroll depth.

### Inputs
- **Fields:** 1px Line (#E4E6E9) border, 4px radius. On focus, the border turns Black. Error states use the Red Accent (#E01F26) for both the border and a micro-label.

### Lists
- **Data Tables:** No vertical lines. Only horizontal 1px #E4E6E9 hairlines. Header row in uppercase micro-typography (Slate).