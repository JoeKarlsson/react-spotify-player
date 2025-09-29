import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock window.location
Object.defineProperty(window, 'location', {
    value: {
        hash: '',
        href: 'http://localhost:3001',
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

// Don't mock parseHash globally - let individual tests handle mocking if needed
