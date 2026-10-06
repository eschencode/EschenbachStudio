# Eschenbach Studio - Portfolio Website

A modern, clean, and minimalist portfolio website for Eschenbach Studio built with SvelteKit.

## Features

✨ **Multilingual Support** - English, Dutch, and German
🎨 **Modern Design** - Clean, technical, and professional aesthetic
📱 **Responsive** - Works perfectly on desktop, tablet, and mobile
⚡ **Fast** - Built with SvelteKit for optimal performance
🔧 **Easy to Update** - Simple contact form and content structure

## Tech Stack

- **Framework**: SvelteKit 2.0
- **Language**: JavaScript/Svelte
- **Styling**: CSS (built-in to Svelte components)
- **Build Tool**: Vite
- **i18n**: Custom lightweight translation system

## Project Structure

```
src/
├── app.html                    # Main HTML template
├── routes/
│   ├── +layout.svelte         # Main layout with header/footer
│   ├── +page.server.js        # Root redirect to /en
│   ├── [lang]/
│   │   ├── +page.svelte       # Home page
│   │   └── contact/
│   │       └── +page.svelte   # Contact page
└── lib/
    └── i18n.js                # Translation strings (EN, NL, DE)
```

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```
The site will be available at `http://localhost:5174` (or similar).

### Build for Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## Colors

Your brand palette (as requested):
- **Primary Dark**: `#1B3C53`
- **Primary**: `#234C6A`
- **Accent**: `#456882`
- **Light Accent**: `#D2C1B6`

## Content to Update

### Home Page
- Headline and subtitle in `src/lib/i18n.js`
- Service descriptions
- CTA button text

### Contact Page
- Contact form description
- Email display (currently placeholder: `hello@eschenbach-studio.com`)

### Languages
- English: `translations.en`
- Dutch: `translations.nl`
- German: `translations.de`

All translation strings are in `src/lib/i18n.js`.

## Customization

### Add Projects/Case Studies
Create a new route under `src/routes/[lang]/projects/`:

```
src/routes/[lang]/projects/
├── +page.svelte       # Projects listing
└── [slug]/
    └── +page.svelte   # Individual project page
```

### Connect Contact Form
The contact form currently shows a local success message. To enable email sending:

1. Use a service like:
   - Resend
   - SendGrid
   - Mailgun
   - Vercel Functions
   - AWS SES

2. Update the form handler in `src/routes/[lang]/contact/+page.svelte`

Example with Resend:
```javascript
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

async function handleSubmit(e) {
  e.preventDefault();
  
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'New message from Eschenbach Studio',
    html: message,
  });
  
  submitted = true;
  email = '';
  message = '';
}
```

## Deployment

### Vercel (Recommended for SvelteKit)
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Deploy automatically on every push

### Other Platforms

**Netlify**
```bash
npm run build
# Deploy the .svelte-kit/output/client folder
```

**Docker**
```dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:18
WORKDIR /app
COPY --from=builder /app/.svelte-kit ./app/.svelte-kit
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
EXPOSE 3000
CMD ["node", ".svelte-kit/output/index.js"]
```

## SEO

- All pages have proper `<title>` and meta descriptions
- Responsive meta viewport tag
- Language routing supports SEO crawling

To improve SEO further:
1. Add a sitemap.xml
2. Add robots.txt
3. Structure data (schema.org)
4. Consider adding a blog

## Performance

Current metrics:
- Minimal CSS (~7KB gzipped per page)
- Lightweight JavaScript bundle
- No external frameworks (Tailwind, Bootstrap)
- Server-side rendering for fast first paint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2025 Eschenbach Studio. All rights reserved.

## Support

For questions or updates, contact: hello@eschenbach-studio.com
# EschenbachStudio
