import { c as createComponent, V as VALID_INPUT_FORMATS } from './consts_mo-vM6Kk.mjs';
import 'piccolore';
import { ak as createRenderInstruction, ax as generateCspDigest, bl as unescapeHTML, bb as renderTemplate, b1 as removeBase, aP as isRemotePath, d as AstroError, a3 as UnknownContentCollectionError, aq as defineScriptVars, b8 as renderSlot, b7 as renderHead, aX as maybeRenderHead, a6 as addAttribute } from './params-and-props_DsYBBh82.mjs';
import { s as spreadAttributes, r as renderComponent } from './entrypoint_Bjf-1lA6.mjs';
import 'html-escaper';
import { Traverse } from 'neotraverse/modern';
import * as z from 'zod/v4';
import 'clsx';
import * as devalue from 'devalue';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

function createSvgComponent({ meta, attributes, children, styles }) {
  const hasStyles = styles.length > 0;
  const Component = createComponent({
    async factory(result, props) {
      const normalizedProps = normalizeProps(attributes, props);
      if (hasStyles && result.cspDestination) {
        for (const style of styles) {
          const hash = await generateCspDigest(style, result.cspAlgorithm);
          result._metadata.extraStyleHashes.push(hash);
        }
      }
      return renderTemplate`<svg${spreadAttributes(normalizedProps)}>${unescapeHTML(children)}</svg>`;
    },
    propagation: hasStyles ? "self" : "none"
  });
  Object.defineProperty(Component, "toJSON", {
    value: () => meta,
    enumerable: false
  });
  return Object.assign(Component, meta);
}
const ATTRS_TO_DROP = ["xmlns", "xmlns:xlink", "version"];
const DEFAULT_ATTRS = {};
function dropAttributes(attributes) {
  for (const attr of ATTRS_TO_DROP) {
    delete attributes[attr];
  }
  return attributes;
}
function normalizeProps(attributes, props) {
  return dropAttributes({ ...DEFAULT_ATTRS, ...attributes, ...props });
}

const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";

function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1)?.toLowerCase();
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}

class ImmutableDataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import('./_astro_data-layer-content_iLOLF9IE.mjs');
      if (data.default instanceof Map) {
        return ImmutableDataStore.fromMap(data.default);
      }
      const map = devalue.unflatten(data.default);
      return ImmutableDataStore.fromMap(map);
    } catch {
    }
    return new ImmutableDataStore();
  }
  static async fromMap(data) {
    const store = new ImmutableDataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = ImmutableDataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();

z.object({
  tags: z.array(z.string()).optional(),
  lastModified: z.date().optional()
});
function createGetCollection({
  liveCollections
}) {
  return async function getCollection(collection, filter) {
    if (collection in liveCollections) {
      throw new AstroError({
        ...UnknownContentCollectionError,
        message: `Collection "${collection}" is a live collection. Use getLiveCollection() instead of getCollection().`
      });
    }
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import('./content-assets_DloNRoa4.mjs');
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        let entry = {
          ...rawEntry,
          data,
          collection
        };
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Please check your content config file for errors.`
      );
      return [];
    }
  };
}
function createGetEntry({ liveCollections }) {
  return async function getEntry(collectionOrLookupObject, lookup) {
    let collection, lookupId;
    if (typeof collectionOrLookupObject === "string") {
      collection = collectionOrLookupObject;
      if (!lookup)
        throw new AstroError({
          ...UnknownContentCollectionError,
          message: "`getEntry()` requires an entry identifier as the second argument."
        });
      lookupId = lookup;
    } else {
      collection = collectionOrLookupObject.collection;
      lookupId = "id" in collectionOrLookupObject ? collectionOrLookupObject.id : collectionOrLookupObject.slug;
    }
    if (collection in liveCollections) {
      throw new AstroError({
        ...UnknownContentCollectionError,
        message: `Collection "${collection}" is a live collection. Use getLiveEntry() instead of getEntry().`
      });
    }
    if (typeof lookupId === "object") {
      throw new AstroError({
        ...UnknownContentCollectionError,
        message: `The entry identifier must be a string. Received object.`
      });
    }
    const store = await globalDataStore.get();
    if (store.hasCollection(collection)) {
      const entry = store.get(collection, lookupId);
      if (!entry) {
        console.warn(`Entry ${collection} → ${lookupId} was not found.`);
        return;
      }
      const { default: imageAssetMap } = await import('./content-assets_DloNRoa4.mjs');
      const data = updateImageReferencesInData(entry.data, entry.filePath, imageAssetMap);
      const result = {
        ...entry,
        data,
        collection
      };
      warnForPropertyAccess(
        result.data,
        "slug",
        `[content] Attempted to access deprecated property on "${collection}" entry.
The "slug" property is no longer automatically added to entries. Please use the "id" property instead.`
      );
      warnForPropertyAccess(
        result,
        "render",
        `[content] Invalid attempt to access "render()" method on "${collection}" entry.
To render an entry, use "render(entry)" from "astro:content".`
      );
      return result;
    }
    return void 0;
  };
}
function warnForPropertyAccess(entry, prop, message) {
  if (!(prop in entry)) {
    let _value = void 0;
    Object.defineProperty(entry, prop, {
      get() {
        if (_value === void 0) {
          console.error(message);
        }
        return _value;
      },
      set(v) {
        _value = v;
      },
      enumerable: false
    });
  }
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  const copy = structuredClone(data);
  new Traverse(copy).forEach(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        if (imported.__svgData) {
          const { __svgData: svgData, ...meta } = imported;
          ctx.update(createSvgComponent({ meta, ...svgData }));
        } else {
          ctx.update(imported);
        }
      } else {
        ctx.update(src);
      }
    }
  });
  return copy;
}

// astro-head-inject

const liveCollections = {};

const getCollection = createGetCollection({
	liveCollections,
});

const getEntry = createGetEntry({
	liveCollections,
});

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const propsStr = JSON.stringify(Astro2.props);
  const paramsStr = JSON.stringify(Astro2.params);
  return renderTemplate`${renderComponent($$result, "vercel-analytics", "vercel-analytics", { "data-props": propsStr, "data-params": paramsStr, "data-pathname": Astro2.url.pathname })} ${renderScript($$result, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/node_modules/@vercel/analytics/dist/astro/index.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description = "Watch top-trending free adult videos, hot amateur clips, and premium XXX streaming content. Fully optimized for all mobile devices.",
    keywords = "adult videos, free porn, xxx clips, hot amateur, desi bhabhi, stepsister sex, 18+ stream",
    isVideoPage = false
  } = Astro2.props;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site || "https://vixtube.net");
  let videos = [];
  try {
    videos = await getCollection("videos");
  } catch (e) {
    console.log("No videos found in content layer yet.", e);
  }
  const slugify = (text) => text.toString().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
  const categorySlugMap = {};
  const tagSlugMap = {};
  videos.forEach((v) => {
    if (v.data.category) {
      const clean = v.data.category.trim();
      categorySlugMap[clean.toLowerCase()] = slugify(clean);
    }
    (v.data.tags || []).forEach((tag) => {
      const clean = tag.trim();
      if (clean) {
        tagSlugMap[clean.toLowerCase()] = slugify(clean);
      }
    });
  });
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"', '><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png"><link rel="shortcut icon" type="image/x-icon" href="/favicon.ico"><!-- PWA Manifest & Mobile Web App settings --><link rel="manifest" href="/manifest.json"><meta name="theme-color" content="#e11d48"><link rel="apple-touch-icon" href="/pwa_icon_192.png"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><!-- SEO Meta Tags --><title>', ' | VixTube Premium</title><meta name="description"', '><meta name="keywords"', '><link rel="canonical"', `><!-- Google SafeSearch & Indexing Compliance (Adult Filters) --><meta name="rating" content="adult"><meta name="RATING" content="RTA-5042-1996-1104-1554-4306-EST"><meta name="google-site-verification" content="E-DT_XvMRPKJ7vYwBh-B4E92iWXB7TDDNXwZl1E01es"><meta name="naver-site-verification" content="d122dd0d8f372b3a5bafaef0c831b66a484d2127"><meta name="6a97888e-site-verification" content="a502c8dde2a7cf20862417e7d4a8d003"><!-- Prevent Google from indexing ad/third-party videos on listing pages.
         Only individual video watch pages (/videos/[slug]) should be indexed as video pages.
         This fixes the 'Video isn't on a watch page' GSC error caused by ExoClick ad video content. -->`, '<!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image" content="/og-image.jpg"><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', `><meta property="twitter:image" content="/og-image.jpg"><!-- Google Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet"><!-- ExoClick Push Notification Zone 5942298 --><script type="application/javascript">
      pn_idzone = 5942298;
      pn_sleep_seconds = 0;
      pn_is_self_hosted = 1;
      pn_soft_ask = 0;
      pn_filename = "/worker.js";
    <\/script><script type="application/javascript" src="https://js.wpnsrv.com/pn.php"><\/script><!-- Yandex.Metrika counter --><script type="text/javascript">
       (function(m,e,t,r,i,k,a){
           m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
           m[i].l=1*new Date();
           for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
           k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
       })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=109512457', 'ym');

       ym(109512457, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
    <\/script>`, `<noscript><div data-astro-cid-sckkx6r4><img src="https://mc.yandex.ru/watch/109512457" style="position:absolute; left:-9999px;" alt="" data-astro-cid-sckkx6r4></div></noscript><!-- /Yandex.Metrika counter --><!-- Register PWA Service Worker --><script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('PWA Service Worker registered successfully:', reg.scope))
            .catch(err => console.error('PWA Service Worker registration failed:', err));
        });
      }
    <\/script>`, "", '</head> <body class="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white pb-16 md:pb-0" data-astro-cid-sckkx6r4> <!-- AdBlock Popunder Recovery + ExoClick Ad Providers --> <script async type="application/javascript" src="https://a.magsrv.com/ad-provider.js"><\/script> <script async type="application/javascript" src="https://a.pemsrv.com/ad-provider.js"><\/script> <script src="/popunder-adblock.js"><\/script> <!-- ExoClick Zone 5938548 (magsrv) --> <ins class="eas6a97888e31" data-zoneid="5938548" data-astro-cid-sckkx6r4></ins> ', ' <!-- ExoClick Zone 5938540 (pemsrv) --> <ins class="eas6a97888e35" data-zoneid="5938540" data-astro-cid-sckkx6r4></ins> ', ' <!-- ExoClick Multi Format Zone 5942318 --> <ins class="eas6a97888e38" data-zoneid="5942318" data-astro-cid-sckkx6r4></ins> ', ' <!-- ExoClick Sticky Banner Zone 5942314 --> <ins class="eas6a97888e17" data-zoneid="5942314" data-astro-cid-sckkx6r4></ins> ', ' <!-- Header with Glassmorphic Navbar --> <header class="sticky top-0 z-40 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md" data-astro-cid-sckkx6r4> <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" data-astro-cid-sckkx6r4> <!-- Logo --> <a href="/" class="flex items-center space-x-2 group flex-shrink-0" data-astro-cid-sckkx6r4> <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 font-extrabold text-white text-xl shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform" data-astro-cid-sckkx6r4>\nV\n</div> <span class="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent" data-astro-cid-sckkx6r4>\nVix<span class="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent" data-astro-cid-sckkx6r4>Tube</span> </span> </a> <!-- Desktop Navigation --> <nav class="hidden md:flex items-center space-x-8" data-astro-cid-sckkx6r4> <a href="/" class="text-sm font-semibold text-slate-300 hover:text-rose-500 transition-colors" data-astro-cid-sckkx6r4>Home</a> <a href="/popular" class="text-sm font-semibold text-slate-300 hover:text-rose-500 transition-colors" data-astro-cid-sckkx6r4>Popular</a> <a href="/featured" class="text-sm font-semibold text-slate-300 hover:text-rose-500 transition-colors" data-astro-cid-sckkx6r4>Featured</a> <span class="flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-rose-400 border border-rose-950/50" data-astro-cid-sckkx6r4> <span class="mr-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" data-astro-cid-sckkx6r4></span>\n18+ Rated\n</span> </nav> <!-- Search Bar (Client Side Triggered & Responsive) --> <div class="flex items-center space-x-2 sm:space-x-4" data-astro-cid-sckkx6r4> <form action="/" method="GET" class="relative" data-astro-cid-sckkx6r4> <input type="text" name="search" placeholder="Search..." class="w-32 xs:w-44 sm:w-48 lg:w-64 rounded-full bg-slate-900 border border-slate-800 px-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all" data-astro-cid-sckkx6r4> <button type="submit" class="absolute right-3 top-2.5 text-slate-500 hover:text-rose-500" data-astro-cid-sckkx6r4> <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-sckkx6r4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-sckkx6r4></path> </svg> </button> </form> </div> </div> </header> <!-- Main Content Area --> <main class="flex-1" data-astro-cid-sckkx6r4> ', ' </main> <!-- ExoClick Recommendation Widget Zone 5938550 – between content and footer --> <div class="mx-auto max-w-7xl px-4 py-4" data-astro-cid-sckkx6r4> <ins class="eas6a97888e20" data-zoneid="5938550" data-astro-cid-sckkx6r4></ins> ', ' </div> <!-- Footer --> <footer class="border-t border-slate-900 bg-slate-950 py-10 mt-12 text-sm text-slate-500" data-astro-cid-sckkx6r4> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-astro-cid-sckkx6r4> <div class="grid grid-cols-1 md:grid-cols-3 gap-8" data-astro-cid-sckkx6r4> <div data-astro-cid-sckkx6r4> <div class="flex items-center space-x-2 mb-4" data-astro-cid-sckkx6r4> <span class="text-lg font-black text-white" data-astro-cid-sckkx6r4>Vix<span class="text-rose-500" data-astro-cid-sckkx6r4>Tube</span></span> </div> <p class="text-xs leading-relaxed max-w-xs" data-astro-cid-sckkx6r4>\nVixTube is a fully optimized, responsive video embedding platform. We comply with search indexing policies by implementing explicit meta tags.\n</p> </div> <div data-astro-cid-sckkx6r4> <h3 class="font-semibold text-slate-300 mb-3" data-astro-cid-sckkx6r4>Compliance & Certification</h3> <ul class="space-y-2 text-xs" data-astro-cid-sckkx6r4> <li class="flex items-center space-x-2" data-astro-cid-sckkx6r4> <span class="rounded bg-rose-950 text-rose-400 px-1.5 py-0.5 font-bold border border-rose-900" data-astro-cid-sckkx6r4>RTA</span> <span data-astro-cid-sckkx6r4>Restricted to Adults (RTA-5042)</span> </li> <li data-astro-cid-sckkx6r4>SafeSearch compliance verified</li> <li data-astro-cid-sckkx6r4>18+ Age Verification Required in applicable states</li> </ul> </div> <div data-astro-cid-sckkx6r4> <h3 class="font-semibold text-slate-300 mb-3" data-astro-cid-sckkx6r4>Legal Links</h3> <div class="grid grid-cols-2 gap-2 text-xs" data-astro-cid-sckkx6r4> <a href="/dmca" class="hover:text-slate-300 transition-colors" data-astro-cid-sckkx6r4>DMCA Notice</a> <a href="/terms" class="hover:text-slate-300 transition-colors" data-astro-cid-sckkx6r4>Terms of Service</a> <a href="/privacy" class="hover:text-slate-300 transition-colors" data-astro-cid-sckkx6r4>Privacy Policy</a> <a href="/contact" class="hover:text-slate-300 transition-colors" data-astro-cid-sckkx6r4>Contact Support</a> </div> </div> </div> <div class="mt-8 border-t border-slate-900 pt-6 text-center text-xs" data-astro-cid-sckkx6r4> <p data-astro-cid-sckkx6r4>© ', ' VixTube. All rights reserved. The video clips embedded are hosted on third-party servers.</p> <div class="mt-3 flex items-center justify-center" data-astro-cid-sckkx6r4> <a href="https://webmaster.yandex.ru/siteInfo/?site=https://vixtube.net" target="_blank" rel="noopener" title="Yandex Site Info" data-astro-cid-sckkx6r4> <img width="88" height="31" alt="Yandex" border="0" style="border-radius:8px;" src="https://yandex.ru/cycounter?https://vixtube.net&theme=dark&lang=en" data-astro-cid-sckkx6r4> </a> </div> </div> </div> </footer> <!-- Mobile Bottom Navigation Bar (Floating, premium glassmorphism) --> <nav class="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/80 backdrop-blur-lg border-t border-slate-900 px-6 py-2 flex justify-around items-center text-xs font-semibold shadow-lg shadow-black/50" data-astro-cid-sckkx6r4> <a href="/" class="flex flex-col items-center space-y-1 text-slate-400 hover:text-rose-500 transition-colors" data-astro-cid-sckkx6r4> <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-sckkx6r4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" data-astro-cid-sckkx6r4></path> </svg> <span class="text-[10px]" data-astro-cid-sckkx6r4>Home</span> </a> <a href="/popular" class="flex flex-col items-center space-y-1 text-slate-400 hover:text-rose-500 transition-colors" data-astro-cid-sckkx6r4> <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-sckkx6r4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" data-astro-cid-sckkx6r4></path> </svg> <span class="text-[10px]" data-astro-cid-sckkx6r4>Popular</span> </a> <a href="/featured" class="flex flex-col items-center space-y-1 text-slate-400 hover:text-rose-500 transition-colors" data-astro-cid-sckkx6r4> <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-sckkx6r4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.248.588 1.81l-3.97 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.888a1 1 0 00-1.176 0l-3.97 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.97-2.888c-.777-.562-.379-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" data-astro-cid-sckkx6r4></path> </svg> <span class="text-[10px]" data-astro-cid-sckkx6r4>Featured</span> </a> </nav> <!-- Global SEO Search Router Script --> <script>(function(){', "\n      window.CATEGORY_SLUG_MAP = categorySlugMap;\n      window.TAG_SLUG_MAP = tagSlugMap;\n\n      document.addEventListener('DOMContentLoaded', () => {\n        const searchForms = document.querySelectorAll('form[action=\"/\"]');\n        \n        searchForms.forEach(form => {\n          form.addEventListener('submit', (e) => {\n            const input = form.querySelector('input[name=\"search\"]');\n            if (!input) return;\n            \n            const rawQuery = input.value || '';\n            const query = rawQuery.trim().toLowerCase();\n            if (!query) {\n              e.preventDefault();\n              window.location.href = '/';\n              return;\n            }\n\n            // Check for exact category match\n            if (window.CATEGORY_SLUG_MAP && window.CATEGORY_SLUG_MAP[query]) {\n              e.preventDefault();\n              window.location.href = `/category/${window.CATEGORY_SLUG_MAP[query]}`;\n              return;\n            }\n\n            // Check for exact tag match\n            if (window.TAG_SLUG_MAP && window.TAG_SLUG_MAP[query]) {\n              e.preventDefault();\n              window.location.href = `/tag/${window.TAG_SLUG_MAP[query]}`;\n              return;\n            }\n\n            // Otherwise, let standard form submission take place (goes to /?search=query)\n            // But if we are already on the home page (/), let the local page script handle it instantly\n            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {\n              // The home page's own submit handler intercepts and does preventDefault.\n              // So we don't need to do anything here for the home page.\n            }\n          });\n        });\n        \n        // Highlight active link in mobile bottom nav bar\n        const path = window.location.pathname;\n        const bottomLinks = document.querySelectorAll('nav.fixed a');\n        bottomLinks.forEach(link => {\n          const href = link.getAttribute('href');\n          if (href === path || (href === '/' && path === '/index.html')) {\n            link.classList.remove('text-slate-400');\n            link.classList.add('text-rose-500');\n          }\n        });\n      });\n    })();<\/script> </body> </html>"], ['<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"', '><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png"><link rel="shortcut icon" type="image/x-icon" href="/favicon.ico"><!-- PWA Manifest & Mobile Web App settings --><link rel="manifest" href="/manifest.json"><meta name="theme-color" content="#e11d48"><link rel="apple-touch-icon" href="/pwa_icon_192.png"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><!-- SEO Meta Tags --><title>', ' | VixTube Premium</title><meta name="description"', '><meta name="keywords"', '><link rel="canonical"', `><!-- Google SafeSearch & Indexing Compliance (Adult Filters) --><meta name="rating" content="adult"><meta name="RATING" content="RTA-5042-1996-1104-1554-4306-EST"><meta name="google-site-verification" content="E-DT_XvMRPKJ7vYwBh-B4E92iWXB7TDDNXwZl1E01es"><meta name="naver-site-verification" content="d122dd0d8f372b3a5bafaef0c831b66a484d2127"><meta name="6a97888e-site-verification" content="a502c8dde2a7cf20862417e7d4a8d003"><!-- Prevent Google from indexing ad/third-party videos on listing pages.
         Only individual video watch pages (/videos/[slug]) should be indexed as video pages.
         This fixes the 'Video isn't on a watch page' GSC error caused by ExoClick ad video content. -->`, '<!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image" content="/og-image.jpg"><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', `><meta property="twitter:image" content="/og-image.jpg"><!-- Google Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet"><!-- ExoClick Push Notification Zone 5942298 --><script type="application/javascript">
      pn_idzone = 5942298;
      pn_sleep_seconds = 0;
      pn_is_self_hosted = 1;
      pn_soft_ask = 0;
      pn_filename = "/worker.js";
    <\/script><script type="application/javascript" src="https://js.wpnsrv.com/pn.php"><\/script><!-- Yandex.Metrika counter --><script type="text/javascript">
       (function(m,e,t,r,i,k,a){
           m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
           m[i].l=1*new Date();
           for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
           k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
       })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=109512457', 'ym');

       ym(109512457, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
    <\/script>`, `<noscript><div data-astro-cid-sckkx6r4><img src="https://mc.yandex.ru/watch/109512457" style="position:absolute; left:-9999px;" alt="" data-astro-cid-sckkx6r4></div></noscript><!-- /Yandex.Metrika counter --><!-- Register PWA Service Worker --><script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('PWA Service Worker registered successfully:', reg.scope))
            .catch(err => console.error('PWA Service Worker registration failed:', err));
        });
      }
    <\/script>`, "", '</head> <body class="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white pb-16 md:pb-0" data-astro-cid-sckkx6r4> <!-- AdBlock Popunder Recovery + ExoClick Ad Providers --> <script async type="application/javascript" src="https://a.magsrv.com/ad-provider.js"><\/script> <script async type="application/javascript" src="https://a.pemsrv.com/ad-provider.js"><\/script> <script src="/popunder-adblock.js"><\/script> <!-- ExoClick Zone 5938548 (magsrv) --> <ins class="eas6a97888e31" data-zoneid="5938548" data-astro-cid-sckkx6r4></ins> ', ' <!-- ExoClick Zone 5938540 (pemsrv) --> <ins class="eas6a97888e35" data-zoneid="5938540" data-astro-cid-sckkx6r4></ins> ', ' <!-- ExoClick Multi Format Zone 5942318 --> <ins class="eas6a97888e38" data-zoneid="5942318" data-astro-cid-sckkx6r4></ins> ', ' <!-- ExoClick Sticky Banner Zone 5942314 --> <ins class="eas6a97888e17" data-zoneid="5942314" data-astro-cid-sckkx6r4></ins> ', ' <!-- Header with Glassmorphic Navbar --> <header class="sticky top-0 z-40 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md" data-astro-cid-sckkx6r4> <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" data-astro-cid-sckkx6r4> <!-- Logo --> <a href="/" class="flex items-center space-x-2 group flex-shrink-0" data-astro-cid-sckkx6r4> <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 font-extrabold text-white text-xl shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform" data-astro-cid-sckkx6r4>\nV\n</div> <span class="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent" data-astro-cid-sckkx6r4>\nVix<span class="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent" data-astro-cid-sckkx6r4>Tube</span> </span> </a> <!-- Desktop Navigation --> <nav class="hidden md:flex items-center space-x-8" data-astro-cid-sckkx6r4> <a href="/" class="text-sm font-semibold text-slate-300 hover:text-rose-500 transition-colors" data-astro-cid-sckkx6r4>Home</a> <a href="/popular" class="text-sm font-semibold text-slate-300 hover:text-rose-500 transition-colors" data-astro-cid-sckkx6r4>Popular</a> <a href="/featured" class="text-sm font-semibold text-slate-300 hover:text-rose-500 transition-colors" data-astro-cid-sckkx6r4>Featured</a> <span class="flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-rose-400 border border-rose-950/50" data-astro-cid-sckkx6r4> <span class="mr-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" data-astro-cid-sckkx6r4></span>\n18+ Rated\n</span> </nav> <!-- Search Bar (Client Side Triggered & Responsive) --> <div class="flex items-center space-x-2 sm:space-x-4" data-astro-cid-sckkx6r4> <form action="/" method="GET" class="relative" data-astro-cid-sckkx6r4> <input type="text" name="search" placeholder="Search..." class="w-32 xs:w-44 sm:w-48 lg:w-64 rounded-full bg-slate-900 border border-slate-800 px-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all" data-astro-cid-sckkx6r4> <button type="submit" class="absolute right-3 top-2.5 text-slate-500 hover:text-rose-500" data-astro-cid-sckkx6r4> <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-sckkx6r4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-sckkx6r4></path> </svg> </button> </form> </div> </div> </header> <!-- Main Content Area --> <main class="flex-1" data-astro-cid-sckkx6r4> ', ' </main> <!-- ExoClick Recommendation Widget Zone 5938550 – between content and footer --> <div class="mx-auto max-w-7xl px-4 py-4" data-astro-cid-sckkx6r4> <ins class="eas6a97888e20" data-zoneid="5938550" data-astro-cid-sckkx6r4></ins> ', ' </div> <!-- Footer --> <footer class="border-t border-slate-900 bg-slate-950 py-10 mt-12 text-sm text-slate-500" data-astro-cid-sckkx6r4> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-astro-cid-sckkx6r4> <div class="grid grid-cols-1 md:grid-cols-3 gap-8" data-astro-cid-sckkx6r4> <div data-astro-cid-sckkx6r4> <div class="flex items-center space-x-2 mb-4" data-astro-cid-sckkx6r4> <span class="text-lg font-black text-white" data-astro-cid-sckkx6r4>Vix<span class="text-rose-500" data-astro-cid-sckkx6r4>Tube</span></span> </div> <p class="text-xs leading-relaxed max-w-xs" data-astro-cid-sckkx6r4>\nVixTube is a fully optimized, responsive video embedding platform. We comply with search indexing policies by implementing explicit meta tags.\n</p> </div> <div data-astro-cid-sckkx6r4> <h3 class="font-semibold text-slate-300 mb-3" data-astro-cid-sckkx6r4>Compliance & Certification</h3> <ul class="space-y-2 text-xs" data-astro-cid-sckkx6r4> <li class="flex items-center space-x-2" data-astro-cid-sckkx6r4> <span class="rounded bg-rose-950 text-rose-400 px-1.5 py-0.5 font-bold border border-rose-900" data-astro-cid-sckkx6r4>RTA</span> <span data-astro-cid-sckkx6r4>Restricted to Adults (RTA-5042)</span> </li> <li data-astro-cid-sckkx6r4>SafeSearch compliance verified</li> <li data-astro-cid-sckkx6r4>18+ Age Verification Required in applicable states</li> </ul> </div> <div data-astro-cid-sckkx6r4> <h3 class="font-semibold text-slate-300 mb-3" data-astro-cid-sckkx6r4>Legal Links</h3> <div class="grid grid-cols-2 gap-2 text-xs" data-astro-cid-sckkx6r4> <a href="/dmca" class="hover:text-slate-300 transition-colors" data-astro-cid-sckkx6r4>DMCA Notice</a> <a href="/terms" class="hover:text-slate-300 transition-colors" data-astro-cid-sckkx6r4>Terms of Service</a> <a href="/privacy" class="hover:text-slate-300 transition-colors" data-astro-cid-sckkx6r4>Privacy Policy</a> <a href="/contact" class="hover:text-slate-300 transition-colors" data-astro-cid-sckkx6r4>Contact Support</a> </div> </div> </div> <div class="mt-8 border-t border-slate-900 pt-6 text-center text-xs" data-astro-cid-sckkx6r4> <p data-astro-cid-sckkx6r4>© ', ' VixTube. All rights reserved. The video clips embedded are hosted on third-party servers.</p> <div class="mt-3 flex items-center justify-center" data-astro-cid-sckkx6r4> <a href="https://webmaster.yandex.ru/siteInfo/?site=https://vixtube.net" target="_blank" rel="noopener" title="Yandex Site Info" data-astro-cid-sckkx6r4> <img width="88" height="31" alt="Yandex" border="0" style="border-radius:8px;" src="https://yandex.ru/cycounter?https://vixtube.net&theme=dark&lang=en" data-astro-cid-sckkx6r4> </a> </div> </div> </div> </footer> <!-- Mobile Bottom Navigation Bar (Floating, premium glassmorphism) --> <nav class="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/80 backdrop-blur-lg border-t border-slate-900 px-6 py-2 flex justify-around items-center text-xs font-semibold shadow-lg shadow-black/50" data-astro-cid-sckkx6r4> <a href="/" class="flex flex-col items-center space-y-1 text-slate-400 hover:text-rose-500 transition-colors" data-astro-cid-sckkx6r4> <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-sckkx6r4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" data-astro-cid-sckkx6r4></path> </svg> <span class="text-[10px]" data-astro-cid-sckkx6r4>Home</span> </a> <a href="/popular" class="flex flex-col items-center space-y-1 text-slate-400 hover:text-rose-500 transition-colors" data-astro-cid-sckkx6r4> <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-sckkx6r4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" data-astro-cid-sckkx6r4></path> </svg> <span class="text-[10px]" data-astro-cid-sckkx6r4>Popular</span> </a> <a href="/featured" class="flex flex-col items-center space-y-1 text-slate-400 hover:text-rose-500 transition-colors" data-astro-cid-sckkx6r4> <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-sckkx6r4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.248.588 1.81l-3.97 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.888a1 1 0 00-1.176 0l-3.97 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.97-2.888c-.777-.562-.379-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" data-astro-cid-sckkx6r4></path> </svg> <span class="text-[10px]" data-astro-cid-sckkx6r4>Featured</span> </a> </nav> <!-- Global SEO Search Router Script --> <script>(function(){', "\n      window.CATEGORY_SLUG_MAP = categorySlugMap;\n      window.TAG_SLUG_MAP = tagSlugMap;\n\n      document.addEventListener('DOMContentLoaded', () => {\n        const searchForms = document.querySelectorAll('form[action=\"/\"]');\n        \n        searchForms.forEach(form => {\n          form.addEventListener('submit', (e) => {\n            const input = form.querySelector('input[name=\"search\"]');\n            if (!input) return;\n            \n            const rawQuery = input.value || '';\n            const query = rawQuery.trim().toLowerCase();\n            if (!query) {\n              e.preventDefault();\n              window.location.href = '/';\n              return;\n            }\n\n            // Check for exact category match\n            if (window.CATEGORY_SLUG_MAP && window.CATEGORY_SLUG_MAP[query]) {\n              e.preventDefault();\n              window.location.href = \\`/category/\\${window.CATEGORY_SLUG_MAP[query]}\\`;\n              return;\n            }\n\n            // Check for exact tag match\n            if (window.TAG_SLUG_MAP && window.TAG_SLUG_MAP[query]) {\n              e.preventDefault();\n              window.location.href = \\`/tag/\\${window.TAG_SLUG_MAP[query]}\\`;\n              return;\n            }\n\n            // Otherwise, let standard form submission take place (goes to /?search=query)\n            // But if we are already on the home page (/), let the local page script handle it instantly\n            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {\n              // The home page's own submit handler intercepts and does preventDefault.\n              // So we don't need to do anything here for the home page.\n            }\n          });\n        });\n        \n        // Highlight active link in mobile bottom nav bar\n        const path = window.location.pathname;\n        const bottomLinks = document.querySelectorAll('nav.fixed a');\n        bottomLinks.forEach(link => {\n          const href = link.getAttribute('href');\n          if (href === path || (href === '/' && path === '/index.html')) {\n            link.classList.remove('text-slate-400');\n            link.classList.add('text-rose-500');\n          }\n        });\n      });\n    })();<\/script> </body> </html>"])), addAttribute(Astro2.generator, "content"), title, addAttribute(description, "content"), addAttribute(keywords, "content"), addAttribute(canonicalURL, "href"), !isVideoPage && renderTemplate`<meta name="robots" content="max-video-preview:0">`, addAttribute(canonicalURL, "content"), addAttribute(`${title} | VixTube`, "content"), addAttribute(description, "content"), addAttribute(canonicalURL, "content"), addAttribute(`${title} | VixTube`, "content"), addAttribute(description, "content"), maybeRenderHead(), renderComponent($$result, "Analytics", $$Index, { "data-astro-cid-sckkx6r4": true }), renderHead(), renderScript($$result, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts"), renderScript($$result, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=1&lang.ts"), renderScript($$result, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=2&lang.ts"), renderScript($$result, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=3&lang.ts"), renderSlot($$result, $$slots["default"]), renderScript($$result, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro?astro&type=script&index=4&lang.ts"), (/* @__PURE__ */ new Date()).getFullYear(), defineScriptVars({ categorySlugMap, tagSlugMap }));
}, "C:/Users/Pubudu Nuwan/.gemini/antigravity/scratch/video-embed-blog/src/layouts/Layout.astro", void 0);

export { $$Layout as $, getEntry as a, getCollection as g, renderScript as r };
