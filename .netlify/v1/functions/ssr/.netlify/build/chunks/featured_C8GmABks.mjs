import { c as createComponent } from './consts_CfqUMRV8.mjs';
import 'piccolore';
import { aZ as renderTemplate, aO as maybeRenderHead, a6 as addAttribute, n as Fragment } from './params-and-props_NoTlu8e-.mjs';
import { r as renderComponent } from './ssr-function_BPzFoMXi.mjs';
import { g as getCollection } from './_astro_content_BE1xHoIF.mjs';
import { $ as $$Layout } from './Layout_CFKtLFj5.mjs';
import { $ as $$AdContainer } from './AdContainer_DjUoE-cj.mjs';
import { $ as $$VideoCard } from './VideoCard_BW1YoVSC.mjs';

const $$Featured = createComponent(async ($$result, $$props, $$slots) => {
  const PER_PAGE = 40;
  let videos = [];
  try {
    videos = await getCollection("videos");
  } catch (e) {
    console.log("No videos found in content layer", e);
  }
  const featuredVideos = [...videos].sort((a, b) => (b.data.rating || 90) - (a.data.rating || 90));
  const totalVideos = featuredVideos.length;
  const totalPages = Math.ceil(totalVideos / PER_PAGE);
  const pagedVideos = featuredVideos.slice(0, PER_PAGE);
  const categories = [...new Set(videos.map((v) => v.data.category))].filter(Boolean).sort((a, b) => {
    if (a === "Indian") return -1;
    if (b === "Indian") return 1;
    return a.localeCompare(b);
  });
  const slugify = (text) => text.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
  const nextUrl = totalPages > 1 ? `/featured/2` : null;
  const pageRange = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - 1) <= 2
  );
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Featured Adult Videos & Top Rated XXX Clips | VixTube Premium", "description": "Watch the highest-rated adult videos, premium featured XXX clips, and top amateur releases online. High speed streaming on any mobile device." }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative overflow-hidden bg-slate-950 py-12 border-b border-slate-900"> <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/20 via-slate-950 to-slate-950"></div> <div class="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"> <h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
Featured <span class="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">Adult Videos</span> </h1> <p class="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-400">
Streaming the highest-rated porn clips, top-trending tags, and hot amateur releases. Updated daily.
</p> ${renderComponent($$result2, "AdContainer", $$AdContainer, { "slotType": "banner_728x90", "className": "hidden sm:flex" })} ${renderComponent($$result2, "AdContainer", $$AdContainer, { "slotType": "banner_468x60", "className": "flex sm:hidden" })} </div> </section>  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"> <!-- Categories Selector --> <div class="mb-6"> <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Categories</h2> <div class="flex flex-wrap gap-2"> <a href="/" class="rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap border bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 transition-all">
All Videos
</a> ${categories.map((cat) => renderTemplate`<a${addAttribute(`/category/${slugify(cat)}`, "href")} class="rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap border bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 transition-all"> ${cat} </a>`)} </div> </div> <!-- Active Filter Info --> <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-900 pt-6 mb-8 gap-4"> <div class="text-sm text-slate-400">
Showing: <span class="text-rose-400 font-medium">Top Featured Videos</span> <span class="text-xs text-slate-600 ml-1">(${totalVideos} total · showing ${pagedVideos.length})</span> </div> ${totalPages > 1 && renderTemplate`<div class="text-xs text-slate-500 font-medium">Page <span class="text-white font-bold">1</span> / ${totalPages}</div>`} <!-- Sorting Controls --> <div class="flex items-center space-x-2"> <span class="text-xs text-slate-500 font-medium">Sort By:</span> <div class="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-xs"> <a href="/" class="rounded-md px-3 py-1 font-medium transition-colors text-slate-400 hover:text-slate-200">
Recent
</a> <a href="/popular" class="rounded-md px-3 py-1 font-medium transition-colors text-slate-400 hover:text-slate-200">
Most Viewed
</a> <a href="/featured" class="rounded-md px-3 py-1 font-medium transition-colors bg-slate-800 text-white">
Top Rated
</a> </div> </div> </div> <!-- Video Grid --> ${pagedVideos.length === 0 ? renderTemplate`<div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 py-20 text-center"> <h3 class="text-lg font-bold text-slate-200">No Videos Found</h3> </div>` : renderTemplate`<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"> ${pagedVideos.map((video) => renderTemplate`${renderComponent($$result2, "VideoCard", $$VideoCard, { "video": video })}`)} </div>`} <!-- Pagination --> ${totalPages > 1 && renderTemplate`<div class="flex items-center justify-center gap-3 mt-12 pt-8 border-t border-slate-900"> <span class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/40 border border-slate-900 text-sm font-semibold text-slate-700 cursor-not-allowed"> <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
Previous
</span> <div class="flex items-center gap-1"> ${pageRange.map((p, idx) => {
    const prev = pageRange[idx - 1];
    const showDots = prev && p - prev > 1;
    return renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${showDots && renderTemplate`<span class="text-slate-600 px-1">…</span>`}<a${addAttribute(p === 1 ? `/featured` : `/featured/${p}`, "href")}${addAttribute(`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${p === 1 ? "bg-rose-600 text-white border border-rose-500 shadow-lg shadow-rose-600/30" : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"}`, "class")}> ${p} </a> ` })}`;
  })} </div> ${nextUrl ? renderTemplate`<a${addAttribute(nextUrl, "href")} class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 border border-rose-500 text-sm font-semibold text-white hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20">
Next
<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg> </a>` : renderTemplate`<span class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/40 border border-slate-900 text-sm font-semibold text-slate-700 cursor-not-allowed">
Next
<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg> </span>`} </div>`} </section> ` })}`;
}, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/featured.astro", void 0);

const $$file = "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/featured.astro";
const $$url = "/featured";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Featured,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
