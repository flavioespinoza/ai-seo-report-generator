import { GET } from '../route'
import clientPromise from '@/lib/db'

// Mock the external dependencies
jest.mock(
  '@/lib/db',
  () => ({
    __esModule: true,
    default: Promise.resolve({
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      toArray: jest.fn()
    })
  })
)

describe('GET /api/reports', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return a list of reports', async () => {
    const createdAt = new Date()
    const mockReports = [
      {
        _id: '1',
        url: 'http://example.com',
        pageTitle: 'Example Domain',
        createdAt: createdAt,
        tags: ['example', 'domain'],
        businessCategory: 'Technology'
      }
    ]
    const expectedReports = [
      {
        _id: '1',
        url: 'http://example.com',
        pageTitle: 'Example Domain',
        createdAt: createdAt.toISOString(),
        tags: ['example', 'domain'],
        businessCategory: 'Technology'
      }
    ]
    const mockDb = await clientPromise
    ;(mockDb.collection('reports').toArray as jest.Mock).mockResolvedValue(mockReports)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.reports).toEqual(expectedReports)
  })

  it('should handle database errors', async () => {
    const mockDb = await clientPromise
    ;(mockDb.collection('reports').toArray as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Failed to load reports')
  })
})
