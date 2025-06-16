// admin.js
import { db } from './firebase-config.js';
import {
  ref,
  set,
  push,
  get,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

window.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generate-token');
  const tokenType = document.getElementById('token-type');
  const tokenDisplay = document.getElementById('generated-token');
  const tokenList = document.getElementById('token-list');
  const tokenFilter = document.getElementById('token-filter');
  const userList = document.getElementById('user-list');
  const userFilter = document.getElementById('user-country-filter');
  const fileInput = document.getElementById('country-file');
  const fileCountry = document.getElementById('file-country');
  const uploadBtn = document.getElementById('upload-file');
  const sendNotifBtn = document.getElementById('send-notification');
  const notifText = document.getElementById('notification-text');

  generateBtn.addEventListener('click', async () => {
    const type = tokenType.value;
    const token = [...crypto.getRandomValues(new Uint8Array(12))].map(b => b.toString(16)).join('');
    await set(ref(db, `tokens/${token}`), { used: false, type });
    tokenDisplay.innerText = `Token: ${token}`;
    loadTokens();
  });

  function loadTokens() {
    onValue(ref(db, 'tokens'), snapshot => {
      tokenList.innerHTML = '';
      const filter = tokenFilter.value;
      snapshot.forEach(child => {
        const token = child.key;
        const data = child.val();
        if (filter === 'used' && !data.used) return;
        if (filter === 'unused' && data.used) return;
        const li = document.createElement('li');
        li.textContent = `${token} (${data.type}) - ${data.used ? 'Used' : 'Unused'}`;
        tokenList.appendChild(li);
      });
    });
  }

  tokenFilter.addEventListener('change', loadTokens);
  loadTokens();

  function loadUsers() {
    onValue(ref(db, 'enrolled'), snapshot => {
      userList.innerHTML = '';
      const filter = userFilter.value;
      snapshot.forEach(child => {
        const user = child.val();
        if (filter !== 'all' && user.country !== filter) return;
        const li = document.createElement('li');
        li.textContent = `${user.phone} (${user.country}) - Token: ${user.token}`;
        userList.appendChild(li);
      });
    });
  }

  userFilter.addEventListener('change', loadUsers);
  loadUsers();

  uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    const country = fileCountry.value.trim();
    if (!file || !country) return alert('Fill all fields');

    const url = URL.createObjectURL(file); // simulate upload
    await set(ref(db, `files/${country}`), { url });
    alert('File uploaded for ' + country);
  });

  sendNotifBtn.addEventListener('click', async () => {
    const message = notifText.value.trim();
    if (!message) return alert('Write a message');
    const id = push(ref(db, 'notifications')).key;
    await set(ref(db, `notifications/${id}`), { message, timestamp: Date.now() });
    alert('Notification sent');
    notifText.value = '';
  });

  // Optional: Delete notifications from admin
  onValue(ref(db, 'notifications'), snap => {
    const notifArea = document.getElementById('notification-management');
    if (!notifArea) return;
    notifArea.innerHTML = '';
    snap.forEach(child => {
      const msg = child.val();
      const p = document.createElement('p');
      p.textContent = msg.message;
      const del = document.createElement('button');
      del.textContent = 'Delete';
      del.onclick = () => {
        remove(ref(db, `notifications/${child.key}`));
      };
      p.appendChild(del);
      notifArea.appendChild(p);
    });
  });
});
