const express = require('express');

const controller = require('../controllers/account');
const passport = require('../middleware/passport');
const uploadHandler = require('../middleware/upload')

const jwt = require("jsonwebtoken")
require('dotenv').config();


const router = express.Router()



//страница пользователя
router.get('/account', async (req, res) => {
    if (Object.keys(req.signedCookies).length != 0) {

        let token = req.signedCookies.token;

        if (!jwt.verify(token, process.env.JWT_KEY, { expiresIn: "1h" })) {
            res.redirect("/login");
        } else {
            res.render("user_page", {
                page_name: 'Аккаунт',
                user: token
            });
        }
    } else {
        res.redirect("/login");
    }

});

//корзина пользователя 
router.get('/account/wishlist', (req, res) => {

    if (Object.keys(req.signedCookies).length != 0) {

        let token = req.signedCookies.token;

        if (!jwt.verify(token, process.env.JWT_KEY, { expiresIn: "1h" })) {
            res.redirect("/login");
        } else {
            res.render("wishlist", {
                page_name: 'Аккаунт',
                user: token
            });
        }
    } else {
        res.redirect("/login");
    }
});


router.get('/logout', (req, res) => {
    controller.logout(req, res)
    res.status(302).redirect('/')
});


module.exports = router