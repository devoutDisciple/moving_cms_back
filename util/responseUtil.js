module.exports = {
    // 返回 [{}, {}]
    renderFieldsAll: (data, fieldsArr = []) => {
        const result = [];
        data.forEach((item) => {
            const obj = {};
            fieldsArr.forEach((key) => {
                obj[key] = item[key];
            });
            result.push(obj);
        });
        return result;
    },
    // 返回 {}
    renderFieldsObj: (data, fieldsArr = []) => {
        const result = {};
        fieldsArr.forEach((key) => {
            result[key] = data[key];
        });
        return result;
    },
};
