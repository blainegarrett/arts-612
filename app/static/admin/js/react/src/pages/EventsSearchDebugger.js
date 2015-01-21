
var React = require('react');
var DataTableMixin = require('./../utilities/DataTableMixin');
var moment = require('moment');
var TextField = require('./../utilities/forms/fields/TextField');


SearchForm = React.createClass({
    propTypes: {
      resource_url: React.PropTypes.string.isRequired
    },

    componentDidMount: function(){
        
    },
    getInitialState: function(){
        
        console.log(this.props)
        return {
            save_callback: this.props.save_callback,
            errors: [],
            is_edit: this.props.is_edit,
            data: {'results': {}}
        }
    },

    render: function(){
        if (this.state.is_edit && !this.state.data.results.name) {
            return <div>Loading...</div>
        }

        var rendered_errors = this.state.errors.map(function (obj) {
            return obj.toString();
        });

        var errors = <p className="bg-danger">{ rendered_errors }</p>;

        var event_date_forms = '';


         var category_choices = [
                ['reception', 'Reception'],
                ['ongoing', 'Ongoing Event'],
                ['performance', 'Performance'],
                ['sale', 'Sale'],
                ['hours', 'Gallery Hours'],
            ];

        return <form role="form" className="form-horizontal" action="#" onSubmit={this.state.save_callback}>
            { errors }

          <ChoiceField id="category" form={this} ref="field.category"  val="" widget={CheckboxWidget} choices={category_choices} />
          <DateTimeField id="start" form={this}  ref="field.start"  val="" widget={DateRangeWidget} />
          <DateTimeField id="end" form={this}  ref="field.end"  val=""  widget={DateRangeWidget} />
        <ChoiceField id="venue_slug"  ref="field.venue_slug" val="" form={this} widget={AutoCompleteWidget}/>


          <div className="pull-right">
              <button type="submit" className="btn btn-primary">Submit</button>
              &nbsp;
              &nbsp;
              <a href="/admin/events/" className="small">cancel</a>
         </div>
        </form> 
    }
    
});


var EventsSearchResult = React.createClass({
    render: function() {
        var event = this.props.obj;

        console.log(event);

        return <div>
            <p><a href={'/admin/events/' + event.resource_id + '/edit'}>{event.name}</a></p>
        
        </div>
    }
});


var EventsSearchDebugger = React.createClass({
    getInitialState: function() {
        return {
            results: [],
            resource_url: '/api/events/upcoming',
            resource_base_url: '/api/events/upcoming'
        }
    },
    submitHandler: function(e) {
        var method;

        e.preventDefault();
        e.stopPropagation();


        var restData = {};
        // We need to iterate over all of the rest fields in refs and evaluate them
        // to rest acceptable values (toResource()).


        var form_refs = this.refs.form.refs;
        var ref;

        console.log('cheese burger pit');

        console.log(form_refs)
        for (ref in form_refs){
            console.log(ref);

            if (ref.indexOf("field.") == 0) {
                val = form_refs[ref].toResource();

                if (val && val != '' && val != null) {
                    restData[form_refs[ref].state.field_id] = val;
                }
            }
        }

        console.log(restData)
        console.log('PREVENTING FORM FROM SUBMITTING...')


        var query_string = $.param(restData);
        var resource_url = this.state.resource_base_url + '?' + query_string

        console.log(this.setState({resource_url: resource_url }));


        // Send Ajax Payload
        $.ajax({
            url: resource_url,
            type: 'GET',
            dataType: 'json',
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success:  function(data) {
                this.setState({'results': data.results});
            }.bind(this),

            error: function(xhr, status, err) {
                error_body = JSON.parse(xhr.responseText);

                this.setState({errors: error_body.messages}); //messages is always a list

                console.error(this.state.resource_url, status, err.toString());
                
            }.bind(this) 
        });

    },
    
    render: function() {


        console.log(this.state);

        var rendered_events = '';
        if (this.state.results.length > 0) {
            rendered_events = this.state.results.map(function (obj) {
                return <EventsSearchResult obj={obj} />
            });
        }
        else {
            rendered_events = <div>No Results given for this query</div>
        }

        return <div className="row">
                    <div className="col-lg-12">
                        <h2><a href="/admin">Admin</a> / <a href="/admin/events">Events</a> / Search Debugger</h2>  
                        
                        <div className="row">
                            <div className="col-lg-5">
                                
                                <SearchForm resource_url={this.state.resource_base_url} ref="form" save_callback={this.submitHandler} />
                                
                            </div>

                            <div className="col-lg-7">

                                <form>
                                  <div className="form-group">
                                    <div className="input-group">
                                      <div className="input-group-addon">url</div>
                                      <input type="text" className="form-control" id="exampleInputAmount" placeholder="url" value={this.state.resource_url} />
                                    </div>
                                  </div>
                                </form>

                                { rendered_events }
                            </div>
                        
                        </div>
                        
                        
                </div>
            </div>;
    }
});
module.exports = EventsSearchDebugger;