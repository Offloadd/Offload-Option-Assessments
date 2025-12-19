// calculations.js - Load Calculation Functions

function getThreatLoad() {
    let threatTotal = 0;

    // Option Assessment - Stressor
    threatTotal += state.stressor.value;

    // Specific Experiences - Ambient sliders
    state.ambient.forEach(amb => {
        if (amb.value !== 0 && amb.type === 'threat') {
            threatTotal += amb.value;
        }
    });

    return threatTotal;
}

function getOpportunityLoad() {
    let opportunityTotal = 0;

    // Option Assessment - Opportunity
    opportunityTotal += state.opportunity.value;

    // Specific Experiences - Ambient sliders
    state.ambient.forEach(amb => {
        if (amb.value !== 0 && amb.type === 'opportunity') {
            opportunityTotal += amb.value;
        }
    });

    return opportunityTotal;
}

function getRegulatedLoad() {
    let regulatedTotal = 0;

    // Option Assessment - Stabilizer
    regulatedTotal += state.stabilizer.value;

    // Specific Experiences - Ambient sliders
    state.ambient.forEach(amb => {
        if (amb.value !== 0 && amb.type === 'regulated') {
            regulatedTotal += amb.value;
        }
    });

    return regulatedTotal;
}

function validateSave() {
    const errors = [];
    state.ambient.forEach((amb, i) => {
        if (amb.value !== 0) {
            if (!amb.type) errors.push('Internal Activity ' + (i+1) + ': Type is required when slider is not at 0');
            if (!amb.note.trim()) errors.push('Internal Activity ' + (i+1) + ': Note is required when slider is not at 0');
        }
    });
    return errors;
}

function resetAllSliders() {
    // Reset option assessment
    state.activeLifeArea = null;
    state.activeOptionText = '';
    state.opportunity = { value: 0, why: '' };
    state.stressor = { value: 0, why: '' };
    state.stabilizer = { value: 0, why: '' };

    // Reset ambient sliders - keep first one, reset it
    state.ambient = [{
        id: Date.now(),
        value: 0,
        type: 'opportunity',
        note: '',
        locked: false
    }];
}

async function saveEntry() {
    const errors = validateSave();
    if (errors.length > 0) {
        state.saveError = errors.join('<br>');
        render();
        return;
    }

    state.saveError = '';

    const threatLoad = getThreatLoad();
    const opportunityLoad = getOpportunityLoad();
    const regulatedLoad = getRegulatedLoad();

    const entry = {
        timestamp: new Date().toISOString(),
        threatLoad,
        opportunityLoad,
        regulatedLoad
    };

    // Add option assessment data if present
    if (state.activeLifeArea && state.activeOptionText.trim()) {
        entry.optionAssessment = {
            lifeArea: state.lifeAreas[state.activeLifeArea].label,
            optionText: state.activeOptionText,
            opportunity: { value: state.opportunity.value, why: state.opportunity.why },
            stressor: { value: state.stressor.value, why: state.stressor.why },
            stabilizer: { value: state.stabilizer.value, why: state.stabilizer.why }
        };
    }

    // Add ambient data if present
    const ambientData = state.ambient.filter(a => a.value !== 0).map(a => ({
        value: a.value,
        type: a.type,
        note: a.note
    }));
    
    if (ambientData.length > 0) {
        entry.ambient = ambientData;
    }

    await saveToFirestore(entry);
    
    state.entries.unshift(entry);
    saveToUserStorage('entries', JSON.stringify(state.entries));

    // RESET ALL SLIDERS after saving
    resetAllSliders();

    render();
    displayEntries();
}

function copyEntries() {
    const text = state.entries.map(e => {
        const date = new Date(e.timestamp).toLocaleString();
        return '=== ' + date + ' ===\nThreat: ' + e.threatLoad + ' | Regulated: ' + e.regulatedLoad + ' | Opportunity: ' + e.opportunityLoad;
    }).join('\n\n');
    navigator.clipboard.writeText(text);
    alert('Entries copied!');
}

async function clearEntries() {
    if (confirm('Clear all entries? This cannot be undone.')) {
        await clearFirestoreEntries();
        
        state.entries = [];
        saveToUserStorage('entries', JSON.stringify(state.entries));
        render();
        displayEntries();
    }
}
