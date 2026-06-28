import { T as createComponent, f as renderTemplate, g as maybeRenderHead, n as renderScript, v as addAttribute, w as createAstro } from "./server_DdnRNRi_.mjs";
import "./Layout_CqI_4LJ3.mjs";
//#region src/components/AdContainer.astro
createAstro("https://vixtube.net");
var $$AdContainer = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AdContainer;
	const { slotType, className = "" } = Astro.props;
	const config = {
		banner_728x90: {
			dimensions: "w-full max-w-[728px] h-[90px]",
			zoneId: "5938492"
		},
		banner_300x250: {
			dimensions: "w-[300px] h-[250px]",
			zoneId: "5938492"
		},
		banner_468x60: {
			dimensions: "w-full max-w-[468px] h-[60px]",
			zoneId: "5938504"
		}
	}[slotType];
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(`flex flex-col items-center justify-center my-4 mx-auto ${className}`, "class")}><!-- Label indicating sponsored content --><span class="text-[9px] uppercase tracking-widest text-slate-700 mb-1">Sponsored</span><!-- CLS-free Ad Container reserves exact dimensions before ad loads --><div${addAttribute(`relative flex items-center justify-center bg-slate-950 rounded overflow-hidden ${config.dimensions}`, "class")}><!-- Skeleton pulse while ad loads --><div class="absolute inset-0 bg-slate-900/30 animate-pulse -z-10"></div><!-- ExoClick Banner Zone --><ins class="eas6a97888e2"${addAttribute(config.zoneId, "data-zoneid")}></ins>${renderScript($$result, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/components/AdContainer.astro?astro&type=script&index=0&lang.ts")}</div></div>`;
}, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/components/AdContainer.astro", void 0);
//#endregion
export { $$AdContainer as t };
