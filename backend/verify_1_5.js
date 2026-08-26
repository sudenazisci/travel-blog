const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel() {
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-1.5-flash-002", "gemini-1.5-flash-latest"];

    for (const modelName of modelsToTry) {
        console.log(`Testing ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test");
            console.log(`SUCCESS: ${modelName} is available.`);
            // console.log(result.response.text());
        } catch (error) {
            console.log(`FAILED ${modelName}: ${error.message.split('\n')[0]}`);
        }
    }
}

testModel();
