const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');
const path = require('path');

const width = 400; //px
const height = 250; //px
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour: 'white' });

const generateRevenueChart = async (data) => {
    const configuration = {
        type: 'bar',
        data: {
            labels: [data.YEAR_1, data.YEAR_2, data.YEAR_3],
            datasets: [{
                label: 'Revenue (Cr)',
                data: [
                    parseFloat(data.REV_1.replace(/,/g, '')) || 0,
                    parseFloat(data.REV_2.replace(/,/g, '')) || 0,
                    parseFloat(data.REV_3.replace(/,/g, '')) || 0
                ],
                backgroundColor: '#0f172a',
                borderRadius: 4
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { display: false } },
                x: { grid: { display: false } }
            }
        }
    };
    
    const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    const fileName = `chart_rev_${Date.now()}.png`;
    const filePath = path.join(__dirname, '../charts', fileName);
    fs.writeFileSync(filePath, buffer);
    return filePath;
};

const generateMarginChart = async (data) => {
    const configuration = {
        type: 'line',
        data: {
            labels: [data.YEAR_1, data.YEAR_2, data.YEAR_3],
            datasets: [
                {
                    label: 'EBITDA',
                    data: [
                        parseFloat(data.EBITDA_1.replace(/,/g, '')) || 0,
                        parseFloat(data.EBITDA_2.replace(/,/g, '')) || 0,
                        parseFloat(data.EBITDA_3.replace(/,/g, '')) || 0
                    ],
                    borderColor: '#10b981',
                    tension: 0.4,
                    fill: false,
                    borderWidth: 2
                },
                {
                    label: 'PAT',
                    data: [
                        parseFloat(data.PAT_1.replace(/,/g, '')) || 0,
                        parseFloat(data.PAT_2.replace(/,/g, '')) || 0,
                        parseFloat(data.PAT_3.replace(/,/g, '')) || 0
                    ],
                    borderColor: '#3b82f6',
                    tension: 0.4,
                    fill: false,
                    borderWidth: 2
                }
            ]
        },
        options: {
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
            },
            scales: {
                y: { beginAtZero: true },
                x: { grid: { display: false } }
            }
        }
    };
    
    const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    const fileName = `chart_margin_${Date.now()}.png`;
    const filePath = path.join(__dirname, '../charts', fileName);
    fs.writeFileSync(filePath, buffer);
    return filePath;
};

module.exports = { generateRevenueChart, generateMarginChart };
