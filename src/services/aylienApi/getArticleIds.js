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
                const articles = data.stories.filter((story) => {
                    let body = story.body.split('\n'); //splits a story on a newline
                    if (body[body.length - 1].includes('...')) {
                        return false;
                    } else {
                        return true;
                    }
                });

                const articleIds = articles.map((article) => article.id);
                resolve(articleIds);
            } catch (err) {
                reject(err);
            }
        });
    });
};

const getArticleIds = async (options) => {
    const sources = [
        'BBC',
        'The Washington Post',
        'National Review',
        'The Economist',
        'The New York Times',
        'The Los Angeles Times',
        'Weekly Standard',
    ];

    let opts = {
        language: ['en'],
        sort_by: 'recency',
        sourceName: sources,
        _return: ['body', 'id'],
    };

    if (options.nResults === undefined || options.nResults < 1 || options.nResults > 100) {
        throw new Error('nResults must be within 1 and 100, both inclusive');
    } else {
        opts.perPage = options.nResults;
    }
    if (options.query !== undefined) {
        opts.text = options.query.replace(' ', '&&');
    }
    if (options.filter !== undefined) {
        //if there is a filter provided
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

            let articleIds = await getIds(opts);
            if (articleIds.length !== 0) {
                return articleIds;
            }
            delete opts.sourceScopesCity;
        }
    }
    let resultArticles = [];
    while (resultArticles.length < parseInt(options.nResults, 10)) {
        opts.perPage = '' + (parseInt(options.nResults, 10) - resultArticles.length);
        let temp = await getIds(opts);
        resultArticles.push(...temp);
    }
    return resultArticles;
};

module.exports = {
    getArticleIds: getArticleIds,
};
