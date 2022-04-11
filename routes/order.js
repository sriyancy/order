var express = require('express');
var router = express.Router();
var order = require('../public/javascripts/order_plugin');
const seneca = require('seneca')();
const entities = require('seneca-entity');
const mongo_store = require('seneca-mongo-store');
seneca
	.quiet()
	.use(entities)
	.use(mongo_store, { name: 'InstaGrocer', host: '127.0.0.1', port: 27017 })
	.use(order);
/* GET users listing. */

router.post('/', async (req, res, next) => {
	seneca.client({
		type: 'tcp',
		pin: 'role:order',
	});
	await seneca
		.act(
			{
				role: 'order',
				op: 'add',
				body: req.body,
			},
			(err, res) => {
				if (err) {
					console.log('err', err);
				} else {
					response = res.result.order_id;
				}
			}
		)
		.ready(function () {
			res.json({ order_id: response });
		});
});
router.get('/:order', async (req, res, next) => {
	seneca.client({
		type: 'tcp',
		pin: 'role:order',
	});
	console.log('query',req.params.order)
	await seneca
		.act(
			{
				role: 'order',
				op: 'get',
				body: req.params.order,
			},
			(err, res) => {
				if (err) {
					console.log('err', err);
				} else {
					response = res.result;
				}
			}
		)
		.ready(function () {
			res.json(response);
		});
});

module.exports = router;