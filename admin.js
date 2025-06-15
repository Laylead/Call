import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue, set, push, update, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import firebaseConfig from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function generateSecureToken() {
  return "TK-" + crypto.randomUUID() + "-" + Math.floor(Math.random() * 9999);
}

function addTokenToDB(token, isSingleUse) {
  set(ref(db, 'tokens/' + token), {
    active: true,
    singleUse: isSingleUse
  }).then(() => loadTokens());
}

document.getElementById('generate-token').addEventListener('click', () => {
  addTokenToDB(generateSecureToken(), false);
});

document.getElementById('generate-once').addEventListener('click', () => {
  addTokenToDB(generateSecureToken(), true);
});

function loadTokens() {
  const tokenList = document.getElementById('token-list');
  onValue(ref(db, 'tokens'), (snap) => {
    tokenList.innerHTML = '';
    if (snap.exists()) {
      Object.entries(snap.val()).forEach(([token, data]) => {
        tokenList.innerHTML += `<li>${token} - ${data.active ? '✅ Active' : '❌ Used'} (${data.singleUse ? 'One-Time' : 'Multi'})</li>`;
      });
    }
  });
}
loadTokens();

document.getElementById('filter-country').addEventListener('change', loadUsers);
function loadUsers() {
  const selected = document.getElementById('filter-country').value;
  const userList = document.getElementById('user-list');
  onValue(ref(db, 'enrolled'), (snapshot) => {
    userList.innerHTML = '';
    if (snapshot.exists()) {
      Object.values(snapshot.val()).forEach(entry => {
        if (selected === 'All' || entry.country === selected) {
          userList.innerHTML += `<li>${entry.number} | ${entry.country} | Token: ${entry.token}</li>`;
        }
      });
    }
  });
}
loadUsers();

document.getElementById('upload-file-btn').addEventListener('click', () => {
  const country = document.getElementById('upload-country').value;
  const url = document.getElementById('file-link').value.trim();
  if (!url) return alert("Paste a valid file URL");
  set(ref(db, 'files/' + country), { url }).then(() => {
    document.getElementById('upload-msg').innerText = "File uploaded.";
  });
});

document.getElementById('send-notif').addEventListener('click', () => {
  const msg = document.getElementById('notif-msg').value.trim();
  if (!msg) return alert("Type a message");
  set(ref(db, 'notifications/global'), {
    message: msg,
    timestamp: Date.now()
  }).then(() => {
    document.getElementById('notif-status').innerText = "Notification sent!";
  });
});

