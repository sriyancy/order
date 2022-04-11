const moment = require('moment');
function order(options) {
	this.add({ role: 'order', op: 'add' }, (args, reply) => {
		const item = this.make('order');
		const orderid = Math.floor(Math.random() * 100);
        item.orderId = orderid;
        item.deliveryStatus = "InProgress";
        item.orderDate = (new Date()).toGMTString();
        newItems=[...args.body.items]
        newItem = {
            orderId:item.orderId,
            user:args.body.user,
            amount:args.body.amount,
            items:newItems,
            orderDate:item.orderDate,
            deliveryStatus:item.deliveryStatus
		}
		item.save$(newItem, (err, item) => {
			if (err) return console.log(err);
			reply(null, {
			result: { order_id: item.orderId },
			});
		});
	});
	this.add({ role: 'order', op: 'get' }, (args, reply) => {
		const item = this.make('order');
		item.list$({ orderId: parseInt(args.body) }, (err, item) => {
			if (err) return console.log(err);
			res={...item}
			newRes={
				orderId:res[0].orderId,
				user:res[0].user,
				amount:res[0].amount,
				items:[...res[0].items],
				orderDate:res[0].orderDate,
				deliveryStatus:res[0].deliveryStatus

			}
			reply(null, { result: newRes });
		});
	});
}

module.exports = order;