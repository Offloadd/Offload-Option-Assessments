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
                    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
                        '<h3 style="margin: 0; font-size: 16px;">Life Area (Optional)</h3>' +
                        '<button class="btn" onclick="openLifeAreasModal()" style="background: #3b82f6; color: white; font-size: 12px;">✏️ Edit Areas</button>' +
                    '</div>' +
                    '<select onchange="loadLifeArea(this.value)" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; background: white;">' +
                        '<option value="">-- Select a life area (optional) --</option>' +
                        Object.keys(state.lifeAreas).filter(key => state.lifeAreas[key].visible).map(areaKey => {
                            const area = state.lifeAreas[areaKey];
                            const isActive = state.activeLifeArea === areaKey;
                            return '<option value="' + areaKey + '" ' + (isActive ? 'selected' : '') + '>' + area.label + '</option>';
                        }).join('') +
                    '</select>' +
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
                               'placeholder="e.g., Accept Isaac\'s excavation project, or just describe what\'s on your mind" ' +
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
                                       'style="width: 100%; height: 6px; border-radius: 3px; outline: none; -webkit-appearance: none; cursor: pointer; ' +
                                       'background: ' + getAssessmentGradient('opportunity') + ';">' +
                            '</div>' +
                            '<button class="btn" onclick="toggleTextArea(\'opportunity\')" ' +
                                    'style="background: #e5e7eb; color: #374151; padding: 4px 8px; font-size: 11px; white-space: nowrap;">text</button>' +
                        '</div>' +
                        '<textarea id="opportunityText" style="display: none; width: 100%; padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; font-family: inherit; height: 18px; resize: none; overflow-y: auto;" ' +
                               'placeholder="Why does this feel like an opportunity?" ' +
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
                                       'style="width: 100%; height: 6px; border-radius: 3px; outline: none; -webkit-appearance: none; cursor: pointer; ' +
                                       'background: ' + getAssessmentGradient('stressor') + ';">' +
                            '</div>' +
                            '<button class="btn" onclick="toggleTextArea(\'stressor\')" ' +
                                    'style="background: #e5e7eb; color: #374151; padding: 4px 8px; font-size: 11px; white-space: nowrap;">text</button>' +
                        '</div>' +
                        '<textarea id="stressorText" style="display: none; width: 100%; padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; font-family: inherit; height: 18px; resize: none; overflow-y: auto;" ' +
                               'placeholder="Why does this feel stressful?" ' +
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
                                       'style="width: 100%; height: 6px; border-radius: 3px; outline: none; -webkit-appearance: none; cursor: pointer; ' +
                                       'background: ' + getAssessmentGradient('stabilizer') + ';">' +
                            '</div>' +
                            '<button class="btn" onclick="toggleTextArea(\'stabilizer\')" ' +
                                    'style="background: #e5e7eb; color: #374151; padding: 4px 8px; font-size: 11px; white-space: nowrap;">text</button>' +
                        '</div>' +
                        '<textarea id="stabilizerText" style="display: none; width: 100%; padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; font-family: inherit; height: 18px; resize: none; overflow-y: auto;" ' +
                               'placeholder="Why does this feel stabilizing?" ' +
                               'oninput="updateAssessmentText(\'stabilizer\', this.value)">' + state.stabilizer.why + '</textarea>' +
                    '</div>' +
                    
                    // Save button
                    '<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">' +
                        '<button class="btn" onclick="saveEntry()" style="width: 100%; padding: 12px; background: #16a34a; color: white; font-size: 15px; font-weight: 600;">💾 Save to Data Set & Clear Sliders</button>' +
                    '</div>' +
                '</div>' +
            '</div>'
        : '') +
    '</div>' +

    '</div>' +

    '<div class="card">' +
        '<h2 style="margin-bottom: 12px;">Window of Tolerance Visualization</h2>' +
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
            '<div class="gate-text-top" id="gateTextTop">Stress - 0%</div>' +
            '<div class="gate-text-bottom" id="gateTextBottom">Opportunity - 0%</div>' +
            '<div class="river-text" id="riverText">Regulated<br>Processing<br>Capacity</div>' +
        '</div>' +
    '</div>' +

    '<div class="card" style="border: 1px solid #16a34a;">' +
        '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">' +
            '<h2 style="margin: 0;">💾 Current Entry</h2>' +
            '<div style="display: flex; gap: 8px; flex-wrap: wrap;">' +
                '<button class="btn" onclick="saveEntry()" style="background: #16a34a; color: white; white-space: nowrap; padding: 10px 20px; font-size: 14px;">💾 Save Entry</button>' +
                '<button class="btn" onclick="resetAllSliders(); render();" style="background: #f97316; color: white; white-space: nowrap; padding: 10px 20px; font-size: 14px;">🔄 Reset Sliders</button>' +
            '</div>' +
        '</div>' +
        (state.saveError ? '<div style="color: #dc2626; margin-bottom: 12px;">' + state.saveError + '</div>' : '') +
        '<div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">' +
            'Stressor: ' + getThreatLoad() + ' | Opportunity: ' + getOpportunityLoad() + ' | Stabilizer: ' + getRegulatedLoad() +
        '</div>' +
        '<div style="font-size: 14px; color: #6b7280;" id="currentPercentages">' +
            'Calculating percentages...' +
        '</div>' +
    '</div>' +

    '<div class="card" style="text-align: center; padding: 12px; border: 1px solid #dc2626;">' +
        '<button onclick="handleLogout()" style="width: 100%; padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px;">🚪 Logout</button>' +
    '</div>' +

    '<div class="card">' +
        '<div id="entriesContainer"></div>' +
    '</div>';

document.getElementById('app').innerHTML = html;

const threatLoad = getThreatLoad();
const opportunityLoad = getOpportunityLoad();
const regulatedLoad = getRegulatedLoad();
setTimeout(() => updateVisualization(threatLoad, opportunityLoad, regulatedLoad), 0);
displayEntries();
}
