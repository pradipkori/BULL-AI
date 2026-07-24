require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/generated', express.static(path.join(__dirname, 'generated')));

// Setup directories
const dirs = ['uploads', 'templates', 'charts', 'generated'];
dirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
});

// Setup simple storage for reports
const reportsFilePath = path.join(__dirname, 'generated', 'reports.json');
let reports = [];
if (fs.existsSync(reportsFilePath)) {
    try {
        reports = JSON.parse(fs.readFileSync(reportsFilePath, 'utf8'));
    } catch (e) {
        reports = [];
    }
}

app.get('/api/reports', (req, res) => {
    res.json(reports);
});

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Temporary ping route
app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

const { parseDocument } = require('./services/parser');
const { extractFinancialData } = require('./services/ai');
const { generateRevenueChart, generateMarginChart } = require('./services/charts');
const { generatePDF } = require('./services/pdfGenerator');

app.post('/api/generate-report', upload.single('document'), async (req, res) => {
    try {
        const { companyName } = req.body;
        const file = req.file;

        if (!companyName || !file) {
            return res.status(400).json({ error: 'Company name and document are required.' });
        }

        console.log(`Received request for ${companyName}, file: ${file.originalname}`);

        // Phase 2 - Extract text
        console.log("Parsing document...");
        const rawText = await parseDocument(file.path, file.mimetype);

        // Phase 3 - AI Extraction
        console.log("Extracting financial data via AI...");
        const financialData = await extractFinancialData(rawText, companyName);
        console.log("AI Extraction successful.");

        // Phase 5 - Generate Charts
        console.log("Generating charts...");
        const revenueChartPath = await generateRevenueChart(financialData);
        const marginChartPath = await generateMarginChart(financialData);

        // Phase 5 - Generate PDF
        console.log("Generating PDF report...");
        const pdfFileName = await generatePDF(financialData, revenueChartPath, marginChartPath);

        // Optional: Clean up temporary chart files and uploaded docs to save space
        // fs.unlinkSync(file.path);
        // fs.unlinkSync(revenueChartPath);
        // fs.unlinkSync(marginChartPath);

        const newReport = {
            id: Date.now().toString(),
            companyName: companyName,
            date: new Date().toISOString().split('T')[0],
            type: 'FINANCIAL',
            status: 'success',
            pdfUrl: `http://localhost:${PORT}/generated/${pdfFileName}`
        };
        reports.unshift(newReport);
        fs.writeFileSync(reportsFilePath, JSON.stringify(reports, null, 2));

        return res.json({ 
            message: 'Report generated successfully.', 
            pdfUrl: newReport.pdfUrl,
            dataPreview: financialData 
        });

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'An error occurred while generating the report.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
