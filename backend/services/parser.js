const fs = require('fs');
const pdfParse = require('pdf-parse');
const csv = require('csv-parser');

const parseDocument = async (filePath, mimetype) => {
    return new Promise(async (resolve, reject) => {
        try {
            let extractedText = "";

            if (mimetype === 'application/pdf') {
                const dataBuffer = fs.readFileSync(filePath);
                const data = await pdfParse(dataBuffer);
                extractedText = data.text;
                resolve(extractedText);
            } 
            else if (mimetype === 'text/plain') {
                extractedText = fs.readFileSync(filePath, 'utf8');
                resolve(extractedText);
            } 
            else if (mimetype === 'text/csv' || filePath.endsWith('.csv')) {
                const results = [];
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => results.push(JSON.stringify(data)))
                    .on('end', () => {
                        extractedText = results.join('\n');
                        resolve(extractedText);
                    })
                    .on('error', (err) => reject(err));
            } 
            else {
                reject(new Error(`Unsupported file type: ${mimetype}`));
            }
        } catch (error) {
            console.error("Document Parsing Error:", error);
            reject(new Error("Failed to parse document."));
        }
    });
};

module.exports = { parseDocument };
