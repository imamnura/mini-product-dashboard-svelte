import { getProductsByCategory } from '$lib/utils/api';

export async function load({ params }: any) {
  const items = await getProductsByCategory(params.name);
  return { items, name: params.name };
}
