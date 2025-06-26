class CLIWebUI {
    constructor() {
        this.token = null;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // Login elements
        this.loginSection = document.getElementById('login-section');
        this.emailInput = document.getElementById('email-input');
        this.passwordInput = document.getElementById('password-input');
        this.loginBtn = document.getElementById('login-btn');

        // Dashboard elements
        this.dashboardSection = document.getElementById('dashboard-section');
        this.matchEventsContent = document.getElementById('match-events-content');
        this.usersContent = document.getElementById('users-content');
        this.addEventBtn = document.getElementById('add-event-btn');
        this.addUserBtn = document.getElementById('add-user-btn');
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
        this.addEventBtn.addEventListener('click', () => this.showAddEventModal());
        this.addUserBtn.addEventListener('click', () => this.showAddUserModal());
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
            // Decode the token to get organizationId
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            this.organizationId = payload.organizationId;
            this.loginSection.style.display = 'none';
            this.dashboardSection.style.display = 'grid';
            this.addLog('success', '✅ Login successful');
            this.loadDashboard();
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    async loadDashboard() {
        this.loadMatchEvents();
        this.loadUsers();
        this.loadPublicEventLinks();
    }

    async loadPublicEventLinks() {
        try {
            // Assuming the organizationId can be retrieved from the logged-in user's token
            // For now, we'll use a placeholder or fetch it if available in the token payload
            // This needs to be properly handled on the backend to return organizationId with user data
            const response = await fetch(`/api/public/match-events?organizationId=${this.organizationId}`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
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
                <span>${event.title}: </span>
                <a href="${publicLink}" target="_blank">${publicLink}</a>
                <div class="code-example">
                    <textarea class="code-block" readonly>${iframeCode}</textarea>
                    <button class="btn btn--secondary copy-btn" data-clipboard-target="${iframeCode}">Copy</button>
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
            const response = await fetch('/api/match-events', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            if (!response.ok) throw new Error('Failed to load match events');
            const events = await response.json();
            this.renderMatchEvents(events);
        } catch (error) {
            this.addLog('error', `❌ ${error.message}`);
        }
    }

    async loadUsers() {
        try {
            const response = await fetch('/api/users', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
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
                <span>${event.title} (Repeats: ${event.repeatEach})</span>
                <button class="btn btn--danger" onclick="ui.showCancelEventModal('${event._id}')">Cancel Iteration</button>
            `;
            list.appendChild(item);
        });
        this.matchEventsContent.innerHTML = '';
        this.matchEventsContent.appendChild(list);
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
                <span>${user.email} - ${user.firstName || ''} ${user.lastName || ''}</span>
                <button class="btn btn--secondary" onclick="ui.showJoinEventModal('${user._id}')">Join Event</button>
                <button class="btn btn--danger" onclick="ui.showUnjoinEventModal('${user._id}')">Un-join Event</button>
            `;
            list.appendChild(item);
        });
        this.usersContent.innerHTML = '';
        this.usersContent.appendChild(list);
    }

    async showJoinEventModal(userId) {
        try {
            const response = await fetch('/api/match-events', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
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
            const response = await fetch('/api/match-events', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
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
            const response = await fetch(`/api/match-events/${eventId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
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
            const response = await fetch(`/api/match-events/${eventId}/unjoin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
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
            const response = await fetch(`/api/match-events/${eventId}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
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
                <label class="label" for="user-firstname-input">First Name</label>
                <input type="text" id="user-firstname-input" class="input" placeholder="First name...">
            </div>
            <div class="form-group">
                <label class="label" for="user-lastname-input">Last Name</label>
                <input type="text" id="user-lastname-input" class="input" placeholder="Last name...">
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
            const response = await fetch('/api/match-events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
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
        const firstName = document.getElementById('user-firstname-input').value.trim();
        const lastName = document.getElementById('user-lastname-input').value.trim();

        if (!email) {
            this.addLog('error', '❌ User email is required');
            return;
        }

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ email, firstName, lastName })
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
}


