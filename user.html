<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>User Dashboard</title>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js"></script>
  <script src="configuration.js"></script>
  <style>
    body { font-family: Arial; margin:0; background:#f7f7f7; }
    nav { background:#333; color:#fff; padding:10px; }
    nav .logout { float:right; cursor:pointer; }
    nav a { color:#fff; margin-right:10px; cursor:pointer; }
    section { display:none; padding:20px; }
    section.active { display:block; }
    .card { background:#fff; padding:15px; margin:10px 0; border-radius:5px; box-shadow:0 0 5px rgba(0,0,0,0.1); }
    table { width:100%; border-collapse: collapse; background:#fff; }
    th, td { padding:8px; border:1px solid #ddd; text-align:left; }
    input, select, button { margin:5px 0; padding:5px; }
  </style>
</head>
<body>
  <nav>
    User Dashboard
    <span class="logout" id="logout">Logout</span>
    <div>
      <a data-tab="dashboard">Dashboard</a>
      <a data-tab="referrals">Referrals</a>
      <a data-tab="withdrawals">Withdrawals</a>
      <a data-tab="account">Account</a>
    </div>
  </nav>

  <section id="dashboard" class="active">
    <h3>Account Summary</h3>
    <div class="card" id="accountSummary">Loading...</div>

    <h3>Enrollment</h3>
    <div id="enrollmentSection">
      <input type="text" id="whatsappNumber" placeholder="WhatsApp Number">
      <input type="text" id="enrollToken" placeholder="Enrollment Token">
      <button id="enrollBtn">Enroll</button>
    </div>

    <h3>Announcements</h3>
    <div class="card" id="announcement">Loading...</div>

    <h3>Training Video</h3>
    <div id="videoContainer"></div>

    <h3>Resources</h3>
    <div id="resourcesList"></div>
  </section>

  <section id="referrals">
    <h3>Referral Program</h3>
    <div class="card" id="referralLink">Loading...</div>
    <h4>Referrals</h4>
    <table>
      <thead><tr><th>Email</th><th>Status</th><th>Date</th></tr></thead>
      <tbody id="referralsTable"></tbody>
    </table>
  </section>

  <section id="withdrawals">
    <h3>Request Withdrawal</h3>
    <input type="number" id="withdrawAmount" placeholder="Amount ($20 min)">
    <select id="paymentMethod">
      <option value="paypal">PayPal</option>
      <option value="bank">Bank Transfer</option>
    </select>
    <input type="text" id="paymentDetails" placeholder="Payment Details">
    <button id="requestWithdrawal">Request</button>

    <h4>Withdrawal History</h4>
    <table>
      <thead><tr><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
      <tbody id="withdrawalsTable"></tbody>
    </table>
  </section>

  <section id="account">
    <h3>Profile</h3>
    <input type="text" id="profileName" placeholder="Name">
    <input type="text" id="profilePhone" placeholder="Phone">
    <button id="saveProfile">Save</button>

    <h3>Security</h3>
    <label>2FA:
      <select id="toggle2FA">
        <option value="no">Disabled</option>
        <option value="yes">Enabled</option>
      </select>
    </label>
    <button id="saveSecurity">Save Security Settings</button>

    <h3>Change Password</h3>
    <input type="password" id="newPassword" placeholder="New Password">
    <button id="changePassword">Change Password</button>
  </section>

  <script>
    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();

    let currentUserId = "";
    auth.onAuthStateChanged(async user => {
      if (!user) {
        window.location.href = "index.html";
      } else {
        currentUserId = user.uid;
        const userDoc = await db.collection("users").doc(user.uid).get();
        const userData = userDoc.data() || {};
        loadAccountSummary(userData);
        loadAnnouncement();
        loadVideo();
        loadResources();
        loadReferrals();
        loadWithdrawals();
        fillProfile(userData);
      }
    });

    document.getElementById("logout").addEventListener("click",()=>auth.signOut());

    document.querySelectorAll("nav a").forEach(link=>{
      link.addEventListener("click",()=>{
        document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
        document.getElementById(link.dataset.tab).classList.add("active");
      });
    });

    function loadAccountSummary(data){
      document.getElementById("accountSummary").innerHTML=`
        <div><strong>Email:</strong> ${data.email||""}</div>
        <div><strong>Balance:</strong> $${data.earnings||0}</div>
        <div><strong>Referrals:</strong> ${data.referrals?.length||0}</div>
        <div><strong>Status:</strong> ${data.status||"active"}</div>
      `;
      if(!data.enrolled){
        document.getElementById("enrollmentSection").style.display="block";
      }else{
        document.getElementById("enrollmentSection").style.display="none";
      }
    }

    document.getElementById("enrollBtn").addEventListener("click",async()=>{
      const token = document.getElementById("enrollToken").value.trim();
      const whatsapp = document.getElementById("whatsappNumber").value.trim();
      if(!token||!whatsapp){ alert("Fill all fields."); return; }
      const tokenSnap=await db.collection("tokens").where("token","==",token).where("status","==","active").limit(1).get();
      if(tokenSnap.empty){ alert("Invalid or used token."); return; }
      const tokenDoc=tokenSnap.docs[0];
      await db.collection("users").doc(currentUserId).update({
        enrolled:true,
        whatsapp,
        enrollmentDate:firebase.firestore.FieldValue.serverTimestamp()
      });
      if(tokenDoc.data().type==="one-time"){
        await db.collection("tokens").doc(tokenDoc.id).update({status:"used"});
      }
      await db.collection("activities").add({
        message:`User enrolled: ${currentUserId}`,
        createdAt:firebase.firestore.FieldValue.serverTimestamp()
      });
      alert("Enrollment successful.");
      window.location.reload();
    });

    async function loadAnnouncement(){
      const doc=await db.collection("content").doc("main").get();
      document.getElementById("announcement").innerText=doc.data()?.announcement||"No announcements.";
    }

    async function loadVideo(){
      const doc=await db.collection("content").doc("main").get();
      const url=doc.data()?.video||"";
      document.getElementById("videoContainer").innerHTML=url?`<iframe width="100%" height="315" src="${url}" frameborder="0" allowfullscreen></iframe>`:"";
    }

    async function loadResources(){
      const snap=await db.collection("files").orderBy("uploadedAt","desc").get();
      const div=document.getElementById("resourcesList");
      div.innerHTML="<ul>";
      snap.forEach(doc=>{
        const d=doc.data();
        div.innerHTML+=`<li><a href="${d.url}" target="_blank">${d.name}</a></li>`;
      });
      div.innerHTML+="</ul>";
    }

    async function loadReferrals(){
      const userDoc=await db.collection("users").doc(currentUserId).get();
      const referrals=userDoc.data()?.referrals||[];
      document.getElementById("referralLink").innerText=`Your link: https://yourdomain.com?ref=${currentUserId}`;
      const tbody=document.getElementById("referralsTable");
      tbody.innerHTML="";
      if(referrals.length){
        for(const refId of referrals){
          const rDoc=await db.collection("users").doc(refId).get();
          const r=rDoc.data()||{};
          tbody.innerHTML+=`<tr><td>${r.email||""}</td><td>${r.status||""}</td><td>${r.createdAt?.toDate().toLocaleDateString()||""}</td></tr>`;
        }
      }else{
        tbody.innerHTML="<tr><td colspan=3>No referrals.</td></tr>";
      }
    }
    // Withdrawals
    async function loadWithdrawals(){
      const snap=await db.collection("withdrawals").where("user","==",currentUserId).orderBy("createdAt","desc").get();
      const tbody=document.getElementById("withdrawalsTable");
      tbody.innerHTML="";
      snap.forEach(doc=>{
        const d=doc.data();
        tbody.innerHTML+=`<tr>
          <td>$${d.amount||0}</td>
          <td>${d.status||""}</td>
          <td>${d.createdAt?.toDate().toLocaleDateString()}</td>
        </tr>`;
      });
      if(snap.empty){tbody.innerHTML="<tr><td colspan=3>No withdrawals.</td></tr>";}
    }

    document.getElementById("requestWithdrawal").addEventListener("click",async()=>{
      const amt=parseFloat(document.getElementById("withdrawAmount").value);
      const method=document.getElementById("paymentMethod").value;
      const details=document.getElementById("paymentDetails").value.trim();
      if(isNaN(amt)||amt<20){alert("Minimum $20.");return;}
      const uDoc=await db.collection("users").doc(currentUserId).get();
      const bal=uDoc.data()?.earnings||0;
      if(amt>bal){alert("Insufficient balance.");return;}
      await db.collection("withdrawals").add({
        user:currentUserId,
        amount:amt,
        status:"pending",
        method,
        details,
        createdAt:firebase.firestore.FieldValue.serverTimestamp()
      });
      await db.collection("users").doc(currentUserId).update({
        earnings:firebase.firestore.FieldValue.increment(-amt)
      });
      await db.collection("activities").add({
        message:`Withdrawal requested by ${currentUserId}.`,
        createdAt:firebase.firestore.FieldValue.serverTimestamp()
      });
      alert("Withdrawal requested.");
      loadWithdrawals();
    });

    // Profile
    function fillProfile(data){
      document.getElementById("profileName").value=data.name||"";
      document.getElementById("profilePhone").value=data.phone||"";
      document.getElementById("toggle2FA").value=data.require2FA||"no";
    }

    document.getElementById("saveProfile").addEventListener("click",async()=>{
      await db.collection("users").doc(currentUserId).update({
        name:document.getElementById("profileName").value,
        phone:document.getElementById("profilePhone").value
      });
      alert("Profile updated.");
    });

    document.getElementById("saveSecurity").addEventListener("click",async()=>{
      await db.collection("users").doc(currentUserId).update({
        require2FA:document.getElementById("toggle2FA").value
      });
      alert("Security settings updated.");
    });

    document.getElementById("changePassword").addEventListener("click",()=>{
      const newPass=document.getElementById("newPassword").value;
      if(newPass.length<6){alert("Min 6 chars.");return;}
      auth.currentUser.updatePassword(newPass).then(()=>{
        alert("Password changed.");
      }).catch(err=>{
        alert("Error: "+err.message);
      });
    });
  </script>
</body>
</html>
