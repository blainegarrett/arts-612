/* Pages For StyleGuides and Design Documentation */

var React = require('react');
var PageMixin = require('./PageMixin');


var mui = require('material-ui')
var RaisedButton = mui.RaisedButton;
var ThemeManager = new mui.Styles.ThemeManager();
var Dialog = mui.Dialog;
var Paper = mui.Paper;
var TimePicker = mui.TimePicker;
var FloatingActionButton = mui.FloatingActionButton;
var ToggleStar = mui.ToggleStar;
var List = mui.List;
var ListItem = mui.ListItem;
var ContentInbox = mui.ContentInbox;
var ActionGrade = mui.ActionGrade;
var ContentSend = mui.ContentSend;
var ContentDrafts = mui.ContentDrafts;
var ContentInbox = mui.ContentInbox;


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


var standardActions = [
      { text: 'Okay' }
    ];


var FormsPage = React.createClass({

childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },


_handleTouchTap() {
    this.refs.superSecretPasswordDialog.show();
  },


    render : function () {

    var containerStyle = {
      textAlign: 'center',
      paddingTop: '200px'
    };

        return (<div style={containerStyle}>

<FloatingActionButton iconClassName="muidocs-icon-action-grade" mini={true} />



<List>
    <ListItem primaryText="Inbox"  />
</List>

<TimePicker
  format="ampm"
  hintText="12hr Format" />

<Paper zDepth={1}>
  <p>zDepth=1</p>
</Paper>
<Paper zDepth={2}>
  <p>zDepth=2</p>
</Paper>
<Paper zDepth={3}>
  <p>zDepth=3</p>
</Paper>
<Paper zDepth={4}>
  <p>zDepth=4</p>
</Paper>
<Paper zDepth={5}>
  <p>zDepth=5</p>
</Paper>
//Sharp Corners
<Paper zDepth={1} rounded={false}>
  <p>rounded=false</p>
</Paper>
<Paper zDepth={2} rounded={false}>
  <p>rounded=false</p>
</Paper>
<Paper zDepth={3} rounded={false}>
  <p>rounded=false</p>
</Paper>
<Paper zDepth={4} rounded={false}>
  <p>rounded=false</p>
</Paper>
<Paper zDepth={5} rounded={false}>
  <p>rounded=false</p>
</Paper>
//Circular
<Paper zDepth={1} circle={true}>
  <p>circle=true</p>
</Paper>
<Paper zDepth={2} circle={true}>
  <p>circle=true</p>
</Paper>
<Paper zDepth={3} circle={true}>
  <p>circle=true</p>
</Paper>
<Paper zDepth={4} circle={true}>
  <p>circle=true</p>
</Paper>
<Paper zDepth={5} circle={true}>
  <p>circle=true</p>
</Paper>

        <Dialog
          title="Super Secret Password"
          actions={standardActions}
          ref="superSecretPasswordDialog">
          1-2-3-4-5
        </Dialog>

        <h1>material-ui</h1>
        <h2>example project</h2>

        <RaisedButton label="Super Secret Password" primary={true} onTouchTap={this._handleTouchTap} />

      </div>);


        return (
        <div>
            <h2>Form Styles</h2>

<Dialog
          title="Super Secret Password"
          actions={standardActions}
          ref="superSecretPasswordDialog">
          1-2-3-4-5
        </Dialog>

            <RaisedButton label="Default" />

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
