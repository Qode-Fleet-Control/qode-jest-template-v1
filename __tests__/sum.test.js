const sum = require('../src/sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test.each([
  [0, 0, 0],
  [-1, 1, 0],
  [0.1, 0.2, 0.3],
])('sum(%p, %p) is about %p', (a, b, expected) => {
  expect(sum(a, b)).toBeCloseTo(expected);
});
