export function MisconfiguredEnv() {
  return (
    <div className="login-page">
      <div className="card" style={{ maxWidth: 520 }}>
        <h1 style={{ marginTop: 0, color: 'var(--rojo)' }}>Faltan variables de Supabase</h1>
        <p>
          Este sitio se compiló sin <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>{' '}
          válidas. Por eso la app no puede arrancar.
        </p>
        <div className="alert alert-info">
          <strong>En GitHub:</strong> Settings → Secrets and variables → Actions. Creá o corregí{' '}
          <code>VITE_SUPABASE_URL</code> (ej. <code>https://abcd.supabase.co</code>) y{' '}
          <code>VITE_SUPABASE_ANON_KEY</code>. Sin comillas ni espacios extra.
        </div>
        <p className="hint">
          Volvé a ejecutar el workflow <strong>Deploy GitHub Pages</strong> (Actions → Run workflow).
        </p>
        <p className="hint">
          Guía:{' '}
          <a href="https://github.com/RUGDRAIGER/Bomberos-de-R-o-Bueno/blob/main/docs/DEPLOY.md">
            docs/DEPLOY.md
          </a>
        </p>
      </div>
    </div>
  )
}
