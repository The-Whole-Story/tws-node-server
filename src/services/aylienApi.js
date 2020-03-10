const AylienNewsApi = require('aylien-news-api');
const axios = require('axios');

const { aylienKey, aylienAppId } = require('../../config');

const defaultClient = AylienNewsApi.ApiClient.instance;

// Configure API key authorization: app_id
const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = aylienAppId;

// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//app_id.apiKeyPrefix = 'Token';
// Configure API key authorization: app_key

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = aylienKey;
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//app_key.apiKeyPrefix = 'Token';

const apiInstance = new AylienNewsApi.DefaultApi();

const getArticles = async (query) => {
    const opts = {
        language: ['en'],
        text: `${query}`,
        sort_by: 'published_at',
        perPage: 20
    };

    let articles = [];

    await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                articles.push(data.stories);
                resolve();
            } catch (err) {
                throw new Error(err);
            }
        });
    });
    return articles;
};

module.exports = {
    getArticles: getArticles
};
