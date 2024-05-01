from flask import Flask, request, jsonify, render_template
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist
import os
import cohere
import PyPDF2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Set up your Cohere API key
api_key = os.environ.get("COHERE_API_KEY")

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    
def extract_text_from_pdf(pdf_file):
    text = ""
    with open(pdf_file, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text()
    return text


def generate_summary_and_questions(text):
    # Tokenize the text into words
    words = word_tokenize(text)

    # Remove stop words
    stop_words = set(stopwords.words('english'))
    words = [word for word in words if word not in stop_words]

    # Create frequency distribution of words
    freq_dist = FreqDist(words)

    # Create a list of sentences
    sentences = sent_tokenize(text)

    # Create a dictionary of sentence scores
    sentence_scores = {}
    for i, sentence in enumerate(sentences):
        for word in word_tokenize(sentence):
            if word in freq_dist:
                if len(sentence.split(' ')) < 30:
                    if sentence not in sentence_scores.keys():
                        sentence_scores[sentence] = freq_dist[word]
                    else:
                        sentence_scores[sentence] += freq_dist[word]

    # Sort the dictionary by score
    sorted_sentence_scores = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)

    # Create a list of sentence tuples
    sentence_tuples = sorted_sentence_scores[:3]

    # Create a summary
    summary = ''
    for sentence in sentence_tuples:
        summary += " " + sentence[0]

    # Generate questions using Cohere
    co = cohere.Client(api_key)

    prompt = f"'{summary}' generate some questions and answers on this matter"

    response = co.generate(
        prompt=prompt,
        max_tokens=1000
    )
    questions = response.generations[0].text.split("\n")

    # Filter out any empty strings
    questions = [question.strip() for question in questions if question]

    return summary, questions

@app.route('/')
def index():
    # Render the index.html template
    return render_template('index.html')

@app.route('/generate_questions', methods=['POST'])
def generate_questions():
    input_type = request.form.get('inputType')

    if input_type == 'text':
        # Receive input text from frontend
        text = request.form.get('text')
    elif input_type == 'file':
        # Receive input file from frontend
        file = request.files['file']
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        # Extract text from PDF
        text = extract_text_from_pdf(file_path)
    else:
        return jsonify({"error": "Invalid input type"})

    # Generate summary and questions
    summary, questions = generate_summary_and_questions(text)

    # Return the generated questions to the frontend
    return jsonify({"summary": summary, "questions": questions})

if __name__ == '__main__':
    app.run(debug=True)
