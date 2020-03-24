const AylienNewsApi = require('aylien-news-api');
const dotenv = require('dotenv');
dotenv.config();

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = process.env.AYLIEN_APP_ID;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = process.env.AYLIEN_KEY;

const apiInstance = new AylienNewsApi.DefaultApi();

const getSummary = async (topic) => {
    const opts = {
        language: ['en'],
        sort_by: 'recency',
        perPage: 1,
        text: topic
    };
    let summary;
    while (summary === undefined || summary.length !== 1) {
        await new Promise((resolve, reject) => {
            apiInstance.listStories(opts, (error, data, response) => {
                try {
                    summary = data.stories.map((story) => story.summary.sentences[0]);
                    resolve(summary);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }
    return summary;
};

module.exports = {
    getSummary: getSummary
};
