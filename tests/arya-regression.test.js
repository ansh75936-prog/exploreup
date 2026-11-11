const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({
  console,
  Date,
  Map,
  Promise,
  setTimeout,
  clearTimeout,
  fetch: async () => { throw new Error("Network disabled in regression tests"); },
  document: { getElementById: () => null },
  window: {},
  exploreSupabase: null,
  cities: [{
    name: "Lucknow",
    tag: "Awadhi heritage and culture",
    food: "Awadhi biryani, kebabs and local sweets",
    shop: "Hazratganj and Chowk markets",
    budget: "A moderate city-break budget",
    time: "October to March"
  }],
  contactData: { Lucknow: { hotels: [], hospitals: [] } },
  districtServiceContacts: { Lucknow: { hotels: [], hospitals: [] } }
});

const scripts = [
  "js/arya-core.js",
  "js/arya-language.js",
  "js/arya-district-knowledge.js",
  "js/arya-live-context.js",
  "js/arya-answer-engine.js"
];

for (const relativePath of scripts) {
  const filename = path.join(root, relativePath);
  vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });
}

const evaluate = (source) => vm.runInContext(source, context);

async function main() {
  assert.equal(evaluate('aryaDetectLanguage("नमस्ते, लखनऊ के बारे में बताओ")'), "hi");
  assert.equal(evaluate('aryaDetectLanguage("Lucknow ke baare mein batao")'), "hi");
  assert.equal(evaluate('aryaDetectLanguage("Tell me about Lucknow")'), "en");
  assert.equal(evaluate('aryaLangPack("unknown").welcome'), evaluate('aryaLangPack("en").welcome'));

  const places = await evaluate('aryaAnswer("Lucknow places", "en")');
  assert.match(places, /Bara Imambara/);
  assert.match(places, /Ask me about any section/);

  const food = await evaluate('aryaAnswer("Food in Lucknow", "en")');
  assert.match(food, /Awadhi biryani/);

  const history = await evaluate('aryaAnswer("Lucknow history", "en")');
  assert.match(history, /Nawabs of Awadh/);

  const planner = await evaluate('aryaAnswer("Make a 2 day trip plan for Lucknow", "en")');
  assert.match(planner, /Quick Plan uses bundled ExploreUP information/);
  assert.match(planner, /suggested day-by-day plan/);

  const websiteHelp = await evaluate('aryaAnswer("How do I use ExploreUP search?", "en")');
  assert.match(websiteHelp, /Use the main search/);

  const outOfScope = await evaluate('aryaAnswer("Tell me a joke", "en")');
  assert.match(outOfScope, /only with information and features available inside ExploreUP/);

  const liveFallback = await evaluate("getAryaLiveContext()");
  assert.equal(liveFallback.districts.length, 0);
  assert.equal(liveFallback.suggestions.length, 0);
  assert.equal(liveFallback.reviews.length, 0);

  const translatedFallback = await evaluate('aryaTranslateChunk("Places in Lucknow", "hi")');
  assert.equal(translatedFallback, "Places in Lucknow");

  const localized = await evaluate('aryaLocalizeAnswer("Top places\\n\\nFood guide", "hi")');
  assert.match(localized, /प्रमुख स्थान/);
  assert.match(localized, /खाने-पीने की जानकारी/);

  console.log("PASS: Arya detects Hindi script, romanised Hindi and English.");
  console.log("PASS: Arya language packs safely fall back to English.");
  console.log("PASS: district places, food and history answers use bundled knowledge.");
  console.log("PASS: trip-planner and website-navigation answers remain available.");
  console.log("PASS: out-of-scope questions receive the ExploreUP scope response.");
  console.log("PASS: unavailable live data and translation services fail gracefully.");
  console.log("PASS: Hindi structural labels are localized without requiring network access.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
