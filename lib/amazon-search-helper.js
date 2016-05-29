var apacOperationHelper = require('apac').OperationHelper;

function amazonSearchHelper(settings){
  this.apiClient = new apacOperationHelper({
    awsId:     settings.awsKey,
    awsSecret: settings.awsSecret,
    assocId:   settings.associate || 'wobonic'
  });
};

/**
 * [ Function to call Amazon API, provided by amazon]
 * @param  {[type]}   query    [search query]
 * @param  {Function} callback [callback in the form function(error, results){}]
 * @param  {Int}      page     [page number to retrieve]
 */
amazonSearchHelper.prototype.query = function query(searchArguments, callback, page){
    var query = {
        'SearchIndex': 'Books',
        'Keywords': searchArguments,
        'ResponseGroup': 'ItemAttributes'
    }

    if(page !== undefined && page !== null){
        query.ItemPage = page;
    }

    this.apiClient.execute('ItemSearch', query, function(response) {
        var output = {};
        if(page !== undefined && page !== null){
            output.currentPage = page;
        }
        
        if(!response.ItemSearchResponse && response.ItemSearchErrorResponse){
          return callback({ message: response.ItemSearchErrorResponse.Error[0] }, null);
        }
        if(!response.ItemSearchResponse.Items[0].Request[0].IsValid[0]){
          return callback({ message: response.ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Message[0] }, null);
        }
        
        console.log("response", response);
        console.log("response.ItemSearchResponse.Items[0]", response.ItemSearchResponse.Items[0]);
        
        var results = response.ItemSearchResponse.Items[0].Item;
        var totalResults = response.ItemSearchResponse.Items[0].TotalResults[0];
        var totalPages = response.ItemSearchResponse.Items[0].TotalPages[0];

        if(!results){
          output = { totalResults:0, totalPages:0, currentPage:0, results:[] };
          return callback(null, output);
        }
        output = { totalResults: totalResults, totalPages: totalPages, currentPage: page || 1, results: results};
        callback(null, output);
    });
}

module.exports = amazonSearchHelper;
