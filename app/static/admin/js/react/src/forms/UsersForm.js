var React = require('react');
var TextField = require('./../utilities/forms/fields/TextField');
var SlugField = require('./../utilities/forms/fields/SlugField');
var ChoiceField = require('./../utilities/forms/fields/ChoiceField');
var GeoPtField = require('./../utilities/forms/fields/GeoPtField');
var CheckboxWidget = require('./../utilities/forms/widgets/CheckboxWidget');
var ChoiceField = require('./../utilities/forms/fields/ChoiceField');
var SlugWidget = require('./../utilities/forms/widgets/SlugWidget');
var TextareaWidget = require('./../utilities/forms/widgets/TextareaWidget');
var FileUploader = require('./../components/FileUploader');

UsersForm = React.createClass({
    propTypes: {
        resource_url: React.PropTypes.string.isRequired,
        is_edit: React.PropTypes.bool.isRequired
    },

    componentDidMount: function(){
        
        // Get the resource data
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
        };
    },

    getInitialState: function () {
        /* Sets up initial form state */
        
        return {
            save_callback: this.props.save_callback,
            errors: [],
            is_edit: this.props.is_edit,
            data: {results: {}},
        };
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
        if (this.state.is_edit && !this.state.data.results.firstname) {
            return <div>Loading...</div>
        }

        var rendered_errors = this.state.errors.map(function (obj) {
            return obj.toString();
        });
        var errors = <p className="bg-danger">{ rendered_errors }</p>;

        console.log(this.state.data.results);
        return <div className="row">
        
        <div className="col-lg-8">
            <form role="form" className="form-horizontal" action="#" onSubmit={this.submitHandler}>
                { errors }
            
              <TextField id="firstname"  ref="field.firstname" val={this.state.data.results.firstname } form={this} placeholder="First Name" />
              <TextField id="lastname"  ref="field.lastname" val={this.state.data.results.lastname } form={this} placeholder="Last Name" />
              <TextField id="website"  ref="field.website" val={this.state.data.results.website } form={this} placeholder="Website" />

              <div className="pull-right">
                  <button type="submit" className="btn btn-primary">Submit</button>
                  &nbsp;
                  &nbsp;
                  <a href="/admin/blog/" className="small">cancel</a>
             </div>
            </form>
        </div>

        <div className="col-lg-4">
        </div>

    </div>;
    }    
});

module.exports = UsersForm;