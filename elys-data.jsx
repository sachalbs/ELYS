// ELYS · software catalog used by search + dashboard + connector pages
// `domain` is used to fetch the real favicon (DuckDuckGo icon service — public CDN).

// Konnect backend base URL. Set this to your Cloudflare-tunnel hostname.
// Override on a per-deploy basis by setting window.KONNECT_API on app.html.
const KONNECT_API = (typeof window !== "undefined" && window.KONNECT_API)
  || "https://api.your-domain.tld";

// ── Anonymous session ──
//
// On first load, mint a session token via POST /api/auth/anon and cache
// it in localStorage. Every authenticated call (`/api/connect`,
// `/api/jobs/*`) must send `Authorization: Bearer <token>`. The backend
// derives the user_id from the token — the frontend never asserts
// identity in the request body.
//
// If the cached token is invalid (server rotated ELYS_AUTH_SECRET or
// wiped sessions), the next API call returns 401 — we detect that and
// re-mint a fresh one before retrying once.

const ELYS_TOKEN_KEY = "elys_session_token_v1";
const ELYS_UID_KEY   = "elys_session_uid_v1";

async function elysGetSession() {
  if (typeof window === "undefined") return { token: null, user_id: null };
  let token = localStorage.getItem(ELYS_TOKEN_KEY);
  let user_id = localStorage.getItem(ELYS_UID_KEY);
  if (token && user_id) return { token, user_id };
  const r = await fetch(`${KONNECT_API}/api/auth/anon`, { method: "POST" });
  if (!r.ok) throw new Error(`auth/anon → HTTP ${r.status}`);
  const data = await r.json();
  localStorage.setItem(ELYS_TOKEN_KEY, data.token);
  localStorage.setItem(ELYS_UID_KEY,   data.user_id);
  return { token: data.token, user_id: data.user_id };
}

// All `/api/*` calls should go through this wrapper. It adds the Bearer
// header, and on 401 it clears the cached token, re-mints, and retries
// once — so a backend secret rotation or session wipe is recovered
// transparently on the user's next click.
async function elysFetch(path, opts = {}) {
  const session = await elysGetSession();
  const headers = {
    ...(opts.headers || {}),
    "Authorization": `Bearer ${session.token}`,
  };
  let r = await fetch(`${KONNECT_API}${path}`, { ...opts, headers });
  if (r.status === 401) {
    localStorage.removeItem(ELYS_TOKEN_KEY);
    localStorage.removeItem(ELYS_UID_KEY);
    const fresh = await elysGetSession();
    headers["Authorization"] = `Bearer ${fresh.token}`;
    r = await fetch(`${KONNECT_API}${path}`, { ...opts, headers });
  }
  return r;
}

// Fetch the backend's connector registry once per page load.
//
// Resolves to a Map<slug, ConnectorMeta> where ConnectorMeta is whatever
// /connectors returns:
//   { slug, name, login_url, build_status: "built" | "pending",
//     client_available: bool }
//
// A slug NOT in this map = not provisionable by the backend → ScreenLogin
// shows "bientôt disponible". A slug in the map → we start the flow;
// build_status only affects what /complete returns (mcp_url for built,
// pending_message for pending).
async function fetchKonnectRegistry() {
  if (typeof window === "undefined") return new Map();
  if (window.__KONNECT_REGISTRY__) return window.__KONNECT_REGISTRY__;
  if (window.__KONNECT_REGISTRY_PROMISE__) return window.__KONNECT_REGISTRY_PROMISE__;
  window.__KONNECT_REGISTRY_PROMISE__ = (async () => {
    const r = await fetch(`${KONNECT_API}/connectors`);
    if (!r.ok) throw new Error(`GET /connectors → HTTP ${r.status}`);
    const data = await r.json();
    const map = new Map();
    for (const c of (data.connectors || [])) map.set(c.slug, c);
    window.__KONNECT_REGISTRY__ = map;
    return map;
  })();
  return window.__KONNECT_REGISTRY_PROMISE__;
}

const ELYS_CATALOG = [
  { slug:"pennylane", name:"Pennylane", category:"Comptabilité & facturation", color:"#1a3d2e", domain:"pennylane.com",
    desc:"Comptabilité collaborative, facturation et trésorerie pour TPE/PME.",
    actions:["Lire les factures émises et reçues","Créer ou éditer une facture","Lister les clients et fournisseurs","Exporter les écritures comptables","Récupérer le solde de trésorerie"] },
  { slug:"sage", name:"Sage", category:"ERP & comptabilité", color:"#00d639", domain:"sage.com",
    desc:"Suite ERP française pour la gestion comptable, commerciale et paie.",
    actions:["Lire les écritures comptables","Créer un devis","Lister les commandes","Exporter le grand livre"] },
  { slug:"ebp", name:"EBP", category:"Gestion commerciale", color:"#003a70", domain:"ebp.com",
    desc:"Logiciel français de gestion commerciale et de devis/factures.",
    actions:["Lister les devis","Créer une commande","Suivre les stocks","Exporter les factures"] },
  { slug:"qonto", name:"Qonto", category:"Banque pro", color:"#1d1d1b", domain:"qonto.com",
    desc:"Néobanque professionnelle pour entreprises et indépendants.",
    actions:["Lire les transactions","Catégoriser les dépenses","Initier un virement","Récupérer les justificatifs"] },
  { slug:"outlook", name:"Outlook", category:"Messagerie & calendrier", color:"#0078d4", domain:"outlook.com",
    desc:"Messagerie et calendrier Microsoft 365.",
    actions:["Lire et rédiger un e-mail","Planifier une réunion","Lister le calendrier","Créer un rappel"] },
  { slug:"cegid", name:"Cegid", category:"Comptabilité & paie", color:"#e30613", domain:"cegid.com",
    desc:"Solutions ERP, comptabilité et paie pour entreprises.",
    actions:["Lire les fiches de paie","Exporter les écritures","Lister les salariés"] },
  { slug:"silae", name:"Silae", category:"Paie", color:"#ff6a3d", domain:"silae.fr",
    desc:"Logiciel de paie pour cabinets d'expertise comptable.",
    actions:["Générer les bulletins","Lister les salariés","Exporter les DSN"] },
  { slug:"payfit", name:"PayFit", category:"Paie & RH", color:"#0044ff", domain:"payfit.com",
    desc:"Paie automatisée et gestion RH pour PME.",
    actions:["Créer un contrat","Générer la paie","Suivre les congés","Lister les collaborateurs"] },
  { slug:"urssaf", name:"URSSAF", category:"Déclarations sociales", color:"#003d7a", domain:"urssaf.fr",
    desc:"Plateforme officielle de déclarations et cotisations sociales.",
    actions:["Déposer une DSN","Consulter les cotisations","Télécharger une attestation"] },
  { slug:"doctolib", name:"Doctolib", category:"Rendez-vous santé", color:"#0596de", domain:"doctolib.fr",
    desc:"Prise de rendez-vous et téléconsultation pour professionnels de santé.",
    actions:["Lister les rendez-vous","Annuler un créneau","Récupérer le dossier patient"] },
  { slug:"salesforce", name:"Salesforce", category:"CRM", color:"#00a1e0", domain:"salesforce.com",
    desc:"CRM leader pour ventes, marketing et service client.",
    actions:["Lire les opportunités","Mettre à jour un contact","Créer une tâche","Exporter un pipeline"] },
  { slug:"hubspot", name:"HubSpot", category:"CRM & marketing", color:"#ff7a59", domain:"hubspot.com",
    desc:"Plateforme inbound de CRM, marketing et service.",
    actions:["Lire les contacts","Créer une campagne e-mail","Suivre les deals"] },
  { slug:"notion", name:"Notion", category:"Notes & wiki", color:"#191919", domain:"notion.so",
    desc:"Espace de travail tout-en-un : notes, bases, wiki.",
    actions:["Lire une page","Créer une entrée de base","Rechercher dans l'espace"] },
  { slug:"slack", name:"Slack", category:"Messagerie d'équipe", color:"#611f69", domain:"slack.com",
    desc:"Messagerie d'équipe par canaux et fils de discussion.",
    actions:["Envoyer un message","Lire un canal","Lister les membres"] },
  { slug:"linear", name:"Linear", category:"Gestion de projets", color:"#5e6ad2", domain:"linear.app",
    desc:"Suivi d'issues et de cycles pour équipes produit.",
    actions:["Créer une issue","Lister les cycles","Mettre à jour le statut"] },
  { slug:"shopify", name:"Shopify", category:"E-commerce", color:"#5a863e", domain:"shopify.com",
    desc:"Plateforme e-commerce pour boutiques en ligne.",
    actions:["Lister les commandes","Suivre les stocks","Exporter les ventes"] },
  // ─── Marquee-only extras (real-world tools the catalog doesn't need pages for) ───
  { slug:"stripe", name:"Stripe", category:"Paiements", color:"#635bff", domain:"stripe.com" },
  { slug:"gmail", name:"Gmail", category:"Messagerie", color:"#ea4335", domain:"gmail.com" },
  { slug:"gcal", name:"Google Calendar", category:"Calendrier", color:"#4285f4", domain:"calendar.google.com" },
  { slug:"gdrive", name:"Google Drive", category:"Fichiers", color:"#1fa463", domain:"drive.google.com" },
  { slug:"dropbox", name:"Dropbox", category:"Fichiers", color:"#0061ff", domain:"dropbox.com" },
  { slug:"airtable", name:"Airtable", category:"Bases de données", color:"#fcb400", domain:"airtable.com" },
  { slug:"asana", name:"Asana", category:"Projets", color:"#f06a6a", domain:"asana.com" },
  { slug:"trello", name:"Trello", category:"Projets", color:"#0079bf", domain:"trello.com" },
  { slug:"github", name:"GitHub", category:"Code", color:"#181717", domain:"github.com" },
  { slug:"figma", name:"Figma", category:"Design", color:"#f24e1e", domain:"figma.com" },
  { slug:"zendesk", name:"Zendesk", category:"Support client", color:"#03363d", domain:"zendesk.com" },
  { slug:"intercom", name:"Intercom", category:"Support client", color:"#1f8ded", domain:"intercom.com" },
  { slug:"mailchimp", name:"Mailchimp", category:"E-mail marketing", color:"#ffe01b", domain:"mailchimp.com" },
  { slug:"calendly", name:"Calendly", category:"Rendez-vous", color:"#006bff", domain:"calendly.com" },
  { slug:"zoom", name:"Zoom", category:"Visio", color:"#2d8cff", domain:"zoom.us" },
  { slug:"teams", name:"Microsoft Teams", category:"Visio", color:"#6264a7", domain:"teams.microsoft.com" }
];

const ELYS_FEATURED = ["pennylane","sage","qonto","outlook","ebp","cegid","silae","urssaf"];

// Tools shown in the scrolling marquee — duplicated by CSS for the infinite loop.
const ELYS_MARQUEE = [
  "pennylane","sage","qonto","outlook","ebp","cegid","silae","urssaf","payfit","doctolib",
  "stripe","gmail","gdrive","airtable","slack","notion","linear","hubspot","salesforce",
  "shopify","github","figma","calendly","zoom","mailchimp","intercom","zendesk","dropbox","asana","trello"
];

const ELYS_ACTIVE = [
  { slug:"pennylane", status:"active", calls:412, lastUsed:"il y a 2 min", url:"mcp://elys.app/c/3f9a-pennylane" },
  { slug:"qonto",     status:"active", calls:188, lastUsed:"il y a 14 min", url:"mcp://elys.app/c/7b21-qonto" },
  { slug:"outlook",   status:"expired", calls:64,  lastUsed:"il y a 3 jours", url:"mcp://elys.app/c/c19d-outlook" }
];

Object.assign(window, {
  ELYS_CATALOG, ELYS_FEATURED, ELYS_MARQUEE, ELYS_ACTIVE,
  // Auth helpers — used by ScreenLogin / ScreenReady from elys-screens.jsx
  elysGetSession, elysFetch, KONNECT_API,
});
