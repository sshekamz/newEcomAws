// const { default: axios } = require("axios");

const url='http://localhost:3000'

const parentContainer = document.getElementById('container-body');
const addBtn = document.getElementById('add-btn');

const cartItems = document.getElementById('cart-items');

const sideCart = document.getElementById('cart-float');

parentContainer.addEventListener('click', (e) => {

    if (e.target.id === 'cart-top' || e.target.id === 'see-cart') {

        sideCart.style.display = 'block';
    }
    if (e.target.id === 'cancel') sideCart.style.display = 'none';    


    if (e.target.id === 'add-btn') {
        const id = e.target.parentNode.firstElementChild.id;
        console.log(id)
        const productName = e.target.parentNode.firstElementChild.innerText;
    
        axios.post(`${url}/cart`, {'id': id})
            .then(response => {
                console.log(response.data);
               
                //notification
                const notifContainer = document.querySelector('.notif-div');
                const notif = document.createElement('div');
                notif.innerText = `${productName} has been added to cart`;
                notifContainer.append(notif);
                parentContainer.append(notifContainer);
        
                setTimeout(() => {
                    notif.remove();
                }, 1000);

            })
            .catch(err => console.log("err"));
    }

    if (e.target.id === 'cart-remove-btn') {
        e.target.parentNode.parentNode.remove();
        const productId = e.target.parentNode.parentNode.id;
        axios.post(`${url}/cart-delete`, {'productId': productId});
    }

    if (e.target.id === 'order-btn') {
        axios.post(`${url}/orders`)
            .then(orderDetails => {
                console.log(orderDetails.data.orderDetails);
                alert(`Order successfully placed with id:${orderDetails.data.orderDetails.id}`);
            })
            
    }
})



window.addEventListener('DOMContentLoaded', () => {
    
    axios.get(`${url}/products`)
        .then(response => {
            console.log(response.data);
            // for (var i=0; i<response.data.products.length; i++) {
            //     showProducts(response.data.products[i]);
            // };

            showProducts(response);
        })
        .catch(err => console.log(err));
    
    axios.get(`${url}/cart`)
    .then(cartItem => {
        console.log(cartItem.data);
        // for (var i=0; i<response.data.length; i++) {
        //     showCartProducts(response.data[i]);
        // };
        showCartProducts(cartItem);
    })
    .catch(err => console.log(err));
});


function showProducts(response) {

    const div = document.getElementById('container-product');
    div.innerHTML = '';

    response.data.products.forEach(product => {
        
        const productHtml = `
        <div class='product' id='product'>
        <h4 id='${product.id}'>${product.title}</h4>
        <img id='${product.id}-img' src="${product.imageUrl}"
        alt="album cover">
        <br>
        <label id='${product.id}-label'>$${product.price}</label>
        <button class="add-btn" id="add-btn">ADD TO CART</button>
        </div>`;

        div.innerHTML += productHtml;
    });
    
    
    const pagination = document.getElementById('pagination');
    pagination.classList.add('pagination');
    let paginationChild = '';

    // if (response.data.pagination.currentPage !==1 && response.data.pagination.previousPage !==1) {
    //     paginationChild += `<button class='pagination' id='pagination' onclick='pagination(${1})'>${1}</button>`;
    // }
    
    if (response.data.pagination.hasPreviousPage) {
        paginationChild = `<button class='pagination' id='pagination' onclick='pagination(${response.data.pagination.previousPage})'>${response.data.pagination.previousPage}</button>`;
    }

    // paginationChild += `<button class='pagination' id='pagination' onclick='pagination(${response.data.pagination.currentPage})'>${response.data.pagination.currentPage}</button>`;
    
    if (response.data.pagination.hasNextPage) {
        paginationChild += `<button class='pagination' id='pagination' onclick='pagination(${response.data.pagination.nextPage})'>${response.data.pagination.nextPage}</button>`;
    }

    // if (response.data.pagination.lastPage !== response.data.pagination.currentPage && response.data.pagination.nextPage !== response.data.pagination.lastPage) {
    //     paginationChild += `<button class='pagination' id='pagination' onclick='pagination(${response.data.pagination.lastPage})'>${response.data.pagination.lastPage}</button>`;
    // }
    
    pagination.innerHTML = paginationChild;
}

function pagination(page) {
    axios.get(`${url}/products?page=${page}`)
        .then(response => {
            showProducts(response);
        })
        .catch(err => {
            console.log(err);
        })
}



function showCartProducts(cartItem) {

    let totalCartPrice = 0;
    // console.log(cartItem.data.length)
    // console.log(cartItem.cartItem.quantity)

    if (cartItem.data.length > 0) {
        cartItem.data.forEach(product => {
            
            document.querySelector('.cart-number').innertext = cartItem.data.length;

            
            const div = document.createElement('div');
            div.setAttribute('class', 'cart-div');
            div.setAttribute('id', `${product.id}`);
            div.innerHTML = `
                <span><img class='cart-class-img' src=${product.imageUrl}>
                <span>${product.title}</span></span>  
                <span>$${product.price}</span>
                <span><input type='text' value='1'>
                <button id='cart-remove-btn'>REMOVE</button></span>`
        
            cartItems.appendChild(div);

            totalCartPrice = totalCartPrice + (product.price);
            document.querySelector('#total-value').innerText = `${totalCartPrice.toFixed(2)}`;

            // totalCartPrice = totalCartPrice + (product.product.quantity * product.price);
            // document.querySelector('#total-value').innerText = `${totalCartPrice.toFixed(2)}`;

            //                <span><input type='text' value='${product.product.quantity}'>

        })
    }

}