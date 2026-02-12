
import { Crop } from './types';




const generateHistory = (base: number) => {
  const start = new Date(2024, 0, 1); // Jan 1, 2024
  const end = new Date(2026, 11, 31); // Dec 31, 2026
  const dayStep = 7; // weekly points
  const data: { date: string; price: number }[] = [];
  let idx = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + dayStep)) {
    // mild seasonality (annual) plus some slower trend and noise
    const monthsFromStart = (d.getFullYear() - start.getFullYear()) * 12 + d.getMonth() - start.getMonth();
    const seasonal = Math.sin((monthsFromStart / 12) * Math.PI * 2) * 0.06; // annual seasonality ±6%
    const trend = Math.sin(idx / 200) * 0.02; // slow oscillation ±2%
    const noise = (Math.random() - 0.5) * 0.08; // random noise up to ±8%
    const price = Math.round((base * (1 + seasonal + trend + noise)) * 100) / 100;
    data.push({ date: `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`, price });
    idx += 1;
  }
  return data;
};

/**
 * SHOP DIRECTORY:
 * 
 * FRUIT SPECIALISTS (v_fruit_1-4)
 * VEGETABLE/SPICE/ROOT SPECIALISTS (v_veg_1-4)
 */

export const MOCK_CROPS: Crop[] = [
  // --- FRUITS ---
  {
    id: 'pineapple-premium',
    name: 'Pineapple (Formosa)',
    category: 'Fruit',
    currentPrice: 120,
    change24h: 3.2,
    history: generateHistory(120),
    demand: 'High',
    icon: '🍍',
    weightPerUnit: 1.8,
    vendors: [
      { id: 'v_fruit_3', name: 'Tropical Oasis', rating: 4.9, reviewCount: 42, specialty: 'Exotic Delights', price: 110, stock: 150, isHot: true },
      { id: 'v_fruit_1', name: 'The Fruit Basket', rating: 4.8, reviewCount: 120, specialty: 'Premium Fruits', price: 125, stock: 80 }
    ]
  },
  {
    id: 'watermelon',
    name: 'Seedless Watermelon',
    category: 'Fruit',
    currentPrice: 45,
    change24h: 1.8,
    history: generateHistory(45),
    demand: 'High',
    icon: '🍉',
    weightPerUnit: 5.0,
    vendors: [
      { id: 'v_fruit_2', name: 'Sweet Harvest', rating: 4.5, reviewCount: 85, specialty: 'Direct Orchard', price: 42, stock: 200 },
      { id: 'v_fruit_4', name: 'Sun-Kissed Orchard', rating: 4.6, reviewCount: 75, specialty: 'Seasonal Picks', price: 48, stock: 300 }
    ]
  },
  {
    id: 'strawberry',
    name: 'Baguio Strawberries',
    category: 'Fruit',
    currentPrice: 480,
    change24h: -2.4,
    history: generateHistory(480),
    demand: 'Medium',
    icon: '🍓',
    weightPerUnit: 0.25,
    vendors: [
      { id: 'v_fruit_1', name: 'The Fruit Basket', rating: 4.8, reviewCount: 120, specialty: 'Premium Fruits', price: 460, stock: 40, isHot: true },
      { id: 'v_fruit_3', name: 'Tropical Oasis', rating: 4.9, reviewCount: 42, specialty: 'Exotic Delights', price: 500, stock: 20 }
    ]
  },
  {
    id: 'avocado',
    name: 'Hass Avocado',
    category: 'Fruit',
    currentPrice: 220,
    change24h: 4.2,
    history: generateHistory(220),
    demand: 'High',
    icon: '🥑',
    weightPerUnit: 0.3,
    vendors: [
      { id: 'v_fruit_1', name: 'The Fruit Basket', rating: 4.8, reviewCount: 120, specialty: 'Premium Fruits', price: 215, stock: 40, isHot: true },
      { id: 'v_fruit_4', name: 'Sun-Kissed Orchard', rating: 4.6, reviewCount: 75, specialty: 'Seasonal Picks', price: 230, stock: 60 }
    ]
  },
  {
    id: 'pomelo',
    name: 'Davao Pomelo',
    category: 'Fruit',
    currentPrice: 130,
    change24h: -1.5,
    history: generateHistory(130),
    demand: 'Medium',
    icon: '🍈',
    weightPerUnit: 1.2,
    vendors: [
      { id: 'v_fruit_3', name: 'Tropical Oasis', rating: 4.9, reviewCount: 42, specialty: 'Exotic Delights', price: 125, stock: 100 },
      { id: 'v_fruit_2', name: 'Sweet Harvest', rating: 4.5, reviewCount: 85, specialty: 'Direct Orchard', price: 135, stock: 150 }
    ]
  },
  {
    id: 'mango-carabao',
    name: 'Carabao Mango',
    category: 'Fruit',
    currentPrice: 150,
    change24h: 5.2,
    history: generateHistory(150),
    demand: 'High',
    icon: '🥭',
    weightPerUnit: 0.25,
    vendors: [
      { id: 'v_fruit_1', name: 'The Fruit Basket', rating: 4.8, reviewCount: 120, specialty: 'Premium Fruits', price: 145, stock: 100, isHot: true },
      { id: 'v_fruit_2', name: 'Sweet Harvest', rating: 4.5, reviewCount: 85, specialty: 'Direct Orchard', price: 155, stock: 200 }
    ]
  },

  // --- VEGETABLES ---
  {
    id: 'tomato-native',
    name: 'Native Tomato',
    category: 'Vegetable',
    currentPrice: 65,
    change24h: 12.4,
    history: generateHistory(65),
    demand: 'High',
    icon: '🍅',
    weightPerUnit: 0.08,
    vendors: [
      { id: 'v_veg_1', name: 'Veggies Plus', rating: 4.7, reviewCount: 156, specialty: 'Highland Greens', price: 60, stock: 500 },
      { id: 'v_veg_2', name: 'Farm Fresh Greens', rating: 4.4, reviewCount: 92, specialty: 'Hydroponics Specialist', price: 70, stock: 400 }
    ]
  },
  {
    id: 'cabbage-rare',
    name: 'Scorpio Cabbage',
    category: 'Vegetable',
    currentPrice: 85,
    change24h: -4.2,
    history: generateHistory(85),
    demand: 'Medium',
    icon: '🥬',
    weightPerUnit: 1.5,
    vendors: [
      { id: 'v_veg_4', name: 'Highland Harvest', rating: 4.8, reviewCount: 110, specialty: 'Mountain Fresh', price: 80, stock: 600, isHot: true },
      { id: 'v_veg_1', name: 'Veggies Plus', rating: 4.7, reviewCount: 156, specialty: 'Highland Greens', price: 90, stock: 450 }
    ]
  },
  {
    id: 'okra',
    name: 'Fresh Okra',
    category: 'Vegetable',
    currentPrice: 55,
    change24h: 1.1,
    history: generateHistory(55),
    demand: 'High',
    icon: '🥒',
    weightPerUnit: 0.02,
    vendors: [
      { id: 'v_veg_2', name: 'Farm Fresh Greens', rating: 4.4, reviewCount: 92, specialty: 'Hydroponics Specialist', price: 50, stock: 800 },
      { id: 'v_veg_3', name: 'Root & Stem', rating: 4.6, reviewCount: 310, specialty: 'Bulk Root Crops', price: 58, stock: 1200 }
    ]
  },
  {
    id: 'eggplant',
    name: 'Long Eggplant',
    category: 'Vegetable',
    currentPrice: 90,
    change24h: 3.5,
    history: generateHistory(90),
    demand: 'High',
    icon: '🍆',
    weightPerUnit: 0.2,
    vendors: [
      { id: 'v_veg_1', name: 'Veggies Plus', rating: 4.7, reviewCount: 156, specialty: 'Highland Greens', price: 85, stock: 1200 },
      { id: 'v_veg_3', name: 'Root & Stem', rating: 4.6, reviewCount: 310, specialty: 'Bulk Root Crops', price: 95, stock: 1000 }
    ]
  },

  // --- SPICES ---
  {
    id: 'garlic-ilocos',
    name: 'Ilocos Garlic',
    category: 'Spice',
    currentPrice: 180,
    change24h: 2.5,
    history: generateHistory(180),
    demand: 'High',
    icon: '🧄',
    weightPerUnit: 0.05,
    vendors: [
      { id: 'v_veg_3', name: 'Root & Stem', rating: 4.6, reviewCount: 310, specialty: 'Bulk Root Crops', price: 175, stock: 500, isHot: true },
      { id: 'v_veg_1', name: 'Veggies Plus', rating: 4.7, reviewCount: 156, specialty: 'Highland Greens', price: 190, stock: 300 }
    ]
  },
  {
    id: 'onion-red',
    name: 'Red Onion',
    category: 'Spice',
    currentPrice: 160,
    change24h: -15.4,
    history: generateHistory(160),
    demand: 'High',
    icon: '🧅',
    weightPerUnit: 0.1,
    vendors: [
      { id: 'v_veg_3', name: 'Root & Stem', rating: 4.6, reviewCount: 310, specialty: 'Bulk Root Crops', price: 150, stock: 2000 },
      { id: 'v_veg_2', name: 'Farm Fresh Greens', rating: 4.4, reviewCount: 92, specialty: 'Hydroponics Specialist', price: 170, stock: 1500 }
    ]
  },
  {
    id: 'ginger',
    name: 'Yellow Ginger',
    category: 'Spice',
    currentPrice: 110,
    change24h: 4.8,
    history: generateHistory(110),
    demand: 'Medium',
    icon: '🫚',
    weightPerUnit: 0.1,
    vendors: [
      { id: 'v_veg_3', name: 'Root & Stem', rating: 4.6, reviewCount: 310, specialty: 'Bulk Root Crops', price: 105, stock: 800 },
      { id: 'v_veg_4', name: 'Highland Harvest', rating: 4.8, reviewCount: 110, specialty: 'Mountain Fresh', price: 120, stock: 400 }
    ]
  },
  {
    id: 'chili-labuyo',
    name: 'Siling Labuyo',
    category: 'Spice',
    currentPrice: 350,
    change24h: 18.2,
    history: generateHistory(350),
    demand: 'High',
    icon: '🌶️',
    weightPerUnit: 0.005,
    vendors: [
      { id: 'v_veg_1', name: 'Veggies Plus', rating: 4.7, reviewCount: 156, specialty: 'Highland Greens', price: 340, stock: 50, isHot: true },
      { id: 'v_veg_4', name: 'Highland Harvest', rating: 4.8, reviewCount: 110, specialty: 'Mountain Fresh', price: 370, stock: 30 }
    ]
  },

  // --- ROOTS ---
  {
    id: 'potato-baguio',
    name: 'Granola Potato',
    category: 'Root',
    currentPrice: 95,
    change24h: -2.1,
    history: generateHistory(95),
    demand: 'High',
    icon: '🥔',
    weightPerUnit: 0.15,
    vendors: [
      { id: 'v_veg_4', name: 'Highland Harvest', rating: 4.8, reviewCount: 110, specialty: 'Mountain Fresh', price: 90, stock: 2000, isHot: true },
      { id: 'v_veg_3', name: 'Root & Stem', rating: 4.6, reviewCount: 310, specialty: 'Bulk Root Crops', price: 100, stock: 1500 }
    ]
  },
  {
    id: 'carrots-premium',
    name: 'Highland Carrots',
    category: 'Root',
    currentPrice: 110,
    change24h: 5.6,
    history: generateHistory(110),
    demand: 'High',
    icon: '🥕',
    weightPerUnit: 0.12,
    vendors: [
      { id: 'v_veg_4', name: 'Highland Harvest', rating: 4.8, reviewCount: 110, specialty: 'Mountain Fresh', price: 105, stock: 1200 },
      { id: 'v_veg_1', name: 'Veggies Plus', rating: 4.7, reviewCount: 156, specialty: 'Highland Greens', price: 115, stock: 800 }
    ]
  },
  {
    id: 'sweet-potato',
    name: 'Yellow Kamote',
    category: 'Root',
    currentPrice: 55,
    change24h: 0.8,
    history: generateHistory(55),
    demand: 'Medium',
    icon: '🍠',
    weightPerUnit: 0.2,
    vendors: [
      { id: 'v_veg_3', name: 'Root & Stem', rating: 4.6, reviewCount: 310, specialty: 'Bulk Root Crops', price: 50, stock: 3000 },
      { id: 'v_veg_2', name: 'Farm Fresh Greens', rating: 4.4, reviewCount: 92, specialty: 'Hydroponics Specialist', price: 60, stock: 1000 }
    ]
  },
  {
    id: 'cassava',
    name: 'Fresh Cassava',
    category: 'Root',
    currentPrice: 40,
    change24h: -1.2,
    history: generateHistory(40),
    demand: 'Low',
    icon: '🪵',
    weightPerUnit: 0.8,
    vendors: [
      { id: 'v_veg_3', name: 'Root & Stem', rating: 4.6, reviewCount: 310, specialty: 'Bulk Root Crops', price: 38, stock: 5000 },
      { id: 'v_veg_2', name: 'Farm Fresh Greens', rating: 4.4, reviewCount: 92, specialty: 'Hydroponics Specialist', price: 42, stock: 2000 }
    ]
  },
  {
    id: 'taro-gabi',
    name: 'Gabi (Taro)',
    category: 'Root',
    currentPrice: 75,
    change24h: 3.4,
    history: generateHistory(75),
    demand: 'Medium',
    icon: '🪴',
    weightPerUnit: 0.4,
    vendors: [
      { id: 'v_veg_3', name: 'Root & Stem', rating: 4.6, reviewCount: 310, specialty: 'Bulk Root Crops', price: 70, stock: 1500 },
      { id: 'v_veg_4', name: 'Highland Harvest', rating: 4.8, reviewCount: 110, specialty: 'Mountain Fresh', price: 80, stock: 800 }
    ]
  }
];
