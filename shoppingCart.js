const axios = require("axios")

const PRICE_API_BASE_URL = "http://localhost:3001/products" ;

class ShoppingCart {
    constructor() {
        this.cart = [];
    }

    async addProduct(productName, quantity){
        const price = await this.getProductPrice(productName);
        this.cart.push({productName, quantity, price});
    }

    async getProductPrice(productName){
        try{
            const response = await axios.get(`${PRICE_API_BASE_URL}/${productName}`);
            return response.data.price;
        }catch(error){
            console.error(`error fetching price for ${productName}:`,error);
            throw error;
        }
    }

    calculateSubtotal() {
        return this.cart.reduce((total, item)=>total + item.quantity * item.price,0)
    }

    calculateTax(subtotal){
        return parseFloat((subtotal * 0.125).toFixed(2));
    }

    calculateTotal(subtotal, tax){
        return parseFloat((subtotal + tax).toFixed(2));
    }

    getCartState(){
        const subtotal = this.calculateSubtotal();
        const tax = this.calculateTax(subtotal);
        const total = this.calculateTotal(subtotal , tax);

        return{
            cart: this.cart,
            subtotal,
            tax,
            total
        }
    }
}


module.exports = ShoppingCart;

