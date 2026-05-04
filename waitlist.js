import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js';

// SUBSTITUA pela apiKey do Firebase Console → Configurações do projeto → Seu app Web
const firebaseConfig = {
  apiKey: 'COLE_AQUI_SUA_API_KEY',
  authDomain: 'studio-4300165937-32d56.firebaseapp.com',
  projectId: 'studio-4300165937-32d56',
};

let db;

function getDb() {
  if (!db) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
}

const form = document.getElementById('waitlistForm');
const successEl = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('formName')?.value.trim() ?? '';
    const email = document.getElementById('formEmail')?.value.trim() ?? '';
    const brewery = document.getElementById('formBrewery')?.value.trim() ?? '';

    if (!name || !email || !brewery) {
      alert('Preencha nome, email e nome da cervejaria.');
      return;
    }

    try {
      await addDoc(collection(getDb(), 'waitlist'), {
        name,
        email,
        brewery,
        createdAt: serverTimestamp(),
        source: 'landing-page',
      });
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { currency: 'BRL', value: 1 });
      }
      form.style.display = 'none';
      if (successEl) successEl.style.display = 'flex';
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar. Tente novamente.');
    }
  });
}
