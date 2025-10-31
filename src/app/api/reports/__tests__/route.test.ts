/** @jest-environment node */

import { GET } from '../route'
import clientPromise from '@/lib/db'

// Mock the database
const mockToArray = jest.fn()
const mockSort = jest.fn(() => ({ toArray: mockToArray }))
const mockFind = jest.fn(() => ({ sort: mockSort }))

jest.mock(
  '@/lib/db',
  () => ({
    __esModule: true,
    default: Promise.resolve({
      db: jest.fn(() => ({
        collection: jest.fn(() => ({
          find: mockFind
        }))
      }))
    })
  })
)

describe('GET /api/reports', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return a list of reports', async () => {
    const mockReports = [
      { _id: '1', url: 'http://example.com' },
      { _id: '2', url: 'http://example.org' }
    ]
    mockToArray.mockResolvedValue(mockReports)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.reports).toEqual(mockReports)
  })

  it('should handle database errors', async () => {
    mockToArray.mockRejectedValue(new Error('Database error'))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Failed to load reports')
  })
})
