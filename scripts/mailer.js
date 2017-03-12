var nodemailer = require('nodemailer');
var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (post, User) {

	// create reusable transporter object using the default SMTP transport
	var transporter = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
	        user: 'thebullfightertrading@gmail.com',
	        pass: '098poilkj'
	    }
	});

	function send(post, emailAddress) {
		var postUrl = 'thebullfightertrading.com/blog/post/' + post.slug
		// setup email data with unicode symbols
		var mailOptions = {
	    from: '"the Bullfighter" <thebullfightertrading@gmail.com>', 
	    to: emailAddress, 
	    subject: post.email_subject_line || "Check out the Bullfighter's new blog post!", 
	    text: 'Hello world ?', // plain text body
	    html: '<b>' + post.title + '</b> ' +
	    			'<br></br>' +
	    			post.content.brief + '<br />' +
	    			'<a href="' + postUrl + '">Read More</a>'

		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
	    if (error) {
	        return console.log(error);
	    }
	    console.log('Message %s sent: %s', info.messageId, info.response);
		});
	}

	// For some reason ({ subscribed: true }) only returns one User instead
	// of all subscribers in production only, hence the following hack.
  var emails = [];
	User.find({},
		function(err, users) {
	    if (err) {
	        console.log(err)
	    }  
	    async.forEach(users, function(user, callback) {
        if (emails.indexOf(user.email) == -1 && user.subscribed == true) {
            emails.push(user.email)
            send(post, user.email)
            callback()                  
        }
	    })
		}
	)
}




