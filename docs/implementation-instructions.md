# 実装指示書：語源分解の修正と「論拠表示」機能

対象リポジトリ: `/home/user/eng_latien`（ブランチ `claude/festive-gates-36lbk4`）。ビルド工程のない静的サイト（素の HTML/JS）。
元になる要求書: `docs/etymology-review-change-request.md`（**必ず全文を読むこと。特に第 7 章は第 1〜6 章に追加・優先する**）。

## 0. 守ること（最重要）

- **`verified` は全件 `null`**。日付を入れてはいけない。
- 出典として使ってよいのは、要求書第 6 章に載っている 10 件だけ（OED, TLFi, FEW, AND, Beekes 2010, Corominas & Pascual, de Vaan 2008, Ernout & Meillet, Lewis & Short, Pliny 『博物誌』）。Wikipedia・Etymonline・AI の知識などを出典として登録しない。`refs` の `loc` は本書に書いたものをそのまま使う。
- 本書に書いていない語源の主張を `summary`・`claims` に足さない。
- 行番号は着手前のもの。編集で行がずれるので、**行全体の文字列で検索して**置換する（Edit ツールの `old_string` に行全体を使うか、Grep で現在位置を確認する）。
- コミットとプッシュはしない（レビュー担当が行う）。
- 完了条件: `node tools/validate.js` が終了コード 0、`node tests/integration.js` が全件 PASS（終了コード 0）。

## 1. データ形式の変更（単語行・パーツ行）

- 単語行: 9 番目のフィールド（注記）を**廃止**。`単語|意味|品詞|パーツ|原意からの流れ|経路|語源|レベル` の 8 フィールドにする。
- パーツ行: 7 番目のフィールド（注記）を**廃止**。`id|type|lang|形|元の語形|原意` の 6 フィールドにする。
- 対象は次の 19 行（単語 11・パーツ 8）。**行末の `|注記` を削除**し、注記の文面は 6 章の `evidence.js` に移す。

| 種別 | 対象 | ファイル |
|---|---|---|
| 単語 | adjust | words-03.js |
| 単語 | mortgage | words-04.js |
| 単語 | salary | words-07.js |
| 単語 | recover | words-10.js |
| 単語 | trivial | words-14.js |
| 単語 | average, delicate, fee, hazard, seasonal, toll | words-17.js |
| パーツ | sider | words-08.js |
| パーツ | lic | words-09.js |
| パーツ | avarie, bargain, e_flaw, hasard, satio, telos | words-17.js |

削除後、`awk -F'|'` で全単語行のフィールド数が 8 以下、全パーツ行が 6 以下であることを確認する。

- 各 words/morphemes ファイル先頭のコメント（書式の説明）から注記フィールドの記述を削除し、`morphemes.js` と `words-01.js` のコメントを新しい書式に合わせる。

## 2. ローダー（`js/data/core.js`）

1. `addMorphemes`: 注記フィールドを読まない。**同じ ID が既にあれば `throw new Error("パーツIDが重複しています: " + id)`**。
2. `addWords`: 注記（`note`）を読まない。単語オブジェクトに `note` プロパティを持たせない。
3. 新規 `LATIEN.sources = {}`、`LATIEN.addSources(text)`:
   - 1 行 1 出典、書式 `id|種別|書誌|出版者・誌名|年|URL または DOI|略称`。7 番目の「略称」は画面表示用の短い名前（省略時は id）。
   - 種別は `paper` / `dictionary` / `primary` のみ。保存形は `{ id, type, bib, publisher, year, url, label }`。
   - 空行は無視。id の重複は `throw`。
4. 新規 `LATIEN.evidence = []`、`LATIEN.addEvidence(list)`:
   - 引数は 2 章のオブジェクトの配列。各要素を `{ ...e, targets: [...] }` として保存する。`target` が文字列なら 1 要素の配列、配列ならそのまま `targets` にする。`forms` が無ければ `[]`。`claims` が無ければ `[]`。`verified` が undefined なら `null`。

`index.html` の script タグ順: core.js → morphemes.js → words-01..17 → **sources.js → evidence.js** → examples-01..17 → ads.js → app.js。

## 3. 出典台帳 `js/data/sources.js`（新規）

```js
// 出典台帳。書式: id|種別|書誌|出版者・誌名|年|URL または DOI|略称
//   種別: paper（査読論文） / dictionary（学術的な語源辞典・歴史的原則の辞典） / primary（一次史料の校訂版）
//   Wikipedia、Wiktionary、Etymonline、個人サイト、学習参考書、AI の出力は出典として登録しない
LATIEN.addSources(`
OED|dictionary|Oxford English Dictionary, 3rd ed. (online)|Oxford University Press|2000–|https://www.oed.com/|OED
TLFi|dictionary|Trésor de la langue française informatisé|ATILF – CNRS & Université de Lorraine||https://www.cnrtl.fr/etymologie/|TLFi
FEW|dictionary|von Wartburg, W. Französisches Etymologisches Wörterbuch|ATILF|1922–2002|https://lecteur-few.atilf.fr/|FEW
AND|dictionary|Anglo-Norman Dictionary (AND2 Online Edition)|Aberystwyth University||https://anglo-norman.net/|AND
Beekes2010|dictionary|Beekes, R. Etymological Dictionary of Greek|Brill (Leiden)|2010||Beekes 2010
CorominasPascual|dictionary|Corominas, J. & Pascual, J. A. Diccionario crítico etimológico castellano e hispánico|Gredos (Madrid)|1980–1991||Corominas & Pascual
deVaan2008|dictionary|de Vaan, M. Etymological Dictionary of Latin and the other Italic Languages|Brill (Leiden)|2008||de Vaan 2008
ErnoutMeillet|dictionary|Ernout, A. & Meillet, A. Dictionnaire étymologique de la langue latine, 4e éd.|Klincksieck (Paris)|2001||Ernout & Meillet
LewisShort|dictionary|Lewis, C. T. & Short, C. A Latin Dictionary|Clarendon Press (Oxford)|1879||Lewis & Short
PlinyNH|primary|Pliny the Elder, Naturalis Historia, book 31（校訂版: Mayhoff, Teubner）|Teubner|||Plinius『博物誌』
`);
```

## 4. パーツ・単語データの修正

全て `js/data/` 内。**「旧」の行全体を探して「新」に置換**する。パーツ ID は下の「新規パーツ」を先に追加してから単語を直す。

### 4.1 新規パーツ（`morphemes.js` の末尾、最後の `` `); `` の直前に追記）

```
oris|root|la|or|ōs / ōris|口
mentis|root|la|ment|mēns / mentis|心
membr|root|la|member|membrum|肢・構成員
artus|root|la|art|artus|関節
e_mark|root|en|mark|古英 mearc|境界・しるし
en_gr|prefix|gr|en-,em-|ギ en（ἐν）|中に
provinc|root|la|province|prōvincia（語源不詳）|統治領・属州
iuxt|root|la|just|iuxtā|すぐそばに
nota|root|la|note,not|nota|しるし・記号
nosc|root|la|not|nōscere / nōtus|知る
servare|root|la|serv,serve|servāre|保つ・守る
servire|root|la|serv,serve|servīre（← servus 奴隷）|仕える
```

### 4.2 既存パーツ行の変更・削除

| ファイル | 旧 | 新 |
|---|---|---|
| words-16.js | `or|root|la|or|ōs / ōris|口` | **削除**（`oris` に移行。接尾辞 `or` は morphemes.js に残す） |
| morphemes.js | `ment|root|la|ment|mēns / mentis|心` | **削除**（`mentis` に移行。接尾辞 `ment` は残す） |
| morphemes.js | `not|root|la|not,note|nōtāre / nōscere|記す・知る` | **削除**（`nota`/`nosc` に分割） |
| morphemes.js | `serv|root|la|serv,serve|servāre / servīre|保つ・仕える` | **削除**（`servare`/`servire` に分割） |
| words-10.js | `marq|root|fr|mark|仏 marquer|しるしを付ける` | `marq|root|fr|mark|仏 marquer（ゲルマン語起源）|しるしを付ける` |
| words-09.js | `furn|root|fr|furn|古仏 fornir|供給する` | `furn|root|fr|furn,form|古仏 fornir|供給する` |
| morphemes.js または words-xx.js の `avant` 行 | 形が `vance,vant` | 末尾に `advance,advanc,advant` を足して `vance,vant,advance,advanc,advant`（現在の行を `grep -n "^avant|"` で探す） |

注意: これらを削除・変更した後は、旧 ID を使う単語がすべて 4.3 で直されていなければならない。`tools/validate.js` の「未定義 ID」検査で漏れを確認する。

### 4.3 単語行の変更（パーツ列と、指示のあるものは原意・経路・語源）

パーツ列だけを変えるものは、その行の第 4 フィールドのみ置換する。

**2 章 ID 衝突（oral, mental, mentally, mention, comment）**

| 単語 | ファイル | 旧パーツ | 新パーツ |
|---|---|---|---|
| oral | words-16 | `or+al` | `or:oris+al` |
| mental | words-03 | `ment+al` | `ment:mentis+al` |
| mention | words-03 | `ment+ion` | `ment:mentis+ion` |
| comment | words-03 | `com:con+ment` | `com:con+ment:mentis` |
| mentally | words-14 | `ment+al+ly` | `ment:mentis+al+ly` |

**B-1 membership**（words-12）: `member:memor+ship` → `member:membr+ship`。remember は `memor` のまま。

**B-2 article**（words-08）: パーツ `art+i:_+cle` → `art:artus+i:_+cle`、原意 `小さな部分 → 条項 → 記事` → `小さな関節（区切り） → 条項 → 記事`。artificial, artist, artwork は変更しない。

**B-3 mark**（`marq` → `e_mark`）: landmark（words-12）`land:e_land+mark:marq` → `land:e_land+mark:e_mark`／trademark（words-17）`trade:e_trade+mark:marq` → `trade:e_trade+mark:e_mark`／benchmark（words-17）`bench:e_bench+mark:marq` → `bench:e_bench+mark:e_mark`／markup（words-16）`mark:marq+up` → `mark:e_mark+up`。remark, remarkable は変更しない。

**B-4 advance 系**（綴り `ad` を接頭辞として表示しない）:

| 単語 | ファイル | 旧パーツ | 新パーツ |
|---|---|---|---|
| advance | words-08 | `ad+vance:avant` | `advance:avant` |
| advanced | words-08 | `ad+vanc:avant+ed` | `advanc:avant+ed` |
| advantage | words-08 | `ad+vant:avant+age` | `advant:avant+age` |
| disadvantage | words-14 | `dis+ad+vant:avant+age` | `dis+advant:avant+age` |

**B-5 device / devise**: device（words-09）`de+vice:divid` → `de:dis+vice:divid`、devise（words-09）`de+vise:divid` → `de:dis+vise:divid`。

**B-6 ギリシャ語 en-**（`en` → `en_gr`）:

| 単語 | ファイル | 旧パーツ | 新パーツ |
|---|---|---|---|
| empathy | words-15 | `em:en+path+y` | `em:en_gr+path+y` |
| emphasis | words-07 | `em:en+pha+sis` | `em:en_gr+pha+sis` |
| emphasize | words-07 | `em:en+pha+s:_+ize` | `em:en_gr+pha+s:_+ize` |
| energy | words-16 | `en+erg+y` | `en:en_gr+erg+y` |
| energetic | words-16 | `en+erg+et:_+ic` | `en:en_gr+erg+et:_+ic` |
| enthusiasm | words-09 | `en+thus:the+i:_+asm:ism` | `en:en_gr+thus:the+i:_+asm:ism` |
| enthusiastic | words-09 | `en+thus:the+i:_+ast:_+ic` | `en:en_gr+thus:the+i:_+ast:_+ic` |

**B-7 archive**（words-16）: 行全体を次にする。
`archive|記録保管所|名|arch+ive:_|役所 → 記録保管所|gr|ギ arkheion（役所）→ 後期ラ archīvum|4`

**B-8 trivial**（words-14）: 注記を削除するだけ（文面は evidence.js で書き直す）。

**B-9 経路**:

| 単語 | ファイル | 新しい行（`|` 区切りの 6〜7 番目を変更） |
|---|---|---|
| cargo | words-08 | `cargo|貨物|名|cargo:carr|荷車に積むもの|es|西 cargo（積荷）|2` |
| apartment | words-04 | 経路 `fr` → `it`、語源欄を空から `伊 appartamento → 仏 appartement` に |
| corridor | words-13 | 経路 `fr` → `it`、語源欄を `伊 corridore` に |
| disaster | words-09 | 経路 `fr` → `it`、語源欄を `伊 disastro` に |

（apartment, corridor, disaster はパーツ列・原意・レベルを変えない。現在の行を確認してから 7 番目・8 番目だけ書き換える。）

**B-10 serv の分割**（`serv` → `servire` / `servare`）:

| 単語 | ファイル | 旧パーツ | 新パーツ |
|---|---|---|---|
| serve | words-05 | `serve:serv` | `serve:servire` |
| service | words-05 | `serv+ice` | `serv:servire+ice` |
| server | words-13 | `serv+er` | `serv:servire+er` |
| deserve | words-05 | `de+serve:serv` | `de+serve:servire` |
| dessert | words-15 | `des:dis+sert:serv` | `des:dis+sert:servire` |
| concierge | words-17 | `con+cierge:serv` | `con+cierge:servire` |
| reserve | words-05 | `re+serve:serv` | `re+serve:servare` |
| reserved | words-16 | `re+serv+ed` | `re+serv:servare+ed` |
| reservation | words-05 | `re+serv+at:ate+ion` | `re+serv:servare+at:ate+ion` |
| reservoir | words-13 | `re+serv+oir:ory` | `re+serv:servare+oir:ory` |
| preserve | words-05 | `pre+serve:serv` | `pre+serve:servare` |
| preservation | words-13 | `pre+serv+at:ate+ion` | `pre+serv:servare+at:ate+ion` |
| observe | words-05 | `ob+serve:serv` | `ob+serve:servare` |
| observation | words-05 | `ob+serv+at:ate+ion` | `ob+serv:servare+at:ate+ion` |
| conservation | words-05 | `con+serv+at:ate+ion` | `con+serv:servare+at:ate+ion` |
| conservative | words-05 | `con+serv+at:ate+ive` | `con+serv:servare+at:ate+ive` |

（servire 6 語、servare 10 語、計 16 語。旧 `serv` を使っていた単語はこの 16 語で全部。）

**C-0 adjust**（words-03）: 3 行を次にする（注記は削除済みであること）。
- `adjust|調整する|動|ad+just:iuxt|そばへ寄せる → ぴったり合わせる → 調整する|fr|古仏 ajuster（後期ラ adiuxtāre）|2`
- adjustment: パーツ `ad+just:jur+ment` → `ad+just:iuxt+ment`
- adjustable: パーツ `ad+just:jur+able` → `ad+just:iuxt+able`

**C-4 province**（words-14）: `province|州|名|province:provinc|ローマの統治領 → 州|la||4`

**C-18 note 系**（`not` → `nota` / `nosc`）。要求書の語リストに加え、実データを調べた結果、`noticeable` と `notification` も `nosc`（notice, notify の系統）に含める。

| 単語 | ファイル | 旧パーツ | 新パーツ |
|---|---|---|---|
| note | words-04 | `note:not` | `note:nota` |
| noted | words-13 | `not+ed` | `not:nota+ed` |
| notable | words-04 | `not+able` | `not:nota+able` |
| notably | words-13 | `not+ab:able+ly` | `not:nota+ab:able+ly` |
| keynote | words-12 | `key:e_key+note:not` | `key:e_key+note:nota` |
| notebook | words-16 | `note:not+book:e_book` | `note:nota+book:e_book` |
| notice | words-04 | `not+ice` | `not:nosc+ice` |
| noticeable | words-04 | `not+ice+able` | `not:nosc+ice+able` |
| notify | words-02 | `not+ify:fy` | `not:nosc+ify:fy` |
| notification | words-02 | `not+i:_+fic:fac+at:ate+ion` | `not:nosc+i:_+fic:fac+at:ate+ion` |
| notion | words-13 | `not+ion` | `not:nosc+ion` |

**A-1 perform → furn**（`form` → `form:furn`）:

| 単語 | ファイル | 旧パーツ | 新パーツ |
|---|---|---|---|
| perform | words-02 | `per+form` | `per+form:furn` |
| performance | words-02 | `per+form+ance` | `per+form:furn+ance` |
| performer | words-02 | `per+form+er` | `per+form:furn+er` |
| outperform | words-12 | `out+per+form` | `out+per+form:furn` |
| underperform | words-16 | `under+per+form` | `under+per+form:furn` |

perform の原意・語源のみ変更: `perform|行う、演じる|動|per+form:furn|すっかり供給する → やり遂げる → 行う|fr|アングロ仏 parfourmer ← 古仏 parfornir（par + fornir）|1`

### 4.4 変更後の確認

- 変更した単語の件数: 2 章 5、B-1 1、B-2 1、B-3 4、B-4 4、B-5 2、B-6 7、B-7 1、B-8 1（注記削除のみ）、B-9 4、B-10 16、C-0 3、C-4 1、C-18 11、A-1 5。
- `bid`, `bidder`, C-1 の 13 語などは**分解を変えない**（論拠だけ登録する）。

## 5. 論拠データ `js/data/evidence.js`（新規）

書式: `LATIEN.addEvidence([ {...}, ... ])`。

- `target`: `"w:単語"` / `"m:パーツid"` または**それらの配列**。
- `forms`: 任意。`m:` の対象にだけ作用し、その綴りで現れる単語にだけ適用する。
- `kind`: `disputed`（諸説あり） / `uncertain`（語源不詳・推定を含む） / `blend`（二つの語が合流） / `spelling`（綴りは後世の変更）。
- `stance`: `adopted`（採用） / `alternative`（対立説） / `rejected`（通俗語源）。
- すべての `claim` は `refs` を 1 件以上持つ。`refs[].src` は sources.js の id、`loc` は見出し語（`*...*` で囲むとイタリック表示）。
- **`verified` はすべて `null`**。

以下をそのまま `js/data/evidence.js` として保存する（全 40 件）。

```js
// 語源の論拠データ。書式と運用は README の「論拠・出典」を参照
// verified は原典の該当見出しを確認した日付（YYYY-MM-DD）。未確認は null（確認していない者は日付を入れない）
LATIEN.addEvidence([
  // ===== 既存の注記の移行（adjust は C-0、trivial は B-8 に置き換え） =====
  {
    target: ["w:adjust", "w:adjustment", "w:adjustable"], kind: "blend",
    summary: "後期ラテン語 adiuxtāre（ad + iuxtā「すぐそばに」）が起源とされ、justus（正しい）との結びつきは後世の連想、またはフランス語 ajuster の影響と考えられます。",
    claims: [
      { stance: "adopted", text: "後期ラテン語 adiuxtāre（ad + iuxtā「すぐそばに」）に由来する。", refs: [{ src: "OED", loc: "s.v. *adjust*" }] },
      { stance: "alternative", text: "フランス語 ajuster（à + juste ← ラ iūstus）の影響で、justus との連想が生じた。", refs: [{ src: "TLFi", loc: "s.v. *ajuster*" }] },
    ],
    verified: null,
  },
  {
    target: "w:mortgage", kind: "disputed",
    summary: "「死んだ」の意味を「返済すると誓約が消える」「返せないと土地が失われる」のどちらと解するかには諸説あります。",
    claims: [
      { stance: "adopted", text: "古仏 mort gage「死んだ担保」に由来する。", refs: [{ src: "OED", loc: "s.v. *mortgage*" }] },
      { stance: "alternative", text: "「死んだ」は、返済すると誓約が消えることとも、返せないと土地が失われることとも解釈される。", refs: [{ src: "OED", loc: "s.v. *mortgage*" }] },
    ],
    verified: null,
  },
  {
    target: "w:salary", kind: "disputed",
    summary: "「塩の代金（塩を買うための手当）」とする説は有力ですが確証はなく、塩の道の警備に対する報酬など他の説もあります。",
    claims: [
      { stance: "adopted", text: "ラ salārium は塩（sāl）に関わる語で、「塩の代金」とする説が有力である。",
        refs: [{ src: "PlinyNH", loc: "31.89" }, { src: "OED", loc: "s.v. *salary*" }, { src: "deVaan2008", loc: "s.v. *sāl*" }] },
      { stance: "alternative", text: "塩の道の警備に対する報酬など、他の説もある。", refs: [{ src: "OED", loc: "s.v. *salary*" }] },
    ],
    verified: null,
  },
  {
    target: "w:recover", kind: "disputed",
    summary: "recuperāre が capere（取る）と同じ語根かどうかは確定していません。",
    claims: [
      { stance: "adopted", text: "recuperāre を capere（取る）と同じ語根とみなす。", refs: [{ src: "deVaan2008", loc: "s.v. *recuperō*" }, { src: "OED", loc: "s.v. *recover*" }] },
      { stance: "alternative", text: "recuperāre が capere と同じ語根かどうかは確定していない。", refs: [{ src: "deVaan2008", loc: "s.v. *recuperō*" }] },
    ],
    verified: null,
  },
  {
    target: "w:trivial", kind: "disputed",
    summary: "ラテン語 triviālis（三叉路の → ありふれた）は古典期からある語義です。英語では最初、中世の三学科（trivium）を指す用法でした。",
    claims: [
      { stance: "adopted", text: "ラ triviālis には、三叉路の → ありふれた、という語義が古典期からある。", refs: [{ src: "LewisShort", loc: "s.v. *trivialis*" }] },
      { stance: "adopted", text: "英語での初出は、中世の三学科（trivium）を指す用法だった。", refs: [{ src: "OED", loc: "s.v. *trivial*" }] },
    ],
    verified: null,
  },
  {
    target: "w:average", kind: "disputed",
    summary: "古仏 avarie の先はアラビア語 ʿawār（損傷）とする説などがあり、確定していません。",
    claims: [
      { stance: "adopted", text: "仏 avarie（海損）に由来する。", refs: [{ src: "OED", loc: "s.v. *average* n.2" }, { src: "TLFi", loc: "s.v. *avarie*" }] },
      { stance: "alternative", text: "avarie の先はアラビア語 ʿawār（損傷）とする説などがある。", refs: [{ src: "OED", loc: "s.v. *average* n.2" }, { src: "TLFi", loc: "s.v. *avarie*" }] },
    ],
    verified: null,
  },
  {
    target: "m:avarie", kind: "disputed",
    summary: "アラビア語起源とする説などがあり、確定していません。",
    claims: [
      { stance: "adopted", text: "仏 avarie（海損）に由来する。", refs: [{ src: "OED", loc: "s.v. *average* n.2" }, { src: "TLFi", loc: "s.v. *avarie*" }] },
      { stance: "alternative", text: "アラビア語起源とする説などがある。", refs: [{ src: "OED", loc: "s.v. *average* n.2" }, { src: "TLFi", loc: "s.v. *avarie*" }] },
    ],
    verified: null,
  },
  {
    target: "w:delicate", kind: "uncertain",
    summary: "dēlicātus を dēlicere（誘い込む）と結びつけるのは推定を含みます。",
    claims: [
      { stance: "adopted", text: "dēlicātus を dēlicere（誘い込む）と結びつける。ただし推定を含む。", refs: [{ src: "deVaan2008", loc: "s.v. *laciō*" }, { src: "ErnoutMeillet", loc: "s.v. *dēliciae*" }] },
    ],
    verified: null,
  },
  {
    target: "m:lic", kind: "uncertain",
    summary: "dēlicere との結びつきは推定を含みます。",
    claims: [
      { stance: "adopted", text: "dēlicere（誘い込む）との結びつきを採る。ただし推定を含む。", refs: [{ src: "deVaan2008", loc: "s.v. *laciō*" }, { src: "ErnoutMeillet", loc: "s.v. *dēliciae*" }] },
    ],
    verified: null,
  },
  {
    target: "w:fee", kind: "disputed",
    summary: "フランク語 fehu（家畜・財産）に由来するとされますが、経路には諸説あります。",
    claims: [
      { stance: "adopted", text: "フランク語 fehu（家畜・財産）に由来する。", refs: [{ src: "OED", loc: "s.v. *fee* n.2" }, { src: "AND", loc: "s.v. *fé*" }] },
      { stance: "alternative", text: "語が英語に入った経路には諸説がある。", refs: [{ src: "OED", loc: "s.v. *fee* n.2" }, { src: "AND", loc: "s.v. *fé*" }] },
    ],
    verified: null,
  },
  {
    target: "w:hazard", kind: "disputed",
    summary: "アラビア語 az-zahr（さいころ）に由来するという説が有力ですが、異説もあります。",
    claims: [
      { stance: "adopted", text: "アラビア語 az-zahr（さいころ）に由来するという説が有力である。", refs: [{ src: "OED", loc: "s.v. *hazard*" }, { src: "TLFi", loc: "s.v. *hasard*" }, { src: "CorominasPascual", loc: "s.v. *azar*" }] },
      { stance: "alternative", text: "異なる語源を挙げる説もある。", refs: [{ src: "OED", loc: "s.v. *hazard*" }, { src: "CorominasPascual", loc: "s.v. *azar*" }] },
    ],
    verified: null,
  },
  {
    target: "m:hasard", kind: "disputed",
    summary: "アラビア語 az-zahr（さいころ）説が有力ですが異説もあります。",
    claims: [
      { stance: "adopted", text: "アラビア語 az-zahr（さいころ）に由来するという説が有力である。", refs: [{ src: "OED", loc: "s.v. *hazard*" }, { src: "TLFi", loc: "s.v. *hasard*" }, { src: "CorominasPascual", loc: "s.v. *azar*" }] },
      { stance: "alternative", text: "異なる語源を挙げる説もある。", refs: [{ src: "OED", loc: "s.v. *hazard*" }, { src: "CorominasPascual", loc: "s.v. *azar*" }] },
    ],
    verified: null,
  },
  {
    target: "w:seasonal", kind: "disputed",
    summary: "season は satiō（種まき）由来が一般的ですが、statiō（立ち止まる時期）由来とする説もあります。",
    claims: [
      { stance: "adopted", text: "season は satiō（種まき）に由来する。", refs: [{ src: "OED", loc: "s.v. *season*" }, { src: "FEW", loc: "s.v. *satio*" }] },
      { stance: "alternative", text: "season は statiō（立ち止まる時期）に由来するとする説もある。", refs: [{ src: "OED", loc: "s.v. *season*" }, { src: "FEW", loc: "s.v. *satio*" }] },
    ],
    verified: null,
  },
  {
    target: "m:satio", kind: "disputed",
    summary: "statiō 由来とする説もあります。",
    claims: [
      { stance: "adopted", text: "satiō（種まき）に由来する。", refs: [{ src: "OED", loc: "s.v. *season*" }, { src: "FEW", loc: "s.v. *satio*" }] },
      { stance: "alternative", text: "statiō に由来するとする説もある。", refs: [{ src: "OED", loc: "s.v. *season*" }, { src: "FEW", loc: "s.v. *satio*" }] },
    ],
    verified: null,
  },
  {
    target: "w:toll", kind: "disputed",
    summary: "ギリシャ語 telos（税）が後期ラテン語経由で入ったとする説と、ゲルマン語固有の語とする説があります。",
    claims: [
      { stance: "adopted", text: "ギリシャ語 telos（税）が後期ラテン語を経て入った。", refs: [{ src: "OED", loc: "s.v. *toll* n.1" }] },
      { stance: "alternative", text: "ゲルマン語固有の語とする説もある。", refs: [{ src: "OED", loc: "s.v. *toll* n.1" }] },
    ],
    verified: null,
  },
  {
    target: "m:telos", kind: "disputed",
    summary: "ゲルマン語固有の語とする説もあります。",
    claims: [
      { stance: "adopted", text: "ギリシャ語 telos（税）に由来する。", refs: [{ src: "OED", loc: "s.v. *toll* n.1" }] },
      { stance: "alternative", text: "ゲルマン語固有の語とする説もある。", refs: [{ src: "OED", loc: "s.v. *toll* n.1" }] },
    ],
    verified: null,
  },
  {
    target: "m:bargain", kind: "uncertain",
    summary: "ゲルマン語起源とされますが詳細は不明です。",
    claims: [
      { stance: "adopted", text: "古仏 bargaignier はゲルマン語起源とされるが、詳細は不明である。", refs: [{ src: "OED", loc: "s.v. *bargain*" }, { src: "TLFi", loc: "s.v. *barguigner*" }] },
    ],
    verified: null,
  },
  {
    target: "m:e_flaw", kind: "uncertain",
    summary: "古ノルド語起源は推定です。",
    claims: [
      { stance: "adopted", text: "古ノルド語 flaga（薄片）に由来すると推定される。", refs: [{ src: "OED", loc: "s.v. *flaw* n.1" }] },
    ],
    verified: null,
  },
  {
    target: "m:sider", kind: "disputed",
    summary: "「星（sīdus）」と結びつける説は有力ですが確定ではありません。",
    claims: [
      { stance: "adopted", text: "「星（sīdus）」と結びつける説が有力である。", refs: [{ src: "deVaan2008", loc: "s.v. *sīdus*" }, { src: "ErnoutMeillet", loc: "s.v. *sīdus*" }] },
      { stance: "alternative", text: "結びつきは確定していない。", refs: [{ src: "deVaan2008", loc: "s.v. *sīdus*" }, { src: "ErnoutMeillet", loc: "s.v. *sīdus*" }] },
    ],
    verified: null,
  },

  // ===== 新規：データ修正に伴う論拠（A-1, A-2, B-4） =====
  {
    target: ["w:perform", "w:performance", "w:performer", "w:outperform", "w:underperform"], kind: "blend",
    summary: "古フランス語 parfornir（par + fornir「供給する」）が起源で、form という綴りは forme（形）との混同で生じた後世の変形です。",
    claims: [
      { stance: "adopted", text: "アングロ仏 parfourmer ← 古仏 parfornir（par + fornir）に由来し、form の綴りは forme の影響による変形である。", refs: [{ src: "OED", loc: "s.v. *perform*" }] },
    ],
    verified: null,
  },
  {
    target: ["w:bid", "w:bidder"], kind: "blend",
    summary: "古英語 biddan（求める）と bēodan（申し出る）が合流した語で、「値を付ける」の意味は bēodan に由来します。",
    claims: [
      { stance: "adopted", text: "古英語 biddan（求める）と bēodan（申し出る）が合流し、「値を付ける」の意味は bēodan に由来する。", refs: [{ src: "OED", loc: "s.v. *bid* v." }] },
    ],
    verified: null,
  },
  {
    target: ["w:advance", "w:advanced", "w:advantage", "w:disadvantage"], kind: "spelling",
    summary: "古フランス語 avancier ← 俗ラテン語 *abanteāre（ab + ante）です。d は 16 世紀にラテン語 ad- と誤解して挿入された綴りで、接頭辞 ad- ではありません。",
    claims: [
      { stance: "adopted", text: "古仏 avancier ← 俗ラ *abanteāre（ab + ante）。d はラ ad- と誤解して 16 世紀に挿入された綴りである。", refs: [{ src: "OED", loc: "s.v. *advance* v." }, { src: "TLFi", loc: "s.v. *avancer*" }] },
    ],
    verified: null,
  },

  // ===== 新規：要求書 4.1 の項目（C-1〜C-18） =====
  {
    target: ["w:pose", "w:propose", "w:proposal", "w:purpose", "w:oppose", "w:compose", "w:expose", "w:exposure", "w:dispose", "w:disposable", "w:disposal", "w:impose", "w:suppose"], kind: "blend",
    summary: "意味はラテン語 pōnere（置く）、語形は後期ラテン語 pausāre（休む ← ギリシャ語 pausis）に由来します。",
    claims: [
      { stance: "adopted", text: "意味はラ pōnere（置く）の複合語を継承した。", refs: [{ src: "OED", loc: "s.v. *pose* v.1" }] },
      { stance: "alternative", text: "語形は後期ラ pausāre（休む）に由来し、仏 poser が pōnere 系の複合語を置き換えた。", refs: [{ src: "TLFi", loc: "s.v. *poser*" }, { src: "FEW", loc: "s.v. *pausare*" }] },
    ],
    verified: null,
  },
  {
    target: ["w:allow", "w:allowance"], kind: "blend",
    summary: "ラテン語 allocāre（割り当てる）と allaudāre（ほめる）が、古フランス語 alouer で合流したとされます。",
    claims: [
      { stance: "adopted", text: "ラ allocāre（割り当てる）に由来する。", refs: [{ src: "OED", loc: "s.v. *allow*" }, { src: "AND", loc: "s.v. *alouer*" }] },
      { stance: "alternative", text: "ラ allaudāre（ほめる）にも由来し、古仏 alouer で両者が合流した。", refs: [{ src: "OED", loc: "s.v. *allow*" }, { src: "AND", loc: "s.v. *alouer*" }] },
    ],
    verified: null,
  },
  {
    target: ["w:add", "w:addition", "w:additional", "w:additionally"], kind: "disputed",
    summary: "ad + dare（与える）とする説明が一般的ですが、-dere は印欧祖語 *dʰeh₁-（置く）に遡り dare とは別語根だとする見方もあります。",
    claims: [
      { stance: "adopted", text: "ad + dare（与える）である。", refs: [{ src: "LewisShort", loc: "s.v. *addo*" }] },
      { stance: "alternative", text: "-dere は印欧祖語 *dʰeh₁-（置く）に遡り、dare とは別語根である。", refs: [{ src: "deVaan2008", loc: "s.v. *dō*" }] },
    ],
    verified: null,
  },
  {
    target: "m:provinc", kind: "uncertain",
    summary: "語源は不詳です。prō + vincere（征服した地）という説明は、最古の用法に合わない通俗的な説明とされます。",
    claims: [
      { stance: "adopted", text: "語源は不詳である。", refs: [{ src: "OED", loc: "s.v. *province*" }, { src: "deVaan2008", loc: "s.v. *prōvincia*" }] },
      { stance: "rejected", text: "prō + vincere（征服した地）。最古の用法に合わない。", refs: [{ src: "ErnoutMeillet", loc: "s.v. *prōvincia*" }] },
    ],
    verified: null,
  },
  {
    target: ["w:interpret", "w:interpreter"], kind: "uncertain",
    summary: "inter + -pres の後半要素は不詳です。pretium（値段）と同根とする説があり、ここでは推定として preci に分類しています。",
    claims: [
      { stance: "adopted", text: "inter + -pres。後半要素は不詳である。", refs: [{ src: "OED", loc: "s.v. *interpret*" }] },
      { stance: "alternative", text: "pretium（値段）と同根とする。", refs: [{ src: "deVaan2008", loc: "s.v. *interpres*" }] },
    ],
    verified: null,
  },
  {
    target: "w:explore", kind: "disputed",
    summary: "ex + plōrāre（叫ぶ）で、狩りの用語だったとする古来の説明がありますが、plōrāre との関係は不確かだとされます。",
    claims: [
      { stance: "adopted", text: "ex + plōrāre（叫ぶ）。狩りの用語とする古来の説明。", refs: [{ src: "ErnoutMeillet", loc: "s.v. *explōrō*" }] },
      { stance: "alternative", text: "plōrāre との関係は不確かである。", refs: [{ src: "deVaan2008", loc: "s.v. *plōrō*" }] },
    ],
    verified: null,
  },
  {
    target: "w:genuine", kind: "disputed",
    summary: "gignere（生む）の語根とするのが一般的ですが、genū（膝）に由来し、父が新生児を膝に置いて認知した慣習によるとする説もあります。",
    claims: [
      { stance: "adopted", text: "gignere（生む）の語根に由来する。", refs: [{ src: "OED", loc: "s.v. *genuine*" }] },
      { stance: "alternative", text: "genū（膝）に由来する。父が新生児を膝に置いて認知した慣習による。", refs: [{ src: "ErnoutMeillet", loc: "s.v. *genuīnus*" }] },
    ],
    verified: null,
  },
  {
    target: ["w:standard", "w:standardize"], kind: "disputed",
    summary: "フランク語 *standhard（しっかり立つ）とする説と、ラテン語 extendere（広げる）から古フランス語 estendre を経たとする説があります。",
    claims: [
      { stance: "adopted", text: "フランク語 *standhard（しっかり立つ）に由来する。", refs: [{ src: "FEW", loc: "s.v. *standhard*" }, { src: "TLFi", loc: "s.v. *étendard*" }] },
      { stance: "alternative", text: "ラ extendere（広げる）→ 古仏 estendre に由来する。", refs: [{ src: "OED", loc: "s.v. *standard*" }] },
    ],
    verified: null,
  },
  {
    target: "w:dispatch", kind: "uncertain",
    summary: "スペイン語 despachar／イタリア語 dispacciare に由来しますが、後半要素は不詳です。pedica（足かせ）説と *pactāre（固定する）説があり、ped は推定です。",
    claims: [
      { stance: "adopted", text: "西 despachar／伊 dispacciare に由来する。後半要素は不詳である。", refs: [{ src: "OED", loc: "s.v. *dispatch*" }] },
      { stance: "alternative", text: "pedica（足かせ）説と *pactāre（固定する）説がある。", refs: [{ src: "CorominasPascual", loc: "s.v. *despachar*" }] },
    ],
    verified: null,
  },
  {
    target: "w:embarrass", kind: "disputed",
    summary: "barra（棒）+ in- とする説と、ポルトガル語 baraço（縄）に由来するとする説があります。",
    claims: [
      { stance: "adopted", text: "barra（棒）+ in- に由来する。", refs: [{ src: "TLFi", loc: "s.v. *embarrasser*" }] },
      { stance: "alternative", text: "ポルトガル語 baraço（縄）に由来する。", refs: [{ src: "OED", loc: "s.v. *embarrass*" }, { src: "CorominasPascual", loc: "s.v. *embarazar*" }] },
    ],
    verified: null,
  },
  {
    target: "w:concierge", kind: "uncertain",
    summary: "俗ラテン語 *cōnservius ← cōnservus（仲間の奴隷）とする説明がありますが、語源不詳とする辞典もあります。serv は推定です。",
    claims: [
      { stance: "adopted", text: "俗ラ *cōnservius ← cōnservus（仲間の奴隷）に由来する。", refs: [{ src: "TLFi", loc: "s.v. *concierge*" }] },
      { stance: "alternative", text: "語源不詳である。", refs: [{ src: "OED", loc: "s.v. *concierge*" }] },
    ],
    verified: null,
  },
  {
    target: ["w:compile", "w:compilation"], kind: "disputed",
    summary: "com + pīlāre（押し固める・積む）とする説がありますが、compīlāre の原義は「略奪する」で、pīla との関係は不確かだとされます。",
    claims: [
      { stance: "adopted", text: "com + pīlāre（押し固める・積む）に由来する。", refs: [{ src: "ErnoutMeillet", loc: "s.v. *compīlō*" }] },
      { stance: "alternative", text: "ラ compīlāre の原義は「略奪する」で、pīla との関係は不確かである。", refs: [{ src: "deVaan2008", loc: "s.v. *compīlō*" }, { src: "OED", loc: "s.v. *compile*" }] },
    ],
    verified: null,
  },
  {
    target: "m:velop", kind: "uncertain",
    summary: "古フランス語 voloper（包む）より先は不詳です。俗ラテン語 *faluppa（わら束）に遡るとする説もあります。",
    claims: [
      { stance: "adopted", text: "古仏 voloper（包む）に由来する。その先は不詳である。", refs: [{ src: "OED", loc: "s.v. *develop*" }, { src: "TLFi", loc: "s.v. *développer*" }] },
      { stance: "alternative", text: "俗ラ *faluppa（わら束）に遡るとする説がある。", refs: [{ src: "FEW", loc: "s.v. *faluppa*" }] },
    ],
    verified: null,
  },
  {
    target: "m:lai", kind: "uncertain",
    summary: "古フランス語 delaier は des- + laier（残す）ですが、laier の起源は不詳です。",
    claims: [
      { stance: "adopted", text: "古仏 delaier は des- + laier（残す）である。", refs: [{ src: "TLFi", loc: "s.v. *délai*" }] },
      { stance: "adopted", text: "laier の起源は不詳である。", refs: [{ src: "OED", loc: "s.v. *delay*" }] },
    ],
    verified: null,
  },
  {
    target: ["w:refuse", "w:refusal"], kind: "disputed",
    summary: "俗ラテン語 *refūsāre ← refundere（注ぎ返す）とする説と、recūsāre と refūtāre の混交とする説があります。",
    claims: [
      { stance: "adopted", text: "俗ラ *refūsāre ← refundere（注ぎ返す）に由来する。", refs: [{ src: "OED", loc: "s.v. *refuse* v." }] },
      { stance: "alternative", text: "recūsāre と refūtāre の混交である。", refs: [{ src: "TLFi", loc: "s.v. *refuser*" }] },
    ],
    verified: null,
  },
  {
    target: "w:apparel", kind: "disputed",
    summary: "apparāre（準備する）の派生とする説と、俗ラテン語 *appariculāre ← pār（等しい）とする説があります。",
    claims: [
      { stance: "adopted", text: "apparāre（準備する）の派生である。", refs: [{ src: "OED", loc: "s.v. *apparel*" }] },
      { stance: "alternative", text: "俗ラ *appariculāre ← pār（等しい）に由来する。", refs: [{ src: "TLFi", loc: "s.v. *appareiller*" }] },
    ],
    verified: null,
  },
  {
    target: "w:logistics", kind: "blend",
    summary: "仏 logistique ← loger（宿営させる）に、ギリシャ語 logistikē（計算術）の影響が重なったとされます。",
    claims: [
      { stance: "adopted", text: "仏 logistique ← loger（宿営させる）に由来する。", refs: [{ src: "OED", loc: "s.v. *logistics*" }] },
      { stance: "alternative", text: "ギ logistikē（計算術）の影響を受けた。", refs: [{ src: "TLFi", loc: "s.v. *logistique*" }] },
    ],
    verified: null,
  },
  {
    target: ["m:nota", "m:nosc"], kind: "disputed",
    summary: "nota（しるし）と nōscere（知る）を同根とする伝統的な説明がありますが、母音の長短が合わないため、ここでは別の語根として扱っています。",
    claims: [
      { stance: "adopted", text: "母音の長短が合わず、nota と nōscere は別語である。", refs: [{ src: "deVaan2008", loc: "s.v. *nota*" }] },
      { stance: "alternative", text: "nota（しるし）と nōscere（知る）を同根とする。", refs: [{ src: "ErnoutMeillet", loc: "s.v. *nota*" }] },
    ],
    verified: null,
  },
]);
```

件数の内訳: 既存注記の移行 19（adjust は C-0、trivial は B-8 の文面）＋ A-1・A-2・B-4 の 3 ＋ C-1〜C-18 の 18 = 40。

## 6. 表示の変更（`js/app.js`、`index.html`、`css/style.css`）

### 6.1 共通ヘルパー（app.js）

```js
const KIND_LABEL = { disputed: "諸説あり", uncertain: "語源不詳（推定を含む）", blend: "二つの語が合流", spelling: "綴りは後世の変更" };
const STANCE_LABEL = { adopted: "採用", alternative: "対立説", rejected: "通俗語源" };
const STANCE_ORDER = ["adopted", "alternative", "rejected"];
```

- `evidenceForWord(w)`: `LATIEN.evidence` から、`w:${w.w}` を targets に含む、または `m:${id}` を含み `realParts(w)` にその id があるもの。`forms` が空でない場合は、`m:` への該当を「その id で綴りが forms に含まれる part が w にある」ときに限る（綴りは `[t, id]` の `t`）。重複（同一オブジェクト）は除く。結果は配列。
- `evidenceForMorpheme(id)`: targets に `m:${id}` を含むもの（forms は問わない）。
- `refHtml(ref)`: `LATIEN.sources[ref.src]` の `label`（無ければ id）と `loc` を表示。`loc` 中の `*...*` は `<em>` に変換（先に `esc()` する）。`<a href="#/sources/${encodeURIComponent(ref.src)}">` でリンクにする。
- `evidenceHtml(list)`: 各項目を `<div class="ev ev-${kind}">` で表示。
  - 1 行目: `<p class="note"><span class="ev-kind">${KIND_LABEL}</span> ${esc(summary)}</p>`。
  - **`verified` が truthy のときだけ**、その下に `<details class="ev-claims"><summary>根拠を見る</summary>…</details>`。中は `claims` を STANCE_ORDER の順に並べた `<ol>`。各項目は `<span class="stance ${stance}">${STANCE_LABEL}</span>` ＋ 本文 ＋ 末尾に出典（`refHtml` を `、` で連結）。確認日 `verified` も `（原典確認: YYYY-MM-DD）` と小さく添える。
  - **`verified` が null のときは `<details>` も出典も一切出さない。**
- テスト用に `LATIEN.debug = { makeQuestion, WORD_MAP, evidenceForWord }` を公開してよい（IIFE の最後で代入）。

### 6.2 R3 単語ページ

「原意から読む」パネルの `${notesHtml(w)}` を `${evidenceHtml(evidenceForWord(w))}` に置き換える。`notesHtml` と `MORPHEMES[id].note` / `w.note` の参照はすべて削除。

### 6.3 R4 パーツのブロックとパーツページ

- `blockHtml(text, id)`: `m.note` の代わりに `evidenceForMorpheme(id)` を使う。ただし単語ページでは `text` を受けて、`forms` 限定の項目は綴り `text` が forms にあるときだけ数える（`evidenceForWord` と同じ規則）。該当する項目があれば `<span class="b-note">※ ${KIND_LABEL[先頭の kind]}</span>`。
- `viewPart(id)`: パンくずとブロックの下に、`evidenceForMorpheme(id)` があれば `<div class="panel"><h3>語源について</h3>${evidenceHtml(...)}</div>` を表示。

### 6.4 R5 出典一覧ページ

- ルート `^#\/sources(?:\/(.+))?$` を追加。`viewSources(focusId)`: 見出し「出典一覧」と、種別ごと（論文 `paper` → 辞書 `dictionary` → 一次史料 `primary`、空の種別は出さない）の `<ul>`。各 `<li id="src-${id}">` に略称（太字）・書誌・出版者・年・URL（あれば `target="_blank" rel="noopener"` のリンク）。`focusId` があれば該当行に `class="focus"` を付け `scrollIntoView`。
- 「どの項目の根拠が原典確認済みか」を示す一文を置く：「原典確認日が記録された項目だけ、単語ページの『根拠を見る』に出典が表示されます。」
- `render()` の `section` 判定: `#/sources` ではどのナビも active にしない。
- `index.html` のフッターに `<a href="#/sources">出典一覧</a>` を置く。

### 6.5 R6 テストと単語帳

- `blockedForPartQuiz(w)`: `evidenceForWord(w)` に `kind === "uncertain"` が 1 件でもあれば true。
- `makeQuestion(w, kind)`: 種類が `part` で `blockedForPartQuiz(w)` が true なら出題しない。`mix` のときは `["meaning","word","part"]` から part を除いて選ぶ。種類が `part` と明示されて渡された場合は `meaning` に落とす（再挑戦のため）。
- テスト設定画面: 出題形式が `part` のとき、出題対象の単語プールから `blockedForPartQuiz` の単語を除く（`updateN` の件数表示と、開始時の `pool` の両方）。
- 答え合わせ（`choose` の `feedback`）に、`evidenceForWord(q.w)` の各項目について `<p class="note"><span class="ev-kind">${種別ラベル}</span> ${summary}</p>` を表示（**summary だけ。claims・出典は出さない**）。
- 単語帳の裏面（`runCards` の `back`）に、`evidenceForWord(w)` の種別ラベルを `<span class="ev-kind">` で表示（複数あれば重複を除いて並べる）。

### 6.6 R7 文言

- `index.html` フッター: 「諸説ある語源には「※ 諸説あり」と注記しています。」→ 「学説が分かれる語源や語源不詳のものには注記を付けています。参考文献は<a href="#/sources">出典一覧</a>をご覧ください。」
- `README.md`: 機能一覧に出典一覧ページを足す。「諸説ある語源は、単語行の 9 番目…」の段落を削除し、新しい節「## 論拠・出典」を書く。内容は次の通り: `js/data/sources.js` の書式（3 章）、`js/data/evidence.js` の書式（5 章の冒頭の説明）、`verified` の運用（原典の該当見出しを確認した日付だけを入れる。未確認は `null` で、画面には種別ラベルと要約だけが出る。確認の結果が要求書と異なる場合は原典に合わせて `claims` を直す）、出典に使ってよいのは 3 種別のみで Wikipedia・Etymonline・個人サイト・学習参考書・AI の出力は出典にしないこと、`node tools/validate.js` の使い方、`node tests/integration.js` の使い方（Playwright が必要）。単語・パーツの書式説明も 8 / 6 フィールドに直す。

### 6.7 CSS

`.ev`（間隔）、`.ev-kind`（小さなラベル。色は既存のトーンに合わせ、`.b-note` と同系統）、`details.ev-claims`（`summary` はクリック可能と分かる見た目）、`.stance` と `.stance.adopted/.alternative/.rejected`（3 種を色またはバッジで区別）、`.refs`、出典一覧の `li.focus`（強調）を追加。ダークテーマ等がある場合は既存の変数を使う。

## 7. 検証ツール `tools/validate.js`（新規、Node 標準機能のみ）

- `js/data/` の `morphemes.js`・`words-*.js`・`sources.js`・`evidence.js` を `vm` で読む。**`core.js` は読み込まず**、`addMorphemes`・`addWords`・`addSources`・`addEvidence` を持つ検証用のスタブ `LATIEN` を渡す（スタブは重複を投げずに全行を記録する。パーツ行にはファイル名と行番号を付ける）。
- 検査（エラー 1 件以上で `process.exit(1)`、0 件なら 0）:

| 検査 | 重大度 |
|---|---|
| パーツ ID の重複（定義位置を 2 か所とも表示） | エラー |
| 単語が参照するパーツ ID が未定義（`_` を除く） | エラー |
| パーツの綴りを連結した結果が単語と一致しない | エラー |
| 単語行が 8 フィールド超、パーツ行が 6 フィールド超（旧注記フィールドの残り） | エラー |
| 出典の種別が `paper`/`dictionary`/`primary` 以外、id の重複 | エラー |
| evidence の `target` が `w:`/`m:` で始まらない、または対象の単語・パーツが未定義 | エラー |
| `refs.src` が sources に無い | エラー |
| `claims` が空、または `refs` が空の claim | エラー |
| `kind` / `stance` が規定外 | エラー |
| `verified` が null でも `YYYY-MM-DD` でもない | エラー |
| `forms` の綴りが、その `m:` 対象を含むどの単語にも現れない | エラー |
| 単語中の綴りがパーツの「英単語中の形」に載っていない | 警告（件数のみ表示、`--verbose` で全件） |
| `verified` が null の件数 | 情報 |

- 最後に 1 行の要約を出す（例: `validate: 3200 words, 846 morphemes, 10 sources, 40 evidence | errors 0, warnings 588, unverified 40`）。エラーは標準エラーに 1 行 1 件、日本語で出す。
- 既存データに現在 588 件の「形の不一致」警告がある。これはエラーにしない（今回は直さない）。

## 8. CI `.github/workflows/validate.yml`（新規）

`on: push`、ubuntu-latest、`actions/checkout@v4`、`actions/setup-node@v4`（node 20）、`node tools/validate.js`。

## 9. 結合テスト `tests/integration.js`（新規）

- `const { chromium } = require('playwright');`、`chromium.launch()`（オプションなし）。`index.html` は `file://` で開く。
- 標準の `assert` は使わず、自前の `check(name, cond)` で PASS/FAIL を数え、最後に `integration: N passed, M failed` を出して、失敗があれば終了コード 1。
- 未確認の本番データ用と、確認済みを模した**一時コピー**用の 2 つのページを使う。一時コピーは `os.tmpdir()` 下に `index.html`・`css/`・`js/` をコピーし、コピー側の `js/data/evidence.js` の末尾に次を追記して作る（元ファイルは変更しない）。終了時に削除する。

```js
LATIEN.evidence.forEach(function (e) { if (e.targets.indexOf("w:propose") >= 0) e.verified = "2026-01-01"; });
```

検査項目（要求書 5.5 の 1〜7 に対応）:

**5.5-1** `#/w/actor` と `#/w/doctor` の `a[href="#/p/or"]` ブロック内に「～する人・もの」。`#/w/mental` の `a[href="#/p/mentis"]` の `.b-meaning` が「心」。あわせて、`#/w/oral` が `#/p/oris`（口）、`#/p/or` のページに接尾辞が表示されること。

**5.5-2** 修正が反映されていること: membership → `#/p/membr`／article → `#/p/artus`／landmark → `#/p/e_mark`／advance に `#/p/ad` へのブロックが無く `#/p/avant` がある／device → `#/p/dis`／empathy → `#/p/en_gr`／archive に `#/p/ive` へのブロックが無い／cargo のページに「スペイン語経由」／apartment, corridor, disaster に「イタリア語経由」／adjust → `#/p/iuxt`／perform → `#/p/furn`／serve → `#/p/servire`、reserve → `#/p/servare`／note → `#/p/nota`、notice → `#/p/nosc`／province → `#/p/provinc`。さらに子プロセスで `node tools/validate.js` を実行して終了コード 0。

**5.5-3** `#/w/propose` に「二つの語が合流」と、C-1 の summary 全文（「意味はラテン語 pōnere（置く）、語形は後期ラテン語 pausāre（休む ← ギリシャ語 pausis）に由来します。」）が表示される。`#/w/position`、`#/w/deposit`、`#/w/component` には `.ev` が存在しない。

**5.5-4**（一時コピー側）`#/w/propose` に `details.ev-claims` があり、開く前から `summary` テキスト「根拠を見る」が見える。`open` してから「採用」と「対立説」のバッジがそれぞれ表示され、それぞれの項目に出典（`OED`、`TLFi`）が含まれる。出典リンクを click すると `location.hash` が `#/sources` で始まり、「出典一覧」見出しが表示される。

**5.5-5**（本番データ側）`#/w/propose` に `details` が無く、本文に `s.v.` も `OED` も含まれない。

**5.5-6** `LATIEN.debug.makeQuestion` を `page.evaluate` で使い、province・dispatch・concierge について `kind="part"` で各 200 回生成して、一度も「の原意は？」で終わる prompt が出ない。`kind="mix"` でも同様。さらに、画面操作で「テスト → パーツの原意 → レベル 990 → 50 問」を開始し、50 問すべての prompt に `province` `dispatch` `concierge` が現れないこと（問題を順に答えて進める）。

**5.5-7**
- 次の 17 件の文面（移行前の注記）が、その単語またはパーツのページに表示される（部分一致でよい。全文は本書 5 章の `evidence.js` の `summary` と同じ）:
  mortgage／salary／recover／average／delicate／fee／hazard／seasonal／toll の各単語ページ、sider（`#/w/consider`）／lic（`#/w/delicious`）／avarie（`#/w/average`）／bargain（`#/w/bargain`）／e_flaw（`#/w/flaw`）／hasard（`#/w/hazard`）／satio（`#/w/seasonal`）／telos（`#/w/toll`）のパーツ注記。
- adjust と trivial は新しい文面（`adiuxtāre` を含む／`古典期` を含む）が表示される。
- データファイルに旧注記フィールドが残っていない（全単語行 ≤ 8 フィールド、全パーツ行 ≤ 6 フィールド）。
- `LATIEN.words` の要素に `note` プロパティが無い。
- 19 件それぞれに対応する evidence が存在する（`LATIEN.evidence` の targets に、上の対象が含まれる）。

**ローダー**: `core.js` を `vm` で読み、同じ ID の `addMorphemes` を 2 回呼ぶと例外が出ること、`addEvidence` に文字列と配列の `target` を渡すと `targets` が常に配列になること。

**その他の画面**: `#/sources` に 10 件の出典が種別ごとに表示され、`#/sources/OED` で該当行に `.focus` が付く。トップページ・`#/parts`・`#/cards`・`#/test` を開いて、`pageerror` と `console.error` がゼロ。

## 10. 作業順序

1. `core.js` を改修（重複検出・note 廃止・`addSources`/`addEvidence`）。`tools/validate.js` の骨格を作る。
2. 4.1〜4.3 のデータ修正と、1 章の注記フィールド削除。`node tools/validate.js` でエラー 0 を確認。
3. `sources.js`・`evidence.js` を作り、`index.html` に script を足す。validate を再実行。
4. `app.js`・`css`・`index.html`・`README.md` の表示変更。
5. `tests/integration.js` と CI ワークフロー。
6. `node tools/validate.js` と `node tests/integration.js` を実行し、失敗があれば直して再実行。両方成功するまで繰り返す。

## 11. 完了報告に含めること

- 変更したファイルと件数。
- `node tools/validate.js` と `node tests/integration.js` の最終出力（要約行）。
- 本書と異なる実装をした箇所とその理由（あれば）。
