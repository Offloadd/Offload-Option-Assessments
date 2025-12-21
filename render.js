// render.js - Main Render Function

function preserveTextareaValues() {
    // Before re-rendering, grab current textarea values from DOM
    const opportunityTextarea = document.getElementById('opportunityText');
    const stressorTextarea = document.getElementById('stressorText');
    const stabilizerTextarea = document.getElementById('stabilizerText');
    
    if (opportunityTextarea) state.opportunity.why = opportunityTextarea.value;
    if (stressorTextarea) state.stressor.why = stressorTextarea.value;
    if (stabilizerTextarea) state.stabilizer.why = stabilizerTextarea.value;
}

function render() {
preserveTextareaValues(); // Save any text being typed before re-rendering
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

    // Section 1: Option Assessment / Capture Mode
    '<div class="section-card ' + (state.assessmentMode === 'options' ? 'section-green' : 'section-orange') + ' expanded" style="border-left: none; padding: 8px;">' +
        '<div class="section-header">' +
            '<div>' +
                '<div class="section-title">' + (state.assessmentMode === 'options' ? 'Option Assessment Mode' : 'Capture Mode') + '</div>' +
            '</div>' +
            '<button class="btn" onclick="toggleMode()" style="background: ' + (state.assessmentMode === 'options' ? '#f97316' : '#16a34a') + '; color: white; padding: 6px 12px; font-size: 12px;">' +
                '🔄 Switch to ' + (state.assessmentMode === 'options' ? 'Capture' : 'Options') + ' Mode' +
            '</button>' +
        '</div>' +
        (state.assessmentMode === 'options' ? 
            // Container: sliders left (70%), comparison right (30%)
            '<div style="display: flex; gap: 12px; margin-top: 12px;">' +
                // Left: Assessment Zone
                '<div style="flex: 0 0 70%; min-width: 0;">' +
                    '<div style="background: #f0f9ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 10px;">'
        :
            '<div style="margin-top: 12px;">' +
                '<div style="background: #fff7ed; border: 2px solid #f97316; border-radius: 8px; padding: 10px;">'
        ) +
                    (state.saveError ? '<div id="saveError" style="background: #fee2e2; color: #991b1b; padding: 8px 12px; border-radius: 4px; margin-bottom: 12px; font-size: 13px; border: 1px solid #fecaca;">' + state.saveError + '</div>' : '') +
                    
                    // Question label - same size as title
                    '<div style="margin-bottom: 8px;">' +
                        '<label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 18px;">' +
                            (state.assessmentMode === 'options' ? 'What specific option are you considering?' : 'What are you experiencing right now?') +
                        '</label>' +
                    '</div>' +
                    
                    // Life area dropdown on right
                    '<div style="display: flex; justify-content: flex-end; margin-bottom: 8px; gap: 6px;">' +
                        '<select onchange="loadLifeArea(this.value)" style="width: auto; min-width: 180px; padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; background: white;">' +
                            '<option value="">Select Life Area (Optional)</option>' +
                            Object.keys(state.lifeAreas).filter(key => state.lifeAreas[key].visible).map(areaKey => {
                                const area = state.lifeAreas[areaKey];
                                const isActive = state.activeLifeArea === areaKey;
                                return '<option value="' + areaKey + '" ' + (isActive ? 'selected' : '') + '>' + area.label + '</option>';
                            }).join('') +
                        '</select>' +
                        '<button class="btn" onclick="openLifeAreasModal()" style="background: #3b82f6; color: white; font-size: 11px; padding: 6px 10px;">✏️</button>' +
                    '</div>' +
                    
                    // Text input
                    '<div style="margin-bottom: 8px;">' +
                        '<input type="text" ' +
                               'value="' + state.activeOptionText + '" ' +
                               'oninput="updateOptionText(this.value);" ' +
                               'placeholder="' + (state.assessmentMode === 'options' ? 'e.g., Accept new project offer' : 'e.g., Feeling urge to start another project immediately') + '" ' +
                               'style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">' +
                    '</div>' +
                    
                    // Hijacking dropdown (only in capture mode)
                    (state.assessmentMode === 'capture' ?
                        '<div style="margin-bottom: 8px;">' +
                            '<label style="display: block; font-weight: 600; margin-bottom: 4px; font-size: 13px; color: #f97316;">Could this be a hijacking event?</label>' +
                            '<select onchange="state.hijackingEvent = this.value" style="width: 100%; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; background: white;">' +
                                '<option value="" ' + (state.hijackingEvent === '' ? 'selected' : '') + '>-- Select --</option>' +
                                '<option value="yes" ' + (state.hijackingEvent === 'yes' ? 'selected' : '') + '>Yes</option>' +
                                '<option value="maybe" ' + (state.hijackingEvent === 'maybe' ? 'selected' : '') + '>Maybe</option>' +
                                '<option value="no" ' + (state.hijackingEvent === 'no' ? 'selected' : '') + '>No</option>' +
                            '</select>' +
                        '</div>'
                    : '') +
                    
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
                    
                    // Buttons - different for each mode
                    (state.assessmentMode === 'options' ?
                        '<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb; display: flex; gap: 8px;">' +
                            '<button class="btn" onclick="addToComparison()" style="flex: 1; padding: 12px; background: #3b82f6; color: white; font-size: 15px; font-weight: 600;">➕ Add to Comparison</button>' +
                            '<button class="btn" onclick="resetAllSliders(); render();" style="flex: 1; padding: 12px; background: #6b7280; color: white; font-size: 15px; font-weight: 600;">🔄 Clear Sliders</button>' +
                        '</div>'
                    :
                        '<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb; display: flex; gap: 8px;">' +
                            '<button class="btn" onclick="saveToCapturedExperiences()" style="flex: 1; padding: 12px; background: #f97316; color: white; font-size: 15px; font-weight: 600;">💾 Save to Captured Experiences</button>' +
                            '<button class="btn" onclick="resetAllSliders(); render();" style="flex: 1; padding: 12px; background: #6b7280; color: white; font-size: 15px; font-weight: 600;">🔄 Clear Sliders</button>' +
                        '</div>'
                    ) +
                '</div>' +
            
            (state.assessmentMode === 'options' ?
                // Close assessment zone div
                '</div>' +
                // End left column
                '</div>' +
                
                // Right column: Comparison list
                '<div style="flex: 0 0 30%; min-width: 0; display: flex; flex-direction: column;">' +
                    '<div style="background: #f0f9ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 10px; display: flex; flex-direction: column; height: 100%;">' +
                        '<div style="display: flex; gap: 6px; margin-bottom: 12px;">' +
                            '<button class="btn" onclick="saveAllComparison()" style="flex: 1; background: #16a34a; color: white; padding: 6px; font-size: 11px; white-space: nowrap;">💾 Save All</button>' +
                            '<button class="btn" onclick="clearComparison()" style="flex: 1; background: #dc2626; color: white; padding: 6px; font-size: 11px; white-space: nowrap;">🗑️ Clear</button>' +
                        '</div>' +
                        '<div style="font-weight: 600; font-size: 13px; margin-bottom: 8px; color: #374151;">Options (' + state.comparison.length + '/6)</div>' +
                        (state.comparison.length === 0 ?
                            '<div style="color: #6b7280; font-size: 12px; text-align: center; padding: 20px 10px;">No options yet</div>'
                        :
                            '<div style="max-height: 500px; overflow-y: auto;">' +
                                state.comparison.map(opt => {
                                    const height = 300;
                                    const maxLoad = 50;
                                    const minGateHeight = 30;
                                    const regulatedReduction = opt.regulatedLoad * 2;
                                    let topGateHeight = minGateHeight + Math.max(0, Math.min((opt.threatLoad / maxLoad) * height * 1.8, height * 0.9) - regulatedReduction);
                                    let bottomGateHeight = minGateHeight + Math.max(0, Math.min((opt.opportunityLoad / maxLoad) * height * 1.8, height * 0.9) - regulatedReduction);
                                    const combinedHeight = topGateHeight + bottomGateHeight;
                                    const maxCombined = height * 0.9;
                                    if (combinedHeight > maxCombined) {
                                        const scaleFactor = maxCombined / combinedHeight;
                                        topGateHeight = Math.max(minGateHeight, topGateHeight * scaleFactor);
                                        bottomGateHeight = Math.max(minGateHeight, bottomGateHeight * scaleFactor);
                                    }
                                    const availableSpace = height - topGateHeight - bottomGateHeight;
                                    const stressPercent = Math.round((topGateHeight / height) * 100);
                                    const regulatedPercent = Math.round((availableSpace / height) * 100);
                                    const opportunityPercent = Math.round((bottomGateHeight / height) * 100);
                                    
                                    return '<div onclick="loadComparisonOption(' + opt.id + ')" style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; margin-bottom: 6px; cursor: pointer; position: relative; ' + (state.selectedComparisonId === opt.id ? 'border-color: #3b82f6; border-width: 2px;' : '') + '">' +
                                        '<button onclick="event.stopPropagation(); deleteFromComparison(' + opt.id + ')" style="position: absolute; top: 4px; right: 4px; background: #ef4444; color: white; border: none; border-radius: 3px; width: 20px; height: 20px; font-size: 14px; line-height: 1; cursor: pointer; padding: 0;">×</button>' +
                                        '<div style="font-weight: 600; font-size: 11px; color: #111827; margin-bottom: 4px; padding-right: 24px;">' + opt.lifeArea + '</div>' +
                                        '<div style="font-size: 10px; color: #6b7280; margin-bottom: 4px; line-height: 1.3;">' + opt.optionText.substring(0, 40) + (opt.optionText.length > 40 ? '...' : '') + '</div>' +
                                        '<div style="font-size: 10px; color: #6b7280;">S:' + stressPercent + '% R:' + regulatedPercent + '% O:' + opportunityPercent + '%</div>' +
                                    '</div>';
                                }).join('') +
                            '</div>'
                        ) +
                    '</div>' +
                '</div>' +
                '</div>' // Close flex container
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
