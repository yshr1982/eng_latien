// 広告管理画面。ads.json を編集し、GitHub API でリポジトリに保存する
(() => {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const PATH = "ads.json";
  const KEY = "latien:admin";
  const TYPES = [["text", "テキスト"], ["image", "画像バナー"], ["html", "HTML コード（広告タグなど）"]];
  const emptySlot = () => ({ enabled: false, type: "text", label: "広告", title: "", text: "", link: "", image: "", html: "" });

  let ads = { enabled: true, slots: {} };

  // ---------- 設定の保存（このブラウザ内のみ） ----------
  function loadPrefs() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function savePrefs(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* 保存できなくても続ける */ }
  }
  const prefs = loadPrefs();
  $("#repo").value = prefs.repo || "yshr1982/eng_latien";
  $("#token").value = prefs.token || "";
  const remember = () => savePrefs({ repo: $("#repo").value.trim(), token: $("#token").value.trim() });
  $("#repo").addEventListener("change", remember);
  $("#token").addEventListener("change", remember);
  $("#forget").addEventListener("click", () => {
    $("#token").value = "";
    remember();
    setConn("トークンを消去しました", "");
  });

  // ---------- GitHub API ----------
  const b64encode = (str) => {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin);
  };
  const b64decode = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, "")), (c) => c.charCodeAt(0)));

  async function gh(path, opts = {}) {
    const token = $("#token").value.trim();
    if (!token) throw new Error("アクセストークンを入力してください");
    const res = await fetch(`https://api.github.com/repos/${$("#repo").value.trim()}${path}`, {
      ...opts,
      headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
    });
    if (!res.ok) {
      const msg = { 401: "トークンが無効です", 403: "権限がありません（Contents の書き込み権限が必要です）", 404: "リポジトリまたはファイルが見つかりません" }[res.status];
      throw new Error(msg || `GitHub API エラー（${res.status}）`);
    }
    return res.json();
  }

  function setConn(msg, cls) { const el = $("#conn"); el.textContent = msg; el.className = cls || "muted"; }
  function setStatus(msg, cls) { const el = $("#status"); el.textContent = msg; el.className = cls || "muted"; }

  $("#check").addEventListener("click", async () => {
    remember();
    setConn("確認中…");
    try {
      const repo = await gh("");
      if (!repo.permissions || !repo.permissions.push) throw new Error("このトークンには書き込み権限がありません");
      const file = await gh(`/contents/${PATH}`);
      ads = normalize(JSON.parse(b64decode(file.content)));
      draw();
      setConn(`接続しました（${repo.full_name}）。最新の設定を読み込みました`, "ok");
    } catch (e) {
      setConn(e.message, "ng");
    }
  });

  $("#save").addEventListener("click", async () => {
    remember();
    setStatus("保存中…");
    try {
      const body = JSON.stringify(ads, null, 2) + "\n";
      let sha;
      try { sha = (await gh(`/contents/${PATH}`)).sha; } catch (e) { if (!/見つかりません/.test(e.message)) throw e; }
      await gh(`/contents/${PATH}`, {
        method: "PUT",
        body: JSON.stringify({ message: "広告設定を更新", content: b64encode(body), sha }),
      });
      setStatus("保存しました。1〜2分でサイトに反映されます", "ok");
    } catch (e) {
      setStatus(e.message, "ng");
    }
  });

  $("#copy").addEventListener("click", async () => {
    const body = JSON.stringify(ads, null, 2) + "\n";
    try {
      await navigator.clipboard.writeText(body);
      setStatus("JSON をコピーしました。GitHub 上で ads.json に貼り付けても更新できます", "ok");
    } catch (e) {
      setStatus("コピーできませんでした", "ng");
    }
  });

  // ---------- フォーム ----------
  function normalize(d) {
    const out = { enabled: d && d.enabled !== false, slots: {} };
    for (const id of Object.keys(LatienAds.SLOTS)) out.slots[id] = { ...emptySlot(), ...((d && d.slots && d.slots[id]) || {}) };
    return out;
  }

  const field = (id, key, label, input) => `<div class="form-row" data-show="${key}"><label for="${id}-${key}">${label}</label>${input}</div>`;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function draw() {
    $("#enabled").checked = ads.enabled;
    $("#slots").innerHTML = Object.entries(LatienAds.SLOTS).map(([id, name]) => {
      const s = ads.slots[id];
      const text = (key, label, ph = "") => field(id, key, label, `<input id="${id}-${key}" data-slot="${id}" data-key="${key}" type="text" value="${esc(s[key])}" placeholder="${esc(ph)}">`);
      return `<div class="slot">
        <h4>${name}</h4>
        <label class="check"><input type="checkbox" data-slot="${id}" data-key="enabled" ${s.enabled ? "checked" : ""}> この枠に表示する</label>
        <div class="slot-grid">
          <div>
            ${field(id, "type", "種類", `<select id="${id}-type" data-slot="${id}" data-key="type">${TYPES.map(([v, l]) => `<option value="${v}" ${s.type === v ? "selected" : ""}>${l}</option>`).join("")}</select>`)}
            ${text("label", "表示ラベル", "広告 / PR など")}
            ${text("title", "見出し・代替テキスト")}
            ${text("text", "説明文")}
            ${text("image", "画像 URL", "https://...")}
            ${text("link", "リンク先 URL", "https://...")}
            ${field(id, "html", "HTML コード", `<textarea id="${id}-html" data-slot="${id}" data-key="html" spellcheck="false" placeholder="広告配信サービスから発行されたタグを貼り付け">${esc(s.html)}</textarea>`)}
          </div>
          <div><div class="preview-label">プレビュー</div><div class="preview"><div class="ad-slot" id="pv-${id}"></div></div></div>
        </div>
      </div>`;
    }).join("");
    Object.keys(LatienAds.SLOTS).forEach(refresh);
  }

  // 種類に応じて入力欄を出し分け、プレビューを更新する
  const VISIBLE = { text: ["label", "title", "text", "link"], image: ["label", "title", "image", "link"], html: ["label", "html"] };
  function refresh(id) {
    const s = ads.slots[id];
    document.querySelectorAll(`[data-show]`).forEach((row) => {
      const input = row.querySelector(`[data-slot="${id}"]`);
      if (!input) return;
      row.hidden = row.dataset.show !== "type" && !VISIBLE[s.type].includes(row.dataset.show);
    });
    LatienAds.render($(`#pv-${id}`), { ...s, enabled: true });
  }

  $("#enabled").addEventListener("change", (e) => { ads.enabled = e.target.checked; });
  $("#slots").addEventListener("input", (e) => {
    const { slot, key } = e.target.dataset;
    if (!slot) return;
    ads.slots[slot][key] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    refresh(slot);
  });

  // 最初は公開中の ads.json を読み込む（トークン不要）
  fetch(PATH, { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}))
    .then((d) => { ads = normalize(d); draw(); });
})();
