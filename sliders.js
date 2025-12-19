// ============================================================================
// OPTION ASSESSMENT FUNCTIONS
// ============================================================================

function loadLifeArea(areaKey) {
    // If clicking the same area, deselect it
    if (state.activeLifeArea === areaKey) {
        state.activeLifeArea = null;
        state.activeOptionText = '';
        resetAssessmentSliders();
    } else {
        state.activeLifeArea = areaKey;
        state.activeOptionText = '';
        resetAssessmentSliders();
    }
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
}

function updateAssessmentText(type, text) {
    state[type].why = text;
}

function updateOptionText(text) {
    state.activeOptionText = text;
}

function toggleTextArea(type) {
    const textarea = document.getElementById(type + 'Text');
    if (textarea) {
        textarea.style.display = textarea.style.display === 'none' ? 'block' : 'none';
    }
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
    render();
}

function editLifeArea(areaKey) {
    const area = state.lifeAreas[areaKey];
    const newLabel = prompt('Edit life area name:', area.label);
    if (!newLabel || !newLabel.trim()) return;
    
    area.label = newLabel.trim();
    saveLifeAreas();
    render();
}

function deleteLifeArea(areaKey) {
    if (!confirm('Delete this life area?')) return;
    
    if (state.activeLifeArea === areaKey) {
        state.activeLifeArea = null;
        state.activeOptionText = '';
        resetAssessmentSliders();
    }
    
    delete state.lifeAreas[areaKey];
    saveLifeAreas();
    render();
}

function toggleLifeAreaVisible(areaKey) {
    state.lifeAreas[areaKey].visible = !state.lifeAreas[areaKey].visible;
    saveLifeAreas();
    render();
}

function saveLifeAreas() {
    saveToUserStorage('offloadLifeAreas', JSON.stringify(state.lifeAreas));
}

function loadLifeAreas() {
    try {
        const saved = loadFromUserStorage('offloadLifeAreas');
        if (saved) {
            state.lifeAreas = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Error loading life areas:', e);
    }
}

// ============================================================================
// AMBIENT SLIDER FUNCTIONS (SPECIFIC EXPERIENCES)
// ============================================================================

function toggleAmbientLock(id) {
    const amb = state.ambient.find(a => a.id === id);
    if (amb) {
        amb.locked = !amb.locked;
        render();
    }
}

function addAmbientSlider() {
    if (state.ambient.length >= 6) return;
    state.ambient.push({
        id: Date.now(),
        value: 0,
        type: 'opportunity',
        note: '',
        locked: false
    });
    render();
}

function deleteAmbientSlider(id) {
    if (state.ambient.length <= 1) {
        alert('Must keep at least one internal experience slider');
        return;
    }
    state.ambient = state.ambient.filter(a => a.id !== id);
    render();
}

function updateAmbient(id, field, value) {
    const amb = state.ambient.find(a => a.id === id);
    if (!amb || amb.locked) return;

    if (field === 'value') {
        amb.value = parseInt(value);
        const threatLoad = getThreatLoad();
        const opportunityLoad = getOpportunityLoad();
        const regulatedLoad = getRegulatedLoad();
        updateVisualization(threatLoad, opportunityLoad, regulatedLoad);
        
        const allSliderValues = document.querySelectorAll('.slider-value');
        allSliderValues.forEach(span => {
            const container = span.closest('.slider-container');
            if (container) {
                const rangeInput = container.querySelector('input[type="range"]');
                if (rangeInput && rangeInput.value == value) {
                    const oninputAttr = rangeInput.getAttribute('oninput');
                    if (oninputAttr && oninputAttr.includes('updateAmbient(' + id)) {
                        span.textContent = value;
                    }
                }
            }
        });
    } else {
        amb[field] = value;
        if (field === 'type') {
            render();
        }
    }
}
