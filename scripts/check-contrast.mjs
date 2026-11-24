import fs from 'node:fs';

const css = fs.readFileSync('src/styles/tokens.css', 'utf8');

function block(source, header) {
  const start = source.indexOf(header);
  if (start < 0) throw new Error(`Missing CSS block: ${header}`);
  const end = source.indexOf('\n}', start);
  return source.slice(start, end + 2);
}

function vars(source) {
  const result = {};
  for (const match of source.matchAll(/--([\w-]+):([^;]+);/g)) {
    result[match[1]] = match[2].trim();
  }
  return result;
}

function resolve(name, theme) {
  let value = theme[name];
  const seen = new Set();
  while (value?.startsWith('var(') && !seen.has(value)) {
    seen.add(value);
    const ref = value.match(/var\(--([\w-]+)/)?.[1];
    if (!ref) break;
    value = theme[ref];
  }
  return value;
}

function rgb(value) {
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (!hex) throw new Error(`Cannot resolve contrast color: ${value}`);
  return [1, 3, 5].map((i) => parseInt(hex[1].slice(i - 1, i + 1), 16));
}

function luminance(value) {
  const channels = rgb(value).map((v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const rootEnd = css.indexOf('\n}', css.indexOf(':root'));
const lightVars = vars(css.slice(0, rootEnd + 2));
const darkBlock = block(css, ':root[data-theme="dark"]');
const darkVars = { ...lightVars, ...vars(darkBlock) };

const themes = [
  ['light', lightVars],
  ['dark', darkVars],
];

const failures = [];
for (const [themeName, theme] of themes) {
  const pairs = [
    ['text', 'bg', 4.5],
    ['text', 'bg-subtle', 4.5],
    ['text', 'surface', 4.5],
    ['text-muted', 'bg', 4.5],
    ['text-muted', 'bg-subtle', 4.5],
    ['accent-text', 'bg', 4.5],
    ['accent-text', 'bg-subtle', 4.5],
    ['accent-text', 'accent-subtle', 4.5],
    ['on-accent', 'accent', 4.5],
    ['focus-ring', 'bg', 3],
  ];

  for (const [fgName, bgName, minimum] of pairs) {
    const fg = resolve(fgName, theme);
    const bg = resolve(bgName, theme);
    if (!/^#[0-9a-f]{6}$/i.test(fg) || !/^#[0-9a-f]{6}$/i.test(bg)) continue;
    const ratio = contrast(fg, bg);
    if (ratio < minimum) failures.push(`${themeName}: ${fgName}/${bgName} ${ratio.toFixed(2)}:1`);
  }

  for (const name of ['spine-1', 'spine-2', 'spine-3', 'spine-4', 'spine-5']) {
    const chain = resolve(name, theme);
    if (!/^#[0-9a-f]{6}$/i.test(chain)) continue;
    const ratio = contrast(resolve('spine-fg', theme), chain);
    if (ratio < 4.5) failures.push(`${themeName}: spine-fg/${name} ${ratio.toFixed(2)}:1`);
  }

  for (const name of ['success', 'warning', 'danger']) {
    const fg = resolve(name, theme);
    const bg = resolve('bg', theme);
    if (!/^#[0-9a-f]{6}$/i.test(fg) || !/^#[0-9a-f]{6}$/i.test(bg)) continue;
    const ratio = contrast(fg, bg);
    if (ratio < 4.5) failures.push(`${themeName}: ${name}/bg ${ratio.toFixed(2)}:1`);
  }
}

const inversePairs = [
  ['sidebar-fg', 'sidebar-bg'],
  ['sidebar-fg-muted', 'sidebar-bg'],
];
for (const [fgName, bgName] of inversePairs) {
  const base = vars(css);
  const ratio = contrast(resolve(fgName, base), resolve(bgName, base));
  if (ratio < 4.5) failures.push(`inverse: ${fgName}/${bgName} ${ratio.toFixed(2)}:1`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Contrast check passed.');
