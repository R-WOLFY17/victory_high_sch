# Nyenga Victory High School — Official Website

A modern, production-ready website built for **Nyenga Victory High School**, Buikwe District, Uganda.

---

## 🏫 Project Overview

This is a complete, professional school website featuring:
- Beautiful animated home page with hero slider
- About Us (history, vision, mission, philosophy, VICTORY values, leadership)
- Academics (curriculum, departments, subjects, teaching methods, calendar)
- Admissions (process, requirements, online application form, FAQs)
- Student Life (sports, arts, clubs, facilities)
- Gallery (masonry grid with lightbox)
- News & Events
- Contact (form + map placeholder)
- Downloads
- Student Portal (UI)
- Staff Portal (UI)
- Parent Portal (UI)
- Admin Dashboard (UI)
- Dark / Light mode
- Fully responsive (mobile, tablet, desktop)
- PWA ready
- SEO optimized (meta tags, Open Graph, Twitter Cards, structured data)

---

## 🛠️ Tech Stack

| Tool | Version |
|---|---|
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| Tailwind CSS | 4 (via @tailwindcss/vite) |
| Framer Motion | latest |
| React Router DOM | 7 |
| React Icons | latest |
| Swiper.js | latest |
| React Hook Form | latest |
| Zod | latest |
| React Helmet Async | latest |

---

## 📁 Project Structure

```
nyenga-victory-hs/
├── public/
│   ├── favicon.svg
│   ├── manifest.json
│   ├── robots.txt
│   └── images/              ← 📸 Replace placeholder images here
│       ├── hero/
│       │   ├── hero1.jpg
│       │   ├── hero2.jpg
│       │   └── hero3.jpg
│       ├── campus/
│       ├── staff/
│       ├── gallery/
│       ├── news/
│       ├── sports/
│       ├── facilities/
│       ├── testimonials/
│       └── og-image.jpg
├── src/
│   ├── components/
│   │   ├── layout/          ← Navbar, Footer, Layout
│   │   ├── sections/        ← Page sections (Hero, Stats, Values, etc.)
│   │   └── ui/              ← Reusable UI components
│   ├── context/             ← ThemeContext (dark/light mode)
│   ├── data/
│   │   └── schoolData.ts    ← ⭐ All school content lives here
│   ├── hooks/               ← Custom React hooks
│   ├── pages/               ← Page components
│   │   ├── About/
│   │   ├── Academics/
│   │   ├── Admissions/
│   │   ├── Contact/
│   │   ├── Downloads/
│   │   ├── Gallery/
│   │   ├── News/
│   │   ├── Portals/
│   │   └── StudentLife/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 🎨 Replacing Placeholder Images

All images are loaded from the `/public/images/` directory. Replace the placeholder paths with your actual school photographs:

| Folder | Content |
|---|---|
| `/public/images/hero/` | Hero slider backgrounds (hero1.jpg, hero2.jpg, hero3.jpg) |
| `/public/images/campus/` | Campus, classroom, lab, library photos |
| `/public/images/staff/` | Headteacher, deputy, staff photos |
| `/public/images/gallery/` | Gallery images (img1.jpg ... img24.jpg) |
| `/public/images/news/` | News article images |
| `/public/images/sports/` | Sports action photos |
| `/public/images/facilities/` | Facility photos |
| `/public/images/testimonials/` | Student/parent photos |

**Recommended image sizes:**
- Hero images: 1920×1080px (landscape)
- Staff/profile photos: 800×1000px (portrait)
- Gallery images: any size (masonry adapts)
- News thumbnails: 800×533px

---

## ✏️ Updating School Content

All official school content is centralised in **`src/data/schoolData.ts`**. Update this file to:

- Change the school motto, vision, mission, philosophy
- Update leadership names and profiles
- Add real news articles and events
- Update contact details and social links
- Update statistics

---

## 🔌 Connecting Forms (EmailJS / Backend)

The contact and admissions forms are fully wired with validation. To send emails:

1. Sign up at [emailjs.com](https://emailjs.com)
2. Create a service, template, and get your public key
3. Install: `npm install @emailjs/browser`
4. Replace the `console.log` in the form `onSubmit` functions with:

```ts
import emailjs from '@emailjs/browser';

await emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  { ...formData },
  'YOUR_PUBLIC_KEY'
);
```

---

## 🌐 Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Add a `vercel.json` for SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 🌐 Deploying to Netlify

1. Connect your GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add a `_redirects` file in `/public/`:
```
/* /index.html 200
```

---

## 🔒 Staff / Student / Admin Portals

The portals are **UI-only demos**. To make them functional:
- Build a Node.js / Laravel / Django backend
- Connect the login forms to your authentication API
- Replace mock data with real API calls using the `axios` package already installed

---

## 📱 PWA Setup

The app is PWA-ready. To complete setup:
1. Create app icons in `/public/icons/` (72, 96, 128, 144, 152, 192, 384, 512px)
2. Update `/public/manifest.json` with real icon paths
3. The `manifest.json` and `robots.txt` are already configured

---

## 🎯 Customisation Checklist

- [ ] Replace placeholder images in `/public/images/`
- [ ] Update `src/data/schoolData.ts` with official school content from the VICTORY VALUES document
- [ ] Update school phone, email, address in `schoolData.ts`
- [ ] Update social media links
- [ ] Connect contact form to EmailJS or backend
- [ ] Create and add app icons in `/public/icons/`
- [ ] Add real Google Maps embed in Contact page
- [ ] Set up proper domain in `vercel.json` / Netlify settings
- [ ] Add Google Analytics or similar tracking

---

## 📄 Licence

This project is proprietary to **Nyenga Victory High School**. All rights reserved.

---

*Built with ❤️ for Nyenga Victory High School — Excellence, Integrity, Victory*
