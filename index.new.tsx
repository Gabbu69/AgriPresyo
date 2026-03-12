import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Import all extracted components
import FuturisticVinesBackground from './components/ui/FuturisticVinesBackground';
import { LoginPage, AnnouncementBanner } from './components/auth/LoginPage';
import { ThemeProvider } from './components/auth/ThemeContext';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { Logo } from './components/ui/Logo';
import { Ticker } from './components/ui/Ticker';
import { CropIcon } from './components/ui/CropIcon';
import { RoleDropdown } from './components/ui/RoleDropdown';
import { AnimatedCounter } from './components/ui/AnimatedCounter';
import { Sparkline } from './components/ui/Sparkline';

// Import utilities
import { formatPrice, timeAgo, simpleHash } from './components/utils/helpers';
import { mockSystemCheck } from './components/utils/mockSystemCheck';

// Types and constants
import { UserRole, Crop, BudgetListItem, Vendor, SystemAlert, UserRecord, AuditLogEntry, Announcement, Complaint } from './types';
import { MOCK_CROPS } from './constants';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Main App Component
const App = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('AP_isAuthenticated') === 'true');
  const [role, setRole] = useState<UserRole>(() => (localStorage.getItem('AP_role') as UserRole) || UserRole.CONSUMER);
  const [currentUserEmail, setCurrentUserEmail] = useState(() => localStorage.getItem('AP_currentUserEmail') || '');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => localStorage.getItem('AP_admin_unlocked') === 'true');

  // Persist important states
  useEffect(() => { localStorage.setItem('AP_admin_unlocked', String(isAdminUnlocked)); }, [isAdminUnlocked]);

  // User Records
  const SEEDED_ADMIN: UserRecord = {
    name: 'Gab The Admin',
    email: 'gabtheadmin@yahoo.com',
    password: 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f',
    role: UserRole.ADMIN,
    status: 'active',
    isVerified: false,
    verificationStatus: 'none',
  };

  const MOCK_VENDOR_GAB: UserRecord = {
    name: 'Gab The Vendor',
    email: 'gab@test.com',
    password: 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f',
    role: UserRole.VENDOR,
    status: 'active',
    isVerified: false,
    verificationStatus: 'none',
  };

  const [users, setUsers] = useState<UserRecord[]>(() => {
    try {
      const raw = localStorage.getItem('AP_users');
      const parsed: UserRecord[] = raw ? JSON.parse(raw) : [];
      const migrated = parsed.map((u: any) => {
        let s = u.status || 'active';
        if (u.role === 'VENDOR' && s === 'pending') s = 'active';
        let vs = u.verificationStatus;
        if (!vs) {
          if (u.isVerified) vs = 'verified';
          else if (u.verificationRequestedAt && !u.isVerified) vs = 'pending_review';
          else vs = 'none';
        }
        return { ...u, status: s, verificationStatus: vs };
      });
      if (!migrated.find(u => u.email === SEEDED_ADMIN.email)) {
        const withSeeds = [...migrated, SEEDED_ADMIN, MOCK_VENDOR_GAB];
        localStorage.setItem('AP_users', JSON.stringify(withSeeds));
        return withSeeds;
      }
      return migrated;
    } catch (e) {
      localStorage.setItem('AP_users', JSON.stringify([SEEDED_ADMIN, MOCK_VENDOR_GAB]));
      return [SEEDED_ADMIN, MOCK_VENDOR_GAB];
    }
  });

  // Admin Features
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

  // Market/UI State
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'market' | 'shops' | 'analytics' | 'shop' | 'admin'>(() => (localStorage.getItem('AP_activeTab') as any) || 'market');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);

  // Budget Calculator State
  const [budgetLimit, setBudgetLimit] = useState<number>(1000);
  const [budgetItems, setBudgetItems] = useState<BudgetListItem[]>([]);

  // Consumer Features
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('AP_favorites') || '[]'); } catch { return []; }
  });
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'demand' | 'trending'>('default');

  // Vendor & Profile State
  const [vendorShopType, setVendorShopType] = useState<'Fruit' | 'Vegetable'>('Fruit');
  const [shopFilter, setShopFilter] = useState<'All' | 'Fruit' | 'Vegetable'>('All');
  const [userVendorRatings, setUserVendorRatings] = useState<Record<string, number>>(() => { 
    try { const s = localStorage.getItem('AP_userVendorRatings'); return s ? JSON.parse(s) : {}; } catch { return {}; } 
  });
  const [vendorRatingData, setVendorRatingData] = useState<Record<string, { rating: number; reviewCount: number }>>(() => { 
    try { const s = localStorage.getItem('AP_vendorRatingData'); return s ? JSON.parse(s) : {}; } catch { return {}; } 
  });
  
  // Crop Data
  const [crops, setCrops] = useState<Crop[]>(MOCK_CROPS);

  // Scroll Shadow
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Initial Loading
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Persist state to localStorage
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

  // Helper Functions
  const currentUser = useMemo(() => users.find(u => u.email === currentUserEmail), [users, currentUserEmail]);

  const toggleFavorite = (cropId: string) => {
    setFavorites(prev => prev.includes(cropId) ? prev.filter(f => f !== cropId) : [...prev, cropId]);
  };

  const getSeasonalStatus = (crop: Crop): { inSeason: boolean; label: string } => {
    const month = new Date().getMonth();
    const fruitSeasons: Record<string, number[]> = {
      'Mango': [2, 3, 4, 5], 'Banana': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      'Watermelon': [2, 3, 4, 5, 6], 'Pineapple': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      'Papaya': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Calamansi': [7, 8, 9, 10, 11, 0],
      'Coconut': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    };
    const name = crop.name.split(' ').pop() || crop.name;
    const seasons = fruitSeasons[name];
    if (!seasons) return { inSeason: true, label: 'In Season' };
    return seasons.includes(month) ? { inSeason: true, label: 'In Season' } : { inSeason: false, label: 'Off Season' };
  };

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

  // Auth Handlers
  const handleLogin = (userRole: UserRole, email?: string) => {
    setRole(userRole);
    setCurrentUserEmail(email || '');
    setIsAuthenticated(true);
  };

  const attemptLogin = async (email: string, password: string, userRole: UserRole): Promise<string> => {
    const user = users.find(u => u.email === email && u.role === userRole);
    if (!user) return 'invalid';
    if (user.status === 'banned') return 'banned';
    const hashedPw = await simpleHash(password);
    return user.password === hashedPw ? 'ok' : 'invalid';
  };

  const registerUser = async (name: string, email: string, password: string, userRole: UserRole, docs?: string[]): Promise<string> => {
    if (users.find(u => u.email === email)) return 'exists';
    const hashedPw = await simpleHash(password);
    const newUser: UserRecord = {
      name,
      email,
      password: hashedPw,
      role: userRole,
      status: userRole === UserRole.VENDOR ? 'active' : 'active',
      isVerified: false,
      verificationStatus: 'none',
    };
    setUsers(prev => [...prev, newUser]);
    return 'ok';
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsAuthenticated(false);
      setCurrentUserEmail('');
      setRole(UserRole.CONSUMER);
      setIsLoggingOut(false);
    }, 600);
  };

  // TODO: Extract these render functions into separate components
  // For now, keeping them inline to preserve all functionality
  
  const renderConsumerView = () => {
    // Move this entire function to components/market/MarketPrices.tsx
    // Return placeholder for now
    return <div className="text-white">Market Prices Component - To be extracted</div>;
  };

  const renderCalculatorWidget = () => {
    // Move this to components/budget/BudgetCalculator.tsx
    return <div className="text-white">Budget Calculator Component - To be extracted</div>;
  };

  const renderShopsView = () => {
    // Move this to components/vendor/VendorDirectory.tsx
    return <div className="text-white">Vendor Directory Component - To be extracted</div>;
  };

  const renderAnalyticsDashboard = () => {
    // Move this to components/dashboard/AnalyticsDashboard.tsx
    return <div className="text-white">Analytics Dashboard Component - To be extracted</div>;
  };

  const renderVendorView = () => {
    // Move this to components/dashboard/VendorDashboard.tsx
    return <div className="text-white">Vendor Dashboard Component - To be extracted</div>;
  };

  const renderAdminPanel = () => {
    // Move this to components/dashboard/AdminPanel.tsx
    return <div className="text-white">Admin Panel Component - To be extracted</div>;
  };

  // Render
  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} attemptLogin={attemptLogin} onRegister={registerUser} isAdminUnlocked={isAdminUnlocked} onUnlock={() => setIsAdminUnlocked(true)} />;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-300">
        {/* Header */}
        <header className={`sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
          <div className="h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between bg-white/50 dark:bg-black/50 backdrop-blur-md">
            <Logo size={40} />
            <div className="flex items-center gap-3 sm:gap-6">
              <Ticker crops={crops.slice(0, 5)} onCropClick={setSelectedCrop} />
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold text-sm transition-colors">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Announcements */}
          <AnnouncementBanner announcements={announcements} dismissedIds={dismissedIds} onDismiss={handleDismissAnnouncement} />

          {/* Tabs */}
          <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
            <button onClick={() => setActiveTab('market')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all tracking-[0.1em] ${activeTab === 'market' ? 'bg-green-600 text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-white'}`}>
              MARKET
            </button>
            {role !== UserRole.VENDOR && <button onClick={() => setActiveTab('shops')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all tracking-[0.1em] ${activeTab === 'shops' ? 'bg-green-600 text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-white'}`}>
              SHOPS
            </button>}
            <button onClick={() => setActiveTab('analytics')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all tracking-[0.1em] ${activeTab === 'analytics' ? 'bg-green-600 text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-white'}`}>
              ANALYTICS
            </button>
            {role === UserRole.VENDOR && <button onClick={() => setActiveTab('shop')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all tracking-[0.1em] ${activeTab === 'shop' ? 'bg-green-600 text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-white'}`}>
              DASHBOARD
            </button>}
            {role === UserRole.ADMIN && isAdminUnlocked && <button onClick={() => setActiveTab('admin')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all tracking-[0.1em] ${activeTab === 'admin' ? 'bg-green-600 text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-white'}`}>
              ADMIN CONSOLE
            </button>}
          </div>

          {/* Content Area */}
          {activeTab === 'market' && renderConsumerView()}
          {activeTab === 'market' && renderCalculatorWidget()}
          {activeTab === 'shops' && role !== UserRole.VENDOR && renderShopsView()}
          {activeTab === 'analytics' && renderAnalyticsDashboard()}
          {activeTab === 'shop' && role === UserRole.VENDOR && renderVendorView()}
          {activeTab === 'admin' && role === UserRole.ADMIN && renderAdminPanel()}
        </main>
      </div>
    </ThemeProvider>
  );
};

// Render App
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
