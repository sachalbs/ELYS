// ELYS · six screens of the user journey
const { useState: useS, useEffect: useE, useRef: useR, useMemo: useM } = React;

/* ════════════════════════════════════════════════════════════════════════
   SEARCHBOX · central CTA on landing + dashboard
   ════════════════════════════════════════════════════════════════════════ */
function SearchBox({ go, big=false, placeholder="Cherchez votre logiciel…" }) {
  const [q, setQ] = useS('');
  const [open, setOpen] = useS(false);
  const [hover, setHover] = useS(0);
  const inputRef = useR(null);

  const matches = useM(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return ELYS_CATALOG.filter(c =>
      c.name.toLowerCase().includes(term) || c.category.toLowerCase().includes(term)
    ).slice(0, 6);
  }, [q]);

  const pick = (slug) => { setOpen(false); setQ(''); go({ name:'connector', slug }); };

  const onKey = (e) => {
    if (!open || matches.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHover(h => (h+1) % matches.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHover(h => (h-1+matches.length) % matches.length); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(matches[hover].slug); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <div className={"sbox " + (big?"big":"")}>
      <div className={"sbox-row"}>
        <span className="sbox-icon">⌕</span>
        <input
          ref={inputRef}
          className="sbox-input"
          placeholder={placeholder}
          value={q}
          onChange={(e)=>{ setQ(e.target.value); setOpen(true); setHover(0); }}
          onFocus={()=>setOpen(true)}
          onBlur={()=>setTimeout(()=>setOpen(false), 150)}
          onKeyDown={onKey}
        />
        <button className="sbox-cta" type="button"
          onMouseDown={(e)=>{ e.preventDefault(); if (matches[0]) pick(matches[0].slug); else inputRef.current?.focus(); }}>
          {big ? "Connecter mon logiciel" : "Connecter"}
          <span className="arr">→</span>
        </button>
      </div>
      {open && q && (
        <div className="sbox-drop">
          {matches.length === 0 && (
            <div className="sbox-empty">
              Aucun résultat pour "<b>{q}</b>". Demandez-le · ajouté sous 48h.
            </div>
          )}
          {matches.map((c, i) => (
            <div key={c.slug}
                 className={"sbox-item " + (i===hover?"hover":"")}
                 onMouseEnter={()=>setHover(i)}
                 onMouseDown={()=>pick(c.slug)}>
              <ConnectorTile item={c} size={36} />
              <div className="sbox-meta">
                <div className="sbox-name">{c.name}</div>
                <div className="sbox-cat">{c.category}</div>
              </div>
              <div className="sbox-go">Connecter →</div>
            </div>
          ))}
          {matches.length > 0 && (
            <div className="sbox-foot">
              <span>{matches.length} résultat{matches.length>1?'s':''}</span>
              <span>↑↓ naviguer · ↵ choisir · esc fermer</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   1. LANDING
   ════════════════════════════════════════════════════════════════════════ */
function ScreenLanding({ go }) {
  return (
    <div data-screen-label="01 Landing">
      <Nav go={(k)=>go({name:k})} current="landing" />

      <section className="hero">
        <div className="wrap">
          <div className="hero-meta">
            <span className="dot"></span>
            <span className="tag">Votre IA · tous vos logiciels</span>
            <span className="rule"></span>
            <span className="ver">MCP compatible</span>
          </div>
          <h1 className="display hero-h1">Libérez le plein<br/>potentiel de <span className="blu">l'IA.</span></h1>
          <p className="hero-sub">Connectez <strong>Claude, ChatGPT, Gemini ou Mistral</strong> à n'importe quel logiciel web. Une URL. Un copier-coller. Deux minutes.</p>
          <div className="hero-search">
            <SearchBox big go={go} placeholder="Pennylane, Qonto, Outlook, Salesforce…" />
          </div>
        </div>
      </section>

      <section className="logos">
        <div className="wrap">
          <div className="logos-head">
            <div className="lbl">Compatible avec <b>tous vos logiciels</b> métiers</div>
            <div className="lbl">Cliquez pour connecter <b>en deux minutes</b></div>
          </div>
        </div>
        <div className="marquee">
          <div className="marquee-track">
            {[...ELYS_MARQUEE, ...ELYS_MARQUEE].map((slug, i) => {
              const c = ELYS_CATALOG.find(x => x.slug === slug);
              if (!c) return null;
              return (
                <a key={slug+'-'+i} href="#" className="marquee-cell"
                   onClick={(e)=>{e.preventDefault(); go({name:'connector', slug});}}>
                  <LogoMark item={c} size={22} muted={false} />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <SectionHead eyebrow="§ 01 · Procédure"
            title={<>Connectez votre logiciel<br/>en 3 étapes.</>} />
        </div>
        <div className="wrap">
          <div className="howto">
            {[
              { n:'01', tag:'Recherche', h:'Cherchez votre logiciel', p:"Tapez le nom de l'outil que votre IA doit piloter. Pennylane, Qonto, Outlook, ou n'importe lequel de vos logiciels web." },
              { n:'02', tag:'Authentification', h:'Connectez-vous une fois', p:"Connexion standard, comme dans un navigateur. ELYS chiffre vos identifiants et n'y touche jamais. Vous gardez la main." },
              { n:'03', tag:'Mise en service', h:'Votre IA est prête', p:"Copiez l'URL ELYS dans Claude, ChatGPT, Gemini ou Cursor. Votre IA peut désormais lire et écrire dans vos outils, en langage naturel." }
            ].map((s,i)=>(
              <div key={i} className="step">
                <div className="pin">STEP_{s.n}</div>
                <div className="num">{s.n}</div>
                <div className="htag">{s.tag}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingBlock go={go} />

      <Footer />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PRICING BLOCK · used on landing AND as full /pricing screen
   ════════════════════════════════════════════════════════════════════════ */
function PricingBlock({ go, full=false }) {
  const [annual, setAnnual] = React.useState(false);
  const fmtPrice = (m) => {
    if (m === 0) return { v:"0€", strike:null, u:"/ pour toujours" };
    const monthly = annual ? +(m * 0.8).toFixed(2) : m;
    const str = monthly.toFixed(2).replace('.', ',') + "€";
    return {
      v: str,
      strike: annual ? m.toFixed(2).replace('.', ',') + "€" : null,
      u: annual ? "/ mois HT · facturé annuellement" : "/ mois HT"
    };
  };
  const free = fmtPrice(0);
  const biz = fmtPrice(49.99);
  const pro = fmtPrice(9.99);
  return (
    <section className="pricing-wrap" id="pricing">
      <div className="wrap">
        <SectionHead eyebrow="§ 04 · Tarifs"
          title={<>Choisissez<br/>votre plan.</>}
          lede="Trois plans. Aucun frais caché. Annulation en un clic depuis votre tableau de bord." />
        <div className="billing-wrap">
          <div className="billing-toggle" role="group" aria-label="Période de facturation">
            <button className={annual ? '' : 'on'} onClick={()=>setAnnual(false)}>Mensuel</button>
            <button className={annual ? 'on' : ''} onClick={()=>setAnnual(true)}>
              Annuel <span className="save">−20%</span>
            </button>
          </div>
        </div>
        <div className="pricing">
          <div className="plan">
            <div><div className="pname">Free</div></div>
            <div className="price">
              <span className="v">{free.v}</span>
              <span className="u">{free.u}</span>
            </div>
            <p className="lede">Idéal pour essayer ELYS avec un seul outil métier, sans engagement.</p>
            <ul>
              <li><div>1 connecteur actif</div></li>
              <li><div>50 appels / mois</div></li>
              <li><div>Support communautaire</div></li>
              <li><div>Aucune carte requise</div></li>
            </ul>
            <a href="#" className="pcta" onClick={(e)=>{e.preventDefault(); go({name:'landing'});}}>Commencer gratuitement <span>→</span></a>
          </div>
          <div className="plan pro">
            <div className="badge">Recommandé</div>
            <div><div className="pname">Business</div></div>
            <div className="price">
              {biz.strike ? <span className="strike">{biz.strike}</span> : null}
              <span className="v">{biz.v}</span>
              <span className="u">{biz.u}</span>
            </div>
            <p className="lede">Connecteurs et appels illimités, support prioritaire avec un humain au bout du fil.</p>
            <ul>
              <li><div>Connecteurs illimités</div></li>
              <li><div>Appels illimités</div></li>
              <li><div>Support prioritaire · SLA 4h</div></li>
              <li><div>SSO · SAML · Audit log</div></li>
            </ul>
            <a href="#" className="pcta" onClick={(e)=>{e.preventDefault(); go({name:'landing'});}}>Choisir Business <span>→</span></a>
          </div>
          <div className="plan">
            <div><div className="pname">Pro</div></div>
            <div className="price">
              {pro.strike ? <span className="strike">{pro.strike}</span> : null}
              <span className="v">{pro.v}</span>
              <span className="u">{pro.u}</span>
            </div>
            <p className="lede">Trois outils branchés en même temps, appels illimités, support prioritaire.</p>
            <ul>
              <li><div>3 connecteurs simultanés</div></li>
              <li><div>Appels illimités</div></li>
              <li><div>Historique 90 jours</div></li>
              <li><div>Support e-mail prioritaire</div></li>
            </ul>
            <a href="#" className="pcta" onClick={(e)=>{e.preventDefault(); go({name:'landing'});}}>Choisir Pro <span>→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   2. CONNECTOR PAGE · /connect/<slug>
   ════════════════════════════════════════════════════════════════════════ */
function ScreenConnector({ slug, go }) {
  const c = ELYS_CATALOG.find(x => x.slug === slug) || ELYS_CATALOG[0];
  return (
    <div data-screen-label="02 Connector">
      <Nav go={(k)=>go({name:k})} current="landing" />
      <section className="page">
        <div className="wrap">
          <Crumb items={[
            { label:'ELYS', go:'landing' },
            { label:'Connecteurs', go:'landing' },
            { label:c.name }
          ]} go={(k)=>go({name:k})} />

          <div className="connect-head">
            <ConnectorTile item={c} size={96} />
            <div className="ch-meta">
              <div className="ch-eyebrow">
                <span className="dot"></span><span>Connecteur vérifié</span>
                <span className="ch-ver">v3.2 · maintenu par ELYS · MAJ il y a 4 j</span>
              </div>
              <h1 className="display ch-title">{c.name}</h1>
              <p className="ch-cat">{c.category}</p>
              <p className="ch-desc">{c.desc}</p>
            </div>
            <div className="ch-side">
              <button className="cta big-cta" onClick={()=>go({name:'login', slug:c.slug})}>
                Se connecter à {c.name} <span className="arr">→</span>
              </button>
              <div className="ch-trust">
                <div className="trust-row"><span className="trust-k">Chiffrement</span><b>AES-256</b></div>
                <div className="trust-row"><span className="trust-k">Hébergement</span><b>UE · Roubaix (FR)</b></div>
                <div className="trust-row"><span className="trust-k">Identifiants</span><b>jamais stockés en clair</b></div>
                <div className="trust-row"><span className="trust-k">Audit</span><b>SOC 2 Type I</b></div>
              </div>
            </div>
          </div>

          <div className="ch-grid">
            <div className="ch-actions">
              <div className="ch-section-head">
                <div className="eyebrow">§ Actions disponibles</div>
                <div className="ch-count">{c.actions.length} opérations</div>
              </div>
              <div className="action-list">
                {c.actions.map((a,i)=>(
                  <div key={i} className="action-row">
                    <span className="action-n">{String(i+1).padStart(2,'0')}</span>
                    <span className="action-l">{a}</span>
                    <span className="action-perm">{i===1||i===2?'read · write':'read'}</span>
                  </div>
                ))}
              </div>
              <div className="action-foot">
                <span>Toutes les actions sont auditables depuis votre <a href="#" onClick={(e)=>{e.preventDefault(); go({name:'dashboard'});}}>tableau de bord</a>.</span>
              </div>
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   3. LOGIN · /connect/<slug>/login
   ════════════════════════════════════════════════════════════════════════ */
function ScreenLogin({ slug, go }) {
  const c = ELYS_CATALOG.find(x => x.slug === slug) || ELYS_CATALOG[0];
  const [progress, setProgress] = useS(8);
  const [step, setStep] = useS(0); // 0 init, 1 entering creds, 2 2fa, 3 done
  const steps = [
    "Ouverture du tunnel chiffré",
    `Authentification ${c.name}`,
    "Vérification en deux étapes",
    "Création du connecteur ELYS"
  ];

  useE(() => {
    const id = setInterval(() => {
      setProgress(p => {
        const next = Math.min(100, p + 1.8 + Math.random()*1.2);
        if (next > 30 && step < 1) setStep(1);
        if (next > 60 && step < 2) setStep(2);
        if (next > 90 && step < 3) setStep(3);
        if (next >= 100) { clearInterval(id); setTimeout(()=>go({name:'ready', slug:c.slug}), 600); }
        return next;
      });
    }, 90);
    return () => clearInterval(id);
  }, [step]);

  return (
    <div data-screen-label="03 Login">
      <Nav go={(k)=>go({name:k})} />
      <section className="page">
        <div className="wrap narrow">
          <Crumb items={[
            { label:'ELYS', go:'landing' },
            { label:c.name, go:'connector', goPayload:c.slug },
            { label:'Connexion' }
          ]} go={(k)=>go({name:k})} />

          <div className="login-head">
            <ConnectorTile item={c} size={48} />
            <div>
              <div className="eyebrow">Connexion sécurisée à {c.name}</div>
              <h1 className="display login-h">Vos identifiants<br/><span className="blu">ne nous regardent pas.</span></h1>
            </div>
          </div>

          <div className="prog-wrap">
            <div className="prog-meta">
              <span>{Math.round(progress)}%</span>
              <span>{steps[step]}</span>
              <span>{Math.max(2, Math.round((100-progress)/12))} s restantes</span>
            </div>
            <div className="prog-bar"><div className="prog-fill" style={{width: progress+'%'}}></div></div>
          </div>

          <div className="browser">
            <div className="browser-bar">
              <span className="dots"><span></span><span></span><span></span></span>
              <span className="addr">https://login.{c.slug}.com/oauth · vérifié</span>
              <span className="lock">⌧ TLS 1.3</span>
            </div>
            <div className="browser-body">
              <div className="browser-stack">
                <div className="bw-line">{c.name.toUpperCase()}</div>
                <div className="bw-lbl">E-mail professionnel</div>
                <div className="bw-input">elise@studionorma.fr</div>
                <div className="bw-lbl">Mot de passe</div>
                <div className="bw-input">●●●●●●●●●●●●</div>
                <div className="bw-cta">Continuer →</div>
                <div className="bw-note">Fenêtre {c.name} · ELYS n'y a pas accès. Vos identifiants restent dans votre session.</div>
              </div>
              <div className="browser-overlay">
                <div className="overlay-dot"></div>
                <div className="overlay-text">{steps[step]}…</div>
              </div>
            </div>
          </div>

          <div className="login-steps">
            {steps.map((s, i) => (
              <div key={i} className={"lstep " + (i<step?"done":"") + (i===step?" cur":"")}>
                <span className="lstep-n">{String(i+1).padStart(2,'0')}</span>
                <span className="lstep-l">{s}</span>
                <span className="lstep-s">{i<step?'✓':(i===step?'· · ·':'·')}</span>
              </div>
            ))}
          </div>

          <div className="trust-bar">
            <div><span className="trust-k">Chiffrement</span><b>AES-256 · TLS 1.3</b></div>
            <div><span className="trust-k">Stockage</span><b>UE · OVH Roubaix</b></div>
            <div><span className="trust-k">Identifiants</span><b>jamais en clair</b></div>
            <div><span className="trust-k">Révocation</span><b>1 clic, à tout moment</b></div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   4. READY · /connect/<slug>/ready
   ════════════════════════════════════════════════════════════════════════ */
function ScreenReady({ slug, go }) {
  const c = ELYS_CATALOG.find(x => x.slug === slug) || ELYS_CATALOG[0];
  const url = `mcp://elys.app/c/3f9a-${c.slug}`;
  const [copied, setCopied] = useS(false);
  const [q, setQ] = useS('');
  const [answer, setAnswer] = useS(null);
  const [busy, setBusy] = useS(false);

  const copy = () => {
    navigator.clipboard?.writeText(url).catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false), 1800);
  };

  const ask = () => {
    if (!q.trim()) return;
    setBusy(true);
    setAnswer(null);
    setTimeout(() => {
      setBusy(false);
      setAnswer({
        title: `${c.name} · 3 résultats`,
        rows: [
          { k:'Facture F-2026-018', v:'4 800,00 €' },
          { k:'Facture F-2026-021', v:'1 250,00 €' },
          { k:'Facture F-2026-027', v:'3 600,00 €' }
        ],
        total: '9 650,00 €'
      });
    }, 1100);
  };

  return (
    <div data-screen-label="04 Ready">
      <Nav go={(k)=>go({name:k})} />
      <section className="page">
        <div className="wrap">
          <Crumb items={[
            { label:'ELYS', go:'landing' },
            { label:c.name, go:'connector' },
            { label:'Prêt' }
          ]} go={(k)=>go({name:k})} />

          <div className="ready-head">
            <div className="check"><span className="check-mark">✓</span></div>
            <div>
              <div className="eyebrow">Connecteur opérationnel</div>
              <h1 className="display ready-h">Votre connecteur<br/><span className="blu">{c.name} est prêt.</span></h1>
              <p className="ready-sub">Copiez l'URL ci-dessous dans votre IA. Elle saura lire et écrire dans {c.name} dès le prochain message.</p>
            </div>
          </div>

          <div className="mcp-box">
            <div className="mcp-label">URL MCP · à coller dans votre IA</div>
            <div className="mcp-row">
              <span className="mcp-url">{url}</span>
              <button className="mcp-copy" onClick={copy}>{copied?'✓ Copié':'Copier'}</button>
            </div>
            <div className="mcp-foot">
              <span><b>Privée</b> · liée à votre compte ELYS</span>
              <span>Régénérer ↻</span>
              <span>Révoquer ✕</span>
            </div>
          </div>

          <div className="install-grid">
            <div className="install-head">
              <div className="eyebrow">§ Ajouter à votre IA</div>
              <div className="install-tip">Cliquez l'IA que vous utilisez · instructions automatiques.</div>
            </div>
            {[
              { name:'Claude',  sub:'Anthropic · Desktop ou Web',    cmd:'claude config add-mcp',              domain:'claude.ai',  color:'#cc785c' },
              { name:'ChatGPT', sub:'OpenAI · Plus ou Team',         cmd:'Réglages › Connecteurs › Ajouter',  domain:'openai.com', color:'#10a37f' },
              { name:'Gemini',  sub:'Google · Advanced',             cmd:'gemini connect mcp://…',             domain:'gemini.google.com', color:'#1a73e8' },
              { name:'Cursor',  sub:'IDE · macOS · Windows · Linux', cmd:'Settings › MCP › New server',        domain:'cursor.com', color:'#000000' }
            ].map(ai => (
              <div key={ai.name} className="install-card">
                <div className="ic-mark"><BrandIcon item={ai} size={28} /></div>
                <div className="ic-name">{ai.name}</div>
                <div className="ic-sub">{ai.sub}</div>
                <div className="ic-cmd">{ai.cmd}</div>
                <a href="#" className="ic-cta">Ajouter dans {ai.name} <span>→</span></a>
              </div>
            ))}
          </div>

          <div className="test-box">
            <div className="test-head">
              <div className="eyebrow">§ Testez maintenant</div>
              <div className="test-tip">Pas besoin d'ouvrir votre IA · essayez ici, en direct.</div>
            </div>
            <div className="test-input">
              <span className="ti-prompt">›</span>
              <input
                placeholder={`Demandez quelque chose à ${c.name}…`}
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                onKeyDown={(e)=> e.key==='Enter' && ask()}
              />
              <button className="ti-go" onClick={ask}>Exécuter ↵</button>
            </div>
            <div className="test-suggest">
              <span>Essais rapides :</span>
              {['Liste mes factures impayées','Solde du mois','Top 5 clients'].map(s=>(
                <a key={s} href="#" onClick={(e)=>{e.preventDefault(); setQ(s); setTimeout(ask, 80);}}>{s}</a>
              ))}
            </div>
            <div className="test-output">
              {busy && <div className="to-busy">{c.name} répond… <span className="ellipsis">· · ·</span></div>}
              {!busy && !answer && <div className="to-empty">La réponse s'affichera ici. Aucune donnée n'est transmise à ELYS · flux direct {c.name} → IA.</div>}
              {!busy && answer && (
                <div className="to-card">
                  <div className="toc-head"><span className="badge">LIVE</span>{answer.title}</div>
                  <table className="table">
                    <tbody>
                      {answer.rows.map((r,i)=>(<tr key={i}><td>{r.k}</td><td className="r">{r.v}</td></tr>))}
                    </tbody>
                  </table>
                  <div className="resp-total"><span className="lbl">Total</span><span>{answer.total}</span></div>
                </div>
              )}
            </div>
          </div>

          <div className="next-row">
            <a href="#" className="cta" onClick={(e)=>{e.preventDefault(); go({name:'dashboard'});}}>Aller au tableau de bord <span className="arr">→</span></a>
            <a href="#" className="ghost" onClick={(e)=>{e.preventDefault(); go({name:'landing'});}}>Ajouter un autre logiciel</a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   5. DASHBOARD · /dashboard
   ════════════════════════════════════════════════════════════════════════ */
function ScreenDashboard({ go }) {
  const total = ELYS_ACTIVE.reduce((s,a)=>s+a.calls, 0);
  return (
    <div data-screen-label="05 Dashboard">
      <Nav go={(k)=>go({name:k})} current="dashboard" />
      <section className="page">
        <div className="wrap">
          <div className="dash-head">
            <div>
              <div className="eyebrow">§ Tableau de bord</div>
              <h1 className="display dash-h">Bonjour, Élise.</h1>
              <p className="dash-sub">3 connecteurs actifs · plan <b>Pro</b> · prochain renouvellement le 12 juin.</p>
            </div>
            <div className="dash-stats">
              <div className="ds-cell"><span className="ds-k">Appels ce mois</span><b className="ds-v">{total.toLocaleString('fr-FR')}</b><span className="ds-meta">/ 50 000</span></div>
              <div className="ds-cell"><span className="ds-k">Connecteurs</span><b className="ds-v">{ELYS_ACTIVE.length}</b><span className="ds-meta">/ 3 (Pro)</span></div>
              <div className="ds-cell"><span className="ds-k">Latence moy.</span><b className="ds-v">1.9 s</b><span className="ds-meta">stable</span></div>
            </div>
          </div>

          <div className="dash-search">
            <SearchBox go={go} placeholder="Ajouter un connecteur…" />
          </div>

          <div className="dash-table">
            <div className="dt-head">
              <span>Logiciel</span>
              <span>Statut</span>
              <span>URL MCP</span>
              <span>Appels (mois)</span>
              <span>Dernier appel</span>
              <span></span>
            </div>
            {ELYS_ACTIVE.map(row => {
              const c = ELYS_CATALOG.find(x => x.slug === row.slug);
              const expired = row.status === 'expired';
              return (
                <div key={row.slug} className="dt-row">
                  <span className="dt-name">
                    <ConnectorTile item={c} size={36} />
                    <span><b>{c.name}</b><span className="dt-cat">{c.category}</span></span>
                  </span>
                  <span className={"dt-status " + (expired?"red":"green")}>
                    <span className="dot"></span>{expired?'Expiré':'Actif'}
                  </span>
                  <span className="dt-url mono">{row.url}</span>
                  <span className="dt-calls"><b>{row.calls}</b><span className="dt-meta">appels</span></span>
                  <span className="dt-last">{row.lastUsed}</span>
                  <span className="dt-act">
                    {expired
                      ? <a href="#" className="ghost sm" onClick={(e)=>{e.preventDefault(); go({name:'login', slug:row.slug});}}>Reconnecter →</a>
                      : <a href="#" className="ghost sm" onClick={(e)=>{e.preventDefault(); go({name:'ready', slug:row.slug});}}>Gérer →</a>}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="dash-foot">
            <div className="df-block">
              <div className="eyebrow">§ Activité récente</div>
              <ul className="activity">
                <li><span className="mono">14:32</span><span>Claude a lu <b>4 factures</b> sur Pennylane</span></li>
                <li><span className="mono">14:18</span><span>ChatGPT a planifié une <b>réunion</b> sur Outlook</span></li>
                <li><span className="mono">13:55</span><span>Claude a catégorisé <b>12 transactions</b> Qonto</span></li>
                <li><span className="mono">13:40</span><span>Gemini a exporté le <b>grand livre</b> avril</span></li>
              </ul>
            </div>
            <div className="df-block">
              <div className="eyebrow">§ Suggestions</div>
              <div className="suggest-list">
                {['salesforce','slack','notion'].map(s => {
                  const c = ELYS_CATALOG.find(x => x.slug === s);
                  return (
                    <a key={s} href="#" className="suggest" onClick={(e)=>{e.preventDefault(); go({name:'connector', slug:s});}}>
                      <ConnectorTile item={c} size={36} />
                      <span><b>{c.name}</b><span className="dt-cat">{c.category}</span></span>
                      <span className="arr">→</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   6. PRICING PAGE
   ════════════════════════════════════════════════════════════════════════ */
function ScreenPricing({ go }) {
  return (
    <div data-screen-label="06 Pricing">
      <Nav go={(k)=>go({name:k})} current="pricing" />
      <PricingBlock go={go} full />
      <section className="page">
        <div className="wrap">
          <div className="faq">
            <div className="eyebrow">§ Questions fréquentes</div>
            <div className="faq-list">
              {[
                { q:"Puis-je changer de plan à tout moment ?", a:"Oui. Vous pouvez monter ou descendre de plan en un clic. La différence est calculée au prorata." },
                { q:"Comment se passe la facturation ?", a:"Mensuelle, sans engagement. Carte bancaire ou prélèvement SEPA. Factures PDF disponibles dans votre tableau de bord." },
                { q:"Mes données sont-elles partagées avec ELYS ?", a:"Non. ELYS sert d'intermédiaire chiffré entre votre IA et vos logiciels. Aucune donnée n'est stockée côté ELYS au-delà de l'historique d'appels." },
                { q:"Que se passe-t-il à la fin de la période gratuite ?", a:"Vous passez en plan Free (1 connecteur, 100 appels). Aucun prélèvement automatique sans votre accord explicite." }
              ].map((f,i)=>(
                <div key={i} className="faq-row">
                  <div className="faq-q">{String(i+1).padStart(2,'0')} · {f.q}</div>
                  <div className="faq-a">{f.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

Object.assign(window, {
  SearchBox, ScreenLanding, ScreenConnector, ScreenLogin, ScreenReady, ScreenDashboard, ScreenPricing
});
