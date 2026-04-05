<div align="center">
  <img src="public/AgriPresyo_logoFinal.png" alt="AgriPresyo" width="160" />

  # AgriPresyo

  **Agricultural commodity intelligence for the Philippine market**

  [![License: MIT](https://img.shields.io/badge/License-MIT-22c55e.svg?style=for-the-badge)](LICENSE)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

  <br />

  [About](#about) | [Features](#features) | [Getting Started](#getting-started) | [Tech Stack](#tech-stack) | [Project Structure](#project-structure) | [Contributing](#contributing) | [License](#license)

</div>

---

## About

**AgriPresyo** (from Agriculture + Presyo, the Filipino word for "price") is a market intelligence platform built for the Philippine agricultural supply chain. It gives farmers, vendors, and consumers a shared window into commodity pricing, so everyone involved in getting food from the farm to the table can make better-informed decisions.

The platform simulates a real-time trading terminal with live price tickers, vendor discovery, budget planning tools, and role-based dashboards. 

Bilingual support is included, offering a full Filipino and English language toggle powered by i18next.

---

## Features

### Market Intelligence
- Live commodity ticker with 24-hour price changes
- Interactive price history charts spanning multiple years
- Market leaderboards for most traded commodities
- Category filtering for Fruits, Vegetables, Spices, and Root Crops

### Vendor Network
- Searchable vendor directory by specialty
- Vendor profiles with ratings, stock levels, and pricing
- Cross-vendor price comparison

### Budget Planning
- Built-in budget calculator for market purchases
- Kilogram and unit-based quantity selection
- Real-time cost estimation against market prices
- CSV and PDF export capabilities for budget reports

### User Roles and Admin
- Dedicated Consumer, Vendor, and Admin dashboards
- Vendor verification workflow
- Admin panel with user management and audit logging

### Design and Experience
- Dark and Light mode with system preference detection
- Glassmorphism user interface with smooth micro-animations
- Animated generative background patterns
- Fully responsive design covering mobile to desktop
- Complete Filipino and English language translation toggle

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) version 18 or higher
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Gabbu69/AgriPresyo.git
cd AgriPresyo

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available locally at **`http://localhost:3000`**.

### Production Build

```bash
npm run build
```

Output is generated in the `dist/` directory, ready for static hosting on Vercel, Netlify, or similar platforms.

### Environment Variables

Copy `.env.example` to `.env` to customize the admin OTP code if necessary. The default configuration works immediately for local development.

---

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 4 + Custom CSS |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Routing** | React Router DOM 7 |
| **State** | Zustand + React Hooks |
| **i18n** | i18next + react-i18next |
| **PDF Export** | jsPDF + jspdf-autotable |
| **Deployment** | Vercel |

---

## Project Structure

```
AgriPresyo/
├── public/
│   ├── crops/               # High-quality commodity images (WebP and PNG)
│   └── AgriPresyo_logoFinal.png
├── components/
│   ├── auth/                # Login logic and theme context
│   ├── ui/                  # Reusable UI elements (ticker, sparklines, icons)
│   └── utils/               # Helper functions and system checks
├── views/
│   ├── MarketView.tsx       # Detailed market and chart view
│   ├── LandingPage.tsx      # Entry unauthenticated public page
│   ├── AboutPage.tsx        # Transparency and pricing source documentation 
│   └── BudgetCalculatorView.tsx
├── lib/
│   └── formatters.ts        # Number and currency formatting tools
├── locales/                 # Translation source files
├── api/                     # Serverless API routes
├── index.html               # Main entry point
├── index.tsx                # Main application component and routing
├── index.css                # Global styling and Tailwind configuration
├── constants.tsx            # Commodity records and mock price histories
├── types.ts                 # TypeScript type definitions
├── vite.config.ts           # Build process configuration
└── vercel.json              # Platform deployment configuration
```

---

## Contributing

Contributions are welcome. Whether it's a bug fix, new feature, or design improvement, feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch and open a Pull Request

---

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

---

<div align="center">
  <br />
  <strong>Built for a more transparent agricultural future.</strong>
  <br /><br />
  <sub>Developed for Filipino farmers, vendors, and consumers.</sub>
</div>
