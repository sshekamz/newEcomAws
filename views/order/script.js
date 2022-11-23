const div = document.getElementById('div');

window.addEventListener('DOMContentLoaded', () => {
    axios.get('http://localhost:3000/orders')
        .then(res => {
            console.log(res.data);
            const order = res.data;
            let totalPrice = 0;
            for(let i=0; i<order.length; i++) {
                const orderItem = `
                <div class='orders-cart'>
                <div class='order-header'>
                    <h3>Order id: ${order[i].id}</h3>
                </div>

                <div class='cart-item-count'>
                ${
                    order[i].products.map(product => 
                        `<div class='cart-item'>
                        <img class='order-img' src=${product.imageUrl}/>
                        <div class='cart-item-descrip'>
                            <h4>${product.title}</h4>
                            <h4>$${product.price}</h4>
                        
                        <h4>qty:${product.orderItem.quantity}</h4>
                        </div>
                        </div>`
                        
                    )
                }
                </div>

                </div>`
                div.innerHTML = div.innerHTML + orderItem;
            }

        })
})