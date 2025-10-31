// Polyfill fetch for Node testing
require('openai/shims/node')
const { TextEncoder, TextDecoder } = require('util')

// Global fetch polyfill
if (!global.fetch) {
  global.fetch = require('node-fetch')
}

// Polyfill TextEncoder / TextDecoder for jsdom
if (!global.TextEncoder) global.TextEncoder = TextEncoder
if (!global.TextDecoder) global.TextDecoder = TextDecoder
