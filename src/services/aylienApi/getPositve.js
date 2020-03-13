const AylienNewsApi = require('aylien-news-api');
const dotenv = require('dotenv');
dotenv.config()

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = process.env.AYLIEN_APP_ID;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = process.env.AYLIEN_KEY;

const apiInstance = new AylienNewsApi.DefaultApi();

const getPositiveNews = async (query, nArticles) => {
    let search = query.replace(' ', '&&').replace('%20', '&&');
    const opts = {
        text: `${search}`,
        sentimentBodyPolarity: 'positive',
        notSentimentTitlePolarity: 'negative',
        language: ['en'],
        sort_by: 'hotness',
        perPage: 100
    };

    return await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                let positiveArticles = data.stories.map((story) => {
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
                        keywords: story.keywords,
                        sentiment: story.sentiment.body.score //note, sentiment here is always positive because it was specified in the api call
                    };
                    return obj;
                });

                positiveArticles.sort((a, b) => {
                    if (a.sentiment > b.sentiment) {
                        return -1;
                    }
                    if (a.sentiment < b.sentiment) {
                        return 1;
                    }
                    return 0;
                });

                const mostPositiveArticles = positiveArticles.slice(0, parseInt(nArticles));

                resolve(mostPositiveArticles);
            } catch (err) {
                reject(err);
            }
        });
    });
};

module.exports = {
    getPositiveNews: getPositiveNews
};
