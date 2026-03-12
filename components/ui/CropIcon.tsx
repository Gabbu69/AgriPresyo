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
  'okra': ['#86efac', '#22c55e'],
  'eggplant': ['#a855f7', '#7e22ce'],
  'kangkong': ['#34d399', '#059669'],
  'ampalaya': ['#22d3ee', '#0891b2'],
  'sitaw': ['#6ee7b7', '#10b981'],
  'pechay': ['#a3e635', '#84cc16'],
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
};

export const CropIcon = ({ crop, size = 'md' }: { crop: Crop, size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const colors = CROP_COLORS[crop.id] || ['#6b7280', '#374151'];
  const imgSrc = CROP_IMAGES[crop.id];
  const sizeMap: Record<string, { box: string, img: number }> = {
    sm: { box: 'w-10 h-10', img: 24 },
    md: { box: 'w-14 h-14', img: 32 },
    lg: { box: 'w-16 h-16', img: 40 },
    xl: { box: 'w-28 h-28', img: 72 },
  };
  const s = sizeMap[size];
  return (
    <div
      className={`${s.box} rounded-2xl flex items-center justify-center shadow-lg shrink-0 select-none border border-white/10`}
      style={{ background: `linear-gradient(135deg, ${colors[0]}33, ${colors[1]}33)` }}
      title={crop.name}
    >
      {imgSrc ? (
        <img src={imgSrc} alt={crop.name} width={s.img} height={s.img} className="object-contain drop-shadow-md" />
      ) : (
        <span className="text-2xl sm:text-4xl">{crop.icon || '📦'}</span>
      )}
    </div>
  );
};

export { CROP_COLORS, CROP_IMAGES };
