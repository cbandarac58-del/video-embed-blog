import type { APIRoute } from 'astro';

// Disable prerendering — this MUST be a server-rendered dynamic endpoint
export const prerender = false;

export const GET: APIRoute = ({ request, redirect }) => {
  const url = new URL(request.url);

  // Where to send the user after verification
  const next = url.searchParams.get('next') ?? '/';

  // Safety: only allow relative URLs to prevent open-redirect abuse
  const safePath = next.startsWith('/') ? next : '/';

  // Set the human-verification cookie (server-side, always reliable)
  const isHttps = url.protocol === 'https:';
  const cookieValue = `vxt_human=1; Path=/; Max-Age=86400; SameSite=Lax${isHttps ? '; Secure' : ''}`;

  return new Response(null, {
    status: 302,
    headers: {
      'Location': safePath,
      'Set-Cookie': cookieValue,
      'Cache-Control': 'no-store',
    },
  });
};
