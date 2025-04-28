export function totalHarga(carts: cart[], priceShipment?: number) {
   var total = 0;
   for (let i = 0; i < carts.length; i++) {
      const cart = carts[i];
      var product = cart.product;
      var subtotal = product!.priceIDR! * cart.buyQuantity!;
      total = total + subtotal;
   }
   if (priceShipment) {
      total = total + priceShipment;
   }
   return total;
}
