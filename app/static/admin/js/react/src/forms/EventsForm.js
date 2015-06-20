var React = require('react');

var SelectWidget = require('./../utilities/forms/widgets/SelectWidget');
var HiddenWidget = require('./../utilities/forms/widgets/HiddenWidget');
//var ChoiceField = require('./../utilities/forms/fields/ChoiceField');
var DateTimeField = require('./../utilities/forms/fields/DateTimeField');
//var CheckboxWidget = require('./../utilities/forms/widgets/CheckboxWidget');
var DateRangeWidget = require('./../utilities/forms/widgets/DateRangeWidget');
var AutoCompleteWidget = require('./../utilities/forms/widgets/AutoCompleteWidget');
var SlugWidget = require('./../utilities/forms/widgets/SlugWidget');
var FileUploader = require('./../components/FileUploader');
var TextareaWidget = require('./../utilities/forms/widgets/TextareaWidget');

EventDateForm =  React.createClass({
    toResource: function() {
        return {
            'label': this.refs['field.label'].toResource(),
            'category': this.refs['field.category'].toResource(),
            'start': this.refs['field.start'].toResource(),
            'end': this.refs['field.end'].toResource(),
            'type': this.refs['field.type'].toResource(),
            'venue_slug': this.refs['field.venue_slug'].toResource()
        }
    },
    getInitialState: function() {
        return {
            data: this.props.event_date,
            prefix: this.props.prefix
        }
    },

    category_change_handler: function(e) {
        var category_value = e.target.value;
        var ed_type_value = 'timed';
        if (category_value == 'ongoing') {
            ed_type_value = 'reoccurring';
        }

        this.refs['field.type'].setValue(ed_type_value);
    },

    render: function() {

        var category_choices = [
            [],
            ['reception', 'Reception/Opening/Closing aka "Concise" Event'],
            ['ongoing', 'Ongoing Event'],
            ['performance', 'Performance - Specific Start time to show up...'],
            ['sale', 'Sale - separate category etc'],
            ['hours', 'Gallery/Display Hours (maps to venue hours)'],
        ];

        return <div id={'event_date_container_' + this.state.prefix}>

        <hr />
        <ChoiceField id="venue_slug"  ref="field.venue_slug" val={this.state.data.venue_slug } form={this} widget={AutoCompleteWidget} label="Venue"/>
        <TextField id="type"  ref="field.type" val={this.state.data.type } form={this} widget={HiddenWidget} hide_label={true} />
        <TextField id="label"  ref="field.label" val={this.state.data.label } form={this} label="Label" />
        <DateTimeField id="start" form={this}  ref="field.start"  val={this.state.data.start } widget={DateRangeWidget} label="Start" />
        <DateTimeField id="end" form={this}  ref="field.end"  val={this.state.data.end }  widget={DateRangeWidget} label="End"/>
        <ChoiceField id={'category' + this.state.prefix} form={this} ref="field.category"  val={this.state.data.category } widget={SelectWidget} choices={category_choices} onChangeCallback={this.category_change_handler} label="Category"/>
        </div>
    }
});

EventDateFormsInterface = React.createClass({

    getValue: function() {
        /* Get value of specific field.. if you have more than one input or need custom
           rendering, implement your own.
        */
       results = []
 
       var i = 1;
       for (ref in this.refs) {
           results.push(this.refs[ref].toResource());
       }
       return results
    },

    toResource: function(field_value) {
        if (!field_value) {
            field_value = this.getValue(field_value);
        }
        else {
            console.log('why is this called??');
        }

        return field_value;        
    },

    getInitialState: function() {

        state = { field_id: 'event_dates', form: this.props.form };

        if (this.props.val && this.props.val.length > 0) {
            state.event_dates = this.props.val;
        } else {
            state.event_dates = [{}];
        }
        
        return state;  
    },

    addEventDate: function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        new_event_dates = this.state.event_dates.concat({});
        this.setState({event_dates: new_event_dates})
    },

    render: function() {

        var rendered_forms = this.state.event_dates.map(function (event_date, i) {
            return <EventDateForm key={ 'ed_formxx_' + i} event_date={ event_date } ref={'ed_' + i} prefix={i} />;
        });

        return <div>
                <label className="col-sm-2 control-label">Dates (<a href=""  onClick={this.addEventDate}>add</a>)</label>
                <div className="col-sm-10">{ rendered_forms }</div>
            </div>;


    }
});


EventsForm = React.createClass({
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

        console.log(restData)
        console.log('PREVENTING FORM FROM SUBMITTING...')

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
            ['studios', 'studios']
        ];


        var img_src = null;

        if (this.state.data.results.primary_image_resource) {
            img_src = this.state.data.results.primary_image_resource.versions.CARD_SMALL.url;
            img_src = <img src={ img_src } className="img-responsive" />
        }

        var uploader = null;
        if (this.state.data && this.state.data.results && this.state.data.results.resource_id ) {
            uploader = <FileUploader
                allow_multiple={ false }
                callback_url={'/api/files/upload_callback?attach_to_resource=' + this.state.data.results.resource_id  + '&target_property=primary_image_resource_id'}

                upload_success_callback = { this.upload_success_callback }
                upload_error_callback = { this.upload_error_callback } />
        }

        var event_date_forms = '';

        return <div className="row">
            <div className="col-lg-8">
                <form role="form" className="form-horizontal" action="#" onSubmit={this.submitHandler}>
                    { errors }
                    
                    { img_src }

              <TextField id="name"  ref="field.name" val={this.state.data.results.name } form={this} placeholder="Enter Event Name" onChangeCallback={this.sluggable_helper} />
              <SlugField id="slug" form={this}  ref="field.slug"  val={this.state.data.results.slug } widget={SlugWidget} url_root="http://mplsart.com/events/" />
              <TextField id="featured" form={this} ref="field.featured" val={this.state.data.results.featured } placeholder="true or false" />

              <TextField id="url" form={this} ref="field.url"  val={this.state.data.results.url } placeholder="http://" />

              <TextField id="summary"  ref="field.summary" val={this.state.data.results.summary } form={this} widget={TextareaWidget} placeholder="Post Summary" />
              <TextField id="content"  ref="field.content" val={this.state.data.results.content } form={this} widget={TextareaWidget} placeholder="Post content" />

              <EventDateFormsInterface id="event_dates" form={this}  ref="field.event_dates"  val={this.state.data.results.event_dates } />


              <div className="pull-right">
                  <button type="submit" className="btn btn-primary">Submit</button>
                  &nbsp;
                  &nbsp;
                  <a href="/admin/events/" className="small">cancel</a>
             </div>
            </form>
        </div>
            <div className="col-lg-4">
                { uploader }
            </div>

        </div>;

    }
    
});

module.exports = EventsForm;