export default class HttpClient {
  constructor(baseURL, authErrorEventBus) {
    this.baseURL = baseURL;
    this.authErrorEventBus = authErrorEventBus;
  }

  async get(url, options, stream = false) {
    return await this.fetch(url, options, 'GET', stream);
  }

  async post(url, options, stream = false) {
    return await this.fetch(url, options, 'POST', stream);
  }

  async put(url, options, stream = false) {
    return await this.fetch(url, options, 'PUT', stream);
  }

  async delete(url, options) {
    return await this.fetch(url, options, 'DELETE');
  }

  async fetch(url, options, method, stream) {
    const headers = options ? options.headers : null
    const res = await fetch(`${this.baseURL}${url}`, {
      method,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    if (stream) {
      return res.body.getReader()
    }

    let data;

    try {
      data = await res.json();
    } catch (error) {
      console.error(error);
    }

    if (res.status > 299 || res.status < 200) {

      const message = data && data.message
        ? (typeof data.message === 'object' ? JSON.stringify(data.message) : data.message)
        : data ? JSON.stringify(data) : 'Something went wrong!';


      const error = new Error(message);
      if (res.status === 401) {
        this.authErrorEventBus.notify(error);
      }
      throw error;
    }
    return data;
  }


}
