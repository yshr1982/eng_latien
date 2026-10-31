// 広告の表示。ads.json（admin.html から編集）を読み込み、data-ad 属性を持つ枠に差し込む
const LatienAds = (() => {
  "use strict";

  const SLOTS = {
    top: "ページ上部（ヘッダーの下）",
    home: "辞書：検索結果の上",
    word: "単語ページ：例文の下",
    result: "単語帳・テストの結果画面",
    footer: "ページ下部（フッター）",
  };

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // リンクと画像は http(s) のみ許可する
  const safeUrl = (u) => (/^https?:\/\//i.test(String(u || "").trim()) ? String(u).trim() : "");

  function render(el, slot) {
    el.replaceChildren();
    if (!slot || !slot.enabled) return;
    const label = `<span class="ad-label">${esc(slot.label || "広告")}</span>`;
    const link = safeUrl(slot.link);
    const open = link ? `<a class="ad-body" href="${esc(link)}" target="_blank" rel="sponsored noopener">` : `<div class="ad-body">`;
    const close = link ? "</a>" : "</div>";
    if (slot.type === "html") {
      // 管理者が書いた HTML（広告配信サービスのタグなど）。script も実行させる
      el.innerHTML = label;
      el.append(document.createRange().createContextualFragment(slot.html || ""));
    } else if (slot.type === "image") {
      const img = safeUrl(slot.image);
      if (!img) return;
      el.innerHTML = `${label}${open}<img src="${esc(img)}" alt="${esc(slot.title)}" loading="lazy">${close}`;
    } else {
      if (!slot.title && !slot.text) return;
      el.innerHTML = `${label}${open}<b class="ad-title">${esc(slot.title)}</b><span class="ad-text">${esc(slot.text)}</span>${close}`;
    }
  }

  let data = null;
  function fill() {
    if (!data || !data.enabled) return;
    document.querySelectorAll("[data-ad]:not([data-ad-filled])").forEach((el) => {
      el.dataset.adFilled = "1";
      render(el, data.slots && data.slots[el.dataset.ad]);
    });
  }
  function load() {
    fetch("ads.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        data = d;
        fill();
        // 画面遷移で新しく作られた枠にも差し込む
        new MutationObserver(fill).observe(document.body, { childList: true, subtree: true });
      })
      .catch(() => { /* 広告が読めなくてもサイトは動かす */ });
  }

  return { SLOTS, render, load };
})();
