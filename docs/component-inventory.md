# FixMate Component Storybook & Design System Catalog
**Design System**: Luminous Minimalist (`ROUND_EIGHT` standard)  
**Theme**: Light / Precision Hardware Diagnostic & Smart Escrow  
**Frameworks**: React 18/19, Next.js 14+ App Router, Tailwind CSS 3.4+, Radix UI Primitives  
**Accessibility**: WCAG AAA Conformance (>12:1 heading contrast, 44px minimum tap targets)

---

## 1. Storybook Architecture & Directory Organization

```
.storybook/
├── main.ts                    # Storybook Next.js framework configuration
├── preview.ts                 # Theme providers, Sora & Inter fonts, background decorators
└── fixmate-theme.ts           # Custom Storybook manager UI matching Luminous Minimalist

src/components/
├── ui/
│   ├── button/
│   │   ├── button.tsx
│   │   └── button.stories.tsx
│   ├── telemetry-badge/
│   │   ├── telemetry-badge.tsx
│   │   └── telemetry-badge.stories.tsx
│   ├── card-container/
│   │   ├── card-container.tsx
│   │   └── card-container.stories.tsx
│   ├── input/
│   │   ├── input.tsx
│   │   └── input.stories.tsx
│   ├── countdown-timer/
│   │   ├── countdown-timer.tsx
│   │   └── countdown-timer.stories.tsx
│   └── signature-pad/
│       ├── signature-pad.tsx
│       └── signature-pad.stories.tsx
├── shared/
│   ├── dynamic-island/
│   │   ├── dynamic-island.tsx
│   │   └── dynamic-island.stories.tsx
│   ├── modal-dialog/
│   │   ├── sign-out-modal.tsx
│   │   └── sign-out-modal.stories.tsx
│   └── invoice-sheet/
│       ├── invoice-sheet.tsx
│       └── invoice-sheet.stories.tsx
```

---

## 2. Storybook Global Decorator & Preview Setup (`.storybook/preview.ts`)

```typescript
import type { Preview } from '@storybook/react';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'FixMate Luminous Canvas',
      values: [
        { name: 'FixMate Luminous Canvas', value: '#FCF9F8' },
        { name: 'Pure Container White', value: '#FFFFFF' },
        { name: 'Subtle Inset Low', value: '#F6F3F2' },
      ],
    },
    viewport: {
      viewports: {
        mobileSmall: { name: 'iPhone SE (375px)', styles: { width: '375px', height: '667px' } },
        mobileStandard: { name: 'iPhone 15 Pro (393px)', styles: { width: '393px', height: '852px' } },
        tablet: { name: 'iPad Mini (768px)', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop HD (1440px)', styles: { width: '1440px', height: '900px' } },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="font-sans antialiased text-[#14121B] p-6 min-h-screen bg-[#FCF9F8]">
        <Story />
      </div>
    ),
  ],
};

export default preview;
```

---

## 3. Core Component Stories & Interactive Specs

### Story 1: `PrimaryButton.stories.tsx`
*Atomic action primitive supporting escrow triggers, booking confirmation, and route navigation.*

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { PrimaryButton } from './button';
import { ShieldCheck, ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';

const meta: Meta<typeof PrimaryButton> = {
  title: 'Atomic Primitives/PrimaryButton',
  component: PrimaryButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'danger'],
      description: 'Visual semantic style',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Padding and font scale rhythm',
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof PrimaryButton>;

export const DefaultEscrowRelease: Story = {
  args: {
    children: 'Sign & Release Escrow ($554.75)',
    variant: 'primary',
    size: 'lg',
    icon: <ShieldCheck className="w-5 h-5 text-white" />,
  },
};

export const SecondaryNeutral: Story = {
  args: {
    children: 'View Itemized Breakdown',
    variant: 'secondary',
    size: 'md',
  },
};

export const OutlineState: Story = {
  args: {
    children: 'Doorstep Verification PIN',
    variant: 'outline',
    size: 'md',
  },
};

export const LoadingState: Story = {
  args: {
    children: 'Authorizing Contract Hold...',
    variant: 'primary',
    size: 'md',
    isLoading: true,
  },
};

export const DangerDisconnect: Story = {
  args: {
    children: 'Terminate Active Session',
    variant: 'danger',
    size: 'md',
    icon: <AlertTriangle className="w-4 h-4 text-white" />,
  },
};
```

---

### Story 2: `TelemetryBadge.stories.tsx`
*Real-time hardware status indicators, dispatch stages, and cryptographic protocol seals.*

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { TelemetryBadge } from './telemetry-badge';

const meta: Meta<typeof TelemetryBadge> = {
  title: 'Atomic Primitives/TelemetryBadge',
  component: TelemetryBadge,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error', 'purple'],
      description: 'Telemetry state and color tinting',
    },
    pulse: { control: 'boolean', description: 'Animated LED strobe indicator' },
    mono: { control: 'boolean', description: 'JetBrains Mono monospace font' },
  },
};

export default meta;
type Story = StoryObj<typeof TelemetryBadge>;

export const LiveDispatchActive: Story = {
  args: {
    label: 'LIVE DISPATCH ACTIVE',
    type: 'info',
    pulse: true,
    mono: true,
  },
};

export const EscrowPreAuthSecured: Story = {
  args: {
    label: 'ESCROW HOLD SECURED',
    type: 'success',
    pulse: false,
    mono: true,
  },
};

export const AutoDisconnectTimerAlert: Story = {
  args: {
    label: 'AUTO-DISCONNECT IN 30S',
    type: 'warning',
    pulse: true,
    mono: true,
  },
};

export const RouteDisconnection: Story = {
  args: {
    label: 'FAULT 404: CIRCUIT UNREACHABLE',
    type: 'error',
    pulse: false,
    mono: true,
  },
};

export const CryptographicLedgerAnchor: Story = {
  args: {
    label: 'LEDGER TX // 0x8F2A...991C',
    type: 'purple',
    pulse: false,
    mono: true,
  },
};
```

---

### Story 3: `CountdownTimer.stories.tsx`
*Animated 30-second circular countdown SVG with pause, resume, and cancellation events.*

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { CountdownTimer } from './countdown-timer';

const meta: Meta<typeof CountdownTimer> = {
  title: 'Interactive Systems/CountdownTimer',
  component: CountdownTimer,
  tags: ['autodocs'],
  argTypes: {
    durationSeconds: { control: { type: 'number', min: 5, max: 120, step: 5 } },
    autoStart: { control: 'boolean' },
    strokeColor: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof CountdownTimer>;

export const Default30SecondDisconnect: Story = {
  args: {
    durationSeconds: 30,
    autoStart: true,
    strokeColor: '#F26A36',
    onComplete: () => alert('Session automatically terminated.'),
  },
};

export const PausedState: Story = {
  args: {
    durationSeconds: 30,
    autoStart: false,
    strokeColor: '#8C9098',
  },
};
```

---

### Story 4: `DynamicIslandLiveActivity.stories.tsx`
*Simulated iOS APNs Dynamic Island & Lockscreen Live Activity tracker component.*

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { DynamicIsland } from '../shared/dynamic-island';

const meta: Meta<typeof DynamicIsland> = {
  title: 'Mobile Modules/DynamicIslandLiveActivity',
  component: DynamicIsland,
  tags: ['autodocs'],
  parameters: {
    viewport: { defaultViewport: 'mobileStandard' },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicIsland>;

export const TechnicianEnRouteExpanded: Story = {
  args: {
    technicianName: 'Marcus Vance',
    workOrderId: 'WO-7719-BL',
    etaMinutes: 8,
    distanceMiles: 1.4,
    vanIdentifier: 'Van #14 (Sprinter)',
    vehiclePlate: '7XYZ918',
    verificationPin: '4829',
    mode: 'expanded',
  },
};

export const CompactPillNavbar: Story = {
  args: {
    technicianName: 'Marcus Vance',
    etaMinutes: 8,
    mode: 'compact',
  },
};
```

---

### Story 5: `TaxInvoiceSheet.stories.tsx`
*Print-ready legal tax invoice with cryptographic hash seal, QR code verification, and itemized ledger.*

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { InvoiceSheet } from '../modules/invoice-sheet';

const meta: Meta<typeof InvoiceSheet> = {
  title: 'Enterprise Documents/InvoiceSheet',
  component: InvoiceSheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof InvoiceSheet>;

export const CompletedRefrigeratorRepair: Story = {
  args: {
    invoiceNumber: 'INV-2024-8891',
    workOrderId: 'WO-7719-BL',
    customerName: 'Eleanor Vance',
    technicianName: 'Marcus Vance (Master Certified)',
    date: 'Oct 24, 2024',
    applianceModel: 'Samsung Bespoke 4-Door French Door Refrigerator',
    items: [
      { id: '1', description: 'Inverter Linear Compressor (OEM)', quantity: 1, unitPrice: 280.00 },
      { id: '2', description: 'R600a Refrigerant Charge & Filter Drier', quantity: 1, unitPrice: 84.75 },
      { id: '3', description: 'Precision Diagnostic & System Evacuation Labor', quantity: 1.5, unitPrice: 190.00 },
    ],
    subtotal: 554.75,
    tax: 0.00,
    escrowReleased: true,
    txHash: '0x8F2A9C1E991C4A29B0D88319F47C6201B73A4109',
  },
};
```

---

## 4. Component Review & Quality Audit Checklist

| Component Name | Category | Accessibility & Contrast | Mobile Responsive | Storybook Controls Status |
|---|---|---|---|---|
| **`PrimaryButton`** | Atomic Primitive | ✅ WCAG AAA (>12:1 text-on-surface, 4.5:1 brand-to-white) | 44px touch targets; active scale states | Full variant, size, loading & disabled args |
| **`TelemetryBadge`** | Atomic Primitive | ✅ High-contrast tinting (>7:1 on container chips) | Inline wrapping; scales on micro viewports | State controls (`success`, `info`, `warning`, `error`, `purple`) |
| **`CardContainer`** | Atomic Surface | ✅ 1px `#E5E0DF` hairline with subtle elevation shadow | Fluid container padding (`sm`, `md`, `lg`) | Hoverable state, padding toggles |
| **`CountdownTimer`** | System Diagnostics | ✅ Monospace numeric readout; high-visibility orange ring | Scalable SVG viewBox (120x120) | Duration, auto-start, pause/resume events |
| **`SignaturePad`** | Touch & Escrow | ✅ Clear tactile outline; instantaneous reset action | Native touch/stylus event handlers | Stroke weight, canvas dimensions, clear hook |
| **`DynamicIsland`** | Mobile Live Activity | ✅ High-contrast OLED dark glass render | 100% viewport width matching iOS bounds | Compact & Expanded view states |
| **`InvoiceSheet`** | Tax Document | ✅ Crisp monochrome print-media typography | Printable CSS stylesheet `@media print` | Live item additions, tax calculations, QR toggle |

---

## 5. Storybook Build & Integration Commands

```bash
# 1. Start Storybook in local development mode
npm run storybook
# Opens on http://localhost:6006

# 2. Build static Storybook deployment bundle
npm run build-storybook

# 3. Automated visual regression testing via Chromatic
npx chromatic --project-token=FIXMATE_CHROMATIC_TOKEN
```
