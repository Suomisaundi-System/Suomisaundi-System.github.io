// Suomisaundi System: JavaScript owns the page and its structure.
document.title = "Suomisaundi System";
const style = document.createElement("style");
style.textContent = `:root{font-family:system-ui,-apple-system,sans-serif;color-scheme:dark;background:#101b1f;color:#eff9f4}*{box-sizing:border-box}body{margin:0}header{padding:30px max(20px,5vw);border-bottom:1px solid #34494c;background:#16262a}h1{margin:0;font-size:clamp(26px,5vw,46px)}header p{margin:8px 0;color:#b2cec5}main{max-width:1120px;margin:0 auto;padding:28px 20px}nav{display:grid;grid-template-columns:repeat(auto-fit,minmax(205px,1fr));gap:14px}button.tile{background:#1e3135;border:1px solid #3a5757;border-radius:14px;padding:22px;color:inherit;text-align:left;font:inherit;cursor:pointer}button.tile:hover,button.tile:focus-visible{background:#284247;border-color:#8de2c4}.tile strong{display:block;font-size:19px;margin:8px 0}.tile span{font-size:14px;color:#b4ccc6}section{margin-top:28px;border:1px solid #3a5757;background:#18292e;padding:25px;border-radius:15px;min-height:160px}a{color:#90e4cb}li{margin:9px 0}footer{color:#a9c4bb;text-align:center;padding:24px}`;
document.head.append(style);
const header = document.createElement("header");
const heading = document.createElement("h1");
heading.textContent = "Suomisaundi System";
const tagline = document.createElement("p");
tagline.textContent = "Community · Culture · Music · Knowledge";
header.append(heading,tagline);
const root = document.createElement("main");
const navigation = document.createElement("nav");
navigation.id="menu";
navigation.setAttribute("aria-label","System modules");
const contentPanel = document.createElement("section");
contentPanel.id="panel";
contentPanel.setAttribute("aria-live","polite");
root.append(navigation,contentPanel);
const footer = document.createElement("footer");
footer.textContent="Suomisaundi United · Independent community platform";
document.body.append(header,root,footer);
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

// suomisaundi-interrepository-messaging-v1
// BroadcastChannel connects open pages under the same GitHub Pages origin.
// This is ephemeral, browser-local messaging, NOT server-side synchronization.
export const systemNode = location.pathname.split("/").filter(Boolean)[0] || "Main";
export const systemBus = typeof BroadcastChannel !== "undefined"
  ? new BroadcastChannel("suomisaundi-system-v1") : null;
const systemSubscribers = new Set();
export function onSystemMessage(callback) {
  if (typeof callback !== "function") throw new TypeError("Callback required");
  systemSubscribers.add(callback);
  return () => systemSubscribers.delete(callback);
}
export function sendSystemMessage(type, payload = null, target = "*") {
  if (!systemBus) return false;
  if (typeof type !== "string" || !type || type.length > 80) throw new TypeError("Invalid message type");
  systemBus.postMessage({
    protocol: "suomisaundi-system-v1", source: systemNode,
    target, type, payload, timestamp: Date.now()
  });
  return true;
}
if (systemBus) systemBus.addEventListener("message", event => {
  const message = event.data;
  if (!message || message.protocol !== "suomisaundi-system-v1") return;
  if (message.target !== "*" && message.target !== systemNode) return;
  for (const callback of systemSubscribers) {
    try { callback(message); } catch (error) { console.error("System subscriber error", error); }
  }
});

// Registry checkpoint: static metadata describing independently hosted systems.
import { systemRegistry, findSystem } from "./registry.js";
export { systemRegistry, findSystem };

// Shared runtime modules are independently importable by other same-origin systems.
export * from "./runtime.js";

// Scalable system inventory and live command search.
import {mountSystemCatalog} from "./catalog.js";
export const catalogUI=mountSystemCatalog(document.querySelector("main")||document.body);
