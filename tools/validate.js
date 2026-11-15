#!/usr/bin/env node
// データ検証ツール。エラーが1件でもあれば終了コード1
// 使い方: node tools/validate.js [--verbose]
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dir = path.join(__dirname, "..", "js", "data");
const verbose = process.argv.includes("--verbose");
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);

// 検証用スタブ: 重複しても投げずにすべて記録する
const morphLines = []; // { id, type, forms, file, line }
const words = [];
const sources = [];
const evidence = [];
let currentFile = "";
const LATIEN = {
  addMorphemes(text) {
    text.split("\n").forEach((line, i) => {
      if (!line.trim()) return;
      const f = line.split("|");
      if (f.length > 6) err(`${currentFile}: パーツ行が6フィールドを超えています: ${f[0]}`);
      morphLines.push({ id: f[0], type: f[1], forms: (f[3] || "").split(","), file: currentFile, line: i + 1 });
    });
  },
  addWords(text) {
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      const f = line.split("|");
      if (f.length > 8) err(`${currentFile}: 単語行が8フィールドを超えています: ${f[0]}`);
      words.push({
        w: f[0], via: f[5],
        parts: (f[3] || "").split("+").map((p) => { const [t, id] = p.split(":"); return [t, id === undefined ? t : id]; }),
      });
    }
  },
  addSources(text) {
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      const [id, type] = line.split("|");
      sources.push({ id, type });
    }
  },
  addEvidence(list) { evidence.push(...list); },
  addExamples() {},
};

const files = fs.readdirSync(dir)
  .filter((f) => /^(morphemes|words-\d+|sources|evidence)\.js$/.test(f))
  .sort();
for (const f of files) {
  currentFile = f;
  vm.runInNewContext(fs.readFileSync(path.join(dir, f), "utf8"), { LATIEN });
}

// パーツ ID の重複
const defs = new Map();
for (const m of morphLines) {
  if (defs.has(m.id)) {
    const o = defs.get(m.id);
    err(`パーツIDが重複しています: ${m.id}（${o.file}:${o.line} と ${m.file}:${m.line}）`);
  } else defs.set(m.id, m);
}
// 出典
const srcIds = new Set();
for (const s of sources) {
  if (!["paper", "dictionary", "primary"].includes(s.type)) err(`出典 ${s.id}: 種別が不正です（${s.type}）`);
  if (srcIds.has(s.id)) err(`出典IDが重複しています: ${s.id}`);
  srcIds.add(s.id);
}
// 単語
const wordSet = new Set(words.map((w) => w.w));
const forms = new Map([...defs].map(([id, m]) => [id, m.forms.map((x) => x.replace(/-/g, ""))]));
let formWarn = 0;
for (const w of words) {
  const cat = w.parts.map((p) => p[0]).join("");
  if (cat !== w.w) err(`単語 ${w.w}: パーツの綴りを連結すると「${cat}」になります`);
  for (const [t, id] of w.parts) {
    if (id === "_") continue;
    if (!defs.has(id)) { err(`単語 ${w.w}: 未定義のパーツID「${id}」`); continue; }
    if (!forms.get(id).includes(t)) {
      formWarn++;
      warnings.push(`単語 ${w.w}: 綴り「${t}」がパーツ ${id} の形に載っていません`);
    }
  }
}
// 論拠
const KINDS = ["disputed", "uncertain", "blend", "spelling"];
const STANCES = ["adopted", "alternative", "rejected"];
let unverified = 0;
evidence.forEach((e, i) => {
  const name = `evidence[${i}] ${JSON.stringify(e.target)}`;
  const targets = Array.isArray(e.target) ? e.target : [e.target];
  const mTargets = [];
  for (const t of targets) {
    if (typeof t !== "string" || !/^[wm]:/.test(t)) { err(`${name}: target の形式が不正です（${t}）`); continue; }
    const k = t.slice(2);
    if (t[0] === "w" && !wordSet.has(k)) err(`${name}: 未定義の単語 ${k}`);
    if (t[0] === "m") { if (!defs.has(k)) err(`${name}: 未定義のパーツ ${k}`); else mTargets.push(k); }
  }
  if (!KINDS.includes(e.kind)) err(`${name}: kind が不正です（${e.kind}）`);
  if (!e.summary) err(`${name}: summary がありません`);
  if (!Array.isArray(e.claims) || !e.claims.length) err(`${name}: claims がありません`);
  for (const c of e.claims || []) {
    if (!STANCES.includes(c.stance)) err(`${name}: stance が不正です（${c.stance}）`);
    if (!Array.isArray(c.refs) || !c.refs.length) err(`${name}: refs の無い claim があります`);
    for (const r of c.refs || []) if (!srcIds.has(r.src)) err(`${name}: 未定義の出典 ${r.src}`);
  }
  if (e.verified === null) unverified++;
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(e.verified || "")) err(`${name}: verified は null か YYYY-MM-DD にしてください`);
  for (const f of e.forms || []) {
    const hit = words.some((w) => w.parts.some(([t, id]) => t === f && mTargets.includes(id)));
    if (!hit) err(`${name}: forms の「${f}」がどの単語にも現れません`);
  }
});

for (const m of errors) console.error("ERROR: " + m);
if (verbose) for (const m of warnings) console.log("WARN: " + m);
console.log(`validate: ${words.length} words, ${defs.size} morphemes, ${sources.length} sources, ${evidence.length} evidence | errors ${errors.length}, warnings ${formWarn}${verbose ? "" : "（--verbose で表示）"}, unverified ${unverified}`);
process.exit(errors.length ? 1 : 0);
