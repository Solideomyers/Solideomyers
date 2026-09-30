// Node port of the handoff generator. Usage: npm run gen [regex]  (e.g. npm run gen stack)
import { readFileSync, writeFileSync } from 'node:fs';
import ot from 'opentype.js';
const fontFile = p => { const b = readFileSync(new URL(`../node_modules/@fontsource/${p}`, import.meta.url)); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); };
// Generates fmyers.dev README sheets (880px, outlined text). Run via run_script: eval + gen(filterRegex)
async function gen(only){

const load=async p=>ot.parse(fontFile(p));
const F={d:await load('archivo/files/archivo-latin-700-normal.woff'),
b:await load('archivo/files/archivo-latin-400-normal.woff'),
m:await load('jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff')};
const T={light:{bg:'#F2F3EF',ink:'#15181C',mute:'#5B626A',rule:'#C4C9C1',grid:'#E4E7E1',acc:'#2B55C8',accInk:'#FFFFFF',sig:'#1F8A4C',panel:'#F8F9F6'},
dark:{bg:'#0E1114',ink:'#E9EBE6',mute:'#98A0A8',rule:'#353C44',grid:'#171C21',acc:'#86A4F2',accInk:'#0E1114',sig:'#4CC47F',panel:'#12161A'}};
const ARW=.62;
function W(s,o){const f=F[o.f||'b'],size=o.size||14,ls=o.ls||0;let w=0;for(const ch of s)w+=(ch==='→'?size*ARW:f.getAdvanceWidth(ch,size))+ls;return w-ls;}
function t(x,y,s,o={}){s=String(s).replace(/−/g,'-');const f=F[o.f||'b'],size=o.size||14,ls=o.ls||0;
 let cx=o.anchor==='middle'?x-W(s,o)/2:o.anchor==='end'?x-W(s,o):x;let d='',extra='';
 for(const ch of s){if(ch==='→'){const a=size*ARW,h=size*.22,my=y-size*.32,x0=cx+size*.05,x1=cx+a-size*.08;
   extra+=`<path d="M${x0.toFixed(1)} ${my.toFixed(1)}H${x1.toFixed(1)}M${(x1-h).toFixed(1)} ${(my-h).toFixed(1)}L${x1.toFixed(1)} ${my.toFixed(1)}L${(x1-h).toFixed(1)} ${(my+h).toFixed(1)}" fill="none" stroke="${o.fill}" stroke-width="${(size*.09).toFixed(2)}"/>`;cx+=a+ls;continue;}
  d+=f.getPath(ch,cx,y,size).toPathData(1);cx+=f.getAdvanceWidth(ch,size)+ls;}
 o.end=cx-ls;return `<path d="${d}" fill="${o.fill}"/>`+extra;}
const M=(x,y,s,c,o={})=>t(x,y,s,{f:'m',size:11,fill:c.mute,ls:1,...o});
function frame(w,h,c,label){
 let s=`<rect width="${w}" height="${h}" fill="${c.bg}"/><defs><pattern id="g" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="${c.grid}"/></pattern></defs>`;
 s+=`<rect x="22" y="22" width="${w-44}" height="${h-44}" fill="url(#g)"/><rect x="6.5" y="6.5" width="${w-13}" height="${h-13}" fill="none" stroke="${c.rule}"/><rect x="22.5" y="22.5" width="${w-45}" height="${h-45}" fill="none" stroke="${c.ink}"/>`;
 const n=Math.round((w-44)/168),seg=(w-44)/n;
 for(let i=0;i<n;i++){const x=22+seg*i;if(i>0)s+=`<path d="M${x.toFixed(1)} 7V22M${x.toFixed(1)} ${h-22}V${h-7}" stroke="${c.rule}"/>`;const L='ABCDEFGHIJ'[i];s+=t(x+seg/2,18,L,{f:'m',size:9,fill:c.mute,anchor:'middle'})+t(x+seg/2,h-10,L,{f:'m',size:9,fill:c.mute,anchor:'middle'});}
 const m=Math.max(1,Math.round((h-44)/120)),sg=(h-44)/m;
 for(let i=0;i<m;i++){const y=22+sg*i;if(i>0)s+=`<path d="M7 ${y.toFixed(1)}H22M${w-22} ${y.toFixed(1)}H${w-7}" stroke="${c.rule}"/>`;s+=t(14.5,y+sg/2+3,i+1,{f:'m',size:9,fill:c.mute,anchor:'middle'})+t(w-14.5,y+sg/2+3,i+1,{f:'m',size:9,fill:c.mute,anchor:'middle'});}
 s+=M(40,50,'FMYERS.DEV / '+label,c)+M(w-40,50,'REV 2026.09',c,{anchor:'end'})+`<path d="M40 62.5H${w-40}" stroke="${c.rule}"/>`;
 return s;}
function dotted(x,y,a,b,size,c,q){const o={f:'d',size,fill:c.ink,ls:-size*.03};let s=t(x,y,a,o);const ex=o.end;
 s+=`<rect x="${(ex+size*.04).toFixed(1)}" y="${(y-q).toFixed(1)}" width="${q}" height="${q}" fill="${c.acc}"/>`;if(b)s+=t(ex+size*.1+q,y,b,o);return s;}
function mark(x,y,sz,c){const k=sz/120;return `<g transform="translate(${x} ${y}) scale(${k})"><rect x="0.5" y="0.5" width="119" height="119" fill="${c.bg}" stroke="${c.ink}"/><path d="M-10 0H-4M0 -10V-4M130 0H124M120 -10V-4M-10 120H-4M0 130V124M130 120H124M120 130V124" stroke="${c.mute}"/>`+dotted(20,82,'fm','',60,c,11)+'</g>';}
function cells(x,y,w,rh,cols,rows,c){
 const cw=w/cols;let s=`<rect x="${x}.5" y="${y}.5" width="${w}" height="${rh*Math.ceil(rows.length/cols)}" fill="${c.panel}" stroke="${c.ink}"/>`;
 rows.forEach((r,i)=>{const cx=x+(i%cols)*cw,cy=y+Math.floor(i/cols)*rh;
  if(i%cols)s+=`<path d="M${cx}.5 ${cy}V${cy+rh}" stroke="${c.rule}"/>`;if(i>=cols&&i%cols===0)s+=`<path d="M${x} ${cy}.5H${x+w}" stroke="${c.rule}"/>`;
  s+=M(cx+16,cy+18,r[0],c,{size:10});
  if(r[2])s+=`<rect x="${cx+16}" y="${cy+rh-21}" width="8" height="8" fill="${c.sig}"/>`;
  s+=t(cx+(r[2]?32:16),cy+rh-13,r[1],{f:r[3]?'d':'b',size:15,fill:c.ink});});
 return s;}
const files={};const svg=(name,w,h,body)=>{if(only&&!only.test(name))return;for(const th of ['light','dark'])files[`assets/${name}-${th}.svg`]={w,h,body:body(T[th])};};
const Wd=880;
svg('banner',Wd,460,c=>{let s=frame(Wd,460,c,'SHEET 00 — PROFILE');
 s+=t(40,128,'I build SaaS products',{f:'d',size:50,fill:c.ink,ls:-1.4})+dotted(40,184,'end-to-end','',50,c,10);
 s+=t(40,220,'Construyo productos SaaS de punta a punta — de la idea a producción.',{f:'m',size:13,fill:c.mute});
 s+=mark(730,82,110,c);
 const xs=[40,240,440,640],labs=[['IDEA','idea'],['SPEC','diseño'],['BUILD','desarrollo'],['SHIP','producción']];
 s+=`<path d="M40 282H840M840 274V290" stroke="${c.ink}"/>`;
 xs.forEach((x,i)=>{s+=`<path d="M${x} 274V290" stroke="${c.ink}"/><rect x="${x-4}" y="278" width="8" height="8" fill="${i===3?c.acc:c.bg}" stroke="${i===3?c.acc:c.ink}"/>`;
  s+=t(x,264,labs[i][0],{f:'m',size:12,fill:i===3?c.acc:c.ink,anchor:i?'middle':'start',ls:1})+t(x,308,labs[i][1],{f:'m',size:11,fill:c.mute,anchor:i?'middle':'start'});});
 s+=t(840,264,'→',{f:'m',size:12,fill:c.ink,anchor:'end'});
 s+=cells(40,326,800,48,2,[['NAME','Francisco Myers',0,1],['ROLE','Fullstack developer · SaaS builder'],['BASE','Venezuela · UTC-4 · Remote · EN/ES'],['STATUS','Available for new projects',1]],c);
 return s;});
const SV=[['S-01','SaaS MVP','De la idea a usuarios que pagan','FOUNDERS · STARTUPS',['Auth, roles & billing','Dashboard, API & database','Deploy, monitoring & handoff']],
['S-02','Business automation','Automatización de procesos','SMBS · NONPROFITS',['Google Workspace & Apps Script','Spreadsheets → real internal apps','API integrations & reports']],
['S-03','Fullstack on contract','Desarrollo fullstack por contrato','COMPANIES · AGENCIES',['Next.js · NestJS · PostgreSQL','Team extension & white-label','Refactors & code reviews']]];
svg('services',Wd,448,c=>{let s=frame(Wd,448,c,'SHEET 01 — SERVICES / SERVICIOS');
 SV.forEach((v,i)=>{const x=40,y=80+i*114,w=800,h=102;s+=`<rect x="${x}.5" y="${y}.5" width="${w}" height="${h}" fill="${c.panel}" stroke="${c.ink}"/><path d="M${x+420}.5 ${y+14}V${y+h-14}" stroke="${c.rule}"/>`;
  s+=M(x+20,y+26,v[0],c,{fill:c.acc})+M(x+w-20,y+26,'FOR '+v[3],c,{size:10,anchor:'end'});
  s+=t(x+20,y+62,v[1],{f:'d',size:25,fill:c.ink,ls:-.5})+t(x+20,y+86,v[2],{f:'m',size:12,fill:c.mute});
  v[4].forEach((it,j)=>{const yy=y+48+j*21;s+=`<rect x="${x+440}" y="${yy-8}" width="6" height="6" fill="${c.acc}"/>`+t(x+456,yy,it,{f:'b',size:14,fill:c.ink});});});
 return s;});
const PJ=[['FM-01','ChurchApp','for Gracia Eterna','Membership management for a local church.','Gestión de membresía para una iglesia local.',[['SECTOR','Faith · Nonprofit'],['STACK','Next.js'],['MODULES','Requests · Roster · Liturgy · Teaching'],['SCOPE','Member lifecycle, request to roster']]],
['FM-02','Chapel','for a nonprofit publisher','Warehouse & book-distribution system.','Gestión de almacenes y distribución de libros.',[['SECTOR','Nonprofit · Logistics'],['STACK','Apps Script · Vite · Google Sheets'],['MODULES','Warehouses · Inventory · Distribution'],['WHY','Runs on Workspace — no server costs']]],
['FM-03','AquaPro','water-management platform','Dashboard with real-time analytics.','Panel de gestión hídrica en tiempo real.',[['SECTOR','Utilities · Infrastructure'],['STACK','Next.js · TypeScript · PostgreSQL'],['MODULES','Flow · Reservoirs · Alerts · Forecast'],['FOCUS','Operational data at a glance']]]];
PJ.forEach((p,k)=>svg('project-'+p[1].toLowerCase(),Wd,340,c=>{let s=frame(Wd,340,c,`SHEET 0${k+2} — PROJECT ${p[0]}`);
 s+=M(40,96,p[0],c,{size:12,fill:c.acc})+M(840,96,p[2].toUpperCase(),c,{anchor:'end'});
 s+=t(40,146,p[1],{f:'d',size:44,fill:c.ink,ls:-1})+t(40,180,p[3],{f:'b',size:18,fill:c.ink})+t(40,204,p[4],{f:'m',size:12,fill:c.mute});
 return s+cells(40,222,800,48,2,p[5],c);}));
const ST=[['FRONTEND',[['React'],['Next.js',1],['TypeScript',1],['Tailwind CSS'],['Vite'],['Redux']]],['BACKEND',[['Node.js'],['NestJS',1],['Express'],['GraphQL'],['REST APIs']]],
['DATA & INFRA',[['PostgreSQL',1],['Prisma'],['MongoDB'],['Docker'],['Vercel'],['GCP'],['Appwrite']]],['AUTOMATION',[['Google Apps Script',1],['Google Workspace'],['Sheets API'],['Integrations']]]];
svg('stack',Wd,330,c=>{let s=frame(Wd,330,c,'SHEET 05 — STACK');
 ST.forEach((r,i)=>{const y=82+i*50;s+=M(40,y+20,r[0],c);let x=180;
  r[1].forEach(([n,core])=>{const w=Math.round(W(n,{f:'m',size:13})+22);s+=`<rect x="${x}.5" y="${y}.5" width="${w}" height="30" fill="${core?c.panel:'none'}" stroke="${core?c.acc:c.rule}" stroke-width="${core?1.5:1}"/>`+t(x+11,y+20,n,{f:'m',size:13,fill:core?c.acc:c.ink});x+=w+6;});
  if(i<3)s+=`<path d="M40 ${y+40}.5H840" stroke="${c.grid}"/>`;});
 const lx=840-W('CORE — DAILY DRIVERS',{f:'m',size:10,ls:1});
 return s+`<rect x="${(lx-17).toFixed(1)}" y="283" width="9" height="9" fill="none" stroke="${c.acc}" stroke-width="1.5"/>`+M(840,292,'CORE — DAILY DRIVERS',c,{size:10,anchor:'end'});});
svg('contact',Wd,290,c=>{let s=frame(Wd,290,c,'SHEET 06 — CONTACT / CONTACTO');
 s+=t(40,124,'Have a product to build?',{f:'d',size:42,fill:c.ink,ls:-1})+t(40,154,'¿Tienes un producto que construir? Escríbeme — respondo en EN y ES.',{f:'m',size:13,fill:c.mute});
 return s+cells(40,180,800,52,2,[['STATUS','Available for new projects',1],['BASE','Venezuela · UTC-4 · Remote']],c);});
const btn=(name,label,primary)=>{if(only&&!only.test('btn'))return;for(const th of ['light','dark']){const c=T[th],fg=primary?c.accInk:c.ink;
 files[`assets/btn-${name}-${th}.svg`]={w:340,h:56,body:`<rect x="0.5" y="0.5" width="339" height="55" fill="${primary?c.acc:c.bg}" stroke="${primary?c.acc:c.ink}"/>`+t(20,34,label,{f:'d',size:17,fill:fg})+t(318,34,'→',{f:'m',size:17,fill:fg,anchor:'end'})};}};
btn('whatsapp','Message on WhatsApp',1);btn('linkedin','Connect on LinkedIn',0);
if(!only||only.test('logo'))for(const th of ['light','dark']){const c=T[th];
 files[`assets/logo-${th}.svg`]={w:512,h:512,body:`<rect width="512" height="512" fill="${c.bg}"/>`+mark(76,76,360,c)};
 files[`assets/wordmark-${th}.svg`]={w:520,h:120,body:`<rect width="520" height="120" fill="${c.bg}"/>`+dotted(24,84,'fmyers','dev',66,c,14)};}
const out={};for(const [p,v] of Object.entries(files))out[p]=`<svg xmlns="http://www.w3.org/2000/svg" width="${v.w}" height="${v.h}" viewBox="0 0 ${v.w} ${v.h}">${v.body}</svg>`;
return out;}

const out = await gen(process.argv[2] ? new RegExp(process.argv[2]) : undefined);
for (const [p, svg] of Object.entries(out)) writeFileSync(new URL(`../${p}`, import.meta.url), svg);
console.log(`wrote ${Object.keys(out).length} files`);
