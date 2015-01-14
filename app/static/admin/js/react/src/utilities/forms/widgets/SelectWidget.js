var React = require('react');
var BaseWidgetMixin = require('./BaseWidgetMixin');

SelectWidget = React.createClass({
    mixins: [BaseWidgetMixin],

    addState: function(state) {
        state['choices'] = this.props.choices
        return state;
    },

    render: function(){
        var choices_rendered;

        if (this.state.choices && this.state.choices.length > 0) {
            choices_rendered = this.state.choices.map(function (choice_pair) {
                return <option value={ choice_pair[0] }>{ choice_pair[1] }</option>;
            });
        }

        return <select value={this.state.val} ref="input" className="form-control" onChange={this.handleChange} onBlur={this.onBlur} onFocus={this.onFocus}>{ choices_rendered }</select>;
    }
});

module.exports = SelectWidget;