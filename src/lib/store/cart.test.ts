import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { cartStore, cartCount, cartSubtotal } from './cart';
import type { Product } from '$lib/types';

const productA: Product = {
  id: 1,
  title: 'Product A',
  price: 100,
  description: 'Description A',
  category: 'electronics',
  image: 'image-a.jpg',
  rating: { rate: 4.5, count: 100 }
};

const productB: Product = {
  id: 2,
  title: 'Product B',
  price: 50,
  description: 'Description B',
  category: 'clothing',
  image: 'image-b.jpg',
  rating: { rate: 3.5, count: 50 }
};

beforeEach(() => {
  cartStore.clear();
});

describe('cartStore', () => {
  it('adds a new product with default quantity 1', () => {
    cartStore.add(productA);
    expect(get(cartStore)).toEqual([{ product: productA, quantity: 1 }]);
  });

  it('adds a product with a given quantity', () => {
    cartStore.add(productA, 3);
    expect(get(cartStore)).toEqual([{ product: productA, quantity: 3 }]);
  });

  it('increments quantity when adding an already-present product', () => {
    cartStore.add(productA, 2);
    cartStore.add(productA, 3);
    expect(get(cartStore)).toEqual([{ product: productA, quantity: 5 }]);
  });

  it('setQuantity updates an existing line item', () => {
    cartStore.add(productA);
    cartStore.setQuantity(productA.id, 7);
    expect(get(cartStore)).toEqual([{ product: productA, quantity: 7 }]);
  });

  it('setQuantity to 0 or below removes the item', () => {
    cartStore.add(productA);
    cartStore.setQuantity(productA.id, 0);
    expect(get(cartStore)).toEqual([]);
  });

  it('remove drops only the targeted product', () => {
    cartStore.add(productA);
    cartStore.add(productB);
    cartStore.remove(productA.id);
    expect(get(cartStore)).toEqual([{ product: productB, quantity: 1 }]);
  });

  it('clear empties the cart', () => {
    cartStore.add(productA);
    cartStore.add(productB);
    cartStore.clear();
    expect(get(cartStore)).toEqual([]);
  });

  it('cartCount sums quantities across line items', () => {
    cartStore.add(productA, 2);
    cartStore.add(productB, 3);
    expect(get(cartCount)).toBe(5);
  });

  it('cartSubtotal sums price * quantity across line items', () => {
    cartStore.add(productA, 2); // 100 * 2 = 200
    cartStore.add(productB, 3); // 50 * 3 = 150
    expect(get(cartSubtotal)).toBe(350);
  });
});
