from pydantic import BaseModel, Field
from typing import List, Optional, Dict

# Chat schemas
class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str

# Product Schema for responses
class ProductMatch(BaseModel):
    id: int
    name: str
    price: int
    store: str
    image_url: str
    product_url: str
    similarity: float

# Styling recommendation sub-schema
class StylingRecommendations(BaseModel):
    matching_bottoms: List[str]
    matching_footwear: List[str]
    matching_accessories: List[str]

# Image Analysis response schema
class ImageAnalysisResponse(BaseModel):
    gender: str # "Men's Fashion" or "Women's Fashion"
    detected_item: str
    category: str
    colors: List[str]
    style: str
    fashion_score: int
    strengths: List[str]
    improvements: List[str]
    shopping_matches: List[ProductMatch]
    styling_recommendations: StylingRecommendations
    # Detailed fashion attributes (optional — present when Gemini/Groq detects them)
    garment_type: Optional[str] = None
    pattern: Optional[str] = None
    neckline: Optional[str] = None
    sleeve_type: Optional[str] = None
    silhouette: Optional[str] = None
    fit: Optional[str] = None
    fabric: Optional[str] = None
    occasion: Optional[str] = None

# Similar products search schema
class SimilarProductsRequest(BaseModel):
    gender: str
    category: str
    detected_item: str
    colors: List[str]
    style: str
    budget: float

class SimilarProductsResponse(BaseModel):
    matches: List[ProductMatch]
    message: Optional[str] = None

# Outfit Recommendation schemas
class OutfitRequest(BaseModel):
    gender: str # "Men" or "Women" or "Unisex"
    occasion: str
    budget: float
    style_preference: str

class OutfitRecommendation(BaseModel):
    top: str
    bottom: str
    footwear: str
    accessories: str
    why_it_works: str
    estimated_cost: float
    confidence_score: float

class OutfitResponse(BaseModel):
    outfits: List[OutfitRecommendation]

# Fashion Trends schemas
class TrendColor(BaseModel):
    name: str
    popularity: int # percentage (e.g. 85)
    hex: str

class TrendStyle(BaseModel):
    name: str
    description: str

class SeasonalTrend(BaseModel):
    name: str
    description: str

class OccasionAdvice(BaseModel):
    occasion: str
    tips: List[str]

class TrendsResponse(BaseModel):
    trending_colors: List[TrendColor]
    trending_styles: List[TrendStyle]
    seasonal_trends: List[SeasonalTrend]
    occasion_advice: List[OccasionAdvice]
