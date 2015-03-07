var React = require('react');
var TextField = require('./../utilities/forms/fields/TextField');
var SlugField = require('./../utilities/forms/fields/SlugField');
var ChoiceField = require('./../utilities/forms/fields/ChoiceField');
var GeoPtField = require('./../utilities/forms/fields/GeoPtField');
var CheckboxWidget = require('./../utilities/forms/widgets/CheckboxWidget');
var SlugWidget = require('./../utilities/forms/widgets/SlugWidget');
var TextareaWidget = require('./../utilities/forms/widgets/TextareaWidget');
var FileUploader = require('./../components/FileUploader');

BlogPostForm = React.createClass({
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

    getInitialState: function () {
        /* Sets up initial form state */
        
        return {
            save_callback: this.props.save_callback,
            errors: [],
            is_edit: this.props.is_edit,
            data: {results: {}}
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
    sluggable_helper:  function(event) {
        // If it is a new item, update the slug prop
        // TODO: Make this more general and refactor into a helper

        if (this.state.is_edit ){
            return;
        }

        var title_value = event.target.value;
        
        title_value = title_value.toLowerCase()
            .trim()
            .replace(/[^\w ]+/g, ' ')
            .trim()
            .replace(/ +/g, '-');

        this.refs['field.slug'].setValue(title_value);

    },


    upload_success_callback: function (file_resource) {
        // File Uploaded... set src, hidden fields, etc

        var data = this.state.data;
        data.results.primary_image_resource = file_resource;
        
        this.setState({data: data})
    },
    upload_error_callback: function () {
        alert('There was an error uploading stuff...');
    },


    render: function(){
        if (this.state.is_edit && !this.state.data.results.title) {
            return <div>Loading...</div>
        }

        var rendered_errors = this.state.errors.map(function (obj) {
            return obj.toString();
        });
        var errors = <p className="bg-danger">{ rendered_errors }</p>;

        var img_src = {};
        if (this.state.data.results.primary_image_resource) {
            img_src = this.state.data.results.primary_image_resource.versions.CARD_SMALL.url;
        }

        var uploader = null;
        if (this.state.data && this.state.data.results && this.state.data.results.resource_id ) {
            uploader = <FileUploader
                allow_multiple={ false }
                callback_url={'/api/files/upload_callback?attach_to_resource=' + this.state.data.results.resource_id  + '&target_property=primary_image_resource_id'}

                upload_success_callback = { this.upload_success_callback }
                upload_error_callback = { this.upload_error_callback } />
        }


        return <div className="row">
        
        
        <div className="col-lg-8">
            <form role="form" className="form-horizontal" action="#" onSubmit={this.submitHandler}>
                { errors }

              <img src={ img_src } className="img-responsive" />
            
              <TextField id="title"  ref="field.title" val={this.state.data.results.title } form={this} placeholder="Enter Post Title" onChangeCallback={this.sluggable_helper} />
              <SlugField id="slug" form={this}  ref="field.slug"  val={this.state.data.results.slug } widget={SlugWidget} url_root="http://mplsart.com/written/"/>

              <TextField id="summary"  ref="field.summary" val={this.state.data.results.summary } form={this} widget={TextareaWidget} placeholder="Post Summary" />
              <TextField id="content"  ref="field.content" val={this.state.data.results.content } form={this} widget={TextareaWidget} placeholder="Post content" />


              <div className="pull-right">
                  <button type="submit" className="btn btn-primary">Submit</button>
                  &nbsp;
                  &nbsp;
                  <a href="/admin/blog/" className="small">cancel</a>
             </div>
            </form>
        </div>

        <div className="col-lg-4">
            { uploader }
        </div>

    </div>;
    }    
});

module.exports = BlogPostForm;