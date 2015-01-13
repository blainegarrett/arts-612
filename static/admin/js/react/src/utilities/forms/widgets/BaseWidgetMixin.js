var React = require('react');

BaseWidgetMixin = {
    getInitialState: function() {
        var id = this.props.id;
        var label = this.props.id; //.capitalize();
        if (this.props.label) {
            label = this.props.label;
        }

        state = {
            onChangeCallback: this.props.onChangeCallback,
            'label': label,
            'field_id': id,
            'classes': this.props.classes,
            'placeholder': this.props.placeholder,
            'val': this.props.val,
            'form': this.props.form
        }

        if (typeof(this.addState) == 'function'){
            return this.addState(state);
        }

        return state
    },
    setValue: function (val) {
        /* Set the val of the field. This probably isn't supported by all Widgets? */
        
        this.refs.input.getDOMNode().value = val;
        this.setState({'val': val});
    },
     getValue: function() {
        if (typeof(this._getValue) == 'function') {
            return this._getValue();
        }
        return this.refs.input.getDOMNode().value;
     },
      handleChange: function(event) {
          
          if (typeof(this.state.onChangeCallback) == 'function') {
              this.state.onChangeCallback(event);
          }

          if (typeof(this._handleChange) == 'function') {
              return this._handleChange(event.target.value);
          }
          else {
              this.setState({val: event.target.value});
          }
          
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
};

module.exports = BaseWidgetMixin;