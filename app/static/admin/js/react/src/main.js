var React = require('react');
var ReactRouter = require('flux-react-router');


var AdminHomePage = require('./pages/AdminHomePage');
var Error404Page = require('./pages/Error404Page');

var VenuesMainPage = require('./pages/VenuesMainPage');
var VenuesCreatePage = require('./pages/VenuesCreatePage');
var VenuesEditPage = require('./pages/VenuesEditPage');

var BlogMainPage = require('./pages/BlogMainPage');
var BlogPostCreatePage = require('./pages/BlogPostCreatePage');
var BlogPostEditPage = require('./pages/BlogPostEditPage');

var UsersMainPage = require('./pages/UsersMainPage');
var UserCreatePage = require('./pages/UserCreatePage');
var UserEditPage = require('./pages/UserEditPage');


var PostCategoriesEditPage = require('./pages/PostCategoriesEditPage');
var PostCategoriesCreatePage = require('./pages/PostCategoriesCreatePage');
var PostCategoriesMainPage = require('./pages/PostCategoriesMainPage');


var EventsMainPage = require('./pages/EventsMainPage');
var EventsCreatePage = require('./pages/EventsCreatePage');
var EventsEditPage = require('./pages/EventsEditPage');
var EventsSearchDebugger = require('./pages/EventsSearchDebugger')


var FilesMainPage = require('./pages/FilesMainPage');
var FilesEditPage = require('./pages/FilesEditPage');
var FilesViewPage = require('./pages/FilesViewPage');

var SettingsPage = require('./pages/SettingsPage');


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


// Blog
ReactRouter.createRoute('/admin/blog', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<BlogMainPage />, document.getElementById('main_content'));
});

ReactRouter.createRoute('/admin/blog/create', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<BlogPostCreatePage  />, document.getElementById('main_content'));
});


ReactRouter.createRoute('/admin/blog/{keystr}/edit', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<BlogPostEditPage keystr={params.keystr} />, document.getElementById('main_content'));
});

// Users
ReactRouter.createRoute('/admin/users', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<UsersMainPage />, document.getElementById('main_content'));
});


ReactRouter.createRoute('/admin/users/create', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<UserCreatePage  />, document.getElementById('main_content'));
});

ReactRouter.createRoute('/admin/users/{keystr}/edit', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<UserEditPage keystr={params.keystr} />, document.getElementById('main_content'));
});


// Post Categories
ReactRouter.createRoute('/admin/post_categories', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<PostCategoriesMainPage />, document.getElementById('main_content'));
});


ReactRouter.createRoute('/admin/post_categories/create', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<PostCategoriesCreatePage  />, document.getElementById('main_content'));
});

ReactRouter.createRoute('/admin/post_categories/{keystr}/edit', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<PostCategoriesEditPage keystr={params.keystr} />, document.getElementById('main_content'));
});


// Files
ReactRouter.createRoute('/admin/files', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<FilesMainPage />, document.getElementById('main_content'));
});

ReactRouter.createRoute('/admin/files/{keystr}/edit', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<FilesEditPage keystr={params.keystr} />, document.getElementById('main_content'));
});

ReactRouter.createRoute('/admin/files/{keystr}', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<FilesViewPage keystr={params.keystr} />, document.getElementById('main_content'));
});



// Events
ReactRouter.createRoute('/admin/events', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<EventsMainPage />, document.getElementById('main_content'));
});


ReactRouter.createRoute('/admin/events/debugger', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<EventsSearchDebugger keystr={params.keystr} />, document.getElementById('main_content'));
});


ReactRouter.createRoute('/admin/events/create', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<EventsCreatePage  />, document.getElementById('main_content'));
});
ReactRouter.createRoute('/admin/events/{keystr}/edit', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<EventsEditPage keystr={params.keystr} />, document.getElementById('main_content'));
});


// Settings
ReactRouter.createRoute('/admin/settings', function (params) {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<SettingsPage />, document.getElementById('main_content'));
});



ReactRouter.createRoute('*', function () {
    React.unmountComponentAtNode( document.getElementById('main_content'));
    React.render(<Error404Page />, document.getElementById('main_content'));
});
ReactRouter.init();
