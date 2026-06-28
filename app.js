// app.js - CommonJS wrapper to boot the Astro ES module server under Phusion Passenger
(async () => {
  await import('./dist/server/entry.mjs');
})();
