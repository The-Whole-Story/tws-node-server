const findCategoryIPTC = (id) => {
    const iptcCategories = require('../services/iptcCategories.json');

    for (let i = 0; i < iptcCategories.length; i++) {
        if (iptcCategories[i]['id'] === id) {
            return iptcCategories[i]['label'];
        }
    }
    throw 'ID not found in IPTC categories';
};

const findCategoryIABQAG = (id) => {
    const iabqagCategories = require('./iabqagCategories.json');

    for (let i = 0; i < iabqagCategories.length; i++) {
        if (iabqagCategories[i]['id'] === id) {
            return iabqagCategories[i]['label'];
        }
    }

    throw 'ID not found in IAB-QAG categories';
};

module.exports = {
    findCategoryIPTC: findCategoryIPTC,
    findCategoryIABQAG: findCategoryIABQAG,
};
