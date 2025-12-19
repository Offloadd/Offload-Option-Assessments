// ============================================================================
// FIRESTORE DATABASE FUNCTIONS
// ============================================================================

async function saveToFirestore(entry) {
    const user = window.currentUser;
    if (!user || !window.db) {
        console.log('No user or Firestore not initialized, skipping cloud save');
        return;
    }
    
    try {
        await db.collection('users').doc(user.uid).collection('entries').add(entry);
        console.log('Entry saved to Firestore');
    } catch (error) {
        console.error('Error saving to Firestore:', error);
    }
}

async function saveLifeAreasToFirestore(lifeAreas) {
    const user = window.currentUser;
    if (!user || !window.db) {
        console.log('No user or Firestore not initialized, skipping cloud save');
        return;
    }
    
    try {
        await db.collection('users').doc(user.uid).set({
            lifeAreas: lifeAreas
        }, { merge: true });
        console.log('Life areas saved to Firestore');
    } catch (error) {
        console.error('Error saving life areas to Firestore:', error);
    }
}

async function loadLifeAreasFromFirestore() {
    const user = window.currentUser;
    if (!user || !window.db) {
        console.log('No user or Firestore not initialized');
        return null;
    }
    
    try {
        const doc = await db.collection('users').doc(user.uid).get();
        if (doc.exists && doc.data().lifeAreas) {
            console.log('Loaded life areas from Firestore');
            return doc.data().lifeAreas;
        }
        return null;
    } catch (error) {
        console.error('Error loading life areas from Firestore:', error);
        return null;
    }
}

async function saveLifeAreasToFirestore() {
    const user = window.currentUser;
    if (!user || !window.db) {
        console.log('No user or Firestore not initialized, skipping cloud save');
        return;
    }
    
    try {
        await db.collection('users').doc(user.uid).set({
            lifeAreas: state.lifeAreas
        }, { merge: true });
        console.log('Life areas saved to Firestore');
    } catch (error) {
        console.error('Error saving life areas to Firestore:', error);
    }
}

async function loadLifeAreasFromFirestore() {
    const user = window.currentUser;
    if (!user || !window.db) {
        console.log('No user or Firestore not initialized');
        return;
    }
    
    try {
        const doc = await db.collection('users').doc(user.uid).get();
        if (doc.exists && doc.data().lifeAreas) {
            state.lifeAreas = doc.data().lifeAreas;
            console.log('Loaded life areas from Firestore');
            saveToUserStorage('offloadLifeAreas', JSON.stringify(state.lifeAreas));
        } else {
            console.log('No life areas found in Firestore, using defaults');
        }
    } catch (error) {
        console.error('Error loading life areas from Firestore:', error);
    }
}

async function loadFromFirestore() {
    const user = window.currentUser;
    if (!user || !window.db) {
        console.log('No user or Firestore not initialized');
        return;
    }
    
    try {
        // Load life areas first
        const firestoreLifeAreas = await loadLifeAreasFromFirestore();
        if (firestoreLifeAreas) {
            state.lifeAreas = firestoreLifeAreas;
            saveToUserStorage('offloadLifeAreas', JSON.stringify(firestoreLifeAreas));
        }
        
        // Then load entries
        const snapshot = await db.collection('users')
            .doc(user.uid)
            .collection('entries')
            .orderBy('timestamp', 'desc')
            .limit(100)
            .get();
        
        const entries = [];
        snapshot.forEach(doc => {
            entries.push({ id: doc.id, ...doc.data() });
        });
        
        state.entries = entries;
        console.log('Loaded', entries.length, 'entries from Firestore');
        
        saveToUserStorage('entries', JSON.stringify(entries));
        displayEntries();
    } catch (error) {
        console.error('Error loading from Firestore:', error);
        loadEntriesFromLocalStorage();
    }
}

async function deleteFromFirestore(entryId) {
    const user = window.currentUser;
    if (!user || !window.db || !entryId) {
        return;
    }
    
    try {
        await db.collection('users').doc(user.uid).collection('entries').doc(entryId).delete();
        console.log('Entry deleted from Firestore');
    } catch (error) {
        console.error('Error deleting from Firestore:', error);
    }
}

async function clearFirestoreEntries() {
    const user = window.currentUser;
    if (!user || !window.db) {
        return;
    }
    
    try {
        const snapshot = await db.collection('users')
            .doc(user.uid)
            .collection('entries')
            .get();
        
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();
        console.log('All entries cleared from Firestore');
    } catch (error) {
        console.error('Error clearing Firestore:', error);
    }
}

function loadEntriesFromLocalStorage() {
    const saved = loadFromUserStorage('entries');
    if (saved) {
        try {
            state.entries = JSON.parse(saved);
            console.log('Loaded', state.entries.length, 'entries from localStorage (backup)');
            displayEntries();
        } catch (e) {
            console.error('Error loading from localStorage:', e);
            state.entries = [];
        }
    }
}
