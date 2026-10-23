export interface ProductVariant {
  size: string;
  inStock: boolean;
  bustInches?: number;
  waistInches?: number;
  hipInches?: number;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  code: string;
  fabric: string;
  colorName: string;
  price: number;
  mrp: number;
  category: 'curvy-couture' | 'festive-couture' | 'mens-shirts';
  categoryLabel: string;
  sizes: string[];
  image: string;
  description: string;
  isCurvyCouture: boolean;
  suratLoomDirect: boolean;
}

export const SIZE_CHART_SPECS = [
  { size: 'S', label: 'S (36)', bust: 36, waist: 32, hip: 39, desc: 'Petite / Standard Fit' },
  { size: 'M', label: 'M (38)', bust: 38, waist: 34, hip: 41, desc: 'Standard Boutique Fit' },
  { size: 'L', label: 'L (40)', bust: 40, waist: 36, hip: 43, desc: 'Standard Boutique Fit' },
  { size: 'XL', label: 'XL (42)', bust: 42, waist: 38, hip: 45, desc: 'Standard Boutique Fit' },
  { size: '2XL', label: '2XL (44)', bust: 44, waist: 40, hip: 47, desc: 'Extended Boutique Fit' },
  { size: '3XL', label: '3XL (46)', bust: 46, waist: 42, hip: 49, desc: 'Curvy Couture Plus-Size' },
  { size: '4XL', label: '4XL (48)', bust: 48, waist: 44, hip: 51, desc: 'Curvy Couture Plus-Size' },
  { size: '5XL', label: '5XL (50)', bust: 50, waist: 46, hip: 53, desc: 'Curvy Couture Plus-Size' },
  { size: '6XL', label: '6XL (52)', bust: 52, waist: 48, hip: 55, desc: 'Curvy Couture Plus-Size' },
];

export function calculateCurvySize(bust: number, waist: number, hip: number) {
  let matched = SIZE_CHART_SPECS.find(s => s.bust >= bust && s.waist >= waist && s.hip >= hip);
  if (!matched) matched = SIZE_CHART_SPECS[SIZE_CHART_SPECS.length - 1];
  return matched;
}

export function buildWhatsAppOrderUrl(product: CatalogProduct, selectedSize: string, phone: string = '919054241725') {
  const text = `Hello Shruhi Collections! I would like to order this Surat Loom Edition:\n\n*Product:* ${product.name} (${product.code})\n*Fabric:* ${product.fabric}\n*Size Selected:* ${selectedSize}\n*Direct Loom Price:* ₹${product.price.toLocaleString('en-IN')}\n\nPlease confirm availability and delivery timeline.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
