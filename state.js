// state.js - State Object and Management Functions

const state = {
    section1Expanded: true,  // Option Assessment - start expanded
    visualOpacity: 0,
    
    // Option Assessment state
    activeLifeArea: null,
    activeOptionText: '',
    opportunity: { value: 0, why: '' },
    stressor: { value: 0, why: '' },
    stabilizer: { value: 0, why: '' },
    
    lifeAreas: {
        work: { label: 'Work/Projects', visible: true, custom: false },
        homeImprovement: { label: 'Home Improvements', visible: true, custom: false },
        moneyHandling: { label: 'Money/Resources', visible: true, custom: false },
        relationships: { label: 'Relationships', visible: true, custom: false },
        healthExercise: { label: 'Health/Exercise', visible: true, custom: false },
        learning: { label: 'Learning/Growth', visible: true, custom: false }
    },
    
    // Comparison area - temporary holding for options
    comparison: [],
    
    entries: [],
    saveError: ''
};

function toggleSection(section) {
    if (section === 1) state.section1Expanded = !state.section1Expanded;
    render();
}

function getDisplayValue(internalValue) {
    if (internalValue === 0) return '0';
    if (internalValue > 0) return '+' + internalValue;
    if (internalValue < 0) return internalValue.toString();
    return '0';
}

function getSliderColor(value) {
    if (value > 0) {
        const intensity = value / 5;
        const red = Math.round(100 - (100 * intensity));
        const green = Math.round(220 + (35 * intensity));
        const blue = Math.round(100 - (100 * intensity));
        return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    } else if (value < 0) {
        const absValue = Math.abs(value);
        if (absValue <= 1.5) {
            const intensity = absValue / 1.5;
            const red = Math.round(68 + (200 * intensity));
            const green = Math.round(136 + (100 * intensity));
            const blue = Math.round(255 - (155 * intensity));
            return 'rgb(' + Math.min(red, 255) + ', ' + Math.min(green, 255) + ', ' + blue + ')';
        } else {
            const intensity = (absValue - 1.5) / 3.5;
            const red = 255;
            const green = Math.round(236 - (136 * intensity));
            const blue = Math.round(100 - (100 * intensity));
            return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
        }
    } else {
        return 'rgb(68, 136, 255)';
    }
}

function getAreaBackgroundColor(value) {
    if (value >= 3) {
        return 'rgba(68, 136, 255, 0.25)';
    } else if (value >= 1) {
        return 'rgba(68, 136, 255, 0.15)';
    } else if (value === 0) {
        return '#f9fafb';
    } else if (value >= -2) {
        return 'rgba(255, 235, 59, 0.4)';
    } else if (value >= -4) {
        return 'rgba(255, 152, 0, 0.35)';
    } else {
        return 'rgba(244, 67, 54, 0.3)';
    }
}

function getAssessmentGradient(type) {
    if (type === 'stressor') {
        return 'linear-gradient(to right, #ffeb3b 0%, #ff9800 50%, #f44336 100%)';
    } else if (type === 'stabilizer') {
        return 'linear-gradient(to right, #bbdefb 0%, #1976d2 100%)';
    } else if (type === 'opportunity') {
        return 'linear-gradient(to right, #c8e6c9 0%, #4caf50 50%, #cddc39 100%)';
    }
    return 'linear-gradient(to right, #d1d5db 0%, #d1d5db 100%)';
}

console.log('State initialized - waiting for authentication');
