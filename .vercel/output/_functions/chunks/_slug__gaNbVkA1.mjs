import { c as createComponent } from './consts_mo-vM6Kk.mjs';
import 'piccolore';
import { bb as renderTemplate, aX as maybeRenderHead, a6 as addAttribute } from './params-and-props_DsYBBh82.mjs';
import { r as renderComponent } from './entrypoint_Bjf-1lA6.mjs';
import { g as getCollection, $ as $$Layout } from './Layout_CEJTXjIt.mjs';

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
  const slugify = (text) => text.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
  let allVideos = [];
  try {
    allVideos = await getCollection("videos");
  } catch (e) {
    console.log("No videos found in content layer", e);
  }
  const allCategories = [...new Set(allVideos.map((v) => v.data.category))].filter(Boolean);
  const matchingVideos = allVideos.filter(
    (v) => (v.data.tags || []).some((tag) => slugify(tag) === slug)
  );
  if (matchingVideos.length === 0) {
    return new Response(null, {
      status: 404,
      statusText: "Tag Not Found"
    });
  }
  let tagName = slug;
  for (const v of matchingVideos) {
    const match = (v.data.tags || []).find((tag) => slugify(tag) === slug);
    if (match) {
      tagName = match.trim();
      break;
    }
  }
  const videos = matchingVideos.sort((a, b) => new Date(b.data.dateAdded).getTime() - new Date(a.data.dateAdded).getTime());
  const topTitles = videos.slice(0, 2).map((v) => v.data.title).join(", ");
  const tagDesc = `Watch ${videos.length} free ${tagName} XXX videos online. Top picks: ${topTitles}. Stream HD adult content on any device.`;
  function formatViews(val) {
    if (typeof val === "string") return val;
    if (val >= 1e6) return (val / 1e6).toFixed(1) + "M";
    if (val >= 1e3) return (val / 1e3).toFixed(0) + "K";
    return val.toString();
  }
  function getCardGradient(videoSlug) {
    const hash = videoSlug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradients = [
      "from-rose-600/20 to-purple-600/10 hover:from-rose-500/30 hover:to-purple-500/20",
      "from-purple-600/20 to-indigo-600/10 hover:from-purple-500/30 hover:to-indigo-500/20",
      "from-pink-600/20 to-rose-600/10 hover:from-pink-500/30 hover:to-rose-500/20",
      "from-indigo-600/20 to-violet-600/10 hover:from-indigo-500/30 hover:to-violet-500/20",
      "from-amber-600/20 to-rose-600/10 hover:from-amber-500/30 hover:to-rose-500/20"
    ];
    return gradients[hash % gradients.length];
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${tagName} Videos – ${videos.length} Free XXX Clips | VixTube`, "description": tagDesc }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative overflow-hidden bg-slate-950 py-12 border-b border-slate-900"> <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/20 via-slate-950 to-slate-950"></div> <div class="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"> <h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
Videos Tagged: <span class="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">#${tagName}</span> </h1> <p class="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-400">
Streaming the highest-rated free porn videos tagged with #${tagName}. Fully optimized for all mobile platforms.
</p> </div> </section>  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"> <!-- Categories Selector --> <div class="mb-6"> <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Categories</h2> <div class="flex space-x-2 overflow-x-auto pb-2 scrollbar-none"> <a href="/" class="rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap border bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 transition-all">
All Videos
</a> ${allCategories.map((cat) => renderTemplate`<a${addAttribute(`/category/${slugify(cat)}`, "href")} class="rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap border bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 transition-all"> ${cat} </a>`)} </div> </div> <!-- Active Tag Info --> <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-900 pt-6 mb-8 gap-4"> <div class="text-sm text-slate-400">
Showing videos tagged with: <span class="text-rose-400 font-medium">#${tagName}</span> <span class="text-xs text-slate-600 ml-1">(${videos.length} items)</span> </div> </div> <!-- Video Grid --> ${videos.length === 0 ? renderTemplate`<div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 py-20 text-center"> <h3 class="text-lg font-bold text-slate-200">No Videos Found</h3> </div>` : renderTemplate`<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"> ${videos.map((video) => {
    const { title, slug: videoSlug, rating, views, category, thumbnailUrl } = video.data;
    return renderTemplate`<a${addAttribute(`/videos/${videoSlug}`, "href")} class="group relative flex flex-col rounded-xl overflow-hidden border border-slate-900 bg-slate-950 transition-all hover:-translate-y-1 hover:border-slate-800 hover:shadow-xl hover:shadow-rose-950/5"> <div${addAttribute(`relative aspect-video w-full overflow-hidden flex items-center justify-center bg-slate-900 ${!thumbnailUrl ? `bg-gradient-to-br ${getCardGradient(videoSlug)}` : ""}`, "class")}> ${thumbnailUrl && renderTemplate`<img${addAttribute(thumbnailUrl, "src")} referrerpolicy="no-referrer"${addAttribute(title, "alt")} loading="lazy" class="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500">`} <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/30 to-slate-950/85"></div> <div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-slate-950/80 border border-slate-800 text-white group-hover:scale-110 group-hover:bg-rose-600 group-hover:border-rose-500 transition-all shadow-lg"> <svg class="h-5 w-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"> <path d="M8 5v14l11-7z"></path> </svg> </div> <span class="absolute top-3 left-3 z-10 flex items-center space-x-1 rounded bg-slate-950/90 border border-slate-800/80 px-2 py-0.5 text-[10px] font-bold text-amber-400"> <span>★</span> <span>${rating}%</span> </span> <span class="absolute bottom-3 right-3 z-10 rounded bg-rose-600 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white"> ${category} </span> </div> <div class="flex flex-col flex-1 p-4"> <h3 class="text-sm font-bold text-slate-200 line-clamp-2 group-hover:text-white group-hover:underline transition-colors min-h-[40px]">${title}</h3> <div class="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-900"> <span class="flex items-center"> <svg class="h-3 w-3 mr-1 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path> </svg> ${formatViews(views)} </span> <span>${video.data.dateAdded}</span> </div> </div> </a>`;
  })} </div>`} </section> ` })}`;
}, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/tag/[slug].astro", void 0);

const $$file = "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/tag/[slug].astro";
const $$url = "/tag/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
