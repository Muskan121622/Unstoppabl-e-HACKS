// Example of fetching and displaying data from JSON files
// This is a working JS fetch example as required

async function loadProjectsData() {
  try {
    const response = await fetch('data/projects.json');
    const projects = await response.json();
    
    // Display the first project's data
    console.log('Projects Data:', projects);
    
    // Example of accessing specific fields
    if (projects.length > 0) {
      const project = projects[0];
      console.log(`Project Name: ${project.name}`);
      console.log(`Area: ${project.area}`);
      console.log(`Status: ${project.status}`);
      console.log(`Source PDF: ${project.sourcePdf}`);
      
      // Return the project data for further use
      return project;
    }
  } catch (error) {
    console.error('Error loading projects data:', error);
  }
}

async function loadZoningData() {
  try {
    const response = await fetch('data/zoning.json');
    const zoning = await response.json();
    
    console.log('Zoning Data:', zoning);
    console.log(`Zone: ${zoning.zone}`);
    console.log(`FAR: ${zoning.far}`);
    console.log(`Height Limit: ${zoning.heightLimit}`);
    console.log(`Source PDF: ${zoning.sourcePdf}`);
    
    return zoning;
  } catch (error) {
    console.error('Error loading zoning data:', error);
  }
}

async function loadPricesData() {
  try {
    const response = await fetch('data/prices.json');
    const prices = await response.json();
    
    console.log('Prices Data:', prices);
    console.log(`Area: ${prices.area}`);
    console.log(`Circle Rate: ${prices.circleRate}`);
    console.log(`Source PDF: ${prices.sourcePdf}`);
    
    return prices;
  } catch (error) {
    console.error('Error loading prices data:', error);
  }
}

async function loadTrendsData() {
  try {
    const response = await fetch('data/trends.json');
    const trends = await response.json();
    
    console.log('Trends Data:', trends);
    
    if (trends.length > 0) {
      const trend = trends[0];
      console.log(`Year: ${trend.year}`);
      console.log(`Average Price: ${trend.avgPrice}`);
      console.log(`Source Image: ${trend.sourceImage}`);
      
      return trend;
    }
  } catch (error) {
    console.error('Error loading trends data:', error);
  }
}

// Example usage
document.addEventListener('DOMContentLoaded', async function() {
  console.log('Loading all data...');
  
  const projectData = await loadProjectsData();
  const zoningData = await loadZoningData();
  const pricesData = await loadPricesData();
  const trendsData = await loadTrendsData();
  
  console.log('All data loaded successfully!');
});