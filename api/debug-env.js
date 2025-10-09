// Plain JS debug endpoint for runtime verification (no TypeScript, no imports)
module.exports = function (req, res) {
  try {
    const hasOpenRouterKey = !!(process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY);
    const base = process.env.OPENROUTER_BASE_URL || process.env.VITE_OPENROUTER_BASE_URL || null;
    const model = process.env.OPENROUTER_MODEL || process.env.VITE_OPENROUTER_MODEL || null;

    const body = {
      ok: true,
      env: {
        OPENROUTER_API_KEY_present: hasOpenRouterKey,
        OPENROUTER_BASE_URL: base,
        OPENROUTER_MODEL: model,
      },
      nodeVersion: process.version,
      timestamp: new Date().toISOString(),
    };

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(body));
  } catch (err) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, error: String(err) }));
  }
};
