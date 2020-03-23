const AylienNewsApi = require('aylien-news-api');
const dotenv = require('dotenv');
dotenv.config();

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = process.env.AYLIEN_APP_ID;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = process.env.AYLIEN_KEY;

const apiInstance = new AylienNewsApi.DefaultApi();

const getArticlesById = async (ids) => {
    if (ids.length < 1 || ids.length > 100) {
        throw new Error('nArticles must be within 1 and 100, both inclusive');
    }
    let opts = {
        language: ['en'],
        sort_by: 'recency',
        id: ids,
        perPage: ids.length
    };

    return await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                const articles = data.stories.map((story) => {
                    let obj = {
                        articleId: story.id,
                        title: story.title,
                        author: story.author.name,
                        body: story.body.split('\n').filter(s => s ? true : false),
                        source: {
                            name: story.source.name,
                            domain: story.source.domain
                        },
                        url: story.links.permalink,
                        publishedAt: story.published_at,
                        keywords: story.keywords
                    };
                    return obj;
                });
                resolve(articles);
            } catch (err) {
                reject(err);
            }
        });
    });
};

module.exports = {
    getArticlesById: getArticlesById
};
