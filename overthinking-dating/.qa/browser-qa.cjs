"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.argv[2] || "http://127.0.0.1:4173/overthinking-dating/";
const outputDir = path.join(__dirname, "screenshots");
fs.mkdirSync(outputDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function assertNoOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    html: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
    nav: document.querySelector(".bottom-nav")?.scrollWidth,
    navClient: document.querySelector(".bottom-nav")?.clientWidth
  }));
  assert(metrics.body <= metrics.viewport + 1, `${label}: body overflow ${JSON.stringify(metrics)}`);
  assert(metrics.html <= metrics.viewport + 1, `${label}: html overflow ${JSON.stringify(metrics)}`);
  assert(!metrics.nav || metrics.nav <= metrics.navClient + 1, `${label}: nav overflow ${JSON.stringify(metrics)}`);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
  page.on("requestfailed", (request) => errors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText || ""}`));

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  assert(await page.getByRole("heading", { name: "Was ist gerade möglich?" }).isVisible(), "Home workflow missing");
  assert(await page.locator(".book-cover").evaluate((image) => image.complete && image.naturalWidth === 1024), "Book cover missing or changed");
  await assertNoOverflow(page, "mobile home");
  await page.screenshot({ path: path.join(outputDir, "mobile-home.png"), fullPage: true });

  await page.getByRole("button", { name: "Ampel-Check starten" }).click();
  await page.getByRole("heading", { name: "Erst die Farbe, dann das Werkzeug" }).waitFor();
  const yellowChoices = page.locator(".choice.gelb");
  assert(await yellowChoices.count() === 4, "Expected four yellow check choices");
  for (const key of ["tempo", "atem", "spannung", "impuls"]) {
    await page.locator(`[data-check-key="${key}"][data-check-color="gelb"]`).click();
    await page.waitForTimeout(80);
  }
  await page.getByRole("button", { name: "Einordnen" }).click();
  assert(await page.getByRole("heading", { name: "Erst regulieren, dann reagieren." }).isVisible(), "Yellow result missing");
  await assertNoOverflow(page, "mobile check");
  await page.screenshot({ path: path.join(outputDir, "mobile-check.png"), fullPage: true });

  await page.getByRole("button", { name: /Tool 1 · Verlängertes Ausatmen/ }).click();
  await page.getByRole("button", { name: "Starten" }).click();
  await page.waitForTimeout(1100);
  assert((await page.locator('[data-timer-stage="1"]').textContent()) === "Einatmen", "Breathing timer did not start");
  await page.screenshot({ path: path.join(outputDir, "mobile-tool-dialog.png") });
  await page.locator("#tool-dialog [data-close-dialog]").click();

  await page.getByRole("button", { name: "21 Tage" }).click();
  await page.getByRole("heading", { name: "Das 21-Tage-Workbook" }).waitFor();
  assert(await page.locator(".day-cell").count() === 21, "Expected 21 day cells");
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outputDir, "mobile-days.png") });
  await page.locator('[data-day="1"]').first().click();
  await page.locator('[data-day-reflection="1"]').fill("Mein früheres Warnsignal ist der Kiefer.");
  await page.locator('[data-complete-day="1"]').click();
  await page.reload({ waitUntil: "networkidle" });
  assert((await page.locator('[data-day-reflection="1"]').inputValue()) === "Mein früheres Warnsignal ist der Kiefer.", "Reflection did not persist");
  assert(await page.getByRole("button", { name: "Markierung entfernen" }).isVisible(), "Day completion did not persist");
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outputDir, "mobile-day-detail.png"), fullPage: true });

  await page.getByRole("button", { name: "22 Tools" }).click();
  await page.getByRole("heading", { name: "Die SOS-Toolbox" }).waitFor();
  assert(await page.locator(".tool-card").count() === 22, "Expected 22 tools");
  await page.getByRole("button", { name: "Rot", exact: true }).click();
  assert(await page.locator(".tool-card").count() === 2, "Red filter should show two tools");
  await page.getByRole("button", { name: "Alle", exact: true }).click();
  await assertNoOverflow(page, "mobile tools");
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outputDir, "mobile-tools.png") });

  await page.getByRole("button", { name: "Belege" }).click();
  await page.getByRole("heading", { name: "Die Belege zum Buch" }).waitFor();
  assert(await page.locator(".source-card").count() === 66, "Expected 66 source cards");
  assert((await page.locator(".source-card a").count()) === 66, "Every source needs a link");
  await page.locator("#source-chapter").selectOption("1");
  assert(await page.locator(".source-card").count() === 9, "Chapter 1 should have nine unique sources");
  await assertNoOverflow(page, "mobile sources");
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outputDir, "mobile-sources.png") });

  await page.locator("#settings-open").click();
  assert(await page.getByText("iPhone oder iPad", { exact: true }).isVisible(), "iOS install guide missing");
  assert(await page.getByText("Android", { exact: true }).isVisible(), "Android install guide missing");
  await page.screenshot({ path: path.join(outputDir, "mobile-settings.png") });
  await page.locator("#settings-dialog [data-close-dialog]").click();

  const serviceWorker = await page.evaluate(async () => Boolean(await navigator.serviceWorker.ready));
  assert(serviceWorker, "Service worker not ready");
  const manifestStatus = await page.evaluate(() => fetch("manifest.webmanifest?v=1").then((response) => response.status));
  const swStatus = await page.evaluate(() => fetch("sw.js?v=1").then((response) => response.status));
  assert(manifestStatus === 200 && swStatus === 200, "PWA assets unavailable");

  await context.setOffline(true);
  await page.goto(baseUrl + "#today", { waitUntil: "domcontentloaded" });
  assert(await page.getByRole("heading", { name: "Was ist gerade möglich?" }).isVisible(), "Offline home failed");
  await context.setOffline(false);

  const desktop = await context.newPage();
  await desktop.setViewportSize({ width: 1365, height: 900 });
  await desktop.goto(baseUrl + "#tools", { waitUntil: "networkidle" });
  assert(await desktop.locator(".tool-card").count() === 22, "Desktop tools missing");
  await assertNoOverflow(desktop, "desktop tools");
  await desktop.screenshot({ path: path.join(outputDir, "desktop-tools.png"), fullPage: true });

  assert(errors.length === 0, `Browser errors: ${errors.join(" | ")}`);
  console.log(JSON.stringify({ ok: true, mobile: "390x844", desktop: "1365x900", days: 21, tools: 22, sources: 66, offline: true, errors }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
