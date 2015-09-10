/* Pages For StyleGuides and Design Documentation */

var React = require('react');
var PageMixin = require('./PageMixin');
var ReactRouter = require('flux-react-router');

var forms = require('newforms');
var BootstrapForm = require('newforms-bootstrap');


var MySpecialFormRow = React.createClass({
  render: function() {
    return (<b>Cheeese</b>);
  }
});

var EMPTY_CHOICE = ['', ''];

var ED_CATEGORY_CHOICES = [
    EMPTY_CHOICE,
    ['reception', 'Reception/Opening/Closing aka "Concise" Event'],
    ['ongoing', 'Ongoing Event'],
    ['performance', 'Performance - Specific Start time to show up...'],
    ['sale', 'Sale - separate category etc'],
    ['hours', 'Gallery/Display Hours (maps to venue hours)'],
];


/* Form Class For Primary Event */
var EventForm = forms.Form.extend({
  name: forms.CharField({label:"Name", maxLength: 100, widgetAttrs: {autoFocus: true, placeholder:'What is the name of the event - max 50 chars'}}),
  summary: forms.CharField({label:"Summary", widget: forms.Textarea, widgetAttrs: {placeholder:'Ultra brief summary'}}),
  url: forms.URLField({label:"More Info Url"}),

  clean: function() {

    if (this.cleanedData.name == 'Cheese') {
      throw forms.ValidationError('There was an error.');
    }
  }
});

/* Event Date Forms */
var EventDateForm = forms.Form.extend({
  category: forms.ChoiceField({label: "Type", required: true, choices: ED_CATEGORY_CHOICES}),
  label: forms.CharField({label:"Label"}),
  start_date: forms.CharField({widget: forms.DateTimeInput}),
  end_date: forms.CharField({widget: forms.DateTimeInput}),
  clean: function () {
    //alert('CLEAN!!!');
  }
});

/* Setup The Form Sets */
var InlineEventDateFormSet = forms.FormSet.extend({form: EventDateForm, extra:2});

var formchangehandler = function(e) {
  console.log(e);
  console.log(this);

  alert('hello');
};


//var extend = isomorph.object.extend;
var extend = function(a, b) { return $.extend({}, a, b) };

function partial(fn) {
  console.log('render a partial...');

  var args = Array.prototype.slice.call(arguments, 1)
  return function () {
    return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)))
  }
}

function field(bf, cssClass, options) {

  options = extend({label: true}, options)
  var errors = bf.errors().messages().map(message => <div className="help-block">{message}</div>)
  var errorClass = errors.length > 0 ? ' has-error' : ''
  return <div key={bf.htmlName} className={cssClass + errorClass}>
    <div className="form-group">
      {options.label && bf.labelTag()}
      {bf.asWidget({attrs: {className: 'form-control'}})}
      {errors}
    </div>
  </div>
}

function widget(bf, cssClass) {
  return field(bf, cssClass, {label: false})
}

function addAnother(formset, e) {
  /* jshint validthis: true */
  e.preventDefault()
  formset.addAnother()
}

var fieldchangehandler = function() {
  console.log(arguments);
  console.log(this);

  alert('field changed');
}

var Signup = React.createClass({

  getInitialState: function () {

    /* Setup The Form */
    var event_data = {
      name: 'blorp',
      url: 'http://google.com',
      summary: 'This is a summary'
    };

    var event_date_date = [
      {label:'cheese', 'category': 'reception'},
      {label:'dickfor', 'category': 'ongoing'},
    ]; // List of event date data from rest..

    //var event_form = new EventForm({data:event_data}); // or f.setData()
    var event_form = new EventForm({
      onChange: this.forceUpdate.bind(this)
    });

    var event_date_forms = new InlineEventDateFormSet({
        initial: event_date_date,
        prefix: this.prefix('event_dates'),
        onChange: this.forceUpdate.bind(this),
        canOrder:true,
        canDelete:true
    });

    return {
      eventDateForms: event_date_forms,
      form: event_form
    }
  },

  prefix: function (formsetType) {
    return 'duber';
    //return this.props.prefix + '-' + formsetType
  },

  addAnother: addAnother,

  getCleanedData: function () {
    alert('getCleanedData not implemented yet');
    return false;
  },

  render: function() {
    var cleanedData
        if (this.state.cleanedData !== false) {
          cleanedData = <div>
            <h2>cleanedData</h2>
            <pre>{JSON.stringify(this.state.cleanedData, null, ' ')}</pre>
          </div>
        };


    var Col = BootstrapForm.Col;
    var Container = BootstrapForm.Container;
    var Row = BootstrapForm.Row;
    var Field = BootstrapForm.Field;

    return (
      <form onSubmit={this._onSubmit} className="form-horizontal" role="form">
        <forms.RenderForm form={this.state.form} ref="signupForm">
          <Container>

                <Field name="name" />
                <Field name="url" />
                <Field name="summary" />

            </Container>
        </forms.RenderForm>

          {cleanedData}
          <fieldset>
            <legend>Event Dates</legend>
            {this.renderPhoneNumberForms()}
            <p><a href="#another" onClick={partial(this.addAnother, this.state.eventDateForms)}>+ add another phone number</a></p>
          </fieldset>

      <button>Sign Up</button>
    </form>)
  },

 propTypes: {
    onSignup: React.PropTypes.func.isRequired
  },


renderPhoneNumberForms: function () {
    return this.state.eventDateForms.forms().map((form, i) => {
      var renderFunc = (i === 0 ? field : widget)
      var bfo = form.boundFieldsObj()

      var edFormSet = this.state.eventDateForms;
      return <div key={"date_row_" + i} className="row">
        {renderFunc(bfo.category, 'col-sm-4')}
        {renderFunc(bfo.label, 'col-sm-3')}

        {renderFunc(bfo.start_date, 'col-sm-2')}
        {renderFunc(bfo.end_date, 'col-sm-2')}
        <div className="col-sm-1"><a href="#" onClick={ function() { edFormSet.removeForm(i); console.log(i); return false; } }>{ i }</a></div>
      </div>
    })
  },


  renderPersonForm: function () {
    /* This is how to custom render the event form */
    var topErrors = this.state.form.nonFieldErrors().messages().map(message =>
      <p className="alert alert-danger">{message}</p>
    )
    var bfo = this.state.form.boundFieldsObj();

    console.log(bfo);

    return (<div>
      {topErrors}
      <div className="row">
        {field(bfo.name, 'col-sm-2')}
        {field(bfo.summary, 'col-sm-3')}
        {field(bfo.url, 'col-sm-3')}
      </div>
    </div>
    )
  },

  _onSubmit: function(e) {

    alert('hola');


    e.preventDefault();

    var form = this.refs.signupForm.getForm();
    console.log(form);

    var isValid = form.validate();

    console.log(isValid);
    console.log(form.errors());

    if (isValid) {
      //this.props.onSignup(form.cleanedData)

      console.log(form.cleanedData);
      alert('Form is valid.. see console for results.');

    }
  }
});


var SubmitEventPage = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'Sign in',
        'description': 'Sign in'
    },

    pageDidMount: function () {
        // Set Default Page Meta
        this.setMeta();

    },

    render: function() {
        return (
          <div className="container">
            <Signup />
          </div>
          )
    }
});



module.exports = {
    Events: SubmitEventPage
};
