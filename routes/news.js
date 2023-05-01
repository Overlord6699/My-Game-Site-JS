const express = require('express');

const controller = require('../controllers/news')
const uploadHandler = require('../middleware/upload')

const router = express.Router()

/* Новости */
router.get('/news', async (req, res) => {
    let user = (Object.keys(req.signedCookies).length != 0 && req.signedCookies.token) ? req.signedCookies.token : null

    req.body.limit = 3;
    const posts = await controller.getAll(req)
    const totalCount = await controller.count()

    res.render('news', {
        page_name: 'Новости',
        user: user,
        pagination: {
            current: 1,
            paging: Math.ceil(totalCount / req.body.limit)
        },
        posts: posts,
    })
});

router.get('/news/pages/:id', async (req, res) => {
    let user = (Object.keys(req.signedCookies).length != 0 && req.signedCookies.token) ? req.signedCookies.token : null

    req.body.limit = 3;

    const posts = await controller.getPostsFromPage(req.params.id)
    const totalCount = await controller.count()

    res.render("news", {
        page_name: 'Новости',
        pagination: {
            current: req.body.id,
            paging: Math.ceil(totalCount / req.body.limit)
        },
        posts: posts,
        user: user
    });
});

router.get('/news/:id', (req, res) => {
    let user = (Object.keys(req.signedCookies).length != 0 && req.signedCookies.token) ? req.signedCookies.token : null

    const post = controller.getById(req, res)

    res.render("post", {
        post: post,
        page_name: 'Новость',
        user: user
    });
});

module.exports = router