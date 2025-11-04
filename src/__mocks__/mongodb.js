const ObjectId = jest.fn((id) => ({
  toHexString: () => id || 'mock-id',
  toString: () => id || 'mock-id',
}));

module.exports = {
  ObjectId,
};
