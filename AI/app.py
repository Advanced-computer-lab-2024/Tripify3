from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from main import chatbot_response

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Home route
@app.route('/')
def home():
    return "Welcome to the Groq Chatbot!"

# Chat route - accepts a message and returns a response from the chatbot
@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')

    if not user_input:
        return jsonify({"error": "Please provide a message"}), 400

    # Get the chatbot's response from the main logic
    response = chatbot_response(user_input)

    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)