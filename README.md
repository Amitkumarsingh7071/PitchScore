# PitchScore — Local Football Match Scorer & Career Tracker ⚽

**PitchScore** is a modern, full-stack web application for local football groups to record match events, maintain accurate career statistics, automatically calculate player performance ratings and Man of the Match (MOTM), and manage match room join codes.

---

## ✨ Features

- 🎯 **Source of Truth Event Engine**: Scores, player ratings, MOTM awards, and career statistics are never manually typed. They are dynamically calculated from logged match events (`Goal`, `Assist`, `Save`, `Tackle`, `Cards`, `Substitutions`).
- 🔑 **Match Join Code System**: Hosts create a match and receive a unique 6-character Match Code (e.g. `FC-9482`) that players can enter on `/join` or share via WhatsApp.
- 📱 **Mobile Live Scorer Room**: Single-tap mobile event logger for goal scorers, assisters, goalkeeper saves, and cards.
- ⭐ **Automated Player Ratings (1.0 - 10.0 Scale)**: Position-adjusted rating formula incorporating clean sheets, minutes played, and match outcomes.
- 🏆 **Group Leaderboards**: Ranked leaderboards for Golden Boot (Top Goals), Golden Glove (Top Saves), Top Assists, MOTM awards, and Average Rating.
- 🎨 **Clean Professional Light Theme**: Modern SaaS visual design built with React, Vite, Tailwind CSS, and Lucide icons.

---

## 🛠️ Stack & Architecture

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Recharts, React Router
- **Backend**: Node.js, Express.js, MongoDB (with MongoMemoryServer embedded fallback)
- **Auth**: JWT Authentication with bcrypt password hashing

---

## 🚀 How to Run Locally

### 1. Backend Server
```bash
cd backend
npm install
npm start
```
*Backend API runs on `http://localhost:5000`*

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 📤 How to Push to Your GitHub Repository

Follow these simple steps in your terminal to link and push **PitchScore** to your GitHub account:

### Step 1: Create a new repository on GitHub
1. Go to [GitHub New Repository](https://github.com/new).
2. Name your repository `PitchScore` (or `pitch-score`).
3. Leave "Initialize with README" **unchecked** (since we already have a git repo initialized).
4. Click **Create repository**.

### Step 2: Push your code to GitHub
Run the following commands in PowerShell inside `c:\Users\Amit Singh\Desktop\FootFriend`:

```bash
# Add your GitHub repository remote URL (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/PitchScore.git

# Set main as default branch
git branch -M main

# Push code to GitHub
git push -u origin main
```

---

## 🔑 Demo Accounts

- **Match Host**: `admin@footfriend.com` / `admin123`
- **Player Account**: `player@footfriend.com` / `player123`
