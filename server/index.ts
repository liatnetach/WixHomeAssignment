import express from 'express';
import bodyParser = require('body-parser');

const fs = require('fs');
const { products } = require('./products.json');
const app = express();
const allOrders: any[] = require('./orders.json');

const PORT = 3232;
const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	next();
});

const notFulfilledCounter = () => {
	let notFulfillmentcounter: number = 0;
	allOrders.forEach((order) => {
		if (order.fulfillmentStatus === "not-fulfilled")
			notFulfillmentcounter++;
	}); return notFulfillmentcounter;
};

const filterOrdersArray = (value: string) => allOrders.filter((order) => {
	const itemsFiltered: boolean[] = order.items.map((cell: { id: any; }) => {
		return products[cell.id].name.toLowerCase().includes(value.toLowerCase());
	});
	if (((order.customer.name.toLowerCase() + order.id).includes(value.toLowerCase())) || (itemsFiltered.includes(true)))
		return order;
});

const sortedOrders = (sortingKey: number, orders: any[]) => {
	//first we will understand what kind of sort we need to do: 11/1-by price, 12/2-by date, 13/3- by items quantity, 14/4-customer name
	//after that we will check what is the required direction and sort the orders
	if (sortingKey % 10 === 1) {
		if (sortingKey > 10)
			orders.sort((a: any, b: any) => { return a.price.total > b.price.total ? 1 : -1; });
		else
			orders.sort((a: any, b: any) => { return a.price.total < b.price.total ? 1 : -1; });
	}
	else if (sortingKey % 10 === 2) {
		if (sortingKey > 10) {
			orders.sort((a: any, b: any) => {
				let valA = new Date(a.createdDate);
				let valB = new Date(b.createdDate);
				return valA > valB ? 1 : -1;
			});
		}
		else {
			orders.sort((a: any, b: any) => {
				let valA = new Date(a.createdDate);
				let valB = new Date(b.createdDate);
				return valA < valB ? 1 : -1;
			});
		}

	}
	else if (sortingKey % 10 === 3) {
		if (sortingKey > 10)
			orders.sort((a: any, b: any) => { return a.itemQuantity > b.itemQuantity ? 1 : -1; });
		else
			orders.sort((a: any, b: any) => { return a.itemQuantity < b.itemQuantity ? 1 : -1; });
	}
	else if (sortingKey % 10 === 4) {
		if (sortingKey > 10)
			orders.sort((a: any, b: any) => { return a.customer.name > b.customer.name ? 1 : -1; });
		else
			orders.sort((a: any, b: any) => { return a.customer.name < b.customer.name ? 1 : -1; });
	}
	return orders;
}

//This is the main request, in order to keep all the demands from the user as should (filter&serch&sort so it all works together)
app.get('/api/orders/filter/:value/:page/:fulStatus/:payStatus/:sortKey', (req, res) => {
	const fulStatus: string = <string>req.params.fulStatus;//fulfillment status filter
	const payStatus: string = <string>req.params.payStatus;//payment status filter
	const value: string = <string>req.params.value;//search key value
	const page_1: string = <string>req.params.page;//page-as string
	const page: number = parseInt(page_1);//page after parsing
	const sortKey: string = <string>req.params.sortKey;//sortKey-as string
	const sortKey_1: number = parseInt(sortKey);//sortKey after parsing
	console.log("filters: ", fulStatus,payStatus, " sortingKey: ",sortKey_1);

	let filteredOrders: any[] = (value === 'emptyString-1') ? allOrders : filterOrdersArray(value);
	if (fulStatus !== "All") {//if fulfillment status filter exist-filter the results
		filteredOrders = filteredOrders.filter((order) => {
			if (order.fulfillmentStatus === fulStatus) return order;
		})
	}
	if (payStatus !== "All") {//if payment status filter exist-filter the results
		filteredOrders = filteredOrders.filter((order) => {
			if (order.billingInfo.status === payStatus) return order;
		})
	}
	if (sortKey_1 !== 0) filteredOrders = sortedOrders(sortKey_1, filteredOrders);
	const pagesNeeded = <number>Math.ceil(filteredOrders.length / PAGE_SIZE);
	const orders: any[] = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	const counter = notFulfilledCounter();
	// console.log("orders: ", orders);
	res.send({
		orders: orders,
		pageNeeded: pagesNeeded,
		notFulfillmentcounter: counter
	});
});

app.get('/api/items/:itemId', (req, res) => {
	const itemId = <string>(req.params.itemId);
	const size = <string>(req.query.size || 'small');
	const product = products[itemId];
	res.send({
		id: itemId,
		name: product.name,
		price: product.price,
		image: product.images[size]
	});
});

app.post('/api/orders/set-fulfillment-status', (req, res, next) => {
	const orderid = <string>(req.body.orderId);
	const orderId = parseInt(orderid);
	console.log('order id= ', req.body.orderId, "status to update= ", req.body.fulfillmentStatus);
	const jsonString: any = fs.readFileSync('orders.json');
	let ordersContent = JSON.parse(jsonString);
	const findIdxOfId = ordersContent.map((cell: { id: number; }) => { return cell.id; }).indexOf(orderId);
	ordersContent[findIdxOfId].fulfillmentStatus = req.body.fulfillmentStatus;
	fs.writeFileSync('orders.json', JSON.stringify(ordersContent, null, 2));
	const counter = notFulfilledCounter();
	res.sendStatus(counter);
});


app.listen(PORT);
console.log('Listening on port', PORT);
