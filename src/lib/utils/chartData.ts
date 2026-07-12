import type { Product, Cart } from '$lib/types';

export interface CategoryStat {
  category: string;
  count: number;
  totalValue: number;
  avgPrice: number;
  avgRating: number;
  share: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  avgPrice: number;
  avgRating: number;
  categories: CategoryStat[];
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function buildDashboardStats(products: Product[]): DashboardStats {
  const byCategory = new Map<string, Product[]>();

  for (const product of products) {
    const list = byCategory.get(product.category) ?? [];
    list.push(product);
    byCategory.set(product.category, list);
  }

  const totalProducts = products.length;

  const categories: CategoryStat[] = Array.from(byCategory.entries()).map(([category, items]) => {
    const count = items.length;
    const totalValue = items.reduce((sum, p) => sum + p.price, 0);
    const avgPrice = count ? totalValue / count : 0;
    const avgRating = count ? items.reduce((sum, p) => sum + p.rating.rate, 0) / count : 0;

    return {
      category,
      count,
      totalValue: round(totalValue),
      avgPrice: round(avgPrice),
      avgRating: round(avgRating, 1),
      share: totalProducts ? round((count / totalProducts) * 100, 1) : 0
    };
  });

  categories.sort((a, b) => b.count - a.count);

  const avgPrice = totalProducts
    ? round(products.reduce((sum, p) => sum + p.price, 0) / totalProducts)
    : 0;
  const avgRating = totalProducts
    ? round(products.reduce((sum, p) => sum + p.rating.rate, 0) / totalProducts, 1)
    : 0;

  return {
    totalProducts,
    totalCategories: byCategory.size,
    avgPrice,
    avgRating,
    categories
  };
}

export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function formatCategoryLabel(category: string): string {
  return category.replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface CartTrendPoint {
  label: string;
  value: number;
}

export interface TopCartProduct {
  title: string;
  quantity: number;
}

export interface CartAnalytics {
  cartCount: number;
  totalSpend: number;
  avgCartValue: number;
  trend: CartTrendPoint[];
  topProducts: TopCartProduct[];
}

export function buildCartAnalytics(carts: Cart[], products: Product[]): CartAnalytics {
  const productById = new Map(products.map((p) => [p.id, p]));

  const trend = carts
    .map((cart) => {
      const value = cart.products.reduce((sum, item) => {
        const product = productById.get(item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);

      return {
        label: new Date(cart.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: round(value),
        date: cart.date
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(({ label, value }) => ({ label, value }));

  const quantityByProduct = new Map<number, number>();
  for (const cart of carts) {
    for (const item of cart.products) {
      quantityByProduct.set(item.productId, (quantityByProduct.get(item.productId) ?? 0) + item.quantity);
    }
  }

  const topProducts: TopCartProduct[] = Array.from(quantityByProduct.entries())
    .map(([productId, quantity]) => ({
      title: productById.get(productId)?.title ?? `Product #${productId}`,
      quantity
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const totalSpend = round(trend.reduce((sum, point) => sum + point.value, 0));
  const cartCount = carts.length;

  return {
    cartCount,
    totalSpend,
    avgCartValue: cartCount ? round(totalSpend / cartCount) : 0,
    trend,
    topProducts
  };
}
