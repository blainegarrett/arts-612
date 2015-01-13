var React = require('react');
var InputWidget = require('../widgets/InputWidget');

BaseField  = {
    /* Base Rest Field Type */

    getInitialState: function() {
        var id = this.props.id;
        var label = this.props.id; //.capitalize();
        if (this.props.label) {
            label = this.props.label;
        }

        var widget = InputWidget;
        if (this.props.widget) {
            widget = this.props.widget
        }

        var val = this.props.val;
        if (!val && this.props.defaultValue) {
            val = this.props.defaultValue;
        }

        var onChangeCallback = this.props.onChangeCallback;

        return {
            'onChangeCallback': onChangeCallback,
            'label': label,
            'field_id': id,
            'classes': this.props.classes,
            'placeholder': this.props.placeholder,
            'val': val,
            'form': this.props.form,
            'widget': widget
        }
    },
    toResource: function(field_value) {
        /* Pull raw form date into a REST resource format */

         if (typeof(this.toResourceX) == 'function'){
             return this.toResourceX(field_value);
         }

         if (!field_value) {
             console.log(this.refs.widget); 
             field_value = this.getValue(field_value);
         }

         return field_value;
     },

     fromResource: function() {

         if (typeof(this.fromResourceX) == 'function'){
             return this.fromResourceX();
         }
         
         return this.state.val;
     },

      handleChange: function(event) {
          var value = this.getValue();

          alert('sfsdfsd');

          if (typeof(this._handleChange) == 'function') {
              value = this._handleChange(value);
          }
          else {
              value = event.target.value;
          }

          this.setState({val: this.toResource(value)});
     },

     setValue: function(val) {
         /* Public helper to set the value of the Field */

         this.setState({val: val});
         this.refs.widget.setValue(val);
     },
     getValue: function() {
         /* Get value of specific field.. if you have more than one input or need custom
            rendering, implement your own.
         */
        return this.refs.widget.getValue();
     },

    onBlur: function(e){
        var value = this.getValue();
        var error;
        if (this.props.required && !value)
            error = 'required';
        else if (this.props.oneOf && !(value in this.props.oneOf))
            error = 'oneOf';
        else if (this.props.minLength && value.length < this.props.minLength)
            error = 'minLength';
        this.setState({error: error});
    },

    onFocus: function(e) {
        this.setState({error: false});
        e.stopPropagation();
    },
    render: function() {

        var id = this.state.field_id;
        var label = this.state.label;
        var classes = this.state.classes || "";
        var placeholder = this.state.placeholder || "";
        var val = this.state.val;

        var props = {id: id, field: this, form: this.state.form, ref: "widget", val: this.fromResource(), onChangeCallback: this.state.onChangeCallback}

        if (this.props.choices) {
            props['choices'] = this.props.choices
        }
        var widget = React.createElement(this.state.widget, props);

        return <div className="form-group">
             <label htmlFor={'id_' +  id } className="col-sm-2 control-label">{ label }</label>
             <div className="col-sm-10">
                 { widget }
             </div>
        </div>;
    }
};
module.exports = BaseField;