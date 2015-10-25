var Reflux = require('reflux');
var EventActions = require('./actions').EventActions;
var EventService = require('./services').EventService;

var EventStore = Reflux.createStore({
    // Include logical operations for this domain
    // Public interface only contains getters, not setters
    // Setters are only in response to listenable Actions
    // Store can pivot on the data coming in to decide how to update itself
    //

    listenables: [EventActions],
    _list: {}, // Private Hash. Only available via getters

    init: function () {
        // Register listeners
        // this.listenTo(EventActions.load, this.fetchData); //output is a callbak for the listener of statusUpdate
        //this.listenTo(EventActions.log, this.logStore);
    },

    //get_event_by_slug : function() {
    onLoad: function(slug) {
        /*
            Retrieve an event from the store by slug. If not found, attempt to async fetch.

            TODO: Rename this to onRequestBySlug() or something.
            TODO: Attempt to cache failed lookups to avoid needless server hits.
            TODO: Check for stale states.
        */

        var event_found = false;
        var event = null;
        for (var resource_id in this._list) {
            if (this._list[resource_id].slug == slug) {
                event_found = true;
                event = this._list[resource_id];
                break;
            }
        }

        if (event_found) {
            this.trigger(event);
        }
        else {
            // Item was not already in the store.. attempt to fetch
            this.fetchData(slug);
        }
    },
    onAppendCtr: function() {
        this.trigger(this._list);
    },

    logStore: function() {
    },

    _maybeStoreNewItem: function(event) {
        // TODO: Compare to current store, if this is
            this._list[event.resource_id] = event;
            this.trigger(event); // emit a change event
    },
    fetchData: function (slug) {
        var promise = EventService.get_by_slug(slug).then(function(event) {
            this._maybeStoreNewItem(event);
            }.bind(this), function(err) {
                this.trigger('NOPE');
            }.bind(this)
        );
    }
});

module.exports = {
    EventStore: EventStore
}