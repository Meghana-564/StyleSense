import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"Using API key: {api_key}")

genai.configure(api_key=api_key)

try:
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content("Hello, respond with 'success' if you receive this message.")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Gemini API call failed with exception:\n{e}")
