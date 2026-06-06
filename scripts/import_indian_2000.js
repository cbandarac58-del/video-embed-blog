import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Config ───────────────────────────────────────────────────────────────────
const TARGET_COUNT = 2000;    // How many new videos to add
const DELAY_MS     = 700;     // Polite delay between requests (ms)
const CATEGORY     = 'Indian';
const START_PAGE   = 0;       // XVideos pagination starts at 0

// XVideos search URL for "indian"
// Page 0 = /?k=indian
// Page 1 = /?k=indian&p=1
// Page 2 = /?k=indian&p=2
const XV_BASE_URL  = 'https://www.xvideos.com/?k=indian';

// ─── Noise tags to exclude ─────────────────────────────────────────────────────
const EXCLUDE_TAGS = new Set([
  'xvideos','xvideos.com','x-videos','x-video','porn','video','videos',
  'hd','free','raw','leak','leaked','xvid','xv','adult','xxx','sex','tube',
  'watch','full','scene','movie','clip','download','online','streaming',
  'brazzers','bangbros','pervcity','houseofyre','naughtyamerica','reality-kings',
]);

// ─── 100 SEO Long-Tail Title Templates (Indian / Desi) ────────────────────────
const INDIAN_TITLE_TEMPLATES = [
  (k) => `${k} – Steamy Desi Bhabhi Caught Cheating On Camera`,
  (k) => `${k} – Hot Indian Devar Having Wild Fun With Bhabhi`,
  (k) => `${k} – Leaked Homemade Desi MMS In Hotel Room`,
  (k) => `${k} – Steamy Hindi Audio Sex Clip You Can't Miss`,
  (k) => `${k} – Naughty Indian Aunty Seduces Young Neighborhood Guy`,
  (k) => `${k} – Real Desi Couple Steamy Bedroom Fucking Session`,
  (k) => `Hindi Audio ${k} – Steamy Chudai Story Leaked Online`,
  (k) => `Devar Bhabhi ${k} – Forbidden Romance Behind Closed Doors`,
  (k) => `Indian MMS ${k} – College GF Leaked Video On WhatsApp`,
  (k) => `${k} – Sexy Desi Aunty Invites Devar For Late Night Fun`,
  (k) => `Real Homemade ${k} – Passionate Indian Couple Sex Tape`,
  (k) => `${k} – Village Girl First Time Steamy Experience Caught`,
  (k) => `${k} – Beautiful Indian Bride Seduces Husband On Wedding Night`,
  (k) => `Steamy Bhabhi ${k} – Naughty Sister-In-Law Begs For More`,
  (k) => `${k} – Hindi Speaking Couple Having Hardcore Fun in Bed`,
  (k) => `MMS Scandal ${k} – Leaked College Girl Bathroom Video`,
  (k) => `${k} – Hot Desi Bhabhi Chudai Video With Hindi Audio`,
  (k) => `Desi Aunty ${k} – Voluptuous Indian Housewife Secret Affair`,
  (k) => `${k} – Young Indian Girlfriend Pleases Boy Friend In Park`,
  (k) => `${k} – Desi Couple Having Steamy Night In Room`,
  (k) => `Desi Romance ${k} – Passionate Indian Lovers Secret Session`,
  (k) => `Hindi Speaking ${k} – Hardcore Desi Fucking With Real Sound`,
  (k) => `${k} – Leaked Sri Lankan Bhabhi Steamy Bathroom Clip`,
  (k) => `Devar Ki Mastani Bhabhi ${k} – Steamy Indian Home Sex`,
  (k) => `Indian Call Girl ${k} – Hotel Room Hookup Captured On Cam`,
  (k) => `${k} – Naughty College Girl Trades Favor For Grades`,
  (k) => `Steamy Chudai ${k} – Indian Bhabhi Fucked Hard By Lover`,
  (k) => `${k} – Beautiful Bengali Bhabhi Caught With Devar`,
  (k) => `${k} – Hot Punjabi Bhabhi Dancing And Fucking Outdoor`,
  (k) => `Tamil Speaking ${k} – Steamy Southern Indian Romance Leaked`,
  (k) => `${k} – Telugu Bhabhi Romantic Hookup With Young Stud`,
  (k) => `${k} – Mallu Aunty Seduces Teenager Neighbor In Kitchen`,
  (k) => `Scandalous MMS ${k} – Leaked WhatsApp Viral Video clip`,
  (k) => `${k} – Real Indian Husband Shares Wife With Best Friend`,
  (k) => `Office Romance ${k} – Indian Boss Fucks Secretary After Work`,
  (k) => `${k} – Indian Bhabhi Catches Devar Masturbating – Then Joins`,
  (k) => `First Time ${k} – Innocent Desi Girl Goes Wild On Cam`,
  (k) => `${k} – Desi Aunty Chudai In Saree Caught By Husband`,
  (k) => `${k} – Beautiful Pakistani Bhabhi Secret Bedroom Video`,
  (k) => `Leaked MMS ${k} – Viral Desi Romance In Hotel Bedroom`,
  (k) => `${k} – Hindi Audio Chudai Session With Real Moans`,
  (k) => `Steamy Bhabhi ${k} – Naughty Devar Fucks Sister In Law`,
  (k) => `${k} – Indian Roommates Sharing Girlfriend In Hostel Room`,
  (k) => `Homemade MMS ${k} – Viral Indian Couple Having Fun`,
  (k) => `${k} – Beautiful Nepali Girl Having Secret Hookup`,
  (k) => `${k} – Hot Desi Aunty Pleases Young Gym Trainer`,
  (k) => `Saree Seduction ${k} – Steamy Indian Bhabhi Sells Saree`,
  (k) => `${k} – Indian Wife Invites Neighbor For Steamy Session`,
  (k) => `College GF ${k} – Leaked MMS Video From Hostel Bathroom`,
  (k) => `${k} – Hindi Speaking Bhabhi Begs Devar To Fuck Harder`,
  (k) => `${k} – Leaked South Indian Actor Real MMS Scandals`,
  (k) => `Desi Chudai ${k} – Bhabhi Ki Sil Tod Di Devar Ne`,
  (k) => `${k} – Hot Indian Couple Sex Tape Leaked On Telegram`,
  (k) => `Aunty Ki Chudai ${k} – Steamy Neighborhood Romance Videos`,
  (k) => `${k} – Leaked Sri Lankan Couple Bedroom Romance Tape`,
  (k) => `${k} – Naughty Hindi Speaking Couple Steamy Outdoor Sex`,
  (k) => `Viral WhatsApp ${k} – Leaked Indian Bhabhi Home Video`,
  (k) => `${k} – Voluptuous Desi Aunty Getting Fucked In Kitchen`,
  (k) => `Bhabhi Ki Chudai ${k} – Steamy Hindi Audio Sex Video`,
  (k) => `${k} – Hot Indian College Student Leaked MMS Scandal`,
  (k) => `${k} – Beautiful Pakistani Girl Seduces Her Cousin`,
  (k) => `Secret Affair ${k} – Indian Housewife Fucks Neighborhood Stud`,
  (k) => `${k} – Real Desi Couple Having Hardcore Outdoor Fucking`,
  (k) => `${k} – Hindi Speaking Bhabhi Chudai Session In Bedroom`,
  (k) => `Homemade Scandal ${k} – Leaked Indian Girl Bath Video`,
  (k) => `${k} – Hot Mallu Aunty Seduces Young Driver In Saree`,
  (k) => `${k} – Beautiful Tamil Bhabhi Seduces Neighbor In Room`,
  (k) => `Desi MMS ${k} – Viral Sri Lankan Couple Love Story`,
  (k) => `${k} – Hindi Audio Devar Bhabhi Real Romance Caught`,
  (k) => `${k} – Voluptuous Indian Widow Invites Young Neighborhood Guy`,
  (k) => `Leaked WhatsApp ${k} – Viral Desi Bhabhi Chudai Tape`,
  (k) => `${k} – Indian Girlfriend Secretly Filmed By Boyfriend`,
  (k) => `Steamy Saree ${k} – Voluptuous Indian Aunty Seduces Tailor`,
  (k) => `${k} – Hindi Speaking Couple Wild Backyard Fucking Tape`,
  (k) => `${k} – Leaked College Girl Viral MMS Scandals Videos`,
  (k) => `Devar Bhabhi Chudai ${k} – Steamy Hindi Audio Home Sex`,
  (k) => `${k} – Beautiful Indian Housewife Secret Lust Revealed`,
  (k) => `${k} – Leaked Pakistani Couple Wedding Night Tape`,
  (k) => `Desi Romance ${k} – Steamy Indian Bhabhi Romantic Night`,
  (k) => `${k} – Hindi Speaking Girlfriend Fucked Hard In Car`,
  (k) => `Viral MMS ${k} – Leaked Indian College Couple Video`,
  (k) => `${k} – Voluptuous Desi Housewife Pleases Young Neighbor`,
  (k) => `${k} – Beautiful Sri Lankan Aunty Steamy Bedroom Fun`,
  (k) => `Bhabhi Ki Garmi ${k} – Steamy Hindi Audio Fucking Video`,
  (k) => `${k} – Hot Indian Call Girl Secret Hotel Recording`,
  (k) => `${k} – Naughty Desi Couple Having Steamy Night In Room`,
  (k) => `WhatsApp Leaked ${k} – Viral Indian Girl Home Scandal`,
  (k) => `${k} – Voluptuous Punjabi Bhabhi Chudai With Devar`,
  (k) => `${k} – Beautiful Bengali Housewife Romantic Sex Tape`,
  (k) => `Hindi Audio ${k} – Steamy Bhabhi Seduces Young Devar`,
  (k) => `${k} – Leaked Indian Girl Secret Bathroom Video clip`,
  (k) => `${k} – Voluptuous Desi Bhabhi Getting Pounded in Kitchen`,
  (k) => `${k} – Hot Indian Girlfriend Pleases Boyfriend In Saree`,
  (k) => `Devar Ki Chudai ${k} – Steamy Hindi Audio Bhabhi Story`,
  (k) => `${k} – Real Leaked Indian Couple Steamy MMS Scandals`,
  (k) => `${k} – Hot Sri Lankan Bhabhi Bedroom Romance Video`,
  (k) => `${k} – Hindi Speaking College Girl Seduces Boyfriend`,
  (k) => `Viral Telegram ${k} – Leaked Indian Bhabhi Secret Tape`,
  (k) => `${k} – Voluptuous Desi Aunty Getting Fucked in Bathroom`,
  (k) => `${k} – Beautiful Indian Housewife Caught With Neighborhood Guy`,
];

// ─── 50 SEO Description templates (50-60 words each, unique) ─────────────────
const DESCRIPTION_TEMPLATES = [
  (t, k1, k2) => `Watch ${t} in this explosive Indian video that delivers pure Desi passion. ${k1} and ${k2} leave absolutely nothing to the imagination in this hot leaked MMS clip. Experience real Hindi audio chudai, passionate bedroom romance, and non-stop action that makes this free Indian porn video an absolute must-watch on VixTube.`,

  (t, k1, k2) => `${t} is the ultimate Desi Bhabhi chudai video you have been searching for. Featuring ${k1} alongside ${k2}, this viral homemade MMS clip captures raw Indian romance at its absolute finest. Stream high-quality Hindi audio sex clips for free on any mobile device. Non-stop amateur bedroom action from start to finish.`,

  (t, k1, k2) => `Get ready for ${t}, a sizzling hot Indian MMS video that will blow your mind. Watch as ${k1} and ${k2} explore their deepest desires behind closed doors. This authentic Hindi speaking sex video features real moans, steamy bhabhi chudai, and an explosive finish. Watch the best free Desi porn online on VixTube.`,

  (t, k1, k2) => `This ${t} clip captures genuine Desi homemade romance between two passionate Indian lovers. ${k1} brings the heat while ${k2} takes things to the next level in this leaked WhatsApp scandal video. If you love watching real Indian bhabhis and young studs in action, this steamy Hindi sex scene is for you.`,

  (t, k1, k2) => `${t} delivers everything a Desi porn lover craves. Starting with steamy saree seduction and building to an intense finish, this video features ${k1} and ${k2} at their naughtiest. Real Hindi speaking audio, genuine moans, and hardcore bedroom chudai make this leaked Indian MMS video an absolute masterpiece. Stream now.`,

  (t, k1, k2) => `Two passionate Indian lovers star in ${t}, one of the hottest leaked MMS videos online. ${k1} sets the mood perfectly while ${k2} delivers hardcore satisfaction in this real homemade Desi chudai video. Enjoy authentic Hindi audio, passionate romance, and an explosive finish. Available for free high-definition streaming on VixTube today.`,

  (t, k1, k2) => `${t} is a must-see for fans of genuine Indian Bhabhi chudai videos. Featuring the gorgeous ${k1} and her partner ${k2}, this steamy Hindi speaking sex scene starts with intense kissing and escalates to wild bedroom passion. 100% real amateur couple, zero fake performances. Watch this viral Desi MMS clip now.`,

  (t, k1, k2) => `Experience the ultimate Desi romance in ${t} as ${k1} and ${k2} fulfill their naughtiest fantasies. This leaked Indian MMS video features a voluptuous bhabhi getting fucked hard in the bedroom with real Hindi audio. Incredible bodies, raw sexual intensity, and explosive climaxes in every frame. Stream this free adult video now.`,

  (t, k1, k2) => `${t} proves why Indian Bhabhi and Devar stories rule the adult industry. ${k1} and ${k2} are both incredibly horny and together they create the perfect Desi chudai scene. Real Hindi audio, passionate romance, and intense positions make this leaked homemade MMS video a fan favorite. Stream it free on VixTube.`,

  (t, k1, k2) => `Featuring ${k1} and ${k2} in ${t}, this steamy Hindi speaking sex video covers every hot angle. From passionate oral to intense pounding positions, nothing is off limits in this leaked Desi MMS scandal. The authentic chemistry between these Indian lovers makes it one of the best free adult videos online today.`,

  (t, k1, k2) => `${t} is the leaked Indian couple sex video that delivers on every promise. ${k1} and ${k2} ensure they satisfy each other's deepest desires in this steamy homemade Desi chudai scene. Real Hindi audio, genuine moans, and explosive orgasms make this viral WhatsApp video an absolute must-watch. Stream it free now.`,

  (t, k1, k2) => `Watch the incredible ${t} where Desi bhabhi chudai meets real homemade passion. ${k1} wastes no time getting started while ${k2} brings the intensity with hardcore Hindi audio romance. This leaked Indian MMS video is the kind of authentic adult clip you bookmark and watch repeatedly. Free high-definition streaming on VixTube.`,

  (t, k1, k2) => `In ${t}, ${k1} and ${k2} push every boundary of Desi passion. This leaked Indian MMS video captures an authentic neighborhood affair with real Hindi audio and genuine moans. Watch this steamy bhabhi chudai video and experience group sex and bedroom romance done perfectly. 100% free streaming with no registration required.`,

  (t, k1, k2) => `${t} brings together the best of Indian amateur porn featuring ${k1} and ${k2}. What starts as a quiet night escalates into a wild homemade Desi chudai session with real Hindi speaking audio. Stream this viral leaked MMS clip on VixTube and enjoy the hottest Indian bedroom romance completely free today.`,

  (t, k1, k2) => `Enjoy the steamy ${t} featuring the incredible combination of ${k1} and ${k2} in a leaked hotel room scandal. This real Desi MMS video captures passionate foreplay followed by hardcore chudai with authentic Hindi audio. No fake moans, just raw bedroom passion between two consenting Indian lovers. Stream free on VixTube now.`,

  (t, k1, k2) => `${t} is everything an Indian bhabhi video should be. ${k1} and ${k2} bring their absolute best to this leaked Desi MMS chudai session. Real Hindi audio, genuine moans, and multiple hardcore positions define every second of this hot adult video. Watch it now on VixTube and enjoy premium Desi porn for free.`,

  (t, k1, k2) => `Two hot Indian lovers make magic in ${t}. ${k1} brings the passion in a sexy saree while ${k2} delivers hardcore satisfaction in this leaked Desi MMS video. Authentic Hindi speaking audio, real reactions, and an explosive finish make this homemade chudai video one of the most popular Indian clips online today.`,

  (t, k1, k2) => `${t} captures the raw energy of a real Indian couple having a secret affair. ${k1} and ${k2} leave nothing to the imagination in this leaked WhatsApp scandal video. Enjoy genuine Hindi audio, passionate romance, and intense bedroom chudai. One of the best free Desi porn videos streaming on VixTube right now.`,

  (t, k1, k2) => `Experience the ultimate Desi Bhabhi chudai in ${t} as ${k1} and ${k2} team up for an unforgettable night. This leaked Indian MMS video features real Hindi speaking audio, genuine moans, and intense positions. Stream this hot homemade adult clip on VixTube and discover why Indian amateur videos are trending worldwide.`,

  (t, k1, k2) => `${t} delivers a masterclass in Desi passion featuring ${k1} and ${k2}. Every second of this leaked Indian MMS video is packed with authentic bedroom chudai and real Hindi audio that cannot be faked. Real bodies, real desires, and explosive fulfillment define this incredible free adult video. Stream it now on VixTube.`,

  (t, k1, k2) => `Watch ${t} and discover what real Indian homemade romance looks like. ${k1} and ${k2} create something genuinely special, exploring their deepest desires with real Hindi audio. This authentic leaked Desi MMS video features non-stop action from beginning to spectacular end. One of the most rewatched Indian videos on VixTube today.`,

  (t, k1, k2) => `${t} stars the gorgeous ${k1} and her partner ${k2} in a leaked hotel room scandal. The genuine chemistry between these Indian lovers is electric and impossible to deny. Multiple chudai positions, real Hindi speaking audio, and explosive climaxes make this one of the most exciting free Desi porn videos online.`,

  (t, k1, k2) => `In this incredible ${t} video, ${k1} and ${k2} demonstrate why Indian Bhabhi chudai is so popular. Non-stop amateur action, real Hindi audio, genuine moans, and authentic passion in every frame. This leaked Desi MMS video delivers on every level, making it essential viewing for all adult content enthusiasts. Stream free.`,

  (t, k1, k2) => `${t} gives fans exactly what they want from premium Desi porn featuring ${k1} and ${k2}. These two passionate performers work in perfect harmony, delivering authentic Hindi speaking chudai with real moans and explosive finishes. Stream this leaked Indian MMS video now on VixTube completely free with no paywall.`,

  (t, k1, k2) => `Get ready to experience ${t}, where ${k1} and ${k2} take Indian amateur porn to an entirely new level. Authentic chemistry drives every scene in this leaked Desi MMS video. Real Hindi audio, genuine excitement, and non-stop bedroom chudai make this free adult clip one of the most compelling Indian videos online.`,

  (t, k1, k2) => `${t} features ${k1} alongside ${k2} in a leaked Desi chudai video defined by genuine passion. Nothing feels scripted in this incredible Indian MMS clip where real chemistry creates the most natural and satisfying bedroom sex. Watch it now on VixTube and understand why authentic Hindi speaking content always wins.`,

  (t, k1, k2) => `Witness real Desi magic in ${t} as ${k1} and ${k2} create something truly extraordinary. This leaked Indian MMS video captures everything that makes Bhabhi chudai videos irresistible: genuine chemistry, real Hindi audio, and explosive satisfaction. One of the finest free adult videos streaming on VixTube today, watched by thousands of satisfied fans.`,

  (t, k1, k2) => `${t} stars the incredible ${k1} and ${k2} in a homemade Desi chudai session that delivers pure pleasure. From a steamy start to an explosive finish, every moment of this leaked Indian MMS video features authentic Hindi speaking audio and real desire. Multiple positions and genuine moans make this an absolute must-watch.`,

  (t, k1, k2) => `In ${t}, ${k1} and ${k2} prove that homemade adult videos are the best. This exceptional leaked Indian MMS video captures the raw excitement and genuine passion of a real Bhabhi chudai session. Authentic chemistry, real Hindi audio, and non-stop bedroom action make this one of the most compelling adult videos on VixTube.`,

  (t, k1, k2) => `${t} showcases the voluptuous ${k1} and her partner ${k2} at their absolute naughtiest. The moment these Indian lovers come together in this leaked Desi MMS video, the action becomes completely unstoppable. Enjoy real Hindi audio, genuine passion, and multiple hardcore chudai positions. Stream free on VixTube now.`,

  (t, k1, k2) => `Watch as ${k1} and ${k2} make every Desi fantasy come true in ${t}. This incredible leaked Indian MMS video captures genuine bhabhi chudai chemistry that very few clips achieve. Every position, every moan, and every climax feels completely real with authentic Hindi speaking audio. Stream this essential adult clip now.`,

  (t, k1, k2) => `${t} delivers the complete Desi chudai experience featuring ${k1} and ${k2} at peak performance. Real chemistry fuels this leaked Indian MMS video where two passionate lovers leave nothing to the imagination. Multiple climaxes, real Hindi audio, and non-stop bedroom action make this one of the most satisfying free clips online.`,

  (t, k1, k2) => `A voluptuous Indian bhabhi collides with a young stud in ${t}. ${k1} and ${k2} show their most intimate sides in this genuinely passionate leaked Desi MMS video. The natural chemistry creates an authentic sexual energy with real Hindi audio, making this an absolutely essential watch for all Indian amateur porn fans.`,

  (t, k1, k2) => `${t} proves that some fantasies are even better in reality as ${k1} and ${k2} demonstrate perfect Desi chudai coordination. This leaked Indian MMS video shows genuine pleasure, real chemistry, and authentic Hindi audio. Stream this incredible adult video on VixTube now and experience what real homemade passion looks like.`,

  (t, k1, k2) => `Experience pure Desi pleasure in ${t} featuring ${k1} and ${k2} in a leaked hotel room scandal. Real desire, genuine moaning, and authentic Hindi audio define every moment of this exceptional Indian adult video. Nothing feels forced in this passionate chudai scene that captures real human chemistry at its most raw.`,

  (t, k1, k2) => `${t} features ${k1} and ${k2} in the kind of authentic Indian Bhabhi chudai video that fans dream about. These two passionate performers bring real energy and genuine desire with real Hindi audio to every second of this leaked Desi MMS clip. Multiple satisfying positions and explosive finishes make it a must-watch.`,

  (t, k1, k2) => `Watch the breathtaking ${t} where ${k1} and ${k2} create absolute magic in this leaked Indian MMS video. This free adult clip captures every element that makes Desi chudai content irresistible: authentic chemistry, real Hindi audio, and non-stop bedroom action. Fan-favorite amateur content, available for free streaming on VixTube now.`,

  (t, k1, k2) => `${t} captures the gorgeous ${k1} and her partner ${k2} in a genuine display of Indian homemade sex. Real chemistry, authentic desire, and explosive mutual satisfaction define this leaked Desi MMS video from start to finish. This is precisely the kind of honest, passionate Hindi speaking content that makes VixTube worth visiting.`,

  (t, k1, k2) => `In ${t}, ${k1} and ${k2} take their viewers on the most satisfying journey imaginable. This genuine Indian Bhabhi chudai video features no fake performances, only real passion and authentic Hindi audio throughout. One of the most celebrated free Desi MMS videos on VixTube today, this clip delivers everything fans crave.`,

  (t, k1, k2) => `${t} is the leaked Indian couple sex video that redefines what Desi amateur porn can be. ${k1} and ${k2} bring raw authentic passion and real Hindi speaking audio to every moment of this extraordinary clip. Real bodies, real desires, and real climaxes create an unforgettable viewing experience. Stream free now.`,

  (t, k1, k2) => `Watch ${t} and experience the genuine thrill of watching ${k1} and ${k2} explore every corner of their desires. This leaked Indian MMS video features non-stop passionate chudai with real Hindi audio and authentic climaxes that prove everything happening is completely real. A must-watch for dedicated Desi adult content fans.`,

  (t, k1, k2) => `${t} delivers an honest, passionate, and completely authentic Desi Bhabhi chudai encounter featuring ${k1} and ${k2}. These incredible Indian performers show what real homemade chemistry looks like, creating a leaked MMS video filled with genuine desire. Multiple explosive climaxes and real Hindi audio make this a favorite.`,

  (t, k1, k2) => `Get comfortable because ${t} featuring ${k1} and ${k2} is a long, satisfying Desi chudai video. This leaked Indian MMS video captures authentic passion and real chemistry between two consenting lovers who cannot get enough of each other. Real Hindi speaking audio, genuine positions, and explosive multiple finishes define this clip.`,

  (t, k1, k2) => `${t} stars the gorgeous ${k1} and her partner ${k2} in a leaked hotel room scandal dripping with authentic chemistry. This exceptional Desi MMS clip shows real Indian chudai at its most natural and most satisfying. Genuine passion, real Hindi audio, and non-stop bedroom action make this one of VixTube's best.`,

  (t, k1, k2) => `Discover why ${t} has become one of the most talked-about leaked Indian MMS videos online. ${k1} and ${k2} create genuine sexual magic, delivering authentic reactions and real Hindi audio. This outstanding Desi chudai clip features honest chemistry, real moaning, multiple positions, and explosive climaxes. Stream free now.`,

  (t, k1, k2) => `${t} features ${k1} and ${k2} in what can only be described as Desi Bhabhi chudai perfection. Real chemistry, genuine passion, and authentic Hindi speaking audio define every second of this leaked Indian MMS video. Watch as these two lovers explore every desire without reservation, creating a compelling and honest adult clip.`,

  (t, k1, k2) => `A gorgeous Indian bhabhi invites her devar for fun in ${t}. ${k1} and ${k2} demonstrate flawless Desi chudai chemistry throughout this leaked WhatsApp scandal video. Real Hindi speaking audio, genuine excitement, and non-stop passion make this one of the most highly rated free Indian porn clips on VixTube right now.`,

  (t, k1, k2) => `${t} captures the raw unfiltered energy of ${k1} and ${k2} at their most passionate. This authentic leaked Indian MMS video features real chemistry driving genuine desire from the first second to the last satisfied moan. Experience genuine Desi chudai done absolutely right in this essential homemade clip streaming free.`,

  (t, k1, k2) => `Watch the stunning ${t} where ${k1} and ${k2} make every Desi bhabhi chudai fantasy feel completely achievable. This leaked Indian MMS video delivers authentic passion, real chemistry, and genuine mutual satisfaction. Non-stop action, real Hindi audio, and incredible intensity make this one of the finest adult clips online.`,

  (t, k1, k2) => `${t} features the gorgeous ${k1} and her partner ${k2} in a leaked hotel room chudai scandal. The natural chemistry creates an authentic sexual energy with real Hindi audio, making this an absolutely essential watch for all Indian amateur porn fans. Stream this free Desi MMS video now on VixTube today.`,
];

// ─── Keyword pools for description context ────────────────────────────────────
const KEYWORD_POOL_1 = [
  'the steamy bhabhi','the voluptuous aunty','the gorgeous college girl','the hot housewife',
  'the passionate girlfriend','the sexy neighbor','the beautiful village girl',
  'the naughty sister-in-law','the horny bhabhi','the desirable aunty',
  'the cute college student','the attractive girlfriend','the lovely bride',
];
const KEYWORD_POOL_2 = [
  'her young devar','her handsome lover','her passionate boyfriend','her lucky husband',
  'her secret neighborhood lover','her young gym trainer','her hotel room companion',
  'her college boyfriend','her secret devar partner','her passionate companion',
];

// ─── Tag pools for Indian videos ──────────────────────────────────────────────
const INDIAN_TAGS_POOL = [
  ['indian','desi','bhabhi','hindi','homemade','mms','viral','couple'],
  ['indian','desi','devar','bhabhi','hindi-audio','chudai','homemade','sex'],
  ['indian','desi','aunty','saree','mature','neighborhood','home-sex','hindi'],
  ['indian','desi','college','gf','teen','leaked','mms','whatsapp'],
  ['indian','desi','husband-wife','romance','creampie','married','couple','desi-sex'],
  ['indian','desi','punjabi','bhabhi','hardcore','chudai','real-audio','hindi'],
  ['indian','desi','bengali','housewife','caught','devar','secret','affair'],
  ['indian','desi','south-indian','tamil','malayalam','mallu-aunty','saree','exotic'],
  ['indian','desi','pakistani','bhabhi','bedroom','romance','unspoken','desires'],
  ['indian','desi','srilankan','couple','sinhala','leaked-mms','romance','village'],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

function extractVideoId(url) {
  const m = url.match(/\/video\.([a-z0-9]+)\//i);
  return m ? m[1] : null;
}

function randItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomRating() { return Math.floor(Math.random() * 9) + 86; }
function getRandomViews() {
  const opts = ['210K','340K','480K','620K','790K','980K','1.3M','1.7M','2.2M','2.9M','3.8M'];
  return randItem(opts);
}
function getRandomDate() {
  const start = new Date('2025-01-01');
  const end   = new Date('2026-05-30');
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split('T')[0];
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Generate fresh unique SEO title ─────────────────────────────────────────
let titleTemplateIndex = 0; // cycle through templates to maximize uniqueness
function generateTitle(rawTitle) {
  const noisy = /\b(xvideos|xvid|xv|hd|brazzers|bangbros|naughtyamerica|pervcity|free|full|official|promo|download|watch|tube)\b/gi;
  let cleaned = rawTitle
    .replace(/\s*[-|–]\s*(xvideos|hd|free|full movie|xxx).*$/i, '')
    .replace(noisy, '')
    .replace(/[_\-#@!]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleaned.split(' ').filter(w => w.length > 2);
  const keyword = words.slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Desi Romance';

  // Cycle through templates so every video gets a unique template pattern
  const tpl = INDIAN_TITLE_TEMPLATES[titleTemplateIndex % INDIAN_TITLE_TEMPLATES.length];
  titleTemplateIndex++;
  return tpl(keyword);
}

// ─── Generate 50-60 word description ─────────────────────────────────────────
let descTemplateIndex = 0;
function generateDescription(title) {
  const k1 = randItem(KEYWORD_POOL_1);
  const k2 = randItem(KEYWORD_POOL_2);
  const tpl = DESCRIPTION_TEMPLATES[descTemplateIndex % DESCRIPTION_TEMPLATES.length];
  descTemplateIndex++;
  return tpl(title, k1, k2);
}

// ─── Fetch one video page metadata ───────────────────────────────────────────
async function fetchVideoMeta(url) {
  const videoId = extractVideoId(url);
  if (!videoId) return null;
  try {
    const { data } = await axios.get(url, {
      timeout: 18000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    });
    const $ = cheerio.load(data);
    let rawTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const thumbnail = $('meta[property="og:image"]').attr('content') || '';

    if (!rawTitle || rawTitle.toLowerCase().includes('xvideos.com')) {
      const parts = url.split('/');
      rawTitle = (parts[parts.length - 1] || parts[parts.length - 2] || '').replace(/[_\-]+/g, ' ');
    }

    const title     = generateTitle(rawTitle);
    const desc      = generateDescription(title);
    const tags      = randItem(INDIAN_TAGS_POOL);
    const slug      = slugify(title).slice(0, 95);
    const embedUrl  = `https://www.xvideos.com/embedframe/${videoId}`;

    return {
      title,
      slug,
      description: desc,
      embedUrl,
      thumbnailUrl: thumbnail,
      tags,
      category: CATEGORY,
      rating: getRandomRating(),
      views: getRandomViews(),
      dateAdded: getRandomDate(),
    };
  } catch {
    return null;
  }
}

// ─── Scrape one listing page → return array of watch page URLs ───────────────
async function scrapeListingPage(pageNum) {
  // Page 0 = /?k=indian
  // Page 1 = /?k=indian&p=1
  // Page 2 = /?k=indian&p=2
  const url = pageNum === 0
    ? XV_BASE_URL
    : `${XV_BASE_URL}&p=${pageNum}`;

  try {
    const { data } = await axios.get(url, {
      timeout: 20000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    const $ = cheerio.load(data);
    const urls = [];
    $('a').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (/\/video\.[a-z0-9]+\//i.test(href)) {
        const abs = href.startsWith('/') ? 'https://www.xvideos.com' + href : href;
        if (!urls.includes(abs)) urls.push(abs);
      }
    });
    return urls;
  } catch (e) {
    console.error(`  ⚠️  Failed to scrape page ${pageNum}: ${e.message}`);
    return [];
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const dbPath = path.resolve(__dirname, '../src/content/videos/database.json');
  const existing = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const existingSlugs  = new Set(existing.map(v => v.slug));
  const existingEmbeds = new Set(existing.map(v => v.embedUrl));

  console.log(`\n📦 Database: ${existing.length} existing videos`);
  console.log(`🎯 Target:   +${TARGET_COUNT} new Indian videos`);
  console.log(`🔗 Source:   ${XV_BASE_URL}\n`);
  console.log('─'.repeat(70));

  const newEntries = [];
  let page = START_PAGE;
  let consecutiveFails = 0;

  while (newEntries.length < TARGET_COUNT) {
    console.log(`\n📄 Scraping listing page ${page}...`);
    const watchUrls = await scrapeListingPage(page);

    if (watchUrls.length === 0) {
      consecutiveFails++;
      console.log(`  ⚠️  No URLs found on page ${page}. Consecutive fails: ${consecutiveFails}`);
      if (consecutiveFails >= 5) {
        console.log('  ❌ Too many consecutive empty pages. Stopping.');
        break;
      }
      page++;
      await sleep(2000);
      continue;
    }
    consecutiveFails = 0;
    console.log(`  🔍 Found ${watchUrls.length} URLs on page ${page}`);

    for (const url of watchUrls) {
      if (newEntries.length >= TARGET_COUNT) break;

      const videoId = extractVideoId(url);
      if (!videoId) continue;
      const embedUrl = `https://www.xvideos.com/embedframe/${videoId}`;
      if (existingEmbeds.has(embedUrl)) {
        process.stdout.write('⏭️  ');
        continue;
      }

      process.stdout.write(`\n  [${newEntries.length + 1}/${TARGET_COUNT}] Fetching ${videoId}...`);
      const meta = await fetchVideoMeta(url);
      if (!meta) { process.stdout.write(' ❌'); continue; }

      // Ensure unique slug
      let finalSlug = meta.slug;
      let attempt = 1;
      while (existingSlugs.has(finalSlug)) finalSlug = `${meta.slug}-${attempt++}`;
      meta.slug = finalSlug;

      existingSlugs.add(finalSlug);
      existingEmbeds.add(embedUrl);
      newEntries.push(meta);

      process.stdout.write(` ✅ [${meta.category}] "${meta.title.slice(0, 55)}..."`);
      await sleep(DELAY_MS);
    }

    // Save checkpoint every 100 videos
    if (newEntries.length > 0 && newEntries.length % 100 === 0) {
      const snapshot = [...newEntries, ...existing];
      fs.writeFileSync(dbPath, JSON.stringify(snapshot, null, 2), 'utf-8');
      console.log(`\n  💾 Checkpoint saved: ${newEntries.length} new videos so far`);
    }

    page++;
    await sleep(1500);
  }

  console.log('\n\n' + '─'.repeat(70));

  if (newEntries.length === 0) {
    console.log('⚠️  No new videos added. Check if XVideos search URL works.');
    return;
  }

  // Final save
  const finalDb = [...newEntries, ...existing];
  fs.writeFileSync(dbPath, JSON.stringify(finalDb, null, 2), 'utf-8');

  console.log(`✅ Done! Added ${newEntries.length} new Indian videos.`);
  console.log(`📦 Total DB: ${finalDb.length} videos`);
  console.log(`\n🚀 Triggering IndexNow to notify search engines...`);
  try {
    const indexnowPath = path.resolve(__dirname, 'indexnow.js');
    import(indexnowPath).catch(err => console.error('IndexNow trigger err:', err));
  } catch (e) {
    console.error('IndexNow trigger error:', e.message);
  }
}

main().catch(e => console.error('Fatal Error:', e.message));
