const axios = require('axios');

const { newsKey } = require('../../config');

const getArticlesByQuery = async (query) => {
    const domains = 'economist.com, wsj.com, washingtonpost.com, bbc.com';
    //list of domains will be updated, this is just a working list at the moment
    const url = `http://newsapi.org/v2/everything?language=en&q=${query}&pageSize=100&domains=${domains}`;

    return (await axios.get(url, { params: {}, headers: { Authorization: newsKey } })).data.articles;
};

const getTrendingArticles = async () => {
    const sources = 'bbc-news,the-wall-street-journal,the-washington-post'; 
    //economist does not have a source id listed with the news api, so we cannot access it here
    const url = `http://newsapi.org/v2/top-headlines?sources=${sources}&apiKey=${newsKey}&pageSize=3`;


    return (await axios.get(url, { params: {}, headers: { Authorization: newsKey } })).data.articles;
};

module.exports = {
    getArticlesByQuery: getArticlesByQuery,
    getTrendingArticles: getTrendingArticles
};
