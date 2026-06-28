import { c as createComponent } from './consts_CfqUMRV8.mjs';
import 'piccolore';
import { aZ as renderTemplate, aO as maybeRenderHead, a6 as addAttribute } from './params-and-props_NoTlu8e-.mjs';
import { r as renderComponent } from './ssr-function_BPzFoMXi.mjs';
import { g as getCollection } from './_astro_content_BE1xHoIF.mjs';
import { $ as $$Layout } from './Layout_CFKtLFj5.mjs';
import { $ as $$VideoCard } from './VideoCard_BW1YoVSC.mjs';

const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const PER_PAGE = 40;
  const { slug } = Astro2.params;
  if (!slug) {
    return new Response(null, {
      status: 404,
      statusText: "Not Found"
    });
  }
  let allVideos = [];
  try {
    allVideos = await getCollection("videos");
  } catch (e) {
    console.log("No videos found", e);
  }
  const slugify = (text) => text.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
  const allCategories = [...new Set(allVideos.map((v) => v.data.category))].filter(Boolean).sort((a, b) => {
    if (a === "Indian") return -1;
    if (b === "Indian") return 1;
    return a.localeCompare(b);
  });
  const categoryName = allCategories.find((cat) => slugify(cat) === slug);
  if (!categoryName) {
    return new Response(null, {
      status: 404,
      statusText: "Category Not Found"
    });
  }
  const categoryVideos = allVideos.filter((v) => v.data.category === categoryName).sort((a, b) => new Date(b.data.dateAdded).getTime() - new Date(a.data.dateAdded).getTime());
  const totalVideos = categoryVideos.length;
  const totalPages = Math.ceil(totalVideos / PER_PAGE);
  const videos = categoryVideos.slice(0, PER_PAGE);
  const baseSlug = slug;
  const nextUrl = totalPages > 1 ? `/category/${baseSlug}/2` : null;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${categoryName} Porn Videos – ${totalVideos} Free XXX Clips | VixTube`, "description": `Stream ${totalVideos} free ${categoryName} adult videos online. Page 1 of ${totalPages}. HD quality, mobile friendly, no registration required.` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="relative overflow-hidden bg-slate-950 py-12 border-b border-slate-900"> <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/20 via-slate-950 to-slate-950"></div> <div class="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"> <h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
Free <span class="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">${categoryName} Videos</span> </h1> <p class="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-400"> ${totalVideos} videos · Page 1 of ${totalPages} </p> </div> </section> <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"> <div class="mb-6"> <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Categories</h2> <div class="flex flex-wrap gap-2"> <a href="/" class="rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap border bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 transition-all">All Videos</a> ${allCategories.map((cat) => renderTemplate`<a${addAttribute(`/category/${slugify(cat)}`, "href")}${addAttribute(`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap border transition-all ${categoryName.toLowerCase() === cat.toLowerCase() ? "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/20" : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"}`, "class")}>${cat}</a>`)} </div> </div> <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-900 pt-6 mb-8 gap-4"> <div class="text-sm text-slate-400">
Category: <span class="text-rose-400 font-medium">${categoryName}</span> <span class="text-xs text-slate-600 ml-1">(${totalVideos} total · showing ${videos.length})</span> </div> ${totalPages > 1 && renderTemplate`<div class="text-xs text-slate-500 font-medium">Page <span class="text-white font-bold">1</span> / ${totalPages}</div>`} </div> <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"> ${videos.map((video) => renderTemplate`${renderComponent($$result2, "VideoCard", $$VideoCard, { "video": video })}`)} </div> ${totalPages > 1 && renderTemplate`<div class="flex items-center justify-center gap-3 mt-12 pt-8 border-t border-slate-900"> <span class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/40 border border-slate-900 text-sm font-semibold text-slate-700 cursor-not-allowed"> <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
Previous
</span> <div class="flex items-center gap-1"> ${Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => renderTemplate`<a${addAttribute(p === 1 ? `/category/${baseSlug}` : `/category/${baseSlug}/${p}`, "href")}${addAttribute(`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${p === 1 ? "bg-rose-600 text-white border border-rose-500 shadow-lg shadow-rose-600/30" : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"}`, "class")}> ${p} </a>`)} ${totalPages > 7 && renderTemplate`<span class="text-slate-600 px-1">…</span>`} </div> ${nextUrl && renderTemplate`<a${addAttribute(nextUrl, "href")} class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 border border-rose-500 text-sm font-semibold text-white hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20">
Next
<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg> </a>`} </div>`} </section> ` })}`;
}, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/category/[slug].astro", void 0);

const $$file = "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/category/[slug].astro";
const $$url = "/category/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
