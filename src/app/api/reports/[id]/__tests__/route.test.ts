import { GET, DELETE } from '../route'
import clientPromise from '@/lib/db'
import { ObjectId } from 'mongodb'

// Mock the external dependencies
jest.mock(
  '@/lib/db',
  () => ({
    __esModule: true,
    default: Promise.resolve({
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn(),
      deleteOne: jest.fn()
    })
  })
)

describe('GET /api/reports/[id]', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return a report for a valid ID', async () => {
    const mockReport = {
      _id: new ObjectId(),
      url: 'http://example.com',
      pageTitle: 'Example Domain'
    }
    const mockDb = await clientPromise
    ;(mockDb.collection('reports').findOne as jest.Mock).mockResolvedValue(mockReport)

    const response = await GET({} as Request, { params: { id: mockReport._id.toString() } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.report._id).toEqual(mockReport._id.toString())
  })

  it('should return a 400 error for an invalid ID', async () => {
    const response = await GET({} as Request, { params: { id: 'invalid-id' } })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Invalid report ID.')
  })

  it('should return a 404 error for a non-existent report', async () => {
    const mockDb = await clientPromise
    ;(mockDb.collection('reports').findOne as jest.Mock).mockResolvedValue(null)
    const id = new ObjectId()
    const response = await GET({} as Request, { params: { id: id.toString() } })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Report not found.')
  })

  it('should handle database errors', async () => {
    const mockDb = await clientPromise
    ;(mockDb.collection('reports').findOne as jest.Mock).mockRejectedValue(new Error('Database error'))
    const id = new ObjectId()
    const response = await GET({} as Request, { params: { id: id.toString() } })
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
    const mockDb = await clientPromise
    ;(mockDb.collection('reports').deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 })
    const id = new ObjectId()
    const response = await DELETE({} as Request, { params: { id: id.toString() } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('should return a 400 error for an invalid ID', async () => {
    const response = await DELETE({} as Request, { params: { id: 'invalid-id' } })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Invalid report ID.')
  })

  it('should return a 404 error for a non-existent report', async () => {
    const mockDb = await clientPromise
    ;(mockDb.collection('reports').deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 0 })
    const id = new ObjectId()
    const response = await DELETE({} as Request, { params: { id: id.toString() } })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Report not found.')
  })

  it('should handle database errors', async () => {
    const mockDb = await clientPromise
    ;(mockDb.collection('reports').deleteOne as jest.Mock).mockRejectedValue(new Error('Database error'))
    const id = new ObjectId()
    const response = await DELETE({} as Request, { params: { id: id.toString() } })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Server error.')
  })
})
