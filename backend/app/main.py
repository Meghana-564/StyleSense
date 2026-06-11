from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
from typing import Optional
from contextlib import asynccontextmanager

from app.schemas import (
    ChatRequest, ChatResponse,
    ImageAnalysisResponse, ProductMatch, StylingRecommendations,
    SimilarProductsRequest, SimilarProductsResponse,
    OutfitRequest, OutfitResponse,
    TrendsResponse
)
from app.services import (
    chat_with_groq,
    analyze_image_with_gemini,
    find_similar_products,
    generate_outfit_recommendations,
    get_fashion_trends,
    get_color_palette
)
from app.config import settings
from app.database import seed_database_if_empty

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup seeding check
    seed_database_if_empty()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Luxury AI Fashion Recommendation and Styling Engine",
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "online", "message": "Welcome to StyleSense AI API. The fashion recommendations engine is running!"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    POST /chat
    Enforces strict fashion-only filters and delivers stylized styling consultations.
    """
    if not request.message or request.message.strip() == "":
        raise HTTPException(status_code=400, detail="Query message cannot be empty.")
        
    try:
        history_list = [{"role": msg.role, "content": msg.content} for msg in request.history] if request.history else []
        reply = chat_with_groq(request.message, history_list)
        return ChatResponse(reply=reply)
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve stylist response. Please try again.")

@app.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_image_endpoint(
    image: UploadFile = File(...),
    budget: float = Form(2000.0),
    gender: Optional[str] = Form(None),
    garment_name: Optional[str] = Form(None)
):
    """
    POST /analyze-image
    Uploads an image, performs visual detection (gender, category, items, style),
    and aggregates similar product items strictly within budget limit.
    """
    # Verify file is an image
    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
    ext = os.path.splitext(image.filename)[1].lower()
    if ext not in allowed_extensions or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image (jpg, jpeg, png, webp, gif).")

    try:
        raw_bytes = await image.read()

        # Run Gemini Fashion Detection and Garment Identification
        analysis = analyze_image_with_gemini(raw_bytes, image.filename, gender)
        
        # Override/ensure the detected gender matches the user selected gender if provided
        raw_gender = gender if gender else analysis.get("gender", "Women's Fashion")
        # Normalize to exact DB values regardless of what Gemini/Groq returned
        g_lower = raw_gender.lower()
        if "women" in g_lower:
            gender_result = "Women's Fashion"
        elif "men" in g_lower:
            gender_result = "Men's Fashion"
        else:
            gender_result = "Women's Fashion"
        
        # Extract fields from analysis
        detected_item = analysis.get("detected_item", "Fashion Item")
        raw_category = analysis.get("category", "Topwear")

        # Normalize category to exactly match database values
        VALID_CATEGORIES = ["Topwear", "Bottomwear", "Footwear", "Accessories", "Ethnic Wear", "Dresses"]
        CATEGORY_ALIASES = {
            # Ethnic
            "kurta": "Ethnic Wear", "kurti": "Ethnic Wear", "ethnic": "Ethnic Wear",
            "saree": "Ethnic Wear", "lehenga": "Ethnic Wear", "salwar": "Ethnic Wear",
            "anarkali": "Ethnic Wear",
            # Topwear
            "shirt": "Topwear", "t-shirt": "Topwear", "tshirt": "Topwear",
            "top": "Topwear", "blouse": "Topwear", "hoodie": "Topwear",
            "jacket": "Topwear", "sweater": "Topwear", "polo": "Topwear",
            # Bottomwear
            "jeans": "Bottomwear", "pants": "Bottomwear", "trousers": "Bottomwear",
            "chinos": "Bottomwear", "cargo": "Bottomwear", "leggings": "Bottomwear",
            "joggers": "Bottomwear", "palazzo": "Bottomwear", "skirt": "Bottomwear",
            "shorts": "Bottomwear",
            # Footwear
            "shoes": "Footwear", "sneakers": "Footwear", "sandals": "Footwear",
            "heels": "Footwear", "boots": "Footwear", "loafers": "Footwear",
            # Accessories
            "watch": "Accessories", "bag": "Accessories", "handbag": "Accessories",
            "sunglasses": "Accessories", "belt": "Accessories", "jewellery": "Accessories",
            "wallet": "Accessories",
            # Dresses
            "dress": "Dresses", "gown": "Dresses", "frock": "Dresses",
            "jumpsuit": "Dresses", "co-ord set": "Dresses", "co-ord": "Dresses",
            "kaftan": "Dresses",
        }
        if raw_category in VALID_CATEGORIES:
            category = raw_category
        else:
            category = CATEGORY_ALIASES.get(raw_category.lower(), "Topwear")
        
        combined_colors = analysis.get("colors", [])
            
        style = analysis.get("style", "Casual")
        fashion_score = analysis.get("fashion_score", 7)
        strengths = analysis.get("strengths", [])
        improvements = analysis.get("improvements", [])
        styling_recs = analysis.get("styling_recommendations", {})

        # Extract detailed fashion attributes from analysis for precision matching
        garment_type = analysis.get("garment_type", "")
        pattern = analysis.get("pattern", "")
        fit = analysis.get("fit", "")
        fabric = analysis.get("fabric", "")

        # If user provided garment name, use it to override category detection
        if garment_name and garment_name.strip():
            user_garment = garment_name.strip().lower()
            CATEGORY_ALIASES = {
                "kurta": "Ethnic Wear", "kurti": "Ethnic Wear", "ethnic": "Ethnic Wear",
                "saree": "Ethnic Wear", "lehenga": "Ethnic Wear", "salwar": "Ethnic Wear",
                "anarkali": "Ethnic Wear",
                "shirt": "Topwear", "t-shirt": "Topwear", "tshirt": "Topwear",
                "top": "Topwear", "blouse": "Topwear", "hoodie": "Topwear",
                "jacket": "Topwear", "sweater": "Topwear", "polo": "Topwear",
                "jeans": "Bottomwear", "pants": "Bottomwear", "trousers": "Bottomwear",
                "chinos": "Bottomwear", "cargo": "Bottomwear", "leggings": "Bottomwear",
                "joggers": "Bottomwear", "palazzo": "Bottomwear", "skirt": "Bottomwear",
                "shorts": "Bottomwear",
                "shoes": "Footwear", "sneakers": "Footwear", "sandals": "Footwear",
                "heels": "Footwear", "boots": "Footwear", "loafers": "Footwear",
                "watch": "Accessories", "bag": "Accessories", "handbag": "Accessories",
                "sunglasses": "Accessories", "belt": "Accessories", "jewellery": "Accessories",
                "wallet": "Accessories",
                "dress": "Dresses", "gown": "Dresses", "frock": "Dresses",
                "jumpsuit": "Dresses", "co-ord set": "Dresses", "co-ord": "Dresses",
                "coord set": "Dresses", "coord": "Dresses", "kaftan": "Dresses",
                "maxi dress": "Dresses", "midi dress": "Dresses", "mini dress": "Dresses",
            }
            # Match user input against aliases (check substrings too)
            for key, cat in CATEGORY_ALIASES.items():
                if key in user_garment:
                    category = cat
                    garment_type = garment_name.strip()
                    break

        # 2. Run Similar Products Search with enhanced attribute matching
        shopping_matches_raw = find_similar_products(
            gender=gender_result,
            category=category,
            detected_item=detected_item,
            colors=combined_colors,
            style=style,
            budget=budget,
            image_bytes=raw_bytes,
            garment_type=garment_type,
            pattern=pattern,
            fit=fit,
            fabric=fabric,
            neckline=analysis.get("neckline", ""),
            silhouette=analysis.get("silhouette", ""),
            sleeve_type=analysis.get("sleeve_type", ""),
            occasion=analysis.get("occasion", "")
        )
        
        shopping_matches = [
            ProductMatch(
                id=item["id"],
                name=item["name"],
                price=item["price"],
                store=item["store"],
                image_url=item["image_url"],
                product_url=item["product_url"],
                similarity=item["similarity"]
            )
            for item in shopping_matches_raw
        ]

        # Structure styling recommendations
        styling_recommendations = StylingRecommendations(
            matching_bottoms=styling_recs.get("matching_bottoms", ["Neutral Bottoms"]),
            matching_footwear=styling_recs.get("matching_footwear", ["Casual Shoes"]),
            matching_accessories=styling_recs.get("matching_accessories", ["Minimalist Watch"])
        )

        return ImageAnalysisResponse(
            gender=gender_result,
            detected_item=detected_item,
            category=category,
            colors=combined_colors,
            style=style,
            fashion_score=fashion_score,
            strengths=strengths,
            improvements=improvements,
            shopping_matches=shopping_matches,
            styling_recommendations=styling_recommendations,
            garment_type=garment_type,
            pattern=analysis.get("pattern"),
            neckline=analysis.get("neckline"),
            sleeve_type=analysis.get("sleeve_type"),
            silhouette=analysis.get("silhouette"),
            fit=analysis.get("fit"),
            fabric=analysis.get("fabric"),
            occasion=analysis.get("occasion"),
        )
        
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"Error in image analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze image: {str(e)}")

@app.post("/similar-products", response_model=SimilarProductsResponse)
async def similar_products_endpoint(request: SimilarProductsRequest):
    """
    POST /similar-products
    Provides budget-filtered product recommendations based on search attributes.
    """
    try:
        # Normalize gender to exact DB values
        g_lower = request.gender.lower()
        if "women" in g_lower:
            gender = "Women's Fashion"
        elif "men" in g_lower:
            gender = "Men's Fashion"
        else:
            gender = "Women's Fashion"

        # Normalize category from detected_item if provided
        CATEGORY_ALIASES = {
            "kurta": "Ethnic Wear", "kurti": "Ethnic Wear", "ethnic": "Ethnic Wear",
            "saree": "Ethnic Wear", "lehenga": "Ethnic Wear", "salwar": "Ethnic Wear",
            "anarkali": "Ethnic Wear",
            "shirt": "Topwear", "t-shirt": "Topwear", "tshirt": "Topwear",
            "top": "Topwear", "blouse": "Topwear", "hoodie": "Topwear",
            "jacket": "Topwear", "sweater": "Topwear", "polo": "Topwear",
            "jeans": "Bottomwear", "pants": "Bottomwear", "trousers": "Bottomwear",
            "chinos": "Bottomwear", "cargo": "Bottomwear", "leggings": "Bottomwear",
            "joggers": "Bottomwear", "palazzo": "Bottomwear", "skirt": "Bottomwear",
            "shorts": "Bottomwear",
            "shoes": "Footwear", "sneakers": "Footwear", "sandals": "Footwear",
            "heels": "Footwear", "boots": "Footwear", "loafers": "Footwear",
            "watch": "Accessories", "bag": "Accessories", "handbag": "Accessories",
            "sunglasses": "Accessories", "belt": "Accessories", "jewellery": "Accessories",
            "wallet": "Accessories",
            "dress": "Dresses", "gown": "Dresses", "frock": "Dresses",
            "jumpsuit": "Dresses", "co-ord set": "Dresses", "co-ord": "Dresses",
            "coord set": "Dresses", "coord": "Dresses", "kaftan": "Dresses",
            "maxi dress": "Dresses", "midi dress": "Dresses", "mini dress": "Dresses",
        }
        category = request.category
        garment_type = request.detected_item
        if request.detected_item:
            item_lower = request.detected_item.lower()
            for key, cat in CATEGORY_ALIASES.items():
                if key in item_lower:
                    category = cat
                    break

        raw_matches = find_similar_products(
            gender=gender,
            category=category,
            detected_item=request.detected_item,
            colors=request.colors,
            style=request.style,
            budget=request.budget,
            garment_type=garment_type
        )
        
        matches = [
            ProductMatch(
                id=item["id"],
                name=item["name"],
                price=item["price"],
                store=item["store"],
                image_url=item["image_url"],
                product_url=item["product_url"],
                similarity=item["similarity"]
            )
            for item in raw_matches
        ]
        
        message = None if matches else "Unable to find highly similar products."
        return SimilarProductsResponse(matches=matches, message=message)
    except Exception as e:
        print(f"Error in similar products: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch similar products.")

@app.post("/color-palette")
async def color_palette_endpoint(request: dict):
    try:
        color = request.get("color", "Black")
        gender = request.get("gender", "Women's Fashion")
        result = get_color_palette(color, gender)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate color palette: {str(e)}")


async def recommend_outfit_endpoint(request: OutfitRequest):
    """
    POST /recommend-outfit
    Returns 3 style suggestions fitting occasion, preferences and budget limits.
    """
    if request.budget <= 0:
        raise HTTPException(status_code=400, detail="Budget must be greater than 0.")
        
    try:
        outfits_raw = generate_outfit_recommendations(
            gender=request.gender,
            occasion=request.occasion,
            budget=request.budget,
            style_preference=request.style_preference
        )
        return OutfitResponse(outfits=outfits_raw)
    except Exception as e:
        print(f"Error in outfit recommendations: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate outfit styles.")

@app.post("/fashion-trends", response_model=TrendsResponse)
@app.get("/fashion-trends", response_model=TrendsResponse)
async def fashion_trends_endpoint():
    """
    POST/GET /fashion-trends
    Retrieves global color and styling trends.
    """
    try:
        trends = get_fashion_trends()
        return TrendsResponse(**trends)
    except Exception as e:
        print(f"Error in trends endpoint: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve fashion trends.")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
