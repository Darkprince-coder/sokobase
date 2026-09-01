#!/usr/bin/env node
// Bumps the service worker's CACHE_NAME before every production build so
// browsers always see public/sw.js as "changed" and correctly run the
// update-available flow in components/pwa/UpdateBanner.tsx.
//
// Wired up via the "prebuild" script in package.json — see instructions.md.
// Safe to run repeatedly; it just rewrites the version suffix each time.
const fs = require("fs");
const path = require("path");

const swPath = path.join(__dirname, "..", "public", "sw.js");
let contents = fs.readFileSync(swPath, "utf8");

const buildId = Date.now().toString();
const stamped = contents.replace(
  /const CACHE_NAME = "sokobase-pwa-v[^"]*";/,
  `const CACHE_NAME = "sokobase-pwa-v${buildId}";`
);

if (stamped === contents) {
  console.warn(
    "[stamp-sw] Could not find the CACHE_NAME line in public/sw.js — nothing was changed. " +
      "Make sure the file still has a line like: const CACHE_NAME = \"sokobase-pwa-v...\";"
  );
  process.exit(0);
}

fs.writeFileSync(swPath, stamped);
console.log(`[stamp-sw] CACHE_NAME bumped to sokobase-pwa-v${buildId}`);
