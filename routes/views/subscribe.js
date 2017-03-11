var keystone = require('keystone');
var User = keystone.list('User').model;

exports = module.exports = function (req, res) {
	
	function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

	function validateUser(email) {
		User.findOne({
			email: email
		}, function(err, result) {
			if (result === null) {
				return true
			}
		})
	}

	if (validateEmail(req.body.email) && validateUser(req.body.email)) {
		var user = new User({
			name: '',
			email: req.body.email,
			password: '',
			isAdmin: false,
			subscribed: true
		})

		user.password = user._id
		user.name.first = 'subscriber_' + user._id,
		user.name.last = ''

		user.save(function(err) {
			if (err) {
				console.log(err)
			}
		})
	}

	var backUrl = req.header('Referer') || '/blog/trading'
	res.redirect(backUrl)

};