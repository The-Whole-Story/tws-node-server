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

const getBareArticles = async (query) => {
    let search = query.replace(' ', '&&');
    const opts = {
        language: ['en'],
        text: `${search}`,
        sort_by: 'published_at',
        perPage: 20
    };

    return await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                let bareArticles = data.stories.map((story) => {
                    let obj = {
                        storyId: story.id,
                        title: story.title,
                        author: story.author,
                        body: story.body,
                        source: {
                            name: story.source.name,
                            domain: story.source.domain
                        },
                        url: story.links.permalink,
                        keywords: story.keywords
                    };
                    return obj;
                });

                resolve(bareArticles);
            } catch (err) {
                reject(err);
            }
        });
    });
};

const getEntities = async (query) => {
    let search = query.replace(' ', '&&');

    const opts = {
        language: ['en'],
        text: `${search}`,
        sort_by: 'published_at',
        perPage: 20
    };

    let entities = {};

    return await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                data.stories.forEach((story) => {
                    story.entities.body.forEach((elem) => {
                        if (!(elem.text in entities)) {
                            entities[elem.text] = 1;
                        } else {
                            entities[elem.text]++;
                        }
                    });
                });
                entities = Object.keys(entities).filter((entity) => entities[entity] > 1);
                //only returns the entities that occur more than once

                resolve(entities);
            } catch (err) {
                reject(err);
            }
        });
    });
};

module.exports = {
    getBareArticles: getBareArticles,
    getEntities: getEntities
};
