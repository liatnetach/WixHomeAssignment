import React, { useState } from 'react';
const Sort = (props: any) => {
    //The logic here is: the Unit’S Place represent the selected sorting type 
    //and the Tenth's Place represent the direction (ascending / descending)
    //if there is 0 in the Tenth's Place- we will sort the orders in descending order , if there is 1- in ascending order
    const { handleSort } = props;
    const [price, setPriceSorting] = useState<number>(1);
    const [date, setDateSorting] = useState<number>(2);
    const [quantity, setQuantitySorting] = useState<number>(3);
    const [name, setNameSorting] = useState<number>(4);
    //manage the user selection, each press on sorting button change the direction (ascending / descending)
    const buttonPressed = (sortingProperty: number) => {
        handleSort(sortingProperty);
    }
    return (<div>
        <button id={`clear`} className="myButton" onClick={() => { buttonPressed(0) }}>Clear Sort Preferences</button>
        <button id={`price`} className="myButton" onClick={() => { price < 10 ? setPriceSorting(11) : setPriceSorting(1); buttonPressed(price); }}>Total Price &nbsp;&nbsp; {price < 10 ? <i className="arrow up"></i> : <i className="arrow down"></i>}</button>
        <button id={`date`} className="myButton" onClick={() => { date < 10 ? setDateSorting(12) : setDateSorting(2); buttonPressed(date); }}>Date Created &nbsp;&nbsp; {date < 10 ? <i className="arrow up"></i> : <i className="arrow down"></i>}</button>
        <button id={`quantity`} className="myButton" onClick={() => { quantity < 10 ? setQuantitySorting(13) : setQuantitySorting(3); buttonPressed(quantity); }}>Items Quantity &nbsp;&nbsp; {quantity < 10 ? <i className="arrow up"></i> : <i className="arrow down"></i>}</button>
        <button id={`name`} className="myButton" onClick={() => { name < 10 ? setNameSorting(14) : setNameSorting(1); buttonPressed(name); }}>Costumer Name &nbsp;&nbsp;  {name < 10 ? <i className="arrow up"></i> : <i className="arrow down"></i>}</button>
    </div>)

};
export default Sort;