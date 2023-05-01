const errorHandler = require('../errors/errorHandler')


module.exports.getAll = function (req, res) {

}

module.exports.getAllByCategoryId = function (req, res) {
    try {
        /*
        //поиск в БД
        const positions = await Position.find({
            category: req.params.categoryId,
            user: req.user.id
        })
       */

        res.status(200).json(mainObjects)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = function (req, res) {

}

module.exports.remove = function (req, res) {

}

module.exports.create = function (req, res) {

}

module.exports.update = function (req, res) {

}