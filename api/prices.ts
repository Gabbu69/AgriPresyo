export default function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const today = new Date();
  
  // Seed for pseudo-random number generator based on the current day 
  // so prices stay consistent across reloads on the same day but fluctuate day-to-day.
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Custom pseudo-random based on seed
  const seededRandom = (s) => {
      let x = Math.sin(s) * 10000;
      x = x - Math.floor(x);
      return x;
  };

  const getRnd = (s, min, max) => min + seededRandom(s) * (max - min);

  const generateHistory = (base, cropSeed) => {
    const start = new Date();
    start.setDate(today.getDate() - 30); // 30 days history
    const data = [];
    
    for (let i = 0; i <= 30; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const loopSeed = cropSeed + d.getDate() + d.getMonth() * i;
        const fluctuation = getRnd(loopSeed, -0.05, 0.05); // +/- 5% max fluctuation
        
        let historicPrice = base + (base * fluctuation);
        data.push({ 
            date: `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`, 
            price: Number(historicPrice.toFixed(2)) 
        });
    }
    return data;
  };

  const VENDORS_SOCCSARGEN = [
    { id: 'v_soc_1', name: 'GenSan Market Hub', specialty: 'General Santos City', rating: 4.8, reviewCount: 120 },
    { id: 'v_soc_2', name: 'Koronadal Fresh Veggies', specialty: 'Koronadal City', rating: 4.6, reviewCount: 85 },
    { id: 'v_soc_3', name: 'Cotabato Agri-Trading', specialty: 'Cotabato City', rating: 4.7, reviewCount: 210 },
    { id: 'v_soc_4', name: 'Isulan Harvest', specialty: 'Sultan Kudarat', rating: 4.5, reviewCount: 65 },
    { id: 'v_soc_5', name: 'Alabel Farmers Market', specialty: 'Sarangani', rating: 4.9, reviewCount: 142 },
    { id: 'v_soc_6', name: 'Polomolok Fruit Stand', specialty: 'South Cotabato', rating: 4.8, reviewCount: 110 }
  ];

  // Pick 3 random vendors for a crop
  const getVendors = (basePrice, cropSeed) => {
      const selected = [];
      const usedVends = new Set();
      
      for(let i=0; i<3; i++) {
          let vIdx = Math.floor(getRnd(cropSeed + i * 10, 0, VENDORS_SOCCSARGEN.length));
          while(usedVends.has(vIdx)) {
              vIdx = (vIdx + 1) % VENDORS_SOCCSARGEN.length;
          }
          usedVends.add(vIdx);
          const v = VENDORS_SOCCSARGEN[vIdx];
          
          // Vendor price fluctuation
          const vPrice = basePrice + basePrice * getRnd(cropSeed + vIdx * 5, -0.06, 0.08);

          selected.push({
              id: v.id,
              name: v.name,
              rating: v.rating,
              reviewCount: v.reviewCount,
              specialty: v.specialty,
              price: Number(vPrice.toFixed(2)),
              stock: Math.floor(getRnd(cropSeed + vIdx, 50, 500)),
              openTime: '05:00',
              closeTime: '18:00',
              isHot: getRnd(cropSeed + vIdx, 0, 1) > 0.8
          });
      }
      return selected;
  };

  const getCrop = (id, name, category, icon, weightPerUnit, basePrice, demand, cropIndex) => {
      const cropSeed = seed + cropIndex * 100;
      const todaysFluctuation = getRnd(cropSeed, -0.08, 0.08);
      const currentPrice = Number((basePrice + (basePrice * todaysFluctuation)).toFixed(2));
      const yesterdaysFluctuation = getRnd(cropSeed - 1, -0.08, 0.08);
      const prevPrice = basePrice + (basePrice * yesterdaysFluctuation);
      
      const change7d = ((currentPrice - prevPrice) / prevPrice) * 100;

      return {
          id,
          name,
          category,
          currentPrice,
          change7d: Number(change7d.toFixed(1)),
          history: generateHistory(basePrice, cropSeed),
          demand,
          icon,
          weightPerUnit,
          vendors: getVendors(currentPrice, cropSeed)
      };
  };

  const apiPrices = [
      // Vegetables / Spices
      getCrop('tomato-native', 'Native Tomato', 'Vegetable', '🍅', 0.08, 65, 'High', 1),
      getCrop('okra', 'Okra', 'Vegetable', '🫛', 0.02, 55, 'High', 2),
      getCrop('eggplant', 'Long Eggplant', 'Vegetable', '🍆', 0.2, 90, 'High', 3),
      getCrop('kangkong', 'Kangkong (Water Spinach)', 'Vegetable', '🌱', 0.15, 30, 'High', 4),
      getCrop('sitaw', 'Sitaw (String Beans)', 'Vegetable', '🫘', 0.05, 75, 'High', 5),
      getCrop('pechay', 'Pechay (Bok Choy)', 'Vegetable', '🥗', 0.2, 45, 'High', 6),
      getCrop('kalabasa', 'Kalabasa (Squash)', 'Vegetable', '🎃', 1.5, 50, 'High', 7),
      getCrop('upo', 'Upo (Bottle Gourd)', 'Vegetable', '🥒', 1.0, 55, 'Medium', 8),
      getCrop('ampalaya', 'Ampalaya (Bitter Gourd)', 'Vegetable', '🫑', 0.2, 120, 'Medium', 9),
      getCrop('onion-red', 'Red Onion', 'Spice', '🧅', 0.1, 160, 'High', 10),
      getCrop('garlic-ilocos', 'Ilocos Garlic', 'Spice', '🧄', 0.05, 180, 'High', 11),
      getCrop('ginger', 'Yellow Ginger', 'Spice', '🫚', 0.1, 110, 'Medium', 12),
      getCrop('chili-labuyo', 'Siling Labuyo', 'Spice', '🌶️', 0.005, 350, 'High', 13),
      getCrop('atsal', 'Atsal (Bell Pepper)', 'Spice', '🫑', 0.1, 280, 'High', 14),
      
      // Fruits
      getCrop('pineapple-premium', 'Pineapple (Formosa)', 'Fruit', '🍍', 1.8, 120, 'High', 15),
      getCrop('watermelon', 'Seedless Watermelon', 'Fruit', '🍉', 5.0, 45, 'High', 16),
      getCrop('banana-lakatan', 'Lakatan Banana', 'Fruit', '🍌', 0.15, 80, 'High', 17),
      getCrop('mango-carabao', 'Carabao Mango', 'Fruit', '🥭', 0.25, 150, 'High', 18),
      getCrop('calamansi', 'Calamansi', 'Fruit', '🟢', 0.03, 100, 'High', 19),
      getCrop('papaya', 'Solo Papaya', 'Fruit', '🟠', 1.0, 60, 'Medium', 20),
      getCrop('coconut', 'Buko (Young Coconut)', 'Fruit', '🥥', 1.5, 35, 'High', 21),
      getCrop('pomelo', 'Davao Pomelo', 'Fruit', '🍊', 1.2, 130, 'Medium', 22),
      getCrop('rambutan', 'Rambutan', 'Fruit', '🔴', 1.0, 80, 'High', 23),
      
      // Roots
      getCrop('potato-baguio', 'Granola Potato', 'Vegetable', '🥔', 0.15, 95, 'High', 24),
      getCrop('carrots-premium', 'Highland Carrots', 'Vegetable', '🥕', 0.12, 110, 'High', 25),
      getCrop('sweet-potato', 'Yellow Kamote', 'Vegetable', '🍠', 0.2, 55, 'Medium', 26),
      getCrop('cassava', 'Fresh Cassava', 'Root', '🪵', 0.8, 40, 'Low', 27),
      getCrop('ube', 'Ube (Purple Yam)', 'Root', '🍠', 0.5, 140, 'High', 28),
  ];

  res.status(200).json({
    success: true,
    region: 'SOCCSARGEN (Region 12)',
    timestamp: today.toISOString(),
    data: apiPrices
  });
}
