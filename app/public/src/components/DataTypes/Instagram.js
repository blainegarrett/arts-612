// Component for an Instagram photo
var React = require('react');

var EventRendererMixin = {
    getInitialState: function () {

        return {
            resource_loaded: resource_loaded = Boolean(this.props.resource),
            resource: this.props.resource,
        }
    },    
};

var PodRenderer = React.createClass({
    /* Pod Renderer */

    mixins: [EventRendererMixin],

    render_empty: function () {

        return <div>PHOTO</div>
    },

    render: function() {
        if (!this.state.resource_loaded) {
            // Render something that resembles real content
            return this.render_empty();
        }

        var e = this.state.resource;
        return <div><a href={e.link} target="_new"><img className="img-responsive" src={e.standard_resolution} /></a></div>

    }
    
});

var Goober = React.createClass({
    /* Goober for Instagram Photos */

    getDefaultProps: function() {
        return { renderer: PodRenderer };
    },

    propTypes: {
        renderer: React.PropTypes.any, // A React Class to Render the Event
        resource: React.PropTypes.node, // A Resource (object) from the store, etc or null
    },

    getInitialState: function () {
        return {
            renderer: this.props.renderer,
            resource: this.props.resource,
        }
    },
    render: function () {
        // Determine which ED we meant to show actually
        var props = {
            resource: this.state.resource,
        };
        return React.createElement(this.state.renderer, props);
    }    
});


module.exports = {
    Goober: Goober,
    //DefaultRenderer: DefaultRenderer,
    PodRenderer: PodRenderer,
};