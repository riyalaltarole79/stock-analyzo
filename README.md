# StockAnalyzo - Real-Time Stock Market Data Analysis & Trading Platform

StockAnalyzo is a production-ready, full-stack web application designed for professional stock market analysis and paper trading simulation. It features real-time data streaming, interactive charts, and AI-powered insights.

## 🚀 Features

- **Real-Time Tracking**: Live stock prices using WebSockets.
- **Interactive Charts**: Responsive charts built with Recharts.
- **Paper Trading**: Buy and sell stocks with a virtual $100,000 balance.
- **AI Insights**: Automated trend analysis and prediction signals (Buy/Hold/Sell).
- **Portfolio Dashboard**: Track holdings, profit/loss, and transaction history.
- **Market News**: Integration with financial news feeds.
- **Premium UI**: Dark mode, responsive design, and smooth animations using Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons, Recharts, Framer Motion.
- **Backend**: Node.js, Express.js, Socket.io, JWT Authentication.
- **Database**: MongoDB (Mongoose).
- **API**: Finnhub (Stock Data).

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account or local installation
- Finnhub API Key (optional, mock data provided by default)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd stock-analyzo
   ```

2. **Install Dependencies**
   Run the following in the root directory:
   ```bash
   npm run install:all
   ```

3. **Setup Environment**
   - Create `server/.env` with `MONGODB_URI`, `JWT_SECRET`, and `FINNHUB_API_KEY`.
   - Create `client/.env.local` with API URLs.

4. **Run the Application**
   ```bash
   # To run both client and server:
   npm run dev
   ```

3. **Setup Client**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Access the app**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Environment Variables

### Server (`server/.env`)
- `PORT`: 5000
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A long random string
- `FINNHUB_API_KEY`: Get one at [finnhub.io](https://finnhub.io)

### Client (`client/.env.local`)
- `NEXT_PUBLIC_API_URL`: http://localhost:5000/api
- `NEXT_PUBLIC_SOCKET_URL`: http://localhost:5000

## 🧪 Deployment

- **Backend**: Deploy on Render or Heroku.
- **Frontend**: Deploy on Vercel.
- **Database**: Use MongoDB Atlas.

---

Built By Riyalal Tarole
