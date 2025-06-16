// script.js
import { db } from './firebase-config.js';
import {
  ref,
  set,
  get,
  onValue,
  child
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

window.addEventListener('DOMContentLoaded', () => {
  const enrollBtn = document.getElementById('enroll-btn');
  const buyBtn = document.getElementById('buy-token');
  const phoneInput = document.getElementById('phone-number');
  const tokenInput = document.getElementById('token-input');
  const countrySelect = document.getElementById('country');
  const manualInput = document.getElementById('manual-country');
  const stats = document.getElementById('stats');
  const downloadBtn = document.getElementById('download-file');

  const userDashboard = document.createElement('div');
  userDashboard.id = "user-dashboard";
  userDashboard.innerHTML = `
    <h3>✅ You're Enrolled!</h3>
    <p>Wait for others to save your number too.</p>
    <div id="latest-notification"></div>
  `;

  countrySelect.addEventListener('change', () => {
    manualInput.style.display = countrySelect.value === 'other' ? 'block' : 'none';
  });

  enrollBtn.addEventListener('click', async () => {
    const phone = phoneInput.value.trim();
    const token = tokenInput.value.trim();
    const country = countrySelect.value === 'other' ? manualInput.value.trim() : countrySelect.value;

    if (!phone || !token || !country) return alert("Please fill all fields");

    const tokenSnap = await get(ref(db, 'tokens/' + token));
    if (!tokenSnap.exists()) return alert("Invalid token");

    const tokenData = tokenSnap.val();
    if (tokenData.used && tokenData.type === 'one-time') return alert("Token already used");

    const userRef = ref(db, 'enrolled/' + phone);
    await set(userRef, { phone, country, token });

    if (tokenData.type === 'one-time') {
      await set(ref(db, 'tokens/' + token + '/used'), true);
    }

    document.querySelector('.container').innerHTML = '';
    document.body.appendChild(userDashboard);
    loadNotification();
  });

  buyBtn.addEventListener('click', () => {
    window.location.href = 'https://wa.me/2349012345678?text=I%20want%20to%20buy%20activation%20token';
  });

  downloadBtn.addEventListener('click', async () => {
    const country = countrySelect.value === 'other' ? manualInput.value.trim() : countrySelect.value;
    const fileSnap = await get(ref(db, 'files/' + country));
    if (!fileSnap.exists()) return alert('Contact file not yet available, please wait.');
    const { url } = fileSnap.val();
    window.open(url, '_blank');
  });

  function loadNotification() {
    onValue(ref(db, 'notifications'), snap => {
      let latest = null;
      snap.forEach(child => {
        const msg = child.val();
        if (!latest || msg.timestamp > latest.timestamp) {
          latest = msg;
        }
      });
      if (latest) {
        const notif = document.getElementById('latest-notification');
        notif.innerHTML = `
          <p><strong>📢 Message from Admin:</strong> ${latest.message}</p>
        `;
      }
    });
  }
});
