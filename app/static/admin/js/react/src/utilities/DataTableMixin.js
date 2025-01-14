var React = require('react');

var TextColumn = function(args) {
    this.args = args

    this.get_col_name = function() {
        return this.args.name;
    }
};


var ActionButton = React.createClass({
    getInitialState: function(){
        return {
            obj: this.props.obj,
            title: this.props.title,
            url: this.props.url,
            icon: this.props.icon
        }
    },

    render: function() {
        var col = this.state.col;
        var obj = this.state.obj;

        var url = this.state.url;
        if (typeof(url) == 'function'){
            url = url(obj)
        }

        var button_icon = '';
        if (this.state.icon) {
            button_icon = <span className={'glyphicon glyphicon-' + this.state.icon }></span>;
        }

        return <a href={url} className="btn btn-default">{ button_icon}&nbsp;{ this.state.title }</a>;
    }
});


var ActionGroup = React.createClass({
    getInitialState: function() {
        return {button_defs: this.props.button_defs}
    },

    render: function() {
        var buttons = this.state.button_defs.map(function (button, i ) {
            return <ActionButton key={'action_grp_button_' + i}title={button.title} url={button.url} icon={button.icon} />
        });
        return <div className="btn-group btn-group" role="group" aria-label="...">{buttons}</div>
    }


});

var ActionColumn = React.createClass({
    getInitialState: function(){
        return {
            col: this.props.col,
            obj: this.props.obj,
            button_defs: this.props.button_defs
        }
    },

    render: function() {
        var col = this.state.col;
        var obj = this.state.obj;

        var buttons = this.state.button_defs.map(function (button, i) {
            return <ActionButton key={'action_col_button_' + i} obj={obj} title={button.title} url={button.url} icon={button.icon} />
        });

        return <div className="btn-group btn-group-xs" role="group" aria-label="...">{buttons}</div>
    }

});

var SimpleColumn = React.createClass({
    getInitialState: function(){
        return {col: this.props.col, obj: this.props.obj}
    },

    render: function() {
        var col = this.state.col;
        var obj = this.state.obj;
        return <span>{ obj[col].toString() }</span>;
    }
});

var DataList = React.createClass({
    shouldComponentUpdate : function () {
        return true
    },
        render : function() {
            var rowNodes;

            var columns = this.props.columns
            var grid = this.props.grid;

            if (this.props.data.results != undefined) {
                rowNodes = this.props.data.results.map(function (obj, i) {
                    var columnNodes = columns.map(function (col, j) {
                        var _widget = SimpleColumn;
                        var props = {col: col, obj: obj}

                        if (grid.state.column_widgets && grid.state.column_widgets[col]) {
                            _widget = grid.state.column_widgets[col];
                        }

                        var widget = React.createElement(_widget, props);

                        if (col == 'actions') {
                            props['button_defs'] = grid.state.inline_actions
                            widget = React.createElement(ActionColumn, props)
                        }
                        return <td key={'cell-' + i + '-' + j}>{ widget }</td>;
                    });
                    return (<tr key={ 'row_' + i } >{ columnNodes }</tr>);
                });
            }

            return  <tbody>{ rowNodes }</tbody>;
        }
});


var DataTableMixin = {
    shouldComponentUpdate : function () {
        return true
    },
    load_next_page : function(e) {
        e.preventDefault();

        //this.setState({data:[]}); // This forces the table to render empty...


        var url = this.prep_resource_url();

        this.setState({data:[]}); // This forces the table to render empty...
        $.ajax({
            url: url,
            dataType: 'json',
            success:  function(data) {
                this.setState({data:data});
                this.refs.data_list.forceUpdate();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)

        });

    },
    prep_resource_url: function() {
        // Super basic pagination that isn't leveraged via every api...
        var url = this.state.resource_url;
        if (this.paginate) {
            url = url + '?limit=25';
            if (this.state.data.cursor) {
                url += '&cursor=' + this.state.data.cursor;
            }
        }

        return url;
    },

    filter_by_name : function(e) {

        var term = e.target.value;

        this.setState({data:[]}); // This forces the table to render empty...

        $.ajax({
            url: this.state.resource_url + '?q=' + term,
            dataType: 'json',
            success:  function(data) {
                this.setState({data:data});

            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)

        });

    },
    componentDidMount: function () {
        $.ajax({
            url: this.prep_resource_url(),
            dataType: 'json',
            success:  function(data) {
                this.setState({data:data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.state.resource_url, status, err.toString());
            }.bind(this)

        });
    },

    render_templatexxx: function() {

        var columnNodes = this.state.columns.map(function (col, i) {
            return <th key={ 'cell_' + i }>{ col }</th>
        });

        return <div>
            <div className="clearfix">
                <div className="pull-right">

                <form className="form-inline" role="form">
                    <div className="form-group">
                        <div className="input-group">
                              <label className="sr-only" htmlFor="exampleInputEmail2">Email address</label>
                              <input type="text" className="form-control" id="exampleInputEmail2" placeholder="Filter by Name" onChange={this.filter_by_name} />
                              </div>

                  </div>

                 </form>
                </div>

                <div className="pull-left">
                    <ActionGroup button_defs={this.state.global_actions  }/>
                </div>


            </div>

            <table className="table table-hover table-striped table-compressed">
                <thead>
                    <tr>
                    { columnNodes }
                    </tr>
                </thead>
                <DataList data={this.state.data} columns={ this.state.columns } grid={ this } ref="data_list" />
            </table>

            { (this.state.data && this.state.data.more && <div> <a href="#" onClick={this.load_next_page}>more...</a></div>) }
        </div>;
    }
};

module.exports = DataTableMixin;