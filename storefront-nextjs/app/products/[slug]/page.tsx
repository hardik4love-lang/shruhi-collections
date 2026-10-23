import { notFound } from 'next/navigation';
import { getAllProducts, getProductBySlug, buildWhatsAppOrderUrl } from '@/lib/catalog';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, ShieldCheck, Truck, Sparkles, Check, Info } from 'lucide-react';
import Image from 'next/image';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found — Shruhi Collections',
    };
  }

  return {
    title: `${product.name} — Shruhi Collections Surat`,
    description: product.description,
    openGraph: {
      title: `${product.name} — Surat Loom Direct`,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Shruhi Collections Surat',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Shruhi Collections',
      },
    },
  };

  const defaultWaUrl = buildWhatsAppOrderUrl(product, product.sizes[0]);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Schema.org Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Banner */}
      <div className="bg-oxblood-deep text-white text-xs font-semibold py-2 px-4 text-center tracking-wider">
        <span>SURAT ATELIER DIRECT &bull; 24/7 WHATSAPP CONCIERGE: +91 90542 41725</span>
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

      {/* Product Detail Layout */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* 4K Image Presentation */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-4 shadow-sm overflow-hidden sticky top-24">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              />
              {product.isCurvyCouture && (
                <div className="absolute top-4 left-4 bg-oxblood-deep/90 text-white text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md backdrop-blur-sm">
                  Curvy Couture &bull; S to 6XL
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500 px-2 font-medium">
              <span>Surat Loom Original</span>
              <span>4K Ultra-Definition Studio Plate</span>
            </div>
          </div>

          {/* Product Purchasing Dossier */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-2">
                {product.categoryLabel} &bull; SKU: {product.sku}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-oxblood-deep tracking-tight mb-3">
                {product.name}
              </h1>
              <p className="text-sm text-neutral-600 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Pricing Section */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-bold text-oxblood-deep font-display">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-base text-neutral-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                  Loom Direct Savings
                </span>
              </div>
              <div className="text-[11px] text-neutral-500">
                Taxes included &bull; Free express delivery across India for 2+ items
              </div>
            </div>

            {/* Fabric & Atelier Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white border border-neutral-200 rounded-xl p-3.5">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">Fabric &amp; Craft</span>
                <span className="font-bold text-neutral-800">{product.fabric}</span>
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-3.5">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">Color Shade</span>
                <span className="font-bold text-neutral-800">{product.color || 'Artisanal Dyed'}</span>
              </div>
            </div>

            {/* Sizing Matrix */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Available Atelier Sizes
                </label>
                <Link
                  href="/#size-guide"
                  className="text-xs text-oxblood-deep font-bold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-champagne-600" /> Curvy Size Calculator
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <span
                    key={sz}
                    className="px-4 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-bold text-neutral-800 hover:border-oxblood-deep cursor-pointer transition-colors"
                  >
                    {sz}
                  </span>
                ))}
              </div>
            </div>

            {/* WhatsApp Purchase Action */}
            <div className="pt-4 border-t border-neutral-200">
              <a
                href={defaultWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm uppercase tracking-wider py-4 px-6 rounded-2xl shadow-lg hover:shadow-emerald-900/20 transition-all hover:scale-[1.01]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Order on WhatsApp (Direct Loom Dispatch)</span>
              </a>
              <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-neutral-500">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Video Call Inspection</span>
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-emerald-600" /> 3–4 Days Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
