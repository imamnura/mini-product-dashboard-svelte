import { describe, it, expect } from 'vitest';
import { filterProducts, sortProducts } from './filters';
import type { Product } from '$lib/types';

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Product A',
    price: 100,
    description: 'Description A',
    category: 'electronics',
    image: 'image-a.jpg',
    rating: { rate: 4.5, count: 100 }
  },
  {
    id: 2,
    title: 'Product B',
    price: 50,
    description: 'Description B',
    category: 'clothing',
    image: 'image-b.jpg',
    rating: { rate: 3.5, count: 50 }
  },
  {
    id: 3,
    title: 'Product C',
    price: 150,
    description: 'Description C',
    category: 'electronics',
    image: 'image-c.jpg',
    rating: { rate: 4.8, count: 200 }
  }
];

describe('filterProducts', () => {
  it('should filter products by search term', () => {
    const result = filterProducts(mockProducts, 'Product A');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Product A');
  });

  it('should filter products by category', () => {
    const result = filterProducts(mockProducts, '', 'electronics');
    expect(result).toHaveLength(2);
    expect(result.every(p => p.category === 'electronics')).toBe(true);
  });

  it('should filter by both search and category', () => {
    const result = filterProducts(mockProducts, 'Product C', 'electronics');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Product C');
  });

  it('should be case insensitive', () => {
    const result = filterProducts(mockProducts, 'product a');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Product A');
  });

  it('should return all products when no filters', () => {
    const result = filterProducts(mockProducts, '');
    expect(result).toHaveLength(3);
  });
});

describe('sortProducts', () => {
  it('should sort by price ascending', () => {
    const result = sortProducts(mockProducts, 'price-asc');
    expect(result[0].price).toBe(50);
    expect(result[2].price).toBe(150);
  });

  it('should sort by price descending', () => {
    const result = sortProducts(mockProducts, 'price-desc');
    expect(result[0].price).toBe(150);
    expect(result[2].price).toBe(50);
  });

  it('should sort by rating', () => {
    const result = sortProducts(mockProducts, 'rating');
    expect(result[0].rating.rate).toBe(4.8);
    expect(result[2].rating.rate).toBe(3.5);
  });

  it('should sort by name', () => {
    const result = sortProducts(mockProducts, 'name');
    expect(result[0].title).toBe('Product A');
    expect(result[2].title).toBe('Product C');
  });

  it('should not mutate original array', () => {
    const original = [...mockProducts];
    sortProducts(mockProducts, 'price-asc');
    expect(mockProducts).toEqual(original);
  });
});
