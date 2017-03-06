var keystone = require('keystone');
var Feed = require('feed');
var async = require('async');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.data = {
		trades: []
	}

	view.on('init', function (next) {
		keystone.list('Trade').model.find({}, function(err, result) {
			console.log(err)
			console.log(result)

			next()

		})

		// q.exec(function(err, result) {
		// 	console.log(result)
		// 	console.log('khuhih')
		// 	locals.data.trades = result
		// 	next(err)
		// })
	})

	var feed = new Feed({
		title: 'the Bullfighter Trading RSS',
		description: 'BFT Trade history feed',
		author: 'thebullfightertrading.com'
	})
	console.log(locals.data.trades)
	async.each(locals.data.trades, function(trade, next) {
		console.log(trade)
		console.log('ok')
		feed.addItem({
			title: trade.title,
			id: trade._id,
			published: trade.publishedDate,
			notes: trade.content.notes
		})
		next()
	})

	// feed.addCategory('Stocks');
	// feed.render('atom-1.0');
	res.set('Content-Type', 'text/xml');
  res.send(feed.xml());
}