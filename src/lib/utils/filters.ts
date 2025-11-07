import type { Product } from '$lib/types';

export function filterProducts(
  products: Product[],
  searchTerm: string,
  category?: string
): Product[] {
  return products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesCategory = category
      ? product.category === category
      : true;

    return matchesSearch && matchesCategory;
  });
}

export function sortProducts(
  products: Product[],
  sortBy: 'price-asc' | 'price-desc' | 'name' | 'rating' = 'name'
): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating.rate - a.rating.rate);
    case 'name':
    default:
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
}
