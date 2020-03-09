const axios = require('axios');

const getInfoFromWiki = async (query) => {
    const url = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${query}`;

    const result = await axios.get(url);

    const pageID = Object.keys(result.data.query.pages)[0];

    const extract = result.data.query.pages[pageID].extract;

    return extract;
};

module.exports = {
    getInfoFromWiki: getInfoFromWiki
};
