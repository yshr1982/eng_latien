// 単語データ
// 1行1語: 単語|意味|品詞|パーツ|原意からの流れ|経路|語源|レベル
//   パーツ: 「綴り:パーツid」を + でつなぐ（綴りとidが同じなら id だけ、つなぎ字は 綴り:_ ）
//   経路: la（ラテン語から） / fr（フランス語経由） / gr（ギリシャ語から） / en（英語本来の語）
//   レベル: 1（TOEIC 600目安） 2（730目安） 3（860目安） 4（990目安）
LATIEN.addWords(`
act|行動、行為；行動する|名・動|act:ag|行われたこと → 行動|la|ラ āctum（agere の過去分詞）|1
action|行動、措置|名|act:ag+ion|行うこと → 行動・措置|la|ラ āctiō|1
active|活動的な、積極的な|形|act:ag+ive|行う性質の → 活動的な|la|ラ āctīvus|1
activity|活動|名|act:ag+iv:ive+ity|行う性質 → 活動|la||1
actor|俳優|名|act:ag+or|演じる人 → 俳優|la|ラ āctor|1
actual|実際の|形|act:ag+u:_+al|行われた → 実際の|la|後期ラ āctuālis|1
actually|実際に|副|act:ag+u:_+al+ly|実際に行われたように → 実際に|la||1
agent|代理人、仲介業者|名|ag+ent|行う人 → 代わりに動く人 → 代理人|la|ラ agēns|2
agency|代理店、機関|名|ag+ency:ance|代わりに行うこと → 代理店|la||2
agenda|議題、協議事項|名|ag+enda:_|行われるべきこと → 議題|la|ラ agenda（なされるべきこと）|2
react|反応する|動|re+act:ag|返して行う → 反応する|la||1
reaction|反応|名|re+act:ag+ion|反応すること|la||1
interact|交流する、相互に作用する|動|inter+act:ag|互いに行う → 相互に作用する|la||3
interaction|交流、相互作用|名|inter+act:ag+ion||la||3
interactive|双方向の|形|inter+act:ag+ive||la||3
transaction|取引|名|trans+act:ag+ion|向こうまでやり通すこと → 取引|la|ラ trānsāctiō|2
exact|正確な|形|ex+act:ag|すっかりやり遂げた → きっちりした → 正確な|la|ラ exāctus（exigere）|2
exactly|正確に、まさに|副|ex+act:ag+ly||la||1
proactive|先を見越した、積極的な|形|pro+act:ag+ive|前もって行う性質 → 先手を打つ|la||3
inactive|活動していない|形|in:inneg+act:ag+ive|活動的でない|la||3
agile|機敏な|形|ag+ile|動かしやすい → 機敏な|la|ラ agilis|4
navigate|操縦する、案内する|動|nav+ig:ag+ate|船を動かす → 操縦する・道を進む|la|ラ nāvigāre|3
navigation|ナビゲーション、航行|名|nav+ig:ag+at:ate+ion||la||3
alter|変える|動|alter|他のものにする → 変える|la|中世ラ alterāre|2
alteration|変更、手直し|名|alter+at:ate+ion||la||3
alternative|代わりの；代案|形・名|alter+n:_+at:ate+ive|他の方を選ぶ → 代わりの|la|中世ラ alternātīvus|2
alternate|交互の；交代する|形・動|alter+n:_+ate|他方と入れ替わる → 交互の|la||3
alternatively|代わりに|副|alter+n:_+at:ate+ive+ly||la||3
animal|動物|名|anim+al|息をするもの → 動物|la|ラ animal|1
animation|アニメーション、活気|名|anim+at:ate+ion|命を吹き込むこと|la||3
unanimous|満場一致の|形|un:uni+anim+ous|一つの心の → 満場一致の|la|ラ ūnanimus|4
annual|年1回の、毎年の|形|ann+u:_+al|年の → 毎年の|la|後期ラ annuālis|2
annually|毎年|副|ann+u:_+al+ly||la||2
anniversary|記念日|名|ann+i:_+vers+ary|年が巡って来る日 → 記念日|la|ラ anniversārius|2
adapt|適応させる、適応する|動|ad+apt|～に適したものにする → 適応させる|la|ラ adaptāre|2
adaptation|適応、翻案|名|ad+apt+at:ate+ion||la||3
adaptable|適応できる|形|ad+apt+able||la||3
adapter|アダプター|名|ad+apt+er|適応させるもの|la||2
aptitude|適性|名|apt+i:_+tude|適している状態 → 適性|la||3
audience|聴衆、観客|名|aud+i:_+ence:ance|聞くこと → 聞く人々 → 聴衆|fr|古仏 audience ← ラ audientia|1
audio|音声の|形|aud+io:_|聞く → 音声の|la|ラ audiō「私は聞く」|1
audit|会計監査；監査する|名・動|aud+it:ate|聞くこと → 報告を聞いて調べる → 監査|la|ラ audītus|3
auditor|監査役|名|aud+it:ate+or||la||3
auditorium|講堂|名|aud+it:ate+or+ium:um|聞く場所 → 講堂|la||3
audible|聞こえる|形|aud+ible:able||la||4
battle|戦い|名|bat+tle:_|打ち合うこと → 戦い|fr|古仏 bataille ← 後期ラ battuālia|2
combat|戦う；戦闘|動・名|com:con+bat|互いに打ち合う → 戦う|fr|古仏 combattre|3
debate|討論；討論する|名・動|de+bate:bat|打ち倒す → 言い負かそうと議論する → 討論|fr|古仏 debatre|2
battery|電池|名|bat+tery:y|打つこと → 大砲の一群 → 連ねたもの → 電池|fr|仏 batterie|1
accident|事故、偶然|名|ac:ad+cid:cad+ent|身に降りかかって来ること → 事故|la|ラ accidēns|1
accidentally|偶然に|副|ac:ad+cid:cad+ent+al+ly||la||2
incident|出来事、事件|名|in+cid:cad+ent|上に降りかかること → 出来事|la||2
coincidence|偶然の一致|名|co:con+in+cid:cad+ence:ance|共に降りかかること → 偶然の一致|la||3
occasion|機会、場合|名|oc:ob+cas:cad+ion|目の前に落ちてくること → 機会|la|ラ occāsiō|2
occasionally|時々|副|oc:ob+cas:cad+ion+al+ly||la||2
case|場合、事例、ケース|名|case:cad|落ちてきたこと → 起きたこと → 場合|fr|古仏 cas ← ラ cāsus|1
casual|形式ばらない、カジュアルな|形|cas:cad+u:_+al|偶然起こった → 気軽な|fr|仏 casuel ← 後期ラ cāsuālis|2
decay|腐敗；衰える|動・名|de+cay:cad|下へ落ちる → 衰える|fr|古北仏 decair|4
chance|機会、可能性|名|chance:cad|落ち方 → 偶然・機会|fr|古仏 cheance ← 俗ラ *cadentia|1
decide|決める|動|de+cide:caed|切り離す → 迷いを断ち切る → 決める|la|ラ dēcīdere|1
decision|決定|名|de+cis:caed+ion||la||1
decisive|決定的な、決断力のある|形|de+cis:caed+ive||la||3
precise|正確な|形|pre+cise:caed|前を切り落とした → 余分がない → 正確な|fr|仏 précis ← ラ praecīsus|3
precisely|正確に|副|pre+cise:caed+ly||fr||3
concise|簡潔な|形|con+cise:caed|すっかり切り詰めた → 簡潔な|la|ラ concīsus|4
capable|能力がある|形|cap+able|つかむことができる → 能力がある|fr|仏 capable ← 後期ラ capābilis|2
capability|能力|名|cap+abil:able+ity||fr||3
capacity|容量、能力|名|cap+ac:_+ity|取り込める量 → 容量|fr|仏 capacité ← ラ capācitās|2
capture|捕らえる、記録する|動|capt:cap+ure|つかむこと → 捕らえる|fr|仏 capture ← ラ captūra|3
accept|受け入れる|動|ac:ad+cept:cap|自分の方へ取る → 受け入れる|la|ラ acceptāre|1
acceptable|受け入れられる|形|ac:ad+cept:cap+able||la||2
acceptance|受諾|名|ac:ad+cept:cap+ance||la||3
except|～を除いて|前|ex+cept:cap|外へ取り出す → 除いて|la|ラ exceptus|1
exception|例外|名|ex+cept:cap+ion||la||2
exceptional|並外れた|形|ex+cept:cap+ion+al||la||3
concept|概念|名|con+cept:cap|すっかりつかみ取ったもの → 概念|la|ラ conceptus|2
perceive|知覚する|動|per+ceive:cap|すっかりつかむ → 知覚する|fr|古北仏 *perceivre ← ラ percipere|3
perception|知覚、認識|名|per+cept:cap+ion||la||3
receive|受け取る|動|re+ceive:cap|こちらへ取り込む → 受け取る|fr|古北仏 receivre ← ラ recipere|1
receipt|領収書|名|re+ceipt:cap|受け取ったもの → 領収書|fr|アングロ仏 receite ← ラ recepta|1
reception|受付、歓迎会|名|re+cept:cap+ion|受け入れること → 受付|la||1
receptionist|受付係|名|re+cept:cap+ion+ist||la||1
recipient|受取人|名|re+cip:cap+i:_+ent|受け取る人|la|ラ recipiēns|3
recipe|レシピ|名|re+cipe:cap|「取れ」（処方の書き出し） → 調理法|la|ラ recipe（recipere の命令形）|1
deceive|だます|動|de+ceive:cap|かすめ取る → だます|fr|古仏 deceivre ← ラ dēcipere|3
anticipate|予期する|動|anti:ante+cip:cap+ate|前もって取る → 予期する|la|ラ anticipāre|2
participate|参加する|動|part+i:_+cip:cap+ate|一部を取る → 参加する|la|ラ participāre|1
participant|参加者|名|part+i:_+cip:cap+ant:ent||la||2
participation|参加|名|part+i:_+cip:cap+at:ate+ion||la||2
occupy|占める|動|oc:ob+cupy:cap|上につかみかかる → 占める|fr|古仏 occuper ← ラ occupāre|2
occupation|職業、占有|名|oc:ob+cup:cap+at:ate+ion|手を占めること → 職業|la||2
capital|首都、資本；主要な|名・形|capit+al|頭の → 首位の → 首都・元手（資本）|la|ラ capitālis|1
chief|最高位の；長|形・名|chief:capit|頭 → 長|fr|古仏 chief ← ラ caput|2
achieve|達成する|動|a:ad+chieve:capit|頭（終わり）に至る → 成し遂げる|fr|古仏 achever|1
achievement|達成、業績|名|a:ad+chieve:capit+ment||fr||2
chapter|章|名|chap:capit+ter:_|小さな頭 → 見出し → 章|fr|古仏 chapitre ← ラ capitulum|2
captain|機長、船長|名|capt:capit+ain:_|頭に立つ人 → 長|fr|古仏 capitain ← 後期ラ capitāneus|2
proceed|進む|動|pro+ceed:ced|前へ行く → 進む|la|ラ prōcēdere|2
procedure|手続き|名|pro+ced+ure|前へ進めるやり方 → 手続き|fr|仏 procédure|2
process|過程、手順；処理する|名・動|pro+cess:ced|前へ進むこと → 過程|fr|古仏 proces ← ラ prōcessus|1
proceeds|収益|名|pro+ceed:ced+s:_|前へ出てきたもの → 収益|la||4
succeed|成功する、後を継ぐ|動|suc:sub+ceed:ced|下から続いて行く → 後を継ぐ → 成功する|la|ラ succēdere|1
success|成功|名|suc:sub+cess:ced||la||1
successful|成功した|形|suc:sub+cess:ced+ful||la||1
successor|後継者|名|suc:sub+cess:ced+or||la||3
exceed|超える|動|ex+ceed:ced|外へ出て行く → 超える|la|ラ excēdere|2
excess|超過|名|ex+cess:ced||la||3
excessive|過度の|形|ex+cess:ced+ive||la||3
precede|先行する|動|pre+cede:ced|先に行く|la|ラ praecēdere|3
precedent|前例|名|pre+ced+ent||la||4
unprecedented|前例のない|形|un+pre+ced+ent+ed||la||4
access|接近、利用；アクセスする|名・動|ac:ad+cess:ced|～へ行くこと → 近づく手段|la|ラ accessus|1
accessible|利用しやすい|形|ac:ad+cess:ced+ible:able||la||3
accessory|付属品|名|ac:ad+cess:ced+ory|付け加わるもの → 付属品|la|中世ラ accessōrius|2
concede|認める、譲る|動|con+cede:ced|すっかり譲る → 認める|la|ラ concēdere|4
concession|譲歩|名|con+cess:ced+ion||la||4
recession|景気後退|名|re+cess:ced+ion|後ろへ下がること → 景気後退|la|ラ recessiō|3
necessary|必要な|形|ne+cess:ced+ary|譲れない → 避けられない → 必要な|la|ラ necessārius|1
necessity|必要性|名|ne+cess:ced+ity||la||2
necessarily|必ずしも（～ない）|副|ne+cess:ced+ari:ary+ly||la||3
predecessor|前任者|名|pre+de+cess:ced+or|先に去って行った人 → 前任者|la|後期ラ praedēcessor|3
percent|パーセント|名|per+cent|100につき|la|ラ per centum|1
percentage|割合|名|per+cent+age||la||2
century|世紀|名|cent+ur:_+y|100の集まり → 100年|la|ラ centuria|1
concern|懸念；関係する|名・動|con+cern|共にふるい分ける → 関わる → 気にかける|la|中世ラ concernere|1
concerning|～に関して|前|con+cern+ing||la||3
certain|確かな、ある|形|cert:cern+ain:_|ふるい分けられた → はっきりした → 確かな|fr|古仏 certain|1
certainly|確かに|副|cert:cern+ain:_+ly||fr||1
certify|証明する|動|cert:cern+ify:fy|確かにする → 証明する|fr|古仏 certifier|3
certificate|証明書|名|cert:cern+i:_+fic:fac+ate|確かにされたもの → 証明書|la||2
certification|認定|名|cert:cern+i:_+fic:fac+at:ate+ion||la||3
certified|認定された、公認の|形|cert:cern+ifi:fy+ed||fr||3
secret|秘密|名|se+cret:cern|離して分けたもの → 秘密|la|ラ sēcrētus|1
secretary|秘書|名|se+cret:cern+ary|秘密を任された人 → 秘書|la|中世ラ sēcrētārius|1
cite|引用する|動|cite:cit|呼び出す → 引用する|fr|仏 citer|4
excite|興奮させる|動|ex+cite:cit|外へ呼び起こす → 興奮させる|la|ラ excitāre|1
exciting|わくわくさせる|形|ex+cit+ing||la||1
excitement|興奮|名|ex+cite:cit+ment||la||2
civil|市民の|形|civ+il:ile|市民の|la|ラ cīvīlis|3
claim|主張する、請求する；請求|動・名|claim|叫ぶ → 自分のものだと主張する → 請求する|fr|古仏 clamer ← ラ clāmāre|1
proclaim|宣言する|動|pro+claim|前で叫ぶ → 宣言する|la||4
clear|明らかな；片付ける|形・動|clear:clar|明るい → 明らかな|fr|古仏 cler ← ラ clārus|1
clearly|はっきりと|副|clear:clar+ly||fr||1
clarify|明確にする|動|clar+ify:fy|明らかにする|la||3
clarification|説明、明確化|名|clar+i:_+fic:fac+at:ate+ion||la||4
declare|宣言する、申告する|動|de+clare:clar|すっかり明らかにする → 宣言する・申告する|la|ラ dēclārāre|2
declaration|宣言、申告|名|de+clar+at:ate+ion||la||3
decline|断る、減少する；減少|動・名|de+cline:clin|下へ傾く → 減る ／ 身をそらす → 断る|fr|古仏 decliner|2
include|含む|動|in+clude:claud|中へ閉じる → 含む|la|ラ inclūdere|1
including|～を含めて|前|in+clud:claud+ing||la||1
inclusive|包括的な、含めた|形|in+clus:claud+ive||la||3
exclude|除外する|動|ex+clude:claud|外へ閉め出す|la|ラ exclūdere|2
exclusive|独占的な、高級な|形|ex+clus:claud+ive|ほかを締め出す → 独占的な|la||2
exclusively|もっぱら|副|ex+clus:claud+ive+ly||la||3
conclude|結論を下す、終える|動|con+clude:claud|すっかり閉じる → 結論を出す|la|ラ conclūdere|2
conclusion|結論|名|con+clus:claud+ion||la||2
disclose|明らかにする|動|dis+close:claud|閉じたものを開く → 明らかにする|fr|古仏 desclos ← ラ dis- + claudere|3
disclosure|開示|名|dis+clos:claud+ure||fr||4
enclose|同封する|動|en+close:claud|中に閉じ込める → 同封する|fr|古仏 enclore|2
closure|閉鎖|名|clos:claud+ure||fr||3
close|閉じる；近い|動・形|close:claud|閉じる ／ 閉じて詰まった → 近い|fr|古仏 clos ← ラ clausus|1
recognize|認識する、認める|動|re+cogn+ize|再び知る → 認識する|la|ラ recognōscere|1
recognition|認識、表彰|名|re+cogn+it:ate+ion||la||2
acquaint|知り合いにさせる|動|ac:ad+quaint:cogn|～に知らせる → 知り合いにさせる|fr|古仏 acointier ← 後期ラ accognitāre|3
acquaintance|知人|名|ac:ad+quaint:cogn+ance||fr||3
accord|一致；与える|名・動|ac:ad+cord:cor|心を～に合わせる → 一致|fr|古仏 acorder|3
according|（～に）よれば、従って|形|ac:ad+cord:cor+ing|心を合わせて → ～に従って|fr||1
accordingly|それに応じて|副|ac:ad+cord:cor+ing+ly||fr||3
record|記録；記録する|名・動|re+cord:cor|再び心に呼び戻す → 記録する|fr|古仏 recorder ← ラ recordārī|1
courage|勇気|名|cour:cor+age|心 → 勇気|fr|古仏 corage|2
encourage|励ます、促す|動|en+cour:cor+age|勇気の中に入れる → 励ます|fr|古仏 encoragier|1
discourage|落胆させる、思いとどまらせる|動|dis+cour:cor+age||fr||3
corporate|企業の|形|corp+or:_+ate|一体にされた → 法人の|la|ラ corporātus|2
corporation|企業、法人|名|corp+or:_+at:ate+ion||la||2
incorporate|組み込む、法人化する|動|in+corp+or:_+ate|体の中に入れる → 組み込む|la||4
credit|信用、クレジット|名|cred+it:ate|信じられたもの → 信用|fr|仏 crédit ← ラ crēditum|1
credible|信用できる|形|cred+ible:able||la||4
credibility|信頼性|名|cred+ibil:able+ity||la||4
incredible|信じられない|形|in:inneg+cred+ible:able||la||2
credential|資格証明|名|cred+ent+ial:al|信用を与えるもの → 資格証明|la||4
increase|増やす、増える；増加|動・名|in+crease:cresc|上に育つ → 増える|fr|アングロ仏 encresser ← ラ increscere|1
decrease|減る；減少|動・名|de+crease:cresc|下へ育つ → 減る|fr||1
concrete|具体的な；コンクリート|形・名|con+crete:cresc|共に育って固まった → 具体的な|la|ラ concrētus|3
recruit|採用する；新入社員|動・名|re+cruit:cresc|再び育つ → 補充する → 採用する|fr|仏 recrue|2
recruitment|採用|名|re+cruit:cresc+ment||fr||3
create|作り出す|動|cre:crea+ate|作り出す|la|ラ creāre|1
creative|創造的な|形|cre:crea+at:ate+ive||la||2
creation|創造、作品|名|cre:crea+at:ate+ion||la||2
recreation|娯楽|名|re+cre:crea+at:ate+ion|作り直すこと → 気分の回復 → 娯楽|la||3
recreational|娯楽の|形|re+cre:crea+at:ate+ion+al||la||3
culture|文化|名|cult+ure|耕すこと → 心を耕す → 文化|la|ラ cultūra|1
cultural|文化の|形|cult+ur:ure+al||la||2
agriculture|農業|名|agri:agr+cult+ure|畑を耕すこと → 農業|la|ラ agricultūra|3
agricultural|農業の|形|agri:agr+cult+ur:ure+al||la||3
cultivate|耕す、育てる|動|cult+iv:ive+ate||la||4
accurate|正確な|形|ac:ad+cur+ate|～に注意を払った → 正確な|la|ラ accūrātus|2
accuracy|正確さ|名|ac:ad+cur+acy:cy||la||3
accurately|正確に|副|ac:ad+cur+ate+ly||la||3
secure|安全な；確保する|形・動|se+cure:cur|心配から離れた → 安全な|la|ラ sēcūrus|2
security|安全、警備|名|se+cur+ity||la||1
cure|治す；治療|動・名|cure:cur|世話する → 治す|fr||2
curious|好奇心の強い|形|cur+i:_+ous|注意を向ける → 好奇心の強い|fr||2
current|現在の；流れ|形・名|curr+ent|走っている → 流れている → 現在の|fr|古仏 corant ← ラ currēns|1
currently|現在|副|curr+ent+ly||fr||1
currency|通貨|名|curr+ency:ance|流通しているもの → 通貨|la||2
occur|起こる|動|oc:ob+cur:curr|～に向かって走ってくる → 起こる|la|ラ occurrere|2
occurrence|出来事|名|oc:ob+curr+ence:ance||la||4
course|進路、講座|名|course:curr|走ること → 進路 → 講座|fr|古仏 cours ← ラ cursus|1
courier|宅配業者|名|cour:curr+ier:er|走る人 → 急使 → 宅配業者|fr|古仏 courier|3
excursion|小旅行|名|ex+curs:curr+ion|外へ走り出ること → 小旅行|la||4
cursor|カーソル|名|curs:curr+or|走るもの → カーソル|la||2
curriculum|カリキュラム|名|curr+ic:_+ulum:um|走路 → 課程|la|ラ curriculum（競走路）|3
incur|（損失を）被る|動|in+cur:curr|走り込む → 招く|la||4
damage|損害；損害を与える|名・動|dam+age|損害|fr|古仏 damage ← ラ damnum|1
`);
