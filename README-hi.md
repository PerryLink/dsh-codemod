<div align="center">

# ⬆️ dsh-plugin-upgrade

> **दायरा: corridor `0.1.6-alpha.2` पर समाप्त होते हैं।** `0.1.6 → 0.2.x` का कोई corridor नहीं है; पैकेज 0.2.x होस्ट पर पुराने plugin रेपो स्कैन करने के लिए इंस्टॉल हो सकता है, पर यह 0.2.x माइग्रेशन पथ नहीं है। सामान्य bundle अपडेट के लिए host plugin manager का native `updateBundle()` उपयोग करें।

- **1024 स्टोर चैनल**: एक बार `npm i -g dsh1024` चलाएँ, फिर `dsh1024 plugin --profile web add dsh-plugin-upgrade` (यह [deepseek1024.com](https://deepseek1024.com) की इंस्टॉल रैंकिंग में गिना जाता है)।
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-plugin-upgrade)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-plugin-upgrade?metric=downloads&lang=hi)](https://dshfind.com/hi/plugins/PerryLink/dsh-plugin-upgrade?ref=badge)

**DeepSeek Harness के लिए प्लगइन अपग्रेड स्किल — एक पैकेज, एक कॉरिडोर सूचकांक, दो बंद कॉरिडोर: `0.1.3-alpha.1` → `0.1.5-rc.1` (`legAB`) और `0.1.5-rc.2` → `0.1.6-alpha.2` (`legC`)।**

*स्कैनर स्वयं मार्ग चुनता है: यह लक्ष्य रिपॉज़िटरी का घोषित dsh बैंड पढ़ता है (या `--span` लेता है), और फिर उसी कॉरिडोर का अपना साक्ष्य-बद्ध कैटलॉग लागू करता है — `legAB` की 20 सीमें (पैर A `0.1.3-alpha.1` → `0.1.5-alpha.1` और पैर B `0.1.5-alpha.1` → `0.1.5-rc.1`) या `legC` की 5 सीमें (`E1`–`E5`)। एक ही प्रवेश बिंदु, ताकि चुपचाप माउंट होना बंद कर चुका क्लाइंट आधा हिस्सा कभी «typecheck हरा है» न समझा जाए।*

> **आधिकारिक रिपॉज़िटरी।** यह dsh-plugin-upgrade की एकमात्र आधिकारिक रिपॉज़िटरी है, जिसे PerryLink संभालता है। यह दोनों सेवानिवृत्त संस्करण-लॉक्ड पैकेजों `dsh-plugin-upgrade` (पैर A) और `dsh-plugin-upgrade-rc1` (पैर B) का स्थान लेती है, और `0.1.5-rc.2` → `0.1.6-alpha.2` कॉरिडोर (पैर C) इसी पैकेज में समाहित किया गया — `dsh-plugin-upgrade-016` नाम रजिस्ट्री तक कभी नहीं पहुँचा। अन्य खातों की समान-नाम वाली रिपॉज़िटरियाँ इससे संबद्ध नहीं हैं। **`dsh-plugin-upgrade-015` और `dsh-plugin-upgrade-016` दोनों 2026-10-05 को सेवानिवृत्त कर दिए गए हैं और अब इन्हें कोई सुधार, रिलीज़ या सुरक्षा अद्यतन नहीं मिलेगा**; सभी प्लगइन अपग्रेड अब इसी पैकेज में जारी रहते हैं, और कॉरिडोर वही तय करता है जो लक्ष्य रिपॉज़िटरी स्वयं घोषित करती है — इसलिए हर होस्ट छलांग के लिए अलग संस्करण-लॉक्ड पैकेज की आवश्यकता नहीं है।

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-plugin-upgrade.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-listed-en.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-plugin-upgrade/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-plugin-upgrade/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-plugin-upgrade?label=version)](https://github.com/PerryLink/dsh-plugin-upgrade/releases)
[![npm version](https://img.shields.io/npm/v/dsh-plugin-upgrade)](https://www.npmjs.com/package/dsh-plugin-upgrade)
[![npm downloads](https://img.shields.io/npm/dm/dsh-plugin-upgrade)](https://www.npmjs.com/package/dsh-plugin-upgrade)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-plugin-upgrade
```


</div>

---


**📖 इकोसिस्टम नॉलेज बेस** — मापे गए आँकड़े, मार्केटिंग नहीं: [डेवलपमेंट गाइड · चयन डेटा · रखरखाव मानदंड](https://perrylink.github.io/dsh-plugin-guide/)।

<!-- star-cta -->
## इंस्टॉल और अनइंस्टॉल

```sh
dsh plugin --profile web add dsh-plugin-upgrade            # npm से
dsh plugin --profile web add github:PerryLink/dsh-plugin-upgrade   # स्रोत से
dsh plugin --profile web remove dsh-plugin-upgrade         # अनइंस्टॉल (प्रतिवर्ती)
```

बंडल इंस्टॉल करने से केवल एक स्किल पंजीकृत होती है; पंक्ति हटाने से स्किल हट जाती है। CLI एक सामान्य `npx` लक्ष्य है और उसे किसी प्रोफ़ाइल की आवश्यकता नहीं।

## ⭐ 如果它帮到了你

यह प्लगइन [DSH प्लगइन परिवार](https://github.com/PerryLink) का हिस्सा है (95 प्लगइन, सभी Apache-2.0)। अगर यह उपयोगी लगे, तो **एक स्टार दें** — इससे कोई सुविधा अनलॉक नहीं होती, पर अगला व्यक्ति इसे खोज में आसानी से पा लेता है।

*English:* part of a 95 plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.

## What is dsh-plugin-upgrade?

DeepSeek Harness के लिए प्लगइन अपग्रेड स्किल — एक पैकेज, एक कॉरिडोर सूचकांक, दो बंद कॉरिडोर: `0.1.3-alpha.1` → `0.1.5-rc.1` (`legAB`) और `0.1.5-rc.2` → `0.1.6-alpha.2` (`legC`)।

स्कैनर स्वयं मार्ग चुनता है: यह लक्ष्य रिपॉज़िटरी का घोषित dsh बैंड पढ़ता है (या `--span` लेता है), और फिर उसी कॉरिडोर का अपना साक्ष्य-बद्ध कैटलॉग लागू करता है — `legAB` की 20 सीमें (पैर A `0.1.3-alpha.1` → `0.1.5-alpha.1` और पैर B `0.1.5-alpha.1` → `0.1.5-rc.1`) या `legC` की 5 सीमें (`E1`–`E5`)। एक ही प्रवेश बिंदु, ताकि चुपचाप माउंट होना बंद कर चुका क्लाइंट आधा हिस्सा कभी «typecheck हरा है» न समझा जाए।

![dsh-plugin-upgrade कार्यप्रवाह आरेख: कॉल → प्लगइन → परिणाम।](docs/assets/dsh-plugin-upgrade-flow.svg)

*कार्यप्रवाह: कॉल → प्लगइन → परिणाम। नीचे के उदाहरण वास्तविक कमांड सतह का उपयोग करते हैं।*


*वही रन, एनिमेटेड।*

## Comparison

![dsh-plugin-upgrade का मापा गया तुलना चार्ट](https://raw.githubusercontent.com/PerryLink/dsh-plugin-upgrade/main/docs/assets/dsh-plugin-upgrade-evidence.png)

40 family repos swept · README §What you get (leg A, 2026-09-09)

## संगतता

| सतह | स्थिति |
|---|---|
| हार्नेस | DeepSeek Harness `dsh-v0.2.1-alpha.1` (वर्तमान लाइन; dev/test पिन `0.2.1-alpha.1`)। कॉरिडोर इंडेक्स उन्हीं स्पैनों के प्रमाण से बंधा है जिन्हें उसने मापा: `legAB` = `0.1.3-alpha.1 → 0.1.5-rc.1` (tag `dsh-v0.1.7-alpha.2` = `183f08e9c6dd`; पैर A→B हैंडऑफ़ `dsh-v0.1.7-alpha.2` = `5dda764ed3aa`) और `legC` = `0.1.5-rc.2 → 0.1.6-alpha.2` (tag `dsh-v0.1.7-alpha.2`)। पीयर बैंड `@deepseek-ai/dsh-skill >=0.1.6-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0`, `@deepseek-ai/cordis ^4.0.5-alpha.1`, `@deepseek-ai/schemastery ^3.18.5-alpha.1`। |
| Node | `^22.19.0 \|\| >=24.0.0` |
| प्लेटफ़ॉर्म | जहाँ Node चले; स्कैनर केवल फ़ाइल सिस्टम पढ़ता है और प्लेटफ़ॉर्म-निरपेक्ष है |
| मॉडल | केवल-पाठ मॉडल पूरी तरह समर्थित; स्किल एक Markdown है, किसी टूल या विज़न की आवश्यकता नहीं |
| कॉरिडोर सूचकांक | एक पैकेज, एक प्रवेश बिंदु। `lib/route.mjs` बंद कॉरिडोर रखता है और CLI लक्ष्य रेपो के घोषित बैंड (`engines.dsh`, `@deepseek-ai/dsh*` की रेंजें) से मेल खाते कॉरिडोर पर मार्ग देता है; `--span legAB\|legC` अनुमान को ओवरराइड करता है और बिना घोषित बैंड पुराने कॉरिडोर पर लौट आता है। दोनों कैटलॉग कभी विलय नहीं होते: हर कॉरिडोर अपना सीम array, कार्ड, साक्ष्य, fixtures और समानता गेट रखता है। |
| दायरा | **दो बंद कॉरिडोर**: `legAB` = `0.1.3-alpha.1` → `0.1.5-rc.1` (पैर A + पैर B), `legC` = `0.1.5-rc.2` → `0.1.6-alpha.2`। कॉरिडोर कभी चौड़ा नहीं होता: सीम जोड़ने वाली कोई छलांग एक नया कॉरिडोर है — एक नया कार्ड और सूचकांक में एक नई पंक्ति, न कि नया पैकेज। |
| पैर | हर पैर इसी पैकेज में रहता है: पैर A `S1`–`S10` + `M1` सीमें रखता है, पैर B `C1`, `C2`, `C4`, `C5`, `H1`–`H4`, `P1` रखता है, और पैर C `E1`–`E5` रखता है — हर एक के अपने साक्ष्य, कार्ड अनुभाग, fixtures और रोलबैक पथ के साथ। इंस्टॉल करने के लिए कोई सहोदर पैकेज नहीं है। |
| `C3` | सेवानिवृत्त: पैर B का कार्ड पुरानी टाइप-लाइन वाले झूठे हरे को `C3` लिखता था, जो पैर A की `M1` जैसा ही दोष है। यह विलय कार्ड पर दर्ज है; `--seams C3` किसी से मेल नहीं खाता। |
| पूर्ववर्ती पैकेज | एक ही प्रोफ़ाइल में सेवानिवृत्त `dsh-plugin-upgrade` को साथ में माउंट न करें: दोनों agent skill `plugin-upgrade` पंजीकृत करते हैं, इसलिए दूसरा माउंट skill नाम पर टकराएगा। वह पैकेज npm पर deprecated है और उसका रिपॉज़िटरी सेवानिवृत्त हो चुका है; यह पैकेज उसके दोनों चरणों का स्थान लेता है। |

## आपको क्या मिलता है

दो हिस्से, हर कॉरिडोर के लिए एक सीम कैटलॉग:

- **पैकेज में शामिल एजेंट स्किल (`plugin-upgrade`)** — विलयित कॉरिडोर कार्ड और ठीक-करो-और-सत्यापित-करो चक्र। बॉडी पहले बुलाने वाले को उसी पैर तक पहुँचाती है जो उसके पीयर बैंड से मेल खाता है; मॉडल इसे केवल तब लोड करता है जब किसी कार्य को वास्तव में आवश्यकता हो, और यह पैकेज सिस्टम प्रॉम्प्ट का कोई अनुच्छेद नहीं जोड़ता और कोई टूल भी नहीं।
- **शून्य-निर्भरता CLI (`dsh-plugin-upgrade-scan`)** — कॉरिडोर हल करता है और उसी कॉरिडोर की सीमों के `file:line` तथ्य बताता है: `legAB` की बीस (`S3`, `S8`, `S9`, `M1`, `S4`, `S5`, `S6`, `S7`, `S2`, `S1`, `S10`, `C1`, `C2`, `P1`, `C4`, `C5`, `H1`, `H2`, `H4`, `H3`), जो 2026-09-09 (पैर A) और 2026-09-10 (पैर B) को हार्नेस tag रेंज से दोबारा पढ़ी गईं, या `legC` की पाँच (`E1`–`E5`), जो `dsh-v0.1.7-alpha.1` पर मापी गईं (2026-09-19)। किसी भी error-स्तर की हिट पर `1` लौटाता है, इसलिए सीधे CI में लगता है।

यह उस विफलता-विधा के लिए है जिसे खत्म करने के लिए यह कॉरिडोर बना है: **इस विस्तार की टूटन ज़्यादातर चुपचाप होती है, दोनों सिरों से।** टाइप लाइन पुरानी हो सकती है, इसलिए रेपो **पुराने** कैटलॉग के विरुद्ध कंपाइल होता है (सीम `M1`), और नंगा `conversation` क्लाइंट स्लॉट बिना किसी alias के हटा दिया गया, जबकि `ctx.slots.inject()` कॉलबैक केवल तब चलाता है जब declaration मौजूद हो — इसलिए उसे अब भी लक्षित करता क्लाइंट आधा हिस्सा माउंट होना बंद कर देता है: कोई त्रुटि नहीं, कोई लॉग पंक्ति नहीं, कोई बिल्ड विफलता नहीं (सीम `C1`)। `typecheck` + `test` को तीन वर्ग की टूटन पार कर जाती हैं:

1. स्थानीय गेट एक पुरानी टाइप लाइन कंपाइल करता है — पुराना `paths` alias, या `0.1.5-alpha.*` पर pinned dev/test टाइप (सीम `M1`);
2. कोई लॉग लेखक V3 के अनिवार्य `stream` फ़ील्ड को छोड़ देता है, इसलिए सत्र import तो हो जाता है पर फिर रिज़्यूम करने से इनकार कर देता है (सीम `S3`);
3. परीक्षण पुरानी आकृति के विरुद्ध mock किए गए हैं, इसलिए वे पास हो जाते हैं जबकि होस्ट योगदान गिरा देता है (सीम `C1`)।

ईमानदार आकलन: पैर B की वर्कस्पेस स्कैन में पाया गया कि परिवार के क्लाइंट हिस्से केवल **8** स्लॉट कुंजियाँ इस्तेमाल करते हैं, और सभी 8 rc.1 में जीवित हैं — उनके लिए rc.1 की टूटन **अव्यक्त है, वास्तविक नहीं**। जो टूटते हैं वे तीसरे पक्ष के क्लाइंट प्लगइन हैं जो नंगी `conversation` कुंजी को लक्षित करते थे, और वे चुपचाप टूटते हैं। पैर A की स्कैन में उलटी बनावट मिली: 40 रेपो, उनमें से 11 पर `M1` लगा, और पुराने पथ को ठीक करने से 3 ऐसे रेपो में असली TypeScript त्रुटियाँ खुल गईं जो पहले «हरे» थे।

## त्वरित शुरुआत

```sh
dsh plugin --profile web add github:PerryLink/dsh-plugin-upgrade
```

```sh
# 1. बंडल को अपने प्रोफ़ाइल में इंस्टॉल करें
dsh plugin --profile web add dsh-plugin-upgrade

# 2. पुष्टि करें कि पंक्ति माउंट हुई
dsh --profile web --dump-config | grep -A3 'id: dsh-plugin-upgrade'

# 3. जिस प्लगइन को अपग्रेड करना है उसे स्कैन करें
npx dsh-plugin-upgrade-scan --repo ../my-plugin
```

फिर एजेंट से `plugin-upgrade` स्किल इस्तेमाल करने को कहें, या अपने बैंड से मेल खाते कार्ड के साथ स्वयं चक्र चलाएँ:
`skills/plugin-upgrade/references/v0.1.3-alpha.1-to-v0.1.5-rc.1.md` (`legAB` — पैर A §1 है, पैर B §2 है, विलयित सीम सूचकांक §3 है) या `skills/plugin-upgrade/references/v0.1.5-rc.2-to-v0.1.6-alpha.2.md` (`legC`)। स्कैनर आपके लिए कॉरिडोर चुन लेता है; जब घोषित बैंड अस्पष्ट हो तो `--span legC` जोड़ें।

### उदाहरण

ये वास्तविक प्रवेश बिंदु हैं; इंस्टॉल के बाद एक चलाएँ।

#### विस्तृत उदाहरण

**कमांड**

~~~sh
dsh-plugin-upgrade-scan --repo fixtures/leg-a-bad-repo --seams S3
~~~

**आउटपुट**

~~~text
# scan-0.1.5 · /mnt/d/Projects/dsh/plugins/dsh-plugin-upgrade/fixtures/leg-a-bad-repo
files scanned: 3 · hits: 1

## S3 [error] assistant/message 缺 stream（V3 必填） — 1 hit(s)
   action: 写入会话日志的 assistant/message 必须带 `stream: []`（或真实分片）；缺了导入成功但会话不可续聊（Session.fromRestore 抛 invalid settlement fields）。
   fixtures/leg-a-bad-repo/src/index.ts:30  type: 'assistant/message',

H3 [info] card-only: the rc.1 additive capabilities are listed on the version card and are never auto-detected.
~~~

*स्रोत `README.md:159-173 (Surfaces/CLI); test/scan.test.mjs:158; fixtures/leg-a-bad-repo/src/index.ts:30`*

#### विफलता शाखा

**इनपुट**

~~~text
node scripts/scan-0.1.5.mjs --repo /nonexistent-upgrade-repo
~~~

**आउटपुट**

~~~text
repo not found: /nonexistent-upgrade-repo
~~~

*स्रोत `plugins/dsh-plugin-upgrade/lib/scan.mjs:510-514,523; plugins/dsh-plugin-upgrade/README.md:181-192`*

#### संक्षिप्त उदाहरण

- `plugin-upgrade`

## कॉन्फ़िगरेशन

हर कुंजी वैकल्पिक है और प्रोफ़ाइल पैच में रहती है:

| कुंजी | डिफ़ॉल्ट | अर्थ |
|---|---|---|
| `enabled` | `true` | पैकेज में शामिल स्किल पंजीकृत करें। निर्भरता माउंट रखते हुए चुप रहने के लिए `false`। |
| `skillName` | `plugin-upgrade` | `skillsRoot` के अंतर्गत पंजीकृत होने वाली डायरेक्टरी, और कैटलॉग में दिखने वाला नाम। |
| `skillsRoot` | पैकेज का अपना `./skills` | जहाँ `<skillName>/SKILL.md` है। इसी ढाँचे का पुनरुपयोग करने के लिए इसे अपने कार्ड पर इंगित करें। |
| `userInvocable` | `true` | मॉडल के अतिरिक्त कोई व्यक्ति भी नाम से स्किल बुला सके या नहीं। |

```yaml
- insert:
    - id: dsh-plugin-upgrade
      name: dsh-plugin-upgrade
      config:
        skillName: plugin-upgrade
```

प्लगइन ज़ोर से माउंट होता है: `SKILL.md` गायब होना, खाली बॉडी, या `name` रहित frontmatter — तीनों खाली स्किल पंजीकृत करने के बजाय माउंट विफल कर देते हैं।

## सतहें

**स्किल** — `plugin-upgrade` (डिफ़ॉल्ट रूप से मॉडल और व्यक्ति दोनों द्वारा आमंत्रित). बॉडी: पैर-रूटिंग तालिका, 8 कठोर नियम और 6-चरणीय चक्र। संदर्भ: विलयित कॉरिडोर कार्ड। स्क्रिप्ट: डिटेक्टर, स्किल डायरेक्टरी के भीतर भेजा गया, ताकि सापेक्ष पथ हल हों।

**CLI** — `dsh-plugin-upgrade-scan`:

```sh
dsh-plugin-upgrade-scan [--repo <path>] [--span legAB|legC|<span>] [--json <out.json>] [--seams S3,C1,P1] [--quiet]
```

| फ़्लैग | अर्थ |
|---|---|
| `--repo <path>` | स्कैन करने वाली रिपॉज़िटरी (डिफ़ॉल्ट: वर्तमान डायरेक्टरी)। उसका घोषित dsh बैंड कॉरिडोर चुनता है। |
| `--span legAB\|legC\|<span>` | घोषित बैंड से अनुमान लगाने के बजाय कॉरिडोर बाध्य करें। अज्ञात बैंड `legAB` पर लौट आता है। |
| `--json <out.json>` | मशीन-पठनीय रिपोर्ट भी लिखें (`repo`, `scannedAt`, `files`, `hits[]`, `bySeam`)। |
| `--seams S3,C1,P1` | हल किए गए कॉरिडोर के कैटलॉग की केवल निर्दिष्ट सीमों तक सीमित करें (सीम id कभी कॉरिडोरों के बीच साझा नहीं होते)। |
| `--quiet` | मानव-पठनीय आउटपुट बंद करें (`--json` के साथ उपयोगी)। |

एग्ज़िट कोड: `0` कोई error-स्तर हिट नहीं · `1` कम से कम एक error-स्तर हिट · `2` उपयोग या स्कैन विफलता। स्वच्छ स्कैन आवश्यक है पर पर्याप्त नहीं — निर्गम मानदंड असली होस्ट स्मोक है, साथ ही लॉग लेखकों के लिए एक रिज़्यूम राउंड-ट्रिप (पैर A) और क्लाइंट आधे हिस्से के लिए असली ब्राउज़र अभिकथन (पैर B)।

## बीस `legAB` सीमें

क्रम `lib/scan.mjs` के कैटलॉग का अनुसरण करता है (पहले पैर A, फिर पैर B), और यही वह क्रम है जिस पर `test/card.test.mjs` कार्ड को pinned रखता है।

| Id | स्तर | `0.1.5-rc.1` तक के रास्ते में क्या बदला |
|---|---|---|
| `S3` | error | `assistant/message` में अनिवार्य `stream` फ़ील्ड जुड़ा (सत्र प्रारूप V3): उसके बिना लिखा लॉग सफलतापूर्वक import होता है और फिर रिज़्यूम करने से इनकार कर देता है (`Session.fromRestore` `invalid settlement fields` फेंकता है)। |
| `S8` | error | `SessionHandle.read()` इवेंट array के बजाय `SessionHandleReadResult` (`{ eventState, events }`) लौटाता है; array संक्रियाओं को `.events` खोलना पड़ता है। |
| `S9` | error | `SystemPrompt` के कॉन्फ़िग ने `persona` → `personaPrefix` / `personaSuffix` कर दिया। `includeHarnessIdentity: false` लगाना **समतुल्य नहीं** है — वह हार्नेस पहचान ब्लॉक को मिटा देता है। |
| `M1` | error | स्थानीय गेट एक पुरानी टाइप लाइन कंपाइल करता है: `0.1.5-alpha.*` पर pinned dev/test टाइप, या किसी अनुपस्थित checkout डायरेक्टरी की ओर इंगित `tsconfig` `paths` alias, TypeScript को चुपचाप प्रकाशित टाइप पर लौटा देते हैं। हरा गेट, ग़लत पैमाना। |
| `S4` | error | `tool/code-dispatch` का नाम `tool/ptc-dispatch` हो गया; पुराना लेबल V3 सत्रों में अब मान्य नहीं है। |
| `S5` | error | `ctx.agent` हटा दिया गया: बुलाने वाले को Agent स्पष्ट रूप से पास करना होगा (जैसे `setup(agentCtx, agent)` का दूसरा पैरामीटर)। |
| `S6` | error | `Inbox` एक type interface है, बनाने योग्य class नहीं; fixtures आधिकारिक असमर्थित आकृति इस्तेमाल करते हैं और runtime कोड `agent.inbox` पढ़ता है। |
| `S7` | warn | `SubprocessHandle.pid` हटा दिया गया (केवल `SubprocessTerminalHandle.pid` बचा है); टेस्ट fixtures से यह फ़ील्ड हटा दें। |
| `S2` | warn | `EpochHeader.system` हटा दिया गया: सिस्टम प्रॉम्प्ट अब सरफ़ेस नोड 0 का `system/message` है। |
| `S1` | warn | सत्र प्रारूप V3 और generation-प्रत्यय वाले लॉग नाम — वर्तमान generation `session.v3.jsonl.zstd` है, इसलिए `session.jsonl.zstd` को hardcode करने वाली स्क्रिप्टें चुपचाप विफल होती हैं। |
| `S10` | warn | प्लगइन द्वारा लिखे सत्र इवेंट होस्ट के fail-closed अनुकूलन गेट से होकर जाने चाहिए: `Session.append` में `ignorable` लेखन चैनल नहीं है, इसलिए बिना शर्त append किसी सत्र को अपठनीय बना सकता है। |
| `C1` | error | नंगा क्लाइंट स्लॉट `conversation` हटाया गया और उसकी जगह `main` + `main.conversation` आया, **कोई alias नहीं**। `ctx.slots.inject()` केवल तब चलता है जब declaration मौजूद हो, इसलिए उसे लक्षित करने वाला प्लगइन **चुपचाप** माउंट होना बंद कर देता है। |
| `C2` | error | `@deepseek-ai/dsh-client-ui-sidebar-textpreview` का नाम `…-sidebar-documentpreview` हो गया; पुराना नाम गायब है और कोई shim पैकेज नहीं। |
| `P1` | error | पीयर बैंड का दूसरा खंड बना रहना चाहिए: अकेला `>=0.1.2-rc.1 <0.2.0`, npm semver के prerelease-tuple नियम के तहत `0.1.5-rc.1` को **अस्वीकार** करता है (semver 7.8.5 पर मापा गया `false`)। |
| `C4` | warn | rc.1 ने वैश्विक मुख्य-पैनल मॉडल जोड़ा (`main`, `sidebar.panellist`, `ctx.layout.selectPanel(MainPanelId \| null)`) और लगभग हर स्लॉट में `usePanelInfo` मानक prop जोड़ा। |
| `C5` | warn | दस्तावेज़ पूर्वावलोकन keyed स्लॉट `sidebar.right.tab.document` (`DocumentContent`) पर चला गया; `sidebar.right.pane.tab` बचा है पर उसका पैरेंट प्रवेश `rightbar.session` हो गया। |
| `H1` | warn | `KNOWN_SESSION_EVENT_TYPES` में `deliverables/presented` और `subagent/catalog` जुड़े — fail-closed शब्दावली बढ़ी। |
| `H2` | warn | नए `present` टूल की पंक्ति `tool.call.toolview` की कुंजी `'present'` लेती है, जो alpha.1 में खाली थी। |
| `H4` | info | DeepSeek अडैप्टर का डिफ़ॉल्ट सलाहकारी मॉडल कैटलॉग अब `deepseek-flash` (DeepSeek-V41-Flash) से शुरू होता है। |
| `H3` | info | नई वैकल्पिक क्षमताएँ: `ctx.sessionFeedback`, `ctx.layout.beginNavigation()`, `ctx.workspaces.openSession()` / `openWorkspace()` / `forkSession()`। कार्ड पर सूचीबद्ध; जानबूझकर कोई स्वचालित पहचान नहीं। |

`S7`, `S2`, `S1`, `S10`, `C4`, `C5`, `H1`, `H2` और `H4` जानबूझकर सलाहकारी हैं: उनके वैध मेल हैं (पहले से नई API इस्तेमाल करता रेपो, दस्तावेज़ snapshot, प्लगइन की अपनी मॉडल-id तालिका, Node का `ChildProcess.pid`), इसलिए स्कैनर उन्हें विफलता नहीं बल्कि मानवीय समीक्षा के सुराग के रूप में बताता है। `M1` और `P1` **संरचित** जाँचें हैं — वे पाठ मिलाने के बजाय `package.json` और `tsconfig*.json` हल करती हैं — और `H3` **केवल-कार्ड** है: प्रलेखित, id-समानता से जाँचा गया, और जानबूझकर बिना किसी डिटेक्टर के (`CARD_ONLY = ['H3']`)।

## पाँच `legC` सीमें (`0.1.5-rc.2` → `0.1.6-alpha.2`)

क्रम `lib/scan-0.1.6.mjs` के कैटलॉग का अनुसरण करता है, और यही वह क्रम है जिस पर `test/card.test.mjs` `legC` कार्ड को pinned रखता है। यहाँ हर सीम `error` है और हर एक पकड़ी जाती है (`CARD_ONLY = []`)।

| Id | स्तर | `0.1.6-alpha.2` तक के रास्ते में क्या बदला |
|---|---|---|
| `E1` | error | `agent/created` के listeners क्रमिक रूप से dispatch होते हैं: कोई listener जो फेंकता है — या जो धीमा काम करता है — agent निर्माण को सीधे अवरुद्ध कर देता है। synchronous काम को `try`/`catch` में लपेटें और बाकी को `queueMicrotask`/`setImmediate` या अपनी कतार से टालें। |
| `E2` | error | ऐसा async `apply()` जिसका पहला `await` उसके पंजीकरणों से पहले आता है: उसके बाद पंजीकृत कुछ भी unload विंडो में गिरता है और `INACTIVE_EFFECT` फेंकता है, जबकि पुराना closure चलता रहता है। सब कुछ पहले `await` से पहले, एक ही `ctx.effect()` के भीतर पंजीकृत करें। |
| `E3` | error | हटाई गई slot/state कुंजियाँ: `settings.plugin.item` अब keyed→list `plugins.item` हो गई, और `SessionListState.current` चला गया — सेटिंग्स कार्ड **चुपचाप** गायब हो जाता है (`spec === undefined` पर जल्दी वापसी), और `current` के casts तब भी कंपाइल होते रहते हैं जब सुविधा मृत है। |
| `E4` | error | हटाई गई client API: `sessions.open` / `openSubagent` / `clear` अब `retain` / `using` / `retainInfo` हो गईं। |
| `E5` | error | हटाए गए मॉडल literals: `deepseek-v4-flash*` और `deepseek-v4-vision-exp`। डिफ़ॉल्ट मॉडल कैटलॉग 4 से घटकर 2 रह गया, और बिना कैटलॉग वाला id केवल-पाठ के रूप में पार हो जाता है। |

`legAB` जैसी ही अनुशासन लागू होती है: स्वच्छ स्कैन आवश्यक है, पर्याप्त नहीं। `legC` की टूटन चुपचाप या केवल runtime में होती है (प्रकाशित टाइप लाइन उन विलोपनों को छिपा देती है), इसलिए निर्गम मानदंड अस्थायी `DSH_HOME` पर असली होस्ट स्मोक ही रहता है, साथ ही जहाँ लागू हों वहाँ लॉग-लेखक राउंड-ट्रिप और असली ब्राउज़र अभिकथन।

## यह क्या कवर नहीं करता

- **यहाँ के हर कॉरिडोर से आगे की कोई छलांग।** `legAB` रचना से ही `0.1.5-rc.1` पर समाप्त होता है: हार्नेस की छलांग `0.1.5-rc.1` → `0.1.5-rc.2` ने प्लगइन-मुखी कोई सीम नहीं जोड़ी (इस पैकेज का अपना dev/test pin अब `0.1.7-rc.2` लाइन पर चलता है, ताकि कैटलॉग उन प्रकाशित टाइप के विरुद्ध सत्यापित हो; compat workflow का प्रोब अभी भी `0.1.6-alpha.2` पर anchored है), और `legC` `0.1.5-rc.2` → `0.1.6-alpha.2` को कवर करता है। बाद में सीम जोड़ने वाली कोई छलांग **कवर नहीं** होती: कॉरिडोर बंद होता है, और कार्ड को चौड़ा करना नया कार्ड जोड़ने से बुरा है। उसे नया कार्ड और सूचकांक में नई पंक्ति मिलती है — नया पैकेज नहीं।
- **`0.1.1` → `0.1.2` की छलांग।** समुदाय की convergence स्किल इस्तेमाल करें।
- **पैरों के बीच सीमें दोहराना।** सत्र-प्रारूप सीमें पैर A की हैं (`assistant/message.stream`, `SessionHandleReadResult`, `EpochHeader.system`, `ctx.agent`, `Inbox`, `SystemPrompt.persona`, V3 लॉग generation) और पैर B उन्हें दोबारा नहीं लिखता — पैर B के विस्तार में `packages/core/session/src` का पूरा diff दो जुड़े event-type literals और एक टिप्पणी पंक्ति है। हर पैर का कार्ड अनुभाग अपना दायरा-कथन रखता है।
- **DSH की उपयोगकर्ता-मुखी अपग्रेड राह।** यह पैकेज *प्लगइन स्रोत कोड* अपग्रेड करता है, उपयोगकर्ता की harness इंस्टॉलेशन नहीं।
- **थीम टोकन।** पैर B के विस्तार में `docs/web-styling.md` में शून्य परिवर्तन है।
- **प्रमाण।** स्वच्छ स्कैन एक परिकल्पना है। निर्गम मानदंड असली होस्ट स्मोक है (अस्थायी `DSH_HOME`, लक्ष्य CLI, `plugin add <tarball>`, `--dump-config`), साथ ही सत्र-लॉग लेखकों के लिए एक रिज़्यूम राउंड-ट्रिप (पैर A) और हर क्लाइंट-पक्ष हिट के लिए असली ब्राउज़र अभिकथन (पैर B)।

## सुरक्षा सीमाएँ

- **केवल-पठन स्कैन।** CLI स्कैन की जा रही रिपॉज़िटरी के भीतर कभी नहीं लिखता; `--json` केवल आपके दिए पथ पर लिखता है।
- **कोई नेटवर्क नहीं, कोई shell नहीं।** स्कैनर Node की मानक लाइब्रेरी के अलावा कुछ import नहीं करता और कोई प्रक्रिया नहीं चलाता।
- **कोई रहस्य नहीं।** पैकेज में कुछ भी क्रेडेंशियल, एनवायरनमेंट टोकन या सत्र डेटा नहीं पढ़ता।
- **सैंडबॉक्स स्मोक विधि।** कार्ड की असली-होस्ट जाँच `mkdtemp` वाला `DSH_HOME` इस्तेमाल करती है; आपका असली `~/.dsh` कभी नहीं छूती।

## विकास

```sh
npm install                        # या: pnpm install (रेपो में pnpm-lock.yaml है)
npm test                           # node --test: स्कैनर, कार्ड<->कैटलॉग समानता, असली Cordis + SkillRegistry
npm run verify:self-contained      # हर import पैकेज के भीतर हल होता है
npm run verify:artifacts           # tarball में स्किल, CLI और patch हैं, और परीक्षण शामिल नहीं
npm run check:readmes              # पाँच-भाषा README स्थिरता
npm pack
```

स्कैनर के पास **हर `legAB` पैर के लिए** संश्लेषित fixtures की एक जोड़ी है: `fixtures/leg-a-bad-repo` (पैर A की सत्र/कॉन्फ़िग सीमें, हर error सीम जानबूझकर मौजूद) के साथ `fixtures/leg-a-good-repo` (अनुकूलित), और `fixtures/bad-repo` (पैर B की क्लाइंट-स्लॉट सीमें) के साथ `fixtures/good-repo` (अनुकूलित) — साथ ही पहले से `0.1.5-rc.1` पर pinned एक परिवार रेपो पर live negative, ताकि कैटलॉग में रिग्रेशन डाउनस्ट्रीम उपयोगकर्ता के बजाय इस सूट में विफल हो। `test/card.test.mjs` दावा करता है कि हर कार्ड का सूचकांक और उसका अपना कैटलॉग (`legAB` के लिए `lib/scan.mjs`, `legC` के लिए `lib/scan-0.1.6.mjs`) **ठीक वही** सीम id और समान स्तर बताते हैं, कि `legAB` का `CARD_ONLY` ठीक `['H3']` है जबकि `legC` का खाली है, और कि दोनों कैटलॉग कोई सीम id साझा नहीं करते — साक्ष्य-बद्धता नियम एक मशीन गेट के रूप में, हर कॉरिडोर के लिए।

## विषय टैग

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `plugin-upgrade`, `migration`, `skill`, `version-card`, `scanner`, `client-slots` (`package.json` के keywords के समान; `dsh-plugin` पारिस्थितिकी का दृश्यता चैनल है)।

## PerryLink DSH Plugin Family

यह प्रोजेक्ट [PerryLink](https://github.com/PerryLink) के DeepSeek Harness प्लगइन परिवार का हिस्सा है। पूरी सूची नीचे संक्षिप्त रखी गई है ताकि हर README की पहली स्क्रीन छोटी रहे; हर पंक्ति और उसकी स्थिति देखने के लिए इसे खोलें।

<details>
<summary>सभी प्लगइन खोलें</summary>

| प्लगइन | स्थिति |
|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** |  |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** |  |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** |  |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** |  |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** |  |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** |  |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** |  |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** |  |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** |  |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** |  |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 सेवानिवृत्त — रिपॉज़िटरी README देखें |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 सेवानिवृत्त — रिपॉज़िटरी README देखें |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 सेवानिवृत्त — रिपॉज़िटरी README देखें |

</details>

## लाइसेंस

Apache-2.0 — देखें [LICENSE](LICENSE)। इंस्टॉल-समय निर्भरताएँ और उनके लाइसेंस [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) में सूचीबद्ध हैं; कुछ भी बंडल नहीं किया गया।
