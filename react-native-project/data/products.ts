// Product data types and API functions
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const API_BASE_URL = 'https://fakestoreapi.com';

// Fetch product by ID from the real API
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    console.log(`Fetching product ${id} from API...`);
    
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${response.statusText}`);
      return null;
    }
    
    const product = await response.json();
    console.log('Product fetched successfully:', product.title);
    
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Fetch all products (for testing/validation)
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
};

// Helper function to extract product ID from URL
export const extractProductIdFromUrl = (url: string): number | null => {
  // Match various URL patterns
  const patterns = [
    /\/products\/(\d+)/, // /products/1
    /\/(\d+)$/,         // ending with /1
    /product[s]?[_-]?(\d+)/i, // product_1, products-1, etc.
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const id = parseInt(match[1], 10);
      // Validate ID range (fakestoreapi has products 1-20)
      if (id >= 1 && id <= 20) {
        return id;
      }
    }
  }
  
  return null;
};

// Validate if product exists (useful for error checking)
export const validateProductId = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return response.ok;
  } catch {
    return false;
  }
};