import axios from 'axios';

export type Customer = {
	name: string;
}

export type BillingInfo = {
	status: string;
}

export type Price = {
	formattedTotalPrice: string;
}

export type Order = {
	id: number;
	createdDate: string;
	fulfillmentStatus: string;
	billingInfo: BillingInfo;
	customer: Customer;
	itemQuantity: number;
	price: Price;
	items: ItemsInOrder[];
}
export type ItemsInOrder = {
	id: string;
	quantity: number;
}
export type OrderAndPages = {
	orders: Order[];
	pageNeeded: number;
	notFulfillmentcounter: number;
}
export type Item = {
	id: string;
	name: string;
	price: number;
	image: string;
}

export type ApiClient = {
	getFilteredOrders: (value: string, page: number, fulStatus: string, payStatus: string, sortKey: number) => Promise<OrderAndPages>;
	getItem: (itemId: string) => Promise<Item>;
	setFulfillmentStatus: (orderId: number, fulfillmentStatus: string) => Promise<number>;
}

export const createApiClient = (): ApiClient => {
	return {
		getFilteredOrders: (value: string, page: number = 1, fulStatus: string = "All", payStatus: string = "All", sortKey: number = 0) => {
			if (value === '') value = 'emptyString-1';
			console.log("in api: ", value, page, fulStatus, payStatus);
			return axios.get(`http://localhost:3232/api/orders/filter/${value}/${page}/${fulStatus}/${payStatus}/${sortKey}`).then((res) => res.data).catch((error) => {
				if (error.response) {
					console.log("Error in getFilteredOrders: ",error.response.data); // => the response payload 
				};
			});
		},
		getItem: (itemId: string) => {
			return axios.get(`http://localhost:3232/api/items/${itemId}`).then((res) => res.data).catch((error) => {
				if (error.response) {
					console.log("Error in getItem: ",error.response.data); // => the response payload 
				};
			});
		},
		setFulfillmentStatus: (orderId: number, fulfillmentStatus: string) => {
			return axios.post(`http://localhost:3232/api/orders/set-fulfillment-status`, { orderId, fulfillmentStatus }).then((res) => res.data).catch((error) => {
				if (error.response) {
					console.log("Error in setFulfillmentStatus: ",error.response.data); // => the response payload 
				};
			});	
		}	
	}
};



