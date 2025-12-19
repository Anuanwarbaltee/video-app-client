export const Helpers = {
    formatDate(date) {
        const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options); // Output: mm/dd/yyyy
    },

    formatTime(date) {
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        return new Date(date).toLocaleTimeString('en-US', options); // Output: 10:00 AM
    },
    timeAgo(date) {
        const now = new Date();
        const diffInMilliseconds = now - new Date(date);

        const seconds = Math.floor(diffInMilliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30); // Approximation for months
        const years = Math.floor(days / 365); // Approximation for years

        if (years > 0) {
            return years === 1 ? "1 year ago" : `${years} years ago`;
        }

        if (months > 0) {
            return months === 1 ? "1 month ago" : `${months} months ago`;
        }

        if (days > 0) {
            return days === 1 ? "a day ago" : `${days} days ago`;
        }

        if (hours > 0) {
            return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
        }

        if (minutes > 0) {
            return minutes === 1 ? "1 minute ago" : `${minutes || 0} minutes ago`;
        }

        return seconds === 1 ? "1 second ago" : `${seconds || 0} seconds ago`;
    }

}