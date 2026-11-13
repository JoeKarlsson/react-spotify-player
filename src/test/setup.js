import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)

// Mock window.location
Object.defineProperty(window, 'location', {
    value: {
        search: '',
        href: 'http://127.0.0.1:3001',
    },
    writable: true,
})

// Mock fetch globally
global.fetch = vi.fn()

// Mock console methods to avoid noise in tests
global.console = {
    ...console,
    error: vi.fn(),
    warn: vi.fn(),
    log: vi.fn(),
}

