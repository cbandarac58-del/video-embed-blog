import { c as createComponent } from './consts_CfqUMRV8.mjs';
import 'piccolore';
import { aZ as renderTemplate, aO as maybeRenderHead, a6 as addAttribute } from './params-and-props_NoTlu8e-.mjs';
import { r as renderComponent } from './ssr-function_BPzFoMXi.mjs';
import { g as getCollection } from './_astro_content_BE1xHoIF.mjs';
import { $ as $$Layout } from './Layout_CFKtLFj5.mjs';
import { $ as $$VideoCard } from './VideoCard_BW1YoVSC.mjs';

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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${tagName} Videos – ${videos.length} Free XXX Clips | VixTube`, "description": tagDesc }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative overflow-hidden bg-slate-950 py-12 border-b border-slate-900"> <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/20 via-slate-950 to-slate-950"></div> <div class="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"> <h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
Videos Tagged: <span class="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">#${tagName}</span> </h1> <p class="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-400">
Streaming the highest-rated free porn videos tagged with #${tagName}. Fully optimized for all mobile platforms.
</p> </div> </section>  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"> <!-- Categories Selector --> <div class="mb-6"> <h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Categories</h2> <div class="flex space-x-2 overflow-x-auto pb-2 scrollbar-none"> <a href="/" class="rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap border bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 transition-all">
All Videos
</a> ${allCategories.map((cat) => renderTemplate`<a${addAttribute(`/category/${slugify(cat)}`, "href")} class="rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap border bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 transition-all"> ${cat} </a>`)} </div> </div> <!-- Active Tag Info --> <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-900 pt-6 mb-8 gap-4"> <div class="text-sm text-slate-400">
Showing videos tagged with: <span class="text-rose-400 font-medium">#${tagName}</span> <span class="text-xs text-slate-600 ml-1">(${videos.length} items)</span> </div> </div> <!-- Video Grid --> ${videos.length === 0 ? renderTemplate`<div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 py-20 text-center"> <h3 class="text-lg font-bold text-slate-200">No Videos Found</h3> </div>` : renderTemplate`<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"> ${videos.map((video) => renderTemplate`${renderComponent($$result2, "VideoCard", $$VideoCard, { "video": video })}`)} </div>`} </section> ` })}`;
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
