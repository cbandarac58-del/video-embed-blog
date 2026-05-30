import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const XVIDEOS_URLS = [
  'https://www.xvideos.com/video.oifatli7fbb/48220975/0/me_masturbo_viendo_a_mi_hermanastra_chorrear_la_verga_de_mi_mejor_amigo',
  'https://www.xvideos.com/video.oodomtod637/48220975/0/hermanastra_me_ayuda_despues_de_mi_ruptura_amorosa',
  'https://www.xvideos.com/video.oukpmhu4d8c/48220975/0/fit_step_mom_accidentally_orgasms_while_helping_stepson_cum_in_her_panties',
  'https://www.xvideos.com/video.oobfupcd846/48220975/0/pervert_stranger_touch_her_ass_inside_bus_and_ejaculate_using_girl_s_hand',
  'https://www.xvideos.com/video.oocclmp2220/48220975/0/morena_tetona_le_toca_estar_mojada_porque_su_hijastro_le_gusta_hacer_bromas_-_termina_en_buen_sexo',
  'https://www.xvideos.com/video.kebeehfbca8/48220975/0/_',
  'https://www.xvideos.com/video.oocmkoka83a/48220975/0/desi_stepsister_convince_her_bhabhi_to_give_sexual_pleasure_to_her_partner',
  'https://www.xvideos.com/video.oodtdchb7b2/48220975/0/ele_nao_aguentou_e_gozou_dentro_de_mim_mesmo_sabendo_que_eu_era_casada',
  'https://www.xvideos.com/video.okdptpo92de/48220975/0/i_made_a_mess_so_my_big_booty_stepmom_lucky_kay_had_to_teach_me_a_lesson_intro',
  'https://www.xvideos.com/video.oodttpi7d6b/48220975/0/jiju_ne_raat_me_sali_ki_chudayi_kar_di_indian_hot_girl_sex_video',
  'https://www.xvideos.com/video.idlitcob151/48220975/0/sweetsinner_my_friend_gave_me_tips_to_seduce_her_hot_dad',
  'https://www.xvideos.com/video.oocpmuh7abc/48220975/0/xxx_indian_missis_malkin_fuck_with_servant_xxx_in_hindi_xxx',
  'https://www.xvideos.com/video.ubbmuhk4462/48220975/0/perv_pilot_alexis_wilson_ray_adler',
  'https://www.xvideos.com/video.ooblifce052/48220975/0/more_more_more_angel_youngs_brazzers_enter_xvpromo_on_official_site_for_discount',
  'https://www.xvideos.com/video.ookfivuf88b/48220975/0/mayor_s_daughter_fucks_security_guard_to_bury_scandal_-_lifterhub',
  'https://www.xvideos.com/video.ioceoeb71d8/48220975/0/anal_sex',
  'https://www.xvideos.com/video.oiltfadc01c/48220975/0/divorced_stepmoms_barbie_feels_and_alexis_abbey_seek_revenge_on_their_cheating_ex-husbands_-_momswitch',
  'https://www.xvideos.com/video.oocbmtc7415/48220975/0/a_peasant_woman_wanted_to_harvest_pineapple_and_instead_he_planted_cassava_in_her_pussy',
  'https://www.xvideos.com/video.oocotmceae3/48220975/0/step_mom_helping_her_injured_step_son_to_wash_and_seduced_him._finally_end_up_with_sucks_his_cock_before_getting_fucked_hard',
  'https://www.xvideos.com/video.oocdpco642e/48220975/0/my_girlfriend_couldn_t_stay_away_from_me_tonight',
  'https://www.xvideos.com/video.ufltmdocbf8/48220975/0/real_sex_-_romantic_sensual_missionary',
  'https://www.xvideos.com/video.oocetdv3493/48220975/0/cuando_desperte_mi_suegro_me_estaba_tocando_despues_me_follo_generada_por_ia_nuera_follada',
  'https://www.xvideos.com/video.halcdcb0686/48220975/0/squirting_milf_alexis_3some_fuck_with_student_quinn',
  'https://www.xvideos.com/video.okbpbcva11e/48220975/0/roblox_sex_22',
  'https://www.xvideos.com/video.oumakmc55c6/48220975/0/eternum_sex_novel_part_62_calypso_boobs',
  'https://www.xvideos.com/video.iuldebm1c9f/48220975/0/indian_mom_fuck_by_three_some_hardly',
  'https://www.xvideos.com/video.ueiapekb3ea/48220975/0/venezolana_entrega_el_culo_mi_novio_se_come_el_culo_de_mi_amiga_y_to_me_trago_la_leche_espanol',
  'https://www.xvideos.com/video.oodumct79a2/48220975/0/entregador_da_zl_fode_com_mae_solteira_no_horario_do_espediente',
  'https://www.xvideos.com/video.okvdomf982a/48220975/0/50_shades_of_namaste_freeuse_theignoring',
  'https://www.xvideos.com/video.oicmhpo4dce/48220975/0/too_busty_to_be_busted_-_sarah_arabic_little_puck',
  'https://www.xvideos.com/video.oovamch6fa4/48220975/0/jiju_came_to_home_offer_gift_for_fucked_hardcore_sex_big_ass_fuck_jija_saali_sexy_baatain_sex_video_first_time_moaning_desi_sex_hindi_dirty_talk',
  'https://www.xvideos.com/video.ohafbfh2712/48220975/0/sexo_duro_con_linda_flaca_que_chupa_mi_polla_y_juega_con_ella_me_corro_en_su_rico_culo',
  'https://www.xvideos.com/video.ucikmfb3306/48220975/0/fekpath_steps_sister',
  'https://www.xvideos.com/video.ooaovoh91f5/48220975/0/get_well-prepped_to_be_seduced_by_the_greatest_stepsister-in-law_around._with_her_long_silky_hair_and_massive_breasts_she_ll_drive_you_wild._she_s_here_to_warmth_up_the_kitchen_with_her_porn_starlet_moves_leaving_you_asking_for',
  'https://www.xvideos.com/video.ooadbok0201/48220975/0/three_guys_one_night_-_she_loves_to_submit',
  'https://www.xvideos.com/video.oudovmf030c/48220975/0/virgin_stepsister_sends_dirty_pics_and_gets_her_tight_pussy_pounded_doggystyle_by_her_stepbrother_-_orgyfamily',
  'https://www.xvideos.com/video.ohkiboh9eb0/48220975/0/big_ass_mature_woman_fucking_her_stepson',
  'https://www.xvideos.com/video.hbakvddc525/48220975/0/katsumi_gets_gangbanged_and_dp_d',
  'https://www.xvideos.com/video.okohhuvb52c/48220975/0/1_hour_of_hardcore_anal_w_alexis_crystal_richelle_ryan_clea_gaultier',
  'https://www.xvideos.com/video.oovaheb1691/48220975/0/close_up_-_fucking_delicious_pussy',
  'https://www.xvideos.com/video.ucfolbmde3a/48220975/0/deeper._baddie_kendra_fucks_enemy_s_bf_in_revenge_threesome',
  'https://www.xvideos.com/video.ucidtff8577/48220975/0/cumshot_on_my_hot_milf_neighbor_s_huge_ass',
  'https://www.xvideos.com/video.uhktdbv9c6f/48220975/0/hairy_mature_in_transparent_dress',
  'https://www.xvideos.com/video.ohhvddbb119/48220975/0/desi_malkin_got_hardcore_sex_offer_from_her_servant_in_the_night_time',
  'https://www.xvideos.com/video.oivkbeo22c5/48220975/0/stepsister_gets_massaged_into_orgasm_by_stepbrother_-_myhornysis',
  'https://www.xvideos.com/video.oibhvemf43c/48220975/0/the_rich_boss_seduces_me_while_i_m_working_as_a_pool_boy_and_i_end_up_fucking_her_hard_in_her_mansion_-_tommy_miller',
  'https://www.xvideos.com/video.upemlffce03/48220975/0/hot_black_threesome_xxx_porn_bikini_hot_two_girls_and_a_guy_fuck',
  'https://www.xvideos.com/video.oubdhbab736/48220975/0/stepmom_took_away_the_dishes_and_had_anal_sex_with_her_stepson',
];

// Generic xvideos site keywords to exclude from tags
const EXCLUDE_KEYWORDS = new Set([
  'xvideos','xvideos.com','x videos','x video','porn','video','videos','hd','free'
]);

// Map keywords → category
const CATEGORY_MAP = [
  { keys: ['indian','desi','hindi','jiju','saali','bhabhi','malkin','desi-sex'], cat: 'Indian' },
  { keys: ['stepsister','step-sister','stepsis','stepsiblings'], cat: 'stepsister' },
  { keys: ['stepmom','step-mom','stepmom','milf','mature','mom'], cat: 'MILF' },
  { keys: ['latina','colombia','venezolana','spanish','español'], cat: 'latina' },
  { keys: ['lesbian','girlsway'], cat: 'lesbian' },
  { keys: ['anal','anal-sex'], cat: 'anal' },
  { keys: ['asian','japanese','korean'], cat: 'asian' },
  { keys: ['amateur','homemade','real-sex'], cat: 'amateur' },
  { keys: ['threesome','3some','gangbang','dp'], cat: 'threesome' },
  { keys: ['hardcore','rough'], cat: 'hardcore' },
];

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function detectCategory(tags) {
  for (const { keys, cat } of CATEGORY_MAP) {
    if (tags.some(t => keys.some(k => t.toLowerCase().includes(k)))) return cat;
  }
  return 'amateur';
}

function extractVideoId(url) {
  const match = url.match(/\/video\.([a-z0-9]+)\//i);
  return match ? match[1] : null;
}

function generateSEOTitle(rawTitle, tags) {
  // Capitalize and clean up raw title from XVideos
  const clean = rawTitle
    .replace(/\s*-\s*(xvideos|xvideo|xvid|xv|hd).*$/i, '')
    .replace(/\b(xvideos|xvid|xv promo|brazzers|enter xvpromo)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  // Capitalize first letter of each word
  return clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getRandomViews() {
  const options = ['180K','250K','340K','420K','560K','710K','890K','1.1M','1.4M','1.8M','2.3M'];
  return options[Math.floor(Math.random() * options.length)];
}

function getRandomRating() {
  return Math.floor(Math.random() * 10) + 88; // 88-97%
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function fetchVideoMeta(url) {
  const videoId = extractVideoId(url);
  if (!videoId) {
    console.log(`  ⚠️  Could not extract video ID from: ${url}`);
    return null;
  }

  try {
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const $ = cheerio.load(data);
    const rawTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const thumbnail = $('meta[property="og:image"]').attr('content') || '';
    const rawKeywords = $('meta[name="keywords"]').attr('content') || '';

    // Clean keywords → usable tags
    const tags = rawKeywords
      .split(',')
      .map(k => k.trim().toLowerCase().replace(/\s+/g, '-'))
      .filter(k => k.length > 2 && !EXCLUDE_KEYWORDS.has(k))
      .slice(0, 6);

    const title = generateSEOTitle(rawTitle, tags);
    const slug = slugify(title).slice(0, 80);
    const category = detectCategory(tags);
    const embedUrl = `https://www.xvideos.com/embedframe/${videoId}`;

    return {
      title,
      slug,
      embedUrl,
      thumbnailUrl: thumbnail,
      tags,
      category,
      rating: getRandomRating(),
      views: getRandomViews(),
      dateAdded: '2026-05-29'
    };
  } catch (err) {
    console.log(`  ❌ Failed to fetch ${url}: ${err.message}`);
    return null;
  }
}

async function main() {
  const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');
  const existing = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const existingSlugs = new Set(existing.map(v => v.slug));
  const existingEmbeds = new Set(existing.map(v => v.embedUrl));

  console.log(`\n📦 Existing videos: ${existing.length}`);
  console.log(`🔗 Processing ${XVIDEOS_URLS.length} URLs...\n`);

  const newEntries = [];

  for (let i = 0; i < XVIDEOS_URLS.length; i++) {
    const url = XVIDEOS_URLS[i];
    const videoId = extractVideoId(url);
    const embedUrl = `https://www.xvideos.com/embedframe/${videoId}`;

    process.stdout.write(`[${i+1}/${XVIDEOS_URLS.length}] Fetching...`);

    // Skip duplicates
    if (existingEmbeds.has(embedUrl)) {
      console.log(` ⏭️  Duplicate, skipping.`);
      continue;
    }

    const meta = await fetchVideoMeta(url);
    
    if (!meta) {
      console.log(` ❌ Failed.`);
      continue;
    }

    // Ensure slug is unique
    let finalSlug = meta.slug;
    let attempt = 1;
    while (existingSlugs.has(finalSlug)) {
      finalSlug = `${meta.slug}-${attempt++}`;
    }
    meta.slug = finalSlug;
    existingSlugs.add(finalSlug);
    existingEmbeds.add(embedUrl);

    newEntries.push(meta);
    console.log(` ✅ "${meta.title.slice(0,55)}..." [${meta.category}]`);

    // Small delay to avoid rate limiting
    await sleep(600);
  }

  if (newEntries.length === 0) {
    console.log('\n⚠️  No new videos to add.');
    return;
  }

  // Prepend new entries (newest first)
  const updated = [...newEntries, ...existing];
  fs.writeFileSync(dbPath, JSON.stringify(updated, null, 2), 'utf-8');

  console.log(`\n✅ Done! Added ${newEntries.length} new videos.`);
  console.log(`📦 Total videos now: ${updated.length}`);
}

main();
