String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var TextColumn = function(args) {
    this.args = args
    
    this.get_col_name = function() {
        return this.args.name;
    }
};


var DataList = React.createClass(
    {
        displayName: 'fork',
        render : function() {
            var rowNodes;

            var columns = this.props.columns

            if (this.props.data.results != undefined) {
                rowNodes = this.props.data.results.map(function (obj) {
                    var columnNodes = columns.map(function (col) {
                        if (col == 'actions') {
                            return <td><a href={'/admin/venues/' +  obj.resource_id + '/edit'} >edit</a></td>;
                        }
                        return <td>{ obj[col] }</td>;
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

        return <table className="table table-hover table-striped table-compressed">
            <thead>
                <tr>
                { columnNodes }
                </tr>
            </thead>
            <DataList data={this.state.data} columns={ this.state.columns } grid={ this } />
        </table>
    }
}


var VenuesGrid = React.createClass({

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





////////////////////////////

TextField = React.createClass({
    toResource: function(field_value) {
        if (!field_value) {
            field_value = this.getValue();
        }

        return field_value;
    },

    fromResource: function() {
        return this.state.val;
    },
        
    getInitialState: function(){

        var id = this.props.id;
        var label = this.props.id.capitalize();
        if (this.props.label) {
            label = this.props.label;
        }

        return {
            'label': label,
            'field_id': id,
            'classes': this.props.classes,
            'placeholder': this.props.placeholder,
            'val': this.props.val,
            'form': this.props.form
        }
    },
    handleChange: function(event) {
        var value = this.getValue();
        this.setState({val: event.target.value});
   },
   getValue: function() {
          return this.refs.input.getDOMNode().value;
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

       return <div className="form-group">
            <label htmlFor={'id_' +  id } className="col-sm-2 control-label">{ label }</label>
            <div className="col-sm-10">
                <input type="text" className={ 'form-control ' + classes } id={'id_' +  id } placeholder={ placeholder } value={ this.state.val } onChange={this.handleChange} onBlur={this.onBlur} onFocus={this.onFocus} ref="input" />
            </div>
       </div>;
   } 
});


GeoPtField = React.createClass({
    toResource: function(field_value) {
        if (!field_value) {
            field_value = this.getValue();
        }

        if (!field_value) {
            return "";
        }
        var vals = field_value.split(',');
        return {lat: vals[0], lon: vals[1]};
    },
    fromResource: function() {        
        var val = this.state.val;
        if (!val) {
            return '';
        }
        return val.lat + ',' + val.lon;
    },

    getInitialState: function(){

        var id = this.props.id;
        var label = this.props.id.capitalize();
        if (this.props.label) {
            label = this.props.label;
        }

        return {
            'label': label,
            'field_id': id,
            'classes': this.props.classes,
            'placeholder': this.props.placeholder,
            'val': this.props.val,
            'form': this.props.form
        }
    },
    handleChange: function(event) {
        var value = this.getValue();
        console.log('onchange!!!!');

        this.setState({val: this.toResource(event.target.value)});
   },
   getValue: function() {
          return this.refs.input.getDOMNode().value;
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

       return <div className="form-group">
            <label htmlFor={'id_' +  id } className="col-sm-2 control-label">{ label }</label>
            <div className="col-sm-10">
                <input type="text" className={ 'form-control ' + classes } id={'id_' +  id } placeholder={ placeholder } value={ this.fromResource() } onChange={this.handleChange} onBlur={this.onBlur} onFocus={this.onFocus} ref="input" />
            </div>
       </div>;
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
            is_edit: this.props.is_edit,
            data: {'results': {}}
        }
    },
    submitHandler: function(e) {
        var method;

        e.preventDefault();
        e.stopPropagation();

        var restData = {}
        for (ref in this.refs){
            if (ref.indexOf("field.") == 0) {
                restData[this.refs[ref].state.field_id] = this.refs[ref].toResource();
            }
        }
        
        if (this.state.is_edit) {
            method = 'PUT';
        }
        else {
            method = 'POST';
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
                console.log(data)
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)
            
        });        
        
        console.log(restData);
    },
    render: function(){
        if (this.state.is_edit && !this.state.data.results.name) {
            return <div>Loading...</div>
        }

        return <form role="form" className="form-horizontal" action="#" onSubmit={this.submitHandler}>
          <TextField id="name"  ref="field.name" val={this.state.data.results.name } form={this} placeholder="Enter Venue Name"/>
          <TextField id="slug" form={this}  ref="field.slug"  val={this.state.data.results.slug } />
          <TextField id="category" form={this} ref="field.category"  val={this.state.data.results.category } />
          <TextField id="address" form={this}  ref="field.address"  val={this.state.data.results.address } />
          <TextField id="address2" form={this}  ref="field.address2"  val={this.state.data.results.address2 } />
          <TextField id="city" form={this}  ref="field.city" val={this.state.data.results.city }  />
          <TextField id="state" form={this}  ref="field.state"  val={this.state.data.results.state } />
          <TextField id="country" form={this} ref="field.country"  val={this.state.data.results.country } />
          <GeoPtField id="geo" form={this} ref="field.geo"  val={this.state.data.results.geo } />
          <TextField id="phone" form={this} ref="field.phone"  val={this.state.data.results.phone } />
          <TextField id="email" form={this} ref="field.email"  val={this.state.data.results.email } />
          <TextField id="website" form={this} ref="field.website"  val={this.state.data.results.website } />

          <button type="submit" className="btn btn-default">Submit</button>
        </form> 
    }
    
})

mainApp.value('VenuesForm', VenuesForm);

/*
mainApp.directive( 'venueform', function( reactDirective ) {
  return reactDirective( 'VenuesForm' );
} );
*/