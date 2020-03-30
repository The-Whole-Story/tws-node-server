const express = require('express');

const { getArticleIds } = require('../services/aylienApi/getArticleIds');
const { getArticlesById } = require('../services/aylienApi/getArticlesById');
const { getSubtopics } = require('../services/aylienApi/getSubtopics');
const { getSummary } = require('../services/aylienApi/getSummary')

const { auth } = require('../middleware/auth');

const router = new express.Router();

router.get('/articleIds', auth, async (req, res) => {
    try {
        const articleIds = await getArticleIds(req.query);

        if (articleIds.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(articleIds);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/articlesById', auth, async (req, res) => {
    try {
        const ids = Object.values(req.query).map((id) => parseInt(id));
        const articles = await getArticlesById(ids);
        if (articles.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(articles);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/subtopics', auth, async (req, res) => {
    try {
        const subtopics = await getSubtopics(req.query);

        if (subtopics.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(subtopics);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/summary', auth, async (req, res) => {
    try {
        const summary = await getSummary(req.query.topic);
        if (summary === '') {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(summary);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = {
    aylienRouter: router
};
