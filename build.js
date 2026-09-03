#!/usr/bin/env node
// build.js — walk a docs directory and inline a markdown tree into the
// index.html template, replacing $MENU$ and $TITLE$ placeholders.
//
// Usage:
//   node build.js <docsDir> <name> <templatePath>
//
// Args:
//   docsDir       directory to walk for *.md files and subdirectories
//   name          page title (replaces $TITLE$ in template)
//   templatePath  template HTML — overwritten in place with substitutions
//
// Tree node shape (per spec):
//   { name, content, children }
//   .md file:    content = file text,    children = []
//   directory:   content = "",           children = [ ...subnodes ]

const fs = require("fs");
const path = require("path");

const [, , docsDirArg, nameArg, templatePathArg] = process.argv;

if (!docsDirArg || !nameArg || !templatePathArg) {
  console.error("Usage: node build.js <docsDir> <name> <templatePath>");
  process.exit(1);
}

const docsDir = path.resolve(docsDirArg);
const templatePath = path.resolve(templatePathArg);

function walk(dir) {
  const children = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    // skip hidden files / dirs (.git, .claude, ...)
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = walk(fullPath);
      children.push({ name: entry.name, content: "", children: sub });
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      // strip the .md extension so the node name is the file stem
      const stem = entry.name.slice(0, -3);
      children.push({ name: stem, content, children: [] });
    }
    // non-.md files are ignored
  }
  // sort: directories first, then leaves; alphabetical within each (zh-aware)
  children.sort((a, b) => {
    const aDir = a.children.length > 0 ? 0 : 1;
    const bDir = b.children.length > 0 ? 0 : 1;
    if (aDir !== bDir) return aDir - bDir;
    return a.name.localeCompare(b.name, "zh-Hans-CN");
  });
  return children;
}

let tree;
try {
  tree = walk(docsDir);
} catch (e) {
  console.error("Failed to read docs directory:", docsDir, e.message);
  process.exit(1);
}

// JSON is inlined inside a <script> tag, so any `</script` inside markdown
// content would prematurely close that tag. Escape the closing slash to
// `<\/script` — the JSON parser round-trips it back to `</script` on read.
const menuJson = JSON.stringify(tree, null, 2).replace(
  /<\/(?=script)/gi,
  "<\\/",
);

let template;
try {
  template = fs.readFileSync(templatePath, "utf-8");
} catch (e) {
  console.error("Failed to read template:", templatePath, e.message);
  process.exit(1);
}

if (!template.includes("$MENU$")) {
  console.warn("Warning: template does not contain $MENU$ placeholder");
}
if (!template.includes("$TITLE$")) {
  console.warn("Warning: template does not contain $TITLE$ placeholder");
}

const result = template
  .replace(/\$MENU\$/g, menuJson)
  .replace(/\$TITLE\$/g, nameArg);

const targetDir = path.join(docsDir, "index.html");

try {
  fs.writeFileSync(targetDir, result, "utf-8");
} catch (e) {
  console.error("Failed to write output:", targetDir, e.message);
  process.exit(1);
}

console.log("Built", targetDir);
console.log("  docs:        ", docsDir);
console.log("  title:       ", nameArg);
console.log("  top-level:   ", tree.length);
