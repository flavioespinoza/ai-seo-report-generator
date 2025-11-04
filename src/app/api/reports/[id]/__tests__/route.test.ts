/** @jest-environment node */
import { GET, DELETE } from '../route'
import { ObjectId } from 'mongodb'

// Mock the database connection
const mockFindOne = jest.fn()
const mockDeleteOne = jest.fn()
const mockCollection = jest.fn(() => ({
	findOne: mockFindOne,
	deleteOne: mockDeleteOne
}))

jest.mock('@/lib/mongodb', () => ({
	__esModule: true,
	default: Promise.resolve({
		db: () => ({
			collection: mockCollection
		})
	})
}))

jest.mock('mongodb', () => {
	class MockObjectId {
		private readonly id: string
		constructor(id?: string) {
			this.id = id || 'mock-id'
		}
		toHexString() {
			return this.id
		}
		toString() {
			return this.id
		}
	}
	return {
		ObjectId: MockObjectId
	}
})

describe('GET /api/reports/[id]', () => {
	beforeEach(() => {
		mockFindOne.mockClear()
		mockDeleteOne.mockClear()
		mockCollection.mockClear()
		;(require('next-auth').getServerSession as jest.Mock).mockClear()
	})

	it('should return a report for a valid ID', async () => {
		const id = '60c72b9f9b1d8c001f8e4d1e'
		const mockReport = { _id: new (require('mongodb').ObjectId)(id), userId: 'user-123', url: 'http://example.com' }
		mockFindOne.mockResolvedValue(mockReport)
		;(require('next-auth').getServerSession as jest.Mock).mockResolvedValue({
			user: { id: 'user-123' }
		})

		const response = await GET(new Request(`http://localhost/api/reports/${id}`), {
			params: { id }
		})
		const data = await response.json()

		expect(response.status).toBe(200)
		expect(data.success).toBe(true)
		expect(data.report).toEqual({ ...mockReport, _id: id })
		expect(mockCollection).toHaveBeenCalledWith('reports')
		expect(mockFindOne).toHaveBeenCalledWith({ _id: new (require('mongodb').ObjectId)(id) })
	})

	it('should return a 404 error for a non-existent ID', async () => {
		mockFindOne.mockResolvedValue(null)
		;(require('next-auth').getServerSession as jest.Mock).mockResolvedValue({
			user: { id: 'user-123' }
		})
		const id = '60c72b9f9b1d8c001f8e4d1f'
		const response = await GET(new Request(`http://localhost/api/reports/${id}`), {
			params: { id }
		})
		const data = await response.json()

		expect(response.status).toBe(404)
		expect(data.success).toBe(false)
		expect(data.error).toBe('Report not found.')
	})

	it('should handle database errors', async () => {
		mockFindOne.mockRejectedValue(new Error('Database error'))
		;(require('next-auth').getServerSession as jest.Mock).mockResolvedValue({
			user: { id: 'user-123' }
		})
		const id = '60c72b9f9b1d8c001f8e4d20'
		const response = await GET(new Request(`http://localhost/api/reports/${id}`), {
			params: { id }
		})
		const data = await response.json()

		expect(response.status).toBe(500)
		expect(data.success).toBe(false)
		expect(data.error).toBe('Server error.')
	})
})

describe('DELETE /api/reports/[id]', () => {
	beforeEach(() => {
		mockFindOne.mockClear()
		mockDeleteOne.mockClear()
		mockCollection.mockClear()
		;(require('next-auth').getServerSession as jest.Mock).mockClear()
	})

	it('should delete a report for a valid ID', async () => {
		const id = '60c72b9f9b1d8c001f8e4d21'
		mockFindOne.mockResolvedValue({ userId: 'user-123' })
		mockDeleteOne.mockResolvedValue({ deletedCount: 1 })
		;(require('next-auth').getServerSession as jest.Mock).mockResolvedValue({
			user: { id: 'user-123' }
		})
		const response = await DELETE(new Request(`http://localhost/api/reports/${id}`), {
			params: { id }
		})
		const data = await response.json()

		expect(response.status).toBe(200)
		expect(data.success).toBe(true)
	})

	it('should return a 404 error for a non-existent ID', async () => {
		mockDeleteOne.mockResolvedValue({ deletedCount: 0 })
		;(require('next-auth').getServerSession as jest.Mock).mockResolvedValue({
			user: { id: 'user-123' }
		})
		const id = '60c72b9f9b1d8c001f8e4d22'
		const response = await DELETE(new Request(`http://localhost/api/reports/${id}`), {
			params: { id }
		})
		const data = await response.json()

		expect(response.status).toBe(404)
		expect(data.success).toBe(false)
		expect(data.error).toBe('Report not found.')
	})

	it('should handle database errors', async () => {
		mockDeleteOne.mockRejectedValue(new Error('Database error'))
		;(require('next-auth').getServerSession as jest.Mock).mockResolvedValue({
			user: { id: 'user-123' }
		})
		const id = '60c72b9f9b1d8c001f8e4d23'
		const response = await DELETE(new Request(`http://localhost/api/reports/${id}`), {
			params: { id }
		})
		const data = await response.json()

		expect(response.status).toBe(500)
		expect(data.success).toBe(false)
		expect(data.error).toBe('Server error.')
	})
})
