const express = require('express');

const { getArticles } = require('../services/aylienApi');

const router = new express.Router();

router.get('/aylien/:query', async (req, res) => {
    try {
        articles = await getArticles(req.params.query);

        if (articles.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(articles)
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = {
    aylienRouter: router
};
