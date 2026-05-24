//check if cart item has valid product id, name, price and quantity before adding to cart
function validateCartItem(req, res, next){
    const{product_id, product_name, product_price, quantity } = req.body;
const errors=[];

    if(!product_id || product_id.trim().length< 1) {
        errors.push('Product ID is required');
    }
    if(!product_name || product_name.trim().length< 2) {
        errors.push('Product name must be at least 2 characters');
    }
    if(!product_price || isNaN(product_price) || product_price <= 0) {
        errors.push('Valid product price is required');
    }
    if(!quantity || isNaN(quantity) || quantity< 1) {
        errors.push('Quantity must be at least 1');
    }

    //error handling
    if (errors.length > 0) {
        return res.status(400).json({success: false, message: errors.join(', ') });
 }
    //if everything is fine, move to the next function
    next();
}

//checkin wishlist item
function validateWishlistItem(req, res, next){
    const{ product_id, product_name, product_price } = req.body;
    const errors=[];

    if(!product_id || product_id.trim().length < 1) {
        errors.push('Product ID is required');
}
    if(!product_name || product_name.trim().length< 2) {
        errors.push('Product name must be at least 2 characters');
    }
    if(!product_price || isNaN(product_price) || product_price<= 0) {
        errors.push('Valid product price is required');
    }

    if(errors.length> 0) {
        return res.status(400).json({success: false, message: errors.join(', ')});
    }
    next();
}

//validate before creating an order
function validateOrder(req, res, next) {
    const { customer_name, customer_email, customer_address, items, total }= req.body;
    const errors=[];

    //name limitation
    if (!customer_name || customer_name.trim().length< 2) {
        errors.push('Valid customer name is required');
    }
    //email must have @ and . format like name@domain.com
    if (!customer_email || !/^\S+@\S+\.\S+$/.test(customer_email)){
        errors.push('Valid email address is required');
    }
    //address limitattion
    if(!customer_address || customer_address.trim().length< 5) {
        errors.push('Valid shipping address is required');
    }
    //cart must not be empty when placing order
    if(!items || !Array.isArray(items) || items.length === 0){
        errors.push('Cart cannot be empty');
    }
    //total amount must be a positive number
    if(!total || isNaN(total) || total <= 0){
        errors.push('Valid total amount is required');
    }

    if (errors.length > 0){
        return res.status(400).json({ success: false, message: errors.join(', ') });
    }
    next();
}

//email validation for newsletter
function validateSubscription(req, res, next) {
    const { email } = req.body;
    //if email exists and follows basic email pattern
    if (!email || !/^\S+@\S+\.\S+$/.test(email)){
        return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }
    next();
}

//export all validation functions
module.exports = { validateCartItem, validateWishlistItem, validateOrder, validateSubscription };