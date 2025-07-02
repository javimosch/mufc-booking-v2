class CLIWebUI {
    constructor() {
        this.token = null;
        this.organizationId = null;
        this.userRole = null;
        this.initializeElements();
        this.bindEvents();
        this.checkLoginStatus();
    }

    // Helper function to format date to DD-MM-YYYY
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    checkLoginStatus() {
        const storedToken = localStorage.getItem('jwtToken');
        const storedOrgId = localStorage.getItem('organizationId');
        const storedRole = localStorage.getItem('userRole');
        const storedEmail = localStorage.getItem('userEmail');

        console.debug('Checking login status:', { 
            hasToken: !!storedToken, 
            organizationId: storedOrgId,
            role: storedRole,
            email: storedEmail
        });

        if (storedToken) {
            if (this.isTokenExpired(storedToken)) {
                this.addLog('info', 'Token expired. Please log in again.');
                this.logout(); // Clear token and redirect to login
            } else {
                this.token = storedToken;
                
                // Ensure organizationId is valid and not 'undefined' or 'null' strings
                if (storedOrgId && storedOrgId !== 'undefined' && storedOrgId !== 'null') {
                    this.organizationId = storedOrgId;
                } else {
                    // Try to extract organizationId from JWT token
                    try {
                        const payload = JSON.parse(atob(storedToken.split('.')[1]));
                        this.organizationId = payload.organizationId || null;
                        // Update localStorage with the extracted value if found
                        if (this.organizationId) {
                            localStorage.setItem('organizationId', this.organizationId);
                        }
                        console.debug('Extracted organizationId from token:', this.organizationId);
                    } catch (e) {
                        console.debug('Failed to extract organizationId from token:', e);
                        this.organizationId = null;
                    }
                }
                
                this.userRole = storedRole;
                this.userEmail = storedEmail || 'User';
                
                // Update UI for logged in state
                this.loginSection.style.display = 'none';
                this.dashboardSection.style.display = 'grid';
                this.userControls.style.display = 'block';
                this.userEmailDisplay.textContent = this.userEmail;
                
                this.addLog('success', '✅ Auto-logged in');
                this.loadDashboard();
                this.updateUIVisibility();
            }
        } else {
            this.loginSection.style.display = 'flex';
            this.dashboardSection.style.display = 'none';
        }
    }

    isTokenExpired(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = payload.exp * 1000; // Convert to milliseconds
            return Date.now() >= expirationTime;
        } catch (e) {
            console.error("Error decoding token:", e);
            return true; // Assume expired or invalid if decoding fails
        }
    }

    initializeElements() {
        // Login elements
        this.loginSection = document.getElementById('login-section');
        this.emailInput = document.getElementById('email-input');
        this.passwordInput = document.getElementById('password-input');
        this.loginBtn = document.getElementById('login-btn');
        this.logoutBtn = document.getElementById('logout-btn');
        this.userControls = document.getElementById('user-controls');
        this.userEmailDisplay = document.getElementById('user-email-display');

        // Dashboard elements
        this.dashboardSection = document.getElementById('dashboard-section');
        this.matchEventsContent = document.getElementById('match-events-content');
        this.usersContent = document.getElementById('users-content');
        this.organizationsContent = document.getElementById('organizations-content');
        this.addEventBtn = document.getElementById('add-event-btn');
        this.addUserBtn = document.getElementById('add-user-btn');
        this.addOrganizationBtn = document.getElementById('add-organization-btn');
        this.publicEventLinksContent = document.getElementById('public-event-links-content');

        // Log elements
        this.logContainer = document.getElementById('log-container');

        // Modal elements
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.modalOk = document.getElementById('modal-ok');
        this.modalCancel = document.getElementById('modal-cancel');
    }

    bindEvents() {
        // Bind login button
        this.loginBtn.addEventListener('click', () => this.login());
        this.logoutBtn.addEventListener('click', () => this.confirmLogout());
        
        // Add Enter key handling for login form
        this.passwordInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') this.login();
        });
        
        // Bind sidebar navigation events
        this.bindNavigationEvents();
        
        this.addEventBtn.addEventListener('click', () => this.showAddEventModal());
        this.addUserBtn.addEventListener('click', () => this.showAddUserModal());
        this.addOrganizationBtn.addEventListener('click', () => this.showAddOrganizationModal());
        this.modalCancel.addEventListener('click', () => this.modal.close());
    }
    
    bindNavigationEvents() {
        // Get navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        
        // Handle navigation clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Extract view name from link id (nav-dashboard -> dashboard)
                const viewName = link.id.replace('nav-', '');
                this.activateView(viewName);
                
                // Close mobile sidebar if open
                if (window.innerWidth < 768 && sidebar && sidebarOverlay) {
                    sidebar.classList.add('hidden');
                    sidebarOverlay.style.display = 'none';
                }
            });
        });
        
        // Mobile menu toggle
        if (mobileMenuBtn && sidebar && sidebarOverlay) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('hidden');
                sidebarOverlay.style.display = sidebar.classList.contains('hidden') ? 'none' : 'block';
            });
            
            // Close sidebar when clicking overlay
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.add('hidden');
                sidebarOverlay.style.display = 'none';
            });
        }
    }

    async login() {
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value.trim();

        if (!email || !password) {
            this.addLog('error', '❌ Email and password are required');
            return;
        }

        try {
            console.debug('Attempting login with:', { email });
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.debug('Login response data:', data);
            
            this.token = data.token;
            this.userEmail = email;
            
            // Extract organizationId and role either from direct response or from token
            if (data.organizationId) {
                this.organizationId = data.organizationId;
            } else {
                // Try to extract from token
                try {
                    const payload = JSON.parse(atob(data.token.split('.')[1]));
                    this.organizationId = payload.organizationId || null;
                    console.debug('Extracted organizationId from token:', this.organizationId);
                } catch (e) {
                    console.debug('Failed to extract organizationId from token:', e);
                    this.organizationId = null;
                }
            }
            
            // Get role from response or token
            if (data.role) {
                this.userRole = data.role;
            } else {
                // Try to extract from token
                try {
                    const payload = JSON.parse(atob(data.token.split('.')[1]));
                    this.userRole = payload.role || null;
                    console.debug('Extracted role from token:', this.userRole);
                } catch (e) {
                    console.debug('Failed to extract role from token:', e);
                    this.userRole = null;
                }
            }

            // Store user data in localStorage (only if values exist)
            localStorage.setItem('jwtToken', this.token);
            if (this.organizationId) localStorage.setItem('organizationId', this.organizationId);
            if (this.userRole) localStorage.setItem('userRole', this.userRole);
            localStorage.setItem('userEmail', email);

            // Update UI for logged in state
            this.loginSection.style.display = 'none';
            this.dashboardSection.style.display = 'grid';
            this.userControls.style.display = 'block';
            this.userEmailDisplay.textContent = email;
            
            this.addLog('success', '✅ Logged in successfully');
            this.loadDashboard();
            this.updateUIVisibility();
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    // Wrapper for fetch to handle 401 responses
    async authenticatedFetch(url, options = {}) {
        if (!options.headers) {
            options.headers = {};
        }
        if (this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, options);

        if (response.status === 401) {
            this.addLog('error', 'Unauthorized: Your session has expired. Please log in again.');
            this.logout();
            throw new Error('Unauthorized'); // Prevent further processing of this response
        }

        return response;
    }

    async loadDashboard() {
        console.debug('Loading dashboard with role:', this.userRole);
        
        // Load data for all sections regardless of current view
        this.loadPublicEventLinks();
        
        // Role-based content loading
        if (this.userRole === 'superAdmin') {
            this.loadOrganizations();
            this.loadMatchEvents();
            this.loadUsers();
            
            // Update stats counters on dashboard
            this.updateDashboardStats();
        } else if (this.userRole === 'orgAdmin') {
            this.loadMatchEvents();
            this.loadUsers();
            
            // Update stats counters on dashboard
            this.updateDashboardStats();
        }
        
        // Add a welcome message to the log
        this.addLog('info', `Welcome back, ${this.userEmail || 'User'}! Role: ${this.userRole || 'unknown'}`);
    }
    
    // Update dashboard stats
    updateDashboardStats() {
        const eventsCounter = document.getElementById('stats-events');
        const usersCounter = document.getElementById('stats-users');
        
        // Simple example - in a real app, you'd want to get actual counts from the server
        if (eventsCounter) {
            this.authenticatedFetch('/api/match-events/count')
                .then(response => response.json())
                .then(data => {
                    eventsCounter.textContent = data.count || '0';
                })
                .catch(err => {
                    console.debug('Error fetching event stats:', err);
                    eventsCounter.textContent = '0';
                });
        }
        
        if (usersCounter) {
            this.authenticatedFetch('/api/users/count')
                .then(response => response.json())
                .then(data => {
                    usersCounter.textContent = data.count || '0';
                })
                .catch(err => {
                    console.debug('Error fetching user stats:', err);
                    usersCounter.textContent = '0';
                });
        }
    }

    updateUIVisibility() {
        console.debug('Updating UI visibility with role:', this.userRole);
        
        // Get sidebar navigation links
        const navDashboard = document.getElementById('nav-dashboard');
        const navEvents = document.getElementById('nav-events');
        const navUsers = document.getElementById('nav-users');
        const navOrganizations = document.getElementById('nav-organizations');
        const navPublicLinks = document.getElementById('nav-public-links');
        
        // Hide all navigation items by default
        [navDashboard, navEvents, navUsers, navOrganizations, navPublicLinks].forEach(nav => {
            if (nav) nav.classList.add('hidden');
        });
        
        // Show dashboard section and hide login section when logged in
        if (this.token) {
            if (this.loginSection) this.loginSection.style.display = 'none';
            if (this.dashboardSection) this.dashboardSection.style.display = 'flex';
            
            // Show sidebar
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.remove('hidden');
            
            // Always show dashboard for logged in users
            if (navDashboard) navDashboard.classList.remove('hidden');
            
            // Role-based navigation visibility
            if (this.userRole === 'superAdmin') {
                // SuperAdmin sees everything
                [navEvents, navUsers, navOrganizations, navPublicLinks].forEach(nav => {
                    if (nav) nav.classList.remove('hidden');
                });
            } else if (this.userRole === 'orgAdmin') {
                // OrgAdmin sees events, users and public links
                [navEvents, navUsers, navPublicLinks].forEach(nav => {
                    if (nav) nav.classList.remove('hidden');
                });
            } else {
                // Regular users only see public links
                if (navPublicLinks) navPublicLinks.classList.remove('hidden');
            }
            
            // Activate dashboard view by default
            this.activateView('dashboard');
        } else {
            // Not logged in - show login section and hide dashboard
            if (this.loginSection) this.loginSection.style.display = 'block';
            if (this.dashboardSection) this.dashboardSection.style.display = 'none';
            
            // Hide sidebar when not logged in
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.add('hidden');
        }
    }
    
    // Helper method to activate a specific view
    activateView(viewName) {
        console.debug('Activating view:', viewName);
        
        // Hide all views
        const views = document.querySelectorAll('.view-content');
        views.forEach(view => view.classList.add('hidden'));
        
        // Show the requested view
        const targetView = document.getElementById(`view-${viewName}`);
        if (targetView) {
            targetView.classList.remove('hidden');
        } else {
            console.debug(`View not found: view-${viewName}`);
        }
        
        // Update active state in navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active-nav', 'bg-base-300'));
        
        const activeLink = document.getElementById(`nav-${viewName}`);
        if (activeLink) activeLink.classList.add('active-nav', 'bg-base-300');
    }
    
    async loadPublicEventLinks() {
        try {
            // Check if organizationId exists before making the request
            if (!this.organizationId) {
                console.debug('No organizationId available for public events');
                this.renderPublicEventLinks([]);
                return;
            }
            
            console.debug('Loading public events with organizationId:', this.organizationId);
            const response = await this.authenticatedFetch(`/api/public/match-events?organizationId=${this.organizationId}`);
            if (!response.ok) throw new Error('Failed to load match events for public links');
            const events = await response.json();
            this.renderPublicEventLinks(events);
        } catch (error) {
            console.debug('Error loading public events:', error);
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    renderPublicEventLinks(events) {
        if (events.length === 0) {
            this.publicEventLinksContent.innerHTML = '<p>No public event links found.</p>';
            return;
        }
        const list = document.createElement('ul');
        events.forEach(event => {
            const organizationId = this.organizationId;
            const publicLink = `${window.location.origin}/iframe?eventId=${event._id}&organizationId=${organizationId}`;
            const iframeCode = `<iframe src="${publicLink}" width="600" height="400" frameborder="0"></iframe>`;
            const item = document.createElement('li');
            item.innerHTML = `
                <div class="list-item-content">
                    <span>${event.title}: </span>
                    <a href="${publicLink}" target="_blank">${publicLink}</a>
                    <div class="code-example">
                        <textarea class="code-block" readonly>${iframeCode}</textarea>
                    </div>
                </div>
                <div class="list-item-actions button-group">
                    <button class="btn btn--secondary copy-btn" data-clipboard-text="${iframeCode}">Copy</button>
                </div>
            `;
            list.appendChild(item);
        });
        this.publicEventLinksContent.innerHTML = '';
        this.publicEventLinksContent.appendChild(list);

        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', (event) => this.copyToClipboard(event.target.dataset.clipboardText));
        });
    }

    copyToClipboard(textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            this.addLog('success', '✅ Copied to clipboard!');
        }).catch(err => {
            this.addLog('error', '❌ Failed to copy to clipboard.');
            console.error('Error copying to clipboard:', err);
        });
    }

    async loadMatchEvents() {
        try {
            const response = await this.authenticatedFetch('/api/match-events');
            if (!response.ok) throw new Error('Failed to load match events');
            const events = await response.json();
            this.renderMatchEvents(events);
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    async loadUsers() {
        try {
            const response = await this.authenticatedFetch('/api/users');
            if (!response.ok) throw new Error('Failed to load users');
            const users = await response.json();
            this.renderUsers(users);
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    renderMatchEvents(events) {
        if (events.length === 0) {
            this.matchEventsContent.innerHTML = '<p>No match events found.</p>';
            return;
        }
        const list = document.createElement('ul');
        events.forEach(event => {
            const iterations = this.getFutureIterations(event);
            let iterationsHtml = '';
            if (iterations.length > 0) {
                iterationsHtml = iterations.map(iteration => {
                    const statusClass = iteration.isCancelled ? 'cancelled' : 'active';
                    const buttonText = iteration.isCancelled ? 'Uncancel' : 'Cancel';
                    const buttonClass = iteration.isCancelled ? 'btn--secondary' : 'btn--danger';
                    const action = iteration.isCancelled ? 'uncancel' : 'cancel';
                    return `
                        <li class="iteration-item ${statusClass}">
                            <span>${event.title} - ${this.formatDate(iteration.date)}</span>
                            <div class="list-item-actions button-group">
                                <button class="btn ${buttonClass} btn--small" onclick="ui.toggleCancelEventIteration('${event._id}', '${iteration.date}', '${action}')">${buttonText}</button>
                            </div>
                        </li>
                    `;
                }).join('');
            } else {
                iterationsHtml = '<p>No upcoming iterations.</p>';
            }

            const item = document.createElement('li');
            item.innerHTML = `
                <div class="list-item-content">
                    <h3>${event.title} (Repeats: ${event.repeatEach})</h3>
                    <p>Start Date: ${this.formatDate(event.startDate)}</p>
                </div>
                <div class="list-item-actions button-group">
                    <button class="btn btn--danger" onclick="ui.showDeleteEventModal('${event._id}', '${event.title}')">Delete Event</button>
                </div>
                <div class="event-iterations">
                    <h4>Upcoming Iterations:</h4>
                    <ul>${iterationsHtml}</ul>
                </div>
            `;
            list.appendChild(item);
        });
        this.matchEventsContent.innerHTML = '';
        this.matchEventsContent.appendChild(list);
    }
    
    async toggleCancelEventIteration(eventId, date, action) {
        try {
            const response = await this.authenticatedFetch(`/api/match-events/${eventId}/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date })
            });

            if (!response.ok) {
                throw new Error(`Failed to ${action} event iteration`);
            }

            this.addLog('success', `✅ Event iteration ${action}ed successfully`);
            this.loadMatchEvents(); // Reload events to update UI
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    showDeleteEventModal(eventId, eventTitle) {
        const message = `<p>Are you sure you want to delete the event <strong>${eventTitle}</strong>? This action cannot be undone.</p>`;
        this.showModal('Delete Event', message, () => this.deleteEvent(eventId));
    }

    async deleteEvent(eventId) {
        try {
            const response = await this.authenticatedFetch(`/api/match-events/${eventId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            this.addLog('success', '✅ Event deleted successfully');
            this.loadMatchEvents();
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    async loadOrganizations() {
        try {
            const response = await this.authenticatedFetch('/api/organizations');
            if (!response.ok) throw new Error('Failed to load organizations');
            const organizations = await response.json();
            this.renderOrganizations(organizations);
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    renderOrganizations(organizations) {
        if (organizations.length === 0) {
            this.organizationsContent.innerHTML = '<p>No organizations found.</p>';
            return;
        }
        const list = document.createElement('ul');
        organizations.forEach(org => {
            const item = document.createElement('li');
            item.innerHTML = `
                <div class="list-item-content">
                    <span>${org.name} - ${org.description || 'No description'}</span>
                </div>
                <div class="list-item-actions button-group">
                    <button class="btn btn--secondary" onclick="ui.showEditOrganizationModal('${org._id}', '${org.name}', '${org.description || ''}')">Edit</button>
                    <button class="btn btn--danger" onclick="ui.showDeleteOrganizationModal('${org._id}', '${org.name}')">Delete</button>
                </div>
            `;
            list.appendChild(item);
        });
        this.organizationsContent.innerHTML = '';
        this.organizationsContent.appendChild(list);
    }

    showAddOrganizationModal() {
        this.showModal('Add Organization', this.getOrganizationForm(), () => this.addOrganization());
    }
    
    getOrganizationForm(name = '', description = '') {
        return `
            <div class="form-group">
                <label class="label" for="org-name-input">Name</label>
                <input type="text" id="org-name-input" class="input" placeholder="Organization name..." value="${name}">
            </div>
            <div class="form-group">
                <label class="label" for="org-description-input">Description</label>
                <input type="text" id="org-description-input" class="input" placeholder="Description..." value="${description}">
            </div>
        `;
    }

    async addOrganization() {
        const name = document.getElementById('org-name-input').value.trim();
        const description = document.getElementById('org-description-input').value.trim();

        if (!name) {
            this.addLog('error', '❌ Organization name is required');
            return;
        }

        try {
            const response = await this.authenticatedFetch('/api/organizations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, description })
            });

            if (!response.ok) {
                throw new Error('Failed to add organization');
            }

            this.addLog('success', '✅ Organization added successfully');
            this.loadOrganizations();
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }
    
    showEditOrganizationModal(id, currentName, currentDescription) {
        const form = this.getOrganizationForm(currentName, currentDescription);
        this.showModal('Edit Organization', form, () => this.editOrganization(id));
    }

    async editOrganization(id) {
        const name = document.getElementById('org-name-input').value.trim();
        const description = document.getElementById('org-description-input').value.trim();

        if (!name) {
            this.addLog('error', '❌ Organization name is required');
            return;
        }

        try {
            const response = await this.authenticatedFetch(`/api/organizations/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });

            if (!response.ok) {
                throw new Error('Failed to update organization');
            }

            this.addLog('success', '✅ Organization updated successfully');
            this.loadOrganizations();
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }
    
    showDeleteOrganizationModal(id, name) {
        const message = `<p>Are you sure you want to delete <strong>${name}</strong>? This is irreversible.</p>`;
        this.showModal('Delete Organization', message, () => this.deleteOrganization(id));
    }

    async deleteOrganization(id) {
        try {
            const response = await this.authenticatedFetch(`/api/organizations/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete organization');
            }

            this.addLog('success', '✅ Organization deleted successfully');
            this.loadOrganizations();
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    renderUsers(users) {
        if (users.length === 0) {
            this.usersContent.innerHTML = '<p>No users found.</p>';
            return;
        }
        const list = document.createElement('ul');
        users.forEach(user => {
            const item = document.createElement('li');
            let actions = '';
            if (this.userRole === 'superAdmin' && user.role !== 'orgAdmin') {
                actions = `<button class="btn btn--secondary" onclick="ui.showPromoteUserModal('${user._id}', '${user.email}')">Promote to Admin</button>`;
            }
            item.innerHTML = `
                <div class="list-item-content">
                    <span>${user.email} (${user.role})</span>
                </div>
                <div class="list-item-actions button-group">
                    ${actions}
                </div>
            `;
            list.appendChild(item);
        });
        this.usersContent.innerHTML = '';
        this.usersContent.appendChild(list);
    }

    showPromoteUserModal(userId, userEmail) {
        const message = `<p>Promote <strong>${userEmail}</strong> to an Organization Admin?</p>`;
        this.showModal('Promote User', message, () => this.promoteUser(userId));
    }

    async promoteUser(userId) {
        try {
            const response = await this.authenticatedFetch(`/api/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: 'orgAdmin' })
            });

            if (!response.ok) {
                throw new Error('Failed to promote user');
            }

            this.addLog('success', '✅ User promoted successfully');
            this.loadUsers();
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    confirmLogout() {
        // Show confirmation modal before logout
        this.showModal(
            'Confirm Logout', 
            'Are you sure you want to log out?',
            () => this.logout()
        );
    }
    
    logout() {
        console.debug('Logging out user:', this.userEmail);
        
        // Clear user data
        this.token = null;
        this.organizationId = null;
        this.userRole = null;
        this.userEmail = null;
        
        // Clear localStorage
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('organizationId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        
        // Update UI for logged out state
        this.loginSection.style.display = 'flex';
        this.dashboardSection.style.display = 'none';
        this.userControls.style.display = 'none';
        this.userEmailDisplay.textContent = '';
        
        this.addLog('info', '👋 Logged out successfully');
        
        // Close the modal if it's open
        if (this.modal.open) {
            this.modal.close();
        }
    }

    addLog(type, message) {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        this.logContainer.appendChild(logEntry);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }

    showModal(title, message, onOk) {
        this.modalTitle.textContent = title;
        this.modalMessage.innerHTML = message;

        const newOk = this.modalOk.cloneNode(true);
        this.modalOk.parentNode.replaceChild(newOk, this.modalOk);
        this.modalOk = newOk;

        this.modalOk.addEventListener('click', () => {
            if (onOk) {
                onOk();
            }
            this.modal.close();
        });

        this.modal.showModal();
    }

    showAddEventModal() {
        this.showModal('Add Match Event', this.getEventForm(), () => this.addEvent());
    }

    showAddUserModal() {
        this.showModal('Add User', this.getUserForm(), () => this.addUser());
    }

    getEventForm() {
        return `
            <div class="form-group">
                <label class="label" for="event-title-input">Title</label>
                <input type="text" id="event-title-input" class="input" placeholder="Event title...">
            </div>
            <div class="form-group">
                <label class="label" for="event-start-date-input">Start Date</label>
                <input type="date" id="event-start-date-input" class="input">
            </div>
            <div class="form-group">
                <label class="label" for="event-repeat-select">Repeats</label>
                <select id="event-repeat-select" class="input">
                    <option value="none">None</option>
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                </select>
            </div>
        `;
    }

    getUserForm() {
        return `
            <div class="form-group">
                <label class="label" for="user-email-input">Email</label>
                <input type="email" id="user-email-input" class="input" placeholder="User email...">
            </div>
            <div class="form-group">
                <label class="label" for="user-password-input">Password</label>
                <input type="password" id="user-password-input" class="input" placeholder="User password...">
            </div>
            <div class="form-group">
                <label class="label" for="user-role-select">Role</label>
                <select id="user-role-select" class="input">
                    <option value="user">User</option>
                    <option value="orgAdmin">Org Admin</option>
                </select>
            </div>
        `;
    }

    async addEvent() {
        const title = document.getElementById('event-title-input').value.trim();
        const startDate = new Date(document.getElementById('event-start-date-input').value);
        const isoStartDate = startDate.toISOString().split('T')[0];
        const repeatEach = document.getElementById('event-repeat-select').value;

        if (!title || !isoStartDate) {
            this.addLog('error', '❌ Event title and start date are required');
            return;
        }

        try {
            const response = await this.authenticatedFetch('/api/match-events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, startDate: isoStartDate, repeatEach })
            });

            if (!response.ok) {
                throw new Error('Failed to add event');
            }

            this.addLog('success', '✅ Event added successfully');
            this.loadMatchEvents();
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    async addUser() {
        const email = document.getElementById('user-email-input').value.trim();
        const password = document.getElementById('user-password-input').value.trim();
        const role = document.getElementById('user-role-select').value;

        if (!email || !password) {
            this.addLog('error', '❌ Email and password are required');
            return;
        }

        try {
            const response = await this.authenticatedFetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role })
            });

            if (!response.ok) {
                throw new Error('Failed to add user');
            }

            this.addLog('success', '✅ User added successfully');
            this.loadUsers();
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    getFutureIterations(event, count = 5) {
        const iterations = [];
        if (!event.startDate) return iterations;

        let currentDate = new Date(event.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        while (iterations.length < count) {
            if (currentDate >= today) {
                const dateString = currentDate.toISOString().split('T')[0];
                // Check if cancelledDates exists before calling .some()
                const isCancelled = event.cancelledDates && Array.isArray(event.cancelledDates) ? 
                    event.cancelledDates.some(d => new Date(d).toISOString().split('T')[0] === dateString) : false;
                iterations.push({
                    date: dateString,
                    isCancelled: isCancelled
                });
            }

            if (event.repeatEach === 'week') {
                currentDate.setDate(currentDate.getDate() + 7);
            } else if (event.repeatEach === 'month') {
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else {
                break; 
            }
        }
        return iterations;
    }
}

// Initialize the UI instance
window.ui = new CLIWebUI();
console.debug('CLIWebUI initialized successfully');