require('@testing-library/jest-dom')
// Polyfill fetch for Node testing
require('openai/shims/node')
const { TextEncoder, TextDecoder } = require('util')
const fetch = require('node-fetch')

// Global fetch polyfill
if (!global.fetch) {
  global.fetch = fetch
}
if (!global.Request) {
  global.Request = fetch.Request
}
if (!global.Response) {
  global.Response = fetch.Response
}

// Polyfill Response.json
if (!global.Response.json) {
  global.Response.json = (data, options) => {
    const body = JSON.stringify(data)
    const headers = { 'Content-Type': 'application/json', ...options?.headers }
    return new fetch.Response(body, { ...options, headers })
  }
}


// Polyfill TextEncoder / TextDecoder for jsdom
if (!global.TextEncoder) global.TextEncoder = TextEncoder
if (!global.TextDecoder) global.TextDecoder = TextDecoder
