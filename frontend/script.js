//api config to our backend server
const API_URL='http://localhost:3000/api';

//wait for dom
document.addEventListener('DOMContentLoaded', ()=>{
    setupAddToCartButtons();
    setupNewsletter();
    updateCartCount();
    updateWishlistCount();
    setupWishlistButtons();
    if (typeof $ !== 'undefined' && $.fn.isotope) {
        initIsotope();
    }
});

//find all add to cart buttons on the page and attaches click handlers
function setupAddToCartButtons(){
    const buttons = document.querySelectorAll('.collection-list .btn-primary, .special-list .btn-primary');
    buttons.forEach(button => {
        button.removeEventListener('click', handleAddToCart);
        button.addEventListener('click', handleAddToCart);
    });
}

//extract product info from the html and sends to backend
async function handleAddToCart(event){
    event.preventDefault();
    const button = event.currentTarget;
    const productDiv = button.closest('.text-center');
    if(!productDiv) return;
    //get product name
    const productName = productDiv.querySelector('p')?.innerText || 'Product';
    //get price
    const productPriceText = productDiv.querySelector('.fw-bold')?.innerText || '€0';
    const productPrice = parseFloat(productPriceText.replace('€', ''));
    //find the container for product image
    const imageContainer = button.closest('.col-md-6, .col-lg-4, .col-xl-3, .p-2');
    //extract just the filename from the image src
    const productImage = imageContainer?.querySelector('.collection-img img, .special-img img')?.getAttribute('src')?.split('/').pop() || 'product1.jpg';
    //category of the product best vs feat vs new
    let category= 'best';
    if(imageContainer){
        if (imageContainer.classList.contains('best')) category= 'best';
        else if(imageContainer.classList.contains('feat')) category= 'feat';
        else if(imageContainer.classList.contains('new')) category= 'new';
    }
    //create id
    const productId= productName.replace(/\s/g, '').toLowerCase();
    try {
        //post request to add item to cart
        const response= await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: productId,
                product_name: productName,
                product_price: productPrice,
                product_image: productImage,
                product_category: category,
                quantity: 1
            })
        });
        const data = await response.json();
        if (data.success){
            showMessage(`${productName} added to cart!`, 'success');
            updateCartCount();
        } else {
            showMessage(data.message || 'Failed to add to cart', 'error');
        }
    } catch (error){
        console.error('Error adding to cart:', error);
        showMessage('Failed to add to cart. Please try again.', 'error');
    }
}

function setupWishlistButtons(){
    const wishlistIcons = document.querySelectorAll('.special-img span, .collection-img span');
    wishlistIcons.forEach(icon => {
        if(icon.querySelector('.fa-heart')){
            icon.removeEventListener('click', handleAddToWishlist);
            icon.addEventListener('click', handleAddToWishlist);
            icon.style.cursor = 'pointer';
        }
    });
}

async function handleAddToWishlist(event){
    event.stopPropagation();
    const heartIcon= event.currentTarget;
    const imageContainer= heartIcon.closest('.col-md-6, .col-lg-4, .col-xl-3, .p-2');
    if(!imageContainer) return;
    const productName= imageContainer.querySelector('.text-center p')?.innerText || 'Product';
    const productPriceText= imageContainer.querySelector('.fw-bold')?.innerText || '€0';
    const productPrice= parseFloat(productPriceText.replace('€', ''));
    const productImage= imageContainer.querySelector('.collection-img img, .special-img img')?.getAttribute('src')?.split('/').pop() || 'product1.jpg';
    let category= 'best';
    if(imageContainer.classList.contains('best')) category = 'best';
    else if (imageContainer.classList.contains('feat')) category = 'feat';
    else if (imageContainer.classList.contains('new')) category = 'new';
    const productId = productName.replace(/\s/g, '').toLowerCase();
    try {
        //post request to add to wishlist
        const response= await fetch(`${API_URL}/wishlist`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: productId,
                product_name: productName,
                product_price: productPrice,
                product_image: productImage,
                product_category: category
            })
        });
        const data= await response.json();
        if (data.success) {
            showMessage(`${productName} added to wishlist!`, 'success');
            heartIcon.style.color= '#e5345b';
            updateWishlistCount();
        } else if (data.message === 'Already in wishlist') {
            showMessage(`${productName} is already in your wishlist`, 'info');
        } else {
            showMessage(data.message || 'Failed to add to wishlist', 'error');
        }
    } catch(error){
        console.error('Error adding to wishlist:', error);
        showMessage('Failed to add to wishlist', 'error');
    }
}

//fetch cart from backend
async function updateCartCount() {
    try {
        const response= await fetch(`${API_URL}/cart`);
        const data= await response.json();
        if (data.success && data.cart) {
            const totalItems = data.cart.reduce((sum, item) => sum + item.quantity, 0);
            const cartBadges = document.querySelectorAll('.nav-btns .badge');
            if (cartBadges.length > 0) {
                cartBadges[0].textContent = totalItems;
            }
        }
    } catch(error){
        console.error('Error updating cart count:', error);
    }
}

//fetch wishlist
async function updateWishlistCount(){
    try{
        const response= await fetch(`${API_URL}/wishlist`);
        const data= await response.json();
        if(data.success && data.wishlist) {
            const wishlistBadges = document.querySelectorAll('.nav-btns .badge');
            if(wishlistBadges.length > 1) {
                wishlistBadges[1].textContent = data.wishlist.length;
            }
        }
    } catch(error){
        console.error('Error updating wishlist count:', error);
    }
}

//newsletter subscription
function setupNewsletter(){
    const subscribeBtn= document.querySelector('#newsletter .btn');
    const emailInput= document.querySelector('#newsletter .form-control');
    if (subscribeBtn && emailInput) {
        const newBtn= subscribeBtn.cloneNode(true);
        subscribeBtn.parentNode.replaceChild(newBtn, subscribeBtn);
        newBtn.addEventListener('click', async () => {
            const email= emailInput.value.trim();
            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            try {
                const response= await fetch(`${API_URL}/orders/subscribe`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data= await response.json();
                if (data.success) {
                    showMessage(`Thanks for subscribing with ${email}!`, 'success');
                    emailInput.value= '';
                } else {
                    showMessage(data.message || 'Subscription failed', 'error');
                }
            }catch(error){
                console.error('Error subscribing:', error);
                showMessage('Failed to subscribe. Please try again.', 'error');
            }
        });
    }
}

//pop up msg
function showMessage(message, type = 'success'){

    let messageContainer = document.querySelector('.toast-message-container');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'toast-message-container';
        messageContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(messageContainer);
    }
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : type === 'info' ? 'info' : 'danger'} alert-dismissible fade show`;
    toast.style.cssText = `
        margin-top: 10px;
        min-width: 200px;
        animation: slideIn 0.3s ease;
    `;
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    messageContainer.appendChild(toast);
    //rmv message after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

//initializes isotope product filtering -- took it from isotope website
function initIsotope() {
    var $grid = $('.collection-list').isotope({
        itemSelector: '.col-md-6',
        layoutMode: 'fitRows'
    });
    $('.filter-button-group').on('click', 'button', function() {
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
        // highlight the active filter button
        $('.filter-button-group button').removeClass('active-filter-btn');
        $(this).addClass('active-filter-btn');
    });
}

//css animation for the popup messages to slide in smoothly
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);