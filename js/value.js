// Home value impact estimator

function calculateValueImpact(project) {
    // In a real implementation, this would use actual market data
    // For this demo, we'll simulate value calculations
    
    // Base value for the area
    const baseValue = 350000;
    
    // Factors that might affect value (simplified for demo)
    const factors = {
        affordability: 0.005, // 0.5% increase for affordable housing
        density: -0.002,      // 0.2% decrease for higher density
        amenities: 0.01       // 1% increase for good amenities
    };
    
    // Calculate impact based on project characteristics
    let impactPercent = 0;
    
    // Positive impact from affordability
    impactPercent += factors.affordability;
    
    // Minimal negative impact from density (if applicable)
    if (project.units > 100) {
        impactPercent += factors.density;
    }
    
    // Positive impact from amenities
    impactPercent += factors.amenities;
    
    // Calculate actual values
    const afterValue = baseValue * (1 + impactPercent);
    
    return {
        before: baseValue,
        after: Math.round(afterValue),
        changePercent: (impactPercent * 100).toFixed(1)
    };
}

// Export for use in other modules
window.valueEstimator = {
    calculateValueImpact
};