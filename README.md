# NOCOPY

Ranking en tiempo real de los mejores traders de Polymarket.  
Diseño editorial inspirado en Gemini Trend Report — animaciones scroll-triggered, tipografía masiva, ticker en vivo.

## Deploy en Vercel

```bash
# 1. Instalar dependencias
npm install

# 2. Deploy con Vercel CLI
npx vercel --prod
```

O arrastra la carpeta a vercel.com/new.

## Dev local

```bash
npm install
npm run dev
# http://localhost:3000
```

## Stack
- **Next.js 14** — App Router + Edge API Routes
- **Tailwind CSS** — sistema de diseño editorial
- **Intersection Observer** — scroll reveal animations
- **CSS animations** — marquee ticker, count-up, glow effects
- **Polymarket Data API** — datos públicos de traders
