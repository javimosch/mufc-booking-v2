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
            if (events.length === 0) {
                scope.publicEventLinksContent.innerHTML = '<p>No public event links found.</p>';
                return;
            }
            const list = document.createElement('ul');
            events.forEach(event => {
                const organizationId = vm.canManageOrgs.organizationId;
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
            scope.publicEventLinksContent.innerHTML = '';
            scope.publicEventLinksContent.appendChild(list);
    
            document.querySelectorAll('.copy-btn').forEach(button => {
                button.addEventListener('click', (event) => copyToClipboard(event.target.dataset.clipboardText));
            });
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