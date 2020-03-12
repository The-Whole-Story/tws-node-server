const AylienNewsApi = require('aylien-news-api');
const { aylienKey, aylienAppId } = require('../../../config');

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = aylienAppId;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = aylienKey;

const apiInstance = new AylienNewsApi.DefaultApi();

const getEntities = async (options, nEntities) => {
    const opts = {
        language: ['en'],
        sort_by: 'recency',
        perPage: 100
    };

    Object.keys(options).forEach((key) => (opts[key] = options[key]));

    let entitiesToAvoid = ['us', 'u.s', 'u.s.', 'united States', 'united', 'states', 'republican', 'liberal'];

    if ('text' in options) {
        entitiesToAvoid = [...entitiesToAvoid, ...options.text.toLowerCase().split(' ')];
    }

    let entities = {};

    return await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                data.stories.forEach((story) => {
                    story.entities.body.forEach((elem) => {
                        //if an individual word in a keyword element is in the entitiesToAvoid array, then do not add it to the entities array
                        if (!elem.text.split(' ').some((word) => entitiesToAvoid.indexOf(word.toLowerCase()) >= 0)) {
                            entities[elem.text.toLowerCase()] === undefined
                                ? (entities[elem.text.toLowerCase()] = 1)
                                : entities[elem.text.toLowerCase()]++;
                        }
                    });
                });

                let entityNames = Object.keys(entities);
                entityNames.sort((a, b) => {
                    if (entities[a] > entities[b]) {
                        //if the entity at a has more occurances, put a first
                        return -1;
                    }
                    if (entities[a] < entities[b]) {
                        return 1;
                    }
                    return 0;
                });

                if (entityNames.length < nEntities) {
                    resolve(entityNames);
                }
                resolve(entityNames.slice(0, nEntities));
            } catch (err) {
                reject(err);
            }
        });
    });
};

module.exports = {
    getEntities: getEntities
};
