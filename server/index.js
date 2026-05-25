import express from "express";
import cors from "cors";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const app = express();
const PORT = process.env.PORT || 3001;

const CLIENT_ID = process.env.CANVAS_CLIENT_ID || process.env.VITE_CANVAS_CLIENT_ID;
const CLIENT_SECRET =
  process.env.CANVAS_CLIENT_SECRET || process.env.VITE_CANVAS_CLIENT_SECRET;

app.use(cors({ origin: true }));
app.use(express.json());

/** Exchange OAuth code for user access token (secret stays on server). */
app.post("/api/oauth/token", async (req, res) => {
  const { code, canvasBaseUrl, redirectUri } = req.body;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(500).json({
      error:
        "OAuth not configured. Set CANVAS_CLIENT_ID and CANVAS_CLIENT_SECRET in .env.local",
    });
  }

  if (!code || !canvasBaseUrl || !redirectUri) {
    return res.status(400).json({ error: "Missing code, canvas URL, or redirect URI" });
  }

  const base = canvasBaseUrl.replace(/\/$/, "");
  const tokenUrl = `${base}/login/oauth2/token`;

  try {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: redirectUri,
      code,
    });

    const tokenRes = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return res.status(tokenRes.status).json({
        error: tokenData.error_description || tokenData.error || "Token exchange failed",
      });
    }

    let user;
    try {
      const userRes = await fetch(`${base}/api/v1/users/self`, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      if (userRes.ok) user = await userRes.json();
    } catch {
      /* optional */
    }

    res.json({
      access_token: tokenData.access_token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "OAuth failed",
    });
  }
});

/** Proxy Canvas API — each user sends their own token. */
app.use("/api/canvas", async (req, res) => {
  const canvasBase = req.headers["x-canvas-base-url"];
  const auth = req.headers.authorization;

  if (!canvasBase || !auth) {
    return res.status(401).json({ error: "Missing Canvas URL or authorization" });
  }

  const base = String(canvasBase).replace(/\/$/, "");
  const path = req.url;
  const target = `${base}/api/v1${path}`;

  try {
    const url = new URL(target);
    for (const [key, value] of Object.entries(req.query)) {
      url.searchParams.set(key, value);
    }

    const proxyRes = await fetch(url.toString(), {
      method: req.method,
      headers: {
        Authorization: auth,
        Accept: "application/json",
      },
    });

    const text = await proxyRes.text();
    res.status(proxyRes.status);
    res.setHeader("Content-Type", proxyRes.headers.get("content-type") || "application/json");
    res.send(text);
  } catch (err) {
    res.status(502).json({
      error: err instanceof Error ? err.message : "Proxy error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`K12 Launchpad API → http://localhost:${PORT}`);
});
