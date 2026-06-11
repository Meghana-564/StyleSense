import os
from pymongo import MongoClient
from app.config import settings

# Seeded Fashion Catalog for Similarity & Budget Filtering
# Real-world styled products with actual store branding
PRODUCTS_DB = [
    # --- WOMEN'S ETHNIC & KURTAS ---
    {
        "id": 101,
        "name": "Anouk Women's Black & Gold Printed A-Line Kurti",
        "gender": "Women's Fashion",
        "category": "Ethnic Wear",
        "sub_category": "Kurti",
        "price": 899,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/s?k=Anouk+Women+Black+Gold+Kurti",
        "colors": ["Black", "Gold"],
        "style": "Ethnic",
        "pattern": "Printed",
        "fit": "A-Line",
        "fabric": "Rayon",
        "description": "Elegant black ethnic kurti with gold print pattern, a-line fit, suitable for festivals and casual wear."
    },
    {
        "id": 102,
        "name": "Libas Women's Solid Black Straight Kurta",
        "gender": "Women's Fashion",
        "category": "Ethnic Wear",
        "sub_category": "Kurti",
        "price": 649,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1608748010899-18f300247112?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/libas-women-solid-straight-kurta/p/itm12345",
        "colors": ["Black"],
        "style": "Ethnic",
        "pattern": "Solid",
        "fit": "Straight",
        "fabric": "Cotton",
        "description": "Plain black cotton straight kurta with long sleeves, lightweight and breathable daily wear."
    },
    {
        "id": 103,
        "name": "W Women's Floral Print A-Line ethnic Kurti",
        "gender": "Women's Fashion",
        "category": "Ethnic Wear",
        "sub_category": "Kurti",
        "price": 1499,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/search?q=W+Women+Floral+Kurti",
        "colors": ["Blue", "Pink", "White"],
        "style": "Ethnic",
        "pattern": "Floral",
        "fit": "A-Line",
        "fabric": "Crepe",
        "description": "Beautiful blue floral printed crepe A-line kurta. Stylish V-neck design."
    },
    {
        "id": 104,
        "name": "Biba Women's Red Printed Anarkali Kurta",
        "gender": "Women's Fashion",
        "category": "Ethnic Wear",
        "sub_category": "Kurti",
        "price": 2499,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/Biba-Womens-Anarkali-Kurta/dp/B08XYZ123",
        "colors": ["Red", "Gold"],
        "style": "Ethnic",
        "pattern": "Printed",
        "fit": "Anarkali",
        "fabric": "Silk",
        "description": "Premium red silk Anarkali kurta with gold embellishments and printed border, perfect for wedding ceremonies."
    },

    # --- MEN'S SHIRTS & TOPWEAR ---
    {
        "id": 201,
        "name": "Roadster Men's Charcoal Grey Checked Casual Shirt",
        "gender": "Men's Fashion",
        "category": "Topwear",
        "sub_category": "Shirt",
        "price": 799,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/s?k=Men+Grey+Checked+Casual+Shirt",
        "colors": ["Grey", "Black"],
        "style": "Casual",
        "pattern": "Checked",
        "fit": "Slim Fit",
        "fabric": "Cotton",
        "description": "Casual grey and black checked shirt with long sleeves, button placket, curved hem, and double patch pocket."
    },
    {
        "id": 202,
        "name": "Dennis Lingo Men's Solid Slim Fit Cotton Casual Shirt",
        "gender": "Men's Fashion",
        "category": "Topwear",
        "sub_category": "Shirt",
        "price": 549,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/Dennis-Lingo-Cotton-Casual-C-301/dp/B07K8J123",
        "colors": ["White"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Slim Fit",
        "fabric": "Cotton",
        "description": "Premium solid white 100% cotton slim fit shirt. Clean formal or smart casual look."
    },
    {
        "id": 203,
        "name": "Allen Solly Men's Solid Slim Fit Polo T-Shirt",
        "gender": "Men's Fashion",
        "category": "Topwear",
        "sub_category": "T-Shirt",
        "price": 899,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/search?q=Allen+Solly+Men+Polo+TShirt",
        "colors": ["Navy Blue", "Blue"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Slim Fit",
        "fabric": "Pique Cotton",
        "description": "Classic navy blue polo t-shirt with short sleeves and ribbed collar, perfect casual sportswear."
    },
    {
        "id": 204,
        "name": "Puma Men's Graphic Printed Black Hoodie",
        "gender": "Men's Fashion",
        "category": "Topwear",
        "sub_category": "Hoodie",
        "price": 1899,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/puma-men-printed-black-hoodie/p/itm78321",
        "colors": ["Black", "White"],
        "style": "Sports",
        "pattern": "Graphic",
        "fit": "Regular Fit",
        "fabric": "Fleece",
        "description": "Comfy black fleece hoodie with front kangaroo pocket and graphic Puma branding."
    },
    {
        "id": 205,
        "name": "Jack & Jones Men's Oversized Fit Crewneck T-Shirt",
        "gender": "Men's Fashion",
        "category": "Topwear",
        "sub_category": "T-Shirt",
        "price": 999,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop",
        "colors": ["Beige", "Sand"],
        "style": "Streetwear",
        "pattern": "Solid",
        "fit": "Oversized",
        "fabric": "Heavyweight Cotton",
        "description": "Drop shoulder oversized beige crewneck tee. Extremely comfortable and on-trend for casual streetwear.",
        "product_url": "https://www.amazon.in/s?k=Jack+Jones+Men+Oversized+Crewneck+TShirt"
    },

    # --- WOMEN'S DRESSES & GOWNS ---
    {
        "id": 301,
        "name": "Zara Women's Floral Printed Ruffled Dress",
        "gender": "Women's Fashion",
        "category": "Dresses",
        "sub_category": "Dress",
        "price": 2999,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/Zara-Womens-Floral-Ruffled-Dress/dp/B08ABC123",
        "colors": ["Red", "Floral", "White"],
        "style": "Casual",
        "pattern": "Floral",
        "fit": "Flared",
        "fabric": "Georgette",
        "description": "Beautiful red georgette dress with mini floral print, ruffled sleeves and flared hem."
    },
    {
        "id": 310,
        "name": "SASSAFRAS Women's V-Neck Solid Black Maxi Gown",
        "gender": "Women's Fashion",
        "category": "Dresses",
        "sub_category": "Gown",
        "price": 1799,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/s?k=Women+Black+Maxi+Gown",
        "colors": ["Black"],
        "style": "Formal",
        "pattern": "Solid",
        "fit": "A-Line",
        "fabric": "Georgette",
        "description": "Elegant V-neck black maxi gown with A-line silhouette, perfect for evening events and parties."
    },
    {
        "id": 311,
        "name": "StalkBuyLove Women's V-Neck Wine Red Bodycon Dress",
        "gender": "Women's Fashion",
        "category": "Dresses",
        "sub_category": "Dress",
        "price": 1299,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/stalkbuylove-women-wine-bodycon-dress/p/itm92817",
        "colors": ["Wine", "Red", "Maroon"],
        "style": "Formal",
        "pattern": "Solid",
        "fit": "Bodycon",
        "fabric": "Polyester",
        "description": "Fitted V-neck bodycon dress in wine red. Sleeveless midi length, perfect for cocktail parties."
    },
    {
        "id": 312,
        "name": "ASOS Women's Sweetheart Neck Emerald Green Satin Gown",
        "gender": "Women's Fashion",
        "category": "Dresses",
        "sub_category": "Gown",
        "price": 3499,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/ASOS-Womens-Emerald-Green-Gown/dp/B09XYZ456",
        "colors": ["Green", "Emerald"],
        "style": "Formal",
        "pattern": "Solid",
        "fit": "Fit and Flare",
        "fabric": "Satin",
        "description": "Stunning emerald green satin gown with sweetheart neckline and floor-length flare. Wedding and gala perfect."
    },
    {
        "id": 313,
        "name": "Berrylush Women's V-Neck Floral Wrap Midi Dress",
        "gender": "Women's Fashion",
        "category": "Dresses",
        "sub_category": "Dress",
        "price": 899,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/search?q=Women+Floral+Wrap+Midi+Dress",
        "colors": ["Blue", "White", "Floral"],
        "style": "Casual",
        "pattern": "Floral",
        "fit": "Wrap",
        "fabric": "Rayon",
        "description": "Blue and white floral wrap midi dress with V-neck and flutter sleeves. Perfect for brunch and day outings."
    },
    {
        "id": 314,
        "name": "Athena Women's Off-Shoulder Navy Blue Maxi Gown",
        "gender": "Women's Fashion",
        "category": "Dresses",
        "sub_category": "Gown",
        "price": 2199,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1583391733975-b6ae9f8d5ee1?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/athena-women-navy-blue-maxi-gown/p/itm71823",
        "colors": ["Navy Blue", "Blue"],
        "style": "Formal",
        "pattern": "Solid",
        "fit": "A-Line",
        "fabric": "Chiffon",
        "description": "Elegant navy blue chiffon maxi gown with off-shoulder neckline and flowing A-line silhouette."
    },
    {
        "id": 315,
        "name": "Harpa Women's Round Neck Black Fit and Flare Dress",
        "gender": "Women's Fashion",
        "category": "Dresses",
        "sub_category": "Dress",
        "price": 799,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/Harpa-Women-Black-Flare-Dress/dp/B07KLM789",
        "colors": ["Black"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Fit and Flare",
        "fabric": "Cotton",
        "description": "Classic black cotton fit-and-flare dress with round neck. Versatile for office or casual outings."
    },
    {
        "id": 316,
        "name": "Khushi Print Women's V-Neck Printed Rayon Jumpsuit",
        "gender": "Women's Fashion",
        "category": "Dresses",
        "sub_category": "Jumpsuit",
        "price": 999,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/s?k=Women+Printed+Rayon+Jumpsuit",
        "colors": ["Yellow", "Mustard"],
        "style": "Casual",
        "pattern": "Printed",
        "fit": "Regular Fit",
        "fabric": "Rayon",
        "description": "Vibrant mustard yellow printed rayon jumpsuit with V-neck and waist tie. Comfortable and trendy."
    },
    {
        "id": 317,
        "name": "Miss Chase Women's Halter Neck Pink Maxi Gown",
        "gender": "Women's Fashion",
        "category": "Dresses",
        "sub_category": "Gown",
        "price": 1599,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/miss-chase-women-pink-maxi-gown/p/itm63827",
        "colors": ["Pink", "Rose"],
        "style": "Formal",
        "pattern": "Solid",
        "fit": "A-Line",
        "fabric": "Georgette",
        "description": "Romantic pink georgette maxi gown with halter neck. Flowy silhouette ideal for weddings and events."
    },
    {
        "id": 318,
        "name": "Indya Women's V-Neck Ivory Embroidered Co-Ord Set",
        "gender": "Women's Fashion",
        "category": "Dresses",
        "sub_category": "Co-Ord Set",
        "price": 2499,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/search?q=Women+Ivory+Embroidered+Co-Ord+Set",
        "colors": ["White", "Ivory", "Cream"],
        "style": "Ethnic",
        "pattern": "Embroidered",
        "fit": "Relaxed Fit",
        "fabric": "Cotton",
        "description": "Premium ivory cotton co-ord set with delicate thread embroidery. V-neck top with matching palazzo."
    },
    {
        "id": 319,
        "name": "Femella Women's V-Neck White Chiffon Mini Shift Dress",
        "gender": "Women's Fashion",
        "category": "Dresses",
        "sub_category": "Dress",
        "price": 599,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1434389677669-e08b4cda3a20?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/Femella-Women-White-Shift-Dress/dp/B08NOP321",
        "colors": ["White"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Shift",
        "fabric": "Chiffon",
        "description": "Minimalist white chiffon shift dress with V-neck. Lightweight and breezy for summer and beach outings."
    },
    {
        "id": 302,
        "name": "H&M Women's Ribbed Crop Top",
        "gender": "Women's Fashion",
        "category": "Topwear",
        "sub_category": "Top",
        "price": 499,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/s?k=Women+Ribbed+Crop+Top",
        "colors": ["White", "Off-White"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Slim Fit",
        "fabric": "Ribbed Knit",
        "description": "Simple white ribbed knit crop top, sleeveless, highly stretchable and pairs great with denim."
    },
    {
        "id": 303,
        "name": "Tokyo Talkies Women's Black Satin Casual Top",
        "gender": "Women's Fashion",
        "category": "Topwear",
        "sub_category": "Top",
        "price": 699,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/tokyo-talkies-women-black-satin-top/p/itm38472",
        "colors": ["Black"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Regular Fit",
        "fabric": "Satin",
        "description": "Elegant solid black satin top with a cowl neck. Great for dinner dates or evening wear."
    },

    # --- MEN'S BOTTOMWEAR ---
    {
        "id": 401,
        "name": "Levis Men's 511 Slim Fit Blue Denim Jeans",
        "gender": "Men's Fashion",
        "category": "Bottomwear",
        "sub_category": "Jeans",
        "price": 2199,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/s?k=Levis+511+Men+Slim+Fit+Blue+Jeans",
        "colors": ["Blue", "Light Blue"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Slim Fit",
        "fabric": "Denim",
        "description": "Classic Levi's 511 slim fit denim jeans in light blue. Durable, slightly stretchable cotton denim."
    },
    {
        "id": 402,
        "name": "Highlander Men's Olive Green Cargo Pants",
        "gender": "Men's Fashion",
        "category": "Bottomwear",
        "sub_category": "Cargo Pants",
        "price": 999,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1517462964-21fdcec3f25b?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/highlander-men-olive-green-cargo/p/itm54321",
        "colors": ["Olive Green", "Green"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Regular Fit",
        "fabric": "Twill Cotton",
        "description": "Tough olive green cargo pants with 6 multi-utility pockets and comfortable elastic waist ties."
    },
    {
        "id": 403,
        "name": "U.S. Polo Assn. Men's Solid Grey Chinos",
        "gender": "Men's Fashion",
        "category": "Bottomwear",
        "sub_category": "Chinos",
        "price": 1499,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/search?q=US+Polo+Men+Grey+Chinos",
        "colors": ["Grey"],
        "style": "Smart Casual",
        "pattern": "Solid",
        "fit": "Slim Fit",
        "fabric": "Stretch Twill",
        "description": "Formal-looking grey chinos. Versatile color matching with black or white collared shirts."
    },
    {
        "id": 404,
        "name": "WROGN Men's Jet Black Joggers",
        "gender": "Men's Fashion",
        "category": "Bottomwear",
        "sub_category": "Joggers",
        "price": 1199,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/WROGN-Mens-Black-Joggers/dp/B08ST123",
        "colors": ["Black"],
        "style": "Athleisure",
        "pattern": "Solid",
        "fit": "Slim Fit",
        "fabric": "Cotton Blend",
        "description": "Tapered jet black joggers with cuffed ankles, side zipper pockets, ideal for gym or casual loungewear."
    },

    # --- WOMEN'S BOTTOMWEAR ---
    {
        "id": 501,
        "name": "Kraus Jeans Women's High Rise Blue Straight Jeans",
        "gender": "Women's Fashion",
        "category": "Bottomwear",
        "sub_category": "Jeans",
        "price": 1399,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/s?k=Women+High+Rise+Straight+Blue+Jeans",
        "colors": ["Blue"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Straight Fit",
        "fabric": "Denim",
        "description": "Classic high-rise straight fit jeans in rich dark indigo denim. Accents the waistline comfortably."
    },
    {
        "id": 502,
        "name": "Kotty Women's Wide Leg Black Jeans",
        "gender": "Women's Fashion",
        "category": "Bottomwear",
        "sub_category": "Jeans",
        "price": 749,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/kotty-women-wide-leg-black-jeans/p/itm92837",
        "colors": ["Black"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Wide Leg",
        "fabric": "Denim",
        "description": "Trendy high-rise wide-leg denim trousers in faded black. Vintage streetwear aesthetics."
    },
    {
        "id": 503,
        "name": "Go Colors Women's Cotton Black Leggings",
        "gender": "Women's Fashion",
        "category": "Bottomwear",
        "sub_category": "Leggings",
        "price": 499,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/Go-Colors-Womens-Leggings-Black/dp/B07XYZ123",
        "colors": ["Black"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Skinny",
        "fabric": "Cotton Lycra",
        "description": "Super soft and stretchable black cotton leggings, perfect for styling underneath Kurtas."
    },

    # --- MEN'S FOOTWEAR ---
    {
        "id": 601,
        "name": "Puma Men's White Smash L Sneakers",
        "gender": "Men's Fashion",
        "category": "Footwear",
        "sub_category": "Sneakers",
        "price": 2299,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/s?k=Puma+Men+White+Sneakers",
        "colors": ["White"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Regular",
        "fabric": "Leather",
        "description": "Aesthetic white leather sneakers with rubber cupsole, classic clean profile for smart-casual wear."
    },
    {
        "id": 602,
        "name": "Bata Men's Black Formal Leather Shoes",
        "gender": "Men's Fashion",
        "category": "Footwear",
        "sub_category": "Formal Shoes",
        "price": 1299,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1486308512493-ae6a6e903c49?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/Bata-Womens-Black-Derby-Formal/dp/B07ABC123",
        "colors": ["Black"],
        "style": "Formal",
        "pattern": "Solid",
        "fit": "Regular",
        "fabric": "Leather",
        "description": "Polished black derby dress shoes with classic laces, perfect for office, formal meetings, and parties."
    },
    {
        "id": 603,
        "name": "Sparx Men's Running Shoes (Grey & Black)",
        "gender": "Men's Fashion",
        "category": "Footwear",
        "sub_category": "Sneakers",
        "price": 849,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/sparx-men-grey-black-running-shoes/p/itm38210",
        "colors": ["Grey", "Black"],
        "style": "Sports",
        "pattern": "Textured",
        "fit": "Regular",
        "fabric": "Mesh",
        "description": "Breathable mesh running shoes with supportive sole cushioning. Great value for running or gym workouts."
    },

    # --- WOMEN'S FOOTWEAR ---
    {
        "id": 701,
        "name": "Carlton London Women's Metallic Gold Sandals",
        "gender": "Women's Fashion",
        "category": "Footwear",
        "sub_category": "Sandals",
        "price": 1099,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/s?k=Women+Metallic+Gold+Sandals",
        "colors": ["Gold", "Metallic"],
        "style": "Ethnic",
        "pattern": "Metallic",
        "fit": "Regular",
        "fabric": "Synthetic Leather",
        "description": "Elegant gold-toned wedge sandals with backstrap details, ideal for traditional wear and sarees."
    },
    {
        "id": 702,
        "name": "Mast & Harbour Women's Solid White Sneakers",
        "gender": "Women's Fashion",
        "category": "Footwear",
        "sub_category": "Sneakers",
        "price": 999,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/search?q=Women+White+Sneakers",
        "colors": ["White"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Regular",
        "fabric": "Synthetic Leather",
        "description": "Chic retro chunky white sneakers. Lightweight and coordinates with almost all styles."
    },
    {
        "id": 703,
        "name": "Bata Women's Block Heel Black Sandals",
        "gender": "Women's Fashion",
        "category": "Footwear",
        "sub_category": "Sandals",
        "price": 799,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/bata-women-block-heel-black-sandals/p/itm12938",
        "colors": ["Black"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Regular",
        "fabric": "Synthetic",
        "description": "Comfortable 2-inch block heels, perfect for business meetings or casual weekend wear."
    },

    # --- ACCESSORIES (UNISEX / GENDERED) ---
    {
        "id": 801,
        "name": "Fastrack Unisex Black Wayfarer Sunglasses",
        "gender": "Men's Fashion",
        "category": "Accessories",
        "sub_category": "Sunglasses",
        "price": 699,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/Fastrack-Wayfarer-Sunglasses-Black-P426BK1/dp/B00XYZ789",
        "colors": ["Black"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Medium",
        "fabric": "Plastic",
        "description": "Classic matte black wayfarer frames with 100% UV protection lenses, goes with all casual outfits."
    },
    {
        "id": 802,
        "name": "Fastrack Unisex Wayfarer Black Sunglasses (Womens)",
        "gender": "Women's Fashion",
        "category": "Accessories",
        "sub_category": "Sunglasses",
        "price": 699,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/Fastrack-Wayfarer-Sunglasses-Black-P426BK1/dp/B00XYZ789",
        "colors": ["Black"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Medium",
        "fabric": "Plastic",
        "description": "Stylish sunglasses featuring gradient dark lenses and sleek temples for women."
    },
    {
        "id": 803,
        "name": "Casio G-Shock Men's Black Digital Watch",
        "gender": "Men's Fashion",
        "category": "Accessories",
        "sub_category": "Watch",
        "price": 4999,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/Casio-G-Shock-Digital-Black-Watch-DW-5600BB-1DR/dp/B007E7XYZ",
        "colors": ["Black"],
        "style": "Sports",
        "pattern": "Solid",
        "fit": "Standard",
        "fabric": "Resin",
        "description": "Tactical matte black Casio G-Shock watch, water resistant to 200m, shock resistant, highly durable."
    },
    {
        "id": 804,
        "name": "Lavie Women's Pebbled Faux Leather Black Handbag",
        "gender": "Women's Fashion",
        "category": "Accessories",
        "sub_category": "Handbag",
        "price": 1699,
        "store": "Amazon",
        "image_url": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop",
        "product_url": "https://www.amazon.in/s?k=Women+Black+Faux+Leather+Handbag",
        "colors": ["Black"],
        "style": "Casual",
        "pattern": "Textured",
        "fit": "Large",
        "fabric": "Faux Leather",
        "description": "Spacious premium faux-leather black tote handbag with metal zip closures. Essential daily accessory."
    },
    {
        "id": 805,
        "name": "Titan Neo Men's Analog Black Dial Watch",
        "gender": "Men's Fashion",
        "category": "Accessories",
        "sub_category": "Watch",
        "price": 2499,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/search?q=Titan+Men+Analog+Watch",
        "colors": ["Black", "Silver"],
        "style": "Formal",
        "pattern": "Solid",
        "fit": "Standard",
        "fabric": "Stainless Steel",
        "description": "Sleek analog men's watch with stainless steel strap and black dial. Outstanding premium business accessory."
    },
    {
        "id": 806,
        "name": "Baggit Women's Brown Wallet",
        "gender": "Women's Fashion",
        "category": "Accessories",
        "sub_category": "Wallet",
        "price": 599,
        "store": "Flipkart",
        "image_url": "https://images.unsplash.com/photo-1627124118123-e4d34789d041?w=500&auto=format&fit=crop",
        "product_url": "https://www.flipkart.com/baggit-women-brown-wallet/p/itm87342",
        "colors": ["Brown"],
        "style": "Casual",
        "pattern": "Solid",
        "fit": "Compact",
        "fabric": "Synthetic",
        "description": "Sleek bi-fold brown wallet for women, features multiple card slots and zipper pocket for coins."
    }
]

# Initialize MongoDB client
mongo_client = None
db = None
products_collection = None
mongodb_connected = False

if settings.MONGODB_URI:
    try:
        # 5-second timeout to avoid hanging if cluster is unreachable
        mongo_client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
        db = mongo_client.get_default_database()
        if db is None or db.name == 'admin':
            db = mongo_client['stylesense']
        products_collection = db['products']
        
        # Test connection
        mongo_client.server_info()
        mongodb_connected = True
        print("Successfully connected to MongoDB Atlas!")
    except Exception as e:
        print(f"MongoDB connection failed: {e}. Falling back to local in-memory catalog.")

def seed_database_if_empty():
    """
    Seeds MongoDB collection with the rich product catalog.
    Always resyncs to ensure store data matches PRODUCTS_DB.
    """
    if not mongodb_connected or products_collection is None:
        print("Seeding skipped. MongoDB is not connected.")
        return
    try:
        # Always drop and reseed to keep MongoDB in sync with PRODUCTS_DB
        products_collection.delete_many({})
        seeded_data = [item.copy() for item in PRODUCTS_DB]
        products_collection.insert_many(seeded_data)
        print(f"Synced {len(seeded_data)} products into MongoDB.")
    except Exception as e:
        print(f"Failed to seed MongoDB: {e}")

def get_all_products() -> list:
    """
    Retrieves the entire catalog. Falls back to in-memory list if connection is offline.
    """
    raw_products = []
    if mongodb_connected and products_collection is not None:
        try:
            cursor = products_collection.find({})
            for doc in cursor:
                doc_copy = dict(doc)
                if '_id' in doc_copy:
                    del doc_copy['_id']
                raw_products.append(doc_copy)
        except Exception as e:
            print(f"Error fetching from MongoDB: {e}. Using local fallback list.")
            raw_products = [item.copy() for item in PRODUCTS_DB]
    else:
        raw_products = [item.copy() for item in PRODUCTS_DB]

    # Product URLs are built dynamically in find_similar_products using brand + color + sub_category
    # Do not blank them here — keep the static fallback URL from PRODUCTS_DB as a safety net
    return raw_products
