var ResourceApiService = require('../../modules/utils/services').ResourceApiService;

var EventService = {
    _resources_store: [],

    set_resource: function(resource_data) {

        /* TODO: Move this to the base class */
        this._resources_store.push(resource_data);
        return resource_data;
    },

    get_by_slug: function(slug) {

        var resource_url = '/api/events?get_by_slug=' + slug;

        var promise =  new Promise(function(accept, reject) {
            ResourceApiService.fetch(resource_url).then(function(resource_data) {
                accept(resource_data);
            }, reject);
        });
        return promise;
    }

};

module.exports = {
    EventService: EventService
}