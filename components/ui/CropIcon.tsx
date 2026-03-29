import React from 'react';
import { Crop } from '../../types';

const CROP_IMAGES: Record<string, string> = {
  'pineapple-premium': '/crops/pineapple.png',
  'watermelon': '/crops/watermelon.png',
  'strawberry': '/crops/strawberry.png',
  'avocado': '/crops/avocado.png',
  'pomelo': '/crops/pomelo.png',
  'mango-carabao': '/crops/mango.png',
  'banana-lakatan': '/crops/banana.png',
  'calamansi': '/crops/calamansi.png',
  'papaya': '/crops/papaya.png',
  'coconut': '/crops/coconut.png',
  'tomato-native': '/crops/tomato.png',
  'cabbage-rare': '/crops/cabbage.png',
  'okra': '/crops/okra.png',
  'eggplant': '/crops/eggplant.png',
  'kangkong': '/crops/kangkong.png',
  'ampalaya': '/crops/ampalaya.png',
  'sitaw': '/crops/sitaw.png',
  'pechay': '/crops/pechay.png',
  'garlic-ilocos': '/crops/garlic.png',
  'onion-red': '/crops/onion.png',
  'ginger': '/crops/ginger.png',
  'chili-labuyo': '/crops/chili.png',
  'lemongrass': '/crops/lemongrass.png',
  'potato-baguio': '/crops/potato.png',
  'carrots-premium': '/crops/carrot.png',
  'sweet-potato': '/crops/kamote.png',
  'cassava': '/crops/cassava.png',
  'taro-gabi': '/crops/taro.png',
  'ube': '/crops/ube.png',
  'sayote': '/crops/sayote.png',
  'black-pepper': '/crops/black-pepper.png',
  'lanzones': '/crops/lanzones.png',
  'rambutan': '/crops/rambutan.png',
  'atsal': '/crops/bell-pepper.png',
  'grapes': '/crops/grapes.png',
  'fuji-apple': '/crops/apple.png',
  'poncan': '/crops/poncan_final.png',
  'upo': '/crops/upo.png',
  'kalabasa': '/crops/kalabasa.png',
  'pipino': '/crops/pickle_final.png',
};

const CROP_COLORS: Record<string, [string, string]> = {
  'pineapple-premium': ['#f59e0b', '#d97706'],
  'watermelon': ['#ef4444', '#22c55e'],
  'strawberry': ['#f43f5e', '#e11d48'],
  'avocado': ['#4ade80', '#166534'],
  'pomelo': ['#fbbf24', '#f59e0b'],
  'mango-carabao': ['#fb923c', '#f59e0b'],
  'banana-lakatan': ['#fde047', '#eab308'],
  'calamansi': ['#a3e635', '#65a30d'],
  'papaya': ['#fb923c', '#ea580c'],
  'coconut': ['#a1887f', '#6d4c41'],
  'tomato-native': ['#ef4444', '#dc2626'],
  'cabbage-rare': ['#4ade80', '#16a34a'],
  'okra': ['#8fbc8f', '#556b2f'],
  'eggplant': ['#a855f7', '#7e22ce'],
  'kangkong': ['#34d399', '#059669'],
  'ampalaya': ['#22d3ee', '#0891b2'],
  'sitaw': ['#6ee7b7', '#10b981'],
  'pechay': ['#2dd4bf', '#0d9488'],
  'garlic-ilocos': ['#e2e8f0', '#94a3b8'],
  'onion-red': ['#c084fc', '#9333ea'],
  'ginger': ['#fbbf24', '#b45309'],
  'chili-labuyo': ['#ef4444', '#b91c1c'],
  'lemongrass': ['#bef264', '#65a30d'],
  'potato-baguio': ['#d4a574', '#92400e'],
  'carrots-premium': ['#fb923c', '#c2410c'],
  'sweet-potato': ['#f97316', '#9a3412'],
  'cassava': ['#d6d3d1', '#78716c'],
  'taro-gabi': ['#c084fc', '#7c3aed'],
  'ube': ['#a855f7', '#6d28d9'],
  'sayote': ['#a3e635', '#65a30d'],
  'black-pepper': ['#374151', '#111827'],
  'lanzones': ['#fde68a', '#d97706'],
  'rambutan': ['#fb7185', '#be123c'],
  'atsal': ['#f87171', '#b91c1c'],
  'grapes': ['#818cf8', '#3730a3'],
  'fuji-apple': ['#fda4af', '#e11d48'],
  'poncan': ['#f97316', '#c2410c'],
  'upo': ['#86efac', '#22c55e'],
  'kalabasa': ['#fbbf24', '#b45309'],
  'pipino': ['#bbf7d0', '#22c55e'],
};

export const CropIcon = ({ crop, size = 'md' }: { crop: Crop, size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const colors = CROP_COLORS[crop.id] || ['#6b7280', '#374151'];
  const imgSrc = CROP_IMAGES[crop.id];
  const sizeMap: Record<string, { box: string, img: number }> = {
    sm: { box: 'w-10 h-10 rounded-[12px]', img: 24 },
    md: { box: 'w-14 h-14 rounded-[16px]', img: 32 },
    lg: { box: 'w-20 h-20 rounded-[22px]', img: 56 },
    xl: { box: 'w-28 h-28 rounded-[28px]', img: 80 },
  };
  const s = sizeMap[size];
  return (
    <div
      className={`${s.box} flex items-center justify-center shrink-0 select-none relative overflow-hidden`}
      style={{ 
        background: `linear-gradient(135deg, ${colors[0]}40, ${colors[1]}20, #000000 80%)`,
        boxShadow: `inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.5)`
      }}
      title={crop.name}
    >
      {imgSrc ? (
        <img src={imgSrc} alt={crop.name} width={s.img} height={s.img} className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] z-10 p-1" style={crop.id === 'pineapple-premium' ? { transform: 'scale(1.35)' } : undefined} />
      ) : (
        <span className="text-2xl sm:text-4xl z-10">{crop.icon || '📦'}</span>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </div>
  );
};

export { CROP_COLORS, CROP_IMAGES };
