const express = require('express');

const { getArticleIds } = require('../services/aylienApi/getArticleIds');
const { getArticlesById } = require('../services/aylienApi/getArticlesById');
const { getSubtopics } = require('../services/aylienApi/getSubtopics');

const { auth } = require('../middleware/auth');

const router = new express.Router();

router.post('/articleIds', auth, async (req, res) => {
    try {
        const articleIds = await getArticleIds(req.body);

        if (articleIds.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(articleIds);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/articlesById', auth, async (req, res) => {
    try {
        if (req.body.ids.length < 1 || req.body.ids.length > 100) {
            throw new Error('nArticles must be within 1 and 100, both inclusive');
        }
        const articles = await getArticlesById(req.body.ids);
        if (articles.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(articles);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/subtopics', auth, async (req, res) => {
    try {
        const subtopics = await getSubtopics(req.body);

        if (subtopics.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(subtopics);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = {
    aylienRouter: router
};
