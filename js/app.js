(() => {
  "use strict";

  const app = document.getElementById("app");
  const TYPE_LABEL = { prefix: "接頭辞", root: "語根", suffix: "接尾辞" };
  const LANG_SHORT = { la: "ラ", fr: "仏", gr: "希" };
  const LANG_LABEL = { la: "ラテン語", fr: "フランス語", gr: "ギリシャ語" };
  const VIA_LABEL = { la: "ラテン語から", fr: "フランス語経由", gr: "ギリシャ語から" };
  const WORD_MAP = Object.fromEntries(WORDS.map((w) => [w.w, w]));

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
  const wordsWith = (mid) => WORDS.filter((w) => w.parts.some((p) => p[1] === mid));

  function segWord(parts) {
    return `<span class="seg-word">${parts
      .map(([t, mid]) => `<span class="seg ${MORPHEMES[mid].type}">${esc(t)}</span>`)
      .join('<span class="hy">-</span>')}</span>`;
  }
  function miniParts(parts, withMeaning = true) {
    return `<div class="mini-parts">${parts
      .map(([t, mid]) => {
        const m = MORPHEMES[mid];
        return `<span class="mini-part ${m.type}"><b>${esc(t)}</b>${withMeaning ? esc(m.meaning) : ""}</span>`;
      })
      .join("")}</div>`;
  }
  function wordCard(w) {
    return `<a class="card" href="#/w/${encodeURIComponent(w.w)}">
      <div class="top">${segWord(w.parts)}${isStarred(w.w) ? '<span class="star-mini" title="単語帳に登録済み">★</span>' : ""}</div>
      <div class="ja">${esc(w.ja)}</div>
    </a>`;
  }

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
  let homeQuery = "";
  let homeVia = "all";
  function viewHome() {
    app.innerHTML = `
      <section class="hero">
        <h1><span class="seg prefix">dis</span><span class="hy">-</span><span class="seg root">close</span></h1>
        <p>英単語をラテン語・フランス語・ギリシャ語のパーツに分解し、<br>それぞれの原意から意味をつかみます。</p>
        <div class="search">
          <input id="q" type="search" placeholder="英単語・日本語・パーツの意味で検索（例: disclose, 運ぶ）" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(homeQuery)}">
        </div>
        <div class="chips" id="via">
          ${[["all", "すべて"], ["la", "ラテン語から"], ["fr", "フランス語経由"], ["gr", "ギリシャ語から"]]
            .map(([k, l]) => `<button class="chip ${homeVia === k ? "on" : ""}" data-via="${k}">${k !== "all" ? langBadge(k) : ""}${l}</button>`).join("")}
        </div>
      </section>
      <div class="count" id="count"></div>
      <div id="results"></div>`;
    const q = app.querySelector("#q");
    q.addEventListener("input", () => { homeQuery = q.value; updateResults(); });
    q.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const v = q.value.trim().toLowerCase();
        if (WORD_MAP[v]) location.hash = `#/w/${encodeURIComponent(v)}`;
      }
    });
    app.querySelector("#via").addEventListener("click", (e) => {
      const b = e.target.closest("[data-via]");
      if (!b) return;
      homeVia = b.dataset.via;
      app.querySelectorAll("[data-via]").forEach((x) => x.classList.toggle("on", x === b));
      updateResults();
    });
    updateResults();
  }
  function updateResults() {
    const query = homeQuery.trim().toLowerCase();
    const list = WORDS.filter((w) => {
      if (homeVia !== "all" && w.via !== homeVia) return false;
      if (!query) return true;
      if (w.w.includes(query) || w.ja.includes(query)) return true;
      return w.parts.some(([, mid]) => {
        const m = MORPHEMES[mid];
        return m.meaning.includes(query) || m.forms.some((f) => f.replace(/-/g, "") === query.replace(/-/g, ""));
      });
    });
    const results = app.querySelector("#results");
    app.querySelector("#count").textContent = `${list.length} 語`;
    let html = list.length ? `<div class="grid">${list.map(wordCard).join("")}</div>` : "";
    if (!list.length && /^[a-z]+$/.test(query)) html += guessHtml(query);
    else if (!list.length) html = `<p class="empty">該当する単語がありません。</p>`;
    results.innerHTML = html;
  }

  // 未登録の単語を、既知のパーツから推定して分解する
  function guessParts(word) {
    const forms = (type) => Object.entries(MORPHEMES)
      .filter(([, m]) => m.type === type)
      .flatMap(([id, m]) => m.forms.map((f) => [f.replace(/-/g, ""), id]))
      .filter(([f]) => f.length >= 2)
      .sort((a, b) => b[0].length - a[0].length);
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
    const blocks = parts.map(([t, mid]) => {
      if (!mid) return `<div class="block" style="background:var(--surface-2);color:var(--muted)"><span class="b-type">不明</span><span class="b-part">${esc(t)}</span></div>`;
      return blockHtml(t, mid);
    }).join('<span class="plus">+</span>');
    return `<div class="panel">
      <p class="guess-note">「${esc(word)}」は未登録です。登録済みのパーツから自動で推定した分解です（参考程度にご覧ください）。</p>
      <div class="breakdown">${blocks}</div>
    </div>`;
  }

  // ---------- 単語詳細 ----------
  function blockHtml(text, mid) {
    const m = MORPHEMES[mid];
    return `<a class="block ${m.type}" href="#/p/${encodeURIComponent(mid)}">
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
    const related = w.parts
      .filter(([, mid], i, arr) => arr.findIndex((p) => p[1] === mid) === i)
      .map(([t, mid]) => {
        const others = wordsWith(mid).filter((x) => x.w !== w.w);
        if (!others.length) return "";
        const m = MORPHEMES[mid];
        return `<h3><span class="mini-part ${m.type}"><b>${esc(t)}</b>${esc(m.meaning)}</span> を含む単語</h3>
          <div class="word-links">${others.map((o) => `<a class="word-link" href="#/w/${encodeURIComponent(o.w)}">${esc(o.w)}</a>`).join("")}</div>`;
      }).join("");
    app.innerHTML = `
      <a class="back" href="#/">← 辞書に戻る</a>
      <div class="detail-head">
        <div>
          <h1>${segWord(w.parts)}</h1>
          <div class="ja"><span class="pos">${esc(w.pos)}</span>${esc(w.ja)}</div>
        </div>
        <button class="star ${isStarred(w.w) ? "on" : ""}" id="star">${isStarred(w.w) ? "★ 単語帳に登録済み" : "☆ 単語帳に追加"}</button>
      </div>
      <div class="breakdown">${w.parts.map(([t, mid]) => blockHtml(t, mid)).join('<span class="plus">+</span>')}</div>
      <div class="panel"><h3>原意から読む</h3><p class="logic">${esc(w.logic)}</p></div>
      <div class="panel"><h3>語源の経路 ${langBadge(w.via)} ${VIA_LABEL[w.via]}</h3><p class="route">${esc(w.route)}</p></div>
      <section class="related">${related}</section>`;
    app.querySelector("#star").addEventListener("click", (e) => {
      toggleStar(w.w);
      const on = isStarred(w.w);
      e.currentTarget.classList.toggle("on", on);
      e.currentTarget.textContent = on ? "★ 単語帳に登録済み" : "☆ 単語帳に追加";
    });
  }

  // ---------- パーツ一覧 ----------
  function viewParts() {
    const groups = ["prefix", "root", "suffix"].map((type) => {
      const items = Object.entries(MORPHEMES)
        .filter(([, m]) => m.type === type)
        .map(([id, m]) => ({ id, m, n: wordsWith(id).length }))
        .filter((x) => x.n > 0)
        .sort((a, b) => b.n - a.n);
      return `<h2>${TYPE_LABEL[type]}</h2>
        <div class="parts-grid">${items.map(({ id, m, n }) => `
          <a class="card part-card ${type}" href="#/p/${encodeURIComponent(id)}">
            <div class="top"><span class="forms">${esc(m.forms.join(" "))}</span>${langBadge(m.lang)}</div>
            <div class="origin">${esc(m.origin)}</div>
            <div class="meaning">${esc(m.meaning)}</div>
            <div class="n">${n} 語</div>
          </a>`).join("")}</div>`;
    }).join("");
    app.innerHTML = `<h1 class="page-title">パーツ一覧</h1>
      <p class="lead">同じパーツを持つ単語をまとめて覚えると、初めて見る単語も推測できるようになります。</p>${groups}`;
  }
  function viewPart(id) {
    const m = MORPHEMES[id];
    if (!m) { app.innerHTML = `<p class="empty">パーツが見つかりません。</p>`; return; }
    const list = wordsWith(id);
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
  function scopeWords(scope) {
    if (scope === "starred") return WORDS.filter((w) => isStarred(w.w));
    if (scope === "unknown") return WORDS.filter((w) => !state.known[w.w]);
    if (scope === "wrong") return WORDS.filter((w) => state.wrong[w.w] > 0);
    return WORDS;
  }
  function chipGroup(name, options, current) {
    return `<div class="chips" data-group="${name}">${options
      .map(([k, l]) => `<button class="chip ${k === current ? "on" : ""}" data-val="${k}">${l}</button>`).join("")}</div>`;
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
  function statsHtml() {
    const known = WORDS.filter((w) => state.known[w.w]).length;
    const wrong = WORDS.filter((w) => state.wrong[w.w] > 0).length;
    return `<div class="stats">
      <div class="stat"><b>${WORDS.length}</b><span>収録語数</span></div>
      <div class="stat"><b>${state.starred.length}</b><span>マイ単語帳</span></div>
      <div class="stat"><b>${known}</b><span>覚えた</span></div>
      <div class="stat"><b>${wrong}</b><span>苦手（テストで間違えた）</span></div>
    </div>`;
  }

  // ---------- 単語帳（フラッシュカード） ----------
  const cardOpt = { scope: "all", order: "shuffle", face: "en" };
  function viewCardsSetup() {
    const starList = state.starred.map((w) => WORD_MAP[w]).filter(Boolean);
    app.innerHTML = `
      <h1 class="page-title">単語帳</h1>
      <p class="lead">カードをめくって、パーツの原意から意味を思い出す練習をします。</p>
      ${statsHtml()}
      <div class="panel settings">
        <div class="setting"><label class="t">範囲</label>${chipGroup("scope", SCOPES, cardOpt.scope)}</div>
        <div class="setting"><label class="t">順番</label>${chipGroup("order", [["shuffle", "ランダム"], ["list", "収録順"]], cardOpt.order)}</div>
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
    const updateN = () => {
      const n = scopeWords(cardOpt.scope).length;
      app.querySelector("#n").textContent = `${n} 枚`;
      app.querySelector("#start").disabled = n === 0;
    };
    bindChips(app, (k, v) => { cardOpt[k] = v; updateN(); });
    updateN();
    app.querySelector("#start").addEventListener("click", () => {
      const base = scopeWords(cardOpt.scope);
      runCards(cardOpt.order === "shuffle" ? shuffle(base) : base);
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
        ? `${segWord(w.parts)}${hint ? miniParts(w.parts) : '<span class="hint">パーツの原意から意味を考えてみよう</span>'}`
        : `<div class="answer">${esc(w.ja)}</div>${hint ? miniParts(w.parts) : '<span class="hint">どんなパーツの組み合わせ？</span>'}`;
      const back = `${segWord(w.parts)}
        <div class="answer">${esc(w.ja)}</div>
        ${miniParts(w.parts)}
        <p class="logic">${esc(w.logic)}</p>`;
      app.innerHTML = `
        <a class="back" href="#/cards" id="quit">← 単語帳の設定に戻る</a>
        <div class="q-meta"><span>${i + 1} / ${deck.length}</span><span>${isStarred(w.w) ? "★ マイ単語帳" : ""}</span></div>
        <div class="progress"><i style="width:${(i / deck.length) * 100}%"></i></div>
        <div class="flash" id="flash" role="button" tabindex="0" aria-label="カードをめくる">
          ${flipped ? back : front}
          <span class="tap">${flipped ? "" : "タップでめくる"}</span>
        </div>
        <div class="btn-row">
          ${flipped
            ? `<button class="btn ng" id="again">まだ</button><button class="btn ok" id="got">覚えた</button>`
            : `<button class="btn" id="hint" ${hint ? "disabled" : ""}>ヒント（パーツの意味）</button><button class="btn primary" id="flip">めくる</button>`}
          <button class="btn" id="starc">${isStarred(w.w) ? "★" : "☆"}</button>
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
  const testOpt = { scope: "all", count: "10", kind: "mix" };
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
        <div class="setting"><label class="t">問題数</label>${chipGroup("count", [["5", "5問"], ["10", "10問"], ["20", "20問"]], testOpt.count)}</div>
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
      const n = scopeWords(testOpt.scope).length;
      app.querySelector("#n").textContent = n ? `対象 ${n} 語` : "対象の単語がありません";
      app.querySelector("#start").disabled = n === 0;
    };
    bindChips(app, (k, v) => { testOpt[k] = v; updateN(); });
    updateN();
    app.querySelector("#start").addEventListener("click", () => {
      const pool = scopeWords(testOpt.scope);
      const n = Math.min(Number(testOpt.count), Math.max(pool.length, 1));
      const targets = [];
      while (targets.length < n) targets.push(...shuffle(pool));
      runTest(targets.slice(0, n).map((w) => makeQuestion(w, testOpt.kind)));
    });
  }

  // 同じパーツを持つ単語を優先して紛らわしい選択肢を作る
  function distractorWords(w, n) {
    const mids = new Set(w.parts.map((p) => p[1]));
    const similar = shuffle(WORDS.filter((x) => x.w !== w.w && x.parts.some((p) => mids.has(p[1]))));
    const others = shuffle(WORDS.filter((x) => x.w !== w.w && !similar.includes(x)));
    return [...similar.slice(0, 2), ...others].slice(0, n);
  }
  function makeQuestion(w, kind) {
    const k = kind === "mix" ? pick(["meaning", "word", "part"], 1)[0] : kind;
    if (k === "meaning") {
      const opts = shuffle([w, ...distractorWords(w, 3)]);
      return {
        w, prompt: "この単語の意味は？",
        body: `${segWord(w.parts)}${miniParts(w.parts)}`,
        choices: opts.map((o) => ({ label: o.ja, ok: o === w })), en: false,
      };
    }
    if (k === "word") {
      const formula = w.parts.map(([, mid]) => MORPHEMES[mid].meaning).join(" ＋ ");
      const opts = shuffle([w, ...distractorWords(w, 3)]);
      return {
        w, prompt: "この原意の組み合わせでできた単語は？",
        body: `<div class="formula">${esc(formula)}</div><div class="muted" style="margin-top:6px">意味: ${esc(w.ja)}</div>`,
        choices: opts.map((o) => ({ label: o.w, ok: o === w })), en: true,
      };
    }
    // part: 語根を優先して出題
    const [text, mid] = w.parts.find((p) => MORPHEMES[p[1]].type === "root") || w.parts[0];
    const m = MORPHEMES[mid];
    const wrongs = shuffle(Object.values(MORPHEMES).filter((x) => x.meaning !== m.meaning && x.type === m.type))
      .map((x) => x.meaning)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 3);
    const highlighted = `<span class="seg-word">${w.parts.map(([t, id]) =>
      id === mid ? `<span class="seg ${m.type}" style="text-decoration:underline">${esc(t)}</span>` : `<span class="muted">${esc(t)}</span>`
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
          <p style="margin:6px 0 0">${esc(q.w.logic)}</p>
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
        <div class="btn-row">
          ${wrongWords.length ? `<button class="btn primary" id="retry">間違えた ${wrongWords.length} 語でもう一度</button>` : ""}
          <a class="btn" href="#/test" style="text-decoration:none">設定に戻る</a>
        </div>
        <h2>ふりかえり</h2>
        <ul class="review-list">${log.map(({ q, ok }) => `
          <li><span class="mark ${ok ? "ok" : "ng"}">${ok ? "○" : "×"}</span>
            <a href="#/w/${encodeURIComponent(q.w.w)}">${esc(q.w.w)}</a>
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
})();
