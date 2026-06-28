import { T as createComponent, f as renderTemplate, g as maybeRenderHead, v as addAttribute, w as createAstro } from "./server_DdnRNRi_.mjs";
import "./Layout_CqI_4LJ3.mjs";
//#region src/components/VideoCard.astro
createAstro("https://vixtube.net");
var $$VideoCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$VideoCard;
	const { video } = Astro.props;
	const { title, slug, rating = 90, views, category, tags = [], thumbnailUrl, dateAdded } = video.data || video;
	function formatViews(val) {
		if (typeof val === "string") return val;
		if (val >= 1e6) return (val / 1e6).toFixed(1) + "M";
		if (val >= 1e3) return (val / 1e3).toFixed(0) + "K";
		return val.toString();
	}
	function getCardGradient(slug) {
		const hash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
		const gradients = [
			"from-rose-600/20 to-purple-600/10 hover:from-rose-500/30 hover:to-purple-500/20",
			"from-purple-600/20 to-indigo-600/10 hover:from-purple-500/30 hover:to-indigo-500/20",
			"from-pink-600/20 to-rose-600/10 hover:from-pink-500/30 hover:to-rose-500/20",
			"from-indigo-600/20 to-violet-600/10 hover:from-indigo-500/30 hover:to-violet-500/20",
			"from-amber-600/20 to-rose-600/10 hover:from-amber-500/30 hover:to-rose-500/20"
		];
		return gradients[hash % gradients.length];
	}
	return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(`/videos/${slug}`, "href")} class="group relative flex flex-col rounded-2xl overflow-hidden border border-slate-900 bg-slate-950/40 backdrop-blur-sm transition-all duration-300 hover:border-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/5 hover:-translate-y-1"><div${addAttribute(`relative aspect-video w-full overflow-hidden flex items-center justify-center bg-slate-950 ${!thumbnailUrl ? `bg-gradient-to-br ${getCardGradient(slug)}` : ""}`, "class")}>${thumbnailUrl && renderTemplate`<img${addAttribute(thumbnailUrl, "src")} referrerpolicy="no-referrer"${addAttribute(title, "alt")} loading="lazy" class="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500">`}<div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30"></div><div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-slate-950/80 border border-slate-800 text-white group-hover:scale-110 group-hover:bg-rose-600 group-hover:border-rose-500 group-hover:shadow-lg group-hover:shadow-rose-600/40 transition-all duration-300"><svg class="h-5 w-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg></div><span class="absolute top-3 left-3 z-10 flex items-center space-x-1 rounded-md bg-slate-950/85 border border-slate-800/80 px-2 py-0.5 text-[10px] font-bold text-amber-400 backdrop-blur-sm"><span>★</span><span>${rating}%</span></span><span class="absolute bottom-3 right-3 z-10 rounded-md bg-gradient-to-r from-rose-600 to-pink-600 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-md shadow-rose-950/30">${category}</span></div><div class="flex flex-col flex-1 p-4 bg-slate-950/20"><h3 class="text-sm font-bold text-slate-200 line-clamp-2 group-hover:text-rose-400 group-hover:underline transition-colors min-h-[40px] leading-snug">${title}</h3><div class="border-t border-slate-900/60 my-3"></div><div class="flex items-center justify-between text-[11px] text-slate-500"><span class="flex items-center font-medium"><svg class="h-3.5 w-3.5 mr-1 text-slate-600 group-hover:text-amber-500 transition-colors" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.655-.353-1.086-.353-1.086a1 1 0 00-1.343-.807c-.36.126-.632.418-.737.788-.13.457-.318 1.487.213 2.923.326.883.844 1.776 1.488 2.55 1.285 1.542 3.037 2.705 5.279 2.593 2.24-.112 4.106-2.127 4.106-4.527 0-1.127-.318-2.195-.87-3.08a6.388 6.388 0 01-.29-.44c-.382-.647-.796-1.157-1.164-1.555a11.66 11.66 0 00-1.62-1.428 1 1 0 00-.39-.148zM12 14a3 3 0 01-3-3c0-.188.017-.37.05-.547a4.01 4.01 0 001.39.753c.319.108.64.195.962.24a4.004 4.004 0 004.254-2.82c.11.396.183.82.183 1.26a3 3 0 01-3 3z" clip-rule="evenodd"></path></svg>${formatViews(views)} views</span><span>${dateAdded}</span></div><div class="flex flex-wrap gap-1 mt-3">${tags.slice(0, 2).map((tag) => renderTemplate`<span class="text-[9px] bg-slate-900 text-slate-400 border border-slate-800/80 rounded px-1.5 py-0.5">#${tag}</span>`)}</div></div></a>`;
}, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/components/VideoCard.astro", void 0);
//#endregion
export { $$VideoCard as t };
