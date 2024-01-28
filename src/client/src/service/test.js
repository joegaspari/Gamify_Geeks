export default class DataService {
  constructor(http) {
    this.http = http;
    // this.tokenStorage = tokenStorage;
  }

  async getTest() {
    return this.http.fetch('/', {
      method: 'GET',
      // If it needs authorization, use getHeaders()
      // headers: this.getHeaders(),
    });
  }

  // getHeaders() {
  //     const token = this.tokenStorage.getToken();
  //     return {
  //         Authorization: `Bearer ${token}`,
  //     };
  // }
}
