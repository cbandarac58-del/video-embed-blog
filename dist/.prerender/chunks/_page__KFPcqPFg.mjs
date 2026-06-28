import { n as getCollection, r as __exportAll } from "./_astro_content_CSD6qwR1.mjs";
import { T as createComponent, a as renderComponent, f as renderTemplate, g as maybeRenderHead, v as addAttribute, w as createAstro } from "./server_DdnRNRi_.mjs";
import { t as $$Layout } from "./Layout_CqI_4LJ3.mjs";
import { t as $$VideoCard } from "./VideoCard_DnZh-vgx.mjs";
//#region src/pages/page/[page].astro
var _page__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Page,
	file: () => $$file,
	getStaticPaths: () => getStaticPaths,
	url: () => $$url
});
createAstro("https://vixtube.net");
async function getStaticPaths() {
	const { getCollection } = await import("./_astro_content_CSD6qwR1.mjs").then((n) => n.t);
	const videos = await getCollection("videos");
	const totalPages = Math.ceil(videos.length / 40);
	const paths = [];
	for (let p = 2; p <= totalPages; p++) paths.push({ params: { page: p.toString() } });
	return paths;
}
var $$Page = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Page;
	const { page } = Astro.params;
	const currentPage = parseInt(page || "1", 10);
	const VIDEOS_PER_PAGE = 40;
	let videos = [];
	try {
		videos = await getCollection("videos");
	} catch (e) {
		console.log("No videos found in content layer yet.", e);
	}
	const categories = [...new Set(videos.map((v) => v.data.category))].filter(Boolean);
	const allTags = [...new Set(videos.flatMap((v) => v.data.tags))].filter(Boolean).slice(0, 15);
	let filteredVideos = [...videos];
	filteredVideos.sort((a, b) => {
		return new Date(b.data.dateAdded).getTime() - new Date(a.data.dateAdded).getTime();
	});
	const start = (currentPage - 1) * VIDEOS_PER_PAGE;
	const pageVideos = filteredVideos.slice(start, start + VIDEOS_PER_PAGE);
	const totalFilteredPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
	function pageUrl(p) {
		if (p === 1) return "/";
		return `/page/${p}`;
	}
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Page ${currentPage} — Free Adult Videos, XXX Clips & Desi Porn` }, { "default": async ($$result) => renderTemplate`

  
  ${maybeRenderHead($$result)}<section class="relative overflow-hidden bg-slate-950 py-10 border-b border-slate-900"><div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/20 via-slate-950 to-slate-950"></div><div class="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"><h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Watch Free HD <span class="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">Porn & XXX Videos</span></h1><p class="mx-auto mt-3 max-w-2xl text-sm text-slate-400">Page ${currentPage} of ${totalFilteredPages} — ${filteredVideos.length} total videos</p></div></section>

  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><!-- Category Filter --><div class="mb-6"><h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Categories</h2><div class="flex space-x-2 overflow-x-auto pb-2 scrollbar-none"><a${addAttribute(pageUrl(1), "href")}${addAttribute(`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap border transition-all bg-rose-600 border-rose-500 text-white`, "class")}>All Videos</a>${categories.map((category) => {
		return renderTemplate`<a${addAttribute(`/category/${category.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "")}`, "href")} class="rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap border bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 transition-all">${category}</a>`;
	})}</div></div><!-- Sort + Status bar --><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-900 pt-6 mb-8 gap-4"><div class="text-sm text-slate-400">Showing <span class="text-rose-400 font-medium">${pageVideos.length}</span> of <span class="text-rose-400 font-medium">${filteredVideos.length}</span> videos — Page <span class="text-white font-bold">${currentPage}</span>/${totalFilteredPages}</div><div class="flex items-center space-x-2"><span class="text-xs text-slate-500 font-medium">Sort By:</span><div class="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-xs"><a${addAttribute(currentPage === 1 ? "/" : `/page/${currentPage}`, "href")} class="rounded-md px-3 py-1 font-medium transition-colors bg-slate-800 text-white">Recent</a><a${addAttribute(currentPage === 1 ? "/popular" : `/popular/${currentPage}`, "href")} class="rounded-md px-3 py-1 font-medium transition-colors text-slate-400 hover:text-slate-200">Most Viewed</a><a${addAttribute(currentPage === 1 ? "/featured" : `/featured/${currentPage}`, "href")} class="rounded-md px-3 py-1 font-medium transition-colors text-slate-400 hover:text-slate-200">Top Rated</a></div></div></div><!-- Video Grid --><div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">${pageVideos.map((video) => renderTemplate`${renderComponent($$result, "VideoCard", $$VideoCard, { "video": video })}`)}</div><!-- Pagination Controls --><div class="mt-12 flex items-center justify-center gap-2 flex-wrap">${currentPage > 1 ? renderTemplate`<a${addAttribute(pageUrl(currentPage - 1), "href")} class="flex items-center gap-1 rounded-lg bg-slate-900 border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-rose-600 hover:border-rose-500 hover:text-white transition-all">← Prev</a>` : renderTemplate`<span class="flex items-center gap-1 rounded-lg bg-slate-900/40 border border-slate-800/40 px-4 py-2 text-sm font-semibold text-slate-600 cursor-not-allowed">← Prev</span>`}${(() => {
		const delta = 2;
		const pages = [];
		pages.push(1);
		const rangeStart = Math.max(2, currentPage - delta);
		const rangeEnd = Math.min(totalFilteredPages - 1, currentPage + delta);
		if (rangeStart > 2) pages.push("...");
		for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
		if (rangeEnd < totalFilteredPages - 1) pages.push("...");
		if (totalFilteredPages > 1) pages.push(totalFilteredPages);
		return pages.map((p, idx) => p === "..." ? renderTemplate`<span${addAttribute(`dots-${idx}`, "key")} class="px-1 text-slate-600 select-none">…</span>` : renderTemplate`<a${addAttribute(p, "key")}${addAttribute(pageUrl(p), "href")}${addAttribute(`rounded-lg border px-3.5 py-2 text-sm font-bold transition-all ${p === currentPage ? "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30" : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"}`, "class")}>${p}</a>`);
	})()}${currentPage < totalFilteredPages ? renderTemplate`<a${addAttribute(pageUrl(currentPage + 1), "href")} class="flex items-center gap-1 rounded-lg bg-rose-600 border border-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/30">Next →</a>` : renderTemplate`<span class="flex items-center gap-1 rounded-lg bg-slate-900/40 border border-slate-800/40 px-4 py-2 text-sm font-semibold text-slate-600 cursor-not-allowed">Next →</span>`}</div><!-- Tag Cloud --><div class="mt-16 border-t border-slate-900 pt-8"><h3 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Trending Tags</h3><div class="flex flex-wrap gap-2">${allTags.map((tag) => {
		return renderTemplate`<a${addAttribute(`/tag/${tag.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "")}`, "href")} class="text-xs rounded-lg border px-3 py-1 transition-all bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200">#${tag}</a>`;
	})}</div></div></section>
` })}`;
}, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/page/[page].astro", void 0);
var $$file = "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/page/[page].astro";
var $$url = "/page/[page]";
//#endregion
//#region \0virtual:astro:page:src/pages/page/[page]@_@astro
var page = () => _page__exports;
//#endregion
export { page };
