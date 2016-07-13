var apacOperationHelper = require('apac').OperationHelper;

/********************************************************
 * Constructs a new amazon book search object.
 ********************************************************/
function amazonSearchHelper(settings){
    // configure the apac op helper
    this.apiClient = new apacOperationHelper({
        awsId: settings.awsKey,
        awsSecret: settings.awsSecret,
        assocId: settings.assocId,
        maxRequestsPerSecond: 1,
        xml2jsOptions: { explicitArray: true }
    });
};

/********************************************************
 * Search function that will call Amazon APAC API
 * function via search helper.
 ********************************************************/
amazonSearchHelper.prototype.query = function query(searchArguments, callback, page){
    var query = {
        'SearchIndex': 'Books',
        'Keywords': searchArguments,
        'ResponseGroup': 'ItemAttributes,Images'
    }

    if(page !== undefined && page !== null){
        query.ItemPage = page;
    }
    
    // action response handler callback
    var actionResponse = function actionResponse(response){
        var responseResult = response.result;
        var output = {};
        if(page !== undefined && page !== null){
            output.currentPage = page;
        }
        
        if(!responseResult.ItemSearchResponse && responseResult.ItemSearchErrorResponse){
            return callback(new Error(responseResult.ItemSearchErrorResponse.Error[0]), null);
        }
        if(!responseResult.ItemSearchResponse.Items[0].Request[0].IsValid[0]){
            return callback(new Error(responseResult.ItemSearchResponse.Items[0].Request[0].Errors[0].Error[0].Message[0]), null);
        }
        
        var results = responseResult.ItemSearchResponse.Items[0].Item;
        var totalResults = responseResult.ItemSearchResponse.Items[0].TotalResults[0];
        var totalPages = responseResult.ItemSearchResponse.Items[0].TotalPages[0];
        
        // no results from search, return empty results to callback
        if(!results){
            output = { totalResults:0, totalPages:0, currentPage:0, results:[] };
            return callback(null, output);
        }
        // package up results and return to callback
        output = { totalResults: totalResults, totalPages: totalPages, currentPage: page || 1, results: results};
        callback(null, output);
    };
    
    var executeResult = null;
    var promise = null;
    // execute the search using Amazon APAC API
    this.apiClient.execute('ItemSearch', query).then((response) => {
        if(response && response.result){
            actionResponse(response);
        } else {
            response().then(actionResponse);
        }
    }).catch((err) => {
        callback(err, null);
    });
};

module.exports = amazonSearchHelper;
