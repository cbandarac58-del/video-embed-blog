import { c as createComponent } from './consts_CfqUMRV8.mjs';
import 'piccolore';
import { aZ as renderTemplate, am as defineScriptVars, a6 as addAttribute, aO as maybeRenderHead, b6 as unescapeHTML } from './params-and-props_NoTlu8e-.mjs';
import { r as renderComponent } from './ssr-function_BPzFoMXi.mjs';
import { a as getEntry, g as getCollection } from './_astro_content_BE1xHoIF.mjs';
import { $ as $$Layout } from './Layout_CFKtLFj5.mjs';
import { $ as $$AdContainer } from './AdContainer_DjUoE-cj.mjs';
import { $ as $$VideoCard } from './VideoCard_BW1YoVSC.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a, _b;
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return new Response(null, {
      status: 404,
      statusText: "Not found"
    });
  }
  const video = await getEntry("videos", slug);
  if (!video) {
    return new Response(null, {
      status: 404,
      statusText: "Not Found"
    });
  }
  const { title, embedUrl, rating, views, category, tags, dateAdded, thumbnailUrl } = video.data;
  const catSlug = category.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
  const allVideos = await getCollection("videos");
  const duplicateVideos = allVideos.filter((v) => v.data.title === title);
  let uniqueTitle = title;
  let uniqueDescription = `Watch ${title} embedded video online for free. Category: ${category}. Views: ${views}.`;
  if (duplicateVideos.length > 1) {
    duplicateVideos.sort((a, b) => a.data.slug.localeCompare(b.data.slug));
    const duplicateIndex = duplicateVideos.findIndex((v) => v.data.slug === slug);
    if (duplicateIndex !== -1) {
      uniqueTitle = `${title} - Clip ${duplicateIndex + 1}`;
      uniqueDescription = `Watch ${title} - Clip ${duplicateIndex + 1} embedded video online for free. Category: ${category}. Views: ${views}.`;
    }
  }
  function getSimilarityScore(videoA, videoB) {
    const tagsA = new Set(videoA.data.tags || []);
    const tagsB = videoB.data.tags || [];
    let intersectionSize = 0;
    for (const tag of tagsB) {
      if (tagsA.has(tag)) {
        intersectionSize++;
      }
    }
    let score = intersectionSize * 10;
    if (videoA.data.category === videoB.data.category) {
      score += 5;
    }
    return score;
  }
  const relatedVideos = allVideos.filter((v) => v.data.slug !== video.data.slug).map((v) => ({ video: v, score: getSimilarityScore(video, v) })).sort((a, b) => b.score - a.score).slice(0, 4).map((item) => item.video);
  function formatViews(val) {
    if (typeof val === "string") return val;
    if (val >= 1e6) {
      return (val / 1e6).toFixed(1) + "M";
    }
    if (val >= 1e3) {
      return (val / 1e3).toFixed(0) + "K";
    }
    return val.toString();
  }
  function safeISODate(dateStr) {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toISOString();
      }
    } catch (e) {
    }
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": uniqueTitle, "description": uniqueDescription, "isVideoPage": true }, { "default": async ($$result2) => renderTemplate(_b || (_b = __template(['<script type="application/ld+json">', "<\/script> ", '<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"> <!-- Breadcrumbs & Category back link --> <nav class="mb-4 text-xs text-slate-500 flex items-center space-x-2"> <a href="/" class="hover:text-slate-300">Home</a> <span>/</span> <a', ' class="hover:text-slate-300 uppercase font-bold text-rose-500">', '</a> <span>/</span> <span class="text-slate-400 line-clamp-1 max-w-[200px] sm:max-w-xs">', '</span> </nav> <!-- Two-Column Layout: Player vs Sidebar --> <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6"> <!-- Video Player & Metadata (Lefthand/Core column) --> <div class="lg:col-span-8 flex flex-col"> <!-- ExoClick In-Stream VAST Pre-roll Ad (Zone 5938546) --> <div id="vast-preroll-wrapper" class="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-900 bg-black shadow-2xl shadow-rose-950/5 mb-1"> <div id="vast-preroll-container" class="absolute top-0 left-0 w-full h-full z-10 bg-black"> <video id="vast-preroll-video" class="w-full h-full object-contain" playsinline muted></video> <div id="vast-skip-bar" class="absolute bottom-3 right-3 flex items-center gap-2"> <span id="vast-skip-countdown" class="text-xs text-white bg-black/70 px-2 py-1 rounded">Ad: <span id="vast-secs">5</span>s</span> <button id="vast-skip-btn" class="hidden text-xs bg-rose-600 hover:bg-rose-500 text-white px-3 py-1 rounded transition-colors">Skip Ad ›</button> </div> <a id="vast-click-link" href="#" target="_blank" rel="noopener" class="absolute inset-0 z-5"></a> </div> <!-- Responsive Player Container (16:9 aspect ratio) --> <div id="main-player" class="absolute top-0 left-0 w-full h-full" style="display:none;"> ', " </div> </div> <script>(function(){", `
          (function() {
            const VAST_URL = 'https://s.magsrv.com/v1/vast.php?idz=5938546';
            const prerollContainer = document.getElementById('vast-preroll-container');
            const mainPlayer = document.getElementById('main-player');
            const vastVideo = document.getElementById('vast-preroll-video');
            const skipBtn = document.getElementById('vast-skip-btn');
            const secsEl = document.getElementById('vast-secs');
            const clickLink = document.getElementById('vast-click-link');

            function showMainPlayer() {
              if (prerollContainer) prerollContainer.style.display = 'none';
              if (mainPlayer) mainPlayer.style.display = 'block';
            }

            function startCountdown() {
              let secs = 5;
              const timer = setInterval(() => {
                secs--;
                if (secsEl) secsEl.textContent = secs;
                if (secs <= 0) {
                  clearInterval(timer);
                  if (skipBtn) { skipBtn.classList.remove('hidden'); }
                }
              }, 1000);
            }

            // Fetch and parse VAST XML
            fetch(VAST_URL)
              .then(r => r.text())
              .then(xml => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(xml, 'text/xml');
                const mediaFile = doc.querySelector('MediaFile');
                const clickThrough = doc.querySelector('ClickThrough');
                const videoUrl = mediaFile ? mediaFile.textContent.trim() : null;
                const clickUrl = clickThrough ? clickThrough.textContent.trim() : '#';

                if (!videoUrl) { showMainPlayer(); return; }

                if (clickLink) clickLink.href = clickUrl;
                vastVideo.src = videoUrl;
                vastVideo.muted = false;
                vastVideo.autoplay = true;
                vastVideo.play().catch(() => { vastVideo.muted = true; vastVideo.play(); });
                startCountdown();

                vastVideo.addEventListener('ended', showMainPlayer);
                if (skipBtn) skipBtn.addEventListener('click', (e) => { e.preventDefault(); showMainPlayer(); });
              })
              .catch(() => showMainPlayer());
          })();
        })();<\/script> <!-- Country Block Banner (shown by Edge Middleware for IN/TR users) --> <div id="country-block-banner" style="display:none;" class="mt-3 flex items-start gap-3 rounded-xl border border-amber-800/60 bg-amber-950/40 px-4 py-3 text-sm text-amber-200"> <svg class="mt-0.5 h-5 w-5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path> </svg> <div> <p class="font-bold text-amber-300">This video may be restricted in your region.</p> <p class="text-xs mt-0.5 text-amber-400">Please use a VPN to watch securely &mdash; turn on your VPN and reload the page.</p> </div> </div> <!-- VPN Notice Bar --> <div id="vpn-notice" class="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-700/50 bg-slate-900/80 px-4 py-2.5 backdrop-blur-sm"> <div class="flex items-center gap-2.5 text-xs text-slate-400"> <svg class="h-4 w-4 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path> </svg> <span> <strong class="text-slate-300">Video not loading?</strong>
&nbsp;Please use a <strong class="text-rose-400">VPN</strong> to watch securely.
</span> </div> <button id="vpn-notice-close" aria-label="Dismiss VPN notice" class="ml-2 shrink-0 text-slate-600 hover:text-slate-300 transition-colors"> <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <!-- Video Title & Actions --> <div class="mt-6 border-b border-slate-900 pb-6"> <h1 class="text-xl font-extrabold text-white sm:text-2xl lg:text-3xl leading-snug"> `, ' </h1> <!-- Stats Dashboard --> <div class="flex flex-wrap items-center justify-between mt-4 gap-4 text-xs text-slate-400"> <div class="flex items-center space-x-6"> <!-- Views --> <span class="flex items-center"> <svg class="h-4 w-4 mr-1.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path> </svg> <strong class="text-slate-200 font-semibold mr-1">', '</strong> Views\n</span> <!-- Rating --> <span class="flex items-center text-amber-400"> <svg class="h-4 w-4 mr-1 text-amber-500" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path> </svg> <strong class="font-bold mr-1">', '%</strong> Rating\n</span> <!-- Upload Date --> <span class="hidden sm:inline">\nAdded: <strong class="text-slate-300 font-semibold">', '</strong> </span> </div> <!-- Action buttons --> <div class="flex items-center space-x-2"> <button id="share-btn" class="flex items-center space-x-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500 hover:text-white px-3 py-1.5 transition-colors"> <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 10.742s-1.839 2.51-1.839 5.258c0 1.543.826 2.37 2.148 2.37 1.44 0 2.215-.815 3.016-1.782.784.957 1.56 1.782 3.016 1.782 1.322 0 2.148-.827 2.148-2.37 0-2.748-1.839-5.258-1.839-5.258m-6.65 0L12 4l3.334 6.742"></path> </svg> <span id="share-btn-text">Share</span> </button> </div> </div> </div> <!-- Tags / Categories --> <div class="py-6"> <h3 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Tags & Categories</h3> <div class="flex flex-wrap gap-2"> <span class="text-xs rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 px-3 py-1 font-semibold uppercase"> ', " </span> ", ' </div> </div> <!-- Related Videos Grid --> <div class="mt-8 border-t border-slate-900 pt-8"> <h2 class="text-lg font-extrabold text-white mb-6">Related Videos</h2> ', ' </div> </div> <!-- Sidebar Ads / Info (Righthand Column) --> <div class="lg:col-span-4 flex flex-col space-y-6"> <!-- Ad Banner (300x250 sidebar) --> ', ' <!-- Compliance & Safe Content Info Box --> <div class="rounded-xl border border-slate-900 bg-slate-950/80 p-5 text-slate-400 text-xs leading-relaxed space-y-3"> <h3 class="font-bold text-slate-200 text-sm flex items-center space-x-1.5 border-b border-slate-900 pb-2"> <span class="text-rose-500 font-extrabold">🔞</span> <span>Safety & Content Policy</span> </h3> <p>\nVixTube is a video embed directory indexing publicly hosted video links. We have zero tolerance for illegal content.\n</p> </div> </div> <!-- Second Ad Banner in sidebar --> ', ` </div> </div>  <script>
      document.addEventListener('DOMContentLoaded', () => {
        // ── Share Button ──────────────────────────────────────────────────────────
        const shareBtn = document.getElementById('share-btn');
        const shareBtnText = document.getElementById('share-btn-text');
        
        if (shareBtn) {
          shareBtn.addEventListener('click', async () => {
            const shareData = {
              title: document.title,
              text: 'Watch this free video on VixTube Premium!',
              url: window.location.href
            };

            // Mobile Native Share (if supported)
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
              try {
                await navigator.share(shareData);
                return;
              } catch (err) {
                console.log('Native share failed or dismissed:', err);
              }
            }

            // Clipboard Copy Fallback (for desktops/laptops)
            try {
              await navigator.clipboard.writeText(window.location.href);
              
              if (shareBtnText) {
                const originalText = shareBtnText.textContent;
                shareBtnText.textContent = 'Copied!';
                shareBtn.classList.add('border-green-500', 'text-green-400');
                
                setTimeout(() => {
                  shareBtnText.textContent = originalText;
                  shareBtn.classList.remove('border-green-500', 'text-green-400');
                }, 2000);
              }
            } catch (err) {
              console.error('Failed to copy to clipboard:', err);
            }
          });
        }

        // ── VPN Notice Dismiss (remembers via localStorage) ───────────────────────
        const vpnNotice = document.getElementById('vpn-notice');
        const vpnClose = document.getElementById('vpn-notice-close');

        if (vpnNotice) {
          // If user already dismissed it, hide permanently
          if (localStorage.getItem('vpn-notice-dismissed') === '1') {
            vpnNotice.style.display = 'none';
          }

          if (vpnClose) {
            vpnClose.addEventListener('click', () => {
              vpnNotice.style.display = 'none';
              localStorage.setItem('vpn-notice-dismissed', '1');
            });
          }
        }

        // ── Country Block Banner (via cookie set by Vercel Edge Middleware) ───────
        const countryBanner = document.getElementById('country-block-banner');
        if (countryBanner) {
          // Read the "vxt_blocked" cookie set by Edge Middleware
          const isBlocked = document.cookie.split(';').some(c => c.trim() === 'vxt_blocked=1');
          if (isBlocked) {
            countryBanner.style.display = 'flex';
            // Hide the regular VPN notice when the country-block banner is shown
            if (vpnNotice) vpnNotice.style.display = 'none';
          }
        }
      });
    <\/script> `, ""])), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": uniqueTitle,
    "description": `Watch ${uniqueTitle} adult video online for free. Category: ${category}.`,
    "thumbnailUrl": thumbnailUrl || "https://vixtube.net/og-image.jpg",
    "uploadDate": safeISODate(dateAdded),
    "embedUrl": embedUrl,
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": { "@type": "WatchAction" },
      "userInteractionCount": typeof views === "number" ? views : parseInt(views) || 0
    }
  })), maybeRenderHead(), addAttribute(`/category/${catSlug}`, "href"), category, uniqueTitle, embedUrl.includes("xxxbp.tv") ? renderTemplate`<div id="xxxbp-player-container" class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-slate-950"> <div class="flex flex-col items-center space-y-3"> <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div> <span class="text-xs text-slate-500">Loading premium ad-free player...</span> </div> </div>` : renderTemplate`<iframe${addAttribute(embedUrl, "src")} class="absolute top-0 left-0 w-full h-full" frameborder="0" allowfullscreen="true" scrolling="no"${addAttribute(title, "title")}></iframe>`, defineScriptVars({ embedUrl }), uniqueTitle, formatViews(views), rating, dateAdded, category, tags.map((tag) => {
    const tagSlug = tag.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
    return renderTemplate`<a${addAttribute(`/tag/${tagSlug}`, "href")} class="text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 px-3 py-1 transition-colors">
#${tag} </a>`;
  }), relatedVideos.length === 0 ? renderTemplate`<p class="text-xs text-slate-500">No other videos in this category yet.</p>` : renderTemplate`<div class="grid grid-cols-1 sm:grid-cols-2 gap-6"> ${relatedVideos.map((video2) => renderTemplate`${renderComponent($$result2, "VideoCard", $$VideoCard, { "video": video2 })}`)} </div>`, renderComponent($$result2, "AdContainer", $$AdContainer, { "slotType": "banner_300x250" }), renderComponent($$result2, "AdContainer", $$AdContainer, { "slotType": "banner_468x60" }), embedUrl.includes("xxxbp.tv") && renderTemplate(_a || (_a = __template(["<script>(function(){", `
        document.addEventListener('DOMContentLoaded', async () => {
          const container = document.getElementById('xxxbp-player-container');
          if (!container) return;

          const idMatch = embedUrl.match(/\\/embed\\/(\\d+)/) || embedUrl.match(/\\/video\\/(\\d+)/);
          if (!idMatch) {
            container.innerHTML = '<div class="text-rose-500 text-sm">Failed to extract Video ID</div>';
            return;
          }
          const videoId = idMatch[1];

          try {
            const response = await fetch('https://api.xxxbp.tv/hls', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: \`id=\${videoId}&sizes=144,240,360,480,720\`
            });

            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();

            if (data && data.mp4 && data.mp4.length > 0) {
              const sortedMp4 = data.mp4.sort((a, b) => {
                const resA = parseInt(a.title) || 0;
                const resB = parseInt(b.title) || 0;
                return resB - resA;
              });
              const bestSource = sortedMp4[0].src;

              container.innerHTML = \`
                <video 
                  src="\${bestSource}" 
                  poster="\${thumbnailUrl}"
                  class="w-full h-full" 
                  controls 
                  playsinline
                  style="object-fit: contain; background: black;"
                ></video>
              \`;
            } else {
              throw new Error('No MP4 sources found');
            }
          } catch (err) {
            console.error('Error rendering player:', err);
            container.innerHTML = '<div class="text-rose-500 text-sm p-4 text-center">Failed to load video player. Click the link below to watch directly.</div>';
          }
        });
      })();<\/script>`], ["<script>(function(){", `
        document.addEventListener('DOMContentLoaded', async () => {
          const container = document.getElementById('xxxbp-player-container');
          if (!container) return;

          const idMatch = embedUrl.match(/\\\\/embed\\\\/(\\\\d+)/) || embedUrl.match(/\\\\/video\\\\/(\\\\d+)/);
          if (!idMatch) {
            container.innerHTML = '<div class="text-rose-500 text-sm">Failed to extract Video ID</div>';
            return;
          }
          const videoId = idMatch[1];

          try {
            const response = await fetch('https://api.xxxbp.tv/hls', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: \\\`id=\\\${videoId}&sizes=144,240,360,480,720\\\`
            });

            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();

            if (data && data.mp4 && data.mp4.length > 0) {
              const sortedMp4 = data.mp4.sort((a, b) => {
                const resA = parseInt(a.title) || 0;
                const resB = parseInt(b.title) || 0;
                return resB - resA;
              });
              const bestSource = sortedMp4[0].src;

              container.innerHTML = \\\`
                <video 
                  src="\\\${bestSource}" 
                  poster="\\\${thumbnailUrl}"
                  class="w-full h-full" 
                  controls 
                  playsinline
                  style="object-fit: contain; background: black;"
                ></video>
              \\\`;
            } else {
              throw new Error('No MP4 sources found');
            }
          } catch (err) {
            console.error('Error rendering player:', err);
            container.innerHTML = '<div class="text-rose-500 text-sm p-4 text-center">Failed to load video player. Click the link below to watch directly.</div>';
          }
        });
      })();<\/script>`])), defineScriptVars({ embedUrl, thumbnailUrl }))) })} `;
}, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/videos/[slug].astro", void 0);

const $$file = "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/videos/[slug].astro";
const $$url = "/videos/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
