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
  setInterval: () => 0,
  clearInterval: () => {},
  fetch: async () => { throw new Error("Network disabled in regression tests"); },
  document: { getElementById: () => null },
  exploreSupabase: null,
  window: { ExploreUPDistricts: [] },
  cities: [],
  contactData: {},
  districtServiceContacts: {}
});

const districtRoot = path.join(root, "districts");
const districtFiles = fs.readdirSync(districtRoot, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && entry.name !== "_template")
  .map(entry => path.join(districtRoot, entry.name, "data.js"))
  .sort();
for (const filename of districtFiles) {
  vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });
}
context.cities = context.window.ExploreUPDistricts;
assert.equal(context.cities.length, 75, "Regression suite must load all 75 district data files");
assert.equal(new Set(context.cities.map(city => city.name)).size, 75, "District names must be unique");

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

  const kanpurNagarHistory = await evaluate('aryaAnswer("Kanpur Nagar history", "en")');
  assert.match(kanpurNagarHistory, /Industrial city on the Ganga/);

  const genericPlaces = await evaluate('aryaAnswer("Kanpur Dehat places", "en")');
  assert.match(genericPlaces, /Verified Kanpur Dehat place details are not currently available/);
  assert.doesNotMatch(genericPlaces, /undefined/);

  const genericFood = await evaluate('aryaAnswer("Food in Kanpur Dehat", "en")');
  assert.match(genericFood, /Verified Kanpur Dehat food details are not currently available/);
  assert.doesNotMatch(genericFood, /undefined/);

  const genericOverview = await evaluate('aryaAnswer("Kanpur Dehat district guide", "en")');
  assert.match(genericOverview, /Kanpur Dehat is one of Uttar Pradesh/);
  assert.match(genericOverview, /Verified Kanpur Dehat culture details are not currently available/);
  assert.doesNotMatch(genericOverview, /undefined/);

  const genericTrip = await evaluate('aryaAnswer("Make a trip plan for Kanpur Dehat", "en")');
  assert.match(genericTrip, /Verified Kanpur Dehat place details are not currently available/);
  assert.doesNotMatch(genericTrip, /undefined/);

  for (const district of context.cities) {
    const name = district.name;
    const queries = [
      `${name} places`,
      `Food in ${name}`,
      `${name} history`,
      `${name} culture`,
      `${name} nature`,
      `Shopping in ${name}`,
      `${name} district guide`,
      `Trip plan for ${name}`
    ];
    for (const query of queries) {
      const answer = await evaluate(`aryaAnswer(${JSON.stringify(query)}, "en")`);
      assert.equal(typeof answer, "string", `Expected a text answer for ${query}`);
      assert.doesNotMatch(answer, /\bundefined\b/, `Unexpected undefined in answer for ${query}`);
      assert.doesNotMatch(answer, /Local landmarks, attractions, markets & nearby places|Local cuisine, regional specialities & popular eateries|Local markets, handicrafts & district shopping/i,
        `Generic placeholder leaked into answer for ${query}`);
    }
  }

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
  console.log("PASS: detailed district answers use bundled knowledge.");
  console.log("PASS: all 75 districts return safe answers across eight core intents without undefined values or generic placeholders.");
  console.log("PASS: districts without detailed knowledge clearly report unavailable verified details.");
  console.log("PASS: trip-planner and website-navigation answers remain available.");
  console.log("PASS: out-of-scope questions receive the ExploreUP scope response.");
  console.log("PASS: unavailable live data and translation services fail gracefully.");
  console.log("PASS: Hindi structural labels are localized without requiring network access.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
