"use strict";
const modules=[
{id:"community",icon:"👥",title:"Community",description:"Members, artists, groups and discussions",items:["Members","Artists","Groups","Discussions"]},
{id:"music",icon:"🎵",title:"Music",description:"Suomisaundi as a genre and musical culture",items:["Suomisaundi","Genres & subgenres","Artists & discographies","Releases & recordings","Musical terminology"]},
{id:"knowledge",icon:"📖",title:"Knowledge",description:"History, culture and community documentation",items:["History","Culture","Documentation","Glossary"]},
{id:"events",icon:"📅",title:"Events",description:"Festivals, performances and gatherings",items:["Festivals","Performances","Community gatherings"]},
{id:"archives",icon:"🗄️",title:"Archives",description:"Preserving community history and media",items:["Music","Media","Historical records"]},
{id:"network",icon:"🌐",title:"Network",description:"Telegram, community connections and resources",items:["Telegram supergroup","SYSTEM topic","Telegram bot","External resources"]},
{id:"system",icon:"⚙️",title:"System",description:"Configuration, settings and status",items:["Configuration","Settings","Preferences","System status"]},
{id:"administration",icon:"🛡️",title:"Administration",description:"Governance and moderation (authorization required for future functions)",items:["Moderation","Permissions","System management"]}
];
const links={"Telegram supergroup":"https://t.me/SuomisaundiUnited","SYSTEM topic":"https://t.me/SuomisaundiUnited/12956","Telegram bot":"https://t.me/SuomisaundiSysBot"};
const menu=document.getElementById("menu"),panel=document.getElementById("panel");
for(const m of modules){const b=document.createElement("button");b.className="tile";b.type="button";const h=document.createElement("strong");h.textContent=m.icon+" "+m.title;const s=document.createElement("span");s.textContent=m.description;b.append(h,s);b.addEventListener("click",()=>{location.hash=m.id});menu.append(b)}
function render(){const m=modules.find(x=>x.id===location.hash.slice(1));panel.replaceChildren();const h=document.createElement("h2");h.textContent=m?m.icon+" "+m.title:"Welcome to Suomisaundi System";const p=document.createElement("p");p.textContent=m?m.description:"Choose a community module to explore the system. Additional functions will be introduced as the platform develops.";panel.append(h,p);if(!m)return;const ul=document.createElement("ul");for(const item of m.items){const li=document.createElement("li");if(links[item]){const a=document.createElement("a");a.href=links[item];a.target="_blank";a.rel="noopener noreferrer";a.textContent=item;li.append(a)}else{li.textContent=item+" — planned"}ul.append(li)}panel.append(ul)}
window.addEventListener("hashchange",render);render();
if(window.Telegram?.WebApp){window.Telegram.WebApp.ready();window.Telegram.WebApp.expand()}

// suomisaundi-browser-capabilities-v1
// Capability discovery is non-invasive: GPU and audio activation are deferred
// until a feature explicitly requests them, respecting permissions and gestures.
export const browserCapabilities = Object.freeze({
  webAssembly: typeof WebAssembly !== "undefined",
  webGPU: typeof navigator !== "undefined" && "gpu" in navigator,
  vectorGraphics: typeof document !== "undefined" &&
    typeof document.createElementNS === "function",
  webAudio: typeof window !== "undefined" &&
    Boolean(window.AudioContext || window.webkitAudioContext)
});

export async function createWebAssemblyModule(bytes, imports = {}) {
  if (!browserCapabilities.webAssembly) throw new Error("WebAssembly unavailable");
  return WebAssembly.instantiate(bytes, imports);
}

export async function requestWebGPUDevice() {
  if (!browserCapabilities.webGPU) throw new Error("WebGPU unavailable");
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw new Error("No WebGPU adapter available");
  const device = await adapter.requestDevice();
  return { adapter, device };
}

export function createSVG(width = 320, height = 180) {
  if (!browserCapabilities.vectorGraphics) throw new Error("SVG unavailable");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("role", "img");
  return svg;
}

export function createAudioContext() {
  if (!browserCapabilities.webAudio) throw new Error("Web Audio unavailable");
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  return new AudioContextClass();
}
