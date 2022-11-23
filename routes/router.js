const express = require('express');

const controller = require('../controllers/controller');

const router = express.Router();

router.get('/products', controller.getProducts);

router.post('/products', controller.addProduct);

router.get('/cart', controller.getCart);

router.post('/cart', controller.addToCart);

router.post('/cart-delete', controller.removeFromCart);

router.post('/orders', controller.postOrder);

router.get('/orders', controller.getOrder);


module.exports = router;