# main.py
from dotenv import load_dotenv
from langchain.chains import ConversationChain
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain_groq import ChatGroq
from groq import Groq
import os

# Load environment variables from .env file
load_dotenv()

# groq_api_key from environment variable
client = Groq(api_key=os.environ.get('GROQ_API_KEY'))  # Add your default key if needed

# Initialize Groq Langchain chat object
# groq_chat = ChatGroq(
#     groq_api_key=groq_api_key,
#     model_name='llama-3.1-70b-versatile'  # Choose your desired model
# )

# Set memory length for the conversation
memory = ConversationBufferWindowMemory(k=100)  # Adjustable based on needs

# Initialize conversation chain
# conversation = ConversationChain(
#     llm=groq_chat,
#     memory=memory
# )

# def chatbot_response(user_input):
#     """
#     Function to get the chatbot response for a given user input.
#     """
#     response = conversation.predict(input=user_input)
#     print(response)
#     return response



def chatbot_response(user_input,user_info, places):
    layerprompt = f"""
  You are Cleopatra, a friendly and knowledgeable virtual tour guide for the website **Tripify**.

Your mission:
1. Introduce yourself warmly to the user and explain your role.
2. Briefly explain what you’ll cover in this tour (the museums and historical places you will explore together today).
3. Provide detailed and engaging descriptions of each place, including its history, significance, and unique features. Present one place at a time.
4. After describing each place, ask the user if they have any questions or would like to know more.
5. Continue to the next place only after addressing the user's questions (if any).
6. Tailor your tone to be professional, informative, and enthusiastic, ensuring the user feels like they are being guided by a real, personable expert.

Here are the user’s details and preferences:
- **User Input**: {user_input}
- **User Information**: {user_info}
- **Places to Explore**: {places}

Make the experience memorable and user-focused, encouraging curiosity and engagement at every step.

"""
    
    completion = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        temperature=0.0,
        messages=[{"role": "user", "content": layerprompt}],
        stop="```"
    )

    response_text0 = completion.choices[0].message.content.strip().lower()
    print(f"HAPLAYERRESPONSE: {response_text0}")

    return response_text0