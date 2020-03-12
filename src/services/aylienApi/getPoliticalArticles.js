const AylienNewsApi = require('aylien-news-api');
const { aylienKey, aylienAppId } = require('../../../config');

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = aylienAppId;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = aylienKey;

const apiInstance = new AylienNewsApi.DefaultApi();

const getPoliticalArticles = async (nArticles) => {
    const opts = {
        language: ['en'],
        sort_by: 'recency',
        categoriesTaxonomy: 'iptc-subjectcode',
        categoriesId: ['06004000', '11000000', '11024000'],
        perPage: nArticles
    };

    return await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                let politicalArticles = data.stories.map((story) => {
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

                resolve(politicalArticles);
            } catch (err) {
                reject(err);
            }
        });
    });
};

module.exports = {
    getPoliticalArticles: getPoliticalArticles
};
