import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // POST /chat
  chat: async (message, history = []) => {
    try {
      const response = await client.post('/chat', { message, history });
      return response.data;
    } catch (error) {
      console.error('API Error in chat:', error);
      throw error.response?.data?.detail || 'Failed to connect to chatbot service.';
    }
  },

  // POST /analyze-image
  analyzeImage: async (imageFile, budget, gender, garmentName) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('budget', budget);
      if (gender) formData.append('gender', gender);
      if (garmentName) formData.append('garment_name', garmentName);

      const response = await axios.post(`${API_BASE_URL}/analyze-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('API Error in analyzeImage:', error);
      throw error.response?.data?.detail || 'Failed to analyze fashion image.';
    }
  },

  // POST /similar-products
  getSimilarProducts: async (gender, category, detectedItem, colors, style, budget) => {
    try {
      const response = await client.post('/similar-products', {
        gender,
        category,
        detected_item: detectedItem,
        colors,
        style,
        budget,
      });
      return response.data;
    } catch (error) {
      console.error('API Error in getSimilarProducts:', error);
      throw error.response?.data?.detail || 'Failed to fetch matching products.';
    }
  },

  // POST /recommend-outfit
  recommendOutfit: async (gender, occasion, budget, stylePreference) => {
    try {
      const response = await client.post('/recommend-outfit', {
        gender,
        occasion,
        budget,
        style_preference: stylePreference,
      });
      return response.data;
    } catch (error) {
      console.error('API Error in recommendOutfit:', error);
      throw error.response?.data?.detail || 'Failed to fetch outfit recommendations.';
    }
  },

  getColorPalette: async (color, gender) => {
    try {
      const response = await client.post('/color-palette', { color, gender });
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to generate color palette.';
    }
  },

  // GET /fashion-trends
  getFashionTrends: async () => {
    try {
      const response = await client.get('/fashion-trends');
      return response.data;
    } catch (error) {
      console.error('API Error in getFashionTrends:', error);
      throw error.response?.data?.detail || 'Failed to retrieve style trends.';
    }
  },
};
export default api;
