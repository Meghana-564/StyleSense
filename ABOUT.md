# StyleSense AI — Complete Project Documentation

---

## What Is StyleSense AI?

StyleSense AI is a full-stack, production-ready, AI-powered fashion recommendation web application. It acts as a personal stylist — users can chat with an AI about fashion, upload clothing images for analysis, get budget-aware outfit recommendations, search products, and explore live fashion trends. The entire UI is built with a luxury glassmorphism dark theme.

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.6 | UI component framework |
| Vite | 8.0.12 | Build tool and dev server |
| Tailwind CSS | 4.3.0 | Utility-first styling |
| Framer Motion | 12.40.0 | Animations and transitions |
| Axios | 1.17.0 | HTTP client for API calls |
| React Icons | 5.6.0 | Icon library |
| React Dropzone | 15.0.0 | Drag-and-drop image upload |
| React Hot Toast | 2.6.0 | Toast notifications |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.9+ | Backend language |
| FastAPI | 0.110.0+ | REST API framework |
| Uvicorn | 0.28.0+ | ASGI server |
| Pydantic | 2.6.0+ | Request/response validation |
| python-dotenv | 1.0.1+ | Environment variable loading |
| python-multipart | 0.0.9+ | File upload handling |

### AI / External APIs
| Service | Model | Purpose |
|---|---|---|
| Groq API | openai/gpt-oss-120b | AI Stylist Chat, Outfit Builder, Trends, Color Palette |
| Google Gemini API | gemini-1.5-flash | Image analysis, garment detection, style scoring |
| Hugging Face API | sentence-transformers/all-MiniLM-L6-v2 | Semantic text embeddings (optional) |

### Database
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud database for product catalog |
| PyMongo 4.6.0+ | Python MongoDB driver |
| In-memory fallback | 30+ seeded products used if MongoDB is offline |

---

## Project Directory Structure

```
project/
├── backend/
│   ├── app/
│   │   ├── __init__.py         # Package marker
│   │   ├── main.py             # FastAPI app, all route definitions, CORS
│   │   ├── config.py           # Loads .env variables into Settings class
│   │   ├── database.py         # MongoDB connection + 30+ product seed data
│   │   ├── services.py         # All AI logic: Groq, Gemini, product matching
│   │   └── schemas.py          # Pydantic request/response models
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # API keys (never committed to git)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FashionChat.jsx     # AI Stylist Chat UI
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   ├── Hero.jsx            # Landing hero section
│   │   │   ├── Footer.jsx          # Footer
│   │   │   ├── ImageUploader.jsx   # Image upload component
│   │   │   ├── OutfitCard.jsx      # Outfit recommendation card
│   │   │   ├── ProductCard.jsx     # Product display card
│   │   │   ├── AnalysisCard.jsx    # Image analysis result card
│   │   │   ├── TrendSection.jsx    # Trends display
│   │   │   ├── Loader.jsx          # Loading spinner
│   │   │   └── UI.jsx              # Shared UI primitives (ScoreRing, Badge)
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── ChatPage.jsx        # AI Stylist Chat page
│   │   │   ├── AnalysisPage.jsx    # Image Analysis 4-step wizard
│   │   │   ├── OutfitsPage.jsx     # Outfit Builder page
│   │   │   ├── ProductsPage.jsx    # Product Search page
│   │   │   ├── TrendsPage.jsx      # Fashion Trends page
│   │   │   ├── ColorPalettePage.jsx # Color Palette tool
│   │   │   ├── StyleQuizPage.jsx   # Style Quiz
│   │   │   ├── OutfitHistoryPage.jsx # Saved outfit history
│   │   │   └── SignPage.jsx        # Sign in/up page
│   │   ├── api.js              # Centralized Axios API client
│   │   ├── App.jsx             # Root component, tab/page routing
│   │   ├── App.css             # App-level styles
│   │   ├── index.css           # Global styles, Tailwind setup
│   │   └── main.jsx            # Vite entry point, React DOM mount
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── package.json            # Node dependencies
│   ├── vite.config.js          # Vite + Tailwind plugin config
│   └── tailwind.config.js      # Tailwind configuration
└── ABOUT.md                    # This file
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/chat` | AI Stylist Chat (Groq) |
| POST | `/analyze-image` | Upload image → Gemini analysis + product matches |
| POST | `/similar-products` | Find similar products by attributes + budget |
| POST | `/recommend-outfit` | Generate 3 outfit recommendations (Groq) |
| POST | `/color-palette` | Generate color theory outfit ideas (Groq) |
| GET/POST | `/fashion-trends` | Get current fashion trends (Groq) |

---

## Complete Data Flow

### 1. AI Stylist Chat
```
User types message (FashionChat.jsx)
  → POST /chat  { message, history }
  → is_fashion_query() — keyword classifier checks if fashion-related
      → If NOT fashion → returns "I am StyleSense AI..." instantly
      → If fashion → chat_with_groq()
          → Groq API (openai/gpt-oss-120b) with system prompt
          → Returns styled fashion advice
  → ChatResponse { reply }
  → Displayed in chat bubble (FashionChat.jsx)
```

### 2. Image Analysis (4-Step Wizard)
```
Step 0: User selects gender (Men/Women)
Step 1: User uploads image (react-dropzone)
Step 2: User sets budget + optional garment name
Step 3: Analyze button clicked

  → POST /analyze-image  (multipart/form-data: image, budget, gender, garment_name)
  → analyze_image_with_gemini()
      → Gemini 1.5 Flash receives image bytes + detailed prompt
      → Returns JSON: detected_item, category, colors, style, fashion_score,
                      strengths, improvements, styling_recommendations,
                      garment_type, neckline, sleeve_type, silhouette, fit, fabric, occasion
      → If Gemini fails → generate_dynamic_analysis_with_groq() fallback
      → If Groq also fails → get_mock_image_analysis() static fallback
  → Category normalized to DB values (Topwear/Bottomwear/Ethnic Wear/Dresses/Footwear/Accessories)
  → find_similar_products()
      → get_all_products() from MongoDB (or in-memory fallback)
      → Hard filter: gender + category + price <= budget
      → Score each product by color match, style, pattern, fabric, fit, garment_type
      → Top 3 results returned with similarity % and dynamic search URLs
  → ImageAnalysisResponse returned
  → AnalysisPage.jsx renders: Score ring, fashion details chips, colors,
    strengths/improvements, shopping matches grid, styling coordinations
```

### 3. Outfit Builder
```
User sets gender, occasion, budget, style preference (OutfitsPage.jsx)
  → POST /recommend-outfit  { gender, occasion, budget, style_preference }
  → generate_outfit_recommendations()
      → Groq API generates exactly 3 outfit JSONs
      → Budget enforced post-generation (cost capped at budget * 0.95 if exceeded)
      → If Groq fails → get_mock_outfits() static fallback
  → OutfitResponse { outfits: [ {top, bottom, footwear, accessories, why_it_works,
                                  estimated_cost, confidence_score} ] }
  → 3 OutfitCard components rendered
```

### 4. Product Search
```
User enters search query, category, budget (ProductsPage.jsx)
  → POST /similar-products  { gender, category, detected_item, colors, style, budget }
  → find_similar_products()
      → MongoDB / in-memory catalog filtered by gender + category + price <= budget
      → Scored and top 3 returned
  → ProductCard grid rendered
```

### 5. Fashion Trends
```
TrendsPage.jsx mounts
  → GET /fashion-trends
  → get_fashion_trends()
      → Groq generates trending_colors, trending_styles, seasonal_trends, occasion_advice
      → If Groq fails → returns hardcoded default trends
  → TrendsResponse rendered in TrendSection components
```

### 6. Color Palette
```
User enters base color + gender (ColorPalettePage.jsx)
  → POST /color-palette  { color, gender }
  → get_color_palette()
      → Groq generates 3 outfit ideas using color theory (complementary/analogous/monochromatic)
      → Returns palette hex codes, outfit items, occasion, styling tip
  → Color swatches + outfit cards rendered
```

---

## Database — Product Catalog

The product catalog is seeded in `database.py` with 30+ real-world styled products:

| Category | Gender | Examples |
|---|---|---|
| Ethnic Wear | Women | Anouk Kurti, Libas Kurta, W Floral Kurti, Biba Anarkali |
| Topwear | Men | Roadster Shirt, Dennis Lingo Shirt, Allen Solly Polo, Puma Hoodie |
| Topwear | Women | H&M Crop Top, Tokyo Talkies Satin Top |
| Dresses | Women | Zara Floral Dress, SASSAFRAS Maxi Gown, StalkBuyLove Bodycon, ASOS Satin Gown |
| Bottomwear | Men | Levi's Jeans, Highlander Cargo, U.S. Polo Chinos, WROGN Joggers |
| Bottomwear | Women | Kraus Jeans, Kotty Wide Leg Jeans, Go Colors Leggings |
| Footwear | Men | Puma Sneakers, Bata Formal Shoes, Sparx Running Shoes |
| Footwear | Women | Carlton London Sandals, Mast & Harbour Sneakers, Bata Block Heels |
| Accessories | Men | Fastrack Sunglasses, Casio G-Shock, Titan Watch |
| Accessories | Women | Fastrack Sunglasses, Lavie Handbag, Baggit Wallet |

Each product has: id, name, gender, category, sub_category, price (INR), store (Amazon/Flipkart), image_url, product_url, colors, style, pattern, fit, fabric, description.

On startup, `seed_database_if_empty()` syncs all products to MongoDB Atlas. If MongoDB is unreachable, the in-memory `PRODUCTS_DB` list is used as fallback automatically.

---

## Environment Variables (.env)

```env
GROQ_API_KEY=gsk_...          # Groq API key for chat, outfits, trends
GEMINI_API_KEY=AIzaSy...      # Google Gemini for image analysis
HUGGINGFACE_API_KEY=hf_...    # Optional: semantic similarity embeddings
MONGODB_URI=mongodb+srv://... # MongoDB Atlas connection string
PORT=8000
HOST=0.0.0.0
```

Loaded by `config.py` using `python-dotenv`. Never exposed to the frontend — all AI calls happen server-side only.

---

## How to Build From Scratch

### Step 1 — Project Setup
```
mkdir stylesense
cd stylesense
mkdir backend frontend
```

### Step 2 — Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\python.exe -m pip install fastapi uvicorn pydantic python-dotenv \
    google-generativeai groq python-multipart pymongo dnspython

mkdir app
# Create: app/__init__.py, app/main.py, app/config.py,
#         app/database.py, app/services.py, app/schemas.py
# Create: .env with your API keys
# Create: requirements.txt
```

### Step 3 — Frontend Setup
```bash
cd frontend
npm create vite@latest . -- --template react
npm install axios framer-motion react-dropzone react-hot-toast react-icons
npm install -D tailwindcss @tailwindcss/vite autoprefixer postcss
# Configure vite.config.js with tailwindcss() plugin
# Build pages and components
```

### Step 4 — Run
```bash
# Terminal 1 — Backend
cd backend
venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm run dev
# Open http://localhost:5173
```

---

## Key Design Decisions

| Decision | Reason |
|---|---|
| FastAPI over Flask/Django | Async support, automatic OpenAPI docs, Pydantic validation |
| Groq over OpenAI directly | Faster inference, free tier, compatible API format |
| Gemini for image analysis | Best multimodal vision model for garment detection |
| In-memory DB fallback | App works fully offline without MongoDB |
| Keyword classifier for chat | More reliable than LLM-based classification for simple yes/no decisions |
| CORS allow_origins=["*"] | Development convenience — restrict to frontend URL in production |
| Dynamic search URLs | Product buy links are built at query time using brand + color + category for accuracy |
| Budget enforced in code | Post-generation budget cap ensures AI never exceeds user's limit even if model ignores it |

---

## Features Summary

| Feature | Status | AI Used |
|---|---|---|
| AI Stylist Chat | ✅ Working | Groq |
| Fashion Query Filter | ✅ Working | Keyword classifier |
| Image Analysis | ✅ Working | Gemini 1.5 Flash |
| Similar Products Search | ✅ Working | In-memory scoring |
| Budget-Aware Outfit Builder | ✅ Working | Groq |
| Fashion Trends | ✅ Working | Groq |
| Color Palette Generator | ✅ Working | Groq |
| MongoDB Product Catalog | ✅ Working | PyMongo |
| Offline Fallback | ✅ Working | Static data |
| Outfit History | ✅ Working | localStorage |

---

## Ports

| Service | URL |
|---|---|
| Backend API | http://localhost:8000 |
| Frontend Dev | http://localhost:5173 |
| API Docs (auto) | http://localhost:8000/docs |
