import { db } from './firebase-config.js';
import { ref, set, push, get, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  const enrollBtn = document.getElementById("enroll-btn");
  const downloadBtn = document.getElementById("download-file");
  const countrySelect = document.getElementById("country");
  const manualCountryInput = document.getElementById("manual-country");
  const stats = document.getElementById("stats");

  countrySelect.addEventListener("change", () => {
    manualCountryInput.style.display = countrySelect.value === "other" ? "block" : "none";
  });

  enrollBtn.addEventListener("click", async () => {
    const phone = document.getElementById("phone-number").value.trim();
    const token = document.getElementById("token-input").value.trim();
    let country = countrySelect.value;
    if (country === "other") {
      country = manualCountryInput.value.trim();
    }
    if (!phone || !token || !country) return alert("Fill all fields");

    const tokenRef = ref(db, 'tokens/' + token);
    const snap = await get(tokenRef);
    if (!snap.exists()) return alert("Invalid token");

    const tokenData = snap.val();
    if (tokenData.used && tokenData.type === 'one-time') return alert("Token already used");

    const userRef = push(ref(db, 'users'));
    await set(userRef, { phone, country, time: Date.now() });
    if (tokenData.type === 'one-time') await update(tokenRef, { used: true });

    alert("✅ Enrolled successfully!");
    enrollBtn.disabled = true;
  });

  downloadBtn.addEventListener("click", async () => {
    let country = countrySelect.value;
    if (country === "other") country = manualCountryInput.value.trim();
    if (!country) return alert("Select or type a country");

    const fileRef = ref(db, 'files/' + country);
    const snap = await get(fileRef);
    if (!snap.exists()) return alert("No file available for this country yet");

    const url = snap.val().url;
    window.open(url, '_blank');
  });

  onValue(ref(db, 'users'), snap => {
    const data = snap.val();
    const total = data ? Object.keys(data).length : 0;
    stats.innerText = `🎉 ${total} people have enrolled — they can become your viewers & customers!`;
  });
});
