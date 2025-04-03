class ApiClients {
  constructor(baseUrl = "http://localhost:3000/api/sample") {
    this.baseUrl = baseUrl;
  }

  async request({ endpoint, method = "GET", body = null, headers = {} }) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json", ...headers },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      return response.json();
    } catch (error) {
      console.error(`Error in ${method} ${endpoint}`, error);
      alert(error.message);
      throw error;
    }
  }

  get(endpoint) {
    return this.request({ endpoint });
  }

  post(endpoint, body) {
    return this.request({ endpoint, method: "POST", body });
  }

  put(endpoint, body) {
    return this.request({ endpoint, method: "PUT", body });
  }

  delete(endpoint) {
    return this.request({ endpoint, method: "DELETE" });
  }
}

export default new ApiClients();