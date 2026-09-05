# ScaleVAI

ScaleVAI's marketing site and VAI website assistant for enterprises across the UAE and GCC.

## Run locally

```powershell
npm install
npm start
```

The site is available at `http://localhost:8082` by default.

Copy `.env.example` to `.env` and set `OPENAI_API_KEY` to enable VAI chat responses.

## Project structure

- `index.html`: ScaleVAI homepage
- `solutions/`: individual solution pages
- `assets/`: images, video, and logos
- `css/`: shared styling and Tailwind output
- `scripts/`: shared site components
- `server.js`: static site and VAI chat API server