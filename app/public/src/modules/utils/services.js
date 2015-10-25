/**
Core Service utilities for interacting with server, apis, ect.


TODO:
[ ] ResourceApiService.fetch currently uses jquery, which is not ideal
[ ] ResourceApiService needs to be far more robust and to handle global loading states, offline, etc
*/

var ResourceApiService = {
    fetch: function (url) {
        /* Generic fetching service that operates on promises */

        var promise = new Promise(function(accept, reject) {
            var req = $.ajax({
                url: url,
                context: this,
                dataType: 'json',
                success:  function (response) {

                    if (response.status == 200) {
                        accept(response.results);
                    }
                    else {
                        console.log('fail…¬π0o9')
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
    ResourceApiService: ResourceApiService
}