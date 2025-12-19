// modals.js - Modal and Visualization Functions

function openIntroModal() {
    document.getElementById('introModal').classList.add('active');
}

function closeIntroModal() {
    document.getElementById('introModal').classList.remove('active');
}

function openInfoModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeInfoModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function updateVisualization(threatLoad, opportunityLoad, regulatedLoad) {
    const visualization = document.getElementById('visualization');
    if (!visualization) return;

    const gateShapeTop = document.getElementById('gateShapeTop');
    const gateShapeBottom = document.getElementById('gateShapeBottom');
    const gateTextTop = document.getElementById('gateTextTop');
    const gateTextBottom = document.getElementById('gateTextBottom');
    const riverChannel = document.getElementById('riverChannel');
    const riverWater = document.getElementById('riverWater');
    const riverText = document.getElementById('riverText');

    const height = 300;
    const maxLoad = 50;
    const minGateHeight = 30;
    
    const baseStressHeight = height * 0.20;
    const baseOpportunityHeight = height * 0.20;

    const regulatedReduction = regulatedLoad * 2;

    const threatExpansion = Math.max(0, Math.min((threatLoad / maxLoad) * height * 1.8, height * 0.9));
    const opportunityExpansion = Math.max(0, Math.min((opportunityLoad / maxLoad) * height * 1.8, height * 0.9));

    let topGateHeight = Math.max(minGateHeight, baseStressHeight + threatExpansion - regulatedReduction);
    let bottomGateHeight = Math.max(minGateHeight, baseOpportunityHeight + opportunityExpansion - regulatedReduction);

    const combinedHeight = topGateHeight + bottomGateHeight;
    const maxCombined = height * 0.9;

    if (combinedHeight > maxCombined) {
        const scaleFactor = maxCombined / combinedHeight;
        topGateHeight = Math.max(minGateHeight, topGateHeight * scaleFactor);
        bottomGateHeight = Math.max(minGateHeight, bottomGateHeight * scaleFactor);
    }

    gateShapeTop.style.height = topGateHeight + 'px';
    gateShapeBottom.style.height = bottomGateHeight + 'px';

    const availableSpace = height - topGateHeight - bottomGateHeight;

    const topPercent = Math.round((topGateHeight / height) * 100);
    const bottomPercent = Math.round((bottomGateHeight / height) * 100);
    const middlePercent = Math.round((availableSpace / height) * 100);

    gateTextTop.textContent = 'Stress - ' + topPercent + '%';
    gateTextBottom.textContent = 'Opportunity - ' + bottomPercent + '%';

    const percentagesDisplay = document.getElementById('currentPercentages');
    if (percentagesDisplay) {
        percentagesDisplay.textContent = 'Stress: ' + topPercent + '% | Regulated: ' + middlePercent + '% | Opportunity: ' + bottomPercent + '%';
    }

    const regulatedFactor = regulatedLoad / 30;

    const maxThreatForColor = 40;
    const maxOppForColor = 40;
    const maxRegForColor = 30;

    const threatIntensity = Math.min(threatLoad / maxThreatForColor, 1);
    const opportunityIntensity = Math.min(opportunityLoad / maxOppForColor, 1);
    const regulatedIntensity = Math.min(regulatedLoad / maxRegForColor, 1);

    let threatR, threatG, threatB;
    if (threatIntensity === 0) {
        threatR = 255; threatG = 170; threatB = 68;
    } else if (threatIntensity < 0.5) {
        const factor = threatIntensity * 2;
        threatR = 255;
        threatG = Math.round(170 - (102 * factor));
        threatB = Math.round(68 - (68 * factor));
    } else {
        const factor = (threatIntensity - 0.5) * 2;
        threatR = 255;
        threatG = Math.round(68 - (68 * factor));
        threatB = 0;
    }

    let riverR, riverG, riverB;
    if (regulatedIntensity === 0) {
        riverR = 180; riverG = 180; riverB = 180;
    } else {
        riverR = Math.round(180 - (112 * regulatedIntensity));
        riverG = Math.round(180 - (44 * regulatedIntensity));
        riverB = Math.round(180 + (75 * regulatedIntensity));
    }

    let oppR, oppG, oppB;
    if (opportunityIntensity === 0) {
        oppR = 68; oppG = 255; oppB = 68;
    } else {
        const factor = opportunityIntensity;
        oppR = Math.round(68 - (0 * factor));
        oppG = 255;
        oppB = Math.round(68 - (0 * factor));
    }

    const opacity = 0;
    threatR = Math.round(threatR + (255 - threatR) * opacity);
    threatG = Math.round(threatG + (255 - threatG) * opacity);
    threatB = Math.round(threatB + (255 - threatB) * opacity);
    
    riverR = Math.round(riverR + (255 - riverR) * opacity);
    riverG = Math.round(riverG + (255 - riverG) * opacity);
    riverB = Math.round(riverB + (255 - riverB) * opacity);
    
    oppR = Math.round(oppR + (255 - oppR) * opacity);
    oppG = Math.round(oppG + (255 - oppG) * opacity);
    oppB = Math.round(oppB + (255 - oppB) * opacity);

    visualization.style.background = 'linear-gradient(to bottom, ' +
        'rgb(' + threatR + ', ' + threatG + ', ' + threatB + ') 0%, ' +
        'rgb(' + threatR + ', ' + threatG + ', ' + threatB + ') ' + ((topGateHeight / height) * 100) + '%, ' +
        'rgb(' + riverR + ', ' + riverG + ', ' + riverB + ') ' + ((topGateHeight / height) * 100) + '%, ' +
        'rgb(' + riverR + ', ' + riverG + ', ' + riverB + ') ' + (((height - bottomGateHeight) / height) * 100) + '%, ' +
        'rgb(' + oppR + ', ' + oppG + ', ' + oppB + ') ' + (((height - bottomGateHeight) / height) * 100) + '%, ' +
        'rgb(' + oppR + ', ' + oppG + ', ' + oppB + ') 100%)';

    const width = 600;
    const riverTop = topGateHeight;
    const riverBottom = height - bottomGateHeight;
    const riverHeight = riverBottom - riverTop;

    const spaceFactor = availableSpace / height;
    const maxChannelWidth = height * 0.5;
    const minChannelWidth = height * 0.08;

    let channelWidth = minChannelWidth + (spaceFactor * (maxChannelWidth - minChannelWidth));
    const regulatedBonus = regulatedFactor * (height * 0.4);
    channelWidth = Math.min(channelWidth + regulatedBonus, riverHeight * 0.95);

    const waterWidth = channelWidth * 0.85;

    const channelTopY = riverTop;
    const channelBottomY = riverBottom;

    const channelPath = 'M 0,' + channelTopY + ' L ' + width + ',' + channelTopY + ' L ' + width + ',' + channelBottomY + ' L 0,' + channelBottomY + ' Z';

    const waterTopY = riverTop + (riverHeight - waterWidth) / 2;
    const waterBottomY = waterTopY + waterWidth;
    const waterPath = 'M 0,' + waterTopY + ' L ' + width + ',' + waterTopY + ' L ' + width + ',' + waterBottomY + ' L 0,' + waterBottomY + ' Z';

    riverChannel.setAttribute('d', channelPath);
    riverWater.setAttribute('d', waterPath);

    const centerY = topGateHeight + (availableSpace / 2);
    riverText.style.top = centerY + 'px';

    riverText.innerHTML = 'Regulated<br>Processing<br>Capacity - ' + middlePercent + '%';

    const availablePercent = availableSpace / height;

    if (availablePercent < 0.3) {
        const fontSize = Math.max(8, availablePercent * 40);
        const letterSpacing = Math.max(0, (0.3 - availablePercent) * 10);
        riverText.style.fontSize = fontSize + 'px';
        riverText.style.letterSpacing = letterSpacing + 'px';
    } else {
        riverText.style.fontSize = '14px';
        riverText.style.letterSpacing = '0px';
    }
}
