---
name: Editorial Intelligence
colors:
  surface: '#f7f9ff'
  surface-dim: '#d7dae1'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4fb'
  surface-container: '#ebeef5'
  surface-container-high: '#e5e8ef'
  surface-container-highest: '#dfe3e9'
  on-surface: '#181c21'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2d3136'
  inverse-on-surface: '#eef1f8'
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
  tertiary-container: '#1b1c1e'
  on-tertiary-container: '#848386'
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
  tertiary-fixed: '#e3e2e5'
  tertiary-fixed-dim: '#c7c6c9'
  on-tertiary-fixed: '#1b1c1e'
  on-tertiary-fixed-variant: '#464749'
  background: '#f7f9ff'
  on-background: '#181c21'
  surface-variant: '#dfe3e9'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 80px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 19px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  max_width: 1440px
  columns: '12'
  gutter: 24px
  margin: 80px
  hairline: 1px
---

## Brand & Style

The design system embodies a world-class B2B editorial authority. It is designed to feel institutional yet modern, prioritizing clarity, precision, and high-impact information density. The aesthetic draws heavily from **Minimalism** and **Modern Corporate** styles, utilizing a strict grid and high-contrast typography to evoke the feeling of a premium digital broadsheet.

The emotional response is one of confidence and intelligence. The interface remains quiet, allowing the content—"the intelligence"—to take center stage, punctuated only by sharp structural lines and a singular, aggressive accent color for strategic calls to action.

## Colors

The color palette is anchored in a monochromatic "Ink and Paper" foundation. 

- **Primary & Surface:** Use `White` for the canvas and `Ink` or `Black` for primary text and heavy navigation elements. `Mist` provides subtle background differentiation for secondary sections.
- **Accent:** `Red` is reserved strictly for primary actions, critical alerts, or live editorial indicators. It should be used sparingly to maintain its impact.
- **UI Chrome:** `Graphite` and `Slate` are used for secondary text and UI controls. `Line` is used for the ubiquitous 1px hairline rules that define the structure.

## Typography

This design system uses a sophisticated pairing of **Newsreader** for editorial expression and **Inter** for functional clarity.

- **Display & Headings:** Utilize Newsreader with tight tracking (`-0.02em` to `-0.04em`) and minimal line-height to create a "dense" editorial look. High contrast between weights is encouraged.
- **Body:** Inter is set at a generous `17px` to `19px` to ensure legibility during long-form reading. Color should be set to `Slate` to reduce eye strain against pure white backgrounds.
- **Labels:** Use Inter in Bold, Uppercase, with slightly increased letter spacing for category tags and metadata.
- **Language Note:** Ensure all typographic scales accommodate Portuguese (pt-PT) character accents (e.g., *Ações*, *Relatórios*) without clipping.

## Layout & Spacing

The layout is governed by a **Fixed Grid** system centered on a 1440px maximum width. 

- **Grid:** A 12-column structure with 24px gutters. Outer margins are a generous 80px on desktop to provide "breathing room" that signifies premium positioning.
- **Dividers:** Use 1px hairline rules in `Line` or `Mist` to separate content blocks, mimicking the structure of a high-end newspaper. Avoid using shadows for separation.
- **Mobile Adaptivity:** On mobile, margins reduce to 20px, and the grid collapses to a single column. Spacing between sections should remain vertical and rhythmic (multiples of 8px).

## Elevation & Depth

In keeping with the "Institutional Editorial" style, depth is conveyed through **Tonal Layers** and **Low-Contrast Outlines** rather than traditional shadows.

- **Flat Hierarchy:** Elements exist on a flat plane. Depth is suggested by subtle shifts in background color (e.g., an `Ink` header over a `White` body).
- **Overlays:** Modals and menus use a sharp 1px border (`Line`) and a very slight, high-spread neutral shadow to lift them only slightly from the base layer.
- **Containment:** Use the 1px hairline rule to define containers. Surfaces like cards should rarely have a different background color than the main canvas unless they are used for "Sidebars" or "Callouts," in which case `Mist` is the preferred fill.

## Shapes

The shape language is disciplined and geometric. 

- **Base Radius:** Most functional elements (inputs, small buttons) use a `4px` (0.25rem) radius to maintain a professional, sharp-edged feel.
- **Container Radius:** Larger containers or featured cards may use a `16px` (1rem) radius to soften the composition where editorial content is more lifestyle-focused.
- **Interactive Elements:** Strict rectangular forms are preferred for a more "built" and architectural look.

## Components

- **Buttons:** 
  - *Primary:* Solid `Red` or `Black` fill, white text, 4px radius. No gradients.
  - *Secondary:* 1px `Line` border, `Black` text, transparent background.
- **Input Fields:** 1px `Line` border, `White` fill. Focus state uses a 1px `Black` border. Labels are always `label-sm` (uppercase) positioned above the field.
- **Cards:** No shadows. Defined by 1px `Line` borders. Padding should be generous (min 24px) to ensure an airy, editorial feel.
- **Chips/Tags:** Small, rectangular (2px radius), `Mist` background with `Slate` text. Used for categorization.
- **Data Tables:** High-density, using `1px` horizontal rules only. Row hover state should be a subtle `Mist` fill.
- **Lists:** Clean vertical stacks separated by 1px hairlines. Use chevron-right icons for navigation-heavy lists.