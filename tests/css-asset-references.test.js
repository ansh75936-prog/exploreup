const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const cssRoot = path.join(root, "css");

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const cssFiles = walk(cssRoot).filter(file => file.endsWith(".css"));
const missing = [];
let localReferences = 0;

function checkReference(cssFile, rawReference) {
  const reference = rawReference.trim();
  if (!reference || /^(?:https?:|data:|blob:|#|%23|\/\/)/i.test(reference)) return;

  let clean;
  try {
    clean = decodeURIComponent(reference.split(/[?#]/)[0]);
  } catch {
    clean = reference.split(/[?#]/)[0];
  }
  if (!clean) return;

  const cssRelative = path.relative(root, cssFile).split(path.sep).join("/");
  const resolved = clean.startsWith("/")
    ? path.posix.normalize(clean.slice(1))
    : path.posix.normalize(path.posix.join(path.posix.dirname(cssRelative), clean));

  localReferences += 1;
  if (resolved.startsWith("../") || !fs.existsSync(path.join(root, resolved))) {
    missing.push({ css: cssRelative, reference, resolved });
  }
}

for (const cssFile of cssFiles) {
  const source = fs.readFileSync(cssFile, "utf8");
  for (const match of source.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi)) {
    checkReference(cssFile, match[1] ?? match[2] ?? match[3] ?? "");
  }
  for (const match of source.matchAll(/@import\s+(?:"([^"]+)"|'([^']+)')/gi)) {
    checkReference(cssFile, match[1] ?? match[2] ?? "");
  }
}

assert.deepEqual(missing, [], "CSS files contain missing local asset references");
console.log(`PASS: checked ${cssFiles.length} CSS files and ${localReferences} local asset references.`);
