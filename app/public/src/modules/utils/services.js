/**
Core Service utilities for interacting with server, apis, ect.


TODO:
[ ] ResourceApiService.fetch currently uses jquery, which is not ideal
[ ] ResourceApiService needs to be far more robust and to handle global loading states, offline, etc
*/

var QueryResult = function(stuff) {
    // I wish this was in dart...

    this.resources = [];
    this.more = false;
    this.cursor = null;

    this.init = function(raw_rest_response) {
        /* Constructor */

        this.resources = raw_rest_response.results;
        this.more = raw_rest_response.more;
        this.cursor = raw_rest_response.cursor;
        return this;
    }

    return this.init(stuff);

};


var ResourceApiService = {
    fetch: function (url) {
        /* Generic fetching service that operates on promises */

        console.log('CALLING OUT TO SERVICE: ' + url);
        var promise = new Promise(function(accept, reject) {
            var req = $.ajax({
                url: url,
                context: this,
                dataType: 'json',
                success:  function (response) {

                    if (response.status == 200) {
                        // Create a Query Result object to encapsulate request
                        var q = new QueryResult(response);

                        // Pass query result object to consumer service
                        accept(q);
                    }
                    else {
                        reject('Received a status of ' + response.status);
                    }
                },
                error: function (xhr, status, err) {
                    /* Server Error or 404, etc */
                    reject(err);
                }
            });
        });
        return promise;
    }
};


module.exports = {
    ResourceApiService: ResourceApiService,
    QueryResult: QueryResult

}