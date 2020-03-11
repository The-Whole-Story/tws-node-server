const express = require('express');

const { getBareArticlesByQuery } = require('../services/aylienApi/getBareArticles');
const { getEntitiesByQuery } = require('../services/aylienApi/getEntities');
const { getPositiveNews } = require('../services/aylienApi/getPositve');

const router = new express.Router();

router.get('/articles/:query', async (req, res) => {
    try {
        const articles = await getBareArticlesByQuery(req.params.query);

        if (articles.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(articles);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/entities/:query', async (req, res) => {
    try {
        const entities = await getEntitiesByQuery(req.params.query);

        if (entities.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(entities);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = {
    aylienRouter: router
};
