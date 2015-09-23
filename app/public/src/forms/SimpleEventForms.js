/*
    Form Components for Simple Event Form
*/


var React = require('react');
var forms = require('newforms');
var BootstrapForm = require('newforms-bootstrap');
var extend = function(a, b) { return $.extend({}, a, b) };


var DateInput = forms.DateInput
var MultiWidget = forms.MultiWidget
var TimeInput = forms.TimeInput

/**
 * Splits Date input into two <input type="text"> elements.
 * @constructor
 * @extends {MultiWidget}
 * @param {Object=} kwargs
 */
var SplitDateTimeWidgetNew = MultiWidget.extend({
  constructor: function SplitDateTimeWidgetNew(kwargs) {

    console.log('the constructor');

    if (!(this instanceof SplitDateTimeWidgetNew)) { return new SplitDateTimeWidgetNew(kwargs) }

    kwargs = extend({dateFormat: null, timeFormat: null}, kwargs)
    var widgets = [
      DateInput({attrs: kwargs.attrs, format: kwargs.dateFormat})
    , TimeInput({attrs: kwargs.attrs, format: kwargs.timeFormat})
    ]
    MultiWidget.call(this, widgets, kwargs.attrs)
  }
})

SplitDateTimeWidgetNew.prototype.decompress = function(value) {
    console.log('decompress');
    console.log(value);

  if (value) {
    return_vals = [
      new Date(value.getFullYear(), value.getMonth(), value.getDate())
    , new Date(1900, 0, 1, value.getHours(), value.getMinutes(), value.getSeconds())
    ]
    console.log(return_vals);
    return return_vals;
  }
  return [null, null]
}










'use strict';

//var is = require('isomorph/is')
//var object = require('isomorph/object')

var DateField = forms.DateField
var MultiValueField = forms.MultiValueField
//var SplitDateTimeWidgetNew = SplitDateTimeWidgetNew
//var SplitHiddenDateTimeWidget = forms.SplitHiddenDateTimeWidget
var TimeField = forms.TimeField

var ValidationError = forms.validators

/**
 * A MultiValueField consisting of a DateField and a TimeField.
 * @constructor
 * @extends {MultiValueField}
 * @param {Object=} kwargs
 */
var SplitDateTimeFieldNew = MultiValueField.extend({
  widget: SplitDateTimeWidgetNew
, defaultErrorMessages: {
    invalidDate: 'Enter a valid date plz.'
  , invalidTime: 'Enter a valid time plz.'
  }

, constructor: function SplitDateTimeFieldNew(kwargs) {
    if (!(this instanceof SplitDateTimeFieldNew)) { return new SplitDateTimeFieldNew(kwargs) }

    kwargs = extend({
      inputDateFormats: null, inputTimeFormats: null
    }, kwargs)
    var errors = extend({}, this.defaultErrorMessages)
    if (typeof kwargs.errorMessages != 'undefined') {
      extend(errors, kwargs.errorMessages)
    }

    console.log(kwargs.inputTimeFormats);

    kwargs.fields = [
      DateField({inputFormats: kwargs.inputDateFormats,
                 errorMessages: {invalid: errors.invalidDate}})
    , TimeField({inputFormats: kwargs.inputTimeFormats,
                 errorMessages: {invalid: errors.invalidTime}})
    ]
    MultiValueField.call(this, kwargs)
  }
})

/**
 * Validates that, if given, its input does not contain empty values.
 * @param {?Array.<Date>} dataList a two-item list consisting of two Date
 *   objects, the first of which represents a date, the second a time.
 * @return {?Date} a Dare representing the given date and time, or null for
 *   empty values.
 */
SplitDateTimeFieldNew.prototype.compress = function(dataList) {
  console.log(dataList);

  if (dataList.length > 0) {
    var d = dataList[0]
    var t = dataList[1]
    // Raise a validation error if date or time is empty (possible if
    // SplitDateTimeField has required == false).
    if (this.isEmptyValue(d)) {
      throw ValidationError(this.errorMessages.invalidDate, {code: 'invalidDate'})
    }
    if (this.isEmptyValue(t)) {
      throw ValidationError(this.errorMessages.invalidTime, {code: 'invalidTime'})
    }
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(),
                    t.getHours(), t.getMinutes(), t.getSeconds())
  }
  console.log('derp');
  return null
}



/*
var SplitDateTimeWidget = forms.MultiWidget.extend({
  constructor: function SplitDateTimeWidget(kwargs) {
    if (!(this instanceof SplitDateTimeWidget)) { return new SplitDateTimeWidget(kwargs) }
    kwargs = extend({dateFormat: null, timeFormat: null}, kwargs);

    var widgets = [
      forms.DateInput({attrs: kwargs.attrs, format: kwargs.dateFormat})
    , forms.TimeInput({attrs: kwargs.attrs, format: kwargs.timeFormat})
    ]
    forms.MultiWidget.call(this, widgets, kwargs.attrs)
  },
})

SplitDateTimeWidget.prototype.decompress = function(value) {
    console.log('decompress with value of ' + value);
  var date_obj = moment(new Date(value));
    var date_val = date_obj.format('YYYY-MM-DD');
    var time_val = date_obj.format('h:mm A');

    return [date_val, time_val];

};
*/


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

        var rc = this;
        var base_id = this.props.bound_field.idForLabel();
        var field_id;
        if (base_id.indexOf('date_0') == -1) {
            console.log('DateRangeField can only be used on MultiWidget\'s with ids in the format of *_date');
        }

        base_id = base_id.replace('date_0', 'date');

        var field_set_prefix = rc.props.bound_field.form.prefix;
        field_id = base_id.replace('id_' + field_set_prefix + '-', ''); //field id of form

        var $date_element = $('#' + base_id + '_0');
        var $time_element = $('#' + base_id + '_1');

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


    console.log(rc.props.bound_field.form.data);

        /*
        var data_to_update = {};
        data_to_update[field_id + '_0'] = $date_element.val() + 'T08:00:00Z';
        rc.props.bound_field.form.updateData(data_to_update);
        */
    },
});


/* Form Class For Primary Event */
var EventForm = forms.Form.extend({
    //name: forms.CharField({label:"Name", maxLength: 100, widgetAttrs: {autoFocus: false, placeholder:'What is the name of the event - max 50 chars'}}),
    summary: forms.CharField({label:"Summary", widget: forms.Textarea, widgetAttrs: {placeholder:'Ultra brief summary'}}),
    url: forms.URLField({label:"More Info Url"}),
    fung: SplitDateTimeFieldNew({label: "Split", inputDateFormats: dateFormats, inputTimeFormats: [timeFormat]}),

    clean: function() {
        //if (this.cleanedData.name == 'Cheese') {
        //    throw forms.ValidationError('There was an error.');
        //}
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

      return <tr key={bf.htmlname}>
        <th>{bf.labelTag()}</th>
        <td>{bf.render()}{help}</td>
        <td>{''+bf._isControlled()}</td>
        <td>{JSON.stringify(bf._validation())}</td>
        <td>{errors}</td>
        <td className="cleaned-data">{cleanedData}</td>
      </tr>
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
  //start_date: forms.CharField({widget: SplitDateTimeWidget, widgetAttrs: {className: 'fuck-form-control'}}),
  end_date: forms.CharField({widget: forms.DateTimeInput}),
  clean: function () {
    //alert('CLEAN!!!');

    console.log('In the clean method');
  }
});


var SimpleEventDateFormsetComponent = React.createClass({

    propTypes: {
        eventdate_forms: React.PropTypes.object,
    },

    clean: function () {
        alert('hola');
        throw forms.ValidationError('A first name or last name is required.');
    },
    getCleanedData: function () {
        var formset_forms_valid = this.state.eventdate_forms.validate();
        return this.state.eventdate_forms.cleanedData();

    },
    getInitialState: function () {
        return {
            eventdate_forms: this.props.eventdate_forms
        }
    },

    field: function(bf, cssClass, i, options) {

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

              return (
                <div key={"date_row_" + i} className="row">
                    <Field bound_field={bound_field.category} cssClass='col-sm-3' i={i} />
                    <Field bound_field={bound_field.label} cssClass='col-sm-4' i={i} />
                    { /*<DateRangeField bound_field={bound_field.start_date} cssClass='col-sm-2' i={i} /> */ }
                    <Field bound_field={bound_field.end_date} cssClass='col-sm-2' i={i} />

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
            {this.renderformset()}
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


    prefix: function (formsetType) {
        return 'duber';
        //return this.props.prefix + '-' + formsetType
    },

onSubmit(e) {
    e.preventDefault()
    this.state.form.validate(this.refs.form)
    this.forceUpdate()
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
            cleaned_data: false
        };

        console.log(this.props.form_data);

        // Construct the primary event Form
        var event_form = new EventForm({initial: this.props.form_data, onChange: this.forceUpdate.bind(this) });
        state.form = event_form;

        // Construct the event date form lists

        /* Setup The Form Sets */
        var total_extra_forms = 1;
        if (this.props.eventdate_form_data.length > 0) {
            total_extra_forms = 0;
        }
        var InlineEventDateFormSet = forms.FormSet.extend({form: EventDateForm, extra:total_extra_forms});


        var event_date_forms = new InlineEventDateFormSet({
            initial: this.props.eventdate_form_data,
            prefix: this.prefix('event_dates'),
            controlled: true,
            onChange: this.forceUpdate.bind(this),
            //canOrder:true,
            //canDelete:true
        });

        state.eventdate_forms = event_date_forms;
        return state;
    },

    render:  function () {

        var Col = BootstrapForm.Col;
        var Container = BootstrapForm.Container;
        var Row = BootstrapForm.Row;
        var Field = BootstrapForm.Field;

        // This is for debugging... remove later
        var cleaned_data;
        if (this.state.cleaned_data !== false) {
          cleaned_data = (<pre>{JSON.stringify(this.state.cleaned_data, null, ' ')}</pre>)
        };


        var global_errors = this.state.form.nonFieldErrors().messages().map(function(err, i) {
            return <p className="alert alert-danger">{err}</p>
        });





        var nonFieldErrors = this.state.form.nonFieldErrors();
            return <form encType='multipart/form-data' ref="form" onSubmit={this.onSubmit}>

              {nonFieldErrors.isPopulated() && <div>
                <strong>Non field errors:</strong>
                {nonFieldErrors.render()}
              </div>}

<table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Input</th>
            <th>Controlled</th>
            <th>Validation</th>
            <th>Errors</th>
            <th>Cleaned Data</th>
          </tr>
        </thead>
        <tbody>
              { this.state.form.render() }
<tr>
            <td></td>
            <td colSpan="3">
              <input type="submit" value="Submit"/>
            </td>
          </tr>
        </tbody>
      </table>

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
        state.eventdate_form_data = [

        ];
        */

        state.form_data = {
          name: 'blorp',
          url: 'http://google.com',
          summary: 'This is a summary',
          fung: new Date()
        };

        state.eventdate_form_data = [
          {label:'cheese', category: 'reception', start_date: '2016-10-08T08:00:00Z', end_date: 'cheese'},
          //{label:'dickfor', category: 'ongoing', start_date: 'asdf', end_date: 'cheese'},
        ];

        //state.eventdate_form_data = []

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