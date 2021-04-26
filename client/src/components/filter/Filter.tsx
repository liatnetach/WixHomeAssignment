import React, { useState } from 'react';
const Filter = (props: any) => {
    const { filtersApplied } = props
    const [fulfillmentVal, setFulfillmentStatus] = useState<string>('All');
    const [paymentVal, setPaymentStatus] = useState<string>('All');
    const buttonPressed = () => {
        filtersApplied(fulfillmentVal, paymentVal);
    }
    return (
        <div>
            <label>
                Filter By Fulfillment Status:&nbsp;&nbsp;
            <select id={`fulfillment`} name={`fulfillment`} value={fulfillmentVal} onChange={(e) => {
                    console.log(e.target.value)
                    setFulfillmentStatus(e.target.value);
                }}>
                    <option value="All">All</option>
                    <option value="fulfilled">fulfilled</option>
                    <option value="not-fulfilled">not-fulfilled</option>
                    <option value="canceled">canceled</option>
                </select>
            </label>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <label>
                Filter By Payment Status:&nbsp;&nbsp;
            <select id={`payment`} name={`payment`} value={paymentVal} onChange={(e) => {
                    setPaymentStatus(e.target.value);
                }}>
                    <option value="All">All</option>
                    <option value="paid">paid</option>
                    <option value="not-paid">not-paid</option>
                    <option value="refunded">refunded</option>
                </select>
            </label>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button className="myButton" onClick={() => { buttonPressed() }}>Filter</button>
        </div>

    )
};
export default Filter;
