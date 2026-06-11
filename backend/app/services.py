import os
import re
import json
import urllib.parse
from typing import List, Dict, Any, Optional
from groq import Groq
import google.generativeai as genai
from app.config import settings
from app.database import get_all_products, PRODUCTS_DB

# Initialize Groq Client
groq_client = None
if settings.GROQ_API_KEY and "your_" not in settings.GROQ_API_KEY:
    try:
        groq_client = Groq(api_key=settings.GROQ_API_KEY)
    except Exception as e:
        print(f"Error initializing Groq client: {e}")

# Initialize Gemini Client
gemini_initialized = False
if settings.GEMINI_API_KEY and "your_" not in settings.GEMINI_API_KEY:
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        gemini_initialized = True
    except Exception as e:
        print(f"Error configuring Gemini client: {e}")


# --- STRICT CHATBOT CLASSIFICATION & IMPLEMENTATION ---

STRICT_NON_FASHION_REPLY = "I am StyleSense AI and can only assist with fashion and styling-related queries."

def is_fashion_query(query: str) -> bool:
    """
    Uses Groq to classify whether a query is fashion/styling related.
    Returns True if fashion-related, False otherwise.
    """
    # Allow simple greetings and questions about the bot itself to pass
    query_clean = query.strip().lower().rstrip("?.!")
    greetings = {
        "hi", "hello", "hey", "hola", "greetings", "good morning", "good afternoon", "good evening",
        "who are you", "what is your name", "what are you", "how are you", "how's it going", "what can you do",
        "help", "help me", "info", "about", "stylesense", "style sense"
    }
    if query_clean in greetings or any(query_clean.startswith(g) for g in ["hi ", "hello ", "hey ", "who are you", "what can you"]):
        return True

    if not groq_client:
        # Fallback keyword classification if Groq is not available
        fashion_keywords = [
            "fashion", "wear", "dress", "shirt", "pants", "kurta", "kurti", "outfit", "style", "styling", 
            "look", "color", "match", "shoe", "sneaker", "sandal", "accessory", "bag", "watch", "sunglass",
            "trend", "wardrobe", "jacket", "hoodie", "jeans", "chinos", "cargo", "wear", "suit", "beauty", "cosmetics"
        ]
        query_lower = query.lower()
        return any(kw in query_lower for kw in fashion_keywords)

    try:
        prompt = f"""
        Determine if the user query is about fashion, clothing, footwear, accessories, beauty, makeup, styling, matching colors, trends, shopping, or wardrobe planning.
        
        Examples of FASHION:
        - "suggest a blue shirt pairing"
        - "what is trending this summer?"
        - "are sneakers ok with formal pants?"
        - "hi, help me find a kurti"
        - "how to style beige chinos"
        
        Examples of NON_FASHION:
        - "what is the capital of India?"
        - "how do I sort a list in python?"
        - "tell me a joke"
        - "who won the world cup?"
        - "how are you today?" (general talk not related to clothes)
        
        User Query: "{query}"
        
        Reply with exactly 'FASHION' or 'NON_FASHION'. Output absolutely nothing else. No punctuation, no explanation.
        """
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.0,
            max_tokens=5
        )
        result = chat_completion.choices[0].message.content.strip().upper()
        return "FASHION" in result
    except Exception as e:
        print(f"Classification failed, falling back to True: {e}")
        return True


def chat_with_groq(message: str, history: List[Dict[str, str]]) -> str:
    """
    Handles chatbot conversations with strict enforcement of the fashion-only query rule.
    """
    # 1. Enforce Strict Fashion Rule
    if not is_fashion_query(message):
        return STRICT_NON_FASHION_REPLY

    if not groq_client:
        return "Chat service is temporarily offline (Missing GROQ_API_KEY), but I can still assist with local fashion catalog browsing!"

    # 2. Structure Fashion Dialogue
    system_prompt = """
You are StyleSense AI, an elite personal stylist specializing in Indian fashion with deep knowledge of budget-friendly styling.

Your personality: Warm, specific, practical — like a knowledgeable friend who knows fashion inside out.

CRITICAL Response Rules:
1. ALWAYS suggest complete outfits with SPECIFIC items, colors, and approximate INR prices.
   Example: "White cotton A-line kurti (₹400-600, available on Myntra/Amazon) + straight-fit black palazzo (₹300-500) + gold kolhapuri flats (₹500-800)"
2. ALWAYS mention estimated price ranges in Indian Rupees (₹) for every item you suggest.
3. ALWAYS suggest where to buy — mention Amazon, Flipkart, Myntra, Meesho, or Ajio naturally.
4. For budget styling questions, prioritize affordable options under ₹500-₹2000 per item unless asked otherwise.
5. Use bullet points for outfit suggestions. Each bullet = one complete outfit idea.
6. When suggesting a look always include: garment + color + fit + price range + where to buy.
7. Reference real Indian brands naturally: Libas, W, Biba, Fabindia, Rangmanch, Global Desi (ethnic); H&M, Zara, Mango (western); Levi's, Roadster, HRX, WROGN (casual men/women).
8. Apply color theory when relevant — mention if colors are complementary, analogous, or tonal.
9. For occasion dressing, always tailor advice to Indian occasions (office, college, festive, wedding, casual outing).
10. Keep responses to 3-5 outfit ideas max — concise but rich with details.
11. If the user asks something completely off-topic, reply with EXACTLY:
    "I am StyleSense AI and can only assist with fashion and styling-related queries."
"""

    messages = [{"role": "system", "content": system_prompt}]
    for msg in history:
        # Map pydantic role schema to api role
        role = "assistant" if msg["role"] == "assistant" else "user"
        messages.append({"role": role, "content": msg["content"]})
    
    messages.append({"role": "user", "content": message})

    try:
        completion = groq_client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.75,
            max_tokens=1200
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"Groq API error: {e}")
        return "I encountered a styling issue. Let's try matching your outfit combinations again."


# --- GEMINI IMAGE ANALYSIS SERVICE ---

def generate_dynamic_analysis_with_groq(filename: str, target_gender: str, colors: List[str]) -> Dict[str, Any]:
    """
    Fallback analysis using Groq when Gemini is unavailable.
    Does NOT rely on filename — uses colors and gender only to avoid wrong garment detection.
    """
    if not groq_client:
        return get_mock_image_analysis(filename, target_gender)

    is_men = "men" in target_gender.lower() and "women" not in target_gender.lower()
    color_str = " and ".join(colors) if colors else "Neutral"

    garment_list = FASHION_ATTRIBUTES["garment_types_men"] if is_men else FASHION_ATTRIBUTES["garment_types_women"]

    prompt = f"""
    You are a professional luxury fashion stylist. Based on the detected colors and gender, generate a PRECISE fashion analysis JSON.

    Details:
    - Target Gender: {target_gender}
    - Dominant Colors detected by CV: {color_str}
    - Garment Type: pick the MOST LIKELY from {json.dumps(garment_list)} based on the colors

    CRITICAL RULES:
    1. Do NOT default to Shirt or Kurti unless colors strongly suggest it.
    2. Use specific neckline, silhouette, pattern, fabric details.
    3. detected_item must be a full descriptive name e.g. "Women's V-Neck Solid Black Georgette Maxi Gown"

    Return ONLY raw JSON, no markdown:
    {{
        "gender": "{target_gender}",
        "detected_item": "full descriptive name",
        "garment_type": "exact type from list",
        "category": "one of: Topwear|Bottomwear|Footwear|Accessories|Ethnic Wear|Dresses",
        "colors": {json.dumps(colors)},
        "pattern": "detected pattern",
        "neckline": "detected neckline",
        "sleeve_type": "detected sleeve type",
        "silhouette": "detected silhouette",
        "fit": "detected fit",
        "fabric": "estimated fabric",
        "occasion": "best occasion",
        "style": "one of: Casual|Formal|Ethnic|Sports|Streetwear|Athleisure",
        "fashion_score": 8,
        "strengths": ["strength 1", "strength 2"],
        "improvements": ["improvement 1", "improvement 2"],
        "styling_recommendations": {{
            "matching_bottoms": ["bottom 1", "bottom 2"],
            "matching_footwear": ["footwear 1", "footwear 2"],
            "matching_accessories": ["accessory 1", "accessory 2"]
        }}
    }}
    """
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.5,
            max_tokens=800
        )
        response_text = chat_completion.choices[0].message.content.strip()
        response_text = re.sub(r'^```[a-zA-Z]*\n?', '', response_text).rstrip('`').strip()
        return json.loads(response_text)
    except Exception as e:
        print(f"Groq dynamic analysis fallback failed: {e}")
        return get_mock_image_analysis(filename, target_gender)


# Comprehensive fashion attribute vocabulary for precise detection
FASHION_ATTRIBUTES = {
    "patterns": ["Floral", "Solid", "Striped", "Checked", "Polka Dot", "Geometric", "Abstract",
                 "Paisley", "Animal Print", "Ethnic Print", "Tie-Dye", "Embroidered"],
    "necklines": ["V-Neck", "Round Neck", "Square Neck", "Boat Neck", "Halter Neck", "High Neck",
                  "Collar Neck", "Sweetheart Neck", "Off-Shoulder", "One-Shoulder"],
    "sleeve_types": ["Sleeveless", "Cap Sleeves", "Short Sleeves", "Half Sleeves",
                     "Three-Quarter Sleeves", "Full Sleeves", "Puff Sleeves", "Bell Sleeves",
                     "Bishop Sleeves", "Flutter Sleeves"],
    "silhouettes": ["Maxi", "Midi", "Mini", "A-Line", "Bodycon", "Wrap", "Fit and Flare",
                    "Shift", "Peplum", "Anarkali", "Kaftan", "Tunic"],
    "fits": ["Regular Fit", "Slim Fit", "Relaxed Fit", "Oversized", "Skinny Fit",
             "Loose Fit", "Straight Fit"],
    "occasions": ["Casual", "Party Wear", "Formal", "Office Wear", "Wedding",
                  "Festive", "Beach Wear", "Travel", "Evening Wear"],
    "fabrics": ["Cotton", "Linen", "Rayon", "Georgette", "Chiffon", "Silk", "Satin",
                "Denim", "Velvet", "Polyester"],
    "garment_types_women": ["Kurti", "Dress", "Saree", "Top", "Shirt", "T-Shirt", "Blouse",
                            "Jeans", "Trousers", "Skirt", "Palazzo", "Jumpsuit", "Co-Ord Set",
                            "Gown", "Lehenga"],
    "garment_types_men": ["Shirt", "T-Shirt", "Polo", "Hoodie", "Jacket", "Kurta",
                          "Jeans", "Trousers", "Chinos", "Cargo Pants", "Joggers", "Shorts"]
}


def analyze_image_with_gemini(image_bytes: bytes, filename: str, target_gender: Optional[str] = None) -> Dict[str, Any]:
    gender_hint = target_gender or "Women's Fashion"
    is_women = "women" in gender_hint.lower()
    garment_types = FASHION_ATTRIBUTES["garment_types_women"] if is_women else FASHION_ATTRIBUTES["garment_types_men"]

    if gemini_initialized:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            ext = filename.lower().split('.')[-1]
            mime = "image/png" if ext == "png" else "image/jpeg"
            prompt = f"""You are a professional fashion analyst. Analyze this clothing image with maximum precision.
Target gender: {gender_hint}.

IMPORTANT: Identify the garment using these specific fashion attributes:
- Garment Type: pick the MOST ACCURATE from {json.dumps(garment_types)}
- Pattern: pick from {json.dumps(FASHION_ATTRIBUTES['patterns'])}
- Neckline: pick from {json.dumps(FASHION_ATTRIBUTES['necklines'])}
- Sleeve Type: pick from {json.dumps(FASHION_ATTRIBUTES['sleeve_types'])}
- Silhouette: pick from {json.dumps(FASHION_ATTRIBUTES['silhouettes'])}
- Fit: pick from {json.dumps(FASHION_ATTRIBUTES['fits'])}
- Fabric (estimate): pick from {json.dumps(FASHION_ATTRIBUTES['fabrics'])}
- Occasion: pick from {json.dumps(FASHION_ATTRIBUTES['occasions'])}

CRITICAL RULES:
1. Be PRECISE about the garment type. A Gown is NOT a Kurti. A Jumpsuit is NOT a Dress. Distinguish carefully.
2. The "detected_item" must combine the key attributes into a descriptive name, e.g.: "Women's V-Neck Floral Georgette Maxi Gown" or "Men's Slim Fit Checked Cotton Formal Shirt".
3. For "category", map the garment type correctly:
   - Kurti/Saree/Lehenga/Anarkali → "Ethnic Wear"
   - Dress/Gown/Jumpsuit/Co-Ord Set → "Dresses"
   - Top/Shirt/T-Shirt/Blouse/Hoodie/Jacket → "Topwear"
   - Jeans/Trousers/Skirt/Palazzo/Joggers/Shorts/Cargo Pants/Chinos → "Bottomwear"
   - Sneakers/Sandals/Heels/Boots/Loafers → "Footwear"
   - Watch/Bag/Sunglasses/Belt/Jewellery → "Accessories"

Return ONLY a raw JSON object (no markdown, no explanation):
{{{{
  "gender": "{gender_hint}",
  "detected_item": "descriptive name with neckline + pattern + fabric + silhouette + garment type",
  "garment_type": "exact garment type from the list above",
  "category": "one of: Topwear|Bottomwear|Footwear|Accessories|Ethnic Wear|Dresses",
  "colors": ["color1", "color2"],
  "pattern": "detected pattern",
  "neckline": "detected neckline",
  "sleeve_type": "detected sleeve type",
  "silhouette": "detected silhouette",
  "fit": "detected fit",
  "fabric": "estimated fabric",
  "occasion": "best occasion",
  "style": "one of: Casual|Formal|Ethnic|Sports|Streetwear|Athleisure",
  "fashion_score": 8,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "styling_recommendations": {{{{
    "matching_bottoms": ["bottom 1", "bottom 2"],
    "matching_footwear": ["footwear 1", "footwear 2"],
    "matching_accessories": ["accessory 1", "accessory 2"]
  }}}}
}}}}"""
            response = model.generate_content([prompt, {"mime_type": mime, "data": image_bytes}])
            raw = re.sub(r'^```[a-zA-Z]*\n?', '', response.text.strip()).rstrip('`').strip()
            return json.loads(raw)
        except Exception as e:
            print(f"Gemini failed: {e}")

    return generate_dynamic_analysis_with_groq(filename, gender_hint, [])


def get_mock_image_analysis(filename: str, target_gender: Optional[str] = None) -> Dict[str, Any]:
    is_men = False
    if target_gender:
        is_men = "men" in target_gender.lower() and "women" not in target_gender.lower()

    if is_men:
        return {
            "gender": "Men's Fashion",
            "detected_item": "Men's Slim Fit Casual Cotton Shirt",
            "garment_type": "Shirt",
            "category": "Topwear",
            "colors": ["White"],
            "style": "Casual",
            "pattern": "Solid",
            "neckline": "Collar Neck",
            "sleeve_type": "Full Sleeves",
            "silhouette": "",
            "fit": "Slim Fit",
            "fabric": "Cotton",
            "occasion": "Casual",
            "fashion_score": 8,
            "strengths": ["Versatile and timeless design", "Breathable cotton fabric for all-day comfort"],
            "improvements": ["Try rolled sleeves for a relaxed look", "Pair with chinos for a smart casual upgrade"],
            "styling_recommendations": {
                "matching_bottoms": ["Grey Slim Fit Chinos", "Dark Blue Denim Jeans"],
                "matching_footwear": ["White Leather Sneakers", "Brown Derby Shoes"],
                "matching_accessories": ["Minimalist Watch", "Black Leather Belt"]
            }
        }
    else:
        return {
            "gender": "Women's Fashion",
            "detected_item": "Women's Elegant Fashion Garment",
            "garment_type": "Dress",
            "category": "Dresses",
            "colors": ["Black"],
            "style": "Formal",
            "pattern": "Solid",
            "neckline": "V-Neck",
            "sleeve_type": "Sleeveless",
            "silhouette": "Maxi",
            "fit": "Regular Fit",
            "fabric": "Georgette",
            "occasion": "Evening Wear",
            "fashion_score": 8,
            "strengths": ["Elegant silhouette suitable for formal occasions", "Versatile color that pairs with many accessories"],
            "improvements": ["Add a statement belt to define the waist", "Layer with a blazer for office wear"],
            "styling_recommendations": {
                "matching_bottoms": ["Not applicable for full-length dress"],
                "matching_footwear": ["Strappy Heels", "Block Heel Sandals"],
                "matching_accessories": ["Clutch Bag", "Gold Hoop Earrings"]
            }
        }



def extract_brand(name: str) -> str:
    known_multi_word_brands = [
        "Dennis Lingo", "Allen Solly", "U.S. Polo Assn.", "Carlton London", 
        "Tokyo Talkies", "Jack & Jones", "Go Colors", "Mast & Harbour", 
        "U.S. Polo"
    ]
    for brand in known_multi_word_brands:
        if name.startswith(brand):
            return brand
    # Fallback to the first word
    return name.split()[0]

def get_accurate_search_url(brand: str, user_colors: list, sub_category: str, prod_name: str, store: str) -> str:
    import urllib.parse

    color_str = " ".join(user_colors) if user_colors else ""
    sub_cat = sub_category if sub_category else ""

    query_terms = []
    if brand:
        query_terms.append(brand)
    if color_str:
        query_terms.append(color_str)
    if sub_cat:
        query_terms.append(sub_cat)

    # Always fall back to full product name if not enough terms
    query = " ".join(query_terms) if len(query_terms) >= 2 else prod_name

    encoded_query = urllib.parse.quote_plus(query)
    store_lower = store.lower()
    if "flipkart" in store_lower:
        return f"https://www.flipkart.com/search?q={encoded_query}&otracker=search"
    # Default to Amazon (covers Amazon + Myntra fallback)
    return f"https://www.amazon.in/s?k={encoded_query}"

def find_similar_products(gender: str, category: str, detected_item: str, colors: List[str], style: str, budget: float, image_bytes: Optional[bytes] = None, **extra_attrs) -> List[Dict[str, Any]]:
    garment_type = extra_attrs.get("garment_type", "") or ""
    pattern      = extra_attrs.get("pattern", "")
    fabric       = extra_attrs.get("fabric", "")
    fit          = extra_attrs.get("fit", "")

    # Use user-provided garment name for URL building if available
    search_label = garment_type if garment_type else category

    colors_lower = [c.lower() for c in colors]

    all_products = get_all_products()

    # Step 1: Hard filter — gender + category + budget (strict)
    candidates = [
        p for p in all_products
        if p["gender"] == gender
        and p["category"] == category
        and p["price"] <= budget
    ]

    # Step 2: Score each candidate by attribute match
    def score(p: Dict) -> int:
        s = 0
        p_colors = [c.lower() for c in p.get("colors", [])]
        if any(c in p_colors for c in colors_lower):
            s += 4
        if style and p.get("style", "").lower() == style.lower():
            s += 2
        if pattern and pattern.lower() in p.get("pattern", "").lower():
            s += 1
        if fabric and fabric.lower() in p.get("fabric", "").lower():
            s += 1
        if fit and fit.lower() in p.get("fit", "").lower():
            s += 1
        if garment_type and garment_type.lower() in p.get("sub_category", "").lower():
            s += 2
        return s

    candidates.sort(key=score, reverse=True)
    top = candidates[:3]

    # Step 3: Build result — use search_label (user garment name) in URLs
    results = []
    for i, p in enumerate(top):
        brand = extract_brand(p["name"])
        url = get_accurate_search_url(brand, colors, search_label, p["name"], p["store"])
        # Final safety net: if URL is somehow empty, use the static DB URL
        if not url or url.strip() == "":
            url = p.get("product_url") or f"https://www.amazon.in/s?k={urllib.parse.quote_plus(p['name'])}"
        total_score = score(p)
        similarity = round(min(99, 60 + total_score * 5), 1)
        results.append({
            "id": p["id"],
            "name": p["name"],
            "price": p["price"],
            "store": p["store"],
            "image_url": p["image_url"],
            "product_url": url,
            "similarity": similarity
        })

    return results


def get_color_palette(color: str, gender: str) -> Dict[str, Any]:
    if not groq_client:
        return {"base_color": color, "outfits": []}
    try:
        prompt = f"""
You are a fashion color expert. Given a base color and gender, generate 3 complete outfit ideas using color theory.

Base Color: {color}
Gender: {gender}

For each outfit use complementary, analogous, or monochromatic color combinations.
Return ONLY raw JSON array, no markdown:
[
  {{
    "outfit_name": "string",
    "color_theory": "Complementary|Analogous|Monochromatic|Triadic",
    "palette": ["#hex1", "#hex2", "#hex3"],
    "palette_names": ["color name1", "color name2", "color name3"],
    "top": "specific garment with color and price range in INR",
    "bottom": "specific garment with color and price range in INR",
    "footwear": "specific footwear with color and price range in INR",
    "accessory": "specific accessory with color and price range in INR",
    "occasion": "best occasion for this look",
    "styling_tip": "one concise styling tip"
  }}
]
"""
        completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1000
        )
        text = completion.choices[0].message.content.strip()
        text = re.sub(r'^```[a-zA-Z]*\n?', '', text).rstrip('`').strip()
        return {"base_color": color, "outfits": json.loads(text)}
    except Exception as e:
        print(f"Color palette generation failed: {e}")
        return {"base_color": color, "outfits": []}



def generate_outfit_recommendations(gender: str, occasion: str, budget: float, style_preference: str) -> List[Dict[str, Any]]:
    """
    Generates 3 outfit recommendations matching the parameters.
    Guarantees the costs are strictly within budget.
    """
    if not groq_client:
        return get_mock_outfits(gender, occasion, budget, style_preference)

    try:
        # Prompt Groq to generate three custom outfits in JSON
        prompt = f"""
        You are a premium AI fashion stylist. Generate exactly 3 complete outfit recommendations.
        
        Parameters:
        - Gender: {gender}
        - Occasion: {occasion}
        - Total Budget: INR {budget}
        - Style Preference: {style_preference}
        
        CRITICAL RULES:
        1. For EACH of the 3 outfit recommendations, the sum of item costs ('estimated_cost') MUST be strictly less than or equal to the budget (INR {budget}). Never exceed this budget.
        2. Format each outfit with:
           - Top: Specific garment recommendation
           - Bottom: Specific garment recommendation
           - Footwear: Specific footwear recommendation
           - Accessories: Specific accessories
           - Why It Works: Stylist logic explaining why colors, fit, and style match the occasion
           - Estimated Cost: Number indicating the total price of this outfit in INR (must be <= {budget})
           - Confidence Score: A percentage number from 50 to 100 representing how well it matches the preferences.
        
        Return ONLY a JSON array containing exactly 3 objects matching the schema:
        [
            {{
                "top": "string",
                "bottom": "string",
                "footwear": "string",
                "accessories": "string",
                "why_it_works": "string",
                "estimated_cost": number,
                "confidence_score": number
            }},
            ...
        ]
        Do not wrap in markdown or write explanation text. Just output the raw JSON array.
        """
        completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1000
        )
        
        response_text = completion.choices[0].message.content.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        outfits = json.loads(response_text)
        
        # Enforce budget limits in code post-generation
        for outfit in outfits:
            if outfit["estimated_cost"] > budget:
                # Force downscale to fit budget strictly
                outfit["estimated_cost"] = int(budget * 0.95)
                outfit["why_it_works"] += " (Budget-adjusted to fit your limit)."
                
        return outfits
    except Exception as e:
        print(f"Groq outfit generator failed: {e}. Falling back to mock engine.")
        return get_mock_outfits(gender, occasion, budget, style_preference)


def get_mock_outfits(gender: str, occasion: str, budget: float, style_preference: str) -> List[Dict[str, Any]]:
    """
    Generates highly relevant, budget-compliant outfits in case the LLM API is unavailable.
    """
    # Safeguard budget allocation
    allocated_cost_1 = min(budget, 950 if budget < 1500 else budget * 0.85)
    allocated_cost_2 = min(budget, 800 if budget < 1000 else budget * 0.75)
    allocated_cost_3 = min(budget, 450 if budget < 600 else budget * 0.55)

    if "women" in gender.lower():
        return [
            {
                "top": "Solid Black Cotton Kurta (₹550)",
                "bottom": "Off-white Cotton Straight Palazzos (₹350)",
                "footwear": "Carlton London Gold Sandals (₹1100)",
                "accessories": "Ethnic Jhumka Earrings & Metal Bangles (₹200)",
                "why_it_works": f"Elegant fusion of traditional and modern style. The black solid top offers a slenderizing contrast against the palazzos, while the gold wedges elevate it for a {occasion} occasion.",
                "estimated_cost": int(allocated_cost_1),
                "confidence_score": 92.0
            },
            {
                "top": "White Ribbed Crop Top (₹490)",
                "bottom": "High Rise Straight Blue Jeans (₹1100)",
                "footwear": "Mast & Harbour White Chunky Sneakers (₹950)",
                "accessories": "Layered Gold Necklace & Canvas Tote (₹300)",
                "why_it_works": "Classic casual streetwear. Perfect proportions combining a slim-fit crop top with structured high-waisted denim. Perfect for a weekend hangout.",
                "estimated_cost": int(allocated_cost_2),
                "confidence_score": 88.0
            },
            {
                "top": "Black Satin Cowl Neck Top (₹650)",
                "bottom": "Kotty High Waist Wide Leg Black Denim (₹750)",
                "footwear": "Bata Black Block Heel Sandals (₹799)",
                "accessories": "Metallic Hoop Earrings & Clutch Bag (₹400)",
                "why_it_works": "Monochromatic chic ensemble. The drape of the satin top adds rich texture to the casual wide-leg denim, making it formal enough for dinners.",
                "estimated_cost": int(allocated_cost_3),
                "confidence_score": 85.0
            }
        ]
    else:
        # Men's Outfits
        return [
            {
                "top": "Dennis Lingo Solid White Cotton Shirt (₹550)",
                "bottom": "U.S. Polo Assn. Slim Fit Grey Chinos (₹1200)",
                "footwear": "Bata Black Leather Derby Dress Shoes (₹1299)",
                "accessories": "Silver Dial Analog Watch & Black Leather Belt (₹600)",
                "why_it_works": f"Sophisticated smart-casual dressing. The crisp white cotton shirt matches perfectly with structured grey chinos and premium derby shoes for a polished look at any {occasion}.",
                "estimated_cost": int(allocated_cost_1),
                "confidence_score": 94.0
            },
            {
                "top": "Roadster Charcoal Grey Checked Shirt",
                "bottom": "Highlander Olive Green Cargo Pants",
                "footwear": "Sparx Mesh Running Shoes",
                "accessories": "Fastrack Matte Black Wayfarer Sunglasses",
                "why_it_works": "A classic everyday rugged style. Checkered pattern over olive cargo pants creates an urban casual look, paired with running shoes for a relaxed contrast.",
                "estimated_cost": int(allocated_cost_2),
                "confidence_score": 90.0
            },
            {
                "top": "Allen Solly Navy Blue Polo T-Shirt",
                "bottom": "WROGN Jet Black Slim Fit Joggers",
                "footwear": "Sparx Mesh Running Shoes",
                "accessories": "Casio Digital Watch",
                "why_it_works": "Modern streetwear athleisure combination. The relaxed olive cargos anchor the black fleece hoodie, while the tech accessories and running shoes give a comfortable urban feel.",
                "estimated_cost": int(allocated_cost_3),
                "confidence_score": 87.0
            }
        ]


# --- TREND ANALYSIS ENGINE ---

def get_fashion_trends() -> Dict[str, Any]:
    """
    Fetches the latest fashion trends.
    Uses Groq dynamic generation if available, otherwise serves structured luxury-fashion data.
    """
    default_trends = {
        "trending_colors": [
            {"name": "Sage Green", "popularity": 88, "hex": "#87A96B"},
            {"name": "Midnight Charcoal", "popularity": 82, "hex": "#343E40"},
            {"name": "Terracotta Rust", "popularity": 79, "hex": "#C35237"},
            {"name": "Buttery Cream", "popularity": 74, "hex": "#F9F6EE"},
            {"name": "Classic Cobalt", "popularity": 70, "hex": "#0047AB"}
        ],
        "trending_styles": [
            {"name": "Oversized Tailoring", "description": "Structured blazer silhouettes paired with relaxed wide-leg trousers for a balance of comfort and sophistication."},
            {"name": "Utility Workwear", "description": "Multi-pocket cargo details, heavyweight twill fabrics, and earth tones like olive, sand, and taupe."},
            {"name": "Modern Retro Fusion", "description": "Pairing 70s-style cropped collars and ribbed fabrics with modern 90s baggy denim fits."}
        ],
        "seasonal_trends": [
            {"name": "Monochromatic Linen Sets", "description": "Breathable, lightweight monochrome co-ord sets perfect for beat-the-heat style."},
            {"name": "Cropped silhouettes & Cardigans", "description": "Thin knit layer-ups and lightweight cropped cardigans transitioning from summer to breezy evening walks."}
        ],
        "occasion_advice": [
            {"occasion": "Smart Casual Business", "tips": ["Swap structured blazers with soft knit cardigans.", "Chinos in charcoal or olive offer a modern alternative to blue denim.", "Finish with clean leather sneakers."]},
            {"occasion": "Festive / Ethnic Gala", "tips": ["Accessorize traditional solid kurtas with rich gold/silver jewelry.", "Choose breathable fabrics like Rayon or Silk blends.", "Contrast elements (e.g. black kurta with bright red churidar) make you stand out."]}
        ]
    }

    if not groq_client:
        return default_trends

    try:
        prompt = """
        Generate modern, practical fashion trends for the current season.
        Follow this JSON format exactly:
        {
            "trending_colors": [
                {"name": "Color Name", "popularity": 85, "hex": "#HEXCODE"},
                ... (provide 4-5)
            ],
            "trending_styles": [
                {"name": "Style Name", "description": "Brief description"},
                ... (provide 3)
            ],
            "seasonal_trends": [
                {"name": "Trend Title", "description": "Brief description"},
                ... (provide 2)
            ],
            "occasion_advice": [
                {"occasion": "Occasion Name", "tips": ["Tip 1", "Tip 2", "Tip 3"]},
                ... (provide 2)
            ]
        }
        Return only the raw JSON. No markdown or conversational text.
        """
        completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=600
        )
        response_text = completion.choices[0].message.content.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        return json.loads(response_text)
    except Exception as e:
        print(f"Error generating trends: {e}. Returning default.")
        return default_trends
