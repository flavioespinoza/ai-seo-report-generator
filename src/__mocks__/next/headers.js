export const headers = () => new Headers({
  'Content-Type': 'application/json',
});

export const cookies = () => ({
  get: () => {},
  getAll: () => [],
  set: () => {},
});
