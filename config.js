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

// Game Configuration
const gameConfig = {
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

// Social Media Configuration
const socialConfig = {
    youtube: '',
    tiktok: '',
    twitter: '',
    facebook: '',
    instagram: ''
};

// Application Constants
const APP_CONSTANTS = {
    MAX_GIFTCARD_ATTEMPTS: 5,
    SIDEBAR_WIDTH: 250,
    HEADER_HEIGHT: 70,
    DEFAULT_GAME_PRICE: 100,
    DEFAULT_OPEN_GIVEAWAY_PRICE: 2000,
    AFFILIATE_COMMISSION_RATE: 0.1, // 10%
    GIVEAWAY_CASHBACK_RATE: 0.15, // 15%
    TRANSACTION_TYPES: {
        GAME_PLAY: 'Game Play',
        GAME_WIN: 'Game Win',
        GIFT_CARD_PURCHASE: 'Gift Card Purchase',
        GIFT_CARD_USAGE: 'Gift Card Usage',
        WALLET_FUNDING: 'Wallet Funding',
        GIVEAWAY_CREATION: 'Giveaway Creation',
        GIVEAWAY_CASHBACK: 'Giveaway Cashback',
        AFFILIATE_EARNINGS: 'Affiliate Earnings',
        WITHDRAWAL: 'Withdrawal',
        ADMIN_DEBIT: 'Admin Debit'
    },
    GIVEAWAY_TYPES: {
        OPEN: 'open',
        GIFTCARD: 'giftcard'
    },
    DIFFICULTY_LEVELS: {
        EASY: 'easy',
        MEDIUM: 'medium',
        HARD: 'hard'
    },
    GIFT_CARD_TYPES: {
        SINGLE: 'single',
        BULK: 'bulk',
        VENDOR: 'vendor'
    },
    COUNTRIES: {
        NIGERIA: 'nigeria',
        OTHER: 'other'
    },
    PAYMENT_METHODS: {
        BANK: 'bank',
        CRYPTO: 'crypto'
    },
    TRANSACTION_STATUS: {
        PENDING: 'pending',
        COMPLETED: 'completed',
        DECLINED: 'declined'
    },
    WITHDRAWAL_STATUS: {
        PENDING: 'pending',
        APPROVED: 'approved',
        DECLINED: 'declined'
    },
    CONVERSATION_STATUS: {
        OPEN: 'open',
        SETTLED: 'settled'
    },
    USER_ROLES: {
        ADMIN: 'admin',
        CUSTOMER_CARE: 'customer_care',
        AFFILIATE: 'affiliate',
        USER: 'user'
    },
    VERIFICATION_TYPES: {
        NONE: 'none',
        BLUE: 'blue',
        GOLD: 'gold'
    }
};

// Feature Flags
const FEATURE_FLAGS = {
    ENABLE_GIVEAWAY_HUNT: true,
    ENABLE_AFFILIATE_SYSTEM: true,
    ENABLE_CUSTOMER_CARE: true,
    ENABLE_GIFT_CARDS: true,
    ENABLE_WITHDRAWALS: true,
    ENABLE_SOCIAL_TASKS: true,
    ENABLE_USER_VERIFICATION: true,
    ENABLE_ADMIN_PANEL: true,
    ENABLE_SHOP: true
};

// UI Configuration
const UIConfig = {
    colors: {
        primary: '#4361ee',
        secondary: '#3f37c9',
        success: '#4cc9f0',
        danger: '#f72585',
        warning: '#f8961e',
        info: '#4895ef',
        light: '#f8f9fa',
        dark: '#212529'
    },
    breakpoints: {
        mobile: 480,
        tablet: 900,
        desktop: 1200
    },
    animations: {
        duration: {
            short: 300,
            medium: 500,
            long: 1000
        },
        easing: 'ease-in-out'
    },
    notifications: {
        position: 'top-right',
        duration: 5000,
        types: {
            SUCCESS: 'success',
            WARNING: 'warning',
            ERROR: 'error',
            INFO: 'info'
        }
    }
};

// Initialize configuration
console.log('Firebase Configuration Loaded');
console.log('Game Configuration Loaded');
console.log('Application Constants Loaded');
console.log('Feature Flags Loaded');
console.log('UI Configuration Loaded');

// Export configuration for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        firebaseConfig,
        gameConfig,
        socialConfig,
        APP_CONSTANTS,
        FEATURE_FLAGS,
        UIConfig
    };
}
