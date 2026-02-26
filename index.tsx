
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
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  Trash2,
  Package,
  Edit2,
  ArrowRight,
  Zap,
  Lock,
  Mail,
  ShieldCheck,
  LogOut,
  X,
  ShoppingBag,
  Leaf,
  Trophy,
  Award,
  DollarSign,
  Activity,
  AlertTriangle,
  Users,
  Heart,
  Bell,
  Download,
  ArrowUpDown,
  Sun,
  Moon,
  Users as UsersIcon,
  Activity as ActivityIcon,
  Server,
  Database,
  Globe,
  MessageSquare,
  FileText,
  Ban,
  CheckCircle,
  Clock,
  Megaphone,
  Flag,
  Eye,
  AlertCircle
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
import { UserRole, Crop, BudgetListItem, Vendor, SystemAlert, UserRecord, AuditLogEntry, Announcement, Complaint } from './types';
import { MOCK_CROPS } from './constants';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Simulated Intelligence Engine
const mockSystemCheck = (users: any[], crops: any[]): SystemAlert | null => {
  const rand = Math.random();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const id = `alert-${Date.now()}`;

  // 1. Reputation Management
  if (rand < 0.2) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    return {
      id,
      type: 'OPPORTUNITY',
      message: `User '${randomUser?.name || 'Juan Dela Cruz'}' has reached 50 verified transactions with a 4.9-star rating.`,
      suggestion: "Grant 'Trusted Seller' Badge to boost buyer confidence?",
      timestamp,
      actionLabel: "Grant Badge"
    };
  }

  // 2. Database Optimization
  if (rand < 0.4) {
    return {
      id,
      type: 'PERFORMANCE',
      message: `The main price table contains ${5000 + Math.floor(Math.random() * 500)} records from the previous harvest season (Year: 2025).`,
      suggestion: "Archive these records to 'historical_prices.csv' to reduce query time by approx 150ms?",
      timestamp,
      actionLabel: "Archive Data"
    };
  }

  // 3. Security Enforcement
  if (rand < 0.6) {
    return {
      id,
      type: 'SECURITY',
      message: `User 'CropKing${Math.floor(Math.random() * 100)}' is attempting to register using a phone number (+639xxxxxx) associated with a previously banned account (Reason: Spamming).`,
      suggestion: "Auto-block this registration and add IP to watchlist?",
      timestamp,
      actionLabel: "Block User"
    };
  }

  // 4. System Health
  if (rand < 0.8) {
    return {
      id,
      type: 'HEALTH',
      message: `Average server response time has spiked to ${(3 + Math.random()).toFixed(1)} seconds in the last hour. Detected 200MB of unused product images in the temporary cache.`,
      suggestion: "Run the 'Garbage Collection' script and clear the image cache to restore speed?",
      timestamp,
      actionLabel: "Optimize"
    };
  }

  // 5. Sentiment Analysis
  return {
    id,
    type: 'COMMUNITY',
    message: `Vendor 'Mario' maintains a 4.2-star rating, but 3 recent comments mention "rude behavior" and "refused to meet."`,
    suggestion: "Issue a Warning Notification to this vendor regarding Code of Conduct?",
    timestamp,
    actionLabel: "Issue Warning"
  };
};

// Simple hash function for password storage (not cryptographically secure, but far better than plain text)
const simpleHash = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const Logo = ({ size = 100, className = "", onUnlock }: { size?: number, className?: string, onUnlock?: () => void }) => {
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    setClicks(prev => {
      const next = prev + 1;
      if (next === 5) {
        onUnlock?.();
        return 0;
      }
      return next;
    });

    // Reset clicks if not continued quickly
    setTimeout(() => setClicks(0), 2000);
  };

  return (
    <img
      src="/AgriPresyo_logoFinal.png"
      alt="AgriPresyo"
      style={{ width: size, height: size }}
      className={`object-contain rounded-2xl ${className} cursor-pointer active:scale-95 transition-transform`}
      onClick={handleClick}
    />
  );
};

const formatPrice = (price: number) => {
  const value = price;
  const symbol = '₱';
  return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const timeAgo = (isoString: string): string => {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return new Date(isoString).toLocaleDateString();
};

const Ticker = ({ crops, onCropClick }: { crops: Crop[], onCropClick?: (crop: Crop) => void }) => {
  return (
    <div className="bg-zinc-900 border-b border-zinc-800 h-10 flex items-center overflow-hidden whitespace-nowrap sticky top-0 z-50 shadow-md">
      <div className="animate-marquee flex gap-8 px-4">
        {[...crops, ...crops].map((crop, idx) => (
          <div
            key={`${crop.id}-${idx}`}
            className="flex items-center gap-2 font-mono text-sm cursor-pointer hover:bg-zinc-800/60 rounded-lg px-2 py-1 transition-colors"
            onClick={() => onCropClick?.(crop)}
          >
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

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('theme');
      return (saved as Theme) || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-2xl bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:scale-110 active:scale-95 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.05)] border border-zinc-200 dark:border-zinc-800"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
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
// Crop image mapping and gradient backgrounds
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

const CropIcon = ({ crop, size = 'md' }: { crop: Crop, size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
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


const ROLE_LABELS: Record<UserRole, { label: string; icon: string; desc: string }> = {
  [UserRole.CONSUMER]: { label: 'CONSUMER', icon: '🛒', desc: 'Browse prices & build budgets' },
  [UserRole.VENDOR]: { label: 'VENDOR', icon: '🏪', desc: 'Manage your shop & inventory' },
  [UserRole.ADMIN]: { label: 'ADMIN', icon: '🛡️', desc: 'System administration & analytics' },
};

const RoleDropdown = ({ role, setRole, isAdminUnlocked }: { role: UserRole; setRole: (r: UserRole) => void; isAdminUnlocked: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = ROLE_LABELS[role];
  const otherRoles = Object.entries(ROLE_LABELS)
    .filter(([key]) => key !== role)
    .filter(([key]) => isAdminUnlocked || key !== UserRole.ADMIN) as [UserRole, typeof current][];

  return (
    <div ref={dropdownRef} className="relative mb-6">
      {/* Selected role trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between bg-black border border-zinc-800 rounded-2xl px-5 py-3.5 hover:border-green-500/40 transition-all group"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{current.icon}</span>
          <div className="text-left">
            <p className="text-xs font-black text-green-500 tracking-widest">{current.label}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">{current.desc}</p>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-zinc-600 group-hover:text-green-500 transition-all duration-300 ${isOpen ? 'rotate-180 text-green-500' : ''}`}
        />
      </button>

      {/* Dropdown options */}
      <div
        className={`absolute top-full left-0 right-0 mt-2 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden z-50 shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300 origin-top ${isOpen
          ? 'opacity-100 scale-y-100 translate-y-0'
          : 'opacity-0 scale-y-75 -translate-y-2 pointer-events-none'
          }`}
      >
        {otherRoles.map(([key, info]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setRole(key);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-green-500/10 transition-colors text-left border-b border-zinc-800/50 last:border-b-0"
          >
            <span className="text-xl">{info.icon}</span>
            <div>
              <p className="text-xs font-black text-zinc-400 tracking-widest">{info.label}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">{info.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const LoginPage = ({
  onLogin,
  attemptLogin,
  onRegister,
  isAdminUnlocked,
  onUnlock
}: {
  onLogin: (role: UserRole, email?: string) => void,
  attemptLogin: (email: string, password: string, role: UserRole) => Promise<string>,
  onRegister: (name: string, email: string, password: string, role: UserRole) => Promise<string>,
  isAdminUnlocked: boolean,
  onUnlock: () => void
}) => {
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
    const result = await attemptLogin(email.trim().toLowerCase(), password, role);
    if (result === 'ok') {
      onLogin(role, email.trim().toLowerCase());
    } else if (result === 'banned') {
      setError('🚫 Your account has been banned. Contact support for assistance.');
    } else if (result === 'pending') {
      setError('⏳ Your account is pending admin approval. Please wait.');
    } else {
      setError('Invalid credentials — please create an account or try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await onRegister(regName.trim(), regEmail.trim().toLowerCase(), regPassword, role);
    if (result === 'ok') {
      onLogin(role, regEmail.trim().toLowerCase());
    } else if (result === 'pending') {
      setError('✅ Registration submitted! Your vendor account is pending admin approval.');
      setShowRegister(false);
    } else if (result === 'exists') {
      setError('Account already exists with that email.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
      <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-green-400/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-green-400/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500 mt-8">
        <div className="flex flex-col items-center mb-6">
          <Logo
            size={120}
            className="text-green-500 mb-6 drop-shadow-[0_0_20px_rgba(34,197,94,0.1)]"
            onUnlock={() => {
              onUnlock();
              alert("🔰 ADMIN PRIVILEGES UNLOCKED");
            }}
          />
          <h1 className="text-5xl font-black tracking-tighter text-white">
            <span className="text-green-500">Agri</span>
            <span className="text-white/80">Presyo</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-bold mt-2 uppercase tracking-widest text-[10px]">A Website for Real-Time Market Prices.</p>
        </div>

        <div className="bg-zinc-950 dark:bg-black border border-zinc-800 rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-20">
          <RoleDropdown role={role} setRole={setRole} isAdminUnlocked={isAdminUnlocked} />

          {showRegister ? (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Logo size={20} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 grayscale brightness-200" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-white transition-all placeholder:text-zinc-600 shadow-inner"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-white transition-all placeholder:text-zinc-600 shadow-inner"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-white transition-all placeholder:text-zinc-600 shadow-inner"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setShowRegister(false)} className="flex-1 bg-black hover:bg-zinc-900 text-zinc-500 hover:text-white py-3 rounded-2xl font-black uppercase tracking-widest border border-zinc-800 transition-all">Back to Login</button>
                <button type="submit" className="flex-1 bg-green-500 text-black py-3 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all">Create Account</button>
              </div>
              {error && <p className="text-center text-sm text-red-500 mt-2">{error}</p>}
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-white transition-all placeholder:text-zinc-600 shadow-inner"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-white transition-all placeholder:text-zinc-600 shadow-inner"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-green-500 border border-green-500/50 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-500 hover:text-black hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.1)]"
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

const BannerItem: React.FC<{ announcement: Announcement; onDismiss: (id: string) => void }> = ({ announcement, onDismiss }) => {
  useEffect(() => {
    if (announcement.duration && announcement.duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(announcement.id);
      }, announcement.duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [announcement, onDismiss]);

  return (
    <div className={`p-4 rounded-2xl flex items-start justify-between gap-4 shadow-lg border relative group animate-in slide-in-from-top duration-500 ${announcement.priority === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' : announcement.priority === 'medium' ? 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'}`}>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl shrink-0 ${announcement.priority === 'high' ? 'bg-red-500/20' : announcement.priority === 'medium' ? 'bg-orange-500/20' : 'bg-blue-500/20'}`}>
          <Megaphone size={20} />
        </div>
        <div>
          <p className="font-black text-sm uppercase tracking-wider mb-0.5">{announcement.title}</p>
          <p className="text-xs font-medium opacity-90">{announcement.message}</p>
          {announcement.duration && announcement.duration > 0 && (
            <div className="w-full h-1 bg-black/5 dark:bg-white/10 mt-2 rounded-full overflow-hidden">
              <div className="h-full bg-current opacity-30 origin-left animate-duration-progress" style={{ animationDuration: `${announcement.duration}s` }} />
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => onDismiss(announcement.id)}
        className="text-current opacity-50 hover:opacity-100 transition-opacity p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const AnnouncementBanner = ({ announcements, dismissedIds, onDismiss }: { announcements: Announcement[], dismissedIds: string[], onDismiss: (id: string) => void }) => {
  const active = announcements.filter(a => a.active && !dismissedIds.includes(a.id));
  if (active.length === 0) return null;

  return (
    <div className="space-y-3 mb-8">
      {active.map(a => (
        <BannerItem key={a.id} announcement={a} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('AP_isAuthenticated') === 'true');
  const [role, setRole] = useState<UserRole>(() => (localStorage.getItem('AP_role') as UserRole) || UserRole.CONSUMER);
  const [currentUserEmail, setCurrentUserEmail] = useState(() => localStorage.getItem('AP_currentUserEmail') || '');

  // Secret Admin Access State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => localStorage.getItem('AP_admin_unlocked') === 'true');

  useEffect(() => {
    localStorage.setItem('AP_admin_unlocked', String(isAdminUnlocked));
  }, [isAdminUnlocked]);

  const [users, setUsers] = useState<UserRecord[]>(() => {
    try {
      const raw = localStorage.getItem('AP_users');
      const parsed = raw ? JSON.parse(raw) : [];
      // Migrate old users without status
      return parsed.map((u: any) => ({ ...u, status: u.status || 'active' }));
    } catch (e) {
      return [];
    }
  });

  // Admin feature states
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem('AP_auditLog') || '[]'); } catch { return []; }
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try { return JSON.parse(localStorage.getItem('AP_announcements') || '[]'); } catch { return []; }
  });
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try { return JSON.parse(localStorage.getItem('AP_complaints') || '[]'); } catch { return []; }
  });
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('AP_dismissed_announcements') || '[]'); } catch { return []; }
  });
  const [seenAnnouncementIds, setSeenAnnouncementIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('AP_seen_announcements') || '[]'); } catch { return []; }
  });
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'market' | 'shops' | 'analytics' | 'shop' | 'admin'>(() => (localStorage.getItem('AP_activeTab') as any) || 'market');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [addCropModalSelection, setAddCropModalSelection] = useState<Crop | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [budgetLimit, setBudgetLimit] = useState<number>(1000);
  const [budgetItems, setBudgetItems] = useState<BudgetListItem[]>([]);
  const [userVendorRatings, setUserVendorRatings] = useState<Record<string, number>>(() => { try { const s = localStorage.getItem('AP_userVendorRatings'); return s ? JSON.parse(s) : {}; } catch { return {}; } });
  const [vendorRatingData, setVendorRatingData] = useState<Record<string, { rating: number; reviewCount: number }>>(() => { try { const s = localStorage.getItem('AP_vendorRatingData'); return s ? JSON.parse(s) : {}; } catch { return {}; } });

  // Vendor-specific state
  const [vendorShopType, setVendorShopType] = useState<'Fruit' | 'Vegetable'>('Fruit');
  const [shopFilter, setShopFilter] = useState<'All' | 'Fruit' | 'Vegetable'>('All');
  const [hoverRating, setHoverRating] = useState(0);
  const [overrideVendorKey, setOverrideVendorKey] = useState<string | null>(null);
  const [overridePrice, setOverridePrice] = useState<string>('');
  const [expandedOverrideCrop, setExpandedOverrideCrop] = useState<string | null>(null);
  const [complaintConfirmStep, setComplaintConfirmStep] = useState(false);
  const [adminNoteComplaintId, setAdminNoteComplaintId] = useState<string | null>(null);
  const [adminNoteText, setAdminNoteText] = useState('');

  const [selectedPeriod, setSelectedPeriod] = useState<string>('');

  // Consumer features
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('AP_favorites') || '[]'); } catch { return []; }
  });
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'demand' | 'trending'>('default');

  // Vendor features

  const [vendorCostPrices, setVendorCostPrices] = useState<Record<string, number>>({});
  const [bulkAdjustPercent, setBulkAdjustPercent] = useState<number>(0);
  const [showAnnouncementsDropdown, setShowAnnouncementsDropdown] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaintForm, setComplaintForm] = useState({ subject: '', message: '' });

  // Save favorites to localStorage
  useEffect(() => { localStorage.setItem('AP_favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('AP_isAuthenticated', String(isAuthenticated)); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem('AP_role', role); }, [role]);
  useEffect(() => { localStorage.setItem('AP_currentUserEmail', currentUserEmail); }, [currentUserEmail]);
  useEffect(() => { localStorage.setItem('AP_activeTab', activeTab); }, [activeTab]);
  useEffect(() => { localStorage.setItem('AP_auditLog', JSON.stringify(auditLog)); }, [auditLog]);
  useEffect(() => { localStorage.setItem('AP_announcements', JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem('AP_complaints', JSON.stringify(complaints)); }, [complaints]);
  useEffect(() => { localStorage.setItem('AP_dismissed_announcements', JSON.stringify(dismissedIds)); }, [dismissedIds]);
  useEffect(() => { localStorage.setItem('AP_seen_announcements', JSON.stringify(seenAnnouncementIds)); }, [seenAnnouncementIds]);
  useEffect(() => { localStorage.setItem('AP_userVendorRatings', JSON.stringify(userVendorRatings)); }, [userVendorRatings]);
  useEffect(() => { localStorage.setItem('AP_vendorRatingData', JSON.stringify(vendorRatingData)); }, [vendorRatingData]);

  const handleDismissAnnouncement = (id: string) => {
    setDismissedIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const addAuditEntry = (action: string, target: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      action,
      target,
      details,
      timestamp: new Date().toLocaleString()
    };
    setAuditLog(prev => [entry, ...prev].slice(0, 100));
  };

  const toggleFavorite = (cropId: string) => {
    setFavorites(prev => prev.includes(cropId) ? prev.filter(f => f !== cropId) : [...prev, cropId]);
  };

  // Seasonal helper
  const getSeasonalStatus = (crop: Crop): { inSeason: boolean; label: string } => {
    const month = new Date().getMonth();
    const fruitSeasons: Record<string, number[]> = {
      'Mango': [2, 3, 4, 5], 'Banana': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Watermelon': [2, 3, 4, 5, 6],
      'Pineapple': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Papaya': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      'Calamansi': [7, 8, 9, 10, 11, 0], 'Coconut': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    };
    const name = crop.name.split(' ').pop() || crop.name;
    const seasons = fruitSeasons[name];
    if (!seasons) return { inSeason: true, label: 'In Season' };
    return seasons.includes(month) ? { inSeason: true, label: 'In Season' } : { inSeason: false, label: 'Off Season' };
  };

  // Local Market State
  const [crops, setCrops] = useState<Crop[]>(MOCK_CROPS);

  // System Intelligence
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);

  // Simulate System Intelligence Checks
  useEffect(() => {
    if (role !== UserRole.ADMIN) return;
    const interval = setInterval(() => {
      const alert = mockSystemCheck(users, crops);
      if (alert) {
        setSystemAlerts(prev => [alert, ...prev].slice(0, 10)); // Keep last 10 alerts
      }
    }, 8000); // Check every 8 seconds
    return () => clearInterval(interval);
  }, [role, users, crops]);

  const currentVendorId = useMemo(() => {
    if (role === UserRole.VENDOR && currentUserEmail) return currentUserEmail;
    return 'v_admin_node';
  }, [role, currentUserEmail]);

  const vendorInventory = useMemo(() => {
    return crops.filter(c => c.vendors.some(v => v.id === currentVendorId));
  }, [crops, currentVendorId]);

  // Simulated order notifications for vendors
  useEffect(() => {
    // Replaced fake order notifications with Admin Announcements (via Bell icon)
  }, []);

  const allVendors = useMemo(() => {
    const vendorMap = new Map();

    // 1. First, populate from registered users who are vendors
    users.filter(u => u.role === UserRole.VENDOR).forEach(u => {
      vendorMap.set(u.email, {
        id: u.email,
        name: u.name || u.email.split('@')[0],
        rating: vendorRatingData[u.email]?.rating ?? 5.0,
        reviewCount: vendorRatingData[u.email]?.reviewCount ?? 0,
        specialty: 'New Market Partner',
        price: 0,
        stock: 0,
        cropsSold: []
      });
    });

    // 2. Then, merge with vendors who have crop listings (mock vendors)
    crops.forEach(crop => {
      crop.vendors.forEach(v => {
        if (!vendorMap.has(v.id)) {
          vendorMap.set(v.id, { ...v, cropsSold: [] });
        }
        const existing = vendorMap.get(v.id);
        if (!existing.cropsSold.some((c: any) => c.id === crop.id)) {
          existing.cropsSold.push(crop);
        }
        // Update rating/price/stock/reviewCount from the crop vendor data
        if (v.price > 0) existing.price = v.price;
        if (v.stock > 0) existing.stock = v.stock;
        existing.rating = v.rating;
        existing.reviewCount = v.reviewCount;
      });
    });

    return Array.from(vendorMap.values());
  }, [crops, users, vendorRatingData]);

  const filteredVendors = useMemo(() => {
    return allVendors.filter(v => {
      if (v.id === currentVendorId && role === UserRole.VENDOR) return false;
      if (shopFilter === 'All') return true;
      if (shopFilter === 'Fruit') return v.cropsSold.every((c: any) => c.category === 'Fruit');
      if (shopFilter === 'Vegetable') return v.cropsSold.every((c: any) => c.category !== 'Fruit');
      return true;
    });
  }, [allVendors, shopFilter, role, currentVendorId]);

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
    let result = crops.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === 'All' || c.category === activeCategory;
      return matchesSearch && matchesCat;
    });
    switch (sortBy) {
      case 'price-asc': result = [...result].sort((a, b) => a.currentPrice - b.currentPrice); break;
      case 'price-desc': result = [...result].sort((a, b) => b.currentPrice - a.currentPrice); break;
      case 'demand': result = [...result].sort((a, b) => { const d = { High: 3, Medium: 2, Low: 1 }; return (d[b.demand as keyof typeof d] || 0) - (d[a.demand as keyof typeof d] || 0); }); break;
      case 'trending': result = [...result].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)); break;
    }
    return result;
  }, [search, crops, activeCategory, sortBy]);

  const budgetStats = useMemo(() => {
    let totalCost = 0;
    let totalWeight = 0;
    budgetItems.forEach(item => {
      const crop = crops.find(c => c.id === item.cropId);
      if (crop) {
        const weight = item.unit === 'kg' ? item.quantity : item.quantity * crop.weightPerUnit;
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
      return [...prev, { cropId, quantity: 1, unit: 'qty' as const }];
    });
  };

  const toggleBudgetUnit = (cropId: string) => {
    setBudgetItems(prev => prev.map(i => {
      if (i.cropId !== cropId) return i;
      const crop = crops.find(c => c.id === cropId);
      if (!crop) return i;
      if (i.unit === 'qty') {
        // Convert qty to kg
        const kg = Number((i.quantity * crop.weightPerUnit).toFixed(2));
        return { ...i, unit: 'kg' as const, quantity: kg || 0.1 };
      } else {
        // Convert kg to qty
        const qty = Math.max(1, Math.round(i.quantity / crop.weightPerUnit));
        return { ...i, unit: 'qty' as const, quantity: qty };
      }
    }));
  };

  const removeFromBudget = (cropId: string) => {
    setBudgetItems(prev => prev.filter(i => i.cropId !== cropId));
  };

  const updateBudgetQty = (cropId: string, qty: number) => {
    setBudgetItems(prev => prev.map(i => {
      if (i.cropId !== cropId) return i;
      const minVal = i.unit === 'kg' ? 0.1 : 1;
      return { ...i, quantity: Math.max(minVal, qty) };
    }));
  };

  const clearUsers = () => {
    if (window.confirm('Are you sure you want to clear the User Registry? This cannot be undone.')) {
      setUsers([]);
      localStorage.removeItem('AP_users');
    }
  };

  const handleAlertAction = (alert: SystemAlert) => {
    switch (alert.type) {
      case 'OPPORTUNITY':
        window.alert(`✅ Badge granted to high-performing user!`);
        break;
      case 'SECURITY':
        window.alert(`🛡️ Machine ID blocked from future registration.`);
        break;
      case 'PERFORMANCE':
        window.alert(`🗄️ Old records archived. Database size reduced by 15%.`);
        break;
      case 'HEALTH':
        window.alert(`⚡ Cache cleared. Response times normalized.`);
        break;
      case 'COMMUNITY':
        window.alert(`⚠️ Official Warning sent to Vendor for Code of Conduct violation.`);
        break;
    }
    // Remove the alert after action
    setSystemAlerts(prev => prev.filter(a => a.id !== alert.id));
  };

  const handleLogin = (userRole: UserRole, email?: string) => {
    setRole(userRole);
    setIsAuthenticated(true);
    if (email) setCurrentUserEmail(email);
    if (userRole === UserRole.VENDOR) {
      setActiveTab('shop');
    } else if (userRole === UserRole.ADMIN) {
      setActiveTab('admin');
    } else {
      setActiveTab('market');
    }
  };

  const attemptLogin = async (email: string, password: string, userRole: UserRole): Promise<string> => {
    const hashed = await simpleHash(password);
    const found = users.find(u => u.email === email && u.password === hashed && u.role === userRole);
    if (!found) return 'not_found';
    if (found.status === 'banned') return 'banned';
    if (found.status === 'pending') return 'pending';
    return 'ok';
  };

  const registerUser = async (name: string, email: string, password: string, userRole: UserRole): Promise<string> => {
    if (users.find(u => u.email === email)) return 'exists';
    const hashed = await simpleHash(password);
    const status = userRole === UserRole.VENDOR ? 'pending' : 'active';
    const next: UserRecord[] = [...users, { name: name || undefined, email, password: hashed, role: userRole, status: status as any }];
    setUsers(next);
    try { localStorage.setItem('AP_users', JSON.stringify(next)); } catch (e) { }
    if (userRole === UserRole.VENDOR) return 'pending';
    return 'ok';
  };



  const handleUpdatePrice = (cropId: string, newPrice: number) => {
    const now = new Date().toISOString();
    setCrops(prev => prev.map(c => {
      if (c.id === cropId) {
        const updatedVendors = c.vendors.map(v => v.id === currentVendorId ? { ...v, price: newPrice } : v);
        const newHistory = [...c.history, { date: now.slice(0, 10), price: newPrice }];
        return { ...c, currentPrice: newPrice, vendors: updatedVendors, lastUpdated: now, history: newHistory };
      }
      return c;
    }));
    setEditingInventoryCrop(null);
  };

  const handleUpdateStock = (cropId: string, newStock: number) => {
    setCrops(prev => prev.map(c => {
      if (c.id === cropId) {
        const updatedVendors = c.vendors.map(v => v.id === currentVendorId ? { ...v, stock: newStock } : v);
        return { ...c, vendors: updatedVendors };
      }
      return c;
    }));
    setEditingInventoryCrop(null);
  };

  const handleDeleteFromInventory = (cropId: string) => {
    setCrops(prev => prev.map(c => {
      if (c.id === cropId) {
        return { ...c, vendors: c.vendors.filter(v => v.id !== currentVendorId) };
      }
      return c;
    }));
  };



  const handleAddCropToVendor = (cropId: string, price: number, stock: number, listingName?: string) => {
    const now = new Date().toISOString();
    setCrops(prev => prev.map(c => {
      if (c.id === cropId) {
        if (c.vendors.some(v => v.id === currentVendorId)) return c;
        const newEntry: Vendor = {
          id: currentVendorId,
          name: 'Personal Market Node',
          rating: 5.0,
          reviewCount: 1,
          specialty: vendorShopType === 'Fruit' ? 'Premium Fruit Hub' : 'Highland Veggie Outlet',
          price,
          stock,
          isHot: true,
          listingName: listingName && listingName.trim() ? listingName.trim() : undefined,
        };
        const newHistory = [...c.history, { date: now.slice(0, 10), price }];
        return { ...c, vendors: [...c.vendors, newEntry], lastUpdated: now, history: newHistory };
      }
      return c;
    }));
    setIsAddCropModalOpen(false);
  };

  const handleRateVendor = (vId: string, newRating: number) => {
    const existingUserRating = userVendorRatings[vId] || 0;
    const finalUserRating = existingUserRating === newRating ? 0 : newRating;

    setUserVendorRatings(prev => ({ ...prev, [vId]: finalUserRating }));

    // Try to find vendor in crops first, then fall back to vendorRatingData or allVendors
    const cropVendor = crops.flatMap(c => c.vendors).find(v => v.id === vId);
    const currentRating = cropVendor?.rating ?? vendorRatingData[vId]?.rating ?? 5.0;
    const currentCount = cropVendor?.reviewCount ?? vendorRatingData[vId]?.reviewCount ?? 0;

    let newCount = currentCount;
    let totalScore = currentRating * currentCount;

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

    // Always store in vendorRatingData (works for ALL vendors)
    setVendorRatingData(prev => ({ ...prev, [vId]: { rating: finalAvg, reviewCount: newCount } }));

    // Also update in crops if vendor exists there
    if (cropVendor) {
      setCrops(prev => prev.map(c => ({
        ...c,
        vendors: c.vendors.map(v => v.id === vId ? { ...v, rating: finalAvg, reviewCount: newCount } : v)
      })));
    }

    // Update selectedVendor if it's the one being rated
    if (selectedVendor && selectedVendor.id === vId) {
      setSelectedVendor((prev: any) => ({ ...prev, rating: finalAvg, reviewCount: newCount }));
    }
  };

  const handleUpdateVendorListing = (cropId: string, newPrice: number, newStock: number, newListingName?: string) => {
    const now = new Date().toISOString();
    setCrops(prev => prev.map(c => {
      if (c.id === cropId) {
        const updatedVendors = c.vendors.map(v => v.id === currentVendorId ? { ...v, price: newPrice, stock: newStock, listingName: newListingName?.trim() ? newListingName : v.listingName } : v);
        const newHistory = [...c.history, { date: now.slice(0, 10), price: newPrice }];
        return { ...c, vendors: updatedVendors, lastUpdated: now, history: newHistory };
      }
      return c;
    }));
    setEditingInventoryCrop(null);
  };

  const handleSubmitComplaint = () => {
    if (!complaintForm.subject.trim() || !complaintForm.message.trim()) {
      alert('Please fill in all fields');
      return;
    }
    // Show confirm step instead of browser confirm()
    setComplaintConfirmStep(true);
  };

  const confirmSubmitComplaint = () => {
    const newComplaint: Complaint = {
      id: `comp-${Date.now()}`,
      from: currentUserEmail,
      fromRole: UserRole.VENDOR,
      subject: complaintForm.subject,
      message: complaintForm.message,
      status: 'open',
      timestamp: new Date().toISOString()
    };
    setComplaints(prev => [newComplaint, ...prev]);
    setComplaintForm({ subject: '', message: '' });
    setComplaintConfirmStep(false);
    setIsComplaintModalOpen(false);
    addAuditEntry('SUBMIT_COMPLAINT', currentUserEmail, `Subject: ${newComplaint.subject}`);
  };

  const renderConsumerView = () => {
    const favoriteCrops = crops.filter(c => favorites.includes(c.id));

    return (
      <div className="space-y-6 sm:space-y-8 pb-32 lg:pb-12 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search markets..."
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 sm:py-4 pl-12 pr-4 sm:pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/50 text-zinc-900 dark:text-white transition-all text-sm sm:text-lg shadow-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 pb-2">
              {['All', 'Fruit', 'Vegetable', 'Spice', 'Root'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all ${activeCategory === cat ? 'bg-green-400 border-green-400 text-black shadow-lg shadow-green-400/20' : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white'}`}
                >
                  {cat === 'All' ? 'All' : `${cat}s`}
                </button>
              ))}
              <div className="flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-inner overflow-x-auto scrollbar-hide ml-auto">
                {[
                  { key: 'default', label: 'All', icon: <ArrowUpDown size={12} /> },
                  { key: 'price-asc', label: '₱↑', icon: <ChevronUp size={12} /> },
                  { key: 'price-desc', label: '₱↓', icon: <ChevronDown size={12} /> },
                  { key: 'demand', label: 'Hot', icon: <Zap size={12} /> },
                  { key: 'trending', label: 'Top', icon: <TrendingUp size={12} /> },
                ].map(s => (
                  <button
                    key={s.key}
                    onClick={() => setSortBy(s.key as any)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${sortBy === s.key ? 'bg-green-400 text-black shadow-md' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60'}`}
                  >
                    {s.icon}
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div
            className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group cursor-pointer hover:border-green-400/30 transition-all"
            onClick={() => analyticsData.topGainer && setSelectedCrop(analyticsData.topGainer)}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <TrendingUp size={80} className="text-green-400" />
            </div>
            <div className="flex justify-between items-start relative z-10">
              <span className="text-green-400 font-bold text-xs uppercase tracking-widest">Market Top Gainer</span>
            </div>
            <div className="mt-4 relative z-10">
              <h4 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white">{analyticsData.topGainer?.name || 'Loading...'}</h4>
              <div className="flex items-center gap-2">
                {analyticsData.topGainer && <CropIcon crop={analyticsData.topGainer} size="lg" />}
                <p className="text-green-400 font-mono font-bold text-xl">+{analyticsData.topGainer?.change24h}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Favorites / Watchlist */}
        {favoriteCrops.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter text-zinc-900 dark:text-white">
              <Heart className="text-red-400" size={20} fill="currentColor" />
              My Watchlist
              <span className="text-sm font-mono text-zinc-500 ml-2">{favoriteCrops.length} items</span>
            </h2>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {favoriteCrops.map(crop => (
                <div
                  key={`fav-${crop.id}`}
                  className="min-w-[160px] sm:min-w-[200px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-4 cursor-pointer hover:shadow-green-400/10 transition-all shadow-lg flex-shrink-0"
                  onClick={() => setSelectedCrop(crop)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <CropIcon crop={crop} size="sm" />
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white text-sm">{crop.name}</p>
                      <p className="font-mono text-green-500 font-bold text-sm">{formatPrice(crop.currentPrice)}</p>
                    </div>
                  </div>
                  <div className={`text-xs font-bold flex items-center gap-1 ${crop.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {crop.change24h >= 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {Math.abs(crop.change24h)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter text-zinc-900 dark:text-white">
            <BarChart3 className="text-green-400" size={20} />
            Terminal Intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCrops.map(crop => {
              const season = getSeasonalStatus(crop);
              const isFav = favorites.includes(crop.id);
              return (
                <div
                  key={crop.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-all group relative overflow-hidden shadow-lg hover:shadow-green-400/5 hover:-translate-y-1"
                  onClick={() => setSelectedCrop(crop)}
                >
                  {/* Seasonal badge */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${season.inSeason ? 'bg-green-400/10 text-green-600' : 'bg-red-400/10 text-red-600'}`}>
                      {season.inSeason ? '🟢' : '🔴'} {season.label}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(crop.id); }}
                      className={`p-1.5 rounded-lg transition-all ${isFav ? 'text-red-500 bg-red-500/10' : 'text-zinc-400 hover:text-red-500 hover:bg-red-500/10'}`}
                    >
                      <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="flex justify-between items-start relative z-10 mt-2">
                    <div className="flex items-center gap-4">
                      <div className="group-hover:scale-110 transition-transform"><CropIcon crop={crop} size="lg" /></div>
                      <div>
                        <h3 className="font-black text-zinc-900 dark:text-white text-lg leading-tight">{crop.name}</h3>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{crop.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xl font-bold text-zinc-900 dark:text-white">
                        {formatPrice(crop.currentPrice)}
                      </p>
                      <div className={`flex items-center justify-end text-xs font-bold ${crop.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {crop.change24h >= 0 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {Math.abs(crop.change24h)}%
                      </div>
                      {crop.lastUpdated && (
                        <p className="text-[9px] text-zinc-400 dark:text-zinc-600 font-mono mt-1 flex items-center justify-end gap-1">
                          <Clock size={9} /> {timeAgo(crop.lastUpdated)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-8 flex items-end justify-between relative z-10">
                    <Sparkline data={crop.history} color={crop.change24h >= 0 ? '#4ade80' : '#ef4444'} />
                    <button
                      onClick={(e) => { e.stopPropagation(); addToBudget(crop.id); }}
                      className="bg-zinc-100 dark:bg-zinc-800 hover:bg-green-500 dark:hover:bg-green-500 hover:text-black p-4 rounded-2xl text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-black transition-all shadow-xl active:scale-90 border border-zinc-200 dark:border-zinc-700"
                    >
                      <Calculator size={22} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget Recommendations */}
        {budgetItems.length === 0 && (
          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 lg:p-8 rounded-3xl sm:rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/20">
                <Calculator className="text-green-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900">Suggested Basket</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Best Value Picks Within ₱{budgetLimit}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...crops].sort((a, b) => a.currentPrice - b.currentPrice).slice(0, 4).map(crop => (
                <div
                  key={`suggest-${crop.id}`}
                  className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:border-green-400/30 transition-colors cursor-pointer group"
                  onClick={() => { addToBudget(crop.id); }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="group-hover:scale-110 transition-transform"><CropIcon crop={crop} size="sm" /></div>
                    <p className="font-bold text-zinc-900 dark:text-white text-sm">{crop.name}</p>
                  </div>
                  <p className="font-mono text-green-500 font-bold text-lg">{formatPrice(crop.currentPrice)}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Click to add to budget</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCalculatorWidget = () => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl sm:rounded-[40px] p-4 sm:p-6 lg:p-10 shadow-2xl relative overflow-hidden mt-8 sm:mt-12 mb-16 sm:mb-20">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-8 mb-6 sm:mb-10">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-green-400 p-2 rounded-xl">
              <Calculator className="text-black" size={28} />
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white">Smart Asset Projection</h2>
          </div>
          <p className="text-zinc-500 font-medium">Auto-calculating unit weight vs market index values</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 bg-zinc-50 dark:bg-zinc-800/50 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-inner">
          <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Liquidity:</span>
          <input
            type="number"
            className="bg-transparent w-32 text-right font-mono text-2xl font-bold focus:outline-none text-green-600"
            value={budgetLimit}
            onChange={(e) => setBudgetLimit(Number(e.target.value))}
          />
          <span className="text-sm font-black text-zinc-400 font-mono">₱</span>
        </div>
      </div>

      {budgetItems.length === 0 ? (
        <div className="text-center py-12 sm:py-20 border-2 border-dashed border-zinc-800 dark:border-zinc-700 rounded-2xl sm:rounded-[32px] bg-zinc-900/10 dark:bg-zinc-100/5">
          <Package className="mx-auto text-zinc-800 dark:text-zinc-600 mb-6" size={64} />
          <p className="text-zinc-400 dark:text-zinc-500 text-xl font-black uppercase tracking-tighter">No Active Trades</p>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2">Select produce from market to begin calculating</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4">
            {budgetItems.map(item => {
              const crop = crops.find(c => c.id === item.cropId)!;
              const weight = item.unit === 'kg' ? item.quantity : item.quantity * crop.weightPerUnit;
              const displayQty = item.unit === 'kg' ? `${item.quantity}kg` : `${item.quantity} units`;
              const stepVal = item.unit === 'kg' ? 0.1 : 1;
              const minVal = item.unit === 'kg' ? 0.1 : 1;
              return (
                <div key={item.cropId} className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-50 dark:bg-zinc-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-700 transition-colors group gap-4">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="group-hover:scale-110 transition-transform"><CropIcon crop={crop} size="md" /></div>
                    <div>
                      <h4 className="font-black text-base sm:text-xl text-zinc-900 dark:text-white">{crop.name}</h4>
                      <div className="flex gap-3 text-xs font-mono font-bold text-zinc-500 uppercase tracking-tight">
                        <span>{displayQty}</span>
                        <span>≈ {weight.toFixed(2)}kg</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-8 flex-wrap sm:flex-nowrap">
                    <button onClick={() => toggleBudgetUnit(item.cropId)} className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm ${item.unit === 'kg' ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' : 'bg-green-500/10 text-green-500 border-green-500/30'}`}>
                      {item.unit === 'qty' ? 'QTY' : 'KG'}
                    </button>
                    <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-zinc-900 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                      <button onClick={() => updateBudgetQty(item.cropId, item.unit === 'kg' ? Number((item.quantity - stepVal).toFixed(2)) : item.quantity - 1)} className="p-1.5 sm:p-2 hover:bg-red-500/10 hover:text-red-500 transition-all rounded-lg"><Minus size={16} /></button>
                      <span className="w-12 sm:w-16 text-center text-sm sm:text-lg font-black font-mono text-zinc-900 dark:text-white">{item.unit === 'kg' ? item.quantity.toFixed(1) : item.quantity}</span>
                      <button onClick={() => updateBudgetQty(item.cropId, item.unit === 'kg' ? Number((item.quantity + stepVal).toFixed(2)) : item.quantity + 1)} className="p-1.5 sm:p-2 hover:bg-green-400/10 hover:text-green-400 transition-all rounded-lg"><Plus size={16} /></button>
                    </div>
                    <div className="text-right flex-1 sm:w-32 sm:flex-none">
                      <p className="font-mono text-lg sm:text-2xl font-bold text-zinc-900 dark:text-white">{formatPrice(weight * crop.currentPrice)}</p>
                    </div>
                    <button onClick={() => removeFromBudget(item.cropId)} className="text-zinc-300 hover:text-red-500 transition-all p-2 sm:p-3">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[32px] border border-zinc-200 dark:border-zinc-700 mt-6 sm:mt-10 shadow-inner">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-10">
              <div className="text-center md:text-left flex-1">
                <p className="text-xs text-zinc-400 uppercase font-black tracking-widest mb-2">Total Projected Commitment</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-lg sm:text-2xl font-black text-zinc-400 font-mono">{budgetStats.totalWeight.toFixed(2)}kg</span>
                  <span className="text-3xl sm:text-4xl lg:text-6xl font-black font-mono text-zinc-900 dark:text-white tracking-tighter">{formatPrice(budgetStats.totalCost)}</span>
                </div>
              </div>
              <div className="w-full max-w-lg bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex justify-between text-xs font-black uppercase mb-3">
                  <span className="text-zinc-400">Inventory Liquidity Used</span>
                  <span className={budgetStats.totalCost > budgetLimit ? 'text-red-500' : 'text-green-600'}>{Math.round((budgetStats.totalCost / budgetLimit) * 100)}%</span>
                </div>
                <div className="h-6 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-1 shadow-inner">
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
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-[36px] p-4 sm:p-6 lg:p-8 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group flex flex-col justify-between h-full shadow-lg"
      onClick={() => setSelectedVendor(vendor)}
    >
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4 sm:mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[28px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-xl sm:text-3xl text-zinc-900 dark:text-white group-hover:bg-green-500 group-hover:text-black transition-all border border-zinc-200 dark:border-zinc-700 group-hover:border-transparent">
              {vendor.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white group-hover:text-green-600 transition-colors">{vendor.name}</h3>
                {vendor.isHot && <ShieldCheck size={20} className="text-green-500" />}
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={14} fill="currentColor" />
                <span className="text-sm font-black text-zinc-900 dark:text-white">{vendor.rating}</span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase ml-1 tracking-widest">{vendor.reviewCount} Reports</span>
              </div>
            </div>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-[10px] font-black uppercase text-green-600 shadow-sm">
            {vendor.specialty}
          </div>
        </div>
        <div className="flex gap-3 overflow-hidden h-12 items-center px-2">
          {vendor.cropsSold.slice(0, 7).map((crop: any) => (
            <div key={crop.id}><CropIcon crop={crop} size="sm" /></div>
          ))}
          {vendor.cropsSold.length > 7 && (
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500 border border-zinc-800 shrink-0">
              +{vendor.cropsSold.length - 7}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 sm:mt-8 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 sm:pt-6">
        <Icon size={24} className="text-zinc-300 group-hover:text-green-500/50 transition-colors" />
        <button className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
          Connect Terminal <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );

  const renderShopsView = () => (
    <div className="space-y-16 pb-32 lg:pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">Market Nodes</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg mt-2 font-medium">Connect to specialized produce terminals</p>
        </div>
        <div className="flex gap-2 sm:gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-1 sm:p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-inner">
          {['All', 'Fruit', 'Vegetable'].map(f => (
            <button
              key={f}
              onClick={() => setShopFilter(f as any)}
              className={`px-3 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-black transition-all uppercase tracking-widest ${shopFilter === f ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-md border border-zinc-200 dark:border-zinc-700' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
            >
              {f === 'All' ? 'All' : `${f}s`}
            </button>
          ))}
        </div>
      </div>

      {(shopFilter === 'All' || shopFilter === 'Fruit') && (
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-400/10 border border-orange-400/20 flex items-center justify-center rounded-[20px] shadow-sm">
              <ShoppingBag size={32} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Fruit Nodes</h3>
              <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Strict Fruit Specialization</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {fruitVendors.map(v => <ShopCard key={v.id} vendor={v} icon={ShoppingBag} />)}
          </div>
        </section>
      )}

      {(shopFilter === 'All' || shopFilter === 'Vegetable') && (
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-400/10 border border-green-400/20 flex items-center justify-center rounded-[20px] shadow-sm">
              <Leaf size={32} className="text-green-500" />
            </div>
            <div>
              <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Vegetable & Spice Nodes</h3>
              <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">High-Intensity Greens & Aromatics</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {vegetableVendors.map(v => <ShopCard key={v.id} vendor={v} icon={Store} />)}
          </div>
        </section>
      )}
    </div>
  );

  const RankingCard = ({ title, items, color, subtitle, onCropClick }: { title: string, items: Crop[], color: string, subtitle: string, onCropClick?: (crop: Crop) => void }) => (
    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-[40px] p-4 sm:p-6 lg:p-8 shadow-2xl flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-3 rounded-2xl border ${color === 'yellow' ? 'bg-yellow-400/20 border-yellow-400/30' : 'bg-green-400/20 border-green-400/30'}`}>
          {color === 'yellow' ? <Trophy className="text-yellow-400" size={28} /> : <Award className="text-green-500" size={28} />}
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">{title}</h3>
          <p className="text-zinc-600 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-4 flex-1">
        {items.map((crop, idx) => (
          <div
            key={crop.id}
            className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-green-400/30 transition-colors group cursor-pointer"
            onClick={() => onCropClick?.(crop)}
          >
            <div className="flex items-center gap-4">
              <span className="text-xl font-black text-zinc-700 font-mono w-6">#{idx + 1}</span>
              <div className="group-hover:scale-110 transition-transform"><CropIcon crop={crop} size="md" /></div>
              <div>
                <h4 className="font-black text-zinc-900 dark:text-white text-sm">{crop.name}</h4>
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
        <h2 className="text-3xl sm:text-5xl font-black tracking-tighter">Market Leaderboards</h2>
        <p className="text-zinc-500 text-lg mt-2 font-medium">Real-time asset rankings segmented by category</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <RankingCard
          title="Premium Fruits"
          subtitle="Highest Ask Index"
          items={analyticsData.expFruits}
          color="yellow"
          onCropClick={(crop) => setSelectedCrop(crop)}
        />
        <RankingCard
          title="Value Fruits"
          subtitle="Lowest Ask Index"
          items={analyticsData.cheapFruits}
          color="green"
          onCropClick={(crop) => setSelectedCrop(crop)}
        />
        <RankingCard
          title="Premium Veggies"
          subtitle="Highest Ask Index"
          items={analyticsData.expVeggies}
          color="yellow"
          onCropClick={(crop) => setSelectedCrop(crop)}
        />
        <RankingCard
          title="Value Veggies"
          subtitle="Lowest Ask Index"
          items={analyticsData.cheapVeggies}
          color="green"
          onCropClick={(crop) => setSelectedCrop(crop)}
        />
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/30 p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <BarChart3 className="text-green-500" size={24} />
            <h3 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">Aggregate Market Volatility</h3>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 sm:p-6 rounded-2xl sm:rounded-[24px] shadow-lg">
              <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-black uppercase tracking-widest mb-2">Period</p>
              <p className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white">{aggregateVolatilityData.stats.date}</p>
            </div>
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 sm:p-6 rounded-2xl sm:rounded-[24px] shadow-lg">
              <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-black uppercase tracking-widest mb-2">Average Price</p>
              <p className="text-lg sm:text-2xl font-mono font-black text-green-400">₱{aggregateVolatilityData.stats.price}</p>
            </div>
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 sm:p-6 rounded-2xl sm:rounded-[24px] shadow-lg">
              <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-black uppercase tracking-widest mb-2">Price Range</p>
              <p className="text-sm font-mono text-zinc-900 dark:text-white">₱{aggregateVolatilityData.stats.min} - ₱{aggregateVolatilityData.stats.max}</p>
            </div>
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 sm:p-6 rounded-2xl sm:rounded-[24px] shadow-lg">
              <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-black uppercase tracking-widest mb-2">Change</p>
              <p className={`text-lg sm:text-2xl font-mono font-black ${aggregateVolatilityData.stats.change >= 0 ? 'text-green-400' : 'text-red-500'}`}>{aggregateVolatilityData.stats.change >= 0 ? '+' : ''}{aggregateVolatilityData.stats.change}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderVendorView = () => (
    <div className="space-y-12 pb-32 lg:pb-12 animate-in slide-in-from-bottom duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[40px] border border-zinc-200 dark:border-zinc-800 relative overflow-hidden group shadow-2xl flex flex-col justify-between">
          <div>
            <p className="text-zinc-500 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Node Specialization</p>
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-3xl ${vendorShopType === 'Fruit' ? 'bg-orange-400/10' : 'bg-green-400/10'}`}>
                {vendorShopType === 'Fruit' ? <ShoppingBag className="text-orange-400" size={32} /> : <Leaf className="text-green-500" size={32} />}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">{vendorShopType} Merchant</h3>
                <p className="text-zinc-600 dark:text-zinc-500 text-xs font-bold">Trading {vendorShopType}s strictly</p>
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

        <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[40px] border border-zinc-200 dark:border-zinc-800 relative overflow-hidden group shadow-2xl flex flex-col justify-center">
          <Zap className="text-yellow-400 absolute top-8 right-8 group-hover:scale-150 transition-transform duration-500 opacity-20" size={64} />
          <p className="text-zinc-500 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Market Demand Signal</p>
          {(() => {
            const avgChange = crops.reduce((sum, c) => sum + c.change24h, 0) / crops.length;
            const signal = avgChange >= 3 ? 'BULLISH' : avgChange >= 0 ? 'NEUTRAL' : 'BEARISH';
            const signalColor = avgChange >= 3 ? 'text-green-400' : avgChange >= 0 ? 'text-yellow-400' : 'text-red-500';
            const signalLabel = avgChange >= 3 ? 'Optimal Liquidity Period' : avgChange >= 0 ? 'Stable Market Conditions' : 'Caution: Declining Prices';
            return (
              <>
                <div className={`text-3xl sm:text-5xl font-black tracking-tighter ${signalColor}`}>{signal}</div>
                <p className={`${signalColor} font-bold text-xs tracking-widest uppercase mt-2`}>{signalLabel}</p>
              </>
            );
          })()}
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[40px] border border-zinc-200 dark:border-zinc-800 relative overflow-hidden group shadow-2xl flex flex-col justify-center">
          <Package className="text-blue-400 absolute top-8 right-8 group-hover:scale-150 transition-transform duration-500 opacity-20" size={64} />
          <p className="text-zinc-500 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Node Aggregate</p>
          <div className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
            {vendorInventory.reduce((acc, c) => acc + (c.vendors.find(v => v.id === currentVendorId)?.stock || 0), 0).toLocaleString()}
            <span className="text-lg text-zinc-600 dark:text-zinc-500 font-mono uppercase ml-3 tracking-normal">kg</span>
          </div>
        </div>
      </div>

      {/* Revenue & Performance Stats */}
      {vendorInventory.length > 0 && (() => {
        const portfolioValue = vendorInventory.reduce((acc, c) => {
          const entry = c.vendors.find(v => v.id === currentVendorId);
          return acc + (entry ? entry.price * entry.stock : 0);
        }, 0);
        const activeListings = vendorInventory.length;
        const avgRating = vendorInventory.reduce((acc, c) => {
          const entry = c.vendors.find(v => v.id === currentVendorId);
          return acc + (entry?.rating || 0);
        }, 0) / activeListings;
        const lowStockItems = vendorInventory.filter(c => {
          const entry = c.vendors.find(v => v.id === currentVendorId);
          return entry && entry.stock < 100;
        });

        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl sm:rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group">
              <DollarSign className="text-green-400 absolute top-4 right-4 opacity-10 group-hover:scale-125 transition-transform" size={48} />
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-3">Portfolio Value</p>
              <p className="text-xl sm:text-3xl font-black font-mono text-green-400 tracking-tight">{formatPrice(portfolioValue)}</p>
              <p className="text-[10px] text-zinc-600 dark:text-zinc-500 font-bold mt-2 uppercase tracking-widest">Price × Stock</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl sm:rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group">
              <Package className="text-blue-400 absolute top-4 right-4 opacity-10 group-hover:scale-125 transition-transform" size={48} />
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-3">Active Listings</p>
              <p className="text-3xl font-black font-mono text-zinc-900 dark:text-white tracking-tight">{activeListings}</p>
              <p className="text-[10px] text-zinc-600 dark:text-zinc-500 font-bold mt-2 uppercase tracking-widest">Products Live</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl sm:rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group">
              <Star className="text-yellow-400 absolute top-4 right-4 opacity-10 group-hover:scale-125 transition-transform" size={48} />
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-3">Average Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-black font-mono text-yellow-400 tracking-tight">{avgRating.toFixed(1)}</p>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.round(avgRating) ? 'currentColor' : 'none'} className={i < Math.round(avgRating) ? 'text-yellow-400' : 'text-zinc-700 dark:text-zinc-600'} />
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-zinc-600 dark:text-zinc-500 font-bold mt-2 uppercase tracking-widest">Customer Score</p>
            </div>
            <div className={`bg-white dark:bg-zinc-900 p-6 rounded-[32px] border shadow-xl relative overflow-hidden group ${lowStockItems.length > 0 ? 'border-red-500/30' : 'border-zinc-200 dark:border-zinc-800'}`}>
              <AlertTriangle className={`absolute top-4 right-4 opacity-10 group-hover:scale-125 transition-transform ${lowStockItems.length > 0 ? 'text-red-500' : 'text-zinc-700 dark:text-zinc-600'}`} size={48} />
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-3">Low Stock Alerts</p>
              <p className={`text-3xl font-black font-mono tracking-tight ${lowStockItems.length > 0 ? 'text-red-500' : 'text-green-400'}`}>{lowStockItems.length}</p>
              <p className="text-[10px] text-zinc-600 dark:text-zinc-500 font-bold mt-2 uppercase tracking-widest">{lowStockItems.length > 0 ? 'Items Below 100kg' : 'All Stock Healthy'}</p>
            </div>
          </div>
        );
      })()}

      {/* Price Comparison Table */}
      {vendorInventory.length > 0 && (
        <div className="bg-white dark:bg-zinc-900/50 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-blue-400/10 border border-blue-400/20">
              <Activity className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Price Intelligence</h3>
              <p className="text-zinc-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Your Prices vs Market Average</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left text-[10px] text-zinc-500 font-black uppercase tracking-widest pb-4 pr-4">Asset</th>
                  <th className="text-right text-[10px] text-zinc-500 font-black uppercase tracking-widest pb-4 px-4">Your Price</th>
                  <th className="text-right text-[10px] text-zinc-500 font-black uppercase tracking-widest pb-4 px-4">Market Avg</th>
                  <th className="text-right text-[10px] text-zinc-500 font-black uppercase tracking-widest pb-4 pl-4">Difference</th>
                </tr>
              </thead>
              <tbody>
                {vendorInventory.map(crop => {
                  const myEntry = crop.vendors.find(v => v.id === currentVendorId)!;
                  const marketAvg = crop.vendors.length > 0
                    ? crop.vendors.reduce((sum, v) => sum + v.price, 0) / crop.vendors.length
                    : crop.currentPrice;
                  const diff = ((myEntry.price - marketAvg) / marketAvg) * 100;
                  return (
                    <tr key={crop.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <CropIcon crop={crop} size="sm" />
                          <span className="font-bold text-white text-sm">{myEntry.listingName || crop.name}</span>
                        </div>
                      </td>
                      <td className="text-right font-mono font-bold text-green-400 py-4 px-4">{formatPrice(myEntry.price)}</td>
                      <td className="text-right font-mono font-bold text-zinc-400 py-4 px-4">{formatPrice(Math.round(marketAvg * 100) / 100)}</td>
                      <td className="text-right py-4 pl-4">
                        <span className={`font-mono font-black text-sm px-3 py-1.5 rounded-xl ${diff > 0 ? 'text-red-400 bg-red-400/10' : diff < 0 ? 'text-green-400 bg-green-400/10' : 'text-zinc-400 bg-zinc-800'}`}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Market Movers & Competitor Overview */}
      {vendorInventory.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Market Movers */}
          <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-green-400/10 border border-green-400/20">
                <TrendingUp className="text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Your Top Movers</h3>
                <p className="text-zinc-600 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Trending Items in Your Inventory</p>
              </div>
            </div>
            <div className="space-y-4">
              {[...vendorInventory].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)).slice(0, 5).map((crop, idx) => {
                const myEntry = crop.vendors.find(v => v.id === currentVendorId)!;
                return (
                  <div key={crop.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-zinc-700 dark:hover:border-zinc-600 transition-colors group">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-zinc-400 dark:text-zinc-700 font-mono w-6">#{idx + 1}</span>
                      <div className="group-hover:scale-110 transition-transform"><CropIcon crop={crop} size="sm" /></div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white text-sm">{myEntry.listingName || crop.name}</p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-600 font-mono">{formatPrice(myEntry.price)}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 font-mono font-black text-sm px-3 py-1.5 rounded-xl ${crop.change24h >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                      {crop.change24h >= 0 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {Math.abs(crop.change24h)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Competitor Overview */}
          <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-purple-400/10 border border-purple-400/20">
                <Users className="text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Competitor Overview</h3>
                <p className="text-zinc-600 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Other Vendors Selling Your Crops</p>
              </div>
            </div>
            <div className="space-y-4">
              {vendorInventory.map(crop => {
                const otherVendors = crop.vendors.filter(v => v.id !== currentVendorId);
                const minPrice = otherVendors.length > 0 ? Math.min(...otherVendors.map(v => v.price)) : 0;
                const maxPrice = otherVendors.length > 0 ? Math.max(...otherVendors.map(v => v.price)) : 0;
                return (
                  <div key={crop.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-zinc-700 dark:hover:border-zinc-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <CropIcon crop={crop} size="sm" />
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white text-sm">{crop.name}</p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-600 font-bold">{otherVendors.length} competitor{otherVendors.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {otherVendors.length > 0 ? (
                        <>
                          <p className="font-mono text-xs text-zinc-400">{formatPrice(minPrice)} — {formatPrice(maxPrice)}</p>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase">Price Range</p>
                        </>
                      ) : (
                        <span className="text-[10px] text-green-400 font-black uppercase tracking-widest bg-green-400/10 px-3 py-1 rounded-lg">Exclusive</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}



      {/* Inventory Price History Chart */}
      {vendorInventory.length > 0 && (() => {
        const chartCrops = vendorInventory.slice(0, 5);
        const chartColors = ['#4ade80', '#60a5fa', '#f59e0b', '#f43f5e', '#a855f7'];
        const mergedData = chartCrops[0]?.history.map((point, idx) => {
          const entry: any = { date: point.date };
          chartCrops.forEach((crop, cIdx) => {
            entry[crop.name] = crop.history[idx]?.price || 0;
          });
          return entry;
        }) || [];
        // sample every 8th point for performance
        const sampledData = mergedData.filter((_: any, i: number) => i % 8 === 0);

        return (
          <div className="bg-zinc-50 dark:bg-zinc-900/30 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-orange-400/10 border border-orange-400/20">
                  <BarChart3 className="text-orange-400" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">Inventory Price History</h3>
                  <p className="text-zinc-500 dark:text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Historical Trend for Your Top Listings</p>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                {chartCrops.map((crop, idx) => (
                  <div key={crop.id} className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[idx] }} />
                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">{crop.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampledData}>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#71717a' }} interval={Math.floor(sampledData.length / 6)} />
                  <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderRadius: '12px', border: '1px solid #27272a', fontFamily: 'Inter', padding: '10px' }}
                    formatter={(value: any, name: string) => [`₱${value}`, name]}
                  />
                  {chartCrops.map((crop, idx) => (
                    <Line key={crop.id} type="monotone" dataKey={crop.name} stroke={chartColors[idx]} strokeWidth={2} dot={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })()}

      {/* Profit Margin Calculator */}
      {vendorInventory.length > 0 && (
        <div className="bg-white dark:bg-zinc-900/50 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-emerald-400/10 border border-emerald-400/20">
              <DollarSign className="text-emerald-400" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Profit Margin Calculator</h3>
              <p className="text-zinc-600 dark:text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Input Cost Price to See Your Margins</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left text-[10px] text-zinc-500 font-black uppercase tracking-widest pb-4 pr-4">Product</th>
                  <th className="text-right text-[10px] text-zinc-500 font-black uppercase tracking-widest pb-4 px-4">Ask Price</th>
                  <th className="text-center text-[10px] text-zinc-500 font-black uppercase tracking-widest pb-4 px-4">Cost / kg</th>
                  <th className="text-right text-[10px] text-zinc-500 font-black uppercase tracking-widest pb-4 px-4">Margin</th>
                  <th className="text-right text-[10px] text-zinc-500 font-black uppercase tracking-widest pb-4 pl-4">Profit / kg</th>
                </tr>
              </thead>
              <tbody>
                {vendorInventory.map(crop => {
                  const myEntry = crop.vendors.find(v => v.id === currentVendorId)!;
                  const costPrice = vendorCostPrices[crop.id] || 0;
                  const margin = costPrice > 0 ? ((myEntry.price - costPrice) / myEntry.price) * 100 : 0;
                  const profit = costPrice > 0 ? myEntry.price - costPrice : 0;
                  return (
                    <tr key={crop.id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <CropIcon crop={crop} size="sm" />
                          <span className="font-bold text-white text-sm">{myEntry.listingName || crop.name}</span>
                        </div>
                      </td>
                      <td className="text-right font-mono font-bold text-green-400 py-4 px-4">{formatPrice(myEntry.price)}</td>
                      <td className="text-center py-4 px-4">
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={vendorCostPrices[crop.id] || ''}
                          onChange={(e) => setVendorCostPrices(prev => ({ ...prev, [crop.id]: Number(e.target.value) }))}
                          className="w-24 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 font-mono text-sm text-zinc-900 dark:text-white text-center outline-none focus:border-green-400/50 shadow-inner"
                        />
                      </td>
                      <td className="text-right py-4 px-4">
                        {costPrice > 0 ? (
                          <span className={`font-mono font-black text-sm px-3 py-1.5 rounded-xl ${margin > 20 ? 'text-green-400 bg-green-400/10' : margin > 0 ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10'}`}>
                            {margin.toFixed(1)}%
                          </span>
                        ) : <span className="text-zinc-700 text-xs">Enter cost</span>}
                      </td>
                      <td className="text-right py-4 pl-4">
                        {costPrice > 0 ? (
                          <span className={`font-mono font-bold text-sm ${profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {profit > 0 ? '+' : ''}{formatPrice(profit)}
                          </span>
                        ) : <span className="text-zinc-700 text-xs">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bulk Price Adjustment & Demand Forecast */}
      {vendorInventory.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bulk Price Adjustment */}
          <div className="bg-white dark:bg-zinc-900/50 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/20">
                <Zap className="text-yellow-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Bulk Price Adjust</h3>
                <p className="text-zinc-600 dark:text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Adjust All Prices at Once</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={bulkAdjustPercent}
                  onChange={(e) => setBulkAdjustPercent(Number(e.target.value))}
                  className="w-28 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 font-mono text-xl font-bold text-zinc-900 dark:text-white text-center outline-none focus:border-green-400/50 shadow-inner"
                />
                <span className="text-zinc-500 font-black text-2xl">%</span>
              </div>
              <div className="flex gap-3">
                {[-10, -5, 5, 10, 15].map(pct => (
                  <button
                    key={pct}
                    onClick={() => setBulkAdjustPercent(pct)}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${pct === bulkAdjustPercent ? 'bg-green-400/20 text-green-400 border border-green-400/30' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'}`}
                  >
                    {pct > 0 ? '+' : ''}{pct}%
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  if (bulkAdjustPercent === 0) return;
                  const multiplier = 1 + bulkAdjustPercent / 100;
                  setCrops(prev => prev.map(crop => {
                    const hasVendor = crop.vendors.some(v => v.id === currentVendorId);
                    if (!hasVendor) return crop;
                    return {
                      ...crop,
                      vendors: crop.vendors.map(v =>
                        v.id === currentVendorId ? { ...v, price: Math.round(v.price * multiplier * 100) / 100 } : v
                      )
                    };
                  }));
                  setBulkAdjustPercent(0);
                }}
                className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
              >
                Apply {bulkAdjustPercent > 0 ? '+' : ''}{bulkAdjustPercent}% to All Listings
              </button>
            </div>
          </div>

          {/* Demand Forecast */}
          <div className="bg-white dark:bg-zinc-900/50 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-cyan-400/10 border border-cyan-400/20">
                <TrendingUp className="text-cyan-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Demand Forecast</h3>
                <p className="text-zinc-600 dark:text-zinc-600 text-[10px] font-bold uppercase tracking-widest">What Consumers Are Looking For</p>
              </div>
            </div>
            <div className="space-y-4">
              {[...crops].sort((a, b) => {
                const demandScore = { High: 3, Medium: 2, Low: 1 };
                return ((demandScore[b.demand as keyof typeof demandScore] || 0) + b.change24h) - ((demandScore[a.demand as keyof typeof demandScore] || 0) + a.change24h);
              }).slice(0, 5).map((crop, idx) => (
                <div key={crop.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-zinc-400 dark:text-zinc-700 font-mono w-6">#{idx + 1}</span>
                    <CropIcon crop={crop} size="sm" />
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white text-sm">{crop.name}</p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-600 font-bold">{formatPrice(crop.currentPrice)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${crop.demand === 'High' ? 'bg-green-400/10 text-green-400' : crop.demand === 'Medium' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-zinc-800 text-zinc-500'}`}>
                      {crop.demand} Demand
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Market Recommendations */}
      {vendorInventory.length > 0 && (() => {
        const vendorCropIds = new Set(vendorInventory.map(c => c.id));
        const unstockedHighDemand = crops
          .filter(c => !vendorCropIds.has(c.id) && (c.demand === 'High' || c.change24h > 3))
          .sort((a, b) => b.change24h - a.change24h)
          .slice(0, 4);
        if (unstockedHighDemand.length === 0) return null;
        return (
          <div className="bg-white dark:bg-zinc-900/50 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[40px] border border-green-400/20 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-green-400/10 border border-green-400/20">
                <Leaf className="text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Consider Stocking</h3>
                <p className="text-zinc-600 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest">High Demand Crops You Don't Sell Yet</p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {unstockedHighDemand.map(crop => (
                <div key={crop.id} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-green-400/30 transition-colors group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="group-hover:scale-110 transition-transform"><CropIcon crop={crop} size="md" /></div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white text-sm">{crop.name}</p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-600 font-bold">{crop.vendors.length} vendor{crop.vendors.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <p className="font-mono text-green-400 font-bold text-lg">{formatPrice(crop.currentPrice)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${crop.demand === 'High' ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}`}>{crop.demand}</span>
                    <span className="text-green-400 text-[9px] font-mono font-bold">+{crop.change24h}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Export CSV & Terminal Admin Header */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">Terminal Admin</h2>
            <p className="text-zinc-500 mt-2 font-medium uppercase tracking-widest text-xs">Managing your {vendorShopType} Assets</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {vendorInventory.length > 0 && (
              <button
                onClick={() => {
                  const headers = ['Name', 'Category', 'Ask Price', 'Stock', 'Market Price', 'Rating'];
                  const rows = vendorInventory.map(crop => {
                    const entry = crop.vendors.find(v => v.id === currentVendorId)!;
                    return [entry.listingName || crop.name, crop.category, entry.price, entry.stock, crop.currentPrice, entry.rating];
                  });
                  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'agripresyo_inventory.csv'; a.click();
                  URL.revokeObjectURL(url);
                }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-4 sm:px-6 py-3 sm:py-5 rounded-2xl sm:rounded-[24px] font-black text-xs sm:text-sm flex items-center justify-center gap-2 sm:gap-3 hover:border-green-400/30 transition-all uppercase tracking-widest shadow-xl"
              >
                <Download size={20} /> Export CSV
              </button>
            )}
            <button onClick={() => setIsComplaintModalOpen(true)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 sm:px-6 py-3 sm:py-5 rounded-2xl sm:rounded-[24px] font-black text-xs sm:text-sm flex items-center justify-center gap-2 sm:gap-3 transition-all uppercase tracking-widest border border-red-500/20 hover:border-red-500 shadow-xl">
              <Megaphone size={20} /> Report Issue
            </button>
            <button onClick={() => setIsAddCropModalOpen(true)} className="bg-green-500 text-black px-6 sm:px-10 py-3 sm:py-5 rounded-2xl sm:rounded-[24px] font-black text-xs sm:text-sm flex items-center justify-center gap-2 sm:gap-3 shadow-[0_10px_30px_rgba(34,197,94,0.2)] hover:scale-105 transition-all uppercase tracking-widest">
              <Plus size={24} strokeWidth={3} /> New Listing
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {vendorInventory.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-[40px] bg-zinc-50 dark:bg-zinc-900/50">
              <Package className="mx-auto text-zinc-300 dark:text-zinc-700 mb-6" size={48} />
              <p className="text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-widest">Node Inventory Depleted</p>
              <p className="text-zinc-500 dark:text-zinc-600 text-xs mt-2">Initialize your first listing to begin trading</p>
            </div>
          ) : (
            vendorInventory.map(crop => {
              const myEntry = crop.vendors.find(v => v.id === currentVendorId)!;
              return (
                <div key={crop.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 group hover:border-green-400/30 transition-all shadow-lg">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-10">
                    <div className="flex items-center gap-4 sm:gap-8">
                      <CropIcon crop={crop} size="xl" />
                      <div>
                        <h3 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white group-hover:text-green-600 transition-colors">{myEntry.listingName || crop.name}</h3>
                        <div className="flex gap-3 mt-2">
                          <span className="px-4 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{crop.category}</span>
                          <span className="px-4 py-1.5 rounded-xl bg-green-400/10 text-[10px] font-black text-green-500 uppercase tracking-widest">Terminal Active</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-6 flex-1 lg:max-w-xl">
                      <div className="bg-zinc-50 dark:bg-zinc-950 p-3 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-inner group/stat">
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-black tracking-[0.2em] mb-3">Ask Price</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg sm:text-2xl font-mono font-bold text-green-600 leading-none">{formatPrice(myEntry.price)}</span>
                          <button onClick={() => setEditingInventoryCrop(crop)} className="text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors bg-white dark:bg-zinc-900 p-2 rounded-lg group-hover/stat:border-green-400/30 border border-zinc-200 dark:border-zinc-800 shadow-sm"><Edit2 size={16} /></button>
                        </div>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-950 p-3 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-inner group/stat">
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-black tracking-[0.2em] mb-3">Available Liquidity</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg sm:text-2xl font-mono font-bold text-zinc-900 dark:text-white leading-none">{myEntry.stock.toLocaleString()} <span className="text-xs uppercase text-zinc-400 dark:text-zinc-500">kg</span></span>
                          <button onClick={() => setEditingInventoryCrop(crop)} className="text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors bg-white dark:bg-zinc-900 p-2 rounded-lg group-hover/stat:border-green-400/30 border border-zinc-200 dark:border-zinc-800 shadow-sm"><Edit2 size={16} /></button>
                        </div>
                      </div>
                    </div>

                    <button onClick={() => handleDeleteFromInventory(crop.id)} className="bg-white dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-300 dark:text-zinc-700 hover:text-red-500 dark:hover:text-red-400 border border-zinc-200 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900/50 p-5 rounded-[24px] transition-all shadow-md group/del">
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

  const renderAdminView = () => {
    const pendingUsers = users.filter(u => u.status === 'pending');
    return (
      <div className="space-y-12 pb-32 lg:pb-12 animate-in slide-in-from-bottom duration-700">
        <div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">Admin Console</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg mt-2 font-medium">Platform Management & Intelligence</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div onClick={() => document.getElementById('admin-user-registry')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group cursor-pointer hover:border-blue-400/40 transition-all">
            <UsersIcon className="text-blue-500 absolute top-4 right-4 opacity-10 group-hover:scale-125 transition-transform" size={48} />
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-3">Total Users</p>
            <p className="text-3xl font-black font-mono text-zinc-900 dark:text-white tracking-tight">{users.length}</p>
            <p className="text-[10px] text-zinc-500 font-bold mt-2 uppercase tracking-widest">Registered</p>
          </div>
          <div onClick={() => document.getElementById('admin-approval-queue')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group cursor-pointer hover:border-yellow-400/40 transition-all">
            <Clock className="text-yellow-500 absolute top-4 right-4 opacity-10 group-hover:scale-125 transition-transform" size={48} />
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-3">Pending</p>
            <p className="text-3xl font-black font-mono text-yellow-500 tracking-tight">{pendingUsers.length}</p>
            <p className="text-[10px] text-zinc-500 font-bold mt-2 uppercase tracking-widest">Awaiting Review</p>
          </div>
          <div onClick={() => document.getElementById('admin-price-override')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group cursor-pointer hover:border-orange-400/40 transition-all">
            <Store className="text-orange-500 absolute top-4 right-4 opacity-10 group-hover:scale-125 transition-transform" size={48} />
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-3">Active Vendors</p>
            <p className="text-3xl font-black font-mono text-zinc-900 dark:text-white tracking-tight">{allVendors.length}</p>
            <p className="text-[10px] text-zinc-500 font-bold mt-2 uppercase tracking-widest">Market Nodes</p>
          </div>
          <div onClick={() => document.getElementById('admin-complaints')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group cursor-pointer hover:border-red-400/40 transition-all">
            <MessageSquare className="text-red-500 absolute top-4 right-4 opacity-10 group-hover:scale-125 transition-transform" size={48} />
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-3">Open Complaints</p>
            <p className="text-3xl font-black font-mono text-red-500 tracking-tight">{complaints.filter(c => c.status === 'open').length}</p>
            <p className="text-[10px] text-zinc-500 font-bold mt-2 uppercase tracking-widest">Need Attention</p>
          </div>
        </div>

        {/* Approval Queue */}
        {pendingUsers.length > 0 && (
          <div id="admin-approval-queue" className="bg-white dark:bg-zinc-900 p-6 lg:p-8 rounded-[40px] border border-yellow-400/30 shadow-xl scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/20"><Clock className="text-yellow-400" size={24} /></div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Approval Queue</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{pendingUsers.length} vendor{pendingUsers.length !== 1 ? 's' : ''} awaiting approval</p>
              </div>
            </div>
            <div className="space-y-3">
              {pendingUsers.map((user, idx) => (
                <div key={idx} className="bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center font-bold text-yellow-500">{(user.name || user.email)[0].toUpperCase()}</div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white text-sm">{user.name || 'Unnamed'}</p>
                      <p className="text-xs text-zinc-500">{user.email} &bull; {user.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setUsers(prev => { const next = prev.map(u => u.email === user.email ? { ...u, status: 'active' as const } : u); localStorage.setItem('AP_users', JSON.stringify(next)); return next; }); addAuditEntry('APPROVE_USER', user.email, `Approved vendor: ${user.name || user.email}`); }} className="bg-green-500 text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:scale-105 transition-all flex items-center gap-1"><CheckCircle size={14} /> Approve</button>
                    <button onClick={() => { setUsers(prev => { const next = prev.filter(u => u.email !== user.email); localStorage.setItem('AP_users', JSON.stringify(next)); return next; }); addAuditEntry('REJECT_USER', user.email, `Rejected vendor: ${user.name || user.email}`); }} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-500/20 transition-all flex items-center gap-1"><X size={14} /> Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Override */}
        <div id="admin-price-override" className="bg-white dark:bg-zinc-900 p-6 lg:p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl scroll-mt-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-orange-400/10 border border-orange-400/20"><Flag className="text-orange-400" size={24} /></div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Price Override</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Flag & correct suspicious vendor prices</p>
            </div>
          </div>
          <div className="space-y-3">
            {crops.filter(c => c.vendors.length > 0).slice(0, 12).map(crop => {
              const avg = crop.vendors.reduce((s, v) => s + v.price, 0) / crop.vendors.length;
              const suspiciousVendors = crop.vendors.filter(v => Math.abs(((v.price - avg) / avg) * 100) > 20);
              const isExpanded = expandedOverrideCrop === crop.id;
              return (
                <div key={crop.id} className={`rounded-2xl border transition-all ${suspiciousVendors.length > 0 ? 'border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30'}`}>
                  <button onClick={() => setExpandedOverrideCrop(isExpanded ? null : crop.id)} className="w-full flex items-center justify-between p-4 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors rounded-2xl">
                    <div className="flex items-center gap-3">
                      <CropIcon crop={crop} size="sm" />
                      <div className="text-left">
                        <span className="font-bold text-zinc-900 dark:text-white text-sm">{crop.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-zinc-400">Avg: {formatPrice(Math.round(avg * 100) / 100)}</span>
                          <span className="text-[10px] text-zinc-400">&bull;</span>
                          <span className="text-[10px] text-zinc-400 font-bold">{crop.vendors.length} vendor{crop.vendors.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {suspiciousVendors.length > 0 && (
                        <span className="text-[10px] font-black text-red-500 bg-red-500/10 px-3 py-1 rounded-lg uppercase flex items-center gap-1">
                          <AlertTriangle size={12} /> {suspiciousVendors.length} suspicious
                        </span>
                      )}
                      {suspiciousVendors.length === 0 && (
                        <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-lg uppercase">Normal</span>
                      )}
                      <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 space-y-2 border-t border-zinc-200/50 dark:border-zinc-700/50">
                      {crop.vendors.map(vendor => {
                        const vendorDiff = Math.abs(((vendor.price - avg) / avg) * 100);
                        const vendorSuspicious = vendorDiff > 20;
                        const vendorKey = `${crop.id}-${vendor.id}`;
                        const isEditingVendor = overrideVendorKey === vendorKey;
                        return (
                          <div key={vendor.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl transition-colors ${vendorSuspicious ? 'bg-red-50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/30' : 'bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${vendorSuspicious ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                {vendor.name[0]}
                              </div>
                              <div>
                                <p className="font-bold text-zinc-900 dark:text-white text-sm">{vendor.name}</p>
                                <p className="text-[10px] text-zinc-400 font-mono">
                                  {vendor.specialty} &bull; {formatPrice(vendor.price)}
                                  {vendorSuspicious && <span className="text-red-500 ml-2 font-black">({vendorDiff > 0 && vendor.price > avg ? '+' : ''}{((vendor.price - avg) / avg * 100).toFixed(0)}% vs avg)</span>}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {isEditingVendor ? (
                                <div className="flex items-center gap-2">
                                  <input type="number" min="0.01" step="0.01" value={overridePrice} onChange={(e) => setOverridePrice(e.target.value)} placeholder={String(Math.round(avg * 100) / 100)} className="w-24 bg-zinc-50 dark:bg-zinc-950 border border-orange-400/50 rounded-lg px-2 py-1 text-sm font-mono font-bold text-orange-600 outline-none focus:border-orange-400" autoFocus />
                                  <button onClick={() => {
                                    const p = Number(overridePrice);
                                    if (!isNaN(p) && p > 0) {
                                      const oldPrice = vendor.price;
                                      setCrops(prev => prev.map(c => c.id === crop.id ? { ...c, vendors: c.vendors.map(v => v.id === vendor.id ? { ...v, price: p } : v) } : c));
                                      addAuditEntry('PRICE_OVERRIDE', `${crop.name} - ${vendor.name}`, `Vendor price: ${formatPrice(oldPrice)} -> ${formatPrice(p)}`);
                                    }
                                    setOverrideVendorKey(null);
                                    setOverridePrice('');
                                  }} className="text-[10px] font-black bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:scale-105 transition-all uppercase tracking-wider">Apply</button>
                                  <button onClick={() => { setOverrideVendorKey(null); setOverridePrice(''); }} className="text-[10px] font-black bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-3 py-1.5 rounded-lg hover:scale-105 transition-all uppercase tracking-wider">Cancel</button>
                                </div>
                              ) : (
                                <button onClick={() => { setOverrideVendorKey(vendorKey); setOverridePrice(String(Math.round(avg * 100) / 100)); }} className={`text-[10px] font-black px-3 py-1.5 rounded-lg hover:scale-105 transition-all uppercase tracking-wider ${vendorSuspicious ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 hover:bg-orange-500/30' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-orange-400/20 hover:text-orange-500'}`}>Override</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Announcement System */}
        <div className="bg-white dark:bg-zinc-900 p-6 lg:p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-blue-400/10 border border-blue-400/20"><Megaphone className="text-blue-400" size={24} /></div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Announcements</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Post platform-wide notices</p>
            </div>
          </div>
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input id="ann-title" type="text" placeholder="Announcement title..." className="col-span-1 md:col-span-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white outline-none focus:border-blue-400/50" />
              <input id="ann-duration" type="number" placeholder="Duration (sec, optional)" className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white outline-none focus:border-blue-400/50" />
              <select id="ann-priority" className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white outline-none">
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <textarea id="ann-message" placeholder="Announcement message..." rows={3} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-400/50 resize-none" />
            <button onClick={() => {
              const title = (document.getElementById('ann-title') as HTMLInputElement).value.trim();
              const message = (document.getElementById('ann-message') as HTMLTextAreaElement).value.trim();
              const durationStr = (document.getElementById('ann-duration') as HTMLInputElement).value.trim();
              const duration = durationStr ? parseInt(durationStr) : undefined;
              const priority = (document.getElementById('ann-priority') as HTMLSelectElement).value as 'high' | 'medium' | 'low';

              if (!title || !message) { alert('Please fill in title and message.'); return; }

              setAnnouncements(prev => [{ id: `ann-${Date.now()}`, title, message, timestamp: new Date().toLocaleString(), priority, active: true, duration }, ...prev]);
              addAuditEntry('CREATE_ANNOUNCEMENT', title, `Posted ${priority} announcement${duration ? ` (${duration}s)` : ''}`);
              (document.getElementById('ann-title') as HTMLInputElement).value = '';
              (document.getElementById('ann-message') as HTMLTextAreaElement).value = '';
              (document.getElementById('ann-duration') as HTMLInputElement).value = '';
            }} className="bg-blue-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"><Megaphone size={16} /> Post Announcement</button>
          </div>
          {announcements.length > 0 && (
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
              {announcements.map(ann => (
                <div key={ann.id} className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${ann.priority === 'high' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50' : ann.priority === 'medium' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/50' : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50'}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${ann.priority === 'high' ? 'text-red-500' : ann.priority === 'medium' ? 'text-orange-500' : 'text-blue-500'}`}>{ann.priority}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{ann.timestamp}</span>
                    </div>
                    <p className="font-bold text-zinc-900 dark:text-white text-sm">{ann.title}</p>
                    <p className="text-xs text-zinc-500 mt-1">{ann.message}</p>
                  </div>
                  <button onClick={() => { setAnnouncements(prev => prev.filter(a => a.id !== ann.id)); addAuditEntry('DELETE_ANNOUNCEMENT', ann.title, 'Removed announcement'); }} className="text-zinc-400 hover:text-red-500 transition-colors shrink-0 mt-1"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Complaints */}
        <div id="admin-complaints" className="bg-white dark:bg-zinc-900 p-6 lg:p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl scroll-mt-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-red-400/10 border border-red-400/20"><MessageSquare className="text-red-400" size={24} /></div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Complaints</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{complaints.length} total &bull; {complaints.filter(c => c.status === 'open').length} open</p>
            </div>
          </div>
          {complaints.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              <CheckCircle size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-black uppercase tracking-widest text-sm">No complaints filed</p>
              <p className="text-xs text-zinc-500 mt-1">All clear!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
              {complaints.map(comp => (
                <div key={comp.id} className={`p-4 rounded-2xl border ${comp.status === 'open' ? 'bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-900/30' : comp.status === 'reviewing' ? 'bg-yellow-50/50 dark:bg-yellow-950/10 border-yellow-200 dark:border-yellow-900/30' : comp.status === 'resolved' ? 'bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-900/30' : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${comp.status === 'open' ? 'bg-red-500/10 text-red-500' : comp.status === 'reviewing' ? 'bg-yellow-500/10 text-yellow-500' : comp.status === 'resolved' ? 'bg-green-500/10 text-green-500' : 'bg-zinc-500/10 text-zinc-500'}`}>{comp.status}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">{comp.timestamp}</span>
                      </div>
                      <p className="font-bold text-zinc-900 dark:text-white text-sm">{comp.subject}</p>
                      <p className="text-xs text-zinc-500 mt-1">{comp.message}</p>
                      <p className="text-[10px] text-zinc-400 mt-2">From: {comp.from} ({comp.fromRole}){comp.targetUser ? ` | Against: ${comp.targetUser}` : ''}</p>
                      {comp.adminNote && (
                        <div className="mt-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-xl p-3 flex items-start gap-3">
                          <div className="p-1.5 rounded-lg bg-green-500/10 shrink-0 mt-0.5"><CheckCircle size={12} className="text-green-500" /></div>
                          <div>
                            <p className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest mb-0.5">Admin Note</p>
                            <p className="text-xs text-green-700 dark:text-green-300">{comp.adminNote}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      {comp.status === 'open' && <button onClick={() => { setComplaints(prev => prev.map(x => x.id === comp.id ? { ...x, status: 'reviewing' } : x)); addAuditEntry('REVIEW_COMPLAINT', comp.subject, `Reviewing from ${comp.from}`); }} className="text-[10px] font-black bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 px-3 py-1.5 rounded-lg hover:scale-105 transition-all uppercase">Review</button>}
                      {(comp.status === 'open' || comp.status === 'reviewing') && (
                        <>
                          <button onClick={() => { setAdminNoteComplaintId(comp.id); setAdminNoteText(''); }} className="text-[10px] font-black bg-green-400/20 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-lg hover:scale-105 transition-all uppercase">Resolve</button>
                          <button onClick={() => { setComplaints(prev => prev.map(x => x.id === comp.id ? { ...x, status: 'dismissed' } : x)); addAuditEntry('DISMISS_COMPLAINT', comp.subject, `Dismissed from ${comp.from}`); }} className="text-[10px] font-black bg-zinc-400/20 text-zinc-500 px-3 py-1.5 rounded-lg hover:scale-105 transition-all uppercase">Dismiss</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Market Report Export */}
        <div className="bg-white dark:bg-zinc-900 p-6 lg:p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-400/10 border border-emerald-400/20"><FileText className="text-emerald-400" size={24} /></div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Market Reports</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Generate downloadable CSV</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => {
                const doc = new jsPDF();
                doc.setFontSize(18);
                doc.text('AgriPresyo Market Report', 14, 22);
                doc.setFontSize(11);
                doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

                doc.setLineWidth(0.5);
                doc.line(14, 33, 196, 33);

                doc.setFontSize(14);
                doc.text('Platform Summary', 14, 42);
                doc.setFontSize(10);
                doc.text(`Total Crops: ${crops.length}`, 14, 48);
                doc.text(`Registered Users: ${users.length}`, 14, 53);
                doc.text(`Active Users: ${users.filter(u => u.status === 'active').length}`, 80, 53);
                doc.text(`Banned Users: ${users.filter(u => u.status === 'banned').length}`, 140, 53);

                const tableData = crops.map(c => [
                  c.name,
                  c.category,
                  formatPrice(c.currentPrice),
                  `${c.change24h}%`,
                  c.demand,
                  c.vendors.length.toString()
                ]);

                autoTable(doc, {
                  head: [['Crop', 'Category', 'Price', 'Change', 'Demand', 'Vendors']],
                  body: tableData,
                  startY: 60,
                  theme: 'grid',
                  headStyles: { fillColor: [34, 197, 94] },
                  alternateRowStyles: { fillColor: [240, 253, 244] },
                });

                doc.save(`agripresyo_report_${new Date().toISOString().split('T')[0]}.pdf`);
                addAuditEntry('EXPORT_REPORT_PDF', 'Market Report', 'PDF Export Generated');
              }} className="bg-red-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-red-500/10"><FileText size={16} /> Export PDF</button>

              <button onClick={() => { const headers = ['Crop', 'Category', 'Price', 'Change24h', 'Demand', 'Vendors', 'AvgVendorPrice']; const rows = crops.map(c => { const avg = c.vendors.length > 0 ? (c.vendors.reduce((s: number, v: any) => s + v.price, 0) / c.vendors.length).toFixed(2) : c.currentPrice.toFixed(2); return [c.name, c.category, c.currentPrice, c.change24h, c.demand, c.vendors.length, avg]; }); const csv = [headers, ...rows, [], ['USER SUMMARY'], ['Total Users', users.length], ['Active', users.filter(u => u.status === 'active').length], ['Pending', users.filter(u => u.status === 'pending').length], ['Banned', users.filter(u => u.status === 'banned').length]].map(r => r.join(',')).join('\n'); const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `agripresyo_report_${new Date().toISOString().split('T')[0]}.csv`; a.click(); URL.revokeObjectURL(url); addAuditEntry('EXPORT_REPORT', 'Market Report', `CSV with ${crops.length} crops`); }} className="bg-emerald-500 text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/10"><Download size={16} /> Export CSV</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center"><p className="text-2xl font-black font-mono text-zinc-900 dark:text-white">{crops.length}</p><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Crops</p></div>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center"><p className="text-2xl font-black font-mono text-zinc-900 dark:text-white">{crops.reduce((a, c) => a + c.vendors.length, 0)}</p><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Listings</p></div>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center"><p className="text-2xl font-black font-mono text-green-500">{formatPrice(crops.reduce((s, c) => s + c.currentPrice, 0) / crops.length)}</p><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Avg Price</p></div>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center"><p className="text-2xl font-black font-mono text-zinc-900 dark:text-white">{users.filter(u => u.status === 'active').length}</p><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Active Users</p></div>
          </div>
        </div>

        {/* User Management with Ban/Suspend */}
        <div id="admin-user-registry" className="bg-white dark:bg-zinc-900 p-6 lg:p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl scroll-mt-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"><UsersIcon className="text-zinc-600 dark:text-zinc-400" size={24} /></div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">User Registry</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Manage Platform Access</p>
            </div>
            <button onClick={clearUsers} className="text-xs text-red-500 font-bold uppercase tracking-widest hover:text-red-400 transition-colors border border-red-200 dark:border-red-900/50 px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 bg-white dark:bg-zinc-900">Reset Database</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left text-[10px] text-zinc-500 font-black uppercase tracking-widest pb-4 px-4">User</th>
                  <th className="text-left text-[10px] text-zinc-500 font-black uppercase tracking-widest pb-4 px-4">Role</th>
                  <th className="text-center text-[10px] text-zinc-500 font-black uppercase tracking-widest pb-4 px-4">Status</th>
                  <th className="text-right text-[10px] text-zinc-500 font-black uppercase tracking-widest pb-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 dark:text-zinc-500">{(user.name || user.email)[0].toUpperCase()}</div>
                        <div><p className="font-bold text-zinc-900 dark:text-white text-sm">{user.name || 'Unnamed'}</p><p className="text-xs text-zinc-500">{user.email}</p></div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.role === UserRole.ADMIN ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : user.role === UserRole.VENDOR ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>{user.role}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${user.status === 'active' ? 'text-green-500 bg-green-500/10' : user.status === 'pending' ? 'text-yellow-500 bg-yellow-500/10' : 'text-red-500 bg-red-500/10'}`}>{user.status}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {user.role !== UserRole.ADMIN && (
                        <div className="flex gap-2 justify-end">
                          {user.status === 'banned' ? (
                            <button onClick={() => { setUsers(prev => { const next = prev.map(u => u.email === user.email ? { ...u, status: 'active' as const } : u); localStorage.setItem('AP_users', JSON.stringify(next)); return next; }); addAuditEntry('UNBAN_USER', user.email, `Unbanned ${user.name || user.email}`); }} className="text-[10px] font-black bg-green-400/20 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-lg hover:scale-105 transition-all uppercase flex items-center gap-1"><CheckCircle size={12} /> Unban</button>
                          ) : user.status === 'active' ? (
                            <button onClick={() => { if (!confirm(`Ban ${user.name || user.email}?`)) return; setUsers(prev => { const next = prev.map(u => u.email === user.email ? { ...u, status: 'banned' as const } : u); localStorage.setItem('AP_users', JSON.stringify(next)); return next; }); addAuditEntry('BAN_USER', user.email, `Banned ${user.name || user.email} (${user.role})`); }} className="text-[10px] font-black bg-red-400/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg hover:scale-105 transition-all uppercase flex items-center gap-1"><Ban size={12} /> Ban</button>
                          ) : null}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log */}
        <div className="bg-white dark:bg-zinc-900 p-6 lg:p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-purple-400/10 border border-purple-400/20"><FileText className="text-purple-400" size={24} /></div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Audit Log</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{auditLog.length} entries</p>
              </div>
            </div>
            {auditLog.length > 0 && <button onClick={() => setAuditLog([])} className="text-xs text-zinc-500 font-bold uppercase tracking-widest hover:text-red-400 transition-colors border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-xl hover:border-red-400/30">Clear Log</button>}
          </div>
          {auditLog.length === 0 ? (
            <div className="text-center py-12 text-zinc-400"><FileText size={40} className="mx-auto mb-3 opacity-30" /><p className="font-black uppercase tracking-widest text-sm">No actions recorded</p><p className="text-xs text-zinc-500 mt-1">Admin actions appear here</p></div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide">
              {auditLog.map(entry => {
                const clr = entry.action.includes('BAN') || entry.action.includes('REJECT') || entry.action.includes('DISMISS') ? 'text-red-500 bg-red-500/10' : entry.action.includes('APPROVE') || entry.action.includes('RESOLVE') || entry.action.includes('UNBAN') ? 'text-green-500 bg-green-500/10' : entry.action.includes('PRICE') ? 'text-orange-500 bg-orange-500/10' : entry.action.includes('EXPORT') ? 'text-emerald-500 bg-emerald-500/10' : entry.action.includes('ANNOUNCEMENT') ? 'text-blue-500 bg-blue-500/10' : 'text-purple-500 bg-purple-500/10';
                return (
                  <div key={entry.id} className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shrink-0 ${clr}`}>{entry.action}</span>
                    <div className="flex-1 min-w-0"><p className="text-xs text-zinc-900 dark:text-white font-bold truncate">{entry.details}</p><p className="text-[10px] text-zinc-400 font-mono">{entry.target}</p></div>
                    <span className="text-[10px] text-zinc-500 font-mono shrink-0">{entry.timestamp}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };



  const handleLogout = () => {
    setIsAuthenticated(false);
    setBudgetItems([]);
    setUserVendorRatings({});
    setActiveTab('market');
    setRole(UserRole.CONSUMER);
    setCurrentUserEmail('');
    setIsAdminUnlocked(false);
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} attemptLogin={attemptLogin} onRegister={registerUser} isAdminUnlocked={isAdminUnlocked} onUnlock={() => setIsAdminUnlocked(true)} />;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white flex flex-col selection:bg-green-400/30 animate-in fade-in duration-1000">
      <Ticker crops={crops} onCropClick={(crop) => setSelectedCrop(crop)} />

      <header className="sticky top-10 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-b border-zinc-200 dark:border-zinc-800 px-3 sm:px-8 py-3 sm:py-5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-12">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab('market')}>
              <Logo size={40} className="text-green-500 transition-all transform group-hover:scale-110 group-hover:rotate-6 sm:hidden" />
              <Logo size={56} className="text-green-500 transition-all transform group-hover:scale-110 group-hover:rotate-6 hidden sm:block" />
              <h1 className="text-xl sm:text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">
                <span className="text-green-500">Agri</span>
                <span className="text-zinc-400 dark:text-zinc-500">Presyo</span>
              </h1>
            </div>
            <nav className="hidden lg:flex items-center gap-4">
              <button onClick={() => setActiveTab('market')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all tracking-[0.1em] ${activeTab === 'market' ? 'bg-zinc-100 dark:bg-zinc-800 text-green-600 shadow-inner' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white'}`}>MARKET</button>
              {role !== UserRole.VENDOR && (
                <button onClick={() => setActiveTab('shops')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all tracking-[0.1em] ${activeTab === 'shops' ? 'bg-zinc-100 dark:bg-zinc-800 text-green-600 shadow-inner' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white'}`}>SHOPS</button>
              )}
              <button onClick={() => setActiveTab('analytics')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all tracking-[0.1em] ${activeTab === 'analytics' ? 'bg-zinc-100 dark:bg-zinc-800 text-green-600 shadow-inner' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white'}`}>ANALYTICS</button>
              {role === UserRole.VENDOR && <button onClick={() => setActiveTab('shop')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all tracking-[0.1em] ${activeTab === 'shop' ? 'bg-zinc-100 dark:bg-zinc-800 text-green-600 shadow-inner' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white'}`}>DASHBOARD</button>}
              {role === UserRole.ADMIN && isAdminUnlocked && <button onClick={() => setActiveTab('admin')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all tracking-[0.1em] ${activeTab === 'admin' ? 'bg-zinc-100 dark:bg-zinc-800 text-green-600 shadow-inner' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white'}`}>ADMIN CONSOLE</button>}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />

            {role === UserRole.VENDOR && (
              <div className="relative">
                <button
                  onClick={() => {
                    if (!showAnnouncementsDropdown) {
                      const visibleIds = announcements.filter(a => a.active).map(a => a.id);
                      setSeenAnnouncementIds(prev => [...new Set([...prev, ...visibleIds])]);
                    }
                    setShowAnnouncementsDropdown(!showAnnouncementsDropdown);
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-yellow-400 transition-all hover:border-yellow-400/30 shadow-xl relative"
                >
                  <Bell size={22} />
                  {announcements.filter(a => a.active && !seenAnnouncementIds.includes(a.id)).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center">{Math.min(announcements.filter(a => a.active && !seenAnnouncementIds.includes(a.id)).length, 9)}{announcements.filter(a => a.active && !seenAnnouncementIds.includes(a.id)).length > 9 ? '+' : ''}</span>
                  )}
                </button>
                {showAnnouncementsDropdown && (
                  <div className="absolute right-0 top-16 w-80 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-50">
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Admin Announcements</span>
                      <button onClick={() => setShowAnnouncementsDropdown(false)} className="text-[10px] text-zinc-400 font-bold hover:text-zinc-200">Close</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto scrollbar-hide">
                      {announcements.filter(a => a.active).length === 0 ? (
                        <p className="p-6 text-center text-zinc-600 dark:text-zinc-400 text-sm">No new announcements</p>
                      ) : announcements.filter(a => a.active).map(ann => (
                        <div key={ann.id} className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${ann.priority === 'high' ? 'bg-red-500/10 text-red-500' : ann.priority === 'medium' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                              <Megaphone size={14} />
                            </div>
                            <div>
                              <p className="text-sm text-zinc-900 dark:text-white font-bold">{ann.title}</p>
                              <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{ann.message}</p>
                              <p className="text-[9px] text-zinc-400 font-mono mt-1">{ann.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <button onClick={handleLogout} className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all hover:border-red-500/30 shadow-xl group"><LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /></button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-12 max-w-[1400px] mx-auto w-full">
        {isAuthenticated && <AnnouncementBanner announcements={announcements} dismissedIds={dismissedIds} onDismiss={handleDismissAnnouncement} />}
        {activeTab === 'market' && renderConsumerView()}
        {activeTab === 'market' && renderCalculatorWidget()}
        {activeTab === 'shops' && role !== UserRole.VENDOR && renderShopsView()}
        {activeTab === 'analytics' && renderAnalyticsDashboard()}
        {activeTab === 'shop' && role === UserRole.VENDOR && renderVendorView()}
        {activeTab === 'admin' && role === UserRole.ADMIN && renderAdminView()}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 mt-20 hidden lg:block">
        <div className="max-w-[1400px] mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Logo size={40} className="text-green-500" />
                <h3 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">
                  <span className="text-green-500">Agri</span>
                  <span className="text-zinc-400 dark:text-zinc-500">Presyo</span>
                </h3>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">Your real-time agricultural price monitoring platform. Connecting Philippine farmers, vendors and consumers with transparent market data.</p>
              <div className="flex gap-4 mt-6">
                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">© {new Date().getFullYear()} AgriPresyo</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6">Navigation</h4>
              <ul className="space-y-3">
                {['Market', 'Analytics', role === UserRole.VENDOR ? 'Dashboard' : role === UserRole.ADMIN ? 'Admin' : 'Shops'].map(item => (
                  <li key={item}>
                    <button
                      onClick={() => setActiveTab(
                        item === 'Dashboard' ? 'shop' :
                          item === 'Shops' ? 'shops' :
                            item === 'Admin' ? 'admin' :
                              item.toLowerCase() as any
                      )}
                      className="text-zinc-500 hover:text-green-500 text-sm font-bold transition-colors"
                    >{item}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6">Market Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400 text-sm">Total Crops</span>
                  <span className="text-zinc-900 dark:text-white font-mono font-bold text-sm">{crops.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400 text-sm">Active Vendors</span>
                  <span className="text-zinc-900 dark:text-white font-mono font-bold text-sm">{allVendors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400 text-sm">Avg Price</span>
                  <span className="text-green-500 font-mono font-bold text-sm">{formatPrice(crops.reduce((s, c) => s + c.currentPrice, 0) / crops.length)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Built for the Philippine Agricultural Community</p>
            <p className="text-zinc-500 text-[10px] font-mono">Real-time data • Transparent pricing • Sustainable farming</p>
          </div>
        </div>
      </footer>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-2xl border-t border-zinc-200 dark:border-zinc-800 px-4 sm:px-8 py-3 sm:py-5 flex justify-around items-center z-50 rounded-t-3xl sm:rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <button onClick={() => setActiveTab('market')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'market' ? 'text-green-500 scale-110' : 'text-zinc-400 hover:text-zinc-600'}`}>
          <Store size={26} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Market</span>
        </button>
        {role !== UserRole.VENDOR && role !== UserRole.ADMIN && (
          <button onClick={() => setActiveTab('shops')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'shops' ? 'text-green-500 scale-110' : 'text-zinc-400 hover:text-zinc-600'}`}>
            <ShoppingBag size={26} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Shops</span>
          </button>
        )}
        <button onClick={() => setActiveTab('analytics')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'analytics' ? 'text-green-500 scale-110' : 'text-zinc-400 hover:text-zinc-600'}`}>
          <BarChart3 size={26} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Stats</span>
        </button>
        {role === UserRole.VENDOR && (
          <button onClick={() => setActiveTab('shop')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'shop' ? 'text-green-500 scale-110' : 'text-zinc-400 hover:text-zinc-600'}`}>
            <LayoutGrid size={26} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dash</span>
          </button>
        )}
        {role === UserRole.ADMIN && isAdminUnlocked && (
          <button onClick={() => setActiveTab('admin')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'admin' ? 'text-green-500 scale-110' : 'text-zinc-400 hover:text-zinc-600'}`}>
            <ShieldCheck size={26} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Admin</span>
          </button>
        )}
      </nav>

      {/* Vendor Detail View Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6">
          <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl" onClick={() => setSelectedVendor(null)}></div>
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl sm:rounded-[50px] overflow-hidden relative border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedVendor(null)} className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"><X size={20} /></button>
            <div className="p-5 sm:p-10 lg:p-14 space-y-6 sm:space-y-10 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex items-center gap-4 sm:gap-8">
                  <div className="w-16 h-16 sm:w-28 sm:h-28 rounded-2xl sm:rounded-[36px] bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center font-black text-3xl sm:text-5xl text-zinc-300 dark:text-zinc-700 border border-zinc-200 dark:border-zinc-700 shadow-inner shrink-0">
                    {selectedVendor.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white leading-none">{selectedVendor.name}</h2>
                      {selectedVendor.isHot && <ShieldCheck className="text-green-500 shrink-0" size={28} />}
                    </div>
                    <p className="text-zinc-400 dark:text-zinc-500 text-xs font-black uppercase tracking-[0.3em] mb-4">{selectedVendor.specialty}</p>
                    <div className="flex flex-col gap-3">
                      <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Rate Terminal (Toggle Stars)</p>
                      <div className="flex items-center gap-1 text-yellow-500 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 w-fit shadow-inner" onMouseLeave={() => setHoverRating(0)}>
                        {[...Array(5)].map((_, i) => {
                          const starVal = i + 1;
                          const userRating = userVendorRatings[selectedVendor.id] || 0;
                          return (
                            <button
                              key={i}
                              onClick={() => handleRateVendor(selectedVendor.id, starVal)}
                              onMouseEnter={() => setHoverRating(starVal)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="hover:scale-125 transition-transform p-1 group/star"
                            >
                              <Star
                                size={36}
                                fill={(hoverRating ? starVal <= hoverRating : starVal <= userRating) ? "currentColor" : "none"}
                                className={(hoverRating ? starVal <= hoverRating : starVal <= userRating) ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" : "text-zinc-800 dark:text-zinc-700"}
                              />
                            </button>
                          );
                        })}
                        <div className="ml-6 sm:ml-8 pl-6 sm:pl-8 border-l border-zinc-200/50 dark:border-zinc-700/50 flex flex-col items-center gap-3">
                          <div className="relative w-20 h-20 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 via-orange-400/10 to-transparent border-2 border-yellow-400/30 animate-pulse" style={{ animationDuration: '3s' }} />
                            <div className="relative flex flex-col items-center">
                              <span className="text-3xl font-black text-zinc-900 dark:text-white font-mono leading-none">{selectedVendor.rating}</span>
                              <span className="text-[8px] text-yellow-500 font-black uppercase tracking-wider mt-0.5">Score</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700">
                            <Activity size={10} className="text-green-500" />
                            <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-300">{selectedVendor.reviewCount}</span>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Reports</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-2xl font-black uppercase tracking-tighter text-green-600 border-b border-zinc-100 dark:border-zinc-800 pb-4">Terminal Inventory</h3>
                <div className="grid gap-4">
                  {selectedVendor.cropsSold.map((crop: any) => (
                    <div key={crop.id} className="bg-zinc-50 dark:bg-zinc-800/50 p-3 sm:p-6 rounded-2xl sm:rounded-[32px] border border-zinc-200 dark:border-zinc-700 flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-600 transition-all shadow-sm">
                      <div className="flex items-center gap-3 sm:gap-6">
                        <div className="group-hover:scale-110 transition-transform"><CropIcon crop={crop} size="lg" /></div>
                        <div>
                          <p className="font-black text-base sm:text-2xl text-zinc-900 dark:text-white tracking-tight">{crop.vendors.find((v: any) => v.id === selectedVendor.id)?.listingName || crop.name}</p>
                          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Weight Index: {crop.weightPerUnit}kg/unit</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl sm:text-3xl font-black font-mono text-green-600 leading-none mb-2">{formatPrice(crop.vendors.find((v: any) => v.id === selectedVendor.id)?.price || crop.currentPrice)}</p>
                        <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">Liquidity: {crop.vendors.find((v: any) => v.id === selectedVendor.id)?.stock}kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => setSelectedVendor(null)} className="w-full bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 py-4 sm:py-6 rounded-2xl sm:rounded-[28px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500 mt-6 sm:mt-10 transition-all hover:text-zinc-900 dark:hover:text-white text-sm sm:text-base border border-zinc-200 dark:border-zinc-700">Terminate Connection</button>
            </div>
          </div>
        </div>
      )}

      {/* Crop Info Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
          <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl" onClick={() => setSelectedCrop(null)}></div>
          <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-3xl sm:rounded-[50px] overflow-hidden relative border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedCrop(null)} className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"><X size={20} /></button>
            <div className="p-5 sm:p-8 lg:p-12 space-y-6 sm:space-y-10 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="flex items-center gap-4 sm:gap-8">
                <CropIcon crop={selectedCrop} size="xl" />
                <div>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">{selectedCrop.name}</h2>
                  <p className="text-zinc-400 dark:text-zinc-500 font-mono tracking-[0.4em] uppercase text-xs mt-1">{selectedCrop.category} INDEX</p>
                </div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8 rounded-2xl sm:rounded-[36px] border border-zinc-200 dark:border-zinc-800 shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-widest">Local Market Index</p>
                  <div className="flex items-center gap-1 text-green-600 font-bold text-lg font-mono">
                    <TrendingUp size={18} /> {selectedCrop.change24h}%
                  </div>
                </div>
                <p className="text-3xl sm:text-5xl font-black font-mono text-zinc-900 dark:text-white tracking-tighter">{formatPrice(selectedCrop.currentPrice)} <span className="text-base sm:text-xl text-zinc-400 dark:text-zinc-500">/ kg</span></p>
                <p className="text-xs text-zinc-500 dark:text-zinc-600 mt-4 font-bold uppercase tracking-widest">Projection: 1 unit ≈ {selectedCrop.weightPerUnit}kg</p>
                {selectedCrop.lastUpdated && (
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-3 flex items-center gap-1.5 font-mono">
                    <Clock size={11} className="text-green-500" /> Last updated {timeAgo(selectedCrop.lastUpdated)}
                  </p>
                )}
              </div>

              {/* Price History Chart */}
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 ml-2">Price History</p>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 rounded-2xl sm:rounded-[28px] border border-zinc-200 dark:border-zinc-800 shadow-inner">
                  <div className="h-48 sm:h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedCrop.history.slice(-52)}>
                        <defs>
                          <linearGradient id="historyGrad" x1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={selectedCrop.change24h >= 0 ? '#4ade80' : '#ef4444'} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={selectedCrop.change24h >= 0 ? '#4ade80' : '#ef4444'} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 9, fill: '#71717a' }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(d: string) => {
                            const dt = new Date(d);
                            return dt.toLocaleDateString('en', { month: 'short' });
                          }}
                          interval={Math.max(0, Math.floor(selectedCrop.history.slice(-52).length / 6) - 1)}
                        />
                        <YAxis
                          tick={{ fontSize: 9, fill: '#71717a' }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v: number) => `₱${v}`}
                          domain={['auto', 'auto']}
                          width={50}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }}
                          labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }}
                          formatter={(value: number) => [`₱${value.toFixed(2)}`, 'Price']}
                        />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke={selectedCrop.change24h >= 0 ? '#4ade80' : '#ef4444'}
                          fill="url(#historyGrad)"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, stroke: '#000', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Price Data */}
              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 ml-2">Recent Data Points</p>
                <div className="max-h-56 overflow-y-auto scrollbar-hide space-y-2 pr-1">
                  {selectedCrop.history.slice(-10).reverse().map((pt, idx, arr) => {
                    const prevPt = idx < arr.length - 1 ? arr[idx + 1] : null;
                    const change = prevPt ? ((pt.price - prevPt.price) / prevPt.price) * 100 : 0;
                    return (
                      <div key={`${pt.date}-${idx}`} className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 px-4 py-3 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                            <Clock size={12} className="text-zinc-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white font-mono">{new Date(pt.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {prevPt && (
                            <span className={`text-[10px] font-black ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
                            </span>
                          )}
                          <p className="font-mono font-black text-green-600 text-sm">₱{pt.price.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 ml-2">Available Ask Terminals</p>
                {[...selectedCrop.vendors].sort((a, b) => a.price - b.price).map(v => (
                  <div key={v.id} className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 p-3 sm:p-5 rounded-2xl sm:rounded-3xl hover:border-green-400/30 transition-colors shadow-sm group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center font-black text-zinc-300 dark:text-zinc-700 group-hover:text-green-600">{v.name[0]}</div>
                      <div>
                        <p className="font-black text-zinc-900 dark:text-white text-md leading-none mb-1">{v.listingName || selectedCrop.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-tight">
                          <span>{v.name}</span>
                          <span className="flex items-center gap-1 text-yellow-500">
                            <Star size={10} fill="currentColor" /> {v.rating} <span className="text-zinc-300 dark:text-zinc-600">({v.reviewCount})</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="font-mono font-black text-lg sm:text-2xl text-green-600">{formatPrice(v.price)}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => { addToBudget(selectedCrop.id); setSelectedCrop(null); }} className="flex-1 bg-green-500 text-black py-4 sm:py-6 rounded-2xl sm:rounded-[28px] font-black uppercase tracking-widest hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-green-500/10 text-sm sm:text-base">Add to Assets</button>
                <button onClick={() => setSelectedCrop(null)} className="flex-1 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-500 py-4 sm:py-6 rounded-2xl sm:rounded-[28px] font-black uppercase tracking-widest hover:text-zinc-900 dark:hover:text-white transition-colors text-sm sm:text-base border border-zinc-200 dark:border-zinc-700">Close View</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Modals */}
      {isAddCropModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
          <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl" onClick={() => { setIsAddCropModalOpen(false); setAddCropModalSelection(null); }}></div>
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl sm:rounded-[50px] overflow-hidden relative border border-zinc-200 dark:border-zinc-800 shadow-2xl">
            <button onClick={() => { setIsAddCropModalOpen(false); setAddCropModalSelection(null); }} className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"><X size={20} /></button>
            <div className="p-5 sm:p-8 lg:p-12 space-y-6 sm:space-y-10 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">Initialize {vendorShopType} Listing</h2>
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase block mb-3 tracking-widest ml-2">Available {vendorShopType} Index Assets</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-3 scrollbar-hide">
                    {crops
                      .filter(c => vendorShopType === 'Fruit' ? c.category === 'Fruit' : c.category !== 'Fruit')
                      .map(c => (
                        <button key={c.id} onClick={() => {
                          setAddCropModalSelection(c);
                          const nameInput = document.getElementById('admin-name') as HTMLInputElement;
                          if (nameInput) nameInput.value = c.name;
                        }} className={`p-2 sm:p-4 rounded-xl sm:rounded-[24px] border transition-all ${addCropModalSelection?.id === c.id ? 'bg-green-500 border-green-400 text-black shadow-xl shadow-green-400/20' : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'}`}>
                          <CropIcon crop={c} size="sm" />
                        </button>
                      ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 ml-2 tracking-widest uppercase">Listing Name (Optional)</label>
                    <input id="admin-name" type="text" placeholder="Custom name for this listing" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-5 font-mono text-sm sm:text-lg font-bold outline-none text-zinc-900 dark:text-white focus:border-green-400/50 shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 ml-2 tracking-widest uppercase">Ask Index (₱)</label>
                    <input id="admin-p" type="number" min="0.01" step="0.01" placeholder="0.00" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-5 font-mono text-lg sm:text-xl font-bold outline-none text-green-600 focus:border-green-400/50 shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 ml-2 tracking-widest uppercase">Liquidity (kg)</label>
                    <input id="admin-s" type="number" min="1" step="1" placeholder="0" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-5 font-mono text-lg sm:text-xl font-bold outline-none text-zinc-900 dark:text-white focus:border-green-400/50 shadow-inner" />
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
              }} className="w-full bg-green-500 text-black py-4 sm:py-6 rounded-2xl sm:rounded-[28px] font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-green-400/20 text-sm sm:text-base">Execute Listing</button>
            </div>
          </div>
        </div>
      )}


      {editingInventoryCrop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
          <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl" onClick={() => setEditingInventoryCrop(null)}></div>
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl sm:rounded-[50px] p-5 sm:p-8 lg:p-12 relative border border-zinc-200 dark:border-zinc-800 text-center space-y-6 sm:space-y-10 animate-in zoom-in-95 duration-200 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            <button onClick={() => setEditingInventoryCrop(null)} className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"><X size={20} /></button>
            <div className="mx-auto"><CropIcon crop={editingInventoryCrop} size="xl" /></div>
            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">Update Node {editingInventoryCrop.name}</h2>
              <p className="text-zinc-400 dark:text-zinc-500 text-xs font-black uppercase tracking-[0.3em] mt-2">Adjusting terminal parameters</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 text-left">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase ml-3 tracking-widest">Listing Name</label>
                <input id="upd-name" type="text" defaultValue={editingInventoryCrop.vendors.find(v => v.id === currentVendorId)?.listingName || editingInventoryCrop.name} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-5 font-mono text-sm sm:text-lg font-bold outline-none text-zinc-900 dark:text-white focus:border-green-400/50 shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase ml-3 tracking-widest">Ask Index</label>
                <input id="upd-p" type="number" defaultValue={editingInventoryCrop.vendors.find(v => v.id === currentVendorId)?.price} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-5 font-mono text-lg sm:text-xl font-bold outline-none text-green-600 focus:border-green-400/50 shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase ml-3 tracking-widest">Liquidity Level</label>
                <input id="upd-s" type="number" defaultValue={editingInventoryCrop.vendors.find(v => v.id === currentVendorId)?.stock} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-5 font-mono text-lg sm:text-xl font-bold outline-none text-zinc-900 dark:text-white focus:border-green-400/50 shadow-inner" />
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
              }} className="flex-1 bg-green-500 text-black py-4 sm:py-5 rounded-2xl sm:rounded-[28px] font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 shadow-green-500/10 text-sm sm:text-base">Commit Asset</button>
              <button onClick={() => setEditingInventoryCrop(null)} className="flex-1 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-500 py-4 sm:py-5 rounded-2xl sm:rounded-[28px] font-black uppercase transition-colors hover:text-zinc-900 dark:hover:text-white text-sm sm:text-base border border-zinc-200 dark:border-zinc-700">Discard</button>
            </div>
          </div>
        </div>
      )}
      {isComplaintModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6">
          <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl" onClick={() => setIsComplaintModalOpen(false)}></div>
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl sm:rounded-[40px] p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setIsComplaintModalOpen(false)} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"><X size={20} /></button>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20"><AlertCircle className="text-red-500" size={24} /></div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Report Issue</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Submit a complaint to Admin</p>
              </div>
            </div>
            {complaintConfirmStep ? (
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center">
                  <AlertCircle className="text-red-500" size={40} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-zinc-900 dark:text-white">Confirm Submission</h4>
                  <p className="text-zinc-500 text-sm mt-2">Are you sure you want to submit this complaint?</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 text-left">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Subject</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white mb-3">{complaintForm.subject}</p>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Message</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">{complaintForm.message}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setComplaintConfirmStep(false)} className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all border border-zinc-200 dark:border-zinc-700">Go Back</button>
                  <button onClick={confirmSubmitComplaint} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2"><CheckCircle size={18} /> Confirm</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase ml-3 tracking-widest">Subject</label>
                  <input
                    type="text"
                    placeholder="Brief summary of the issue"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 font-bold text-sm outline-none text-zinc-900 dark:text-white focus:border-red-500/50 shadow-inner"
                    value={complaintForm.subject}
                    onChange={(e) => setComplaintForm(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase ml-3 tracking-widest">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the problem in detail..."
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 font-bold text-sm outline-none text-zinc-900 dark:text-white focus:border-red-500/50 shadow-inner resize-none"
                    value={complaintForm.message}
                    onChange={(e) => setComplaintForm(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>
                <button onClick={handleSubmitComplaint} className="w-full bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-red-500/20 mt-2">Submit Complaint</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Note Modal */}
      {adminNoteComplaintId && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6">
          <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl" onClick={() => setAdminNoteComplaintId(null)}></div>
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl sm:rounded-[40px] p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setAdminNoteComplaintId(null)} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"><X size={20} /></button>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/20"><CheckCircle className="text-green-500" size={24} /></div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Resolve Complaint</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Add an admin note (optional)</p>
              </div>
            </div>
            <div className="space-y-4">
              {(() => {
                const comp = complaints.find(c => c.id === adminNoteComplaintId); return comp ? (
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={14} className="text-red-400" />
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Complaint Details</span>
                    </div>
                    <p className="font-bold text-zinc-900 dark:text-white text-sm">{comp.subject}</p>
                    <p className="text-xs text-zinc-500 mt-1">{comp.message}</p>
                    <p className="text-[10px] text-zinc-400 mt-2">From: {comp.from}</p>
                  </div>
                ) : null;
              })()}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase ml-3 tracking-widest flex items-center gap-2"><FileText size={12} /> Admin Note</label>
                <textarea
                  rows={3}
                  placeholder="Add a note about the resolution..."
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 font-bold text-sm outline-none text-zinc-900 dark:text-white focus:border-green-500/50 shadow-inner resize-none"
                  value={adminNoteText}
                  onChange={(e) => setAdminNoteText(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setAdminNoteComplaintId(null)} className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all border border-zinc-200 dark:border-zinc-700 text-sm">Cancel</button>
                <button onClick={() => {
                  const comp = complaints.find(c => c.id === adminNoteComplaintId);
                  setComplaints(prev => prev.map(x => x.id === adminNoteComplaintId ? { ...x, status: 'resolved' as const, adminNote: adminNoteText.trim() || undefined } : x));
                  if (comp) addAuditEntry('RESOLVE_COMPLAINT', comp.subject, `Resolved from ${comp.from}${adminNoteText.trim() ? ` — Note: ${adminNoteText.trim()}` : ''}`);
                  setAdminNoteComplaintId(null);
                  setAdminNoteText('');
                }} className="flex-1 bg-green-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-2 text-sm"><CheckCircle size={18} /> Resolve</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

















const root = createRoot(document.getElementById('root')!);
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
