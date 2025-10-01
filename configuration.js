const firebaseConfig = {
  apiKey: "AIzaSyBlh428ba5aSFt6x2pPkVjeEk5D6AbIU7Y",
  authDomain: "kheemz-fb9b6.firebaseapp.com",
  databaseURL: "https://kheemz-fb9b6-default-rtdb.firebaseio.com",
  projectId: "kheemz-fb9b6",
  storageBucket: "kheemz-fb9b6.appspot.com",
  messagingSenderId: "593310501630",
  appId: "1:593310501630:web:c241a05e0d7c4a810173af"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Enable offline persistence
db.enablePersistence().catch((err) => {
    console.error('Firebase persistence failed: ', err);
});

// App configuration
const APP_CONFIG = {
    version: '1.0.0',
    autoWelcomeMessage: "Hey thank you for subscribing, here is a free gift for you, tell me what's your name?",
    chat: {
        maxMessageLength: 500,
        enableNotifications: true,
        autoReplyDelay: 2000
    },
    subscription: {
        trialPeriod: 7, // days
        defaultExpiry: 30 // days
    }
};
