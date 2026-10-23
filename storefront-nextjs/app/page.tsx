'use client';

import React, { useState, useMemo } from 'react';
import CurvyFitEngine from '@/components/CurvyFitEngine';
import { getAllProducts, CatalogProduct } from '@/lib/catalog';
import { ShoppingBag, Sparkles, MessageCircle, ShieldCheck, Truck, RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const allProducts = useMemo(() => getAllProducts(), []);
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'curvy-couture' | 'festive-couture' | 'mens-shirts'>('all');
  const [search, setSearch] = useState<string>('');

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (activeTab !== 'all' && product.category !== activeTab) return false;
      if (selectedSizeFilter !== 'all' && !product.sizes.includes(selectedSizeFilter)) return false;
      if (search) {
        const query = search.toLowerCase();
        const hay = `${product.name} ${product.fabric} ${product.categoryLabel} ${product.color}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [allProducts, activeTab, selectedSizeFilter, search]);

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      {/* Top Announcement Bar */}
      <div className="bg-oxblood-deep text-white text-xs font-semibold py-2 px-4 text-center tracking-wider">
        <span>SURAT LOOM DIRECT • SIZES S TO 6XL CURVY COUTURE • 24/7 WHATSAPP CONCIERGE: +91 90542 41725</span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-oxblood-deep">
            SHRUHI COLLECTIONS
          </h1>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block">
            Haute Ethnic Atelier &bull; Surat Flagship
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/919054241725?text=Hello%20Shruhi%20Collections%2C%20I%20would%20like%20to%20inquire%20about%20your%20curvy%20couture%20collection"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full shadow-sm transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp Concierge</span>
          </a>
        </div>
      </header>

      {/* Hero Editorial Section */}
      <section className="relative bg-gradient-to-b from-oxblood-500/10 via-champagne-500/5 to-transparent py-14 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-oxblood-deep/10 text-oxblood-deep text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Curvy Couture Flagship (Sizes S to 6XL)
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-bold text-oxblood-deep tracking-tight mb-6">
            Timeless Surat Craftsmanship, Tailored for Every Silhouette.
          </h2>
          <p className="text-base sm:text-lg text-neutral-700 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            Direct from Surat looms to your doorstep. Explore 59 signature editions crafted in pure Chanderi silk, Banarasi jacquard, organza, and artisanal linen.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-neutral-700">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-champagne-600" /> Surat Loom Certified</span>
            <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-champagne-600" /> Express National Dispatch</span>
            <span className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4 text-champagne-600" /> Direct Loom Pricing (MRP ₹850 – ₹3,550)</span>
          </div>
        </div>
      </section>

      {/* Interactive Curvy Sizing Calculator Section */}
      <section id="size-guide" className="max-w-5xl mx-auto px-6 -mt-4 mb-14 w-full">
        <CurvyFitEngine onSelectSize={(size) => setSelectedSizeFilter(size)} />
      </section>

      {/* Filter & Search Bar */}
      <div className="max-w-6xl mx-auto px-6 mb-8 w-full flex flex-wrap items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'curvy-couture', 'festive-couture', 'mens-shirts'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-oxblood-deep text-white shadow-md'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {tab === 'all' ? 'All Editions (59)' : tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search fabric, color, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-oxblood-500/20"
          />
        </div>
      </div>

      {/* Active Filter Indicator */}
      {selectedSizeFilter !== 'all' && (
        <div className="max-w-6xl mx-auto px-6 mb-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold bg-oxblood-deep/10 text-oxblood-deep px-3 py-1.5 rounded-lg">
            <span>Filtered to Size: <strong>{selectedSizeFilter}</strong></span>
            <button
              onClick={() => setSelectedSizeFilter('all')}
              className="text-neutral-500 hover:text-neutral-800 ml-1 font-bold"
            >
              &times; Reset
            </button>
          </div>
          <span className="text-xs text-neutral-500">Showing {filteredProducts.length} matching editions</span>
        </div>
      )}

      {/* Product Grid */}
      <main className="max-w-6xl mx-auto px-6 mb-16 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
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
                    {product.fabric} &bull; {product.categoryLabel}
                  </span>
                  <h3 className="font-serif text-base font-bold text-oxblood-deep group-hover:text-oxblood-900 line-clamp-1 mb-2">
                    {product.name}
                  </h3>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-lg font-bold font-display text-oxblood-deep mr-2">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-neutral-400 line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-oxblood-deep group-hover:underline flex items-center gap-1">
                    Order <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-neutral-900 text-neutral-400 py-12 px-6 text-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-6">
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-1">SHRUHI COLLECTIONS</h4>
            <p>Direct Loom Flagship, Surat, Gujarat 395002 &bull; WhatsApp: +91 90542 41725</p>
          </div>
          <div className="text-right">
            <p>&copy; {new Date().getFullYear()} Shruhi Collections. All Rights Reserved.</p>
            <p className="text-[10px] text-neutral-500 mt-1">Curvy Couture is a registered trademark of Shruhi Collections Surat.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
