# K Sudarshan Hebbar — Portfolio

A high-performance single-page developer portfolio crafted with a dark "Signal HUD" aesthetic, showcasing full-stack Java and React projects with fluid motion, interactive 3D elements, and clean typography.

**Live site:** https://YOUR-SITE-URL/

## Tech Stack

- **React 19** — Component-driven frontend UI
- **Vite** — Fast modern build tooling
- **Tailwind CSS 4** — Utility-first styling with custom HUD design system
- **GSAP + ScrollTrigger** — Coordinated timeline animations and pinned section scrolling
- **Lenis** — Hardware-accelerated smooth scrolling integrated with GSAP ticker
- **three.js** — Interactive 3D wireframe centerpiece rendered in WebGL
- **EmailJS** — Client-side form delivery with native mail client fallback

## Run Locally

```bash
# Clone the repository
git clone https://github.com/KSudarshanH/my-portfolio.git

# Navigate into the project directory
cd my-portfolio

# Install dependencies
npm install

# Start the local development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

To enable contact form submissions via EmailJS, configure a `.env.local` file in the project root with the following keys (if unconfigured, the form gracefully falls back to your device's native email client):

```env
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

## Acknowledgments

Built during the placement training program at [TAP Academy](https://thetapacademy.com/) (full-stack development, AI and augmented reality training).
