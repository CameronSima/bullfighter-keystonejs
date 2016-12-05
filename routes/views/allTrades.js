var keystone = require('keystone')
var _ = require('lodash')
var async = require('async')
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
		graphArr: [],
		dateGroups: []
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

	// get trade results. 
	// view.on('init', function(next) {
	// 	console.log(locals.data.dateGroups[0].monthYear)
	// 	var direction, sortParam
	// 	if (locals.filters.direction && locals.filters.sortParam) {
	// 		if (locals.filters.direction === 'desc') {
	// 			direction = '-'
	// 		} else {
	// 			direction = ''
	// 		}
	// 		sortParam = direction + 'content.' + locals.filters.sortParam
	// 	} else {
	// 		sortParam = '-publishedDate'
	// 	}
	// 	console.log(locals.data.dateGroups)
	// 	var q = keystone.list('Trade').model.find({

	// 		dateGroup: locals.data.dateGroups[req.query.page || 0]._id
	// 	})
	// 		.sort(sortParam)
	// 		.populate('author')
			
	// 		q.exec(function(err, results) {
	// 			locals.data.trades.results = results
	// 			next(err)
	// 		})
	// })
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
			perPage: 50,
			maxPages: 10,
			filters: {
				state: 'published',
			},
		})
			.sort(sortParam)
			.populate('author')
			
			q.exec(function(err, results) {
				locals.data.trades = results
				next(err)
			})
	})
	view.render('allTrades')

}