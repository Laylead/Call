import { db } from './firebase-config.js';
import { ref, set, get, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
  const enrollBtn = document.getElementById('enroll-btn');
  const phoneInput = document.getElementById('phone-number');
  const tokenInput = document.getElementById('token-input');
  const countrySelect = document.getElementById('country');
  const manualInput = document.getElementById('manual-country');
  const downloadBtn = document.getElementById('download-file');

  countrySelect.addEventListener('change', () => {
    manualInput.style.display = countrySelect.value === 'other' ? 'block' : 'none';
  });

  enrollBtn.addEventListener('click', async () => {
    const phone = phoneInput.value.trim();
    const token = tokenInput.value.trim();
    const country = countrySelect.value === 'other' ? manualInput.value.trim() : countrySelect.value;

    if (!phone || !token || !country) return alert('Please fill all fields');

    const tokenRef = ref(db, `tokens/${token}`);
    const tokenSnap = await get(tokenRef);

    if (!tokenSnap.exists()) return alert('Invalid or expired token');

    const tokenData = tokenSnap.val();
    if (tokenData.used && tokenData.type === 'one-time') return alert('Token already used');

    const userId = push(ref(db, 'enrolled')).key;
    await set(ref(db, `enrolled/${userId}`), {
      phone,
      country,
      token,
      timestamp: Date.now()
    });

    if (tokenData.type === 'one-time') {
      await set(tokenRef, { ...tokenData, used: true });
    }

    alert('Enrollment successful!');
  });

  downloadBtn.addEventListener('click', async () => {
    const country = countrySelect.value === 'other' ? manualInput.value.trim() : countrySelect.value;
    const fileRef = ref(db, `files/${country}`);
    const fileSnap = await get(fileRef);
    if (!fileSnap.exists()) return alert('Contact file not yet available, please wait.');
    window.open(fileSnap.val().url, '_blank');
  });
});
