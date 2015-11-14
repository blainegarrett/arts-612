var ResourceApiService = require('../../modules/utils/services').ResourceApiService;

var BlogPostService = {
    // Client Side Database wrapped around /api/galleries endpoint
    _resources_store: {},
    _query_result: null,

    set_resource: function(resource_data) {

        /* TODO: Move this to the base class */
        this._resources_store.push(resource_data);
        return resource_data;
    },

    get_multi: function(resource_ids) {
        // Given a list of resource ids, we pull them from our internal store
        var return_array = [];
        var resource_id;
        for (var i in resource_ids) {
            resource_id = resource_ids[i];
            return_array.push(this._resources_store[resource_id]);
        }

        return return_array;
    },
    get_all: function(prev_query) {
        var service = this;
        //var resource_url = '/api/posts';
        var resource_url = '/api/posts?limit=5&start_date=2015-01-01&is_published=true';

        if (prev_query && prev_query.cursor) {
            resource_url += '&cursor=' + prev_query.cursor
        }


        var promise =  new Promise(function(accept, reject) {
            ResourceApiService.fetch(resource_url).then(function(query_result) { //TODO: Pass in limit, etc

                service._query_result = query_result;

                // Store resource in internal storage
                var resource;
                var resource_ids_fetched = [];
                var resources_fetched = []; // Don't populate this if it is keys_only

                for (var i in query_result.resources) { // TODO: Implement iterator that'll fetch more if needed
                    resource = query_result.resources[i];
                    service._resources_store[resource.resource_id] = resource;
                    resource_ids_fetched.push(resource.resource_id);
                    resources_fetched.push(resource);
                }

                // Tell Store we successfully fetched their data
                accept(resources_fetched);

            }, reject);
        });
        return promise;
    },

    get_by_slug: function(slug) {
        var service = this;
        var resource_url = '/api/posts?get_by_slug=' + slug;

        var promise =  new Promise(function(accept, reject) {
            ResourceApiService.fetch(resource_url).then(function(query_result) {
                resource = query_result.resources;
                service._resources_store[resource.resource_id] = resource;
                accept(resource);

            }, reject);
        });
        return promise;
    }

};

module.exports = {
    BlogPostService: BlogPostService
}