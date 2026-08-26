export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || 'https://cra-watch-demo.github.io';
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': origin === allowedOrigin ? origin : allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return Response.json({ ok: true, service: 'exercise-quest-google-health-token' }, { headers: cors });
    }

    if (url.pathname !== '/token' || request.method !== 'POST') {
      return Response.json({ error: 'Not found' }, { status: 404, headers: cors });
    }

    try {
      const { code, redirect_uri, client_id } = await request.json();
      if (!code || !redirect_uri || !client_id) {
        return Response.json({ error: 'Missing code, redirect_uri or client_id' }, { status: 400, headers: cors });
      }
      if (client_id !== env.GOOGLE_CLIENT_ID) {
        return Response.json({ error: 'Client ID mismatch' }, { status: 400, headers: cors });
      }
      const expectedRedirect = env.REDIRECT_URI || 'https://cra-watch-demo.github.io/exercise-quest-fitbit/';
      if (redirect_uri !== expectedRedirect) {
        return Response.json({ error: 'Redirect URI mismatch' }, { status: 400, headers: cors });
      }

      const body = new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri,
        grant_type: 'authorization_code'
      });
      const r = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      const data = await r.json();
      if (!r.ok) return Response.json(data, { status: r.status, headers: cors });

      // Voor deze persoonlijke testversie sturen we alleen het korte access token terug.
      // Het refresh token en client secret worden niet in GitHub Pages opgeslagen.
      return Response.json({
        access_token: data.access_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
        scope: data.scope
      }, { headers: { ...cors, 'Cache-Control': 'no-store' } });
    } catch (e) {
      return Response.json({ error: 'server_error', error_description: e.message }, { status: 500, headers: cors });
    }
  }
};