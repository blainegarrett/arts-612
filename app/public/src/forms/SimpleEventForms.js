/*
    Form Components for Simple Event Form
*/

var React = require('react');
var forms = require('newforms');
var BootstrapForm = require('newforms-bootstrap');
var extend = function(a, b) { return $.extend({}, a, b) };

var MomentDatetimeField = require('../components/forms/MomentDatetime').MomentDatetimeField;












'use strict';

//var is = require('isomorph/is')
//var object = require('isomorph/object')

var DateField = forms.DateField
var MultiValueField = forms.MultiValueField
//var SplitDateTimeWidgetNew = SplitDateTimeWidgetNew
//var SplitHiddenDateTimeWidget = forms.SplitHiddenDateTimeWidget
var TimeField = forms.TimeField

var ValidationError = forms.validators


var BaseFieldMixin = {
    propTypes: {
        bound_field: React.PropTypes.object,
        i: React.PropTypes.number,
        cssClass: React.PropTypes.string,
        options: React.PropTypes.object,
    },
    getInitialState: function() {
        return {
            bound_field: this.props.bound_field,
            cssClass: this.props.cssClass,
        };
    },
    render: function () {
        var bf = this.state.bound_field;

        var cssClass = this.state.cssClass;
        var i = this.props.i;
        var options = this.props.options;

        options = extend({label: true}, options)
        var errors = bf.errors().messages().map(message => <div className="help-block">{message}</div>)
        var errorClass = errors.length > 0 ? ' has-error' : '';

        return (
        <div key={bf.htmlName + '_' + i} className={cssClass + errorClass}>
            <div className="form-group">
              {options.label && bf.labelTag()}
              {bf.asWidget({attrs: {className: 'form-control'}})}
              {errors}

              ( { bf.value()} )
            </div>
          </div>
        );
    }

}
var Field = React.createClass({
    //<Field bound_field={bound_field.category} className='col-sm-4' i={i} />
    mixins: [BaseFieldMixin],

});


var dateFormats = [
  '%Y-%m-%d' // '2006-10-25'
, '%d/%m/%Y' // '25/10/2006'
, '%d/%m/%y' // '25/10/06'
]
var timeFormat = '%H:%M:%S' // '14:30'


var DateRangeField = React.createClass({
    mixins: [BaseFieldMixin],

    componentDidMount: function() {
        // Munge the id of the base widget because newforms MultiWidget.idForLabel just appends '_0'

        var react_element = this;
        var base_id = this.props.bound_field.idForLabel();
        var field_id;
        if (base_id.indexOf('date_0') == -1) {
            console.log('DateRangeField can only be used on MultiWidget\'s with ids in the format of *_date');
        }

        base_id = base_id.replace('date_0', 'date');

        var field_set_prefix = react_element.props.bound_field.form.prefix;
        field_id = base_id.replace('id_' + field_set_prefix + '-', ''); //field id of form

        var $date_input = $('#' + base_id + '_0');
        var $time_input = $('#' + base_id + '_1');

        //console.log($date_input.data());
        $date_input.datetimepicker({ pickTime: false }).on('dp.change', function(picker_event) {
            react_element.forceUpdate();
        });

      $time_input.timepicker({
        defaultTime: false,
        disableFocus: false,
        minuteStep: 15,
        showSeconds: true,
        showMeridian: false
      }).on('changeTime.timepicker', function(e) {
            react_element.forceUpdate();
      });

        this.forceUpdate();


 /*
        var react_element = this;
        $date_input = $('#id_duber-0-start_date_0');
        $date_input.val('2011-09-02');




        var $date_input = $('#id_duber-0-start_date_0');
        //console.log($date_input.data());
        $date_input.datetimepicker({ pickTime: false }).on('dp.change', function(picker_event) {
            react_element.forceUpdate();
        });

       // Bind the Time Picker - defaultTime: False allows for null Times...
      $time_input = $('#id_duber-0-start_date_1');
      $time_input.timepicker({
        defaultTime: false,
        disableFocus: false,
        minuteStep: 15,
        showSeconds: true,
        showMeridian: false
      }).on('changeTime.timepicker', function(e) {
            react_element.forceUpdate();
      });





        this.props.form.forceUpdate();
        this.forceUpdate();

        console.log($date_input);
        */


        /*
        $date_element.datetimepicker({ pickTime: false }).on('dp.change', function(picker_event) {
            return;

            var data_to_update = {};
            data_to_update[field_id] = '2013-10-08T08:00:00Z';
            console.log(rc.props.bound_field);
            console.log(rc.props.bound_field.form.updateData(data_to_update, {prefixed:false}));
        });

        $time_element.timepicker({defaultTime: false, disableFocus: true}).on('changeTime.timepicker', function (e) {

            return

            console.log('timepicker updated');
            console.log(e.target.value);

            var data_to_update = {};
            data_to_update[field_id] = '2013-10-08T08:00:00Z';

            console.log(rc.props.bound_field);
            console.log(rc.props.bound_field.form.updateData(data_to_update, {prefixed:false}));
      });
    */


    console.log(react_element.props.bound_field.form.data);

        /*
        var data_to_update = {};
        data_to_update[field_id + '_0'] = $date_element.val() + 'T08:00:00Z';
        rc.props.bound_field.form.updateData(data_to_update);
        */
    },
});


/* Form Class For Primary Event */
var EventForm = forms.Form.extend({
    name: forms.CharField({label:"Name", maxLength: 100, widgetAttrs: {autoFocus: false, placeholder:'What is the name of the event - max 50 chars'}}),
    summary: forms.CharField({label:"Summary", widget: forms.Textarea, widgetAttrs: {placeholder:'Ultra brief summary'}}),
    url: forms.URLField({label:"More Info Url"}),
    fung: MomentDatetimeField({label: "Split", inputDateFormats: dateFormats, inputTimeFormats: [timeFormat]}),

    clean: function() {
        if (this.cleanedData.name == 'Cheese') {
            throw forms.ValidationError('Cheese is nobody i know.');
        }
    }

, render() {
    return this.boundFields().map(bf => {
      // Display cleaneddata, indicating its type
      var cleanedData
      if (this.cleanedData && bf.name in this.cleanedData) {
        cleanedData = this.cleanedData[bf.name]
        if (Array.isArray(cleanedData)) {
          cleanedData = JSON.stringify(cleanedData)
        }
        else {
          var isString = (Object.prototype.toString.call(cleanedData) == '[object String]')
          cleanedData = ''+cleanedData
          if (isString) {
            cleanedData = '"' + cleanedData + '"'
          }
        }
      }

      var help
      if (bf.helpText) {
        help = (bf.helpText.__html
                ? <p dangerouslySetInnerHTML={bf.helpText}/>
                : <p>{bf.helpText}</p>)
      }

    var errors = bf.errors().messages().map(message => <div>{message}</div>)


      return (<div key={bf.htmlname}>
        <span>{bf.labelTag()}</span>
        <span>{bf.render()}{help}</span>
        <span>{''+bf._isControlled()}</span>
        <span>{JSON.stringify(bf._validation())}</span>
        <span>{errors}</span>
        <span className="cleaned-data">{cleanedData}</span>
      </div>);
    })
  }
});


/* Event Date Forms */
var EMPTY_CHOICE = ['', ''];

var ED_CATEGORY_CHOICES = [
    EMPTY_CHOICE,
    ['reception', 'Reception/Opening/Closing aka "Concise" Event'],
    ['ongoing', 'Ongoing Event'],
    ['performance', 'Performance - Specific Start time to show up...'],
    ['sale', 'Sale - separate category etc'],
    ['hours', 'Gallery/Display Hours (maps to venue hours)'],
];

var EventDateForm = forms.Form.extend({
    category: forms.ChoiceField({label: "Type", required: true, choices: ED_CATEGORY_CHOICES}),
    label: forms.CharField({label:"Label"}),
    start_date: MomentDatetimeField({label: "Starts", inputDateFormats: dateFormats, inputTimeFormats: [timeFormat]}),
    end_date: MomentDatetimeField({label: "Ends", inputDateFormats: dateFormats, inputTimeFormats: [timeFormat]}),

  clean: function () {
    console.log(this.cleanedData);
    console.log('In the clean method');

    if (this.cleanedData.start_date > this.cleanedData.end_date) {
        throw forms.ValidationError('Error: End time cannot be later than start time.');
    }


    //if (this.cleanedData.name == 'Cheese') {
    //        throw forms.ValidationError('Cheese is nobody i know.');
    //    }
  }
});


var SimpleEventDateFormsetComponent = React.createClass({

    propTypes: {
        eventdate_forms: React.PropTypes.object,
    },


    componentDidMount: function () {
        /*
        var react_element = this;
        $date_input = $('#id_duber-0-start_date_0');
        $date_input.val('2011-09-02');




        var $date_input = $('#id_duber-0-start_date_0');
        //console.log($date_input.data());
        $date_input.datetimepicker({ pickTime: false }).on('dp.change', function(picker_event) {
            react_element.forceUpdate();
        });

       // Bind the Time Picker - defaultTime: False allows for null Times...
      $time_input = $('#id_duber-0-start_date_1');
      $time_input.timepicker({
        defaultTime: false,
        disableFocus: false,
        minuteStep: 15,
        showSeconds: true,
        showMeridian: false
      }).on('changeTime.timepicker', function(e) {
            react_element.forceUpdate();
      });





        this.props.form.forceUpdate();
        this.forceUpdate();

        console.log($date_input);
        */
        this.forceUpdate();

        this.props.form.forceUpdate();
    },
    clean: function () {
        this.forceUpdate();
        this.props.form.forceUpdate();

        alert('hola');
        throw forms.ValidationError('A first name or last name is required.');
    },
    getCleanedData: function (html_form_node) {
        this.forceUpdate();
        this.props.form.forceUpdate();

        var formset_forms_valid = this.state.eventdate_forms.validate(html_form_node);
        return this.state.eventdate_forms.cleanedData();

    },
    getInitialState: function () {
        return {
            eventdate_forms: this.props.eventdate_forms
        }
    },

    field: function(bf, cssClass, i, options) {
        this.forceUpdate();
                this.props.form.forceUpdate();
      options = extend({label: true}, options)
      var errors = bf.errors().messages().map(message => <div className="help-block">{message}</div>)
      var errorClass = errors.length > 0 ? ' has-error' : ''
      return <div key={bf.htmlName + '_' + i} className={cssClass + errorClass}>
        <div className="form-group">
          {options.label && bf.labelTag()}
          {bf.asWidget({attrs: {className: 'form-control'}})}
          {errors}
        </div>
      </div>
     this.forceUpdate();
    },

    widget: function(bf, cssClass, i) {
      return this.field(bf, cssClass, i, {label: false})
    },

    renderformset: function () {
        var eventdate_formsset = this.state.eventdate_forms;

        var rc = this;

        return eventdate_formsset.forms().map(function(form, i) {
            var renderFunc = (i === 0 ? rc.field : rc.widget);

            var bound_field = form.boundFieldsObj();


            // <a href="#" onClick={ function() { eventdate_formsset.removeForm(i); console.log(i); return false; } }>{ i }</a>

                var global_errors = form.nonFieldErrors().messages().map(function(err, i) {
                    return <p className="alert alert-danger">{err}</p>
                });


              return (
                <div key={"date_row_" + i} className="row">
                    { global_errors }
                    <Field bound_field={bound_field.category} cssClass='col-sm-3' i={i} />
                    <Field bound_field={bound_field.label} cssClass='col-sm-4' i={i} />
                    <DateRangeField bound_field={bound_field.start_date} cssClass='col-sm-2' i={i} />
                    <DateRangeField bound_field={bound_field.end_date} cssClass='col-sm-2' i={i} />

                    <div className="col-sm-1">
                        <label>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span className="sr-only">Actions</span>
                        </label>

                        <div className="btn-group">
                            <button className="btn btn-default btn-xs" type="button">
                                <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                <span className="sr-only">Delete Event Date</span>
                            </button>
                        </div>

                    </div>
                </div>
            );
        });
    },

    render: function () {
        return (
        <fieldset>
            <legend>Event Dates</legend>
            { this.renderformset() }
        </fieldset>
        );
    }
});

var SimpleEventFormComponent = React.createClass({
    /*
        React Component to wrap form UI controlling form since the newforms
        need to be initalized once.
    */
    propTypes: {
        form_data: React.PropTypes.object,
        eventdate_form_data: React.PropTypes.array,
        completion_callback: React.PropTypes.func,
    },

    componentDidMount: function () {
        // Janky interium solution to fields mounting properly...

        var react_element = this;

        var $date_input = $('#id_fung_0');
        //console.log($date_input.data());
        $date_input.datetimepicker({ pickTime: false }).on('dp.change', function(picker_event) {
            react_element.forceUpdate();
        });

       // Bind the Time Picker - defaultTime: False allows for null Times...
      $time_input = $('#id_fung_1');
      $time_input.timepicker({
        defaultTime: false,
        disableFocus: false,
        minuteStep: 15,
        showSeconds: true,
        showMeridian: false
      }).on('changeTime.timepicker', function(e) {
            react_element.forceUpdate();
      });

        this.forceUpdate();

    },
    /* Start form helper methods */
    prefix: function (formsetType) {
        // TODO: This is used, but is it needed?
        return 'duber';
        //return this.props.prefix + '-' + formsetType
    },
    onSubmit (e) {
        e.preventDefault();

        console.log(this.refs.formset_forms);
        console.log(this);
        this.refs.formset_forms.forceUpdate(); // Force update to the child
        this.forceUpdate(); // Force update to the SimpleEventFormComponent


        var primary_form = this.state.form;
        var primary_form_is_valid = primary_form.validate(this.refs.primary_form);
        var cleaned_data = primary_form.cleanedData;


        // Validate event date formset
        var formset_forms = this.refs.formset_forms
        var formset_data = formset_forms.getCleanedData(this.refs.primary_form);

        cleaned_data = extend(cleaned_data, {event_dates: formset_data});


        // Update the cleaned data on the state
        this.setState({cleaned_data: cleaned_data});

        console.log(cleaned_data);

    },

    _onSubmitHandler: function(e) {
        e.preventDefault();

        // Validate primary form
        var primary_form = this.refs.primary_form.getForm();
        var primary_form_is_valid = primary_form.validate();

        var cleaned_data = primary_form.cleanedData;

        // Validate event date formset
        //cleaned_data = extend(cleaned_data, {event_dates: this.refs.formset_forms.getCleanedData()});
        this.setState({cleaned_data: cleaned_data});

        if (primary_form_is_valid) {

            if (this.props.completion_callback) {
                this.props.completion_callback(primary_form.cleanedData);
            }
        }

    },

    getInitialState: function () {

        var state = {
            form: null,
            eventdate_forms: [],
            cleaned_data: {}
        };

        // Construct the primary event Form
        var event_form = new EventForm({
            initial: this.props.form_data,
            onChange: this.forceUpdate.bind(this)
        });
        state.form = event_form;

        // Construct the event date form lists

        /* Setup The Form Sets */
        var total_extra_forms = 1; // Ensure there is always at least one form
        if (this.props.eventdate_form_data.length > 0) {
            total_extra_forms = 0;
        }
        var InlineEventDateFormSet = forms.FormSet.extend({
            form: EventDateForm, extra:total_extra_forms,
        });

        rc = this;
        var event_date_forms = new InlineEventDateFormSet({
            initial: this.props.eventdate_form_data,
            prefix: this.prefix('event_dates'),
            //controlled: true,
            onChange: this.forceUpdate.bind(this),
            //canOrder:true,
            //canDelete:true
        });

        state.eventdate_forms = event_date_forms;
        return state;
    },

    render:  function () {
        // Renderer for the ReactComponent Wrapping the form

        // This is for debugging... remove later
        var cleaned_data;

        // TODO: This is only looking at the primary form's cleanedData
        if (this.state.form.cleanedData) {
            cleaned_data = (<pre>
                {JSON.stringify(this.state.form.cleanedData, null, ' ')}
                {JSON.stringify(this.state.cleaned_data, null, ' ')}
                </pre>)
        }


        //if (this.state.cleaned_data !== false) {
        //  cleaned_data = (<pre>{JSON.stringify(this.state.cleaned_data, null, ' ')}</pre>)
        //};

        var global_errors = this.state.form.nonFieldErrors().messages().map(function(err, i) {
            return <p className="alert alert-danger">{err}</p>
        });

        return (
            <div className="row">
                <div className="col-xs-4">
                    { cleaned_data }
                </div>
                <div className="col-xs-8">

                    { global_errors }

                    <form ref="primary_form" onSubmit={this.onSubmit} roll="form" className="form-horizontal">
                        <forms.RenderForm form={this.state.form}>
                            { /* this.state.form.render() */ }
                            <BootstrapForm>
                            </BootstrapForm>
                        </forms.RenderForm>

                        <SimpleEventDateFormsetComponent form={this} ref="formset_forms" eventdate_forms = {this.state.eventdate_forms} />

                        <div className="form-group">
                            <div className="col-sm-12">
                                <button type="submit" className="btn btn-default">Submit</button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>

        );





        <form encType='multipart/form-data' ref="primary_form" onSubmit={this.onSubmit}>

              { nonFieldErrors.isPopulated() && <div>
                <strong>Non field errors:</strong>
                {nonFieldErrors.render()}
              </div> }


              { this.state.form.render() }

              <br />

              <input type="submit" value="Submit"/>

              {this.state.form.cleanedData && <h2>form.cleanedData</h2>}
              <pre>{this.state.form.cleanedData && JSON.stringify(this.state.form.cleanedData, null, ' ')}</pre>
            </form>






        return (
            <div className="row">
            <div className="col-xs-4">
                { cleaned_data }
            </div>
            <div className="col-xs-8">

                <form onSubmit={this._onSubmitHandler} className="form-horizontal" role="form">


                    <forms.RenderForm form={this.state.form} ref="primary_form" />
                        {
                        /*
                        <Container fluid={true}>
                            <Field name="fung" />
                            <Field name="name" />
                            <Field name="url" />
                            <Field name="summary" />

                            { <SimpleEventDateFormsetComponent ref="formset_forms" eventdate_forms = {this.state.eventdate_forms} /> }
                        </Container>
                    </forms.RenderForm>
                */
                 }


                    <button>Submit</button>
                </form>
            </div>

            </div>
        );

    }
});


var SimpleEventForm = React.createClass({
    /* Streamlined Event Form Interface */

    propTypes: {
        completion_callback: React.PropTypes.func,
        resource_id: React.PropTypes.string
    },

    getInitialState: function () {
        var state = {};

        // TODO: Probably refactor this to pull from Store
        /*
        state.form_data = {
            name:'Super Cool Event'
        };
        state.eventdate_form_data = [ ];
        */

        // Construct data from form from the resource or don't
        state.form_data = {
          name: 'blorp',
          url: 'http://google.com',
          summary: 'This is a summary',
          fung: new Date()
        };

        //state.eventdate_form_data = []
        state.eventdate_form_data = [
          {label:'cheese', category: 'reception', start_date: new Date(), end_date: new Date()},
          //{label:'dickfor', category: 'ongoing', start_date: '2016-10-08T08:00:00Z', end_date: 'cheese'},
        ];

        // Set up the completion callback or default it
        state.completion_callback = this.props.completion_callback || function () { };

        return state;
    },

    render: function() {

        return (
            <div>
                <SimpleEventFormComponent
                    form_data={this.state.form_data}
                    eventdate_form_data={this.state.eventdate_form_data }
                    completion_callback={this.state.completion_callback}
                />
            </div>

        );
    }

});

module.exports = {
    SimpleEventForm: SimpleEventForm
}