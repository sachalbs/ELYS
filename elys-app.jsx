// ELYS · top-level router. Screen + slug stored in URL hash so reloads stick.
const { useState: useSt, useEffect: useEf } = React;

function parseHash() {
  const h = (window.location.hash || '#landing').slice(1);
  const [name, slug] = h.split('/');
  return { name: name || 'landing', slug: slug || 'pennylane' };
}

function App() {
  const [route, setRoute] = useSt(parseHash());

  useEf(() => {
    const sync = () => setRoute(parseHash());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const go = (next) => {
    if (typeof next === 'string') next = { name: next };
    const name = next.name || 'landing';
    const slug = next.slug || route.slug;
    window.location.hash = slug && (name === 'connector' || name === 'login' || name === 'ready')
      ? `${name}/${slug}` : name;
    window.scrollTo({ top: 0 });
  };

  useEf(() => { window.scrollTo({ top: 0 }); }, [route.name, route.slug]);

  const screens = {
    landing:   <ScreenLanding   go={go} />,
    connector: <ScreenConnector slug={route.slug} go={go} />,
    login:     <ScreenLogin     slug={route.slug} go={go} />,
    ready:     <ScreenReady     slug={route.slug} go={go} />,
    dashboard: <ScreenDashboard go={go} />,
    pricing:   <ScreenPricing   go={go} />,
    docs:      <ScreenDocs      go={go} />,
    changelog: <ScreenChangelog go={go} />,
    status:    <ScreenStatus    go={go} />,
    about:     <ScreenAbout     go={go} />,
    careers:   <ScreenCareers   go={go} />,
    contact:   <ScreenContact   go={go} />,
    security:  <ScreenSecurity  go={go} />,
    cgv:       <ScreenCGV       go={go} />,
    privacy:   <ScreenPrivacy   go={go} />,
    legal:     <ScreenLegal     go={go} />,
    dpa:       <ScreenDPA       go={go} />
  };

  return screens[route.name] || screens.landing;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
