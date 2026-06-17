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
  const rawCookie = context.request.headers.get('cookie') ?? '';
  const isHuman = rawCookie.includes('vxt_human=1');

  // 4. vxt_bust redirect handler:
  //    After the JS challenge sets the cookie, the client does a hard navigation
  //    to ?vxt_bust=<timestamp> to bypass Edge cache. Here we detect that param,
  //    confirm the cookie is present, then 302-redirect to the clean URL.
  //    Vercel Edge never caches 302 responses, so this reliably breaks the loop.
  const hasBust = url.searchParams.has('vxt_bust');
  if (hasBust && isHuman) {
    url.searchParams.delete('vxt_bust');
    const cleanUrl = url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '');
    return new Response(null, {
      status: 302,
      headers: {
        'Location': cleanUrl,
        'Cache-Control': 'no-store',
      },
    });
  }

  // 5. Serve the JS challenge to unverified visitors
  if (!isHuman) {
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
    *, *::before, *::after { box-sizing: border-box; }
    body {
      background-color: #020617;
      color: #f8fafc;
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
      width: 90%;
      padding: 36px 30px;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(244, 63, 94, 0.15);
      border-radius: 24px;
      backdrop-filter: blur(12px);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    }
    .logo-box {
      display: inline-flex;
      height: 56px;
      width: 56px;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      background: linear-gradient(135deg, #f43f5e, #f59e0b);
      font-weight: 800;
      font-size: 28px;
      color: white;
      margin-bottom: 20px;
      box-shadow: 0 10px 25px -3px rgba(244, 63, 94, 0.4);
    }
    .spinner {
      width: 44px;
      height: 44px;
      border: 4px solid rgba(244, 63, 94, 0.15);
      border-left-color: #f43f5e;
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
      margin: 22px auto;
    }
    @keyframes spin {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      margin: 8px 0 0;
      background: linear-gradient(to right, #ffffff, #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    #msg {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.6;
      margin-top: 14px;
    }
    .footer-note {
      font-size: 11px;
      color: #475569;
      margin-top: 22px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-box">V</div>
    <h1>Checking your browser</h1>
    <div class="spinner" id="spinner"></div>
    <p id="msg">Please wait while we secure your connection to VixTube...</p>
    <div class="footer-note" id="footer">This process is automatic. Your browser will redirect shortly.</div>
  </div>

  <script>
    (function () {
      var msgEl   = document.getElementById('msg');
      var spinner = document.getElementById('spinner');
      var footer  = document.getElementById('footer');
      var isBot   = false;

      // 1. WebDriver flag — set by Selenium / Puppeteer / Playwright
      if (navigator.webdriver) { isBot = true; }

      // 2. Known headless User-Agent strings
      var ua = navigator.userAgent.toLowerCase();
      ['headlesschrome', 'selenium', 'puppeteer', 'playwright', 'phantomjs', 'jsdom']
        .forEach(function (sig) { if (ua.indexOf(sig) > -1) isBot = true; });

      // 3. Chrome with empty language list → headless indicator
      if (window.chrome && (!navigator.languages || navigator.languages.length === 0)) {
        isBot = true;
      }

      if (isBot) {
        if (spinner) spinner.style.display = 'none';
        if (footer)  footer.style.display  = 'none';
        if (msgEl)   msgEl.innerHTML =
          "<span style='color:#ef4444;font-weight:700'>Access Denied.</span>" +
          "<br>Automated requests are not allowed on VixTube.";
        return;
      }

      // Human verified.
      // Set the cookie first, then do a HARD navigation (not reload) with a
      // cache-busting query param. The server middleware sees the cookie on this
      // fresh request and issues a 302 to the clean URL — bypassing Edge cache.
      setTimeout(function () {
        var cookie = 'vxt_human=1; Path=/; Max-Age=86400; SameSite=Lax';
        if (location.protocol === 'https:') cookie += '; Secure';
        document.cookie = cookie;

        var sep = location.search ? '&' : '?';
        location.href = location.pathname + location.search + sep + 'vxt_bust=' + Date.now();
      }, 1000);
    })();
  </script>
</body>
</html>`;

    return new Response(challengeHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Vary': 'Cookie',
      },
    });
  }

  // 6. Verified human — render the real page
  const response = await next();

  // Country-based adult content blocking for video pages
  if (pathname.startsWith('/videos/')) {
    const country = context.request.headers.get('x-vercel-ip-country') ?? '';
    if (BLOCKED_COUNTRIES.includes(country.toUpperCase())) {
      response.headers.append('Set-Cookie', 'vxt_blocked=1; Path=/; Max-Age=300; SameSite=Lax');
    } else {
      response.headers.append('Set-Cookie', 'vxt_blocked=0; Path=/; Max-Age=0; SameSite=Lax');
    }
  }

  return response;
});
