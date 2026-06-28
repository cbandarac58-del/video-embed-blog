import { n as getCollection, r as __exportAll } from "./_astro_content_CSD6qwR1.mjs";
//#region src/pages/videos.json.js
var videos_json_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
async function GET() {
	const searchIndex = (await getCollection("videos")).map((v) => ({
		title: v.data.title,
		slug: v.data.slug,
		rating: v.data.rating || 90,
		views: v.data.views || "100K",
		category: v.data.category || "Other",
		tags: v.data.tags || [],
		thumbnailUrl: v.data.thumbnailUrl || "",
		dateAdded: v.data.dateAdded
	}));
	searchIndex.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
	return new Response(JSON.stringify(searchIndex), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
//#endregion
//#region \0virtual:astro:page:src/pages/videos.json@_@js
var page = () => videos_json_exports;
//#endregion
export { page };
