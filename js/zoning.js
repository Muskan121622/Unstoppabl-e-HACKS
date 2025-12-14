// Zoning compliance checker

function checkZoningCompliance(project) {
    // In a real implementation, this would check actual zoning rules
    // For this demo, we'll simulate a compliance check
    
    // Simulate some rules
    const maxFar = 2.5;
    const maxHeight = 60;
    const maxDensity = 20;
    
    // Get project values (in a real app, these would come from the project data)
    const projectFar = 2.1;
    const projectHeight = 35;
    const projectDensity = 12;
    
    // Check compliance
    const isCompliant = (
        projectFar <= maxFar &&
        projectHeight <= maxHeight &&
        projectDensity <= maxDensity
    );
    
    return {
        compliant: isCompliant,
        violations: isCompliant ? [] : getViolations(projectFar, maxHeight, projectDensity, maxFar, maxHeight, maxDensity)
    };
}

function getViolations(projectFar, projectHeight, projectDensity, maxFar, maxHeight, maxDensity) {
    const violations = [];
    
    if (projectFar > maxFar) {
        violations.push(`FAR exceeds limit (${projectFar} > ${maxFar})`);
    }
    
    if (projectHeight > maxHeight) {
        violations.push(`Height exceeds limit (${projectHeight}ft > ${maxHeight}ft)`);
    }
    
    if (projectDensity > maxDensity) {
        violations.push(`Density exceeds limit (${projectDensity} > ${maxDensity})`);
    }
    
    return violations;
}

// Export for use in other modules
window.zoningChecker = {
    checkZoningCompliance
};