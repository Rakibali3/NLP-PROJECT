// App.js

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [inputText, setInputText] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('/generate/', { input: inputText });
      setGeneratedQuestions(response.data.questions);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h1>QUESTION AND ANSWER GENERATION</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter the text"
        />
        <button type="submit">Generate Questions</button>
      </form>
      <div id="questions-output">
        {generatedQuestions.length > 0 && (
          <div>
            <h2>Generated Questions:</h2>
            <ul>
              {generatedQuestions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
