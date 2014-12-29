var React = require('react');
//var TextField = require('./../utilities/forms/fields/TextField');
//var ChoiceField = require('./../utilities/forms/fields/ChoiceField');
var DateTimeField = require('./../utilities/forms/fields/DateTimeField');
//var CheckboxWidget = require('./../utilities/forms/widgets/CheckboxWidget');
var DateRangeWidget = require('./../utilities/forms/widgets/DateRangeWidget');
var AutoCompleteWidget = require('./../utilities/forms/widgets/AutoCompleteWidget');


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
    render: function() {

        var category_choices = [
            ['reception', 'Reception/Opening/Closing aka "Concise" Event'],
            ['ongoing', 'Ongoing Event'],
            ['performance', 'Performance - Specific Start time to show up...'],
            ['sale', 'Sale - separate category etc'],
            ['hours', 'Gallery/Display Hours (maps to venue hours)'],
        ];

        return <div id={'event_date_container_' + this.state.prefix}>
        <hr />
        <TextField id="type"  ref="field.type" val={this.state.data.type } form={this} />
        <TextField id="label"  ref="field.label" val={this.state.data.label } form={this} />
        <DateTimeField id="start" form={this}  ref="field.start"  val={this.state.data.start } widget={DateRangeWidget} />
        <DateTimeField id="end" form={this}  ref="field.end"  val={this.state.data.end }  widget={DateRangeWidget} />

        <ChoiceField id={'category' + this.state.prefix} form={this} ref="field.category"  val={this.state.data.category } widget={CheckboxWidget} choices={category_choices} />
          
        <ChoiceField id="venue_slug"  ref="field.venue_slug" val={this.state.data.venue_slug } form={this} widget={AutoCompleteWidget}/>
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
       return this.refs.input.getValue();
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

        var i = 0;
        var rendered_forms = this.state.event_dates.map(function (event_date) {
            i += 1;
            return <EventDateForm event_date={ event_date } ref={'ed_' + i} prefix={i} />;
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


        var event_date_forms = '';
        
        return <form role="form" className="form-horizontal" action="#" onSubmit={this.submitHandler}>
            { errors }
          <TextField id="name"  ref="field.name" val={this.state.data.results.name } form={this} placeholder="Enter Venue Name"/>
          <TextField id="slug" form={this}  ref="field.slug"  val={this.state.data.results.slug } />
          <TextField id="url" form={this} ref="field.url"  val={this.state.data.results.url } />
          <EventDateFormsInterface id="event_dates" form={this}  ref="field.event_dates"  val={this.state.data.results.event_dates } />


          <div className="pull-right">
              <button type="submit" className="btn btn-primary">Submit</button>
              &nbsp;
              &nbsp;
              <a href="/admin/events/" className="small">cancel</a>
         </div>
        </form> 
    }
    
});

module.exports = EventsForm;