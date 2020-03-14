const AylienNewsApi = require('aylien-news-api');
const dotenv = require('dotenv');
dotenv.config();

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = process.env.AYLIEN_APP_ID;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = process.env.AYLIEN_KEY;

const apiInstance = new AylienNewsApi.DefaultApi();

const getEntities = async (options) => {
    let opts = {
        language: ['en'],
        sort_by: 'recency'
    };

    let entitiesToAvoid = ['us', 'u.s', 'u.s.', 'united States', 'united', 'states', 'republican', 'liberal'];

    if (options.nEntities === undefined || options.nEntities < 1) {
        throw new Error('nEntities must be > 0');
    } else {
        opts.perPage = options.nEntities;
    }

    if (options.query !== undefined) {
        opts.text = options.query;
        entitiesToAvoid = [...entitiesToAvoid, ...options.query.toLowerCase().split(' ')];
    }

    if (options.filter !== undefined) {
        //if there is a filter provided
        if (options.filter.toLowerCase() === 'positive') {
            opts.sentimentBodyPolarity = 'positive';
            opts.notSentimentTitlePolarity = 'negative';
        } else if (options.filter.toLowerCase() === 'political') {
            opts.categoriesTaxonomy = 'iptc-subjectcode';
            opts.categoriesId = ['06004000', '11000000', '11024000'];
        }
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

                if (entityNames.length < options.nEntities) {
                    resolve(entityNames);
                }
                resolve(entityNames.slice(0, options.nEntities));
            } catch (err) {
                reject(err);
            }
        });
    });
};

module.exports = {
    getEntities: getEntities
};
