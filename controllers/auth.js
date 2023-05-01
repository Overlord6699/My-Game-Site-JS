const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require("dotenv").config()
const User = require('../models/User')
const errorHandler = require('../errors/errorHandler')


module.exports.login = async function (req, res) {
    let error = "";

    const candidate = await User.findOne({
        where: {
            email: req.body.email
        }
    })


    if (candidate == null) {
        error = JSON.stringify("Пользователь с таким email не был найден!")
        res.send(error)
        return;
        //res.redirect("/login")
    }

    const passRes = bcrypt.compareSync(req.body.password, candidate.password)

    if (passRes) {

        //generate token
        const token = jwt.sign({
            email: candidate.email,
            userId: candidate.user_id
        },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        )

        //save to cookie
        res.cookie('token', token, { signed: true, maxAge: 3600000, httpOnly: true }).send(JSON.stringify(""));
    } else {
        //res.redirect("/login")
        error = JSON.stringify("Введён неверный пароль!")
        res.send(error)
    }
}

module.exports.register = async function (req, res) {
    const salt = bcrypt.genSaltSync(10)

    const password = req.body.password

    const candidate = await User.findOne({ where: { email: req.body.email } })


    if (candidate) {
        let error = JSON.stringify("Пользователь с таким email уже существует!");
        res.send(error);
        return;
    }

    //register user
    try {
        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: bcrypt.hashSync(password, salt),
        })

        await user.save().then(() => console.log('user ' + req.body.email + 'was registered'))
        res.send(JSON.stringify(""))
    } catch (e) {
        console.log(e);
        res.send(JSON.stringify(e))
    }

}