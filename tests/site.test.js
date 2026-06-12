const assert = require('node:assert/strict');
const { existsSync, readFileSync, statSync } = require('node:fs');
const { test } = require('node:test');

const html = readFileSync('index.html', 'utf8');
const css = readFileSync('assets/css/styles.css', 'utf8');
const js = readFileSync('assets/js/main.js', 'utf8');
const pdfHtml = readFileSync('resume-pdf.html', 'utf8');
const pdfCss = readFileSync('assets/css/resume-pdf.css', 'utf8');
const pdfPath = 'assets/files/xiajunhui-ios-resume.pdf';

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
  assert.match(html, /data-theme-toggle/);
  assert.match(html, /class="theme-icon-sun"/);
  assert.doesNotMatch(js, /fa-sun-o/);
  assert.match(css, /:root/);
  assert.match(css, /html\[data-theme="dark"\]/);
  assert.match(css, /\.theme-button\[aria-pressed="true"\] \.theme-icon-sun\s*{[^}]*display:\s*block/s);
  assert.match(js, /localStorage\.setItem\('resumeTheme'/);
});

test('provides mobile sharing and PDF export actions', () => {
  assert.match(html, /data-resume-action/);
  assert.match(html, /data-action-label/);
  assert.match(js, /navigator\.share/);
  assert.match(js, /navigator\.canShare/);
  assert.match(js, /navigator\.clipboard\.writeText/);
  assert.match(js, /assets\/files\/xiajunhui-ios-resume\.pdf/);
  assert.match(js, /downloadResumePdf/);
  assert.match(js, /updateResumeActionLabel/);
  assert.match(css, /@media print/);
  assert.match(css, /\.site-controls/);
  assert.match(css, /a\[href\]:after/);
  assert.match(css, /\.level-bar/);
  assert.match(css, /display:\s*none\s*!important/);
  assert.equal(existsSync(pdfPath), true);
  assert.ok(statSync(pdfPath).size > 50000);
});

test('does not show expected salary information', () => {
  assert.doesNotMatch(html + js + pdfHtml, /期望薪资|Expected salary|hero\.salary|25-30K|25-35K/);
});

test('uses official Font Awesome icons for WeChat and QQ actions', () => {
  assert.match(html, /class="fa fa-weixin"/);
  assert.match(html, /class="fa fa-qq"/);
  const socialQrButtons = html.match(/<button class="social-qr-btn"[\s\S]*?<\/button>/g) || [];
  assert.equal(socialQrButtons.length, 2);
  socialQrButtons.forEach((buttonHtml) => assert.doesNotMatch(buttonHtml, /<svg/));
  assert.match(css, /\.social a \.fa,[\s\S]*?\.social-qr-btn \.fa\s*{[\s\S]*?width:\s*20px;[\s\S]*?height:\s*20px;/);
});

test('keeps requested skill progress values', () => {
  const skillSection = html.match(/<section class="section skills">[\s\S]*?<\/section>/)[0];
  assert.match(skillSection, /<span>Objective-C<\/span>[\s\S]*?style="width: 95%"/);
  assert.match(skillSection, /<span>Swift<\/span>[\s\S]*?style="width: 95%"/);
  assert.match(skillSection, /<span>SwiftUI<\/span>[\s\S]*?style="width: 80%"/);
  assert.doesNotMatch(skillSection, /Swift \/ SwiftUI/);
});

test('uses a dedicated PDF resume template instead of the web layout', () => {
  assert.match(pdfHtml, /class="pdf-resume-document"/);
  assert.match(pdfHtml, /class="pdf-page"/);
  assert.match(pdfHtml, /class="pdf-skill-band"/);
  assert.match(pdfHtml, /class="pdf-project-detail"/);
  assert.match(pdfCss, /@page\s*{[^}]*size:\s*A4;[^}]*margin:\s*13mm 15mm/s);
  assert.match(pdfCss, /\.pdf-page\s*{[^}]*width:\s*210mm/s);
  assert.match(pdfCss, /\.pdf-page\s*{[^}]*padding:\s*13mm 15mm/s);
  assert.match(pdfCss, /body\s*{[^}]*font-size:\s*9\.8pt/s);
  assert.match(pdfCss, /\.pdf-entry,[\s\S]*?\.pdf-project\s*{[^}]*break-inside:\s*avoid/s);
  assert.match(pdfCss, /print-color-adjust:\s*exact/);
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
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*?\.site-controls\s*{[^}]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*?\.segmented-control\s*{[^}]*grid-column:\s*span 2/s);
  assert.doesNotMatch(css, /@media \(max-width: 767px\)[\s\S]*?\.site-controls\s*{[^}]*position:\s*fixed;/s);
  assert.match(css, /overflow-wrap:\s*anywhere/);
});
