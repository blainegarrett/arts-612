var React = require('react');
var BaseWidgetMixin = require('./BaseWidgetMixin');


SlugWidget = React.createClass({
    mixins: [BaseWidgetMixin],

    addState: function(state) {
        /* Add/Update state props as needed */

        return state;
    },

    render: function () {

        var input = <div className="">
            { this.props.field.props.url_root } 
            <input value={this.state.val} ref="input" className="form-control slug-field" onChange={this.handleChange} onBlur={this.onBlur} onFocus={this.onFocus} />
            </div>;
        
        return input;
    },

    componentDidMount: function() {
        
    }

});

module.exports = SlugWidget;