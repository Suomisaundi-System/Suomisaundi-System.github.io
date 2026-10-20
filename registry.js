// Canonical public catalog of Suomisaundi System repositories.
// This catalog describes intended roles; it does not imply deployed backends.
const groups = {
  "Core": ["System","Platform","Runtime","Framework","Configuration"],
  "Governance": ["Management","Administration","Organization","Governance"],
  "People": ["Community","Association","Membership","Identity"],
  "Music": ["Music","Genre","Artists","Releases","Discography"],
  "Sound": ["Audio","Sound","Recording","Instruments","Effects","Samples"],
  "Culture": ["History","Heritage","Knowledge","Documentation","Archives"],
  "Activities": ["Events","Festivals","Performances","Venues"],
  "Communications": ["Messaging","Forum","Blog","Notifications"],
  "Infrastructure": ["Network","Storage","Security","Protocols","Integration"],
  "Public services": ["Directory","Search","Media","Publishing"],
  "Devices and interfaces": ["Mobile","Tablet","Desktop","Window","Portrait","Landscape","Browser","Viewport"],
  "Protocols and execution": ["MIME","API","URI","NodeJS","Virtualization","Sandbox","Instance"]
};
export const systemRegistry = Object.freeze(
  Object.entries(groups).flatMap(([domain, names]) =>
    names.map(name => Object.freeze({
      id: name.toLowerCase(),
      name,
      domain,
      repository: `https://github.com/Suomisaundi-System/${name}`,
      page: `https://suomisaundi-system.github.io/${name}/`,
      entry: "index.js",
      role: "Independent subsystem",
      status: "foundation"
    }))
  )
);
export function findSystem(id) {
  return systemRegistry.find(system => system.id === String(id).toLowerCase()) || null;
}
