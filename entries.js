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

    // Handle both old and new entry formats
    const opportunity = entry.opportunity || (entry.optionAssessment ? entry.optionAssessment.opportunity : { value: 0, why: '' });
    const stressor = entry.stressor || (entry.optionAssessment ? entry.optionAssessment.stressor : { value: 0, why: '' });
    const stabilizer = entry.stabilizer || (entry.optionAssessment ? entry.optionAssessment.stabilizer : { value: 0, why: '' });
    const lifeArea = entry.lifeArea || (entry.optionAssessment ? entry.optionAssessment.lifeArea : 'General');
    const optionText = entry.optionText || (entry.optionAssessment ? entry.optionAssessment.optionText : 'No description');

    // Build option assessment display
    const optionHtml = `
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
            <div style="font-weight: 600; color: #374151; margin-bottom: 6px; font-size: 14px;">
                ${entry.mode === 'Capture' ? '📸 Captured Experience' : '⚖️ Option Assessed'}:
                ${entry.mode === 'Capture' && entry.hijackingEvent ? 
                    '<span style="margin-left: 8px; padding: 2px 8px; background: ' + 
                    (entry.hijackingEvent === 'yes' ? '#fee2e2' : entry.hijackingEvent === 'maybe' ? '#fef3c7' : '#e0f2fe') + 
                    '; color: ' + 
                    (entry.hijackingEvent === 'yes' ? '#991b1b' : entry.hijackingEvent === 'maybe' ? '#92400e' : '#075985') + 
                    '; border-radius: 4px; font-size: 11px; font-weight: 600;">Hijacking: ' + entry.hijackingEvent + '</span>' 
                : ''}
            </div>
            <div style="font-size: 13px; color: #4b5563; margin-bottom: 4px;">
                <strong>${lifeArea}:</strong> ${optionText}
            </div>
            ${opportunity.value > 0 || opportunity.why ? `
                <div style="font-size: 12px; margin-bottom: 4px;">
                    <span style="color: #4caf50; font-weight: 600;">💚 Opportunity (${opportunity.value}):</span> ${opportunity.why || '<em>No notes</em>'}
                </div>
            ` : ''}
            ${stressor.value > 0 || stressor.why ? `
                <div style="font-size: 12px; margin-bottom: 4px;">
                    <span style="color: #f44336; font-weight: 600;">⚠️ Stressor (${stressor.value}):</span> ${stressor.why || '<em>No notes</em>'}
                </div>
            ` : ''}
            ${stabilizer.value > 0 || stabilizer.why ? `
                <div style="font-size: 12px;">
                    <span style="color: #1976d2; font-weight: 600;">🛡️ Stabilizer (${stabilizer.value}):</span> ${stabilizer.why || '<em>No notes</em>'}
                </div>
            ` : ''}
        </div>
    `;

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
            ${optionHtml}
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

    let csv = 'Timestamp,Stress %,Stabilized %,Opportunity %,Stressor Amount,Stabilizer Amount,Opportunity Amount,Life Area,Option\n';

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

        const escapeCsv = (str) => {
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return '"' + str.replace(/"/g, '""') + '"';
            }
            return str;
        };

        csv += `${escapeCsv(formattedDate)},${stressPercent},${regulatedPercent},${opportunityPercent},${entry.threatLoad},${entry.regulatedLoad},${entry.opportunityLoad},${escapeCsv(entry.lifeArea)},${escapeCsv(entry.optionText)}\n`;
    });

    navigator.clipboard.writeText(csv).then(() => {
        alert(`✅ Last ${entriesToCopy.length} entries copied to clipboard in CSV format!`);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard. Please try again.');
    });
}
