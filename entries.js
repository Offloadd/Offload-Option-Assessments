// ============================================================================
// ENTRY DISPLAY AND MANAGEMENT FUNCTIONS
// ============================================================================

function displayEntries() {
    const container = document.getElementById('entriesContainer');
    if (!container) return;

    if (state.entries.length === 0) {
        container.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px;">No saved entries yet</p>';
        return;
    }

    const html = `
        <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0;">Saved Entries (${state.entries.length})</h3>
            <button onclick="copyLast20Entries()" style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
                📋 Copy Last 20 Entries (CSV)
            </button>
        </div>
        ${state.entries.map((entry, index) => renderEntry(entry, index)).join('')}
    `;

    container.innerHTML = html;
}

function renderEntry(entry, index) {
    const date = new Date(entry.timestamp);
    const formattedDate = date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });

    const height = 300;
    const maxLoad = 50;
    const minGateHeight = 30;
    const regulatedReduction = entry.regulatedLoad * 2;

    let topGateHeight = minGateHeight + Math.max(0, Math.min((entry.threatLoad / maxLoad) * height * 1.8, height * 0.9) - regulatedReduction);
    let bottomGateHeight = minGateHeight + Math.max(0, Math.min((entry.opportunityLoad / maxLoad) * height * 1.8, height * 0.9) - regulatedReduction);

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

    // Build option assessment section if present
    let optionAssessmentHtml = '';
    if (entry.optionAssessment) {
        const opt = entry.optionAssessment;
        optionAssessmentHtml = `
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
                <div style="font-weight: 600; color: #374151; margin-bottom: 6px; font-size: 14px;">Option Assessed:</div>
                <div style="font-size: 13px; color: #4b5563; margin-bottom: 4px;">
                    <strong>${opt.lifeArea}:</strong> ${opt.optionText}
                </div>
                ${opt.opportunity.value > 0 || opt.opportunity.why ? `
                    <div style="font-size: 12px; margin-bottom: 4px;">
                        <span style="color: #4caf50; font-weight: 600;">💚 Opportunity (${opt.opportunity.value}):</span> ${opt.opportunity.why || '<em>No notes</em>'}
                    </div>
                ` : ''}
                ${opt.stressor.value > 0 || opt.stressor.why ? `
                    <div style="font-size: 12px; margin-bottom: 4px;">
                        <span style="color: #f44336; font-weight: 600;">⚠️ Stressor (${opt.stressor.value}):</span> ${opt.stressor.why || '<em>No notes</em>'}
                    </div>
                ` : ''}
                ${opt.stabilizer.value > 0 || opt.stabilizer.why ? `
                    <div style="font-size: 12px;">
                        <span style="color: #1976d2; font-weight: 600;">🛡️ Stabilizer (${opt.stabilizer.value}):</span> ${opt.stabilizer.why || '<em>No notes</em>'}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Build ambient notes section if present
    let notesHtml = '';
    if (entry.ambient && entry.ambient.length > 0) {
        const notes = entry.ambient.map(amb => {
            const typeLabel = amb.type.charAt(0).toUpperCase() + amb.type.slice(1);
            return `<div style="margin-bottom: 4px;">• ${typeLabel} (${amb.value}): ${amb.note}</div>`;
        }).join('');
        
        notesHtml = `
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
                <div style="font-weight: 600; color: #374151; margin-bottom: 6px; font-size: 14px;">Specific Experiences:</div>
                <div style="font-size: 13px; color: #4b5563; line-height: 1.6;">
                    ${notes}
                </div>
            </div>
        `;
    }

    return `
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div>
                    <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">${formattedDate}</div>
                    <div style="font-size: 14px; color: #6b7280;">
                        Stress: ${stressPercent}% | Stabilized: ${regulatedPercent}% | Opportunity: ${opportunityPercent}%
                    </div>
                    <div style="font-size: 13px; color: #9ca3af; margin-top: 2px;">
                        Stressor Amount: ${entry.threatLoad} | Stabilizer Amount: ${entry.regulatedLoad} | Opportunity Amount: ${entry.opportunityLoad}
                    </div>
                </div>
                <button onclick="deleteEntry(${index})" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
                    Delete
                </button>
            </div>
            ${optionAssessmentHtml}
            ${notesHtml}
        </div>
    `;
}

async function deleteEntry(index) {
    if (!confirm('Delete this entry? This cannot be undone.')) {
        return;
    }

    const entry = state.entries[index];
    
    if (entry.id) {
        await deleteFromFirestore(entry.id);
    }

    state.entries.splice(index, 1);
    saveToUserStorage('entries', JSON.stringify(state.entries));
    displayEntries();
}

function copyLast20Entries() {
    const entriesToCopy = state.entries.slice(0, 20);
    
    if (entriesToCopy.length === 0) {
        alert('No entries to copy');
        return;
    }

    let csv = 'Timestamp,Stress %,Stabilized %,Opportunity %,Stressor Amount,Stabilizer Amount,Opportunity Amount,Option Assessment,Specific Experiences\n';

    entriesToCopy.forEach(entry => {
        const date = new Date(entry.timestamp);
        const formattedDate = date.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric', 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });

        const height = 300;
        const maxLoad = 50;
        const minGateHeight = 30;
        const regulatedReduction = entry.regulatedLoad * 2;

        let topGateHeight = minGateHeight + Math.max(0, Math.min((entry.threatLoad / maxLoad) * height * 1.8, height * 0.9) - regulatedReduction);
        let bottomGateHeight = minGateHeight + Math.max(0, Math.min((entry.opportunityLoad / maxLoad) * height * 1.8, height * 0.9) - regulatedReduction);

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

        let optionText = '';
        if (entry.optionAssessment) {
            optionText = `${entry.optionAssessment.lifeArea}: ${entry.optionAssessment.optionText}`;
        }

        const notes = [];
        if (entry.ambient && entry.ambient.length > 0) {
            entry.ambient.forEach(amb => {
                const typeLabel = amb.type.charAt(0).toUpperCase() + amb.type.slice(1);
                notes.push(`${typeLabel} (${amb.value}): ${amb.note}`);
            });
        }

        const escapeCsv = (str) => {
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return '"' + str.replace(/"/g, '""') + '"';
            }
            return str;
        };

        csv += `${escapeCsv(formattedDate)},${stressPercent},${regulatedPercent},${opportunityPercent},${entry.threatLoad},${entry.regulatedLoad},${entry.opportunityLoad},${escapeCsv(optionText)},${escapeCsv(notes.join('; '))}\n`;
    });

    navigator.clipboard.writeText(csv).then(() => {
        alert(`✅ Last ${entriesToCopy.length} entries copied to clipboard in CSV format!`);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard. Please try again.');
    });
}
