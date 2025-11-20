// app.js - Admin Management System
// Easy-to-edit admin functions

class AdminManager {
    constructor(db) {
        this.db = db;
        this.adminConfigRef = this.db.collection('adminConfig').doc('settings');
    }

    // ========================
    // EASY CONFIGURATION METHODS
    // ========================

    // Set Admin Adsterra Link
    async setAdminAdsterraLink(link) {
        return await this.updateAdminConfig({ adminAdsterraLink: link });
    }

    // Turn Monthly Subscriptions On/Off
    async setSubscriptionEnabled(enabled) {
        return await this.updateAdminConfig({ subscriptionEnabled: enabled });
    }

    // Set Subscription Price
    async setSubscriptionPrice(price) {
        return await this.updateAdminConfig({ subscriptionPrice: price });
    }

    // Set Contact Support Link
    async setSupportLink(link) {
        return await this.updateAdminConfig({ contactSupportLink: link });
    }

    // Set Renew Subscription Link
    async setRenewLink(link) {
        return await this.updateAdminConfig({ renewSubscriptionLink: link });
    }

    // ========================
    // USER MANAGEMENT
    // ========================

    // Lock/Unlock User Account
    async toggleUserLock(userId, lock, reason = "") {
        try {
            await this.db.collection('users').doc(userId).update({
                accountLocked: lock,
                lockReason: reason,
                lockedAt: lock ? firebase.firestore.FieldValue.serverTimestamp() : null
            });
            return true;
        } catch (error) {
            console.error('Error toggling user lock:', error);
            return false;
        }
    }

    // Make User Admin
    async makeUserAdmin(userId) {
        try {
            await this.db.collection('users').doc(userId).update({
                isAdmin: true
            });
            return true;
        } catch (error) {
            console.error('Error making user admin:', error);
            return false;
        }
    }

    // ========================
    // SYSTEM MANAGEMENT
    // ========================

    // Get all users
    async getAllUsers() {
        try {
            const snapshot = await this.db.collection('users').get();
            const users = [];
            snapshot.forEach(doc => {
                users.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return users;
        } catch (error) {
            console.error('Error getting users:', error);
            return [];
        }
    }

    // Get system statistics
    async getSystemStats() {
        try {
            const usersSnapshot = await this.db.collection('users').get();
            const linksSnapshot = await this.db.collection('links').get();
            
            let totalClicks = 0;
            let totalEarnings = 0;
            
            linksSnapshot.forEach(doc => {
                const link = doc.data();
                totalClicks += link.clicks || 0;
                totalEarnings += (link.clicks || 0) * 0.01; // $0.01 per click
            });

            return {
                totalUsers: usersSnapshot.size,
                totalLinks: linksSnapshot.size,
                totalClicks: totalClicks,
                totalEarnings: totalEarnings.toFixed(2)
            };
        } catch (error) {
            console.error('Error getting system stats:', error);
            return null;
        }
    }

    // ========================
    // CORE METHODS
    // ========================

    async initializeAdminConfig() {
        try {
            const doc = await this.adminConfigRef.get();
            if (!doc.exists) {
                await this.adminConfigRef.set({
                    ...CONFIG,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('Admin configuration initialized');
            }
        } catch (error) {
            console.error('Error initializing admin config:', error);
        }
    }

    async getAdminConfig() {
        try {
            const doc = await this.adminConfigRef.get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error('Error getting admin config:', error);
            return null;
        }
    }

    async updateAdminConfig(updates) {
        try {
            await this.adminConfigRef.update({
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Admin configuration updated:', updates);
            return true;
        } catch (error) {
            console.error('Error updating admin config:', error);
            return false;
        }
    }
}

// Make available globally
window.AdminManager = AdminManager;
