class EmbedUI {
    // Helper function to format date to DD-MM-YYYY
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    constructor() {
        console.debug('EmbedUI constructor called');
        // Initialize current language from localStorage or default to 'en'
        this.currentLanguage = localStorage.getItem('language') || 'en';
        console.debug('Current language set to:', this.currentLanguage);
        this.translations = {
            fr: {
                matchEvent: 'Événement de Match',
                nickname: 'Surnom',
                enterNickname: 'Entrez votre surnom...',
                email: 'Email',
                enterEmail: 'Entrez votre email...',
                join: 'Rejoindre',
                unjoin: 'Se désinscrire',
                joinedUsers: 'Participants',
                noOneJoined: 'Personne n\'a encore rejoint cet événement.',
                missingEventOrOrgId: 'Paramètre eventId ou organizationId manquant.',
                failedToLoadEvent: 'Échec du chargement des détails de l\'événement.',
                failedToLoadEvents: 'Échec du chargement des événements.',
                enterEmailAndNickname: 'Veuillez entrer votre email et votre surnom',
                successfullyJoined: 'Vous avez rejoint l\'événement avec succès !',
                failedToJoin: 'Échec de l\'inscription à l\'événement.',
                enterEmail: 'Veuillez entrer votre email',
                successfullyUnjoined: 'Vous vous êtes désinscrit de l\'événement avec succès !',
                failedToUnjoin: 'Échec de la désinscription de l\'événement.',
                noEventsFound: 'Aucun événement trouvé.',
                selectEvent: 'Sélectionnez un événement',
                language: 'Langue',
                repeats: 'Répétitions',
                week: 'Hebdomadaire',
                month: 'Mensuel',
                none: 'Aucune'
            },
            en: {
                matchEvent: 'Match Event',
                nickname: 'Nickname',
                enterNickname: 'Enter your nickname...',
                email: 'Email',
                enterEmail: 'Enter your email...',
                join: 'Join',
                unjoin: 'Un-join',
                joinedUsers: 'Joined Users',
                noOneJoined: 'No one has joined this event yet.',
                missingEventOrOrgId: 'Missing eventId or organizationId parameter.',
                failedToLoadEvent: 'Failed to load event details.',
                failedToLoadEvents: 'Failed to load events.',
                enterEmailAndNickname: 'Please enter your email and nickname',
                successfullyJoined: 'Successfully joined the event!',
                failedToJoin: 'Failed to join event.',
                enterEmail: 'Please enter your email',
                successfullyUnjoined: 'Successfully un-joined from the event!',
                failedToUnjoin: 'Failed to un-join event.',
                noEventsFound: 'No events found.',
                selectEvent: 'Select an event',
                language: 'Language',
                repeats: 'Repeats',
                week: 'Weekly',
                month: 'Monthly',
                none: 'None'
            },
            es: {
                matchEvent: 'Evento de Partido',
                nickname: 'Apodo',
                enterNickname: 'Introduce tu apodo...', 
                email: 'Correo electrónico',
                enterEmail: 'Introduce tu correo electrónico...', 
                join: 'Unirse',
                unjoin: 'Desvincular',
                joinedUsers: 'Usuarios Unidos',
                noOneJoined: 'Nadie se ha unido a este evento todavía.',
                missingEventOrOrgId: 'Falta el parámetro eventId o organizationId.',
                failedToLoadEvent: 'Error al cargar los detalles del evento.',
                failedToLoadEvents: 'Error al cargar los eventos.',
                enterEmailAndNickname: 'Por favor, introduce tu correo electrónico y apodo',
                successfullyJoined: '¡Te has unido al evento con éxito!',
                failedToJoin: 'Error al unirse al evento.',
                enterEmail: 'Por favor, introduce tu correo electrónico',
                successfullyUnjoined: '¡Te has desvinculado del evento con éxito!',
                failedToUnjoin: 'Error al desvincularse del evento.',
                noEventsFound: 'No se encontraron eventos.',
                selectEvent: 'Selecciona un evento',
                language: 'Idioma',
                repeats: 'Repeticiones',
                week: 'Semanal',
                month: 'Mensual',
                none: 'Ninguna'
            },
            pr: {
                matchEvent: 'Evento de Partida',
                nickname: 'Apelido',
                enterNickname: 'Digite seu apelido...', 
                email: 'Email',
                enterEmail: 'Digite seu email...', 
                join: 'Participar',
                unjoin: 'Sair',
                joinedUsers: 'Usuários Participantes',
                noOneJoined: 'Ninguém se juntou a este evento ainda.',
                missingEventOrOrgId: 'Parâmetro eventId ou organizationId ausente.',
                failedToLoadEvent: 'Falha ao carregar detalhes do evento.',
                failedToLoadEvents: 'Falha ao carregar eventos.',
                enterEmailAndNickname: 'Por favor, digite seu email e apelido',
                successfullyJoined: 'Você se juntou ao evento com sucesso!',
                failedToJoin: 'Falha ao participar do evento.',
                enterEmail: 'Por favor, digite seu email',
                successfullyUnjoined: 'Você saiu do evento com sucesso!',
                failedToUnjoin: 'Falha ao sair do evento.',
                noEventsFound: 'Nenhum evento encontrado.',
                selectEvent: 'Selecione um evento',
                language: 'Idioma',
                repeats: 'Repetições',
                week: 'Semanal',
                month: 'Mensal',
                none: 'Nenhuma'
            }
        };
        this.currentLanguage = localStorage.getItem('language') || 'fr'; // Default to French
        this.initializeElements();
        this.bindEvents();
        this.setLanguage(this.currentLanguage); // Set language on initialization
        this.init();
    }

    initializeElements() {
        this.singleEventMode = document.getElementById('single-event-mode');
        this.multiEventMode = document.getElementById('multi-event-mode');

        // Single event mode elements
        this.eventDetails = document.getElementById('event-details');
        this.nicknameInput = document.getElementById('nickname-input');
        this.emailInput = document.getElementById('embed-email-input');
        this.joinBtn = document.getElementById('join-btn');
        this.unjoinBtn = document.getElementById('unjoin-btn');
        this.joinedUsersList = document.getElementById('joined-users-list');
        this.languageSelect = document.getElementById('language-select');
        
        // Set the language selector to the current language
        if (this.languageSelect) {
            this.languageSelect.value = this.currentLanguage;
            console.debug('Language selector set to:', this.currentLanguage);
        }

        // Multi event mode elements
        this.searchInput = document.getElementById('search-input');
        this.eventsList = document.getElementById('events-list');
    }

    bindEvents() {
        this.joinBtn.addEventListener('click', () => this.joinEvent());
        this.unjoinBtn.addEventListener('click', () => this.unjoinEvent());
        this.searchInput.addEventListener('input', () => this.filterEvents());
        this.languageSelect.addEventListener('change', (e) => this.setLanguage(e.target.value));
    }

    setLanguage(lang) {
        console.debug('Changing language to:', lang);
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        // Update UI elements with new language
        if (this.languageSelect) {
            this.languageSelect.value = lang;
        }
        
        // Apply translations to UI elements
        this.applyLanguage();
        
        // If we have an event loaded, refresh it to update text
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('eventId');
        if (eventId) {
            this.loadEvent(eventId);
        }
    }
    
    // Helper method to apply translations to UI elements
    applyLanguage() {
        console.debug('Applying language:', this.currentLanguage);
        // Update static UI elements with current language
        if (this.joinBtn) {
            this.joinBtn.textContent = this.translations[this.currentLanguage].join;
        }
        if (this.unjoinBtn) {
            this.unjoinBtn.textContent = this.translations[this.currentLanguage].unjoin;
        }
        
        // Update labels
        const labels = document.querySelectorAll('.label');
        labels.forEach(label => {
            const forAttr = label.getAttribute('for');
            if (forAttr === 'language-select') {
                label.textContent = this.translations[this.currentLanguage].language;
            } else if (forAttr === 'nickname-input') {
                label.textContent = this.translations[this.currentLanguage].nickname;
            } else if (forAttr === 'embed-email-input') {
                label.textContent = this.translations[this.currentLanguage].email;
            }
        });
        
        // Update placeholders
        if (this.nicknameInput) {
            this.nicknameInput.placeholder = this.translations[this.currentLanguage].enterNickname;
        }
        if (this.emailInput) {
            this.emailInput.placeholder = this.translations[this.currentLanguage].enterEmail;
        }
        
        // Update heading if it exists
        const heading = document.querySelector('.heading--section');
        if (heading && heading.textContent.includes('Match Event')) {
            heading.textContent = '📅 ' + this.translations[this.currentLanguage].matchEvent;
        }
        
        // Update joined users heading
        const joinedUsersHeading = document.querySelector('.joined-users-section h3');
        if (joinedUsersHeading) {
            joinedUsersHeading.textContent = this.translations[this.currentLanguage].joinedUsers + ':';
        }
    }

    init() {
        console.debug('EmbedUI init called');
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('eventId');
        const organizationId = urlParams.get('organizationId');
        
        // Apply current language to UI elements
        this.applyLanguage();

        if (eventId) {
            this.singleEventMode.style.display = 'block';
            this.loadEvent(eventId);
        } else if (organizationId) {
            this.multiEventMode.style.display = 'block';
            this.loadEvents(organizationId);
        } else {
            document.body.innerHTML = `<p>${this.translations[this.currentLanguage].missingEventOrOrgId}</p>`;
        }
    }

    async loadEvent(eventId) {
        try {
            const response = await fetch(`/api/match-events/${eventId}`);
            if (!response.ok) throw new Error(this.translations[this.currentLanguage].failedToLoadEvent);
            const event = await response.json();
            this.renderEventDetails(event);
            this.renderJoinedUsers(event.subscriptions);
        } catch (error) {
            this.eventDetails.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    }

    async loadEvents(organizationId) {
        try {
            const response = await fetch(`/api/public/match-events?organizationId=${organizationId}`);
            if (!response.ok) throw new Error(this.translations[this.currentLanguage].failedToLoadEvents);
            const events = await response.json();
            this.renderEventsList(events);
        } catch (error) {
            this.eventsList.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    }

    renderEventsList(events) {
        if (events.length === 0) {
            this.eventsList.innerHTML = `<p>${this.translations[this.currentLanguage].noEventsFound}</p>`;
            return;
        }
        const list = document.createElement('ul');
        events.forEach(event => {
            const item = document.createElement('li');
            item.innerHTML = `
                <div class="list-item-content">
                    <span>${event.title}</span>
                </div>
                <div class="list-item-actions button-group">
                    <button class="btn btn--primary" onclick="embedUi.showJoinModal('${event._id}')">${this.translations[this.currentLanguage].join}</button>
                </div>
            `;
            list.appendChild(item);
        });
        this.eventsList.innerHTML = '';
        this.eventsList.appendChild(list);
    }

    filterEvents() {
        const filter = this.searchInput.value.toUpperCase();
        const ul = this.eventsList.querySelector('ul');
        const li = ul.getElementsByTagName('li');
        for (let i = 0; i < li.length; i++) {
            const span = li[i].getElementsByTagName("span")[0];
            const txtValue = span.textContent || span.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }

    renderEventDetails(event) {
        console.debug('Rendering event details with repeat value:', event.repeatEach);
        // Translate the repeat value
        const translatedRepeat = this.translations[this.currentLanguage][event.repeatEach] || event.repeatEach;
        
        let nextIterationText = '';
        if (event.repeatEach !== 'none' && event.startDate) {
            const nextIteration = this.getNextIterationDate(event);
            if (nextIteration) {
                nextIterationText = `<p>Next Iteration: ${this.formatDate(nextIteration)}</p>`;
            }
        }

        this.eventDetails.innerHTML = `
            <h3>${event.title}</h3>
            <p>${this.translations[this.currentLanguage].repeats}: ${translatedRepeat}</p>
            ${nextIterationText}
        `;
    }

    // Helper function to calculate the next event iteration date
    getNextIterationDate(event) {
        if (!event.startDate || isNaN(new Date(event.startDate).getTime())) return null;

        let currentDate = new Date(event.startDate);
        currentDate.setHours(0, 0, 0, 0); // Normalize to start of day
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // If the start date is in the past, advance to the next occurrence
        while (currentDate < today) {
            if (event.repeatEach === 'week') {
                currentDate.setDate(currentDate.getDate() + 7);
            } else if (event.repeatEach === 'month') {
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else {
                // No repeat, so only the start date is relevant and it's in the past
                return null;
            }
        }

        // Check if the current iteration is cancelled
        const isCancelled = event.metadata && event.metadata.cancelledDates &&
                            event.metadata.cancelledDates.includes(currentDate.toISOString().split('T')[0]);

        if (isCancelled) {
            // If cancelled, find the next uncancelled iteration
            if (event.repeatEach === 'week') {
                currentDate.setDate(currentDate.getDate() + 7);
            } else if (event.repeatEach === 'month') {
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else {
                return null; // No repeat, and current is cancelled
            }
            // Recursively call to check the next date
            return this.getNextIterationDate({ ...event, startDate: currentDate.toISOString().split('T')[0] });
        }

        return currentDate.toISOString().split('T')[0];
    }

    renderJoinedUsers(subscriptions) {
        if (subscriptions.length === 0) {
            this.joinedUsersList.innerHTML = `<p>${this.translations[this.currentLanguage].noOneJoined}</p>`;
            return;
        }
        const list = document.createElement('ul');
        subscriptions.forEach(sub => {
            const item = document.createElement('li');
            item.innerHTML = `
                <div class="list-item-content">
                    <span>${sub.metadata.nickname || sub.userId}</span>
                </div>
            `;
            list.appendChild(item);
        });
        this.joinedUsersList.innerHTML = '';
        this.joinedUsersList.appendChild(list);
    }

    async joinEvent() {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('eventId');
        const email = this.emailInput.value.trim();
        const nickname = this.nicknameInput.value.trim();

        if (!email || !nickname) {
            alert(this.translations[this.currentLanguage].enterEmailAndNickname);
            return;
        }

        try {
            const response = await fetch(`/api/public/match-events/${eventId}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, nickname })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            alert(this.translations[this.currentLanguage].successfullyJoined);
            this.loadEvent(eventId);
        } catch (error) {
            alert(`${this.translations[this.currentLanguage].failedToJoin}: ${error.message}`);
        }
    }

    async unjoinEvent() {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('eventId');
        const email = this.emailInput.value.trim();

        if (!email) {
            alert(this.translations[this.currentLanguage].enterEmail);
            return;
        }

        try {
            const response = await fetch(`/api/public/match-events/${eventId}/unjoin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            alert(this.translations[this.currentLanguage].successfullyUnjoined);
            this.loadEvent(eventId);
        } catch (error) {
            alert(`${this.translations[this.currentLanguage].failedToUnjoin}: ${error.message}`);
        }
    }
}

// Initialize the EmbedUI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.debug('DOM content loaded in iframe view');
    window.embedUi = new EmbedUI();
});
