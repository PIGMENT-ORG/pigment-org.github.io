# PIGMENT v6 - AI Art Evolution Platform 🎨

Live at: [https://pigment-org.github.io](https://pigment-org.github.io)

PIGMENT is an AI-powered living art platform that evolves images using genetic algorithms. Drop any image and watch it transform through generations of mutations!

## ✨ Features

- **Real-time Evolution** - Watch art evolve before your eyes
- **Genetic Algorithms** - 6 mutation operators (scale, rotate, color, translate, opacity, intelligent)
- **Kinship Tracking** - See family trees of evolved artworks
- **AI-Powered Prompts** - Type "make it glitchy" and watch it transform
- **Genome Editor** - View and edit the underlying .pg genome
- **Snapshot History** - Save and restore favorite generations
- **Diff Mode** - Visualize differences between target and evolved
- **Server Sync** - Save works to cloud database (kinship, evolution tracking)

## 🚀 Quick Start

1. Open [https://pigment-org.github.io](https://pigment-org.github.io)
2. Drop any image onto the canvas
3. Press **PLAY** to start evolving
4. Click **↗** to connect to the backend API
5. Save your favorites with **💾 Save**

## 🧬 How It Works

- Each artwork is represented as a **genome** of colored polygons
- Evolution applies mutations to improve **fitness** (similarity to target)
- The system learns which operators work best in different contexts
- Kinship relationships track parent/child/sibling relationships

## 🔌 API Connection

The frontend connects to a backend API at `https://pigment-api.onrender.com` for:
- Persistent storage of artworks
- Evolution tracking
- Kinship relationships
- Training data collection

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play/Pause |
| R | Reset |
| D | Toggle Diff |
| S | Snapshot |
| E | Export |
| G | Open Genome Viewer |

## 📱 Mobile Support

Fully responsive with touch-optimized sidebar and drag controls.

## 🛠️ Built With

- Pure HTML/CSS/JavaScript (no frameworks)
- Canvas API for rendering
- WebSocket for real-time updates
- GitHub Pages for hosting

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**PIGMENT v6** - Created by [PIGMENT-ORG](https://github.com/PIGMENT-ORG)