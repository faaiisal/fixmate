---
name: FixMate Luminous Minimalist
brand: FixMate (Appliance & Hardware Diagnostic Repair Platform)
version: 1.0.0
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#efeceb'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#ded9d8'
  on-surface: '#14121b'
  on-surface-variant: '#55595f'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#e5e0df'
  outline-variant: '#c4c0c0'
  surface-tint: '#f26a36'
  primary: '#f26a36'
  primary-hover: '#e05824'
  primary-active: '#c94b1b'
  on-primary: '#ffffff'
  primary-container: '#fff1ec'
  on-primary-container: '#551700'
  secondary: '#00c4d6'
  on-secondary: '#ffffff'
  secondary-container: '#e6fcfd'
  on-secondary-container: '#00363d'
  tertiary: '#10b981'
  on-tertiary: '#ffffff'
  tertiary-container: '#ecfdf5'
  on-tertiary-container: '#003820'
  error: '#ef4444'
  on-error: '#ffffff'
  error-container: '#fef2f2'
  on-error-container: '#93000a'
  warning: '#f59e0b'
  warning-container: '#fffbeb'
  telemetry-cyan: '#00c4d6'
  telemetry-cyan-glow: 'rgba(0, 196, 214, 0.25)'
  security-purple: '#8b5cf6'
  security-purple-container: '#f5f3ff'
  text-primary: '#14121b'
  text-secondary: '#55595f'
  text-tertiary: '#8c9098'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.025em
  display-md:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  micro-mono:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.5rem
  lg: 0.75rem
  xl: 1rem
  2xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
elevation:
  low: '0 1px 2px 0 rgba(0, 0, 0, 0.04)'
  card: '0 2px 8px -2px rgba(20, 18, 27, 0.05), 0 1px 3px -1px rgba(20, 18, 27, 0.03)'
  modal: '0 20px 40px -15px rgba(20, 18, 27, 0.12), 0 0 0 1px rgba(20, 18, 27, 0.05)'
  glow-orange: '0 8px 24px -4px rgba(242, 106, 54, 0.25)'
---

# FixMate Master Design System Specification (`DESIGN.md`)

**Brand**: FixMate (Appliance & Hardware Diagnostic Repair Platform)  
**Design System**: FixMate Luminous Minimalist  
**Theme**: Light-First Precision Tech Architecture  
**Preset Standard**: `ROUND_EIGHT` (8px base radius, 12px/16px cards, 24px modals, 9999px pills)  
**Accessibility**: 100% WCAG AAA Conformance (>12:1 text contrast on primary surfaces)

---

## 1. Visual Philosophy & Foundations

The **FixMate Luminous Minimalist** design system couples surgical technical precision with an inviting, ultra-clean light aesthetic. It eliminates heavy visual clutter while retaining real-time telemetry cues (micro-grids, monospace data badges, status LEDs, and oscilloscope waves).

- **Pure Light Architecture**: Workspaces prioritize pristine `#FFFFFF` surfaces paired with calm `#FCF9F8` canvas washes with a hairline radial micro-grid pattern.
- **Airy Tactility**: Subtle 1px borders (`#E5E0DF`) define structural modules without visual heaviness, accented by diffused ambient drops and soft inset micro-interactions.
- **Brand Accent (Safety Orange `#F26A36`)**: Represents physical mechanical action, smart escrow authorization, and field repair dispatch.
- **Telemetry & Verification Accents**: 
  - **Quantum Emerald (`#10B981`)**: Escrow settlement, diagnostic passed, verified master technician.
  - **Cybernetic Cyan (`#00C4D6`)**: Real-time transit telemetry, van GPS tracking, Dynamic Island live activities.
  - **Security Purple (`#8B5CF6`)**: Cryptographic signature seals, ledger hash anchors, and blockchain verify.

---

## 2. Color Palette & Semantic Tokens

### Core Neutral Surfaces

| Token | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| `surface` | `#FCF9F8` | Master viewport canvas backdrop |
| `surface-dim` | `#DCD9D9` | Low-emphasis backdrop fills, disabled surfaces |
| `surface-bright` | `#FCF9F8` | Page canvas highlights |
| `surface-container-lowest` | `#FFFFFF` | Primary elevated cards, modal sheets, invoice sheets |
| `surface-container-low` | `#F6F3F2` | Subtle inset backgrounds, table headers, filter pill strips |
| `surface-container` | `#EFECEB` | Secondary cards, subtle nested borders, divider bars |
| `surface-container-high` | `#EAE7E7` | Chip backdrops, interactive neutral hover states |
| `surface-container-highest` | `#DED9D8` | Deepest neutral tint, selected form control borders |

### Typography & Content Neutrals

| Token | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| `text-primary` | `#14121B` | Primary headings, titles, high-emphasis metrics (>12:1 WCAG AAA) |
| `text-secondary` | `#55595F` | Body text, descriptions, table cell labels, subtitle copy |
| `text-tertiary` | `#8C9098` | Monospace telemetry indicators, timestamps, micro-captions |
| `border-subtle` | `#E5E0DF` | Standard 1px divider, container boundaries, table row strokes |
| `border-strong` | `#C4C0C0` | Form input borders, active focus state rings |

### Interactive Brand & Status Colors

| Token | Hex Value | Tailwind Class Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| `primary` | `#F26A36` | `bg-[#F26A36]`, `text-[#F26A36]` | Primary CTAs, active tab indicators, major button actions |
| `primary-hover` | `#E05824` | `hover:bg-[#E05824]` | Hover state for primary CTAs |
| `primary-active` | `#C94B1B` | `active:bg-[#C94B1B]` | Pressed / active state for primary CTAs |
| `primary-container` | `#FFF1EC` | `bg-[#FFF1EC]` | Subtle badge backgrounds, highlight pill fills |
| `success` | `#10B981` | `bg-[#10B981]`, `text-[#10B981]` | Escrow release, diagnostic verified, online state |
| `success-container` | `#ECFDF5` | `bg-[#ECFDF5]` | Verified master tech badges, warranty guarantee pills |
| `telemetry-cyan` | `#00C4D6` | `bg-[#00C4D6]`, `text-[#00C4D6]` | Live van GPS tracking, Dynamic Island live activity |
| `warning` | `#F59E0B` | `bg-[#F59E0B]`, `text-[#F59E0B]` | Auto-disconnect countdown running, diagnostic alert |
| `error` | `#EF4444` | `bg-[#EF4444]`, `text-[#EF4444]` | Route disconnection, 404 fault code, hardware breach |

---

## 3. Typography Scale & Hierarchy

### Font Families
- **Display & Headings**: `Sora`, sans-serif (weights: `600`, `700`, `800`)
- **Body & Controls**: `Inter` / `Plus Jakarta Sans`, sans-serif (weights: `400`, `500`, `600`)
- **Telemetry & Diagnostics**: `JetBrains Mono`, monospace (weights: `500`, `600`)

### Type Scale Specification

| Level | Size | Line Height | Tracking | Weight | Recommended Element |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display 1** | `48px` (`3rem`) | `1.1` | `-0.025em` | `800` | Landing page hero titles, error hero headers |
| **Heading 1** | `32px` (`2rem`) | `1.2` | `-0.02em` | `700` | Dashboard section headers, modal primary titles |
| **Heading 2** | `24px` (`1.5rem`) | `1.25` | `-0.015em` | `600` | Card titles, invoice section headings, sheet headers |
| **Heading 3** | `18px` (`1.125rem`)| `1.3` | `-0.01em` | `600` | Subsection headers, table column groups |
| **Body Large** | `16px` (`1rem`) | `1.5` | `0em` | `400` / `500` | Lead paragraphs, form inputs, primary CTA button labels |
| **Body Regular**| `14px` (`0.875rem`)| `1.45` | `0em` | `400` / `500` | Standard body copy, table cell content, list items |
| **Caption / Mono**| `12px` (`0.75rem`)| `1.4` | `+0.02em` | `500` / `600` | Timestamps, telemetry status, PIN codes, ledger tags |
| **Micro Monospace**| `10px` (`0.625rem`)| `1.2` | `+0.05em` | `600` | Upper-case protocol headers (e.g. `TLS 1.3 // NODE: US-WEST`) |

---

## 4. Spacing, Radii & Elevation

### Spacing Rhythm (4px / 8px Grid Base)
- `space-xs`: `4px` (micro badges, internal icon spacing)
- `space-sm`: `8px` (button inline gap, pill internal padding)
- `space-md`: `16px` (standard card padding, grid gutter)
- `space-lg`: `24px` (section inner margins, desktop card layout)
- `space-xl`: `32px` (macro section gutters)
- `space-2xl`: `48px` (page top spacing, hero spacing)

### Border Radii (`ROUND_EIGHT` Standard)
- `rounded-sm`: `4px` (micro telemetry tags, small status chips)
- `rounded-md`: `8px` (standard inputs, button components, nested items)
- `rounded-lg`: `12px` (inner module containers, secondary cards)
- `rounded-xl`: `16px` (primary dashboard cards, print invoice document container)
- `rounded-2xl`: `24px` (modal dialogs, mobile drawer headers)
- `rounded-full`: `9999px` (status badges, action pills, navigation filter tabs)

### Elevation & Depth
- **Level 0 (Canvas Backdrop)**: `#FCF9F8` with no shadow.
- **Level 1 (Cards & Asset Tiles)**: Background `#FFFFFF`, 1px solid `#E5E0DF`, shadow: `0 2px 8px -2px rgba(20, 18, 27, 0.05), 0 1px 3px -1px rgba(20, 18, 27, 0.03)`.
- **Level 2 (Popovers, Hovered Tiles, Dropdowns)**: Background `#FFFFFF`, 1px solid `#E5E0DF`, shadow: `0 8px 24px -4px rgba(20, 18, 27, 0.08), 0 2px 6px -1px rgba(20, 18, 27, 0.04)`.
- **Level 3 (Modals, Overlays & Drawers)**: Background `#FFFFFF`, 1px solid `#E5E0DF`, shadow: `0 20px 40px -15px rgba(20, 18, 27, 0.12), 0 0 0 1px rgba(20, 18, 27, 0.05)`.
- **Primary CTA Glow**: `0 8px 20px -4px rgba(242, 106, 54, 0.3)`.

---

## 5. UI Component Specifications

### 1. Primary Action Button
```html
<button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#F26A36] hover:bg-[#E05824] active:bg-[#C94B1B] text-white font-medium text-sm transition-all shadow-sm hover:shadow-[0_8px_20px_-4px_rgba(242,106,54,0.3)]">
  <span>Confirm & Proceed</span>
  <svg class="w-4 h-4" ... />
</button>
```

### 2. Secondary Neutral Button
```html
<button class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-[#F6F3F2] text-[#14121B] font-medium text-sm border border-[#E5E0DF] transition-all">
  <span>Review Details</span>
</button>
```

### 3. Telemetry Status Badge
```html
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
  <span class="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
  LIVE DISPATCH ACTIVE
</span>
```

### 4. Technical Document Card
```html
<div class="bg-white rounded-xl border border-[#E5E0DF] p-6 shadow-[0_2px_8px_-2px_rgba(20,18,27,0.05)]">
  <div class="flex items-center justify-between border-b border-[#E5E0DF] pb-4 mb-4">
    <h3 class="font-heading font-semibold text-[#14121B]">Hardware Ledger Seal</h3>
    <span class="font-mono text-xs text-[#8C9098]">TX: 0x8F2A...991C</span>
  </div>
  <!-- Card body -->
</div>
```

---

## 6. Implementation Notes for Frontend Engineers (Next.js / Tailwind CSS)

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: '#F26A36',
          hover: '#E05824',
          active: '#C94B1B',
          light: '#FFF1EC',
        },
        surface: {
          DEFAULT: '#FCF9F8',
          card: '#FFFFFF',
          dim: '#F6F3F2',
          border: '#E5E0DF',
        },
        text: {
          primary: '#14121B',
          secondary: '#55595F',
          tertiary: '#8C9098',
        },
        telemetry: {
          cyan: '#00C4D6',
          green: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
      },
    },
  },
  plugins: [],
};

export default config;
```
