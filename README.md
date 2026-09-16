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

## simple for backend :
cd backend 
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000

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


______________________________________________________________________________________________________________-
StyleSense – Generative AI Fashion Recommendation System

StyleSense is a full-stack, AI-powered fashion assistant that provides personalized styling guidance, visual clothing analysis, budget-aware outfit recommendations, product discovery, and fashion trend insights.

The system combines Generative AI, image analysis, and semantic similarity techniques to help users discover suitable outfits and fashion products through an interactive web application.

Technical Architecture
Frontend
React
Vite
Tailwind CSS v4
Framer Motion
Axios
React Icons
Backend
FastAPI
Python
Uvicorn
Pydantic
Python Dotenv
AI Services

Groq API – openai/gpt-oss-120b

Used for:

Fashion conversational chatbot
Fashion query processing
Outfit generation
Dynamic fashion responses
Fashion trend generation
AI-based styling recommendations

Google Gemini API – gemini-1.5-flash

Used for:

Visual garment analysis
Clothing attribute detection
Gender classification
Color identification
Style analysis
Styling suggestions

Hugging Face

Used for:

Semantic text embeddings
Product similarity matching
Text-based product comparison

The system also supports fallback matching when the embedding service is unavailable.

Directory Structure
stylesense/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI routes & CORS
│   │   ├── config.py            # Application configuration & environment variables
│   │   ├── database.py           # Fashion product data
│   │   ├── services.py           # Groq, Gemini & Hugging Face services
│   │   └── schemas.py            # Pydantic request/response schemas
│   │
│   ├── requirements.txt          # Backend dependencies
│   └── .env                      # Local API keys (not committed to GitHub)
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Hero, Chat, Uploader, Cards, Footer
│   │   ├── pages/                # Home, Chat, Analysis, Outfits, Products, Trends
│   │   ├── api.js                # Centralized Axios API client
│   │   ├── App.jsx               # Main application component
│   │   ├── index.css             # Global styling & Tailwind configuration
│   │   └── main.jsx              # React application entry point
│   │
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite configuration
│
├── .gitignore                    # Prevents secrets and unnecessary files from Git
├── README.md
└── ABOUT.md
Setup & Startup Instructions
1. Prerequisites

Install the following:

Node.js v18 or higher
Python v3.9 or higher
Git
2. Backend Setup

Open a terminal and navigate to the backend:

cd backend
Create a virtual environment
Windows PowerShell
python -m venv venv
.\venv\Scripts\Activate.ps1
macOS/Linux
python -m venv venv
source venv/bin/activate
Install dependencies
pip install -r requirements.txt
Configure environment variables

Create a .env file inside the backend folder:

GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key

Important: Never commit the .env file or real API keys to GitHub.

Start the backend
uvicorn app.main:app --reload --port 8000

The backend will run at:

http://localhost:8000

FastAPI documentation is available at:

http://localhost:8000/docs
Simple Backend Startup

For Windows PowerShell:

cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
3. Frontend Setup

Open a new terminal and navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173
Deployment

StyleSense is deployed using separate frontend and backend services.

Frontend

Platform: Vercel

The React/Vite frontend communicates with the deployed FastAPI backend.

Backend

Platform: Render

The FastAPI backend provides the APIs required by the frontend.

Production Architecture
User
 │
 ▼
Vercel
React + Vite Frontend
 │
 │ HTTPS API Requests
 ▼
Render
FastAPI Backend
 │
 ├── Groq API
 │    └── openai/gpt-oss-120b
 │
 ├── Gemini API
 │    └── gemini-1.5-flash
 │
 └── Hugging Face
      └── Semantic Similarity

API credentials are stored as environment variables in the deployment platforms and are not stored in the GitHub repository.

Core Features
1. AI Fashion Chatbot

Users can interact with StyleSense AI for fashion-related questions.

Example:

What colors match with a sage green shirt?

The AI provides personalized styling suggestions.

Example:

Suggest a formal outfit for an interview.

The chatbot provides an appropriate formal outfit recommendation.

2. Fashion Query Processing

StyleSense processes user queries and provides fashion-focused responses using the Groq Generative AI model.

The chatbot is designed specifically for fashion and styling-related assistance.

3. Image Analysis

Users can upload an image of a clothing item.

The system analyzes the uploaded image and extracts relevant fashion attributes such as:

Clothing item
Category
Gender
Color
Style
Pattern
Fit
Other visual characteristics

Gemini is used for visual analysis, while Groq is used for additional AI-based processing and styling responses.

4. Style Analysis

The application provides:

Style score
Identified clothing details
Style strengths
Improvement suggestions
Styling recommendations

This helps users understand how the uploaded clothing item can be styled.

5. Budget-Aware Outfit Recommendations

Users can specify a maximum budget.

For example:

Budget: ₹2000
Occasion: Wedding Reception

StyleSense generates outfit recommendations while considering the specified budget.

6. Product Recommendations

The application can search and recommend fashion products based on:

Gender
Category
Color
Style
Budget
Clothing attributes

Products that do not satisfy the required category or budget constraints are filtered from the results.

7. Similar Product Search

After analyzing a clothing image, StyleSense searches for visually and semantically similar fashion products.

The system considers attributes such as:

Category
Gender
Color
Style
Clothing type

This helps avoid unrelated product recommendations.

8. Styling Coordination

StyleSense can suggest complementary items to complete an outfit, including:

Bottom wear
Footwear
Accessories

For example:

Black Kurti
   ↓
Recommended Bottom → Beige trousers
   ↓
Recommended Footwear → Flats
   ↓
Recommended Accessories → Minimal earrings
9. Fashion Trends

The application provides AI-generated fashion trend information and styling insights.

Users can explore current fashion ideas through the Trends section.

10. Color Palette Explorer

Users can explore suitable color combinations and fashion palettes for styling.

This feature helps users understand which colors can be combined to create coordinated outfits.

11. Style Quiz

The Style Quiz helps users explore their fashion preferences and discover suitable styling directions.

12. Outfit History

Users can view previously generated or explored outfit recommendations through the Outfit History section.

Verification & Feature Testing
1. Chatbot Testing
Fashion Query

Ask:

What colors match with a sage green shirt?

Expected result:

The AI provides a fashion styling recommendation.

Another example:

Suggest a formal outfit for an interview.

Expected result:

The AI suggests a suitable formal outfit.

Non-Fashion Query

Ask something unrelated to fashion, such as:

How do I write binary search in Python?

The application should handle the query according to its fashion-focused chatbot logic.

2. Budget Filtering
Outfit Builder Test

Set:

Budget: ₹2000
Occasion: Wedding Reception

The generated outfit recommendations should respect the specified budget.

Product Search Test

Example:

Category: Footwear
Budget: ₹1500

The application should filter products exceeding the specified budget.

3. Image Analysis Workflow
Step 1

Open the Image Analysis section.

Step 2

Select the maximum shopping budget.

Example:

₹1500
Step 3

Upload a clothing image.

For example:

Black shirt
Step 4

Click:

Analyze Outfit Details
Expected Results

The application displays:

Detected clothing item
Category
Gender
Colors
Style information
Style score
Fashion feedback
Improvement suggestions
Similar products
Styling coordination suggestions
4. Gender and Category Filtering

The product recommendation system considers the detected:

Gender
Clothing category
Color
Style

For example, if the uploaded item is identified as a Women's Black Kurti, the recommendation system should prioritize women's kurtis/appropriate ethnic clothing rather than unrelated men's clothing or unrelated product categories.

Project Workflow
User
 │
 ▼
Frontend
 │
 ├───────────────┐
 │               │
 ▼               ▼
Chat          Image Upload
 │               │
 ▼               ▼
Groq          Gemini Vision
 │               │
 │               ▼
 │          Fashion Attributes
 │               │
 └───────┬───────┘
         ▼
   Backend Processing
         │
         ▼
 Product Matching
         │
 ├── Category Filtering
 ├── Gender Filtering
 ├── Budget Filtering
 ├── Attribute Matching
 └── Similarity Matching
         │
         ▼
 Fashion Recommendations
Security

API keys are handled through environment variables.

The following files and directories should not be committed to GitHub:

.env
venv/
__pycache__/
*.pyc

The project's .gitignore file is configured to prevent these files from being uploaded accidentally.

Technologies Used
Area	Technology
Frontend	React
Build Tool	Vite
Styling	Tailwind CSS
Animations	Framer Motion
HTTP Client	Axios
Backend	FastAPI
Language	Python
AI Generation	Groq
Groq Model	openai/gpt-oss-120b
Image Analysis	Google Gemini
Embeddings	Hugging Face
Frontend Deployment	Vercel
Backend Deployment	Render
Conclusion

StyleSense combines Generative AI, computer vision, semantic similarity, and budget-aware recommendation logic into a single fashion assistance platform.

The system helps users:

Understand their clothing
Get personalized styling advice
Generate complete outfits
Discover similar fashion products
Stay updated with fashion trends
Explore suitable colors and styles
Make recommendations based on their budget

The application provides an interactive AI-powered fashion experience through a modern web interface.


