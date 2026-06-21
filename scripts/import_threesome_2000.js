import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Config ───────────────────────────────────────────────────────────────────
const TARGET_COUNT = 200;     // How many new videos to add
const DELAY_MS     = 700;     // Polite delay between requests (ms)
const CATEGORY     = 'Threesome';
const START_PAGE   = 0;       // XVideos pagination starts at 0

// XVideos threesome tag URL — /tags/threesome/{page} returns 25-27 videos/page
// ~80 pages needed for 2000 videos
const XV_BASE_URL  = 'https://www.xvideos.com/tags/threesome';

// ─── Noise tags to exclude ─────────────────────────────────────────────────────
const EXCLUDE_TAGS = new Set([
  'xvideos','xvideos.com','x-videos','x-video','porn','video','videos',
  'hd','free','raw','leak','leaked','xvid','xv','adult','xxx','sex','tube',
  'watch','full','scene','movie','clip','download','online','streaming',
  'brazzers','bangbros','pervcity','houseofyre','naughtyamerica','reality-kings',
]);

// ─── 100 SEO Long-Tail Title Templates (Threesome) ────────────────────────────
// Every template is unique so no two videos share the same title format.
const THREESOME_TITLE_TEMPLATES = [
  (k) => `${k} – Two Horny Girls Share One Big Cock In Wild Threesome`,
  (k) => `${k} – Best Friends Invite Boyfriend For Hot FFM Threesome`,
  (k) => `Caught Cheating – ${k} Turns Into Steamy Threesome Nobody Expected`,
  (k) => `${k} – Wife Lets Husband Fuck Her Hot Friend In Dirty MMF`,
  (k) => `${k} – College Girls Share Professor's Cock After Class`,
  (k) => `Late Night Sleepover ${k} Turns Into Wild All Night Threesome`,
  (k) => `${k} – Stepsisters Share Stepbro For The Ultimate Taboo Threesome`,
  (k) => `${k} – Pizza Delivery Guy Gets Lucky With Two Horny Roommates`,
  (k) => `Office After Hours ${k} – Boss Gets Fucked By Two Employees`,
  (k) => `${k} – Couple Invites Sexy Neighbor For First Ever Threesome`,
  (k) => `Two MILFs ${k} Take Young Cock And Love Every Second Of It`,
  (k) => `${k} – Naughty Threesome At Hotel Room With Two Horny Strangers`,
  (k) => `${k} – Twin Sisters Share Their Boyfriend's Big Hard Cock`,
  (k) => `Vacation Threesome ${k} – Beach Hookup With Two Bikini Babes`,
  (k) => `${k} – Husband Watches Wife Get Fucked By Her Best Friend's Boyfriend`,
  (k) => `Pool Party ${k} Turns Into Steamy Outdoor Threesome Fantasy`,
  (k) => `${k} – Two Redheads Take Turns Riding One Lucky Cock`,
  (k) => `${k} – Drunk Threesome At Bachelor Party Goes Way Too Far`,
  (k) => `Yoga Class ${k} – Instructor Fucks Two Flexible Students`,
  (k) => `${k} – Couple Has First MMF Threesome And She Loves Two Cocks`,
  (k) => `Hot Babysitter ${k} Joins Couple For Unexpected Sexy Threesome`,
  (k) => `${k} – Two Brunettes Compete To Please One Thick Cock`,
  (k) => `Spa Day ${k} – Masseuse Gets Caught And Joins Steamy Session`,
  (k) => `${k} – Lucky Guy Sandwich Between Two Gorgeous Petite Babes`,
  (k) => `${k} – Stepbrother Walks In On Stepsisters And Gets Invited`,
  (k) => `Gym Locker Room ${k} – Trainer Fucks Two Clients After Workout`,
  (k) => `${k} – Friends With Benefits Turns Into Epic Three Way Session`,
  (k) => `${k} – Blonde And Brunette Take Turns On Massive Cock`,
  (k) => `Camping Trip ${k} – Two Hot Girls Warm Up With One Cock`,
  (k) => `${k} – Threesome First Timer Discovers She Loves Being Shared`,
  (k) => `${k} – Stepmom And Stepsister Team Up To Satisfy Stepson`,
  (k) => `Doctor Office ${k} – Patient Gets Extra Special Treatment`,
  (k) => `${k} – Two Petite Teens Share Older Man's Thick Hard Cock`,
  (k) => `Neighbor Complaint ${k} Ends In Epic Apartment Threesome`,
  (k) => `${k} – Married Couple Tries Swapping And Can't Get Enough`,
  (k) => `${k} – Night Club VIP Room Threesome With Two Sexy Dancers`,
  (k) => `Home Delivery ${k} – Two Horny MILFs Tip The Driver Extra`,
  (k) => `${k} – Two Lesbians Decide They Need A Real Cock Tonight`,
  (k) => `Study Group ${k} – Three Students End Up In Wild Bedroom Session`,
  (k) => `${k} – Bored Wives Share Their Sexy Secret With New Guy`,
  (k) => `Airbnb Surprise ${k} – Host Joins Couple For Unexpected Fun`,
  (k) => `${k} – Two Busty Babes Double Team Their Lucky Boyfriend`,
  (k) => `Road Trip ${k} – Car Breaks Down And They Pass Time Together`,
  (k) => `${k} – First Threesome For Shy Girl Who Gets Wild Fast`,
  (k) => `Game Night ${k} – Strip Game Leads To Wild Three Way Fuck`,
  (k) => `${k} – Two Sexy Coworkers Share The Office Boss After Work`,
  (k) => `${k} – Jealous Girlfriend Joins Her Man And His Ex For Threesome`,
  (k) => `Fitness Trainer ${k} – Two Clients Reward Him After Long Session`,
  (k) => `${k} – Threesome In The Kitchen When Parents Leave For Weekend`,
  (k) => `${k} – Couple Films First Time Threesome For Private Collection`,
  (k) => `Blind Date ${k} Surprise – She Brought Her Hot Friend Along`,
  (k) => `${k} – Two Asian Cuties Share Their Favorite White Cock`,
  (k) => `${k} – Stepmom Catches Stepdaughter And Decides To Join In`,
  (k) => `Birthday Surprise ${k} – Best Gift Is A Hot Threesome`,
  (k) => `${k} – Two College Roommates Decide To Share Everything`,
  (k) => `Movie Night ${k} Turns Dirty – Three Friends Get Naughty`,
  (k) => `${k} – Latina Brings Her Best Friend Home For Surprise Threesome`,
  (k) => `Sleepless Night ${k} – Insomnia Cured By Epic Three Way`,
  (k) => `${k} – DP Lovers Finally Try Double Penetration Together`,
  (k) => `Backyard BBQ ${k} Turns Into Wild Outdoor Threesome`,
  (k) => `${k} – Two Curvy Women Fight Over One Big Cock`,
  (k) => `Private Tutor ${k} Gets Tutored By Two Naughty Students`,
  (k) => `${k} – Couple Tests Open Relationship With Sexy Stranger`,
  (k) => `Morning After ${k} – Three Wake Up Still Horny And Go Again`,
  (k) => `${k} – Ebony Beauty Joins Interracial Couple For Hot Threesome`,
  (k) => `Yoga Retreat ${k} – Three Strangers Find Inner Peace Together`,
  (k) => `${k} – Husband's Coworker Joins For After Work Threesome`,
  (k) => `Hot Tub ${k} – Two Neighbors Sneak In And Things Get Hot`,
  (k) => `${k} – Three Best Friends Finally Act On Their Desires`,
  (k) => `House Warming Party ${k} Ends With Three Way In Master Bedroom`,
  (k) => `${k} – Model Shoots Turn Dirty With Photographer And Assistant`,
  (k) => `${k} – Stepsisters Share Stepdad's Big Secret Cock`,
  (k) => `Art Class ${k} – Model Poses Then Joins Students For Fun`,
  (k) => `${k} – Horny Wives Dare Each Other And Share The Neighbor`,
  (k) => `Late Night Shift ${k} – Hospital Staff Get Relief Together`,
  (k) => `${k} – Two Thicc Babes Sit On One Face And One Cock`,
  (k) => `Cooking Class ${k} – Chef Gives Two Hungry Students Extras`,
  (k) => `${k} – Couple Adds Third Wheel Who Becomes Center Of Action`,
  (k) => `Long Weekend ${k} – Snowed In Threesome With No Clothes`,
  (k) => `${k} – Two Exotic Babes Worship Every Inch Of Big Cock`,
  (k) => `Bonus Room ${k} – Three Discover What The Basement Is For`,
  (k) => `${k} – Girls Night In Becomes Wild MMF Threesome By Midnight`,
  (k) => `Real Estate Tour ${k} – Agent Shows Couple The Bedroom Properly`,
  (k) => `${k} – Two Stepsisters Agree To Never Tell Anyone`,
  (k) => `Tropical Getaway ${k} – Villa Hookup With Local Beauty`,
  (k) => `${k} – Two Blondes Take Turns Until All Three Finish`,
  (k) => `Study Abroad ${k} – Exchange Student Teaches Two Girls`,
  (k) => `${k} – Threesome Virgin Gets Deflowered By Two Experienced Lovers`,
  (k) => `Rainy Day ${k} – Stuck Inside Leads To Best Decision Ever`,
  (k) => `${k} – Two Petite Babes Stretched Out By Massive Cock`,
  (k) => `Secret Affair ${k} Becomes Three Way When Girlfriend Arrives`,
  (k) => `${k} – Three Coworkers After The Holiday Office Party`,
  (k) => `Garage Sale ${k} – Neighbor Pays For Item In Best Way`,
  (k) => `${k} – Two Mature MILFs Share Young Stud All Weekend`,
  (k) => `Bachelorette Party ${k} Ends Wild With Stripper Joining`,
  (k) => `${k} – Fantasy Fulfilled When Girlfriend Surprises Boyfriend`,
  (k) => `Nude Beach ${k} – Stranger Joins Couple Under The Sun`,
  (k) => `${k} – Two Bossy Women Tell Man Exactly What They Want`,
];

// ─── 50 SEO Description templates (50-60 words each, unique) ─────────────────
const DESCRIPTION_TEMPLATES = [
  (t, k1, k2) => `Watch ${t} in this explosive threesome video that delivers pure unfiltered passion. ${k1} and ${k2} leave absolutely nothing to the imagination as all three lovers explore every position and fantasy together. Raw chemistry, real orgasms, and non-stop action make this one of the hottest three-way scenes you will ever watch online.`,

  (t, k1, k2) => `${t} is the threesome video you have been searching for. Two gorgeous babes and one incredibly lucky man create the perfect storm of lust and desire. ${k1} brings the energy while ${k2} brings the heat, and together they make this unforgettable free XXX clip an absolute must-watch for threesome fantasy fans.`,

  (t, k1, k2) => `This ${t} clip captures real threesome chemistry at its absolute finest. The moment ${k1} and ${k2} join forces, the room temperature rises to boiling point. Every thrust, moan, and climax feels completely authentic and intensely satisfying. If you love watching real people act out their deepest group sex fantasies, this is your video.`,

  (t, k1, k2) => `Get ready for ${t}, a sizzling hot threesome that will blow your mind from start to finish. Watch as ${k1} and ${k2} compete for attention in the most satisfying way possible. Both women give everything they have, taking turns in ways that guarantee no one leaves this bedroom disappointed or unsatisfied tonight.`,

  (t, k1, k2) => `${t} delivers everything a threesome lover craves. Starting slow with teasing and building to an explosive finish, this scene features ${k1} and ${k2} at their absolute naughtiest. The connection between all three performers is electric and completely undeniable. Free HD streaming available right now on VixTube for your viewing pleasure.`,

  (t, k1, k2) => `Two irresistible beauties and one very satisfied man star in ${t}. ${k1} sets the mood perfectly while ${k2} takes things to the next level. This authentic three-way encounter features real moaning, genuine chemistry, and a passionate finish that satisfies every desire. One of the best free threesome videos available online today.`,

  (t, k1, k2) => `${t} is a must-see for anyone who appreciates genuine group sex chemistry. Featuring ${k1} alongside ${k2}, this epic three-way session starts with teasing foreplay and escalates into hardcore non-stop action. Multiple positions, real orgasms, and absolutely zero fake performances make this one of the most honest threesome clips online.`,

  (t, k1, k2) => `Experience ${t}, where ${k1} and ${k2} combine forces to create the ultimate pleasure experience. These two stunning women know exactly how to share and satisfy, giving viewers a front-row seat to the hottest free threesome video online. Amazing bodies, incredible energy, and raw sexual intensity in every single frame of this scene.`,

  (t, k1, k2) => `${t} proves why threesomes are the ultimate sexual fantasy for millions worldwide. ${k1} and ${k2} are both irresistible and together they are absolutely unstoppable. Watch as they coordinate perfectly to maximize every second of pleasure for themselves and their lucky partner. This free XXX clip is pure threesome perfection from opening to finale.`,

  (t, k1, k2) => `Featuring ${k1} and ${k2} in ${t}, this passionate three-way encounter covers every base imaginable. From deep oral to multiple penetration positions, nothing is off limits in this steamy session. The authentic chemistry between all participants makes this one of the most engaging and satisfying free threesome videos you can stream right now.`,

  (t, k1, k2) => `${t} is the threesome video that delivers on every promise. ${k1} and ${k2} ensure their partner has the night of his life while getting everything they desire in return. Raw passion, genuine moaning, and real climaxes define this incredible free XXX clip. Stream it now and understand why threesome content rules the internet.`,

  (t, k1, k2) => `Watch the incredible ${t} where passion meets opportunity in the most satisfying way. ${k1} wastes no time getting things started while ${k2} brings the intensity to another level entirely. Together these three create something truly special and completely unforgettable. This is the free threesome video you bookmark and watch again and again.`,

  (t, k1, k2) => `${t} features ${k1} and ${k2} in a sizzling group encounter that pushes every boundary. These beauties know exactly how to work together to create maximum pleasure for everyone involved. Authentic reactions, incredible bodies, and non-stop hardcore action make this one of the finest free threesome clips streaming online today without any paywall.`,

  (t, k1, k2) => `In ${t}, ${k1} and ${k2} decide that sharing is the most beautiful thing in the world. What starts as innocent fun escalates quickly into hardcore three-way action that satisfies every desire imaginable. Real chemistry, real orgasms, and real passion define this stunning free XXX threesome clip that fans absolutely cannot stop watching.`,

  (t, k1, k2) => `${t} brings together ${k1} and ${k2} in an unforgettable display of threesome perfection. Every minute of this free XXX clip delivers raw unfiltered heat as three passionate individuals explore their deepest desires together. Multiple climaxes, incredible positions, and genuine connection make this the best free threesome video you will find online today.`,

  (t, k1, k2) => `Sit back and enjoy ${t}, featuring the incredible combination of ${k1} and ${k2} at their absolute best. This three-way encounter covers every base from slow sensual foreplay to wild hardcore action. The performances feel completely real because the passion is completely genuine. Stream this free threesome video now and experience group sex done perfectly.`,

  (t, k1, k2) => `${t} is everything a threesome video should be and more. ${k1} and ${k2} bring their absolute best to this passionate group encounter that leaves all three participants completely satisfied. Real moans, real orgasms, and real chemistry define every second of this stunning free XXX clip. Watch it now on VixTube completely free.`,

  (t, k1, k2) => `Two gorgeous women and one very lucky man make magic in ${t}. ${k1} brings the passion while ${k2} brings the expertise, and together they create the most satisfying threesome experience imaginable. Multiple positions, genuine reactions, and a finale that will leave you breathless define this incredible free adult video streaming today.`,

  (t, k1, k2) => `${t} captures the raw energy of a genuine threesome encounter between ${k1}, ${k2}, and their very satisfied partner. From the first touch to the final climax, this free XXX video delivers non-stop excitement and authentic passion. One of the most watched and most praised threesome clips available online today, completely free to stream.`,

  (t, k1, k2) => `Experience the ultimate group pleasure in ${t} as ${k1} and ${k2} team up to create an absolutely unforgettable encounter. This free threesome video features everything fans love about three-way content including genuine chemistry, real moaning, and explosive finishes. Stream it now on VixTube and discover why this clip has become a fan favorite.`,

  (t, k1, k2) => `${t} delivers a masterclass in threesome satisfaction featuring ${k1} and ${k2}. Every second of this free XXX clip is packed with authentic passion and raw sexual energy that cannot be faked or manufactured. Real bodies, real desires, and real fulfillment define this incredible video that threesome fans absolutely need to watch right now.`,

  (t, k1, k2) => `Watch ${t} and discover what true threesome chemistry looks and feels like. ${k1} and ${k2} create something genuinely special with their lucky partner, exploring every desire without reservation or hesitation. This authentic free adult video features non-stop action from beginning to spectacular end. One of the most rewatched threesome clips on VixTube today.`,

  (t, k1, k2) => `${t} stars ${k1} and ${k2} in a passionate three-way encounter that fans have been raving about. The genuine chemistry between all three performers is absolutely electric and completely impossible to deny. Multiple intense positions and real mutual satisfaction make this one of the most honest and exciting free threesome videos streaming online today.`,

  (t, k1, k2) => `In this incredible ${t} video, ${k1} and ${k2} demonstrate exactly why threesomes are considered the ultimate sexual experience. Non-stop action, genuine moaning, real orgasms, and authentic passion in every single frame. This free XXX threesome clip delivers on every level and then some, making it essential viewing for all adult content enthusiasts.`,

  (t, k1, k2) => `${t} gives fans exactly what they want from premium threesome content featuring ${k1} and ${k2}. These two stunning performers work in perfect harmony to satisfy their partner and themselves simultaneously. The result is an authentic free XXX video filled with genuine passion, incredible technique, and explosive multiple climaxes that will leave you completely satisfied.`,

  (t, k1, k2) => `Get ready to experience ${t}, where ${k1} and ${k2} take threesome videos to an entirely new level of intensity. Authentic chemistry drives every scene as these passionate performers hold absolutely nothing back. Real moaning, genuine excitement, and non-stop action make this free adult video one of the most compelling threesome clips available online.`,

  (t, k1, k2) => `${t} features ${k1} alongside ${k2} in a three-way encounter defined by genuine passion and mutual desire. Nothing feels scripted or forced in this incredible free XXX video where real chemistry creates the most natural and satisfying threesome experience imaginable. Watch it now on VixTube and understand why authentic group sex content always wins.`,

  (t, k1, k2) => `Witness real threesome magic in ${t} as ${k1} and ${k2} create something truly extraordinary together. This passionate group encounter captures everything that makes threesome content irresistible: genuine chemistry, real reactions, and explosive satisfaction. One of the finest free adult videos streaming on VixTube today, watched and rewatched by thousands of satisfied fans.`,

  (t, k1, k2) => `${t} stars the incredible ${k1} and ${k2} in a three-way session that delivers pure unadulterated pleasure. From teasing start to explosive finish, every moment of this free threesome video crackles with authentic energy and real desire. Multiple positions, genuine moaning, and real climaxes make this an absolute must-watch for group sex enthusiasts everywhere.`,

  (t, k1, k2) => `In ${t}, ${k1} and ${k2} prove that the best things truly do come in threes. This exceptional free XXX video captures the raw excitement and genuine passion of a real threesome encounter from beginning to end. Authentic chemistry, real satisfaction, and non-stop action make this one of the most compelling adult videos on VixTube.`,

  (t, k1, k2) => `${t} showcases ${k1} and ${k2} at their absolute naughtiest in this blazing hot threesome video. The moment all three passionate individuals come together, the chemistry becomes completely undeniable and the action becomes completely unstoppable. This free adult clip features real orgasms, authentic passion, and non-stop excitement that keeps fans coming back repeatedly.`,

  (t, k1, k2) => `Watch as ${k1} and ${k2} make every fantasy come true in ${t}. This incredible free threesome video captures genuine group sex chemistry that very few clips manage to achieve authentically. Every position, every moan, and every climax feels completely real because it absolutely is. Stream this essential threesome clip on VixTube completely free today.`,

  (t, k1, k2) => `${t} delivers the complete threesome experience featuring ${k1} and ${k2} at peak performance. Real chemistry fuels this incredible free XXX video where three passionate individuals leave absolutely everything on the bedroom floor. Multiple climaxes, genuine reactions, and non-stop hardcore action make this one of the most satisfying threesome clips available for free streaming.`,

  (t, k1, k2) => `Two unstoppable beauties collide with one fortunate man in ${t}. ${k1} and ${k2} show their most intimate sides in this genuinely passionate free threesome video. The natural chemistry between all three performers creates an authentic sexual energy that radiates through every single frame, making this an absolutely essential watch for three-way content lovers.`,

  (t, k1, k2) => `${t} proves that some fantasies are even better in reality as ${k1} and ${k2} demonstrate perfect threesome coordination. This free XXX clip shows genuine pleasure, real chemistry, and authentic satisfaction in ways that scripted content never can. Stream this incredible adult video on VixTube now and experience what real group sex passion looks like.`,

  (t, k1, k2) => `Experience pure threesome perfection in ${t} featuring ${k1} and ${k2} alongside their very satisfied companion. Real desire, genuine moaning, and authentic climaxes define every moment of this exceptional free adult video. Nothing feels manufactured or forced in this passionate group encounter that captures real human chemistry at its most raw and satisfying.`,

  (t, k1, k2) => `${t} features ${k1} and ${k2} in the kind of authentic threesome encounter that fans dream about watching. These passionate performers bring real energy and genuine desire to every second of this incredible free XXX clip. Multiple satisfying positions, real reactions, and explosive finishes make this one of the most rewatched threesome videos on VixTube today.`,

  (t, k1, k2) => `Watch the breathtaking ${t} where ${k1} and ${k2} create absolute magic together. This free threesome video captures every element that makes group sex content irresistible: authentic chemistry, real moaning, genuine satisfaction, and non-stop hardcore action. Fan-favorite three-way content at its absolute finest, available for free streaming on VixTube right now without registration.`,

  (t, k1, k2) => `${t} captures ${k1} and ${k2} in a genuine display of threesome perfection that fans cannot stop watching. Real chemistry, authentic desire, and explosive mutual satisfaction define this incredible free XXX video from start to spectacular finish. This is precisely the kind of honest, passionate group sex content that makes adult tube sites worth visiting daily.`,

  (t, k1, k2) => `In ${t}, ${k1} and ${k2} take their lucky partner on the most satisfying journey imaginable. This genuine threesome encounter features no fake performances, only real passion and authentic chemistry throughout. One of the most celebrated free adult videos on VixTube today, this clip delivers everything threesome fans crave and then keeps delivering more.`,

  (t, k1, k2) => `${t} is the threesome clip that redefines what group sex content can be. ${k1} and ${k2} bring raw authentic passion to every moment of this extraordinary free XXX video. Real bodies, real desires, and real climaxes create an unforgettable viewing experience. Stream this fan-favorite threesome video on VixTube now and see why it trends consistently.`,

  (t, k1, k2) => `Watch ${t} and experience the genuine thrill of watching ${k1} and ${k2} explore every corner of their desires together. This free adult threesome video features non-stop passionate action from beginning to end, with real moaning and authentic climaxes that prove everything happening is completely real. A must-watch for dedicated adult content enthusiasts.`,

  (t, k1, k2) => `${t} delivers an honest, passionate, and completely authentic threesome encounter featuring ${k1} and ${k2}. These incredible performers show what real group sex chemistry looks like, creating a free XXX video filled with genuine desire and mutual satisfaction. Multiple explosive climaxes and non-stop action make this an absolutely essential addition to your favorites list.`,

  (t, k1, k2) => `Get comfortable because ${t} featuring ${k1} and ${k2} is a long, satisfying ride you will not want to end. This free threesome video captures authentic passion and real chemistry between three consenting adults who cannot get enough of each other. Real moaning, genuine positions, and explosive multiple finishes define this outstanding adult video streaming on VixTube.`,

  (t, k1, k2) => `${t} stars ${k1} and ${k2} in a three-way encounter dripping with authentic chemistry and raw desire. This exceptional free XXX clip shows real group sex at its most natural and most satisfying, with no fake performances anywhere in sight. Genuine passion, real climaxes, and non-stop action make this one of VixTube's most popular threesome videos.`,

  (t, k1, k2) => `Discover why ${t} has become one of the most talked-about free threesome videos online. ${k1} and ${k2} create genuine sexual magic with their partner, delivering authentic reactions and real satisfaction throughout. This outstanding adult clip features everything threesome content lovers want: honest chemistry, real moaning, multiple positions, and explosive authentic climaxes.`,

  (t, k1, k2) => `${t} features ${k1} and ${k2} in what can only be described as threesome perfection. Real chemistry, genuine passion, and authentic mutual satisfaction define every incredible second of this free adult video. Watch as all three performers explore every desire without reservation, creating one of the most compelling and honest group sex clips streaming online today.`,

  (t, k1, k2) => `Two incredibly gorgeous women unite in ${t} to give their partner the ultimate group sex experience. ${k1} and ${k2} demonstrate flawless threesome chemistry throughout this outstanding free XXX video. Real moaning, genuine excitement, authentic climaxes, and non-stop passion make this one of the most highly rated free threesome clips on VixTube right now.`,

  (t, k1, k2) => `${t} captures the raw unfiltered energy of ${k1} and ${k2} at their most passionate and adventurous. This authentic free adult threesome video features real chemistry driving genuine desire from the very first second to the very last satisfied moan. Experience genuine group sex done absolutely right in this essential three-way clip streaming free on VixTube.`,

  (t, k1, k2) => `Watch the stunning ${t} where ${k1} and ${k2} make every threesome fantasy feel completely achievable and utterly satisfying. This free XXX video delivers authentic passion, real chemistry, and genuine mutual satisfaction in equal measure. Non-stop action, real orgasms, and incredible intensity make this one of the finest threesome clips available for free streaming today.`,
];

// ─── Keyword pools for description context ────────────────────────────────────
const KEYWORD_POOL_1 = [
  'the blonde beauty','the brunette babe','the curvy performer','the petite star',
  'the passionate beauty','the redhead stunner','the busty performer',
  'the athletic babe','the tattooed beauty','the natural stunner',
  'the experienced beauty','the energetic performer','the gorgeous star',
];
const KEYWORD_POOL_2 = [
  'her equally stunning partner','her gorgeous companion','her fiery co-star',
  'her beautiful partner','her irresistible co-performer','her equally passionate friend',
  'her stunning co-star','her equally gorgeous companion','her hot counterpart',
];

// ─── Tag pool for threesome videos ───────────────────────────────────────────
const THREESOME_TAGS_POOL = [
  ['threesome','ffm','two-girls-one-guy','group-sex','sharing','big-cock'],
  ['threesome','dp','double-penetration','group-sex','hardcore','busty'],
  ['threesome','mmf','two-guys-one-girl','gangbang','hardcore','creampie'],
  ['threesome','ffm','college','teen','petite','group-sex'],
  ['threesome','milf','cougar','group-sex','mature','big-tits'],
  ['threesome','lesbian','bisexual','girl-on-girl','group-sex','oral'],
  ['threesome','amateur','homemade','real','group-sex','couple'],
  ['threesome','stepsister','taboo','family','group-sex','teen'],
  ['threesome','latina','curvy','group-sex','exotic','passionate'],
  ['threesome','asian','exotic','group-sex','petite','cute'],
  ['threesome','ebony','interracial','bbc','group-sex','chocolate'],
  ['threesome','blonde','brunette','group-sex','sharing','big-cock'],
  ['threesome','big-tits','busty','group-sex','hardcore','oral'],
  ['threesome','outdoor','public','group-sex','risky','voyeur'],
  ['threesome','hotel','vacation','group-sex','strangers','hookup'],
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
  const opts = ['280K','390K','510K','670K','820K','1.1M','1.4M','1.8M','2.3M','3.1M','4.2M'];
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
  const keyword = words.slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Sexy Beauty';

  // Cycle through templates so every video gets a unique template pattern
  const tpl = THREESOME_TITLE_TEMPLATES[titleTemplateIndex % THREESOME_TITLE_TEMPLATES.length];
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
    const tags      = randItem(THREESOME_TAGS_POOL);
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
  // /tags/threesome/0 and /tags/threesome/ both work for page 0
  const url = `${XV_BASE_URL}/${pageNum}`;

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
  console.log(`🎯 Target:   +${TARGET_COUNT} new Threesome videos`);
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

      process.stdout.write(` ✅ "${meta.title.slice(0, 55)}..."`);
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
    console.log('⚠️  No new videos added. Check if XVideos URL is correct.');
    return;
  }

  // Final save
  const finalDb = [...newEntries, ...existing];
  fs.writeFileSync(dbPath, JSON.stringify(finalDb, null, 2), 'utf-8');

  console.log(`✅ Done! Added ${newEntries.length} new Threesome videos.`);
  console.log(`📦 Total DB: ${finalDb.length} videos`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Run: git add . && git commit -m "Add ${newEntries.length} threesome videos"`);
  console.log(`   2. git push  (Vercel will auto-deploy)`);
  console.log(`   3. Run: node scripts/indexnow.js  (notify search engines)`);
}

main().catch(e => console.error('Fatal Error:', e.message));
