// データ読み込み用。morphemes.js と words-*.js がこの関数を呼んで登録する
const LATIEN = {
  morphemes: {},
  words: [],
  examples: {},
  sources: {},
  evidence: [],
  addMorphemes(text) {
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      const [id, type, lang, forms, origin, meaning] = line.split("|");
      if (Object.prototype.hasOwnProperty.call(this.morphemes, id)) throw new Error("パーツIDが重複しています: " + id);
      this.morphemes[id] = { type, lang, forms: forms.split(","), origin, meaning };
    }
  },
  // 出典台帳: id|種別|書誌|出版者・誌名|年|URL|略称
  addSources(text) {
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      const [id, type, bib, publisher, year, url, label] = line.split("|");
      if (Object.prototype.hasOwnProperty.call(this.sources, id)) throw new Error("出典IDが重複しています: " + id);
      this.sources[id] = { id, type, bib, publisher, year, url, label: label || id };
    }
  },
  // 論拠: target は "w:単語" / "m:パーツid" またはその配列
  addEvidence(list) {
    for (const e of list) {
      this.evidence.push({
        ...e,
        targets: Array.isArray(e.target) ? e.target : [e.target],
        forms: e.forms || [],
        claims: e.claims || [],
        verified: e.verified === undefined ? null : e.verified,
      });
    }
  },
  // 1行1例文: 単語|英文|和訳
  addExamples(text) {
    for (const line of text.split("\n")) {
      if (!line.trim()) continue;
      const [w, en, ja] = line.split("|");
      this.examples[w] = { en, ja };
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
