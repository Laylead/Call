import { db } from './firebase-config.js';
import { ref, push, set, onValue, get, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  const genBtn = document.getElementById("generate-token");
  const genOutput = document.getElementById("generated-token");
  const tokenType = document.getElementById("token-type");
  const tokenList = document.getElementById("token-list");
  const tokenFilter = document.getElementById("token-filter");

  const userList = document.getElementById("user-list");
  const userFilter = document.getElementById("user-country-filter");

  const uploadBtn = document.getElementById("upload-file");
  const fileInput = document.getElementById("country-file");
  const fileCountry = document.getElementById("file-country");

  const notifyBtn = document.getElementById("send-notification");
  const notifyText = document.getElementById("notification-text");

  genBtn.onclick = () => {
    const token = Math.random().toString(36).slice(2, 12);
    const type = tokenType.value;
    const tokenRef = ref(db, 'tokens/' + token);
    set(tokenRef, { used: false, type });
    genOutput.innerText = `✅ Token: ${token}`;
  };

  function refreshTokens() {
    onValue(ref(db, 'tokens'), snap => {
      const data = snap.val() || {};
      tokenList.innerHTML = "";
      Object.entries(data).forEach(([key, val]) => {
        if (tokenFilter.value === "used" && !val.used) return;
        if (tokenFilter.value === "unused" && val.used) return;
        const li = document.createElement("li");
        li.innerText = `${key} (${val.type}) ${val.used ? '✅' : '❌'}`;
        tokenList.appendChild(li);
      });
    });
  }

  function refreshUsers() {
    onValue(ref(db, 'users'), snap => {
      const data = snap.val() || {};
      userList.innerHTML = "";
      Object.entries(data).forEach(([key, val]) => {
        if (userFilter.value !== "all" && val.country !== userFilter.value) return;
        const li = document.createElement("li");
        li.innerText = `${val.phone} (${val.country})`;
        userList.appendChild(li);
      });
    });
  }

  tokenFilter.onchange = refreshTokens;
  userFilter.onchange = refreshUsers;

  uploadBtn.onclick = async () => {
    const file = fileInput.files[0];
    const country = fileCountry.value.trim();
    if (!file || !country) return alert("Provide both file and country name");

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result;
      await set(ref(db, 'files/' + country), { url: base64 });
      alert("✅ File uploaded!");
    };
    reader.readAsDataURL(file);
  };

  notifyBtn.onclick = () => {
    const msg = notifyText.value.trim();
    if (!msg) return alert("Enter a message");
    const notifyRef = push(ref(db, 'notifications'));
    set(notifyRef, { msg, time: Date.now() });
    alert("✅ Notification sent!");
  };

  refreshTokens();
  refreshUsers();
});
