# 設計変更要求書：語源分解の評価結果と「論拠表示」機能

- 対象: Latien（`js/data/morphemes.js`、`js/data/words-01〜17.js`、`js/app.js`、`js/data/core.js`）
- 対象データ: 単語 3,200 語、パーツ 834 個（接頭辞 63・語根 732・接尾辞 39）
- 作成日: 2026-11-15
- 状態: 要求（未実装）

## 1. 要約

全 3,200 語の分解を語根ごとに通読して評価した。結論は次の 4 点。

1. **大半（約 3,000 語）は標準的な語源辞典の記述と整合しており、変更不要。** improve を probāre ではなく prou に、surround を round ではなく superundāre に、condition を dare ではなく condīcere に結びつけるなど、誤りやすい語も正しく処理されている。
2. **データ不具合が 2 件あり、80 語で誤った原意が表示されている（最優先）。** パーツ ID `or` と `ment` が二重定義され、後の定義が前の定義を上書きしている。
3. **語源上の誤りが 9 項目（約 26 語）ある。** 修正内容を 3 章に示す。
4. **学界で見解が分かれる、または語源不詳の項目が、既存の注記 19 件に加えて新たに 19 項目（約 70 語）ある。** 現在の注記は出典のない 1 行の文章で、表示ラベルも「※ 諸説あり」の 1 種類しかない。賛否それぞれの論拠と出典を表示できるよう、5 章の設計変更を要求する。

### 評価方法と限界

- 全語を語根 ID ごとにまとめて通読し、(a) 語根の同定、(b) 接頭辞・接尾辞の同定、(c) 経路（`la`/`fr`/`it`/`es`/`gr`/`en`）を、6 章の参考文献の記述と照合した。
- **出典は見出し語単位（s.v.）で示しており、このセッション中に原典の該当箇所を開いて確認したものではない。** 争点のある 8 語（standard、embarrass、concierge、compile、dispatch、province、interpret、explore）だけは外部の二次資料で記述の一致を確認した。
- したがって 4 章の出典はすべて「未検証」として登録し、原典確認後に検証済みへ変更する運用を 5.3 で要求する。

## 2. データ不具合（優先度 P0）

`core.js` の `addMorphemes` は ID をキーに代入するだけなので、同じ ID が 2 回定義されると後の定義が黙って勝つ。

| ID | 先の定義 | 後の定義（現在有効） | 影響 |
|---|---|---|---|
| `or` | `morphemes.js:298` 接尾辞 -or / -ātor「～する人・もの」 | `words-16.js:7` 語根 ōs / ōris「口」 | actor、doctor、director、visitor など **76 語**で -or が「口」と表示される。パーツ一覧から接尾辞 -or が消え、テスト「パーツの原意」でも「口」が正解になる |
| `ment` | `morphemes.js:169` 語根 mēns / mentis「心」 | `morphemes.js:287` 接尾辞 -mentum「～すること」 | mental、mentally、mention、comment の **4 語**で語根が接尾辞として表示される。語根「心」のパーツページが存在しない |

要求:

- 語根 ōs / ōris の ID を `oris` に、語根 mēns / mentis の ID を `mentis` に変更し、oral、mental、mentally、mention、comment の 5 語のパーツ指定を更新する。
- `addMorphemes` は ID の重複を検出したら例外を投げる（5.4 の検証ツールでも検出する）。

## 3. 修正を要する分解（優先度 P1）

| # | 対象語 | 現状 | 問題 | 修正 | 出典 |
|---|---|---|---|---|---|
| B-1 | membership | `member:memor`（覚えている） | member はラ membrum（肢・構成員）で memor と無関係。remember の -member は memor で正しい | 語根 `membr`（ラ membrum 肢 → 一員）を新設 | OED s.v. *member*; de Vaan 2008 s.v. *membrum* |
| B-2 | article | `art`（ars 技術） | ラ articulus は artus（関節）の指小形。ars とは別語（印欧祖語では同根） | 語根 `artus`（ラ artus 関節）を新設。artificial・artist・artwork は現状のまま | OED s.v. *article*; de Vaan 2008 s.v. *artus* |
| B-3 | landmark、trademark、benchmark、markup | `mark:marq`（仏 marquer） | 英語本来語 mark（古英 mearc 境界・しるし）。仏 marquer 自体がゲルマン語からの借用 | 語根 `e_mark`（古英 mearc）を新設。remark・remarkable は `marq` のままとし、パーツ側に「ゲルマン語起源」と明記 | OED s.v. *mark* n.1; TLFi s.v. *marquer* |
| B-4 | advance、advanced、advantage、disadvantage | 接頭辞 `ad`（～へ） | 古仏 avancier ← 俗ラ *abanteāre（ab + ante）。d は 16 世紀にラ ad- と誤解して挿入された綴り | `adv` 全体を `avant` の綴りとし、ad- を接頭辞として表示しない。注記種別は「綴り」 | OED s.v. *advance* v.; TLFi s.v. *avancer* |
| B-5 | device、devise | 接頭辞 `de`（下へ） | 俗ラ *dīvīsāre ← dīvidere（dis- + -videre）。divide は `di:dis` で登録済みで不整合 | `de:dis` に変更 | OED s.v. *devise* v.; de Vaan 2008 s.v. *dīvidō* |
| B-6 | empathy、emphasis、emphasize、energy、energetic、enthusiasm、enthusiastic | 接頭辞 `en`（古仏 en- ← ラ in） | ギリシャ語の前置詞 en（ἐν）。フランス語の en- ではない | 接頭辞 `en_gr`（ギ en 中に）を新設 | Beekes 2010 s.v. *ἐν*; OED 各語 |
| B-7 | archive | 接尾辞 `ive`（ラ -īvus） | ギ arkheion → 後期ラ archīvum。語尾はラ -īvus 由来の形容詞接尾辞ではない | `ive` をつなぎ字扱い（`ive:_`）にし、語源欄に経路を記載 | OED s.v. *archive*; TLFi s.v. *archives* |
| B-8 | trivial（既存注記） | 「三叉路の → ありふれた、は後付けだとする見方もある」 | ラ triviālis（三叉路の → ありふれた）は古典期からある語義で後付けではない。英語での初出が中世の三学科（trivium）を指す用法だった、というのが正確 | 注記を書き直し、4 章の形式で出典を付ける | OED s.v. *trivial*; Lewis & Short s.v. *trivialis* |
| B-9 | cargo／apartment、corridor、disaster | 経路 `la`／`fr` | cargo はスペイン語 cargo。apartment（伊 appartamento）、corridor（伊 corridore）、disaster（伊 disastro）はイタリア語から仏語経由 | cargo を `es`、他 3 語を `it` に変更し語源欄に明記 | OED 各語; TLFi s.v. *appartement*, *corridor*, *désastre* |

adjust は現在 `jur`（iūs 法）に分類され注記が付いている。OED は adiuxtāre（ad + iuxtā そばに）を起源とし、justus は後からの連想とするため、**主分解を iuxtā に変更し、justus は対立説ではなく「後世の連想」として表示する**ことを推奨する（4 章 C-0）。

## 4. 見解が分かれる項目（論拠表示の対象、優先度 P1）

種別は 5.1 の `kind` に対応する。「採用」は Latien の分解として表示する説、「対立」は併記する説。

### 4.1 新たに注記が必要な項目

| # | 対象 | 種別 | 採用する説と論拠 | 対立する説と論拠 | 推奨 |
|---|---|---|---|---|---|
| C-0 | adjust、adjustment、adjustable | 混交 | 後期ラ adiuxtāre（ad + iuxtā）— OED s.v. *adjust* | 仏 ajuster（à + juste ← iūstus）の影響 — TLFi s.v. *ajuster* | 主分解を iuxtā に変更 |
| C-1 | pose、propose、proposal、purpose、oppose、compose、expose、exposure、dispose、disposable、disposal、impose、suppose（13 語） | 混交 | 意味はラ pōnere（置く）を継承 — OED s.v. *pose* v.1 | 語形は後期ラ pausāre（休む ← ギ pausis）。仏 poser が pōnere の複合語を置き換えた — TLFi s.v. *poser*; FEW s.v. *pausare* | `pon` のまま。pose 形に限って注記（position、component、deposit などには付けない） |
| C-2 | allow、allowance | 混交 | ラ allocāre（割り当てる） | ラ allaudāre（ほめる）。古仏 alouer で両者が合流 — いずれも OED s.v. *allow*; AND s.v. *alouer* | 両説を並記 |
| C-3 | add、addition、additional、additionally | 諸説 | ad + dare（与える）— Lewis & Short s.v. *addo* | -dere は印欧祖語 *dʰeh₁-（置く）で dare とは別語根 — de Vaan 2008 s.v. *dō* | 両説を並記。edit・tradition・render は dare で問題なし |
| C-4 | province | 不詳 | 語源不詳 — OED s.v. *province*; de Vaan 2008 s.v. *prōvincia* | prō + vincere（征服した地）は最古の用法に合わない通俗的説明 — Ernout & Meillet s.v. *prōvincia* | `vinc` から外し、単独語根 `provinc` にする |
| C-5 | interpret、interpreter | 不詳 | inter + -pres。後半要素は不詳 — OED s.v. *interpret* | pretium（値段）と同根とする説 — de Vaan 2008 s.v. *interpres* | `preci` は維持し「推定」と表示 |
| C-6 | explore | 諸説 | ex + plōrāre（叫ぶ）。狩りの用語とする古来の説明 — Ernout & Meillet s.v. *explōrō* | plōrāre との関係は不確か — de Vaan 2008 s.v. *plōrō* | 両説を並記 |
| C-7 | genuine | 諸説 | gignere（生む）の語根 — OED s.v. *genuine* | genū（膝）。父が新生児を膝に置いて認知した慣習から — Ernout & Meillet s.v. *genuīnus* | 両説を並記 |
| C-8 | standard、standardize | 諸説 | フランク語 *standhard（しっかり立つ）— FEW s.v. *standhard*; TLFi s.v. *étendard* | ラ extendere（広げる）→ 古仏 estendre — OED s.v. *standard* | 両説を並記 |
| C-9 | dispatch | 不詳 | 西 despachar／伊 dispacciare。後半要素は不詳 — OED s.v. *dispatch* | pedica（足かせ）説と *pactāre（固定する）説 — Corominas & Pascual s.v. *despachar* | `ped` は「推定」と表示 |
| C-10 | embarrass | 諸説 | barra（棒）+ in- — TLFi s.v. *embarrasser* | ポルトガル語 baraço（縄）— OED s.v. *embarrass*; Corominas & Pascual s.v. *embarazar* | 両説を並記 |
| C-11 | concierge | 不詳 | 俗ラ *cōnservius ← cōnservus（仲間の奴隷）— TLFi s.v. *concierge* | 語源不詳 — OED s.v. *concierge* | `serv` は「推定」と表示 |
| C-12 | compile、compilation | 諸説 | com + pīlāre（押し固める・積む）— Ernout & Meillet s.v. *compīlō* | ラ compīlāre の原義は「略奪する」で、pīla との関係は不確か — de Vaan 2008 s.v. *compīlō*; OED s.v. *compile* | 両説を並記 |
| C-13 | develop、developer、development、envelope | 不詳 | 古仏 voloper（包む）。その先は不詳 — OED s.v. *develop*; TLFi s.v. *développer* | 俗ラ *faluppa（わら束）説 — FEW s.v. *faluppa* | パーツ `velop` に注記 |
| C-14 | delay | 不詳 | 古仏 delaier（des- + laier 残す）— TLFi s.v. *délai* | laier の起源は不詳 — OED s.v. *delay* | パーツ `lai` に注記 |
| C-15 | refuse、refusal | 諸説 | 俗ラ *refūsāre ← refundere（注ぎ返す）— OED s.v. *refuse* v. | recūsāre と refūtāre の混交 — TLFi s.v. *refuser* | 両説を並記 |
| C-16 | apparel | 諸説 | apparāre（準備する）の派生 — OED s.v. *apparel* | 俗ラ *appariculāre ← pār（等しい）— TLFi s.v. *appareiller* | 両説を並記 |
| C-17 | logistics | 混交 | 仏 logistique ← loger（宿営させる）— OED s.v. *logistics* | ギ logistikē（計算術）の影響 — TLFi s.v. *logistique* | 両説を並記 |
| C-18 | note、noted、notable、notably、keynote、notebook | 諸説 | nota（しるし）と nōscere（知る）を同根とする伝統的説明 — Ernout & Meillet s.v. *nota* | 母音の長短が合わず別語 — de Vaan 2008 s.v. *nota* | `not` を `nota`（しるし）と `nosc`（知る: notice、notify、notion）に分割 |
| C-19 | serve、service、server、deserve、dessert ／ reserve、preserve、observe、conservation ほか | 諸説 | servāre（保つ）と servīre（仕える ← servus）を別語根として扱う — de Vaan 2008 s.v. *servō*, *servus* | servus を servāre と同根とする説 — Ernout & Meillet s.v. *servus* | `serv` を `servare` と `servire` に分割 |

### 4.2 既存の注記（出典の付与が必要）

既存の注記 19 件（単語 11、パーツ 8）は内容に問題はないが出典がない。trivial（B-8）と adjust（C-0）以外は文言を変えず、次の出典を付ける。

| 対象 | 出典 |
|---|---|
| salary（塩） | Pliny, *Naturalis Historia* 31.89; OED s.v. *salary*; de Vaan 2008 s.v. *sāl* |
| consider、desire（`sider`） | de Vaan 2008 s.v. *sīdus*; Ernout & Meillet s.v. *sīdus* |
| recover | de Vaan 2008 s.v. *recuperō*; OED s.v. *recover* |
| delicious、delight、delicate（`lic`） | de Vaan 2008 s.v. *laciō*; Ernout & Meillet s.v. *dēliciae* |
| mortgage | OED s.v. *mortgage* |
| average（`avarie`） | OED s.v. *average* n.2; TLFi s.v. *avarie* |
| hazard（`hasard`） | OED s.v. *hazard*; TLFi s.v. *hasard*; Corominas & Pascual s.v. *azar* |
| fee | OED s.v. *fee* n.2; AND s.v. *fé* |
| seasonal（`satio`） | OED s.v. *season*; FEW s.v. *satio* |
| toll（`telos`） | OED s.v. *toll* n.1 |
| bargain | OED s.v. *bargain*; TLFi s.v. *barguigner* |
| flaw（`e_flaw`） | OED s.v. *flaw* n.1 |

### 4.3 検討のうえ変更不要とした例

疑わしく見えるが通説どおりで、注記も不要と判断した。exam（exāmen ← *exag-smen）、office（opus + facere）、necessary（ne + cēdere）、industry（indu- + struere）、council（con + calāre）、prince（prīmus + capere）、colleague・college（lēgāre）、cost（cōnstāre）、pay（pācāre）、obey（ob + audīre）、search（circāre）、arrive（ad + rīpa）。

## 5. 設計変更要求

### 5.1 データモデル

現在の注記は単語行の第 9 フィールドとパーツ行の第 7 フィールドに置く自由文で、次の制約がある。

- 出典を持てない。
- パーツの注記は、そのパーツを含む全単語に表示される。pose の注記を position に出さない、といった綴りの限定ができない。
- 「諸説あり」「語源不詳」「混交」「綴りの由来」を区別できない。

要求: 注記を独立したファイルに分離する。

**R1. 出典台帳 `js/data/sources.js`**

```js
LATIEN.addSources(`
OED|dictionary|Oxford English Dictionary, 3rd ed. (online)|Oxford University Press|2000–|https://www.oed.com/
deVaan2008|dictionary|de Vaan, M. Etymological Dictionary of Latin and the other Italic Languages|Brill|2008|
`);
```

フィールドは `id|種別|書誌|出版者・誌名|年|URL または DOI`。種別は `paper`（査読論文）、`dictionary`（学術的な語源辞典・歴史的原則の辞典）、`primary`（一次史料の校訂版）の 3 つだけとする。

**R2. 論拠データ `js/data/evidence.js`**

```js
LATIEN.addEvidence([
  {
    target: "m:pon",              // "w:単語" または "m:パーツid"
    forms: ["pose"],              // 任意。パーツ注記を適用する綴りを限定
    kind: "blend",                // disputed | uncertain | blend | spelling
    summary: "意味はラテン語 pōnere（置く）、語形は後期ラテン語 pausāre（休む）に由来します。",
    claims: [
      { stance: "adopted", text: "pōnere の複合語の意味を継承した。",
        refs: [{ src: "OED", loc: "s.v. pose, v.1" }] },
      { stance: "alternative", text: "語形は pausāre に由来し、仏 poser が pōnere 系の複合語を置き換えた。",
        refs: [{ src: "TLFi", loc: "s.v. poser" }, { src: "FEW", loc: "s.v. pausare" }] },
    ],
    verified: null,               // 原典確認日（YYYY-MM-DD）。未確認は null
  },
]);
```

- `kind` の表示ラベル: `disputed`＝諸説あり、`uncertain`＝語源不詳（推定を含む）、`blend`＝二つの語が合流、`spelling`＝綴りは後世の変更。
- `stance`: `adopted`＝採用、`alternative`＝対立説、`rejected`＝通俗語源（否定されている）。
- すべての `claim` は `refs` を 1 件以上持つ。
- 既存の第 9 フィールドと第 7 フィールドの注記は `evidence.js` に移し、フィールドは廃止する。

### 5.2 表示

**R3. 単語ページ**: 「原意から読む」パネルの注記を次の構成に置き換える。

- 1 行目に種別ラベルと `summary`。
- その下に折りたたみ「根拠を見る」。開くと `claims` を採用 → 対立説 → 通俗語源の順に並べ、各主張の末尾に出典（例: OED, s.v. *pose*, v.1）を表示する。出典は出典一覧ページの該当行へリンクする。
- `verified` が `null` の項目は `summary` だけを表示し、「根拠を見る」は出さない。

**R4. パーツのブロックとパーツページ**: `b-note` の文言を `kind` のラベルに連動させる。パーツページにも R3 と同じパネルを表示する。`forms` で限定された注記は、該当する綴りの単語にだけ表示する。

**R5. 出典一覧ページ**: ルート `#/sources` を追加し、`sources.js` の全件を種別ごとに表示する。フッターからリンクする。

**R6. テストと単語帳**:

- 「パーツの原意」は、`kind` が `uncertain` のパーツを出題対象から外す。
- それ以外の注記付きの語は出題し、答え合わせの解説に種別ラベルと `summary` を表示する。
- 単語帳の裏面にも種別ラベルを表示する。

**R7. 文言**: トップページの説明文「諸説ある語源には『※ 諸説あり』と注記しています」を、出典一覧へのリンクを含む文に改める。README の「諸説ある語源」の節も新形式に書き換える。

### 5.3 出典の採用基準

**R8.** 表示してよい出典は R1 の 3 種別に限る。Wikipedia、Wiktionary、Etymonline、個人サイト、学習参考書、AI の出力は調査の手がかりには使えるが、出典として登録しない。

**R9.** `verified` は、登録者が原典の該当見出しを確認した日付を入れる。本書 3 章・4 章の出典は見出し語単位の指定であり、すべて `null` で登録してから確認する。確認の結果、記述が本書と異なる場合は原典に合わせて `claims` を修正する。

### 5.4 検証ツール

**R10.** `tools/validate.js`（Node 標準機能のみ）を追加し、次を検査する。エラーが 1 件でもあれば終了コード 1 を返す。

| 検査 | 重大度 |
|---|---|
| パーツ ID の重複 | エラー |
| 単語が参照するパーツ ID が未定義 | エラー |
| パーツの綴りを連結した結果が単語と一致しない | エラー |
| `evidence` の `target`・`refs.src` が未定義、`claims` に `refs` がない、`kind`・`stance` が規定外 | エラー |
| `forms` に指定した綴りがそのパーツを含むどの単語にも現れない | エラー |
| 単語中の綴りがパーツの「英単語中の形」に載っていない | 警告 |
| `verified` が `null` の件数 | 情報 |

**R11.** GitHub Actions でプッシュごとに `node tools/validate.js` を実行する。

### 5.5 受け入れ基準

1. actor、doctor の -or が「～する人・もの」、mental の ment が「心」と表示される。
2. 3 章の 9 項目が修正され、`validate.js` がエラー 0 件で終了する。
3. propose のページに「二つの語が合流」と `summary` が表示され、position のページには表示されない。
4. `verified` に日付がある項目で「根拠を見る」を開くと、採用説と対立説がそれぞれ出典付きで表示され、出典から `#/sources` に移動できる。
5. `verified` が `null` の項目では出典が表示されない。
6. テスト「パーツの原意」で province、dispatch、concierge の語根が出題されない。
7. 既存の注記 19 件がすべて `evidence.js` に移行され、表示内容が失われていない。

### 5.6 実施順序

| 順 | 内容 | 該当 |
|---|---|---|
| 1 | ID 衝突の解消と重複検出 | 2 章、R10 の一部 |
| 2 | 分解の修正 | 3 章 |
| 3 | データモデルと検証ツール | R1、R2、R10、R11 |
| 4 | 表示の変更 | R3〜R7 |
| 5 | 4 章の論拠登録と原典確認 | R8、R9 |

## 6. 参考文献（出典台帳の初期登録候補）

- Anglo-Norman Dictionary (AND2 Online Edition). Aberystwyth University. https://anglo-norman.net/
- Beekes, R. (2010). *Etymological Dictionary of Greek*. Leiden: Brill.
- Corominas, J. & Pascual, J. A. (1980–1991). *Diccionario crítico etimológico castellano e hispánico*. Madrid: Gredos.
- de Vaan, M. (2008). *Etymological Dictionary of Latin and the other Italic Languages*. Leiden: Brill.
- Ernout, A. & Meillet, A. (2001). *Dictionnaire étymologique de la langue latine*, 4e éd. Paris: Klincksieck.
- Lewis, C. T. & Short, C. (1879). *A Latin Dictionary*. Oxford: Clarendon Press.
- *Oxford English Dictionary*, 3rd ed. (online). Oxford University Press. https://www.oed.com/
- Pliny the Elder. *Naturalis Historia*, book 31（校訂版: Mayhoff, Teubner）.
- *Trésor de la langue française informatisé* (TLFi). ATILF – CNRS & Université de Lorraine. https://www.cnrtl.fr/etymologie/
- von Wartburg, W. (1922–2002). *Französisches Etymologisches Wörterbuch* (FEW). https://lecteur-few.atilf.fr/

## 付録: 任意の改善（優先度 P3）

誤りではないが、分解を細かくすると語根のつながりが見えやすくなる。

- assure、ensure、insure、insurance、reassure: `sure:cur` → sē（離れて）+ cūra（sēcūrus）。
- possess、possession: `pos:_` → potis（できる）を語根に。
- period、method: `od:_`／`hod:_` → ギ hodos（道）を語根に。
- symbol: `bol:_` → ギ ballein（投げる）を語根に。
- prestigious: `stigi:_` → praestringere（`string`）。
- double、triple、multiple、simple: -plus／-plex は plicāre の同族語であり、plicāre そのものではない旨をパーツに明記。
- `gage`、`rang`、`gard` など仏語パーツのうちフランク語起源のものは、元の語形欄の書き方を統一する。
