// ELYS · shared components: nav, footer, logo marks, primitives
const { useState, useEffect, useRef, useMemo } = React;

// Render a software "mark" as a typographic wordmark (no real logos used).
// Real favicon via DuckDuckGo's public icon service. Falls back to a colored
// monogram tile if the favicon can't be fetched.
function BrandIcon({ item, size=24 }) {
  const [failed, setFailed] = React.useState(false);
  const monogram = (item.name || '?').replace(/[^A-Za-zÀ-ÿ]/g,'').slice(0,1).toUpperCase();
  if (failed || !item.domain) {
    return (
      <span style={{
        width:size, height:size, background:item.color || '#000',
        display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        fontFamily:'"Archivo Black",sans-serif', fontWeight:900, color:'#fff',
        fontSize: Math.round(size*0.55), lineHeight:1
      }}>{monogram}</span>
    );
  }
  return (
    <img
      src={`https://icons.duckduckgo.com/ip3/${item.domain}.ico`}
      alt={item.name}
      width={size} height={size}
      onError={() => setFailed(true)}
      style={{ display:'block', objectFit:'contain', flexShrink:0 }}
    />
  );
}

// Wordmark for the landing logos band — real brand icon + name.
function LogoMark({ item, size=22, muted=false }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:12, lineHeight:1 }}>
      <BrandIcon item={item} size={size} />
      <span style={{
        fontFamily:'"Archivo Black",sans-serif', fontWeight:900,
        letterSpacing:'-0.01em', fontSize:size,
        color: muted ? '#9aa0a6' : '#000'
      }}>{item.name}</span>
    </span>
  );
}

// Small square chip representing a connector · renders a 1–2 letter monogram so it always
// fits its tile box (full wordmark stays outside via <LogoMark>).
// Square chip — white tile with the real brand favicon inside, 1px black border.
// Falls back to a colored monogram via <BrandIcon> if the favicon is unreachable.
function ConnectorTile({ item, size=56 }) {
  return (
    <div style={{
      width:size, height:size, background:'#fff', border:'1px solid #000',
      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0
    }}>
      <BrandIcon item={item} size={Math.round(size * 0.6)} />
    </div>
  );
}

function Nav({ go, current }) {
  const link = (key, label) => (
    <a href="#" onClick={(e)=>{e.preventDefault(); go(key);}}
       className={"nav-link " + (current===key?"on":"")}>{label}</a>
  );
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#" onClick={(e)=>{e.preventDefault(); go('landing');}} className="logo">ELYS</a>
        <nav className="nav-links">
          {link('landing','Connecteurs')}
          {link('pricing','Pricing')}
          <a href="#" className="nav-link">Docs</a>
          <a href="#" className="nav-link">Changelog</a>
        </nav>
        <div className="nav-right">
          <div className="lang">
            <button className="on">FR</button>
            <button>EN</button>
          </div>
          <a href="#" onClick={(e)=>{e.preventDefault(); go('dashboard');}} className="ghost">Se connecter</a>
          <a href="#" onClick={(e)=>{e.preventDefault(); go('landing');}} className="cta">Commencer <span className="arr">→</span></a>
        </div>
      </div>
    </header>
  );
}

function Footer({ go }) {
  const nav = (k) => (e) => { e.preventDefault(); go && go(k); };
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand foot-col">
            <div className="logo">ELYS</div>
            <p>Connectez n'importe quelle IA à n'importe quel logiciel web. Sans API, sans code, en deux minutes.</p>
            <div className="made">
              <span className="flag"><span className="b"></span><span className="w"></span><span className="r"></span></span>
              <span>Made in France</span>
            </div>
          </div>
          <div className="foot-col">
            <h4>Produit</h4>
            <ul>
              <li><a href="#" onClick={nav('landing')}>Connecteurs</a></li>
              <li><a href="#" onClick={nav('pricing')}>Tarifs</a></li>
              <li><a href="#" onClick={nav('docs')}>Documentation</a></li>
              <li><a href="#" onClick={nav('changelog')}>Changelog</a></li>
              <li><a href="#" onClick={nav('status')}>Status</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Société</h4>
            <ul>
              <li><a href="#" onClick={nav('about')}>À propos</a></li>
              <li><a href="#" onClick={nav('careers')}>Carrières</a></li>
              <li><a href="#" onClick={nav('contact')}>Contact</a></li>
              <li><a href="#" onClick={nav('security')}>Sécurité</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Légal</h4>
            <ul>
              <li><a href="#" onClick={nav('cgv')}>CGV</a></li>
              <li><a href="#" onClick={nav('privacy')}>Confidentialité</a></li>
              <li><a href="#" onClick={nav('legal')}>Mentions légales</a></li>
              <li><a href="#" onClick={nav('dpa')}>RGPD · DPA</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bot">
          <span>© 2026 ELYS · Camille Roussel · SIRET 932 481 207 00012</span>
          <span className="legal"><a href="#">Twitter / X</a><a href="#">LinkedIn</a><a href="#">GitHub</a></span>
        </div>
      </div>
    </footer>
  );
}

// Eyebrow + big title section header used across screens
function SectionHead({ eyebrow, title, lede }) {
  return (
    <div className="section-head">
      <div><div className="eyebrow">{eyebrow}</div></div>
      <div>
        <h2 className="display">{title}</h2>
        {lede && <p className="lede" style={{marginTop:18}}>{lede}</p>}
      </div>
    </div>
  );
}

// Page-level crumb / breadcrumb used on subpages
function Crumb({ items, go }) {
  return (
    <div className="crumb">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i>0 && <span className="sep">/</span>}
          {it.go
            ? <a href="#" onClick={(e)=>{e.preventDefault(); go(it.go);}}>{it.label}</a>
            : <span className="cur">{it.label}</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

Object.assign(window, { BrandIcon, LogoMark, ConnectorTile, Nav, Footer, SectionHead, Crumb });
