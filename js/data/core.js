// データ読み込み用。morphemes.js と words-*.js がこの関数を呼んで登録する
const LATIEN = {
  morphemes: {},
  words: [],
  addMorphemes(text) {
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      const [id, type, lang, forms, origin, meaning] = line.split("|");
      this.morphemes[id] = { type, lang, forms: forms.split(","), origin, meaning };
    }
  },
  addWords(text) {
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      const [w, ja, pos, parts, logic, via, route, lv] = line.split("|");
      this.words.push({
        w, ja, pos, logic, via, route,
        lv: Number(lv) || 2,
        parts: parts.split("+").map((p) => {
          const [t, id] = p.split(":");
          return [t, id === undefined ? t : id];
        }),
      });
    }
  },
};
