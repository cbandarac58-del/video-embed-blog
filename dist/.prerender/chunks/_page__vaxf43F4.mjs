import { n as getCollection, r as __exportAll } from "./_astro_content_CSD6qwR1.mjs";
import { T as createComponent, a as renderComponent, f as renderTemplate, g as maybeRenderHead, o as Fragment, v as addAttribute, w as createAstro } from "./server_DdnRNRi_.mjs";
import { t as $$Layout } from "./Layout_CqI_4LJ3.mjs";
import { t as $$VideoCard } from "./VideoCard_DnZh-vgx.mjs";
//#region src/pages/category/[slug]/[page].astro
var _page__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Page,
	file: () => $$file,
	getStaticPaths: () => getStaticPaths,
	url: () => $$url
});
createAstro("https://vixtube.net");
async function getStaticPaths() {
	const allVideos = await getCollection("videos");
	const slugify = (text) => text.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
	const allCategories = [...new Set(allVideos.map((v) => v.data.category))].filter(Boolean);
	const paths = [];
	const PER_PAGE = 40;
	for (const category of allCategories) {
		const totalVideos = allVideos.filter((v) => v.data.category === category).length;
		const totalPages = Math.ceil(totalVideos / PER_PAGE);
		for (let p = 2; p <= totalPages; p++) paths.push({
			params: {
				slug: slugify(category),
				page: p.toString()
			},
			props: { categoryName: category }
		});
	}
	return paths;
}
var $$Page = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Page;
	const PER_PAGE = 40;
	const { slug, page } = Astro.params;
	const { categoryName } = Astro.props;
	const currentPage = parseInt(page || "2", 10);
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
	const categoryVideos = allVideos.filter((v) => v.data.category === categoryName).sort((a, b) => new Date(b.data.dateAdded).getTime() - new Date(a.data.dateAdded).getTime());
	const totalVideos = categoryVideos.length;
	const totalPages = Math.ceil(totalVideos / PER_PAGE);
	const videos = categoryVideos.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
	const baseSlug = slug;
	const prevUrl = currentPage === 2 ? `/category/${baseSlug}` : `/category/${baseSlug}/${currentPage - 1}`;
	const nextUrl = currentPage < totalPages ? `/category/${baseSlug}/${currentPage + 1}` : null;
	const pageRange = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `Watch Free ${categoryName} XXX Videos – Page ${currentPage}`,
		"description": `Browse ${categoryName} adult videos page ${currentPage} of ${totalPages}. ${totalVideos} videos total. Free streaming.`
	}, { "default": async ($$result) => renderTemplate`
  ${maybeRenderHead($$result)}<section class="relative overflow-hidden bg-slate-950 py-12 border-b border-slate-900"><div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/20 via-slate-950 to-slate-950"></div><div class="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"><h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Free <span class="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">${categoryName} Videos</span></h1><p class="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-400">${totalVideos} videos · Page ${currentPage} of ${totalPages}</p></div></section>

  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><!-- Category pills --><div class="mb-6"><h2 class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Categories</h2><div class="flex flex-wrap gap-2"><a href="/" class="rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap border bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 transition-all">All Videos</a>${allCategories.map((cat) => renderTemplate`<a${addAttribute(`/category/${slugify(cat)}`, "href")}${addAttribute(`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap border transition-all ${categoryName.toLowerCase() === cat.toLowerCase() ? "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/20" : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"}`, "class")}>${cat}</a>`)}</div></div><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-900 pt-6 mb-8 gap-4"><div class="text-sm text-slate-400">Category: <span class="text-rose-400 font-medium">${categoryName}</span><span class="text-xs text-slate-600 ml-1">(${totalVideos} total · showing ${videos.length})</span></div><div class="text-xs text-slate-500 font-medium">Page <span class="text-white font-bold">${currentPage}</span> / ${totalPages}</div></div><!-- Video grid --><div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">${videos.map((video) => renderTemplate`${renderComponent($$result, "VideoCard", $$VideoCard, { "video": video })}`)}</div><!-- Pagination --><div class="flex items-center justify-center gap-3 mt-12 pt-8 border-t border-slate-900"><a${addAttribute(prevUrl, "href")} class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>Previous</a><div class="flex items-center gap-1">${pageRange.map((p, idx) => {
		const prev = pageRange[idx - 1];
		const showDots = prev && p - prev > 1;
		return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${showDots && renderTemplate`<span class="text-slate-600 px-1">…</span>`}<a${addAttribute(p === 1 ? `/category/${baseSlug}` : `/category/${baseSlug}/${p}`, "href")}${addAttribute(`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${p === currentPage ? "bg-rose-600 text-white border border-rose-500 shadow-lg shadow-rose-600/30" : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"}`, "class")}>${p}</a>` })}`;
	})}</div>${nextUrl ? renderTemplate`<a${addAttribute(nextUrl, "href")} class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 border border-rose-500 text-sm font-semibold text-white hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20">Next<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>` : renderTemplate`<span class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/40 border border-slate-900 text-sm font-semibold text-slate-700 cursor-not-allowed">Next<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></span>`}</div></section>
` })}`;
}, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/category/[slug]/[page].astro", void 0);
var $$file = "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/pages/category/[slug]/[page].astro";
var $$url = "/category/[slug]/[page]";
//#endregion
//#region \0virtual:astro:page:src/pages/category/[slug]/[page]@_@astro
var page = () => _page__exports;
//#endregion
export { page };
