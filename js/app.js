(() => {
  "use strict";

  const app = document.getElementById("app");
  const MORPHEMES = LATIEN.morphemes;
  const WORDS = LATIEN.words;
  const EXAMPLES = LATIEN.examples;
  const TYPE_LABEL = { prefix: "接頭辞", root: "語根", suffix: "接尾辞" };
  const LANG_SHORT = { la: "ラ", fr: "仏", gr: "希", en: "英" };
  const LANG_LABEL = { la: "ラテン語", fr: "フランス語", gr: "ギリシャ語", en: "英語（ゲルマン系）" };
  const VIA_LABEL = { la: "ラテン語から", fr: "フランス語経由", gr: "ギリシャ語から", en: "英語本来の語" };
  const LV_LABEL = { 1: "600", 2: "730", 3: "860", 4: "990" };
  const PAGE = 60;
  const WORD_MAP = Object.fromEntries(WORDS.map((w) => [w.w, w]));
  const SORTED = WORDS.slice().sort((a, b) => a.w.localeCompare(b.w));

  // パーツ id → そのパーツを含む単語
  const BY_MORPHEME = {};
  for (const w of WORDS) {
    for (const [, id] of w.parts) {
      if (id === "_") continue;
      (BY_MORPHEME[id] ||= new Set()).add(w);
    }
  }
  const wordsWith = (id) => [...(BY_MORPHEME[id] || [])];
  const realParts = (w) => w.parts.filter(([, id]) => id !== "_");

  // ---------- 保存（ブラウザ内） ----------
  const STORE_KEY = "latien:v1";
  const state = loadState();
  function loadState() {
    const empty = { starred: [], known: {}, wrong: {} };
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? Object.assign(empty, JSON.parse(raw)) : empty;
    } catch (e) {
      return empty;
    }
  }
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* 保存できなくても動作は続ける */ }
  }
  const isStarred = (w) => state.starred.includes(w);
  function toggleStar(w) {
    state.starred = isStarred(w) ? state.starred.filter((x) => x !== w) : [...state.starred, w];
    saveState();
  }

  // ---------- ユーティリティ ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const pick = (arr, n) => shuffle(arr).slice(0, n);
  const langBadge = (lang) => `<b class="lang ${lang}" title="${LANG_LABEL[lang]}">${LANG_SHORT[lang]}</b>`;
  const lvBadge = (lv) => `<span class="lv lv${lv}" title="TOEIC ${LV_LABEL[lv]}点レベルの目安">${LV_LABEL[lv]}</span>`;
  const wordHref = (w) => `#/w/${encodeURIComponent(w)}`;

  function segWord(parts) {
    return `<span class="seg-word">${parts
      .map(([t, id]) => id === "_"
        ? `<span class="seg conn">${esc(t)}</span>`
        : `<span class="seg ${MORPHEMES[id].type}">${esc(t)}</span>`)
      .join('<span class="hy">-</span>')}</span>`;
  }
  function miniParts(w, withMeaning = true) {
    return `<div class="mini-parts">${realParts(w)
      .map(([t, id]) => {
        const m = MORPHEMES[id];
        return `<span class="mini-part ${m.type}"><b>${esc(t)}</b>${withMeaning ? esc(m.meaning) : ""}</span>`;
      })
      .join("")}</div>`;
  }
  // 例文。見出し語（活用形を含む）を強調する
  function exampleHtml(w, cls = "example") {
    const ex = EXAMPLES[w.w];
    if (!ex) return "";
    const stem = w.w.length > 4 ? w.w.slice(0, -2) : w.w.endsWith("y") ? w.w.slice(0, -1) : w.w;
    const en = ex.en.split(/([A-Za-z']+)/).map((tok) => {
      const t = tok.toLowerCase();
      return t.startsWith(stem) && t.length <= w.w.length + 4 ? `<mark>${esc(tok)}</mark>` : esc(tok);
    }).join("");
    return `<div class="${cls}"><p class="ex-en">${en}</p><p class="ex-ja">${esc(ex.ja)}</p></div>`;
  }
  // 「dis-（離れて）＋ close（閉じる）」のような式
  function formula(w) {
    return realParts(w).map(([t, id]) => `${t}（${MORPHEMES[id].meaning}）`).join(" ＋ ");
  }
  function wordCard(w) {
    return `<a class="card" href="${wordHref(w.w)}">
      <div class="top">${segWord(w.parts)}<span class="marks">${isStarred(w.w) ? '<span class="star-mini" title="単語帳に登録済み">★</span>' : ""}${lvBadge(w.lv)}</span></div>
      <div class="ja">${esc(w.ja)}</div>
    </a>`;
  }
  function chipGroup(name, options, current) {
    return `<div class="chips" data-group="${name}">${options
      .map(([k, l]) => `<button class="chip ${String(k) === String(current) ? "on" : ""}" data-val="${k}">${l}</button>`).join("")}</div>`;
  }
  function bindChips(root, onChange) {
    root.querySelectorAll("[data-group]").forEach((g) => {
      g.addEventListener("click", (e) => {
        const b = e.target.closest("[data-val]");
        if (!b) return;
        g.querySelectorAll("[data-val]").forEach((x) => x.classList.toggle("on", x === b));
        onChange(g.dataset.group, b.dataset.val);
      });
    });
  }
  const LEVEL_CHIPS = [["all", "すべて"], ["1", "〜600"], ["2", "〜730"], ["3", "〜860"], ["4", "〜990"]];
  const byLevel = (list, lv) => (lv === "all" ? list : list.filter((w) => String(w.lv) === lv));

  // ---------- ルーティング ----------
  const routes = [
    [/^#?\/?$/, viewHome],
    [/^#\/w\/(.+)$/, (m) => viewWord(decodeURIComponent(m[1]))],
    [/^#\/parts$/, viewParts],
    [/^#\/p\/(.+)$/, (m) => viewPart(decodeURIComponent(m[1]))],
    [/^#\/cards$/, viewCardsSetup],
    [/^#\/test$/, viewTestSetup],
  ];
  let cleanup = null;
  function render() {
    if (cleanup) { cleanup(); cleanup = null; }
    const hash = location.hash || "#/";
    for (const [re, fn] of routes) {
      const m = hash.match(re);
      if (m) { fn(m); break; }
    }
    const section = hash.startsWith("#/parts") || hash.startsWith("#/p/") ? "parts"
      : hash.startsWith("#/cards") ? "cards"
      : hash.startsWith("#/test") ? "test" : "home";
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === section));
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", render);

  // ---------- 辞書（ホーム） ----------
  const home = { query: "", via: "all", lv: "all", shown: PAGE };
  function viewHome() {
    app.innerHTML = `
      <section class="hero">
        <h1><span class="seg prefix">dis</span><span class="hy">-</span><span class="seg root">close</span></h1>
        <p>英単語をラテン語・フランス語・ギリシャ語のパーツに分解し、<br>それぞれの原意から意味をつかみます。収録 ${WORDS.length.toLocaleString()} 語。</p>
        <div class="search">
          <input id="q" type="search" placeholder="英単語・日本語・パーツの意味で検索（例: disclose, 運ぶ, port）" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(home.query)}">
        </div>
        ${chipGroup("via", [["all", "すべて"], ...Object.keys(VIA_LABEL).map((k) => [k, `${langBadge(k)}${VIA_LABEL[k]}`])], home.via)}
        <div class="chips-label">TOEIC レベル</div>
        ${chipGroup("lv", LEVEL_CHIPS, home.lv)}
      </section>
      <div class="ad-slot" data-ad="home"></div>
      <div class="count" id="count"></div>
      <div id="results"></div>`;
    const q = app.querySelector("#q");
    q.addEventListener("input", () => { home.query = q.value; home.shown = PAGE; updateResults(); });
    q.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const v = q.value.trim().toLowerCase();
        if (WORD_MAP[v]) location.hash = wordHref(v);
      }
    });
    bindChips(app, (k, v) => { home[k] = v; home.shown = PAGE; updateResults(); });
    updateResults();
  }
  function searchWords(query) {
    const qn = query.replace(/-/g, "");
    const starts = [];
    const others = [];
    for (const w of SORTED) {
      if (home.via !== "all" && w.via !== home.via) continue;
      if (home.lv !== "all" && String(w.lv) !== home.lv) continue;
      if (!query) { starts.push(w); continue; }
      if (w.w.startsWith(query)) { starts.push(w); continue; }
      if (w.w.includes(query) || w.ja.includes(query)) { others.push(w); continue; }
      const hit = realParts(w).some(([t, id]) => {
        const m = MORPHEMES[id];
        return m.meaning.includes(query) || t === qn || m.forms.some((f) => f.replace(/-/g, "") === qn);
      });
      if (hit) others.push(w);
    }
    return [...starts, ...others];
  }
  function updateResults() {
    const query = home.query.trim().toLowerCase();
    const list = searchWords(query);
    const results = app.querySelector("#results");
    app.querySelector("#count").textContent = `${list.length.toLocaleString()} 語`;
    let html = "";
    if (list.length) {
      html = `<div class="grid">${list.slice(0, home.shown).map(wordCard).join("")}</div>`;
      if (list.length > home.shown) html += `<div class="btn-row"><button class="btn" id="more">もっと見る（残り ${(list.length - home.shown).toLocaleString()} 語）</button></div>`;
    } else if (/^[a-z]+$/.test(query)) {
      html = guessHtml(query);
    } else {
      html = `<p class="empty">該当する単語がありません。</p>`;
    }
    results.innerHTML = html;
    results.querySelector("#more")?.addEventListener("click", () => { home.shown += PAGE * 2; updateResults(); });
  }

  // 未登録の単語を、既知のパーツから推定して分解する
  const FORMS = {};
  function forms(type) {
    return (FORMS[type] ||= Object.entries(MORPHEMES)
      .filter(([, m]) => m.type === type && m.lang !== "en")
      .flatMap(([id, m]) => m.forms.map((f) => [f.replace(/-/g, ""), id]))
      .filter(([f]) => f.length >= 2)
      .sort((a, b) => b[0].length - a[0].length));
  }
  function guessParts(word) {
    let rest = word;
    const head = [];
    const tail = [];
    for (let k = 0; k < 2; k++) {
      const pre = forms("prefix").find(([f]) => rest.startsWith(f) && rest.length - f.length >= 3);
      if (!pre) break;
      head.push([pre[0], pre[1]]);
      rest = rest.slice(pre[0].length);
    }
    const suf = forms("suffix").find(([f]) => rest.endsWith(f) && rest.length - f.length >= 3);
    if (suf) { tail.push([suf[0], suf[1]]); rest = rest.slice(0, -suf[0].length); }
    const root = forms("root").find(([f]) => rest.includes(f) && f.length >= 3);
    if (!root) return null;
    const i = rest.indexOf(root[0]);
    const mid = [];
    if (i > 0) mid.push([rest.slice(0, i), null]);
    mid.push([root[0], root[1]]);
    if (i + root[0].length < rest.length) mid.push([rest.slice(i + root[0].length), null]);
    return [...head, ...mid, ...tail];
  }
  function guessHtml(word) {
    const parts = guessParts(word);
    if (!parts) return `<p class="empty">「${esc(word)}」は未登録で、既知のパーツも見つかりませんでした。</p>`;
    const blocks = parts.map(([t, id]) => {
      if (!id) return `<div class="block unknown"><span class="b-type">不明</span><span class="b-part">${esc(t)}</span></div>`;
      return blockHtml(t, id);
    }).join('<span class="plus">+</span>');
    return `<div class="panel">
      <p class="guess-note">「${esc(word)}」は未登録です。登録済みのパーツから自動で推定した分解です（参考程度にご覧ください）。</p>
      <div class="breakdown">${blocks}</div>
    </div>`;
  }

  // ---------- 単語詳細 ----------
  function blockHtml(text, id) {
    const m = MORPHEMES[id];
    return `<a class="block ${m.type}" href="#/p/${encodeURIComponent(id)}">
      <span class="b-type">${TYPE_LABEL[m.type]} ${langBadge(m.lang)}</span>
      <span class="b-part">${esc(text)}</span>
      <span class="b-origin">${esc(m.origin)}</span>
      <span class="b-meaning">${esc(m.meaning)}</span>
    </a>`;
  }
  function viewWord(name) {
    const w = WORD_MAP[name];
    if (!w) {
      app.innerHTML = `<a class="back" href="#/">← 辞書に戻る</a>${guessHtml(name.toLowerCase().replace(/[^a-z]/g, ""))}`;
      return;
    }
    const seen = new Set();
    const related = realParts(w)
      .filter(([, id]) => !seen.has(id) && seen.add(id))
      .map(([t, id]) => {
        const others = wordsWith(id).filter((x) => x.w !== w.w);
        if (!others.length) return "";
        const m = MORPHEMES[id];
        const shown = others.slice(0, 24);
        const more = others.length > shown.length
          ? `<a class="word-link more" href="#/p/${encodeURIComponent(id)}">ほか ${others.length - shown.length} 語 →</a>` : "";
        return `<h3><span class="mini-part ${m.type}"><b>${esc(t)}</b>${esc(m.meaning)}</span> を含む単語（${others.length}）</h3>
          <div class="word-links">${shown.map((o) => `<a class="word-link" href="${wordHref(o.w)}">${esc(o.w)}</a>`).join("")}${more}</div>`;
      }).join("");
    const conns = w.parts.filter(([, id]) => id === "_").map(([t]) => t);
    app.innerHTML = `
      <a class="back" href="#/">← 辞書に戻る</a>
      <div class="detail-head">
        <div>
          <h1>${segWord(w.parts)}</h1>
          <div class="ja"><span class="pos">${esc(w.pos)}</span>${esc(w.ja)} ${lvBadge(w.lv)}</div>
        </div>
        <button class="star ${isStarred(w.w) ? "on" : ""}" id="star">${isStarred(w.w) ? "★ 単語帳に登録済み" : "☆ 単語帳に追加"}</button>
      </div>
      <div class="breakdown">${realParts(w).map(([t, id]) => blockHtml(t, id)).join('<span class="plus">+</span>')}</div>
      ${conns.length ? `<p class="conn-note">灰色の「${conns.map(esc).join("」「")}」は発音や綴りを整えるつなぎの文字です。</p>` : ""}
      <div class="panel"><h3>原意から読む</h3>
        <p class="formula-line">${esc(formula(w))}</p>
        ${w.logic ? `<p class="logic">→ ${esc(w.logic)}</p>` : ""}
      </div>
      ${EXAMPLES[w.w] ? `<div class="panel"><h3>例文</h3>${exampleHtml(w)}</div>` : ""}
      <div class="ad-slot" data-ad="word"></div>
      <div class="panel"><h3>語源の経路 ${langBadge(w.via)} ${VIA_LABEL[w.via]}</h3>${w.route ? `<p class="route">${esc(w.route)}</p>` : ""}</div>
      <section class="related">${related}</section>`;
    app.querySelector("#star").addEventListener("click", (e) => {
      toggleStar(w.w);
      const on = isStarred(w.w);
      e.currentTarget.classList.toggle("on", on);
      e.currentTarget.textContent = on ? "★ 単語帳に登録済み" : "☆ 単語帳に追加";
    });
  }

  // ---------- パーツ一覧 ----------
  const partsOpt = { lang: "all" };
  function viewParts() {
    app.innerHTML = `<h1 class="page-title">パーツ一覧</h1>
      <p class="lead">同じパーツを持つ単語をまとめて覚えると、初めて見る単語も推測できるようになります。</p>
      ${chipGroup("lang", [["all", "すべて"], ...Object.keys(LANG_LABEL).map((k) => [k, `${langBadge(k)}${LANG_LABEL[k]}`])], partsOpt.lang)}
      <div id="groups"></div>`;
    const draw = () => {
      app.querySelector("#groups").innerHTML = ["prefix", "root", "suffix"].map((type) => {
        const items = Object.entries(MORPHEMES)
          .filter(([, m]) => m.type === type && (partsOpt.lang === "all" || m.lang === partsOpt.lang))
          .map(([id, m]) => ({ id, m, n: wordsWith(id).length }))
          .filter((x) => x.n > 0)
          .sort((a, b) => b.n - a.n);
        if (!items.length) return "";
        return `<h2>${TYPE_LABEL[type]}（${items.length}）</h2>
          <div class="parts-grid">${items.map(({ id, m, n }) => `
            <a class="card part-card ${type}" href="#/p/${encodeURIComponent(id)}">
              <div class="top"><span class="forms">${esc(m.forms.join(" "))}</span>${langBadge(m.lang)}</div>
              <div class="origin">${esc(m.origin)}</div>
              <div class="meaning">${esc(m.meaning)}</div>
              <div class="n">${n} 語</div>
            </a>`).join("")}</div>`;
      }).join("");
    };
    bindChips(app, (k, v) => { partsOpt[k] = v; draw(); });
    draw();
  }
  function viewPart(id) {
    const m = MORPHEMES[id];
    if (!m) { app.innerHTML = `<p class="empty">パーツが見つかりません。</p>`; return; }
    const list = wordsWith(id).sort((a, b) => a.lv - b.lv || a.w.localeCompare(b.w));
    app.innerHTML = `
      <a class="back" href="#/parts">← パーツ一覧に戻る</a>
      <div class="breakdown">${blockHtml(m.forms.join(" / "), id)}</div>
      <h2>このパーツを含む単語（${list.length} 語）</h2>
      <div class="grid">${list.map(wordCard).join("")}</div>`;
  }

  // ---------- 対象範囲 ----------
  const SCOPES = [
    ["all", "すべて"],
    ["starred", "マイ単語帳"],
    ["unknown", "未習得"],
    ["wrong", "苦手"],
  ];
  function scopeWords(scope, lv) {
    let list = WORDS;
    if (scope === "starred") list = WORDS.filter((w) => isStarred(w.w));
    else if (scope === "unknown") list = WORDS.filter((w) => !state.known[w.w]);
    else if (scope === "wrong") list = WORDS.filter((w) => state.wrong[w.w] > 0);
    return byLevel(list, lv);
  }
  function statsHtml() {
    const known = WORDS.filter((w) => state.known[w.w]).length;
    const wrong = WORDS.filter((w) => state.wrong[w.w] > 0).length;
    return `<div class="stats">
      <div class="stat"><b>${WORDS.length.toLocaleString()}</b><span>収録語数</span></div>
      <div class="stat"><b>${state.starred.length}</b><span>マイ単語帳</span></div>
      <div class="stat"><b>${known}</b><span>覚えた</span></div>
      <div class="stat"><b>${wrong}</b><span>苦手（テストで間違えた）</span></div>
    </div>`;
  }

  // ---------- 単語帳（フラッシュカード） ----------
  const cardOpt = { scope: "all", lv: "1", order: "shuffle", face: "en", size: "30" };
  function viewCardsSetup() {
    const starList = state.starred.map((w) => WORD_MAP[w]).filter(Boolean);
    app.innerHTML = `
      <h1 class="page-title">単語帳</h1>
      <p class="lead">カードをめくって、パーツの原意から意味を思い出す練習をします。</p>
      ${statsHtml()}
      <div class="panel settings">
        <div class="setting"><label class="t">範囲</label>${chipGroup("scope", SCOPES, cardOpt.scope)}</div>
        <div class="setting"><label class="t">TOEIC レベル</label>${chipGroup("lv", LEVEL_CHIPS, cardOpt.lv)}</div>
        <div class="setting"><label class="t">枚数</label>${chipGroup("size", [["10", "10枚"], ["30", "30枚"], ["50", "50枚"], ["all", "全部"]], cardOpt.size)}</div>
        <div class="setting"><label class="t">順番</label>${chipGroup("order", [["shuffle", "ランダム"], ["list", "語根ごと"]], cardOpt.order)}</div>
        <div class="setting"><label class="t">表面</label>${chipGroup("face", [["en", "英単語 → 意味"], ["ja", "意味 → 英単語"]], cardOpt.face)}</div>
        <div class="btn-row" style="justify-content:flex-start;margin-top:4px">
          <button class="btn primary" id="start">はじめる</button>
          <span class="muted" id="n" style="align-self:center"></span>
        </div>
      </div>
      <h2>マイ単語帳（${starList.length} 語）</h2>
      ${starList.length ? `<div class="grid">${starList.map(wordCard).join("")}</div>`
        : `<p class="muted">単語の詳細ページで「☆ 単語帳に追加」を押すと、ここに登録されます。</p>`}
      <div class="btn-row" style="justify-content:flex-start">
        <button class="btn" id="reset">覚えた記録をリセット</button>
      </div>`;
    const deckSize = (n) => (cardOpt.size === "all" ? n : Math.min(n, Number(cardOpt.size)));
    const updateN = () => {
      const n = scopeWords(cardOpt.scope, cardOpt.lv).length;
      app.querySelector("#n").textContent = n ? `対象 ${n.toLocaleString()} 語から ${deckSize(n)} 枚` : "対象の単語がありません";
      app.querySelector("#start").disabled = n === 0;
    };
    bindChips(app, (k, v) => { cardOpt[k] = v; updateN(); });
    updateN();
    app.querySelector("#start").addEventListener("click", () => {
      const base = scopeWords(cardOpt.scope, cardOpt.lv);
      const n = deckSize(base.length);
      if (cardOpt.order === "shuffle") return runCards(shuffle(base).slice(0, n));
      // 語根ごと: 連続した範囲をランダムな位置から取り出す
      const start = Math.floor(Math.random() * Math.max(1, base.length - n + 1));
      runCards(base.slice(start, start + n));
    });
    app.querySelector("#reset").addEventListener("click", () => {
      if (!confirm("「覚えた」の記録をすべて消しますか？")) return;
      state.known = {};
      saveState();
      viewCardsSetup();
    });
  }

  function runCards(deck) {
    let i = 0;
    let flipped = false;
    let hint = false;
    const results = [];
    const draw = () => {
      if (i >= deck.length) return finish();
      const w = deck[i];
      const front = cardOpt.face === "en"
        ? `${segWord(w.parts)}${hint ? miniParts(w) : '<span class="hint">パーツの原意から意味を考えてみよう</span>'}`
        : `<div class="answer">${esc(w.ja)}</div>${hint ? miniParts(w) : '<span class="hint">どんなパーツの組み合わせ？</span>'}`;
      const back = `${segWord(w.parts)}
        <div class="answer">${esc(w.ja)}</div>
        ${miniParts(w)}
        ${w.logic ? `<p class="logic">${esc(w.logic)}</p>` : ""}
        ${exampleHtml(w, "example compact")}`;
      app.innerHTML = `
        <a class="back" href="#/cards">← 単語帳の設定に戻る</a>
        <div class="q-meta"><span>${i + 1} / ${deck.length}</span><span>${isStarred(w.w) ? "★ マイ単語帳" : ""} ${lvBadge(w.lv)}</span></div>
        <div class="progress"><i style="width:${(i / deck.length) * 100}%"></i></div>
        <div class="flash" id="flash" role="button" tabindex="0" aria-label="カードをめくる">
          ${flipped ? back : front}
          <span class="tap">${flipped ? "" : "タップでめくる"}</span>
        </div>
        <div class="btn-row">
          ${flipped
            ? `<button class="btn ng" id="again">まだ</button><button class="btn ok" id="got">覚えた</button>`
            : `<button class="btn" id="hint" ${hint ? "disabled" : ""}>ヒント（パーツの意味）</button><button class="btn primary" id="flip">めくる</button>`}
          <button class="btn" id="starc" title="マイ単語帳">${isStarred(w.w) ? "★" : "☆"}</button>
        </div>
        <p class="kbd">キー操作: Space めくる / ← まだ / → 覚えた / H ヒント</p>`;
      const doFlip = () => { flipped = true; draw(); };
      app.querySelector("#flash").addEventListener("click", () => { if (!flipped) doFlip(); });
      app.querySelector("#flip")?.addEventListener("click", doFlip);
      app.querySelector("#hint")?.addEventListener("click", () => { hint = true; draw(); });
      app.querySelector("#again")?.addEventListener("click", () => answer(false));
      app.querySelector("#got")?.addEventListener("click", () => answer(true));
      app.querySelector("#starc").addEventListener("click", () => { toggleStar(w.w); draw(); });
    };
    const answer = (ok) => {
      const w = deck[i];
      if (ok) state.known[w.w] = true; else delete state.known[w.w];
      saveState();
      results.push([w, ok]);
      i++; flipped = false; hint = false;
      draw();
    };
    const finish = () => {
      document.removeEventListener("keydown", onKey);
      const again = results.filter(([, ok]) => !ok).map(([w]) => w);
      app.innerHTML = `
        <div class="score"><b>${results.length - again.length} / ${results.length}</b><span class="muted">覚えた枚数</span></div>
        <div class="ad-slot" data-ad="result"></div>
        <div class="btn-row">
          ${again.length ? `<button class="btn primary" id="retry">「まだ」の ${again.length} 枚をもう一度</button>` : ""}
          <a class="btn" href="#/cards" style="text-decoration:none">設定に戻る</a>
        </div>
        ${again.length ? `<h2>もう一度確認したい単語</h2><div class="grid">${again.map(wordCard).join("")}</div>` : ""}`;
      app.querySelector("#retry")?.addEventListener("click", () => runCards(shuffle(again)));
    };
    const onKey = (e) => {
      if (e.target.matches("input, textarea")) return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); if (!flipped) { flipped = true; draw(); } }
      else if (e.key === "ArrowLeft" && flipped) answer(false);
      else if (e.key === "ArrowRight" && flipped) answer(true);
      else if ((e.key === "h" || e.key === "H") && !flipped) { hint = true; draw(); }
    };
    document.addEventListener("keydown", onKey);
    cleanup = () => document.removeEventListener("keydown", onKey);
    draw();
  }

  // ---------- テスト ----------
  const testOpt = { scope: "all", lv: "1", count: "10", kind: "mix" };
  const KINDS = [
    ["mix", "ミックス"],
    ["meaning", "単語 → 意味"],
    ["word", "原意 → 単語"],
    ["part", "パーツの原意"],
  ];
  function viewTestSetup() {
    app.innerHTML = `
      <h1 class="page-title">テスト</h1>
      <p class="lead">4択問題で、パーツと意味のつながりを確認します。間違えた単語は「苦手」に記録されます。</p>
      ${statsHtml()}
      <div class="panel settings">
        <div class="setting"><label class="t">出題形式</label>${chipGroup("kind", KINDS, testOpt.kind)}</div>
        <div class="setting"><label class="t">範囲</label>${chipGroup("scope", SCOPES, testOpt.scope)}</div>
        <div class="setting"><label class="t">TOEIC レベル</label>${chipGroup("lv", LEVEL_CHIPS, testOpt.lv)}</div>
        <div class="setting"><label class="t">問題数</label>${chipGroup("count", [["10", "10問"], ["20", "20問"], ["50", "50問"]], testOpt.count)}</div>
        <div class="btn-row" style="justify-content:flex-start;margin-top:4px">
          <button class="btn primary" id="start">スタート</button>
          <span class="muted" id="n" style="align-self:center"></span>
        </div>
      </div>
      <div class="panel">
        <h3>出題形式について</h3>
        <p>・<b>単語 → 意味</b>：分解された英単語を見て、日本語の意味を選ぶ<br>
           ・<b>原意 → 単語</b>：パーツの原意の組み合わせから、英単語を選ぶ<br>
           ・<b>パーツの原意</b>：単語の中のパーツが元々どんな意味だったかを選ぶ</p>
      </div>`;
    const updateN = () => {
      const n = scopeWords(testOpt.scope, testOpt.lv).length;
      app.querySelector("#n").textContent = n ? `対象 ${n.toLocaleString()} 語` : "対象の単語がありません";
      app.querySelector("#start").disabled = n === 0;
    };
    bindChips(app, (k, v) => { testOpt[k] = v; updateN(); });
    updateN();
    app.querySelector("#start").addEventListener("click", () => {
      const pool = scopeWords(testOpt.scope, testOpt.lv);
      const n = Math.min(Number(testOpt.count), pool.length);
      runTest(shuffle(pool).slice(0, n).map((w) => makeQuestion(w, testOpt.kind)));
    });
  }

  // 同じパーツ・同じレベルの単語を優先して紛らわしい選択肢を作る
  function distractorWords(w, n) {
    const similar = new Set();
    for (const [, id] of realParts(w)) {
      if (MORPHEMES[id].type !== "root") continue;
      for (const x of wordsWith(id)) if (x.w !== w.w && x.ja !== w.ja) similar.add(x);
    }
    const sim = pick([...similar], 2);
    const usedJa = new Set([w.ja, ...sim.map((x) => x.ja)]);
    const out = [...sim];
    for (const x of shuffle(WORDS.filter((x) => x.lv === w.lv))) {
      if (out.length >= n) break;
      if (x.w === w.w || usedJa.has(x.ja) || out.includes(x)) continue;
      usedJa.add(x.ja);
      out.push(x);
    }
    return out.slice(0, n);
  }
  function makeQuestion(w, kind) {
    const k = kind === "mix" ? pick(["meaning", "word", "part"], 1)[0] : kind;
    if (k === "meaning") {
      const opts = shuffle([w, ...distractorWords(w, 3)]);
      return {
        w, prompt: "この単語の意味は？",
        body: segWord(w.parts), // パーツの原意は答え合わせ時のみ表示
        choices: opts.map((o) => ({ label: o.ja, ok: o === w })), en: false,
      };
    }
    if (k === "word") {
      const f = realParts(w).map(([, id]) => MORPHEMES[id].meaning).join(" ＋ ");
      const opts = shuffle([w, ...distractorWords(w, 3)]);
      return {
        w, prompt: "この原意の組み合わせでできた単語は？",
        body: `<div class="formula">${esc(f)}</div><div class="muted" style="margin-top:6px">意味: ${esc(w.ja)}</div>`,
        choices: opts.map((o) => ({ label: o.w, ok: o === w })), en: true,
      };
    }
    // part: 語根を優先して出題
    const rp = realParts(w);
    const [text, id] = rp.find((p) => MORPHEMES[p[1]].type === "root") || rp[0];
    const m = MORPHEMES[id];
    const wrongs = shuffle(Object.values(MORPHEMES).filter((x) => x.meaning !== m.meaning && x.type === m.type))
      .map((x) => x.meaning)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 3);
    const highlighted = `<span class="seg-word">${w.parts.map(([t, pid]) =>
      pid === id ? `<span class="seg ${m.type}" style="text-decoration:underline">${esc(t)}</span>` : `<span class="muted">${esc(t)}</span>`
    ).join('<span class="hy">-</span>')}</span>`;
    return {
      w, prompt: `${w.w} の「${text}」の原意は？`,
      body: `${highlighted}<div class="muted" style="margin-top:6px">${TYPE_LABEL[m.type]} ${langBadge(m.lang)} ${esc(m.origin)}</div>`,
      choices: shuffle([{ label: m.meaning, ok: true }, ...wrongs.map((x) => ({ label: x, ok: false }))]), en: false,
    };
  }

  function runTest(qs) {
    let i = 0;
    let answered = false;
    const log = [];
    const draw = () => {
      if (i >= qs.length) return finish();
      const q = qs[i];
      answered = false;
      app.innerHTML = `
        <a class="back" href="#/test">← テストをやめる</a>
        <div class="q-meta"><span>第 ${i + 1} 問 / ${qs.length}</span><span>正解 ${log.filter((x) => x.ok).length}</span></div>
        <div class="progress"><i style="width:${(i / qs.length) * 100}%"></i></div>
        <div class="question">
          <div class="prompt">${esc(q.prompt)}</div>
          ${q.body}
        </div>
        <div class="choices">${q.choices.map((c, j) =>
          `<button class="choice ${q.en ? "en" : ""}" data-i="${j}"><span class="muted">${j + 1}.</span> ${esc(c.label)}</button>`).join("")}</div>
        <div id="fb"></div>
        <p class="kbd">キー操作: 1〜4 で選択 / Enter で次へ</p>`;
      app.querySelectorAll(".choice").forEach((b) => b.addEventListener("click", () => choose(Number(b.dataset.i))));
    };
    const choose = (j) => {
      const q = qs[i];
      if (answered || !q.choices[j]) return;
      answered = true;
      const ok = q.choices[j].ok;
      app.querySelectorAll(".choice").forEach((b, k) => {
        b.disabled = true;
        if (q.choices[k].ok) b.classList.add("correct");
        else if (k === j) b.classList.add("wrong");
      });
      if (ok) {
        if (state.wrong[q.w.w]) state.wrong[q.w.w] -= 1;
        if (!state.wrong[q.w.w]) delete state.wrong[q.w.w];
      } else {
        state.wrong[q.w.w] = (state.wrong[q.w.w] || 0) + 1;
      }
      saveState();
      log.push({ q, ok });
      app.querySelector("#fb").innerHTML = `
        <div class="feedback">
          <div class="res ${ok ? "ok" : "ng"}">${ok ? "正解！" : "不正解"}</div>
          <div>${segWord(q.w.parts)} <span>${esc(q.w.ja)}</span></div>
          <p style="margin:6px 0 0">${esc(formula(q.w))}${q.w.logic ? `<br>→ ${esc(q.w.logic)}` : ""}</p>
          ${exampleHtml(q.w, "example compact")}
        </div>
        <div class="btn-row"><button class="btn primary" id="next">${i + 1 < qs.length ? "次の問題へ" : "結果を見る"}</button></div>`;
      app.querySelector("#next").addEventListener("click", next);
      app.querySelector("#next").focus();
    };
    const next = () => { i++; draw(); };
    const finish = () => {
      document.removeEventListener("keydown", onKey);
      const score = log.filter((x) => x.ok).length;
      const wrongWords = [...new Set(log.filter((x) => !x.ok).map((x) => x.q.w))];
      app.innerHTML = `
        <div class="score"><b>${score} / ${log.length}</b><span class="muted">正答率 ${Math.round((score / log.length) * 100)}%</span></div>
        <div class="ad-slot" data-ad="result"></div>
        <div class="btn-row">
          ${wrongWords.length ? `<button class="btn primary" id="retry">間違えた ${wrongWords.length} 語でもう一度</button>` : ""}
          <a class="btn" href="#/test" style="text-decoration:none">設定に戻る</a>
        </div>
        <h2>ふりかえり</h2>
        <ul class="review-list">${log.map(({ q, ok }) => `
          <li><span class="mark ${ok ? "ok" : "ng"}">${ok ? "○" : "×"}</span>
            <a href="${wordHref(q.w.w)}">${esc(q.w.w)}</a>
            <span class="muted">— ${esc(q.prompt)} → ${esc(q.choices.find((c) => c.ok).label)}</span></li>`).join("")}</ul>`;
      app.querySelector("#retry")?.addEventListener("click", () =>
        runTest(shuffle(wrongWords).map((w) => makeQuestion(w, testOpt.kind))));
    };
    const onKey = (e) => {
      if (!answered && /^[1-4]$/.test(e.key)) choose(Number(e.key) - 1);
      else if (answered && e.key === "Enter" && document.activeElement?.id !== "next") next();
    };
    document.addEventListener("keydown", onKey);
    cleanup = () => document.removeEventListener("keydown", onKey);
    draw();
  }

  render();
  if (typeof LatienAds !== "undefined") LatienAds.load();
})();
