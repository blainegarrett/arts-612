/*
    Form Components for Simple Event Form
*/

var React = require('react');


var SimpleEventForm = React.createClass({
    propTypes: {
        completion_callback: React.PropTypes.string.func, /* Not Required */
    },



    getInitialState: function () {
        var state = {};

        console.log(this.props);

        //
        state.completion_callback = this.props.completion_callback || function () { };

        return state;
    },

    render: function() {

        return (
            <b>super cooool</b>
        );
    }

});

module.exports = {
    SimpleEventForm: SimpleEventForm
}