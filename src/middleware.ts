import { defineMiddleware } from 'astro:middleware';

// Countries where adult content is commonly blocked
const BLOCKED_COUNTRIES: string[] = [];

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  const method = context.request.method;

  // 1. Skip for assets, API routes, and non-GET requests
  const hasExtension = /\.[a-zA-Z0-9]{2,4}$/.test(pathname);
  const isAssetOrApi = hasExtension ||
                       pathname.startsWith('/_astro/') ||
                       pathname.startsWith('/_image/') ||
                       pathname.startsWith('/api/');

  if (method !== 'GET' || isAssetOrApi) {
    return next();
  }

  // 2. Let legitimate search engine crawlers through (preserves SEO)
  const userAgent = context.request.headers.get('user-agent') ?? '';
  const isSearchCrawler = /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|sogou|exabot|facebot|facebookexternalhit|ia_archiver/i.test(userAgent);
  if (isSearchCrawler) {
    return next();
  }

  // 3. Check if user is already verified
  const rawCookie = context.request.headers.get('cookie') ?? '';
  const isHuman = rawCookie.includes('vxt_human=1');

  // 4. Handle vxt_bust verification callback.
  //    When the challenge JS passes, it navigates here with ?vxt_bust=<timestamp>.
  //    The middleware (not JS) sets the cookie server-side and 302s to the clean URL.
  //    This is fully reliable: no client-side cookie setting, no Edge cache issues.
  const bustParam = url.searchParams.get('vxt_bust');
  if (bustParam && !isHuman) {
    const bustTs = parseInt(bustParam, 10);
    const isRecentBust = !isNaN(bustTs) && (Date.now() - bustTs) < 30000; // within 30s

    if (isRecentBust) {
      // Strip vxt_bust and any other internal params
      url.searchParams.delete('vxt_bust');
      const cleanUrl = url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '');
      const isHttps = url.protocol === 'https:';
      const cookieValue = `vxt_human=1; Path=/; Max-Age=86400; SameSite=Lax${isHttps ? '; Secure' : ''}`;

      // Server sets cookie → browser will include it in the redirect follow-up request
      return new Response(null, {
        status: 302,
        headers: {
          'Location': cleanUrl,
          'Set-Cookie': cookieValue,
          'Cache-Control': 'no-store',
        },
      });
    }
  }

  // 5. Verified human — serve the real page
  if (isHuman) {
    const response = await next();

    // Country-based blocking for video pages
    if (pathname.startsWith('/videos/')) {
      const country = context.request.headers.get('x-vercel-ip-country') ?? '';
      if (BLOCKED_COUNTRIES.includes(country.toUpperCase())) {
        response.headers.append('Set-Cookie', 'vxt_blocked=1; Path=/; Max-Age=300; SameSite=Lax');
      } else {
        response.headers.append('Set-Cookie', 'vxt_blocked=0; Path=/; Max-Age=0; SameSite=Lax');
      }
    }

    return response;
  }

  // 6. Unverified visitor — serve the JS challenge page
  const destPath = encodeURIComponent(pathname + (url.search || ''));

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
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
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
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6);
    }
    .logo-box {
      display: inline-flex;
      height: 56px; width: 56px;
      align-items: center; justify-content: center;
      border-radius: 16px;
      background: linear-gradient(135deg, #f43f5e, #f59e0b);
      font-weight: 800; font-size: 28px; color: white;
      margin-bottom: 20px;
      box-shadow: 0 10px 25px -3px rgba(244,63,94,0.4);
    }
    .spinner {
      width: 44px; height: 44px;
      border: 4px solid rgba(244,63,94,0.15);
      border-left-color: #f43f5e;
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
      margin: 22px auto;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    h1 {
      font-size: 22px; font-weight: 800; margin: 8px 0 0;
      background: linear-gradient(to right, #fff, #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    #msg { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-top: 14px; }
    .footer-note { font-size: 11px; color: #475569; margin-top: 22px; }
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
      // The original destination — server-injected, no client cookie needed
      var dest = decodeURIComponent('${destPath}');

      var spinner = document.getElementById('spinner');
      var footer  = document.getElementById('footer');
      var msgEl   = document.getElementById('msg');
      var isBot   = false;

      // 1. WebDriver flag (Selenium / Puppeteer / Playwright set this)
      if (navigator.webdriver) isBot = true;

      // 2. Known headless browser UA signatures
      var ua = navigator.userAgent.toLowerCase();
      ['headlesschrome','selenium','puppeteer','playwright','phantomjs','jsdom']
        .forEach(function (s) { if (ua.indexOf(s) > -1) isBot = true; });

      // 3. Chrome with empty language array = headless indicator
      if (window.chrome && (!navigator.languages || !navigator.languages.length)) isBot = true;

      if (isBot) {
        if (spinner) spinner.style.display = 'none';
        if (footer)  footer.style.display  = 'none';
        if (msgEl)   msgEl.innerHTML =
          "<span style='color:#ef4444;font-weight:700'>Access Denied.</span>" +
          "<br>Automated requests are not allowed on VixTube.";
        return;
      }

      // Human verified.
      // Navigate with ?vxt_bust=<timestamp>. The SERVER-SIDE middleware intercepts
      // this, sets Set-Cookie: vxt_human=1, and 302-redirects to the clean URL.
      // No client-side cookie setting — eliminates all browser/edge caching issues.
      setTimeout(function () {
        var sep = dest.indexOf('?') > -1 ? '&' : '?';
        location.href = dest + sep + 'vxt_bust=' + Date.now();
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
});
