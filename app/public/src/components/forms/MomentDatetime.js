var React = require('react');
var forms = require('newforms');

var MultiWidget = forms.MultiWidget;
var MultiValueField = forms.MultiValueField;

var DateInput = forms.DateInput;
var DateField = forms.DateField;
var TimeInput = forms.TimeInput;
var TimeField = forms.TimeField

var extend = function(a, b) { return $.extend({}, a, b) };


/**
 * Splits Date input into two <input type="text"> elements.
 * @constructor
 * @extends {MultiWidget}
 * @param {Object=} kwargs
 */
var SplitDateTimeWidgetNew = MultiWidget.extend({
  constructor: function SplitDateTimeWidgetNew(kwargs) {

    if (!(this instanceof SplitDateTimeWidgetNew)) { return new SplitDateTimeWidgetNew(kwargs) }

    kwargs = extend({attrs: {'data-date-format': "YYYY-MM-DD"}, dateFormat: null, timeFormat: null}, kwargs);


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



/**
 * A MultiValueField consisting of a DateField and a TimeField.
 * @constructor
 * @extends {MultiValueField}
 * @param {Object=} kwargs
 */
var MomentDatetimeField = MultiValueField.extend({
  widget: SplitDateTimeWidgetNew
, defaultErrorMessages: {
    invalidDate: 'Enter a valid date plz.'
  , invalidTime: 'Enter a valid time plz.'
  }

, constructor: function MomentDatetimeField(kwargs) {
    if (!(this instanceof MomentDatetimeField)) { return new MomentDatetimeField(kwargs) }

    kwargs = extend({
      inputDateFormats: null, inputTimeFormats: null
    }, kwargs)
    var errors = extend({}, this.defaultErrorMessages)
    if (typeof kwargs.errorMessages != 'undefined') {
      extend(errors, kwargs.errorMessages)
    }

    console.log(this);
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
MomentDatetimeField.prototype.compress = function(dataList) {
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





module.exports = {
    MomentDatetimeField: MomentDatetimeField
}