const nodeMailer = require("nodemailer");
require('dotenv').config();


let mailer = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});



module.exports.sendMail = (req, res) => {
    let mailOptions = {
        from: process.env.SMTP_USER,
        to: req.body.email,
        subject: "Welcome",
        html: `<h1>You are welcome!</h1>
            <p>From: ${process.env.SMTP_USER} <br>
              Thanks, ${req.body.username}, for visiting our platform
              </p>`
    };

    mailer.sendMail(mailOptions, (error, info) => {

        if (error) {
            console.log(error);
            return res.status(300).json("OK");
        }

        res.status(200).json("error")

    });
}