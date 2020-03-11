const AylienNewsApi = require('aylien-news-api');
const { aylienKey, aylienAppId } = require('../../../config');

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = aylienAppId;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = aylienKey;

const apiInstance = new AylienNewsApi.DefaultApi();

const getEntitiesByQuery = async (query, nEntities) => {
    let search = query.replace(' ', '&&');

    const entitiesToAvoid = [...query.toLowerCase().split(' '), 'us', 'u.s', 'u.s.', 'united States', 'united', 'states', 'republican', 'liberal'];
    const opts = {
        language: ['en'],
        text: `${search}`,
        sort_by: 'hotness',
        perPage: 100
    };

    let entities = {};

    return await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                data.stories.forEach((story) => {
                    story.entities.body.forEach((elem) => {
                        // console.log(elem.text.split(' '))
                        if (!elem.text.split(' ').some((word) => entitiesToAvoid.indexOf(word.toLowerCase()) >= 0)) {
                            //if an individual word in a keyword element is in the entitiesToAvoid array, then do not add it to the entities
                            entities[elem.text.toLowerCase()] === undefined ? (entities[elem.text] = 1) : entities[elem.text]++;
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

                if(entityNames.length < nEntities){
                    resolve(entityNames.slice(0,entityNames.length))
                }
                resolve(entityNames.slice(0,nEntities));
            } catch (err) {
                reject(err);
            }
        });
    });
};

module.exports = {
    getEntitiesByQuery: getEntitiesByQuery
};
