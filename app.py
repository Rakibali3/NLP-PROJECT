import requests
import json
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist

from dotenv import load_dotenv
load_dotenv()
import os
import cohere

# Set your Cohere API key
api_key = "JeUjkcaywA35HJdNj4TQ6ANgmNFZVPQ7Wq8oR6NZ"

# Input text
text = input("Enter input : ")

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

print("Summary:")
print(summary)

co = cohere.Client(os.environ["COHERE_API_KEY"])

prompt = f"'{summary}' generate some questions and answers on this matter"

response = co.generate(
  prompt = prompt,
  max_tokens = 1000
)
questions = response.generations[0].text.split("\n")

# Filter out any empty strings
questions = [question.strip() for question in questions if question]

# Print the generated questions without repeated content
for question in questions:
    print(question)
    print()