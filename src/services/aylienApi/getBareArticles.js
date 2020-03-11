const AylienNewsApi = require('aylien-news-api');
const { aylienKey, aylienAppId } = require('../../../config');

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = aylienAppId;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = aylienKey;

const apiInstance = new AylienNewsApi.DefaultApi();

const getBareArticlesByQuery = async (query, nArticles) => {
    let search = query.replace(' ', '&&').replace('%20', '&&');
    const opts = {
        language: ['en'],
        text: `${search}`,
        sort_by: 'published_at',
        perPage: nArticles
    };

    return await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                let bareArticles = data.stories.map((story) => {
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

                resolve(bareArticles);
            } catch (err) {
                reject(err);
            }
        });
    });
};

module.exports = {
    getBareArticlesByQuery: getBareArticlesByQuery
};
