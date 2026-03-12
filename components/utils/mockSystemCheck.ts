import { SystemAlert } from '../../types';

export const mockSystemCheck = (users: any[], crops: any[]): SystemAlert | null => {
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
