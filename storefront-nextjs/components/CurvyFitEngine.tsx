'use client';

import React, { useState, useMemo } from 'react';
import { calculateCurvySize, SIZE_CHART_SPECS } from '@/lib/catalog';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

interface CurvyFitEngineProps {
  onSelectSize?: (size: string) => void;
}

export default function CurvyFitEngine({ onSelectSize }: CurvyFitEngineProps) {
  const [bust, setBust] = useState<number>(46);
  const [waist, setWaist] = useState<number>(42);
  const [hip, setHip] = useState<number>(49);

  const matchedSize = useMemo(() => {
    return calculateCurvySize(bust, waist, hip);
  }, [bust, waist, hip]);

  return (
    <div className="bg-gradient-to-br from-oxblood-500/5 via-champagne-500/10 to-transparent border border-oxblood-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-champagne-500" />
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-oxblood-deep">
            Curvy Couture Precision Fit Recommender
          </h3>
        </div>
        <span className="bg-oxblood-deep text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
          {matchedSize.size} Recommended
        </span>
      </div>

      <p className="text-sm text-neutral-600 mb-6">
        Enter your garment-ready body measurements. Our Surat atelier sizing algorithm matches your silhouette with generous comfort ease up to 6XL.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-oxblood-deep mb-1.5">
            Bust (Inches)
          </label>
          <input
            type="number"
            min={32}
            max={65}
            step={0.5}
            value={bust}
            onChange={(e) => setBust(parseFloat(e.target.value) || 36)}
            className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-oxblood-500/30"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-oxblood-deep mb-1.5">
            Waist (Inches)
          </label>
          <input
            type="number"
            min={26}
            max={60}
            step={0.5}
            value={waist}
            onChange={(e) => setWaist(parseFloat(e.target.value) || 32)}
            className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-oxblood-500/30"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-oxblood-deep mb-1.5">
            Hip (Inches)
          </label>
          <input
            type="number"
            min={34}
            max={70}
            step={0.5}
            value={hip}
            onChange={(e) => setHip(parseFloat(e.target.value) || 39)}
            className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-oxblood-500/30"
          />
        </div>
      </div>

      <div className="bg-white border border-champagne-500/40 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Atelier Calculation</span>
          <div className="text-lg font-serif font-bold text-oxblood-deep">
            Size {matchedSize.label} • {matchedSize.desc}
          </div>
          <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
            <Check className="w-3.5 h-3.5" /> 99% Fit Confidence (Includes 2.5" breathing ease)
          </div>
        </div>

        {onSelectSize && (
          <button
            onClick={() => onSelectSize(matchedSize.size)}
            className="bg-oxblood-deep hover:bg-oxblood-900 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md"
          >
            Apply to Lookbook <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 text-neutral-500 uppercase font-semibold">
              <th className="py-2 px-3">Size</th>
              <th className="py-2 px-3">Bust</th>
              <th className="py-2 px-3">Waist</th>
              <th className="py-2 px-3">Hip</th>
              <th className="py-2 px-3">Fit Category</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART_SPECS.map((spec) => {
              const isMatch = spec.size === matchedSize.size;
              return (
                <tr
                  key={spec.size}
                  className={`border-b border-neutral-100 transition-colors ${
                    isMatch ? 'bg-oxblood-500/10 font-bold text-oxblood-deep' : 'text-neutral-700'
                  }`}
                >
                  <td className="py-2.5 px-3">{spec.label}</td>
                  <td className="py-2.5 px-3">{spec.bust}"</td>
                  <td className="py-2.5 px-3">{spec.waist}"</td>
                  <td className="py-2.5 px-3">{spec.hip}"</td>
                  <td className="py-2.5 px-3">{spec.desc}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
