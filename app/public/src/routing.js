/* All things Routing Related */
var React = require('react');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;
var createBrowserHistory = require('history/lib/createBrowserHistory');

// Layout
var NavCardsContainer = require('./components/NavCardsContainer').NavCardsContainer;

// Actual Pages
var NewHomePage = require('./components/pages/NewHomePage');
var CalendarPage = require('./components/pages/CalendarPage');
var EventPage = require('./components/pages/EventPage');
var WrittenPages = require('./components/pages/Written');

var GalleryPages = require('./components/pages/GalleryPages');
var AboutPage = require('./components/pages/AboutPage');
var Error404Page = require('./components/pages/Error404Page');

// Setup Default History
var history = createBrowserHistory();
var App = require('./components/appshell').App;


function init_router (node) {
    React.render(<Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={NewHomePage}/>
          <Route path="about" component={AboutPage}/>
          <Route path="events/:slug" component={EventPage}/>

          <Route path="written" component={WrittenPages.PageShell}>
            <IndexRoute component={WrittenPages.WrittenPage}/>
            <Route path=":category_slug/:slug" component={WrittenPages.WrittenArticlePage} />
             <Route path=":category_slug" component={WrittenPages.WrittenCategoryPage} />
            <Route path=":year/:month/:slug" component={WrittenPages.WrittenArticlePage} />
          </Route>

          <Route path="*" component={Error404Page}/>
        </Route>
    </Router>, node);
}

module.exports = {
    init: init_router,
    history: history
}



/*


ReactRouter.createRoute('/events/{slug}/', function (params) {
    React.unmountComponentAtNode( target_e);
    React.render(<App><EventPage slug={params.slug} /></App>, target_e);
});

ReactRouter.createRoute('/calendar/', function () {
    React.unmountComponentAtNode( target_e);
    React.render(<App><CalendarPage/></App>, target_e);
});

ReactRouter.createRoute('/galleries/', function () {
    React.unmountComponentAtNode( target_e);
    React.render(<App><GalleryPages.GalleryIndexPage /></App>, target_e);
});

ReactRouter.createRoute('/galleries/{slug}/', function (params) {
    React.unmountComponentAtNode( target_e);
    React.render(<App><GalleryPages.GalleryViewPage slug={params.slug} /></App>, target_e);
});

ReactRouter.createRoute('/written/', function () {
    React.unmountComponentAtNode( target_e);
    React.render(<App><WrittenPage /></App>, target_e);
});


ReactRouter.createRoute('/written/{category_slug}/', function (params) {
    React.unmountComponentAtNode( target_e);
    React.render(<App><WrittenCategoryPage category_slug={params.category_slug} /></App>, target_e);
});


ReactRouter.createRoute('/written/{category_slug}/{slug}/', function (params) {
    React.unmountComponentAtNode( target_e);
    React.render(<App><WrittenArticlePage category_slug={params.category_slug} slug={params.slug} /></App>, target_e);
});





ReactRouter.createRoute('/written/{year}/{month}/{slug}/', function (params) {
    React.unmountComponentAtNode( target_e);
    React.render(<App><WrittenArticlePage year={params.year} month={params.month} slug={params.slug} /></App>, target_e);
});

ReactRouter.createRoute('*', function () {
    React.unmountComponentAtNode( target_e);
    React.render(<App><Error404Page /></App>, target_e);
});

ReactRouter.init();
*/