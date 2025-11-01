// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBlh428ba5aSFt6x2pPkVjeEk5D6AbIU7Y",
    authDomain: "kheemz-fb9b6.firebaseapp.com",
    databaseURL: "https://kheemz-fb9b6-default-rtdb.firebaseio.com",
    projectId: "kheemz-fb9b6",
    storageBucket: "kheemz-fb9b6.appspot.com",
    messagingSenderId: "593310501630",
    appId: "1:593310501630:web:c241a05e0d7c4a810173af"
};

// Game Settings Configuration
const gameSettings = {
    nigeria: {
        gamePrice: 100,
        dailyWinners: 10,
        winningTime: 5.00,
        difficulty: 'medium',
        giftCardPaymentUrl: '#',
        openGiveawayPrice: 2000,
        openGiveawayPaymentUrl: '#',
        fundWalletUrl: '#',
        affiliateCommission: 10,
        giveawayCashback: 15,
        currency: '₦'
    },
    other: {
        gamePrice: 0.5,
        dailyWinners: 10,
        winningTime: 5.00,
        difficulty: 'medium',
        giftCardPaymentUrl: '#',
        openGiveawayPrice: 3,
        openGiveawayPaymentUrl: '#',
        fundWalletUrl: '#',
        affiliateCommission: 10,
        giveawayCashback: 15,
        currency: 'USDT '
    }
};

// Social Settings Configuration
const socialSettings = {
    youtube: '',
    tiktok: '',
    twitter: '',
    facebook: '',
    instagram: ''
};

// Export configurations
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, gameSettings, socialSettings };
}
