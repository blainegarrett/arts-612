var React = require('react');
var BaseWidgetMixin = require('./BaseWidgetMixin');

TextareaWidget = React.createClass({
    /* Textarea Input Widget */

    mixins: [BaseWidgetMixin],

    render: function() {
        var id = this.state.field_id;
        var label = this.state.label;
        var classes = this.state.classes || "";
        var placeholder = this.state.placeholder || "";
        var val = this.state.val;

        return <textarea className={ 'form-control ' + classes } id={'id_' +  id } placeholder={ placeholder } value={ this.state.val } onChange={this.handleChange} onBlur={this.onBlur} onFocus={this.onFocus} ref="input" />;
    }
});

module.exports = TextareaWidget;