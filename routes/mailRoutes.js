const mailer = require("../middleware/mailer")
const express = require("express")

const router = express.Router()

router.post("/sendEmail", (req, res) => {
    mailer.sendMail(req, res);
})

module.exports = router