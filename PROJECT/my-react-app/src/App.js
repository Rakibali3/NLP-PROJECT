import React, { useState } from 'react';

function App() {
  const [inputType, setInputType] = useState('text');
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [questions, setQuestions] = useState([]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('inputType', inputType);

    if (inputType === 'text') {
      formData.append('text', inputText); // Correct key should be 'text'
    } else {
      formData.append('file', file);
    }

    try {
      const response = await fetch('http://localhost:5000/generate_questions', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setSummary(data.summary);
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="main">
      <h1>Generate Questions</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input type="radio" value="text" checked={inputType === 'text'} onChange={() => setInputType('text')} />
          Enter Text
        </label>
        <label>
          <input type="radio" value="file" checked={inputType === 'file'} onChange={() => setInputType('file')} />
          Upload File
        </label>
        {inputType === 'text' ? (
          <textarea
            id="inputText"
            rows="4"
            cols="50"
            value={inputText}
            onChange={handleInputChange}
          ></textarea>
        ) : (
          <input type="file" onChange={handleFileChange} />
        )}
        <button type="submit">Generate Questions</button>
      </form>
      <div id="questions">
        <h2>Summary:</h2>
        <p>{summary}</p>
        <h2>Questions:</h2>
        {questions.map((question, index) => (
          <p key={index}>{question}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
