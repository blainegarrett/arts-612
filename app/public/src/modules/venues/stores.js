var Reflux = require('reflux');
var VenueActions = require('./actions').VenueActions;
var VenueService = require('./services').VenueService;


var VenueStore = Reflux.createStore({
    // Include logical operations for this domain
    // Public interface only contains getters, not setters
    // Setters are only in response to listenable Actions
    // Store can pivot on the data coming in to decide how to update itself
    //

    listenables: [VenueActions],
    //_list: {}, // Private Hash. Only available via getters
    _store: [],
    _store_populated: false,


    init: function () {
        // Register listeners
        // this.listenTo(VenueActions.load, this.fetchData); //output is a callbak for the listener of statusUpdate
        // this.listenTo(VenueActions.log, this.logStore);

        // TODO: Figure out how to block additional calls until this is completed
        this.onRequestAll();

    },

    onRequestAll: function() {
        /* Serve Up all the Venues */
        // Do we already have them all; if so return them
        // Are they older than TIMEOUT ?

        if (this._store_populated) { // also check for stale state/timeout?
            var resources = VenueService.get_multi(this._store);
            this.trigger(resources);
            return;
        }

        var promise = VenueService.get_all().then(function(resources) {
            // TODO: Internally store the references to these resources

            // Rebuild Index
            this._store = [];
            var venue;
            for (var i in resources) {
                venue = resources[i];
                this._store.push(venue.resource_id);
            }

            // Actually pull the data from the service - at this point shouldn't be an RPC
            this._store_populated = true;
            this.trigger(VenueService.get_multi(this._store));
            return
            }.bind(this), function(err) {
                console.log('Error calling service layer');
                this.trigger('NOPE');
            }.bind(this)
        );
    },

});

var VenueSlugStore = Reflux.createStore({

    listenables: [VenueActions],
    _slug_to_resource_id_map: {},

    init: function() {
        this.listenTo(VenueStore, this.onManyLoaded);
        //this.joinTrailing(VenueActions.requestAll, this.RequestAll);
    },

    // Getter's - Note: This might be flux anti-pattern
    get: function(slug) {
        var store = this;
        var promise = new Promise(function(accept, reject) {

            if (store._slug_to_resource_id_map[slug]) {
                // We have already cached it, just return it
                var resource = VenueService.get_multi([store._slug_to_resource_id_map[slug]])[0];
                accept(resource);
                return;
            }

            // Otherwise, we need to ask the Venue Service for it
            VenueService.get_by_slug(slug).then(function(resource) {
                    store._store_resource(resource);
                    // Actually pull the data from the service - at this point shouldn't be an RPC
                    accept(VenueService.get_multi([store._slug_to_resource_id_map[slug]])[0]);

                }.bind(this), function(err) {
                    reject(err);
                }.bind(this)
            );


        });
        return promise;
    },

    _store_resource: function(resource) {
        // Helper to manage how we store resource for the store
        this._slug_to_resource_id_map[resource.slug] = resource.resource_id;
    },

    onManyLoaded: function(resources) {
        // VenueStore has a fresh list of venues. We want to populate our internal map
        var resource;
        for (var i in resources) {
            this._store_resource(resources[i]);
        }
    },

    onRequestResourceBySlug: function(slug) {

        if (this._slug_to_resource_id_map[slug]) {
            var resource = VenueService.get_multi([this._slug_to_resource_id_map[slug]])[0];
            this.trigger(resource);
            return;
        }

        // We need to request it from the server
        var promise = VenueService.get_by_slug(slug).then(function(resource) {
            this._slug_to_resource_id_map[slug] = resource.resource_id;

            // Actually pull the data from the service - at this point shouldn't be an RPC
            this.trigger(VenueService.get_multi([this._slug_to_resource_id_map[slug]])[0]);

            }.bind(this), function(err) {
                this.trigger('NOPE');
            }.bind(this)
        );

    },


});


module.exports = {
    VenueStore: VenueStore,
    VenueSlugStore: VenueSlugStore
}