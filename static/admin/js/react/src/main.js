var React = require('react');
var ReactRouter = require('flux-react-router');


var AdminHomePage = require('./pages/AdminHomePage');
var Error404Page = require('./pages/Error404Page');

var VenuesMainPage = require('./pages/VenuesMainPage');
var VenuesCreatePage = require('./pages/VenuesCreatePage');
var VenuesEditPage = require('./pages/VenuesEditPage');

var EventsMainPage = require('./pages/EventsMainPage');
var EventsCreatePage = require('./pages/EventsCreatePage');
var EventsEditPage = require('./pages/EventsEditPage');

ReactRouter.createRoute('/admin', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<AdminHomePage />, document.getElementById('main_content'));    
});


// Venues
ReactRouter.createRoute('/admin/venues', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<VenuesMainPage />, document.getElementById('main_content'));    
});

ReactRouter.createRoute('/admin/venues/create', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<VenuesCreatePage  />, document.getElementById('main_content'));    
});
ReactRouter.createRoute('/admin/venues/{keystr}/edit', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<VenuesEditPage keystr={params.keystr} />, document.getElementById('main_content'));    
});


// Events
ReactRouter.createRoute('/admin/events', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<EventsMainPage />, document.getElementById('main_content'));    
});
ReactRouter.createRoute('/admin/events/create', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<EventsCreatePage  />, document.getElementById('main_content'));    
});
ReactRouter.createRoute('/admin/events/{keystr}/edit', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<EventsEditPage keystr={params.keystr} />, document.getElementById('main_content'));    
});




ReactRouter.createRoute('*', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<Error404Page />, document.getElementById('main_content'));    
});
ReactRouter.init();
