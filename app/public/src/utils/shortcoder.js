var React = require('react');
var PageLink = require('../linking').PageLink;

function process_native_url_or_null(url) {
    /*
    If a url is deemed to be "native" to this module, then it is reduced to a
        relative url, otherwise it returns none.

    TODO: Consider subdomains with different route sets
    */

    var native_domains = ['www.mplsart.com', 'mplsart.com'];
    var result = null;

    var domain;
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    if (native_domains.indexOf(domain)) {
        console.log('External Domain');
        return null;
    }

    var x = url.indexOf("://");
    console.log(x);


    return url;
}

var CoolLink = React.createClass({

    // Check link if it is internal, otherwise, just reaturn the node as normal

    render: function() {
        var native_url = process_native_url_or_null(this.props.href);


        // Is local, starts with leading slash or is on our domain


        console.log(this.props.href);

        return (<PageLink { ...this.props } to={this.props.href} title="cheese" />);
    }
});

var CoolThing = React.createClass({

    alertDerp: function() {
        alert('Hello: ' + this.props.derp);
        console.log(this.props)
    },

    render: function() {
        return <a className="btn" onClick={ this.alertDerp }>Goats</a>
    }
});

var availablePlugins = {
    CoolThing: CoolThing
}

function addPlugin(nodeName, handler) {
    console.log('adding handler for tag: ' + nodeName);
    availablePlugins[nodeName] = handler;
}

function parse(xmlString) {

  var parser = new DOMParser()
  var doc = parser.parseFromString(xmlString, "text/html");

  // Check for errors
  var root = doc.firstChild;

  console.log(doc);
  if (root.firstChild.nodeName == 'parsererror') {
        return <h2>ERROR</h2>
  }

  console.log(doc);
  jive = parseIntoReact(doc.firstChild, 'root');

  console.log(jive);
  return jive;
}

function parseIntoReact(node, key) {
    var nodeName = node.nodeName;

    console.log([node.nodeType, node.nodeName, node])
    if (node.nodeType == 3) {
        return node.data
    }
    console.log(node.nodeName)

    if (nodeName in availablePlugins) {
        nodeName = availablePlugins[nodeName];
    }


    var children = node.childNodes;

    var react_children = [];
    for (var i = 0; i < children.length; i++) {
        child = children[i];
        //console.log(child)
        react_children.push(parseIntoReact(child, i))
    }

    props = {}
    attrs = node.attributes;
    for (var i=0; i < attrs.length; i++) {
        attr = attrs[i];
        props[attr.name] = attr.value
    }


    // Creat props object from node.attributes Dom map

    console.log(react_children);

    return React.createElement(nodeName, props, react_children);
}


addPlugin('A', CoolLink);




module.exports = {
    parse: parse,
    addPlugin: addPlugin
}