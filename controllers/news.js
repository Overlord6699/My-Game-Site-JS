const errorHandler = require('../errors/errorHandler')
const Post = require('../models/Post')

async function getPosts(offset = 0, limit = 3) {
    try {

        const posts = await Post.findAll({
            offset: offset,
            limit: limit,
            order: [['published_date', 'DESC']]
        })

        return posts

    } catch (e) {
        console.log(e)
    }

    return null;
}

module.exports.getAll = async function (req, res) {
    try {
        const posts = await getPosts(0, req.params.limit)

        return posts;
    } catch (e) {
        errorHandler(res, e)
    }

    return null;
}

module.exports.getById = async function (req, res) {
    try {
        const post = await Post.findOne({
            where: { url_key: req.params.id }
        })

        return post

    } catch (e) {
        errorHandler(res, e)
    }

    return null
}

module.exports.remove = function (req, res) {

}

module.exports.create = function (req, res) {

}

module.exports.update = function (req, res) {

}

module.exports.count = async function (req, res) {
    let size = await Post.count();

    return size
}

module.exports.getPostsFromPage = async function (page = 1) {
    try {
        const limit = 3;
        const number = page * limit;


        const posts = await getPosts(0, number)

        return posts;

    } catch (e) {
        console.log(e)
    }

    return null;
}