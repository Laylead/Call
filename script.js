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
let userCountry = 'nigeria';

// Firebase services
let db, auth;

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
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const fundWalletBtn = document.getElementById('fundWalletBtn');
const generateGiftCardBtn = document.getElementById('generateGiftCardBtn');
const customerCareBtn = document.getElementById('customerCareBtn');
const adminSection = document.getElementById('adminSection');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const sidebarMenu = document.getElementById('sidebarMenu');
const contentSections = document.querySelectorAll('.content-section');
const giftcardCodeInput = document.getElementById('giftcardCode');
const pasteGiftCardBtn = document.getElementById('pasteGiftCardBtn');
const validateGiftcardBtn = document.getElementById('validateGiftcardBtn');
const giftcardInfo = document.getElementById('giftcardInfo');
const activeCardCode = document.getElementById('activeCardCode');
const giftcardBalance = document.getElementById('giftcardBalance');
const targetTimeDisplay = document.getElementById('targetTimeDisplay');
const targetTimeValue = document.getElementById('targetTimeValue');
const giveawayTypeDropdown = document.querySelector('.giveaway-type-dropdown');
const selectedGiveawayType = document.getElementById('selectedGiveawayType');
const giveawayTypeInput = document.getElementById('giveawayType');
const giveawayForm = document.getElementById('giveawayForm');
const giftcardGiveawayFields = document.getElementById('giftcardGiveawayFields');
const giveawayCreatedSection = document.getElementById('giveawayCreatedSection');
const giveawayLinkInput = document.getElementById('giveawayLinkInput');
const copyGiveawayLinkBtn = document.getElementById('copyGiveawayLinkBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const viewAllGiftCardsBtn = document.getElementById('viewAllGiftCardsBtn');
const availableGiftCardsList = document.getElementById('availableGiftCardsList');

// Get all modals
const modals = document.querySelectorAll('.modal');

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
        showNotification("Error initializing Firebase: " + error.message, "error");
    }
}

// Handle authentication state changes
async function handleAuthStateChanged(firebaseUser) {
    if (firebaseUser) {
        user = firebaseUser;
        console.log("User signed in:", user.email);
        updateUIForLoggedInUser();
        
        // Load user data
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
        updateStats();
        updateWalletBalance();
        
        // Update sidebar to hide protected sections
        updateSidebarMenu();
        
        // Redirect to game section if on protected section
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection && (activeSection.id === 'dashboardSection' || activeSection.id === 'giveawaySection' || activeSection.id === 'affiliateSection')) {
            showSection('gameSection');
        }
    }
}

// Load user data from Firestore
async function loadUserData(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            gamesPlayed = userData.gamesPlayed || 0;
            bestTime = userData.bestTime || 0;
            walletBalance = userData.walletBalance || 0;
            giftCardBalance = userData.giftCardBalance || 0;
            giveawayCashbackBalance = userData.giveawayCashbackBalance || 0;
            isAdmin = userData.isAdmin || false;
            isAffiliate = userData.isAffiliate || false;
            isCustomerCare = userData.isCustomerCare || false;
            userCountry = userData.country || 'nigeria';
            
            updateStats();
            updateWalletBalance();
            
            // Show admin section if user is admin
            if (isAdmin) {
                adminSection.style.display = 'block';
            } else {
                adminSection.style.display = 'none';
            }
            
            // Load user's gift cards
            loadUserGiftCards(userId);
        }
    } catch (error) {
        console.error("Error loading user data:", error);
        showNotification("Error loading user data", "error");
    }
}

// Load user's gift cards
async function loadUserGiftCards(userId) {
    try {
        const giftCardsSnapshot = await db.collection('giftCards')
            .where('userId', '==', userId)
            .get();
            
        updateAvailableGiftCards(giftCardsSnapshot);
    } catch (error) {
        console.error("Error loading gift cards:", error);
    }
}

// Update available gift cards display
function updateAvailableGiftCards(giftCardsSnapshot) {
    if (giftCardsSnapshot.empty) {
        availableGiftCardsList.innerHTML = '<p style="text-align: center;">No gift cards available</p>';
        return;
    }
    
    let giftCardsHTML = '';
    let count = 0;
    
    giftCardsSnapshot.forEach(doc => {
        const giftCard = doc.data();
        const status = giftCard.remainingBalance > 0 ? 'Valid' : 'Used';
        const statusClass = giftCard.remainingBalance > 0 ? 'status-valid' : 'status-used';
        
        if (count < 3) {
            giftCardsHTML += `
                <div class="giftcard-info" style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${giftCard.code}</strong>
                            <span class="status-badge ${statusClass}">${status}</span>
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
        }
        count++;
    });
    
    availableGiftCardsList.innerHTML = giftCardsHTML;
    
    // Show view all button if there are more than 3 gift cards
    if (count > 3) {
        viewAllGiftCardsBtn.style.display = 'block';
    } else {
        viewAllGiftCardsBtn.style.display = 'none';
    }
}

// View all gift cards
async function viewAllGiftCards() {
    try {
        const giftCardsSnapshot = await db.collection('giftCards')
            .where('userId', '==', user.uid)
            .get();
            
        let giftCardsHTML = '';
        
        giftCardsSnapshot.forEach(doc => {
            const giftCard = doc.data();
            const status = giftCard.remainingBalance > 0 ? 'Valid' : 'Used';
            const statusClass = giftCard.remainingBalance > 0 ? 'status-valid' : 'status-used';
            
            giftCardsHTML += `
                <div class="giftcard-info" style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${giftCard.code}</strong>
                            <span class="status-badge ${statusClass}">${status}</span>
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
        });
        
        availableGiftCardsList.innerHTML = giftCardsHTML;
        viewAllGiftCardsBtn.style.display = 'none';
        
    } catch (error) {
        console.error("Error loading all gift cards:", error);
        showNotification("Error loading gift cards", "error");
    }
}

// Filter gift cards
function filterGiftCards(filter) {
    // This would be implemented to filter the displayed gift cards
    // For now, we'll just show a message
    showNotification(`Filtering by: ${filter}`, "info");
}

// Copy gift card code
function copyGiftCardCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showNotification("Gift card code copied to clipboard!", "success");
    });
}

// Get currency symbol based on user country
function getCurrencySymbol() {
    return userCountry === 'nigeria' ? '₦' : 'USDT ';
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    loginBtn.style.display = 'block';
    registerBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    adminSection.style.display = 'none';
}

// Update game stats
function updateStats() {
    gamesPlayedEl.textContent = gamesPlayed;
    bestTimeEl.textContent = formatTime(bestTime * 1000);
}

// Update wallet balance display
function updateWalletBalance() {
    walletBalanceEl.textContent = `${getCurrencySymbol()}${walletBalance.toFixed(2)}`;
    giftCardBalanceEl.textContent = giftCardBalance;
    giveawayCashbackBalanceEl.textContent = `${getCurrencySymbol()}${giveawayCashbackBalance.toFixed(2)}`;
}

// Format time display
function formatTime(time) {
    const seconds = Math.floor(time / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

// Update sidebar menu based on user status
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

// Show specific section
function showSection(sectionId) {
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
                <button class="btn btn-primary" onclick="openModal(document.getElementById('loginModal'))">
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
    }
}

// Game functions
function startGame() {
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

function updateTimerDisplay(time) {
    const seconds = Math.floor(time / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    timerDisplay.textContent = `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

// Process game result
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
            
            // Update gift card usage if active
            if (activeGiftCard) {
                const gameCost = gameSettings[userCountry].gamePrice;
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
            
            showGameResult(finalTime);
        }
        
    } catch (error) {
        console.error("Error processing game result:", error);
        showNotification("Error processing game result", "error");
    }
}

function showGameResult(time) {
    const resultModal = document.getElementById('resultModal');
    const resultContent = document.getElementById('resultContent');
    
    resultContent.innerHTML = `
        <h3>Game Completed!</h3>
        <p>You stopped the timer at ${time.toFixed(2)} seconds.</p>
        <button class="btn btn-primary" onclick="closeModal(resultModal)">Continue</button>
    `;
    
    openModal(resultModal);
}

// Gift card validation
async function validateGiftcard() {
    const code = giftcardCodeInput.value.trim().toUpperCase();
    
    if (!code) {
        showNotification('Please enter a gift card code', 'warning');
        return;
    }
    
    try {
        // Check if gift card exists and is valid
        const giftCardSnapshot = await db.collection('giftCards')
            .where('code', '==', code)
            .where('isActive', '==', true)
            .get();
        
        if (giftCardSnapshot.empty) {
            showNotification('Invalid gift card code', 'error');
            return;
        }
        
        const giftCardDoc = giftCardSnapshot.docs[0];
        const giftCardData = giftCardDoc.data();
        
        if (giftCardData.remainingBalance <= 0) {
            showNotification('This gift card has no remaining balance', 'error');
            return;
        }
        
        // Show success animation
        const successAnimation = document.getElementById('successAnimation');
        successAnimation.style.display = 'flex';
        
        // Set active gift card
        activeGiftCard = {
            id: giftCardDoc.id,
            code: code,
            value: giftCardData.value,
            remainingBalance: giftCardData.remainingBalance
        };
        
        // Update UI
        targetTimeValue.textContent = gameSettings[userCountry].winningTime.toFixed(2);
        targetTimeDisplay.style.display = 'block';
        activeCardCode.textContent = code;
        giftcardBalance.textContent = `${getCurrencySymbol()}${activeGiftCard.remainingBalance}`;
        giftcardInfo.style.display = 'block';
        
        // Enable game after delay
        setTimeout(() => {
            validateGiftcardBtn.disabled = true;
            giftcardCodeInput.disabled = true;
            
            setTimeout(() => {
                closeModal(document.getElementById('giftCardValidationModal'));
                startBtn.disabled = false;
                payGameBtn.style.display = 'none';
            }, 1000);
        }, 2000);
        
    } catch (error) {
        console.error("Error validating gift card:", error);
        showNotification('Error validating gift card', 'error');
    }
}

// Paste gift card code
function pasteGiftCardCode() {
    navigator.clipboard.readText().then(text => {
        giftcardCodeInput.value = text.toUpperCase();
    }).catch(err => {
        showNotification('Failed to read from clipboard', 'error');
    });
}

// Giveaway type dropdown functionality
function setupGiveawayTypeDropdown() {
    const dropdownHeader = giveawayTypeDropdown.querySelector('.dropdown-header');
    const dropdownOptions = giveawayTypeDropdown.querySelector('.dropdown-options');
    const options = dropdownOptions.querySelectorAll('.dropdown-option');
    
    dropdownHeader.addEventListener('click', () => {
        dropdownOptions.classList.toggle('active');
    });
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            const type = option.dataset.type;
            
            // Update selected type
            options.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Update display
            selectedGiveawayType.textContent = option.querySelector('h3').textContent;
            giveawayTypeInput.value = type;
            
            // Show/hide gift card fields
            if (type === 'giftcard') {
                giftcardGiveawayFields.style.display = 'block';
            } else {
                giftcardGiveawayFields.style.display = 'none';
            }
            
            // Close dropdown
            dropdownOptions.classList.remove('active');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!giveawayTypeDropdown.contains(e.target)) {
            dropdownOptions.classList.remove('active');
        }
    });
}

// Handle giveaway creation
async function handleGiveawayCreation(e) {
    e.preventDefault();
    
    if (!user) {
        showNotification('Please log in to create a giveaway', 'warning');
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
            totalCost = gameSettings[userCountry].openGiveawayPrice;
        } else {
            giftcardCount = parseInt(document.getElementById('giftcardCount').value);
            totalCost = giftcardCount * gameSettings[userCountry].gamePrice;
        }
        
        // Check if user has enough balance
        if (walletBalance < totalCost) {
            showNotification(`Insufficient balance. You need ${getCurrencySymbol()}${totalCost} to create this giveaway.`, 'error');
            return;
        }
        
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
                    value: gameSettings[userCountry].gamePrice,
                    remainingBalance: gameSettings[userCountry].gamePrice,
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
            document.getElementById('generatedGiftCardsList').innerHTML = giftCardsHTML;
        }
        
        showNotification('Giveaway created successfully!', 'success');
        
    } catch (error) {
        console.error("Error creating giveaway:", error);
        showNotification('Error creating giveaway: ' + error.message, 'error');
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

// Copy giveaway link
function copyGiveawayLink() {
    giveawayLinkInput.select();
    document.execCommand('copy');
    showNotification('Giveaway link copied to clipboard!', 'success');
}

// Generate gift cards
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
        
        document.getElementById('giftcardResult').style.display = 'block';
        
        showNotification(`Successfully generated ${cardCount} gift card(s)!`, 'success');
        
    } catch (error) {
        console.error("Error generating gift cards:", error);
        showNotification('Error generating gift cards: ' + error.message, 'error');
    }
}

// Modal functions
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function closeAllModals() {
    modals.forEach(modal => {
        closeModal(modal);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notificationPopup = document.getElementById('notificationPopup');
    const notificationContent = document.getElementById('notificationContent');
    
    notificationContent.textContent = message;
    notificationPopup.className = `notification-popup ${type}`;
    notificationPopup.style.display = 'flex';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notificationPopup.style.display = 'none';
    }, 5000);
}

// Toggle sidebar
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// Logout function
function logout() {
    if (auth) {
        auth.signOut();
    }
    updateUIForLoggedOutUser();
}

// Form handlers
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        closeModal(document.getElementById('loginModal'));
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
        
        closeModal(document.getElementById('registerModal'));
        showNotification('Registration successful!', 'success');
    } catch (error) {
        console.error("Registration error:", error);
        showNotification('Registration failed: ' + error.message, 'error');
    }
}

// Initialize everything
function init() {
    console.log("Initializing application...");
    
    // Initialize Firebase
    initializeFirebase();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize UI
    updateTimerDisplay(currentTime);
    updateStats();
    updateWalletBalance();
    updateSidebarMenu();
    setupGiveawayTypeDropdown();
    
    console.log("Application initialized successfully");
}

function setupEventListeners() {
    console.log("Setting up event listeners...");
    
    // Game controls
    startBtn.addEventListener('click', startGame);
    stopBtn.addEventListener('click', stopGame);
    payGameBtn.addEventListener('click', () => openModal(document.getElementById('giftCardValidationModal')));
    
    // Auth controls
    loginBtn.addEventListener('click', () => openModal(document.getElementById('loginModal')));
    registerBtn.addEventListener('click', () => openModal(document.getElementById('registerModal')));
    logoutBtn.addEventListener('click', logout);
    
    // Dashboard controls
    fundWalletBtn.addEventListener('click', () => openModal(document.getElementById('fundWalletModal')));
    generateGiftCardBtn.addEventListener('click', () => openModal(document.getElementById('generateGiftCardModal')));
    customerCareBtn.addEventListener('click', () => openModal(document.getElementById('customerCareModal')));
    
    // Gift card validation
    validateGiftcardBtn.addEventListener('click', validateGiftcard);
    pasteGiftCardBtn.addEventListener('click', pasteGiftCardCode);
    
    // Giveaway form
    giveawayForm.addEventListener('submit', handleGiveawayCreation);
    copyGiveawayLinkBtn.addEventListener('click', copyGiveawayLink);
    
    // Gift card generation
    document.getElementById('giftCardForm').addEventListener('submit', handleGiftCardGeneration);
    
    // Gift card filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterGiftCards(btn.dataset.filter);
        });
    });
    
    viewAllGiftCardsBtn.addEventListener('click', viewAllGiftCards);
    
    // Menu toggle
    menuToggle.addEventListener('click', toggleSidebar);
    
    // Close buttons
    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target) && 
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
    
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    console.log("Event listeners setup complete");
}

// Start the application
document.addEventListener('DOMContentLoaded', init);

// Export functions to global scope for HTML onclick handlers
window.copyGiftCardCode = copyGiftCardCode;
window.viewAllGiftCards = viewAllGiftCards;
window.filterGiftCards = filterGiftCards;
