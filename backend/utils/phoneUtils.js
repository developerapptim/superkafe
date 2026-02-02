/**
 * Phone Number Utility Functions
 * Standardizes Indonesian phone numbers to 62xxx format
 */

/**
 * Sanitize and format Indonesian phone number to 62xxx format
 * @param {string} phone - Raw phone input (08xxx, +62xxx, 62xxx, etc.)
 * @returns {string|null} - Formatted phone (628xxx) or null if invalid
 */
const formatPhoneNumber = (phone) => {
    if (!phone || typeof phone !== 'string') return null;

    // Remove all non-digit characters (spaces, dashes, plus signs, etc.)
    let cleaned = phone.replace(/\D/g, '');

    // Handle empty after cleaning
    if (!cleaned || cleaned.length < 9) return null;

    // If starts with 0, replace with 62
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1);
    }

    // If doesn't start with 62, assume it needs 62 prefix (edge case)
    if (!cleaned.startsWith('62')) {
        // Could be just the number without prefix, add 62
        // But this is risky, so we'll only do it if length suggests it's missing prefix
        if (cleaned.length >= 9 && cleaned.length <= 12) {
            cleaned = '62' + cleaned;
        }
    }

    // Validate Indonesian phone format (62 + 9-12 digits)
    if (cleaned.length < 11 || cleaned.length > 15) {
        return null; // Invalid length
    }

    return cleaned;
};

/**
 * Check if a phone number is valid Indonesian format
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
const isValidPhone = (phone) => {
    const formatted = formatPhoneNumber(phone);
    return formatted !== null && formatted.startsWith('62') && formatted.length >= 11;
};

module.exports = {
    formatPhoneNumber,
    isValidPhone
};
