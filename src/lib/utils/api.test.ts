import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from './api';

// Mock fetch
globalThis.fetch = vi.fn();

function createFetchResponse(data: any, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => data,
  };
}

describe('ApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should fetch and paginate products correctly', async () => {
      const mockProducts = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `Product ${i + 1}`,
        price: 100,
        description: 'Test',
        category: 'test',
        image: 'test.jpg',
        rating: { rate: 4, count: 10 }
      }));

      (globalThis.fetch as any).mockResolvedValueOnce(
        createFetchResponse(mockProducts)
      );

      const result = await apiClient.getProducts(6, 1);

      expect(result.data).toHaveLength(6);
      expect(result.totalPages).toBe(4);
      expect(result.currentPage).toBe(1);
      expect(result.totalItems).toBe(20);
    });

    it('should handle pagination correctly for page 2', async () => {
      const mockProducts = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `Product ${i + 1}`,
        price: 100,
        description: 'Test',
        category: 'test',
        image: 'test.jpg',
        rating: { rate: 4, count: 10 }
      }));

      (globalThis.fetch as any).mockResolvedValueOnce(
        createFetchResponse(mockProducts)
      );

      const result = await apiClient.getProducts(6, 2);

      expect(result.data).toHaveLength(6);
      expect(result.data[0].id).toBe(7);
      expect(result.currentPage).toBe(2);
    });

    it('should throw error on failed fetch', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce(
        createFetchResponse(null, false, 500)
      );

      await expect(apiClient.getProducts()).rejects.toThrow();
    });
  });

  describe('getProductById', () => {
    it('should fetch single product', async () => {
      const mockProduct = {
        id: 1,
        title: 'Test Product',
        price: 100,
        description: 'Test',
        category: 'test',
        image: 'test.jpg',
        rating: { rate: 4, count: 10 }
      };

      (globalThis.fetch as any).mockResolvedValueOnce(
        createFetchResponse(mockProduct)
      );

      const result = await apiClient.getProductById(1);

      expect(result).toEqual(mockProduct);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://fakestoreapi.com/products/1'
      );
    });
  });

  describe('getCategories', () => {
    it('should fetch categories', async () => {
      const mockCategories = ['electronics', 'clothing', 'books'];

      (globalThis.fetch as any).mockResolvedValueOnce(
        createFetchResponse(mockCategories)
      );

      const result = await apiClient.getCategories();

      expect(result).toEqual(mockCategories);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://fakestoreapi.com/products/categories'
      );
    });
  });

  describe('getProductsByCategory', () => {
    it('should fetch products by category', async () => {
      const mockProducts = [
        {
          id: 1,
          title: 'Electronics Product',
          price: 100,
          description: 'Test',
          category: 'electronics',
          image: 'test.jpg',
          rating: { rate: 4, count: 10 }
        }
      ];

      (globalThis.fetch as any).mockResolvedValueOnce(
        createFetchResponse(mockProducts)
      );

      const result = await apiClient.getProductsByCategory('electronics');

      expect(result).toEqual(mockProducts);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://fakestoreapi.com/products/category/electronics'
      );
    });
  });
});
