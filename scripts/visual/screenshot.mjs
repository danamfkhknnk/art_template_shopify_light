import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:9292';

// Pass SECTION=team to scroll to and capture only that section
// (matches [data-gs-section="team"] in the liquid sections), or leave
// unset to capture the full viewport like before.
const SECTION = process.env.SECTION || null;
const SELECTOR = SECTION ? `[data-gs-section="${SECTION}"]` : null;
const OUT_DIR = SECTION ? `screenshots/${SECTION}` : 'screenshots';

// Pass SCROLL_Y=<px> to scroll the page down before capturing (e.g. to
// validate the compact/scrolled header state). Filenames get a "-scrolled"
// suffix so they land alongside the normal (top-of-page) screenshots.
const SCROLL_Y = process.env.SCROLL_Y ? Number(process.env.SCROLL_Y) : null;
const FILE_SUFFIX = SCROLL_Y !== null ? '-scrolled' : '';

const viewports = [
  {
    name: 'desktop',
    width: 1440,
    height: 1024,
  },
  {
    name: 'large-desktop',
    width: 1280,
    height: 900,
  },
  {
    name: 'tablet',
    width: 768,
    height: 1024,
  },
  {
    name: 'mobile',
    width: 390,
    height: 844,
  },
];

await fs.mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();

const page = await browser.newPage();

for (const viewport of viewports) {
  console.log(
    `Taking screenshot: ${viewport.name} (${viewport.width}x${viewport.height})${SECTION ? ` [section: ${SECTION}]` : ''}`
  );

  await page.setViewportSize({
    width: viewport.width,
    height: viewport.height,
  });

  await page.goto(BASE_URL, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  // Wait for fonts and images to settle.
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const images = Array.from(document.images);

    await Promise.all(
      images.map((image) => {
        if (image.complete) return Promise.resolve();

        return new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        });
      })
    );
  });

  let target = page;

  if (SELECTOR) {
    target = page.locator(SELECTOR).first();
    await target.waitFor({ state: 'attached', timeout: 15000 });
    await target.scrollIntoViewIfNeeded();
    // Give GSAP ScrollTrigger reveal animations time to fire and finish.
    await page.waitForTimeout(1500);
  } else {
    await page.waitForTimeout(3000);
  }

  if (SCROLL_Y !== null) {
    await page.evaluate((y) => window.scrollTo(0, y), SCROLL_Y);
    // Let scroll-triggered CSS transitions (e.g. compact header) settle.
    await page.waitForTimeout(600);
  }

  await target.screenshot({
    path: `${OUT_DIR}/${viewport.name}${FILE_SUFFIX}.png`,
    fullPage: false,
  });
}

await browser.close();

console.log('Screenshots completed.');
