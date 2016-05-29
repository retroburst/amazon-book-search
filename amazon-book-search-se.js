// requires
var amazonSearchHelper = require('./lib/amazon-search-helper');

function amazonBookSearch(settings){
  if(!settings || !settings.awsKey || !settings.awsSecret){
    this.configured = false;
  } else {
    this.configured = true;
    this.amazonSearchHelper = new amazonSearchHelper(settings);
  }
}

/**
 * Search function
 * @param  {[type]}   searchArguments [The Search query, in a string form, example 'how to become a programmer' or an ISBN '9781424048830']
 * @param  {Function} callback        [in the form function(error, result){}]
 * @param  {Int} page                 [page number to retrieve]
 */
amazonBookSearch.prototype.search = function search(searchArguments, callback, page) {
  if(!this.configured){
      callback({ message: 'amazonBookSearch must be configured correctly before use.' }, null);
      return;
  }
    
  if(!searchArguments){
      callback({ message: 'Search arguments must be specified.' }, null);
      return;
  }
    
  this.resultHandler = function(error, result){
      if(error){
            callback(error, null);
            return;
        };
      console.log("result", result);
      for(var i=0; i < result.results.length; i++){
          console.log("result.results[" + i + "].ItemAttributes", result.results[i].ItemAttributes);
      }
      callback(null, result);
    };
    
    this.amazonSearchHelper.query(searchArguments, this.resultHandler, page);
};

module.exports = amazonBookSearch;
