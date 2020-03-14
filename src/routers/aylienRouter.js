const express = require('express');

const { getArticleIds } = require('../services/aylienApi/getArticleIds');
const { getArticlesById } = require('../services/aylienApi/getArticlesById');
const { getEntities } = require('../services/aylienApi/getEntities');

const { auth } = require('../middleware/auth');

const router = new express.Router();

router.get('/articleIds', auth, async (req, res) => {
    try {
        const articleIds = await getArticleIds(req.body);

        if (articleIds.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(articleIds);
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.get('/articlesById', auth, async (req, res) => {
    try {
        if (req.body.length < 1 || req.body.length > 100) {
            throw new Error('nArticles must be within 1 and 100, both inclusive');
        }
        let opts = {
            id: req.body,
            perPage: req.body.length
        };
        const articles = await getArticlesById(opts);
        if (articles.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(articles);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/entities/:query/:nEntities', auth, async (req, res) => {
    try {
        if (req.params.nEntities < 1) {
            throw new Error('nEntities must be greater than 0');
        }
        let options = {
            text: req.params.query
        };
        const entities = await getEntities(options, req.params.nEntities);

        if (entities.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(entities);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/politicalEntities/:nEntities', auth, async (req, res) => {
    try {
        if (req.params.nEntities < 1) {
            throw new Error('nEntities must be greater than 0');
        }
        let options = {
            categoriesTaxonomy: 'iptc-subjectcode',
            categoriesId: ['06004000', '11000000', '11024000']
        };
        const entities = await getEntities(options, req.params.nEntities);

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
