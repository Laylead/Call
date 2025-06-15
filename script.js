import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import firebaseConfig from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const enrollBtn = document.getElementById('enroll-btn');
enrollBtn.addEventListener('click', async () => {
  const number = document.getElementById('phone-number').value.trim();
  const token = document.getElementById('token-input').value.trim();
  const country = document.getElementById('country').value === 'other'
    ? document.getElementById('manual-country').value.trim()
    : document.getElementById('country').value;

  const snap = await get(ref(db, 'tokens/' + token));
  if (!snap.exists() || !snap.val().active) return alert('Invalid or used token');

  // One-time token logic
  if (snap.val().singleUse) await update(ref(db, 'tokens/' + token), { active: false });

  const id = Date.now();
  await set(ref(db, 'enrolled/' + id), { number, country, token });
  alert('You are now enrolled!');
});

onValue(ref(db, 'notifications/global'), (snapshot) => {
  if (snapshot.exists()) alert("📣 ADMIN MESSAGE:\n" + snapshot.val().message);
});

document.getElementById('country').addEventListener('change', () => {
  const manual = document.getElementById('manual-country');
  manual.style.display = document.getElementById('country').value === 'other' ? 'block' : 'none';
});

document.getElementById('download-file').addEventListener('click', async () => {
  const selected = document.getElementById('country').value;
  const fileSnap = await get(ref(db, 'files/' + selected));
  if (fileSnap.exists()) window.open(fileSnap.val().url, '_blank');
  else alert('Contact file not yet available, please wait.');
});
