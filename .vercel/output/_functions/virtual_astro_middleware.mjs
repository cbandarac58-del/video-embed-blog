import { ap as defineMiddleware, bg as sequence } from './chunks/params-and-props_DsYBBh82.mjs';
import 'piccolore';
import 'clsx';

const BLOCKED_COUNTRIES = ["IN", "TR"];
const onRequest$1 = defineMiddleware(async (context, next) => {
  const response = await next();
  if (!context.url.pathname.startsWith("/videos/")) {
    return response;
  }
  const country = context.request.headers.get("x-vercel-ip-country") ?? "";
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
