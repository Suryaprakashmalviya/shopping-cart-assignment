
const ShoppingCart = require("./shoppingCart.js")

const axios = require("axios")

jest.mock('axios');

describe('ShoppingCart', () => {
    let cart;

    beforeEach(() => {
        cart = new ShoppingCart();
    });

    test('addProduct should add a product to the cart', async () => {
        axios.get.mockResolvedValue({ data: { price: 2.52 } });
        await cart.addProduct('cornflakes', 1);
        expect(cart.cart).toEqual([{ productName: 'cornflakes', quantity: 1, price: 2.52 }]);
    });

    test('calculateSubtotal should return the correct subtotal', async () => {
        // Mock different prices for different products
        axios.get.mockImplementation((url) => {
            if (url.includes('cornflakes')) {
                return Promise.resolve({ data: { price: 2.52 } });
            } else if (url.includes('weetabix')) {
                return Promise.resolve({ data: { price: 9.98 } });
            }
            return Promise.resolve({ data: { price: 0 } });
        });

        await cart.addProduct('cornflakes', 2);
        await cart.addProduct('weetabix', 1);
        expect(cart.calculateSubtotal()).toBe(15.02);
    });

    test('calculateTax should return the correct tax', () => {
        const subtotal = 15.02;
        expect(cart.calculateTax(subtotal)).toBe(1.88);
    });

    test('calculateTotal should return the correct total', () => {
        const subtotal = 15.02;
        const tax = 1.88;
        expect(cart.calculateTotal(subtotal, tax)).toBe(16.90);
    });

    test('getCartState should return the correct cart state', async () => {
        // Mock different prices for different products
        axios.get.mockImplementation((url) => {
            if (url.includes('cornflakes')) {
                return Promise.resolve({ data: { price: 2.52 } });
            } else if (url.includes('weetabix')) {
                return Promise.resolve({ data: { price: 9.98 } });
            }
            return Promise.resolve({ data: { price: 0 } });
        });

        await cart.addProduct('cornflakes', 2);
        await cart.addProduct('weetabix', 1);
        const state = cart.getCartState();
        expect(state).toEqual({
            cart: [
                { productName: 'cornflakes', quantity: 2, price: 2.52 },
                { productName: 'weetabix', quantity: 1, price: 9.98 }
            ],
            subtotal: 15.02,
            tax: 1.88,
            total: 16.90
        });
    });
});