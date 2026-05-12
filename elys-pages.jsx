// ELYS · 11 info/legal/marketing pages reached from the footer.
// All share the same brutalist info-page chrome (eyebrow → big title → body).
// Editor identity is centralized as ELYS_EDITOR so the user can swap one place.

const ELYS_EDITOR = {
  brand:        "ELYS",
  legalName:    "Camille Roussel",                       // ← microentreprise — à valider
  legalForm:    "Entreprise individuelle · régime de la microentreprise",
  siret:        "932 481 207 00012",
  rcs:          "RCS Paris 932 481 207",
  address:      "12 rue des Petites Écuries, 75010 Paris",
  email:        "contact@elys.app",
  publisher:    "Camille Roussel",                       // directeur de la publication
  tva:          "TVA non applicable, art. 293 B du CGI",
  host:         "OVH SAS · 2 rue Kellermann, 59100 Roubaix, France · RCS Lille Métropole 424 761 419",
  capital:      "—"
};

/* ───────────────────────── Shared chrome ───────────────────────── */
function InfoShell({ section, title, lede, eyebrowGo, children, draft=false, go }) {
  return (
    <div data-screen-label={section}>
      <Nav go={(k)=>go({name:k})} />
      <section className="page">
        <div className="wrap narrow">
          <Crumb items={[
            { label:'ELYS', go:'landing' },
            eyebrowGo ? { label: eyebrowGo.label } : null,
            { label: title }
          ].filter(Boolean)} go={(k)=>go({name:k})} />
          <header className="info-head">
            <div className="eyebrow">{section}</div>
            <h1 className="display info-h">{title}</h1>
            {lede && <p className="info-lede">{lede}</p>}
            {draft && <span className="draft-pill">DRAFT · données éditeur à valider</span>}
          </header>
          <div className="info-body">{children}</div>
        </div>
      </section>
      <Footer go={(k)=>go({name:k})} />
    </div>
  );
}

function InfoSection({ n, title, children }) {
  return (
    <section className="info-sec">
      <div className="info-sec-head">
        <span className="info-sec-n">{n}</span>
        <h2 className="info-sec-h">{title}</h2>
      </div>
      <div className="info-sec-body">{children}</div>
    </section>
  );
}

function KV({ rows }) {
  return (
    <dl className="kv">
      {rows.map(([k, v], i) => (
        <div key={i} className="kv-row"><dt>{k}</dt><dd>{v}</dd></div>
      ))}
    </dl>
  );
}

/* ───────────────────────── 1. DOCUMENTATION ───────────────────────── */
function ScreenDocs({ go }) {
  return (
    <InfoShell go={go} section="§ Documentation" title={<>Docs.</>}
      lede="Guides courts pour brancher votre IA à vos logiciels. Lecture en 4 minutes.">
      <InfoSection n="01" title="Démarrage rapide">
        <ol className="info-list">
          <li>Créez un connecteur depuis votre tableau de bord ELYS.</li>
          <li>Authentifiez-vous une fois auprès du logiciel cible.</li>
          <li>Copiez l'URL MCP générée et collez-la dans Claude, ChatGPT, Gemini ou Cursor.</li>
        </ol>
      </InfoSection>
      <InfoSection n="02" title="Protocole MCP">
        <p>ELYS expose chaque logiciel comme un serveur MCP (Model Context Protocol) standard. Vos IA peuvent lister les actions, les exécuter en lecture ou écriture, et recevoir les résultats au format JSON.</p>
        <a className="info-link" href="#">Lire la spécification MCP →</a>
      </InfoSection>
      <InfoSection n="03" title="Limites & quotas">
        <KV rows={[
          ["Free", "1 connecteur · 50 appels / mois"],
          ["Pro", "3 connecteurs · appels illimités"],
          ["Business", "Connecteurs illimités · appels illimités · SLA 4h"],
          ["Délai d'exécution", "30 s par appel · 5 MB max par réponse"]
        ]} />
      </InfoSection>
      <InfoSection n="04" title="Aller plus loin">
        <ul className="info-list">
          <li><a className="info-link" href="#">Référence API REST</a></li>
          <li><a className="info-link" href="#">Webhooks & événements</a></li>
          <li><a className="info-link" href="#">Bibliothèques officielles : Python, Node, Go</a></li>
        </ul>
      </InfoSection>
    </InfoShell>
  );
}

/* ───────────────────────── 2. CHANGELOG ───────────────────────── */
function ScreenChangelog({ go }) {
  const entries = [
    { v:"v2.4", date:"12 mai 2026", tag:"Sortie",
      items:["Connecteurs Pennylane, Cegid et Silae passent en lecture/écriture", "Refonte du tableau de bord : recherche, suggestions, activité en temps réel", "Latence p95 ramenée à 1.9 s"] },
    { v:"v2.3", date:"21 avril 2026", tag:"Mineure",
      items:["Ajout du connecteur Doctolib", "Support du SSO Google Workspace côté Business"] },
    { v:"v2.2", date:"02 avril 2026", tag:"Correctif",
      items:["Correction de la rotation des tokens Qonto", "Audit log exportable en CSV"] },
    { v:"v2.1", date:"15 mars 2026", tag:"Mineure",
      items:["Nouveau plan Business · SLA 4h ouvrées", "Historique d'appels remonté à 90 jours pour le plan Pro"] }
  ];
  return (
    <InfoShell go={go} section="§ Changelog" title={<>Changelog.</>}
      lede="Tout ce qui change dans ELYS, chaque semaine. Sans bullshit marketing.">
      <div className="cl-list">
        {entries.map((e,i)=>(
          <article key={i} className="cl-row">
            <div className="cl-meta">
              <div className="cl-ver">{e.v}</div>
              <div className="cl-date">{e.date}</div>
              <span className="cl-tag">{e.tag}</span>
            </div>
            <ul className="info-list">
              {e.items.map((it,j)=><li key={j}>{it}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </InfoShell>
  );
}

/* ───────────────────────── 3. STATUS ───────────────────────── */
function ScreenStatus({ go }) {
  // 90 cells, mostly green, a couple of degradations
  const dips = new Set([12, 47, 73]);
  const partial = new Set([48]);
  return (
    <InfoShell go={go} section="§ Status" title={<>Tout fonctionne.</>}
      lede="Disponibilité en temps réel des services ELYS. Mise à jour toutes les minutes.">
      <div className="status-bar">
        <span className="status-led ok"></span>
        <span>Tous les systèmes opérationnels</span>
        <span className="status-time">Dernière vérification : il y a 23 s</span>
      </div>
      <div className="status-grid">
        {["API ELYS","Tableau de bord","Connecteurs · lecture","Connecteurs · écriture","Authentification","Webhooks"].map((svc,i)=>{
          const uptime = (99.92 + i*0.01).toFixed(2);
          return (
            <div key={svc} className="status-svc">
              <div className="status-svc-head">
                <span className="status-svc-name">{svc}</span>
                <span className="status-svc-up">{uptime}%</span>
              </div>
              <div className="status-cells">
                {Array.from({length: 90}).map((_,c)=>{
                  const cls = dips.has(c) ? 'down' : partial.has(c) ? 'mid' : 'ok';
                  return <span key={c} className={"status-cell "+cls} title={`Jour -${89-c}`}></span>;
                })}
              </div>
              <div className="status-axis"><span>−90 j</span><span>Aujourd'hui</span></div>
            </div>
          );
        })}
      </div>
      <p className="info-foot">Incident récent : <b>02/04/2026 · 14:18–14:42 CEST</b> · Latence accrue sur le connecteur Qonto (rate limit côté fournisseur).</p>
    </InfoShell>
  );
}

/* ───────────────────────── 4. ABOUT ───────────────────────── */
function ScreenAbout({ go }) {
  return (
    <InfoShell go={go} section="§ À propos" title={<>Une équipe<br/>d'une personne.</>}
      lede="ELYS est éditée par une microentreprise française. Pas de VC, pas de growth team, pas de roadmap publique. Juste un produit qui marche.">
      <InfoSection n="01" title="Pourquoi ELYS">
        <p>Les IA savent lire et raisonner. Mais elles ne peuvent presque jamais agir directement sur vos logiciels métiers. ELYS comble ce trou : on connecte n'importe quelle IA à n'importe quel logiciel web, en deux minutes, sans code.</p>
      </InfoSection>
      <InfoSection n="02" title="Le manifeste">
        <ul className="info-list">
          <li>Un prix simple. Pas de calculs au litre.</li>
          <li>Vos données ne servent jamais à entraîner un modèle.</li>
          <li>Si on ne sait pas faire, on le dit.</li>
          <li>Pas de chatbot. Vous écrivez à un humain, un humain répond.</li>
        </ul>
      </InfoSection>
      <InfoSection n="03" title="L'entreprise">
        <KV rows={[
          ["Forme juridique", ELYS_EDITOR.legalForm],
          ["Dirigeant", ELYS_EDITOR.legalName],
          ["Siège", ELYS_EDITOR.address],
          ["Immatriculation", ELYS_EDITOR.rcs]
        ]} />
      </InfoSection>
    </InfoShell>
  );
}

/* ───────────────────────── 5. CAREERS ───────────────────────── */
function ScreenCareers({ go }) {
  return (
    <InfoShell go={go} section="§ Carrières" title={<>Pas de postes ouverts.</>}
      lede="ELYS est une équipe d'une personne. Pas de recrutement prévu en 2026. Si vous voulez quand même nous écrire, c'est par ici.">
      <InfoSection n="01" title="Si on devait recruter un jour">
        <p>On chercherait quelqu'un qui sait écrire du code, parler aux clients, et tenir un product sans manager intermédiaire. Si c'est vous, écrivez-nous — on garde un dossier.</p>
        <a className="info-link" href={"mailto:"+ELYS_EDITOR.email}>{ELYS_EDITOR.email} →</a>
      </InfoSection>
      <InfoSection n="02" title="Ce qu'on offre">
        <ul className="info-list">
          <li>Du travail à distance, 4 jours par semaine.</li>
          <li>Un code base propre et un seul produit à l'esprit.</li>
          <li>Une revenue share dès le premier mois.</li>
        </ul>
      </InfoSection>
    </InfoShell>
  );
}

/* ───────────────────────── 6. CONTACT ───────────────────────── */
function ScreenContact({ go }) {
  return (
    <InfoShell go={go} section="§ Contact" title={<>Écrivez-nous.</>}
      lede="Une question, un bug, un retour : un humain répond en moins de 24 heures ouvrées.">
      <div className="contact-grid">
        <div className="contact-card">
          <div className="contact-k">E-mail général</div>
          <a className="contact-v" href={"mailto:"+ELYS_EDITOR.email}>{ELYS_EDITOR.email}</a>
        </div>
        <div className="contact-card">
          <div className="contact-k">Support technique</div>
          <a className="contact-v" href="mailto:support@elys.app">support@elys.app</a>
        </div>
        <div className="contact-card">
          <div className="contact-k">Presse</div>
          <a className="contact-v" href="mailto:presse@elys.app">presse@elys.app</a>
        </div>
        <div className="contact-card">
          <div className="contact-k">Sécurité · disclosure</div>
          <a className="contact-v" href="mailto:security@elys.app">security@elys.app</a>
        </div>
        <div className="contact-card wide">
          <div className="contact-k">Adresse postale</div>
          <div className="contact-v">{ELYS_EDITOR.brand} — {ELYS_EDITOR.legalName}<br/>{ELYS_EDITOR.address}<br/>France</div>
        </div>
        <div className="contact-card">
          <div className="contact-k">Horaires</div>
          <div className="contact-v">Lun–Ven · 9h–18h CET</div>
        </div>
      </div>
    </InfoShell>
  );
}

/* ───────────────────────── 7. SECURITY ───────────────────────── */
function ScreenSecurity({ go }) {
  return (
    <InfoShell go={go} section="§ Sécurité" title={<>Vos données<br/>restent à vous.</>}
      lede="Comment ELYS gère vos identifiants, vos appels et vos métadonnées. Sans langue de bois.">
      <InfoSection n="01" title="Chiffrement & transport">
        <KV rows={[
          ["Transport", "TLS 1.3 sur tous les échanges"],
          ["Stockage", "AES-256-GCM, clés gérées par AWS KMS"],
          ["Identifiants tiers", "Chiffrés au niveau ligne — jamais lisibles en clair par ELYS"],
          ["Tokens MCP", "Rotation tous les 30 jours, révocables en 1 clic"]
        ]} />
      </InfoSection>
      <InfoSection n="02" title="Ce qu'on stocke (et ce qu'on ne stocke pas)">
        <div className="sec-cols">
          <div className="sec-col">
            <div className="sec-col-h ok">Ce qu'on stocke</div>
            <ul className="info-list">
              <li>Vos identifiants tiers, chiffrés</li>
              <li>L'horodatage + statut de chaque appel</li>
              <li>Le nom du connecteur invoqué</li>
              <li>L'IA qui a fait l'appel (Claude, etc.)</li>
            </ul>
          </div>
          <div className="sec-col">
            <div className="sec-col-h no">Ce qu'on ne stocke jamais</div>
            <ul className="info-list">
              <li>Le contenu des réponses de vos logiciels</li>
              <li>Le texte des prompts envoyés par votre IA</li>
              <li>Vos données métier (factures, contacts, …)</li>
              <li>Vos données pour entraîner un modèle</li>
            </ul>
          </div>
        </div>
      </InfoSection>
      <InfoSection n="03" title="Hébergement & souveraineté">
        <KV rows={[
          ["Hébergeur", ELYS_EDITOR.host],
          ["Localisation", "Roubaix, France (région UE)"],
          ["Sous-traitants", "Cloudflare (CDN), Stripe (paiement) · liste détaillée dans le DPA"]
        ]} />
      </InfoSection>
      <InfoSection n="04" title="Audits & certifications">
        <ul className="info-list">
          <li>SOC 2 Type I — audit en cours · rapport attendu Q3 2026</li>
          <li>RGPD : registre des traitements maintenu à jour</li>
          <li>Bug bounty privé · disclosure responsable</li>
        </ul>
      </InfoSection>
      <p className="info-foot">Vous avez trouvé une faille ? Écrivez à <a className="info-link" href="mailto:security@elys.app">security@elys.app</a>. Réponse sous 48 h, récompense possible.</p>
    </InfoShell>
  );
}

/* ───────────────────────── 8. CGV ───────────────────────── */
function ScreenCGV({ go }) {
  const arts = [
    { t:"Identification de l'éditeur",
      c:`Le service ELYS est édité par ${ELYS_EDITOR.legalName}, ${ELYS_EDITOR.legalForm}, immatriculée sous le SIRET ${ELYS_EDITOR.siret}, dont le siège est situé ${ELYS_EDITOR.address}. ${ELYS_EDITOR.tva}.` },
    { t:"Objet",
      c:"Les présentes CGV régissent la fourniture du service ELYS, qui permet de connecter une IA tierce à des logiciels métiers via le protocole MCP." },
    { t:"Souscription & comptes",
      c:"L'accès au service nécessite la création d'un compte. L'utilisateur garantit l'exactitude des informations fournies et la confidentialité de ses identifiants." },
    { t:"Plans & paiement",
      c:"Trois plans sont proposés : Free, Pro (9,99 € HT/mois) et Business (49,99 € HT/mois). Le paiement est mensuel ou annuel (−20%), prélevé d'avance, par carte bancaire ou SEPA, via Stripe. En tant que microentreprise, l'éditeur applique la franchise en base de TVA (art. 293 B du CGI)." },
    { t:"Durée & résiliation",
      c:"L'abonnement est sans engagement. Il peut être résilié à tout moment depuis le tableau de bord, avec effet au prochain cycle de facturation. Aucun remboursement au prorata." },
    { t:"Disponibilité",
      c:"L'éditeur s'efforce d'assurer une disponibilité de 99,9% mesurée mensuellement. En cas de non-respect pour les plans Business, un avoir prorata est appliqué sur demande." },
    { t:"Responsabilité",
      c:"L'éditeur ne saurait être tenu responsable des défaillances des logiciels tiers connectés via ELYS. La responsabilité de l'éditeur est plafonnée au montant des sommes versées au cours des 12 derniers mois." },
    { t:"Données personnelles",
      c:"Le traitement des données personnelles est régi par la Politique de confidentialité et, pour les clients professionnels, par le DPA disponible sur demande." },
    { t:"Propriété intellectuelle",
      c:"Le service ELYS, son code et sa marque sont la propriété exclusive de l'éditeur. L'utilisateur dispose d'un droit d'usage non exclusif et non transférable." },
    { t:"Loi applicable & juridiction",
      c:"Les présentes CGV sont régies par le droit français. Tout litige relève des tribunaux de Paris, après tentative de résolution amiable." },
    { t:"Médiation",
      c:"Conformément à l'article L.612-1 du Code de la consommation, l'utilisateur peut recourir gratuitement au médiateur de la consommation CNPM-Médiation (cnpm-mediation-consommation.eu)." },
    { t:"Modification",
      c:"L'éditeur se réserve le droit de modifier les présentes CGV. Toute modification est notifiée 30 jours avant son entrée en vigueur." }
  ];
  return (
    <InfoShell go={go} draft section="§ Légal · CGV" title={<>Conditions<br/>générales.</>}
      lede="En vigueur depuis le 12 mai 2026. Version 1.0.">
      <div className="legal-list">
        {arts.map((a,i)=>(
          <article key={i} className="legal-art">
            <div className="legal-n">Article {String(i+1).padStart(2,'0')}</div>
            <h3 className="legal-h">{a.t}</h3>
            <p className="legal-c">{a.c}</p>
          </article>
        ))}
      </div>
    </InfoShell>
  );
}

/* ───────────────────────── 9. PRIVACY ───────────────────────── */
function ScreenPrivacy({ go }) {
  return (
    <InfoShell go={go} draft section="§ Légal · Confidentialité" title={<>Politique<br/>de confidentialité.</>}
      lede={`En vigueur depuis le 12 mai 2026. Responsable de traitement : ${ELYS_EDITOR.legalName}.`}>
      <InfoSection n="01" title="Données collectées">
        <KV rows={[
          ["Identification", "Nom, prénom, e-mail, mot de passe haché"],
          ["Facturation", "Adresse, raison sociale (le cas échéant), mode de paiement (via Stripe)"],
          ["Usage", "Connecteurs activés, nombre et horodatage des appels, IA invoquée"],
          ["Techniques", "Adresse IP, user-agent, journaux applicatifs (conservation 30 jours)"]
        ]} />
      </InfoSection>
      <InfoSection n="02" title="Finalités & bases légales">
        <ul className="info-list">
          <li><b>Fourniture du service</b> · exécution du contrat (art. 6.1.b RGPD)</li>
          <li><b>Facturation & comptabilité</b> · obligation légale (art. 6.1.c)</li>
          <li><b>Communication produit</b> · intérêt légitime (art. 6.1.f) — désabonnement en 1 clic</li>
          <li><b>Détection de fraude</b> · intérêt légitime (art. 6.1.f)</li>
        </ul>
      </InfoSection>
      <InfoSection n="03" title="Durée de conservation">
        <KV rows={[
          ["Compte actif", "Conservation tant que le compte est ouvert"],
          ["Compte clôturé", "Anonymisation sous 30 jours, sauf obligations légales (10 ans pour la facturation)"],
          ["Journaux techniques", "30 jours"],
          ["Historique d'appels", "90 jours (Pro) · 12 mois (Business)"]
        ]} />
      </InfoSection>
      <InfoSection n="04" title="Vos droits">
        <p>Vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition. Vous pouvez les exercer à <a className="info-link" href="mailto:dpo@elys.app">dpo@elys.app</a>. Réponse sous 30 jours.</p>
        <p>En cas de litige, vous pouvez saisir la CNIL (cnil.fr).</p>
      </InfoSection>
      <InfoSection n="05" title="Sous-traitants">
        <KV rows={[
          ["Hébergement", "OVH SAS · France"],
          ["Paiement", "Stripe Payments Europe · Irlande"],
          ["E-mail transactionnel", "Postmark · États-Unis · clauses contractuelles types"],
          ["Analytique", "Plausible · Allemagne · sans cookie"]
        ]} />
      </InfoSection>
    </InfoShell>
  );
}

/* ───────────────────────── 10. LEGAL NOTICE ───────────────────────── */
function ScreenLegal({ go }) {
  return (
    <InfoShell go={go} draft section="§ Légal · Mentions" title={<>Mentions<br/>légales.</>}
      lede="Conformément à l'article 6 de la LCEN du 21 juin 2004.">
      <InfoSection n="01" title="Éditeur du site">
        <KV rows={[
          ["Nom commercial", ELYS_EDITOR.brand],
          ["Exploitant", ELYS_EDITOR.legalName],
          ["Forme juridique", ELYS_EDITOR.legalForm],
          ["SIRET", ELYS_EDITOR.siret],
          ["Immatriculation", ELYS_EDITOR.rcs],
          ["Siège social", ELYS_EDITOR.address],
          ["TVA intracommunautaire", ELYS_EDITOR.tva],
          ["Capital social", ELYS_EDITOR.capital]
        ]} />
      </InfoSection>
      <InfoSection n="02" title="Directeur de la publication">
        <p>{ELYS_EDITOR.publisher} · <a className="info-link" href={"mailto:"+ELYS_EDITOR.email}>{ELYS_EDITOR.email}</a></p>
      </InfoSection>
      <InfoSection n="03" title="Hébergeur">
        <p>{ELYS_EDITOR.host}</p>
      </InfoSection>
      <InfoSection n="04" title="Propriété intellectuelle">
        <p>L'ensemble des éléments du site (textes, logo, code, design) est la propriété exclusive de l'éditeur, à l'exception des marques tierces citées qui restent la propriété de leurs détenteurs respectifs. Toute reproduction non autorisée est interdite.</p>
      </InfoSection>
      <InfoSection n="05" title="Crédits">
        <ul className="info-list">
          <li>Typographies : Archivo Black, DM Sans, JetBrains Mono — Google Fonts, SIL Open Font License</li>
          <li>Icônes de marques : récupérées depuis les sources publiques des éditeurs respectifs</li>
        </ul>
      </InfoSection>
    </InfoShell>
  );
}

/* ───────────────────────── 11. DPA / GDPR ───────────────────────── */
function ScreenDPA({ go }) {
  return (
    <InfoShell go={go} draft section="§ Légal · RGPD · DPA" title={<>Accord de traitement<br/>des données.</>}
      lede="Pour les clients professionnels. Document complet disponible sur demande, signé par contre-signature électronique.">
      <InfoSection n="01" title="Cadre">
        <p>Le présent DPA (Data Processing Agreement) complète les CGV ELYS et organise les relations entre l'utilisateur (responsable de traitement) et ELYS (sous-traitant) au sens de l'article 28 du RGPD.</p>
      </InfoSection>
      <InfoSection n="02" title="Nature des traitements">
        <KV rows={[
          ["Objet", "Connecter une IA tierce à des logiciels métiers via le protocole MCP"],
          ["Durée", "Toute la durée du contrat de service"],
          ["Catégories de données", "Identifiants techniques, métadonnées d'appel"],
          ["Catégories de personnes", "Utilisateurs des logiciels métiers connectés"]
        ]} />
      </InfoSection>
      <InfoSection n="03" title="Obligations d'ELYS">
        <ul className="info-list">
          <li>Traiter les données uniquement sur instructions documentées du responsable</li>
          <li>Garantir la confidentialité des personnes habilitées à traiter</li>
          <li>Mettre en œuvre les mesures de sécurité décrites en annexe</li>
          <li>Notifier toute violation de données sous 72 heures</li>
          <li>Assister le responsable dans ses obligations RGPD</li>
        </ul>
      </InfoSection>
      <InfoSection n="04" title="Transferts hors UE">
        <p>Aucun transfert hors UE n'est effectué pour le stockage. Certains sous-traitants (Postmark, e-mail transactionnel) sont basés aux États-Unis et opèrent sous les clauses contractuelles types de la Commission européenne.</p>
      </InfoSection>
      <InfoSection n="05" title="Téléchargement">
        <a className="info-link" href="#">Télécharger le DPA complet (PDF, 12 p.) →</a>
        <p style={{marginTop:8, fontSize:13, color:'var(--muted)'}}>Pour les plans Business, signature électronique automatique. Sinon, écrivez à <a className="info-link" href="mailto:dpo@elys.app">dpo@elys.app</a>.</p>
      </InfoSection>
    </InfoShell>
  );
}

Object.assign(window, {
  ELYS_EDITOR,
  ScreenDocs, ScreenChangelog, ScreenStatus,
  ScreenAbout, ScreenCareers, ScreenContact, ScreenSecurity,
  ScreenCGV, ScreenPrivacy, ScreenLegal, ScreenDPA
});
