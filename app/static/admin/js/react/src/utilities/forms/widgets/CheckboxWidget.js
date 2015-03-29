var React = require('react');
var BaseWidgetMixin = require('./BaseWidgetMixin');

CheckboxWidget = React.createClass({
    mixins: [BaseWidgetMixin],

    addState: function(state) {
        state['choices'] = this.props.choices
        return state;
    },

    _getValue: function() {
        /* This should be run after state chnage???? maybe...*/

        
        for (ref in this.refs) {
            if (this.refs[ref].props.checked) {
                return this.refs[ref].getDOMNode().value;
            }
        }

        return ''
    },
    render: function(){
        var choices_rendered;
        var handleChange = this.handleChange;
        var i = 0;
        var cur_state_val = this.state.val;
        var name = this.state.field_id;

        if (this.state.choices && this.state.choices.length > 0) {
            choices_rendered = this.state.choices.map(function (choice_pair) {
                i += 1;
                console.log([choice_pair[0], cur_state_val])
                var checked = choice_pair[0] == cur_state_val;

                return <div><label><input onChange={handleChange} type="radio" ref={'checkbox_' + i} name={name} checked={checked} value={ choice_pair[0] } onBlur={this.onBlur} onFocus={this.onFocus} /> { choice_pair[1] }</label></div>
            });
        }

        return <div>{ choices_rendered }</div>;
    }
});

module.exports = CheckboxWidget;