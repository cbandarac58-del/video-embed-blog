import { al as defineMiddleware, b2 as sequence } from './chunks/params-and-props_NoTlu8e-.mjs';
import '@astrojs/internal-helpers/path';
import 'piccolore';
import 'clsx';
import '@astrojs/internal-helpers/object';

const BLOCKED_COUNTRIES = [];
const onRequest$1 = defineMiddleware(async (context, next) => {
  const response = await next();
  if (!context.url.pathname.startsWith("/videos/")) {
    return response;
  }
  const country = context.request.headers.get("x-nf-country") ?? context.request.headers.get("cf-ipcountry") ?? context.request.headers.get("x-vercel-ip-country") ?? "";
  if (BLOCKED_COUNTRIES.includes(country.toUpperCase())) {
    response.headers.append(
      "Set-Cookie",
      "vxt_blocked=1; Path=/; Max-Age=300; SameSite=Lax"
    );
  } else {
    response.headers.append(
      "Set-Cookie",
      "vxt_blocked=0; Path=/; Max-Age=0; SameSite=Lax"
    );
  }
  return response;
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
