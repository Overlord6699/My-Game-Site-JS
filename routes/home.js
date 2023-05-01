const express = require('express')

const controller = require('../controllers/home')
const uploadHandler = require('../middleware/upload')

const jwt = require("jsonwebtoken")
require('dotenv').config();

const router = express.Router()

router.get('/', (req, res) => {

    let user = (Object.keys(req.signedCookies).length != 0 && req.signedCookies.token) ? req.signedCookies.token : null

    res.render('home', {
        page_name: 'Главная',
        user: user,
        welcome_text: 'Добро пожаловать на главную страницу игры',
        about_game_text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.' +
            'Nostrum sit consectetur deleniti mollitia, nulla dolores architecto ex ad, laudantium quibusdam corrupti? Fuga quos alias molestiae. Id veniam incidunt dolore neque. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum sit consectetur deleniti mollitia, nulla dolores architecto ex ad, laudantium quibusdam corrupti? Fuga quos alias molestiae. Id veniam incidunt dolore neque.',
        play_button_text: 'Играть'
    })

});

module.exports = router