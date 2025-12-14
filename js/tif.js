// TIF (Tax Increment Financing) Benefits Viewer
// Calculates potential tax savings and visualizes them

const tifCalculator = {
    calculateSavings: function (propertyValue, taxRate, protectionPercent) {
        // Formula: savings = value * taxRate * protection
        // Note: percentages are input as whole numbers (e.g. 1.5, 60)

        const annualSavings = propertyValue * (taxRate / 100) * (protectionPercent / 100);
        return Math.round(annualSavings);
    },

    generateProjection: function (propertyValue, taxRate, protectionPercent, years = 5) {
        const projection = [];
        let currentValue = propertyValue;
        const appreciationRate = 0.05; // Assume 5% annual appreciation for projection

        for (let i = 1; i <= years; i++) {
            const savings = this.calculateSavings(currentValue, taxRate, protectionPercent);
            projection.push({
                year: `Year ${i}`,
                savings: savings,
                value: currentValue
            });
            currentValue = currentValue * (1 + appreciationRate);
        }
        return projection;
    },

    init: function () {
        const calculateBtn = document.getElementById('calculate-tif');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.updateView();
            });
        }

        // Initial calculation if inputs exist
        if (document.getElementById('tif-property-value')) {
            // Wait for data loader if circle rate is needed, but inputs have defaults
            this.updateView();
        }
    },

    updateView: function () {
        const valueInput = document.getElementById('tif-property-value');
        const taxInput = document.getElementById('tif-tax-rate');
        const protectionInput = document.getElementById('tif-protection');

        if (!valueInput || !taxInput || !protectionInput) return;

        const value = parseFloat(valueInput.value) || 0;
        const tax = parseFloat(taxInput.value) || 0;
        const protection = parseFloat(protectionInput.value) || 0;

        const annualSavings = this.calculateSavings(value, tax, protection);

        // Update text
        const savingsElement = document.getElementById('tif-annual-savings');
        if (savingsElement) {
            // Format currency in INR
            savingsElement.textContent = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(annualSavings);
        }

        // Generate graph
        const projection = this.generateProjection(value, tax, protection);
        this.renderChart(projection);
    },

    renderChart: function (data) {
        const container = document.getElementById('tif-chart-container');
        if (!container) return;

        container.innerHTML = '';

        // Find max value for scaling
        const maxSavings = Math.max(...data.map(d => d.savings));

        data.forEach(item => {
            // Create bar visual
            const barWrapper = document.createElement('div');
            barWrapper.style.display = 'flex';
            barWrapper.style.flexDirection = 'column';
            barWrapper.style.alignItems = 'center';
            barWrapper.style.flex = '1';
            barWrapper.style.height = '100%';
            barWrapper.style.justifyContent = 'flex-end';

            const barHeight = (item.savings / maxSavings) * 80; // Max 80% height

            const bar = document.createElement('div');
            bar.style.width = '100%';
            bar.style.maxWidth = '40px';
            bar.style.height = `${barHeight}%`;
            bar.style.backgroundColor = '#3498db';
            bar.style.borderTopLeftRadius = '4px';
            bar.style.borderTopRightRadius = '4px';
            bar.style.position = 'relative';
            bar.style.transition = 'height 0.5s ease';

            // Tooltip on hover
            bar.title = `Savings: ₹${item.savings.toLocaleString('en-IN')}`;

            const label = document.createElement('div');
            label.textContent = item.year;
            label.style.marginTop = '5px';
            label.style.fontSize = '0.8rem';
            label.style.color = '#666';

            const valueLabel = document.createElement('div');
            valueLabel.textContent = `₹${(item.savings / 1000).toFixed(1)}k`;
            valueLabel.style.marginBottom = '5px';
            valueLabel.style.fontSize = '0.75rem';
            valueLabel.style.fontWeight = 'bold';
            valueLabel.style.color = '#333';

            barWrapper.appendChild(valueLabel);
            barWrapper.appendChild(bar);
            barWrapper.appendChild(label);

            container.appendChild(barWrapper);
        });
    }
};

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    tifCalculator.init();
});
