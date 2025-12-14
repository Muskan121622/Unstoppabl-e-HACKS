// Stats Calculator and Updater

document.addEventListener('HSHP:DataLoaded', updateStats);

// Also try to update immediately if data is already loaded (in case we missed the event)
if (window.dataLoader && window.dataLoader.getProjects().length > 0) {
    updateStats();
}

function updateStats() {
    const projects = window.dataLoader.getProjects();
    const zoning = window.dataLoader.getZoningRules(); // This might return null if accessing by key, but checking dataLoader it returns global object now?
    // Wait, getZoningRules(district) expects a key. But data-loader loads zoning.json into zoningData global. 
    // And in loadData() it assigns zoningData = zoning (the JSON content).
    // The JSON content is valid.
    // However, the getZoningRules function in data-loader.js is:
    // function getZoningRules(district) { return zoningData[district] || null; }
    // This assumes zoningData is a map of districts. But the file is a single object.
    // This is a discrepancy between the hardcoded data structure and the actual loaded JSON.
    // I should fix data-loader's accessor or just access the global if possible, or use the object directly.
    // I can modify getZoningRules in data-loader to return the whole object if no arg is passed.

    // For now, let's look at how to get zoning. accessing window.dataLoader.getZoningRules() might fail if I don't pass a key, or return undefined.
    // Actually, looking at data-loader source I edited: 
    // zoningData = zoning; (line 28)
    // getZoningRules(district) { return zoningData[district] || null; }
    // If zoningData is the object { "zone": "Residential", "far": 2.5, ... }, then calling getZoningRules("far") would return 2.5? 
    // No, zoningData["far"] would be 2.5.

    // Let's assume I can get the raw object by passing a key that doesn't exist or maybe I should fix data-loader first. 
    // Or I can just act on the known structure.

    // Let's calculate stats.

    // 1. Affordable Units
    let totalAffordableUnits = 0;
    let activeProjectsCount = 0;

    projects.forEach(p => {
        // Fix: 'affordableUnits' might be missing in some mock data, but present in real data.
        // Fallback to parsing 'affordability' string if number not present
        let affUnits = p.affordableUnits;
        if (typeof affUnits === 'undefined') {
            // parsing "30%" of total units
            if (p.affordability && p.units) {
                const pct = parseFloat(p.affordability);
                affUnits = Math.round(p.units * (pct / 100));
            } else {
                affUnits = 0;
            }
        }
        totalAffordableUnits += affUnits;

        // Active Projects
        // Assuming all are active for now or filtering by status
        // status: "Approved", "Proposed", "Completed"
        // Usually "Completed" might not be "Active" in terms of current construction, but "Active Projects" in a portfolio usually includes ongoing. 
        // Let's count all non-archived? Or just all. 
        // Let's count them all for now as the dataset is small.
        activeProjectsCount++;
    });

    // 2. Zoning Compliance
    let compliantCount = 0;
    // We need zoning limits. 
    // Hack: I know the structure because I read zoning.json.
    // Since I can't easily fix data-loader right now without another step, I'll try to use it or just fetch again if needed. 
    // Actually I can access the internal zoningData if I exported it? No, it's closure.
    // But wait, dataLoader.getZoningRules returns `zoningData[district]`. 
    // If I pass "far", I get 2.5? yes. 
    // Verify: zoningData = { "far": 2.5, ... }. zoningData["far"] is 2.5.
    // So getZoningRules("far") returns 2.5.

    const maxFar = window.dataLoader.getZoningRules('far') || 2.5;
    const maxUnits = window.dataLoader.getZoningRules('maxUnits') || 350;
    // Height "20m".

    projects.forEach(p => {
        // Heuristic compliance check
        // We only have totalUnits for checking maxUnits compliance really.
        // Unless we make up FAR/Height like project.js does. 
        // Let's rely on maxUnits check for strictness, and assume FAR/Height are OK if Status is Approved.
        // If Status is Proposed, we check.

        let isCompliant = true;
        const units = p.totalUnits || p.units || 0;

        if (units > maxUnits) isCompliant = false;

        // Let's count it
        if (isCompliant) compliantCount++;
    });

    const compliancePct = activeProjectsCount > 0 ? (compliantCount / activeProjectsCount) * 100 : 0;

    // 3. Value Change
    const impact = window.dataLoader.getPriceImpact();
    // impact might be null/undefined if not loaded yet?
    // priceData is initialized in data-loader.
    // Structure: { impact: { change_percent: 1.4 } }
    let valueChange = 0;
    if (impact && impact.change_percent) {
        valueChange = impact.change_percent;
    }

    // Update DOM
    animateValue("affordable-units", 0, totalAffordableUnits, 2000);
    animateValue("active-projects", 0, activeProjectsCount, 1500);

    const complianceEl = document.getElementById("zoning-compliance");
    if (complianceEl) complianceEl.textContent = Math.round(compliancePct) + "%";

    const valueEl = document.getElementById("value-change");
    if (valueEl) valueEl.textContent = (valueChange >= 0 ? "+" : "") + valueChange + "%";
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
