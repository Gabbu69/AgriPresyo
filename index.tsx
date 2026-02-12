
import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  LayoutGrid,
  BarChart3,
  Store,
  TrendingUp,
  Search,
  Calculator,
  Star,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Globe,
  User,
  Plus,
  Minus,
  Trash2,
  Package,
  Edit2,
  ArrowRight,
  Zap,
  Tag,
  Lock,
  Mail,
  ShieldCheck,
  LogOut,
  X,
  MapPin,
  ShoppingBag,
  Target,
  ArrowDown,
  Leaf,
  Trophy,
  Award,
  ArrowUpRight,
  Settings2
} from 'lucide-react';
import {
  ResponsiveContainer,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  LineChart,
  CartesianGrid,
  Line
} from 'recharts';
import { UserRole, Crop, BudgetListItem, Vendor } from './types';
import { MOCK_CROPS } from './constants';

// Simple hash function for password storage (not cryptographically secure, but far better than plain text)
const simpleHash = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const Logo = ({ size = 100, className = "" }: { size?: number, className?: string }) => (
  <img
    src="/AgriPresyo_logoFinal.png"
    alt="AgriPresyo"
    style={{ width: size, height: size }}
    className={`object-contain rounded-2xl ${className}`}
  />
);

const formatPrice = (price: number) => {
  const value = price;
  const symbol = '₱';
  return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const Ticker = ({ crops }: { crops: Crop[] }) => {
  return (
    <div className="bg-zinc-900 border-b border-zinc-800 h-10 flex items-center overflow-hidden whitespace-nowrap sticky top-0 z-50 shadow-md">
      <div className="animate-marquee flex gap-8 px-4">
        {[...crops, ...crops].map((crop, idx) => (
          <div key={`${crop.id}-${idx}`} className="flex items-center gap-2 font-mono text-sm">
            <span className="text-zinc-500 font-bold uppercase">{crop.name}</span>
            <span className="font-bold text-white">{formatPrice(crop.currentPrice)}</span>
            <span className={crop.change24h >= 0 ? 'text-green-400' : 'text-red-500'}>
              {crop.change24h >= 0 ? '▲' : '▼'} {Math.abs(crop.change24h)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

let sparklineCounter = 0;
const Sparkline = ({ data, color }: { data: any[], color: string }) => {
  const [gradientId] = useState(() => `sparkline-grad-${sparklineCounter++}`);
  return (
    <div className="h-12 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="price" stroke={color} fill={`url(#${gradientId})`} strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const LoginPage = ({ onLogin, attemptLogin, onRegister }: { onLogin: (role: UserRole) => void, attemptLogin: (email: string, password: string, role: UserRole) => Promise<boolean>, onRegister: (name: string, email: string, password: string, role: UserRole) => Promise<boolean> }) => {
  const [role, setRole] = useState<UserRole>(UserRole.CONSUMER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = await attemptLogin(email.trim().toLowerCase(), password, role);
    if (ok) {
      onLogin(role);
    } else {
      setError('Invalid credentials — please create an account or try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await onRegister(regName.trim(), regEmail.trim().toLowerCase(), regPassword, role);
    if (success) {
      onLogin(role);
    } else {
      setError('Account already exists with that email.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-green-400/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-green-400/5 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500 mt-8">
        <div className="flex flex-col items-center mb-6">
          <Logo size={120} className="text-green-500 mb-6 drop-shadow-[0_0_20px_rgba(34,197,94,0.3)]" />
          <h1 className="text-5xl font-black tracking-tighter text-white">
            <span className="text-green-600">Agri</span>
            <span className="text-zinc-300">Presyo</span>
          </h1>
          <p className="text-zinc-500 font-bold mt-2 uppercase tracking-widest text-[10px]">A Website for Real-Time Market Prices.</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[40px] p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 mb-6">
            <button
              onClick={() => setRole(UserRole.CONSUMER)}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${role === UserRole.CONSUMER ? 'bg-green-500 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              CONSUMER
            </button>
            <button
              onClick={() => setRole(UserRole.VENDOR)}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${role === UserRole.VENDOR ? 'bg-green-500 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              VENDOR
            </button>
          </div>

          {showRegister ? (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-zinc-100 transition-all"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-zinc-100 transition-all"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-zinc-100 transition-all"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setShowRegister(false)} className="flex-1 bg-zinc-800 text-zinc-500 py-3 rounded-2xl font-black uppercase tracking-widest">Back to Login</button>
                <button type="submit" className="flex-1 bg-green-500 text-black py-3 rounded-2xl font-black uppercase tracking-widest">Create Account</button>
              </div>
              {error && <p className="text-center text-sm text-red-500 mt-2">{error}</p>}
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-zinc-100 transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-zinc-100 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_20px_rgba(34,197,94,0.1)]"
                >
                  Access Terminal
                </button>
              </form>

              <div className="text-center mt-4">
                <button onClick={() => setShowRegister(true)} className="text-sm text-zinc-400 hover:text-zinc-200">Don't have an account? Create Account</button>
              </div>
              {error && <p className="text-center text-sm text-red-500 mt-2">{error}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.CONSUMER);
  const [users, setUsers] = useState<Array<{ name?: string; email: string; password: string; role: UserRole }>>(() => {
    try {
      const raw = localStorage.getItem('AP_users');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('market');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [addCropModalSelection, setAddCropModalSelection] = useState<Crop | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [budgetLimit, setBudgetLimit] = useState<number>(1000);
  const [budgetItems, setBudgetItems] = useState<BudgetListItem[]>([]);
  const [userVendorRatings, setUserVendorRatings] = useState<Record<string, number>>({});

  // Vendor-specific state
  const [vendorShopType, setVendorShopType] = useState<'Fruit' | 'Vegetable'>('Fruit');
  const [shopFilter, setShopFilter] = useState<'All' | 'Fruit' | 'Vegetable'>('All');
  const [volatilityTimeRange, setVolatilityTimeRange] = useState<'weekly' | 'monthly'>('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');

  // Global Market State
  const [crops, setCrops] = useState<Crop[]>(MOCK_CROPS);

  const adminVendorId = 'v_admin_node';

  const vendorInventory = useMemo(() => {
    return crops.filter(c => c.vendors.some(v => v.id === adminVendorId));
  }, [crops, adminVendorId]);

  const allVendors = useMemo(() => {
    const vendorMap = new Map();
    crops.forEach(crop => {
      crop.vendors.forEach(v => {
        if (!vendorMap.has(v.id)) {
          vendorMap.set(v.id, { ...v, cropsSold: [] });
        }
        vendorMap.get(v.id).cropsSold.push(crop);
      });
    });
    return Array.from(vendorMap.values());
  }, [crops]);

  const filteredVendors = useMemo(() => {
    return allVendors.filter(v => {
      if (v.id === adminVendorId && role === UserRole.VENDOR) return false;
      if (shopFilter === 'All') return true;
      if (shopFilter === 'Fruit') return v.cropsSold.every((c: any) => c.category === 'Fruit');
      if (shopFilter === 'Vegetable') return v.cropsSold.every((c: any) => c.category !== 'Fruit');
      return true;
    });
  }, [allVendors, shopFilter, role, adminVendorId]);

  const fruitVendors = useMemo(() => filteredVendors.filter(v => v.cropsSold.every((c: any) => c.category === 'Fruit')), [filteredVendors]);
  const vegetableVendors = useMemo(() => filteredVendors.filter(v => v.cropsSold.some((c: any) => c.category !== 'Fruit')), [filteredVendors]);

  useEffect(() => {
    if (selectedVendor) {
      const updated = allVendors.find(v => v.id === selectedVendor.id);
      if (updated) setSelectedVendor(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allVendors, selectedVendor?.id]);

  const analyticsData = useMemo(() => {
    const topGainer = [...crops].sort((a, b) => b.change24h - a.change24h)[0];

    const fruits = crops.filter(c => c.category === 'Fruit');
    const veggies = crops.filter(c => c.category !== 'Fruit');

    const expFruits = [...fruits].sort((a, b) => b.currentPrice - a.currentPrice).slice(0, 3);
    const cheapFruits = [...fruits].sort((a, b) => a.currentPrice - b.currentPrice).slice(0, 3);

    const expVeggies = [...veggies].sort((a, b) => b.currentPrice - a.currentPrice).slice(0, 3);
    const cheapVeggies = [...veggies].sort((a, b) => a.currentPrice - b.currentPrice).slice(0, 3);

    return { topGainer, expFruits, cheapFruits, expVeggies, cheapVeggies };
  }, [crops]);

  const aggregateVolatilityData = useMemo(() => {
    if (!crops.length || !crops[0]?.history) return { data: [], stats: null };

    // Aggregate all crops' histories into monthly buckets
    const months: { [key: string]: { prices: number[] } } = {};
    crops.forEach(crop => {
      crop.history.forEach(point => {
        const date = new Date(point.date);
        const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!months[monthYear]) months[monthYear] = { prices: [] };
        months[monthYear].prices.push(point.price);
      });
    });

    const data = Object.entries(months)
      .sort((a, b) => new Date(a[0] + ' 1').getTime() - new Date(b[0] + ' 1').getTime())
      .map(([key, mData]) => {
        const avg = Math.round((mData.prices.reduce((a, b) => a + b) / mData.prices.length) * 100) / 100;
        const change = mData.prices.length > 1
          ? Math.round(((mData.prices[mData.prices.length - 1] - mData.prices[0]) / mData.prices[0]) * 10000) / 100
          : 0;
        return {
          date: key,
          fullKey: key,
          price: avg,
          min: Math.min(...mData.prices),
          max: Math.max(...mData.prices),
          change,
          count: mData.prices.length
        };
      });

    const selectedData = data.find(d => d.fullKey === selectedPeriod);
    return { data, stats: selectedData };
  }, [crops, selectedPeriod]);

  const [isAddCropModalOpen, setIsAddCropModalOpen] = useState(false);
  const [editingInventoryCrop, setEditingInventoryCrop] = useState<Crop | null>(null);

  const filteredCrops = useMemo(() => {
    return crops.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === 'All' || c.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [search, crops, activeCategory]);

  const budgetStats = useMemo(() => {
    let totalCost = 0;
    let totalWeight = 0;
    budgetItems.forEach(item => {
      const crop = crops.find(c => c.id === item.cropId);
      if (crop) {
        const weight = item.quantity * crop.weightPerUnit;
        totalWeight += weight;
        totalCost += weight * crop.currentPrice;
      }
    });
    return { totalCost, totalWeight };
  }, [budgetItems, crops]);

  const addToBudget = (cropId: string) => {
    setBudgetItems(prev => {
      const existing = prev.find(i => i.cropId === cropId);
      if (existing) {
        return prev.map(i => i.cropId === cropId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { cropId, quantity: 1 }];
    });
  };

  const removeFromBudget = (cropId: string) => {
    setBudgetItems(prev => prev.filter(i => i.cropId !== cropId));
  };

  const updateBudgetQty = (cropId: string, qty: number) => {
    setBudgetItems(prev => prev.map(i => i.cropId === cropId ? { ...i, quantity: Math.max(1, qty) } : i));
  };

  const handleLogin = (userRole: UserRole) => {
    setRole(userRole);
    setIsAuthenticated(true);
    setActiveTab(userRole === UserRole.VENDOR ? 'shop' : 'market');
  };

  const attemptLogin = async (email: string, password: string, userRole: UserRole) => {
    const hashed = await simpleHash(password);
    const found = users.find(u => u.email === email && u.password === hashed && u.role === userRole);
    return !!found;
  };

  const registerUser = async (name: string, email: string, password: string, userRole: UserRole) => {
    if (users.find(u => u.email === email)) return false;
    const hashed = await simpleHash(password);
    const next = [...users, { name: name || undefined, email, password: hashed, role: userRole }];
    setUsers(next);
    try { localStorage.setItem('AP_users', JSON.stringify(next)); } catch (e) { }
    return true;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setBudgetItems([]);
    setUserVendorRatings({});
    setActiveTab('market');
  };

  const handleUpdatePrice = (cropId: string, newPrice: number) => {
    setCrops(prev => prev.map(c => {
      if (c.id === cropId) {
        const updatedVendors = c.vendors.map(v => v.id === adminVendorId ? { ...v, price: newPrice } : v);
        return { ...c, currentPrice: newPrice, vendors: updatedVendors };
      }
      return c;
    }));
    setEditingInventoryCrop(null);
  };

  const handleUpdateStock = (cropId: string, newStock: number) => {
    setCrops(prev => prev.map(c => {
      if (c.id === cropId) {
        const updatedVendors = c.vendors.map(v => v.id === adminVendorId ? { ...v, stock: newStock } : v);
        return { ...c, vendors: updatedVendors };
      }
      return c;
    }));
    setEditingInventoryCrop(null);
  };

  const handleDeleteFromInventory = (cropId: string) => {
    setCrops(prev => prev.map(c => {
      if (c.id === cropId) {
        return { ...c, vendors: c.vendors.filter(v => v.id !== adminVendorId) };
      }
      return c;
    }));
  };



  const handleAddCropToVendor = (cropId: string, price: number, stock: number, listingName?: string) => {
    setCrops(prev => prev.map(c => {
      if (c.id === cropId) {
        if (c.vendors.some(v => v.id === adminVendorId)) return c;
        const newEntry: Vendor = {
          id: adminVendorId,
          name: 'Personal Market Node',
          rating: 5.0,
          reviewCount: 1,
          specialty: vendorShopType === 'Fruit' ? 'Premium Fruit Hub' : 'Highland Veggie Outlet',
          price,
          stock,
          isHot: true,
          listingName: listingName && listingName.trim() ? listingName.trim() : undefined,
        };
        return { ...c, vendors: [...c.vendors, newEntry] };
      }
      return c;
    }));
    setIsAddCropModalOpen(false);
  };

  const handleRateVendor = (vId: string, newRating: number) => {
    const existingUserRating = userVendorRatings[vId] || 0;
    const finalUserRating = existingUserRating === newRating ? 0 : newRating;

    setUserVendorRatings(prev => ({ ...prev, [vId]: finalUserRating }));

    setCrops(prev => prev.map(c => {
      const updatedVendors = c.vendors.map(v => {
        if (v.id === vId) {
          let newCount = v.reviewCount;
          let totalScore = v.rating * v.reviewCount;

          if (existingUserRating === 0 && finalUserRating > 0) {
            newCount += 1;
            totalScore += finalUserRating;
          } else if (existingUserRating > 0 && finalUserRating === 0) {
            newCount = Math.max(0, newCount - 1);
            totalScore = Math.max(0, totalScore - existingUserRating);
          } else if (existingUserRating > 0 && finalUserRating > 0) {
            totalScore = totalScore - existingUserRating + finalUserRating;
          }

          const finalAvg = newCount === 0 ? 0 : Number((totalScore / newCount).toFixed(1));
          return { ...v, rating: finalAvg, reviewCount: newCount };
        }
        return v;
      });
      return { ...c, vendors: updatedVendors };
    }));
  };

  const handleUpdateVendorListing = (cropId: string, newPrice: number, newStock: number, newListingName?: string) => {
    setCrops(prev => prev.map(c => {
      if (c.id === cropId) {
        const updatedVendors = c.vendors.map(v => v.id === adminVendorId ? { ...v, price: newPrice, stock: newStock, listingName: newListingName?.trim() ? newListingName : v.listingName } : v);
        return { ...c, vendors: updatedVendors };
      }
      return c;
    }));
    setEditingInventoryCrop(null);
  };

  const renderConsumerView = () => (
    <div className="space-y-8 pb-32 lg:pb-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search markets (Onions, Mangoes, Chili...)"
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/50 text-zinc-100 transition-all text-lg shadow-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Fruit', 'Vegetable', 'Spice', 'Root'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl border text-sm font-bold transition-all ${activeCategory === cat ? 'bg-green-400 border-green-400 text-black shadow-lg shadow-green-400/20' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
              >
                {cat === 'All' ? 'All' : `${cat}s`}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
            <TrendingUp size={80} className="text-green-400" />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <span className="text-green-400 font-bold text-xs uppercase tracking-widest">Market Top Gainer</span>
          </div>
          <div className="mt-4 relative z-10">
            <h4 className="text-3xl font-black text-white">{analyticsData.topGainer?.name || 'Loading...'}</h4>
            <div className="flex items-center gap-2">
              <span className="text-4xl">{analyticsData.topGainer?.icon}</span>
              <p className="text-green-400 font-mono font-bold text-xl">+{analyticsData.topGainer?.change24h}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter">
          <BarChart3 className="text-green-400" size={20} />
          Terminal Intelligence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCrops.map(crop => (
            <div
              key={crop.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-800/80 cursor-pointer transition-all group relative overflow-hidden shadow-lg hover:shadow-green-400/5 hover:-translate-y-1"
              onClick={() => setSelectedCrop(crop)}
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-4">
                  <div className="text-5xl drop-shadow-lg group-hover:scale-110 transition-transform">{crop.icon}</div>
                  <div>
                    <h3 className="font-black text-white text-lg leading-tight">{crop.name}</h3>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{crop.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xl font-bold text-white">
                    {formatPrice(crop.currentPrice)}
                  </p>
                  <div className={`flex items-center justify-end text-xs font-bold ${crop.change24h >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                    {crop.change24h >= 0 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {Math.abs(crop.change24h)}%
                  </div>
                </div>
              </div>
              <div className="mt-8 flex items-end justify-between relative z-10">
                <Sparkline data={crop.history} color={crop.change24h >= 0 ? '#4ade80' : '#ef4444'} />
                <button
                  onClick={(e) => { e.stopPropagation(); addToBudget(crop.id); }}
                  className="bg-zinc-950 hover:bg-green-400 hover:text-black p-4 rounded-2xl text-zinc-400 transition-all shadow-xl active:scale-90"
                >
                  <Calculator size={22} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCalculatorWidget = () => (
    <div className="bg-zinc-950 border border-zinc-800 rounded-[40px] p-10 shadow-2xl relative overflow-hidden mt-12 mb-20 border-t-green-400/30">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-green-400 p-2 rounded-xl">
              <Calculator className="text-black" size={28} />
            </div>
            <h2 className="text-3xl font-black">Smart Asset Projection</h2>
          </div>
          <p className="text-zinc-500 font-medium">Auto-calculating unit weight vs market index values</p>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-3xl border border-zinc-800 shadow-inner">
          <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Liquidity:</span>
          <input
            type="number"
            className="bg-transparent w-32 text-right font-mono text-2xl font-bold focus:outline-none text-green-400"
            value={budgetLimit}
            onChange={(e) => setBudgetLimit(Number(e.target.value))}
          />
          <span className="text-sm font-black text-zinc-600 font-mono">₱</span>
        </div>
      </div>

      {budgetItems.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-[32px] bg-zinc-900/10">
          <Package className="mx-auto text-zinc-800 mb-6" size={64} />
          <p className="text-zinc-400 text-xl font-black uppercase tracking-tighter">No Active Trades</p>
          <p className="text-zinc-600 text-sm mt-2">Select produce from market to begin calculating</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4">
            {budgetItems.map(item => {
              const crop = crops.find(c => c.id === item.cropId)!;
              const weight = item.quantity * crop.weightPerUnit;
              return (
                <div key={item.cropId} className="flex items-center justify-between bg-zinc-900/50 hover:bg-zinc-900 p-5 rounded-3xl border border-zinc-800 transition-colors group">
                  <div className="flex items-center gap-6">
                    <span className="text-5xl group-hover:scale-110 transition-transform">{crop.icon}</span>
                    <div>
                      <h4 className="font-black text-xl text-white">{crop.name}</h4>
                      <div className="flex gap-3 text-xs font-mono font-bold text-zinc-500 uppercase tracking-tight">
                        <span>Qty: {item.quantity} units</span>
                        <span>≈ {weight.toFixed(2)}kg</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 bg-zinc-950 p-2 rounded-2xl border border-zinc-800">
                      <button onClick={() => updateBudgetQty(item.cropId, item.quantity - 1)} className="p-2 hover:bg-red-500/10 hover:text-red-500 transition-all rounded-lg"><Minus size={18} /></button>
                      <span className="w-12 text-center text-lg font-black font-mono text-white">{item.quantity}</span>
                      <button onClick={() => updateBudgetQty(item.cropId, item.quantity + 1)} className="p-2 hover:bg-green-400/10 hover:text-green-400 transition-all rounded-lg"><Plus size={18} /></button>
                    </div>
                    <div className="text-right w-32">
                      <p className="font-mono text-2xl font-bold text-white">{formatPrice(weight * crop.currentPrice)}</p>
                    </div>
                    <button onClick={() => removeFromBudget(item.cropId)} className="text-zinc-700 hover:text-red-500 transition-all p-3">
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-zinc-900 p-8 rounded-[32px] border border-zinc-800 mt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="text-center md:text-left flex-1">
                <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mb-2">Total Projected Commitment</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-2xl font-black text-zinc-500 font-mono">{budgetStats.totalWeight.toFixed(2)}kg</span>
                  <span className="text-6xl font-black font-mono text-white tracking-tighter">{formatPrice(budgetStats.totalCost)}</span>
                </div>
              </div>
              <div className="w-full max-w-lg bg-zinc-950 p-6 rounded-3xl border border-zinc-800">
                <div className="flex justify-between text-xs font-black uppercase mb-3">
                  <span className="text-zinc-500">Inventory Liquidity Used</span>
                  <span className={budgetStats.totalCost > budgetLimit ? 'text-red-500' : 'text-green-400'}>{Math.round((budgetStats.totalCost / budgetLimit) * 100)}%</span>
                </div>
                <div className="h-6 w-full bg-zinc-900 rounded-full overflow-hidden p-1 shadow-inner">
                  <div
                    className={`h-full transition-all duration-1000 rounded-full ${budgetStats.totalCost > budgetLimit ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]'}`}
                    style={{ width: `${Math.min(100, (budgetStats.totalCost / budgetLimit) * 100)}%` }}
                  />
                </div>
                {budgetStats.totalCost > budgetLimit && (
                  <p className="text-[10px] text-red-500 font-black uppercase mt-3 animate-pulse text-center">Warning: Projected cost exceeds available liquidity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ShopCard = ({ vendor, icon: Icon }: { vendor: any, icon: any, key?: any }) => (
    <div
      className="bg-zinc-900 border border-zinc-800 rounded-[36px] p-8 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer group flex flex-col justify-between h-full shadow-2xl"
      onClick={() => setSelectedVendor(vendor)}
    >
      <div>
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-[28px] bg-zinc-950 flex items-center justify-center font-black text-3xl text-zinc-600 group-hover:bg-green-500 group-hover:text-black transition-all border border-zinc-800 group-hover:border-transparent">
              {vendor.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-black text-white group-hover:text-green-500 transition-colors">{vendor.name}</h3>
                {vendor.isHot && <ShieldCheck size={20} className="text-green-500" />}
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={14} fill="currentColor" />
                <span className="text-sm font-black text-white">{vendor.rating}</span>
                <span className="text-[10px] text-zinc-600 font-bold uppercase ml-1 tracking-widest">{vendor.reviewCount} Reports</span>
              </div>
            </div>
          </div>
          <div className="bg-zinc-950 px-4 py-2 rounded-2xl border border-zinc-800 text-[10px] font-black uppercase text-green-500 shadow-inner">
            {vendor.specialty}
          </div>
        </div>
        <div className="flex gap-3 overflow-hidden h-12 items-center px-2">
          {vendor.cropsSold.slice(0, 7).map((crop: any) => (
            <div key={crop.id} className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-xl border border-zinc-800 shadow-lg shrink-0">
              {crop.icon}
            </div>
          ))}
          {vendor.cropsSold.length > 7 && (
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500 border border-zinc-800 shrink-0">
              +{vendor.cropsSold.length - 7}
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-6">
        <Icon size={24} className="text-zinc-700 group-hover:text-green-500/50 transition-colors" />
        <button className="flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
          Connect Terminal <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );

  const renderShopsView = () => (
    <div className="space-y-16 pb-32 lg:pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter">Market Nodes</h2>
          <p className="text-zinc-500 text-lg mt-2 font-medium">Connect to specialized produce terminals</p>
        </div>
        <div className="flex gap-3 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 shadow-inner">
          {['All', 'Fruit', 'Vegetable'].map(f => (
            <button
              key={f}
              onClick={() => setShopFilter(f as any)}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${shopFilter === f ? 'bg-zinc-800 text-white shadow-xl border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {f === 'All' ? 'All' : `${f}s`}
            </button>
          ))}
        </div>
      </div>

      {(shopFilter === 'All' || shopFilter === 'Fruit') && (
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-400/10 border border-orange-400/20 flex items-center justify-center rounded-[20px] shadow-xl">
              <ShoppingBag size={32} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter">Fruit Nodes</h3>
              <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest">Strict Fruit Specialization</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fruitVendors.map(v => <ShopCard key={v.id} vendor={v} icon={ShoppingBag} />)}
          </div>
        </section>
      )}

      {(shopFilter === 'All' || shopFilter === 'Vegetable') && (
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-400/10 border border-green-400/20 flex items-center justify-center rounded-[20px] shadow-xl">
              <Leaf size={32} className="text-green-500" />
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter">Vegetable & Spice Nodes</h3>
              <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest">High-Intensity Greens & Aromatics</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vegetableVendors.map(v => <ShopCard key={v.id} vendor={v} icon={Store} />)}
          </div>
        </section>
      )}
    </div>
  );

  const RankingCard = ({ title, items, color, subtitle }: { title: string, items: Crop[], color: string, subtitle: string }) => (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-[40px] p-8 shadow-2xl flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-3 rounded-2xl border ${color === 'yellow' ? 'bg-yellow-400/20 border-yellow-400/30' : 'bg-green-400/20 border-green-400/30'}`}>
          {color === 'yellow' ? <Trophy className="text-yellow-400" size={28} /> : <Award className="text-green-500" size={28} />}
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter">{title}</h3>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-4 flex-1">
        {items.map((crop, idx) => (
          <div key={crop.id} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors group">
            <div className="flex items-center gap-4">
              <span className="text-xl font-black text-zinc-700 font-mono w-6">#{idx + 1}</span>
              <span className="text-3xl group-hover:scale-110 transition-transform">{crop.icon}</span>
              <div>
                <h4 className="font-black text-white text-sm">{crop.name}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsDashboard = () => (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20">
      <div>
        <h2 className="text-5xl font-black tracking-tighter">Market Leaderboards</h2>
        <p className="text-zinc-500 text-lg mt-2 font-medium">Real-time asset rankings segmented by category</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RankingCard
          title="Premium Fruits"
          subtitle="Highest Ask Index"
          items={analyticsData.expFruits}
          color="yellow"
        />
        <RankingCard
          title="Value Fruits"
          subtitle="Lowest Ask Index"
          items={analyticsData.cheapFruits}
          color="green"
        />
        <RankingCard
          title="Premium Veggies"
          subtitle="Highest Ask Index"
          items={analyticsData.expVeggies}
          color="yellow"
        />
        <RankingCard
          title="Value Veggies"
          subtitle="Lowest Ask Index"
          items={analyticsData.cheapVeggies}
          color="green"
        />
      </div>

      <div className="bg-zinc-900/30 p-10 rounded-[40px] border border-zinc-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <BarChart3 className="text-green-500" size={24} />
            <h3 className="text-2xl font-black tracking-tighter">Aggregate Market Volatility</h3>
          </div>
          <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 shadow-inner">
            <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-zinc-800 text-green-500 shadow-xl">Monthly</div>
          </div>
        </div>
        <div className="h-80 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aggregateVolatilityData.data}>
              <defs>
                <linearGradient id="aggGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#c7c7cc' }} angle={-45} height={80} interval={0} />
              <YAxis tick={{ fontSize: 12, fill: '#c7c7cc' }} />
              <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
              <Tooltip
                contentStyle={{ backgroundColor: '#09090b', borderRadius: '12px', border: '1px solid #27272a', fontFamily: 'Inter', padding: '10px' }}
                formatter={(value: any) => [`₱${value}`, 'Avg']}
                labelFormatter={(label: any) => `Period: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: '#22c55e', r: 4 }}
                activeDot={{ r: 7 }}
                onClick={(d: any) => { if (d && d.payload) setSelectedPeriod(d.payload.fullKey || d.payload.date || ''); }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {aggregateVolatilityData.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-[24px] shadow-lg">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-2">Period</p>
              <p className="text-2xl font-black text-white">{aggregateVolatilityData.stats.date}</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-[24px] shadow-lg">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-2">Average Price</p>
              <p className="text-2xl font-mono font-black text-green-400">₱{aggregateVolatilityData.stats.price}</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-[24px] shadow-lg">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-2">Price Range</p>
              <p className="text-sm font-mono text-white">₱{aggregateVolatilityData.stats.min} - ₱{aggregateVolatilityData.stats.max}</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-[24px] shadow-lg">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-2">Change</p>
              <p className={`text-2xl font-mono font-black ${aggregateVolatilityData.stats.change >= 0 ? 'text-green-400' : 'text-red-500'}`}>{aggregateVolatilityData.stats.change >= 0 ? '+' : ''}{aggregateVolatilityData.stats.change}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderVendorView = () => (
    <div className="space-y-12 pb-32 lg:pb-12 animate-in slide-in-from-bottom duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-zinc-900 p-8 rounded-[40px] border border-zinc-800 relative overflow-hidden group shadow-2xl flex flex-col justify-between">
          <div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Node Specialization</p>
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-3xl ${vendorShopType === 'Fruit' ? 'bg-orange-400/10' : 'bg-green-400/10'}`}>
                {vendorShopType === 'Fruit' ? <ShoppingBag className="text-orange-400" size={32} /> : <Leaf className="text-green-500" size={32} />}
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">{vendorShopType} Merchant</h3>
                <p className="text-zinc-600 text-xs font-bold">Trading {vendorShopType}s strictly</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
            <button
              onClick={() => setVendorShopType('Fruit')}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${vendorShopType === 'Fruit' ? 'bg-orange-400 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              FRUIT SELLER
            </button>
            <button
              onClick={() => setVendorShopType('Vegetable')}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${vendorShopType === 'Vegetable' ? 'bg-green-500 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              VEGGIE SELLER
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 p-8 rounded-[40px] border border-zinc-800 relative overflow-hidden group shadow-2xl flex flex-col justify-center">
          <Zap className="text-yellow-400 absolute top-8 right-8 group-hover:scale-150 transition-transform duration-500 opacity-20" size={64} />
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Market Demand Signal</p>
          {(() => {
            const avgChange = crops.reduce((sum, c) => sum + c.change24h, 0) / crops.length;
            const signal = avgChange >= 3 ? 'BULLISH' : avgChange >= 0 ? 'NEUTRAL' : 'BEARISH';
            const signalColor = avgChange >= 3 ? 'text-green-400' : avgChange >= 0 ? 'text-yellow-400' : 'text-red-500';
            const signalLabel = avgChange >= 3 ? 'Optimal Liquidity Period' : avgChange >= 0 ? 'Stable Market Conditions' : 'Caution: Declining Prices';
            return (
              <>
                <div className={`text-5xl font-black tracking-tighter ${signalColor}`}>{signal}</div>
                <p className={`${signalColor} font-bold text-xs tracking-widest uppercase mt-2`}>{signalLabel}</p>
              </>
            );
          })()}
        </div>

        <div className="bg-zinc-900 p-8 rounded-[40px] border border-zinc-800 relative overflow-hidden group shadow-2xl flex flex-col justify-center">
          <Package className="text-blue-400 absolute top-8 right-8 group-hover:scale-150 transition-transform duration-500 opacity-20" size={64} />
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Node Aggregate</p>
          <div className="text-5xl font-black text-white tracking-tighter">
            {vendorInventory.reduce((acc, c) => acc + (c.vendors.find(v => v.id === adminVendorId)?.stock || 0), 0).toLocaleString()}
            <span className="text-lg text-zinc-600 font-mono uppercase ml-3 tracking-normal">kg</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-5xl font-black tracking-tighter">Terminal Admin</h2>
            <p className="text-zinc-500 text-lg mt-2 font-medium uppercase tracking-widest text-xs">Managing your {vendorShopType} Assets</p>
          </div>
          <button onClick={() => setIsAddCropModalOpen(true)} className="bg-green-500 text-black px-10 py-5 rounded-[24px] font-black text-sm flex items-center gap-3 shadow-[0_10px_30px_rgba(34,197,94,0.2)] hover:scale-105 transition-all uppercase tracking-widest">
            <Plus size={24} strokeWidth={3} /> New Listing
          </button>
        </div>

        <div className="grid gap-6">
          {vendorInventory.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-[40px] bg-zinc-900/20">
              <Package className="mx-auto text-zinc-800 mb-6" size={48} />
              <p className="text-zinc-600 font-black uppercase tracking-widest">Node Inventory Depleted</p>
              <p className="text-zinc-700 text-xs mt-2">Initialize your first listing to begin trading</p>
            </div>
          ) : (
            vendorInventory.map(crop => {
              const myEntry = crop.vendors.find(v => v.id === adminVendorId)!;
              return (
                <div key={crop.id} className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 group hover:border-green-400/30 transition-all shadow-xl">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                      <div className="text-6xl bg-zinc-950 w-24 h-24 flex items-center justify-center rounded-[28px] border border-zinc-800 group-hover:border-green-400/20 transition-all shadow-2xl">
                        {crop.icon}
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white group-hover:text-green-400 transition-colors">{myEntry.listingName || crop.name}</h3>
                        <div className="flex gap-3 mt-2">
                          <span className="px-4 py-1.5 rounded-xl bg-zinc-800 text-[10px] font-black text-zinc-500 uppercase tracking-widest">{crop.category}</span>
                          <span className="px-4 py-1.5 rounded-xl bg-green-400/10 text-[10px] font-black text-green-400 uppercase tracking-widest">Terminal Active</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 flex-1 lg:max-w-xl">
                      <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-inner group/stat">
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mb-3">Ask Price</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-mono font-bold text-green-400 leading-none">{formatPrice(myEntry.price)}</span>
                          <button onClick={() => setEditingInventoryCrop(crop)} className="text-zinc-700 hover:text-white transition-colors bg-zinc-900 p-2 rounded-lg group-hover/stat:border-green-400/30 border border-transparent"><Edit2 size={16} /></button>
                        </div>
                      </div>
                      <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-inner group/stat">
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mb-3">Available Liquidity</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-mono font-bold text-white leading-none">{myEntry.stock.toLocaleString()} <span className="text-xs uppercase text-zinc-600">kg</span></span>
                          <button onClick={() => setEditingInventoryCrop(crop)} className="text-zinc-700 hover:text-white transition-colors bg-zinc-900 p-2 rounded-lg group-hover/stat:border-green-400/30 border border-transparent"><Edit2 size={16} /></button>
                        </div>
                      </div>
                    </div>

                    <button onClick={() => handleDeleteFromInventory(crop.id)} className="bg-zinc-950 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/20 text-zinc-700 hover:text-red-500 p-5 rounded-[24px] transition-all shadow-xl group/del">
                      <Trash2 size={24} className="group-hover/del:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} attemptLogin={attemptLogin} onRegister={registerUser} />;

  return (
    <div className="min-h-screen flex flex-col selection:bg-green-400/30 animate-in fade-in duration-1000">
      <Ticker crops={crops} />

      <header className="sticky top-10 z-40 bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-800 px-8 py-5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab('market')}>
              <Logo size={56} className="text-green-500 transition-all transform group-hover:scale-110 group-hover:rotate-6" />
              <h1 className="text-3xl font-black tracking-tighter text-white">
                <span className="text-green-500">Agri</span>
                <span className="text-zinc-200">Presyo</span>
              </h1>
            </div>
            <nav className="hidden lg:flex items-center gap-4">
              <button onClick={() => setActiveTab('market')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all tracking-[0.1em] ${activeTab === 'market' ? 'bg-zinc-900 text-green-500 shadow-inner' : 'text-zinc-500 hover:text-zinc-200'}`}>MARKET</button>
              {role !== UserRole.VENDOR && (
                <button onClick={() => setActiveTab('shops')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all tracking-[0.1em] ${activeTab === 'shops' ? 'bg-zinc-900 text-green-500 shadow-inner' : 'text-zinc-500 hover:text-zinc-200'}`}>SHOPS</button>
              )}
              <button onClick={() => setActiveTab('analytics')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all tracking-[0.1em] ${activeTab === 'analytics' ? 'bg-zinc-900 text-green-500 shadow-inner' : 'text-zinc-500 hover:text-zinc-200'}`}>ANALYTICS</button>
              {role === UserRole.VENDOR && <button onClick={() => setActiveTab('shop')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all tracking-[0.1em] ${activeTab === 'shop' ? 'bg-zinc-900 text-green-500 shadow-inner' : 'text-zinc-500 hover:text-zinc-200'}`}>DASHBOARD</button>}
            </nav>
          </div>
          <div className="flex items-center gap-4">

            <button onClick={handleLogout} className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all hover:border-red-500/30 shadow-xl group"><LogOut size={22} className="group-hover:-translate-x-1 transition-transform" /></button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 lg:p-12 max-w-[1400px] mx-auto w-full">
        {activeTab === 'market' && renderConsumerView()}
        {activeTab === 'market' && renderCalculatorWidget()}
        {activeTab === 'shops' && role !== UserRole.VENDOR && renderShopsView()}
        {activeTab === 'analytics' && renderAnalyticsDashboard()}
        {activeTab === 'shop' && role === UserRole.VENDOR && renderVendorView()}
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-800 px-8 py-5 flex justify-between items-center z-50 rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <button onClick={() => setActiveTab('market')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'market' ? 'text-green-500 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}>
          <Store size={26} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Market</span>
        </button>
        {role !== UserRole.VENDOR && (
          <button onClick={() => setActiveTab('shops')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'shops' ? 'text-green-500 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <ShoppingBag size={26} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Shops</span>
          </button>
        )}
        <button onClick={() => setActiveTab('analytics')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'analytics' ? 'text-green-500 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}>
          <BarChart3 size={26} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Stats</span>
        </button>
        {role === UserRole.VENDOR && (
          <button onClick={() => setActiveTab('shop')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'shop' ? 'text-green-500 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <LayoutGrid size={26} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dash</span>
          </button>
        )}
      </nav>

      {/* Vendor Detail View Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-xl" onClick={() => setSelectedVendor(null)}></div>
          <div className="bg-zinc-900 w-full max-w-2xl rounded-[50px] overflow-hidden relative border border-zinc-800 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedVendor(null)} className="absolute top-8 right-8 z-20 w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"><X size={20} /></button>
            <div className="p-10 lg:p-14 space-y-10 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex items-center gap-8">
                  <div className="w-28 h-28 rounded-[36px] bg-zinc-950 flex items-center justify-center font-black text-5xl text-zinc-700 border border-zinc-800 shadow-2xl">
                    {selectedVendor.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-4xl font-black text-white leading-none">{selectedVendor.name}</h2>
                      {selectedVendor.isHot && <ShieldCheck className="text-green-500 shrink-0" size={28} />}
                    </div>
                    <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em] mb-4">{selectedVendor.specialty}</p>
                    <div className="flex flex-col gap-3">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Rate Terminal (Toggle Stars)</p>
                      <div className="flex items-center gap-1 text-yellow-500 bg-zinc-950 p-2.5 rounded-2xl border border-zinc-800 w-fit shadow-inner">
                        {[...Array(5)].map((_, i) => {
                          const starVal = i + 1;
                          const userRating = userVendorRatings[selectedVendor.id] || 0;
                          return (
                            <button
                              key={i}
                              onClick={() => handleRateVendor(selectedVendor.id, starVal)}
                              className="hover:scale-125 transition-transform p-1 group/star"
                            >
                              <Star
                                size={36}
                                fill={starVal <= userRating ? "currentColor" : "none"}
                                className={starVal <= userRating ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" : "text-zinc-800 group-hover/star:text-zinc-600"}
                              />
                            </button>
                          );
                        })}
                        <div className="ml-8 border-l border-zinc-800 pl-8 flex flex-col items-center">
                          <span className="text-3xl font-black text-white font-mono leading-none">{selectedVendor.rating}</span>
                          <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter mt-1">Index Score</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-green-500 border-b border-zinc-800 pb-4">Terminal Inventory</h3>
                <div className="grid gap-4">
                  {selectedVendor.cropsSold.map((crop: any) => (
                    <div key={crop.id} className="bg-zinc-950 p-6 rounded-[32px] border border-zinc-800 flex items-center justify-between group hover:border-zinc-600 transition-all shadow-lg">
                      <div className="flex items-center gap-6">
                        <span className="text-5xl group-hover:scale-110 transition-transform">{crop.icon}</span>
                        <div>
                          <p className="font-black text-2xl text-white tracking-tight">{crop.vendors.find((v: any) => v.id === selectedVendor.id)?.listingName || crop.name}</p>
                          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Weight Index: {crop.weightPerUnit}kg/unit</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black font-mono text-green-500 leading-none mb-2">{formatPrice(crop.vendors.find((v: any) => v.id === selectedVendor.id)?.price || crop.currentPrice)}</p>
                        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-tight">Liquidity: {crop.vendors.find((v: any) => v.id === selectedVendor.id)?.stock}kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => setSelectedVendor(null)} className="w-full bg-zinc-800 hover:bg-zinc-700 py-6 rounded-[28px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-10 transition-all hover:text-white">Terminate Connection</button>
            </div>
          </div>
        </div>
      )}

      {/* Crop Info Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-xl" onClick={() => setSelectedCrop(null)}></div>
          <div className="bg-zinc-900 w-full max-w-xl rounded-[50px] overflow-hidden relative border border-zinc-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedCrop(null)} className="absolute top-8 right-8 z-20 w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"><X size={20} /></button>
            <div className="p-12 space-y-10">
              <div className="flex items-center gap-8">
                <span className="text-7xl bg-zinc-800 w-28 h-28 flex items-center justify-center rounded-[36px] border border-zinc-700 shadow-2xl group transition-all">{selectedCrop.icon}</span>
                <div>
                  <h2 className="text-5xl font-black text-white tracking-tighter">{selectedCrop.name}</h2>
                  <p className="text-zinc-500 font-mono tracking-[0.4em] uppercase text-xs mt-1">{selectedCrop.category} INDEX</p>
                </div>
              </div>
              <div className="bg-zinc-950 p-8 rounded-[36px] border border-zinc-800 shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Global Market Index</p>
                  <div className="flex items-center gap-1 text-green-500 font-bold text-lg font-mono">
                    <TrendingUp size={18} /> {selectedCrop.change24h}%
                  </div>
                </div>
                <p className="text-5xl font-black font-mono text-white tracking-tighter">{formatPrice(selectedCrop.currentPrice)} <span className="text-xl text-zinc-600">/ kg</span></p>
                <p className="text-xs text-zinc-700 mt-4 font-bold uppercase tracking-widest">Projection: 1 unit ≈ {selectedCrop.weightPerUnit}kg</p>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-600 ml-2">Available Ask Terminals</p>
                {[...selectedCrop.vendors].sort((a, b) => a.price - b.price).map(v => (
                  <div key={v.id} className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-5 rounded-3xl hover:border-green-400/30 transition-colors shadow-lg group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center font-black text-zinc-600 group-hover:text-green-500">{v.name[0]}</div>
                      <div>
                        <p className="font-black text-white text-md leading-none mb-1">{v.listingName || selectedCrop.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-600 uppercase font-bold tracking-tight">
                          <span>{v.name}</span>
                          <span className="flex items-center gap-1 text-yellow-500">
                            <Star size={10} fill="currentColor" /> {v.rating} <span className="text-zinc-700">({v.reviewCount})</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="font-mono font-black text-2xl text-green-500">{formatPrice(v.price)}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => { addToBudget(selectedCrop.id); setSelectedCrop(null); }} className="flex-1 bg-green-500 text-black py-6 rounded-[28px] font-black uppercase tracking-widest hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-green-500/10">Add to Assets</button>
                <button onClick={() => setSelectedCrop(null)} className="flex-1 bg-zinc-800 text-zinc-500 py-6 rounded-[28px] font-black uppercase tracking-widest hover:text-white transition-colors">Close View</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Modals */}
      {isAddCropModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-xl" onClick={() => { setIsAddCropModalOpen(false); setAddCropModalSelection(null); }}></div>
          <div className="bg-zinc-900 w-full max-w-lg rounded-[50px] overflow-hidden relative border border-zinc-800 shadow-2xl">
            <button onClick={() => { setIsAddCropModalOpen(false); setAddCropModalSelection(null); }} className="absolute top-8 right-8 z-20 w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"><X size={20} /></button>
            <div className="p-12 space-y-10">
              <h2 className="text-4xl font-black text-white tracking-tighter">Initialize {vendorShopType} Listing</h2>
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-zinc-600 uppercase block mb-3 tracking-widest ml-2">Available {vendorShopType} Index Assets</label>
                  <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-3 scrollbar-hide">
                    {crops
                      .filter(c => vendorShopType === 'Fruit' ? c.category === 'Fruit' : c.category !== 'Fruit')
                      .map(c => (
                        <button key={c.id} onClick={() => {
                          setAddCropModalSelection(c);
                          const nameInput = document.getElementById('admin-name') as HTMLInputElement;
                          if (nameInput) nameInput.value = c.name;
                        }} className={`p-4 rounded-[24px] border transition-all ${addCropModalSelection?.id === c.id ? 'bg-green-500 border-green-400 text-black shadow-xl shadow-green-400/20' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600'}`}>
                          <span className="text-3xl block">{c.icon}</span>
                        </button>
                      ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase ml-2 tracking-widest">Listing Name (Optional)</label>
                    <input id="admin-name" type="text" placeholder="Custom name for this listing" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 font-mono text-lg font-bold outline-none text-white focus:border-green-400/50 shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase ml-2 tracking-widest">Ask Index (₱)</label>
                    <input id="admin-p" type="number" min="0.01" step="0.01" placeholder="0.00" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 font-mono text-xl font-bold outline-none text-green-500 focus:border-green-400/50 shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase ml-2 tracking-widest">Liquidity (kg)</label>
                    <input id="admin-s" type="number" min="1" step="1" placeholder="0" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 font-mono text-xl font-bold outline-none text-white focus:border-green-400/50 shadow-inner" />
                  </div>
                </div>
              </div>
              <button onClick={() => {
                const nameInput = document.getElementById('admin-name') as HTMLInputElement;
                const priceInput = document.getElementById('admin-p') as HTMLInputElement;
                const stockInput = document.getElementById('admin-s') as HTMLInputElement;
                const name = nameInput.value.trim();
                const p = Number(priceInput.value);
                const s = Number(stockInput.value);
                if (!addCropModalSelection) {
                  alert('Please select a crop first.');
                  return;
                }
                if (p <= 0 || s <= 0) {
                  alert('Price and stock must be greater than zero.');
                  return;
                }
                handleAddCropToVendor(addCropModalSelection.id, p, s, name || addCropModalSelection.name);
                // Reset form
                nameInput.value = '';
                priceInput.value = '';
                stockInput.value = '';
                setAddCropModalSelection(null);
              }} className="w-full bg-green-500 text-black py-6 rounded-[28px] font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-green-400/20">Execute Listing</button>
            </div>
          </div>
        </div>
      )}

      {editingInventoryCrop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-xl" onClick={() => setEditingInventoryCrop(null)}></div>
          <div className="bg-zinc-900 w-full max-w-lg rounded-[50px] p-12 relative border border-zinc-800 text-center space-y-10 animate-in zoom-in-95 duration-200 shadow-2xl">
            <button onClick={() => setEditingInventoryCrop(null)} className="absolute top-8 right-8 z-20 w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"><X size={20} /></button>
            <div className="text-7xl mx-auto w-28 h-28 bg-zinc-950 rounded-[36px] flex items-center justify-center border border-zinc-800 shadow-2xl group">
              <span className="group-hover:scale-125 transition-transform duration-500">{editingInventoryCrop.icon}</span>
            </div>
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter">Update Node {editingInventoryCrop.name}</h2>
              <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.3em] mt-2">Adjusting terminal parameters</p>
            </div>
            <div className="grid grid-cols-2 gap-6 text-left">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase ml-3 tracking-widest">Listing Name</label>
                <input id="upd-name" type="text" defaultValue={editingInventoryCrop.vendors.find(v => v.id === adminVendorId)?.listingName || editingInventoryCrop.name} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 font-mono text-lg font-bold outline-none text-white focus:border-green-400/50 shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase ml-3 tracking-widest">Ask Index</label>
                <input id="upd-p" type="number" defaultValue={editingInventoryCrop.vendors.find(v => v.id === adminVendorId)?.price} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 font-mono text-xl font-bold outline-none text-green-400 focus:border-green-400/50 shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase ml-3 tracking-widest">Liquidity Level</label>
                <input id="upd-s" type="number" defaultValue={editingInventoryCrop.vendors.find(v => v.id === adminVendorId)?.stock} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 font-mono text-xl font-bold outline-none text-white focus:border-green-400/50 shadow-inner" />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => {
                const name = (document.getElementById('upd-name') as HTMLInputElement).value;
                const p = Number((document.getElementById('upd-p') as HTMLInputElement).value);
                const s = Number((document.getElementById('upd-s') as HTMLInputElement).value);
                if (p <= 0 || s <= 0) {
                  alert('Price and stock must be greater than zero.');
                  return;
                }
                handleUpdateVendorListing(editingInventoryCrop.id, p, s, name);
              }} className="flex-1 bg-green-500 text-black py-5 rounded-[28px] font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 shadow-green-500/10">Commit Asset</button>
              <button onClick={() => setEditingInventoryCrop(null)} className="flex-1 bg-zinc-800 text-zinc-500 py-5 rounded-[28px] font-black uppercase transition-colors hover:text-white">Discard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
