const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const CartItem = require('../models/cart-item');

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {

    const page = +req.query.page || 1;
    let totalItems;
    
    Product.findAll()
        .then(numProducts => {
            totalItems = numProducts.length;
            return Product.findAll({
                offset: ((page - 1) * ITEMS_PER_PAGE),
                limit: ITEMS_PER_PAGE
            })
        })
        .then(products => {
            res.json({
                "products": products,
                'pagination': {
                    currentPage: page,
                    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                    hasPreviousPage: page > 1,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
                }
            })
        })
}

exports.addProduct = (req, res, next) => {

    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;

    req.user.createProduct({
        title: title,
        imageUrl: imageUrl,
        price: price
    })
        .then((result) => {
            res.json({ success: true });
        })
        .catch(err => console.log(err));
};


exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then((cart) => {
            return cart
                .getProducts()
                .then(products => {
                    res.json(products)
                })
        })
        .catch((err) => res.status(500).json({ message: 'Failed' }));
};

exports.addToCart = (req, res, next) => {
    const prodId = req.body.id;
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then((products) => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: { quantity: newQuantity }
            });
        })
        .then(() => {
            res.status(200).json({ message: 'Success' });
        })
        .catch((err) => res.status(500).json({ message: 'Failed' }));
}

exports.removeFromCart = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .getCart()
        .then(cart => {
        return cart.getProducts({where: {id: prodId}});
        })
        .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
        })
        .then(() => {
            res.status(200).send({
                data: 'item deleted'
            })
        })
}

exports.postOrder = (req, res, next) => {
    let orderDetails;
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
            .then(order => {
                orderDetails = order;
                return order.addProducts(
                    products.map(product => {
                    product.orderItem = {quantity: product.cartItem.quantity};
                    return product;
                }))
            })
        })
        .then(result => {
            fetchedCart.setProducts(null);
            res.status(200).json({orderDetails: orderDetails});
        })
};

exports.getOrder = (req, res, next) => {
    req.user.getOrders({include: ['products']})
    .then(orders => {
        res.status(200).json(orders)
    })
    .catch(err => console.log(err));
}