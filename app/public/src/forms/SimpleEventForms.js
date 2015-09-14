/*
    Form Components for Simple Event Form
*/


var React = require('react');
var forms = require('newforms');
var BootstrapForm = require('newforms-bootstrap');


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
  //category: forms.ChoiceField({label: "Type", required: true, choices: ED_CATEGORY_CHOICES}),
  label: forms.CharField({label:"Label"}),
  category: forms.CharField({label:"category"}),
  start_date: forms.CharField({widget: forms.DateTimeInput}),
  end_date: forms.CharField({widget: forms.DateTimeInput}),
  clean: function () {
    //alert('CLEAN!!!');
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
    _onSubmitHandler: function(e) {
        e.preventDefault();

        var primary_form = this.refs.primary_form.getForm();
        var primary_form_is_valid = primary_form.validate();

        if (primary_form_is_valid) {

          this.setState({cleaned_data: primary_form.cleanedData});

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

        // Construct the primary event Form
        var event_form = new EventForm({
            initial: this.props.form_data,
            onChange: this.forceUpdate.bind(this)
        });

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
            onChange: this.forceUpdate.bind(this),
            canOrder:true,
            canDelete:true
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



        return (
            <div className="row">
            <div className="col-xs-4">
                { cleaned_data }
            </div>
            <div className="col-xs-8">
                <form onSubmit={this._onSubmitHandler} className="form-horizontal" role="form">
                    <forms.RenderForm form={this.state.form} ref="primary_form">
                        <Container>
                            <Field name="name" />
                            <Field name="url" />
                            <Field name="summary" />

                        </Container>
                    </forms.RenderForm>

                    <fieldset>
                        <legend>Event Dates</legend>
                        {this.renderformset()}

                    </fieldset>

                    <button>Sign Up</button>
                </form>
            </div>

            </div>
        );

    },

    renderformset: function () {
        return this.state.eventdate_forms.forms().map(function(form, i) {
            var bound_field = form.boundFieldsObj()
            var eventdate_formsset = this.state.eventdate_forms;


              return (
                <div key={"date_row_" + i} className="row">
                    ddd
                </div>
            );
        });
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
          summary: 'This is a summary'
        };

        state.eventdate_form_data = [
          {label:'cheese', 'category': 'reception'},
          {label:'dickfor', 'category': 'ongoing'},
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