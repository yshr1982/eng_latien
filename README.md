# Latien — 語源で英単語を読む

英単語をラテン語・フランス語・ギリシャ語のパーツ（接頭辞・語根・接尾辞）に分解し、原意から意味を理解するための静的サイトです。

例: `disclose` → `dis-`（離れて・反対に）＋ `close`（ラ claudere 閉じる） → 閉じていたものを開く → 明らかにする

## 機能
- **辞書**: 約3,200語（TOEIC 頻出語中心）。英単語・日本語・パーツの意味で検索。経路（ラテン語から／フランス語経由／イタリア語経由／スペイン語経由／ギリシャ語から／英語本来の語）と TOEIC レベル（600/730/860/990 目安）で絞り込み。未登録の単語は既知のパーツから自動推定
- **例文**: 全単語にコンピュータ科学・物理・線形代数・確率の話題の例文と和訳（単語ページ・単語帳の裏面・テストの解説に表示）
- **パーツ**: 接頭辞・語根・接尾辞の一覧と、各パーツを含む単語
- **出典一覧**: 語源の注記で参照する文献の一覧（`#/sources`）
- **単語帳**: フラッシュカード（ヒント・覚えた記録・マイ単語帳）
- **テスト**: 4択（単語→意味／原意→単語／パーツの原意）。間違えた単語は「苦手」に記録

学習記録はブラウザの localStorage に保存されます。

## 使い方
ビルド不要です。`index.html` をブラウザで開くか、GitHub Pages で公開してください。

## 単語の追加
`js/data/words-*.js` に1行1語で追記します（書式は `words-01.js` の先頭コメント参照）。
新しいパーツは `js/data/morphemes.js`（または各 words ファイル先頭の `LATIEN.addMorphemes`）に追加してください。
例文は `js/data/examples-*.js` に `単語|英文|和訳` の形で追記します。
新しいファイルを作った場合は `index.html` の script タグにも追加します。

TOEIC レベルは学習の目安として付けたもので、公式の分類ではありません。

## 論拠・出典
学説が分かれる語源や語源不詳のものは、`js/data/evidence.js` に登録すると、単語ページとパーツページに種別ラベルと要約が表示されます。

```js
LATIEN.addEvidence([
  {
    target: ["w:propose", "m:pon"],  // "w:単語" または "m:パーツid"（配列で複数指定可）
    forms: ["pose"],                 // 任意。m: の対象に限り、この綴りの単語にだけ適用
    kind: "blend",                   // disputed 諸説あり / uncertain 語源不詳 / blend 二つの語が合流 / spelling 綴りは後世の変更
    summary: "要約（画面に常に表示）",
    claims: [
      { stance: "adopted", text: "採用する説", refs: [{ src: "OED", loc: "s.v. *pose* v.1" }] },
      // stance: adopted 採用 / alternative 対立説 / rejected 通俗語源。refs は1件以上必須
    ],
    verified: null,                  // 原典の該当見出しを確認した日付（YYYY-MM-DD）。未確認は null
  },
]);
```

- `verified` が `null` の項目は種別ラベルと要約だけを表示します。日付を入れると「根拠を見る」が現れ、`claims` と出典が表示されます。日付は、登録者が原典の該当見出しを実際に確認した場合だけ入れてください（確認していない場合は AI を含め入れません）。確認の結果が記述と異なる場合は、原典に合わせて `claims` を直します。
- 出典は `js/data/sources.js` に `id|種別|書誌|出版者・誌名|年|URL|略称` で登録します。種別は `paper`（査読論文）・`dictionary`（学術的な語源辞典）・`primary`（一次史料の校訂版）の3つだけです。Wikipedia・Wiktionary・Etymonline・個人サイト・学習参考書・AI の出力は出典にしません。
- 「パーツの原意」テストは、`uncertain` の注記が付いた単語を出題しません。

### 検証とテスト
- `node tools/validate.js`: パーツ ID の重複、未定義 ID、綴りの不一致、論拠データの不備を検査します（エラーがあれば終了コード 1。GitHub Actions でも実行）。
- `node tests/integration.js`: Playwright でブラウザを起動し、主要な画面と論拠表示を自動検証します。

## 広告の管理（管理者のみ）
広告の内容は `ads.json` に保存され、`admin.html` から編集できます。保存は GitHub API でリポジトリに直接書き込むため、
書き込み権限のあるトークンを持つ管理者だけが変更できます（閲覧者は管理画面を開けても保存できません）。

1. GitHub で Fine-grained personal access token を作成する
   - Repository access: このリポジトリのみ
   - Permissions: Contents を Read and write
2. `https://<ユーザー名>.github.io/eng_latien/admin.html` を開き、トークンを入力して「接続を確認」
3. 枠ごとに「表示する」をオンにし、種類（テキスト／画像バナー／HTML コード）と内容を入力
4. 「GitHub に保存して公開」を押す（1〜2分で反映）

広告枠: ページ上部、辞書の検索結果の上、単語ページの例文の下、単語帳・テストの結果画面、ページ下部。
