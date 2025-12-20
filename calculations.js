// calculations.js - Load Calculation Functions

function getThreatLoad() {
    return state.stressor.value;
}

function getOpportunityLoad() {
    return state.opportunity.value;
}

function getRegulatedLoad() {
    return state.stabilizer.value;
}

function validateSave() {
    const errors = [];
    
    if (!state.activeOptionText.trim()) {
        errors.push('Please describe what you\'re considering in the text field');
    }
    
    const hasData = state.opportunity.value > 0 || state.stressor.value > 0 || state.stabilizer.value > 0;
    if (!hasData) {
        errors.push('Please rate at least one assessment slider');
    }
    
    return errors;
}

function addToComparison() {
    const errors = validateSave();
    if (errors.length > 0) {
        state.saveError = errors.join('<br>');
        render();
        return;
    }
    
    if (state.comparison.length >= 6) {
        alert('Maximum of 6 options in comparison. Please save or clear some first.');
        return;
    }
    
    state.saveError = '';
    
    const threatLoad = getThreatLoad();
    const opportunityLoad = getOpportunityLoad();
    const regulatedLoad = getRegulatedLoad();
    
    const option = {
        id: Date.now(),
        lifeArea: state.activeLifeArea ? state.lifeAreas[state.activeLifeArea].label : 'General',
        optionText: state.activeOptionText,
        opportunity: { value: state.opportunity.value, why: state.opportunity.why },
        stressor: { value: state.stressor.value, why: state.stressor.why },
        stabilizer: { value: state.stabilizer.value, why: state.stabilizer.why },
        threatLoad,
        opportunityLoad,
        regulatedLoad
    };
    
    state.comparison.push(option);
    resetAllSliders();
    render();
}

function deleteFromComparison(id) {
    state.comparison = state.comparison.filter(opt => opt.id !== id);
    render();
}

function clearComparison() {
    if (state.comparison.length > 0 && !confirm('Clear all options from comparison?')) {
        return;
    }
    state.comparison = [];
    render();
}

async function saveAllComparison() {
    if (state.comparison.length === 0) {
        alert('No options in comparison to save');
        return;
    }
    
    if (!confirm(`Save all ${state.comparison.length} options to data set?`)) {
        return;
    }
    
    for (const option of state.comparison) {
        const entry = {
            timestamp: new Date().toISOString(),
            lifeArea: option.lifeArea,
            optionText: option.optionText,
            opportunity: option.opportunity,
            stressor: option.stressor,
            stabilizer: option.stabilizer,
            threatLoad: option.threatLoad,
            opportunityLoad: option.opportunityLoad,
            regulatedLoad: option.regulatedLoad
        };
        
        await saveToFirestore(entry);
        state.entries.unshift(entry);
    }
    
    saveToUserStorage('entries', JSON.stringify(state.entries));
    state.comparison = [];
    render();
    displayEntries();
}

function resetAllSliders() {
    state.activeLifeArea = null;
    state.activeOptionText = '';
    state.opportunity = { value: 0, why: '' };
    state.stressor = { value: 0, why: '' };
    state.stabilizer = { value: 0, why: '' };
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
        lifeArea: state.activeLifeArea ? state.lifeAreas[state.activeLifeArea].label : 'General',
        optionText: state.activeOptionText,
        opportunity: { value: state.opportunity.value, why: state.opportunity.why },
        stressor: { value: state.stressor.value, why: state.stressor.why },
        stabilizer: { value: state.stabilizer.value, why: state.stabilizer.why },
        threatLoad,
        opportunityLoad,
        regulatedLoad
    };

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
