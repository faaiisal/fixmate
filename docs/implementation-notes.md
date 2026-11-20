# FixMate Production Repository Boilerplate & Project Architecture

**Framework**: Next.js 14+ (App Router), React 18/19, TypeScript 5+, Tailwind CSS 3.4+  
**Design System**: FixMate Luminous Minimalist (`#FCF9F8` canvas, `#F26A36` brand safety orange, `#14121B` high contrast text)  
**State & Data**: TanStack Query v5, Zustand, Lucide React, Framer Motion, Zod

---

## 1. Complete Repository Directory Tree

```
fixmate-platform/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint, TypeCheck, Test, Build pipeline
│       └── deploy.yml             # Preview & Production deployment to Vercel/Cloudflare
├── .husky/
│   ├── pre-commit                 # Lint-staged & typecheck hook
│   └── commit-msg                 # Conventional commit verification
├── public/
│   ├── brand/
│   │   ├── logo.svg               # FixMate hexagonal spark vector logo mark
│   │   ├── logo-wordmark.svg      # FixMate horizontal brand mark
│   │   └── favicon.ico
│   ├── icons/
│   │   └── githube-touch-icon.png
│   └── images/
│       ├── van-sprinter.webp      # Fleet tracking illustration asset
│       └── micro-grid-pattern.svg # Hairline radial dot matrix
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx         # Centered authentication shell with micro-grid
│   │   │   ├── sign-in/
│   │   │   │   └── page.tsx       # Sign In screen (SMS OTP / Passwordless)
│   │   │   └── sign-up/
│   │   │       └── page.tsx       # Sign Up screen (Customer & Tech onboarding)
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx         # Persistent Desktop Left Sidebar & Top Chrome
│   │   │   ├── customer/
│   │   │   │   └── page.tsx       # Customer Booking & Telemetry Tracking Dashboard
│   │   │   ├── technician/
│   │   │   │   ├── page.tsx       # Dispatch, Route & Job Workspace
│   │   │   │   └── custom-service/# Add Custom Service Form view
│   │   │   │       └── page.tsx
│   │   │   ├── admin/
│   │   │   │   └── page.tsx       # System Management, Telemetry & Escrow Console
│   │   │   └── settings/
│   │   │       └── page.tsx       # Profile, Security, Ledger Credentials
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx         # Public Header with Pill Nav & Minimalist Footer
│   │   │   ├── page.tsx           # FixMate Public Homepage
│   │   │   ├── services/
│   │   │   │   ├── page.tsx       # Browse Services catalogue
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Service Details & Repair Request spec
│   │   │   └── about/
│   │   │       └── page.tsx       # About FixMate & How Smart Escrow Works
│   │   ├── (mobile-flows)/
│   │   │   ├── layout.tsx         # Mobile viewport shell (App bar + Bottom actions)
│   │   │   ├── book/
│   │   │   │   ├── step-1-diagnostic/
│   │   │   │   │   └── page.tsx   # Appliance fault selection
│   │   │   │   ├── step-2-schedule/
│   │   │   │   │   └── page.tsx   # Calendar date/time + Geolocation pin
│   │   │   │   └── step-3-escrow/
│   │   │   │       └── page.tsx   # Pre-authorization hold & Review
│   │   │   ├── tracking/
│   │   │   │   └── [workOrderId]/
│   │   │   │       └── page.tsx   # Live GPS Tracker, ETA & Dynamic Island render
│   │   │   └── notifications/
│   │   │       └── page.tsx       # Lockscreen alerts, Proximity PIN & SMS feed
│   │   ├── (system)/
│   │   │   ├── not-found.tsx      # 404 Telemetry with 30s Auto-Disconnect Modal
│   │   │   ├── invoice/
│   │   │   │   └── [invoiceId]/
│   │   │   │       └── page.tsx   # Print-ready tax invoice & PDF export sheet
│   │   │   ├── payment/
│   │   │   │   ├── success/
│   │   │   │   │   └── page.tsx   # Payment & Escrow Lock confirmation
│   │   │   │   └── cancelled/
│   │   │   │       └── page.tsx   # Order cancelled / recovery triage
│   │   │   └── error.tsx          # System boundary error fallback
│   │   ├── api/
│   │   │   ├── escrow/
│   │   │   │   ├── route.ts       # Smart contract escrow hold / release
│   │   │   │   └── verify-pin/
│   │   │   │       └── route.ts   # Doorstep 4-digit safety PIN validation
│   │   │   ├── telemetry/
│   │   │   │   └── transit/
│   │   │   │       └── route.ts   # Real-time WebSocket/SSE location stream
│   │   │   └── invoice/
│   │   │       └── [id]/pdf/
│   │   │           └── route.ts   # Headless chromium / React-PDF generator
│   │   ├── globals.css            # Base Tailwind layers, micro-grid & font variables
│   │   ├── layout.tsx             # Root layout with Sora & Inter font optimization
│   │   └── providers.tsx          # TanStack Query, ThemeProvider, Toast provider
│   ├── components/
│   │   ├── ui/                    # Atomic design primitives
│   │   │   ├── button.tsx         # Primary, Secondary, Outline, Danger variants
│   │   │   ├── telemetry-badge.tsx# Monospace status badges with pulsing LEDs
│   │   │   ├── card-container.tsx # Elevated white cards with 1px border
│   │   │   ├── input.tsx          # Precision form inputs with focus rings
│   │   │   ├── modal-dialog.tsx   # Accessible overlay container (Radix-based)
│   │   │   ├── drawer.tsx         # Mobile slide-out sheet component (Vaul-based)
│   │   │   ├── signature-pad.tsx  # Canvas tap-to-sign escrow release pad
│   │   │   ├── countdown-timer.tsx# 30s auto-disconnect SVG ring timer
│   │   │   └── toast.tsx          # Dynamic route transition & system toasts
│   │   ├── shared/                # Layout modules
│   │   │   ├── navigation-bar.tsx # Top navigation header with brand mark & search
│   │   │   ├── sidebar-nav.tsx    # Left persistent desktop drawer rail
│   │   │   ├── mobile-bottom-bar.tsx # Mobile sticky bottom tab navigation
│   │   │   ├── footer.tsx         # Platform compliance, legal & status indicators
│   │   │   └── dynamic-island.tsx # iOS APNs Live Activity simulator widget
│   │   └── modules/               # Domain-specific components
│   │       ├── invoice-sheet.tsx  # Tax invoice layout with QR code & ledger seal
│   │       ├── live-gps-map.tsx   # Mapbox GL / Leaflet vector technician map
│   │       ├── chat-modal.tsx     # Customer-technician secure messaging box
│   │       └── escrow-summary.tsx # Itemized ledger balance & status pill
│   ├── hooks/
│   │   ├── use-escrow.ts          # State machine for escrow pre-auth & release
│   │   ├── use-telemetry.ts       # Real-time geolocation stream & ETA updates
│   │   ├── use-countdown.ts       # Pausable auto-disconnect session timer
│   │   └── use-toast.ts           # Toast dispatching hook
│   ├── lib/
│   │   ├── tokens.ts              # Exported design tokens typed constants
│   │   ├── utils.ts               # clsx + twMerge utility function
│   │   ├── formatters.ts          # Currency, date, and hash truncator helpers
│   │   └── validations/
│   │       ├── booking.schema.ts  # Zod schema for 3-step repair intake
│   │       └── auth.schema.ts     # Zod schema for login/register credentials
│   ├── types/
│   │   ├── booking.ts             # WorkOrder, ApplianceType, ServiceCategory
│   │   ├── telemetry.ts           # GeoCoords, ETA, TechnicianStatus
│   │   ├── invoice.ts             # InvoiceItem, TaxLedger, SignOffPayload
│   │   └── tokens.ts              # Theme token TypeScript declarations
│   └── styles/
│       └── design-tokens.json     # W3C standard exported tokens from DOCUMENT_4
├── .env.example                   # Environment variable template
├── .eslintrc.json                 # Next.js strict ESLint rules
├── .gitignore                     # Git exclusions
├── .prettierrc                    # Code formatting standard
├── components.json                # shadcn / Radix CLI configuration
├── next.config.mjs                # Next.js optimization configuration
├── package.json                   # Dependencies, engines, and run scripts
├── postcss.config.js              # PostCSS plugins
├── README.md                      # Architecture guide & quick-start instructions
├── tailwind.config.ts             # Complete FixMate Luminous Minimalist theme
└── tsconfig.json                  # Strict TypeScript configuration
```

---

## 2. Core Configuration Files

### `package.json`
```json
{
  "name": "fixmate-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\"",
    "test": "vitest run"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.2",
    "@tanstack/react-query": "^5.51.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "framer-motion": "^11.3.19",
    "lucide-react": "^0.414.0",
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "signature_pad": "^5.0.2",
    "tailwind-merge": "^2.4.0",
    "vaul": "^0.9.1",
    "zod": "^3.23.8",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "@types/node": "^20.14.12",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5",
    "postcss": "^8.4.39",
    "prettier": "^3.3.3",
    "prettier-plugin-tailwindcss": "^0.6.5",
    "tailwindcss": "^3.4.7",
    "typescript": "^5.5.4"
  },
  "engines": {
    "node": ">=18.18.0",
    "npm": ">=9.0.0"
  }
}
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `src/lib/utils.ts`
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function truncateHash(hash: string, start = 6, end = 4): string {
  if (!hash) return '';
  if (hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}
```

### `.env.example`
```bash
# Next.js App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="FixMate Precision Repair Platform"

# Geolocation & Mapping
NEXT_PUBLIC_MAPBOX_TOKEN="pk.mock_mapbox_token_for_telemetry_rendering"

# API & WebSocket Telemetry Gateway
NEXT_PUBLIC_TELEMETRY_WS_URL="wss://telemetry.fixmate.io/v1/stream"
NEXT_PUBLIC_API_GATEWAY_URL="https://api.fixmate.io/v1"

# Smart Escrow Contract Verification
NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS="0x8F2A9C1E991C4A29B0D8"
NEXT_PUBLIC_LEDGER_CHAIN_ID="1"

# SMS Dispatch Conduit
SMS_CARRIER_GATEWAY_SHORTCODE="89432"
```

---

## 3. Quick-Start Implementation Instructions

1. **Clone & Install**:
   ```bash
   git clone https://github.com/your-org/fixmate-platform.git
   cd fixmate-platform
   npm install
   ```
2. **Environment Configuration**:
   ```bash
   cp .env.example .env.local
   ```
3. **Run Development Server**:
   ```bash
   npm run dev
   # Open http://localhost:3000 in your browser
   ```
4. **Build & Typecheck**:
   ```bash
   npm run typecheck
   npm run build
   ```
