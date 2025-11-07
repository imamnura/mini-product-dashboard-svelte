// @ts-nocheck
import { getProductById } from '$lib/utils/api';
import type { PageLoad } from './$types';

export const load = async ({ params }: Parameters<PageLoad>[0]) => {
  const product = await getProductById(Number(params.id));
  return {
    product,
    meta: {
      title: `${product.title} | Fake Store`,
      description: product.description,
      image: product.image,
      keywords: `${product.category}, ${product.title}, Fake Store`
    }
  };
};