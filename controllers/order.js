//const Order = require('../models/Order')
const errorHandler = require('../errors/errorHandler')


module.exports.getAll = async function (req, res) {
    //фильтр
    const query = {
        user: req.user.id
    }

    //дата начала
    if (req.query.start) {
        query.date = {
            //более поздние даты
            $gte: req.query.start
        }
    }

    //дата конца
    if (req.query.end) {
        if (!query.date) {
            query.date = {

            }
        }

        query.date['$lte'] = req.query.end
    }

    //номер
    if (req.query.order) {
        query.order = +req.query.order
    }

    try {
        const orders = await Order
            .find(query)
            .sort({ date: -1 })
            .skip(+req.query.offset) //числа
            .limit(+req.query.limit)

        res.status(200).json(orders)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = function (req, res) {

}

module.exports.remove = function (req, res) {

}

module.exports.create = async function (req, res) {


    try {
        const lastOrder = await Order.findOne({
            user: req.user.id
        }).sort({ date: -1 }) //в порядке убывания


        const maxOrder = lastOrder ? lastOrder.order : 1
        /*
        const order = await new Order({
            list: req.body.list,
            user: req.user.id,
            order: maxOrder+1
        }).save()
        
        res.status(201).json(order)
        */
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = function (req, res) {

}