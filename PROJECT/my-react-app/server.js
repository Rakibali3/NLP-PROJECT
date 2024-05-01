// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cohere = require('cohere');
const app = express();
const port = process.env.PORT || 3000;

// Initialize Cohere client with API key
// const co = new cohere.Client(process.env.COHERE_API_KEY);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/",(req,res)=>{
    res.render("app.jsx");
})

app.post('/generate', async (req, res) => {
  try {
    // Get input text from the POST request
    const inputText = req.body.input;

    // Generate questions using Cohere API
    const prompt = `'${inputText}' generate some questions and answers on this matter`;
    const response = await co.generate({ prompt, maxTokens: 1000 });

    // Extract questions from response
    const questions = response.generations[0].text.split("?\n").map(q => q.trim()).filter(Boolean);

    // Return JSON response with generated questions
    res.json({ questions });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
