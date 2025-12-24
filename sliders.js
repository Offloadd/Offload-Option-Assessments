// ============================================================================
// OPTION ASSESSMENT FUNCTIONS
// ============================================================================

function loadLifeArea(areaKey) {
    // Set the active life area (empty string means no selection)
    state.activeLifeArea = areaKey || null;
    render();
}

function resetAssessmentSliders() {
    state.opportunity = { value: 0, why: '' };
    state.stressor = { value: 0, why: '' };
    state.stabilizer = { value: 0, why: '' };
}

function updateAssessment(type, value) {
    state[type].value = parseInt(value);
    const threatLoad = getThreatLoad();
    const opportunityLoad = getOpportunityLoad();
    const regulatedLoad = getRegulatedLoad();
    updateVisualization(threatLoad, opportunityLoad, regulatedLoad);
    // Don't call render() here - it wipes out textarea content while typing
}

function updateAssessmentText(type, text) {
    state[type].why = text;
}

function updateOptionText(text) {
    state.activeOptionText = text;
}

function toggleTextArea(type) {
    // Toggle the hidden state
    state.hiddenSliders[type] = !state.hiddenSliders[type];
    render();
}

function addLifeArea() {
    const label = prompt('Enter name for new life area:');
    if (!label || !label.trim()) return;
    
    const key = 'custom_' + Date.now();
    state.lifeAreas[key] = {
        label: label.trim(),
        visible: true,
        custom: true
    };
    saveLifeAreas();
    
    // Check if modal is open and refresh it
    const modal = document.getElementById('lifeAreasModal');
    if (modal && modal.classList.contains('active')) {
        renderLifeAreasModal();
    }
    render();
}

function editLifeArea(areaKey) {
    const area = state.lifeAreas[areaKey];
    const newLabel = prompt('Edit life area name:', area.label);
    if (!newLabel || !newLabel.trim()) return;
    
    area.label = newLabel.trim();
    saveLifeAreas();
    
    // Check if modal is open and refresh it
    const modal = document.getElementById('lifeAreasModal');
    if (modal && modal.classList.contains('active')) {
        renderLifeAreasModal();
    }
    render();
}

function deleteLifeArea(areaKey) {
    if (!confirm('Delete this life area?')) return;
    
    if (state.activeLifeArea === areaKey) {
        state.activeLifeArea = null;
    }
    
    delete state.lifeAreas[areaKey];
    saveLifeAreas();
    
    // Check if modal is open and refresh it
    const modal = document.getElementById('lifeAreasModal');
    if (modal && modal.classList.contains('active')) {
        renderLifeAreasModal();
    }
    render();
}

function toggleLifeAreaVisible(areaKey) {
    state.lifeAreas[areaKey].visible = !state.lifeAreas[areaKey].visible;
    saveLifeAreas();
    
    // Check if modal is open and refresh it
    const modal = document.getElementById('lifeAreasModal');
    if (modal && modal.classList.contains('active')) {
        renderLifeAreasModal();
    }
    render();
}

function saveLifeAreas() {
    saveToUserStorage('offloadLifeAreas', JSON.stringify(state.lifeAreas));
    saveLifeAreasToFirestore(state.lifeAreas); // Pass the actual data
}

async function loadLifeAreas() {
    // Try Firestore first
    const firestoreLifeAreas = await loadLifeAreasFromFirestore();
    
    if (firestoreLifeAreas) {
        state.lifeAreas = firestoreLifeAreas;
        // Also save to localStorage as backup
        saveToUserStorage('offloadLifeAreas', JSON.stringify(firestoreLifeAreas));
    } else {
        // If nothing in Firestore, try localStorage as backup
        try {
            const saved = loadFromUserStorage('offloadLifeAreas');
            if (saved) {
                state.lifeAreas = JSON.parse(saved);
                // Save to Firestore for future syncing
                saveLifeAreasToFirestore(state.lifeAreas);
            }
        } catch (e) {
            console.error('Error loading life areas:', e);
        }
    }
}
