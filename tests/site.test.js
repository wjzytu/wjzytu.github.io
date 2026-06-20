const assert = require('node:assert/strict');
const { existsSync, readFileSync, statSync } = require('node:fs');
const { test } = require('node:test');

const html = readFileSync('index.html', 'utf8');
const css = readFileSync('assets/css/styles.css', 'utf8');
const js = readFileSync('assets/js/main.js', 'utf8');
const pdfHtml = readFileSync('resume-pdf.html', 'utf8');
const pdfHtmlEn = readFileSync('resume-pdf-en.html', 'utf8');
const pdfCss = readFileSync('assets/css/resume-pdf.css', 'utf8');
const pdfGenerator = readFileSync('scripts/generate_resume_pdfs.py', 'utf8');
const pdfPath = 'assets/files/xiajunhui-ios-resume.pdf';
const pdfPathEn = 'assets/files/junhui-xia-ios-resume-en.pdf';
const latinFontPath = 'assets/fonts/inter/InterVariable.otf';
const profileImagePath = 'assets/images/profile.png';
const wechatQrPath = 'assets/images/qrcode-wechat.png';
const qqQrPath = 'assets/images/qrcode-qq.png';

test('renders resume content from the provided PDF', () => {
  [
    '夏军辉',
    '11年工作经验',
    '追觅科技（苏州）有限公司',
    '微泰医疗器械（杭州）股份有限公司',
    '中通云仓科技有限公司',
    '杭州法戴国际贸易有限公司',
    '新乡学院',
    'hello@uxiu.me',
  ].forEach((text) => assert.match(html + pdfHtml, new RegExp(text)));
});

test('keeps polished personal advantages on the web page', () => {
  [
    '11年工作经验，长期负责 iOS App 架构、开发、上架和线上问题排查',
    '熟练掌握 Objective-C、Swift、SwiftUI，既能处理历史项目，也能跟进 Apple 生态新能力。',
    '开发并上架过多款 App，熟悉 App 生命周期、蓝牙固件升级、日志记录、后台保活、通知提醒与撤销等移动端关键能力。',
    '能够准确理解并实现产品需求，必要时提出自己的理解和建议，有项目管理和跨团队沟通经验。',
    '熟练使用 AI 工具为工作提效，正在学习 Flutter，并在工作中使用过 React Native。',
    '做过蓝牙 BLE、苹果手表 Apple Watch、Apple Health、小组件、手表表盘、React Native 等项目，能把硬件、移动端和 Apple 生态能力串起来落地。',
  ].forEach((text) => {
    assert.ok(html.includes(text), `missing from index.html: ${text}`);
    assert.ok(js.includes(text), `missing from main.js: ${text}`);
  });
});

test('keeps detailed responsibilities and technical highlights from the PDF', () => {
  [
    'Cocoapods',
    '合规证书',
    '代码追溯文档',
    '表盘展示',
    '后台运行',
    '海藻数据平台',
    '17个功能模块',
    '琥珀CRM',
    'WebViewJavascriptBridge',
    '二进制重排',
    'WPS',
    '老板、内勤、业务员',
    '活动订单的退货',
    '拖动地图',
  ].forEach((text) => assert.match(html + pdfHtml, new RegExp(text)));
});

test('expands Dreame smart ring responsibilities with health and RN details', () => {
  [
    'App 主体框架基于 React Native',
    '本地 SDK 与 RN 通讯',
    '音乐播放监控',
    '心率、体温、血氧',
    '戒指采集的健康数据、睡眠数据',
    '功能订阅的 Apple 内购',
    '心电图绘制',
  ].forEach((text) => assert.match(html + js + pdfHtml, new RegExp(text)));

  [
    'React Native shell',
    'native SDK',
    'music playback monitoring',
    'heart rate, body temperature, and blood oxygen',
    'sleep data',
    'Apple in-app purchase subscription',
    'ECG drawing',
  ].forEach((text) => assert.match(js, new RegExp(text)));
});

test('translates enriched resume details into English', () => {
  [
    'CocoaPods',
    'compliance certificates',
    'code traceability',
    'watch-face display',
    '17 feature modules',
    'WPS',
    'business owner, operations staff, and sales team',
    'campaign order return logic',
    'AMap-based map dragging',
    'Project experience',
    'Production Log Troubleshooting',
  ].forEach((text) => assert.match(js, new RegExp(text)));
});

test('provides language controls and translated content hooks', () => {
  assert.match(html, /lang="zh-CN"/);
  assert.match(html, /data-lang="zh"/);
  assert.match(html, /data-lang="en"/);
  assert.match(html, /data-i18n=/);
  assert.match(js, /resumeTranslations/);
  assert.match(js, /localStorage\.setItem\('resumeLanguage'/);
});

test('provides persistent light and dark themes', () => {
  assert.match(html, /data-theme="light"/);
  assert.match(html, /<meta name="color-scheme" content="light dark">/);
  assert.match(html, /<meta name="theme-color" content="#eef3f6" data-theme-color>/);
  assert.match(html, /data-theme-toggle/);
  assert.match(html, /class="theme-icon-sun"/);
  assert.doesNotMatch(js, /fa-sun-o/);
  assert.match(css, /:root/);
  assert.match(css, /html\[data-theme="light"\]\s*{[^}]*color-scheme:\s*only light/s);
  assert.match(css, /html\[data-theme="dark"\]/);
  assert.match(css, /html\[data-theme="dark"\]\s*{[^}]*color-scheme:\s*only dark/s);
  assert.match(css, /html\[data-theme="light"\] body\s*{[^}]*background:\s*#eef3f6 !important;[^}]*color:\s*#29323d !important/s);
  assert.match(css, /\.theme-button\[aria-pressed="true"\] \.theme-icon-sun\s*{[^}]*display:\s*block/s);
  assert.match(js, /localStorage\.setItem\('resumeTheme'/);
  assert.match(js, /root\.style\.colorScheme/);
  assert.match(js, /themeSchemeMeta\.setAttribute\('content'/);
  assert.match(js, /themeColorMeta\.setAttribute\('content'/);
  assert.match(js, /themeTokens/);
  assert.match(js, /root\.style\.setProperty\(name,\s*tokens\[name\]\)/);
});

test('uses a refined resume typography system and keyword emphasis', () => {
  assert.match(css, /--font-size-body:\s*15\.8px/);
  assert.match(css, /--font-size-lead:\s*16\.8px/);
  assert.match(css, /--weight-title:\s*850/);
  assert.match(css, /--border:\s*#dbe5ec/);
  assert.match(css, /--border-strong:\s*#cfdbe4/);
  assert.match(css, /\.profile-image\s*{[^}]*width:\s*154px;[^}]*height:\s*154px;[^}]*flex:\s*0 0 154px;[^}]*border:\s*2px solid var\(--border\)/s);
  assert.match(css, /\.segmented-control\s*{[^}]*height:\s*44px;[^}]*border:\s*1px solid var\(--border\)/s);
  assert.match(css, /\.theme-button,[\s\S]*?\.action-button\s*{[^}]*height:\s*44px;[^}]*min-height:\s*44px;[^}]*border-color:\s*var\(--border\)/s);
  assert.match(css, /\.section-inner\s*{[^}]*border:\s*1px solid var\(--border\)/s);
  assert.match(css, /\.text-highlight\s*{[^}]*font-weight:\s*750/s);
  assert.match(html, /<div class="timeline-head">[\s\S]*?<h3 data-i18n="work\.dreame\.company">[\s\S]*?<div class="timeline-meta">/);
  assert.match(css, /\.timeline-item\s*{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /\.timeline-head\s*{[^}]*justify-content:\s*space-between/s);
  assert.match(css, /\.timeline-meta\s*{[^}]*text-align:\s*right/s);
  assert.match(css, /\.timeline-meta span\s*{[^}]*border-radius:\s*6px/s);
  assert.match(css, /\.project-card\s*{[^}]*background:\s*transparent/s);
  assert.match(html, /<div class="content" data-highlight-scope>/);
  assert.match(html, /<div class="timeline" data-highlight-scope>/);
  assert.match(html, /<div class="project-list" data-highlight-scope>/);
  assert.match(js, /highlightKeywords/);
  assert.match(js, /applyKeywordHighlights/);
  assert.match(js, /AI 工具/);
  assert.match(js, /SwiftUI/);
});

test('uses Inter for Latin text while keeping Chinese font configurable', () => {
  assert.equal(existsSync(latinFontPath), true, `missing font: ${latinFontPath}`);
  assert.ok(statSync(latinFontPath).size > 50000, `font looks too small: ${latinFontPath}`);

  [css, pdfCss].forEach((stylesheet) => {
    assert.match(stylesheet, /font-family:\s*"ResumeLatin"/);
    assert.match(stylesheet, /InterVariable\.otf/);
    assert.match(stylesheet, /format\("opentype"\)/);
    assert.match(stylesheet, /font-weight:\s*100 900/);
    assert.doesNotMatch(stylesheet, /Monda/);
    assert.match(stylesheet, /unicode-range:\s*U\+0000-00FF/);
    assert.match(stylesheet, /--font-latin:\s*"ResumeLatin"/);
    assert.match(stylesheet, /--font-chinese:/);
    assert.match(stylesheet, /--font-body:\s*var\(--font-latin\),\s*var\(--font-chinese\)/);
    assert.match(stylesheet, /font-family:\s*var\(--font-body\)/);
  });
});

test('provides mobile sharing and PDF export actions', () => {
  assert.match(html, /data-resume-action/);
  assert.match(html, /data-action-label/);
  assert.match(html, /<span data-action-label data-i18n="controls\.shareResume">分享<\/span>/);
  assert.match(js, /'controls\.shareResume': '分享'/);
  assert.match(js, /'controls\.shareResume': 'Share'/);
  assert.doesNotMatch(html + js, /分享简历|Share Resume/);
  assert.match(js, /navigator\.share/);
  assert.match(js, /await navigator\.share\(getSharePayload\(language\)\)/);
  assert.match(js, /if \(isMobileViewport\(\)\)\s*{[\s\S]*?setActionVisual\('fa fa-share-alt', dictionary\['controls.shareResume'\]\)/);
  const shareResumeBlock = js.match(/async function shareResume[\s\S]*?function translatePage/)[0];
  assert.doesNotMatch(shareResumeBlock, /copyResumeLink/);
  assert.doesNotMatch(js, /shareResumePdf/);
  assert.doesNotMatch(js, /navigator\.canShare/);
  assert.match(js, /navigator\.clipboard\.writeText/);
  assert.match(js, /assets\/files\/xiajunhui-ios-resume\.pdf/);
  assert.match(js, /assets\/files\/junhui-xia-ios-resume-en\.pdf/);
  assert.match(js, /resumePdfFiles/);
  assert.match(js, /function downloadResumePdf\(language\)/);
  assert.match(js, /resumePdfFiles\[language\] \|\| resumePdfFiles\.zh/);
  assert.match(js, /updateResumeActionLabel/);
  assert.match(css, /@media print/);
  assert.match(css, /\.site-controls/);
  assert.match(css, /a\[href\]:after/);
  assert.match(css, /\.level-bar/);
  assert.match(css, /display:\s*none\s*!important/);
  assert.equal(existsSync(pdfPath), true);
  assert.ok(statSync(pdfPath).size > 50000);
  assert.equal(existsSync(pdfPathEn), true);
  assert.ok(statSync(pdfPathEn).size > 50000);
});

test('keeps expected city and salary out of the hero quick facts', () => {
  const quickFacts = html.match(/<ul class="quick-facts list-inline">[\s\S]*?<\/ul>/)[0];
  assert.doesNotMatch(quickFacts + js, /期望城市|Preferred city|hero\.city|hero\.salary|25-30K|25-35K/);
  assert.doesNotMatch(quickFacts, /期望薪资|Expected salary/);
});

test('uses the simplified contact details with copyable WeChat and expected salary', () => {
  const contactSection = html.match(/<section class="section info">[\s\S]*?<\/section>/)[0];
  [
    'changzuibuxingzimeng',
    '薪资面议',
    'data-copy-value="changzuibuxingzimeng"',
  ].forEach((text) => assert.match(contactSection + js + pdfHtml, new RegExp(text)));

  [
    '复制微信号成功',
    'WeChat ID copied',
    'Expected salary: Negotiable',
  ].forEach((text) => assert.match(js + pdfHtmlEn, new RegExp(text)));

  assert.doesNotMatch(contactSection + js + pdfHtml, /期望薪资：面议/);

  [
    'GitHub：github.com/uxiume',
    '在线简历',
    '求职意向',
    '到岗时间',
    'GitHub: github.com/uxiume',
    'Online resume',
    'Job target',
    'Availability',
  ].forEach((text) => assert.doesNotMatch(contactSection + pdfHtml + pdfHtmlEn, new RegExp(text)));
});

test('removes the core highlights module from web and PDF resumes', () => {
  [
    '核心亮点',
    'Core Highlights',
    'highlights.heading',
    'Apple Watch 独立开发',
    'Independent Apple Watch development',
    'RN 原生 SDK 桥接与智能硬件项目经验',
    'RN native SDK bridging and smart hardware experience',
  ].forEach((text) => assert.doesNotMatch(html + js + pdfHtml + pdfHtmlEn, new RegExp(text)));
});

test('uses official Font Awesome icons for WeChat and QQ actions', () => {
  assert.match(html, /class="fa fa-weixin"/);
  assert.match(html, /class="fa fa-qq"/);
  assert.match(html, /src="assets\/images\/qrcode-wechat\.png\?v=20260613-white"/);
  assert.match(html, /src="assets\/images\/qrcode-qq\.png\?v=20260613-qq-1931"/);
  assert.equal((html.match(/data-qr-image/g) || []).length, 2);
  assert.equal((html.match(/data-qr-save/g) || []).length, 2);
  assert.equal((html.match(/data-qr-close/g) || []).length, 2);
  assert.equal((html.match(/data-i18n="qr\.save"/g) || []).length, 2);
  assert.match(html, /aria-label="保存微信二维码"/);
  assert.match(html, /aria-label="保存QQ二维码"/);
  assert.match(html, /aria-label="关闭微信二维码弹窗"/);
  assert.match(html, /aria-label="关闭QQ二维码弹窗"/);
  assert.equal(existsSync(wechatQrPath), true, `missing QR image: ${wechatQrPath}`);
  assert.equal(existsSync(qqQrPath), true, `missing QR image: ${qqQrPath}`);
  assert.ok(statSync(wechatQrPath).size < 45000, `WeChat QR image should stay compressed: ${wechatQrPath}`);
  assert.ok(statSync(qqQrPath).size < 60000, `QQ QR image should stay compressed: ${qqQrPath}`);
  assert.match(js, /function saveQrImage/);
  assert.match(js, /'qr\.save': '保存二维码'/);
  assert.match(js, /'qr\.save': 'Save QR code'/);
  assert.match(js, /function prepareQrDownloadUrl/);
  assert.match(js, /application\/octet-stream/);
  assert.match(js, /qrDownloadUrl/);
  assert.match(js, /downloadQrImage/);
  assert.match(js, /已开始下载/);
  const saveQrImageBlock = js.match(/async function saveQrImage[\s\S]*?function closeQrPopups/)[0];
  assert.doesNotMatch(saveQrImageBlock, /navigator\.share|navigator\.canShare|new File/);
  assert.match(js, /function closeQrPopups/);
  assert.match(js, /function openQrPopup/);
  assert.match(js, /data-qr-backdrop/);
  assert.match(css, /\.qr-popup img\s*{[^}]*margin:\s*0 auto/s);
  assert.match(css, /\.qr-save-btn\s*{[^}]*margin:\s*10px auto 0/s);
  assert.match(css, /\.qr-close-btn\s*{/);
  assert.match(css, /\.qr-backdrop\s*{/);
  const socialQrButtons = html.match(/<button class="social-qr-btn"[\s\S]*?<\/button>/g) || [];
  assert.equal(socialQrButtons.length, 2);
  socialQrButtons.forEach((buttonHtml) => assert.doesNotMatch(buttonHtml, /<svg/));
  const socialHtml = html.match(/<ul class="social list-inline">[\s\S]*?<\/ul>/)[0];
  const socialOrder = [
    'aria-label="Phone"',
    'data-qr-type="wechat"',
    'data-qr-type="qq"',
    'aria-label="Email"',
    'aria-label="GitHub"',
  ].map((marker) => socialHtml.indexOf(marker));
  assert.deepEqual(
    socialOrder,
    [...socialOrder].sort((a, b) => a - b),
    'social actions should be ordered as phone, WeChat, QQ, email, GitHub',
  );
  assert.match(css, /\.social a \.fa,[\s\S]*?\.social-qr-btn \.fa\s*{[\s\S]*?width:\s*20px;[\s\S]*?height:\s*20px;/);
});

test('keeps image assets compressed for faster loading', () => {
  assert.ok(statSync(profileImagePath).size < 20000, `profile image should stay compressed: ${profileImagePath}`);
  assert.ok(statSync('assets/images/github-chart.png').size < 8000);
  [
    'assets/images/projects/project-1.png',
    'assets/images/projects/project-2.png',
    'assets/images/projects/project-3.png',
    'assets/images/projects/project-4.png',
    'assets/images/projects/project-5.png',
  ].forEach((imagePath) => {
    assert.ok(statSync(imagePath).size < 35000, `project image should stay compressed: ${imagePath}`);
  });
  assert.ok(statSync('assets/images/projects/project-featured.png').size < 100000);
  assert.ok(statSync('assets/images/projects/project-2.jpg').size < 15000);
});

test('keeps requested skill progress values', () => {
  const skillSection = html.match(/<section class="section skills">[\s\S]*?<\/section>/)[0];
  assert.match(skillSection, /<span>Objective-C<\/span>[\s\S]*?style="width: 95%"/);
  assert.match(skillSection, /<span>Swift<\/span>[\s\S]*?style="width: 95%"/);
  assert.match(skillSection, /<span>SwiftUI<\/span>[\s\S]*?style="width: 80%"/);
  assert.match(skillSection, /<span[^>]*>Cocoapods \/ 组件化<\/span>[\s\S]*?style="width: 90%"/);
  assert.match(skillSection, /<span[^>]*>苹果手表\/苹果健康<\/span>[\s\S]*?style="width: 86%"/);
  assert.match(skillSection, /<span[^>]*>蓝牙 \/ OTA<\/span>[\s\S]*?style="width: 90%"/);
  assert.match(skillSection, /<span>React Native \/ Flutter<\/span>[\s\S]*?data-i18n="skills.project"/);
  [
    'Objective-C',
    'Swift',
    'SwiftUI',
    'Cocoapods / 组件化',
    '苹果手表/苹果健康',
    '蓝牙 / OTA',
    'React Native / Flutter',
    'AI Tools / Cursor / Codex',
  ].reduce((previousIndex, marker) => {
    const nextIndex = skillSection.indexOf(marker);
    assert.ok(nextIndex > previousIndex, `${marker} should be in the requested skill order`);
    return nextIndex;
  }, -1);
  assert.ok(
    skillSection.indexOf('React Native / Flutter') < skillSection.indexOf('AI Tools / Cursor / Codex'),
    'AI tools skill should be the final web skill item',
  );
  assert.match(skillSection, /<span>AI Tools \/ Cursor \/ Codex<\/span>[\s\S]*?data-i18n="skills.ai"[\s\S]*?style="width: 78%"/);
  assert.match(js, /'skills.ai': 'AI 提效'/);
  assert.match(js, /'skills.ai': 'Daily productivity'/);
  assert.match(js, /'skills.privatePods': '熟练'/);
  assert.match(js, /'skills.bleOta': '项目经验'/);
  assert.match(js, /'skills.watchHealthName': 'Apple Watch \/ Apple Health'/);
  assert.doesNotMatch(skillSection, /Swift \/ SwiftUI/);
  assert.doesNotMatch(skillSection, /Bluetooth LE \/ OTA/);
  assert.doesNotMatch(skillSection, /Cocoapods 私有库 \/ 组件化/);
  assert.doesNotMatch(skillSection, /实践与学习中/);
});

test('adds the requested domain experience tags in Chinese and English', () => {
  const toolboxSection = html.match(/<section class="section toolbox">[\s\S]*?<\/section>/)[0];
  [
    'Objective-C',
    'Swift',
    'SwiftUI',
    'ReactNative',
    'Flutter',
    'Cocoapods',
    '智能穿戴',
    '医疗App开发审核',
    '医疗合规文档',
    '地图',
    '数据库',
  ].forEach((text) => assert.match(toolboxSection, new RegExp(text)));

  [
    "'toolbox.reactNative': 'React Native'",
    "'toolbox.wearable': 'Smart Wearables'",
    "'toolbox.medicalApp': 'Medical App Development & Review'",
    "'toolbox.medicalDocs': 'Medical Compliance Documentation'",
    "'toolbox.map': 'Maps'",
    "'toolbox.database': 'Database'",
  ].forEach((text) => assert.ok(js.includes(text), `missing translation: ${text}`));
});

test('uses a dedicated PDF resume template instead of the web layout', () => {
  [pdfHtml, pdfHtmlEn].forEach((template) => {
    assert.match(template, /class="pdf-resume-document"/);
    assert.match(template, /class="pdf-page"/);
    assert.match(template, /class="pdf-skill-band"/);
    assert.match(template, /class="pdf-project-detail"/);
    assert.doesNotMatch(template, /href="https:\/\/github\.com\/uxiume"/);
  });
  assert.match(pdfHtml, /企业 OA<\/span>\s*<span>AI Tools \/ Cursor \/ Codex<\/span>/);
  assert.match(pdfHtmlEn, /Enterprise OA<\/span>\s*<span>AI Tools \/ Cursor \/ Codex<\/span>/);
  assert.match(pdfCss, /@page\s*{[^}]*size:\s*A4;[^}]*margin:\s*13\.5mm 17mm 15mm/s);
  assert.match(pdfCss, /\.pdf-page\s*{[^}]*width:\s*210mm/s);
  assert.match(pdfCss, /\.pdf-page\s*{[^}]*padding:\s*13\.5mm 17mm 15mm/s);
  assert.match(pdfCss, /body\s*{[^}]*font-size:\s*9\.9pt/s);
  assert.match(pdfCss, /@media print[\s\S]*?body\s*{[^}]*font-size:\s*9\.25pt/s);
  assert.match(pdfCss, /@media print[\s\S]*?\.pdf-page\s*{[^}]*width:\s*auto;[^}]*min-height:\s*auto;[^}]*padding:\s*0/s);
  assert.match(pdfCss, /@media print[\s\S]*?\.pdf-page:first-child\s*{[^}]*break-after:\s*page/s);
  assert.match(pdfCss, /\.pdf-entry\s*{[^}]*break-inside:\s*avoid/s);
  assert.match(pdfCss, /\.pdf-project\s*{[^}]*break-inside:\s*auto/s);
  assert.doesNotMatch(pdfCss, /\.pdf-page-title\s*{[^}]*break-before:\s*page/s);
  assert.doesNotMatch(pdfCss, /page-break-before:\s*always/);
  assert.match(pdfCss, /print-color-adjust:\s*exact/);
  assert.match(pdfGenerator, /require\(process\.env\.RESUME_PLAYWRIGHT\)/);
  assert.match(pdfGenerator, /preferCSSPageSize:\s*true/);
  assert.match(pdfGenerator, /Google Chrome\.app/);
  assert.doesNotMatch(pdfCss, /\.pdf-sidebar/);
  assert.doesNotMatch(pdfCss, /\.pdf-layout/);
  assert.doesNotMatch(pdfCss, /\.pdf-project-grid/);
  assert.doesNotMatch(pdfHtml, /class="container sections-wrapper"/);
  assert.doesNotMatch(pdfCss, /\.resume-grid/);
});

test('includes mobile-first layout refinements', () => {
  assert.match(html, /class="site-controls"/);
  assert.match(css, /\.resume-grid\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*2fr\)\s*minmax\(300px,\s*1fr\)/s);
  assert.match(css, /@media \(max-width: 991px\)[\s\S]*?\.resume-grid\s*{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media \(max-width: 991px\)[\s\S]*?\.secondary\s*{[^}]*order:\s*-1/s);
  assert.match(css, /@media \(max-width: 767px\)/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*?\.secondary\s*{[^}]*order:\s*0/s);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*?\.profile\s*{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*?\.profile-image\s*{[^}]*width:\s*101px;[^}]*height:\s*101px/s);
  assert.match(css, /@media \(max-width: 420px\)[\s\S]*?\.profile-image\s*{[^}]*width:\s*91px;[^}]*height:\s*91px/s);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*?\.site-controls\s*{[^}]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*?\.segmented-control\s*{[^}]*grid-column:\s*span 2[\s\S]*?height:\s*44px/s);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*?\.theme-button,[\s\S]*?\.action-button\s*{[^}]*height:\s*44px;[^}]*min-height:\s*44px/s);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*?body\.qr-modal-open\s*{[^}]*overflow:\s*hidden/s);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*?\.social-qr-item:not\(\.qr-open\) \.qr-popup\s*{[^}]*display:\s*none/s);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*?\.social-qr-item\.qr-open \.qr-popup\s*{[^}]*position:\s*fixed[\s\S]*?width:\s*clamp\(280px,\s*88vw,\s*340px\)[\s\S]*?transform:\s*translate\(-50%,\s*-50%\)/s);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*?\.social-qr-item\.qr-open \.qr-popup img\s*{[^}]*width:\s*clamp\(224px,\s*calc\(88vw - 56px\),\s*292px\)/s);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*?body\.qr-modal-open \.qr-backdrop\s*{[^}]*pointer-events:\s*auto/s);
  assert.doesNotMatch(css, /@media \(max-width: 767px\)[\s\S]*?\.site-controls\s*{[^}]*position:\s*fixed;/s);
  assert.match(css, /overflow-wrap:\s*anywhere/);
});
