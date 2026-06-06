import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');

try {
  if (!fs.existsSync(dbPath)) {
    console.error("❌ database.json does not exist!");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const initialCount = data.length;

  console.log(`📦 Initial database size: ${initialCount} videos`);

  // 1. Delete all videos belonging to the "Sri Lankan" category
  const filtered = data.filter(video => {
    const category = video.category || '';
    return category.toLowerCase() !== 'sri lankan';
  });

  const deletedCount = initialCount - filtered.length;
  console.log(`🗑️  Deleted ${deletedCount} videos belonging to the 'Sri Lankan' category.`);

  // 2. Clean tags, titles, and descriptions of the remaining videos
  let modifiedCount = 0;

  const preserveCasing = (match, replacement) => {
    if (match === match.toUpperCase()) return replacement.toUpperCase();
    if (match[0] === match[0].toUpperCase()) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase();
    }
    return replacement.toLowerCase();
  };

  const cleanText = (text) => {
    if (!text) return '';
    let result = text;
    
    // Replace Sri Lankan -> Desi
    result = result.replace(/sri\s+lankan/gi, (m) => preserveCasing(m, 'Desi'));
    result = result.replace(/srilankan/gi, (m) => preserveCasing(m, 'Desi'));
    result = result.replace(/sri\s+lanka/gi, (m) => preserveCasing(m, 'Desi'));
    result = result.replace(/sinhala/gi, (m) => preserveCasing(m, 'Desi'));

    return result;
  };

  const cleanTags = (tags) => {
    if (!tags || !Array.isArray(tags)) return [];
    // Filter out tags related to Sri Lankan content
    const badTags = new Set(['srilankan', 'sinhala', 'sri-lankan', 'sri lanka']);
    return tags.filter(tag => !badTags.has(tag.toLowerCase()));
  };

  const cleanedData = filtered.map(video => {
    const originalTitle = video.title || '';
    const originalDesc = video.description || '';
    const originalTags = video.tags || [];

    const newTitle = cleanText(originalTitle);
    const newDesc = cleanText(originalDesc);
    const newTags = cleanTags(originalTags);

    const isModified = 
      originalTitle !== newTitle || 
      originalDesc !== newDesc || 
      originalTags.length !== newTags.length;

    if (isModified) {
      modifiedCount++;
      return {
        ...video,
        title: newTitle,
        description: newDesc,
        tags: newTags
      };
    }

    return video;
  });

  fs.writeFileSync(dbPath, JSON.stringify(cleanedData, null, 2), 'utf-8');

  console.log(`✨ Successfully cleaned titles/descriptions/tags of ${modifiedCount} remaining videos.`);
  console.log(`📦 Database now contains ${cleanedData.length} videos.`);

  // Verification step
  console.log("\n🔍 Verification Check:");
  const finalCheck = cleanedData.filter(v => {
    const searchString = `
      ${v.title || ''} 
      ${v.category || ''} 
      ${(v.tags || []).join(' ')} 
      ${v.description || ''}
    `.toLowerCase();
    return v.category.toLowerCase() === 'sri lankan' || 
           (v.tags || []).some(t => ['srilankan', 'sinhala', 'sri-lankan', 'sri lanka'].includes(t.toLowerCase()));
  });

  if (finalCheck.length === 0) {
    console.log("✅ 100% Verified: No Sri Lankan categories or tags remain in the database!");
  } else {
    console.warn(`⚠️ Warning: Found ${finalCheck.length} items still matching Sri Lankan keywords.`);
  }

} catch (error) {
  console.error("❌ Error running cleanup script:", error.message);
}
