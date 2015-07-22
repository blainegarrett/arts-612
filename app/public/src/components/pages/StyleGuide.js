/* Pages For StyleGuides and Design Documentation */

var React = require('react');
var PageMixin = require('./PageMixin');

var IndexPage = React.createClass({
    mixins: [PageMixin],
    default_meta: {
        'title': 'Written',
        'description': 'Writing and Crtique'
    },

    pageDidMount: function () {
        // Set Default Page Meta
        this.setMeta();

    },

    render: function() {
        return (<h2>Boom</h2>)
    }
});



var FormsPage = React.createClass({
    render : function () {
        return (
        <div>
            <h2>Form Styles</h2>


            <form role="form" className="form-horizontal" action="#">
                <div className="form-group" id="form-group-name">
                    <label for="id_name" className="col-sm-2 control-label">name</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control " id="id_name" placeholder="Enter Event Name" />
                    </div>
                </div>


            </form>




        </div>
        )
    }
});




module.exports = {
    Index: IndexPage,
    Forms: FormsPage
};
