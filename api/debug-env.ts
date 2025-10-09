import type { VercelRequest, VercelResponse } from '@vercel/node';

// Lightweight debug endpoint to verify that serverless functions run and
// that environment variables are present on the Vercel deployment.
// IMPORTANT: this endpoint intentionally does NOT return the API key value.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const hasOpenRouterKey = !!(process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY);
    const base = process.env.OPENROUTER_BASE_URL || process.env.VITE_OPENROUTER_BASE_URL || null;
    const model = process.env.OPENROUTER_MODEL || process.env.VITE_OPENROUTER_MODEL || null;

    // Minimal info useful for debugging; do NOT expose secrets.
    res.status(200).json({
      ok: true,
      env: {
        OPENROUTER_API_KEY_present: hasOpenRouterKey,
        OPENROUTER_BASE_URL: base,
        OPENROUTER_MODEL: model,
      },
      nodeVersion: process.version,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('debug-env error', err);
    res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
}
