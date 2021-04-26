import React from 'react';
const DisplayProduct = (props: any) => {
  const { product, order } = props;

  const getQuantity = (product: any) => {
    return order.items[order.items.map((cell: { id: any; }) => {
      return cell.id;
    }).indexOf(product.id)].quantity
  }

  return (
    <div key={`itemInorderDis${product.id}in${order.id}`} id={`id${product.id}in${order.id}`}>
      <h4 id={`h4${product.id}`}>
        Product: {product.name ? product.name : "Loading.."} ,  Product Quantity: {getQuantity(product)}</h4>
      <img id={`img${product.id}`} alt={`Error Occurred`} src={product.image ? product.image : undefined} />
    </div>
  )
};
export default DisplayProduct;
