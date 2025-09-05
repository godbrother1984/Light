/*
  path: /assets/js/firebase-init.js
  version: 1.1 (Added getCurrentUserId and getCurrentUser methods)
  date: 2025-09-05
  time: 20:40:00
  description: Firebase initialization, authentication, and common database operations with user methods
*/

// Firebase imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    onSnapshot,
    query,
    orderBy,
    where,
    limit
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';
import { 
    getAuth, 
    signInAnonymously, 
    signInWithCustomToken 
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';

/**
 * Firebase Application Manager Class
 * Handles Firebase initialization, authentication, and common operations
 */
export class FirebaseManager {
    constructor() {
        this.app = null;
        this.db = null;
        this.auth = null;
        this.appId = typeof __app_id !== 'undefined' ? __app_id : 'light-measuring-app';
        this.isInitialized = false;
    }

    /**
     * Initialize Firebase with configuration
     * @returns {Promise<boolean>} Success status
     */
    async initialize() {
        try {
            // Get Firebase configuration
            let finalFirebaseConfig = null;
            
            try {
                // Method 1: จาก window.firebaseConfig (รูปแบบที่คุณใช้อยู่)
                if (window.firebaseConfig && window.firebaseConfig.projectId) {
                    finalFirebaseConfig = window.firebaseConfig;
                    console.log('✅ Firebase Config loaded from window.firebaseConfig');
                }
                
                // Method 2: จาก global variables
                else if (typeof __firebase_config !== 'undefined') {
                    finalFirebaseConfig = JSON.parse(__firebase_config);
                    console.log('✅ Firebase Config loaded from __firebase_config');
                }
                
                // Method 3: ลองโหลดจากไฟล์ firebase-config.js
                else {
                    try {
                        // ลองโหลดจาก current directory
                        const configModule = await import('./firebase-config.js');
                        if (configModule.default) {
                            finalFirebaseConfig = configModule.default;
                            console.log('✅ Firebase Config loaded from ./firebase-config.js (default export)');
                        } else if (configModule.firebaseConfig) {
                            finalFirebaseConfig = configModule.firebaseConfig;
                            console.log('✅ Firebase Config loaded from ./firebase-config.js (named export)');
                        }
                    } catch (importError) {
                        console.warn('Could not import ./firebase-config.js:', importError.message);
                        
                        // ลองโหลดจาก parent directory
                        try {
                            const configModule = await import('../firebase-config.js');
                            if (configModule.default) {
                                finalFirebaseConfig = configModule.default;
                                console.log('✅ Firebase Config loaded from ../firebase-config.js (default export)');
                            } else if (configModule.firebaseConfig) {
                                finalFirebaseConfig = configModule.firebaseConfig;
                                console.log('✅ Firebase Config loaded from ../firebase-config.js (named export)');
                            }
                        } catch (parentImportError) {
                            console.warn('Could not import ../firebase-config.js:', parentImportError.message);
                        }
                    }
                }
                
            } catch (e) {
                console.error('Firebase config parsing error:', e);
            }

            if (!finalFirebaseConfig) {
                console.error('🔥 Firebase Config ไม่พบ! กรุณาตรวจสอบ:');
                console.error('1. ไฟล์ firebase-config.js มีอยู่และ load ได้');
                console.error('2. window.firebaseConfig ถูกตั้งค่าแล้ว');
                console.error('3. การตั้งค่า __firebase_config global variable');
                
                throw new Error('ไม่พบ Firebase Config - โปรดตรวจสอบการตั้งค่า');
            }

            // ตรวจสอบ required fields
            const requiredFields = ['apiKey', 'authDomain', 'projectId'];
            const missingFields = requiredFields.filter(field => !finalFirebaseConfig[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Firebase Config ไม่ครบถ้วน: ขาด ${missingFields.join(', ')}`);
            }

            console.log('🔥 Firebase Config validated successfully:', {
                projectId: finalFirebaseConfig.projectId,
                authDomain: finalFirebaseConfig.authDomain
            });

            // Initialize Firebase app
            this.app = initializeApp(finalFirebaseConfig);
            this.db = getFirestore(this.app);
            this.auth = getAuth(this.app);
            
            // Authenticate user
            await this.authenticateUser();
            
            this.isInitialized = true;
            console.log('Firebase initialized successfully');
            return true;
            
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            this.showError(`เกิดข้อผิดพลาดในการเชื่อมต่อระบบ: ${error.message}`);
            return false;
        }
    }

    /**
     * Authenticate user with Firebase
     * @returns {Promise<void>}
     */
    async authenticateUser() {
        try {
            if (typeof __initial_auth_token !== 'undefined') {
                await signInWithCustomToken(this.auth, __initial_auth_token);
            } else {
                await signInAnonymously(this.auth);
            }
            
            // Update user display
            const userDisplay = document.getElementById('user-display');
            if (userDisplay && this.auth.currentUser) {
                userDisplay.textContent = `UID: ${this.auth.currentUser.uid.substring(0, 8)}...`;
            }
            
            console.log('User authenticated successfully');
        } catch (error) {
            console.error('Authentication failed:', error);
            throw new Error(`การยืนยันตัวตนล้มเหลว: ${error.message}`);
        }
    }

    /**
     * Get collection reference
     * @param {string} path - Collection path
     * @returns {object} Collection reference
     */
    getCollection(path) {
        this.checkInitialization();
        const fullPath = path.startsWith('/') ? path : `/artifacts/${this.appId}/public/data/${path}`;
        return collection(this.db, fullPath);
    }

    /**
     * Get document reference
     * @param {string} path - Document path
     * @param {string} docId - Document ID
     * @returns {object} Document reference
     */
    getDocumentReference(path, docId) {
        this.checkInitialization();
        const fullPath = path.startsWith('/') ? path : `/artifacts/${this.appId}/public/data/${path}`;
        return doc(this.db, fullPath, docId);
    }

    /**
     * Add document to collection
     * @param {string} collectionPath - Collection path
     * @param {object} data - Document data
     * @returns {Promise<string>} Document ID
     */
    async addDocument(collectionPath, data) {
        this.checkInitialization();
        try {
            const collectionRef = this.getCollection(collectionPath);
            const timestamp = new Date();
            
            const docData = {
                ...data,
                createdAt: timestamp,
                updatedAt: timestamp
            };
            
            const docRef = await addDoc(collectionRef, docData);
            console.log('Document added with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error adding document:', error);
            throw new Error(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${error.message}`);
        }
    }

    /**
     * Update document
     * @param {string} collectionPath - Collection path
     * @param {string} docId - Document ID
     * @param {object} data - Updated data
     * @returns {Promise<void>}
     */
    async updateDocument(collectionPath, docId, data) {
        this.checkInitialization();
        try {
            const docRef = this.getDocumentReference(collectionPath, docId);
            const updatedData = {
                ...data,
                updatedAt: new Date()
            };
            
            await updateDoc(docRef, updatedData);
            console.log('Document updated successfully:', docId);
        } catch (error) {
            console.error('Error updating document:', error);
            throw new Error(`เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ${error.message}`);
        }
    }

    /**
     * Delete document
     * @param {string} collectionPath - Collection path
     * @param {string} docId - Document ID
     * @returns {Promise<void>}
     */
    async deleteDocument(collectionPath, docId) {
        this.checkInitialization();
        try {
            const docRef = this.getDocumentReference(collectionPath, docId);
            await deleteDoc(docRef);
            console.log('Document deleted successfully:', docId);
        } catch (error) {
            console.error('Error deleting document:', error);
            throw new Error(`เกิดข้อผิดพลาดในการลบข้อมูล: ${error.message}`);
        }
    }

    /**
     * Get all documents from collection
     * @param {string} collectionPath - Collection path
     * @param {object} options - Query options
     * @returns {Promise<Array>} Documents array
     */
    async getDocuments(collectionPath, options = {}) {
        this.checkInitialization();
        try {
            let collectionRef = this.getCollection(collectionPath);
            
            // Apply query options
            if (options.orderBy) {
                collectionRef = query(collectionRef, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
            }
            
            if (options.where) {
                collectionRef = query(collectionRef, where(options.where.field, options.where.operator, options.where.value));
            }
            
            if (options.limit) {
                collectionRef = query(collectionRef, limit(options.limit));
            }
            
            const snapshot = await getDocs(collectionRef);
            const documents = [];
            
            snapshot.forEach((doc) => {
                documents.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            
            return documents;
        } catch (error) {
            console.error('Error getting documents:', error);
            throw new Error(`เกิดข้อผิดพลาดในการโหลดข้อมูล: ${error.message}`);
        }
    }

    /**
     * Get single document
     * @param {string} collectionPath - Collection path
     * @param {string} docId - Document ID
     * @returns {Promise<object|null>} Document data
     */
    async getDocument(collectionPath, docId) {
        this.checkInitialization();
        try {
            const docRef = this.getDocumentReference(collectionPath, docId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    data: docSnap.data()
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting document:', error);
            throw new Error(`เกิดข้อผิดพลาดในการโหลดข้อมูล: ${error.message}`);
        }
    }

    /**
     * Listen to collection changes
     * @param {string} collectionPath - Collection path
     * @param {function} callback - Callback function
     * @param {object} options - Query options
     * @returns {function} Unsubscribe function
     */
    listenToCollection(collectionPath, callback, options = {}) {
        this.checkInitialization();
        try {
            let collectionRef = this.getCollection(collectionPath);
            
            // Apply query options
            if (options.orderBy) {
                collectionRef = query(collectionRef, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
            }
            
            if (options.where) {
                collectionRef = query(collectionRef, where(options.where.field, options.where.operator, options.where.value));
            }
            
            return onSnapshot(collectionRef, callback, (error) => {
                console.error('Firestore listener error:', error);
                this.showError(`เกิดข้อผิดพลาดในการติดตามข้อมูล: ${error.message}`);
            });
        } catch (error) {
            console.error('Error setting up listener:', error);
            throw new Error(`เกิดข้อผิดพลาดในการติดตามข้อมูล: ${error.message}`);
        }
    }

    /**
     * Check if Firebase is initialized
     * @throws {Error} If not initialized
     */
    checkInitialization() {
        if (!this.isInitialized) {
            throw new Error('Firebase ยังไม่ได้ initialize กรุณา initialize ก่อนใช้งาน');
        }
    }

    /**
     * Show error message to user
     * @param {string} message - Error message
     */
    showError(message) {
        if (window.showAlert) {
            window.showAlert(message, 'danger');
        } else {
            console.error(message);
            alert(message);
        }
    }

    /**
     * Get Firebase instances (for backward compatibility)
     * @returns {object} Firebase instances
     */
    getInstances() {
        this.checkInitialization();
        return {
            app: this.app,
            db: this.db,
            auth: this.auth,
            appId: this.appId
        };
    }
    
    /**
     * Get current user ID
     * @returns {string} Current user ID
     */
    getCurrentUserId() {
        if (!this.auth || !this.auth.currentUser) {
            throw new Error('No authenticated user');
        }
        return this.auth.currentUser.uid;
    }
    
    /**
     * Get current user object
     * @returns {Object} Current user object
     */
    getCurrentUser() {
        if (!this.auth || !this.auth.currentUser) {
            return null;
        }
        return this.auth.currentUser;
    }
}

// Create global instance
export const firebaseManager = new FirebaseManager();

// Initialize Firebase when module loads (for backward compatibility)
export const initializeFirebase = async () => {
    return await firebaseManager.initialize();
};

// Export Firebase functions for direct use
export {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    where,
    limit
} from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';

// Default export for easy importing
export default firebaseManager;