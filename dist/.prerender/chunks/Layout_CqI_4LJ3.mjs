import { n as getCollection } from "./_astro_content_CSD6qwR1.mjs";
import { T as createComponent, _ as renderHead, f as renderTemplate, l as renderSlot, n as renderScript, v as addAttribute, w as createAstro, y as defineScriptVars } from "./server_DdnRNRi_.mjs";
//#region src/layouts/Layout.astro
createAstro("https://vixtube.net");
var $$Layout = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title, description = "Watch top-trending free adult videos, hot amateur clips, and premium XXX streaming content. Fully optimized for all mobile devices.", keywords = "adult videos, free porn, xxx clips, hot amateur, desi bhabhi, stepsister sex, 18+ stream", isVideoPage = false } = Astro.props;
	const canonicalURL = new URL(Astro.url.pathname, Astro.site || "https://vixtube.net");
	let videos = [];
	try {
		videos = await getCollection("videos");
	} catch (e) {
		console.log("No videos found in content layer yet.", e);
	}
	const slugify = (text) => text.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
	const categorySlugMap = {};
	const tagSlugMap = {};
	videos.forEach((v) => {
		if (v.data.category) {
			const clean = v.data.category.trim();
			categorySlugMap[clean.toLowerCase()] = slugify(clean);
		}
		(v.data.tags || []).forEach((tag) => {
			const clean = tag.trim();
			if (clean) tagSlugMap[clean.toLowerCase()] = slugify(clean);
		});
	});
	return renderTemplate`<html lang="en" data-astro-cid-ju4pidww><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"${addAttribute(Astro.generator, "content")}><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png"><link rel="shortcut icon" type="image/x-icon" href="/favicon.ico"><!-- PWA Manifest & Mobile Web App settings --><link rel="manifest" href="/manifest.json"><meta name="theme-color" content="#e11d48"><link rel="apple-touch-icon" href="/pwa_icon_192.png"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><!-- SEO Meta Tags --><title>${title} | VixTube Premium</title><meta name="description"${addAttribute(description, "content")}><meta name="keywords"${addAttribute(keywords, "content")}><link rel="canonical"${addAttribute(canonicalURL, "href")}><!-- Google SafeSearch & Indexing Compliance (Adult Filters) --><meta name="rating" content="adult"><meta name="RATING" content="RTA-5042-1996-1104-1554-4306-EST"><meta name="google-site-verification" content="E-DT_XvMRPKJ7vYwBh-B4E92iWXB7TDDNXwZl1E01es"><meta name="naver-site-verification" content="d122dd0d8f372b3a5bafaef0c831b66a484d2127"><meta name="6a97888e-site-verification" content="a502c8dde2a7cf20862417e7d4a8d003"><!-- Prevent Google from indexing ad/third-party videos on listing pages.
         Only individual video watch pages (/videos/[slug]) should be indexed as video pages.
         This fixes the 'Video isn't on a watch page' GSC error caused by ExoClick ad video content. -->${!isVideoPage && renderTemplate`<meta name="robots" content="max-video-preview:0">`}<!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(canonicalURL, "content")}><meta property="og:title"${addAttribute(`${title} | VixTube`, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image" content="/og-image.jpg"><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(canonicalURL, "content")}><meta property="twitter:title"${addAttribute(`${title} | VixTube`, "content")}><meta property="twitter:description"${addAttribute(description, "content")}><meta property="twitter:image" content="/og-image.jpg"><!-- Google Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet"><!-- ExoClick Push Notification Zone 5942298 --><script type="application/javascript">
      pn_idzone = 5942298;
      pn_sleep_seconds = 0;
      pn_is_self_hosted = 1;
      pn_soft_ask = 0;
      pn_filename = "/worker.js";
    <\/script><script type="application/javascript" src="https://js.wpnsrv.com/pn.php"><\/script><script type="text/javascript">
       (function(m,e,t,r,i,k,a){
           m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
           m[i].l=1*new Date();
           for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
           k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
       })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=109512457', 'ym');

       ym(109512457, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
    <\/script><noscript><div data-astro-cid-ju4pidww><img src="https://mc.yandex.ru/watch/109512457" style="position:absolute; left:-9999px;" alt="" data-astro-cid-ju4pidww></div></noscript><!-- /Yandex.Metrika counter --><!-- Register PWA Service Worker --><script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('PWA Service Worker registered successfully:', reg.scope))
            .catch(err => console.error('PWA Service Worker registration failed:', err));
        });
      }
    <\/script>${renderHead($$result)}</head><body class="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white pb-16 md:pb-0" data-astro-cid-ju4pidww><!-- AdBlock Popunder Recovery + ExoClick Ad Providers --><script async type="application/javascript" src="https://a.magsrv.com/ad-provider.js"><\/script><script async type="application/javascript" src="https://a.pemsrv.com/ad-provider.js"><\/script><script src="/popunder-adblock.js"><\/script><ins class="eas6a97888e31" data-zoneid="5938548" data-astro-cid-ju4pidww></ins>${renderScript($$result, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")}<ins class="eas6a97888e35" data-zoneid="5938540" data-astro-cid-ju4pidww></ins>${renderScript($$result, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=1&lang.ts")}<ins class="eas6a97888e38" data-zoneid="5942318" data-astro-cid-ju4pidww></ins>${renderScript($$result, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=2&lang.ts")}<ins class="eas6a97888e17" data-zoneid="5942314" data-astro-cid-ju4pidww></ins>${renderScript($$result, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=3&lang.ts")}<header class="sticky top-0 z-40 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md relative" data-astro-cid-ju4pidww><div class="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/20 to-transparent" data-astro-cid-ju4pidww></div><div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" data-astro-cid-ju4pidww><!-- Logo --><a href="/" class="flex items-center space-x-2 group flex-shrink-0" data-astro-cid-ju4pidww><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 font-extrabold text-white text-xl shadow-lg shadow-rose-500/20 group-hover:scale-105 group-hover:rotate-3 transition-all" data-astro-cid-ju4pidww>V</div><span class="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent" data-astro-cid-ju4pidww>Vix<span class="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent" data-astro-cid-ju4pidww>Tube</span></span></a><!-- Desktop Navigation --><nav class="hidden md:flex items-center space-x-8" data-astro-cid-ju4pidww><a href="/" class="text-sm font-semibold text-slate-300 hover:text-rose-500 hover:-translate-y-0.5 transition-all" data-astro-cid-ju4pidww>Home</a><a href="/popular" class="text-sm font-semibold text-slate-300 hover:text-rose-500 hover:-translate-y-0.5 transition-all" data-astro-cid-ju4pidww>Popular</a><a href="/featured" class="text-sm font-semibold text-slate-300 hover:text-rose-500 hover:-translate-y-0.5 transition-all" data-astro-cid-ju4pidww>Featured</a><a href="https://go.mavrtracktor.com?userId=763fd084690f07b764ddde5c15c706c218c35157018d3d183790570e22385ed7" target="_blank" rel="noopener" class="flex items-center rounded-full bg-rose-600/90 hover:bg-rose-600 hover:scale-105 px-4.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-rose-600/20 border border-rose-500 transition-all" data-astro-cid-ju4pidww><span class="mr-1.5 h-1.5 w-1.5 rounded-full bg-white animate-ping" data-astro-cid-ju4pidww></span>Live Models</a></nav><!-- Search Bar (Client Side Triggered & Responsive) --><div class="flex items-center space-x-2 sm:space-x-4" data-astro-cid-ju4pidww><form action="/" method="GET" class="relative" data-astro-cid-ju4pidww><input type="text" name="search" placeholder="Search..." class="w-32 xs:w-44 sm:w-48 lg:w-64 rounded-full bg-slate-900 border border-slate-800 px-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all shadow-inner" data-astro-cid-ju4pidww><button type="submit" class="absolute right-3 top-2.5 text-slate-500 hover:text-rose-500" data-astro-cid-ju4pidww><svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ju4pidww><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-ju4pidww></path></svg></button></form></div></div></header><!-- Main Content Area --><main class="flex-1" data-astro-cid-ju4pidww>${renderSlot($$result, $$slots["default"])}</main><!-- ExoClick Recommendation Widget Zone 5938550 – between content and footer --><div class="mx-auto max-w-7xl px-4 py-4" data-astro-cid-ju4pidww><ins class="eas6a97888e20" data-zoneid="5938550" data-astro-cid-ju4pidww></ins>${renderScript($$result, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=4&lang.ts")}</div><!-- Footer --><footer class="border-t border-slate-900 bg-slate-950 py-10 mt-12 text-sm text-slate-500 pb-28 md:pb-10" data-astro-cid-ju4pidww><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-astro-cid-ju4pidww><div class="grid grid-cols-1 md:grid-cols-3 gap-8" data-astro-cid-ju4pidww><div data-astro-cid-ju4pidww><div class="flex items-center space-x-2 mb-4" data-astro-cid-ju4pidww><span class="text-lg font-black text-white" data-astro-cid-ju4pidww>Vix<span class="text-rose-500" data-astro-cid-ju4pidww>Tube</span></span></div><p class="text-xs leading-relaxed max-w-xs" data-astro-cid-ju4pidww>VixTube is a fully optimized, responsive video embedding platform. We comply with search indexing policies by implementing explicit meta tags.</p></div><div data-astro-cid-ju4pidww><h3 class="font-semibold text-slate-300 mb-3" data-astro-cid-ju4pidww>Compliance & Certification</h3><ul class="space-y-2 text-xs" data-astro-cid-ju4pidww><li class="flex items-center space-x-2" data-astro-cid-ju4pidww><span class="rounded bg-rose-950 text-rose-400 px-1.5 py-0.5 font-bold border border-rose-900" data-astro-cid-ju4pidww>RTA</span><span data-astro-cid-ju4pidww>Restricted to Adults (RTA-5042)</span></li><li data-astro-cid-ju4pidww>SafeSearch compliance verified</li><li data-astro-cid-ju4pidww>18+ Age Verification Required in applicable states</li></ul></div><div data-astro-cid-ju4pidww><h3 class="font-semibold text-slate-300 mb-3" data-astro-cid-ju4pidww>Legal Links</h3><div class="grid grid-cols-2 gap-2 text-xs" data-astro-cid-ju4pidww><a href="/dmca" class="hover:text-slate-300 transition-colors" data-astro-cid-ju4pidww>DMCA Notice</a><a href="/terms" class="hover:text-slate-300 transition-colors" data-astro-cid-ju4pidww>Terms of Service</a><a href="/privacy" class="hover:text-slate-300 transition-colors" data-astro-cid-ju4pidww>Privacy Policy</a><a href="/contact" class="hover:text-slate-300 transition-colors" data-astro-cid-ju4pidww>Contact Support</a></div></div></div><div class="mt-8 border-t border-slate-900 pt-6 text-center text-xs" data-astro-cid-ju4pidww><p data-astro-cid-ju4pidww>© ${(/* @__PURE__ */ new Date()).getFullYear()} VixTube. All rights reserved. The video clips embedded are hosted on third-party servers.</p><div class="mt-3 flex items-center justify-center" data-astro-cid-ju4pidww><a href="https://webmaster.yandex.ru/siteInfo/?site=https://vixtube.net" target="_blank" rel="noopener" title="Yandex Site Info" data-astro-cid-ju4pidww><img width="88" height="31" alt="Yandex" border="0" style="border-radius:8px;" src="https://yandex.ru/cycounter?https://vixtube.net&theme=dark&lang=en" data-astro-cid-ju4pidww></a></div></div></div></footer><!-- Mobile Bottom Navigation Bar (Floating capsule, premium glassmorphism) --><nav class="fixed bottom-4 left-4 right-4 z-40 md:hidden bg-slate-950/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl max-w-md mx-auto px-6 py-2.5 flex justify-around items-center text-xs font-semibold shadow-2xl shadow-rose-950/10" data-astro-cid-ju4pidww><a href="/" class="flex flex-col items-center space-y-1 text-slate-400 hover:text-rose-500 transition-all active:scale-95" data-astro-cid-ju4pidww><svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ju4pidww><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" data-astro-cid-ju4pidww></path></svg><span class="text-[9px]" data-astro-cid-ju4pidww>Home</span></a><a href="/popular" class="flex flex-col items-center space-y-1 text-slate-400 hover:text-rose-500 transition-all active:scale-95" data-astro-cid-ju4pidww><svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ju4pidww><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" data-astro-cid-ju4pidww></path></svg><span class="text-[9px]" data-astro-cid-ju4pidww>Popular</span></a><a href="/featured" class="flex flex-col items-center space-y-1 text-slate-400 hover:text-rose-500 transition-all active:scale-95" data-astro-cid-ju4pidww><svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ju4pidww><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.248.588 1.81l-3.97 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.888a1 1 0 00-1.176 0l-3.97 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.97-2.888c-.777-.562-.379-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" data-astro-cid-ju4pidww></path></svg><span class="text-[9px]" data-astro-cid-ju4pidww>Featured</span></a><a href="https://go.mavrtracktor.com?userId=763fd084690f07b764ddde5c15c706c218c35157018d3d183790570e22385ed7" target="_blank" rel="noopener" class="flex flex-col items-center space-y-1 text-rose-500 hover:text-rose-400 transition-all active:scale-95 animate-pulse" data-astro-cid-ju4pidww><svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ju4pidww><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" data-astro-cid-ju4pidww></path></svg><span class="text-[9px] font-extrabold" data-astro-cid-ju4pidww>Live Models</span></a></nav><!-- Global SEO Search Router Script --><script>(function(){${defineScriptVars({
		categorySlugMap,
		tagSlugMap
	})}
      window.CATEGORY_SLUG_MAP = categorySlugMap;
      window.TAG_SLUG_MAP = tagSlugMap;

      document.addEventListener('DOMContentLoaded', () => {
        const searchForms = document.querySelectorAll('form[action="/"]');
        
        searchForms.forEach(form => {
          form.addEventListener('submit', (e) => {
            const input = form.querySelector('input[name="search"]');
            if (!input) return;
            
            const rawQuery = input.value || '';
            const query = rawQuery.trim().toLowerCase();
            if (!query) {
              e.preventDefault();
              window.location.href = '/';
              return;
            }

            // Check for exact category match
            if (window.CATEGORY_SLUG_MAP && window.CATEGORY_SLUG_MAP[query]) {
              e.preventDefault();
              window.location.href = \`/category/\${window.CATEGORY_SLUG_MAP[query]}\`;
              return;
            }

            // Check for exact tag match
            if (window.TAG_SLUG_MAP && window.TAG_SLUG_MAP[query]) {
              e.preventDefault();
              window.location.href = \`/tag/\${window.TAG_SLUG_MAP[query]}\`;
              return;
            }

            // Otherwise, let standard form submission take place (goes to /?search=query)
            // But if we are already on the home page (/), let the local page script handle it instantly
            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
              // The home page's own submit handler intercepts and does preventDefault.
              // So we don't need to do anything here for the home page.
            }
          });
        });
        
        // Highlight active link in mobile bottom nav bar
        const path = window.location.pathname;
        const bottomLinks = document.querySelectorAll('nav.fixed a');
        bottomLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === path || (href === '/' && path === '/index.html')) {
            link.classList.remove('text-slate-400');
            link.classList.add('text-rose-500');
          }
        });
      });
    })();<\/script></body></html>`;
}, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro", void 0);
//#endregion
export { $$Layout as t };
