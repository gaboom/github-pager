## Pagination support for the GitHub API


Given you are using the GitHub API, this package can help you to retrieve ALL results instead of just the first perPage. GitHub API is of this writing limited to 100 results. In case you need all results, this module will retrieve all matches for your request, by parsing the links response attribute and following up to the next page until there is one, then returning all results together like in a sinlg call. 

This release is compatible with the following setup:
https://github.com/mikedeboer/node-github
https://developer.github.com/v3/

It is written in plain old JavaScript for your convenience.

### Usage example

To retrieve all pull requests between to dates:

```javascript
githubPager.readAllUnique(github.search.issues, {
    q: 'repo:${options.owner}/${options.repory type:pr created:${options.dateFrom}..${options.dateTo}',
    sort: 'created',
    order: 'asc'
})
.then(...)
.catch(...);
```

### API specification

##### readAll(method, options)

Execute the GitHub API method with given options and return its promise. perPage defaults to 100.
Duplicate items are possible in the resolved response.

##### readAllUnique(method, options) 

Execute the GitHub API method with given options and return its promise. perPage defaults to 100.
Duplicate items are filtered using the number attribute as unique key.

##### parseLinks(links)

Synchronous method to parse GitHub API links attribute. Returns array of links.

### Quality Assurance

THIS IS AS-IS CODE WRITTEN AS A QUICK HACK. USE IT AT YOUR OWN RISK.
