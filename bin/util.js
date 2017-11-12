const fs = require("fs");
const path = require("path");

module.exports.getAllFileNames = function getAllFileNames(start, filter) {
    var output = [];
    if (Array.isArray(start)) {
        start.forEach(function (start) {
            getAllFileNameStep(start, output, filter);
        })
    }
    else {
        getAllFileNameStep(start, output, filter);
    }
    return output;
};

function getAllFileNameStep(start, output, filter) {
    const rootPath = path.resolve(start);
    const files = fs.readdirSync(rootPath);
    files.forEach(function (file) {
        const fullFilePath = path.join(rootPath, file);
        if (fs.lstatSync(fullFilePath).isDirectory()) {
            getAllFileNameStep(fullFilePath, output, filter);
        }
        else if (filter) {
            if(filter.test(fullFilePath)) {
                output.push(fullFilePath);
            }
        }
        else {
            output.push(fullFilePath);
        }
    });
}