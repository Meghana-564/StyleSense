# StyleSense – Generative AI Fashion Recommendation System

StyleSense is a premium, production-ready, full-stack AI-powered fashion assistant. It provides professional styling consultations, visual clothing detection, budget-aware outfit recommendations, visual similarity searching, and live fashion trend analyses in a modern luxury-fashion glassmorphism dark theme.

---

## Technical Architecture

* **Frontend**: React + Vite, Tailwind CSS (v4), Framer Motion, Axios, React Icons.
* **Backend**: FastAPI (Python), Uvicorn, Pydantic, Dotenv.
* **AI Models**:
  * **Groq API** (`llama-3.3-70b-specdec`/`llama3-8b-8192`): Conversational chatbot, query classifier, and 3x budget-compliant outfit builder.
  * **Gemini API** (`gemini-1.5-flash`): Visual garment detection, gender classification, style scoring, and styling suggestions.
  * **Hugging Face API** (`sentence-transformers/all-MiniLM-L6-v2`): Text embedding extraction for semantic product similarity. Includes a tag-matching fallback for network independence.

---

## Directory Structure

```
stylesense/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py        # FastAPI routes & CORS
│   │   ├── config.py      # App configurations & .env variables
│   │   ├── database.py    # Seeded database of 30+ real clothing items
│   │   ├── services.py    # Groq, Gemini, and Hugging Face services
│   │   └── schemas.py     # Request/Response Pydantic schemas
│   ├── requirements.txt   # Backend dependencies
│   └── .env               # API keys (Groq, Gemini, Hugging Face)
├── frontend/
│   ├── src/
│   │   ├── components/    # Navbar, Hero, Chat, Uploader, Cards, Footer
│   │   ├── pages/         # Home, Chat, Analysis, Outfits, Products, Trends
│   │   ├── api.js         # Centralized Axios API request client
│   │   ├── App.jsx        # Tab state router
│   │   ├── index.css      # Custom stylesheet & Tailwind theme setup
│   │   └── main.jsx       # Vite root mounter
│   ├── package.json       # Frontend package configuration
│   └── vite.config.js     # Vite & Tailwind v4 plugin configuration
└── README.md              # Startup instructions (this file)
```

---

## Setup & Startup Instructions

### 1. Prerequisites
Ensure you have the following installed:
* **Node.js** (v18 or higher)
* **Python** (v3.9 or higher)

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Windows PowerShell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   
   # macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your API credentials inside the `.env` file:
   * Edit the `backend/.env` file and replace the keys with your actual API keys:
     ```env
     GROQ_API_KEY=gsk_...
     GEMINI_API_KEY=AIzaSy...
     HUGGINGFACE_API_KEY=hf_...  # Optional. If left empty, similarity falls back to text overlap algorithms.
     ```
5. Start the FastAPI backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The backend API will now be active at `http://localhost:8000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the node packages:
   ```bash
   npm install
   ```
3. Run the frontend local development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the URL printed in the terminal (typically `http://localhost:5173`).

---

## Verification & Features Testing

### 1. Strict Chatbot Rule Verification
* **Fashion Query Test**: Ask `"What colors match with a sage green shirt?"` or `"Suggest a formal outfit for an interview."`
  * *Result*: The bot will reply with a detailed styling recommendation.
* **Non-Fashion Query Test**: Ask `"Who is the prime minister of India?"`, `"How do I write a binary search in python?"` or `"How are you today?"`
  * *Result*: The chatbot immediately intercepts the question and returns exactly:
    > `"I am StyleSense AI and can only assist with fashion and styling-related queries."`

### 2. Mandatory Budget Filtering Rule
* **Outfit Builder Test**: Set the maximum budget limit to `₹2000` and enter occasion as `"Wedding Reception"`.
  * *Result*: The AI returns 3 outfit recommendation cards. For every outfit, the `Estimated Cost` will be strictly `<= ₹2000`.
* **Product Search Test**: Search for `"Men's Fashion"`, category `"Footwear"` under budget limit `₹1500`.
  * *Result*: Displays sneakers and sandals priced under `₹1500` (e.g. Sparx Sneakers at ₹849, Bata Shoes at ₹1299). Any footwear over ₹1500 (such as Puma White Smash at ₹2299) is strictly filtered out of the results.

### 3. Image Analysis Workflow
1. Navigate to the **Image Analysis** tab.
2. Select your maximum shopping budget limit using the slider (e.g. `₹1500`).
3. Upload an image of a garment (such as a black shirt or black kurti).
4. Click **Analyze Outfit Details**:
   * *Aesthetic Metrics*: Displays the Detected Item, Category, Style, Colors, and a radial styling Score from 1 to 10.
   * *Feedback Report*: Shows concrete bullet lists of style strengths and actionable improvements.
   * *Similar Deals Grid*: Lists products of the **same gender and category** matching the colors and styles from Amazon, Flipkart, and Myntra (e.g., if you upload a Women's Black Kurti, it will search only Women's Kurtis / Ethnic Tops below your budget limit, completely filtering out Men's clothes or non-clothing items).
   * *Styling Coordinations*: Suggests combinations for Bottoms, Footwear, and Accessories to complete the look.
