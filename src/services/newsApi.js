const axios = require('axios');

const { newsKey } = require('../../config');

const getArticlesByQuery = async (query) => {
    const url = `http://newsapi.org/v2/everything?q=${query}`;

    return (await axios.get(url, { params: {}, headers: { Authorization: newsKey } })).data.articles;
};

const getTrendingArticles = async (query) => {
    const url = `http://newsapi.org/v2/top-headlines`;

    return (await axios.get(url, { params: {}, headers: { Authorization: newsKey } })).data.articles;
};

module.exports = {
    getArticlesByQuery: getArticlesByQuery,
    getTrendingArticles: getTrendingArticles
};
