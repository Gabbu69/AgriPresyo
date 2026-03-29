<div align="center">
  <img src="public/agripresyo-logo.png" alt="AgriPresyo" width="140" />
  <h1>AgriPresyo</h1>
  <p><em>Agricultural commodity intelligence for the Philippine market</em></p>

  <p>
    <a href="#about">About</a> &middot;
    <a href="#features">Features</a> &middot;
    <a href="#getting-started">Getting Started</a> &middot;
    <a href="#tech-stack">Tech Stack</a> &middot;
    <a href="#project-structure">Project Structure</a> &middot;
    <a href="#contributing">Contributing</a>
  </p>
</div>

---

## About

AgriPresyo is a market intelligence platform built for the Philippine agricultural supply chain. It gives farmers, vendors, and everyday consumers a shared window into commodity pricing, so that everyone involved in getting food from the farm to the table can make better-informed decisions.

The name comes from combining "Agriculture" with "Presyo," the Filipino word for price. That is the core idea behind the project: making agricultural pricing more visible and more fair.

The platform simulates a real-time trading terminal, complete with live price tickers, vendor discovery, budget planning tools, and role-based dashboards for consumers, vendors, and administrators. It is designed as a fully client-side demonstration, but the architecture is built to support a real backend when the time comes.

## Features

**Market Intelligence**
- Live commodity ticker with 24-hour price changes across dozens of Philippine crops
- Interactive price history charts with weekly data points spanning multiple years
- Market leaderboards highlighting the most traded and highest-demand commodities
- Category filtering across Fruits, Vegetables, Spices, and Root Crops

**Vendor Network**
- Searchable vendor directory organized by specialty (organic, highland, tropical, and more)
- Vendor profiles with ratings, review counts, stock levels, and competitive pricing
- Direct comparison of prices across multiple vendors for any given commodity

**Budget Planning**
- Built-in budget calculator for planning market purchases
- Unit and kilogram-based quantity selection
- Real-time cost estimation against current market prices

**User Roles and Administration**
- Consumer, Vendor, and Admin role separation with distinct dashboards
- Vendor verification workflow with document submission and admin review
- Admin panel with user management, announcement broadcasting, and complaint handling
- Full audit logging for administrative actions

**Design and Experience**
- Dark and light mode with system preference detection
- Glassmorphism UI with smooth micro-animations throughout
- Animated background with generative vine patterns
- Fully responsive layout from mobile to desktop
- Custom scrollbar styling and marquee ticker with hover-to-pause

## Getting Started

**Prerequisites:** Node.js 18 or later and npm.

1. Clone the repository:
   ```
   git clone https://github.com/Gabbu69/AgriPresyo.git
   cd AgriPresyo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser to the address shown in the terminal (usually `http://localhost:3000`).

To create a production build:
```
npm run build
```

The output will be in the `dist` directory, ready for static hosting or deployment to platforms like Vercel.

### Environment Variables

Copy `.env.example` to `.env` if you want to customize the admin OTP code. The default value works out of the box for local development.

## Tech Stack

| Layer        | Technology                                      |
|------------- |------------------------------------------------ |
| Framework    | React 19 with TypeScript                        |
| Build Tool   | Vite 6                                          |
| Styling      | Tailwind CSS 4 with custom vanilla CSS          |
| Charts       | Recharts                                        |
| Icons        | Lucide React                                    |
| Routing      | React Router DOM 7                              |
| State        | React hooks and Zustand                         |
| PDF Export   | jsPDF with jspdf-autotable                      |
| Deployment   | Vercel (configured via vercel.json)             |

## Project Structure

```
AgriPresyo/
  index.html            Entry point
  index.tsx              Main application (all views and logic)
  index.css              Global styles and Tailwind directives
  constants.tsx          Commodity data, vendor mock data, price histories
  types.ts               TypeScript interfaces and enums
  components/
    auth/                Login page and theme context
    ui/                  Reusable UI components (ticker, sparklines, icons, etc.)
    utils/               Helper functions and mock system checks
  views/
    MarketView.tsx       Detailed market and chart view
    BudgetCalculatorView.tsx   Budget planning tool
  lib/
    formatters.ts        Number and currency formatting utilities
  public/
    crops/               High-quality commodity images (transparent PNGs)
    agripresyo-logo.png  Application logo
```

## Contributing

Contributions are welcome. If you have ideas for new features, find a bug, or want to improve the design, feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch and open a pull request

## License

This project is open source. See the repository for license details.

---

<div align="center">
  <p>Built for a more transparent agricultural future.</p>
</div>
