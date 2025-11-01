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

// Initialize with default config
let gameSettings = JSON.parse(JSON.stringify(defaultGameSettings));
let socialSettings = JSON.parse(JSON.stringify(defaultSocialSettings));

// Firebase services
let db, auth;

// DOM elements cache
const elements = {};

// Initialize Firebase
function initializeFirebase() {
    try {
        if (!firebaseConfig) {
            throw new Error("Firebase configuration not found.");
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
        showNotification('Error initializing Firebase: ' + error.message, 'error');
    }
}

// Cache DOM elements
function cacheDOMElements() {
    // Game elements
    elements.timerDisplay = document.getElementById('timerDisplay');
    elements.startBtn = document.getElementById('startBtn');
    elements.stopBtn = document.getElementById('stopBtn');
    elements.payGameBtn = document.getElementById('payGameBtn');
    elements.gamesPlayedEl = document.getElementById('gamesPlayed');
    elements.bestTimeEl = document.getElementById('bestTime');
    elements.walletBalanceEl = document.getElementById('walletBalance');
    elements.giftCardBalanceEl = document.getElementById('giftCardBalance');
    elements.giveawayCashbackBalanceEl = document.getElementById('giveawayCashbackBalance');
    
    // Auth elements
    elements.loginBtn = document.getElementById('loginBtn');
    elements.registerBtn = document.getElementById('registerBtn');
    elements.logoutBtn = document.getElementById('logoutBtn');
    
    // Dashboard elements
    elements.fundWalletBtn = document.getElementById('fundWalletBtn');
    elements.generateGiftCardBtn = document.getElementById('generateGiftCardBtn');
    elements.customerCareBtn = document.getElementById('customerCareBtn');
    elements.requestWithdrawalBtn = document.getElementById('requestWithdrawalBtn');
    
    // Admin elements
    elements.adminSection = document.getElementById('adminSection');
    elements.manageUsersBtn = document.getElementById('manageUsersBtn');
    elements.viewMessagesBtn = document.getElementById('viewMessagesBtn');
    elements.manageGiftCardsBtn = document.getElementById('manageGiftCardsBtn');
    elements.generateVendorCardBtn = document.getElementById('generateVendorCardBtn');
    elements.assignCardBtn = document.getElementById('assignCardBtn');
    elements.gameSettingsBtn = document.getElementById('gameSettingsBtn');
    elements.socialSettingsBtn = document.getElementById('socialSettingsBtn');
    elements.withdrawalRequestsBtn = document.getElementById('withdrawalRequestsBtn');
    elements.pendingTransactionsBtn = document.getElementById('pendingTransactionsBtn');
    elements.customerCareManagementBtn = document.getElementById('customerCareManagementBtn');
    
    // Modal elements
    elements.modals = document.querySelectorAll('.modal');
    elements.loginModal = document.getElementById('loginModal');
    elements.registerModal = document.getElementById('registerModal');
    elements.fundWalletModal = document.getElementById('fundWalletModal');
    elements.customerCareModal = document.getElementById('customerCareModal');
    elements.generateGiftCardModal = document.getElementById('generateGiftCardModal');
    elements.giftCardValidationModal = document.getElementById('giftCardValidationModal');
    elements.paymentModal = document.getElementById('paymentModal');
    elements.resultModal = document.getElementById('resultModal');
    elements.winnerDetailsModal = document.getElementById('winnerDetailsModal');
    
    // Form elements
    elements.loginForm = document.getElementById('loginForm');
    elements.registerForm = document.getElementById('registerForm');
    elements.fundWalletForm = document.getElementById('fundWalletForm');
    elements.customerCareForm = document.getElementById('customerCareForm');
    elements.giftCardForm = document.getElementById('giftCardForm');
    elements.giveawayForm = document.getElementById('giveawayForm');
    elements.winnerForm = document.getElementById('winnerForm');
    
    // Other important elements
    elements.menuToggle = document.getElementById('menuToggle');
    elements.sidebar = document.getElementById('sidebar');
    elements.mainContent = document.getElementById('mainContent');
    elements.sidebarMenu = document.getElementById('sidebarMenu');
    elements.contentSections = document.querySelectorAll('.content-section');
    elements.validateGiftcardBtn = document.getElementById('validateGiftcardBtn');
    elements.giftcardCodeInput = document.getElementById('giftcardCode');
    elements.pasteGiftcardCode = document.getElementById('pasteGiftcardCode');
    
    console.log("DOM elements cached successfully");
}

// Setup event listeners
function setupEventListeners() {
    console.log("Setting up event listeners...");
    
    // Game controls
    if (elements.startBtn) elements.startBtn.addEventListener('click', startGame);
    if (elements.stopBtn) elements.stopBtn.addEventListener('click', stopGame);
    if (elements.payGameBtn) elements.payGameBtn.addEventListener('click', () => openModal(elements.giftCardValidationModal));
    
    // Auth controls
    if (elements.loginBtn) elements.loginBtn.addEventListener('click', () => openModal(elements.loginModal));
    if (elements.registerBtn) elements.registerBtn.addEventListener('click', () => openModal(elements.registerModal));
    if (elements.logoutBtn) elements.logoutBtn.addEventListener('click', logout);
    
    // Dashboard controls
    if (elements.fundWalletBtn) elements.fundWalletBtn.addEventListener('click', () => openModal(elements.fundWalletModal));
    if (elements.generateGiftCardBtn) elements.generateGiftCardBtn.addEventListener('click', () => openModal(elements.generateGiftCardModal));
    if (elements.customerCareBtn) elements.customerCareBtn.addEventListener('click', () => openModal(elements.customerCareModal));
    if (elements.requestWithdrawalBtn) elements.requestWithdrawalBtn.addEventListener('click', requestWithdrawal);
    
    // Admin controls
    if (elements.manageUsersBtn) elements.manageUsersBtn.addEventListener('click', () => openModal(document.getElementById('manageUsersModal')));
    if (elements.viewMessagesBtn) elements.viewMessagesBtn.addEventListener('click', () => openModal(document.getElementById('viewMessagesModal')));
    if (elements.manageGiftCardsBtn) elements.manageGiftCardsBtn.addEventListener('click', () => {
        openModal(document.getElementById('manageGiftCardsModal'));
        loadAllGiftCards();
    });
    if (elements.generateVendorCardBtn) elements.generateVendorCardBtn.addEventListener('click', () => openModal(document.getElementById('generateVendorCardModal')));
    if (elements.assignCardBtn) elements.assignCardBtn.addEventListener('click', () => openModal(document.getElementById('assignCardModal')));
    if (elements.gameSettingsBtn) elements.gameSettingsBtn.addEventListener('click', () => openModal(document.getElementById('gameSettingsModal')));
    if (elements.socialSettingsBtn) elements.socialSettingsBtn.addEventListener('click', () => openModal(document.getElementById('socialSettingsModal')));
    if (elements.withdrawalRequestsBtn) elements.withdrawalRequestsBtn.addEventListener('click', () => openModal(document.getElementById('withdrawalRequestsModal')));
    if (elements.pendingTransactionsBtn) elements.pendingTransactionsBtn.addEventListener('click', () => openModal(document.getElementById('pendingTransactionsModal')));
    if (elements.customerCareManagementBtn) elements.customerCareManagementBtn.addEventListener('click', () => openModal(document.getElementById('customerCareManagementModal')));
    
    // Gift card validation
    if (elements.validateGiftcardBtn) elements.validateGiftcardBtn.addEventListener('click', validateGiftcard);
    if (elements.pasteGiftcardCode) elements.pasteGiftcardCode.addEventListener('click', pasteGiftcardCode);
    
    // Form submissions
    if (elements.loginForm) elements.loginForm.addEventListener('submit', handleLogin);
    if (elements.registerForm) elements.registerForm.addEventListener('submit', handleRegister);
    if (elements.fundWalletForm) elements.fundWalletForm.addEventListener('submit', handleFundWallet);
    if (elements.customerCareForm) elements.customerCareForm.addEventListener('submit', handleCustomerCareMessage);
    if (elements.giftCardForm) elements.giftCardForm.addEventListener('submit', handleGiftCardGeneration);
    if (elements.giveawayForm) elements.giveawayForm.addEventListener('submit', handleGiveawayCreation);
    if (elements.winnerForm) elements.winnerForm.addEventListener('submit', handleWinnerDetails);
    
    // Menu toggle
    if (elements.menuToggle) elements.menuToggle.addEventListener('click', toggleSidebar);
    
    // Close buttons
    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    if (elements.modals) {
        elements.modals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal(this);
                }
            });
        });
    }
    
    // Giveaway type selection
    const giveawayTypeSelect = document.getElementById('giveawayTypeSelect');
    if (giveawayTypeSelect) {
        giveawayTypeSelect.addEventListener('change', function() {
            const giftcardGiveawayFields = document.getElementById('giftcardGiveawayFields');
            const giveawayTypeInput = document.getElementById('giveawayType');
            
            if (this.value === 'giftcard') {
                giftcardGiveawayFields.style.display = 'block';
                giveawayTypeInput.value = 'giftcard';
            } else {
                giftcardGiveawayFields.style.display = 'none';
                giveawayTypeInput.value = 'open';
            }
        });
    }
    
    // Gift card type selection
    const giftcardTypeBtns = document.querySelectorAll('.giftcard-type-btn');
    giftcardTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            giftcardTypeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const giftCardType = document.getElementById('giftCardType');
            const singleFields = document.getElementById('singleGiftCardFields');
            const bulkFields = document.getElementById('bulkGiftCardFields');
            
            if (this.dataset.type === 'single') {
                giftCardType.value = 'single';
                singleFields.style.display = 'block';
                bulkFields.style.display = 'none';
            } else {
                giftCardType.value = 'bulk';
                singleFields.style.display = 'none';
                bulkFields.style.display = 'block';
            }
        });
    });
    
    // Gift card amount calculation
    const giftCardAmount = document.getElementById('giftCardAmount');
    if (giftCardAmount) {
        giftCardAmount.addEventListener('input', function() {
            const giftCardValue = document.getElementById('giftCardValue');
            if (giftCardValue) {
                giftCardValue.textContent = this.value || 0;
            }
        });
    }
    
    const bulkGiftCardAmount = document.getElementById('bulkGiftCardAmount');
    if (bulkGiftCardAmount) {
        bulkGiftCardAmount.addEventListener('input', function() {
            const bulkGiftCardCount = document.getElementById('bulkGiftCardCount');
            if (bulkGiftCardCount) {
                const cardCount = Math.floor((this.value || 0) / 100);
                bulkGiftCardCount.textContent = cardCount;
            }
        });
    }
    
    console.log("Event listeners setup complete");
}

// Game functions
function startGame() {
    console.log("Start game clicked");
    if (!isRunning) {
        isRunning = true;
        if (elements.startBtn) elements.startBtn.disabled = true;
        if (elements.stopBtn) elements.stopBtn.disabled = false;
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
        if (elements.startBtn) elements.startBtn.disabled = false;
        if (elements.stopBtn) elements.stopBtn.disabled = true;
        
        const finalTime = currentTime / 1000;
        processGameResult(finalTime);
        
        // Reset timer
        currentTime = 0;
        updateTimerDisplay(currentTime);
    }
}

function updateTimerDisplay(time) {
    if (!elements.timerDisplay) return;
    
    const seconds = Math.floor(time / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    elements.timerDisplay.textContent = `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

// Gift card functions
function pasteGiftcardCode() {
    if (!elements.giftcardCodeInput) return;
    
    navigator.clipboard.readText().then(text => {
        elements.giftcardCodeInput.value = text;
        showNotification('Gift card code pasted!', 'success');
    }).catch(err => {
        console.error('Failed to read clipboard: ', err);
        showNotification('Failed to paste from clipboard', 'error');
    });
}

async function validateGiftcard() {
    if (!elements.giftcardCodeInput) return;
    
    const code = elements.giftcardCodeInput.value.trim().toUpperCase();
    
    if (!code) {
        showNotification('Please enter a gift card code', 'warning');
        return;
    }
    
    // Check if user is blocked
    if (failedGiftCardAttempts >= MAX_GIFTCARD_ATTEMPTS) {
        showNotification('Your account has been blocked due to too many failed gift card attempts. Please contact customer care.', 'error');
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
                showNotification(`Invalid gift card code. ${attemptsLeft} attempts remaining before ban.`, 'warning');
            } else {
                // Ban user
                await db.collection('users').doc(user.uid).update({
                    isBlocked: true
                });
                showNotification('Your account has been blocked due to too many failed gift card attempts.', 'error');
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
                showNotification(`This gift card has no remaining balance. ${attemptsLeft} attempts remaining before ban.`, 'warning');
            } else {
                await db.collection('users').doc(user.uid).update({
                    isBlocked: true
                });
                showNotification('Your account has been blocked due to too many failed gift card attempts.', 'error');
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
        const successAnimation = document.getElementById('successAnimation');
        if (successAnimation) successAnimation.style.display = 'flex';
        playSuccessSound();
        
        // Set active gift card
        activeGiftCard = {
            id: giftCardDoc.id,
            code: code,
            value: giftCardData.value,
            remainingBalance: giftCardData.remainingBalance
        };
        
        // Update UI
        const targetTimeValue = document.getElementById('targetTimeValue');
        const targetTimeDisplay = document.getElementById('targetTimeDisplay');
        const activeCardCode = document.getElementById('activeCardCode');
        const giftcardBalance = document.getElementById('giftcardBalance');
        const giftcardInfo = document.getElementById('giftcardInfo');
        
        if (targetTimeValue) targetTimeValue.textContent = getGameSettings().winningTime.toFixed(2);
        if (targetTimeDisplay) targetTimeDisplay.style.display = 'block';
        if (activeCardCode) activeCardCode.textContent = code;
        if (giftcardBalance) giftcardBalance.textContent = `${getCurrencySymbol()}${activeGiftCard.remainingBalance}`;
        if (giftcardInfo) giftcardInfo.style.display = 'block';
        
        // Enable game after delay
        setTimeout(() => {
            if (elements.validateGiftcardBtn) elements.validateGiftcardBtn.disabled = true;
            if (elements.giftcardCodeInput) elements.giftcardCodeInput.disabled = true;
            
            setTimeout(() => {
                closeModal(elements.giftCardValidationModal);
                if (elements.startBtn) elements.startBtn.disabled = false;
                if (elements.payGameBtn) elements.payGameBtn.style.display = 'none';
            }, 1000);
        }, 2000);
        
    } catch (error) {
        console.error("Error validating gift card:", error);
        showNotification('Error validating gift card. Please try again.', 'error');
    }
}

// Gift card generation
async function handleGiftCardGeneration(e) {
    e.preventDefault();
    
    if (!user) {
        showNotification('Please log in to generate gift cards', 'warning');
        return;
    }
    
    const giftCardType = document.getElementById('giftCardType').value;
    let amount, cardCount, cardValue;
    
    if (giftCardType === 'single') {
        amount = parseFloat(document.getElementById('giftCardAmount').value);
        cardCount = 1;
        cardValue = amount;
    } else {
        amount = parseFloat(document.getElementById('bulkGiftCardAmount').value);
        cardValue = 100; // ₦100 per card
        cardCount = Math.floor(amount / cardValue);
    }
    
    // Validate amount
    if (amount <= 0) {
        showNotification('Please enter a valid amount', 'warning');
        return;
    }
    
    if (giftCardType === 'bulk' && cardCount < 1) {
        showNotification('Amount must be at least ₦100 for bulk gift cards', 'warning');
        return;
    }
    
    // Check if user has enough balance
    if (walletBalance < amount) {
        showNotification(`Insufficient balance. You need ${getCurrencySymbol()}${amount} to generate gift cards.`, 'error');
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
        const giftcardCodesList = document.getElementById('giftcardCodesList');
        const giftcardResult = document.getElementById('giftcardResult');
        
        if (giftcardCodesList) {
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
        }
        
        if (giftcardResult) giftcardResult.style.display = 'block';
        
        showNotification(`Successfully generated ${cardCount} gift card(s)!`, 'success');
        
    } catch (error) {
        console.error("Error generating gift cards:", error);
        showNotification('Error generating gift cards: ' + error.message, 'error');
    }
}

// Giveaway creation
async function handleGiveawayCreation(e) {
    e.preventDefault();
    
    if (!user) {
        showNotification('Please log in to create a giveaway', 'warning');
        return;
    }
    
    const giveawayType = document.getElementById('giveawayType').value;
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
            showNotification(`Insufficient balance. You need ${getCurrencySymbol()}${totalCost} to create this giveaway.`, 'error');
            return;
        }
        
        // Show payment modal
        const paymentAmount = document.getElementById('paymentAmount');
        const paymentSlider = document.getElementById('paymentSlider');
        const paymentStatus = document.getElementById('paymentStatus');
        const paymentSuccessAnimation = document.getElementById('paymentSuccessAnimation');
        
        if (paymentAmount) paymentAmount.textContent = `${getCurrencySymbol()}${totalCost}`;
        if (paymentSlider) paymentSlider.value = 0;
        if (paymentStatus) paymentStatus.innerHTML = '';
        if (paymentSuccessAnimation) paymentSuccessAnimation.style.display = 'none';
        
        openModal(document.getElementById('paymentModal'));
        
        // Set up payment slider
        if (paymentSlider) {
            paymentSlider.oninput = async function() {
                if (this.value == 100) {
                    // Payment confirmed
                    if (paymentStatus) paymentStatus.innerHTML = '<p class="payment-success">Payment confirmed! Creating giveaway...</p>';
                    if (paymentSuccessAnimation) paymentSuccessAnimation.style.display = 'flex';
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
                        
                        closeModal(document.getElementById('paymentModal'));
                        
                        // Show giveaway created section
                        const giveawayForm = document.getElementById('giveawayForm');
                        const giveawayCreatedSection = document.getElementById('giveawayCreatedSection');
                        
                        if (giveawayForm) giveawayForm.style.display = 'none';
                        if (giveawayCreatedSection) giveawayCreatedSection.style.display = 'block';
                        
                        // Set giveaway link
                        const giveawayLinkInput = document.getElementById('giveawayLinkInput');
                        const giveawayLink = `${window.location.origin}?giveaway=${giveawayId}`;
                        if (giveawayLinkInput) giveawayLinkInput.value = giveawayLink;
                        
                        // Show generated gift cards
                        const generatedGiftCardsCount = document.getElementById('generatedGiftCardsCount');
                        const generatedGiftCardsList = document.getElementById('generatedGiftCardsList');
                        
                        if (generatedGiftCardsCount) generatedGiftCardsCount.textContent = generatedGiftCards.length;
                        if (generatedGiftCardsList && generatedGiftCards.length > 0) {
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
                    if (paymentStatus) paymentStatus.innerHTML = '';
                    if (paymentSuccessAnimation) paymentSuccessAnimation.style.display = 'none';
                }
            };
        }
        
    } catch (error) {
        console.error("Error creating giveaway:", error);
        showNotification('Error creating giveaway: ' + error.message, 'error');
    }
}

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        closeModal(elements.loginModal);
        showNotification('Login successful!', 'success');
    } catch (error) {
        console.error("Login error:", error);
        showNotification('Login failed: ' + error.message, 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const isAffiliate = document.getElementById('registerAffiliate').checked;
    const country = document.getElementById('userCountry').value;
    
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
        
        closeModal(elements.registerModal);
        showNotification('Registration successful!', 'success');
    } catch (error) {
        console.error("Registration error:", error);
        showNotification('Registration failed: ' + error.message, 'error');
    }
}

function logout() {
    console.log("Logout clicked");
    if (auth) {
        auth.signOut();
        showNotification('Logged out successfully', 'success');
    }
}

// UI functions
function openModal(modal) {
    if (!modal) return;
    console.log("Opening modal:", modal.id);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    console.log("Closing modal:", modal.id);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function toggleSidebar() {
    if (!elements.sidebar) return;
    elements.sidebar.classList.toggle('active');
}

function showNotification(message, type = 'info') {
    const notificationPopup = document.getElementById('notificationPopup');
    const notificationContent = document.getElementById('notificationContent');
    
    if (!notificationPopup || !notificationContent) return;
    
    notificationContent.textContent = message;
    notificationPopup.className = `notification-popup ${type}`;
    notificationPopup.style.display = 'flex';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notificationPopup.style.display = 'none';
    }, 5000);
}

// Utility functions
function getGameSettings() {
    return gameSettings[userCountry];
}

function getCurrencySymbol() {
    return getGameSettings().currency;
}

function updateWalletBalance() {
    if (!elements.walletBalanceEl || !elements.giftCardBalanceEl || !elements.giveawayCashbackBalanceEl) return;
    
    elements.walletBalanceEl.textContent = `${getCurrencySymbol()}${walletBalance.toFixed(2)}`;
    elements.giftCardBalanceEl.textContent = giftCardBalance;
    elements.giveawayCashbackBalanceEl.textContent = `${getCurrencySymbol()}${giveawayCashbackBalance.toFixed(2)}`;
}

function updateStats() {
    if (!elements.gamesPlayedEl || !elements.bestTimeEl) return;
    
    elements.gamesPlayedEl.textContent = gamesPlayed;
    elements.bestTimeEl.textContent = formatTime(bestTime * 1000);
}

function formatTime(time) {
    const seconds = Math.floor(time / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
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

function copyGiftCardCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Gift card code copied to clipboard!', 'success');
    });
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
    if (!elements.loginBtn || !elements.registerBtn || !elements.logoutBtn) return;
    
    elements.loginBtn.style.display = 'none';
    elements.registerBtn.style.display = 'none';
    elements.logoutBtn.style.display = 'block';
}

function updateUIForLoggedOutUser() {
    if (!elements.loginBtn || !elements.registerBtn || !elements.logoutBtn) return;
    
    elements.loginBtn.style.display = 'block';
    elements.registerBtn.style.display = 'block';
    elements.logoutBtn.style.display = 'none';
    if (elements.adminSection) elements.adminSection.style.display = 'none';
}

// Load configuration from Firestore
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

// Load user data
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
                    if (elements.adminSection) elements.adminSection.style.display = 'block';
                    loadAdminData();
                } else {
                    if (elements.adminSection) elements.adminSection.style.display = 'none';
                }
                
                // Show customer care panel if user is customer care
                const customerCarePanel = document.getElementById('customerCarePanel');
                if (customerCarePanel) {
                    customerCarePanel.style.display = isCustomerCare ? 'block' : 'none';
                    if (isCustomerCare) {
                        loadCustomerCareConversations();
                    }
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
            .where('isActive', '==', true)
            .onSnapshot((snapshot) => {
                console.log("User gift cards snapshot:", snapshot.size, "documents");
                updateAvailableGiftCards(snapshot);
            }, (error) => {
                console.error("Error in gift cards listener:", error);
            });
            
        // Load customer care messages
        loadCustomerCareMessages();
        
        return unsubscribe;
        
    } catch (error) {
        console.error("Error loading user data:", error);
    }
}

// Initialize everything
function init() {
    console.log("Initializing application...");
    
    // Cache DOM elements
    cacheDOMElements();
    
    // Initialize Firebase
    initializeFirebase();
    
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

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export functions to global scope for HTML onclick handlers
window.copyGiftCardCode = copyGiftCardCode;
window.showNotification = showNotification;
window.openModal = openModal;
window.closeModal = closeModal;

// Note: The following functions are placeholders and need to be implemented
// based on your specific Firebase structure and business logic:
// - processGameResult()
// - loadTransactionHistory()
// - updateAvailableGiftCards()
// - loadAdminData()
// - loadCustomerCareConversations()
// - loadAffiliateData()
// - updateAffiliateStats()
// - updateSidebarMenu()
// - showSection()
// - updateCurrencyDisplays()
// - updateFundWalletLink()
// - updateSocialLinks()
// - handleFundWallet()
// - requestWithdrawal()
// - handleCustomerCareMessage()
// - handleWinnerDetails()
// - And other admin functions

// These functions would need to be implemented based on your specific
// Firebase database structure and application requirements.
