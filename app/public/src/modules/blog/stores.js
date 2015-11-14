var Reflux = require('reflux');
var BlogActions = require('./actions');
var BlogServices = require('./services');


var BlogPostStore = Reflux.createStore({
    // Include logical operations for this domain
    // Public interface only contains getters, not setters
    // Setters are only in response to listenable Actions
    // Store can pivot on the data coming in to decide how to update itself
    //

    listenables: [BlogActions.BlogPostActions],
    //_list: {}, // Private Hash. Only available via getters
    _store: [],
    _store_populated: false,


    init: function () {
        // Register listeners
        // this.listenTo(VenueActions.load, this.fetchData); //output is a callbak for the listener of statusUpdate
        // this.listenTo(VenueActions.log, this.logStore);

        // TODO: Figure out how to block additional calls until this is completed
        //this.onRequestAll();

    },

    hasMore: function() {
        return BlogServices.BlogPostService._query_result && BlogServices.BlogPostService._query_result.more;
    },

    onRequestMore: function() {
        //alert('Load More???');
        //alert(this._store_populated);
        this.onRequestAll(); // Implicitly uses last cursor position

    },

    onRequestAll: function() {
        /* Serve Up all the Venues */
        // Do we already have them all; if so return them
        // Are they older than TIMEOUT ?

        if (this._store_populated) { // also check for stale state/timeout?
            var resources = BlogServices.BlogPostService.get_multi(this._store);
            this.trigger(resources);
            return;
        }

        var promise = BlogServices.BlogPostService.get_all(BlogServices.BlogPostService._query_result).then(function(resources) {
            // TODO: Internally store the references to these resources

            // Rebuild Index
            //this._store = []; // This flushes the store
            var venue;
            for (var i in resources) {
                venue = resources[i];
                this._store.push(venue.resource_id);
            }

            // Actually pull the data from the service - at this point shouldn't be an RPC
            //this._store_populated = true; // TODO: This isn't everything yet... just a page..
            this.trigger(BlogServices.BlogPostService.get_multi(this._store));
            return
            }.bind(this), function(err) {
                console.log('Error calling service layer');
                this.trigger('NOPE');
            }.bind(this)
        );
    },

});

var BlogPostSlugStore = Reflux.createStore({

    listenables: [BlogActions.BlogPostActions],
    _slug_to_resource_id_map: {},

    init: function() {
        this.listenTo(BlogPostStore, this.onManyLoaded);
    },

    // Getter's - Note: This might be flux anti-pattern
    get: function(slug) {
        var store = this;
        var promise = new Promise(function(accept, reject) {

            if (store._slug_to_resource_id_map[slug]) {
                // We have already cached it, just return it
                var resource = BlogServices.BlogPostService.get_multi([store._slug_to_resource_id_map[slug]])[0];
                accept(resource);
                return;
            }

            // Otherwise, we need to ask the Blog Service for it
            BlogServices.BlogPostService.get_by_slug(slug).then(function(resource) {
                    store._store_resource(resource);
                    // Actually pull the data from the service - at this point shouldn't be an RPC
                    accept(BlogServices.BlogPostService.get_multi([store._slug_to_resource_id_map[slug]])[0]);

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
        // BlogPostStore has a fresh list of venues. We want to populate our internal map
        var resource;
        for (var i in resources) {
            this._store_resource(resources[i]);
        }
    },

    onRequestResourceBySlug: function(slug) {

        if (this._slug_to_resource_id_map[slug]) {
            var resource = BlogServices.BlogPostService.get_multi([this._slug_to_resource_id_map[slug]])[0];
            this.trigger(resource);
            return;
        }

        // We need to request it from the server
        var promise = BlogServices.BlogPostService.get_by_slug(slug).then(function(resource) {
            this._slug_to_resource_id_map[slug] = resource.resource_id;

            // Actually pull the data from the service - at this point shouldn't be an RPC
            this.trigger(BlogServices.BlogPostService.get_multi([this._slug_to_resource_id_map[slug]])[0]);

            }.bind(this), function(err) {
                this.trigger('NOPE');
            }.bind(this)
        );

    },


});


module.exports = {
    BlogPostStore: BlogPostStore,
    BlogPostSlugStore: BlogPostSlugStore
}