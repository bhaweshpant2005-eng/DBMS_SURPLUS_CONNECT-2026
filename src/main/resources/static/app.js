// ========================================
// Surplus Connect - Frontend Application
// ========================================

class SurplusConnect {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        this.baseURL = window.location.origin + '/api';
        
        // Category mappings
        this.categories = {
            "Food": ["Cooked Meals", "Fresh Vegetables", "Packaged Food", "Dairy Products"],
            "Clothes": ["Winter Wear", "Summer Clothes", "Formal Wear", "Children Clothes"],
            "Essentials": ["Medicine", "Books", "Electronics", "Household Items"]
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUIForAuth();
        this.loadDashboard();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });

        // Auth Modal
        const authBtn = document.getElementById('authBtn');
        const authModal = document.getElementById('authModal');
        const modalClose = document.querySelector('.modal-close');

        authBtn.addEventListener('click', () => authModal.classList.add('active'));
        modalClose.addEventListener('click', () => authModal.classList.remove('active'));
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) authModal.classList.remove('active');
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(tab).classList.add('active');
            });
        });

        // Forms
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm')?.addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('donationForm')?.addEventListener('submit', (e) => this.handleDonation(e));
        document.getElementById('requestForm')?.addEventListener('submit', (e) => this.handleRequest(e));

        // Category dropdowns
        document.getElementById('itemType')?.addEventListener('change', () => {
            this.updateCategories('itemType', 'itemCategory');
        });
        document.getElementById('requestItemType')?.addEventListener('change', () => {
            this.updateCategories('requestItemType', 'requestCategory');
        });
    }

    updateUIForAuth() {
        const userInfo = document.getElementById('userInfo');
        const authBtn = document.getElementById('authBtn');
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');

        if (this.currentUser && this.token) {
            authBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
            authBtn.onclick = () => this.logout();
            userInfo.style.display = 'block';
            userName.textContent = this.currentUser.name || 'User';
            userRole.textContent = this.currentUser.role || 'Unknown';

            // Show role-specific sections
            this.showRoleBasedSections(this.currentUser.role);
        } else {
            authBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            authBtn.onclick = () => document.getElementById('authModal').classList.add('active');
            userInfo.style.display = 'none';
            this.hideRoleBasedSections();
        }
    }

    showRoleBasedSections(role) {
        const donorSections = document.querySelectorAll('.donor-section');
        const ngoSections = document.querySelectorAll('.ngo-section');
        const adminSections = document.querySelectorAll('.admin-section');

        donorSections.forEach(el => el.style.display = role === 'DONOR' ? 'inline-flex' : 'none');
        ngoSections.forEach(el => el.style.display = role === 'NGO' ? 'inline-flex' : 'none');
        adminSections.forEach(el => el.style.display = role === 'ADMIN' ? 'inline-flex' : 'none');
    }

    hideRoleBasedSections() {
        document.querySelectorAll('.donor-section, .ngo-section, .admin-section').forEach(el => {
            el.style.display = 'none';
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');

            // Update nav links
            document.querySelectorAll('[data-section]').forEach(link => {
                link.classList.remove('active');
                if (link.dataset.section === sectionId) link.classList.add('active');
            });

            // Load section data
            if (sectionId === 'dashboard') this.loadDashboard();
            else if (sectionId === 'donate') this.loadMyDonations();
            else if (sectionId === 'request') this.loadMyRequests();
            else if (sectionId === 'matches') this.loadMatches();
            else if (sectionId === 'admin') this.loadAdminDashboard();
        }
    }

    // ========================================
    // API Calls
    // ========================================

    async apiCall(method, endpoint, data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, options);
            
            if (response.status === 401) {
                this.logout();
                throw new Error('Unauthorized - please login');
            }

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${method} ${endpoint}]:`, error);
            this.showToast(error.message, 'error');
            throw error;
        }
    }

    // ========================================
    // Authentication
    // ========================================

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const role = document.getElementById('loginRole').value;

        try {
            const response = await this.apiCall('POST', '/auth/login', {
                email,
                password,
                role
            });

            this.token = response.token;
            this.currentUser = response.user;

            localStorage.setItem('authToken', this.token);
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

            document.getElementById('authModal').classList.remove('active');
            document.getElementById('loginForm').reset();
            
            this.updateUIForAuth();
            this.showToast('Login successful!', 'success');
            this.showSection('dashboard');
        } catch (error) {
            this.showToast('Login failed: ' + error.message, 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole').value;

        try {
            await this.apiCall('POST', '/auth/register', {
                name,
                email,
                password,
                role
            });

            document.getElementById('registerForm').reset();
            this.showToast('Registration successful! Please login.', 'success');
            
            // Switch to login tab
            document.querySelector('[data-tab="login"]').click();
        } catch (error) {
            this.showToast('Registration failed: ' + error.message, 'error');
        }
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.updateUIForAuth();
        this.showSection('dashboard');
        this.showToast('Logged out successfully', 'success');
    }

    // ========================================
    // Dashboard
    // ========================================

    async loadDashboard() {
        try {
            // Load stats
            const [items, requests, ngos] = await Promise.all([
                this.apiCall('GET', '/items'),
                this.apiCall('GET', '/requests'),
                this.apiCall('GET', '/ngos')
            ]);

            // Update stats
            document.getElementById('stat-donations').textContent = items.length;
            document.getElementById('stat-requests').textContent = requests.length;
            document.getElementById('stat-matches').textContent = items.filter(i => i.status === 'ALLOCATED').length;
            document.getElementById('stat-ngos').textContent = ngos.length;

            // Show recent items
            this.renderRecentItems(items.slice(0, 5));

            // Show active requests
            this.renderActiveRequests(requests.slice(0, 5));
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        }
    }

    renderRecentItems(items) {
        const container = document.getElementById('recentDonations');
        if (items.length === 0) {
            container.innerHTML = '<p class="empty-state">No donations yet</p>';
            return;
        }

        container.innerHTML = `
            <div class="item-list">
                ${items.map(item => `
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">${item.itemType} - ${item.category}</span>
                            <span class="item-badge ${item.status?.toLowerCase()}">${item.status || 'PENDING'}</span>
                        </div>
                        <div class="item-body">
                            <div class="item-field">
                                <span class="item-field-label">Quantity</span>
                                <span class="item-field-value">${item.quantity}</span>
                            </div>
                            <div class="item-field">
                                <span class="item-field-label">Location</span>
                                <span class="item-field-value">${item.location || 'N/A'}</span>
                            </div>
                            <div class="item-field">
                                <span class="item-field-label">Created</span>
                                <span class="item-field-value">${new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderActiveRequests(requests) {
        const container = document.getElementById('activeRequests');
        if (requests.length === 0) {
            container.innerHTML = '<p class="empty-state">No active requests</p>';
            return;
        }

        container.innerHTML = `
            <div class="item-list">
                ${requests.map(req => `
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">${req.resourceType} - ${req.category}</span>
                            <span class="item-badge ${req.urgencyLevel?.toLowerCase()}">${req.urgencyLevel || 'PENDING'}</span>
                        </div>
                        <div class="item-body">
                            <div class="item-field">
                                <span class="item-field-label">Quantity Needed</span>
                                <span class="item-field-value">${req.quantityRequested}</span>
                            </div>
                            <div class="item-field">
                                <span class="item-field-label">Location</span>
                                <span class="item-field-value">${req.location || 'N/A'}</span>
                            </div>
                            <div class="item-field">
                                <span class="item-field-label">Status</span>
                                <span class="item-field-value">${req.status || 'PENDING'}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ========================================
    // Donations
    // ========================================

    async handleDonation(e) {
        e.preventDefault();

        const formData = {
            donorName: document.getElementById('donorName').value,
            donorPhone: document.getElementById('donorPhone').value,
            itemType: document.getElementById('itemType').value,
            category: document.getElementById('itemCategory').value,
            quantity: document.getElementById('donationQuantity').value,
            location: document.getElementById('donationLocation').value,
            description: document.getElementById('donationDescription').value
        };

        try {
            await this.apiCall('POST', '/items', formData);
            document.getElementById('donationForm').reset();
            this.showToast('Donation registered successfully!', 'success');
            this.loadDashboard();
            this.loadMyDonations();
        } catch (error) {
            this.showToast('Failed to register donation: ' + error.message, 'error');
        }
    }

    async loadMyDonations() {
        if (!this.currentUser) {
            document.getElementById('myDonations').innerHTML = '<p class="empty-state">Please login to view your donations</p>';
            return;
        }

        try {
            const items = await this.apiCall('GET', '/items');
            this.renderMyItems(items);
        } catch (error) {
            document.getElementById('myDonations').innerHTML = '<p class="empty-state">Failed to load donations</p>';
        }
    }

    renderMyItems(items) {
        const container = document.getElementById('myDonations');
        if (items.length === 0) {
            container.innerHTML = '<p class="empty-state">No donations yet</p>';
            return;
        }

        container.innerHTML = `
            <div class="item-list">
                ${items.map(item => `
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">${item.itemType} - ${item.category}</span>
                            <span class="item-badge ${item.status?.toLowerCase()}">${item.status || 'PENDING'}</span>
                        </div>
                        <div class="item-body">
                            <div class="item-field">
                                <span class="item-field-label">Quantity</span>
                                <span class="item-field-value">${item.quantity}</span>
                            </div>
                            <div class="item-field">
                                <span class="item-field-label">Location</span>
                                <span class="item-field-value">${item.location || 'N/A'}</span>
                            </div>
                            <div class="item-field">
                                <span class="item-field-label">Created</span>
                                <span class="item-field-value">${new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ========================================
    // Requests
    // ========================================

    async handleRequest(e) {
        e.preventDefault();

        const formData = {
            organizationName: document.getElementById('ngoName').value,
            contactPerson: document.getElementById('contactPerson').value,
            phone: document.getElementById('contactPhone').value,
            resourceType: document.getElementById('requestItemType').value,
            category: document.getElementById('requestCategory').value,
            quantityRequested: document.getElementById('requestQuantity').value,
            urgencyLevel: document.getElementById('urgencyLevel').value,
            location: document.getElementById('requestLocation').value
        };

        try {
            await this.apiCall('POST', '/requests', formData);
            document.getElementById('requestForm').reset();
            this.showToast('Request submitted successfully!', 'success');
            this.loadDashboard();
            this.loadMyRequests();
        } catch (error) {
            this.showToast('Failed to submit request: ' + error.message, 'error');
        }
    }

    async loadMyRequests() {
        if (!this.currentUser) {
            document.getElementById('myRequests').innerHTML = '<p class="empty-state">Please login to view your requests</p>';
            return;
        }

        try {
            const requests = await this.apiCall('GET', '/requests');
            this.renderMyRequests(requests);
        } catch (error) {
            document.getElementById('myRequests').innerHTML = '<p class="empty-state">Failed to load requests</p>';
        }
    }

    renderMyRequests(requests) {
        const container = document.getElementById('myRequests');
        if (requests.length === 0) {
            container.innerHTML = '<p class="empty-state">No requests yet</p>';
            return;
        }

        container.innerHTML = `
            <div class="item-list">
                ${requests.map(req => `
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">${req.organizationName}</span>
                            <span class="item-badge ${req.urgencyLevel?.toLowerCase()}">${req.urgencyLevel || 'PENDING'}</span>
                        </div>
                        <div class="item-body">
                            <div class="item-field">
                                <span class="item-field-label">Type</span>
                                <span class="item-field-value">${req.resourceType}</span>
                            </div>
                            <div class="item-field">
                                <span class="item-field-label">Quantity</span>
                                <span class="item-field-value">${req.quantityRequested}</span>
                            </div>
                            <div class="item-field">
                                <span class="item-field-label">Location</span>
                                <span class="item-field-value">${req.location || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ========================================
    // Matches
    // ========================================

    async loadMatches() {
        try {
            const items = await this.apiCall('GET', '/items');
            const allocatedItems = items.filter(i => i.status === 'ALLOCATED');
            this.renderMatches(allocatedItems);
        } catch (error) {
            document.getElementById('matchesList').innerHTML = '<p class="empty-state">Failed to load matches</p>';
        }
    }

    renderMatches(matches) {
        const container = document.getElementById('matchesList');
        if (matches.length === 0) {
            container.innerHTML = '<p class="empty-state">No matches found yet</p>';
            return;
        }

        container.innerHTML = `
            <div class="item-list">
                ${matches.map(match => `
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">${match.itemType} Match</span>
                            <span class="item-badge" style="background: rgba(16, 185, 129, 0.1); color: var(--success);">MATCHED</span>
                        </div>
                        <div class="item-body">
                            <div class="item-field">
                                <span class="item-field-label">Category</span>
                                <span class="item-field-value">${match.category}</span>
                            </div>
                            <div class="item-field">
                                <span class="item-field-label">Quantity</span>
                                <span class="item-field-value">${match.quantity}</span>
                            </div>
                            <div class="item-field">
                                <span class="item-field-label">Location</span>
                                <span class="item-field-value">${match.location || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ========================================
    // Admin
    // ========================================

    async loadAdminDashboard() {
        if (this.currentUser?.role !== 'ADMIN') {
            this.showToast('Admin access required', 'error');
            this.showSection('dashboard');
            return;
        }

        try {
            const [items, requests, ngos] = await Promise.all([
                this.apiCall('GET', '/items'),
                this.apiCall('GET', '/requests'),
                this.apiCall('GET', '/ngos')
            ]);

            // Update admin stats
            document.getElementById('admin-donations').textContent = items.length;
            document.getElementById('admin-requests').textContent = requests.length;
            document.getElementById('admin-matches').textContent = items.filter(i => i.status === 'ALLOCATED').length;
            document.getElementById('admin-ngos').textContent = ngos.length;

            // Load leaderboard
            this.loadLeaderboard(ngos);
        } catch (error) {
            console.error('Failed to load admin dashboard:', error);
        }
    }

    loadLeaderboard(ngos) {
        const container = document.getElementById('topNGOs');
        if (ngos.length === 0) {
            container.innerHTML = '<p class="empty-state">No NGOs found</p>';
            return;
        }

        const sorted = ngos.sort((a, b) => (b.trustScore || 0) - (a.trustScore || 0)).slice(0, 5);
        
        container.innerHTML = `
            <div class="item-list">
                ${sorted.map((ngo, idx) => `
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">#${idx + 1} ${ngo.name}</span>
                        </div>
                        <div class="item-body">
                            <div class="item-field">
                                <span class="item-field-label">Trust Score</span>
                                <span class="item-field-value">${(ngo.trustScore || 0).toFixed(2)}</span>
                            </div>
                            <div class="item-field">
                                <span class="item-field-label">People Helped</span>
                                <span class="item-field-value">${ngo.peopleHelped || 0}</span>
                            </div>
                            <div class="item-field">
                                <span class="item-field-label">Category</span>
                                <span class="item-field-value">${ngo.ngoCategory || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ========================================
    // Utility Functions
    // ========================================

    updateCategories(typeId, categoryId) {
        const type = document.getElementById(typeId).value;
        const categorySelect = document.getElementById(categoryId);

        categorySelect.innerHTML = '<option value="">Select category</option>';

        if (type && this.categories[type]) {
            this.categories[type].forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categorySelect.appendChild(option);
            });
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast active ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SurplusConnect();
});
