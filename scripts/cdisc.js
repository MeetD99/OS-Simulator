class DiskScheduler {
    constructor() {
        this.requests = [];
        this.initialPosition = 0;
        this.direction = 'right';
        this.totalSeekOperations = 0;
        this.seekSequence = [];
    }

    setCLookInputs(requests, initialPosition, direction) {
        this.requests = requests.filter(position => position !== 0); // Filter out position 0
        this.initialPosition = initialPosition !== 0 ? initialPosition : this.findNearestPosition(); // Adjust initial position if 0
        this.direction = direction;
    }

    findNearestPosition() {
        if (this.direction === 'right') {
            return Math.min(...this.requests);
        } else if (this.direction === 'left') {
            return Math.max(...this.requests);
        }
    }

    cLook() {
        if (this.requests.length === 0) return;
    
        // Copy and sort the requests
        const sortedRequests = this.requests.slice().sort((a, b) => a - b);
    
        // Find the current position index in the sorted array
        let currentIndex = sortedRequests.indexOf(this.initialPosition);
        if (currentIndex === -1) {
            // If the initial position is not in the requests, add it to the requests
            sortedRequests.push(this.initialPosition);
            sortedRequests.sort((a, b) => a - b);
            currentIndex = sortedRequests.indexOf(this.initialPosition);
        }
    
        // Add the initial head position to the seek sequence if it's present in the request sequence
        if (sortedRequests.includes(this.initialPosition)) {
            this.seekSequence.push(this.initialPosition);
        }
    
        // Iterate through the requests based on the direction
        let currentPosition = this.initialPosition;
        if (this.direction === 'right') {
            // Move to the right until the last request
            for (let i = currentIndex + 1; i < sortedRequests.length; i++) {
                this.totalSeekOperations += Math.abs(sortedRequests[i] - currentPosition);
                currentPosition = sortedRequests[i];
                this.seekSequence.push(currentPosition);
            }
    
            // Move to the first request and then continue to the last request in the opposite direction
            for (let i = 0; i < currentIndex; i++) {
                this.totalSeekOperations += Math.abs(sortedRequests[i] - currentPosition);
                currentPosition = sortedRequests[i];
                this.seekSequence.push(currentPosition);
            }
        } else if (this.direction === 'left') {
            // Move to the left until the last request
            for (let i = currentIndex - 1; i >= 0; i--) {
                this.totalSeekOperations += Math.abs(sortedRequests[i] - currentPosition);
                currentPosition = sortedRequests[i];
                this.seekSequence.push(currentPosition);
            }
    
            // Move to the last request and then continue to the first request in the opposite direction
            for (let i = sortedRequests.length - 1; i > currentIndex; i--) {
                this.totalSeekOperations += Math.abs(sortedRequests[i] - currentPosition);
                currentPosition = sortedRequests[i];
                this.seekSequence.push(currentPosition);
            }
        }
    
        // Remove duplicates from the seek sequence
        this.seekSequence = [...new Set(this.seekSequence)];
    }
    
    

    getResults() {
        return {
            initialPosition: this.initialPosition,
            totalSeekOperations: this.totalSeekOperations,
            seekSequence: this.seekSequence
        };
    }
}

module.exports = DiskScheduler;
