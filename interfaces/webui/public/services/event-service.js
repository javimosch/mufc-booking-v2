const EventService = {
    /**
     * Returns the future iterations of an event
     * @param {Object} evt - The event object
     * @param {number} count - The number of iterations to return
     * @returns {Array} - An array of iteration objects
     */
    getFutureIterations(evt,count){
        const iterations = [];
        if (!evt.startDate) return iterations;
    
        let currentDate = new Date(evt.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        while (iterations.length < count) {
            if (currentDate >= today) {
                const dateString = currentDate.toISOString().split('T')[0];
                // Check if cancelledDates exists before calling .some()
                const isCancelled = evt.cancelledDates && Array.isArray(evt.cancelledDates) ? 
                    evt.cancelledDates.some(d => new Date(d).toISOString().split('T')[0] === dateString) : false;
                iterations.push({
                    date: dateString,
                    isCancelled: isCancelled
                });
            }
    
            if (evt.repeatEach === 'week') {
                currentDate.setDate(currentDate.getDate() + 7);
            } else if (evt.repeatEach === 'month') {
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else {
                break; 
            }
        }
        return iterations;
    }
}
