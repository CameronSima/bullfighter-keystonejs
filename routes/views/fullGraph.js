var keystone = require('keystone')
var _ = require('lodash')

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res)
	var locals = res.locals

	locals.section = 'graph'
	locals.data = {
		graphArr: [],
		fullWidth: true
	}

	view.on('init', function (next) {

		keystone.list('Trade').model
			.find()
			.where('state', 'published')
			.sort('soldDate')
			.populate('author')
			.exec(function (err, results) {
				var graphArr = _.map(results, function(trade) {
					var date = trade.content.soldDate.toLocaleDateString()
					var time = trade.content.soldDate.toLocaleTimeString().split(':')
					time = time[0] + ':' + time[1] + time[2].split(' ')[1]
					return [date + ' ' + time, trade.content.balance]
				})
				locals.data.graphData = graphArr

				next(err)
			})
	})
	view.render('fullGraph')
}