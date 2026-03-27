<div align="center">

# 🫀 LifeStream — Blood Bank Management System

**A premium, interview-ready frontend healthcare web application**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)

> *Connecting donors, hospitals, and blood banks — saving lives faster.*

</div>

---

## 📌 Overview

**LifeStream** is a fully functional, beautifully designed Blood Bank Management System built entirely with **HTML5, CSS3, and Vanilla JavaScript** — no frameworks, no backend dependency. It simulates a real-world healthcare portal with live data visualization, emergency blood requests, donor registration, and a premium SaaS-style login experience.

> ⚡ This project is **interview-ready** and demonstrates advanced frontend skills including real-time state management, Chart.js integration, localStorage persistence, and responsive UI design.

---

## ✨ Features

### 🧭 Navigation
- Fixed **glassmorphic navbar** with 3-column grid layout (Logo | Links | Actions)
- **🔔 Live Notification Bell** with activity feed, badge count, and clear-all
- **Dark / Light Mode** toggle with CSS variables and full theme persistence
- Responsive **hamburger menu** for mobile

### 🔐 Premium Login Portal
- **Split-panel SaaS-style modal** — branded red left panel + clean form right panel
- **Donor** and **Hospital** role tabs
- **Social Login** (Google & Apple) with multi-step Account Picker flow
- **Password eye toggle**, Remember Me, Forgot Password
- **Session persistence** via `localStorage` — shows personalized user badge after login
- Hospital tab has a secure provider ID + passcode system with a green security badge

### 📊 Real-Time Dashboard
- **Bar Chart** — live blood stock levels for all 8 blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-)
- **Doughnut Chart** — donor age distribution breakdown
- **Color-coded bars** — each blood group has its own distinct color
- Data updates **live** when new donations are registered

### 🔍 Blood Availability Finder
- Instant lookup by blood group
- Shows **4 hospital result cards** with live stock units
- Color-coded status: ✅ Available / ⚠️ Low Stock / 🔴 Critical
- Reads units directly from live dashboard data

### 🚨 Emergency System
- **Scrolling Ticker** bar — live urgent alerts and milestones
- **Blood Request Form** — submit emergency blood requests with toast confirmation

### 🩸 Donor Registration
- Full registration form (Name, Blood Group, Age, Contact, City)
- Form submission **updates live charts** instantly
- Triggers a **Notification Bell push** automatically on submit

### 💬 Patient Feedback
- Dynamic **testimonial grid** with user-submitted cards
- Cards **persist** across sessions using `localStorage`
- Integrated feedback form with character count

### 🦸 Hero Section
- Animated **typewriter effect** cycling through mission statements
- Floating **ambient glow orbs** (pure CSS animations)
- Bold CTA buttons linking to key sections

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Structure & Semantic Markup |
| **CSS3** | Glassmorphism, Grid, Flexbox, Variables, Animations |
| **Vanilla JavaScript (ES6+)** | State Management, DOM Manipulation, Events |
| **Chart.js** (CDN) | Bar & Doughnut Data Visualization |
| **Google Fonts (Inter)** | Typography |
| **localStorage** | Data & Session Persistence |

---

## 📁 Project Structure

```
Blood Bank Project/
│
├── index.html        # Main HTML — all sections and pages
├── styles.css        # All CSS — themes, components, animations, layout
├── script.js         # All JS — charts, login, notifications, forms
└── README.md         # This file
```

---

## 🚀 Getting Started

### Option 1 — Open Directly
Just open `index.html` in your browser. No build step required.

### Option 2 — Live Server (Recommended)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. App opens at `http://localhost:5500`

---

## 🗝️ localStorage Keys

| Key | Purpose |
|---|---|
| `bloodStockData` | Live blood unit counts for all 8 groups |
| `patientFeedbackData` | User-submitted testimonials |
| `loggedInUser` | Active session (name, email, provider) |
| `notifData` | Notification bell feed |
| `theme` | Light / Dark mode preference |

---

## 📸 Sections at a Glance

| Section | Description |
|---|---|
| 🏠 Hero | Typewriter headline, ambient orbs, CTA buttons |
| 🔍 Find Blood | Blood group search → 4 hospital availability cards |
| 📊 Dashboard | Live bar + doughnut charts with color-coded groups |
| 🚨 Emergency | Priority blood request form with toast notifications |
| 📝 Register | Donor registration that updates charts live |
| 💬 Feedback | Customer testimonial grid with submit form |
| 🔐 Login Modal | Split-panel SaaS portal (Donor + Hospital tabs) |

---

## 🔮 Future Roadmap

- [ ] 🔥 Firebase backend — real multi-user auth & live database
- [ ] 🗺️ Hospital Locator Map (Google Maps API)
- [ ] 📱 React Native mobile app
- [ ] 📧 Email alerts for critical blood shortages
- [ ] 📈 Time-series analytics for usage trends
- [ ] 🧪 Unit tests for form logic and compatibility matrix

---

## 👨‍💻 Author

**Rajdeep**
- 💼 Software Developer & Data Analyst
- 🚀 Building interview-ready, production-quality frontend projects

---

<div align="center">

**⭐ If you found this helpful, give it a star!**

*Made with ❤️ to help save lives — one commit at a time.*

</div>
