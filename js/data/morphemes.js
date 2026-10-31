// パーツ（接頭辞・語根・接尾辞）
// 1行1パーツ: id|type|lang|英単語中の形（カンマ区切り）|元の語形|原意|諸説の注記（任意）
//   type: prefix（接頭辞） / root（語根） / suffix（接尾辞）
//   lang: la（ラテン語） / fr（フランス語） / gr（ギリシャ語） / en（古英語・ゲルマン語）
LATIEN.addMorphemes(`
ab|prefix|la|ab-,abs-,a-|ab|離れて
ad|prefix|la|ad-,ac-,af-,ag-,al-,an-,ap-,ar-,as-,at-,a-|ad|～へ・～に
ambi|prefix|la|ambi-,amb-|ambi-|周りに・両方
ante|prefix|la|ante-,anti-,an-|ante|前に
bene|prefix|la|bene-|bene|よく
bi|prefix|la|bi-,du-,di-|bi- / duo|2つ
circum|prefix|la|circum-,circu-|circum|周りに
con|prefix|la|con-,com-,col-,cor-,co-|cum|共に・すっかり
contra|prefix|la|contra-,contro-,counter-|contrā|反対に・逆らって
de|prefix|la|de-|dē|下へ・離れて・すっかり
dis|prefix|la|dis-,di-,dif-|dis|離れて・反対に・否定
ex|prefix|la|ex-,e-,ef-,es-|ex|外へ・すっかり
extra|prefix|la|extra-|extrā|外の・範囲を越えた
in|prefix|la|in-,im-,il-,ir-|in|中へ・上に
inneg|prefix|la|in-,im-,il-,ir-,ig-|in-（否定）|～でない
inter|prefix|la|inter-,intel-,enter-,entre-|inter|間に・互いに
intro|prefix|la|intro-|intrō|中へ
mal|prefix|la|mal-|male|悪く
multi|prefix|la|multi-|multus|多くの
ne|prefix|la|ne-|ne|～でない
non|prefix|la|non-,neg-|nōn|～でない
ob|prefix|la|ob-,oc-,of-,op-,o-|ob|～に向かって・逆らって
per|prefix|la|per-|per|通して・すっかり
post|prefix|la|post-|post|後に
pre|prefix|la|pre-|prae|前もって・先に
pro|prefix|la|pro-,por-|prō|前へ・～のために
re|prefix|la|re-,red-|re-|再び・後ろへ・元へ
se|prefix|la|se-|sē|離れて
semi|prefix|la|semi-|sēmi-|半分
sub|prefix|la|sub-,suc-,suf-,sug-,sup-,sus-,sum-,su-,sou-|sub|下に・下から
super|prefix|la|super-,supr-|super|上に・越えて
trans|prefix|la|trans-,tra-|trāns|越えて・向こうへ
tri|prefix|la|tri-|trēs|3つ
uni|prefix|la|uni-,un-|ūnus|1つ
en|prefix|fr|en-,em-|古仏 en-（← ラ in）|中に入れる・～にする
sur|prefix|fr|sur-|古仏 sur（← ラ super）|上に・越えて
pur|prefix|fr|pur-,pour-|古仏 pur-（← ラ prō）|前へ・～のために
syn|prefix|gr|syn-,sym-,syl-,sy-|syn|共に
tele|prefix|gr|tele-|tēle|遠くに
auto|prefix|gr|auto-|autos|自分で
anti|prefix|gr|anti-|anti|反対・対抗
hyper|prefix|gr|hyper-|hyper|過度に・超えて
dia|prefix|gr|dia-|dia|通して・横切って
para|prefix|gr|para-|para|そばに
epi|prefix|gr|epi-|epi|上に
cata|prefix|gr|cata-|kata|下に・すっかり
meta|prefix|gr|meta-,met-|meta|後に・変化
mono|prefix|gr|mono-|monos|1つ
micro|prefix|gr|micro-|mīkros|小さい
peri|prefix|gr|peri-|peri|周りに
ana|prefix|gr|ana-|ana|上へ・すっかり
apo|prefix|gr|apo-|apo|離れて
un|prefix|en|un-|古英 un-|～でない・元に戻す
over|prefix|en|over-|古英 ofer|越えて・過度に
out|prefix|en|out-|古英 ūt|外へ・上回って
under|prefix|en|under-|古英 under|下に・不足して
up|prefix|en|up-|古英 up|上へ・最新に
down|prefix|en|down-|古英 dūne|下へ
with|prefix|en|with-|古英 wiþ|後ろへ・逆らって
fore|prefix|en|fore-|古英 fore|前もって
mis|prefix|en|mis-|古英 mis-|誤って

aer|root|gr|air,aer|aēr|空気・空
bio|root|gr|bio|bios|生命
psych|root|gr|psych|psȳchē|心・魂
oikos|root|gr|eco|oikos|家
demo|root|gr|demo|dēmos|民衆
crat|root|gr|cracy,crat|kratos|力・支配
geo|root|gr|geo|gē|土地・地球
ag|root|la|ag,act,ig|agere / āctus|行う・動かす
agr|root|la|agri,agr|ager|畑
alter|root|la|alter,alt|alter|他の
anim|root|la|anim|animus|心・息
ann|root|la|ann,enn|annus|年
apt|root|la|apt,ept|aptus|適した
aud|root|la|aud,audi|audīre|聞く
bat|root|fr|bat,bate|古仏 batre（← ラ battuere）|打つ
bouge|root|fr|budg|古仏 bouge|革袋
cad|root|la|cid,cas,case,cad,chance,cay|cadere|落ちる・起こる
caed|root|la|cide,cis,cise|caedere|切る
cap|root|la|cap,capt,cept,ceive,ceipt,cip,cipe,cup,cupy|capere / captus|取る・つかむ
capit|root|la|capit,chief,chieve,chap,capt|caput|頭
ced|root|la|ced,cede,ceed,cess|cēdere / cessus|行く・譲る
cent|root|la|cent|centum|100
cern|root|la|cern,cert,cret|cernere / certus|ふるい分ける・見分ける
cit|root|la|cit,cite|citāre|呼び起こす
civ|root|la|civ|cīvis|市民
claim|root|la|claim,clam|clāmāre|叫ぶ
clar|root|la|clar,clare,clear|clārus|明るい・明らかな
claud|root|la|clude,clud,clus,close,clos|claudere / clausus|閉じる
clin|root|la|clin,cline|clīnāre|傾く
cogn|root|la|cogn,quaint|cognōscere|知る
cor|root|la|cord,cour,cor|cor / cordis|心
corp|root|la|corp,corpor|corpus|体
couvr|root|fr|cover,cur|古仏 covrir|覆う
crea|root|la|cre,crea|creāre|作り出す
cred|root|la|cred|crēdere|信じる
cresc|root|la|crease,crete,cruit|crēscere|育つ・増える
cult|root|la|cult|colere / cultus|耕す
cur|root|la|cur,cure|cūra|注意・世話
curr|root|la|curr,cur,curs,course,cour|currere / cursus|走る
cycl|root|gr|cycle,cycl|kyklos|輪
dam|root|la|dam|damnum|損害
deb|root|la|debt,due,du|dēbēre|負う・借りがある
defr|root|fr|e|仏 de|～の
dent|root|la|dent,dand|dēns / dentis|歯
dic|root|la|dict,dic,dit|dīcere / dictus|言う
doc|root|la|doc,doct|docēre|教える
dom|root|la|dom|domus / dominus|家・主人
don|root|la|don,dat,date,dit,d,der,rent|dare / dōnāre|与える
duc|root|la|duce,duc,duct|dūcere / ductus|導く
dur|root|la|dur|dūrāre|続く・持ちこたえる
equ|root|la|equ,equi|aequus|等しい
err|root|la|err|errāre|さまよう
ess|root|la|ess,sent,est,s|esse|ある・存在する
fac|root|la|fac,fact,fect,fic,fit,feat,fair,fice|facere / factus|作る・行う
fer|root|la|fer|ferre|運ぶ
feu|root|fr|few|古仏 feu|火
fid|root|la|fid|fīdere / fidēs|信じる・信頼
fin|root|la|fin,fine|fīnis|終わり・境界
firm|root|la|firm|firmus|堅い
flect|root|la|flect,flex|flectere|曲げる
flu|root|la|flu,fluct|fluere|流れる
form|root|la|form|fōrma|形
fort|root|la|fort,forc|fortis|強い
fract|root|la|fract,frag|frangere / frāctus|壊す
fund|root|la|fund,found|fundus|底・土台
fus|root|la|fus,fuse,fund|fundere / fūsus|注ぐ
gage|root|fr|gage,wage|古仏 gage|誓約・担保
gen|root|la|gen,gin|genus / gignere|生まれ・種類・生む
ger|root|la|gest,gist,gistr|gerere / gestus|運ぶ・行う
grad|root|la|grad,grade,gress,gree|gradus / gradī|段階・歩む
gram|root|gr|gram|gramma|書かれたもの
graph|root|gr|graph|graphein|書く・描く
grat|root|la|grat,grate,gree|grātus|喜ばしい・感謝の
hab|root|la|hab,habit,hib|habēre|持つ
her|root|la|here,hes|haerēre|くっつく
hosp|root|la|hosp,host,hot|hospes|客・もてなす人
ident|root|la|ident|idem|同じ
it|root|la|it,sue|īre / itus|行く
ject|root|la|ject|iacere / iactus|投げる
jud|root|la|jud,judg|iūdex|裁判官
junct|root|la|junct,join,joint|iungere / iūnctus|結ぶ
jur|root|la|jur,jure,just|iūs / iūris|法・正しさ
krin|root|gr|cri,crit|krīnein|分ける・判断する
labor|root|la|labor|labor|労働
lat|root|la|lat,late|lātus（ferre の過去分詞）|運ばれた
leg|root|la|lect,leg,lig,league|legere / lēctus|選ぶ・読む
lev|root|la|lev,lieve,lief|levāre|持ち上げる・軽くする
lex|root|la|leg,lege,loy|lēx / lēgis|法
liber|root|la|liber,liver|līber|自由な
lig|root|la|lig,lige,li,ly|ligāre|縛る
lingu|root|la|lingu,langu|lingua|舌・言語
lion|root|fr|lion|仏 lion|ライオン
loc|root|la|loc|locus|場所
log|root|gr|log,logue,logy|logos|言葉・理性
lys|root|gr|ly|lyein|ほどく・解く
magn|root|la|magn,max,maj,may|magnus|大きい
mand|root|la|mand,mend|mandāre|任せる・命じる
manu|root|la|manu,man,main|manus|手
medi|root|la|medi|medius|中間の
memor|root|la|memor,memo,member|memor|覚えている
mens|root|la|mens,mense|mētīrī / mēnsus|測る
ment|root|la|ment|mēns / mentis|心
merc|root|la|merc,merce,merch,mark|merx|商品・取引
merg|root|la|merg,merge|mergere|浸す・沈む
migr|root|la|migr|migrāre|移る
min|root|la|min,men|minor / minus|小さい
minist|root|la|minist|minister|仕える者
mir|root|la|mir,mire,mirr|mīrārī|驚く・見とれる
mit|root|la|mit,miss,mis,mise,mess|mittere / missus|送る
mob|root|la|mob,mot,mote,move,mov,mo|movēre / mōtus|動かす
mod|root|la|mod|modus|尺度・方法
mon|root|la|mon,monstr|monēre|警告する・示す
mort|root|la|mort|mors / mortis|死
mult|root|la|mult|multus|多い
mun|root|la|mun,mon|mūnus|務め・贈り物
mut|root|la|mut,mute|mūtāre|変える
nat|root|la|nat|nāscī / nātus|生まれる
nav|root|la|nav|nāvis|船
nec|root|la|nect|nectere|結ぶ
neg|root|la|neg,ny|negāre|否定する
nom|root|la|nom,nomin|nōmen|名前
nomos|root|gr|nom,nomy|nomos|法・管理
norm|root|la|norm|norma|基準・定規
not|root|la|not,note|nōtāre / nōscere|記す・知る
nounc|root|la|nounce,nunci|nūntiāre|知らせる
nov|root|la|nov|novus|新しい
num|root|la|num,numer|numerus|数
oper|root|la|oper,of|opus / operis|仕事
opt|root|la|opt|optāre|選ぶ
ord|root|la|ord,ordin|ōrdō|順序
par|root|la|par,pare,pair|parāre|準備する・整える
pari|root|la|par,pare,pair|pār|等しい
part|root|la|part,port|pars / partis|部分
pass|root|la|pass,pat|patī / passus|苦しむ・耐える
passus|root|la|pass|passus|歩み
path|root|gr|path|pathos|感情・苦しみ
pear|root|la|pear,par|pārēre|現れる
ped|root|la|ped|pēs / pedis|足
pel|root|la|pel,peal,puls|pellere / pulsus|押す・駆り立てる
pend|root|la|pend,pens,pense|pendere / pēnsus|吊るす・量る・支払う
pet|root|la|pet,pete,peat|petere|求める・目指す
pha|root|gr|pha|phainein|見せる・現す
pharm|root|gr|pharm|pharmakon|薬
phon|root|gr|phone,phon|phōnē|音・声
photo|root|gr|photo|phōs / phōtos|光
ple|root|la|ple,plete,ply,pli,plen,pl|plēre|満たす
plic|root|la|plic,ply,ploy,pli,plex,play,iple|plicāre|折る・重ねる
polis|root|gr|polit,polic|polis|都市
pon|root|la|pon,pos,pose,post|pōnere / positus|置く
popul|root|la|popul,publ,peopl|populus|民衆
port|root|la|port|portāre|運ぶ
portus|root|la|port|portus|港
preci|root|la|preci,price,praise|pretium|価値・値段
prehend|root|la|prehens,prise,pren|prehendere|つかむ
press|root|la|press|premere / pressus|押す
prim|root|la|prim,prin,prime|prīmus|最初の
priv|root|la|priv|prīvus|個人の・離れた
prob|root|la|prob,prov,prove,proof|probāre|試す・証明する
prou|root|fr|prove|アングロ仏 prou|利益
punct|root|la|punct,point|pungere / pūnctus|刺す・点
qual|root|la|qual|quālis|どのような
quant|root|la|quant|quantus|どれほどの
quer|root|la|quest,quire,quir,quis|quaerere / quaesītus|求める
rat|root|la|rat,rate,reas|rērī / ratus|計算する
reg|root|la|reg,rect|regere / rēctus|導く・支配する・まっすぐ
rupt|root|la|rupt|rumpere / ruptus|破る・壊す
sal|root|la|sal|sāl|塩
sat|root|la|sat,satis|satis|十分な
sci|root|la|sci|scīre|知る
scop|root|gr|scope|skopein|見る
scrib|root|la|scrib,scribe,script|scrībere / scrīptus|書く
sec|root|la|sect|secāre / sectus|切る
sed|root|la|sid,sess,sed|sedēre|座る
sens|root|la|sens,sense,sent|sentīre / sēnsus|感じる
sequ|root|la|sequ,secu,cute,cut,sue,suit,suite,sec|sequī|後に続く・従う
serv|root|la|serv,serve|servāre / servīre|保つ・仕える
sign|root|la|sign|signum|しるし
simil|root|la|simil,sembl,semble|similis|似た
sist|root|la|sist,st,stat,state,stit,stabl,stin|stāre / sistere|立つ・立たせる
soci|root|la|soci|socius|仲間
solv|root|la|solv,solve,solu|solvere / solūtus|ほどく・解く
spec|root|la|spect,spec,pect,spic|specere / spectus|見る
sper|root|la|sper|spēs|希望
spir|root|la|spir,spire,pire,pir|spīrāre|息をする
spond|root|la|spond,spons,sponse|spondēre|約束する
string|root|la|strict,string|stringere / strictus|締める
struct|root|la|struct,stroy,str,stri|struere / strūctus|積み上げる・築く
sum|root|la|sum,sume,sump|sūmere|取る
tact|root|la|tact,tain,teg|tangere / tāctus|触れる
tain|root|la|tain,ten,tin,tent|tenēre|保つ・持つ
techn|root|gr|techn|technē|技術
tempor|root|la|tempor|tempus / temporis|時
tend|root|la|tend,tens,tent|tendere / tentus|伸ばす・向ける
termin|root|la|termin,term,termine|terminus|境界・終わり
terr|root|la|terr|terra|土地
test|root|la|test|testis|証人
text|root|la|text|texere / textus|織る
tract|root|la|tract,treat,trait|trahere / tractus|引く
trib|root|la|trib|tribuere|割り当てる
turb|root|la|turb|turba|混乱
us|root|la|us,use,ut|ūtī / ūsus|使う
vac|root|la|vac,void|vacāre|空である
val|root|la|val,vail|valēre|価値がある・強い
ven|root|la|ven,vent|venīre / ventus|来る
vend|root|la|vend|vendere|売る
ver|root|la|ver|vērus|真実の
vers|root|la|vers,vert,verse|vertere / versus|向ける・回す
vest|root|la|vest|vestis|衣服
vestig|root|la|vestig|vestīgium|足跡
via|root|la|via,vi,vey,voy,voice|via|道
vid|root|la|vid,vis,vise,vide,vice,view,vey|vidēre / vīsus|見る
vinc|root|la|vinc,vince,vict|vincere / victus|勝つ
viv|root|la|viv,vive,vit|vīvere / vīta|生きる
voc|root|la|voc,vok,vouch|vōx / vocāre|声・呼ぶ
vol|root|la|vol|velle|望む
volv|root|la|volv,volve,volu,vol|volvere / volūtus|回る・巻く
vot|root|la|vot,vote|vovēre / vōtus|誓う

ion|suffix|la|-ion,-tion,-sion,-ation|-iō|～すること
ment|suffix|la|-ment|-mentum|～すること・結果・手段
ance|suffix|la|-ance,-ence,-ancy,-ency|-antia / -entia|～すること・状態
ent|suffix|la|-ant,-ent,-ient|-āns / -ēns|～している・～する人
able|suffix|la|-able,-ible,-ble|-ābilis / -ibilis|～できる
al|suffix|la|-al,-ial,-ar,-ual|-ālis / -āris|～の・～に関する
ity|suffix|la|-ity,-ty,-ety|-itās|性質・状態
ive|suffix|la|-ive,-ative|-īvus|～の性質をもつ
ous|suffix|la|-ous,-ious,-uous|-ōsus|～に満ちた
ure|suffix|la|-ure|-ūra|～すること・結果
ary|suffix|la|-ary|-ārius|～に関する・～の場所・～する人
ory|suffix|la|-ory|-ōrius|～の場所・～の性質
or|suffix|la|-or,-ator|-or / -ātor|～する人・もの
ate|suffix|la|-ate,-ite,-ute|-ātus|～する・～された
fy|suffix|la|-fy,-ify|-ficāre（← facere）|～にする
cle|suffix|la|-cle,-cule,-cul|-culum / -culus|小さいもの・道具
id|suffix|la|-id|-idus|～の状態の
tude|suffix|la|-tude|-tūdō|状態
cy|suffix|la|-cy,-acy|-cia / -tia|状態・性質
ile|suffix|la|-ile,-il|-ilis|～できる・～に関する
um|suffix|la|-um,-ium|-um|（名詞の語尾）もの
ice|suffix|la|-ice|-itia / -itium|行為・性質
y|suffix|la|-y,-ry|-ia / 古仏 -ie|～すること・状態
age|suffix|fr|-age|古仏 -age|～すること・集まり・料金
ee|suffix|fr|-ee|古仏 -é|～される人
eur|suffix|fr|-eur|仏 -eur|～する人
et|suffix|fr|-et,-ette|古仏 -et|小さいもの
ic|suffix|gr|-ic|-ikos|～の・～的な
ist|suffix|gr|-ist|-istēs|～する人・専門家
ism|suffix|gr|-ism|-ismos|主義・状態
ize|suffix|gr|-ize,-ise|-izein|～化する・～にする
sis|suffix|gr|-sis|-sis|～すること
er|suffix|en|-er|古英 -ere|～する人・もの
ing|suffix|en|-ing|古英 -ing|～すること・～している
ed|suffix|en|-ed|古英 -ed|～された
ly|suffix|en|-ly|古英 -līce|～のように
ness|suffix|en|-ness|古英 -nes|状態・性質
ful|suffix|en|-ful|古英 full|～に満ちた
less|suffix|en|-less|古英 lēas|～のない
ship|suffix|en|-ship|古英 -scipe|状態・関係・身分
`);
