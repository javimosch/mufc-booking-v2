class CLIWebUI {
    constructor() {
        this.token = null;
        this.organizationId = null;
        this.initializeElements();
        this.bindEvents();
        this.checkLoginStatus();
    }

    checkLoginStatus() {
        const storedToken = localStorage.getItem('jwtToken');
        const storedOrgId = localStorage.getItem('organizationId');
        if (storedToken && storedOrgId) {
            if (this.isTokenExpired(storedToken)) {
                this.addLog('info', 'Token expired. Please log in again.');
                this.logout(); // Clear token and redirect to login
            } else {
                this.token = storedToken;
                this.organizationId = storedOrgId;
                this.loginSection.style.display = 'none';
                this.dashboardSection.style.display = 'grid';
                this.addLog('success', '✅ Auto-logged in');
                this.loadDashboard();
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
        this.loginBtn.addEventListener('click', () => this.login());
        this.logoutBtn.addEventListener('click', () => this.logout());
        this.addEventBtn.addEventListener('click', () => this.showAddEventModal());
        this.addUserBtn.addEventListener('click', () => this.showAddUserModal());
        this.addOrganizationBtn.addEventListener('click', () => this.showAddOrganizationModal());
        this.modalCancel.addEventListener('click', () => this.hideModal());
    }

    async login() {
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value.trim();

        if (!email || !password) {
            this.addLog('error', '❌ Email and password are required');
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            this.token = data.token;
            localStorage.setItem('jwtToken', this.token);
            // Decode the token to get organizationId
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            this.organizationId = payload.organizationId;
            localStorage.setItem('organizationId', this.organizationId);
            this.loginSection.style.display = 'none';
            this.dashboardSection.style.display = 'grid';
            this.logoutBtn.style.display = 'block';
            this.addLog('success', '✅ Login successful');
            this.loadDashboard();
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
        this.loadMatchEvents();
        this.loadUsers();
        this.loadPublicEventLinks();
        this.loadOrganizations();
    }

    async loadPublicEventLinks() {
        try {
            // Assuming the organizationId can be retrieved from the logged-in user's token
            // For now, we'll use a placeholder or fetch it if available in the token payload
            // This needs to be properly handled on the backend to return organizationId with user data
            const response = await this.authenticatedFetch(`/api/public/match-events?organizationId=${this.organizationId}`);
            if (!response.ok) throw new Error('Failed to load match events for public links');
            const events = await response.json();
            this.renderPublicEventLinks(events);
        } catch (error) {
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
            // Assuming the organizationId is available in the event object or from the user's token
            // For now, using a placeholder. This needs to be properly handled.
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
                    <button class="btn btn--secondary copy-btn" data-clipboard-target='${iframeCode}'>Copy</button>
                </div>
            `;
            list.appendChild(item);
        });
        this.publicEventLinksContent.innerHTML = '';
        this.publicEventLinksContent.appendChild(list);

        // Add event listeners for copy buttons
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', (event) => this.copyToClipboard(event));
        });
    }

    copyToClipboard(event) {
        const textToCopy = event.target.dataset.clipboardTarget;
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
            const item = document.createElement('li');
            item.innerHTML = `
                <div class="list-item-content">
                    <span>${event.title} (Repeats: ${event.repeatEach})</span>
                </div>
                <div class="list-item-actions button-group">
                    <button class="btn btn--danger" onclick="ui.showCancelEventModal('${event._id}')">Cancel Iteration</button>
                </div>
            `;
            list.appendChild(item);
        });
        this.matchEventsContent.innerHTML = '';
        this.matchEventsContent.appendChild(list);
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

    getOrganizationForm() {
        return `
            <div class="form-group">
                <label class="label" for="org-name-input">Name</label>
                <input type="text" id="org-name-input" class="input" placeholder="Organization name...">
            </div>
            <div class="form-group">
                <label class="label" for="org-description-input">Description</label>
                <input type="text" id="org-description-input" class="input" placeholder="Description...">
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
        const form = `
            <div class="form-group">
                <label class="label" for="edit-org-name-input">Name</label>
                <input type="text" id="edit-org-name-input" class="input" value="${currentName}" placeholder="Organization name...">
            </div>
            <div class="form-group">
                <label class="label" for="edit-org-description-input">Description</label>
                <input type="text" id="edit-org-description-input" class="input" value="${currentDescription}" placeholder="Description...">
            </div>
        `;
        this.showModal('Edit Organization', form, () => this.editOrganization(id));
    }

    async editOrganization(id) {
        const name = document.getElementById('edit-org-name-input').value.trim();
        const description = document.getElementById('edit-org-description-input').value.trim();

        if (!name) {
            this.addLog('error', '❌ Organization name is required');
            return;
        }

        try {
            const response = await this.authenticatedFetch(`/api/organizations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
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
        const message = `<p>Are you sure you want to delete the organization <strong>${name}</strong>? This action cannot be undone and will delete all associated users and match events.</p>`;
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

            this.addLog('success', '✅ Organization and associated data deleted successfully');
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
            item.innerHTML = `
                <div class="list-item-content">
                    <span>${user.email} - ${user.role}</span>
                </div>
                <div class="list-item-actions button-group">
                    <button class="btn btn--secondary" onclick="ui.showJoinEventModal('${user._id}')">Join Event</button>
                    <button class="btn btn--danger" onclick="ui.showUnjoinEventModal('${user._id}')">Un-join Event</button>
                </div>
            `;
            list.appendChild(item);
        });
        this.usersContent.innerHTML = '';
        this.usersContent.appendChild(list);
    }

    async showJoinEventModal(userId) {
        try {
            const response = await this.authenticatedFetch('/api/match-events');
            if (!response.ok) throw new Error('Failed to load match events');
            const events = await response.json();
            const form = this.getJoinEventForm(events);
            this.showModal('Join User to Event', form, () => this.joinUserToEvent(userId));
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    async showUnjoinEventModal(userId) {
        try {
            const response = await this.authenticatedFetch('/api/match-events');
            if (!response.ok) throw new Error('Failed to load match events');
            const events = await response.json();
            const form = this.getJoinEventForm(events);
            this.showModal('Un-join User from Event', form, () => this.unjoinUserFromEvent(userId));
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    getJoinEventForm(events) {
        let options = '<option value="">Select an event</option>';
        events.forEach(event => {
            options += `<option value="${event._id}">${event.title}</option>`;
        });

        return `
            <div class="form-group">
                <label class="label" for="event-select">Event</label>
                <select id="event-select" class="input">${options}</select>
            </div>
        `;
    }

    async joinUserToEvent(userId) {
        const eventId = document.getElementById('event-select').value;
        if (!eventId) {
            this.addLog('error', '❌ Please select an event');
            return;
        }

        try {
            const response = await this.authenticatedFetch(`/api/match-events/${eventId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });

            if (!response.ok) {
                throw new Error('Failed to join event');
            }

            this.addLog('success', '✅ User joined event successfully');
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    async unjoinUserFromEvent(userId) {
        const eventId = document.getElementById('event-select').value;
        if (!eventId) {
            this.addLog('error', '❌ Please select an event');
            return;
        }

        try {
            const response = await this.authenticatedFetch(`/api/match-events/${eventId}/unjoin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });

            if (!response.ok) {
                throw new Error('Failed to un-join event');
            }

            this.addLog('success', '✅ User un-joined event successfully');
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    async showCancelEventModal(eventId) {
        const form = `
            <div class="form-group">
                <label class="label" for="cancel-date-input">Date to cancel</label>
                <input type="date" id="cancel-date-input" class="input">
            </div>
        `;
        this.showModal('Cancel Match Event Iteration', form, () => this.cancelEventIteration(eventId));
    }

    async cancelEventIteration(eventId) {
        const date = document.getElementById('cancel-date-input').value;
        if (!date) {
            this.addLog('error', '❌ Please select a date');
            return;
        }

        try {
            const response = await this.authenticatedFetch(`/api/match-events/${eventId}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date })
            });

            if (!response.ok) {
                throw new Error('Failed to cancel event iteration');
            }

            this.addLog('success', '✅ Event iteration cancelled successfully');
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    addLog(type, message) {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        this.logContainer.appendChild(logEntry);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }

    showModal(title, message, onConfirm = null) {
        this.modalTitle.textContent = title;
        this.modalMessage.innerHTML = message;
        this.modal.style.display = 'flex';
        
        if (onConfirm) {
            this.modalOk.onclick = () => {
                this.hideModal();
                onConfirm();
            };
            this.modalCancel.style.display = 'inline-flex';
        } else {
            this.modalOk.onclick = () => this.hideModal();
            this.modalCancel.style.display = 'none';
        }
    }

    hideModal() {
        this.modal.style.display = 'none';
        this.modalOk.onclick = null;
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
                    <option value="admin">Admin</option>
                </select>
            </div>
        `;
    }

    async addEvent() {
        const title = document.getElementById('event-title-input').value.trim();
        const repeatEach = document.getElementById('event-repeat-select').value;

        if (!title) {
            this.addLog('error', '❌ Event title is required');
            return;
        }

        try {
            const response = await this.authenticatedFetch('/api/match-events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, repeatEach })
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
                headers: {
                    'Content-Type': 'application/json'
                },
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

    logout() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('organizationId');
        this.token = null;
        this.organizationId = null;
        this.loginSection.style.display = 'flex';
        this.dashboardSection.style.display = 'none';
        this.logoutBtn.style.display = 'none';
        this.addLog('info', '👋 Logged out');
    }
}


