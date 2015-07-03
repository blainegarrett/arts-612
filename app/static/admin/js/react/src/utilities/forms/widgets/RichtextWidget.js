/*

CKEDITOR.replace( 'editor1' );

*/

var React = require('react');
var BaseWidgetMixin = require('./BaseWidgetMixin');

var React = require('react');
var BaseWidgetMixin = require('./BaseWidgetMixin');

var ckops = {
        /*
        toolbar : [
            {'name': 'links', items: ['Link', 'Unlink']},
            {'name': 'styles', items: ['Bold', 'Italic', 'Underline', 'Subscript', 'Superscript', 'TextColor', 'BGColor', 'Format']},
            {'name': 'align', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'HorizontalRule', 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'RemoveFormat']}
        ],
        */

        scayt_autoStartup: true,
        format_tags: 'p;h1;h2;h3;pre',
        extraPlugins: 'autogrow', //',sharedspace,format',
        removeDialogTabs: 'image:advanced;link:advanced',
        removePlugins: 'magicline,liststyle', // resize, elementspath, anchor
        resize_enabled: false,
        autoGrow_onStartup : true,
    autoGrow_minHeight : 30,
    //autoGrow_maxHeight: 175
    sharedSpaces: {
        top : 'cert_editor_ui_toolbar_inner_wrapper',
        bottom : 'bottomSpace'
    },
    removeButtons: 'Anchor',
    autoLanguage: false,
    language: 'en',
    defaultLanguage: 'en',

    allowedContent: 'a[!href, target](*); ul; ol; li; p; strong; sup; sub; s; u; strike; center; abbr; ins; h1; h2; h3; h4; h5; h6; b; em; i; small;br; img[!src, *](*)', //a[!href]; strong; em; b; i; li; ul; ol; p; sup; sub; s; u; span; del; strike; center; br; abbr; h1; h2; h3; h4; h5; h6; hr; ins; img { height, width } [ !src, alt ]; *[class]; *[style]; *[start]; *{*}',    
    sharedSpaces: null, // don't use shared spaces
}



RichtextWidget = React.createClass({
    /* Textarea Input Widget */

    mixins: [BaseWidgetMixin],

    componentDidMount: function () {
        
        CKEDITOR.plugins.addExternal( 'autogrow', '/static/ckeditor/plugins/autogrow/', 'plugin.js' );

        var textarea = $(this.getDOMNode());
        var textarea_id = $(this.getDOMNode()).attr('id');
        var editor = CKEDITOR.replace(textarea_id, ckops);
        
        if (editor) {
              editor.on('change', function () {
                var val = editor.getData();
                $(textarea).val(val);
              });
            }
    },

    render: function() {
        var id = this.state.field_id;
        var label = this.state.label;
        var classes = this.state.classes || "";
        var placeholder = this.state.placeholder || "";
        var val = this.state.val;

        return <textarea className={ 'form-control ' + classes } id={'id_' +  id } placeholder={ placeholder } value={ this.state.val } onChange={this.handleChange} onBlur={this.onBlur} onFocus={this.onFocus} ref="input" />;
    }
});

module.exports = RichtextWidget;