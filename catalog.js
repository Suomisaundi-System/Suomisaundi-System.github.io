import {systemRegistry} from "./registry.js";
const safeText=(tag,text)=>{const el=document.createElement(tag);el.textContent=text;return el;};
const storageKey="suomisaundi-catalog-preferences-v1";
function readPrefs(){try{return JSON.parse(localStorage.getItem(storageKey))||{};}catch{return {};}}
function savePrefs(value){try{localStorage.setItem(storageKey,JSON.stringify(value));}catch{}}
export function mountSystemCatalog(target=document.body){
 const wrapper=document.createElement("section");
 wrapper.id="system-inventory";wrapper.setAttribute("aria-label","System inventory and command search");
 const title=safeText("h2","System Inventory");
 const description=safeText("p","Search as you type. Browse every registered subsystem, grouped by domain.");
 const input=document.createElement("input");
 input.type="search";input.placeholder="Search systems, capabilities, domains…";input.setAttribute("aria-label","Search system inventory");
 input.style.cssText="width:100%;padding:12px;border-radius:9px;border:1px solid #55736c;background:#0f2024;color:white;font:inherit";
 const controls=document.createElement("div");controls.style.cssText="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:12px 0";
 const compact=document.createElement("button");compact.type="button";compact.textContent="Toggle compact menu";
 const expand=document.createElement("button");expand.type="button";expand.textContent="Expand all";
 const collapse=document.createElement("button");collapse.type="button";collapse.textContent="Collapse all";
 for(const b of [compact,expand,collapse])b.style.cssText="padding:8px;border:1px solid #55736c;border-radius:8px;background:#234146;color:white;cursor:pointer";
 controls.append(compact,expand,collapse);
 const status=safeText("p","");
 status.setAttribute("role","status");status.setAttribute("aria-live","polite");
 const inventory=document.createElement("div");
 const prefs=readPrefs();let isCompact=!!prefs.compact;
 function render(){
  const query=input.value.trim().toLocaleLowerCase();
  const found=systemRegistry.filter(x=>(x.name+" "+x.domain+" "+x.role).toLocaleLowerCase().includes(query));
  status.textContent=found.length+" of "+systemRegistry.length+" systems";
  inventory.replaceChildren();
  const groups=new Map();
  for(const item of found){if(!groups.has(item.domain))groups.set(item.domain,[]);groups.get(item.domain).push(item);}
  for(const [domain,items] of groups){
   const details=document.createElement("details");details.dataset.domain=domain;
   details.open=!!query||!isCompact;
   const summary=safeText("summary",domain+" ("+items.length+")");summary.style.cssText="cursor:pointer;font-weight:600;padding:9px 0";
   details.append(summary);
   const grid=document.createElement("div");
   grid.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:8px;padding:8px 0 15px";
   for(const item of items){
    const a=document.createElement("a");a.href=item.repository;a.target="_blank";a.rel="noopener noreferrer";
    a.textContent=item.name;a.title=item.domain+" — repository";
    a.style.cssText="display:block;padding:10px;border:1px solid #46615d;border-radius:9px;text-decoration:none;background:#20373b";
    grid.append(a);
   }
   details.append(grid);inventory.append(details);
  }
  if(!found.length)inventory.append(safeText("p","No matching systems."));
 }
 input.addEventListener("input",render);
 compact.addEventListener("click",()=>{isCompact=!isCompact;savePrefs({...readPrefs(),compact:isCompact});render();});
 expand.addEventListener("click",()=>inventory.querySelectorAll("details").forEach(x=>x.open=true));
 collapse.addEventListener("click",()=>inventory.querySelectorAll("details").forEach(x=>x.open=false));
 wrapper.append(title,description,input,controls,status,inventory);
 target.append(wrapper);render();
 return {search:query=>{input.value=String(query);render();input.focus();},element:wrapper};
}
