/**
 * Hash utility for parsing URL fragments
 * 
 * This utility function extracts the access token and other parameters
 * from the URL hash after Spotify OAuth redirects back to our app.
 * 
 * @returns {Object} Parsed hash parameters as key-value pairs
 * 
 * Example URL hash: "#access_token=abc123&token_type=Bearer&expires_in=3600"
 * Returns: { access_token: "abc123", token_type: "Bearer", expires_in: "3600" }
 */
export const parseHash = () => {
    // Get the hash portion of the URL (everything after #)
    const hashString = window.location.hash;

    // Remove the # symbol and split by & to get individual parameters
    const hashParams = hashString
        .substring(1) // Remove the # symbol
        .split("&") // Split into array of "key=value" strings
        .reduce(function (initial, item) {
            // Process each "key=value" pair
            if (item) {
                var parts = item.split("="); // Split into [key, value]
                // Decode the value and add to our result object
                initial[parts[0]] = decodeURIComponent(parts[1]);
            }
            return initial;
        }, {}); // Start with empty object

    // Clear the hash from the URL for security and clean UX
    // This prevents the token from being visible in the address bar
    window.location.hash = "";

    return hashParams;
};
