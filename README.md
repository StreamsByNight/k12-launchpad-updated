# K12 Launchpad

Student dashboard with Bento grid layout. Students sign in with their **normal Canvas username and password** — no access tokens to create.

## Quick start (developers)

```bash
npm install
cp .env.example .env.local
# Fill in Canvas Developer Key + your school URL (see below)
npm run dev
```

Open `http://localhost:5173`.

## One-time admin setup (enables login for all students)

Your Canvas admin registers the app **once**. After that, every student only clicks **Sign in with Canvas**.

1. In Canvas: **Admin → Developer Keys → + Developer Key**
2. Set **Redirect URI** to:
   - Local: `http://localhost:5173/auth/callback`
   - Production: `https://your-domain.com/auth/callback`
3. Copy **Client ID** and **Client Secret** into `.env.local`:

```env
VITE_CANVAS_BASE_URL=https://stridek12academy.com
VITE_CANVAS_CLIENT_ID=1234567890
CANVAS_CLIENT_ID=1234567890
CANVAS_CLIENT_SECRET=your_secret_here
```

4. Restart `npm run dev`

Students are redirected to Canvas, log in as usual, and return to the dashboard automatically.

## How students sign in

1. Open K12 Launchpad
2. Click **Sign in with Canvas**
3. Enter Canvas username/password on the Canvas login page
4. Done — no tokens, no extra steps

**Try demo** is still available for previews without Canvas.

## Architecture

| Piece | Role |
|-------|------|
| Canvas OAuth | Students use existing Canvas login |
| `server/index.js` | Exchanges auth code for token (secret stays on server) |
| `/api/canvas` | Proxies API with each user's session |

## Stack

React 19 · TypeScript · Vite · Express · Tailwind CSS v4
