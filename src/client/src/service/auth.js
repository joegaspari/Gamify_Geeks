export default class AuthService {
    constructor(http, tokenStorage) {
        this.http = http;
        this.tokenStorage = tokenStorage;
    }

    async signup(signupInfo) {
        const { username, firstName, lastName, password, email, institutionCode, userRoleId, emailVerificationCode } = signupInfo;
        const data = await this.http.post(`/auth/signup?userRoleId=${userRoleId}`, {
            body: JSON.stringify({
                username,
                firstName,
                lastName,
                password,
                email,
                institutionCode,
                emailVerificationCode,
            }),
        });

        this.tokenStorage.saveToken(data.token);
        const user = { userId: data.userId, username: data.username, userRoleId: data.userRoleId };
        return user;
    }

    async login(username, password, email) {
        const authenticator = username ? username : email;
        const data = await this.http.post("/auth/login", {
            body: JSON.stringify({ authenticator, password }),
        });
        this.tokenStorage.saveToken(data.token);
        const user = { userId: data.userId, userRoleId: data.userRoleId };
        return user;
    }

    async me() {
        const token = this.tokenStorage.getToken();
        return this.http.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    getHeaderToken() {
        const token = this.tokenStorage.getToken();
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    async updateAccount(accountInfo) {
        const { username, firstName, lastName, email, usernameChanged, emailChanged, firstNameChanged, lastNameChanged, userTitle } = accountInfo;
        return this.http.put(`/profile/update`, {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                username,
                firstName,
                lastName,
                email,
                usernameChanged,
                emailChanged,
                firstNameChanged,
                lastNameChanged,
                userTitle,
            }),
        });
    }

    async logout() {
        this.tokenStorage.clearToken();
    }

    async sendVerification(email) {
        return this.http.post("/auth/emailVerification", {
            body: JSON.stringify({ email }),
        });
    }

    async deleteAccount() {
        const res = this.http.delete("/auth/account", {
            headers: this.getHeaderToken(),
        });
        this.tokenStorage.clearToken();
        return res;
    }

    async updatePassword(password, emailVerificationCode, email) {
        return this.http.put("/auth/password", {
            headers: this.getHeaderToken(),
            body: JSON.stringify({
                newPassword: password,
                emailVerificationCode,
                email,
            }),
        });
    }
}
