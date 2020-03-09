const express = require('express');

const { getArticlesByQuery, getTrendingArticles } = require('../services/newsApi');

const router = new express.Router();

router.get('/news/:query', async (req, res) => {
    try {
        const articles = await getArticlesByQuery(req.params.query);
        if (articles.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(articles);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/news/trending', async (req, res) => {
    try {
        const articles = await getTrendingArticles();
        if (articles.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(articles);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = {
    newsRouter: router
};
