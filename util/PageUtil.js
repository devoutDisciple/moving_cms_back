const CountUtil = require('./CountUtil');

module.exports = {
    getPageCondition: (current, pagesize) => {
        if (!current || current < 1) current = 1;
        if (!pagesize) pagesize = 10;
        const offset = CountUtil.getInt((Number(current) - 1) * pagesize);
        return {
            limit: Number(pagesize),
            offset: Number(offset),
        };
    },
};
