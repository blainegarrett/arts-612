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
    _list: [], // Private Hash. Only available via getters

    init: function () {
        // Register listeners
        // this.listenTo(EventActions.load, this.fetchData); //output is a callbak for the listener of statusUpdate
        //this.listenTo(EventActions.log, this.logStore);
    },

    //get_event_by_slug : function() {
    onLoad: function(slug) {
        this.fetchData(slug)
    },
    onAppendCtr: function() {
        this.trigger(this._list);
    },

    logStore: function() {
    },
    fetchData: function (slug) {
        var promise = EventService.get_by_slug(slug).then(function(event) {
            this._list.push(event);
            this.trigger(event); // emit a change event

            }.bind(this), function(err) {
                this.trigger('NOPE');
            }.bind(this)
        );
    }
});

module.exports = {
    EventStore: EventStore
}