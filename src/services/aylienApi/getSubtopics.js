const AylienNewsApi = require('aylien-news-api');
const dotenv = require('dotenv');
dotenv.config();

const { getCategoryIPTC } = require('../getCategoryName');
const { getCategoryIABQAG } = require('../getCategoryName');

const defaultClient = AylienNewsApi.ApiClient.instance;

const app_id = defaultClient.authentications['app_id'];
app_id.apiKey = process.env.AYLIEN_APP_ID;

const app_key = defaultClient.authentications['app_key'];
app_key.apiKey = process.env.AYLIEN_KEY;

const apiInstance = new AylienNewsApi.DefaultApi();

let categoryOccurences = {};

const getCategoryNames = (categories) => {
    return categories.map((category) => {
        if (category['taxonomy'] == 'iab-qag') {
            return getCategoryIABQAG(category['id']);
        } else if (category['taxonomy'] == 'iptc-subjectcode') {
            return getCategoryIPTC(category['id']);
        } else {
            throw 'category taxonomy not found';
        }
    });
};

const addUnique = (arr, categoryNames) => {
    updateCategoryOccurences(categoryNames);
    if (arr === undefined || arr.length == 0) {
        if (categoryNames !== undefined) {
            return categoryNames;
        } else {
            return [];
        }
    }
    for (let i = 0; i < categoryNames.length; i++) {
        if (arr.indexOf(categoryNames[i]) === -1) {
            arr.push(categoryNames[i]);
        }
    }
};

const updateCategoryOccurences = (categoryNames) => {
    for (let i = 0; i < categoryNames.length; i++) {
        if (categoryOccurences[categoryNames[i]] === undefined) {
            categoryOccurences[categoryNames[i]] = 1;
        } else {
            categoryOccurences[categoryNames[i]]++;
        }
    }
};

const indexOfSubtopicInArray = (arr, text) => {
    if (arr.length === 0) {
        return -1;
    }

    for (let i = 0; i < arr.length; i++) {
        if (arr[i]['name'] === text) {
            return i;
        }
    }
    return -1;
};

const getSubtopics = async (options) => {
    let opts = {
        language: ['en'],
        sort_by: 'recency',
        perPage: 100,
        _return: ['categories', 'entities'],
    };

    let subtopicsToAvoid = ['us', 'u.s', 'u.s.', 'united States', 'united', 'states', 'republican', 'liberal', 'virus'];

    if (options.nResults === undefined || options.nResults < 1) {
        throw new Error('nResults must be > 0');
    }

    if (options.topic !== undefined) {
        opts.text = options.topic.replace(' ', '&&');
        subtopicsToAvoid = [...subtopicsToAvoid, ...options.topic.toLowerCase().split(' ')];
    }

    if (options.filter !== undefined) {
        //if there is a filter provided
        if (options.filter.toLowerCase() === 'political') {
            opts.categoriesTaxonomy = 'iptc-subjectcode';
            opts.categoriesId = ['06004000', '11000000', '11024000'];
        }
    }

    let subtopics = [];

    return await new Promise((resolve, reject) => {
        apiInstance.listStories(opts, (error, data, response) => {
            try {
                data.stories.forEach((story) => {
                    let categoryNames = getCategoryNames(story.categories);

                    story.entities.body.forEach((elem) => {
                        //if an individual word in a keyword element is in the subtopicsToAvoid array, then do not add it to the subtopic array
                        if (!elem.text.split(' ').some((word) => subtopicsToAvoid.indexOf(word.toLowerCase()) >= 0)) {
                            let index = indexOfSubtopicInArray(subtopics, elem.text.toLowerCase());
                            if (index !== -1) {
                                subtopics[index]['count']++;
                                addUnique(subtopics[index]['categories'], categoryNames);
                            } else {
                                subtopics.push({
                                    name: elem.text.toLowerCase(),
                                    count: 1,
                                    categories: categoryNames,
                                });
                            }
                        }
                    });
                });

                subtopics = subtopics.sort((a, b) => {
                    if (a['count'] > b['count']) {
                        //if the subtopic at a has more occurances, put a first
                        return -1;
                    }
                    if (a['count'] < b['count']) {
                        return 1;
                    }
                    return 0;
                });

                if (subtopics.length < options.nResults) {
                    for (let i = 0; i < subtopics.length; i++) {
                        delete subtopics[i]['count'];
                        subtopics[i]['categories'].sort((a, b) => {
                            if (categoryOccurences[a] > categoryOccurences[b]) {
                                return -1;
                            } else if (categoryOccurences[a] < categoryOccurences[b]) {
                                return 1;
                            }
                            return 0;
                        });
                    }
                    resolve(subtopics);
                } else {
                    for (let i = 0; i < options.nResults; i++) {
                        delete subtopics[i]['count'];
                        subtopics[i]['categories'].sort((a, b) => {
                            if (categoryOccurences[a] > categoryOccurences[b]) {
                                return -1;
                            } else if (categoryOccurences[a] < categoryOccurences[b]) {
                                return 1;
                            }
                            return 0;
                        });
                    }
                    resolve(subtopics.slice(0, options.nResults));
                }
            } catch (err) {
                reject(err);
            }
        });
    });
};

module.exports = {
    getSubtopics: getSubtopics,
};
