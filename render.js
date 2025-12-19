// render.js - Main Render Function

function render() {
const html =
'<div class="card header" style="padding: 12px;">' +
'<div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">' +
'<div style="display: flex; align-items: center; gap: 12px;">' +
'<h1 style="margin: 0;">Offload</h1>' +
'<div class="subtitle" style="margin: 0;">An emotion tolerance and decision-making companion.</div>' +
'</div>' +
'<button class="btn" onclick="openIntroModal()" style="padding: 6px 12px; font-size: 13px; background: #6366f1; color: white; white-space: nowrap;">ℹ️ Intro</button>' +
'</div>' +
'</div>' +

    '<div class="sections-grid">' +

    // Section 1: Option Assessment
    '<div class="section-card section-green ' + (state.section1Expanded ? 'expanded' : '') + '" ' +
         (state.section1Expanded ? '' : 'onclick="event.stopPropagation(); toggleSection(1)"') + '>' +
        '<div class="section-header">' +
            '<div>' +
                '<div class="section-title">1. Option Assessment</div>' +
                (state.section1Expanded ? '' : '<div class="section-subtitle">What decision am I considering?</div>') +
            '</div>' +
            '<button class="expand-btn" onclick="event.stopPropagation(); toggleSection(1)" style="background: #16a34a;">' +
                (state.section1Expanded ? 'Hide ▲' : 'Show ▼') +
            '</button>' +
        '</div>' +
        (state.section1Expanded ?
            '<div style="margin-top: 12px;">' +
                // Life Areas Section
                '<div style="margin-bottom: 12px;">' +
                    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">' +
                        '<h3 style="margin: 0; font-size: 16px;">Life Areas & Options</h3>' +
                        '<button class="btn" onclick="addLifeArea()" style="background: #16a34a; color: white; font-size: 12px;">+ Add Life Area</button>' +
                    '</div>' +
                    '<div style="font-size: 13px; color: #6b7280; margin-bottom: 12px;">Click a life area to assess a specific option</div>' +
                    '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">' +
                        Object.keys(state.lifeAreas).filter(key => state.lifeAreas[key].visible).map(areaKey => {
                            const area = state.lifeAreas[areaKey];
                            const isActive = state.activeLifeArea === areaKey;
                            return '<div style="display: flex; align-items: center; gap: 4px;">' +
                                   '<div class="life-area-item ' + (isActive ? 'active' : '') + '" ' +
                                   'onclick="loadLifeArea(\'' + areaKey + '\')" style="flex: 1; margin: 0; padding: 8px 12px; background: #f9fafb; border-radius: 4px; cursor: pointer; transition: all 0.2s; border-left: 3px solid #3b82f6;">' +
                                   area.label +
                                   (isActive ? ' ✓' : '') +
                                   '</div>' +
                                   '<button class="btn" onclick="event.stopPropagation(); editLifeArea(\'' + areaKey + '\')" ' +
                                           'style="background: #3b82f6; color: white; padding: 4px 8px; font-size: 11px; flex-shrink: 0;">✏️</button>' +
                                   (area.custom ?
                                       '<button class="btn" onclick="event.stopPropagation(); deleteLifeArea(\'' + areaKey + '\')" ' +
                                               'style="background: #dc2626; color: white; padding: 4px 8px; font-size: 11px; flex-shrink: 0;">🗑️</button>' :
                                       '<button class="btn" onclick="event.stopPropagation(); toggleLifeAreaVisible(\'' + areaKey + '\')" ' +
                                               'style="background: #6b7280; color: white; padding: 4px 8px; font-size: 11px; flex-shrink: 0;">👁️</button>') +
                                   '</div>';
                        }).join('') +
                    '</div>' +
                    (Object.keys(state.lifeAreas).filter(key => !state.lifeAreas[key].visible).length > 0 ?
                        '<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">' +
                            '<div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 6px;">Hidden Areas:</div>' +
                            Object.keys(state.lifeAreas).filter(key => !state.lifeAreas[key].visible).map(areaKey => {
                                const area = state.lifeAreas[areaKey];
                                return '<div style="display: inline-block; margin: 2px;">' +
                                       '<button class="btn" onclick="toggleLifeAreaVisible(\'' + areaKey + '\')" ' +
                                               'style="background: #f3f4f6; color: #6b7280; padding: 4px 8px; font-size: 11px; border: 1px solid #d1d5db;">' +
                                           area.label + ' (Show)' +
                                       '</button>' +
                                       '</div>';
                            }).join('') +
                        '</div>' : '') +
                '</div>' +
                
                // Assessment Zone
                '<div style="background: #f0f9ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 10px; margin-top: 12px;">' +
                    '<h3 style="margin-bottom: 12px; font-size: 16px;">' + 
                        (state.activeLifeArea ? '🎯 Assessing: ' + state.lifeAreas[state.activeLifeArea].label : 'Select a Life Area to Begin Assessment') +
                    '</h3>' +
                    '<div style="margin-bottom: 8px;">' +
                        '<label style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 14px;">What specific option are you considering?</label>' +
                        '<input type="text" ' +
                               'value="' + state.activeOptionText + '" ' +
                               'oninput="updateOptionText(this.value);" ' +
                               (state.activeLifeArea ? '' : 'disabled ') +
                               'placeholder="' + (state.activeLifeArea ? 'e.g., Accept Isaac\'s excavation project' : 'Select a life area first') + '" ' +
                               'style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">' +
                    '</div>' +
                    
                    // Opportunity slider
                    '<div class="slider-group" style="margin-bottom: 5px;">' +
                        '<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 2px;">' +
                            '<div style="color: #4caf50; white-space: nowrap; font-size: 13px; font-weight: 600;">💚 Opportunity</div>' +
                            '<div style="color: #4caf50; font-weight: bold; min-width: 24px; text-align: center; font-size: 16px;">' + state.opportunity.value + '</div>' +
                            '<div style="flex: 1; max-width: 90%;">' +
                                '<input type="range" min="0" max="10" value="' + state.opportunity.value + '" ' +
                                       'oninput="updateAssessment(\'opportunity\', this.value)" ' +
                                       (state.activeLifeArea ? '' : 'disabled ') +
                                       'style="width: 100%; height: 6px; border-radius: 3px; outline: none; -webkit-appearance: none; cursor: pointer; ' +
                                       'background: ' + getAssessmentGradient('opportunity') + '; ' + 
                                       (state.activeLifeArea ? '' : 'opacity: 0.5; cursor: not-allowed;') + '">' +
                            '</div>' +
                            '<button class="btn" onclick="toggleTextArea(\'opportunity\')" ' +
                                    (state.activeLifeArea ? '' : 'disabled ') +
                                    'style="background: #e5e7eb; color: #374151; padding: 4px 8px; font-size: 11px; white-space: nowrap; ' +
                                    (state.activeLifeArea ? '' : 'opacity: 0.5; cursor: not-allowed;') + '">text</button>' +
                        '</div>' +
                        '<textarea id="opportunityText" style="display: none; width: 100%; padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; font-family: inherit; height: 18px; resize: none; overflow-y: auto;" ' +
                               'placeholder="Why does this feel like an opportunity?" ' +
                               (state.activeLifeArea ? '' : 'disabled ') +
                               'oninput="updateAssessmentText(\'opportunity\', this.value)">' + state.opportunity.why + '</textarea>' +
                    '</div>' +
                    
                    // Stressor slider
                    '<div class="slider-group" style="margin-bottom: 5px;">' +
                        '<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 2px;">' +
                            '<div style="color: #f44336; white-space: nowrap; font-size: 13px; font-weight: 600;">⚠️ Stressor</div>' +
                            '<div style="color: #f44336; font-weight: bold; min-width: 24px; text-align: center; font-size: 16px;">' + state.stressor.value + '</div>' +
                            '<div style="flex: 1; max-width: 90%;">' +
                                '<input type="range" min="0" max="10" value="' + state.stressor.value + '" ' +
                                       'oninput="updateAssessment(\'stressor\', this.value)" ' +
                                       (state.activeLifeArea ? '' : 'disabled ') +
                                       'style="width: 100%; height: 6px; border-radius: 3px; outline: none; -webkit-appearance: none; cursor: pointer; ' +
                                       'background: ' + getAssessmentGradient('stressor') + '; ' + 
                                       (state.activeLifeArea ? '' : 'opacity: 0.5; cursor: not-allowed;') + '">' +
                            '</div>' +
                            '<button class="btn" onclick="toggleTextArea(\'stressor\')" ' +
                                    (state.activeLifeArea ? '' : 'disabled ') +
                                    'style="background: #e5e7eb; color: #374151; padding: 4px 8px; font-size: 11px; white-space: nowrap; ' +
                                    (state.activeLifeArea ? '' : 'opacity: 0.5; cursor: not-allowed;') + '">text</button>' +
                        '</div>' +
                        '<textarea id="stressorText" style="display: none; width: 100%; padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; font-family: inherit; height: 18px; resize: none; overflow-y: auto;" ' +
                               'placeholder="Why does this feel stressful?" ' +
                               (state.activeLifeArea ? '' : 'disabled ') +
                               'oninput="updateAssessmentText(\'stressor\', this.value)">' + state.stressor.why + '</textarea>' +
                    '</div>' +
                    
                    // Stabilizer slider
                    '<div class="slider-group" style="margin-bottom: 5px;">' +
                        '<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 2px;">' +
                            '<div style="color: #1976d2; white-space: nowrap; font-size: 13px; font-weight: 600;">🛡️ Stabilizer</div>' +
                            '<div style="color: #1976d2; font-weight: bold; min-width: 24px; text-align: center; font-size: 16px;">' + state.stabilizer.value + '</div>' +
                            '<div style="flex: 1; max-width: 90%;">' +
                                '<input type="range" min="0" max="10" value="' + state.stabilizer.value + '" ' +
                                       'oninput="updateAssessment(\'stabilizer\', this.value)" ' +
                                       (state.activeLifeArea ? '' : 'disabled ') +
                                       'style="width: 100%; height: 6px; border-radius: 3px; outline: none; -webkit-appearance: none; cursor: pointer; ' +
                                       'background: ' + getAssessmentGradient('stabilizer') + '; ' + 
                                       (state.activeLifeArea ? '' : 'opacity: 0.5; cursor: not-allowed;') + '">' +
                            '</div>' +
                            '<button class="btn" onclick="toggleTextArea(\'stabilizer\')" ' +
                                    (state.activeLifeArea ? '' : 'disabled ') +
                                    'style="background: #e5e7eb; color: #374151; padding: 4px 8px; font-size: 11px; white-space: nowrap; ' +
                                    (state.activeLifeArea ? '' : 'opacity: 0.5; cursor: not-allowed;') + '">text</button>' +
                        '</div>' +
                        '<textarea id="stabilizerText" style="display: none; width: 100%; padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; font-family: inherit; height: 18px; resize: none; overflow-y: auto;" ' +
                               'placeholder="Why does this feel stabilizing?" ' +
                               (state.activeLifeArea ? '' : 'disabled ') +
                               'oninput="updateAssessmentText(\'stabilizer\', this.value)">' + state.stabilizer.why + '</textarea>' +
                    '</div>' +
                '</div>' +
            '</div>'
        : '') +
    '</div>' +

    renderPart2();

document.getElementById('app').innerHTML = html;

const threatLoad = getThreatLoad();
const opportunityLoad = getOpportunityLoad();
const regulatedLoad = getRegulatedLoad();
setTimeout(() => updateVisualization(threatLoad, opportunityLoad, regulatedLoad), 0);
displayEntries();
}

// render.js - Part 2 - Specific Experiences, Visualization, Save Button

function renderPart2() {
    return // Section 2: Specific Experiences (formerly Section 4)
    '<div class="section-card section-orange ' + (state.section2Expanded ? 'expanded' : '') + '" ' +
         (state.section2Expanded ? '' : 'onclick="event.stopPropagation(); toggleSection(2)"') + '>' +
        '<div class="section-header">' +
            '<div>' +
                '<div class="section-title">2. Specific Experiences</div>' +
                (state.section2Expanded ? '' : '<div class="section-subtitle">What needs offloading right now?</div>') +
            '</div>' +
            '<button class="expand-btn" onclick="event.stopPropagation(); toggleSection(2)" style="background: #f97316;">' +
                (state.section2Expanded ? 'Hide ▲' : 'Show ▼') +
            '</button>' +
        '</div>' +
        (state.section2Expanded ?
            '<div style="margin-top: 12px;">' +
                state.ambient.map(amb =>
                    '<div class="slider-container" style="position: relative; background: #f9fafb; padding: 6px; border-radius: 4px; margin-bottom: 5px;">' +
                        '<div style="display: flex; gap: 8px; align-items: flex-start; flex-wrap: wrap;">' +
                            '<div style="flex: 1; min-width: 250px;">' +
                                '<div style="margin-bottom: 6px;">' +
                                    '<label class="input-label" style="font-size: 14px; margin: 0 0 6px 0; display: block;">What is on your mind or affecting your nerves?</label>' +
                                    '<div style="display: flex; gap: 4px;">' +
                                        '<button onclick="updateAmbient(' + amb.id + ', \'type\', \'threat\')" ' +
                                                (amb.locked ? 'disabled' : '') + ' ' +
                                                'style="flex: 1; padding: 6px 10px; border: 2px solid #f44336; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer; ' +
                                                (amb.type === 'threat' ? 'background: #f44336; color: white;' : 'background: white; color: #f44336;') + ' ' +
                                                (amb.locked ? 'opacity: 0.6; cursor: not-allowed;' : '') + '">' +
                                            'Stressor' +
                                        '</button>' +
                                        '<button onclick="updateAmbient(' + amb.id + ', \'type\', \'opportunity\')" ' +
                                                (amb.locked ? 'disabled' : '') + ' ' +
                                                'style="flex: 1; padding: 6px 10px; border: 2px solid #4caf50; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer; ' +
                                                (amb.type === 'opportunity' ? 'background: #4caf50; color: white;' : 'background: white; color: #4caf50;') + ' ' +
                                                (amb.locked ? 'opacity: 0.6; cursor: not-allowed;' : '') + '">' +
                                            'Opportunity' +
                                        '</button>' +
                                        '<button onclick="updateAmbient(' + amb.id + ', \'type\', \'regulated\')" ' +
                                                (amb.locked ? 'disabled' : '') + ' ' +
                                                'style="flex: 1; padding: 6px 10px; border: 2px solid #1976d2; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer; ' +
                                                (amb.type === 'regulated' ? 'background: #1976d2; color: white;' : 'background: white; color: #1976d2;') + ' ' +
                                                (amb.locked ? 'opacity: 0.6; cursor: not-allowed;' : '') + '">' +
                                            'Stabilizer' +
                                        '</button>' +
                                    '</div>' +
                                '</div>' +
                                '<textarea oninput="updateAmbient(' + amb.id + ', \'note\', this.value)" ' +
                                          'placeholder="Brief description..." ' +
                                          (amb.locked ? 'disabled' : '') + ' ' +
                                          'style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; font-family: inherit; min-height: 50px; resize: vertical; ' + 
                                          (amb.locked ? 'opacity: 0.6; cursor: not-allowed; background: #f3f4f6;' : '') + '">' + amb.note + '</textarea>' +
                            '</div>' +

                            '<div style="display: flex; gap: 8px; width: 100%;">' +
                                '<div style="flex: 0 0 75%;">' +
                                    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">' +
                                        '<span style="font-weight: 600; color: #111827; font-size: 14px;">Intensity/Loudness</span>' +
                                        '<span class="slider-value" style="font-size: 18px; font-weight: bold; color: ' + (amb.type === 'threat' ? '#f44336' : amb.type === 'regulated' ? '#1976d2' : '#4caf50') + ';">' + amb.value + '</span>' +
                                    '</div>' +
                                    '<input type="range" min="0" max="10" value="' + amb.value + '" ' +
                                           'oninput="updateAmbient(' + amb.id + ', \'value\', this.value)" ' +
                                           (amb.locked ? 'disabled' : '') + ' ' +
                                           'style="width: 100%; height: 6px; border-radius: 3px; outline: none; -webkit-appearance: none; cursor: pointer; ' +
                                           'background: ' + getAmbientSliderGradient(amb.type) + '; ' + 
                                           (amb.locked ? 'opacity: 0.6; cursor: not-allowed;' : '') + '">' +
                                '</div>' +

                                '<div style="display: flex; flex-direction: column; gap: 4px; align-self: center; margin-left: 10px;">' +
                                    '<button type="button" class="btn" onclick="toggleAmbientLock(' + amb.id + ')" ' +
                                            'style="padding: 4px 8px; font-size: 11px; white-space: nowrap; ' + (amb.locked ? 'background: #f59e0b; color: white;' : 'background: #3b82f6; color: white;') + '">' +
                                        (amb.locked ? 'Edit' : 'Save') +
                                    '</button>' +
                                    '<button type="button" class="btn" onclick="deleteAmbientSlider(' + amb.id + ')" ' +
                                            'style="padding: 4px 8px; font-size: 11px; white-space: nowrap; background: #dc2626; color: white;">' +
                                        'Del' +
                                    '</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
                ).join('') +
                (state.ambient.length < 6 ?
                    '<button class="btn" onclick="addAmbientSlider()" ' +
                            (state.ambient.some(a => !a.locked) ? 'disabled ' : '') +
                            'style="background: ' + (state.ambient.some(a => !a.locked) ? '#d1d5db' : '#f97316') + '; color: white; width: 100%; padding: 10px; margin-top: 9px; ' + (state.ambient.some(a => !a.locked) ? 'cursor: not-allowed;' : '') + '">' +
                        '+ Add Topic' + (state.ambient.some(a => !a.locked) ? ' (Save current sliders first)' : '') +
                    '</button>'
                : '<div style="text-align: center; padding: 9px; color: #6b7280; font-style: italic; font-size: 13px;">Maximum of 6 internal experiences reached</div>') +
            '</div>'
        : '') +
    '</div>' +

    '</div>' +

    '<div class="card">' +
        '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">' +
            '<h2 style="margin: 0;">Window of Tolerance Visualization</h2>' +
        '</div>' +
        '<div class="visualization" id="visualization">' +
            '<div class="color-legend">' +
                '<div style="padding: 8px 4px; color: black; font-size: 8px; font-weight: bold; line-height: 1.3; text-align: center; z-index: 12; display: flex; flex-direction: column; justify-content: space-evenly; height: 100%;">' +
                    '<div>Hopelessness<br>Powerlessness<br>Overwhelmed<br>Anger/Resentful<br>Easily Agitated</div>' +
                    '<div style="margin-top: 4px;">Drivenness<br>Worry/Anxiety<br>Hypervigilance<br>On Edge<br>Fear of Failure</div>' +
                    '<div style="margin-top: 4px;">Rest is Forced<br>Deeper Sleep<br>Grounded<br>Calm/Regulated<br>Recovering</div>' +
                    '<div style="margin-top: 4px;">Flexibility<br>Joy/Enthusiasm<br>Expansiveness<br>Opportunity<br>Freedom</div>' +
                '</div>' +
            '</div>' +
            '<svg viewBox="0 0 600 300" preserveAspectRatio="none">' +
                '<defs>' +
                    '<linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">' +
                        '<stop offset="0%" style="stop-color:#0088ff;stop-opacity:0.4" />' +
                        '<stop offset="100%" style="stop-color:#0088ff;stop-opacity:0.9" />' +
                    '</linearGradient>' +
                '</defs>' +
                '<path id="riverChannel" class="river-channel" d=""/>' +
                '<path id="riverWater" class="river-water" d=""/>' +
            '</svg>' +
            '<div class="gate-top">' +
                '<div class="gate-shape-top" id="gateShapeTop">' +
                    '<div class="gate-interior-top"></div>' +
                    '<div class="gate-outline-top"></div>' +
                '</div>' +
            '</div>' +
            '<div class="gate-bottom">' +
                '<div class="gate-shape-bottom" id="gateShapeBottom">' +
                    '<div class="gate-interior-bottom"></div>' +
                    '<div class="gate-outline-bottom"></div>' +
                '</div>' +
            '</div>' +
            '<div class="gate-text-top" id="gateTextTop">Stress Response<br>Level: 0</div>' +
            '<div class="gate-text-bottom" id="gateTextBottom">OPPORTUNITY<br>0</div>' +
            '<div class="river-text" id="riverText">Window of Tolerance Width<br>or Internal Information<br>Processing Capacity</div>' +
        '</div>' +
    '</div>' +

    '<div class="card" style="border: 1px solid #16a34a;">' +
        '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">' +
            '<div style="display: flex; align-items: center; gap: 12px;">' +
                '<h2 style="margin: 0;">💾 Current Entry</h2>' +
            '</div>' +
            '<div style="display: flex; gap: 8px; flex-wrap: wrap;">' +
                '<button class="btn" onclick="saveEntry()" style="background: #16a34a; color: white; white-space: nowrap; padding: 10px 20px; font-size: 14px;">💾 Save Entry</button>' +
                '<button class="btn" onclick="resetAllSliders(); render();" style="background: #f97316; color: white; white-space: nowrap; padding: 10px 20px; font-size: 14px;">🔄 Reset Sliders</button>' +
            '</div>' +
        '</div>' +
        (state.saveError ? '<div style="color: #dc2626; margin-bottom: 12px;">' + state.saveError + '</div>' : '') +
        '<div style="display: flex; gap: 20px;">' +
            '<div style="flex: 1;">' +
                '<div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">' +
                    'Stressor: ' + getThreatLoad() + ' | Opportunity: ' + getOpportunityLoad() + ' | Stabilizer: ' + getRegulatedLoad() +
                '</div>' +
                '<div style="font-size: 14px; color: #6b7280;" id="currentPercentages">' +
                    'Calculating percentages...' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>' +

    '<div class="card" style="text-align: center; padding: 12px; border: 1px solid #dc2626;">' +
        '<button id="logoutBtn" onclick="handleLogout()" style="width: 100%; padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px; display: block;">🚪 Logout</button>' +
    '</div>' +

    '<div class="card">' +
        '<div id="entriesContainer"></div>' +
    '</div>';
}
