import { chromium } from "playwright";

const out = process.argv[2] ?? "shots";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning")
    errors.push(`[${msg.type()}] ${msg.text()}`);
});
page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));

await page.goto("http://localhost:3111/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${out}/01-hero-top.png` });

/* scroll positions */
const stops = [
  ["02-gal-start", "#employees", 200],
  ["03-how", "#how-it-works", 300],
  ["04-why", "#why-lexi", 300],
  ["05-cases", "#use-cases", 300],
  ["06-about", "#about", 300],
  ["07-pricing", "#pricing", 300],
  ["08-contact", "#contact", 300],
];
for (const [name, sel, offset] of stops) {
  await page.evaluate(
    ([selector, y]) => {
      document
        .querySelector(selector)
        ?.scrollIntoView({ behavior: "instant", block: "start" });
      window.scrollBy(0, y);
    },
    [sel, offset],
  );
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/${name}.png` });
}

/* mid gallery pin */
await page.evaluate(() => {
  const el = document.getElementById("employees");
  if (el) window.scrollTo(0, el.offsetTop + window.innerHeight * 2.2);
});
await page.waitForTimeout(900);
await page.screenshot({ path: `${out}/02-gal-mid.png` });

/* ticker band — sits at exactly one viewport height */
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.965));
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/01b-band.png` });

/* footer — bottom of document */
await page.evaluate(() =>
  window.scrollTo(0, document.documentElement.scrollHeight),
);
await page.waitForTimeout(1200);
await page.screenshot({ path: `${out}/09-footer.png` });

/* mobile pass — 390×844 */
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});
mobile.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning")
    errors.push(`[m:${msg.type()}] ${msg.text()}`);
});
mobile.on("pageerror", (err) => errors.push(`[m:pageerror] ${err.message}`));
await mobile.goto("http://localhost:3111/", { waitUntil: "networkidle" });
await mobile.waitForTimeout(2500);
await mobile.screenshot({ path: `${out}/m1-hero.png` });

const mStops = [
  ["m2-gallery", "#employees", 500],
  ["m3-cases", "#use-cases", 400],
  ["m4-contact", "#contact", 400],
];
for (const [name, sel, offset] of mStops) {
  await mobile.evaluate(
    ([selector, y]) => {
      document
        .querySelector(selector)
        ?.scrollIntoView({ behavior: "instant", block: "start" });
      window.scrollBy(0, y);
    },
    [sel, offset],
  );
  await mobile.waitForTimeout(900);
  await mobile.screenshot({ path: `${out}/${name}.png` });
}

console.log(errors.length ? errors.join("\n") : "NO CONSOLE ERRORS");
await browser.close();
