const express = require('express');

const { getInfoFromWiki } = require('../services/wikiApi');

const router = new express.Router();

router.get('/wiki/:query', async (req, res) => {
    try {
        //extract is the general info paragraph that gets extracted from the top wikipedia about the query
        const extract = await getInfoFromWiki(req.params.query);
        if (!extract) {
            res.status(404).send({ error: 'search brought no results' });
        } else {
            res.status(200).send({ extract });
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = {
    wikiRouter: router
};
