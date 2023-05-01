const experss = require('express');
const router = experss.Router();
const controller = require('../controllers/auth')

const jwt = require("jsonwebtoken")
require('dotenv').config();

const jsonParser = experss.json()


router.get('/register', (req, res) => {
    res.render("register", {
        page_name: "Регистрация",
        message: null, // $this -> session -> flush("message"), //получаем например сообщение с ошибкой
        form_data: null //$this -> session -> flush("form_data"), //получаем данные из формы при обновлении страницы
    });
});

router.get('/login', (req, res) => {

    res.render("login", {
        page_name: "Авторизация",
        message: null, //$this -> session -> flush("message"), //получаем например сообщение с ошибкой
        form_data: null  // $this -> session -> flush("form_data"), //получаем данные из формы при обновлении страницы
    });
});

router.post('/register', (req, res) => {

    controller.register(req, res);
});

router.post('/login', jsonParser, (req, res) => {

    if (!req.body)
        return res.status(400).json("Заполните все поля!");

    let email = req.body.email;
    let password = req.body.password;

    controller.login(req, res);
});


module.exports = router;