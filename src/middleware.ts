import { defineMiddleware } from 'astro:middleware';

// Countries where adult content is commonly blocked
const BLOCKED_COUNTRIES: string[] = [];

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Only run on video pages
  if (!context.url.pathname.startsWith('/videos/')) {
    return response;
  }

  // Cloudflare and Vercel inject the visitor's country as request headers
  const country = context.request.headers.get('cf-ipcountry') ?? context.request.headers.get('x-vercel-ip-country') ?? '';

  if (BLOCKED_COUNTRIES.includes(country.toUpperCase())) {
    // Set a short-lived cookie that the client JS reads to show the banner
    response.headers.append(
      'Set-Cookie',
      'vxt_blocked=1; Path=/; Max-Age=300; SameSite=Lax'
    );
  } else {
    // Clear the cookie if the user is not in a blocked country
    response.headers.append(
      'Set-Cookie',
      'vxt_blocked=0; Path=/; Max-Age=0; SameSite=Lax'
    );
  }

  return response;
});
