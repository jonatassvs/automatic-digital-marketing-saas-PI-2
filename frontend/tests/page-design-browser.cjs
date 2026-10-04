require('./components.cjs');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const sass = require('sass');
const { PageRenderer } = require('../renderer/ComponentRenderer.tsx');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'page-design-check-'));
const css = sass.compile(path.join(__dirname, '../components/base/responsive.scss')).css + sass.compile(path.join(__dirname, '../components/editor/editor.scss')).css;
const components = [{ id: 'grid', component: 'Grid', props: { columns: 2 }, children: [{ id: 'text', component: 'Text', props: { text: 'Example', mobilePaddingTop: 10, desktopPaddingTop: 30, fontSizeMobile: 16, fontSizeDesktop: 32, useDesktopFontSize: true } }] }];
const markup = renderToStaticMarkup(React.createElement(PageRenderer, { design: { mobileMaxWidth: 900 }, components }));
const inner = '<style>' + css + '</style>' + markup;
const html = `<!doctype html><meta charset="utf-8"><body><pre id="result">WAITING</pre><script>
const results = [];
for (const width of [600, 900, 901, 1200]) {
  const frame = document.createElement('iframe');
  frame.style.width = width + 'px';
  frame.onload = () => {
    const doc = frame.contentDocument;
    const text = frame.contentWindow.getComputedStyle(doc.getElementById('text'));
    const grid = frame.contentWindow.getComputedStyle(doc.getElementById('grid'));
    const mobile = width <= 900;
    results.push({ width, padding: text.paddingTop, fontSize: text.fontSize, columns: grid.gridTemplateColumns, pass: text.paddingTop === (mobile ? '10px' : '30px') && text.fontSize === (mobile ? '16px' : '32px') && grid.gridTemplateColumns.split(' ').length === (mobile ? 1 : 2) });
    if (results.length === 4) document.getElementById('result').textContent = JSON.stringify(results);
  };
  frame.srcdoc = ${JSON.stringify(inner)};
  document.body.append(frame);
}
</script>`;
const file = path.join(dir, 'check.html'); fs.writeFileSync(file, html);
const output = execFileSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--user-data-dir=' + path.join(dir, 'profile'), '--dump-dom', '--virtual-time-budget=3000', 'file:///' + file.replaceAll('\\', '/')], { encoding: 'utf8', timeout: 25000, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
const match = output.match(/<pre id="result">(.*?)<\/pre>/s);
if (!match || match[1] === 'WAITING') throw new Error('Browser check did not complete');
const results = JSON.parse(match[1].replaceAll('&quot;', '"'));
console.log(JSON.stringify(results));
if (results.some(result => !result.pass)) process.exitCode = 1;
