/**
 * BrewControl — configuração do site (Analytics + Firebase)
 *
 * 1) GA4: [Google Analytics](https://analytics.google.com/) → Admin → Data streams → Web → copie o "Measurement ID" (G-XXXX).
 * 2) Firebase: [Console](https://console.firebase.google.com/) → criar projeto → engrenagem → Configurações do projeto → Seus apps → Web → copie o objeto firebaseConfig.
 * 3) Firestore: no mesmo projeto, ative Firestore (modo de produção) e publique as regras do arquivo firestore.rules (aba Regras).
 */
window.BREWCONTROL_SITE = {
  ga4MeasurementId: '',

  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  },
};

(function initGA4() {
  var id = window.BREWCONTROL_SITE && window.BREWCONTROL_SITE.ga4MeasurementId;
  if (!id || typeof id !== 'string' || id.indexOf('G-') !== 0) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);

  window.gtag('js', new Date());
  window.gtag('config', id);
})();
