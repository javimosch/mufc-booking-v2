function canManageUsers(vm){
    let scope =  {
        init(){
            scope.usersContent = document.getElementById('users-content');
            scope.addUserBtn = document.getElementById('add-user-btn');
            scope.addUserBtn.addEventListener('click', () => scope.showAddUserModal());
        },
        renderUsers(users) {
            if (users.length === 0) {
                scope.usersContent.innerHTML = '<p>No users found.</p>';
                return;
            }
            const list = document.createElement('ul');
            users.forEach(user => {
                const item = document.createElement('li');
                let actions = '';
                if (vm.canManageAccount.userRole === 'superAdmin' && user.role !== 'orgAdmin') {
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
            scope.usersContent.innerHTML = '';
            scope.usersContent.appendChild(list);
        },
        async loadUsers() {
            console.debug('Loading users...');
            try {
                const response = await vm.canUseApi.authenticatedFetch('/api/users');
                if (!response.ok) throw new Error('Failed to load users');
                const users = await response.json();
                scope.renderUsers&&scope.renderUsers(users);
            } catch (error) {
                console.error('Failed to load users:', error);
                vm.canLog.addLog('error', `❌ ${error.message}`);
            }
        },
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
        },
        showAddUserModal() {
            vm.canShowModal.showModal('Add User', scope.getUserForm(), () => scope.addUser());
        }, 
        showPromoteUserModal(userId, userEmail) {
            const message = `<p>Promote <strong>${userEmail}</strong> to an Organization Admin?</p>`;
            vm.canShowModal.showModal('Promote User', message, () => scope.promoteUser(userId));
        },
        async toggleCancelEventIteration(eventId, date, action) {
            console.debug('Toggling event iteration...');
            try {
                const response = await vm.canUseAPI.authenticatedFetch(`/api/match-events/${eventId}/${action}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ date })
                });
    
                if (!response.ok) {
                    throw new Error(`Failed to ${action} event iteration`);
                }
    
                vm.canLog.addLog('success', `✅ Event iteration ${action}ed successfully`);
                vm.canManageEvents.loadMatchEvents(); // Reload events to update UI
            } catch (error) {
                vm.canLog.addLog('error', `❌ ${error.message}`);
            }
        },
        async promoteUser(userId) {
            console.debug('Promoting user...');
            try {
                const response = await vm.canUseAPI.authenticatedFetch(`/api/users/${userId}/role`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ role: 'orgAdmin' })
                });
    
                if (!response.ok) {
                    throw new Error('Failed to promote user');
                }
    
                vm.canLog.addLog('success', '✅ User promoted successfully');
                scope.loadUsers();
            } catch (error) {
                vm.canLog.addLog('error', `❌ ${error.message}`);
            }
        },   
        async addUser() {
            console.debug('Adding user...');
            const email = document.getElementById('user-email-input').value.trim();
            const password = document.getElementById('user-password-input').value.trim();
            const role = document.getElementById('user-role-select').value;
    
            if (!email || !password) {
                vm.canLog.addLog('error', '❌ Email and password are required');
                return;
            }
    
            try {
                const response = await vm.canUseAPI.authenticatedFetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, role })
                });
    
                if (!response.ok) {
                    throw new Error('Failed to add user');
                }
                vm.canLog.addLog('success', '✅ User added successfully');
                scope.loadUsers();
            } catch (error) {
                console.error('Failed to add user:', error);
                vm.canLog.addLog('error', `❌ ${error.message}`);
            }
        }
    }
    return scope;
}