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

          <Route path="galleries/:slug" component={GalleryPages.GalleryViewPage}/>
          <Route path="galleries" component={GalleryPages.GalleryIndexPage}/>


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
};