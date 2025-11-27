// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBlh428ba5aSFt6x2pPkVjeEk5D6AbIU7Y",
    authDomain: "kheemz-fb9b6.firebaseapp.com",
    projectId: "kheemz-fb9b6",
    storageBucket: "kheemz-fb9b6.firebasestorage.app",
    messagingSenderId: "593310501630",
    appId: "1:593310501630:web:c241a05e0d7c4a810173af",
    measurementId: "G-Q50WK6G76P"
};

// Agora Configuration
const agoraConfig = {
    appId: "974f4c7b124940a1a6ee5e526175118d",
    audioProfile: "music_high_quality_stereo",
    audioScenario: "game_streaming"
};

// App Configuration
const appConfig = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxRecordingTime: 300, // 5 minutes
    freeMessages: 3,
    supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif'],
    version: '1.0.0',
    
    // Pricing defaults
    defaultPricing: {
        text: 10,
        voice: 30,
        image: 15
    },
    
    // Performance settings
    batchSize: 50,
    debounceTime: 100,
    cacheTTL: 300000 // 5 minutes
};

// Export configurations for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, agoraConfig, appConfig };
}
