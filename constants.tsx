
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
 * FRUIT SPECIALISTS (v_fruit_1-6)
 *   v_fruit_1 — Aling Nena's Prutas
 *   v_fruit_2 — Mang Tomas Fruits
 *   v_fruit_3 — Nanay Coring's Tropicals
 *   v_fruit_4 — Kuya Jun's Farm
 *   v_fruit_5 — Tita Merly's Orchard
 *   v_fruit_6 — Lolo Pepe's Harvest
 *
 * VEGETABLE / SPICE / ROOT SPECIALISTS (v_veg_1-6)
 *   v_veg_1 — Aling Rosa's Gulay
 *   v_veg_2 — Mang Erning's Palengke
 *   v_veg_3 — Nanay Linda's Ugat
 *   v_veg_4 — Kuya Ben's Highland
 *   v_veg_5 — Ate Bing's Garden
 *   v_veg_6 — Tatay Romy's Farm Fresh
 */

export const MOCK_CROPS: Crop[] = [
  // --- FRUITS ---
  {
    id: 'pineapple-premium',
    name: 'Pineapple (Formosa)',
    category: 'Fruit',
    currentPrice: 120,
    change7d: 3.2,
    history: generateHistory(120),
    demand: 'High',
    icon: '🍍',
    weightPerUnit: 1.8,
    vendors: [
      { id: 'v_fruit_3', name: 'Nanay Coring\'s Tropicals', rating: 4.9, reviewCount: 42, specialty: 'Masarap na Tropikal', price: 110, stock: 150, isHot: true, openTime: '05:00', closeTime: '17:00' },
      { id: 'v_fruit_1', name: 'Aling Nena\'s Prutas', rating: 4.8, reviewCount: 120, specialty: 'Sariwang Prutas', price: 125, stock: 80, openTime: '05:30', closeTime: '18:00' },
      { id: 'v_fruit_5', name: 'Tita Merly\'s Orchard', rating: 4.7, reviewCount: 64, specialty: 'Prutas na De-Kalidad', price: 118, stock: 95, openTime: '06:00', closeTime: '16:00' },
      { id: 'v_fruit_6', name: 'Lolo Pepe\'s Harvest', rating: 4.5, reviewCount: 38, specialty: 'Bagong-Pitas na Prutas', price: 130, stock: 60, openTime: '04:30', closeTime: '14:00' }
    ]
  },
  {
    id: 'watermelon',
    name: 'Seedless Watermelon',
    category: 'Fruit',
    currentPrice: 45,
    change7d: 1.8,
    history: generateHistory(45),
    demand: 'High',
    icon: '🍉',
    weightPerUnit: 5.0,
    vendors: [
      { id: 'v_fruit_2', name: 'Mang Tomas Fruits', rating: 4.5, reviewCount: 85, specialty: 'Taga-Bukid na Prutas', price: 42, stock: 200, openTime: '05:00', closeTime: '17:30' },
      { id: 'v_fruit_4', name: 'Kuya Jun\'s Farm', rating: 4.6, reviewCount: 75, specialty: 'Piling-Pili na Ani', price: 48, stock: 300, openTime: '06:00', closeTime: '18:00' },
      { id: 'v_fruit_6', name: 'Lolo Pepe\'s Harvest', rating: 4.5, reviewCount: 38, specialty: 'Bagong-Pitas na Prutas', price: 44, stock: 250, openTime: '04:30', closeTime: '14:00' }
    ]
  },
  {
    id: 'strawberry',
    name: 'Baguio Strawberries',
    category: 'Fruit',
    currentPrice: 480,
    change7d: -2.4,
    history: generateHistory(480),
    demand: 'Medium',
    icon: '🍓',
    weightPerUnit: 0.25,
    vendors: [
      { id: 'v_fruit_1', name: 'Aling Nena\'s Prutas', rating: 4.8, reviewCount: 120, specialty: 'Sariwang Prutas', price: 460, stock: 40, isHot: true, openTime: '05:30', closeTime: '18:00' },
      { id: 'v_fruit_3', name: 'Nanay Coring\'s Tropicals', rating: 4.9, reviewCount: 42, specialty: 'Masarap na Tropikal', price: 500, stock: 20, openTime: '05:00', closeTime: '17:00' },
      { id: 'v_fruit_5', name: 'Tita Merly\'s Orchard', rating: 4.7, reviewCount: 64, specialty: 'Prutas na De-Kalidad', price: 475, stock: 35, openTime: '06:00', closeTime: '16:00' }
    ]
  },
  {
    id: 'avocado',
    name: 'Hass Avocado',
    category: 'Fruit',
    currentPrice: 220,
    change7d: 4.2,
    history: generateHistory(220),
    demand: 'High',
    icon: '🥑',
    weightPerUnit: 0.3,
    vendors: [
      { id: 'v_fruit_1', name: 'Aling Nena\'s Prutas', rating: 4.8, reviewCount: 120, specialty: 'Sariwang Prutas', price: 215, stock: 40, isHot: true, openTime: '05:30', closeTime: '18:00' },
      { id: 'v_fruit_4', name: 'Kuya Jun\'s Farm', rating: 4.6, reviewCount: 75, specialty: 'Piling-Pili na Ani', price: 230, stock: 60, openTime: '06:00', closeTime: '18:00' },
      { id: 'v_fruit_5', name: 'Tita Merly\'s Orchard', rating: 4.7, reviewCount: 64, specialty: 'Prutas na De-Kalidad', price: 222, stock: 50, openTime: '06:00', closeTime: '16:00' },
      { id: 'v_fruit_6', name: 'Lolo Pepe\'s Harvest', rating: 4.5, reviewCount: 38, specialty: 'Bagong-Pitas na Prutas', price: 235, stock: 30, openTime: '04:30', closeTime: '14:00' }
    ]
  },
  {
    id: 'pomelo',
    name: 'Davao Pomelo',
    category: 'Fruit',
    currentPrice: 130,
    change7d: -1.5,
    history: generateHistory(130),
    demand: 'Medium',
    icon: '🍊',
    weightPerUnit: 1.2,
    vendors: [
      { id: 'v_fruit_3', name: 'Nanay Coring\'s Tropicals', rating: 4.9, reviewCount: 42, specialty: 'Masarap na Tropikal', price: 125, stock: 100, openTime: '05:00', closeTime: '17:00' },
      { id: 'v_fruit_2', name: 'Mang Tomas Fruits', rating: 4.5, reviewCount: 85, specialty: 'Taga-Bukid na Prutas', price: 135, stock: 150, openTime: '05:00', closeTime: '17:30' },
      { id: 'v_fruit_6', name: 'Lolo Pepe\'s Harvest', rating: 4.5, reviewCount: 38, specialty: 'Bagong-Pitas na Prutas', price: 128, stock: 80, openTime: '04:30', closeTime: '14:00' }
    ]
  },
  {
    id: 'mango-carabao',
    name: 'Carabao Mango',
    category: 'Fruit',
    currentPrice: 150,
    change7d: 5.2,
    history: generateHistory(150),
    demand: 'High',
    icon: '🥭',
    weightPerUnit: 0.25,
    vendors: [
      { id: 'v_fruit_1', name: 'Aling Nena\'s Prutas', rating: 4.8, reviewCount: 120, specialty: 'Sariwang Prutas', price: 145, stock: 100, isHot: true, openTime: '05:30', closeTime: '18:00' },
      { id: 'v_fruit_2', name: 'Mang Tomas Fruits', rating: 4.5, reviewCount: 85, specialty: 'Taga-Bukid na Prutas', price: 155, stock: 200, openTime: '05:00', closeTime: '17:30' },
      { id: 'v_fruit_5', name: 'Tita Merly\'s Orchard', rating: 4.7, reviewCount: 64, specialty: 'Prutas na De-Kalidad', price: 148, stock: 120, openTime: '06:00', closeTime: '16:00' },
      { id: 'v_fruit_6', name: 'Lolo Pepe\'s Harvest', rating: 4.5, reviewCount: 38, specialty: 'Bagong-Pitas na Prutas', price: 158, stock: 90, openTime: '04:30', closeTime: '14:00' }
    ]
  },
  {
    id: 'banana-lakatan',
    name: 'Lakatan Banana',
    category: 'Fruit',
    currentPrice: 80,
    change7d: 2.1,
    history: generateHistory(80),
    demand: 'High',
    icon: '🍌',
    weightPerUnit: 0.15,
    vendors: [
      { id: 'v_fruit_2', name: 'Mang Tomas Fruits', rating: 4.5, reviewCount: 85, specialty: 'Taga-Bukid na Prutas', price: 75, stock: 500, openTime: '05:00', closeTime: '17:30' },
      { id: 'v_fruit_4', name: 'Kuya Jun\'s Farm', rating: 4.6, reviewCount: 75, specialty: 'Piling-Pili na Ani', price: 85, stock: 400, openTime: '06:00', closeTime: '18:00' },
      { id: 'v_fruit_6', name: 'Lolo Pepe\'s Harvest', rating: 4.5, reviewCount: 38, specialty: 'Bagong-Pitas na Prutas', price: 78, stock: 350, openTime: '04:30', closeTime: '14:00' }
    ]
  },
  {
    id: 'calamansi',
    name: 'Calamansi',
    category: 'Fruit',
    currentPrice: 100,
    change7d: -3.1,
    history: generateHistory(100),
    demand: 'High',
    icon: '🟢',
    weightPerUnit: 0.03,
    vendors: [
      { id: 'v_fruit_3', name: 'Nanay Coring\'s Tropicals', rating: 4.9, reviewCount: 42, specialty: 'Masarap na Tropikal', price: 95, stock: 600, openTime: '05:00', closeTime: '17:00' },
      { id: 'v_fruit_1', name: 'Aling Nena\'s Prutas', rating: 4.8, reviewCount: 120, specialty: 'Sariwang Prutas', price: 108, stock: 350, openTime: '05:30', closeTime: '18:00' },
      { id: 'v_fruit_5', name: 'Tita Merly\'s Orchard', rating: 4.7, reviewCount: 64, specialty: 'Prutas na De-Kalidad', price: 100, stock: 400, openTime: '06:00', closeTime: '16:00' }
    ]
  },
  {
    id: 'papaya',
    name: 'Solo Papaya',
    category: 'Fruit',
    currentPrice: 60,
    change7d: 1.5,
    history: generateHistory(60),
    demand: 'Medium',
    icon: '🟠',
    weightPerUnit: 1.0,
    vendors: [
      { id: 'v_fruit_4', name: 'Kuya Jun\'s Farm', rating: 4.6, reviewCount: 75, specialty: 'Piling-Pili na Ani', price: 55, stock: 250, openTime: '06:00', closeTime: '18:00' },
      { id: 'v_fruit_2', name: 'Mang Tomas Fruits', rating: 4.5, reviewCount: 85, specialty: 'Taga-Bukid na Prutas', price: 65, stock: 180, openTime: '05:00', closeTime: '17:30' },
      { id: 'v_fruit_5', name: 'Tita Merly\'s Orchard', rating: 4.7, reviewCount: 64, specialty: 'Prutas na De-Kalidad', price: 58, stock: 200, openTime: '06:00', closeTime: '16:00' },
      { id: 'v_fruit_6', name: 'Lolo Pepe\'s Harvest', rating: 4.5, reviewCount: 38, specialty: 'Bagong-Pitas na Prutas', price: 62, stock: 150, openTime: '04:30', closeTime: '14:00' }
    ]
  },
  {
    id: 'coconut',
    name: 'Buko (Young Coconut)',
    category: 'Fruit',
    currentPrice: 35,
    change7d: 0.5,
    history: generateHistory(35),
    demand: 'High',
    icon: '🥥',
    weightPerUnit: 1.5,
    vendors: [
      { id: 'v_fruit_3', name: 'Nanay Coring\'s Tropicals', rating: 4.9, reviewCount: 42, specialty: 'Masarap na Tropikal', price: 30, stock: 400, isHot: true, openTime: '05:00', closeTime: '17:00' },
      { id: 'v_fruit_4', name: 'Kuya Jun\'s Farm', rating: 4.6, reviewCount: 75, specialty: 'Piling-Pili na Ani', price: 38, stock: 300, openTime: '06:00', closeTime: '18:00' },
      { id: 'v_fruit_6', name: 'Lolo Pepe\'s Harvest', rating: 4.5, reviewCount: 38, specialty: 'Bagong-Pitas na Prutas', price: 34, stock: 220, openTime: '04:30', closeTime: '14:00' }
    ]
  },
  {
    id: 'rambutan',
    name: 'Rambutan',
    category: 'Fruit',
    currentPrice: 80,
    change7d: 1.5,
    history: generateHistory(80),
    demand: 'High',
    icon: '🔴',
    weightPerUnit: 1.0,
    vendors: [
      { id: 'v_fruit_1', name: 'Aling Nena\'s Prutas', rating: 4.8, reviewCount: 120, specialty: 'Sariwang Prutas', price: 75, stock: 100, openTime: '05:30', closeTime: '18:00' },
      { id: 'v_fruit_3', name: 'Nanay Coring\'s Tropicals', rating: 4.9, reviewCount: 42, specialty: 'Masarap na Tropikal', price: 85, stock: 150, openTime: '05:00', closeTime: '17:00' }
    ]
  },
  {
    id: 'lanzones',
    name: 'Lanzones',
    category: 'Fruit',
    currentPrice: 100,
    change7d: -2.0,
    history: generateHistory(100),
    demand: 'Medium',
    icon: '🟡',
    weightPerUnit: 1.0,
    vendors: [
      { id: 'v_fruit_2', name: 'Mang Tomas Fruits', rating: 4.5, reviewCount: 85, specialty: 'Taga-Bukid na Prutas', price: 95, stock: 80, openTime: '05:00', closeTime: '17:30' },
      { id: 'v_fruit_4', name: 'Kuya Jun\'s Farm', rating: 4.6, reviewCount: 75, specialty: 'Piling-Pili na Ani', price: 105, stock: 120, openTime: '06:00', closeTime: '18:00' }
    ]
  },

  // --- VEGETABLES ---
  {
    id: 'tomato-native',
    name: 'Native Tomato',
    category: 'Vegetable',
    currentPrice: 65,
    change7d: 12.4,
    history: generateHistory(65),
    demand: 'High',
    icon: '🍅',
    weightPerUnit: 0.08,
    vendors: [
      { id: 'v_veg_1', name: 'Aling Rosa\'s Gulay', rating: 4.7, reviewCount: 156, specialty: 'Gulay ng Bundok', price: 60, stock: 500, openTime: '04:00', closeTime: '16:00' },
      { id: 'v_veg_2', name: 'Mang Erning\'s Palengke', rating: 4.4, reviewCount: 92, specialty: 'Sariwang Gulay', price: 70, stock: 400, openTime: '05:00', closeTime: '17:00' },
      { id: 'v_veg_5', name: 'Ate Bing\'s Garden', rating: 4.6, reviewCount: 78, specialty: 'Organikong Gulay', price: 63, stock: 350, openTime: '06:00', closeTime: '15:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 68, stock: 280, openTime: '04:30', closeTime: '13:00' }
    ]
  },
  {
    id: 'cabbage-rare',
    name: 'Scorpio Cabbage',
    category: 'Vegetable',
    currentPrice: 85,
    change7d: -4.2,
    history: generateHistory(85),
    demand: 'Medium',
    icon: '🥬',
    weightPerUnit: 1.5,
    vendors: [
      { id: 'v_veg_4', name: 'Kuya Ben\'s Highland', rating: 4.8, reviewCount: 110, specialty: 'Sariwa mula Bundok', price: 80, stock: 600, isHot: true, openTime: '05:30', closeTime: '16:30' },
      { id: 'v_veg_1', name: 'Aling Rosa\'s Gulay', rating: 4.7, reviewCount: 156, specialty: 'Gulay ng Bundok', price: 90, stock: 450, openTime: '04:00', closeTime: '16:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 84, stock: 380, openTime: '04:30', closeTime: '13:00' }
    ]
  },
  {
    id: 'okra',
    name: 'Okra',
    category: 'Vegetable',
    currentPrice: 55,
    change7d: 1.1,
    history: generateHistory(55),
    demand: 'High',
    icon: '🫛',
    weightPerUnit: 0.02,
    vendors: [
      { id: 'v_veg_2', name: 'Mang Erning\'s Palengke', rating: 4.4, reviewCount: 92, specialty: 'Sariwang Gulay', price: 50, stock: 800, openTime: '05:00', closeTime: '17:00' },
      { id: 'v_veg_3', name: 'Nanay Linda\'s Ugat', rating: 4.6, reviewCount: 310, specialty: 'Halamang-Ugat', price: 58, stock: 1200, openTime: '03:30', closeTime: '15:00' },
      { id: 'v_veg_5', name: 'Ate Bing\'s Garden', rating: 4.6, reviewCount: 78, specialty: 'Organikong Gulay', price: 53, stock: 650, openTime: '06:00', closeTime: '15:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 56, stock: 700, openTime: '04:30', closeTime: '13:00' }
    ]
  },
  {
    id: 'eggplant',
    name: 'Long Eggplant',
    category: 'Vegetable',
    currentPrice: 90,
    change7d: 3.5,
    history: generateHistory(90),
    demand: 'High',
    icon: '🍆',
    weightPerUnit: 0.2,
    vendors: [
      { id: 'v_veg_1', name: 'Aling Rosa\'s Gulay', rating: 4.7, reviewCount: 156, specialty: 'Gulay ng Bundok', price: 85, stock: 1200, openTime: '04:00', closeTime: '16:00' },
      { id: 'v_veg_3', name: 'Nanay Linda\'s Ugat', rating: 4.6, reviewCount: 310, specialty: 'Halamang-Ugat', price: 95, stock: 1000, openTime: '03:30', closeTime: '15:00' },
      { id: 'v_veg_5', name: 'Ate Bing\'s Garden', rating: 4.6, reviewCount: 78, specialty: 'Organikong Gulay', price: 88, stock: 900, openTime: '06:00', closeTime: '15:00' }
    ]
  },
  {
    id: 'kangkong',
    name: 'Kangkong (Water Spinach)',
    category: 'Vegetable',
    currentPrice: 30,
    change7d: 0.4,
    history: generateHistory(30),
    demand: 'High',
    icon: '🌱',
    weightPerUnit: 0.15,
    vendors: [
      { id: 'v_veg_1', name: 'Aling Rosa\'s Gulay', rating: 4.7, reviewCount: 156, specialty: 'Gulay ng Bundok', price: 25, stock: 1500, openTime: '04:00', closeTime: '16:00' },
      { id: 'v_veg_2', name: 'Mang Erning\'s Palengke', rating: 4.4, reviewCount: 92, specialty: 'Sariwang Gulay', price: 35, stock: 1200, openTime: '05:00', closeTime: '17:00' },
      { id: 'v_veg_5', name: 'Ate Bing\'s Garden', rating: 4.6, reviewCount: 78, specialty: 'Organikong Gulay', price: 28, stock: 1100, openTime: '06:00', closeTime: '15:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 32, stock: 900, openTime: '04:30', closeTime: '13:00' }
    ]
  },
  {
    id: 'ampalaya',
    name: 'Ampalaya (Bitter Gourd)',
    category: 'Vegetable',
    currentPrice: 120,
    change7d: 6.7,
    history: generateHistory(120),
    demand: 'Medium',
    icon: '🫑',
    weightPerUnit: 0.2,
    vendors: [
      { id: 'v_veg_4', name: 'Kuya Ben\'s Highland', rating: 4.8, reviewCount: 110, specialty: 'Sariwa mula Bundok', price: 115, stock: 400, openTime: '05:30', closeTime: '16:30' },
      { id: 'v_veg_1', name: 'Aling Rosa\'s Gulay', rating: 4.7, reviewCount: 156, specialty: 'Gulay ng Bundok', price: 125, stock: 350, openTime: '04:00', closeTime: '16:00' },
      { id: 'v_veg_5', name: 'Ate Bing\'s Garden', rating: 4.6, reviewCount: 78, specialty: 'Organikong Gulay', price: 118, stock: 300, openTime: '06:00', closeTime: '15:00' }
    ]
  },
  {
    id: 'sitaw',
    name: 'Sitaw (String Beans)',
    category: 'Vegetable',
    currentPrice: 75,
    change7d: -1.8,
    history: generateHistory(75),
    demand: 'High',
    icon: '🫘',
    weightPerUnit: 0.05,
    vendors: [
      { id: 'v_veg_2', name: 'Mang Erning\'s Palengke', rating: 4.4, reviewCount: 92, specialty: 'Sariwang Gulay', price: 70, stock: 900, openTime: '05:00', closeTime: '17:00' },
      { id: 'v_veg_3', name: 'Nanay Linda\'s Ugat', rating: 4.6, reviewCount: 310, specialty: 'Halamang-Ugat', price: 80, stock: 700, openTime: '03:30', closeTime: '15:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 73, stock: 600, openTime: '04:30', closeTime: '13:00' }
    ]
  },
  {
    id: 'pechay',
    name: 'Pechay (Bok Choy)',
    category: 'Vegetable',
    currentPrice: 45,
    change7d: 2.3,
    history: generateHistory(45),
    demand: 'High',
    icon: '🥗',
    weightPerUnit: 0.2,
    vendors: [
      { id: 'v_veg_1', name: 'Aling Rosa\'s Gulay', rating: 4.7, reviewCount: 156, specialty: 'Gulay ng Bundok', price: 40, stock: 1000, openTime: '04:00', closeTime: '16:00' },
      { id: 'v_veg_4', name: 'Kuya Ben\'s Highland', rating: 4.8, reviewCount: 110, specialty: 'Sariwa mula Bundok', price: 50, stock: 800, openTime: '05:30', closeTime: '16:30' },
      { id: 'v_veg_5', name: 'Ate Bing\'s Garden', rating: 4.6, reviewCount: 78, specialty: 'Organikong Gulay', price: 43, stock: 750, openTime: '06:00', closeTime: '15:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 48, stock: 600, openTime: '04:30', closeTime: '13:00' }
    ]
  },
  {
    id: 'sayote',
    name: 'Sayote (Chayote)',
    category: 'Vegetable',
    currentPrice: 25,
    change7d: 0.5,
    history: generateHistory(25),
    demand: 'High',
    icon: '🍐',
    weightPerUnit: 0.3,
    vendors: [
      { id: 'v_veg_4', name: 'Kuya Ben\'s Highland', rating: 4.8, reviewCount: 110, specialty: 'Sariwa mula Bundok', price: 20, stock: 500, openTime: '05:30', closeTime: '16:30' },
      { id: 'v_veg_1', name: 'Aling Rosa\'s Gulay', rating: 4.7, reviewCount: 156, specialty: 'Gulay ng Bundok', price: 30, stock: 400, openTime: '04:00', closeTime: '16:00' }
    ]
  },

  // --- VEGETABLES (continued: spices & aromatics) ---
  {
    id: 'garlic-ilocos',
    name: 'Ilocos Garlic',
    category: 'Spice',
    currentPrice: 180,
    change7d: 2.5,
    history: generateHistory(180),
    demand: 'High',
    icon: '🧄',
    weightPerUnit: 0.05,
    vendors: [
      { id: 'v_veg_3', name: 'Nanay Linda\'s Ugat', rating: 4.6, reviewCount: 310, specialty: 'Halamang-Ugat', price: 175, stock: 500, isHot: true, openTime: '03:30', closeTime: '15:00' },
      { id: 'v_veg_1', name: 'Aling Rosa\'s Gulay', rating: 4.7, reviewCount: 156, specialty: 'Gulay ng Bundok', price: 190, stock: 300, openTime: '04:00', closeTime: '16:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 182, stock: 400, openTime: '04:30', closeTime: '13:00' }
    ]
  },
  {
    id: 'onion-red',
    name: 'Red Onion',
    category: 'Spice',
    currentPrice: 160,
    change7d: -15.4,
    history: generateHistory(160),
    demand: 'High',
    icon: '🧅',
    weightPerUnit: 0.1,
    vendors: [
      { id: 'v_veg_3', name: 'Nanay Linda\'s Ugat', rating: 4.6, reviewCount: 310, specialty: 'Halamang-Ugat', price: 150, stock: 2000, openTime: '03:30', closeTime: '15:00' },
      { id: 'v_veg_2', name: 'Mang Erning\'s Palengke', rating: 4.4, reviewCount: 92, specialty: 'Sariwang Gulay', price: 170, stock: 1500, openTime: '05:00', closeTime: '17:00' },
      { id: 'v_veg_5', name: 'Ate Bing\'s Garden', rating: 4.6, reviewCount: 78, specialty: 'Organikong Gulay', price: 158, stock: 1200, openTime: '06:00', closeTime: '15:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 165, stock: 900, openTime: '04:30', closeTime: '13:00' }
    ]
  },
  {
    id: 'ginger',
    name: 'Yellow Ginger',
    category: 'Spice',
    currentPrice: 110,
    change7d: 4.8,
    history: generateHistory(110),
    demand: 'Medium',
    icon: '🫚',
    weightPerUnit: 0.1,
    vendors: [
      { id: 'v_veg_3', name: 'Nanay Linda\'s Ugat', rating: 4.6, reviewCount: 310, specialty: 'Halamang-Ugat', price: 105, stock: 800, openTime: '03:30', closeTime: '15:00' },
      { id: 'v_veg_4', name: 'Kuya Ben\'s Highland', rating: 4.8, reviewCount: 110, specialty: 'Sariwa mula Bundok', price: 120, stock: 400, openTime: '05:30', closeTime: '16:30' },
      { id: 'v_veg_5', name: 'Ate Bing\'s Garden', rating: 4.6, reviewCount: 78, specialty: 'Organikong Gulay', price: 108, stock: 550, openTime: '06:00', closeTime: '15:00' }
    ]
  },
  {
    id: 'chili-labuyo',
    name: 'Siling Labuyo',
    category: 'Spice',
    currentPrice: 350,
    change7d: 18.2,
    history: generateHistory(350),
    demand: 'High',
    icon: '🌶️',
    weightPerUnit: 0.005,
    vendors: [
      { id: 'v_veg_1', name: 'Aling Rosa\'s Gulay', rating: 4.7, reviewCount: 156, specialty: 'Gulay ng Bundok', price: 340, stock: 50, isHot: true, openTime: '04:00', closeTime: '16:00' },
      { id: 'v_veg_4', name: 'Kuya Ben\'s Highland', rating: 4.8, reviewCount: 110, specialty: 'Sariwa mula Bundok', price: 370, stock: 30, openTime: '05:30', closeTime: '16:30' },
      { id: 'v_veg_5', name: 'Ate Bing\'s Garden', rating: 4.6, reviewCount: 78, specialty: 'Organikong Gulay', price: 345, stock: 40, openTime: '06:00', closeTime: '15:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 360, stock: 25, openTime: '04:30', closeTime: '13:00' }
    ]
  },
  {
    id: 'lemongrass',
    name: 'Tanglad (Lemongrass)',
    category: 'Spice',
    currentPrice: 25,
    change7d: 0.9,
    history: generateHistory(25),
    demand: 'Medium',
    icon: '🌿',
    weightPerUnit: 0.05,
    vendors: [
      { id: 'v_veg_4', name: 'Kuya Ben\'s Highland', rating: 4.8, reviewCount: 110, specialty: 'Sariwa mula Bundok', price: 22, stock: 2000, openTime: '05:30', closeTime: '16:30' },
      { id: 'v_veg_2', name: 'Mang Erning\'s Palengke', rating: 4.4, reviewCount: 92, specialty: 'Sariwang Gulay', price: 28, stock: 1500, openTime: '05:00', closeTime: '17:00' },
      { id: 'v_veg_5', name: 'Ate Bing\'s Garden', rating: 4.6, reviewCount: 78, specialty: 'Organikong Gulay', price: 24, stock: 1800, openTime: '06:00', closeTime: '15:00' }
    ]
  },
  {
    id: 'black-pepper',
    name: 'Black Pepper (Paminta)',
    category: 'Spice',
    currentPrice: 400,
    change7d: 5.0,
    history: generateHistory(400),
    demand: 'Medium',
    icon: '⚫',
    weightPerUnit: 0.01,
    vendors: [
      { id: 'v_veg_3', name: 'Nanay Linda\'s Ugat', rating: 4.6, reviewCount: 310, specialty: 'Halamang-Ugat', price: 390, stock: 50, openTime: '03:30', closeTime: '15:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 410, stock: 40, openTime: '04:30', closeTime: '13:00' }
    ]
  },

  // --- VEGETABLES (continued: roots & tubers) ---
  {
    id: 'potato-baguio',
    name: 'Granola Potato',
    category: 'Vegetable',
    currentPrice: 95,
    change7d: -2.1,
    history: generateHistory(95),
    demand: 'High',
    icon: '🥔',
    weightPerUnit: 0.15,
    vendors: [
      { id: 'v_veg_4', name: 'Kuya Ben\'s Highland', rating: 4.8, reviewCount: 110, specialty: 'Sariwa mula Bundok', price: 90, stock: 2000, isHot: true, openTime: '05:30', closeTime: '16:30' },
      { id: 'v_veg_3', name: 'Nanay Linda\'s Ugat', rating: 4.6, reviewCount: 310, specialty: 'Halamang-Ugat', price: 100, stock: 1500, openTime: '03:30', closeTime: '15:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 93, stock: 1200, openTime: '04:30', closeTime: '13:00' }
    ]
  },
  {
    id: 'carrots-premium',
    name: 'Highland Carrots',
    category: 'Vegetable',
    currentPrice: 110,
    change7d: 5.6,
    history: generateHistory(110),
    demand: 'High',
    icon: '🥕',
    weightPerUnit: 0.12,
    vendors: [
      { id: 'v_veg_4', name: 'Kuya Ben\'s Highland', rating: 4.8, reviewCount: 110, specialty: 'Sariwa mula Bundok', price: 105, stock: 1200, openTime: '05:30', closeTime: '16:30' },
      { id: 'v_veg_1', name: 'Aling Rosa\'s Gulay', rating: 4.7, reviewCount: 156, specialty: 'Gulay ng Bundok', price: 115, stock: 800, openTime: '04:00', closeTime: '16:00' },
      { id: 'v_veg_5', name: 'Ate Bing\'s Garden', rating: 4.6, reviewCount: 78, specialty: 'Organikong Gulay', price: 108, stock: 700, openTime: '06:00', closeTime: '15:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 112, stock: 600, openTime: '04:30', closeTime: '13:00' }
    ]
  },
  {
    id: 'sweet-potato',
    name: 'Yellow Kamote',
    category: 'Vegetable',
    currentPrice: 55,
    change7d: 0.8,
    history: generateHistory(55),
    demand: 'Medium',
    icon: '🍠',
    weightPerUnit: 0.2,
    vendors: [
      { id: 'v_veg_3', name: 'Nanay Linda\'s Ugat', rating: 4.6, reviewCount: 310, specialty: 'Halamang-Ugat', price: 50, stock: 3000, openTime: '03:30', closeTime: '15:00' },
      { id: 'v_veg_2', name: 'Mang Erning\'s Palengke', rating: 4.4, reviewCount: 92, specialty: 'Sariwang Gulay', price: 60, stock: 1000, openTime: '05:00', closeTime: '17:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 53, stock: 2000, openTime: '04:30', closeTime: '13:00' }
    ]
  },
  {
    id: 'cassava',
    name: 'Fresh Cassava',
    category: 'Root',
    currentPrice: 40,
    change7d: -1.2,
    history: generateHistory(40),
    demand: 'Low',
    icon: '🪵',
    weightPerUnit: 0.8,
    vendors: [
      { id: 'v_veg_3', name: 'Nanay Linda\'s Ugat', rating: 4.6, reviewCount: 310, specialty: 'Halamang-Ugat', price: 38, stock: 5000, openTime: '03:30', closeTime: '15:00' },
      { id: 'v_veg_2', name: 'Mang Erning\'s Palengke', rating: 4.4, reviewCount: 92, specialty: 'Sariwang Gulay', price: 42, stock: 2000, openTime: '05:00', closeTime: '17:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 39, stock: 3000, openTime: '04:30', closeTime: '13:00' }
    ]
  },
  {
    id: 'taro-gabi',
    name: 'Gabi (Taro)',
    category: 'Root',
    currentPrice: 75,
    change7d: 3.4,
    history: generateHistory(75),
    demand: 'Medium',
    icon: '🟤',
    weightPerUnit: 0.4,
    vendors: [
      { id: 'v_veg_3', name: 'Nanay Linda\'s Ugat', rating: 4.6, reviewCount: 310, specialty: 'Halamang-Ugat', price: 70, stock: 1500, openTime: '03:30', closeTime: '15:00' },
      { id: 'v_veg_4', name: 'Kuya Ben\'s Highland', rating: 4.8, reviewCount: 110, specialty: 'Sariwa mula Bundok', price: 80, stock: 800, openTime: '05:30', closeTime: '16:30' },
      { id: 'v_veg_5', name: 'Ate Bing\'s Garden', rating: 4.6, reviewCount: 78, specialty: 'Organikong Gulay', price: 73, stock: 600, openTime: '06:00', closeTime: '15:00' }
    ]
  },
  {
    id: 'ube',
    name: 'Ube (Purple Yam)',
    category: 'Root',
    currentPrice: 140,
    change7d: 7.3,
    history: generateHistory(140),
    demand: 'High',
    icon: '🍠',
    weightPerUnit: 0.5,
    vendors: [
      { id: 'v_veg_4', name: 'Kuya Ben\'s Highland', rating: 4.8, reviewCount: 110, specialty: 'Sariwa mula Bundok', price: 135, stock: 600, isHot: true, openTime: '05:30', closeTime: '16:30' },
      { id: 'v_veg_3', name: 'Nanay Linda\'s Ugat', rating: 4.6, reviewCount: 310, specialty: 'Halamang-Ugat', price: 145, stock: 450, openTime: '03:30', closeTime: '15:00' },
      { id: 'v_veg_5', name: 'Ate Bing\'s Garden', rating: 4.6, reviewCount: 78, specialty: 'Organikong Gulay', price: 138, stock: 350, openTime: '06:00', closeTime: '15:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 148, stock: 280, openTime: '04:30', closeTime: '13:00' }
    ]
  },
  
  // --- USER REQUESTED VEGETABLES ---
  {
    id: 'upo',
    name: 'Upo (Bottle Gourd)',
    category: 'Vegetable',
    currentPrice: 55,
    change7d: -2.0,
    history: generateHistory(55),
    demand: 'Medium',
    icon: '🥒',
    weightPerUnit: 1.0,
    vendors: [
      { id: 'v_veg_2', name: 'Mang Erning\'s Palengke', rating: 4.4, reviewCount: 92, specialty: 'Sariwang Gulay', price: 50, stock: 120, openTime: '05:00', closeTime: '17:00' },
      { id: 'v_veg_3', name: 'Nanay Linda\'s Ugat', rating: 4.6, reviewCount: 310, specialty: 'Halamang-Ugat', price: 60, stock: 80, openTime: '03:30', closeTime: '15:00' }
    ]
  },
  {
    id: 'kalabasa',
    name: 'Kalabasa (Squash)',
    category: 'Vegetable',
    currentPrice: 50,
    change7d: 1.0,
    history: generateHistory(50),
    demand: 'High',
    icon: '🎃',
    weightPerUnit: 1.5,
    vendors: [
      { id: 'v_veg_4', name: 'Kuya Ben\'s Highland', rating: 4.8, reviewCount: 110, specialty: 'Sariwa mula Bundok', price: 45, stock: 200, openTime: '05:30', closeTime: '16:30' },
      { id: 'v_veg_5', name: 'Ate Bing\'s Garden', rating: 4.6, reviewCount: 78, specialty: 'Organikong Gulay', price: 55, stock: 150, openTime: '06:00', closeTime: '15:00' }
    ]
  },
  {
    id: 'atsal',
    name: 'Atsal (Bell Pepper)',
    category: 'Spice',
    currentPrice: 280,
    change7d: 12.0,
    history: generateHistory(280),
    demand: 'High',
    icon: '🫑',
    weightPerUnit: 0.1,
    vendors: [
      { id: 'v_veg_1', name: 'Aling Rosa\'s Gulay', rating: 4.7, reviewCount: 156, specialty: 'Gulay ng Bundok', price: 270, stock: 150, isHot: true, openTime: '04:00', closeTime: '16:00' },
      { id: 'v_veg_4', name: 'Kuya Ben\'s Highland', rating: 4.8, reviewCount: 110, specialty: 'Sariwa mula Bundok', price: 290, stock: 100, openTime: '05:30', closeTime: '16:30' }
    ]
  },
  {
    id: 'pipino',
    name: 'Pickle',
    category: 'Vegetable',
    currentPrice: 100,
    change7d: 0.0,
    history: generateHistory(100),
    demand: 'Medium',
    icon: '🥒',
    weightPerUnit: 0.25,
    vendors: [
      { id: 'v_veg_3', name: 'Nanay Linda\'s Ugat', rating: 4.6, reviewCount: 310, specialty: 'Halamang-Ugat', price: 95, stock: 200, openTime: '03:30', closeTime: '15:00' },
      { id: 'v_veg_6', name: 'Tatay Romy\'s Farm Fresh', rating: 4.3, reviewCount: 55, specialty: 'Direkta sa Bukid', price: 105, stock: 180, openTime: '04:30', closeTime: '13:00' }
    ]
  },
  // --- USER REQUESTED FRUITS ---
  {
    id: 'fuji-apple',
    name: 'Fuji Apple',
    category: 'Fruit',
    currentPrice: 10,
    change7d: 0.0,
    history: generateHistory(10),
    demand: 'High',
    icon: '🍎',
    weightPerUnit: 0.2,
    vendors: [
      { id: 'v_fruit_2', name: 'Mang Tomas Fruits', rating: 4.5, reviewCount: 85, specialty: 'Taga-Bukid na Prutas', price: 9, stock: 500, openTime: '05:00', closeTime: '17:30' },
      { id: 'v_fruit_5', name: 'Tita Merly\'s Orchard', rating: 4.7, reviewCount: 64, specialty: 'Prutas na De-Kalidad', price: 11, stock: 450, openTime: '06:00', closeTime: '16:00' }
    ]
  },
  {
    id: 'grapes',
    name: 'Grapes',
    category: 'Fruit',
    currentPrice: 250,
    change7d: -12.5,
    history: generateHistory(250),
    demand: 'High',
    icon: '🍇',
    weightPerUnit: 1.0,
    vendors: [
      { id: 'v_fruit_1', name: 'Aling Nena\'s Prutas', rating: 4.8, reviewCount: 120, specialty: 'Sariwang Prutas', price: 240, stock: 150, openTime: '05:30', closeTime: '18:00' },
      { id: 'v_fruit_4', name: 'Kuya Jun\'s Farm', rating: 4.6, reviewCount: 75, specialty: 'Piling-Pili na Ani', price: 260, stock: 120, openTime: '06:00', closeTime: '18:00' }
    ]
  },
  {
    id: 'poncan',
    name: 'Poncan',
    category: 'Fruit',
    currentPrice: 25,
    change7d: 1.2,
    history: generateHistory(25),
    demand: 'Medium',
    icon: '🍊',
    weightPerUnit: 0.15,
    vendors: [
      { id: 'v_fruit_6', name: 'Lolo Pepe\'s Harvest', rating: 4.5, reviewCount: 38, specialty: 'Bagong-Pitas na Prutas', price: 22, stock: 400, openTime: '04:30', closeTime: '14:00' },
      { id: 'v_fruit_3', name: 'Nanay Coring\'s Tropicals', rating: 4.9, reviewCount: 42, specialty: 'Masarap na Tropikal', price: 28, stock: 350, openTime: '05:00', closeTime: '17:00' }
    ]
  }
];
