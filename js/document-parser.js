// Document parser for extracting information from PDF and DOCX files

// Extract text content from a PDF file
async function extractPdfText(file) {
    // In a browser environment, we would use a library like pdf.js
    // For now, this is a placeholder that returns mock data based on filename
    return new Promise((resolve) => {
        const fileName = file.name.toLowerCase();
        
        if (fileName.includes('brochure') || fileName.includes('braucher')) {
            resolve({
                project: 'Tathastu I',
                type: 'brochure',
                description: 'Project brochure with amenities and features'
            });
        } else if (fileName.includes('floor plan') || fileName.includes('tower')) {
            resolve({
                project: fileName.includes('tathastu i') ? 'Tathastu I' : 
                       fileName.includes('tathastu ii') ? 'Tathastu II' : 'Advitiya Heights',
                type: 'floor_plan',
                description: 'Typical floor plan showing unit layouts'
            });
        } else if (fileName.includes('site plan') || fileName.includes('layout')) {
            resolve({
                project: 'Multiple Projects',
                type: 'site_plan',
                description: 'Site layout showing building placement and common areas'
            });
        } else if (fileName.includes('carpet area')) {
            resolve({
                project: fileName.includes('tathastu i') ? 'Tathastu I' : 'Tathastu II',
                type: 'carpet_area',
                description: 'Carpet area details for different unit types'
            });
        } else if (fileName.includes('elevation')) {
            resolve({
                project: fileName.includes('tathastu i') ? 'Tathastu I' : 'Tathastu II',
                type: 'elevation',
                description: 'Building elevation views'
            });
        } else if (fileName.includes('drawing')) {
            resolve({
                project: 'Sector 104 Development',
                type: 'technical_drawing',
                description: 'Engineering drawing for construction'
            });
        } else {
            resolve({
                project: 'Unknown Project',
                type: 'other',
                description: 'Document of unknown type'
            });
        }
    });
}

// Extract text content from a DOCX file
async function extractDocxText(file) {
    // In a browser environment, we would use a library like mammoth or docxtemplater
    // For now, this is a placeholder that returns mock data based on filename
    return new Promise((resolve) => {
        const fileName = file.name.toLowerCase();
        
        if (fileName.includes('affidavit')) {
            resolve({
                project: fileName.includes('advitya') ? 'Advitiya Heights' : 
                       fileName.includes('legend') ? 'Legend III' : 'Tathastu',
                type: 'affidavit',
                description: 'Legal affidavit document for project registration'
            });
        } else if (fileName.includes('newspaper ad')) {
            resolve({
                project: fileName.includes('tathastu i') ? 'Tathastu I' : 'Tathastu II',
                type: 'advertisement',
                description: 'Newspaper advertisement for project marketing'
            });
        } else {
            resolve({
                project: 'Unknown Project',
                type: 'other',
                description: 'Document of unknown type'
            });
        }
    });
}

// Categorize documents by type
function categorizeDocuments(files) {
    const categories = {
        brochures: [],
        floor_plans: [],
        site_plans: [],
        technical_drawings: [],
        affidavits: [],
        advertisements: [],
        carpet_areas: [],
        elevations: [],
        other: []
    };
    
    files.forEach(file => {
        const info = extractFileInfo(file);
        
        switch(info.type) {
            case 'brochure':
                categories.brochures.push(file);
                break;
            case 'floor_plan':
                categories.floor_plans.push(file);
                break;
            case 'site_plan':
                categories.site_plans.push(file);
                break;
            case 'technical_drawing':
                categories.technical_drawings.push(file);
                break;
            case 'affidavit':
                categories.affidavits.push(file);
                break;
            case 'advertisement':
                categories.advertisements.push(file);
                break;
            case 'carpet_area':
                categories.carpet_areas.push(file);
                break;
            case 'elevation':
                categories.elevations.push(file);
                break;
            default:
                categories.other.push(file);
        }
    });
    
    return categories;
}

// Extract file information based on name
function extractFileInfo(file) {
    const name = file.name.toLowerCase();
    
    if (name.includes('brochure') || name.includes('braucher')) {
        return {
            project: getProjectName(name),
            type: 'brochure',
            category: 'marketing',
            title: 'Project Brochure'
        };
    } else if (name.includes('floor plan') || name.includes('tower')) {
        return {
            project: getProjectName(name),
            type: 'floor_plan',
            category: 'design',
            title: 'Floor Plan'
        };
    } else if (name.includes('site plan') || name.includes('layout')) {
        return {
            project: getProjectName(name),
            type: 'site_plan',
            category: 'design',
            title: 'Site Plan'
        };
    } else if (name.includes('drawing')) {
        return {
            project: getProjectName(name),
            type: 'technical_drawing',
            category: 'engineering',
            title: 'Technical Drawing'
        };
    } else if (name.includes('carpet area')) {
        return {
            project: getProjectName(name),
            type: 'carpet_area',
            category: 'documentation',
            title: 'Carpet Area Details'
        };
    } else if (name.includes('elevation')) {
        return {
            project: getProjectName(name),
            type: 'elevation',
            category: 'design',
            title: 'Elevation View'
        };
    } else if (name.includes('affidavit')) {
        return {
            project: getProjectName(name),
            type: 'affidavit',
            category: 'legal',
            title: 'Affidavit Form'
        };
    } else if (name.includes('newspaper ad')) {
        return {
            project: getProjectName(name),
            type: 'advertisement',
            category: 'marketing',
            title: 'Newspaper Advertisement'
        };
    } else {
        return {
            project: getProjectName(name),
            type: 'other',
            category: 'other',
            title: 'Document'
        };
    }
}

// Get project name from filename
function getProjectName(name) {
    if (name.includes('tathastu i')) return 'Tathastu I';
    if (name.includes('tathastu ii')) return 'Tathastu II';
    if (name.includes('advitiya') || name.includes('advitya')) return 'Advitiya Heights';
    if (name.includes('legend')) return 'Legend III';
    if (name.includes('sector 104')) return 'Sector 104 Development';
    return 'Unknown Project';
}

// Export for use in other modules
window.documentParser = {
    extractPdfText,
    extractDocxText,
    categorizeDocuments,
    extractFileInfo,
    getProjectName
};

// Make available to data loader
if (typeof window.dataLoader !== 'undefined') {
    window.dataLoader.documentParser = window.documentParser;
}