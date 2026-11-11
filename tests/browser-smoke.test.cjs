const assert = require("node:assert/strict");
const { chromium } = require("playwright");

const baseUrl = (process.env.BASE_URL || "https://exploreup-five.vercel.app").replace(/\/$/, "");
const pageErrors = [];
const failedRequests = [];

async function openPage(browser, path = "/") {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    serviceWorkers: "block"
  });
  const page = await context.newPage();
  await page.route("**/api/arya**", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ answer: "Lucknow is known for its heritage, Awadhi food and historic architecture." })
  }));
  page.on("pageerror", error => pageErrors.push({ path, message: error.message }));
  page.on("requestfailed", request => {
    const url = request.url();
    if (url.startsWith(baseUrl)) failedRequests.push({ path, url, error: request.failure()?.errorText || "request failed" });
  });
  const response = await page.goto(baseUrl + path, { waitUntil: "domcontentloaded", timeout: 45000 });
  assert.ok(response && response.status() === 200, `${path} should return HTTP 200`);
  if (path === "/" && process.env.EXPECT_REMOVED_ASSET) {
    const removedAsset = process.env.EXPECT_REMOVED_ASSET;
    let deployed = false;
    for (let attempt = 0; attempt < 24; attempt++) {
      if (!(await page.content()).includes(removedAsset)) {
        deployed = true;
        break;
      }
      await page.waitForTimeout(5000);
      const refreshed = await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 });
      assert.ok(refreshed && refreshed.status() === 200, "Production must continue returning HTTP 200 while deployment updates");
    }
    assert.ok(deployed || !(await page.content()).includes(removedAsset), "Production deployment did not publish the latest code within 2 minutes");
  }
  return { context, page };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  let context;
  let page;

  try {
    ({ context, page } = await openPage(browser));
    await page.waitForSelector("#euViewAll", { timeout: 20000 });

    // District directory: reveal/hide, all 75 records, search, region filtering and map.
    const reveal = page.locator("#euViewAll");
    await reveal.click();
    await page.waitForFunction(() => document.querySelectorAll("#cityGrid .city").length === 75, null, { timeout: 20000 });
    assert.equal(await page.locator("#cityGrid .city").count(), 75, "View All must render all 75 districts");
    assert.equal(await reveal.getAttribute("aria-expanded"), "true", "View All must expose its expanded state");

    const districtSearch = page.locator("#searchInput");
    await districtSearch.fill("Agra");
    await page.waitForFunction(() => document.querySelectorAll("#cityGrid .city:not(.is-hidden)").length === 2);
    assert.equal(await page.locator("#cityGrid .city:not(.is-hidden)").count(), 2, "Agra search should also match Prayagraj by substring");

    await districtSearch.fill("");
    const braj = page.locator('.region-btn[data-region="braj"]');
    if (await braj.count()) {
      await braj.click();
      const visibleBraj = await page.locator("#cityGrid .city:not(.is-hidden)").count();
      assert.ok(visibleBraj > 0 && visibleBraj < 75, "Braj filter should show a subset of districts");
      await page.locator('.region-btn[data-region="all"]').click();
    }

    const mapNode = page.locator("#upMapWrap .map-node").first();
    if (await mapNode.count()) {
      await mapNode.click();
      assert.ok(await page.locator("#mapPopover.show").count(), "Map marker should open its district popover");
    }

    await districtSearch.fill("Agra");
    await page.waitForFunction(() => document.querySelectorAll("#cityGrid .city:not(.is-hidden)").length === 2);
    const agraCard = page.locator("#cityGrid .city").filter({ has: page.locator(".citytext h3", { hasText: /^Agra$/ }) });
    await agraCard.click();
    await page.waitForFunction(() => document.getElementById("modal")?.getAttribute("aria-hidden") === "false");
    assert.equal((await page.locator("#modalTitle").textContent()).trim(), "Agra", "Selecting a district should open its guide");

    // District tabs and local favorites.
    await page.locator('.district-tab[data-tab="food"]').click();
    assert.equal(await page.locator('.district-tab[data-tab="food"]').getAttribute("aria-selected"), "true");
    await page.locator("#saveCityBtn").click();
    const saved = await page.evaluate(() => window.ExploreUPFavorites?.all?.() || []);
    assert.ok(saved.some(item => item.name === "Agra"), "Save destination should persist a favorite");

    await page.goto(baseUrl + "/favorites.html", { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForSelector("#list", { timeout: 10000 });
    await page.waitForFunction(() => document.getElementById("list")?.textContent.includes("Agra"), null, { timeout: 10000 });
    await page.evaluate(() => window.ExploreUPFavorites?.clear?.());

    // Search page: load the shared district catalog and return matching results.
    await page.goto(baseUrl + "/search.html", { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.locator("#powerSearch").fill("Agra");
    await page.waitForFunction(() => document.querySelectorAll("#searchResults .search-result").length > 0, null, { timeout: 30000 });
    assert.ok((await page.locator("#searchResults").innerText()).includes("Agra"), "Powerful Search should return Agra");

    // Nearby page: permission denial must be handled and the button restored.
    await page.goto(baseUrl + "/nearby.html", { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "geolocation", {
        configurable: true,
        value: {
          getCurrentPosition(success, error) {
            setTimeout(() => error({ code: 1, PERMISSION_DENIED: 1 }), 0);
          }
        }
      });
      window.open = () => ({ closed: false, close() { this.closed = true; } });
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("#nearbyBtn").click();
    await page.waitForFunction(() => document.getElementById("v21NearbyStatus")?.textContent.includes("permission was denied"), null, { timeout: 5000 });
    assert.equal(await page.locator("#nearbyBtn").isDisabled(), false, "Nearby button should recover after permission denial");

    // Feedback and city guide routes must render without a failed local document.
    for (const route of ["/feedback.html", "/city.html?city=Agra", "/agra.html", "/ayodhya.html", "/lucknow.html", "/varanasi.html"]) {
      const result = await openPage(browser, route);
      await result.page.waitForTimeout(250);
      await result.context.close();
    }

    // Homepage planner and Arya assistant.
    await page.goto(baseUrl + "/", { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.locator(".hero-btn.secondary").first().click();
    assert.ok(await page.locator("#planMakerModal.show").count(), "Trip planner should open");
    await page.locator("#planDestination").fill("Agra");
    await page.locator("#planDays").selectOption("2");
    await page.locator("#planPeople").fill("2");
    await page.getByRole("button", { name: /calculate budget/i }).click();
    await page.waitForFunction(() => document.getElementById("planResult")?.innerText.trim().length > 0, null, { timeout: 5000 });
    assert.ok((await page.locator("#planResult").innerText()).length > 0, "Trip budget calculator should render a result");
    await page.locator(".plan-close").click();

    await page.locator(".arya-fab").click();
    await page.waitForFunction(() => document.getElementById("aryaPanel")?.hidden === false);
    const before = await page.locator("#aryaBody .arya-msg.bot").count();
    await page.locator("#aryaInput").fill("Tell me about Lucknow");
    await page.getByRole("button", { name: "Ask", exact: true }).click();
    await page.waitForFunction(previous => document.querySelectorAll("#aryaBody .arya-msg.bot").length > previous, before, { timeout: 15000 });
    await page.locator(".arya-close[aria-label='Close Arya']").click();
    assert.equal(await page.locator("#aryaPanel").evaluate(el => el.hidden), true, "Arya should close cleanly");

    // Mobile menu, language and dark-mode controls.
    await page.locator("#mobileMenuBtn").click();
    assert.ok(await page.locator("#mobileMenu.show").count(), "Mobile menu should open");
    await page.locator("#mobileLanguageItem").click();
    assert.equal(await page.locator("html").getAttribute("lang"), "hi", "Language control should switch to Hindi");
    await page.locator("#mobileMenuBtn").click();
    await page.locator("#mobileDarkItem").click();
    assert.ok(await page.locator("body.dark").count(), "Dark-mode control should apply the dark theme");
    await page.locator("#mobileMenuBtn").click();
    await page.locator("#mobileDarkItem").click();
    assert.equal(await page.locator("body.dark").count(), 0, "Dark-mode control should restore the light theme");

    assert.deepEqual(pageErrors, [], "No uncaught JavaScript exceptions should occur in tested user flows");
    assert.deepEqual(failedRequests, [], "No failed same-origin requests should occur in tested user flows");

    console.log("PASS: 75-district reveal/hide, district search, region filter and map marker.");
    console.log("PASS: district guide, food tab and saved destination/favorites page.");
    console.log("PASS: Powerful Search, nearby permission-denied recovery and secondary page routes.");
    console.log("PASS: trip planner budget calculator, Arya response/open-close, mobile menu, language and dark mode.");
    console.log("PASS: no uncaught page errors or failed same-origin requests.");
  } finally {
    if (context) await context.close();
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
