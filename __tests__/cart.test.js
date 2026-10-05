const Cart = require('../src/cart');

describe('Cart', () => {
  let prices;
  let cart;

  beforeEach(() => {
    // A mock function: records its calls and returns what we tell it to.
    prices = jest.fn(async (sku) => ({ apple: 50, pear: 75 })[sku]);
    cart = new Cart(prices);
  });

  test('starts empty', () => {
    expect(cart.count()).toBe(0);
    expect(cart.items.size).toBe(0);
  });

  test('adds and merges quantities', () => {
    cart.add('apple').add('apple', 2).add('pear');
    expect(cart.count()).toBe(4);
    expect(Object.fromEntries(cart.items)).toEqual({ apple: 3, pear: 1 });
  });

  test('rejects a bad quantity', () => {
    expect(() => cart.add('apple', 0)).toThrow(RangeError);
    expect(() => cart.add('apple', 1.5)).toThrow(/positive integer/);
  });

  test('removes an item', () => {
    cart.add('apple').add('pear').remove('apple');
    expect(cart.items.has('apple')).toBe(false);
    expect(cart.count()).toBe(1);
  });

  test('totals asynchronously, looking each price up once', async () => {
    cart.add('apple', 2).add('pear');
    await expect(cart.total()).resolves.toBe(175);
    expect(prices).toHaveBeenCalledTimes(2);
    expect(prices).toHaveBeenCalledWith('pear');
  });

  test('propagates a failed price lookup', async () => {
    prices.mockRejectedValueOnce(new Error('price service down'));
    cart.add('apple');
    await expect(cart.total()).rejects.toThrow('price service down');
  });
});
