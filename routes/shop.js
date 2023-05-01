const express = require('express');

const controller = require('../controllers/shop')
const uploadHandler = require('../middleware/upload')


const router = express.Router()


router.get('/shop/:id', controller.getById)
router.delete('/shop/products/:product', controller.remove)
router.post('/shop', controller.create)
router.patch('/shop/products/:product', controller.update)


router.get('/shop', async (req, res) => {

    let user = (Object.keys(req.signedCookies).length != 0 && req.signedCookies.token) ? req.signedCookies.token : null

    const products = await controller.getAll()


    res.render('shop', {
        page_name: 'Магазин',
        products: products,
        user: user
    })
})

router.get('/shop/products/:id', async (req, res) => {
    let user = (Object.keys(req.signedCookies).length != 0 && req.signedCookies.token) ? req.signedCookies.token : null

    const product = await controller.getById(req, res)

    res.render('product_page', {
        page_name: 'Товар',
        product: product,
        user: user
    })
});



module.exports = router