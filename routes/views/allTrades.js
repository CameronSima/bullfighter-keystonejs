var keystone = require('keystone')
var _ = require('lodash')
var Trade = keystone.list('Trade')
var User = keystone.list('User')


exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res)
	var locals = res.locals

	locals.section = 'trades'
	locals.filters = {
		direction: req.params.direction,
		sortParam: req.params.sortParam
	}
	locals.data = {
		trades: [],
		graphArr: []
	}

	// get graph data
	view.on('init', function (next) {

		keystone.list('Trade').model
			.find()
			.where('state', 'published')
			.sort('soldDate')
			.populate('author')
			.exec(function (err, results) {
				var graphArr = _.map(results, function(trade) {
					var date = trade.content.soldDate.toLocaleDateString()
					return [date, trade.content.balance]
				})
				locals.data.graphArr = graphArr

				next(err)
			})
	})

	view.on('init', function(next) {

		var direction, sortParam
		if (locals.filters.direction && locals.filters.sortParam) {
			if (locals.filters.direction === 'desc') {
				direction = '-'
			} else {
				direction = ''
			}
			sortParam = direction + 'content.' + locals.filters.sortParam
		} else {
			sortParam = '-publishedDate'
		}

		var q = keystone.list('Trade').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
			filters: {
				state: 'published',
			},
		})
			.sort(sortParam)
			.populate('author')
			
			q.exec(function(err, results) {

				// // re-sort results on soldDate for proper display in graph
				// var trades = results.results.slice(0)
				// trades.sort(function(a, b) {
				// 	return a.content.soldDate.getTime() - b.content.soldDate.getTime()
				// })

				// // get graph data array
				// var graphArr =_.map(trades, function(trade) {
				// var date = trade.content.soldDate.toLocaleDateString()
				// 	var time = trade.content.soldDate.toLocaleTimeString().split(':')
				// 	time = time[0] + ':' + time[1] + time[2].split(' ')[1]
				// 	return [date + ' ' + time, trade.content.balance]
				// })
				// locals.data.graphData = graphArr
				locals.data.trades = results
				next(err)
			})
	})
	view.render('allTrades')

}