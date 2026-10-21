// Express example. Adapt the faculty lookup to your DB.
// npm i express cookie-parser jsonwebtoken google-auth-library
const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();
const google = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const isProd = process.env.NODE_ENV === "production";

// Replace with your real query, e.g.
//   SELECT name, email FROM faculty WHERE LOWER(email) = $1
async function findFacultyByEmail(email) {
  const TEMP = {
    "jitendrabhatia@nirmauni.ac.in": { name: "Jitendra Bhatia" },
  };
  const hit = TEMP[email];
  return hit ? { email, name: hit.name } : null;
}

const cookieOpts = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax", // fine when frontend proxies /api (same domain). Use "none" only for cross-domain.
  maxAge: 8 * 60 * 60 * 1000,
};

router.post("/google", async (req, res) => {
  try {
    const ticket = await google.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const p = ticket.getPayload();
    if (!p.email_verified) return res.status(401).json({ error: "Your Google email is not verified." });

    const faculty = await findFacultyByEmail(p.email.toLowerCase());
    if (!faculty) {
      return res.status(403).json({
        error: "This email is not registered in the faculty list. Contact the IQAC office for access.",
      });
    }

    const user = { email: faculty.email, name: faculty.name || p.name };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.cookie("forge_session", token, cookieOpts).json({ user });
  } catch (e) {
    res.status(401).json({ error: "Google sign-in could not be verified." });
  }
});

router.get("/me", (req, res) => {
  try {
    const user = jwt.verify(req.cookies.forge_session, process.env.JWT_SECRET);
    res.json({ user: { email: user.email, name: user.name } });
  } catch {
    res.status(401).json({ user: null });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("forge_session", cookieOpts).json({ ok: true });
});

// Use this on ALL your data routes, otherwise the API is open even though the UI is gated
function requireAuth(req, res, next) {
  try {
    req.user = jwt.verify(req.cookies.forge_session, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Please sign in." });
  }
}

module.exports = { router, requireAuth };

/* server.js wiring:
   app.use(express.json());
   app.use(require("cookie-parser")());
   app.use("/api/auth", require("./auth").router);
   app.use("/api", requireAuth);          // everything after this needs login
   app.use("/api/dashboard", dashboardRoutes);
*/