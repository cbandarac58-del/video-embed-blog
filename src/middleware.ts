import { defineMiddleware } from 'astro:middleware';

// Countries where adult content is commonly blocked
const BLOCKED_COUNTRIES: string[] = [];

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  const method = context.request.method;

  // 1. Skip challenge for asset files, static assets, APIs, and non-GET requests
  const hasExtension = /\.[a-zA-Z0-9]{2,4}$/.test(pathname);
  const isAssetOrApi = hasExtension || 
                       pathname.startsWith('/_astro/') || 
                       pathname.startsWith('/_image/') ||
                       pathname.startsWith('/api/');

  if (method !== 'GET' || isAssetOrApi) {
    return next();
  }

  // 2. Skip challenge for known search engine crawlers to maintain SEO indexing
  const userAgent = context.request.headers.get('user-agent') ?? '';
  const isSearchCrawler = /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|sogou|exabot|facebot|facebookexternalhit|ia_archiver/i.test(userAgent);
  if (isSearchCrawler) {
    return next();
  }

  // 3. Check if user has already passed the bot challenge
  const cookieHeader = context.request.headers.get('cookie') ?? '';
  const isHuman = cookieHeader.includes('vxt_human=1');

  if (!isHuman) {
    // Return the silent JS challenge HTML response
    const challengeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Securing Connection | VixTube Premium</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap" rel="stylesheet" />
  <style>
    body {
      background-color: #020617; /* slate-950 */
      color: #f8fafc; /* slate-50 */
      font-family: 'Outfit', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      overflow: hidden;
    }
    .container {
      text-align: center;
      max-width: 420px;
      padding: 30px;
      background: rgba(15, 23, 42, 0.6); /* slate-900 with opacity */
      border: 1px solid rgba(244, 63, 94, 0.15); /* rose-500/15 border */
      border-radius: 24px;
      backdrop-filter: blur(12px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .logo-box {
      display: inline-flex;
      height: 52px;
      width: 52px;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background: linear-gradient(135deg, #f43f5e, #f59e0b); /* rose-500 to amber-500 */
      font-weight: 800;
      font-size: 26px;
      color: white;
      margin-bottom: 24px;
      box-shadow: 0 10px 20px -3px rgba(244, 63, 94, 0.4);
    }
    .spinner {
      width: 44px;
      height: 44px;
      border: 4px solid rgba(244, 63, 94, 0.1);
      border-left-color: #f43f5e;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 24px auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      margin: 10px 0;
      background: linear-gradient(to right, #ffffff, #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8; /* slate-400 */
      font-size: 14px;
      line-height: 1.6;
      margin-top: 12px;
    }
    .footer-note {
      font-size: 11px;
      color: #64748b;
      margin-top: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-box">V</div>
    <h1>Checking your browser</h1>
    <div class="spinner"></div>
    <p id="msg">Please wait while we secure your connection to VixTube...</p>
    <div class="footer-note">This process is automatic. Your browser will redirect shortly.</div>
  </div>
  <script>
    (function() {
      var isBot = false;
      var msgEl = document.getElementById('msg');
      
      // 1. Basic Automated WebDriver check
      if (navigator.webdriver) {
        isBot = true;
      }
      
      // 2. User Agent Check for headless tools
      var ua = navigator.userAgent.toLowerCase();
      var botUas = ['headlesschrome', 'selenium', 'puppeteer', 'playwright', 'phantomjs', 'jsdom'];
      for (var i = 0; i < botUas.length; i++) {
        if (ua.indexOf(botUas[i]) > -1) {
          isBot = true;
        }
      }
      
      // 3. Platform & languages validation (headless browsers often miss these or have anomalies)
      if (window.chrome) {
        if (!navigator.languages || navigator.languages.length === 0) {
          isBot = true;
        }
      }

      if (!isBot) {
        // Human verified: Set secure cookie (valid for 24 hours) and reload
        setTimeout(function() {
          var secureCookie = "vxt_human=1; Path=/; Max-Age=86400; SameSite=Lax";
          if (window.location.protocol === 'https:') {
            secureCookie += "; Secure";
          }
          document.cookie = secureCookie;
          window.location.reload();
        }, 1000);
      } else {
        // Access Denied for bots
        if (msgEl) {
          msgEl.innerHTML = "<span style='color: #ef4444; font-weight: bold;'>Access Denied.</span><br/>Automated requests are blocked on VixTube.";
        }
        var spinner = document.querySelector('.spinner');
        if (spinner) spinner.style.display = 'none';
        var footer = document.querySelector('.footer-note');
        if (footer) footer.style.display = 'none';
      }
    })();
  </script>
</body>
</html>`;

    return new Response(challengeHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });
  }

  // 4. Run the original response generation for verified humans
  const response = await next();

  // Keep country-based blocking logic if needed
  if (context.url.pathname.startsWith('/videos/')) {
    const country = context.request.headers.get('x-vercel-ip-country') ?? '';
    if (BLOCKED_COUNTRIES.includes(country.toUpperCase())) {
      response.headers.append(
        'Set-Cookie',
        'vxt_blocked=1; Path=/; Max-Age=300; SameSite=Lax'
      );
    } else {
      response.headers.append(
        'Set-Cookie',
        'vxt_blocked=0; Path=/; Max-Age=0; SameSite=Lax'
      );
    }
  }

  return response;
});
