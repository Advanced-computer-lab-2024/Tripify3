# main.py
from dotenv import load_dotenv
from langchain.chains import ConversationChain
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain_groq import ChatGroq
import os

# Load environment variables from .env file
load_dotenv()

# groq_api_key from environment variable
groq_api_key = os.environ.get('GROQ_API_KEY', 'your_default_key')  # Add your default key if needed

# Initialize Groq Langchain chat object
groq_chat = ChatGroq(
    groq_api_key=groq_api_key,
    model_name='llama-3.1-70b-versatile'  # Choose your desired model
)

# Set memory length for the conversation
memory = ConversationBufferWindowMemory(k=100)  # Adjustable based on needs

# Initialize conversation chain
conversation = ConversationChain(
    llm=groq_chat,
    memory=memory
)

def chatbot_response(user_input):
    """
    Function to get the chatbot response for a given user input.
    """
    response = conversation.predict(input=user_input)
    print(response)
    return response
