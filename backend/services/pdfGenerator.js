const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const generatePDF = async (data, revenueChartPath, marginChartPath) => {
    try {
        // Read the HTML template
        const templatePath = path.join(__dirname, '../templates/report.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        // Convert chart paths to base64 so they render properly in puppeteer without absolute path issues
        const revChartBase64 = fs.readFileSync(revenueChartPath, { encoding: 'base64' });
        const marginChartBase64 = fs.readFileSync(marginChartPath, { encoding: 'base64' });
        
        const revChartDataURI = `data:image/png;base64,${revChartBase64}`;
        const marginChartDataURI = `data:image/png;base64,${marginChartBase64}`;

        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        // Replace placeholders
        const replacements = {
            '{{COMPANY_NAME}}': data.COMPANY_NAME || 'Unknown Company',
            '{{TICKER}}': data.TICKER || 'N/A',
            '{{DATE}}': today,
            '{{RECOMMENDATION}}': data.RECOMMENDATION || 'HOLD',
            '{{CURRENT_PRICE}}': data.CURRENT_PRICE || 'N/A',
            '{{TARGET_PRICE}}': data.TARGET_PRICE || 'N/A',
            '{{EXECUTIVE_SUMMARY}}': data.EXECUTIVE_SUMMARY || 'No summary available.',
            '{{YEAR_1}}': data.YEAR_1 || 'Year 1',
            '{{YEAR_2}}': data.YEAR_2 || 'Year 2',
            '{{YEAR_3}}': data.YEAR_3 || 'Year 3',
            '{{REV_1}}': data.REV_1 || '-',
            '{{REV_2}}': data.REV_2 || '-',
            '{{REV_3}}': data.REV_3 || '-',
            '{{EBITDA_1}}': data.EBITDA_1 || '-',
            '{{EBITDA_2}}': data.EBITDA_2 || '-',
            '{{EBITDA_3}}': data.EBITDA_3 || '-',
            '{{PAT_1}}': data.PAT_1 || '-',
            '{{PAT_2}}': data.PAT_2 || '-',
            '{{PAT_3}}': data.PAT_3 || '-',
            '{{EPS_1}}': data.EPS_1 || '-',
            '{{EPS_2}}': data.EPS_2 || '-',
            '{{EPS_3}}': data.EPS_3 || '-',
            '{{REVENUE_CHART}}': revChartDataURI,
            '{{MARGIN_CHART}}': marginChartDataURI
        };

        for (const [key, value] of Object.entries(replacements)) {
            htmlContent = htmlContent.replace(new RegExp(key, 'g'), value);
        }

        // Setup Puppeteer
        const browser = await puppeteer.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        const page = await browser.newPage();
        
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const fileName = `${data.COMPANY_NAME.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '../generated', fileName);

        await page.pdf({
            path: filePath,
            format: 'A4',
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
        });

        await browser.close();

        return fileName;
    } catch (error) {
        console.error("PDF Generation Error:", error);
        throw new Error("Failed to generate PDF report.");
    }
};

module.exports = { generatePDF };
