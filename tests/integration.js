// 結合テスト: node tests/integration.js （Playwright が必要）
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const vm = require("vm");
const { execSync } = require("child_process");
const { chromium } = require("playwright");

const root = path.join(__dirname, "..");
let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) pass++; else { fail++; console.log("FAIL: " + name); }
}

// 確認済みを模した一時コピー（元ファイルは変更しない）
function makeFixture() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "latien-"));
  fs.copyFileSync(path.join(root, "index.html"), path.join(tmp, "index.html"));
  fs.cpSync(path.join(root, "css"), path.join(tmp, "css"), { recursive: true });
  fs.cpSync(path.join(root, "js"), path.join(tmp, "js"), { recursive: true });
  fs.appendFileSync(path.join(tmp, "js/data/evidence.js"),
    '\nLATIEN.evidence.forEach(function (e) { if (e.targets.indexOf("w:propose") >= 0) e.verified = "2026-01-01"; });\n');
  return tmp;
}

async function open(page, base, hash) {
  await page.goto("file://" + base + "/index.html");
  await page.evaluate((h) => { location.hash = h; }, hash);
  await page.waitForTimeout(30);
}
const text = (page, sel = "#app") => page.locator(sel).innerText();
const has = (page, sel) => page.locator(sel).count().then((n) => n > 0);

(async () => {
  // ----- ローダー（Node） -----
  {
    const ctx = { console }; vm.createContext(ctx);
    vm.runInContext(fs.readFileSync(path.join(root, "js/data/core.js"), "utf8") + ";this.LATIEN=LATIEN;", ctx);
    const L = ctx.LATIEN;
    L.addMorphemes("x1|root|la|x|x|テスト");
    let threw = false;
    try { L.addMorphemes("x1|root|la|x|x|テスト"); } catch (e) { threw = true; }
    check("loader: 重複IDで例外", threw);
    L.addEvidence([{ target: "w:a", kind: "blend", summary: "s", claims: [], verified: null }, { target: ["w:a", "m:b"], kind: "blend", summary: "s", claims: [] }]);
    check("loader: target が常に配列", L.evidence.every((e) => Array.isArray(e.targets)) && L.evidence[1].targets.length === 2);
  }
  // ----- データファイル -----
  {
    const dir = path.join(root, "js/data");
    let longW = 0, longM = 0;
    for (const f of fs.readdirSync(dir)) {
      if (!/^(words-\d+|morphemes)\.js$/.test(f)) continue;
      const src = fs.readFileSync(path.join(dir, f), "utf8");
      for (const m of src.matchAll(/addMorphemes\(`([\s\S]*?)`\)/g)) for (const l of m[1].split("\n")) if (l.trim() && l.split("|").length > 6) longM++;
      for (const m of src.matchAll(/addWords\(`([\s\S]*?)`\)/g)) for (const l of m[1].split("\n")) if (l.trim() && l.split("|").length > 8) longW++;
    }
    check("5.5-7: 旧注記フィールドが残っていない", longW === 0 && longM === 0);
  }
  check("5.5-2: validate.js が終了コード0", (() => { try { execSync("node " + JSON.stringify(path.join(root, "tools/validate.js")), { stdio: "pipe" }); return true; } catch (e) { return false; } })());

  const fixture = makeFixture();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error" && !/ads\.json/.test(m.text())) errs.push(m.text()); }); // file:// では広告設定の fetch が使えない（無視）

  try {
    // ----- 5.5-1 -----
    for (const w of ["actor", "doctor"]) {
      await open(page, root, "#/w/" + w);
      check(`5.5-1: ${w} の -or が「～する人・もの」`, (await text(page, '#app a.block[href="#/p/or"]')).includes("～する人・もの"));
    }
    await open(page, root, "#/w/mental");
    check("5.5-1: mental の ment が「心」", (await text(page, '#app a.block[href="#/p/mentis"] .b-meaning')) === "心");
    await open(page, root, "#/w/oral");
    check("5.5-1: oral の or が「口」", (await text(page, '#app a.block[href="#/p/oris"] .b-meaning')) === "口");
    await open(page, root, "#/p/or");
    check("5.5-1: #/p/or は接尾辞", (await text(page)).includes("接尾辞"));

    // ----- 5.5-2 -----
    const links = {
      membership: "#/p/membr", article: "#/p/artus", landmark: "#/p/e_mark", advance: "#/p/avant", device: "#/p/dis",
      empathy: "#/p/en_gr", adjust: "#/p/iuxt", perform: "#/p/furn", serve: "#/p/servire", reserve: "#/p/servare",
      note: "#/p/nota", notice: "#/p/nosc", province: "#/p/provinc", noticeable: "#/p/nosc", energy: "#/p/en_gr",
    };
    for (const [w, h] of Object.entries(links)) {
      await open(page, root, "#/w/" + w);
      check(`5.5-2: ${w} → ${h}`, await has(page, `#app a.block[href="${h}"]`));
    }
    await open(page, root, "#/w/advance");
    check("5.5-2: advance に接頭辞 ad のブロックが無い", !(await has(page, '#app a.block[href="#/p/ad"]')));
    await open(page, root, "#/w/archive");
    check("5.5-2: archive に -ive のブロックが無い", !(await has(page, '#app a.block[href="#/p/ive"]')));
    await open(page, root, "#/w/cargo");
    check("5.5-2: cargo はスペイン語経由", (await text(page)).includes("スペイン語経由"));
    for (const w of ["apartment", "corridor", "disaster"]) {
      await open(page, root, "#/w/" + w);
      check(`5.5-2: ${w} はイタリア語経由`, (await text(page)).includes("イタリア語経由"));
    }

    // ----- 5.5-3 / 5.5-5（未確認データ） -----
    const pose = "意味はラテン語 pōnere（置く）、語形は後期ラテン語 pausāre（休む ← ギリシャ語 pausis）に由来します。";
    await open(page, root, "#/w/propose");
    let t = await text(page);
    check("5.5-3: propose に種別ラベル", t.includes("二つの語が合流"));
    check("5.5-3: propose に summary", t.includes(pose));
    for (const w of ["position", "deposit", "component"]) {
      await open(page, root, "#/w/" + w);
      check(`5.5-3: ${w} に注記が無い`, !(await has(page, ".ev")));
    }
    await open(page, root, "#/w/propose");
    t = await text(page);
    check("5.5-5: 未確認なら details が無い", !(await has(page, "details")));
    check("5.5-5: 未確認なら出典が出ない", !t.includes("OED") && !t.includes("s.v."));

    // ----- 5.5-4（確認済みを模した一時コピー） -----
    await open(page, fixture, "#/w/propose");
    check("5.5-4: 「根拠を見る」が見える", (await text(page, "details.ev-claims > summary")).includes("根拠を見る"));
    await page.click("details.ev-claims > summary");
    t = await text(page, "details.ev-claims");
    check("5.5-4: 採用と対立説が表示", t.includes("採用") && t.includes("対立説"));
    check("5.5-4: 出典 OED と TLFi", t.includes("OED") && t.includes("TLFi") && t.includes("s.v."));
    await page.click("details.ev-claims a.ref >> nth=0");
    await page.waitForTimeout(50);
    check("5.5-4: 出典一覧へ移動", (await page.evaluate(() => location.hash)).startsWith("#/sources") && (await text(page)).includes("出典一覧"));

    // ----- 5.5-6 -----
    const r = await page.evaluate(() => {
      const D = LATIEN.debug, out = {};
      for (const w of ["province", "dispatch", "concierge", "interpret", "develop"]) {
        let bad = 0;
        for (let i = 0; i < 200; i++) for (const k of ["part", "mix"]) if (/の原意は？$/.test(D.makeQuestion(D.WORD_MAP[w], k).prompt)) bad++;
        out[w] = bad;
      }
      return out;
    });
    for (const [w, bad] of Object.entries(r)) check(`5.5-6: ${w} の語根が出題されない`, bad === 0);
    await open(page, root, "#/test");
    await page.click('[data-group="kind"] [data-val="part"]');
    await page.click('[data-group="lv"] [data-val="4"]');
    await page.click('[data-group="count"] [data-val="50"]');
    await page.click("#start");
    let asked = 0, leaked = 0;
    while (await has(page, ".question")) {
      const p = await text(page, ".question .prompt");
      asked++;
      if (/province|dispatch|concierge/.test(p)) leaked++;
      await page.click(".choice >> nth=0");
      await page.click("#next");
    }
    check("5.5-6: UI で50問が出題される", asked > 0);
    check("5.5-6: UI 出題に province/dispatch/concierge が無い", leaked === 0);

    // ----- 5.5-7 -----
    const pages = [
      ["mortgage", "「死んだ」の意味を「返済すると誓約が消える」「返せないと土地が失われる」のどちらと解するかには諸説あります。"],
      ["salary", "「塩の代金（塩を買うための手当）」とする説は有力ですが確証はなく、塩の道の警備に対する報酬など他の説もあります。"],
      ["recover", "recuperāre が capere（取る）と同じ語根かどうかは確定していません。"],
      ["average", "古仏 avarie の先はアラビア語 ʿawār（損傷）とする説などがあり、確定していません。"],
      ["delicate", "dēlicātus を dēlicere（誘い込む）と結びつけるのは推定を含みます。"],
      ["fee", "フランク語 fehu（家畜・財産）に由来するとされますが、経路には諸説あります。"],
      ["hazard", "アラビア語 az-zahr（さいころ）に由来するという説が有力ですが、異説もあります。"],
      ["seasonal", "season は satiō（種まき）由来が一般的ですが、statiō（立ち止まる時期）由来とする説もあります。"],
      ["toll", "ギリシャ語 telos（税）が後期ラテン語経由で入ったとする説と、ゲルマン語固有の語とする説があります。"],
      ["consider", "「星（sīdus）」と結びつける説は有力ですが確定ではありません。"],
      ["delicious", "dēlicere との結びつきは推定を含みます。"],
      ["average", "アラビア語起源とする説などがあり、確定していません。"],
      ["bargain", "ゲルマン語起源とされますが詳細は不明です。"],
      ["flaw", "古ノルド語起源は推定です。"],
      ["hazard", "アラビア語 az-zahr（さいころ）説が有力ですが異説もあります。"],
      ["seasonal", "statiō 由来とする説もあります。"],
      ["toll", "ゲルマン語固有の語とする説もあります。"],
      ["adjust", "adiuxtāre"],
      ["trivial", "古典期"],
    ];
    for (const [w, s] of pages) {
      await open(page, root, "#/w/" + w);
      check(`5.5-7: ${w} に「${s.slice(0, 14)}…」`, (await text(page)).includes(s));
    }
    const mig = await page.evaluate(() => {
      const E = LATIEN.evidence;
      const has = (t) => E.some((e) => e.targets.includes(t));
      const ws = ["adjust", "mortgage", "salary", "recover", "trivial", "average", "delicate", "fee", "hazard", "seasonal", "toll"];
      const ms = ["sider", "lic", "avarie", "bargain", "e_flaw", "hasard", "satio", "telos"];
      return {
        missing: [...ws.map((w) => "w:" + w), ...ms.map((m) => "m:" + m)].filter((t) => !has(t)),
        noteProp: LATIEN.words.some((w) => "note" in w) || Object.values(LATIEN.morphemes).some((m) => "note" in m),
        allNull: E.every((e) => e.verified === null),
      };
    });
    check("5.5-7: 19件すべてに evidence がある", mig.missing.length === 0);
    check("5.5-7: note プロパティが残っていない", !mig.noteProp);
    check("本番データの verified は全件 null", mig.allNull);

    // ----- その他の画面 -----
    await open(page, root, "#/sources");
    t = await text(page);
    check("出典一覧に10件", (await page.locator(".sources-list li").count()) === 10 && t.includes("辞書"));
    await open(page, root, "#/sources/OED");
    check("出典一覧: focus 行", (await page.locator("li.focus").count()) === 1);
    await open(page, root, "#/p/pon");
    check("パーツページにも注記は出ない（pon は単語指定）", !(await has(page, ".panel .ev")));
    await open(page, root, "#/p/velop");
    check("パーツページに注記パネル", (await text(page)).includes("語源不詳"));
    await open(page, root, "#/w/develop");
    check("b-note が種別ラベルに連動", (await text(page, "a.block .b-note")).includes("語源不詳"));
    for (const h of ["#/", "#/parts", "#/cards", "#/test"]) await open(page, root, h);
    check("ページエラーが無い", errs.length === 0);
    if (errs.length) console.log(errs.slice(0, 5).join("\n"));
  } finally {
    await browser.close();
    fs.rmSync(fixture, { recursive: true, force: true });
  }
  console.log(`integration: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
