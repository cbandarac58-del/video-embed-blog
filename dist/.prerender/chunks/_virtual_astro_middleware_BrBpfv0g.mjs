import { A as defineMiddleware, b as sequence } from "./render_-1vzkkKo.mjs";
//#region src/middleware.ts
var BLOCKED_COUNTRIES = [];
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(defineMiddleware(async (context, next) => {
	const response = await next();
	if (!context.url.pathname.startsWith("/videos/")) return response;
	const country = context.request.headers.get("x-nf-country") ?? context.request.headers.get("cf-ipcountry") ?? context.request.headers.get("x-vercel-ip-country") ?? "";
	if (BLOCKED_COUNTRIES.includes(country.toUpperCase())) response.headers.append("Set-Cookie", "vxt_blocked=1; Path=/; Max-Age=300; SameSite=Lax");
	else response.headers.append("Set-Cookie", "vxt_blocked=0; Path=/; Max-Age=0; SameSite=Lax");
	return response;
}));
//#endregion
export { onRequest };
