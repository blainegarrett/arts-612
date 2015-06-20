var React = require('react');
var BaseWidgetMixin = require('./BaseWidgetMixin');

HiddenWidget = React.createClass({
    /* General Input Widget */

    mixins: [BaseWidgetMixin],

    render: function() {
        var id = this.state.field_id;
        var label = this.state.label;
        var classes = this.state.classes || "";
        var placeholder = this.state.placeholder || "";
        var val = this.state.val;

        return <span><input type="hidden" className={ 'form-control ' + classes } id={'id_' +  id } placeholder={ placeholder } value={ this.state.val } onChange={this.handleChange} onBlur={this.onBlur} onFocus={this.onFocus} ref="input" /></span>;
    }
});

module.exports = HiddenWidget;