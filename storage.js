// ============================================================================
// USER-SPECIFIC STORAGE FUNCTIONS
// ============================================================================

function getUserStorageKey(key) {
    const user = window.currentUser;
    if (!user) return key;
    return `offload_${user.uid}_${key}`;
}

function saveToUserStorage(key, value) {
    const userKey = getUserStorageKey(key);
    localStorage.setItem(userKey, typeof value === 'string' ? value : JSON.stringify(value));
}

function loadFromUserStorage(key) {
    const userKey = getUserStorageKey(key);
    return localStorage.getItem(userKey);
}

function saveState() {
    try {
        const stateToSave = {
            lifeAreas: state.lifeAreas
        };
        saveToUserStorage('offloadState', JSON.stringify(stateToSave));
    } catch (e) {
        console.error('Error saving state:', e);
    }
}

function loadState() {
    try {
        const saved = loadFromUserStorage('offloadState');
        if (saved) {
            const parsed = JSON.parse(saved);
            
            if (parsed.lifeAreas) {
                state.lifeAreas = parsed.lifeAreas;
            }
        }
        
        loadLifeAreas();
    } catch (e) {
        console.error('Error loading state:', e);
    }
}
