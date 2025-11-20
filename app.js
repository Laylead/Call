// app.js
// Firebase and App Initialization
let auth, db;
let firebaseInitialized = false;

// Global variables
let currentUser = null;
let userLinks = [];
let platformSettings = {};
let userData = {};
let analyticsChart = null;

// Helper function to ensure Firebase is ready
function ensureFirebaseReady() {
    if (!firebaseInitialized || !db || !auth) {
        throw new Error('Firebase not initialized yet.');
    }
}

// Function to initialize Firebase with error handling
function initializeFirebase() {
    try {
        console.log('🔥 Initializing Firebase...');
        
        // Check if configuration is loaded
        if (typeof firebaseConfig === 'undefined') {
            throw new Error('Firebase configuration not found. Please check configuration.js file');
        }

        // Check if required configuration fields exist
        const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
        const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required configuration fields: ${missingFields.join(', ')}`);
        }

        // Check for placeholder values
        if (firebaseConfig.apiKey.includes('YOUR_API') || firebaseConfig.projectId.includes('YOUR_PROJECT')) {
            throw new Error('Please replace placeholder values in configuration.js with your actual Firebase config');
        }

        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('✅ Firebase app initialized');
        } else {
            firebase.app();
            console.log('✅ Firebase app already initialized');
        }

        // Initialize Firebase services
        auth = firebase.auth();
        db = firebase.firestore();
        
        // Enable offline persistence
        db.enablePersistence()
            .then(() => console.log('✅ Firestore persistence enabled'))
            .catch(err => console.log('❌ Firestore persistence error:', err));

        firebaseInitialized = true;
        console.log('✅ Firebase services initialized successfully');
        
        // If we're on a redirect path, handle it now (Firebase is ready)
        if (window.location.pathname.includes('/r/')) {
            handleRedirectPage().catch(err => {
                console.error('Redirect page handling error:', err);
                // Show user-friendly error
                const redirectPage = document.getElementById('redirectPage');
                if (redirectPage) {
                    redirectPage.innerHTML = `
                        <div class="redirect-card">
                            <div class="logo">
                                <h1>ACCESS PORTAL</h1>
                                <div class="tagline">Professional Content Delivery</div>
                            </div>
                            <h2>System Error</h2>
                            <p>We're experiencing technical difficulties. Please try again later.</p>
                            <button class="btn" onclick="window.location.href='/'">
                                <i class="fas fa-home"></i>
                                Return to Home
                            </button>
                        </div>
                    `;
                }
            });
        }
        
        // Set up auth state listener
        auth.onAuthStateChanged(async user => {
            console.log('🔐 Auth state changed:', user ? user.email : 'No user');
            if (user) {
                currentUser = user;
                await handleUserLogin(user);
            } else {
                handleUserLogout();
            }
        });
        
        // Hide any configuration errors
        document.getElementById('configError').style.display = 'none';
        
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        
        // Show configuration error to user
        const configError = document.getElementById('configError');
        configError.textContent = `Configuration Error: ${error.message}`;
        configError.style.display = 'block';
        
        // Disable login form
        document.getElementById('loginBtn').disabled = true;
        document.getElementById('loginBtn').textContent = 'System Configuration Error';
        
        firebaseInitialized = false;
    }
}

// Initialize Firebase when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, initializing Firebase...');
    initializeFirebase();
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!firebaseInitialized) {
            showLoginError('System not properly configured. Please refresh the page or contact support.');
            return;
        }

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');
        
        // Show loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log('✅ User logged in:', userCredential.user.email);
            showLoginError(''); // Clear any errors
        } catch (error) {
            console.error('❌ Login error:', error);
            let errorMessage = 'Login failed. Please check your credentials and try again.';
            
            if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = 'This user has been disabled.';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No user found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection.';
            }
            
            showLoginError(errorMessage);
            showToast('Login failed. Please check your credentials.', 'error');
        } finally {
            // Reset button state
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
        }
    });

    // Show register modal
    document.getElementById('showRegister').addEventListener('click', function(e) {
        e.preventDefault();
        if (!firebaseInitialized) {
            alert('System not properly configured. Please refresh the page or contact support.');
            return;
        }
        document.getElementById('registerModal').style.display = 'flex';
    });

    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Register form
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!firebaseInitialized) {
            showRegisterError('System not properly configured. Please refresh the page or contact support.');
            return;
        }

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        if (password !== confirmPassword) {
            showRegisterError('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            showRegisterError('Password must be at least 6 characters long');
            return;
        }
        
        try {
            ensureFirebaseReady();
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // Update user profile with display name
            await userCredential.user.updateProfile({
                displayName: name
            });
            
            // Create user document in Firestore
            await db.collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: email,
                adsterraLink: '',
                subscription: {
                    plan: 'free',
                    status: 'inactive',
                    expiryDate: null
                },
                isActive: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            showRegisterError('');
            document.getElementById('registerModal').style.display = 'none';
            document.getElementById('registerForm').reset();
            
            showToast('Account created successfully! You are now logged in.', 'success');
            
        } catch (error) {
            console.error('❌ Registration error:', error);
            let errorMessage = 'Registration failed. Please try again with a different email.';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection.';
            }
            
            showRegisterError(errorMessage);
        }
    });

    // Mobile menu button
    document.getElementById('mobileMenuBtn').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        auth.signOut().then(() => {
            console.log('✅ User signed out successfully');
        }).catch((error) => {
            console.error('❌ Sign out error:', error);
        });
    });

    // Menu navigation
    setupMenuNavigation();
    setupOtherEventListeners();
}

// Setup menu navigation
function setupMenuNavigation() {
    const menuItems = document.querySelectorAll('.menu-item[data-page]');

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
}

// Setup other event listeners
function setupOtherEventListeners() {
    // Create link modal buttons
    const createLinkBtn = document.getElementById('createLinkBtn');
    const createLinkBtn2 = document.getElementById('createLinkBtn2');
    
    if (createLinkBtn) {
        createLinkBtn.addEventListener('click', function() {
            document.getElementById('createLinkModal').style.display = 'flex';
        });
    }
    
    if (createLinkBtn2) {
        createLinkBtn2.addEventListener('click', function() {
            document.getElementById('createLinkModal').style.display = 'flex';
        });
    }

    // Create link form
    const createLinkForm = document.getElementById('createLinkForm');
    if (createLinkForm) {
        createLinkForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!firebaseInitialized || !db || !auth) {
                showToast('System not ready yet. Please wait a moment and try again.', 'error');
                return;
            }

            // Check if user has set Adsterra link
            if (!userData.adsterraLink) {
                showToast('Please set your Adsterra link in Settings before creating links.', 'warning');
                navigateToPage('settings');
                document.getElementById('createLinkModal').style.display = 'none';
                return;
            }

            const name = document.getElementById('linkName').value;
            const destinationUrl = document.getElementById('destinationUrl').value;
            const customSlug = document.getElementById('customSlug').value;
            
            try {
                ensureFirebaseReady();
                const slug = customSlug || await generateUniqueSlug();
                const shortUrl = `${window.location.origin}/r/${slug}`;
                
                const linkData = {
                    name: name,
                    destinationUrl: destinationUrl,
                    shortUrl: shortUrl,
                    slug: slug,
                    userId: currentUser.uid,
                    userAdsterraLink: userData.adsterraLink,
                    clicks: 0,
                    uniqueClicks: 0,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'active'
                };
                
                // Save to Firestore
                await db.collection('links').add(linkData);
                
                // Close modal and reset form
                document.getElementById('createLinkModal').style.display = 'none';
                this.reset();
                
                // Reload links data
                await loadUserData();
                if (document.getElementById('linksPage').style.display !== 'none') {
                    loadLinksData();
                } else {
                    loadDashboardData();
                }
                
                // Show success message
                showToast('Link created successfully!', 'success');
            } catch (error) {
                console.error('❌ Error creating link:', error);
                showToast('Error creating link. Please try again.', 'error');
            }
        });
    }

    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                ensureFirebaseReady();
                const userName = document.getElementById('userNameInput').value;
                const adsterraLink = document.getElementById('adsterraLink').value;
                
                await db.collection('users').doc(currentUser.uid).update({
                    name: userName,
                    adsterraLink: adsterraLink,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Update user profile
                await currentUser.updateProfile({
                    displayName: userName
                });
                
                // Update local user data
                userData.name = userName;
                userData.adsterraLink = adsterraLink;
                
                // Update UI
                updateUserUI();
                
                showToast('Settings saved successfully!', 'success');
            } catch (error) {
                console.error('❌ Error saving settings:', error);
                showToast('Error saving settings. Please try again.', 'error');
            }
        });
    }

    // Analytics period change
    const analyticsPeriod = document.getElementById('analyticsPeriod');
    if (analyticsPeriod) {
        analyticsPeriod.addEventListener('change', function() {
            loadAnalyticsData();
        });
    }

    // Upgrade subscription button
    const upgradeSubscription = document.getElementById('upgradeSubscription');
    if (upgradeSubscription) {
        upgradeSubscription.addEventListener('click', function() {
            showToast('Subscription upgrade feature coming soon!', 'info');
        });
    }
}

// Handle user login
async function handleUserLogin(user) {
    try {
        console.log('👤 Handling user login for:', user.email);
        
        // Update last login time
        await db.collection('users').doc(user.uid).set({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        // Show dashboard
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('redirectPage').style.display = 'none';
        
        // Update UI based on user
        updateUserUI();
        
        // Load user data and platform settings
        await loadUserData();
        await loadPlatformSettings();
        await loadDashboardData();
        
        console.log('✅ User login handling completed successfully');
        
    } catch (error) {
        console.error('❌ Error during login process:', error);
        showToast('Error loading user data. Please refresh the page.', 'error');
        
        // Log user out if there's an error loading data
        auth.signOut();
    }
}

// Handle user logout
function handleUserLogout() {
    console.log('👤 Handling user logout');
    
    // Show login page
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('redirectPage').style.display = 'none';
    
    // Clear form fields
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').style.display = 'none';
    
    // Reset user data
    currentUser = null;
    userLinks = [];
    userData = {};
    
    // Destroy charts
    if (analyticsChart) {
        analyticsChart.destroy();
        analyticsChart = null;
    }
}

// Show login error
function showLoginError(message) {
    const loginError = document.getElementById('loginError');
    if (message) {
        loginError.textContent = message;
        loginError.style.display = 'block';
    } else {
        loginError.style.display = 'none';
    }
}

// Show register error
function showRegisterError(message) {
    const registerError = document.getElementById('registerError');
    if (message) {
        registerError.textContent = message;
        registerError.style.display = 'block';
    } else {
        registerError.style.display = 'none';
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

// Navigation function
function navigateToPage(page) {
    // Close mobile menu
    document.querySelector('.sidebar').classList.remove('active');
    
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    document.querySelector(`.menu-item[data-page="${page}"]`).classList.add('active');
    
    // Show selected page
    document.querySelectorAll('.page-content').forEach(content => {
        content.style.display = 'none';
    });
    
    document.getElementById(page + 'Page').style.display = 'block';
    document.getElementById('pageTitle').textContent = document.querySelector(`.menu-item[data-page="${page}"] .menu-text`).textContent;
    
    // Load page-specific data
    if (page === 'links') {
        loadLinksData();
    } else if (page === 'analytics') {
        loadAnalyticsData();
    }
}

// Update user UI
function updateUserUI() {
    if (!currentUser) return;
    
    // Update user info
    document.getElementById('userInitials').textContent = getInitials(userData.name || currentUser.displayName || currentUser.email);
    document.getElementById('userName').textContent = userData.name || currentUser.displayName || currentUser.email.split('@')[0];
    
    // Update settings form
    document.getElementById('userNameInput').value = userData.name || '';
    document.getElementById('userEmailInput').value = currentUser.email;
    document.getElementById('adsterraLink').value = userData.adsterraLink || '';
    
    // Update subscription info
    if (userData.subscription) {
        const subscriptionPlan = document.getElementById('subscriptionPlan');
        const subscriptionStatus = document.getElementById('subscriptionStatus');
        const subscriptionBadge = document.getElementById('subscriptionBadge');
        
        if (subscriptionPlan) {
            subscriptionPlan.textContent = userData.subscription.plan === 'free' ? 'Free Plan' : 'Premium Plan';
        }
        if (subscriptionStatus) {
            subscriptionStatus.textContent = userData.subscription.status === 'active' ? 
                `Active until ${formatDate(userData.subscription.expiryDate)}` : 'No active subscription';
        }
        if (subscriptionBadge) {
            subscriptionBadge.textContent = userData.subscription.plan === 'free' ? 'Free' : 'Premium';
            subscriptionBadge.className = `badge ${userData.subscription.plan === 'free' ? 'badge-warning' : 'badge-success'}`;
        }
        
        if (userData.subscription.status === 'active' && platformSettings.subscriptionEnabled) {
            const subscriptionTimer = document.getElementById('subscriptionTimer');
            if (subscriptionTimer) {
                subscriptionTimer.style.display = 'block';
                startSubscriptionTimer(userData.subscription.expiryDate);
            }
        }
    }
}

// Load user data
async function loadUserData() {
    try {
        if (!currentUser) {
            console.error('❌ No current user found while loading user data');
            throw new Error('No current user');
        }

        ensureFirebaseReady();

        // Load user profile
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            userData = userDoc.data();
            console.log('✅ User data loaded:', userData);
        } else {
            console.log('ℹ️ No user document found, creating one.');
            // Create user document if it doesn't exist
            const newUserData = {
                name: currentUser.displayName || currentUser.email.split('@')[0],
                email: currentUser.email,
                adsterraLink: '',
                subscription: {
                    plan: 'free',
                    status: 'inactive',
                    expiryDate: null
                },
                isActive: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await db.collection('users').doc(currentUser.uid).set(newUserData);
            userData = newUserData;
        }
        
        // Load user links
        const linksSnapshot = await db.collection('links')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .get();
        
        userLinks = [];
        linksSnapshot.forEach(doc => {
            userLinks.push({
                id: doc.id,
                ...doc.data()
            });
        });
        console.log(`✅ User links loaded: ${userLinks.length} links`);
    } catch (error) {
        console.error('❌ Error loading user data:', error);
        showToast('Error loading user data. Please refresh the page.', 'error');
        throw error;
    }
}

// Load platform settings
async function loadPlatformSettings() {
    try {
        ensureFirebaseReady();
        const settingsDoc = await db.collection('platformSettings').doc('settings').get();
        if (settingsDoc.exists) {
            platformSettings = settingsDoc.data();
        } else {
            // Create default settings if they don't exist
            const defaultSettings = {
                adminAdsterraLink: typeof PLATFORM_SETTINGS !== 'undefined' ? PLATFORM_SETTINGS.adminAdsterraLink : 'https://example.com',
                subscriptionEnabled: typeof PLATFORM_SETTINGS !== 'undefined' ? PLATFORM_SETTINGS.subscriptionEnabled : false,
                subscriptionPrice: typeof PLATFORM_SETTINGS !== 'undefined' ? PLATFORM_SETTINGS.subscriptionPrice : 9.99,
                subscriptionPopupText: typeof PLATFORM_SETTINGS !== 'undefined' ? PLATFORM_SETTINGS.subscriptionPopupText : 'Your subscription has expired. Please renew to continue using our services.',
                subscriptionButtonText: typeof PLATFORM_SETTINGS !== 'undefined' ? PLATFORM_SETTINGS.subscriptionButtonText : 'Renew Subscription',
                subscriptionButtonLink: typeof PLATFORM_SETTINGS !== 'undefined' ? PLATFORM_SETTINGS.subscriptionButtonLink : 'https://payment-portal.com',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await db.collection('platformSettings').doc('settings').set(defaultSettings);
            
            platformSettings = defaultSettings;
        }
        console.log('✅ Platform settings loaded:', platformSettings);
    } catch (error) {
        console.error('❌ Error loading platform settings:', error);
        throw error;
    }
}

// Load dashboard data
async function loadDashboardData() {
    // Update stats
    const totalClicks = userLinks.reduce((sum, link) => sum + (link.clicks || 0), 0);
    
    document.getElementById('totalClicks').textContent = totalClicks.toLocaleString();
    document.getElementById('totalLinks').textContent = userLinks.length;
    document.getElementById('totalUsers').textContent = 'N/A';
    
    // Load recent links
    const recentLinksTable = document.getElementById('recentLinksTable');
    if (recentLinksTable) {
        recentLinksTable.innerHTML = '';
        
        if (userLinks.length === 0) {
            recentLinksTable.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px; color: var(--gray);">
                        <i class="fas fa-link" style="font-size: 3rem; margin-bottom: 15px; display: block; opacity: 0.5;"></i>
                        No links created yet. Create your first link to get started!
                    </td>
                </tr>
            `;
        } else {
            userLinks.slice(0, 5).forEach(link => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${link.name}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span>${link.shortUrl}</span>
                            <button class="action-btn" title="Copy URL" onclick="copyToClipboard('${link.shortUrl}')">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </td>
                    <td>${link.clicks || 0}</td>
                    <td><span class="badge ${link.status === 'active' ? 'badge-success' : 'badge-warning'}">${link.status}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn" title="Copy URL" onclick="copyToClipboard('${link.shortUrl}')">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="action-btn" title="Edit" onclick="editLink('${link.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" title="Delete" onclick="deleteLink('${link.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                recentLinksTable.appendChild(row);
            });
        }
    }
}

// Load links data
function loadLinksData() {
    const linksTable = document.getElementById('linksTable');
    if (!linksTable) return;
    
    linksTable.innerHTML = '';
    
    if (userLinks.length === 0) {
        linksTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--gray);">
                    <i class="fas fa-link" style="font-size: 3rem; margin-bottom: 15px; display: block; opacity: 0.5;"></i>
                    No links created yet. Create your first link to get started!
                </td>
            </tr>
        `;
    } else {
        userLinks.forEach(link => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${link.name}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>${link.shortUrl}</span>
                        <button class="action-btn" title="Copy URL" onclick="copyToClipboard('${link.shortUrl}')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </td>
                <td>${truncateUrl(link.destinationUrl, 40)}</td>
                <td>${link.clicks || 0}</td>
                <td>${formatDate(link.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn" title="Copy URL" onclick="copyToClipboard('${link.shortUrl}')">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="action-btn" title="Edit" onclick="editLink('${link.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" title="Delete" onclick="deleteLink('${link.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            linksTable.appendChild(row);
        });
    }
}

// Load analytics data - FIXED VERSION
function loadAnalyticsData() {
    // Update top links table
    const topLinksTable = document.getElementById('topLinksTable');
    if (topLinksTable) {
        topLinksTable.innerHTML = '';
        
        if (!userLinks || userLinks.length === 0) {
            topLinksTable.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align: center; padding: 40px; color: var(--gray);">
                        <i class="fas fa-chart-bar" style="font-size: 3rem; margin-bottom: 15px; display: block; opacity: 0.5;"></i>
                        No analytics data available yet.
                    </td>
                </tr>
            `;
            return;
        }

        // Correct: shallow copy and sort by clicks (descending)
        const sortedLinks = [...userLinks].sort(
            (a, b) => (b.clicks || 0) - (a.clicks || 0)
        );

        // Show top 10 links
        sortedLinks.slice(0, 10).forEach(link => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${link.name}</td>
                <td>${link.clicks || 0}</td>
                <td>${
                    link.uniqueClicks
                        ? ((link.uniqueClicks / (link.clicks || 1)) * 100).toFixed(1) + '%'
                        : '0%'
                }</td>
            `;
            topLinksTable.appendChild(row);
        });
    }
    
    // Initialize analytics chart
    initializeAnalyticsChart();
}

// Initialize analytics chart
function initializeAnalyticsChart() {
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return;
    
    if (analyticsChart) {
        analyticsChart.destroy();
    }
    
    // Sample data - in a real app, you'd get this from Firebase
    const labels = Array.from({length: 30}, (_, i) => `Day ${i + 1}`);
    const clicksData = Array.from({length: 30}, () => Math.floor(Math.random() * 100) + 20);
    
    analyticsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Clicks',
                data: clicksData,
                backgroundColor: 'rgba(99, 102, 241, 0.7)',
                borderColor: '#6366f1',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Start subscription timer
function startSubscriptionTimer(expiryDate) {
    // This would be a countdown timer implementation
    // For now, we'll just display a static message
    const renewalTimer = document.getElementById('renewalTimer');
    if (renewalTimer) {
        renewalTimer.textContent = '15 days, 3 hours, 42 minutes';
    }
}

// Handle redirect page
async function handleRedirectPage() {
    const slug = window.location.pathname.split('/r/')[1];
    if (!slug) return;
    
    try {
        ensureFirebaseReady();
        
        // Find the link in Firestore
        const linksSnapshot = await db.collection('links').where('slug', '==', slug).get();
        
        if (linksSnapshot.empty) {
            window.location.href = '/';
            return;
        }
        
        const linkDoc = linksSnapshot.docs[0];
        const linkData = linkDoc.data();
        
        // Show redirect page
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('redirectPage').style.display = 'flex';
        
        // Initialize redirect logic
        initializeRedirectLogic(linkData, linkDoc.id);
    } catch (error) {
        console.error('❌ Error handling redirect:', error);
        window.location.href = '/';
    }
}

// Initialize redirect logic
function initializeRedirectLogic(linkData, linkId) {
    let countdown = 5;
    const timerElement = document.querySelector('.timer');
    const buttonsContainer = document.getElementById('buttonsContainer');
    const loader = document.querySelector('.loader');
    
    // Determine which Adsterra link to use based on click rotation
    const clickCount = linkData.clicks || 0;
    const useUserAdsterra = (clickCount % 2 === 0); // Even clicks use user's Adsterra, odd use admin's
    
    const adsterraLink = useUserAdsterra ? 
        (linkData.userAdsterraLink || platformSettings.adminAdsterraLink) : 
        platformSettings.adminAdsterraLink;
    
    const timerInterval = setInterval(() => {
        countdown--;
        if (timerElement) timerElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timerInterval);
            if (timerElement) timerElement.style.display = 'none';
            if (loader) loader.style.display = 'none';
            if (buttonsContainer) buttonsContainer.style.display = 'flex';
            const timerLabel = document.querySelector('.timer-label');
            if (timerLabel) timerLabel.textContent = 'Ready to Access';
        }
    }, 1000);
    
    // Add event listeners to buttons
    const accessBtn1 = document.getElementById('accessBtn1');
    const accessBtn2 = document.getElementById('accessBtn2');
    
    const handleButtonClick = async () => {
        try {
            ensureFirebaseReady();
            // Update click count
            await db.collection('links').doc(linkId).update({
                clicks: firebase.firestore.FieldValue.increment(1),
                lastClicked: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Redirect to Adsterra first
            window.location.href = adsterraLink;
        } catch (error) {
            console.error('❌ Error updating click count:', error);
            window.location.href = adsterraLink;
        }
    };
    
    if (accessBtn1) {
        accessBtn1.addEventListener('click', handleButtonClick);
    }
    
    if (accessBtn2) {
        accessBtn2.addEventListener('click', handleButtonClick);
    }
}

// Utility Functions
function getInitials(name) {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
}

async function generateUniqueSlug() {
    let slug = generateRandomSlug();
    let exists = true;
    let attempts = 0;
    
    while (exists && attempts < 5) {
        const snapshot = await db.collection('links').where('slug', '==', slug).get();
        exists = !snapshot.empty;
        if (exists) {
            slug = generateRandomSlug();
            attempts++;
        }
    }
    
    if (exists) {
        slug += '-' + Date.now().toString(36);
    }
    
    return slug;
}

function generateRandomSlug() {
    return Math.random().toString(36).substring(2, 8);
}

function truncateUrl(url, maxLength = 40) {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
}

function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('URL copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy URL', 'error');
    });
}

// Action functions
function editLink(linkId) {
    const link = userLinks.find(l => l.id === linkId);
    if (link) {
        document.getElementById('linkName').value = link.name;
        document.getElementById('destinationUrl').value = link.destinationUrl;
        document.getElementById('customSlug').value = link.slug;
        document.getElementById('createLinkModal').style.display = 'flex';
        
        // Update form to edit mode
        const form = document.getElementById('createLinkForm');
        const originalSubmit = form.onsubmit;
        form.onsubmit = async (e) => {
            e.preventDefault();
            try {
                ensureFirebaseReady();
                await db.collection('links').doc(linkId).update({
                    name: document.getElementById('linkName').value,
                    destinationUrl: document.getElementById('destinationUrl').value,
                    slug: document.getElementById('customSlug').value || link.slug
                });
                
                document.getElementById('createLinkModal').style.display = 'none';
                form.reset();
                form.onsubmit = originalSubmit;
                await loadUserData();
                loadLinksData();
                showToast('Link updated successfully!', 'success');
            } catch (error) {
                console.error('❌ Error updating link:', error);
                showToast('Error updating link. Please try again.', 'error');
            }
        };
    }
}

async function deleteLink(linkId) {
    if (confirm('Are you sure you want to delete this link? This action cannot be undone.')) {
        try {
            ensureFirebaseReady();
            await db.collection('links').doc(linkId).delete();
            await loadUserData();
            loadLinksData();
            showToast('Link deleted successfully!', 'success');
        } catch (error) {
            console.error('❌ Error deleting link:', error);
            showToast('Error deleting link. Please try again.', 'error');
        }
    }
}

// Make functions globally available
window.copyToClipboard = copyToClipboard;
window.editLink = editLink;
window.deleteLink = deleteLink;
