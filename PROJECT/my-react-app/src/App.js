import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [inputText, setInputText] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/generate_questions', { text: inputText });
      
      const { summary, questions } = response.data;
      setGeneratedQuestions(questions);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch data. Please check the path.');
      setGeneratedQuestions([]);
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
      {error && <div>Error: {error}</div>}
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
