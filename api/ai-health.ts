import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
  const OPENROUTER_BASE = process.env.OPENROUTER_BASE_URL || process.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
  const MODEL = process.env.OPENROUTER_MODEL || process.env.VITE_OPENROUTER_MODEL || 'microsoft/mai-ds-r1:free';

  if (!OPENROUTER_API_KEY) {
    res.status(500).json({ ok: false, error: 'Missing OPENROUTER_API_KEY' });
    return;
  }

  try {
    const endpoint = `${OPENROUTER_BASE.replace(/\/$/, '')}/models`;
    const r = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${OPENROUTER_API_KEY}` },
    });

    if (!r.ok) {
      const text = await r.text();
      res.status(r.status).json({ ok: false, status: r.status, detail: text });
      return;
    }

    const json = await r.json();
    // Return whether the specified model is present (best-effort)
    const models = json?.models || json || [];
    const found = Array.isArray(models) ? models.some((m: any) => String(m).includes(MODEL) || (m.id && String(m.id).includes(MODEL))) : false;

    res.status(200).json({ ok: true, modelAvailable: found, modelsCount: Array.isArray(models) ? models.length : null });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error?.message || String(error) });
  }
}
