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
        renderMatchEvents(events) {
            if (events.length === 0) {
                scope.matchEventsContent.innerHTML = '<p>No match events found.</p>';
                return;
            }
            const list = document.createElement('ul');
            events.forEach(event => {
                const iterations = scope.getFutureIterations(event);
                let iterationsHtml = '';
                if (iterations.length > 0) {
                    iterationsHtml = iterations.map(iteration => {
                        const statusClass = iteration.isCancelled ? 'cancelled' : 'active';
                        const buttonText = iteration.isCancelled ? 'Uncancel' : 'Cancel';
                        const buttonClass = iteration.isCancelled ? 'btn--secondary' : 'btn--danger';
                        const action = iteration.isCancelled ? 'uncancel' : 'cancel';
                        return `
                            <li class="iteration-item ${statusClass}">
                                <span>${event.title} - ${formatDate(iteration.date)}</span>
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
                        <p>Start Date: ${formatDate(event.startDate)}</p>
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
            scope.matchEventsContent.innerHTML = '';
            scope.matchEventsContent.appendChild(list);
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
            console.debug('Loading match events...');
            try {
                const response = await vm.canUseApi.authenticatedFetch('/api/match-events');
                if (!response.ok) throw new Error('Failed to load match events');
                const events = await response.json();
                scope.renderMatchEvents(events);
            } catch (error) {
                console.error('Failed to load match events:', error);
                vm.canLog.addLog('error', `❌ ${error.message}`);
            }
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