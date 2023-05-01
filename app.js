const passport = require('passport')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const cors = require('cors')
const Twig = require("twig")
const cookieParser = require("cookie-parser")


const { openConnection, closeConnection } = require('./database')




const authRoutes = require('./routes/auth')
const accRoutes = require('./routes/account')
const homeRoutes = require('./routes/home')
const shopRoutes = require('./routes/shop')
const newsRoutes = require('./routes/news')
const mailRoutes = require('./routes/mailRoutes')


require('dotenv').config();

const express = require('express');
const app = express();

const jsonParser = express.json();

const PORT = process.env.PORT || 5000;


var path = require('path');
app.use(express.static(path.join(__dirname + '')));


// This section is optional and used to configure twig.
app.set("twig options", {
    allowAsync: true, // Allow asynchronous compiling
    strict_variables: false
});

//шаблонизатор
app.set('views', __dirname + '/views');
app.set('view engine', 'twig');
//app.set('templates', __dirname + '/templates');
//app.set('view engine', 'ejs');

app.use(require('morgan')('dev'))
app.use(require('cors')())

app.use(cookieParser('cookie_secret'));

app.use(passport.initialize())
require('./middleware/passport')(passport)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//доступ клиента к пикчам
app.use('/uploads', express.static('uploads'))



//routes
app.use(homeRoutes);
app.use(shopRoutes);
app.use(newsRoutes);
app.use(accRoutes);
app.use(authRoutes);
app.use(mailRoutes);


async function start() {
    try {
        await openConnection()

        app.listen(PORT, () => {
            console.log("Server is working on port " + PORT)
        });

        //await runMigrations();

        //await closeConnection();

    } catch (e) {
        console.log(e)
    }
}



start();


module.exports = app;