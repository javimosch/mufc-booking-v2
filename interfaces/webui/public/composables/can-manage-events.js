function canManageEvents(vm){
    let scope = {
        init(){
            scope.addEventBtn = document.getElementById('add-event-btn');
            scope.publicEventLinksContent = document.getElementById('public-event-links-content');
            scope.matchEventsContent = document.getElementById('match-events-content');
            scope.addEventBtn.addEventListener('click', () => scope.showAddEventModal());
        },
        getFutureIterations(event, count = 5) {
            return EventService.getFutureIterations(event, count);
        },
        async loadPublicEventLinks() {
            console.debug('Loading public events...');
            try {
                // Check if organizationId exists before making the request
                if (!vm.canManageOrgs.organizationId) {
                    console.debug('No organizationId available for public events');
                    scope.renderPublicEventLinks([]);
                    return;
                }
                
                console.debug('Loading public events with organizationId:', vm.canManageOrgs.organizationId);
                const response = await vm.canUseApi.authenticatedFetch(`/api/public/match-events?organizationId=${vm.canManageOrgs.organizationId}`);
                if (!response.ok) throw new Error('Failed to load match events for public links');
                const events = await response.json();
                scope.renderPublicEventLinks(events);
            } catch (error) {
                console.debug('Error loading public events:', error);
                vm.canLog.addLog('error', `❌ ${error.message}`);
            }
        },
        renderMatchEvents(events, usersMap = new Map()) {
            const container = document.getElementById('match-events-content');
            container.innerHTML = '';
            
            if (!events || events.length === 0) {
                container.innerHTML = '<p class="text-center py-4">No events found.</p>';
                return;
            }
            
            // EventService is an object, not a constructor
            
            events.forEach(event => {
                // Always get at least 5 iterations (or 1 if not repeating)
                const count = event.repeatEach === 'none' ? 1 : 5;
                const iterations = EventService.getFutureIterations(event, count);
                console.debug(`Getting ${count} iterations for event ${event.title}:`, iterations);
                
                let iterationsHtml = '';
                if (iterations.length > 0) {
                    iterationsHtml = iterations.map(iteration => {
                        // Get participants for this specific iteration
                        const iterationDate = iteration.date;
                        const iterationParticipants = event.subscriptions
                            .filter(sub => sub.iterationDate === iterationDate)
                            .map(sub => {
                                const user = usersMap.get(sub.userId);
                                return {
                                    id: sub.userId,
                                    nickname: sub.metadata?.nickname || '',
                                    email: user?.email || 'Unknown',
                                    displayName: user?.nickname || user?.email || 'Unknown User'
                                };
                            });
                        
                        console.debug(`Iteration ${iterationDate} has ${iterationParticipants.length} participants`);
                        
                        // Create participant badges HTML
                        let participantBadgesHtml = '';
                        const maxDisplayParticipants = 5; // Show only first 5 participants
                        
                        const displayParticipants = iterationParticipants.slice(0, maxDisplayParticipants);
                        const remainingCount = iterationParticipants.length - maxDisplayParticipants;
                        
                        if (iterationParticipants.length > 0) {
                            participantBadgesHtml = displayParticipants.map(participant => {
                                return `<div class="badge badge-outline tooltip" data-tip="${participant.email}">
                                    ${participant.nickname || participant.displayName}
                                </div>`;
                            }).join('');
                            
                            // Add a badge showing the remaining count if needed
                            if (remainingCount > 0) {
                                participantBadgesHtml += `<div class="badge badge-outline">+${remainingCount} more</div>`;
                            }
                            
                            // Add the total count badge
                            participantBadgesHtml += `<div class="badge badge-primary">${iterationParticipants.length} total</div>`;
                        } else {
                            participantBadgesHtml = '<div class="badge badge-outline">No participants</div>';
                        }
                        
                        return `
                        <div class="card bg-base-100 shadow-sm mb-2">
                            <div class="card-body p-4">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <h3 class="text-lg font-semibold">${iteration.date}</h3>
                                        <p class="text-sm">${iteration.isCancelled ? '<span class="text-error">Cancelled</span>' : 'Active'}</p>
                                    </div>
                                    <div>
                                        <button 
                                            class="btn btn-sm ${iteration.isCancelled ? 'btn-success' : 'btn-error'}"
                                            data-event-id="${event._id}"
                                            data-date="${iteration.date}"
                                            onclick="canManageEvents.${iteration.isCancelled ? 'uncancel' : 'cancel'}Iteration(this)"
                                        >
                                            ${iteration.isCancelled ? 'Uncancel' : 'Cancel'}
                                        </button>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <p class="text-sm font-medium mb-2">Participants:</p>
                                    <div class="flex flex-wrap gap-2">
                                        ${participantBadgesHtml}
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                    }).join('');
                } else {
                    iterationsHtml = '<p class="text-center py-2">No upcoming iterations.</p>';
                }
        
                const item = document.createElement('li');
                item.innerHTML = `
                    <div class="list-item-content">
                        <h3>${event.title} (Repeats: ${event.repeatEach})</h3>
                        <p>Start Date: ${formatDate(event.startDate)}</p>
                    </div>
                    <div class="list-item-actions button-group">
                        <button class="btn btn--danger" onclick="ui.canManageEvents.showDeleteEventModal('${event._id}', '${event.title}')">Delete Event</button>
                    </div>
                    <div class="event-iterations">
                        <h4>Upcoming Iterations:</h4>
                        <ul>${iterationsHtml}</ul>
                    </div>
                `;
                container.appendChild(item);
            });
        },    
        showDeleteEventModal(eventId, eventTitle) {
            const message = `<p>Are you sure you want to delete the event <strong>${eventTitle}</strong>? This action cannot be undone.</p>`;
            vm.canShowModal.showModal('Delete Event', message, () => scope.deleteEvent(eventId));
        },
        async deleteEvent(eventId) {
            console.debug('Deleting event with eventId:', eventId);
            try {
                const response = await vm.canUseApi.authenticatedFetch(`/api/match-events/${eventId}`, {
                    method: 'DELETE'
                });
    
                if (!response.ok) {
                    throw new Error('Failed to delete event');
                }
    
                vm.canLog.addLog('success', '✅ Event deleted successfully');
                scope.loadMatchEvents();
            } catch (error) {
                console.error('Failed to delete event:', error);
                vm.canLog.addLog('error', `❌ ${error.message}`);
            }
        },
        async loadMatchEvents() {
            const response = await vm.canUseApi.authenticatedFetch('/api/match-events');
            const events = await response.json();
            
            // Fetch all user details for subscriptions
            const userIds = new Set();
            events.forEach(event => {
                event.subscriptions.forEach(sub => {
                    userIds.add(sub.userId);
                });
            });
            
            // Convert Set to Array for the API call
            const userIdsArray = Array.from(userIds);
            
            // Only fetch users if there are subscriptions
            let usersMap = new Map();
            if (userIdsArray.length > 0) {
                try {
                    console.debug('Fetching user details for subscriptions:', userIdsArray);
                    const usersResponse = await vm.canUseApi.authenticatedFetch('/api/users/bulk-get', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ userIds: userIdsArray })
                    });
                    
                    if (!usersResponse.ok) {
                        throw new Error(`Failed to fetch users: ${usersResponse.status}`);
                    }
                    
                    const users = await usersResponse.json();
                    console.debug(`Received ${users.length} users for subscriptions`);
                    
                    // Create a map for quick lookup
                    if (Array.isArray(users)) {
                        users.forEach(user => {
                            usersMap.set(user._id, user);
                        });
                    } else {
                        console.error('Expected users array but got:', users);
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    vm.canLog.addLog('error', `❌ Failed to load user details: ${error.message}`);
                }
            }
            
            console.debug('Loaded events with iteration-specific subscriptions:', events);
            scope.renderMatchEvents(events, usersMap);
        },
        showAddEventModal() {
            vm.canShowModal.showModal('Add Match Event', scope.getEventForm(), () => scope.addEvent());
        },
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
        },
        renderPublicEventLinks(events) {
            // Clear previous content
            scope.publicEventLinksContent.innerHTML = '';
            
            if (events.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.className = 'text-center p-6';
                emptyState.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <p class="mt-2 text-lg">No public event links found.</p>
                `;
                scope.publicEventLinksContent.appendChild(emptyState);
                return;
            }
            
            // Create grid container for cards
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 gap-6';
            
            events.forEach(event => {
                const organizationId = vm.canManageOrgs.organizationId;
                const publicLink = `${window.location.origin}/iframe?eventId=${event._id}&organizationId=${organizationId}`;
                const iframeCode = `<iframe src="${publicLink}" width="600" height="400" frameborder="0"></iframe>`;
                
                // Create card for each event
                const card = document.createElement('div');
                card.className = 'card glass-card shadow-lg';
                
                // Create card content
                card.innerHTML = `
                    <div class="card-body">
                        <h3 class="card-title text-lg font-bold">${event.title}</h3>
                        
                        <!-- Direct Link Section -->
                        <div class="mt-3">
                            <label class="text-sm font-medium opacity-70">Direct Link:</label>
                            <div class="flex mt-1 rounded-md overflow-hidden bg-base-300 shadow-sm">
                                <input type="text" value="${publicLink}" readonly class="flex-grow bg-base-300 p-2 text-sm focus:outline-none overflow-x-auto whitespace-nowrap" />
                                <button class="copy-link-btn p-2 bg-base-300 hover:bg-base-200 transition-colors" data-clipboard-text="${publicLink}" title="Copy Link">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Embed Code Section -->
                        <div class="mt-4">
                            <label class="text-sm font-medium opacity-70">Embed Code:</label>
                            <div class="mt-1 relative">
                                <pre class="bg-base-300 p-3 rounded-md text-xs overflow-x-auto">${iframeCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
                                <button class="copy-iframe-btn absolute top-2 right-2 p-1.5 rounded-md bg-base-200 hover:bg-base-100 transition-colors" data-clipboard-text='${iframeCode}' title="Copy Embed Code">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Preview Section -->
                        <div class="mt-4">
                            <label class="text-sm font-medium opacity-70">Preview:</label>
                            <div class="mt-2 border border-base-300 rounded-md p-2 bg-base-300 overflow-hidden">
                                <div class="aspect-video relative flex items-center justify-center">
                                    <button class="preview-btn btn btn-sm btn-primary" data-url="${publicLink}">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Open Preview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                grid.appendChild(card);
            });
            
            scope.publicEventLinksContent.appendChild(grid);
            
            // Add event listeners for copy buttons using proper context
            const copyLinkButtons = document.querySelectorAll('.copy-link-btn');
            const copyIframeButtons = document.querySelectorAll('.copy-iframe-btn');
            const previewButtons = document.querySelectorAll('.preview-btn');
            
            copyLinkButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const textToCopy = this.dataset.clipboardText;
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        vm.canLog.addLog('success', '✅ Direct link copied to clipboard!');
                        // Visual feedback
                        this.classList.add('bg-success', 'text-success-content');
                        setTimeout(() => {
                            this.classList.remove('bg-success', 'text-success-content');
                        }, 1000);
                    }).catch(err => {
                        vm.canLog.addLog('error', '❌ Failed to copy link to clipboard.');
                        console.error('Error copying to clipboard:', err);
                    });
                });
            });
            
            copyIframeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const textToCopy = this.dataset.clipboardText;
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        vm.canLog.addLog('success', '✅ Embed code copied to clipboard!');
                        // Visual feedback
                        this.classList.add('bg-success', 'text-success-content');
                        setTimeout(() => {
                            this.classList.remove('bg-success', 'text-success-content');
                        }, 1000);
                    }).catch(err => {
                        vm.canLog.addLog('error', '❌ Failed to copy embed code to clipboard.');
                        console.error('Error copying to clipboard:', err);
                    });
                });
            });
            
            previewButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const url = this.dataset.url;
                    window.open(url, '_blank');
                });
            });
            
            console.debug('Public event links rendered:', events.length);
        },
        async addEvent() {
            console.debug('Adding event...');
            const title = document.getElementById('event-title-input').value.trim();
            const startDate = new Date(document.getElementById('event-start-date-input').value);
            const isoStartDate = startDate.toISOString().split('T')[0];
            const repeatEach = document.getElementById('event-repeat-select').value;
    
            if (!title || !isoStartDate) {
                vm.canLog.addLog('error', '❌ Event title and start date are required');
                return;
            }
    
            try {
                const response = await vm.canUseApi.authenticatedFetch('/api/match-events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, startDate: isoStartDate, repeatEach })
                });
    
                if (!response.ok) {
                    throw new Error('Failed to add event');
                }
    
                vm.canLog.addLog('success', '✅ Event added successfully');
                scope.loadMatchEvents();
            } catch (error) {
                console.error('Failed to add event:', error);
                vm.canLog.addLog('error', `❌ ${error.message}`);
            }
        }
    }
    return scope;
}