// JSDOM has localStorage by default, we just need to polyfill performance and btoa/atob

// Mocking performance
if (typeof window !== 'undefined' && !window.performance) {
    Object.defineProperty(window, 'performance', {
        value: {
            now: jest.fn(() => Date.now())
        },
        configurable: true
    });
}

// Mocking atob/btoa for Node environment
if (typeof btoa === 'undefined') {
    global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
}
if (typeof atob === 'undefined') {
    global.atob = (b64Encoded) => Buffer.from(b64Encoded, 'base64').toString('binary');
}

// Ensure window has them too
if (typeof window !== 'undefined') {
    window.btoa = window.btoa || global.btoa;
    window.atob = window.atob || global.atob;
}

// Mocking fetch 
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Mocking AbortSignal
if (!global.AbortSignal) {
    global.AbortSignal = {
        timeout: jest.fn(() => ({}))
    };
}
