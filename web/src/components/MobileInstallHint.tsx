/**
 * Enlaces para usar la POF como app en el celular (PWA + APK opcional).
 * La URL base es la misma del sitio desplegado o del servidor de desarrollo.
 */
export function MobileInstallHint() {
  const apkUrl = import.meta.env.VITE_ANDROID_APK_URL?.trim()
  const iosUrl = import.meta.env.VITE_IOS_APP_URL?.trim()

  const base = import.meta.env.BASE_URL || '/'
  const rootPath = base.endsWith('/') ? base : `${base}/`
  const appRoot =
    typeof window !== 'undefined' ? `${window.location.origin}${rootPath}` : ''

  return (
    <div className="login-mobile-panel">
      <h2 className="login-mobile-title">App en el celular</h2>
      <p className="hint login-mobile-lead">
        La aplicación es una <strong>PWA</strong>: no hace falta Play Store ni App Store para probarla.
        Abrí el enlace en el navegador del teléfono e instalá desde el menú del navegador.
      </p>
      {appRoot ? (
        <div className="login-mobile-actions">
          <a className="btn btn-secondary" href={appRoot}>
            Abrir POF (entrada principal — para instalar)
          </a>
          <ul className="login-mobile-steps">
            <li>
              <strong>Android:</strong> Chrome → menú (⋮) → <em>Instalar aplicación</em> o{' '}
              <em>Agregar a la pantalla principal</em>.
            </li>
            <li>
              <strong>iPhone / iPad:</strong> Safari → botón compartir →{' '}
              <em>Agregar a inicio</em> (si ves otro navegador, abrí esta misma dirección en Safari).
            </li>
          </ul>
          {apkUrl ? (
            <a className="btn btn-ghost login-apk-link" href={apkUrl} target="_blank" rel="noopener noreferrer">
              Descargar APK (Android)
            </a>
          ) : null}
          {iosUrl ? (
            <a className="btn btn-ghost" href={iosUrl} target="_blank" rel="noopener noreferrer">
              Abrir en App Store / TestFlight (iOS)
            </a>
          ) : (
            <p className="hint login-ios-note">
              <strong>iOS:</strong> no hay instalador tipo APK; la forma habitual es la PWA con Safari arriba.
              Si más adelante hay app en App Store, el enlace se puede configurar con{' '}
              <code>VITE_IOS_APP_URL</code>.
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
