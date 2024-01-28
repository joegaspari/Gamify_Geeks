const TOKEN = 'token';
const USERROLEID ='userRoleId';
export default class TokenStorage {
  saveToken(token) {
    localStorage.setItem(TOKEN, token);
  }

  saveUserRoleId(userRoleId) {
    localStorage.setItem(USERROLEID, userRoleId);
  }

  getToken() {
    return localStorage.getItem(TOKEN);
  }

  getRoleId() {
    return localStorage.getItem(USERROLEID);
  }

  clearToken() {
    localStorage.clear();
  }
}
