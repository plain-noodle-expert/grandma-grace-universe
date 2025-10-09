import type { VercelRequest, VercelResponse } from '@vercel/node';

// Enhanced Vercel Serverless function with verbose logging and clearer error bodies
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
  const OPENROUTER_BASE = process.env.OPENROUTER_BASE_URL || process.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
  const MODEL = process.env.OPENROUTER_MODEL || process.env.VITE_OPENROUTER_MODEL || 'microsoft/mai-ds-r1:free';

  if (!OPENROUTER_API_KEY) {
    console.error('Missing OPENROUTER_API_KEY in environment');
    res.status(500).json({ error: 'Server misconfiguration: missing API key' });
    return;
  }

  try {
    const { taskTitle, importance } = req.body;
    console.log('generate-task-breakdown called with', { taskTitle, importance, model: MODEL, base: OPENROUTER_BASE });

    // Do not log the API key value, but confirm presence
    console.log('OPENROUTER_API_KEY is present:', !!OPENROUTER_API_KEY);

    // Build messages asking the model to return JSON with a steps array
    const system = {
      role: 'system',
      content: 'You are a helpful assistant that breaks down tasks into small, actionable steps for people who appreciate gentle, simple instructions.'
    };

    const user = {
      role: 'user',
      content: `Break down this ${importance} priority task into 3-6 clear actionable steps and return a JSON object like {"steps": ["step1", "step2"], "motivation": "short encouragement"}: "${taskTitle}"`
    };

    const payload = {
      model: MODEL,
      messages: [system, user],
      max_tokens: 300,
      temperature: 0.7,
    };

    const endpoint = `${OPENROUTER_BASE.replace(/\/$/, '')}/chat/completions`;
    console.log('Calling OpenRouter at', endpoint, 'with model', MODEL);

    const r = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const text = await r.text();
      console.error('OpenRouter returned non-OK:', r.status, text);
      // Return detailed info to help debugging (safe: doesn't expose secret)
      res.status(r.status).json({ error: `OpenRouter error: ${r.status}`, status: r.status, detail: text });
      return;
    }

    const json = await r.json();

    // Try to extract content from typical response shapes
    const content = (
      json?.choices?.[0]?.message?.content ||
      json?.choices?.[0]?.text ||
      json?.output ||
      ''
    ).toString();

    // Attempt to parse JSON from the model output
    let parsed = null;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      // fallback: split lines that look like steps
      console.warn('Model output not JSON, falling back to line-splitting. Raw content:', content);
      const lines = content.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);
      parsed = { steps: lines, motivation: '' };
    }

    // Ensure structure
    const steps = Array.isArray(parsed.steps) ? parsed.steps.map(String) : [];
    const motivation = parsed.motivation ? String(parsed.motivation) : '';

    res.status(200).json({ steps, motivation, priority: importance || 'medium' });
  } catch (error: any) {
    console.error('Serverless function error:', error?.stack || error);
    // Return error details for debugging
    res.status(500).json({ error: error?.message || String(error), stack: error?.stack || null });
  }
}
