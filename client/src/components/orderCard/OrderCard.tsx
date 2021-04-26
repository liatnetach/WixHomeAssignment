import React, { useState, useEffect, useRef } from 'react';
import { createApiClient, Item, ItemsInOrder } from '../../api';
import DisplayProduct from '../displayProduct/DisplayProduct'

const OrderCard = (props: any) => {
  const { changeStatus, order, getAssetByStatus } = props;
  const [isItemExpanded, setItemExpanded] = useState(false);
  const api = createApiClient();
  const itemsList = useRef<Item[]>([]);

  async function getItemFromServer(itemId: string) {
    const item: Item = await api.getItem(itemId);
    itemsList.current = itemsList.current.concat(item);
  }
  //we create the items list for each order once when the component mount - 
  //the assumption is that the items list can't change once the order is complete
  useEffect(() => {
    const itemIds = order.items.map((item: ItemsInOrder) => { return item.id });
    itemIds.map((itemId: string) => {
      getItemFromServer(itemId);
    });
  }, [])

  return (<div className={`singleCard`}>
    <div className={'generalData'} >
      <h6>{order.id}</h6>
      <h4>{order.customer.name}</h4>
      <h5>Order Placed: {new Date(order.createdDate).toLocaleDateString()}</h5>
      <button id={`btn`} onClick={() => setItemExpanded(!isItemExpanded)}>{isItemExpanded ? "Show Me Less Data" : "Show Me More Data"}</button>
    </div>
    <div className={'fulfillmentData'}>
      <h4>{order.itemQuantity} Items</h4>
      <img alt={`Error Occurred`} src={getAssetByStatus(order.fulfillmentStatus)} />
      {order.fulfillmentStatus !== 'canceled' &&
        <button id={`btn`} onClick={() => changeStatus(order.id)}>Mark as {order.fulfillmentStatus === 'fulfilled' ? 'Not Delivered' : 'Delivered'}</button>
      }
    </div>
    <div className={'paymentData'}>
      <h4>{order.price.formattedTotalPrice}</h4>
      <img alt={`Error Occurred`} src={getAssetByStatus(order.billingInfo.status)} />
    </div>
    {isItemExpanded ? <div className={`itemsDetailed`}>
      <h5>Exact Time Of The Order: {new Date(order.createdDate).toLocaleTimeString()}</h5>
      {itemsList.current.length > 0 ? <div id={`items-In`}>
        {itemsList.current.map((product: Item) => (
          <DisplayProduct key={`product${product.id}`} order={order} product={product} />
        )
        )}</div> : <div>Loading Items</div>}
    </div> : null}
  </div>)

};
export default OrderCard;