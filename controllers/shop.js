const errorHandler = require('../errors/errorHandler')
const Product = require('../models/Product')

module.exports.getAll = async function (req, res) {
    try {
        const products = await Product.findAll();

        return products;
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getAllByCategoryId = async function (req, res) {
    try {
        //const product = await Product.);

        res.status(200).json(mainObjects)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const product = await Product.findOne({
            where: { url_key: req.params.id }
        })

        console.log(product)

        return product
    } catch (e) {
        console.log(e)
        //errorHandler(res, e)
    }

    return null
}

module.exports.remove = function (req, res) {

}

module.exports.create = function (req, res) {

}

module.exports.update = function (req, res) {

}