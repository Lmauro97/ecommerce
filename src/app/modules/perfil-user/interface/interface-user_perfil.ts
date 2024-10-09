export interface purchaseUser {
  id: number;
  id_user: number;
  id_billing: number;
  amount: number;
  id_state: number;
  date_register: Date;
  date_return: null;
  number_bill: string;
  name_buyer: string;
  last_name_buyer: string;
  card_buyer: string;
  mail_buyer: string;
  phone_buyer: number;
  address_delivery: string;
  type_pay: string;
  shipments: number;
  id_type_card: number;
  delivery_department: number;
  delivery_city: number;
  payment_reference: null | string;
  delivery_reference: string;
  id_product: number;
  product_name: string;
  id_sale: number;
  id_state_delivery: number;
  estado_entrega: string;
  estado_pago: string;
  porcentProccese?: number;
  fotos_producto: any;
  obs_venta: string;
  date_confirmed_delivery: Date;
  nombrePars?: string;
}

export interface pqrs {
  id_pqrs: number;
  radicado: string;
  id_user: number;
  id_type_pqrs: number;
  process_detail: string;
  url_file: string;
  id_state: number;
  names_state: string;
  name_type: string;
  date_register: Date;
}

export interface listFactura {
  id_venta: number;
  number_bill: string;
  nombres: string;
  card_buyer: string;
  mail_buyer: string;
  phone_buyer: number;
  address_delivery: string;
  delivery_department: string;
  delivery_city: string;
  payment_reference: null | string;
  type_pay: string;
  shipments: number;
  names_card: string;
  amount: number;
  estado_pago: string;
  estado_entrega: string;
  date_register: Date;
  date_confirmed_delivery: any;
  date_return: null;
  obs_venta: null | string;
  productos: Producto[] | null;
  precios_total?: number;
  totalIva?: number;
  subtotal?: number;
}
export interface Producto {
  id_producto: string;
  nombre_producto: string;
  cantidad: number;
  precio: number;
  iva: number;
}
