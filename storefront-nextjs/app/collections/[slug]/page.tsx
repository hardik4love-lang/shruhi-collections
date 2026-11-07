import { notFound } from 'next/navigation';
import { getProductsByCategory, getAllProducts } from '@/lib/catalog';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles, MessageCircle } from 'lucide-react';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

const COLLECTIONS_META: Record<string, { title: string; subtitle: string; description: string }> = {
  'curvy-couture': {
    title: 'Curvy Couture & Plus-Size Atelier (Sizes S to 6XL)',
    subtitle: 'Surat Loom Direct Inclusive Fashion',
    description: 'Explore handcrafted luxury ethnic suits, kurtis, and festive gowns tailored specifically for curvy and plus-size silhouettes (up to 6XL). Direct loom pricing from Surat.',
  },
  'festive-couture': {
    title: 'Festive & Bridal Silk Couture',
    subtitle: 'Hand-Woven Chanderi, Banarasi & Organza Sets',
    description: 'Discover regal 3-piece festive ethnic suits featuring intricate Zari embroidery, handloom borders, and pure silk textures from the master weavers of Surat.',
  },
  'mens-shirts': {
    title: 'Mens Luxury Loom Shirts',
    subtitle: 'Artisanal Linen, Oxford Cotton & Resort Wear',
    description: 'Bespoke men’s formal and resort shirts crafted in premium linen chambray, tartan checks, and lightweight cotton. Loom-direct pricing with tailored precision.',
  },
};

export async function generateStaticParams() {
  return [
    { slug: 'curvy-couture' },
    { slug: 'festive-couture' },
    { slug: 'mens-shirts' },
  ];
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = COLLECTIONS_META[slug];

  if (!meta) {
    return { title: 'Collection — Shruhi Collections' };
  }

  return {
    title: `${meta.title} — Shruhi Collections`,
    description: meta.description,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const meta = COLLECTIONS_META[slug];

  if (!meta) {
    notFound();
  }

  const products = getProductsByCategory(slug);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top Banner */}
      <div className="bg-oxblood-deep text-white text-xs font-semibold py-2 px-4 text-center tracking-wider">
        <span>SURAT LOOM DIRECT • 59 HANDCRAFTED EDITIONS • 24/7 WHATSAPP CONCIERGE: +91 90542 41725</span>
      </div>

      {/* Header */}
      <header className="border-b border-neutral-200 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-oxblood-deep transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Lookbook
        </Link>
        <div className="font-serif text-lg font-bold text-oxblood-deep">
          SHRUHI COLLECTIONS
        </div>
        <div className="w-20" />
      </header>

      {/* Collection Hero */}
      <section className="bg-gradient-to-b from-oxblood-500/10 via-champagne-500/5 to-transparent py-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-2">
            {meta.subtitle}
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-oxblood-deep tracking-tight mb-4">
            {meta.title}
          </h1>
          <p className="text-sm text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto">
            {meta.description}
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Showing {products.length} Editions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.isCurvyCouture && (
                  <span className="absolute top-3 left-3 bg-oxblood-deep/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                    S to 6XL
                  </span>
                )}
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">
                    {product.fabric}
                  </span>
                  <h3 className="font-serif text-base font-bold text-oxblood-deep group-hover:text-oxblood-900 line-clamp-1 mb-2">
                    {product.name}
                  </h3>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between mt-2">
                  <span className="text-lg font-bold font-display text-oxblood-deep">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-neutral-400 line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-oxblood-deep group-hover:underline">
                    View Details &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
