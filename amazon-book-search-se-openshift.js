// requires
var amazonSearchHelper = require('./lib/amazon-search-helper');

/********************************************************
 * Constructs an amazon book search object.
 ********************************************************/
function amazonBookSearch(settings){
    if(!settings || !settings.awsKey || !settings.awsSecret || !settings.assocId){
        this.configured = false;
    } else {
        this.configured = true;
        // configure amazon search helper
        this.amazonSearchHelper = new amazonSearchHelper(settings);
    }
}

/********************************************************
 * Search function - calls Amazon API via amazon 
 * search helper.
 ********************************************************/
amazonBookSearch.prototype.search = function search(searchArguments, callback, page) {
    if(!this.configured){
      return callback({ message: 'Service must be configured correctly before use.' }, null);
    }

    if(!searchArguments){
      return callback({ message: 'Search arguments must be specified.' }, null);
    }

    // result handler callback
    this.resultHandler = function(error, result){
      if(error){
            return callback(error, null);
      };
      callback(null, result);
    };
    
    // query the Amazon APAC API via the search helper
    this.amazonSearchHelper.query(searchArguments, this.resultHandler, page);
};

module.exports = amazonBookSearch;
