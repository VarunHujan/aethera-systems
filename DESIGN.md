# Design System: The Celestial Horizon
**Project Name**: Mystic Ruin Environment (`14317669333063472973`)

## 1. Creative North Star: "The Ethereal Command"
A high-end, editorial dashboard experience for 3D browser gaming. Focuses on **Intentional Asymmetry**, **Tonal Depth**, and **Atmospheric Immersion**.

## 2. Color Palette
Rooted in deep space blacks and vibrant cyan accents.

| Role | Hex Code | Description |
| :--- | :--- | :--- |
| **Background** | `#060e20` | The primary void color. |
| **Primary** | `#6dddff` | Active states and glowing elements. |
| **Secondary** | `#d8e3fb` | Supporting information. |
| **Tertiary** | `#47c4ff` | Secondary actions. |
| **Surface** | `#060e20` | Base layer for UI. |
| **Surface High** | `#141f38` | Active modules and panels. |
| **Outline** | `#6d758c` | Subtle boundaries. |

### Design Rules for Color:
- **The "No-Line" Rule**: Avoid 1px borders. Use background color shifts to define zones.
- **Glassmorphism**: Apply `surface-variant` at 40% opacity with `backdrop-filter: blur(20px)` for floating modules.
- **Gradients**: Use `primary` (#6dddff) to `primary-dim` (#00c3eb) at 135° for CTAs.

## 3. Typography
Pairs technical precision with hyper-readability.

| Category | Font Family | Usage |
| :--- | :--- | :--- |
| **Headlines** | `Space Grotesk` | Editorial anchors and player stats. |
| **Body / Data** | `Inter` | All interactive text and metadata. |

- **Scale Contrast**: Pair large `display-sm` headlines with tiny `label-md` subheaders.

## 4. Layout & Spacing
- **Spacing Scale**: `1`
- **Standard Padding**: Use **24px** vertical padding for stat groups.
- **Elevation**: Use **Tonal Layering** (stacking darker containers inside lighter backgrounds) instead of traditional shadows.

## 5. UI Components
- **Buttons**: Gradient fill, `sm` roundedness, subtle outer glow.
- **HUD Modules**: Semi-transparent containers with "bracket" details (2px vertical lines on edges).
- **Inputs**: `surface-container-lowest` background with a bottom-only neon cyan border.

## 6. Do's and Don'ts
- **DO**: Use asymmetry and extreme negative space.
- **DON'T**: Use pure white (#FFFFFF). Use `on-surface` (#dee5ff) instead.
- **DON'T**: Use rounded corners larger than 8px (keep it professional and sharp).
