String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var TextColumn = function(args) {
    this.args = args
    
    this.get_col_name = function() {
        return this.args.name;
    }
};


var ActionColumn = React.createClass({
    getInitialState: function(){
        return {col: this.props.col, obj: this.props.obj}
    },

    render: function() {
        var col = this.state.col;
        var obj = this.state.obj;

        var action_url = '/admin/venues/' +  obj.resource_id + '/edit'

        return <span><a href={action_url} >edit</a></span>;
    }

});

var SimpleColumn = React.createClass({
    getInitialState: function(){
        return {col: this.props.col, obj: this.props.obj}
    },

    render: function() {
        var col = this.state.col;
        var obj = this.state.obj;
        return <span>{ obj[col] }</span>;
    }
});

var DataList = React.createClass(
    {
        render : function() {
            var rowNodes;

            var columns = this.props.columns

            if (this.props.data.results != undefined) {
                rowNodes = this.props.data.results.map(function (obj) {
                    var columnNodes = columns.map(function (col) {
                        var _widget = SimpleColumn;

                        var props = {col: col, obj: obj}
                        var widget = React.createElement(_widget, props);

                        if (col == 'actions') {
                            widget = React.createElement(ActionColumn, props)
                        }
                        return <td>{ widget }</td>;
                    });
                    return <tr>{ columnNodes }</tr>;
                });
            }

            return  <tbody> { rowNodes } </tbody>;
        }
});

var DataTableMixin = {
    componentDidMount: function(){
        $.ajax({
            url: this.state.resource_url,
            dataType: 'json',
            success:  function(data) {
                this.setState({data:data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)
            
        });
    },
    
    render_templatexxx: function() {
        var columnNodes = this.state.columns.map(function (col) {
            return <th>{ col }</th>
        });

        return <div>
            <div>
                <h2>Venues</h2>
                <div className="pull-right">
                    <a href="/admin/venues/create/" className="btn btn-default">Add Venue</a>
                </div>
            </div>

            <table className="table table-hover table-striped table-compressed">
                <thead>
                    <tr>
                    { columnNodes }
                    </tr>
                </thead>
                <DataList data={this.state.data} columns={ this.state.columns } grid={ this } />
            </table>
        </div>;
    }
}


var VenuesGrid = React.createClass({
    /* Grid of Venues */
    mixins: [DataTableMixin],

    getInitialState: function(){
        var state = {'data': [], 'resource_url': '/api/galleries'};
        state['columns'] = ['name', 'category', 'actions'];
        return state;
    },

    render: function() {
        return this.render_templatexxx()
    }
});
mainApp.value('VenuesGrid', VenuesGrid);


var CalendarGrid = React.createClass({
    /* Grid of Events */
    mixins: [DataTableMixin],

    getInitialState: function(){
        var state = {'data': [], 'resource_url': '/api/events'};
        state['columns'] = ['name', 'category', 'actions'];
        return state;
    },

    render: function() {
        return this.render_templatexxx()
    }
});
mainApp.value('CalendarGrid', CalendarGrid);




////////////////////////////

BaseWidgetMixin = {
    getInitialState: function() {
        var id = this.props.id;
        var label = this.props.id.capitalize();
        if (this.props.label) {
            label = this.props.label;
        }

        state = {
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
     getValue: function() {
        if (typeof(this._getValue) == 'function') {
            return this._getValue();
        }
        return this.refs.input.getDOMNode().value;
     },
      handleChange: function(event) {
          //var value = this.getValue();
          this.setState({val: event.target.value});
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

CheckboxWidget = React.createClass({
    mixins: [BaseWidgetMixin],
    addState: function(state) {
        state['choices'] = this.props.choices
        return state;
    },
    _getValue: function() {
        
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

        if (this.state.choices && this.state.choices.length > 0) {
            choices_rendered = this.state.choices.map(function (choice_pair) {
                i += 1;
                var checked = choice_pair[0] == cur_state_val;

                return <div><label><input onChange={handleChange} type="radio" ref={'checkbox_' + i} name={'id_' +  this.state.field_id } checked={checked} value={ choice_pair[0] } onBlur={this.onBlur} onFocus={this.onFocus} /> { choice_pair[1] }</label></div>
            });
        }

        return <div>{ choices_rendered }</div>;
    }
    
    
    
});

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


InputWidget = React.createClass({
    /* General Input Widget */

    mixins: [BaseWidgetMixin],

    render: function() {
        var id = this.state.field_id;
        var label = this.state.label;
        var classes = this.state.classes || "";
        var placeholder = this.state.placeholder || "";
        var val = this.state.val;

        return <input type="text" className={ 'form-control ' + classes } id={'id_' +  id } placeholder={ placeholder } value={ this.state.val } onChange={this.handleChange} onBlur={this.onBlur} onFocus={this.onFocus} ref="input" />;
    }
});


BaseField  = {
    /* Base Rest Field Type */

    getInitialState: function() {
        var id = this.props.id;
        var label = this.props.id.capitalize();
        if (this.props.label) {
            label = this.props.label;
        }

        var widget = InputWidget
        if (this.props.widget) {
            widget = this.props.widget
        }

        var val = this.props.val;
        if (!val && this.props.defaultValue) {
            val = this.props.defaultValue;
        }

        return {
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
             console.log(this.refs)
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
          this.setState({val: this.toResource(event.target.value)});
     },

     getValue: function() {
         /* Get value of specific field.. if you have more than one input or need custom
            rendering, implement your own.
         */
        return this.refs.input.getValue();
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


        var props = {id: id, form: this, ref: "input", val: this.fromResource()}

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


ChoiceField = React.createClass({
    mixins: [BaseField],
});

TextField = React.createClass({
    mixins: [BaseField],
});


GeoPtField = React.createClass({
    mixins: [BaseField],
    toResourceX: function(field_value) {
        /* Pull raw form date into a REST resource format */
        if (!field_value) {
            field_value = this.getValue();
        }
        if (!field_value) {
            return "";
        }
        var vals = field_value.split(',');
        return {lat: vals[0], lon: vals[1]};
    },
    fromResourceX: function() {
        /* Push REST resource format into a Form value */

        var val = this.state.val;
        if (!val) {
            return '';
        }

        return val.lat + ',' + val.lon;
    }
});


VenuesForm = React.createClass({
    propTypes: {
      resource_url: React.PropTypes.string.isRequired,
      is_edit: React.PropTypes.bool.isRequired
    },

    componentDidMount: function(){
        if (this.state.is_edit) {
            $.ajax({
                url: this.props.resource_url,
                dataType: 'json',
                success:  function(data) {
                    this.setState({data:data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.resource_url, status, err.toString());
                }.bind(this)
            });
        }
    },
    getInitialState: function(){
        return {
            save_callback: this.props.save_callback,
            errors: [],
            is_edit: this.props.is_edit,
            data: {'results': {}}
        }
    },
    submitHandler: function(e) {
        var method;

        e.preventDefault();
        e.stopPropagation();

        var restData = {};
        // We need to iterate over all of the rest fields in refs and evaluate them
        // to rest acceptable values (toResource()).

        for (ref in this.refs){
            if (ref.indexOf("field.") == 0) {
                restData[this.refs[ref].state.field_id] = this.refs[ref].toResource();
            }
        }

        method = 'POST';
        if (this.state.is_edit) {
            method = 'PUT';
        }        
        
        // Send Ajax Payload
        $.ajax({
            url: this.props.resource_url,
            type: method,
            dataType: 'json',
            data: JSON.stringify(restData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success:  function(data) {
                this.state.save_callback();
            }.bind(this),

            error: function(xhr, status, err) {
                error_body = JSON.parse(xhr.responseText);

                this.setState({errors: error_body.messages}); //messages is always a list

                console.error(this.state.resource_url, status, err.toString());
                
            }.bind(this) 
        });

    },
    render: function(){
        if (this.state.is_edit && !this.state.data.results.name) {
            return <div>Loading...</div>
        }

        var rendered_errors = this.state.errors.map(function (obj) {
            return obj.toString();
        });
        var errors = <p className="bg-danger">{ rendered_errors }</p>;

        var category_choices = [
            ['museum', 'museum'],
            ['gallery', 'gallery'],
            ['business', 'business'],
            ['public', 'public'],
            ['private', 'private'],
            ['studios', 'studios']
        ];

        return <form role="form" className="form-horizontal" action="#" onSubmit={this.submitHandler}>
            { errors }
          <TextField id="name"  ref="field.name" val={this.state.data.results.name } form={this} placeholder="Enter Venue Name"/>
          <TextField id="slug" form={this}  ref="field.slug"  val={this.state.data.results.slug } />
          <ChoiceField id="category" form={this} ref="field.category"  val={this.state.data.results.category } widget={CheckboxWidget} choices={category_choices} />
          <TextField id="address" form={this}  ref="field.address"  val={this.state.data.results.address } />
          <TextField id="address2" form={this}  ref="field.address2"  val={this.state.data.results.address2 } />
          <TextField id="city" form={this}  ref="field.city" val={this.state.data.results.city }   defaultValue="Minneapolis" />
          <TextField id="state" form={this}  ref="field.state"  val={this.state.data.results.state } defaultValue="MN" />
          <TextField id="country" form={this} ref="field.country"  val={this.state.data.results.country } defaultValue="USA"/>
          <GeoPtField id="geo" form={this} ref="field.geo"  val={this.state.data.results.geo } />
          <TextField id="phone" form={this} ref="field.phone"  val={this.state.data.results.phone } />
          <TextField id="email" form={this} ref="field.email"  val={this.state.data.results.email } />
          <TextField id="website" form={this} ref="field.website"  val={this.state.data.results.website } />

          <div className="pull-right">
              <button type="submit" className="btn btn-primary">Submit</button>
              &nbsp;
              &nbsp;
              <a href="/admin/venues/" className="small">cancel</a>
         </div>
        </form> 
    }
    
})

mainApp.value('VenuesForm', VenuesForm);

/*
mainApp.directive( 'venueform', function( reactDirective ) {
  return reactDirective( 'VenuesForm' );
} );
*/