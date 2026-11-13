import { describe, it, expect } from 'vitest'
import { authEndpoint, clientId, redirectUri, scopes } from '../spotify.js'

describe('spotify.js configuration', () => {
    describe('authEndpoint', () => {
        it('should be the correct Spotify authorization endpoint', () => {
            expect(authEndpoint).toBe('https://accounts.spotify.com/authorize')
        })

        it('should be a valid URL', () => {
            expect(() => new URL(authEndpoint)).not.toThrow()
        })
    })

    describe('clientId', () => {
        it('should be a non-empty string', () => {
            expect(clientId).toBeTruthy()
            expect(typeof clientId).toBe('string')
            expect(clientId.length).toBeGreaterThan(0)
        })

        it('should be a valid Spotify client ID format', () => {
            // Spotify client IDs are typically 32 characters long and contain alphanumeric characters
            expect(clientId).toMatch(/^[a-zA-Z0-9]{32}$/)
        })
    })

    describe('redirectUri', () => {
        it('should be a valid URL', () => {
            expect(() => new URL(redirectUri)).not.toThrow()
        })

        it('should be a loopback URL (Spotify rejects localhost)', () => {
            const url = new URL(redirectUri)
            expect(url.hostname).toBe('127.0.0.1')
        })

        it('should have the correct port', () => {
            const url = new URL(redirectUri)
            expect(url.port).toBe('3001')
        })
    })

    describe('scopes', () => {
        it('should be an array', () => {
            expect(Array.isArray(scopes)).toBe(true)
        })

        it('should contain the required scopes', () => {
            const expectedScopes = [
                'user-top-read',
                'user-read-currently-playing',
                'user-read-playback-state'
            ]

            expectedScopes.forEach(scope => {
                expect(scopes).toContain(scope)
            })
        })

        it('should have the correct number of scopes', () => {
            expect(scopes).toHaveLength(3)
        })

        it('should contain only valid Spotify scopes', () => {
            const validScopes = [
                'user-top-read',
                'user-read-currently-playing',
                'user-read-playback-state'
            ]

            scopes.forEach(scope => {
                expect(validScopes).toContain(scope)
            })
        })

        it('should not contain duplicate scopes', () => {
            const uniqueScopes = [...new Set(scopes)]
            expect(scopes).toHaveLength(uniqueScopes.length)
        })
    })

    describe('configuration integration', () => {
        it('should have all required configuration values', () => {
            expect(authEndpoint).toBeDefined()
            expect(clientId).toBeDefined()
            expect(redirectUri).toBeDefined()
            expect(scopes).toBeDefined()
        })

        it('should have configuration values of correct types', () => {
            expect(typeof authEndpoint).toBe('string')
            expect(typeof clientId).toBe('string')
            expect(typeof redirectUri).toBe('string')
            expect(Array.isArray(scopes)).toBe(true)
        })
    })
})
