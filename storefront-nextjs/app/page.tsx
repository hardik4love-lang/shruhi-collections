'use client';

import React, { useState } from 'react';
import CurvyFitEngine from '@/components/CurvyFitEngine';
import { ShoppingBag, Sparkles, MessageCircle, ShieldCheck, Truck, RefreshCw, ZoomIn } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'curvy-couture' | 'festive-couture' | 'mens-shirts'>('all');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Banner */}
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
      <section className="relative bg-gradient-to-b from-oxblood-500/10 via-champagne-500/5 to-transparent py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-oxblood-deep/10 text-oxblood-deep text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Curvy Couture Flagship (Sizes S to 6XL)
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-bold text-oxblood-deep tracking-tight mb-6">
            Timeless Surat Craftsmanship, Tailored for Every Silhouette.
          </h2>
          <p className="text-base sm:text-lg text-neutral-700 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            Direct from Surat looms to your doorstep. Explore our 59 signature studio editions crafted in pure Chanderi silk, Banarasi jacquard, organza, and artisanal linen.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-neutral-700">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-champagne-600" /> Surat Loom Certified</span>
            <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-champagne-600" /> Express National Dispatch</span>
            <span className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4 text-champagne-600" /> Direct Loom Pricing (MRP ₹850 – ₹3,550)</span>
          </div>
        </div>
      </section>

      {/* Interactive Curvy Sizing Calculator Section */}
      <section className="max-w-5xl mx-auto px-6 -mt-6 mb-16 w-full">
        <CurvyFitEngine onSelectSize={(size) => setSelectedSizeFilter(size)} />
      </section>

      {/* Filter Bar */}
      <div className="max-w-6xl mx-auto px-6 mb-8 w-full flex flex-wrap items-center justify-between gap-4">
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
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {selectedSizeFilter !== 'all' && (
          <div className="flex items-center gap-2 text-xs font-semibold bg-oxblood-deep/10 text-oxblood-deep px-3 py-1.5 rounded-lg">
            <span>Filtered to Size: <strong>{selectedSizeFilter}</strong></span>
            <button
              onClick={() => setSelectedSizeFilter('all')}
              className="text-neutral-500 hover:text-neutral-800 ml-1 font-bold"
            >
              &times; Reset
            </button>
          </div>
        )}
      </div>

      {/* Lookbook Information Grid Callout */}
      <section className="max-w-6xl mx-auto px-6 mb-16 w-full">
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center shadow-sm">
          <h3 className="font-serif text-2xl font-bold text-oxblood-deep mb-2">
            59 Signature Handcrafted Editions
          </h3>
          <p className="text-sm text-neutral-600 max-w-xl mx-auto mb-6">
            All designs are available for instant WhatsApp ordering, video call inspection, and bespoke tailoring up to 6XL.
          </p>
          <a
            href="https://wa.me/919054241725?text=Hello%20Shruhi%20Collections%2C%20please%20send%20me%20your%20full%204K%20catalog%20PDF%20and%20price%20list"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-oxblood-deep hover:bg-oxblood-900 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4" /> Request Full 4K Catalog on WhatsApp
          </a>
        </div>
      </section>

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
