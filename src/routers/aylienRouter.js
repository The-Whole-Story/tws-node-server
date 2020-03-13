const express = require('express');

const { getArticleIds } = require('../services/aylienApi/getArticleIds');
const { getArticlesById } = require('../services/aylienApi/getArticlesById');
const { getEntities } = require('../services/aylienApi/getEntities');
const { getPositiveNews } = require('../services/aylienApi/getPositve');
const { getLocalNews } = require('../services/aylienApi/getLocal');

const { auth } = require('../middleware/auth');

const router = new express.Router();

router.get('/articleIds/:query/:nArticles', auth, async (req, res) => {
    try {
        if (parseInt(req.params.nArticles) < 1 || parseInt(req.params.nArticles) > 100) {
            throw new Error('nArticles must be within 1 and 100, both inclusive');
        }
        let options = {
            text: req.params.query,
            perPage: req.params.nArticles
        };
        const articleIds = await getArticleIds(options);

        if (articleIds.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(articleIds);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/articlesById/', auth, async (req, res) => {
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

router.get('/politics/:nArticles', auth, async (req, res) => {
    try {
        if (parseInt(req.params.nArticles) < 1 || parseInt(req.params.nArticles) > 100) {
            throw new Error('nArticles must be within 1 and 100, both inclusive');
        }
        let options = {
            categoriesTaxonomy: 'iptc-subjectcode',
            categoriesId: ['06004000', '11000000', '11024000'],
            perPage: req.params.nArticles
        };
        const articles = await getArticles(options);

        if (articles.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(articles);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/positive/:query/:nArticles', auth, async (req, res) => {
    try {
        if (parseInt(req.params.nArticles) < 1 || parseInt(req.params.nArticles) > 100) {
            throw new Error('nArticles must be within 1 and 100, both inclusive');
        }
        const positiveArticles = await getPositiveNews(req.params.query, req.params.nArticles);

        if (positiveArticles.length === 0) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send(positiveArticles);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/local', auth, async (req, res) => {
    try {
        const articles = await getLocalNews(req.body.lat, req.body.long);

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
