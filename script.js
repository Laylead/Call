// Firebase configuration - This will be initialized from config.js
let firebaseConfig;
let db, auth;

// Game variables
let timerInterval;
let startTime;
let currentTime = 0;
let isRunning = false;
let gamesPlayed = 0;
let bestTime = 0;
let walletBalance = 0;
let giftCardBalance = 0;
let giveawayCashbackBalance = 0;
let user = null;
let isAdmin = false;
let isAffiliate = false;
let isCustomerCare = false;
let currentGiveaway = null;
let activeGiftCard = null;
let affiliateEarnings = 0;
let affiliateBalance = 0;
let referredUsers = 0;
let activeLinks = 0;
let selectedUserId = null;
let userCountry = 'nigeria';
let adminCurrentCountry = 'nigeria';
let failedGiftCardAttempts = 0;
const MAX_GIFTCARD_ATTEMPTS = 5;

// Initialize with default config first
let gameSettings = {
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

let socialSettings = {};

// DOM elements
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const payGameBtn = document.getElementById('payGameBtn');
const gamesPlayedEl = document.getElementById('gamesPlayed');
const bestTimeEl = document.getElementById('bestTime');
const walletBalanceEl = document.getElementById('walletBalance');
const giftCardBalanceEl = document.getElementById('giftCardBalance');
const giveawayCashbackBalanceEl = document.getElementById('giveawayCashbackBalance');
const transactionTable = document.getElementById('transactionTable');
const transactionFilter = document.getElementById('transactionFilter');
const transactionToggle = document.getElementById('transactionToggle');
const transactionDropdown = document.getElementById('transactionDropdown');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const fundWalletBtn = document.getElementById('fundWalletBtn');
const generateGiftCardBtn = document.getElementById('generateGiftCardBtn');
const customerCareBtn = document.getElementById('customerCareBtn');
const adminSection = document.getElementById('adminSection');
const manageUsersBtn = document.getElementById('manageUsersBtn');
const viewMessagesBtn = document.getElementById('viewMessagesBtn');
const manageGiftCardsBtn = document.getElementById('manageGiftCardsBtn');
const generateVendorCardBtn = document.getElementById('generateVendorCardBtn');
const assignCardBtn = document.getElementById('assignCardBtn');
const gameSettingsBtn = document.getElementById('gameSettingsBtn');
const socialSettingsBtn = document.getElementById('socialSettingsBtn');
const withdrawalRequestsBtn = document.getElementById('withdrawalRequestsBtn');
const pendingTransactionsBtn = document.getElementById('pendingTransactionsBtn');
const validateGiftcardBtn = document.getElementById('validateGiftcardBtn');
const giftcardCodeInput = document.getElementById('giftcardCode');
const pasteGiftCardBtn = document.getElementById('pasteGiftCardBtn');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const sidebarMenu = document.getElementById('sidebarMenu');
const contentSections = document.querySelectorAll('.content-section');
const paymentMethod = document.getElementById('paymentMethod');
const cryptoDetails = document.getElementById('cryptoDetails');
const paymentLink = document.getElementById('paymentLink');
const fundWalletLink = document.getElementById('fundWalletLink');
const iHaveFundedBtn = document.getElementById('iHaveFundedBtn');
const fundWalletDropdown = document.getElementById('fundWalletDropdown');
const searchUsers = document.getElementById('searchUsers');
const shopGiftCardBtn = document.getElementById('shopGiftCardBtn');
const premiumBtn = document.getElementById('premiumBtn');
const merchandiseBtn = document.getElementById('merchandiseBtn');
const targetTimeDisplay = document.getElementById('targetTimeDisplay');
const targetTimeValue = document.getElementById('targetTimeValue');
const successAnimation = document.getElementById('successAnimation');
const giftcardInfo = document.getElementById('giftcardInfo');
const activeCardCode = document.getElementById('activeCardCode');
const giftcardBalance = document.getElementById('giftcardBalance');
const giveawayTypeSelect = document.getElementById('giveawayTypeSelect');
const giveawayTypeInput = document.getElementById('giveawayType');
const giftcardGiveawayFields = document.getElementById('giftcardGiveawayFields');
const openGiveawayInfo = document.getElementById('openGiveawayInfo');
const giftcardGiveawayInfo = document.getElementById('giftcardGiveawayInfo');
const requestWithdrawalBtn = document.getElementById('requestWithdrawalBtn');
const requestAffiliateWithdrawalBtn = document.getElementById('requestAffiliateWithdrawalBtn');
const affiliateEarningsEl = document.getElementById('affiliateEarnings');
const affiliateBalanceEl = document.getElementById('affiliateBalance');
const referredUsersEl = document.getElementById('referredUsers');
const activeLinksEl = document.getElementById('activeLinks');
const affiliateTransactionTable = document.getElementById('affiliateTransactionTable');
const giveawayFilter = document.getElementById('giveawayFilter');
const affiliateGiveawayList = document.getElementById('affiliateGiveawayList');
const taskList = document.getElementById('taskList');
const completeTasksBtn = document.getElementById('completeTasksBtn');
const paymentSlider = document.getElementById('paymentSlider');
const paymentAmount = document.getElementById('paymentAmount');
const paymentStatus = document.getElementById('paymentStatus');
const paymentSuccessAnimation = document.getElementById('paymentSuccessAnimation');
const userMessagesFilter = document.getElementById('userMessagesFilter');
const adminChatMessages = document.getElementById('adminChatMessages');
const adminReplyForm = document.getElementById('adminReplyForm');
const adminReplyMessage = document.getElementById('adminReplyMessage');
const debitUserBtn = document.getElementById('debitUserBtn');
const banUserBtn = document.getElementById('banUserBtn');
const giftCardAmount = document.getElementById('giftCardAmount');
const giftCardValue = document.getElementById('giftCardValue');
const giftcardResult = document.getElementById('giftcardResult');
const giftcardCodesList = document.getElementById('giftcardCodesList');
const vendorCardForm = document.getElementById('vendorCardForm');
const vendorCardResult = document.getElementById('vendorCardResult');
const vendorCardCodesList = document.getElementById('vendorCardCodesList');
const assignCardForm = document.getElementById('assignCardForm');
const assignUser = document.getElementById('assignUser');
const chatMessages = document.getElementById('chatMessages');
const customerCareForm = document.getElementById('customerCareForm');
const customerMessage = document.getElementById('customerMessage');
const availableGiftCardsList = document.getElementById('availableGiftCardsList');
const countryBtns = document.querySelectorAll('.country-btn');
const userCountryInput = document.getElementById('userCountry');
const adminCountryTabs = document.querySelectorAll('.admin-country-tab');
const pendingTransactionsList = document.getElementById('pendingTransactionsList');
const currencySymbol = document.getElementById('currencySymbol');
const giftCardCurrencySymbol = document.getElementById('giftCardCurrencySymbol');
const vendorCurrencySymbol = document.getElementById('vendorCurrencySymbol');
const assignCurrencySymbol = document.getElementById('assignCurrencySymbol');
const gamePriceCurrency = document.getElementById('gamePriceCurrency');
const openGiveawayCurrency = document.getElementById('openGiveawayCurrency');
const openGiveawayPriceDisplay = document.getElementById('openGiveawayPriceDisplay');
const giftcardGiveawayPriceDisplay = document.getElementById('giftcardGiveawayPriceDisplay');
const giveawayForm = document.getElementById('giveawayForm');
const giveawayCreatedSection = document.getElementById('giveawayCreatedSection');
const giveawayLinkInput = document.getElementById('giveawayLinkInput');
const copyGiveawayLinkBtn = document.getElementById('copyGiveawayLinkBtn');
const generatedGiftCardsCount = document.getElementById('generatedGiftCardsCount');
const generatedGiftCardsList = document.getElementById('generatedGiftCardsList');
const giftcardTypeBtns = document.querySelectorAll('.giftcard-type-btn');
const giftCardTypeInput = document.getElementById('giftCardType');
const singleGiftCardFields = document.getElementById('singleGiftCardFields');
const bulkGiftCardFields = document.getElementById('bulkGiftCardFields');
const bulkGiftCardAmount = document.getElementById('bulkGiftCardAmount');
const bulkGiftCardCount = document.getElementById('bulkGiftCardCount');
const refreshTransactionsBtn = document.getElementById('refreshTransactionsBtn');
const refreshWithdrawalRequestsBtn = document.getElementById('refreshWithdrawalRequestsBtn');
const refreshPendingTransactionsBtn = document.getElementById('refreshPendingTransactionsBtn');
const lastUpdatedEl = document.getElementById('lastUpdated');
const giftCardFilter = document.getElementById('giftCardFilter');
const searchGiftCards = document.getElementById('searchGiftCards');
const giftCardsTable = document.getElementById('giftCardsTable');
const refreshGiftCardsBtn = document.getElementById('refreshGiftCardsBtn');
const settleConversationBtn = document.getElementById('settleConversationBtn');
const affiliateLinksList = document.getElementById('affiliateLinksList');
const viewAllGiftCardsBtn = document.getElementById('viewAllGiftCardsBtn');
const allGiftCardsModal = document.getElementById('allGiftCardsModal');
const allGiftCardsTable = document.getElementById('allGiftCardsTable');
const allGiftCardsFilter = document.getElementById('allGiftCardsFilter');
const refreshAllGiftCardsBtn = document.getElementById('refreshAllGiftCardsBtn');
const manageGiveawaysBtn = document.getElementById('manageGiveawaysBtn');
const manageGiveawaysModal = document.getElementById('manageGiveawaysModal');
const giveawaysTable = document.getElementById('giveawaysTable');
const searchGiveawaysAdmin = document.getElementById('searchGiveawaysAdmin');
const refreshGiveawaysBtn = document.getElementById('refreshGiveawaysBtn');

// NEW DOM Elements for Additional Features
const customerCarePanel = document.getElementById('customerCarePanel');
const conversationList = document.getElementById('conversationList');
const careChatMessages = document.getElementById('careChatMessages');
const careReplyForm = document.getElementById('careReplyForm');
const careReplyMessage = document.getElementById('careReplyMessage');
const refreshConversationsBtn = document.getElementById('refreshConversationsBtn');
const customerCareManagementBtn = document.getElementById('customerCareManagementBtn');
const customerCareManagementModal = document.getElementById('customerCareManagementModal');
const searchCustomerCare = document.getElementById('searchCustomerCare');
const customerCareList = document.getElementById('customerCareList');
const assignCustomerCareUser = document.getElementById('assignCustomerCareUser');
const assignCustomerCareBtn = document.getElementById('assignCustomerCareBtn');
const careActivityDate = document.getElementById('careActivityDate');
const filterCareActivityBtn = document.getElementById('filterCareActivityBtn');
const refreshCustomerCareBtn = document.getElementById('refreshCustomerCareBtn');
const giveawayHuntSection = document.getElementById('giveawayHuntSection');
const searchGiveaways = document.getElementById('searchGiveaways');
const giveawayHuntGrid = document.getElementById('giveawayHuntGrid');
const giveawayHuntGameModal = document.getElementById('giveawayHuntGameModal');
const giveawayHuntTitle = document.getElementById('giveawayHuntTitle');
const huntTargetTimeDisplay = document.getElementById('huntTargetTimeDisplay');
const huntTargetTimeValue = document.getElementById('huntTargetTimeValue');
const huntTimerDisplay = document.getElementById('huntTimerDisplay');
const huntStartBtn = document.getElementById('huntStartBtn');
const huntStopBtn = document.getElementById('huntStopBtn');
const userFilter = document.getElementById('userFilter');
const filterDate = document.getElementById('filterDate');
const applyFilterBtn = document.getElementById('applyFilterBtn');
const sendNotificationBtn = document.getElementById('sendNotificationBtn');
const totalUsers = document.getElementById('totalUsers');
const totalBalance = document.getElementById('totalBalance');
const todayUsers = document.getElementById('todayUsers');
const todayRevenue = document.getElementById('todayRevenue');
const notificationPopup = document.getElementById('notificationPopup');
const notificationContent = document.getElementById('notificationContent');
const notificationClose = document.querySelector('.notification-close');
const paymentDescriptionWinner = document.getElementById('paymentDescriptionWinner');
const amountSpent = document.getElementById('amountSpent');
const paymentDetailsSection = document.getElementById('paymentDetailsSection');
const amountSpentSection = document.getElementById('amountSpentSection');

// Get all modals
const modals = document.querySelectorAll('.modal');

// Initialize Firebase
function initializeFirebase() {
    try {
        if (!firebaseConfig) {
            throw new Error("Firebase configuration not found. Please check config.js");
        }
        
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        
        // Initialize services
        db = firebase.firestore();
        auth = firebase.auth();
        
        console.log("Firebase initialized successfully");
        
        // Set up auth state listener
        auth.onAuthStateChanged(handleAuthStateChanged);
        
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        alert("Error initializing Firebase: " + error.message);
    }
}

// Enhanced transaction history loading with real-time listener
async function loadTransactionHistory() {
    try {
        console.log("Loading transaction history for user:", user.uid);
        
        // Set up real-time listener for transactions
        const unsubscribe = db.collection('transactions')
            .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                console.log("Transactions loaded:", snapshot.size, "documents");
                if (snapshot.empty) {
                    transactionTable.innerHTML = '<tr><td colspan="4" style="text-align: center;">No transactions yet</td></tr>';
                } else {
                    updateTransactionTable(snapshot);
                }
            }, (error) => {
                console.error("Transaction error:", error);
                transactionTable.innerHTML = '<tr><td colspan="4" style="text-align: center; color: red;">Error loading transactions</td></tr>';
            });
            
        return unsubscribe;
    } catch (error) {
        console.error("Transaction setup error:", error);
        transactionTable.innerHTML = '<tr><td colspan="4" style="text-align: center; color: red;">Error loading transactions</td></tr>';
    }
}

// Enhanced payment requests loading
async function loadPaymentRequests() {
    try {
        console.log("Loading payment requests...");
        
        const unsubscribe = db.collection('transactions')
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                console.log("Payment requests:", snapshot.size, "documents");
                updatePaymentRequestsTable(snapshot);
            }, (error) => {
                console.error("Payment requests error:", error);
                const pendingList = document.getElementById('pendingTransactionsList');
                if (pendingList) {
                    pendingList.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">Error loading payment requests</p>';
                }
            });
            
        return unsubscribe;
    } catch (error) {
        console.error("Payment requests setup error:", error);
        const pendingList = document.getElementById('pendingTransactionsList');
        if (pendingList) {
            pendingList.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">Error loading payment requests</p>';
        }
    }
}

// Enhanced withdrawal requests loading
async function loadWithdrawalRequests() {
    try {
        console.log("Loading withdrawal requests...");
        
        const unsubscribe = db.collection('withdrawalRequests')
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                console.log("Withdrawal requests loaded:", snapshot.size, "documents");
                updateWithdrawalRequestsTable(snapshot);
            }, (error) => {
                console.error("Withdrawal requests error:", error);
                const withdrawalList = document.getElementById('withdrawalRequestsList');
                if (withdrawalList) {
                    withdrawalList.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">Error loading withdrawal requests</p>';
                }
            });
            
        return unsubscribe;
    } catch (error) {
        console.error("Withdrawal requests setup error:", error);
        const withdrawalList = document.getElementById('withdrawalRequestsList');
        if (withdrawalList) {
            withdrawalList.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">Error loading withdrawal requests</p>';
        }
    }
}

// Enhanced customer care with proper message storage
async function loadCustomerCareMessages() {
    try {
        console.log("Loading customer care messages...");
        
        if (!user) return;
        
        // First, check if there's an active conversation
        const conversationQuery = await db.collection('conversations')
            .where('userId', '==', user.uid)
            .where('status', '==', 'open')
            .limit(1)
            .get();
            
        if (!conversationQuery.empty) {
            const conversationId = conversationQuery.docs[0].id;
            
            // Load messages for this conversation
            const unsubscribe = db.collection('messages')
                .where('conversationId', '==', conversationId)
                .orderBy('createdAt', 'asc')
                .onSnapshot((snapshot) => {
                    console.log("Customer care messages loaded:", snapshot.size, "messages");
                    updateCustomerCareMessages(snapshot);
                }, (error) => {
                    console.error("Error in customer care messages listener:", error);
                });
                
            return unsubscribe;
        } else {
            // No active conversation, show welcome message
            chatMessages.innerHTML = `
                <div class="message admin">
                    <div class="message-header">
                        <span>Admin</span>
                        <span>Just now</span>
                    </div>
                    <div>Hello! How can we help you today?</div>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error loading customer care messages:", error);
    }
}

// Enhanced customer care message submission
async function handleCustomerCareMessage(e) {
    e.preventDefault();
    const messageText = customerMessage.value.trim();
    
    if (!messageText) {
        alert('Please enter a message');
        return;
    }
    
    if (!user) {
        alert('Please log in to send messages');
        return;
    }
    
    try {
        // Check for existing open conversation
        const existingConversation = await db.collection('conversations')
            .where('userId', '==', user.uid)
            .where('status', '==', 'open')
            .limit(1)
            .get();
            
        let conversationId;
        let conversationData;
        
        if (existingConversation.empty) {
            // Create new conversation
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userData = userDoc.data();
            
            conversationData = {
                userId: user.uid,
                userEmail: user.email,
                userName: userData?.name || 'User',
                status: 'open',
                unreadCount: 1, // Admin has unread messages
                lastMessage: messageText,
                lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            const conversationRef = await db.collection('conversations').add(conversationData);
            conversationId = conversationRef.id;
        } else {
            conversationId = existingConversation.docs[0].id;
            conversationData = existingConversation.docs[0].data();
            
            // Update conversation with unread count for admin
            await db.collection('conversations').doc(conversationId).update({
                unreadCount: (conversationData.unreadCount || 0) + 1,
                lastMessage: messageText,
                lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Save user message with conversation ID
        const messageData = {
            userId: user.uid,
            userEmail: user.email,
            conversationId: conversationId,
            sender: 'user',
            text: messageText,
            read: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await db.collection('messages').add(messageData);
        
        // Clear input
        customerMessage.value = '';
        
        // Show success message
        alert('Message sent successfully!');
        
    } catch (error) {
        console.error("Error sending message:", error);
        alert('Error sending message: ' + error.message);
    }
}

// Enhanced admin data loading with conversation tracking
async function loadAdminData() {
    try {
        console.log("Setting up admin listeners...");
        
        // Load users
        db.collection('users').onSnapshot((snapshot) => {
            console.log("Users snapshot:", snapshot.size, "documents");
            updateUsersList(snapshot);
            updateAdminStats(snapshot);
        });

        // Load conversations for messages - order by lastMessageAt for newest first
        db.collection('conversations')
            .where('status', '==', 'open')
            .orderBy('lastMessageAt', 'desc')
            .onSnapshot((snapshot) => {
                console.log("Conversations snapshot:", snapshot.size, "documents");
                updateAdminConversationsList(snapshot);
            });

        // Load assignable users
        db.collection('users').onSnapshot((snapshot) => {
            updateAssignUserSelect(snapshot);
            updateAssignCustomerCareSelect(snapshot);
        });

        // Load payment requests
        loadPaymentRequests();

        // Load withdrawal requests  
        loadWithdrawalRequests();

        // Load gift cards
        loadAllGiftCards();

        // Load customer care users
        loadCustomerCareUsers();

        // Load giveaways for admin
        loadAllGiveaways();

    } catch (error) {
        console.error("Error setting up admin listeners:", error);
    }
}

// Enhanced user data loading with conversation tracking
async function loadUserData(userId) {
    try {
        console.log("Loading user data for:", userId);
        
        // Set up real-time listener for user data
        const unsubscribe = db.collection('users').doc(userId).onSnapshot((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                console.log("User data received:", userData);
                
                // Update UI with user data
                gamesPlayed = userData.gamesPlayed || 0;
                bestTime = userData.bestTime || 0;
                walletBalance = userData.walletBalance || 0;
                giftCardBalance = userData.giftCardBalance || 0;
                giveawayCashbackBalance = userData.giveawayCashbackBalance || 0;
                isAdmin = userData.isAdmin || false;
                isAffiliate = userData.isAffiliate || false;
                isCustomerCare = userData.isCustomerCare || false;
                userCountry = userData.country || 'nigeria';
                failedGiftCardAttempts = userData.failedGiftCardAttempts || 0;
                
                updateStats();
                updateWalletBalance();
                updateCurrencyDisplays();
                
                // Show admin section if user is admin
                if (isAdmin) {
                    adminSection.style.display = 'block';
                    loadAdminData();
                } else {
                    adminSection.style.display = 'none';
                }
                
                // Show customer care panel if user is customer care
                if (isCustomerCare) {
                    customerCarePanel.style.display = 'block';
                    loadCustomerCareConversations();
                } else {
                    customerCarePanel.style.display = 'none';
                }
                
                // Load affiliate data if user is affiliate
                if (isAffiliate) {
                    loadAffiliateData(userId);
                }
            }
        }, (error) => {
            console.error("Error in user data listener:", error);
        });
        
        // Load transactions
        loadTransactionHistory();
        
        // Load gift cards
        db.collection('giftCards')
            .where('userId', '==', userId)
            .onSnapshot((snapshot) => {
                console.log("User gift cards snapshot:", snapshot.size, "documents");
                updateAvailableGiftCards(snapshot);
                updateAllGiftCardsTable(snapshot);
            }, (error) => {
                console.error("Error in gift cards listener:", error);
            });
            
        // Load customer care messages
        loadCustomerCareMessages();
        
        // Load user giveaways
        loadUserGiveaways();
        
        return unsubscribe;
        
    } catch (error) {
        console.error("Error loading user data:", error);
    }
}

// Enhanced admin conversations loading with email and unread counts
function updateAdminConversationsList(conversationsSnapshot) {
    const userMessagesFilter = document.getElementById('userMessagesFilter');
    
    if (!userMessagesFilter) {
        console.error('User messages filter element not found');
        return;
    }
    
    // Clear existing options except the first one
    while (userMessagesFilter.children.length > 1) {
        userMessagesFilter.removeChild(userMessagesFilter.lastChild);
    }
    
    if (conversationsSnapshot.empty) {
        console.log("No open conversations found");
        return;
    }
    
    // Convert to array and sort by lastMessageAt (newest first)
    const conversations = [];
    conversationsSnapshot.forEach(doc => {
        const conversation = doc.data();
        conversation.id = doc.id;
        conversations.push(conversation);
    });
    
    // Sort by lastMessageAt descending (newest first)
    conversations.sort((a, b) => {
        const timeA = a.lastMessageAt ? a.lastMessageAt.toDate().getTime() : 0;
        const timeB = b.lastMessageAt ? b.lastMessageAt.toDate().getTime() : 0;
        return timeB - timeA;
    });
    
    conversations.forEach(conversation => {
        const option = document.createElement('option');
        option.value = conversation.userId;
        
        // Show user email and unread count
        const unreadBadge = conversation.unreadCount > 0 ? 
            `<span class="status-badge status-pending" style="margin-left: 5px;">${conversation.unreadCount}</span>` : '';
        
        option.innerHTML = `${conversation.userEmail} ${unreadBadge}`;
        option.dataset.conversationId = conversation.id;
        option.dataset.userEmail = conversation.userEmail;
        userMessagesFilter.appendChild(option);
    });
    
    console.log("Admin conversations list updated:", conversations.length, "conversations");
}

// Enhanced admin chat messages with user email
function updateAdminChatMessages(messagesSnapshot) {
    const adminChatMessages = document.getElementById('adminChatMessages');
    
    if (!adminChatMessages) {
        console.error('Admin chat messages element not found');
        return;
    }
    
    adminChatMessages.innerHTML = '';
    
    if (messagesSnapshot.empty) {
        adminChatMessages.innerHTML = '<p style="text-align: center; padding: 20px;">No messages found</p>';
        return;
    }
    
    // Sort messages by timestamp
    const messages = [];
    messagesSnapshot.forEach(doc => {
        const message = doc.data();
        message.id = doc.id;
        messages.push(message);
    });
    
    messages.sort((a, b) => {
        const timeA = a.createdAt ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt ? b.createdAt.toDate().getTime() : 0;
        return timeA - timeB;
    });
    
    // Display messages with user email
    messages.forEach(message => {
        const time = message.createdAt ? message.createdAt.toDate().toLocaleTimeString() : 'Just now';
        const senderName = message.sender === 'admin' ? 'Admin' : message.userEmail || 'User';
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender === 'admin' ? 'admin' : 'user'}`;
        messageDiv.innerHTML = `
            <div class="message-header">
                <span>${senderName}</span>
                <span>${time}</span>
            </div>
            <div>${message.text}</div>
        `;
        
        adminChatMessages.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    adminChatMessages.scrollTop = adminChatMessages.scrollHeight;
}

// Enhanced admin reply with unread count management
async function handleAdminReply(e) {
    e.preventDefault();
    const replyText = adminReplyMessage.value.trim();
    
    if (!replyText) {
        alert('Please enter a reply');
        return;
    }
    
    if (!selectedUserId) {
        alert('Please select a user to reply to');
        return;
    }
    
    const selectedOption = userMessagesFilter.options[userMessagesFilter.selectedIndex];
    const conversationId = selectedOption.dataset.conversationId;
    
    if (!conversationId) {
        alert('Please select a conversation to reply to');
        return;
    }
    
    try {
        // Save admin reply
        const messageData = {
            userId: selectedUserId,
            userEmail: selectedOption.dataset.userEmail,
            conversationId: conversationId,
            sender: 'admin',
            text: replyText,
            read: true, // Admin messages are automatically read
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await db.collection('messages').add(messageData);
        
        // Update conversation - reset unread count since admin replied
        await db.collection('conversations').doc(conversationId).update({
            unreadCount: 0, // Reset unread count
            lastMessage: replyText,
            lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Clear input
        adminReplyMessage.value = '';
        
        alert('Reply sent successfully!');
        
    } catch (error) {
        console.error("Error sending reply:", error);
        alert('Error sending reply: ' + error.message);
    }
}

// Giveaway type selection with dropdown
function setupGiveawayTypeDropdown() {
    const giveawayTypeSelect = document.getElementById('giveawayTypeSelect');
    const giveawayTypeInput = document.getElementById('giveawayType');
    const giftcardGiveawayFields = document.getElementById('giftcardGiveawayFields');
    const openGiveawayInfo = document.getElementById('openGiveawayInfo');
    const giftcardGiveawayInfo = document.getElementById('giftcardGiveawayInfo');
    
    console.log("Setting up giveaway type dropdown");
    
    giveawayTypeSelect.addEventListener('change', function() {
        const selectedType = this.value;
        console.log("Giveaway type selected:", selectedType);
        
        // Update hidden input
        giveawayTypeInput.value = selectedType;
        
        // Show/hide gift card fields and info
        if (selectedType === 'giftcard') {
            giftcardGiveawayFields.style.display = 'block';
            openGiveawayInfo.style.display = 'none';
            giftcardGiveawayInfo.style.display = 'block';
            console.log("Showing gift card fields");
        } else {
            giftcardGiveawayFields.style.display = 'none';
            openGiveawayInfo.style.display = 'block';
            giftcardGiveawayInfo.style.display = 'none';
            console.log("Hiding gift card fields");
        }
    });
    
    // Trigger change to set initial state
    giveawayTypeSelect.dispatchEvent(new Event('change'));
}

// Load configuration from Firestore with real-time updates
async function loadConfiguration() {
    try {
        // Set up real-time listeners for configuration
        db.collection('config').doc('gameSettings_nigeria').onSnapshot((doc) => {
            if (doc.exists) {
                gameSettings.nigeria = { ...gameSettings.nigeria, ...doc.data() };
                console.log("Nigeria game settings loaded:", gameSettings.nigeria);
                updateCurrencyDisplays();
                updateFundWalletLink();
            }
        });
        
        db.collection('config').doc('gameSettings_other').onSnapshot((doc) => {
            if (doc.exists) {
                gameSettings.other = { ...gameSettings.other, ...doc.data() };
                console.log("Other countries game settings loaded:", gameSettings.other);
                updateCurrencyDisplays();
                updateFundWalletLink();
            }
        });
        
        db.collection('config').doc('socialSettings').onSnapshot((doc) => {
            if (doc.exists) {
                socialSettings = doc.data();
                console.log("Social settings loaded:", socialSettings);
                updateSocialLinks();
            }
        });
        
    } catch (error) {
        console.error("Error loading configuration:", error);
    }
}

// Update currency displays based on user country
function updateCurrencyDisplays() {
    const settings = getGameSettings();
    const currency = settings.currency;
    
    // Update all currency displays
    currencySymbol.textContent = currency;
    giftCardCurrencySymbol.textContent = currency;
    vendorCurrencySymbol.textContent = currency;
    assignCurrencySymbol.textContent = currency;
    gamePriceCurrency.textContent = currency;
    openGiveawayCurrency.textContent = currency;
    
    // Update giveaway price displays
    openGiveawayPriceDisplay.textContent = `${currency}${settings.openGiveawayPrice}`;
    giftcardGiveawayPriceDisplay.textContent = `Custom Price`;
    
    // Update wallet balance display
    updateWalletBalance();
}

// Update fund wallet link
function updateFundWalletLink() {
    const settings = getGameSettings();
    if (fundWalletLink && settings.fundWalletUrl) {
        fundWalletLink.href = settings.fundWalletUrl;
    }
}

// Update available gift cards with filtering
function updateAvailableGiftCards(giftCardsSnapshot) {
    const filter = document.getElementById('giftCardFilter').value;
    
    if (giftCardsSnapshot.empty) {
        availableGiftCardsList.innerHTML = '<p style="text-align: center;">No gift cards available</p>';
        return;
    }
    
    let giftCardsHTML = '';
    let displayedCount = 0;
    
    giftCardsSnapshot.forEach(doc => {
        const giftCard = doc.data();
        
        // Apply filter
        let shouldDisplay = true;
        switch(filter) {
            case 'active':
                shouldDisplay = giftCard.remainingBalance > 0 && giftCard.isActive;
                break;
            case 'used':
                shouldDisplay = giftCard.remainingBalance <= 0 || !giftCard.isActive;
                break;
            case 'winners':
                shouldDisplay = giftCard.wins && giftCard.wins > 0;
                break;
        }
        
        if (!shouldDisplay) return;
        
        // Only show first 3 cards
        if (displayedCount >= 3) return;
        
        const status = giftCard.remainingBalance > 0 ? 'Valid' : 'Used';
        const statusClass = giftCard.remainingBalance > 0 ? 'status-valid' : 'status-used';
        const wins = giftCard.wins || 0;
        
        giftCardsHTML += `
            <div class="giftcard-info" style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${giftCard.code}</strong>
                        <span class="status-badge ${statusClass}">${status}</span>
                        ${wins > 0 ? `<span class="status-badge status-valid">${wins} Win${wins > 1 ? 's' : ''}</span>` : ''}
                    </div>
                    <div>
                        <span class="giftcard-balance">${getCurrencySymbol()}${giftCard.remainingBalance || 0}</span>
                        <button class="copy-btn" onclick="copyGiftCardCode('${giftCard.code}')">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        displayedCount++;
    });
    
    if (giftCardsHTML === '') {
        availableGiftCardsList.innerHTML = '<p style="text-align: center;">No gift cards match the selected filter</p>';
    } else {
        availableGiftCardsList.innerHTML = giftCardsHTML;
    }
}

// Update all gift cards table for the modal view
function updateAllGiftCardsTable(giftCardsSnapshot) {
    const filter = document.getElementById('allGiftCardsFilter').value;
    
    if (giftCardsSnapshot.empty) {
        allGiftCardsTable.innerHTML = '<tr><td colspan="7" style="text-align: center;">No gift cards found</td></tr>';
        return;
    }
    
    let tableHTML = '';
    
    giftCardsSnapshot.forEach(doc => {
        const giftCard = doc.data();
        
        // Apply filter
        let shouldDisplay = true;
        switch(filter) {
            case 'active':
                shouldDisplay = giftCard.remainingBalance > 0 && giftCard.isActive;
                break;
            case 'used':
                shouldDisplay = giftCard.remainingBalance <= 0 || !giftCard.isActive;
                break;
            case 'winners':
                shouldDisplay = giftCard.wins && giftCard.wins > 0;
                break;
        }
        
        if (!shouldDisplay) return;
        
        const status = giftCard.isActive ? (giftCard.remainingBalance > 0 ? 'Active' : 'Used') : 'Inactive';
        const statusClass = giftCard.isActive ? (giftCard.remainingBalance > 0 ? 'status-valid' : 'status-used') : 'status-used';
        const wins = giftCard.wins || 0;
        const createdDate = giftCard.createdAt ? giftCard.createdAt.toDate().toLocaleDateString() : 'N/A';
        
        tableHTML += `
            <tr>
                <td><strong>${giftCard.code}</strong></td>
                <td>${getCurrencySymbol()}${giftCard.value || 0}</td>
                <td>${getCurrencySymbol()}${giftCard.remainingBalance || 0}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>${wins}</td>
                <td>${createdDate}</td>
                <td>
                    <div class="transaction-actions">
                        <button class="btn btn-sm btn-info" onclick="viewGiftCardDetails('${doc.id}')">View</button>
                        <button class="btn btn-sm btn-warning" onclick="copyGiftCardCode('${giftCard.code}')">Copy</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    if (tableHTML === '') {
        allGiftCardsTable.innerHTML = '<tr><td colspan="7" style="text-align: center;">No gift cards match the selected filter</td></tr>';
    } else {
        allGiftCardsTable.innerHTML = tableHTML;
    }
}

// Copy gift card code
function copyGiftCardCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Gift card code copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy gift card code', 'error');
    });
}

// Get currency symbol based on user country
function getCurrencySymbol() {
    return getGameSettings().currency;
}

// Get game settings based on country
function getGameSettings() {
    return gameSettings[userCountry];
}

// Update customer care messages
async function updateCustomerCareMessages(messagesSnapshot) {
    chatMessages.innerHTML = '';
    
    if (messagesSnapshot.empty) {
        chatMessages.innerHTML = `
            <div class="message admin">
                <div class="message-header">
                    <span>Admin</span>
                    <span>Just now</span>
                </div>
                <div>Hello! How can we help you today?</div>
            </div>
        `;
        return;
    }
    
    // Sort messages by timestamp
    const messages = [];
    messagesSnapshot.forEach(doc => {
        const message = doc.data();
        message.id = doc.id;
        messages.push(message);
    });
    
    messages.sort((a, b) => {
        const timeA = a.createdAt ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt ? b.createdAt.toDate().getTime() : 0;
        return timeA - timeB;
    });
    
    // Display messages
    messages.forEach(message => {
        const time = message.createdAt ? message.createdAt.toDate().toLocaleTimeString() : 'Just now';
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender === 'admin' ? 'admin' : 'user'}`;
        messageDiv.innerHTML = `
            <div class="message-header">
                <span>${message.sender === 'admin' ? 'Admin' : 'You'}</span>
                <span>${time}</span>
            </div>
            <div>${message.text}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Update payment requests table with gift card modal style
function updatePaymentRequestsTable(transactionsSnapshot) {
    const pendingTransactionsList = document.getElementById('pendingTransactionsList');
    
    if (!pendingTransactionsList) {
        console.error('Pending transactions list element not found');
        return;
    }
    
    if (transactionsSnapshot.empty) {
        pendingTransactionsList.innerHTML = '<p style="text-align: center; padding: 20px;">No pending payment requests</p>';
        return;
    }
    
    let tableHTML = `
        <table class="gift-cards-table">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Payment Description</th>
                    <th>Account Details</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    transactionsSnapshot.forEach(doc => {
        const transaction = doc.data();
        const date = transaction.createdAt ? transaction.createdAt.toDate().toLocaleDateString() : 'N/A';
        const currencySymbol = transaction.country === 'nigeria' ? '₦' : 'USDT ';
        
        tableHTML += `
            <tr>
                <td>${transaction.name || 'N/A'} (${transaction.email || 'N/A'})</td>
                <td>${transaction.type || 'Wallet Funding'}</td>
                <td>${currencySymbol}${transaction.amount}</td>
                <td>${date}</td>
                <td>${transaction.paymentDescription || 'Not provided'}</td>
                <td>${transaction.accountDetails || 'Not provided'}</td>
                <td>
                    <div class="transaction-actions">
                        <button class="btn btn-success btn-sm" onclick="approveTransaction('${doc.id}')">Approve</button>
                        <button class="btn btn-danger btn-sm" onclick="declineTransaction('${doc.id}')">Decline</button>
                        <button class="btn btn-warning btn-sm" onclick="editTransactionAmount('${doc.id}', ${transaction.amount})">Edit Amount</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    pendingTransactionsList.innerHTML = tableHTML;
}

// Update withdrawal requests table with gift card modal style
function updateWithdrawalRequestsTable(requestsSnapshot) {
    const withdrawalRequestsList = document.getElementById('withdrawalRequestsList');
    
    if (!withdrawalRequestsList) {
        console.error('Withdrawal requests list element not found');
        return;
    }
    
    if (requestsSnapshot.empty) {
        withdrawalRequestsList.innerHTML = '<p style="text-align: center; padding: 20px;">No pending withdrawal requests</p>';
        return;
    }
    
    let tableHTML = `
        <table class="gift-cards-table">
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Payment Method</th>
                    <th>Account Details</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    requestsSnapshot.forEach(doc => {
        const request = doc.data();
        const date = request.createdAt ? request.createdAt.toDate().toLocaleDateString() : 'N/A';
        const currencySymbol = request.country === 'nigeria' ? '₦' : 'USDT ';
        
        tableHTML += `
            <tr>
                <td>${request.userId}</td>
                <td>${request.type === 'giveaway_cashback' ? 'Giveaway Cashback' : 'Affiliate'} Withdrawal</td>
                <td>${currencySymbol}${request.amount}</td>
                <td>${date}</td>
                <td>${request.paymentMethod || 'N/A'}</td>
                <td>${request.accountDetails || 'N/A'}</td>
                <td>
                    <div class="transaction-actions">
                        <button class="btn btn-success btn-sm" onclick="approveWithdrawal('${doc.id}')">Approve</button>
                        <button class="btn btn-danger btn-sm" onclick="declineWithdrawal('${doc.id}')">Decline</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    withdrawalRequestsList.innerHTML = tableHTML;
}

// Approve transaction
async function approveTransaction(transactionId) {
    try {
        // Get transaction
        const transactionDoc = await db.collection('transactions').doc(transactionId).get();
        const transaction = transactionDoc.data();
        
        // Update transaction status
        await db.collection('transactions').doc(transactionId).update({
            status: 'completed'
        });
        
        // Update user wallet balance
        await db.collection('users').doc(transaction.userId).update({
            walletBalance: firebase.firestore.FieldValue.increment(transaction.amount)
        });
        
        showNotification('Transaction approved successfully!', 'success');
        
    } catch (error) {
        console.error("Error approving transaction:", error);
        alert('Error approving transaction: ' + error.message);
    }
}

// Edit transaction amount before approval
async function editTransactionAmount(transactionId, currentAmount) {
    const newAmount = prompt("Enter new amount:", currentAmount);
    
    if (newAmount && !isNaN(newAmount) && newAmount > 0) {
        try {
            await db.collection('transactions').doc(transactionId).update({
                amount: parseFloat(newAmount)
            });
            
            showNotification('Transaction amount updated successfully!', 'success');
        } catch (error) {
            console.error("Error updating transaction amount:", error);
            alert('Error updating transaction amount: ' + error.message);
        }
    }
}

// Decline transaction
async function declineTransaction(transactionId) {
    try {
        // Update transaction status
        await db.collection('transactions').doc(transactionId).update({
            status: 'declined'
        });
        
        showNotification('Transaction declined!', 'success');
        
    } catch (error) {
        console.error("Error declining transaction:", error);
        alert('Error declining transaction: ' + error.message);
    }
}

// Approve withdrawal
async function approveWithdrawal(requestId) {
    try {
        // Update withdrawal request status
        await db.collection('withdrawalRequests').doc(requestId).update({
            status: 'approved'
        });
        
        showNotification('Withdrawal approved successfully!', 'success');
        
    } catch (error) {
        console.error("Error approving withdrawal:", error);
        alert('Error approving withdrawal: ' + error.message);
    }
}

// Decline withdrawal
async function declineWithdrawal(requestId) {
    try {
        // Get withdrawal request
        const requestDoc = await db.collection('withdrawalRequests').doc(requestId).get();
        const request = requestDoc.data();
        
        // Update withdrawal request status
        await db.collection('withdrawalRequests').doc(requestId).update({
            status: 'declined'
        });
        
        // Refund the amount to the user's balance
        if (request.type === 'giveaway_cashback') {
            await db.collection('users').doc(request.userId).update({
                giveawayCashbackBalance: firebase.firestore.FieldValue.increment(request.amount)
            });
        } else if (request.type === 'affiliate') {
            await db.collection('affiliates').doc(request.userId).update({
                availableBalance: firebase.firestore.FieldValue.increment(request.amount)
            });
        }
        
        showNotification('Withdrawal declined and amount refunded!', 'success');
        
    } catch (error) {
        console.error("Error declining withdrawal:", error);
        alert('Error declining withdrawal: ' + error.message);
    }
}

// Update users list in admin panel
function updateUsersList(usersSnapshot) {
    const usersList = document.getElementById('usersList');
    
    if (usersSnapshot.empty) {
        usersList.innerHTML = '<p style="text-align: center;">No users found</p>';
        return;
    }
    
    let usersHTML = '';
    usersSnapshot.forEach(doc => {
        const userData = doc.data();
        const verificationBadge = userData.isVerified ? 
            `<i class="fas ${userData.verificationType === 'gold' ? 'fa-certificate gold-badge' : 'fa-check-circle verified-badge'}"></i>` : '';
        const userCurrency = userData.country === 'nigeria' ? '₦' : 'USDT ';
        const customerCareBadge = userData.isCustomerCare ? 
            `<span class="status-badge status-valid" style="margin-left: 5px;">Customer Care</span>` : '';
        
        usersHTML += `
            <div class="user-item">
                <div>
                    <strong>${userData.name || 'No Name'} ${verificationBadge} ${customerCareBadge}</strong>
                    <p>${userData.email}</p>
                    <p>Country: ${userData.country || 'nigeria'}</p>
                    <p>Balance: ${userCurrency}${userData.walletBalance || 0}</p>
                    <p>Status: ${userData.isBlocked ? 'Blocked' : 'Active'}</p>
                </div>
                <div class="user-actions">
                    <button class="btn btn-sm btn-info" onclick="toggleVerification('${doc.id}', ${userData.isVerified}, '${userData.verificationType || 'none'}')">
                        ${userData.isVerified ? 'Remove Verify' : 'Verify'}
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="debitUser('${doc.id}')">Debit</button>
                    <button class="btn btn-sm btn-danger" onclick="banUser('${doc.id}')">${userData.isBlocked ? 'Unban' : 'Ban'}</button>
                    <button class="btn btn-sm btn-success" onclick="sendUserNotification('${doc.id}')">Notify</button>
                </div>
            </div>
        `;
    });
    
    usersList.innerHTML = usersHTML;
}

// Update admin stats
function updateAdminStats(usersSnapshot) {
    let totalUsersCount = 0;
    let totalBalanceSum = 0;
    let todayUsersCount = 0;
    let todayRevenueSum = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    usersSnapshot.forEach(doc => {
        const userData = doc.data();
        totalUsersCount++;
        totalBalanceSum += userData.walletBalance || 0;
        
        // Check if user joined today
        if (userData.createdAt) {
            const userJoinDate = userData.createdAt.toDate();
            if (userJoinDate >= today) {
                todayUsersCount++;
            }
        }
    });
    
    // For now, using a simple calculation for today's revenue
    // In a real app, you would calculate this from transactions
    todayRevenueSum = totalBalanceSum * 0.1; // Example calculation
    
    totalUsers.textContent = totalUsersCount;
    totalBalance.textContent = `₦${totalBalanceSum.toFixed(2)}`;
    todayUsers.textContent = todayUsersCount;
    todayRevenue.textContent = `₦${todayRevenueSum.toFixed(2)}`;
}

// Toggle user verification
async function toggleVerification(userId, isCurrentlyVerified, currentType) {
    try {
        let newVerificationType = 'blue';
        
        if (isCurrentlyVerified) {
            if (currentType === 'blue') {
                newVerificationType = 'gold';
            } else {
                // Remove verification
                await db.collection('users').doc(userId).update({
                    isVerified: false,
                    verificationType: 'none'
                });
                
                showNotification('Verification removed!', 'success');
                return;
            }
        }
        
        // Set verification
        await db.collection('users').doc(userId).update({
            isVerified: true,
            verificationType: newVerificationType
        });
        
        showNotification(`User ${isCurrentlyVerified ? 'upgraded to gold verification' : 'verified with blue badge'}!`, 'success');
        
    } catch (error) {
        console.error("Error toggling verification:", error);
        alert('Error toggling verification: ' + error.message);
    }
}

// Update assign user select
function updateAssignUserSelect(usersSnapshot) {
    assignUser.innerHTML = '';
    
    if (usersSnapshot.empty) {
        assignUser.innerHTML = '<option value="">No users found</option>';
        return;
    }
    
    usersSnapshot.forEach(doc => {
        const userData = doc.data();
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = `${userData.name || 'No Name'} (${userData.email})`;
        assignUser.appendChild(option);
    });
}

// Handle user messages filter change
async function handleUserMessagesFilterChange() {
    const userId = userMessagesFilter.value;
    
    if (userId === 'all') {
        await loadAllAdminMessages();
    } else {
        await loadUserAdminMessages(userId);
    }
}

// Load all messages for admin
async function loadAllAdminMessages() {
    try {
        db.collection('messages')
            .orderBy('createdAt', 'asc')
            .onSnapshot((snapshot) => {
                updateAdminChatMessages(snapshot);
            });
    } catch (error) {
        console.error("Error loading all messages:", error);
    }
}

// Load user messages for admin
async function loadUserAdminMessages(userId) {
    try {
        db.collection('messages')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'asc')
            .onSnapshot((snapshot) => {
                updateAdminChatMessages(snapshot);
                selectedUserId = userId;
            });
    } catch (error) {
        console.error("Error loading user messages:", error);
    }
}

// Settle conversation (admin function)
async function settleConversation() {
    const selectedOption = userMessagesFilter.options[userMessagesFilter.selectedIndex];
    const conversationId = selectedOption.dataset.conversationId;
    
    if (!conversationId) {
        alert('Please select a conversation to settle');
        return;
    }
    
    try {
        await db.collection('conversations').doc(conversationId).update({
            status: 'settled',
            settledAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification('Conversation marked as settled!', 'success');
    } catch (error) {
        console.error("Error settling conversation:", error);
        alert('Error settling conversation: ' + error.message);
    }
}

// Debit user (admin function)
async function debitUser(userId) {
    const amount = prompt("Enter amount to debit:");
    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }
    
    try {
        // Get user current balance
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        const currentBalance = userData.walletBalance || 0;
        const userCurrency = userData.country === 'nigeria' ? '₦' : 'USDT ';
        
        if (currentBalance < amount) {
            alert("User doesn't have enough balance");
            return;
        }
        
        // Update user balance
        await db.collection('users').doc(userId).update({
            walletBalance: firebase.firestore.FieldValue.increment(-parseFloat(amount))
        });
        
        // Create transaction record
        await db.collection('transactions').add({
            userId: userId,
            type: 'Admin Debit',
            amount: -parseFloat(amount),
            status: 'completed',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification(`Successfully debited ${userCurrency}${amount} from user`, 'success');
        
    } catch (error) {
        console.error("Error debiting user:", error);
        alert('Error debiting user: ' + error.message);
    }
}

// Ban user (admin function)
async function banUser(userId) {
    try {
        // Get user current status
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        const isCurrentlyBlocked = userData.isBlocked || false;
        
        // Update user status
        await db.collection('users').doc(userId).update({
            isBlocked: !isCurrentlyBlocked
        });
        
        showNotification(`User ${isCurrentlyBlocked ? 'unbanned' : 'banned'} successfully`, 'success');
        
    } catch (error) {
        console.error("Error banning user:", error);
        alert('Error banning user: ' + error.message);
    }
}

// Send notification to user
async function sendUserNotification(userId) {
    const message = prompt("Enter notification message:");
    
    if (!message) {
        alert("Please enter a message");
        return;
    }
    
    try {
        // Create notification
        await db.collection('notifications').add({
            userId: userId,
            message: message,
            isRead: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification('Notification sent successfully!', 'success');
    } catch (error) {
        console.error("Error sending notification:", error);
        alert('Error sending notification: ' + error.message);
    }
}

// Load affiliate data with real-time updates
async function loadAffiliateData(userId) {
    try {
        db.collection('affiliates').doc(userId).onSnapshot((doc) => {
            if (doc.exists) {
                const affiliateData = doc.data();
                
                affiliateEarnings = affiliateData.totalEarnings || 0;
                affiliateBalance = affiliateData.availableBalance || 0;
                referredUsers = affiliateData.referredUsers || 0;
                activeLinks = affiliateData.activeLinks || 0;
                
                updateAffiliateStats();
            }
        });
        
        // Set up real-time listener for affiliate transactions
        db.collection('affiliateTransactions')
            .where('affiliateId', '==', userId)
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                updateAffiliateTransactionTable(snapshot);
            });
        
        // Set up real-time listener for affiliate links
        db.collection('affiliateLinks')
            .where('affiliateId', '==', userId)
            .where('isActive', '==', true)
            .onSnapshot((snapshot) => {
                updateAffiliateLinksTable(snapshot);
            });
        
    } catch (error) {
        console.error("Error loading affiliate data:", error);
    }
}

// Update affiliate stats
function updateAffiliateStats() {
    affiliateEarningsEl.textContent = `${getCurrencySymbol()}${affiliateEarnings.toFixed(2)}`;
    affiliateBalanceEl.textContent = `${getCurrencySymbol()}${affiliateBalance.toFixed(2)}`;
    referredUsersEl.textContent = referredUsers;
    activeLinksEl.textContent = activeLinks;
}

// Update transaction table
function updateTransactionTable(transactionsSnapshot) {
    if (transactionsSnapshot.empty) {
        transactionTable.innerHTML = '<tr><td colspan="4" style="text-align: center;">No transactions yet</td></tr>';
        transactionDropdown.innerHTML = '';
        return;
    }
    
    let tableHTML = '';
    let dropdownHTML = '';
    let count = 0;
    
    transactionsSnapshot.forEach(doc => {
        const transaction = doc.data();
        const date = transaction.createdAt ? transaction.createdAt.toDate().toLocaleDateString() : 'N/A';
        const currencySymbol = userCountry === 'nigeria' ? '₦' : 'USDT ';
        const amount = transaction.amount || 0;
        const formattedAmount = amount >= 0 ? 
            `<span style="color: var(--success)">+${currencySymbol}${Math.abs(amount)}</span>` : 
            `<span style="color: var(--danger)">-${currencySymbol}${Math.abs(amount)}</span>`;
        
        const rowHTML = `
            <tr>
                <td>${date}</td>
                <td>${transaction.type}</td>
                <td>${formattedAmount}</td>
                <td>${transaction.status || 'completed'}</td>
            </tr>
        `;
        
        if (count < 5) {
            tableHTML += rowHTML;
        } else {
            dropdownHTML += rowHTML;
        }
        count++;
    });
    
    transactionTable.innerHTML = tableHTML;
    
    if (dropdownHTML) {
        transactionDropdown.innerHTML = `<table>${dropdownHTML}</table>`;
        transactionToggle.style.display = 'block';
    } else {
        transactionDropdown.innerHTML = '';
        transactionToggle.style.display = 'none';
    }
    
    // Update last updated time
    updateLastUpdatedTime();
}

// Update affiliate transaction table
function updateAffiliateTransactionTable(transactionsSnapshot) {
    if (transactionsSnapshot.empty) {
        affiliateTransactionTable.innerHTML = '<tr><td colspan="4" style="text-align: center;">No affiliate transactions yet</td></tr>';
        return;
    }
    
    let tableHTML = '';
    transactionsSnapshot.forEach(doc => {
        const transaction = doc.data();
        const date = transaction.createdAt ? transaction.createdAt.toDate().toLocaleDateString() : 'N/A';
        const currencySymbol = userCountry === 'nigeria' ? '₦' : 'USDT ';
        
        tableHTML += `
            <tr>
                <td>${date}</td>
                <td>${transaction.giveawayTitle || 'N/A'}</td>
                <td>${currencySymbol}${transaction.commission || 0}</td>
                <td>${transaction.status || 'completed'}</td>
            </tr>
        `;
    });
    
    affiliateTransactionTable.innerHTML = tableHTML;
}

// Update affiliate links table
function updateAffiliateLinksTable(linksSnapshot) {
    const affiliateLinksList = document.getElementById('affiliateLinksList');
    if (!affiliateLinksList) return;
    
    if (linksSnapshot.empty) {
        affiliateLinksList.innerHTML = '<p style="text-align: center;">No active affiliate links</p>';
        return;
    }
    
    let tableHTML = `
        <table class="gift-cards-table">
            <thead>
                <tr>
                    <th>Giveaway</th>
                    <th>Link Code</th>
                    <th>Clicks</th>
                    <th>Conversions</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    linksSnapshot.forEach(doc => {
        const link = doc.data();
        
        tableHTML += `
            <tr>
                <td>${link.giveawayTitle || 'N/A'}</td>
                <td>${link.code}</td>
                <td>${link.clicks || 0}</td>
                <td>${link.conversions || 0}</td>
                <td>
                    <div class="transaction-actions">
                        <button class="btn btn-info btn-sm" onclick="copyAffiliateLink('${link.code}', '${link.giveawayId}')">Copy Link</button>
                        <button class="btn btn-danger btn-sm" onclick="deactivateAffiliateLink('${doc.id}')">Deactivate</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    affiliateLinksList.innerHTML = tableHTML;
}

// Copy affiliate link
function copyAffiliateLink(code, giveawayId) {
    const affiliateLink = `${window.location.origin}?giveaway=${giveawayId}&affiliate=${code}`;
    navigator.clipboard.writeText(affiliateLink).then(() => {
        showNotification('Affiliate link copied to clipboard!', 'success');
    });
}

// Deactivate affiliate link
async function deactivateAffiliateLink(linkId) {
    try {
        await db.collection('affiliateLinks').doc(linkId).update({
            isActive: false
        });
        
        // Update active links count
        activeLinks--;
        await db.collection('affiliates').doc(user.uid).update({
            activeLinks: firebase.firestore.FieldValue.increment(-1)
        });
        
        updateAffiliateStats();
        
        showNotification('Affiliate link deactivated!', 'success');
    } catch (error) {
        console.error("Error deactivating affiliate link:", error);
        alert('Error deactivating affiliate link: ' + error.message);
    }
}

// Modal functions
function openModal(modal) {
    console.log("Opening modal:", modal.id);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    console.log("Closing modal:", modal.id);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function closeAllModals() {
    modals.forEach(modal => {
        closeModal(modal);
    });
}

// Game functions
function startGame() {
    console.log("Start game clicked");
    if (!isRunning) {
        isRunning = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        startTime = Date.now();
        
        timerInterval = setInterval(() => {
            currentTime = Date.now() - startTime;
            updateTimerDisplay(currentTime);
        }, 10);
    }
}

function stopGame() {
    console.log("Stop game clicked");
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.disabled = false;
        stopBtn.disabled = true;
        
        const finalTime = currentTime / 1000;
        processGameResult(finalTime);
        
        // Reset timer
        currentTime = 0;
        updateTimerDisplay(currentTime);
    }
}

// Process game result and save to Firestore
async function processGameResult(finalTime) {
    try {
        // Update user stats
        gamesPlayed++;
        if (bestTime === 0 || finalTime < bestTime) {
            bestTime = finalTime;
        }
        
        // Update UI
        updateStats();
        
        // Save to Firestore
        if (user) {
            await db.collection('users').doc(user.uid).update({
                gamesPlayed: firebase.firestore.FieldValue.increment(1),
                bestTime: bestTime
            });
            
            // Create transaction record
            const timeDiff = Math.abs(finalTime - getGameSettings().winningTime);
            const isWinner = timeDiff <= 0.1;
            const winAmount = userCountry === 'nigeria' ? 100 : 0.5;
            
            await db.collection('transactions').add({
                userId: user.uid,
                type: isWinner ? 'Game Win' : 'Game Play',
                amount: isWinner ? winAmount : -getGameSettings().gamePrice,
                status: 'completed',
                gameTime: finalTime,
                isWinner: isWinner,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Update wallet if winner
            if (isWinner) {
                walletBalance += winAmount;
                updateWalletBalance();
                await db.collection('users').doc(user.uid).update({
                    walletBalance: firebase.firestore.FieldValue.increment(winAmount)
                });
                
                // Show winner details modal for normal game
                if (!currentGiveaway) {
                    openModal(winnerDetailsModal);
                }
            }
            
            // Update gift card usage if active
            if (activeGiftCard) {
                const gameCost = getGameSettings().gamePrice;
                activeGiftCard.remainingBalance -= gameCost;
                
                if (activeGiftCard.remainingBalance <= 0) {
                    // Gift card is exhausted
                    activeGiftCard.remainingBalance = 0;
                    await db.collection('giftCards').doc(activeGiftCard.id).update({
                        remainingBalance: 0,
                        isActive: false
                    });
                    
                    activeGiftCard = null;
                    giftcardInfo.style.display = 'none';
                    payGameBtn.style.display = 'block';
                    startBtn.disabled = true;
                } else {
                    // Update gift card balance
                    giftcardBalance.textContent = `${getCurrencySymbol()}${activeGiftCard.remainingBalance}`;
                    await db.collection('giftCards').doc(activeGiftCard.id).update({
                        remainingBalance: activeGiftCard.remainingBalance
                    });
                }
            }
            
            showGameResult(finalTime, isWinner);
        }
        
    } catch (error) {
        console.error("Error processing game result:", error);
    }
}

function updateTimerDisplay(time) {
    const seconds = Math.floor(time / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    timerDisplay.textContent = `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

function showGameResult(time, isWinner) {
    const resultContent = document.getElementById('resultContent');
    const winAmount = userCountry === 'nigeria' ? 100 : 0.5;
    
    if (isWinner) {
        resultContent.innerHTML = `
            <h3>Congratulations! You Won!</h3>
            <p>You stopped the timer at ${time.toFixed(2)} seconds!</p>
            <p>The target time was ${getGameSettings().winningTime} seconds.</p>
            <p>You've won ${getCurrencySymbol()}${winAmount}!</p>
            <button class="btn btn-success" onclick="closeModal(resultModal)">Continue</button>
        `;
    } else {
        resultContent.innerHTML = `
            <h3>Better Luck Next Time!</h3>
            <p>You stopped the timer at ${time.toFixed(2)} seconds.</p>
            <p>The target time was ${getGameSettings().winningTime} seconds.</p>
            <button class="btn btn-primary" onclick="closeModal(resultModal)">Try Again</button>
        `;
    }
    
    openModal(resultModal);
}

// Gift card paste functionality
async function pasteGiftCardCode() {
    try {
        const text = await navigator.clipboard.readText();
        giftcardCodeInput.value = text.toUpperCase();
        showNotification('Gift card code pasted!', 'success');
    } catch (error) {
        console.error('Failed to read clipboard: ', error);
        showNotification('Failed to paste from clipboard', 'error');
    }
}

// Gift card validation with attempt tracking
async function validateGiftcard() {
    const code = giftcardCodeInput.value.trim().toUpperCase();
    
    if (!code) {
        alert('Please enter a gift card code');
        return;
    }
    
    // Check if user is blocked
    if (failedGiftCardAttempts >= MAX_GIFTCARD_ATTEMPTS) {
        alert('Your account has been blocked due to too many failed gift card attempts. Please contact customer care.');
        return;
    }
    
    try {
        // Check if gift card exists and is valid
        const giftCardSnapshot = await db.collection('giftCards')
            .where('code', '==', code)
            .where('isActive', '==', true)
            .get();
        
        if (giftCardSnapshot.empty) {
            failedGiftCardAttempts++;
            const attemptsLeft = MAX_GIFTCARD_ATTEMPTS - failedGiftCardAttempts;
            
            // Update user's failed attempts
            await db.collection('users').doc(user.uid).update({
                failedGiftCardAttempts: failedGiftCardAttempts
            });
            
            if (attemptsLeft > 0) {
                alert(`Invalid gift card code. ${attemptsLeft} attempts remaining before ban.`);
            } else {
                // Ban user
                await db.collection('users').doc(user.uid).update({
                    isBlocked: true
                });
                alert('Your account has been blocked due to too many failed gift card attempts.');
            }
            return;
        }
        
        const giftCardDoc = giftCardSnapshot.docs[0];
        const giftCardData = giftCardDoc.data();
        
        if (giftCardData.remainingBalance <= 0) {
            failedGiftCardAttempts++;
            const attemptsLeft = MAX_GIFTCARD_ATTEMPTS - failedGiftCardAttempts;
            
            await db.collection('users').doc(user.uid).update({
                failedGiftCardAttempts: failedGiftCardAttempts
            });
            
            if (attemptsLeft > 0) {
                alert(`This gift card has no remaining balance. ${attemptsLeft} attempts remaining before ban.`);
            } else {
                await db.collection('users').doc(user.uid).update({
                    isBlocked: true
                });
                alert('Your account has been blocked due to too many failed gift card attempts.');
            }
            return;
        }
        
        // Reset failed attempts on successful validation
        if (failedGiftCardAttempts > 0) {
            failedGiftCardAttempts = 0;
            await db.collection('users').doc(user.uid).update({
                failedGiftCardAttempts: 0
            });
        }
        
        // Show success animation
        successAnimation.style.display = 'flex';
        playSuccessSound();
        
        // Set active gift card
        activeGiftCard = {
            id: giftCardDoc.id,
            code: code,
            value: giftCardData.value,
            remainingBalance: giftCardData.remainingBalance
        };
        
        // Update UI
        targetTimeValue.textContent = getGameSettings().winningTime.toFixed(2);
        targetTimeDisplay.style.display = 'block';
        activeCardCode.textContent = code;
        giftcardBalance.textContent = `${getCurrencySymbol()}${activeGiftCard.remainingBalance}`;
        giftcardInfo.style.display = 'block';
        
        // Enable game after delay
        setTimeout(() => {
            validateGiftcardBtn.disabled = true;
            giftcardCodeInput.disabled = true;
            
            setTimeout(() => {
                closeModal(giftCardValidationModal);
                startBtn.disabled = false;
                payGameBtn.style.display = 'none';
            }, 1000);
        }, 2000);
        
    } catch (error) {
        console.error("Error validating gift card:", error);
        alert('Error validating gift card. Please try again.');
    }
}

function playSuccessSound() {
    // Simple success sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        
        oscillator.start();
        oscillator.frequency.exponentialRampToValueAtTime(659.25, audioContext.currentTime + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(783.99, audioContext.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log("Audio not supported");
    }
}

// Form handlers
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        closeModal(loginModal);
        showNotification('Login successful!', 'success');
    } catch (error) {
        console.error("Login error:", error);
        alert('Login failed: ' + error.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const isAffiliate = document.getElementById('registerAffiliate').checked;
    const country = userCountryInput.value;
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        // Create user document
        await db.collection('users').doc(userCredential.user.uid).set({
            email: email,
            name: name,
            gamesPlayed: 0,
            bestTime: 0,
            walletBalance: 0,
            giftCardBalance: 0,
            giveawayCashbackBalance: 0,
            isAdmin: false,
            isAffiliate: isAffiliate,
            isCustomerCare: false,
            isBlocked: false,
            country: country,
            isVerified: false,
            verificationType: 'none',
            failedGiftCardAttempts: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Create affiliate document if user registered as affiliate
        if (isAffiliate) {
            await db.collection('affiliates').doc(userCredential.user.uid).set({
                userId: userCredential.user.uid,
                totalEarnings: 0,
                availableBalance: 0,
                referredUsers: 0,
                activeLinks: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        closeModal(registerModal);
        showNotification('Registration successful!', 'success');
    } catch (error) {
        console.error("Registration error:", error);
        alert('Registration failed: ' + error.message);
    }
}

// Handle fund wallet submission with payment details
async function handleFundWallet(e) {
    e.preventDefault();
    const name = document.getElementById('fundName').value;
    const email = document.getElementById('fundEmail').value;
    const amount = parseFloat(document.getElementById('fundAmount').value);
    const paymentDescription = document.getElementById('paymentDescription').value;
    const accountDetails = document.getElementById('accountDetails').value;
    
    if (!name || !email || !amount || !paymentDescription || !accountDetails) {
        alert('Please fill all fields');
        return;
    }
    
    try {
        // Create pending transaction record with payment details
        await db.collection('transactions').add({
            userId: user.uid,
            type: 'Wallet Funding',
            amount: amount,
            status: 'pending',
            name: name,
            email: email,
            country: userCountry,
            paymentDescription: paymentDescription,
            accountDetails: accountDetails,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification(`Funding request submitted for ${getCurrencySymbol()}${amount}. Please wait for admin approval.`, 'success');
        closeModal(document.getElementById('fundWalletModal'));
        
        // Reset form
        document.getElementById('fundWalletForm').reset();
        fundWalletDropdown.classList.remove('active');
        
    } catch (error) {
        console.error("Error submitting funding request:", error);
        alert('Error submitting funding request: ' + error.message);
    }
}

// Generate gift cards with proper wallet deduction
async function handleGiftCardGeneration(e) {
    e.preventDefault();
    
    if (!user) {
        alert('Please log in to generate gift cards');
        return;
    }
    
    const giftCardType = giftCardTypeInput.value;
    let amount, cardCount, cardValue;
    
    if (giftCardType === 'single') {
        amount = parseFloat(giftCardAmount.value);
        cardCount = 1;
        cardValue = amount;
    } else {
        amount = parseFloat(bulkGiftCardAmount.value);
        cardValue = 100; // ₦100 per card
        cardCount = Math.floor(amount / cardValue);
    }
    
    // Validate amount
    if (amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (giftCardType === 'bulk' && cardCount < 1) {
        alert('Amount must be at least ₦100 for bulk gift cards');
        return;
    }
    
    // Check if user has enough balance
    if (walletBalance < amount) {
        alert(`Insufficient balance. You need ${getCurrencySymbol()}${amount} to generate gift cards.`);
        return;
    }
    
    try {
        const codes = [];
        
        // Generate gift cards
        for (let i = 0; i < cardCount; i++) {
            const code = await generateUniqueGiftCardCode();
            codes.push(code);
            
            // Create gift card in Firestore
            await db.collection('giftCards').add({
                code: code,
                value: cardValue,
                remainingBalance: cardValue,
                userId: user.uid,
                isActive: true,
                wins: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Deduct amount from wallet
        await db.collection('users').doc(user.uid).update({
            walletBalance: firebase.firestore.FieldValue.increment(-amount),
            giftCardBalance: firebase.firestore.FieldValue.increment(cardCount)
        });
        
        // Create transaction record
        await db.collection('transactions').add({
            userId: user.uid,
            type: 'Gift Card Purchase',
            amount: -amount,
            status: 'completed',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update UI
        walletBalance -= amount;
        giftCardBalance += cardCount;
        updateWalletBalance();
        
        // Show gift card codes
        giftcardCodesList.innerHTML = '';
        codes.forEach(code => {
            const codeDiv = document.createElement('div');
            codeDiv.className = 'giftcard-code';
            codeDiv.textContent = code;
            giftcardCodesList.appendChild(codeDiv);
            
            // Add copy button for each code
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            copyBtn.onclick = () => copyGiftCardCode(code);
            giftcardCodesList.appendChild(copyBtn);
        });
        
        giftcardResult.style.display = 'block';
        
        showNotification(`Successfully generated ${cardCount} gift card(s)!`, 'success');
        
    } catch (error) {
        console.error("Error generating gift cards:", error);
        alert('Error generating gift cards: ' + error.message);
    }
}

// Generate vendor cards (admin function)
async function handleVendorCardGeneration(e) {
    e.preventDefault();
    
    const cardCount = parseInt(document.getElementById('vendorCardCount').value);
    const cardValue = parseInt(document.getElementById('vendorCardValue').value);
    
    try {
        // Generate vendor cards
        const vendorCardCodes = [];
        for (let i = 0; i < cardCount; i++) {
            const code = await generateUniqueGiftCardCode();
            vendorCardCodes.push(code);
            
            // Create vendor card in Firestore
            await db.collection('giftCards').add({
                code: code,
                value: cardValue,
                remainingBalance: cardValue,
                isVendorCard: true,
                isActive: true,
                wins: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Show vendor card codes
        vendorCardCodesList.innerHTML = '';
        vendorCardCodes.forEach(code => {
            const codeDiv = document.createElement('div');
            codeDiv.className = 'giftcard-code';
            codeDiv.textContent = code;
            vendorCardCodesList.appendChild(codeDiv);
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            copyBtn.onclick = () => copyGiftCardCode(code);
            vendorCardCodesList.appendChild(copyBtn);
        });
        
        vendorCardResult.style.display = 'block';
        
        showNotification(`Successfully generated ${cardCount} vendor cards!`, 'success');
        
    } catch (error) {
        console.error("Error generating vendor cards:", error);
        alert('Error generating vendor cards: ' + error.message);
    }
}

// Assign gift cards (admin function)
async function handleAssignCard(e) {
    e.preventDefault();
    
    const userId = assignUser.value;
    const cardCount = parseInt(document.getElementById('assignCardCount').value);
    const cardValue = parseInt(document.getElementById('assignCardValue').value);
    
    try {
        // Generate and assign gift cards
        for (let i = 0; i < cardCount; i++) {
            const code = await generateUniqueGiftCardCode();
            
            // Create gift card in Firestore
            await db.collection('giftCards').add({
                code: code,
                value: cardValue,
                remainingBalance: cardValue,
                userId: userId,
                isActive: true,
                wins: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Update user's gift card balance
        await db.collection('users').doc(userId).update({
            giftCardBalance: firebase.firestore.FieldValue.increment(cardCount)
        });
        
        showNotification(`Successfully assigned ${cardCount} gift cards to user!`, 'success');
        closeModal(document.getElementById('assignCardModal'));
        
    } catch (error) {
        console.error("Error assigning gift cards:", error);
        alert('Error assigning gift cards: ' + error.message);
    }
}

// Generate unique gift card code
async function generateUniqueGiftCardCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    let isUnique = false;
    
    while (!isUnique) {
        code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        // Check if code already exists
        const existingCode = await db.collection('giftCards')
            .where('code', '==', code)
            .get();
        
        isUnique = existingCode.empty;
    }
    
    return code;
}

// Giveaway creation
async function handleGiveawayCreation(e) {
    e.preventDefault();
    
    if (!user) {
        alert('Please log in to create a giveaway');
        return;
    }
    
    const giveawayType = giveawayTypeInput.value;
    const title = document.getElementById('giveawayTitle').value;
    const difficulty = document.getElementById('giveawayDifficulty').value;
    const participantLimit = parseInt(document.getElementById('participantLimit').value);
    const winnersLimit = parseInt(document.getElementById('winnersLimit').value);
    const startTime = document.getElementById('giveawayStart').value;
    const winningTime = parseFloat(document.getElementById('winningTime').value);
    const socialTask = document.getElementById('socialTask').value;
    const socialLink = document.getElementById('socialLink').value;
    
    try {
        // Calculate total cost
        let totalCost = 0;
        let giftcardCount = participantLimit;
        
        if (giveawayType === 'open') {
            totalCost = getGameSettings().openGiveawayPrice;
        } else {
            giftcardCount = parseInt(document.getElementById('giftcardCount').value);
            totalCost = giftcardCount * getGameSettings().gamePrice;
        }
        
        // Check if user has enough balance
        if (walletBalance < totalCost) {
            alert(`Insufficient balance. You need ${getCurrencySymbol()}${totalCost} to create this giveaway.`);
            return;
        }
        
        // Show payment modal
        paymentAmount.textContent = `${getCurrencySymbol()}${totalCost}`;
        paymentSlider.value = 0;
        paymentStatus.innerHTML = '';
        paymentSuccessAnimation.style.display = 'none';
        openModal(paymentModal);
        
        // Set up payment slider
        paymentSlider.oninput = async function() {
            if (this.value == 100) {
                // Payment confirmed
                paymentStatus.innerHTML = '<p class="payment-success">Payment confirmed! Creating giveaway...</p>';
                paymentSuccessAnimation.style.display = 'flex';
                playSuccessSound();
                
                // Wait for animation to complete
                setTimeout(async () => {
                    // Generate unique giveaway ID
                    const giveawayId = db.collection('giveaways').doc().id;
                    
                    // Get user verification status
                    const userDoc = await db.collection('users').doc(user.uid).get();
                    const userData = userDoc.data();
                    
                    // Create giveaway document
                    const giveawayData = {
                        id: giveawayId,
                        creatorId: user.uid,
                        creatorName: user.displayName,
                        creatorCountry: userCountry,
                        creatorVerified: userData.isVerified || false,
                        creatorVerificationType: userData.verificationType || 'none',
                        title: title,
                        type: giveawayType,
                        difficulty: difficulty,
                        participantLimit: participantLimit,
                        winnersLimit: winnersLimit,
                        currentParticipants: 0,
                        startTime: new Date(startTime),
                        winningTime: winningTime,
                        socialTask: socialTask,
                        socialLink: socialLink,
                        isActive: true,
                        isPublic: giveawayType === 'open',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    
                    // Generate gift cards for the giveaway
                    const generatedGiftCards = [];
                    if (giveawayType === 'giftcard') {
                        for (let i = 0; i < giftcardCount; i++) {
                            const code = await generateUniqueGiftCardCode();
                            generatedGiftCards.push(code);
                            
                            // Create gift card for the giveaway
                            await db.collection('giftCards').add({
                                code: code,
                                value: getGameSettings().gamePrice,
                                remainingBalance: getGameSettings().gamePrice,
                                giveawayId: giveawayId,
                                creatorId: user.uid,
                                isActive: true,
                                wins: 0,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp()
                            });
                        }
                    }
                    
                    // Deduct the cost from wallet
                    await db.collection('users').doc(user.uid).update({
                        walletBalance: firebase.firestore.FieldValue.increment(-totalCost)
                    });
                    
                    // Create transaction record
                    await db.collection('transactions').add({
                        userId: user.uid,
                        type: 'Giveaway Creation',
                        amount: -totalCost,
                        status: 'completed',
                        giveawayId: giveawayId,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    
                    walletBalance -= totalCost;
                    updateWalletBalance();
                    
                    // Save giveaway
                    await db.collection('giveaways').doc(giveawayId).set(giveawayData);
                    
                    closeModal(paymentModal);
                    
                    // Show giveaway created section
                    giveawayForm.style.display = 'none';
                    giveawayCreatedSection.style.display = 'block';
                    
                    // Set giveaway link
                    const giveawayLink = `${window.location.origin}?giveaway=${giveawayId}`;
                    giveawayLinkInput.value = giveawayLink;
                    
                    // Show generated gift cards
                    generatedGiftCardsCount.textContent = generatedGiftCards.length;
                    if (generatedGiftCards.length > 0) {
                        let giftCardsHTML = '<h4>Generated Gift Cards:</h4>';
                        generatedGiftCards.forEach(code => {
                            giftCardsHTML += `
                                <div class="giftcard-code">${code}</div>
                                <button class="copy-btn" onclick="copyGiftCardCode('${code}')">
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                            `;
                        });
                        generatedGiftCardsList.innerHTML = giftCardsHTML;
                    }
                    
                    showNotification('Giveaway created successfully!', 'success');
                    
                    // Load user giveaways
                    loadUserGiveaways();
                    
                }, 2000);
            } else {
                paymentStatus.innerHTML = '';
                paymentSuccessAnimation.style.display = 'none';
            }
        };
        
    } catch (error) {
        console.error("Error creating giveaway:", error);
        alert('Error creating giveaway: ' + error.message);
    }
}

// Load user giveaways with real-time updates
async function loadUserGiveaways() {
    try {
        db.collection('giveaways')
            .where('creatorId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                updateGiveawayTable(snapshot);
            });
    } catch (error) {
        console.error("Error loading giveaways:", error);
    }
}

// Update giveaway table
function updateGiveawayTable(giveawaysSnapshot) {
    if (giveawaysSnapshot.empty) {
        document.getElementById('giveawayTable').innerHTML = '<tr><td colspan="5" style="text-align: center;">No giveaways yet</td></tr>';
        return;
    }
    
    let tableHTML = '';
    giveawaysSnapshot.forEach(doc => {
        const giveaway = doc.data();
        const startTime = giveaway.startTime ? giveaway.startTime.toDate().toLocaleDateString() : 'N/A';
        const status = giveaway.isActive ? 'Active' : 'Ended';
        
        tableHTML += `
            <tr>
                <td>${giveaway.title}</td>
                <td>${giveaway.type}</td>
                <td>${giveaway.currentParticipants}/${giveaway.participantLimit}</td>
                <td>${status}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewGiveaway('${giveaway.id}')">View</button>
                    <button class="btn btn-sm btn-warning" onclick="copyGiveawayLink('${giveaway.id}')">Copy Link</button>
                </td>
            </tr>
        `;
    });
    
    document.getElementById('giveawayTable').innerHTML = tableHTML;
}

// Copy giveaway link
function copyGiveawayLink(giveawayId) {
    const link = `${window.location.origin}?giveaway=${giveawayId}`;
    navigator.clipboard.writeText(link).then(() => {
        showNotification('Giveaway link copied to clipboard!', 'success');
    });
}

// View giveaway
function viewGiveaway(giveawayId) {
    // Redirect to giveaway page or open in modal
    window.open(`?giveaway=${giveawayId}`, '_blank');
}

// Load all giveaways for admin management
async function loadAllGiveaways() {
    try {
        db.collection('giveaways')
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                updateGiveawaysTable(snapshot);
            });
    } catch (error) {
        console.error("Error loading giveaways:", error);
    }
}

// Update giveaways table for admin
function updateGiveawaysTable(giveawaysSnapshot) {
    const searchTerm = searchGiveawaysAdmin.value.toLowerCase();
    
    if (giveawaysSnapshot.empty) {
        giveawaysTable.innerHTML = '<tr><td colspan="7" style="text-align: center;">No giveaways found</td></tr>';
        return;
    }
    
    let tableHTML = '';
    
    giveawaysSnapshot.forEach(doc => {
        const giveaway = doc.data();
        
        // Apply search filter
        if (searchTerm && !giveaway.title.toLowerCase().includes(searchTerm) && 
            !giveaway.creatorName.toLowerCase().includes(searchTerm)) {
            return;
        }
        
        const startTime = giveaway.startTime ? giveaway.startTime.toDate().toLocaleDateString() : 'N/A';
        const createdDate = giveaway.createdAt ? giveaway.createdAt.toDate().toLocaleDateString() : 'N/A';
        const status = giveaway.isActive ? 'Active' : 'Ended';
        const statusClass = giveaway.isActive ? 'status-valid' : 'status-used';
        
        tableHTML += `
            <tr>
                <td>${giveaway.title}</td>
                <td>${giveaway.creatorName}</td>
                <td>${giveaway.type}</td>
                <td>${giveaway.currentParticipants}/${giveaway.participantLimit}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>${createdDate}</td>
                <td>
                    <div class="transaction-actions">
                        <button class="btn btn-sm btn-info" onclick="viewGiveaway('${giveaway.id}')">View</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteGiveaway('${doc.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    if (tableHTML === '') {
        giveawaysTable.innerHTML = '<tr><td colspan="7" style="text-align: center;">No giveaways match your search</td></tr>';
    } else {
        giveawaysTable.innerHTML = tableHTML;
    }
}

// Delete giveaway (admin function)
async function deleteGiveaway(giveawayId) {
    if (confirm('Are you sure you want to delete this giveaway? This action cannot be undone.')) {
        try {
            await db.collection('giveaways').doc(giveawayId).delete();
            showNotification('Giveaway deleted successfully!', 'success');
        } catch (error) {
            console.error("Error deleting giveaway:", error);
            alert('Error deleting giveaway: ' + error.message);
        }
    }
}

// Load affiliate giveaways with real-time updates
async function loadAffiliateGiveaways() {
    try {
        db.collection('giveaways')
            .where('isActive', '==', true)
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                updateAffiliateGiveawayList(snapshot);
            });
    } catch (error) {
        console.error("Error loading affiliate giveaways:", error);
    }
}

// Update affiliate giveaway list
function updateAffiliateGiveawayList(giveawaysSnapshot) {
    if (giveawaysSnapshot.empty) {
        affiliateGiveawayList.innerHTML = '<p style="text-align: center;">No active giveaways available</p>';
        return;
    }
    
    let giveawayHTML = '';
    giveawaysSnapshot.forEach(doc => {
        const giveaway = doc.data();
        const verificationBadge = giveaway.creatorVerified ? 
            `<i class="fas ${giveaway.creatorVerificationType === 'gold' ? 'fa-certificate gold-badge' : 'fa-check-circle verified-badge'}"></i>` : '';
        
        giveawayHTML += `
            <div class="giveaway-card">
                <h3>${giveaway.title} ${verificationBadge}</h3>
                <p>Creator: ${giveaway.creatorName}</p>
                <p>Type: ${giveaway.type}</p>
                <p>Difficulty: ${giveaway.difficulty}</p>
                <div class="giveaway-meta">
                    <span>Participants: ${giveaway.currentParticipants}/${giveaway.participantLimit}</span>
                    <span>Commission: ${getGameSettings().affiliateCommission}%</span>
                </div>
                <div class="giveaway-actions">
                    <button class="btn btn-primary btn-sm" onclick="generateAffiliateLink('${giveaway.id}')">Generate Link</button>
                    <button class="btn btn-info btn-sm" onclick="viewGiveaway('${giveaway.id}')">View</button>
                </div>
            </div>
        `;
    });
    
    affiliateGiveawayList.innerHTML = giveawayHTML;
}

// Generate affiliate link
async function generateAffiliateLink(giveawayId) {
    try {
        // Generate unique affiliate code
        const affiliateCode = generateAffiliateCode();
        
        // Get giveaway details
        const giveawayDoc = await db.collection('giveaways').doc(giveawayId).get();
        const giveawayData = giveawayDoc.data();
        
        // Save affiliate link
        await db.collection('affiliateLinks').add({
            affiliateId: user.uid,
            giveawayId: giveawayId,
            giveawayTitle: giveawayData.title,
            code: affiliateCode,
            clicks: 0,
            conversions: 0,
            isActive: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update active links count
        activeLinks++;
        await db.collection('affiliates').doc(user.uid).update({
            activeLinks: firebase.firestore.FieldValue.increment(1)
        });
        
        updateAffiliateStats();
        
        const affiliateLink = `${window.location.origin}?giveaway=${giveawayId}&affiliate=${affiliateCode}`;
        navigator.clipboard.writeText(affiliateLink).then(() => {
            showNotification('Affiliate link copied to clipboard!', 'success');
        });
        
    } catch (error) {
        console.error("Error generating affiliate link:", error);
        alert('Error generating affiliate link: ' + error.message);
    }
}

// Generate unique affiliate code
function generateAffiliateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Request withdrawal with account details
async function requestWithdrawal() {
    try {
        if (giveawayCashbackBalance <= 0) {
            alert('No available balance for withdrawal');
            return;
        }
        
        const amount = giveawayCashbackBalance;
        const paymentMethod = prompt("Enter payment method (Bank Transfer, Crypto, etc.):");
        const accountDetails = prompt("Enter account details (Account Name/Number or Wallet Address):");
        
        if (!paymentMethod || !accountDetails) {
            alert('Payment method and account details are required');
            return;
        }
        
        // Create withdrawal request with payment details
        await db.collection('withdrawalRequests').add({
            userId: user.uid,
            type: 'giveaway_cashback',
            amount: amount,
            paymentMethod: paymentMethod,
            accountDetails: accountDetails,
            status: 'pending',
            country: userCountry,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Reset cashback balance
        giveawayCashbackBalance = 0;
        await db.collection('users').doc(user.uid).update({
            giveawayCashbackBalance: 0
        });
        
        updateWalletBalance();
        
        showNotification('Withdrawal request submitted successfully!', 'success');
        
    } catch (error) {
        console.error("Error requesting withdrawal:", error);
        alert('Error requesting withdrawal: ' + error.message);
    }
}

// Request affiliate withdrawal with account details
async function requestAffiliateWithdrawal() {
    try {
        if (affiliateBalance <= 0) {
            alert('No available balance for withdrawal');
            return;
        }
        
        const amount = affiliateBalance;
        const paymentMethod = prompt("Enter payment method (Bank Transfer, Crypto, etc.):");
        const accountDetails = prompt("Enter account details (Account Name/Number or Wallet Address):");
        
        if (!paymentMethod || !accountDetails) {
            alert('Payment method and account details are required');
            return;
        }
        
        // Create withdrawal request with payment details
        await db.collection('withdrawalRequests').add({
            userId: user.uid,
            type: 'affiliate',
            amount: amount,
            paymentMethod: paymentMethod,
            accountDetails: accountDetails,
            status: 'pending',
            country: userCountry,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Reset affiliate balance
        affiliateBalance = 0;
        await db.collection('affiliates').doc(user.uid).update({
            availableBalance: 0
        });
        
        updateAffiliateStats();
        
        showNotification('Withdrawal request submitted successfully!', 'success');
        
    } catch (error) {
        console.error("Error requesting affiliate withdrawal:", error);
        alert('Error requesting affiliate withdrawal: ' + error.message);
    }
}

// Update UI functions
function updateStats() {
    gamesPlayedEl.textContent = gamesPlayed;
    bestTimeEl.textContent = formatTime(bestTime * 1000);
}

function updateWalletBalance() {
    walletBalanceEl.textContent = `${getCurrencySymbol()}${walletBalance.toFixed(2)}`;
    giftCardBalanceEl.textContent = giftCardBalance;
    giveawayCashbackBalanceEl.textContent = `${getCurrencySymbol()}${giveawayCashbackBalance.toFixed(2)}`;
}

function formatTime(time) {
    const seconds = Math.floor(time / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

function updateSidebarMenu() {
    sidebarMenu.innerHTML = '';
    
    const menuItems = [
        { id: 'gameSection', icon: 'fa-gamepad', text: 'Play Game', show: true },
        { id: 'dashboardSection', icon: 'fa-tachometer-alt', text: 'Dashboard', show: user !== null },
        { id: 'affiliateSection', icon: 'fa-handshake', text: 'Affiliate', show: user !== null && isAffiliate },
        { id: 'giveawaySection', icon: 'fa-gift', text: 'Create Giveaway', show: user !== null },
        { id: 'giveawayHuntSection', icon: 'fa-search', text: 'Giveaway Hunt', show: true },
        { id: 'shopSection', icon: 'fa-shopping-cart', text: 'Shop', show: true },
    ];
    
    menuItems.forEach(item => {
        if (item.show) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.innerHTML = `<i class="fas ${item.icon}"></i> ${item.text}`;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                showSection(item.id);
                if (window.innerWidth <= 900) {
                    sidebar.classList.remove('active');
                }
            });
            li.appendChild(a);
            sidebarMenu.appendChild(li);
        }
    });
}

function showSection(sectionId) {
    console.log("Showing section:", sectionId);
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Check if user is logged in for protected sections
    if ((sectionId === 'dashboardSection' || sectionId === 'giveawaySection' || sectionId === 'affiliateSection') && !user) {
        const section = document.getElementById(sectionId);
        const originalContent = section.innerHTML;
        
        section.innerHTML = `
            <div class="login-required">
                <h2>Login Required</h2>
                <p>Please log in to access the ${sectionId === 'dashboardSection' ? 'Dashboard' : sectionId === 'giveawaySection' ? 'Giveaway' : 'Affiliate'} section.</p>
                <button class="btn btn-primary" onclick="openModal(loginModal)">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
            </div>
        `;
        section.classList.add('active');
        
        // Restore original content when user logs in
        setTimeout(() => {
            section.innerHTML = originalContent;
        }, 0);
    } else {
        document.getElementById(sectionId).classList.add('active');
        
        // Load section-specific data
        if (sectionId === 'affiliateSection' && user && isAffiliate) {
            loadAffiliateGiveaways();
        } else if (sectionId === 'giveawaySection' && user) {
            loadUserGiveaways();
        } else if (sectionId === 'giveawayHuntSection') {
            loadPublicGiveaways();
        }
    }
}

function toggleSidebar() {
    sidebar.classList.toggle('active');
}

function updateSocialLinks() {
    const socialContainers = [
        'gameSocialLinks',
        'dashboardSocialLinks', 
        'giveawaySocialLinks',
        'shopSocialLinks',
        'giveawayEndedSocialLinks',
        'affiliateSocialLinks',
        'giveawayHuntSocialLinks'
    ];
    
    socialContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            
            Object.entries(socialSettings).forEach(([platform, url]) => {
                if (url) {
                    const iconClass = platform === 'youtube' ? 'fab fa-youtube' : 
                                    platform === 'tiktok' ? 'fab fa-tiktok' :
                                    platform === 'twitter' ? 'fab fa-twitter' :
                                    platform === 'facebook' ? 'fab fa-facebook' :
                                    platform === 'instagram' ? 'fab fa-instagram' : '';
                    
                    if (iconClass) {
                        container.innerHTML += `<a href="${url}" target="_blank"><i class="${iconClass}"></i></a>`;
                    }
                }
            });
        }
    });
}

// Update last updated time
function updateLastUpdatedTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    lastUpdatedEl.textContent = timeString;
}

// Refresh transactions manually
function refreshTransactions() {
    if (user) {
        // This will trigger the real-time listener to update
        updateLastUpdatedTime();
        showNotification('Transactions refreshed!', 'success');
    }
}

// Refresh withdrawal requests manually
function refreshWithdrawalRequests() {
    if (isAdmin) {
        // This will trigger the real-time listener to update
        showNotification('Withdrawal requests refreshed!', 'success');
    }
}

// Refresh pending transactions manually
function refreshPendingTransactions() {
    if (isAdmin) {
        // This will trigger the real-time listener to update
        showNotification('Payment requests refreshed!', 'success');
    }
}

// Refresh gift cards manually
function refreshGiftCards() {
    if (user) {
        // This will trigger the real-time listener to update
        showNotification('Gift cards refreshed!', 'success');
    }
}

// Refresh all gift cards manually
function refreshAllGiftCards() {
    if (user) {
        // This will trigger the real-time listener to update
        showNotification('All gift cards refreshed!', 'success');
    }
}

// Refresh giveaways manually
function refreshGiveaways() {
    if (isAdmin) {
        // This will trigger the real-time listener to update
        showNotification('Giveaways refreshed!', 'success');
    }
}

// Gift card management filters
function setupGiftCardFilters() {
    // User gift card filter
    giftCardFilter.addEventListener('change', function() {
        // This will trigger when the available gift cards are loaded
        showNotification('Gift cards filtered!', 'success');
    });
    
    // All gift cards filter
    allGiftCardsFilter.addEventListener('change', function() {
        // This will trigger when all gift cards are loaded
        showNotification('All gift cards filtered!', 'success');
    });
    
    // Search gift cards
    searchGiftCards.addEventListener('input', 
        debounce(function() {
            // This would filter the admin gift cards table
            showNotification('Searching gift cards...', 'info');
        }, 300)
    );
}

// Auth state handler
async function handleAuthStateChanged(firebaseUser) {
    if (firebaseUser) {
        user = firebaseUser;
        console.log("User signed in:", user.email);
        updateUIForLoggedInUser();
        
        // Load user data and configuration
        await loadConfiguration();
        await loadUserData(user.uid);
        
        // Update sidebar to show protected sections
        updateSidebarMenu();
    } else {
        user = null;
        console.log("User signed out");
        updateUIForLoggedOutUser();
        
        // Reset user data
        gamesPlayed = 0;
        bestTime = 0;
        walletBalance = 0;
        giftCardBalance = 0;
        giveawayCashbackBalance = 0;
        affiliateEarnings = 0;
        affiliateBalance = 0;
        referredUsers = 0;
        activeLinks = 0;
        failedGiftCardAttempts = 0;
        updateStats();
        updateWalletBalance();
        updateAffiliateStats();
        
        // Update sidebar to hide protected sections
        updateSidebarMenu();
        
        // If user is on a protected section, redirect to game section
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection && (activeSection.id === 'dashboardSection' || activeSection.id === 'giveawaySection' || activeSection.id === 'affiliateSection')) {
            showSection('gameSection');
        }
    }
}

function updateUIForLoggedInUser() {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
}

function updateUIForLoggedOutUser() {
    loginBtn.style.display = 'block';
    registerBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    adminSection.style.display = 'none';
}

function logout() {
    console.log("Logout clicked");
    if (auth) {
        auth.signOut();
    }
    updateUIForLoggedOutUser();
    showNotification('Logged out successfully!', 'success');
}

// Show notification popup
function showNotification(message, type = 'info') {
    notificationContent.textContent = message;
    notificationPopup.className = `notification-popup ${type}`;
    notificationPopup.style.display = 'flex';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        closeNotification();
    }, 5000);
}

// Close notification
function closeNotification() {
    notificationPopup.style.display = 'none';
}

// Utility function to debounce function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize everything
function init() {
    console.log("Initializing application...");
    
    // Initialize Firebase from external config
    if (typeof firebaseConfig !== 'undefined') {
        initializeFirebase();
    } else {
        console.error("Firebase configuration not found. Please check config.js");
        alert("Firebase configuration not found. Please check config.js");
        return;
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize UI
    updateTimerDisplay(currentTime);
    updateStats();
    updateWalletBalance();
    updateAffiliateStats();
    updateSidebarMenu();
    
    console.log("Application initialized successfully");
}

// Export functions to global scope for HTML onclick handlers
window.copyGiftCardCode = copyGiftCardCode;
window.approveTransaction = approveTransaction;
window.declineTransaction = declineTransaction;
window.approveWithdrawal = approveWithdrawal;
window.declineWithdrawal = declineWithdrawal;
window.toggleVerification = toggleVerification;
window.debitUser = debitUser;
window.banUser = banUser;
window.viewGiveaway = viewGiveaway;
window.copyGiveawayLink = copyGiveawayLink;
window.generateAffiliateLink = generateAffiliateLink;
window.validateGiftcard = validateGiftcard;
window.viewGiftCardDetails = viewGiftCardDetails;
window.deactivateGiftCard = deactivateGiftCard;
window.activateGiftCard = activateGiftCard;
window.copyAffiliateLink = copyAffiliateLink;
window.deactivateAffiliateLink = deactivateAffiliateLink;
window.editTransactionAmount = editTransactionAmount;
window.sendUserNotification = sendUserNotification;
window.removeCustomerCareRole = removeCustomerCareRole;
window.playGiveawayHunt = playGiveawayHunt;
window.pasteGiftCardCode = pasteGiftCardCode;
window.deleteGiveaway = deleteGiveaway;

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
