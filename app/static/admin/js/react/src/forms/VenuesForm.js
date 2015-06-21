var React = require('react');
var TextField = require('./../utilities/forms/fields/TextField');
var SlugField = require('./../utilities/forms/fields/SlugField');
var ChoiceField = require('./../utilities/forms/fields/ChoiceField');
var GeoPtField = require('./../utilities/forms/fields/GeoPtField');
var CheckboxWidget = require('./../utilities/forms/widgets/CheckboxWidget');
var SlugWidget = require('./../utilities/forms/widgets/SlugWidget');
var FileUploader = require('./../components/FileUploader');
var TextareaWidget = require('./../utilities/forms/widgets/TextareaWidget');

var MapComponent2 = require('./../components/Map').MapComponent2;


VenuesForm = React.createClass({
    propTypes: {
      resource_url: React.PropTypes.string.isRequired,
      is_edit: React.PropTypes.bool.isRequired
    },

    componentDidMount: function(){
        var rc = this;

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

    set_geo_callback: function (geo) {
        /* Helper to set the value of the geo field
         - This may accept a single geo pair OR
         and array for a polygon.
        */
        
        console.log('-------------------------');
        console.log(geo);
        console.log('-------------------------')

        var raw_geo_str = geo.toString(); // if polygone, this will create a comma separated str of values
        //raw_geo_str = raw_geo_str.replace(')', '').replace('(', '')
        this.refs['field.geo'].setValue(raw_geo_str);
        
    },
    geo_listener: function(event) {
        // Helper to generate map and geo coords
        var search_address = this.refs['field.address'].getValue() + ' ' + this.refs['field.address2'].getValue() + ' ' + this.refs['field.city'].getValue() + ' ' + this.refs['field.state'].getValue();        

        this.refs.mapObj.search_by_address(search_address, this.set_geo_callback)

    },
    sluggable_helper:  function(event) {
        // If it is a new item, update the slug prop
        // TODO: Make this more general and refactor into a helper

        if ( this.state.is_edit ){
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
            ['popup', 'popup'],
            ['studios', 'studios']
        ];

        var img_src = {};
        console.log(this.state.data.results.primary_image_resource);

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
        
        <div className="col-lg-6">
            <form role="form" className="form-horizontal" action="#" onSubmit={this.submitHandler}>
                { errors }

              <img src={ img_src } className="img-responsive" />
            
              <TextField id="name"  ref="field.name" val={this.state.data.results.name } form={this} placeholder="Enter Venue Name" onChangeCallback={this.sluggable_helper} />
              <SlugField id="slug" form={this}  ref="field.slug"  val={this.state.data.results.slug } widget={SlugWidget} url_root="http://mplsart.com/galleries/"/>

              <TextField id="address" form={this}  ref="field.address"  val={this.state.data.results.address } onChangeCallback={ this.geo_listener } />
              <TextField id="address2" form={this}  ref="field.address2"  val={this.state.data.results.address2 } />
              <TextField id="city" form={this}  ref="field.city" val={this.state.data.results.city }   defaultValue="Minneapolis" onChangeCallback={ this.geo_listener } />
              <TextField id="state" form={this}  ref="field.state"  val={this.state.data.results.state } defaultValue="MN" />
              <TextField id="country" form={this} ref="field.country"  val={this.state.data.results.country } defaultValue="USA"/>

              <hr />
              <ChoiceField id="category" form={this} ref="field.category"  val={this.state.data.results.category } widget={CheckboxWidget} choices={category_choices} />
              <TextField id="phone" form={this} ref="field.phone"  val={this.state.data.results.phone } />
              <TextField id="email" form={this} ref="field.email"  val={this.state.data.results.email } />
              <TextField id="website" form={this} ref="field.website"  val={this.state.data.results.website } />

              <TextField id="summary"  ref="field.summary" val={this.state.data.results.summary } form={this} widget={TextareaWidget} placeholder="Post Summary" />
              <TextField id="content"  ref="field.content" val={this.state.data.results.content } form={this} widget={TextareaWidget} placeholder="Post content" />


              <div className="pull-right">
                  <button type="submit" className="btn btn-primary">Submit</button>
                  &nbsp;
                  &nbsp;
                  <a href="/admin/venues/" className="small">cancel</a>
             </div>
            </form>
        </div>

        <div className="col-lg-6">
            { uploader }

             <GeoPtField id="geo" form={this} ref="field.geo"  val={this.state.data.results.geo } />
            <MapComponent2 ref="mapObj" geo={this.state.data.results.geo } click_callback={this.set_geo_callback} />
            
        </div>

    </div>;
    }    
});

module.exports = VenuesForm;