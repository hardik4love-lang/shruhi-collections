'use client';

import React from 'react';
import { MessageCircle, Video, ShieldCheck } from 'lucide-react';

interface WhatsAppConciergeDockProps {
  primaryPhone?: string;
}

export default function WhatsAppConciergeDock({ primaryPhone = '919054241725' }: WhatsAppConciergeDockProps) {
  const defaultOrderUrl = `https://wa.me/${primaryPhone}?text=${encodeURIComponent(
    'Hello Shruhi Collections! I would like to consult with your Surat atelier regarding your luxury ethnic and curvy couture collections.'
  )}`;

  const videoCallUrl = `https://wa.me/${primaryPhone}?text=${encodeURIComponent(
    'Hello Shruhi Collections! I would like to schedule a live 4K video call inspection to view fabric textures and embroidery details.'
  )}`;

  return (
    <aside aria-label="Mobile Concierge Dock" className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white/95 backdrop-blur-lg border-t border-neutral-200 px-4 py-2.5 shadow-2xl">
      <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1.5 font-semibold">
        <span className="flex items-center gap-1 text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Surat Atelier Weavers Active
        </span>
        <span className="flex items-center gap-0.5 text-neutral-600">
          <ShieldCheck className="w-3 h-3 text-champagne-600" />
          Direct Loom Guarantee
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={videoCallUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold uppercase tracking-wider py-2.5 px-3 rounded-xl border border-neutral-300 transition-colors"
        >
          <Video className="w-3.5 h-3.5 text-oxblood-deep" />
          <span>Video Inspect</span>
        </a>

        <a
          href={defaultOrderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 bg-oxblood-deep hover:bg-oxblood-900 text-white text-[11px] font-bold uppercase tracking-wider py-2.5 px-3 rounded-xl shadow-md transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 text-champagne-400" />
          <span>WhatsApp Buy</span>
        </a>
      </div>
    </aside>
  );
}
