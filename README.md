# Tactlink Assessment

**Full Stack Developer Position**

A comprehensive full-stack application built with modern technologies including Node.js, GraphQL, React Native, and Remix.

## 📁 Project Structure

```
tactlink/
├── backend/   # Node.js + Apollo Server (GraphQL API)
├── mobile/    # React Native mobile application
└── web/       # Remix web frontend
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- npm package manager
- iOS development environment (for mobile)

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd tactlink
```

#### 2. Mobile App Setup

```bash
cd mobile
yarn install
yarn run ios
```

#### 3. Web Application Setup

```bash
cd web
yarn install
yarn dev
```

#### 4. Backend Server Setup

```bash
cd backend
npm install

# Development
node index.js

# Production (with PM2)
pm2 start index.js
```

## 🌐 Live Demo

### Web Application
Visit the live demo: **[https://tactlink.vercel.app/](https://tactlink.vercel.app/)**

### API Backend
Backend API endpoint: **[https://tactlink.naimroslan.dev](https://tactlink.naimroslan.dev)**

## 🛠 Technology Stack

- **Frontend Web**: Remix
- **Mobile**: React Native
- **Backend**: Node.js with Apollo Server
- **API**: GraphQL
- **Hosting**: Vercel (Web), Custom Domain (Backend)
- **Process Management**: PM2

## 📱 Platform Support

- **Web**: Modern browsers
- **Mobile**: iOS (Android support available)

## 🐳 Deployment

The backend has been containerized and is production-ready with proper deployment configurations.

---

*This project demonstrates full-stack development capabilities across web, mobile, and backend technologies.*
