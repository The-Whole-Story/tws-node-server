const AylienNewsApi = require('aylien-news-api');
const dotenv = require('dotenv');
dotenv.config();

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = process.env.AYLIEN_APP_ID;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = process.env.AYLIEN_KEY;

const apiInstance = new AylienNewsApi.DefaultApi();

const getSubtopics = async (options) => {
    let opts = {
        language: ['en'],
        sort_by: 'recency',
        perPage: 100
    };

    let subtopicsToAvoid = ['us', 'u.s', 'u.s.', 'united States', 'united', 'states', 'republican', 'liberal', 'virus'];

    if (options.nResults === undefined || options.nResults < 1) {
        throw new Error('nResults must be > 0');
    }

    if (options.topic !== undefined) {
        opts.text = options.topic;
        subtopicsToAvoid = [...subtopicsToAvoid, ...options.topic.toLowerCase().split(' ')];
    }

    if (options.filter !== undefined) {
        //if there is a filter provided
        if (options.filter.toLowerCase() === 'political') {
            opts.categoriesTaxonomy = 'iptc-subjectcode';
            opts.categoriesId = ['06004000', '11000000', '11024000'];
        }
    }

    let subtopics = {};

    return await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                data.stories.forEach((story) => {
                    story.entities.body.forEach((elem) => {
                        //if an individual word in a keyword element is in the subtopicsToAvoid array, then do not add it to the subtopic array
                        if (!elem.text.split(' ').some((word) => subtopicsToAvoid.indexOf(word.toLowerCase()) >= 0)) {
                            subtopics[elem.text.toLowerCase()] === undefined
                                ? (subtopics[elem.text.toLowerCase()] = 1)
                                : subtopics[elem.text.toLowerCase()]++;
                        }
                    });
                });

                let subtopicNames = Object.keys(subtopics);
                subtopicNames.sort((a, b) => {
                    if (subtopics[a] > subtopics[b]) {
                        //if the subtopic at a has more occurances, put a first
                        return -1;
                    }
                    if (subtopics[a] < subtopics[b]) {
                        return 1;
                    }
                    return 0;
                });

                if (subtopicNames.length < options.nResults) {
                    resolve(subtopicNames);
                }
                resolve(subtopicNames.slice(0, options.nResults));
            } catch (err) {
                reject(err);
            }
        });
    });
};

module.exports = {
    getSubtopics: getSubtopics
};
