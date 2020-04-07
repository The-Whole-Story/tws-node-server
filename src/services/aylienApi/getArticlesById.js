const AylienNewsApi = require('aylien-news-api');
const dotenv = require('dotenv');
dotenv.config();

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = process.env.AYLIEN_APP_ID;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = process.env.AYLIEN_KEY;

const apiInstance = new AylienNewsApi.DefaultApi();

const isEmpty = (str) => {
    return str.length === 0 || !str.trim();
};

const removeImageCaption = (body) => {
    for (let i = 0; i < body.length; i++) {
        if (body[i] == 'Image copyright') {
            body.splice(i, 4);
        }
    }
};

const removeFollowPlug = (body) => {
    if (body[body.length - 1].trim().substring(0, 10) == 'Follow BBC' && body[body.length - 1].includes('Instagram')) {
        body.splice(body.length - 1, 1);
    }
};

const getArticles = async (opts) => {
    return await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                const articles = data.stories.map((story) => {
                    let body = story.body.split('\n').filter((s) => (!isEmpty(s) ? true : false));
                    //body has split upon new lines and removed paragraphs that have no text
                    removeImageCaption(body);
                    //removes image caption
                    removeFollowPlug(body);

                    let obj = {
                        articleId: story.id,
                        title: story.title,
                        author: story.author.name,
                        body: body,
                        source: {
                            name: story.source.name,
                            domain: story.source.domain,
                        },
                        url: story.links.permalink,
                        publishedAt: story.published_at,
                        keywords: story.keywords,
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

const getArticlesById = async (ids) => {
    if (ids.length < 1 || ids.length > 100) {
        throw new Error('nArticles must be within 1 and 100, both inclusive');
    }
    let opts = {
        language: ['en'],
        sort_by: 'recency',
        id: ids,
        perPage: ids.length,
        _return: ['id', 'title', 'author', 'body', 'source', 'links', 'published_at', 'keywords'],
    };

    return getArticles(opts);
};

module.exports = {
    getArticlesById: getArticlesById,
};
