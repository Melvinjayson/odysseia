# OΔYSSEIA Frontend

Production-ready Next.js (TypeScript) frontend for the OΔYSSEIA project.

## Project Structure

- `app/page.tsx` — Landing page
- `app/login/page.tsx` — Login page
- `app/dashboard/page.tsx` — Dashboard
- `app/odyssey-starter/page.tsx` — Odyssey Starter
- `package.json`, `tsconfig.json` — Project configuration
- `Dockerfile`, `.dockerignore` — Containerization

## Getting Started

### Development

```bash
npm install
npm run dev
```

App runs at http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

### Docker

Build and run the container:

```bash
docker build -t odysseia-frontend .
docker run -p 3000:3000 odysseia-frontend
```

## Customization

- Edit pages in `app/` to update UI and logic.
- Update dependencies in `package.json` as needed.

---

© OΔYSSEIA Project
