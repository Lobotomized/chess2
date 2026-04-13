// Frontend Authentication Helper

const Auth = {
    getToken() {
        return localStorage.getItem('chess2_token');
    },

    setToken(token) {
        localStorage.setItem('chess2_token', token);
    },

    clearToken() {
        localStorage.removeItem('chess2_token');
    },

    async register(email, username, password, repeatPassword) {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password, repeatPassword })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        this.setToken(data.token);
        return data;
    },

    async login(email, password) {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        this.setToken(data.token);
        return data;
    },

    getAuthHeaders() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    ensureAuthenticated() {
        if (!this.getToken()) {
            this.showAuthModal();
            return false;
        }
        return true;
    },

    showAuthModal(mode = 'login') {
        if (document.getElementById('authModal')) {
            this.closeAuthModal();
        }

        const isLogin = mode === 'login';

        const loginForm = `
            <input type="email" id="authEmail" placeholder="Email" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 2px solid #b58863; border-radius: 4px; box-sizing: border-box;">
            <input type="password" id="authPassword" placeholder="Password" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 2px solid #b58863; border-radius: 4px; box-sizing: border-box;">
            <button onclick="Auth.handleLogin()" style="width: 100%; padding: 10px; background: #2e2e2e; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 10px; font-weight: bold;">Login</button>
            <p style="font-size: 14px; color: #2e2e2e;">Don't have an account? <a href="#" onclick="event.preventDefault(); Auth.showAuthModal('register')" style="color: #829769; font-weight: bold;">Register here</a></p>
        `;

        const registerForm = `
            <input type="text" id="authUsername" placeholder="Username" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 2px solid #b58863; border-radius: 4px; box-sizing: border-box;">
            <input type="email" id="authEmail" placeholder="Email" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 2px solid #b58863; border-radius: 4px; box-sizing: border-box;">
            <input type="password" id="authPassword" placeholder="Password" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 2px solid #b58863; border-radius: 4px; box-sizing: border-box;">
            <input type="password" id="authRepeatPassword" placeholder="Repeat Password" style="width: 100%; padding: 10px; margin-bottom: 20px; border: 2px solid #b58863; border-radius: 4px; box-sizing: border-box;">
            <button onclick="Auth.handleRegister()" style="width: 100%; padding: 10px; background: #829769; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 10px; font-weight: bold;">Register</button>
            <p style="font-size: 14px; color: #2e2e2e;">Already have an account? <a href="#" onclick="event.preventDefault(); Auth.showAuthModal('login')" style="color: #829769; font-weight: bold;">Login here</a></p>
        `;

        const modalHtml = `
        <div id="authModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 10000;">
            <div style="background: #f0d9b5; padding: 30px; border-radius: 8px; border: 4px solid #2e2e2e; width: 300px; text-align: center;">
                <h2 style="margin-top: 0; color: #2e2e2e;">${isLogin ? 'Login' : 'Register'}</h2>
                <p style="color: #2e2e2e; font-size: 14px; margin-bottom: 20px;">You need to log in to create or view your custom maps.</p>
                <div id="authError" style="color: #e53e3e; margin-bottom: 10px; font-weight: bold; font-size: 14px;"></div>
                ${isLogin ? loginForm : registerForm}
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    closeAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) modal.remove();
    },

    async handleLogin() {
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const errorEl = document.getElementById('authError');
        
        try {
            await this.login(email, password);
            this.closeAuthModal();
            window.location.reload(); // Reload to fetch user's data
        } catch (err) {
            errorEl.innerText = err.message;
        }
    },

    async handleRegister() {
        const email = document.getElementById('authEmail').value;
        const username = document.getElementById('authUsername').value;
        const password = document.getElementById('authPassword').value;
        const repeatPassword = document.getElementById('authRepeatPassword').value;
        const errorEl = document.getElementById('authError');
        
        try {
            await this.register(email, username, password, repeatPassword);
            this.closeAuthModal();
            window.location.reload(); // Reload to fetch user's data
        } catch (err) {
            errorEl.innerText = err.message;
        }
    }
};

window.Auth = Auth;

// Automatically inject login/logout button into the navigation bar
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        const authBtn = document.createElement('a');
        authBtn.href = "#";
        if (Auth.getToken()) {
            authBtn.innerHTML = '<img src="/static/lg/blackKing.png" class="icon"> Logout';
            authBtn.onclick = (e) => {
                e.preventDefault();
                Auth.clearToken();
                window.location.reload();
            };
        } else {
            authBtn.innerHTML = '<img src="/static/lg/whiteKing.png" class="icon"> Login';
            authBtn.onclick = (e) => {
                e.preventDefault();
                Auth.showAuthModal('login');
            };
        }
        navLinks.appendChild(authBtn);
    }
});
