export const KEY='entre.local.v2';
export function fresh(){return{version:2,settings:{names:['Persona 1','Persona 2'],active:0,goal:3,adult:false,theme:'dark',reduceMotion:false},seen:[],favorites:[],checkins:[],notes:[],agreements:[],gratitudes:[],completed:[],dateSeen:[]}}
const plain=x=>x&&typeof x==='object'&&!Array.isArray(x);const str=(x,max=30000)=>typeof x==='string'&&x.length<=max;const arr=(x,max=10000)=>Array.isArray(x)&&x.length<=max;const stamp=x=>str(x,60)&&Number.isFinite(Date.parse(x));
export function validate(x){if(!plain(x)||x.version!==2||!plain(x.settings))throw Error('Formato de copia no compatible.');const s=x.settings;if(!arr(s.names,2)||s.names.length!==2||!s.names.every(n=>str(n,35)&&n.trim())||![0,1].includes(s.active)||![1,2,3,4,5,6,7].includes(s.goal)||typeof s.adult!=='boolean'||!['dark','light'].includes(s.theme)||typeof s.reduceMotion!=='boolean')throw Error('Los ajustes de la copia no son válidos.');
for(const k of ['seen','favorites'])if(!arr(x[k])||!x[k].every(v=>str(v,100)))throw Error('La biblioteca de la copia no es válida.');
for(const k of ['checkins','notes','agreements','gratitudes','completed','dateSeen'])if(!arr(x[k],3000))throw Error('El historial de la copia no es válido.');
for(const r of [...x.checkins,...x.notes,...x.agreements,...x.gratitudes,...x.completed])if(!plain(r)||!str(r.id,100)||!stamp(r.created))throw Error('Hay un registro no válido en la copia.');
for(const r of x.notes)if(!str(r.title,200)||!str(r.text)||![0,1].includes(r.person)||!str(r.module,100))throw Error('Reflexión no válida.');
for(const r of x.checkins)if(![0,1].includes(r.person)||!str(r.mood,100)||!str(r.need,100)||!str(r.text))throw Error('Check-in no válido.');
for(const r of x.gratitudes)if(![0,1].includes(r.person)||!str(r.text))throw Error('Aprecio no válido.');
for(const r of x.agreements)if(!str(r.action,500)||!str(r.owner,100)||!str(r.date,20)||!['proposed','agreed','reviewed'].includes(r.status)||!str(r.review)||typeof r.accepted!=='boolean')throw Error('Acuerdo no válido.');
for(const r of x.completed)if(!str(r.module,100)||!str(r.helpful,40))throw Error('Actividad no válida.');
for(const k of ['notes','checkins','agreements','gratitudes','completed'])if(new Set(x[k].map(r=>r.id)).size!==x[k].length)throw Error('Hay identificadores duplicados en la copia.');
if(!x.dateSeen.every(n=>Number.isInteger(n)&&n>=0&&n<1000))throw Error('Planes no válidos.');return structuredClone(x)}
export function load(storage){try{const raw=storage.getItem(KEY);if(!raw)return{data:fresh(),persistent:false,error:null};return{data:validate(JSON.parse(raw)),persistent:true,error:null}}catch{return{data:fresh(),persistent:false,error:'No hemos podido leer los datos guardados. No los hemos sobrescrito. Puedes descargar la copia existente desde Ajustes.'}}}
export function persist(storage,data){storage.setItem(KEY,JSON.stringify(validate(data)))}
export const id=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
export const now=()=>new Date().toISOString();
export function availableQuestions(questions,seen,{topic='all',level='all',adult=false,favorites=null}={}){const used=new Set(seen);return questions.filter(q=>(topic==='all'||q.topic===topic)&&(level==='all'||q.level===Number(level))&&(!q.adult||adult)&&(!favorites||favorites.includes(q.id))&&!used.has(q.id))}
