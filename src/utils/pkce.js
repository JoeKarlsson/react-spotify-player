/**
 * Authorization Code with PKCE helpers
 *
 * Spotify removed the Implicit Grant flow in November 2025. PKCE is the flow
 * for apps that run entirely in the browser and can't keep a client secret:
 * 1. login() makes a random code verifier, saves it, and sends its SHA-256
 *    hash (the code challenge) to Spotify's /authorize endpoint.
 * 2. Spotify redirects back with ?code=... in the query string.
 * 3. getToken() sends that code plus the saved verifier to /api/token and
 *    gets back an access token.
 *
 * https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 */
import { authEndpoint, tokenEndpoint, clientId, redirectUri, scopes } from '/src/config/spotify.js';

// base64url-encode bytes (no padding) for the verifier and the challenge
const base64url = (bytes) =>
    btoa(String.fromCharCode(...new Uint8Array(bytes)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

// Build the /authorize URL and save the code verifier for getToken()
export async function buildAuthorizeUrl() {
    const verifier = base64url(crypto.getRandomValues(new Uint8Array(64)));
    const challenge = base64url(
        await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))
    );
    localStorage.setItem("code_verifier", verifier);

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirectUri,
        scope: scopes.join(" "),
        code_challenge_method: "S256",
        code_challenge: challenge,
        show_dialog: "true",
    });
    return `${authEndpoint}?${params}`;
}

// Send the user to Spotify to log in
export async function login() {
    window.location.href = await buildAuthorizeUrl();
}

// Trade the code Spotify sent back (plus the saved verifier) for an access token
export async function getToken(code) {
    const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectUri,
            code_verifier: localStorage.getItem("code_verifier"),
        }),
    });
    if (!response.ok) throw new Error(`Token request failed: ${response.status}`);
    localStorage.removeItem("code_verifier");
    const data = await response.json();
    return data.access_token;
}
