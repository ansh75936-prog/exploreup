const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const vercel = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
const redirectedPages = new Set((vercel.redirects || []).map(item =>
  String(item.source || "").replace(/^\//, "").replace(/\/$/, "")
));

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function resolveLocalReference(page, rawReference) {
  const reference = String(rawReference || "").trim();
  if (!reference || /^(?:#|https?:|mailto:|tel:|javascript:|data:|blob:|\/\/)/i.test(reference)) {
    return null;
  }

  let clean;
  try {
    clean = decodeURIComponent(reference.split(/[?#]/)[0]);
  } catch {
    clean = reference.split(/[?#]/)[0];
  }
  if (!clean) return null;

  const pageRelative = path.relative(root, page).split(path.sep).join("/");
  const pageDirectory = path.posix.dirname(pageRelative);
  const target = clean.startsWith("/")
    ? path.posix.normalize(clean.slice(1))
    : path.posix.normalize(path.posix.join(pageDirectory === "." ? "" : pageDirectory, clean));

  if (target === "." || target === "") return "index.html";
  if (target.endsWith("/")) return path.posix.join(target, "index.html");
  return target;
}

function existsAsPageOrAsset(relativePath) {
  const absolute = path.resolve(root, relativePath);
  if (!absolute.startsWith(root + path.sep) && absolute !== root) return false;
  return fs.existsSync(absolute) ||
    fs.existsSync(path.join(absolute, "index.html"));
}

const allFiles = walk(root);
const htmlFiles = allFiles
  .filter(file => /\.html?$/i.test(file))
  .filter(file => !redirectedPages.has(path.relative(root, file).split(path.sep).join("/")))
  .sort();

assert.ok(htmlFiles.length > 0, "No active HTML pages were found.");
assert.ok(
  redirectedPages.has("index-1.html"),
  "The legacy index-1.html page must remain explicitly redirected before it is excluded from active-page checks."
);

const missingReferences = [];
const duplicateIds = [];
const duplicateScripts = [];
const duplicateStylesheets = [];
let localReferences = 0;
let scriptReferences = 0;
let stylesheetReferences = 0;

for (const page of htmlFiles) {
  const source = fs.readFileSync(page, "utf8");
  const pageName = path.relative(root, page).split(path.sep).join("/");

  const ids = [...source.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(match => match[1]);
  const repeatedIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  for (const id of repeatedIds) duplicateIds.push({ page: pageName, id });

  const scripts = [...source.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)]
    .map(match => match[1]);
  const scriptKeys = scripts.map(value => value.split(/[?#]/)[0]);
  for (const script of new Set(scriptKeys.filter((value, index) => scriptKeys.indexOf(value) !== index))) {
    duplicateScripts.push({ page: pageName, script });
  }
  scriptReferences += scripts.length;

  const stylesheets = [...source.matchAll(/<link\b(?=[^>]*\brel\s*=\s*["'][^"']*stylesheet[^"']*["'])(?=[^>]*\bhref\s*=\s*["']([^"']+)["'])[^>]*>/gi)]
    .map(match => match[1]);
  const styleKeys = stylesheets.map(value => value.split(/[?#]/)[0]);
  for (const stylesheet of new Set(styleKeys.filter((value, index) => styleKeys.indexOf(value) !== index))) {
    duplicateStylesheets.push({ page: pageName, stylesheet });
  }
  stylesheetReferences += stylesheets.length;

  for (const match of source.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)) {
    const resolved = resolveLocalReference(page, match[1]);
    if (resolved === null) continue;
    localReferences += 1;
    if (!existsAsPageOrAsset(resolved)) {
      missingReferences.push({ page: pageName, reference: match[1], resolved });
    }
  }
}

assert.deepEqual(missingReferences, [], "Active HTML pages contain broken local href/src references.");
assert.deepEqual(duplicateIds, [], "Active HTML pages contain duplicate element IDs.");
assert.deepEqual(duplicateScripts, [], "An active page loads the same JavaScript file more than once.");
assert.deepEqual(duplicateStylesheets, [], "An active page loads the same stylesheet more than once.");

console.log(
  `PASS: checked ${htmlFiles.length} active HTML pages, ${scriptReferences} script tags, ${stylesheetReferences} stylesheet links and ${localReferences} local href/src references.`
);
console.log("PASS: no duplicate IDs, duplicate script loads or duplicate stylesheet loads in active pages.");
console.log("PASS: the archived index-1.html page is excluded only because vercel.json permanently redirects it.");
