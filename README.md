# PIGMENT v6

**Evolutionary Art API \u00b7 Genetic Algorithms \u00b7 AI-Powered \u00b7 Self-Learning**

[Live Demo](https://pigment-org.github.io) \u00b7 [Documentation](https://pigment-org.github.io/docs) \u00b7 [Blog](https://pigment-org.github.io/blog) \u00b7 [Backend Repo](https://github.com/PIGMENT-ORG/PIGMENT-V6)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-222222?style=for-the-badge&logo=github)](https://pigment-org.github.io)
[![Render](https://img.shields.io/badge/Render-API-46E3B7?style=for-the-badge&logo=render)](https://pigment-api.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/PIGMENT-ORG/pigment-org.github.io/pulls)

---

## Overview

PIGMENT transforms any image into evolving artwork through genetic algorithms. Drop a target image, and the system iteratively mutates a population of polygons \u2014 scoring each generation against the original \u2014 until the evolved canvas converges toward a visual match.

The system is **self-learning**: every mutation outcome is recorded, and ML-optimized operator weights are derived from 171k+ training samples, producing an 8.1% measurable improvement over uniform random selection.

The frontend is pure HTML/CSS/JavaScript (no frameworks). The backend is a Python/FastAPI service deployed on Render. This repository contains the frontend and documentation site, which is hosted on GitHub Pages.

---

## Features

### Evolution Engine

- **9 mutation operators**: `scale`, `rotate`, `color`, `opacity`, `translate`, `reshape`, `spawn`, `merge`, `intelligent`
- **Edge-aware fitness**: 70% Sobel edge similarity + 30% RGB color similarity
- **Diff-aware mutation**: targets highest-error regions in each generation
- **Adaptive probabilities**: operator weights adjust based on tracked success rates
- **Self-healing**: weak polygon culling every 1,000 generations; hotspot spawning in error zones

### Self-Learning

- 8.1% improvement proven from initial 510-sample training run
- 171,381+ samples collected and growing
- Per-operator success rates updated after every mutation attempt
- `/v1/learning/weights` endpoint exposes ML-derived weights to the frontend in real time

### Kinship System

- Tracks parent \u2192 child \u2192 sibling \u2192 cousin relationships across artworks
- 16-dimensional perceptual feature vector per artwork (RGB means, entropy, hue spread, edge density, glitch factor, saturation variance, and more)
- Cosine similarity matching via FAISS vector search
- Thresholds: \u2265 0.82 \u2192 sibling \u00b7 \u2265 0.65 \u2192 cousin \u00b7 \u2265 0.45 \u2192 similar
- Full ancestry chain with per-generation fitness history

### AI Prompt Layer

- Translates natural language into structured mutation plans via Claude API
- Example: `"make it glitchy and neon"` \u2192 weighted operator selection with specific parameter targets
- 16 high-level mutation operations exposed to the prompt system
- Keyword fallback when the API is unavailable
- Mobile: double-tap canvas to open the prompt interface

### Real-Time Streaming

- WebSocket connection at `/ws/{user_id}`
- Live events: fitness milestones, generation count, operator stats, kinship updates
- Progress bar and fitness sparkline update per frame
- Error heatmap rendered on a second canvas overlay

### Interactive UI

| Feature | Description |
|---|---|
| Side-by-side canvas | Target vs evolved, synchronized zoom |
| Diff mode | Pixel-level difference visualization |
| Snapshot history | Save and restore any generation |
| Genome editor | View and edit `.pg` files in-browser |
| Live HUD | Fitness, generation, operator stats overlay |
| Keyboard shortcuts | Space, R, D, H, S, E, G (see below) |
| Mobile gestures | Swipeable drawer, double-tap prompt |

---

## Quick Start

### Use the Web App

```
https://pigment-org.github.io
```

1. Drag and drop any image onto the canvas (or paste with \u2318V / Ctrl+V)
2. Press **Space** to start evolving
3. Click **\u2197 Connect** in the API panel to enable cloud save and ML-optimized weights (optional)

### Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `R` | Reset to random polygons |
| `D` | Toggle diff overlay |
| `H` | Toggle HUD |
| `S` | Save snapshot |
| `E` | Export as PNG |
| `G` | Open genome viewer |

---

## How It Works

### Genome Format (`.pg`)

Artwork is stored as plain-text `.pg` (PIGMENT Genome) files. Each file describes a canvas, a color palette, and one or more polygon layers:

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

Genomes can be downloaded, edited by hand, and re-uploaded to resume or fork an evolution run.

### Fitness Calculation

```javascript
fitness = (edgeScore * 0.70) + (colorScore * 0.30);
```

Edge similarity is computed using Sobel operators on both the target and evolved canvas. Color similarity compares per-channel RGB histograms. Weighting edges more heavily prevents the optimizer from converging on blurry color-correct approximations.

### Evolution Loop

Each frame:

1. Generate error heatmap (per-pixel diff between target and evolved)
2. Select operator using ML-optimized weights (phase-dependent: explore / refine / polish)
3. Identify the worst-performing polygons in high-error zones
4. Apply the selected mutation with parameters sampled from the operator's distribution
5. Calculate new fitness
6. Accept or reject the mutation (hill-climbing)
7. Record success/failure for the operator
8. Every 1,000 generations: cull weak polygons, spawn new ones in error hotspots

### ML-Optimized Operator Weights

Derived from 171k+ recorded mutation outcomes across three evolution phases:

```javascript
const WEIGHTS = {
  explore: { scale: 0.25, translate: 0.15, color: 0.20,
             opacity: 0.12, rotate: 0.10, intelligent: 0.18 },
  refine:  { scale: 0.20, translate: 0.10, color: 0.25,
             opacity: 0.18, rotate: 0.10, intelligent: 0.17 },
  polish:  { scale: 0.15, translate: 0.05, color: 0.25,
             opacity: 0.20, rotate: 0.08, intelligent: 0.12 }
};
```

Operator success rates from the initial 510-sample training run:

| Operator | Success Rate |
|---|---|
| intelligent | 59% |
| color | 54% |
| scale | 51% |
| opacity | 46% |
| rotate | 41% |
| translate | 30% |

### Kinship Scoring

```
combined_similarity = visual_similarity (40%)
                    + generational_distance (30%)
                    + structural_similarity (30%)
```

---

## API Reference

The backend API is available at `https://pigment-api.onrender.com`.

> **Note:** The server is on Render's free tier and cold-starts after inactivity. The first request after a quiet period may take up to 60 seconds.

All endpoints require an `X-API-Key` header except `POST /v1/users`.

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/v1/users` | Create account and receive API key |
| `POST` | `/v1/auth` | Exchange API key for session token |
| `POST` | `/v1/works` | Upload a genome and create an artwork |
| `GET` | `/v1/works` | List the authenticated user's artworks |
| `GET` | `/v1/works/{id}` | Get a single artwork |
| `DELETE` | `/v1/works/{id}` | Delete an artwork |
| `POST` | `/v1/evolve` | Queue an evolution job |
| `GET` | `/v1/evolve/{job_id}` | Poll job status and current fitness |
| `POST` | `/v1/kinship` | Get kinship relationships for an artwork |
| `POST` | `/v1/search/similar` | Find visually similar artworks |
| `GET` | `/v1/ancestry/{id}` | Get full ancestry chain |
| `POST` | `/v1/prompt` | Translate a text prompt into a mutation plan |
| `POST` | `/v1/training` | Submit a mutation outcome as training data |
| `GET` | `/v1/training/stats` | Operator statistics and success rates |
| `GET` | `/v1/export/training` | Export training data as CSV |
| `GET` | `/v1/learning/weights` | Get current ML-derived operator weights |
| `GET` | `/v1/gallery` | Browse public artworks |
| `WebSocket` | `/ws/{user_id}` | Real-time evolution and kinship events |

### JavaScript Client

```javascript
import { PIGMENTClient } from 'https://pigment-org.github.io/js/api-client.js';

const client = new PIGMENTClient('https://pigment-api.onrender.com');

// Create an account (one-time)
const user = await client.createUser('you@example.com');
// \u2192 { id, api_key, plan }

// Upload a genome and start evolving
const work = await client.createWork('My First Artwork', genomeContent);
const job  = await client.evolve(work.id, { generations: 1000, prompt: 'make it glitchy' });

// Poll until complete
const result = await client.waitForJob(job.job_id);

// Find related artworks
const kinship = await client.getKinship(work.id);

// Retrieve ML-optimized weights
const weights = await client.getLearningWeights();
```

### Export Training Data

```bash
curl -H "X-API-Key: your_api_key" \
     https://pigment-api.onrender.com/v1/export/training \
     --output pigment_training_data.csv
```

---

## Project Structure

```
pigment-org.github.io/
\u251c\u2500\u2500 index.html                     # Main app (pigment engine)
\u251c\u2500\u2500 pigment-engine.html            # Standalone demo
\u251c\u2500\u2500 css/
\u2502   \u251c\u2500\u2500 main.css                   # Shared design system and layout
\u2502   \u251c\u2500\u2500 docs.css                   # Documentation-specific styles
\u2502   \u2514\u2500\u2500 blog.css                   # Blog article styles
\u251c\u2500\u2500 js/
\u2502   \u251c\u2500\u2500 api-client.js              # Official JS API client
\u2502   \u251c\u2500\u2500 kinship-viz.js             # Family tree visualization
\u2502   \u2514\u2500\u2500 ui.js                      # Shared UI utilities
\u251c\u2500\u2500 docs/
\u2502   \u251c\u2500\u2500 index.html                 # Documentation hub
\u2502   \u251c\u2500\u2500 getting-started.html       # Quick start guide
\u2502   \u251c\u2500\u2500 authentication.html        # API key reference
\u2502   \u251c\u2500\u2500 rate-limits.html           # Rate limit tiers
\u2502   \u251c\u2500\u2500 errors.html                # Error code reference
\u2502   \u251c\u2500\u2500 faq.html                   # Frequently asked questions
\u2502   \u251c\u2500\u2500 catalog.html               # Genome catalog
\u2502   \u251c\u2500\u2500 endpoints/                 # Per-endpoint reference pages
\u2502   \u2502   \u251c\u2500\u2500 works.html
\u2502   \u2502   \u251c\u2500\u2500 evolve.html
\u2502   \u2502   \u251c\u2500\u2500 kinship.html
\u2502   \u2502   \u251c\u2500\u2500 prompt.html
\u2502   \u2502   \u2514\u2500\u2500 gallery.html
\u2502   \u2514\u2500\u2500 example/                   # Full integration examples
\u2502       \u251c\u2500\u2500 curl.html
\u2502       \u251c\u2500\u2500 javascript.html
\u2502       \u2514\u2500\u2500 python.html
\u251c\u2500\u2500 blog/
\u2502   \u251c\u2500\u2500 index.html                 # Blog index
\u2502   \u251c\u2500\u2500 genetic-algorithms.html    # How genetic algorithms create art
\u2502   \u251c\u2500\u2500 kinship-explained.html     # The kinship system in depth
\u2502   \u2514\u2500\u2500 ai-prompts.html            # AI prompts and mutation plans
\u2514\u2500\u2500 showcase/
    \u2514\u2500\u2500 index.html                 # Community gallery
```

---

## Development

### Prerequisites

- Any modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- A static file server for local development

### Local Setup

```bash
git clone https://github.com/PIGMENT-ORG/pigment-org.github.io.git
cd pigment-org.github.io

# Start a local server
python3 -m http.server 8080
# or: npx serve

# Open http://localhost:8080
```

No build step is required. The site is plain HTML, CSS, and JavaScript.

### Deployment