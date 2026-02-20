# 🎨 PIGMENT v6 - AI Art Evolution Platform

<div align="center">
  <img src="assets/images/pigment-banner.png" alt="PIGMENT Banner" width="600">
  <br>
  <strong>Evolutionary Art API · Genetic Algorithms · AI-Powered</strong>
</div>

<br>

<div align="center">
  <a href="https://pigment-org.github.io">🌐 Live Demo</a> •
  <a href="https://pigment-org.github.io/docs">📚 Documentation</a> •
  <a href="https://pigment-org.github.io/blog">📝 Blog</a> •
  <a href="https://github.com/PIGMENT-ORG/PIGMENT-V6">💻 Backend Repo</a>
</div>

<br>

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-222222?style=for-the-badge&logo=github)](https://pigment-org.github.io)
[![Render](https://img.shields.io/badge/Render-API-46E3B7?style=for-the-badge&logo=render)](https://pigment-api.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/PIGMENT-ORG/pigment-org.github.io/pulls)

---

## ✨ Overview

PIGMENT is a **production-ready AI art evolution platform** that transforms images through genetic algorithms. Drop any image and watch it evolve through generations of mutations in real-time.

Built with **pure HTML/CSS/JavaScript** (no frameworks) and powered by a [FastAPI backend](https://github.com/PIGMENT-ORG/PIGMENT-V6), PIGMENT demonstrates how evolutionary computing can create stunning visual art.

---

## 🎯 Key Features

### 🧬 **Genetic Evolution Engine**
- **6 mutation operators**: scale, rotate, color shift, translate, opacity, intelligent
- Adaptive operator probabilities based on success rates
- Real-time fitness calculation against target image
- Resolution scaling for performance optimization

### 🔗 **Kinship System**
- Track parent/child/sibling relationships between artworks
- 16-dimensional feature vector extraction
- Cosine similarity matching
- Visual family tree generation

### 🤖 **AI Integration**
- Natural language prompts via Claude API
- "make it glitchy" → structured mutation plan
- 14 high-level mutation operations
- Local keyword fallback when offline

### 📡 **Real-time Updates**
- WebSocket streaming of evolution progress
- Live fitness milestone notifications
- Job queue status with progress bars
- Kinship updates pushed to clients

### 🎮 **Interactive UI**
- **Side-by-side canvas**: Target vs Evolved
- **Diff mode**: Visualize pixel differences
- **Snapshot history**: Save/restore generations
- **Genome editor**: View/edit .pg files
- **Keyboard shortcuts**: Space, R, D, S, E, G

### 📱 **Mobile Optimized**
- Touch-friendly controls
- Swipeable sidebar
- Responsive canvas scaling
- Gesture support (drag to close)

---

## 🚀 Quick Start

### 1️⃣ Open the App
```bash
# Just visit:
https://pigment-org.github.io
```

2️⃣ Load an Image

· Drag & drop any image onto the canvas
· Or paste from clipboard (⌘V / Ctrl+V)
· Or click "Browse files" to select

3️⃣ Start Evolving

```bash
Press PLAY (or Spacebar) → Watch it transform!
```

4️⃣ Connect to Backend (Optional)

```bash
Click the ↗ button in API CONNECT panel
# Auto-creates account, enables cloud features:
# • Save artworks to database
# • Server-side evolution (faster)
# • Kinship tracking
# • Training data collection
```

---

🎮 Keyboard Shortcuts

Key Action Description
Space Play/Pause Start/stop evolution
R Reset Reset to initial random polygons
D Toggle Diff Show/hide difference overlay
S Snapshot Save current generation
E Export Download evolved image as PNG
G Viewer Open genome viewer modal

---

🧠 How It Works

1. Genome Representation

Each artwork is stored as a .pg (PIGMENT Genome) file:

```
-- @fitness 87.3
-- @generation 1842

canvas { width: 400 height: 400 }

palette {
  c0: #ff3366
  c1: #33ff99
}

layer evolved {
  zone poly_0 {
    color: palette.c0
    opacity: 0.8
    points: 120,140 180,120 160,200
  }
}
```

2. Feature Extraction

16 perceptual features per artwork:

· RGB means & standard deviations (6)
· Luminance contrast (1)
· Color entropy (1)
· Polygon count (1)
· Average opacity (1)
· Average points per polygon (1)
· Hue spread (1)
· Glitch factor (1)
· Organic factor (1)
· Void factor (1)
· Fitness proxy (1)

3. Evolution Process

```javascript
// Every frame, 50-300 mutations happen
1. Select operator (weighted by success rate)
2. Choose random polygon
3. Apply mutation
4. Calculate new fitness
5. Keep if improved, revert if worse
6. Update operator statistics
```

4. Kinship Calculation

```
visual_similarity (40%) + generational_distance (30%) + structural_similarity (30%)
= combined_similarity
```

Thresholds:

· ≥0.82 → sibling
· ≥0.65 → cousin
· ≥0.45 → similar

---

🔌 API Integration

The frontend connects to the PIGMENT backend API at https://pigment-api.onrender.com

Available Endpoints:

Method Endpoint Description
POST /v1/users Create user (get API key)
POST /v1/auth Authenticate (get token)
POST /v1/works Create artwork
GET /v1/works List user's works
GET /v1/works/{id} Get single work
DELETE /v1/works/{id} Delete work
POST /v1/evolve Queue evolution job
POST /v1/kinship Get kinship relationships
POST /v1/search/similar Find similar works
GET /v1/ancestry/{id} Get full ancestry
POST /v1/prompt Apply AI prompt
POST /v1/training Ingest training data
GET /v1/gallery Public gallery
WebSocket /ws/{user_id} Real-time updates

Using the JavaScript Client:

```javascript
import { PIGMENTClient } from 'https://pigment-org.github.io/js/api-client.js';

const client = new PIGMENTClient('https://pigment-api.onrender.com');
await client.createUser('me@example.com');

const work = await client.createWork('My Art', genomeContent);
const evolved = await client.evolve(work.id, 1000);
const kinship = await client.getKinship(work.id);
```

---

📁 Project Structure

```
pigment-org.github.io/
├── index.html                    # Marketing homepage
├── pigment-engine.html           # Main app
├── docs/                         # Documentation
│   ├── index.html                # Docs hub
│   ├── getting-started.html      # Quick start
│   ├── authentication.html       # API keys
│   └── endpoints/                 # Endpoint docs
├── blog/                          # Educational content
│   ├── index.html                # Blog hub
│   ├── genetic-algorithms.html   # GA deep dive
│   └── kinship-explained.html    # Kinship system
├── showcase/                      # Gallery
│   └── index.html                # Art showcase
├── css/                           # Styles
│   ├── main.css                  # Shared styles
│   ├── docs.css                  # Docs styles
│   └── blog.css                  # Blog styles
├── js/                            # JavaScript
│   ├── api-client.js             # Official API client
│   └── kinship-viz.js            # Family tree visualizer
└── assets/                        # Images & diagrams
    ├── images/                    # Static images
    └── diagrams/                  # Architecture diagrams
```

---

🛠️ Development

Prerequisites

· Modern browser (Chrome, Firefox, Safari, Edge)
· Local web server (optional):
  ```bash
  python3 -m http.server 8080
  # or
  npx serve
  ```

Local Development

```bash
# Clone the repository
git clone https://github.com/PIGMENT-ORG/pigment-org.github.io.git
cd pigment-org.github.io

# Make changes
# Test locally with any static server
python3 -m http.server 8080
# Open http://localhost:8080
```

Building

No build step required! Pure HTML/CSS/JavaScript.

Deployment

```bash
# Push to main branch
git add .
git commit -m "Update site"
git push origin main

# GitHub Pages auto-deploys 🚀
```

---

🧪 Testing

Browser Compatibility

· ✅ Chrome 90+
· ✅ Firefox 88+
· ✅ Safari 14+
· ✅ Edge 90+
· ✅ Mobile Safari/iOS
· ✅ Chrome Android

Responsive Breakpoints

Device Width Behavior
Desktop 1024px Side-by-side layout
Tablet 768-1024px Stacked layout
Mobile <768px Collapsible sidebar
Small Mobile <480px Single column

---

🤝 Contributing

We love contributions! Here's how to help:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing
   ```
5. Open a Pull Request

Guidelines

· Keep code simple and readable
· Test on multiple screen sizes
· Follow existing style patterns
· Add comments for complex logic

---

📊 Stats

Metric Value
Training Samples 171,381+
Q-States 14
API Endpoints 15+
Mutation Operators 6
File Size < 500KB (gzipped)
Lighthouse Score 95+

---

📄 License

MIT License - see LICENSE file

```
Copyright (c) 2026 PIGMENT-ORG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

🙏 Acknowledgments

· FastAPI - Backend framework
· FAISS - Similarity search
· Claude API - Natural language understanding
· Render - Free tier hosting
· GitHub Pages - Frontend hosting
· All contributors - You rock!

---

📬 Contact

· Website: pigment-org.github.io
· GitHub: @PIGMENT-ORG
· Twitter: @pigment_ai
· Email: pigment@pigment.dev

---

<div align="center">
  <sub>Built with ❤️ by the PIGMENT Team</sub>
  <br>
  <sub>⭐ Star us on GitHub — it motivates us a lot!</sub>
</div>
```

---