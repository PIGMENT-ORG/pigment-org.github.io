<br>

<div align="center">
  <!-- Enhanced Badges with better visual grouping -->
  <a href="https://pigment-org.github.io"><img src="https://img.shields.io/badge/Live%20Demo-000000?style=for-the-badge&logo=github&logoColor=white" alt="Live Demo"></a>
  <a href="https://pigment-api.onrender.com"><img src="https://img.shields.io/badge/API%20Endpoint-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render API"></a>
  <a href="#"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=open-source-initiative&logoColor=white" alt="MIT License"></a>
  <a href="#"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge&logo=git&logoColor=white" alt="PRs Welcome"></a>

  <br>
  <br>

  <h1>🎨 PIGMENT v6 — Developer Hub</h1>
  <h3>Evolutionary Art Engine · Genetic Algorithms · Self-Learning API</h3>

  <br>

Quick Links:
Live Demo •
Documentation •
API Reference •
Backend Repo

  <br>
</div>

---

👋 For Developers

This repository hosts the frontend and documentation for PIGMENT. If you're looking for the backend API service, visit the PIGMENT-V6 repository.

Who is this for?

· API Consumers: Integrate evolutionary art into your own apps
· Frontend Contributors: Improve the UI/UX or documentation
· Self-Hosters: Run your own instance of the PIGMENT ecosystem

---

✨ What is PIGMENT?

PIGMENT transforms any image into evolving artwork through genetic algorithms. Drop a target image, and the system iteratively mutates a population of polygons—scoring each generation against the original—until the evolved canvas converges toward a visual match.

The system is self-learning: every mutation outcome is recorded, and ML-optimized operator weights are derived from 171k+ training samples, producing an 8.1% measurable improvement over uniform random selection.

💡 See it in action: Visit the live demo for a visual introduction and interactive playground.

---

🚀 Quick Start (API)

Get started with the PIGMENT API in under 60 seconds.

1. Create an Account

```bash
curl -X POST https://pigment-api.onrender.com/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email": "your.email@example.com"}'
```

Response:

```json
{
  "id": "usr_abc123",
  "api_key": "pig_live_xyz456",
  "plan": "free"
}
```

2. Upload a Genome

```javascript
import { PIGMENTClient } from 'https://pigment-org.github.io/js/api-client.js';

const client = new PIGMENTClient('https://pigment-api.onrender.com', 'your_api_key');

// Upload a .pg file
const work = await client.createWork('My First Artwork', genomeContent);
console.log(work.id); // → "wrk_789def"
```

3. Start Evolving

```javascript
// Queue an evolution job
const job = await client.evolve(work.id, {
  generations: 1000,
  prompt: 'make it glitchy and neon'
});

// Poll for completion
const result = await client.waitForJob(job.job_id);
console.log(`Final fitness: ${result.fitness}%`);
```

4. Find Related Artworks

```javascript
const kinship = await client.getKinship(work.id);
console.log(kinship.siblings);  // → [ ... ]
console.log(kinship.cousins);   // → [ ... ]
```

📚 Full documentation: pigment-org.github.io/docs

---

🧠 Core Concepts

Genome Format (.pg)

Artwork is stored as plain-text .pg (PIGMENT Genome) files. Each file describes a canvas, a color palette, and polygon layers:

```
-- PIGMENT Genome v6.0.0
-- @fitness 87.3
-- @generations 1842

canvas { width: 400 height: 400 background: #0a0a0a }

palette {
  color_0: #ff3366
  color_1: #33ff99
}

layer evolved {
  zone poly_0 {
    color: palette.color_0
    opacity: 0.8
    points: 120,140 180,120 160,200
  }
}
```

Features:

· ✅ Human-readable and editable
· ✅ Supports multiple layers
· ✅ Stores evolution metadata (fitness, generation count)
· ✅ Can be downloaded, edited, and re-uploaded

Evolution Loop

Each frame:

1. Generate error heatmap (per-pixel diff between target and evolved)
2. Select operator using ML-optimized weights (phase-dependent)
3. Identify worst-performing polygons in high-error zones
4. Apply mutation with parameters sampled from operator distribution
5. Calculate new fitness
6. Accept or reject (hill-climbing)
7. Record success/failure for operator
8. Every 1,000 generations: cull weak polygons, spawn new ones in error hotspots

Fitness Calculation

```javascript
fitness = (edgeScore * 0.70) + (colorScore * 0.30);
```

Edge similarity uses Sobel operators; color similarity compares per-channel RGB histograms. Weighting edges more heavily prevents convergence on blurry color-correct approximations.

ML-Optimized Weights

Derived from 171k+ recorded mutation outcomes:

Phase Top Operators Strategy
Explore scale (0.25), color (0.20), intelligent (0.18) Broad search
Refine color (0.25), scale (0.20), opacity (0.18) Fine-tuning
Polish color (0.25), opacity (0.20), scale (0.15) Final touches

Access current weights:

```bash
curl -H "X-API-Key: your_api_key" \
     https://pigment-api.onrender.com/v1/learning/weights
```

---

🔧 Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│    Backend      │────▶│   ML Pipeline   │
│  GitHub Pages   │     │   Render/FastAPI│     │   Training Data │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                        │
        ▼                       ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Live Demo      │     │  Evolution API  │     │  FAISS Vector   │
│  Documentation  │     │  WebSockets     │     │  Search (Kinship)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

Tech Stack

Component Technology Deployment
Frontend HTML/CSS/JavaScript (no frameworks) GitHub Pages
Backend Python/FastAPI Render
ML/Vector FAISS, scikit-learn Render (integrated)
Database PostgreSQL Render Managed
Real-time WebSockets (FastAPI + Redis) Render

---

📁 Repository Structure

```
pigment-org.github.io/
├── index.html                 # Main app (pigment engine)
├── pigment-engine.html        # Standalone demo
├── css/
│   ├── main.css               # Shared design system
│   ├── docs.css               # Documentation styles
│   └── blog.css               # Blog article styles
├── js/
│   ├── api-client.js          # Official JS API client
│   ├── kinship-viz.js         # Family tree visualization
│   └── ui.js                  # Shared UI utilities
├── docs/
│   ├── index.html             # Documentation hub
│   ├── getting-started.html   # Quick start guide
│   ├── authentication.html    # API key reference
│   ├── rate-limits.html       # Rate limit tiers
│   ├── errors.html            # Error code reference
│   ├── faq.html               # Frequently asked questions
│   ├── catalog.html           # Genome catalog
│   └── endpoints/              # Per-endpoint reference
│       ├── works.html
│       ├── evolve.html
│       ├── kinship.html
│       ├── prompt.html
│       └── gallery.html
├── blog/
│   ├── index.html
│   ├── genetic-algorithms.html
│   ├── kinship-explained.html
│   └── ai-prompts.html
└── showcase/
    └── index.html             # Community gallery
```

---

🛠️ Local Development

Prerequisites

· Any modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
· Python 3.x or Node.js for local server

Setup

```bash
git clone https://github.com/PIGMENT-ORG/pigment-org.github.io.git
cd pigment-org.github.io

# Start a local server
python3 -m http.server 8080
# or: npx serve

# Open http://localhost:8080
```

No build step required. The site is pure HTML/CSS/JavaScript.

Making Changes

· CSS: Edit files in /css — changes apply immediately
· JavaScript: Edit files in /js — refresh to see updates
· Documentation: HTML files in /docs are fully static

Testing API Integration Locally

If you're also running the backend locally:

```javascript
const client = new PIGMENTClient('http://localhost:5000', 'test_api_key');
```

---

📊 API Reference Summary

Base URL: https://pigment-api.onrender.com

Key Endpoints

Method Endpoint Description
POST /v1/users Create account + get API key
POST /v1/works Upload a genome
GET /v1/works List your artworks
POST /v1/evolve Queue evolution job
GET /v1/evolve/{job_id} Poll job status
POST /v1/kinship Get artwork relationships
POST /v1/prompt Translate text → mutation plan
GET /v1/learning/weights Get ML-optimized weights
WebSocket /ws/{user_id} Real-time updates

Rate Limits

Plan Requests/min Concurrent Jobs
Free 30 1
Pro 120 5
Enterprise Custom Custom

📖 Full API docs: pigment-org.github.io/docs/endpoints

---

🤝 Contributing

We welcome contributions! Whether it's bug fixes, documentation improvements, or new features.

Ways to Contribute

· Report bugs: Open an issue with detailed reproduction steps
· Improve docs: Fix typos, clarify explanations, add examples
· Enhance UI: Improve accessibility, mobile responsiveness, or visual design
· Add features: Implement new visualization tools or API clients

Pull Request Process

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-idea)
3. Make your changes
4. Test locally (run the server and check all affected pages)
5. Commit with clear messages (git commit -m 'Add amazing feature')
6. Push to your fork (git push origin feature/amazing-idea)
7. Open a Pull Request

Guidelines

· Keep JavaScript framework-free (no React, Vue, etc.)
· Maintain backward compatibility with existing APIs
· Update documentation for any user-facing changes
· Follow existing code style (2-space indentation, descriptive names)

---

📝 License

MIT © PIGMENT-ORG. See LICENSE for details.

---

🙋 Support

Channel Purpose
GitHub Issues Bug reports, feature requests
Documentation API reference, guides
Live Demo Interactive playground
Backend Repo Core engine issues

---

<br>
<div align="center">
  <b>Ready to evolve?</b><br>
  <a href="https://pigment-api.onrender.com">Get your API key</a> →
  <a href="https://pigment-org.github.io/docs">Read the docs</a> →
  <a href="https://pigment-org.github.io">Start building</a>
  <br><br>
  <img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F%20and%20genetic%20algorithms-ff69b4?style=flat-square" alt="Made with love">
</div>