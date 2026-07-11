---
name: Apex Telemetry
colors:
  surface: '#121220'
  surface-dim: '#121220'
  surface-bright: '#383847'
  surface-container-lowest: '#0d0d1b'
  surface-container-low: '#1a1a28'
  surface-container: '#1e1e2d'
  surface-container-high: '#292938'
  surface-container-highest: '#333343'
  on-surface: '#e3e0f5'
  on-surface-variant: '#e9bcb5'
  inverse-surface: '#e3e0f5'
  inverse-on-surface: '#2f2f3e'
  outline: '#af8781'
  outline-variant: '#5e3f3a'
  surface-tint: '#ffb4a8'
  primary: '#ffb4a8'
  on-primary: '#680200'
  primary-container: '#e10600'
  on-primary-container: '#fff2f0'
  inverse-primary: '#c00500'
  secondary: '#c7c5d2'
  on-secondary: '#302f39'
  secondary-container: '#494853'
  on-secondary-container: '#b9b7c3'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#6f7070'
  on-tertiary-container: '#f5f5f5'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410100'
  on-primary-fixed-variant: '#930300'
  secondary-fixed: '#e4e1ee'
  secondary-fixed-dim: '#c7c5d2'
  on-secondary-fixed: '#1b1b24'
  on-secondary-fixed-variant: '#464650'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#121220'
  on-background: '#e3e0f5'
  surface-variant: '#333343'
typography:
  headline-lg:
    fontFamily: Anybody
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Anybody
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  data-display:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: -0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  bento-gap: 12px
---

## Brand & Style
The design system is engineered for the high-velocity, data-dense environment of Formula 1 analytics. It balances **Technological Brutalism** with **Modern Glassmorphism** to evoke a sense of precision and high-performance engineering. The aesthetic mimics the cockpit of a racing machine: raw, functional, and unapologetically bold.

The target audience consists of engineers, analysts, and enthusiasts who require split-second data comprehension. The UI evokes a feeling of being "on the edge"—intense, focused, and authoritative. Heavy card structures provide a "bento box" organizational logic, ensuring that even with massive datasets, the interface remains legible and modular.

## Colors
The palette is rooted in the high-contrast world of motorsports. 
- **Primary (Racing Red):** Used sparingly for critical alerts, "live" indicators, and active states. It represents the heat and energy of the track.
- **Secondary (Charcoal Black):** The foundation of the UI, providing a deep, non-distracting background that reduces eye strain during night-time race sessions.
- **Slate Grays:** Utilized for card backgrounds and borders to create structural separation.
- **High-Contrast White:** Reserved for telemetry values and primary labels to ensure maximum glanceability.

## Typography
Typography in this design system is split between **Aggression** and **Precision**.
- **Headlines (Anybody):** A wide, variable sans-serif that captures the "speed" aesthetic of trackside branding. Use heavy weights and tight tracking for impact.
- **Body (Hanken Grotesk):** Provides a clean, contemporary contrast to the brutalist headers, ensuring longer analytical reports remain readable.
- **Telemetry (JetBrains Mono):** Used for all numerical data, coordinates, and timestamps. The monospaced nature ensures that fluctuating numbers don't cause layout shifts during live updates.

## Layout & Spacing
The layout follows a **Bento Box** philosophy—modular, rectangular containers that fit together into a rigid grid. 

- **Grid:** Use a 12-column grid for desktop and a 4-column grid for mobile.
- **Bento Structure:** Components should have fixed aspect ratios where possible to maintain the "grid-fill" look. 
- **Adaptation:** On mobile, bento boxes stack vertically. On desktop, they leverage CSS Grid `grid-template-areas` to create a mosaic of data. Use a consistent 12px gap between all cards to maintain the brutalist, structured feel.

## Elevation & Depth
Depth is created through **Layered Glassmorphism** rather than traditional shadows.
- **Surface 0:** Deep Charcoal (#15151E) solid background.
- **Surface 1 (Cards):** Semi-transparent Slate Gray (#2B2B3A at 60% opacity) with a `20px` backdrop-blur. 
- **Borders:** Every card must have a sharp, 1px solid border (#FFFFFF at 10% opacity) to define its silhouette against the dark background.
- **Floating Navigation:** The top bar uses a more aggressive blur (40px) and a slightly higher opacity to appear as if it is hovering over the data stream.

## Shapes
The shape language is **Strictly Sharp**. 
- To reinforce the Brutalist and high-performance engineering theme, all containers, buttons, and input fields use a 0px border radius. 
- The only exception is the "Circular G-Force" or "Tire Wear" visualizations, where geometry is dictated by the data type.

## Components
- **Telemetry Cards:** The core component. Features a JetBrains Mono "Label-sm" in the top left, a large "Data-display" value in the center, and a micro-sparkline at the bottom.
- **Brutalist Buttons:** Sharp 0px corners. Primary buttons are solid Racing Red with White text. Secondary buttons are Ghost-style with a 1px White border.
- **Navigation Bar:** A floating, glassmorphic pill-shaped container (though with sharp internal edges) that sits at the top of the viewport.
- **Data Points:** Interactive nodes on charts should "glow" with a Primary Red outer shadow on hover, signaling technical focus.
- **Segmented Control:** Used for switching between "Practice," "Qualifying," and "Race." Sharp boxes with solid red fills for active states.
- **Status Chips:** Small, rectangular blocks for "DRS Enabled" or "PIT" status. These use the Racing Red primary color with high-frequency pulsing animations for live events.