import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createHash } from 'node:crypto'
import { buildAuthorizeUrl, getToken } from '../pkce.js'

describe('pkce.js', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('sends the SHA-256 of the saved verifier as the code challenge', async () => {
        const url = new URL(await buildAuthorizeUrl())

        const [key, verifier] = localStorage.setItem.mock.calls[0]
        expect(key).toBe('code_verifier')
        expect(verifier).toMatch(/^[A-Za-z0-9_-]{86}$/)
        expect(url.searchParams.get('code_challenge'))
            .toBe(createHash('sha256').update(verifier).digest('base64url'))
        expect(url.searchParams.get('response_type')).toBe('code')
    })

    it('trades the code and saved verifier for an access token', async () => {
        localStorage.getItem.mockReturnValue('saved-verifier')
        fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ access_token: 'tok123' }) })

        expect(await getToken('the-code')).toBe('tok123')

        const [url, opts] = fetch.mock.calls[0]
        expect(url).toBe('https://accounts.spotify.com/api/token')
        expect(opts.method).toBe('POST')
        const body = new URLSearchParams(opts.body)
        expect(body.get('grant_type')).toBe('authorization_code')
        expect(body.get('code')).toBe('the-code')
        expect(body.get('code_verifier')).toBe('saved-verifier')
        expect(body.get('redirect_uri')).toBe('http://127.0.0.1:3001')
    })

    it('throws when Spotify rejects the code', async () => {
        fetch.mockResolvedValue({ ok: false, status: 400 })
        await expect(getToken('bad-code')).rejects.toThrow('Token request failed: 400')
    })
})
