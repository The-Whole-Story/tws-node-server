const AylienNewsApi = require('aylien-news-api');
const { aylienKey, aylienAppId } = require('../../../config');

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = aylienAppId;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = aylienKey;

const apiInstance = new AylienNewsApi.DefaultApi();

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
    getEntities: getEntities
};
