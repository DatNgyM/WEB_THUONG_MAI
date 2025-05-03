class AdminLogin {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.errorMessage = document.getElementById('errorMessage');
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        this.form?.addEventListener('submit', (e) => this.handleLogin(e));
    }

    async checkAuthStatus() {
        try {
            const response = await fetch('/api/admin/auth/status', {
                credentials: 'include'
            });
            
            if (response.ok) {
                // Already logged in, redirect to dashboard
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username')?.value;
        const password = document.getElementById('password')?.value;

        if (!username || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            if (response.ok) {
                // Login successful
                const data = await response.json();
                // Store admin token
                localStorage.setItem('adminToken', data.token);
                // Redirect to dashboard
                window.location.href = 'index.html';
            } else {
                const error = await response.json();
                this.showError(error.message || 'Invalid username or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            this.showError('Login failed. Please try again.');
        }
    }

    showError(message) {
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
            this.errorMessage.style.display = 'block';

            // Hide error after 3 seconds
            setTimeout(() => {
                this.errorMessage.style.display = 'none';
            }, 3000);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const adminLogin = new AdminLogin();
});