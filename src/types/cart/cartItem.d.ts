interface CartItem {
  product?: any;
  map?(arg0: (item: any, index: any) => React.JSX.Element): React.ReactNode;
  total?: number;
  cart?: cart[];
  cartids?: number[];
  count?: number;
  buyQuantity?: number;
  shipmentPrice?: Pricing[];
}
