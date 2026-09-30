// Validates assets/*.svg against README refs and GitHub rendering rules. Exit 1 on any problem.
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const EXPECTED = {
  banner: [880, 460], services: [880, 448], 'project-churchapp': [880, 340],
  'project-chapel': [880, 340], 'project-aquapro': [880, 340], stack: [880, 330],
  contact: [880, 290], 'btn-whatsapp': [340, 56], 'btn-linkedin': [340, 56],
  logo: [512, 512], wordmark: [520, 120],
};
const errs = [];
const files = readdirSync(new URL('assets/', root)).filter(f => f.endsWith('.svg'));

for (const [name, [w, h]] of Object.entries(EXPECTED))
  for (const th of ['light', 'dark']) {
    const f = `${name}-${th}.svg`;
    if (!files.includes(f)) { errs.push(`missing ${f}`); continue; }
    const s = readFileSync(new URL(`assets/${f}`, root), 'utf8');
    if (!s.startsWith(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"`))
      errs.push(`${f}: expected ${w}x${h}`);
    if (/<style|<text|font-family|<metadata/.test(s)) errs.push(`${f}: forbidden tag`);
    const defs = new Set([...s.matchAll(/<path id="([a-z]\d+)"/g)].map(m => m[1]));
    for (const [, id] of s.matchAll(/href="#([a-z]\d+)"/g)) if (!defs.has(id)) { errs.push(`${f}: <use> #${id} has no def`); break; }
  }
for (const f of files) if (!Object.keys(EXPECTED).some(n => f === `${n}-light.svg` || f === `${n}-dark.svg`)) errs.push(`unexpected ${f}`);

const readme = readFileSync(new URL('README.md', root), 'utf8');
for (const ref of new Set(readme.match(/assets\/[a-z0-9-]+\.svg/g)))
  if (!files.includes(ref.slice(7))) errs.push(`README references missing ${ref}`);
const live = readme.replace(/<!--[\s\S]*?-->/g, '');
for (const ref of new Set(live.match(/assets\/shots\/[a-z0-9-]+\.(?:png|jpg)/g) || []))
  if (!existsSync(new URL(ref, root))) errs.push(`README references missing ${ref}`);

if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
console.log(`OK ${files.length} svg`);
