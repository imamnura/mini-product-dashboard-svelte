import type { Product, Category, PaginatedResponse } from '$lib/types';

const BASE_URL = 'https://fakestoreapi.com';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getProducts(limit: number = 6, page: number = 1): Promise<PaginatedResponse<Product>> {
    const start = (page - 1) * limit;
    const allProducts = await this.fetchWithErrorHandling<Product[]>(`${this.baseUrl}/products`);
    
    const paginatedProducts = allProducts.slice(start, start + limit);
    const totalPages = Math.ceil(allProducts.length / limit);
    
    return {
      data: paginatedProducts,
      totalPages,
      currentPage: page,
      totalItems: allProducts.length
    };
  }

  async getProductById(id: number): Promise<Product> {
    return this.fetchWithErrorHandling<Product>(`${this.baseUrl}/products/${id}`);
  }

  async getCategories(): Promise<Category[]> {
    return this.fetchWithErrorHandling<Category[]>(`${this.baseUrl}/products/categories`);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.fetchWithErrorHandling<Product[]>(`${this.baseUrl}/products/category/${category}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient(BASE_URL);

// Export individual functions for backward compatibility
export const getProducts = (limit?: number, page?: number) => apiClient.getProducts(limit, page);
export const getProductById = (id: number) => apiClient.getProductById(id);
export const getCategories = () => apiClient.getCategories();
export const getProductsByCategory = (category: string) => apiClient.getProductsByCategory(category);
