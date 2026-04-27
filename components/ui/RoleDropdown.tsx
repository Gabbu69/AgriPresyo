import React, { useState, useEffect } from 'react';
import { ChevronDown, ShoppingCart, Store, Crown } from 'lucide-react';
import { UserRole } from '../../types';

const ROLE_LABELS: Record<UserRole, { label: string; icon: React.ReactNode; desc: string }> = {
  [UserRole.CONSUMER]: { label: 'CONSUMER', icon: <ShoppingCart className="w-6 h-6 text-emerald-500" />, desc: 'Browse prices & build budgets' },
  [UserRole.VENDOR]: { label: 'VENDOR', icon: <Store className="w-6 h-6 text-amber-500" />, desc: 'Manage your shop & inventory' },
  [UserRole.ADMIN]: { label: 'ADMIN', icon: <Crown className="w-6 h-6 text-yellow-500" />, desc: 'System administration & analytics' },
};

export const RoleDropdown = ({ role, setRole, isAdminUnlocked }: { role: UserRole; setRole: (r: UserRole) => void; isAdminUnlocked: boolean }) => {
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
    .filter(([key]) => key !== UserRole.ADMIN) as [UserRole, typeof current][];

  return (
    <div ref={dropdownRef} className="relative mb-6">
      {/* Selected role trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between bg-stone-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 hover:border-green-500/40 transition-all group shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-zinc-100 dark:bg-zinc-900 rounded-xl shadow-inner shrink-0">
            {current.icon}
          </div>
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
        className={`absolute top-full left-0 right-0 mt-2 bg-stone-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden z-50 shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300 origin-top ${isOpen
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
            className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-green-500/10 transition-colors text-left border-b border-zinc-100 dark:border-zinc-800/50 last:border-b-0 group"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-zinc-100 dark:bg-zinc-900 rounded-xl shadow-inner shrink-0 group-hover:bg-white dark:group-hover:bg-zinc-800 transition-colors">
              {info.icon}
            </div>
            <div>
              <p className="text-xs font-black text-zinc-900 dark:text-zinc-400 tracking-widest">{info.label}</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-600 mt-0.5">{info.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export { ROLE_LABELS };
