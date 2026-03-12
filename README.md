<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/leaf.svg" alt="AgriPresyo Logo" width="80" height="80" />
  <h1>AgriPresyo</h1>
  <p><strong>A Modern, AI-Powered Agricultural Commodity Trading & Intelligence Terminal</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#architecture">Architecture</a>
  </p>
</div>

---

## 🌾 Overview

**AgriPresyo** is a state-of-the-art agricultural supply chain intelligence platform designed to bridge the gap between farmers, vendors, and consumers. Blending real-time market data, AI-driven analytics, and an intuitive, modern user interface, AgriPresyo empowers agricultural stakeholders with data transparency, demand forecasting, and seamless connections to specialized produce nodes.

The name "AgriPresyo" combines "Agriculture" and "Presyo" (the Filipino word for Price), embodying our mission to ensure fair and transparent pricing across the local food ecosystem.

## ✨ Features

- **Real-time Market Ticker:** Live stream of commodity ask indexes, localized market data, and 24-hour change percentages.
- **AI Intelligence Alerts:** Smart contextual notifications, opportunity spotting, and system health checks out of the box.
- **Dynamic Vendor Discovery:** Effortlessly search and filter specialized hardware "Nodes" (Vendors) based on categories like Fruits, Vegetables, and Spices.
- **Market Leaderboards:** At-a-glance analytics for the most traded, hot, and highly-demanded commodities.
- **Roles & Permissions:** Robust consumer, vendor, and admin flows with comprehensive audit logging, verification workflows, and personalized dashboards.
- **Stunning UI/UX:** A visually impressive interface featuring glassmorphism, responsive animations, customized charting, and a sophisticated dark mode.

## 🛠 Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Vanilla CSS (for custom keyframes and micro-animations)
- **Icons:** Lucide React
- **Charting:** Recharts (responsive market data visualization)
- **Routing:** React Router DOM
- **Deployment & Tooling:** PostCSS, Autoprefixer, ESLint

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Gabbu69/AgriPresyo.git
   cd AgriPresyo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📸 Screenshots

*(Add your screenshots here via markdown image tags `![Alt text](url)` to showcase the beautiful UI!)*

## 🧩 Architecture

AgriPresyo operates entirely on the client-side for demonstration purposes, heavily utilizing React hooks (`useState`, `useEffect`, `useMemo`) to handle complex state like the real-time ticker data, dynamic vendor inventories, charting histories, and interactive order-building budgets. State is purposefully separated to handle independent views across Consumers, Specialized Vendors, and system Administrators.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/Gabbu69/AgriPresyo/issues).

---

<div align="center">
  <p>Built with ❤️ for a more transparent agricultural future.</p>
</div>
