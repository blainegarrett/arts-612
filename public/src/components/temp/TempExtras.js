var React = require('react');

var TempExtras = React.createClass({
    render: function () {
        return <div>

<div id="panel-signup">
	<div className="panel-header">PRE-LAUNCH ACCESS</div>
	<div className="panel-content">
		<p>Enter your email address for exclusive access to the Beta calendar during its development.</p>
		<form id="email-form" role="form" action="/beta/email/" method="GET">
			<div className="input-group input-group-lg">
				<input type="text" className="form-control" id="id_email" name="email" placeholder="Your email address" />

				<span className="input-group-btn">
					<button className="btn btn-default" type="submit">Go</button>
				</span>

			</div>
		</form>

	</div>
</div>


<div id="panel-contact">
	<div className="panel-content"><a href="mailto:calendar@mplsart.com"><b>Contact us</b></a> with questions and to submit event listings.</div>
</div>



<div id="panel-social">
	<div className="panel-content">
		<a href="https://www.facebook.com/mplsart" id="fb-link" target="_new">
			<span className="fa-stack fa-lg">
				<i className="fa fa-square-o fa-stack-2x"></i>
				<i className="fa fa-facebook fa-stack-1x"></i>
			</span>
		</a>

		<a href="https://twitter.com/mplsart" id="twitter-link" target="_new">  
			<span className="fa-stack fa-lg">
				<i className="fa fa-square-o fa-stack-2x"></i>
				<i className="fa fa-twitter fa-stack-1x"></i>
			</span>
		</a>
		&nbsp;&nbsp;Stay Connected to mplsart during the rebuild.
	</div>
</div>

</div>

    }
});

module.exports = TempExtras