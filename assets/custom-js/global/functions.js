// Format date to dd/mm/yyyy
// -------------------------
export function formatDate(date) {
    const ddmmyyyyRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (ddmmyyyyRegex.test(date)) {
        return date;
    }
    const otherDateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (otherDateRegex.test(date)) {
        const [day, month, year] = date.split('-');
        if (parseInt(day) > 31 || parseInt(month) > 12) {
            // console.error("Invalid date format:", date);
            return null;
        }
        return `${day}/${month}/${year}`;
    }
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            throw new Error('Invalid date format');
        }
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    } catch (error) {
        // console.error('Error formatting date:', error.message);
        return null;
    }
}
// ======================================================================================
// ======================================================================================
// xymeRA => XymeRA
// ----------------
export function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
// ======================================================================================
// ======================================================================================
// Convert time to 12-hour format with AM/PM (19:50 => 7:50 PM)
// ------------------------------------------------------------
export function formatTime(time) {
    const time12Regex = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s?(AM|PM)$/i;
    if (time12Regex.test(time)) {
        return time.toUpperCase();
    }
    try {
        const [hours, minutes] = time.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes) || hours > 23 || minutes > 59) {
            throw new Error('Invalid time format');
        }
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
        // console.error('Error formatting time:', error.message);
        return null;
    }
}
