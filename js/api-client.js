// PIGMENT v6 - Official API Client
// Use in your own projects: 
// <script src="https://pigment-org.github.io/js/api-client.js"></script>

class PIGMENTClient {
  constructor(baseURL = 'https://pigment-api.onrender.com', apiKey = null) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.currentWorkId = null;
  }

  // Headers with auth
  _headers() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }
    return headers;
  }

  // Handle response
  async _handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // ========== USER MANAGEMENT ==========

  async createUser(email, plan = 'free') {
    const response = await fetch(`${this.baseURL}/v1/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, plan })
    });
    const data = await this._handleResponse(response);
    if (data.api_key) {
      this.apiKey = data.api_key;
    }
    return data;
  }

  async authenticate(apiKey) {
    const response = await fetch(`${this.baseURL}/v1/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey })
    });
    const data = await this._handleResponse(response);
    if (data.token) {
      this.apiKey = apiKey;
    }
    return data;
  }

  // ========== WORKS ==========

  async createWork(title, content, tags = [], parentId = null) {
    const response = await fetch(`${this.baseURL}/v1/works`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({
        title,
        content,
        tags,
        parent_id: parentId
      })
    });
    const data = await this._handleResponse(response);
    if (data.id) {
      this.currentWorkId = data.id;
    }
    return data;
  }

  async listWorks(limit = 20, offset = 0, style = null) {
    let url = `${this.baseURL}/v1/works?limit=${limit}&offset=${offset}`;
    if (style) url += `&style=${style}`;
    
    const response = await fetch(url, {
      headers: this._headers()
    });
    return this._handleResponse(response);
  }

  async getWork(workId) {
    const response = await fetch(`${this.baseURL}/v1/works/${workId}`, {
      headers: this._headers()
    });
    return this._handleResponse(response);
  }

  async deleteWork(workId) {
    const response = await fetch(`${this.baseURL}/v1/works/${workId}`, {
      method: 'DELETE',
      headers: this._headers()
    });
    return this._handleResponse(response);
  }

  // ========== EVOLUTION ==========

  async evolve(workId, steps = 500, mutationRate = 1.0) {
    const response = await fetch(`${this.baseURL}/v1/evolve`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({
        work_id: workId,
        steps,
        mutation_rate: mutationRate
      })
    });
    const data = await this._handleResponse(response);
    if (data.child_id) {
      this.currentWorkId = data.child_id;
    }
    return data;
  }

  // ========== KINSHIP ==========

  async getKinship(workId) {
    const response = await fetch(`${this.baseURL}/v1/kinship`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({ work_id: workId })
    });
    return this._handleResponse(response);
  }

  async searchSimilar(workId, limit = 10) {
    const response = await fetch(`${this.baseURL}/v1/search/similar`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({ work_id: workId, limit })
    });
    return this._handleResponse(response);
  }

  async searchByFeatures(features, limit = 10) {
    const response = await fetch(`${this.baseURL}/v1/search/similar`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({ features, limit })
    });
    return this._handleResponse(response);
  }

  // ========== ANCESTRY ==========

  async getAncestry(workId) {
    const response = await fetch(`${this.baseURL}/v1/ancestry/${workId}`, {
      headers: this._headers()
    });
    return this._handleResponse(response);
  }

  // ========== GALLERY ==========

  async getGallery(limit = 24, offset = 0) {
    const response = await fetch(`${this.baseURL}/v1/gallery?limit=${limit}&offset=${offset}`, {
      headers: this._headers()
    });
    return this._handleResponse(response);
  }

  // ========== AI PROMPTS ==========

  async applyPrompt(workId, prompt) {
    const response = await fetch(`${this.baseURL}/v1/prompt`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({ work_id: workId, prompt })
    });
    const data = await this._handleResponse(response);
    if (data.child_id) {
      this.currentWorkId = data.child_id;
    }
    return data;
  }

  // ========== TRAINING ==========

  async postTraining(records) {
    const response = await fetch(`${this.baseURL}/v1/training`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify(records)
    });
    return this._handleResponse(response);
  }

  // ========== HEALTH ==========

  async health() {
    const response = await fetch(`${this.baseURL}/health`);
    return this._handleResponse(response);
  }

  // ========== WEBSOCKET ==========

  connectWebSocket(userId, callbacks = {}) {
    const wsBase = this.baseURL.replace('http', 'ws');
    const ws = new WebSocket(`${wsBase}/ws/${userId}`);
    
    ws.onopen = () => {
      if (callbacks.onOpen) callbacks.onOpen();
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'evolution_tick':
          if (callbacks.onTick) callbacks.onTick(data);
          break;
        case 'evolution_done':
          if (callbacks.onDone) callbacks.onDone(data);
          break;
        case 'kinship_update':
          if (callbacks.onKinship) callbacks.onKinship(data);
          break;
        case 'fitness_milestone':
          if (callbacks.onMilestone) callbacks.onMilestone(data);
          break;
        case 'error':
          if (callbacks.onError) callbacks.onError(data);
          break;
      }
    };
    
    ws.onclose = () => {
      if (callbacks.onClose) callbacks.onClose();
    };
    
    return ws;
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PIGMENTClient;
}

// Usage example:
/*
const client = new PIGMENTClient('https://pigment-api.onrender.com');

// Get a key
await client.createUser('me@example.com');

// Create artwork
const work = await client.createWork('My Art', '-- PIGMENT Genome...');

// Evolve it
const result = await client.evolve(work.id, 1000);

// Get family tree
const kinship = await client.getKinship(work.id);

// AI prompt
const prompt = await client.applyPrompt(work.id, 'make it glitchy');
*/