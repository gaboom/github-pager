var Q = require("Q");
var _ = require("lodash");

var MAX_PER_PAGE = 100;

function parseLinks(links) {
    return links.split(",").reduce(function(result, value){
        var rel = /<([^>]+)>; rel="([^"]+)"/.exec(value);
        result[rel[2]] = rel[1];
        return result;
    }, {});
}

function readAll(method, options) {
    var future = Q.defer();

    (function readRecursive(page, resultsSoFar) {
        var pageOptions = _.extend(options, {
            page: page,
            perPage: options.perPage ? options.perPage : MAX_PER_PAGE
        });
        Q.nfcall(method, pageOptions).done(function(response){
            if (response.incomplete_results !== false) {
                future.reject(response);
            }
            var results = resultsSoFar.concat(response.items);
            var hasNextPage = response.meta.link && parseLinks(response.meta.link)["next"];
            if (hasNextPage) {
                readRecursive(page + 1, results);
            } else {
                future.resolve(results);
            }
        });
    })(1, []);

    return future.promise;
}

function reduceUnique(items) {
    var uniqueItemsMap = items.reduce(function(result, value){
        result[value.number] = value;
        return result;
    }, {});
    return _.values(uniqueItemsMap);
}

function readAllUnique(method, options) {
    return reduceUnique(readAll(method, options));
}

module.exports = {
    parseLinks: parseLinks,
    readAll: readAll,
    reduceUnique: reduceUnique
}