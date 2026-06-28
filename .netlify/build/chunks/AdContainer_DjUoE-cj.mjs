import { c as createComponent } from './consts_CfqUMRV8.mjs';
import 'piccolore';
import { aO as maybeRenderHead, a6 as addAttribute, aZ as renderTemplate } from './params-and-props_NoTlu8e-.mjs';
import 'clsx';
import { r as renderScript } from './Layout_CFKtLFj5.mjs';

const $$AdContainer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AdContainer;
  const { slotType, className = "" } = Astro2.props;
  const slotConfigs = {
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
  };
  const config = slotConfigs[slotType];
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`flex flex-col items-center justify-center my-4 mx-auto ${className}`, "class")}> <!-- Label indicating sponsored content --> <span class="text-[9px] uppercase tracking-widest text-slate-700 mb-1">Sponsored</span> <!-- CLS-free Ad Container reserves exact dimensions before ad loads --> <div${addAttribute(`relative flex items-center justify-center bg-slate-950 rounded overflow-hidden ${config.dimensions}`, "class")}> <!-- Skeleton pulse while ad loads --> <div class="absolute inset-0 bg-slate-900/30 animate-pulse -z-10"></div> <!-- ExoClick Banner Zone --> <ins class="eas6a97888e2"${addAttribute(config.zoneId, "data-zoneid")}></ins> ${renderScript($$result, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/components/AdContainer.astro?astro&type=script&index=0&lang.ts")} </div> </div>`;
}, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/components/AdContainer.astro", void 0);

export { $$AdContainer as $ };
