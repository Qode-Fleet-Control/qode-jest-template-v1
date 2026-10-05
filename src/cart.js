// A tiny cart: enough surface to show matchers, errors, mocks and async tests.
class Cart {
  constructor(priceLookup) {
    // priceLookup(sku) -> Promise<number>; injected so tests can mock it.
    this.priceLookup = priceLookup;
    this.items = new Map();
  }

  add(sku, qty = 1) {
    if (!Number.isInteger(qty) || qty < 1) {
      throw new RangeError(`qty must be a positive integer, got ${qty}`);
    }
    this.items.set(sku, (this.items.get(sku) ?? 0) + qty);
    return this;
  }

  remove(sku) {
    this.items.delete(sku);
    return this;
  }

  count() {
    let n = 0;
    for (const qty of this.items.values()) n += qty;
    return n;
  }

  async total() {
    let cents = 0;
    for (const [sku, qty] of this.items) {
      cents += (await this.priceLookup(sku)) * qty;
    }
    return cents;
  }
}

module.exports = Cart;
