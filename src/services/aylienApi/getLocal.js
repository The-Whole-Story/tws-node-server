const AylienNewsApi = require('aylien-news-api');
const dotenv = require('dotenv');
dotenv.config()

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = process.env.AYLIEN_APP_ID;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = process.env.AYLIEN_KEY;

const apiInstance = new AylienNewsApi.DefaultApi();

const getNews = async (opts) => {
    return await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                if (data.stories.length == 0) {
                    resolve(-1);
                }
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

const getLocalNews = async (lat, long) => {
    const geoData = reverse.lookup(lat, long, 'us');
    const state = geoData.state;
    const city = geoData.city;

    let opts = {
        language: ['en'],
        sort_by: 'recency',
        sourceScopesCity: [city],
        sourceScopesState: [state],
        sourceLocationsCountry: ['US']
    };

    let articles = await getNews(opts);

    if (articles !== -1) {
        return articles;
    }
    //if the city search brougnt no results, the widen the scope to the state
    delete opts.sourceScopesCity;
    articles = await getNews(opts);
    if (articles !== -1) {
        return articles;
    } else {
        throw new Error('No city or state news found');
    }
};

module.exports = {
    getLocalNews: getLocalNews
};
