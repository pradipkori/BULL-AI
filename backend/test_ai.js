const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function run() {
  console.log("Using key:", process.env.GEMINI_API_KEY_2);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_2);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  try {
    const result = await model.generateContent("hello");
    console.log(result.response.text());
  } catch (error) {
    console.error(error.message);
  }
}
run();
