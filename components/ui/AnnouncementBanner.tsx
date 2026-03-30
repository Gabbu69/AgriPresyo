import React, { useEffect } from 'react';
import { Megaphone, X } from 'lucide-react';
import { Announcement } from '../../types';

interface BannerItemProps {
  announcement: Announcement;
  onDismiss: (id: string) => void;
}

export const BannerItem: React.FC<BannerItemProps> = ({ announcement, onDismiss }) => {
  useEffect(() => {
    if (announcement.duration && announcement.duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(announcement.id);
      }, announcement.duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [announcement, onDismiss]);

  return (
    <div className={`p-4 rounded-2xl flex items-start justify-between gap-4 shadow-lg border relative group animate-in slide-in-from-top duration-500 ${
      announcement.priority === 'high' 
        ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' 
        : announcement.priority === 'medium' 
          ? 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400' 
          : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl shrink-0 ${
          announcement.priority === 'high' ? 'bg-red-500/20' : announcement.priority === 'medium' ? 'bg-orange-500/20' : 'bg-blue-500/20'
        }`}>
          <Megaphone size={20} />
        </div>
        <div>
          <p className="font-black text-sm uppercase tracking-wider mb-0.5">{announcement.title}</p>
          <p className="text-xs font-medium opacity-90">{announcement.message}</p>
          {announcement.duration && announcement.duration > 0 && (
            <div className="w-full h-1 bg-black/5 dark:bg-white/10 mt-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-current opacity-30 origin-left animate-duration-progress" 
                style={{ animationDuration: `${announcement.duration}s` }} 
              />
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => onDismiss(announcement.id)}
        className="text-current opacity-50 hover:opacity-100 transition-opacity p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
        aria-label="Dismiss announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
};

interface AnnouncementBannerProps {
  announcements: Announcement[];
  dismissedIds: string[];
  onDismiss: (id: string) => void;
}

export const AnnouncementBanner = ({ announcements, dismissedIds, onDismiss }: AnnouncementBannerProps) => {
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

export default AnnouncementBanner;
