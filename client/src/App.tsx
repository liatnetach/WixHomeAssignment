import React from 'react';
import './App.scss';
import { createApiClient, Order } from './api';
import OrderCard from './components/orderCard/OrderCard';
import { Pagination } from './components/pagination/Pagination';
import Filter from './components/filter/Filter';
import Sort from './components/sort/Sort';


export type AppState = {
  orders?: Order[],
  search: string,
  fulfilledStatus: string,
  paymentStatus: string,
  page: number,
  notFulfillmentcounter: number,
  sortingKey: number;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

  state: AppState = {
    search: '',
    fulfilledStatus: "All",
    paymentStatus: "All",
    page: 1,
    notFulfillmentcounter: 0,
    sortingKey: 0
  };
  totalPages: number = 15;//default
  searchDebounce: any = null;

  async componentDidMount() {
    const result = await api.getFilteredOrders(this.state.search, this.state.page, this.state.fulfilledStatus, this.state.paymentStatus, this.state.sortingKey);
    this.totalPages = result.pageNeeded;
    this.setState({
      notFulfillmentcounter: result.notFulfillmentcounter,
      orders: result.orders
    });
  }
  //calling the post request setFulfillmentStatus
  setStatus = async (id: number, status: string) => {
    await api.setFulfillmentStatus(id, status);
  };

  onSearch = async (value: string, newPage?: number) => {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(async () => {
      const result = await api.getFilteredOrders(value, this.state.page, this.state.fulfilledStatus, this.state.paymentStatus, this.state.sortingKey);
      this.totalPages = result.pageNeeded;
      this.setState({
        notFulfillmentcounter: result.notFulfillmentcounter,
        search: value,
        orders: (result).orders
      });
    }, 300);
  };

  filtersApplied = async (fulfillmentVal: string, paymentVal: string) => {
    const result = await api.getFilteredOrders(this.state.search, this.state.page, fulfillmentVal, paymentVal, this.state.sortingKey);
    this.totalPages = result.pageNeeded;
    this.setState({
      notFulfillmentcounter: result.notFulfillmentcounter,
      orders: result.orders,
      fulfilledStatus: fulfillmentVal,
      paymentStatus: paymentVal
    });
  }
  //handlePages manage the button clicks on the pagination bar
  handlePages = async (updatePage: number) => {
    const result = await api.getFilteredOrders(this.state.search, updatePage, this.state.fulfilledStatus, this.state.paymentStatus, this.state.sortingKey);
    this.setState({
      page: updatePage,
      orders: (result).orders
    });
  };
  
  handleSort = async (sortOrdersBy: number) => {
    const result = await api.getFilteredOrders(this.state.search, this.state.page, this.state.fulfilledStatus, this.state.paymentStatus, sortOrdersBy);
    this.setState({
      sortingKey: sortOrdersBy,
      orders: (result).orders
    });
  };

  render() {
    const { orders } = this.state;
    return (
      <main>
        <h1>Orders</h1>
        <header>
          <input type="search" placeholder="Search" onChange={(e) => this.onSearch(e.target.value)} />
          <br></br>
          <Sort handleSort={this.handleSort} />
          <br></br>
          <Filter filtersApplied={this.filtersApplied}/>
        </header>
        <div className="notFulfilled">Currenly there are {this.state.notFulfillmentcounter} Not-Delivered Orders (Excluding the canceled)</div>
        {orders ? <div className='results'>Showing {orders.length} results</div> : null}
        {orders ? this.renderOrders(orders) : <h2>Loading...</h2>}

      </main>
    )
  }

  renderOrders = (orders: Order[]) => {
    ////The filter action is inside the server so filteredOrders isn't needed
    // const filteredOrders = orders 
    // .filter((order) => (order.customer.name.toLowerCase() + order.id).includes(this.state.search.toLowerCase()));
    const changeStatus = (id: number) => {
      let newOrders = [...orders];
      const order = newOrders.find(order => order.id === id);
      const new_status = order && order.fulfillmentStatus === 'fulfilled' ? 'not-fulfilled' : 'fulfilled';
      (new_status === "fulfilled") ? this.setState({ notFulfillmentcounter: (this.state.notFulfillmentcounter - 1) }) : this.setState({ notFulfillmentcounter: (this.state.notFulfillmentcounter + 1) });
      if (order && new_status) order.fulfillmentStatus = new_status;
      this.setStatus(id, new_status);
      this.setState({ orders: newOrders });
    }

    return (
      <div className='orders'>
        {orders.map((order) => (
          <div key={(order.id)} className={'orderCard'}>
            <OrderCard order={order} changeStatus={changeStatus} getAssetByStatus={App.getAssetByStatus} />
          </div>
        ))}
        <div className="PaginationContainer">
          <Pagination
            page={this.state.page}
            totalPages={this.totalPages}
            handlePagination={this.handlePages}
          />
        </div>
      </div>
    )
  };
  static getAssetByStatus(status: string) {
    switch (status) {
      case 'fulfilled':
        return require('./assets/package.png');
      case 'not-fulfilled':
        return require('./assets/pending.png');
      case 'canceled':
        return require('./assets/cancel.png');
      case 'paid':
        return require('./assets/paid.png');
      case 'not-paid':
        return require('./assets/not-paid.png');
      case 'refunded':
        return require('./assets/refunded.png');
    }
  }
}

export default App;
