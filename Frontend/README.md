# Windows 9 - Last Mile Connectivity Frontend

A modern, responsive Next.js frontend for last-mile connectivity from home to Pune Metro stations.

## 🚀 Features

- **6 Complete Pages**: Home, Login, Register, Landing, Tracking, Dashboard
- **Pune Metro Theming**: Custom color palette (Metro Red #E63946, Teal #06D6A0)
- **Stunning Animations**: Framer Motion parallax, floating elements, scroll effects
- **Glassmorphism Design**: Modern UI with blur effects and transparency
- **Responsive**: Fully adaptive from mobile (375px) to desktop (1920px+)
- **Type-Safe**: Built with TypeScript for reliability

## 🎨 Design Highlights

- **Floating Metro Elements**: Animated trains, stations, and icons throughout
- **Custom Color System**: Pune Metro-inspired palette with gradient effects
- **Modern Typography**: Inter for body, Outfit for display text
- **Interactive Components**: Hover effects, click animations, smooth transitions

## 📦 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with custom utilities
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Language**: TypeScript

## 🛠️ Getting Started

### Installation

```bash
cd /home/meetagrawal2112/Project/windows9
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📄 Pages Overview

1. **Home (`/`)**: Full-screen hero, features, testimonials, CTA sections
2. **Login (`/login`)**: Glassmorphic form with social auth options
3. **Register (`/register`)**: Multi-field registration with validation
4. **Landing (`/landing`)**: Detailed marketing with Metro integration
5. **Tracking (`/tracking`)**: Mock interactive map with live updates
6. **Dashboard (`/dashboard`)**: User stats, ride history, analytics

## 🎨 Custom Components

- `Navbar.tsx`: Sticky nav with blur-on-scroll
- `Footer.tsx`: Links, social icons, contact info
- `Button.tsx`: Animated buttons with 3 variants
- `Card.tsx`: Glassmorphic cards with hover effects
- `FloatingMetro.tsx`: Animated floating visual elements

## 🎭 Animations

All animations use Framer Motion:
- Fade in/out effects
- Slide up/down transitions
- Floating animations for Metro elements
- Parallax scroll effects
- Hover and tap interactions

## 🎨 Color Palette

```css
--metro-red: #E63946
--metro-teal: #06D6A0
--metro-dark: #2B2D42
--metro-light: #EDF2F4
```

## 📱 Responsive Breakpoints

- Mobile: 375px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## 🔧 Configuration Files

- `tailwind.config.ts`: Custom theme, colors, animations
- `tsconfig.json`: TypeScript configuration
- `next.config.js`: Next.js settings
- `globals.css`: Global styles, utilities, keyframes

## 📚 Mock Data

Located in `lib/mockData.ts`:
- Metro stations (Pune Metro network)
- User testimonials
- Features list
- Ride history
- User statistics

## ✨ Future Enhancements

- Real API integration for tracking
- Actual map implementation (Mapbox/Google Maps)
- User authentication backend
- Payment gateway integration
- Push notifications
- Real-time WebSocket updates

## 📝 Notes

- All pages use mock data for demonstration
- Map on tracking page is a placeholder visualization
- Social login buttons are UI-only (not connected)
- Forms have client-side validation only

---

Built with ❤️ for Pune Metro commuters
