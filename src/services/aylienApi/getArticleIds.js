const AylienNewsApi = require('aylien-news-api');
const reverse = require('reverse-geocode');
const dotenv = require('dotenv');
dotenv.config();

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = process.env.AYLIEN_APP_ID;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = process.env.AYLIEN_KEY;

const apiInstance = new AylienNewsApi.DefaultApi();

const getIds = async (opts) => {
    return await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                const articleIds = data.stories.map((story) => story.id);
                resolve(articleIds);
            } catch (err) {
                reject(err);
            }
        });
    });
};

const getArticleIds = async (options) => {
    let opts = {
        language: ['en'],
        sort_by: 'recency'
    };

    let articleIds;

    if (options.nArticles < 1 || options.nArticles > 100) {
        throw new Error('nArticles must be within 1 and 100, both inclusive');
    } else {
        opts.perPage = options.nArticles;
    }
    if (options.query !== undefined) {
        opts.text = options.query;
    }

    if (options.filter.toLowerCase() === 'positive') {
        opts.sentimentBodyPolarity = 'positive';
        opts.notSentimentTitlePolarity = 'negative';
    } else if (options.filter.toLowerCase() === 'political') {
        opts.categoriesTaxonomy = 'iptc-subjectcode';
        opts.categoriesId = ['06004000', '11000000', '11024000'];
    } else if (options.filter.toLowerCase() === 'local') {
        if (options.lat === undefined || options.long === undefined) {
            throw new Error('If attempting to access local news, lat and long must be provided in request body');
        }
        const geoData = reverse.lookup(options.lat, options.long, 'us');

        opts.sourceScopesCity = [geoData.city];
        opts.sourceScopesState = [geoData.state];

        articleIds = await getIds(opts);
        if (articleIds.length !== 0) {
            return articleIds;
        }
        delete opts.sourceScopesCity;
    }

    return await getIds(opts);

};

module.exports = {
    getArticleIds: getArticleIds
};
