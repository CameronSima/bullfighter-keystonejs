// var keystone = require('keystone');
// var Feed = require('feed');

// exports.module.exports = function(req, res) {

// 	var view = new keystone.View(req, res);
// 	var locals = res.locals;

// 	locals.data = {
// 		trades: []
// 	}

// 	view.on('init', function (next) {
// 		var q = keystone.list('Trade').model.findOne({
// 			state: 'published'
// 		}).populate('author')

// 		q.exec(function(err, result) {
// 			locals.data.trades = result
// 		})
// 	})

// 	var feed = new Feed({
// 		title: 'the Bullfighter Trading RSS',
// 	})
// }