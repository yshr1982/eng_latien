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
