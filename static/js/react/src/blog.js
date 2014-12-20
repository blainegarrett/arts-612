/** @jsx React.DOM */
/*global React, moment */
/* jshint trailing:false, quotmark:false, newcap:false */


var post_data = {
    'title': 'Jules Verne is Rad As Hell',
    'content': 'Jive.. Some <b>uttjive</b> yo. toast<br />sfsdfsdf',
    'primary_image': 'https://scontent-b-ord.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/10612934_10105497726369220_7905413968404678817_n.jpg?oh=1b353059e93e6b0714f2247a397ec20d&oe=550870EF',
    'author': { 'firstname': 'Captain', 'lastname': 'Kangaroo'},
    'created_date': 'August 24, 2013 9:00 PM'
};


var BlogArticlePage = React.createClass({
    getInitialState: function(){
        document.title = post_data.title + ' | mplsart.com';

        return {
            'post_data': post_data
        };
    },

    render: function () {
        return <article>
            <h2><a href="singlepost.html">{ this.state.post_data.title }</a></h2>

            <div className="row">
                <div className="group1 col-md-12 well">
                    <span className="glyphicon glyphicon-pencil"></span> by { this.state.post_data.author.firstname} { this.state.post_data.author.lastname}
                    <br />                           
                      <span className="glyphicon glyphicon-time"></span> August 24, 2013 9:00 PM
                </div>

            </div>


            <img src={this.state.post_data.primary_image} className="img-responsive" />

            <br />

            <p className="lead" dangerouslySetInnerHTML={{__html: this.state.post_data.content}} />

            <hr />
        </article>
    }
});





mainApp.value('SocialTags', SocialTags);
mainApp.value('BlogArticlePage', BlogArticlePage);