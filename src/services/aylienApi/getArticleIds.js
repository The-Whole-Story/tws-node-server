const AylienNewsApi = require('aylien-news-api');
const dotenv = require('dotenv');
dotenv.config();

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = process.env.AYLIEN_APP_ID;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = process.env.AYLIEN_KEY;

const apiInstance = new AylienNewsApi.DefaultApi();

const getArticleIds = async (options) => {
    let opts = {
        language: ['en'],
        sort_by: 'recency'
    };

    Object.keys(options).forEach((key) => (opts[key] = options[key]));

    return await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                const articleIds = data.stories.map((story) => story.id);
                resolve(articleIds);
            } catch (errr) {
                reject(err);
            }
        });
    });
};

module.exports = {
    getArticleIds: getArticleIds
};
