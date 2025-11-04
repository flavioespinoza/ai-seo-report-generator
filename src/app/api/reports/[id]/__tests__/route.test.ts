/** @jest-environment node */
import { GET, DELETE } from '../route'
import clientPromise from '@/lib/db'
import { ObjectId } from 'mongodb'

// Create mock functions for collection methods
const mockFindOne = jest.fn()
const mockDeleteOne = jest.fn()

// Mock the database
jest.mock(
  '@/lib/db',
  () => ({
    __esModule: true,
    default: Promise.resolve({
      db: jest.fn(() => ({
        collection: jest.fn(() => ({
          findOne: mockFindOne,
          deleteOne: mockDeleteOne,
        })),
      })),
    })
  })
)

describe('GET /api/reports/[id]', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return a report for a valid ID', async () => {
    const mockReport = { _id: new ObjectId(), url: 'http://example.com' }
    mockFindOne.mockResolvedValue(mockReport)

    const response = await GET({} as Request, { params: { id: mockReport._id.toHexString() } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.report).toEqual({ ...mockReport, _id: mockReport._id.toHexString() })
  })

  it('should return a 404 error for a non-existent ID', async () => {
    mockFindOne.mockResolvedValue(null)

    const response = await GET({} as Request, { params: { id: new ObjectId().toHexString() } })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Report not found.')
  })

  it('should handle database errors', async () => {
    mockFindOne.mockRejectedValue(new Error('Database error'))

    const response = await GET({} as Request, { params: { id: new ObjectId().toHexString() } })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Server error.')
  })
})

describe('DELETE /api/reports/[id]', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should delete a report for a valid ID', async () => {
    mockDeleteOne.mockResolvedValue({ deletedCount: 1 })

    const response = await DELETE({} as Request, { params: { id: new ObjectId().toHexString() } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('should return a 404 error for a non-existent ID', async () => {
    mockDeleteOne.mockResolvedValue({ deletedCount: 0 })

    const response = await DELETE({} as Request, { params: { id: new ObjectId().toHexString() } })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Report not found.')
  })

  it('should handle database errors', async () => {
    mockDeleteOne.mockRejectedValue(new Error('Database error'))

    const response = await DELETE({} as Request, { params: { id: new ObjectId().toHexString() } })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Server error.')
  })
})
