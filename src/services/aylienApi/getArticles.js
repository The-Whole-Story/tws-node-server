const AylienNewsApi = require('aylien-news-api');
const { aylienKey, aylienAppId } = require('../../../config');

const key = process.env.AYLIEN_KEY || aylienKey;
const appId = process.env.AYLIEN_APP_ID || aylienAppId;

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = appId;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = key;

const apiInstance = new AylienNewsApi.DefaultApi();

const getArticles = async (options) => {
    let opts = {
        language: ['en'],
        sort_by: 'recency'
    };

    Object.keys(options).forEach((key) => (opts[key] = options[key]));

    return await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                let articles = data.stories.map((story) => {
                    let obj = {
                        storyId: story.id,
                        title: story.title,
                        author: story.author.name,
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

                resolve(articles);
            } catch (err) {
                reject(err);
            }
        });
    });
};

module.exports = {
    getArticles: getArticles
};
