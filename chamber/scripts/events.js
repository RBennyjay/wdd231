
// This script dynamically loads and displays a list of events on the page

document.addEventListener('DOMContentLoaded', () => {
    const eventListContainer = document.getElementById('eventList');
    const showMoreBtn = document.getElementById('showMoreEventsBtn');

    // Your complete list of events
    const allEvents = [
        { date: 'May 28', title: 'Annual Business Summit', time: '9:00 AM - 5:00 PM' },
        { date: 'June 5', title: 'Networking Mixer', time: '6:00 PM - 8:00 PM' },
        { date: 'July 1', title: 'Small Business Workshop', time: '10:00 AM - 12:00 PM' },
        { date: 'July 15', title: 'Community Service Day', time: 'All Day' },
        { date: 'August 10', title: 'Tech Innovation Expo', time: '9:00 AM - 6:00 PM' },
        { date: 'August 22', title: 'Start-up Pitch Competition', time: '2:00 PM - 5:00 PM' },
        { date: 'September 5', title: 'Digital Marketing Seminar', time: '1:00 PM - 4:00 PM' },
        { date: 'September 18', title: 'Export Opportunities Forum', time: '9:30 AM - 1:00 PM' },
        // Add more events here as needed
    ];

    const eventsPerLoad = 4; // How many events to show initially and load each time
    let eventsDisplayedCount = 0;

    function createEventListItem(event) {
        const li = document.createElement('li');

        const dateP = document.createElement('p');
        dateP.classList.add('event-date');
        dateP.textContent = event.date;

        const titleP = document.createElement('p');
        titleP.classList.add('event-title');
        titleP.textContent = event.title;

        const timeP = document.createElement('p');
        timeP.classList.add('event-time');
        timeP.textContent = event.time;

        li.appendChild(dateP);
        li.appendChild(titleP);
        li.appendChild(timeP);

        return li;
    }

    function loadEvents() {
        const startIndex = eventsDisplayedCount;
        const endIndex = Math.min(eventsDisplayedCount + eventsPerLoad, allEvents.length);

        for (let i = startIndex; i < endIndex; i++) {
            const eventItem = createEventListItem(allEvents[i]);
            eventListContainer.appendChild(eventItem);
        }

        eventsDisplayedCount = endIndex; // Update the count of displayed events

        // Hide the "See More Events" button if all events are displayed
        if (eventsDisplayedCount >= allEvents.length) {
            showMoreBtn.style.display = 'none';
        }
    }

    // Initial load of events when the page loads
    if (eventListContainer && showMoreBtn) {
        loadEvents(); // Load the first batch

        // Add event listener for the "See More Events" button
        showMoreBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            loadEvents(); // Load the next batch of events
        });
    }
});