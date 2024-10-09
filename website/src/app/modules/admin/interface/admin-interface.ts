export interface orderList {
  id: number;
  number_bill: string;
  date_register: Date;
  pago: string;
  delivery: string;
  nombre: string;
  card_buyer: string;
  phone_buyer: number;
  mail_buyer: string;
  city: string;
  address_delivery: string;
}

export interface listUsers {
  id: number;
  photo: null | string;
  names: string;
  last_name: string;
  mail: string;
  phone: string;
  identification_card: string;
  tipo_identificacion: string;
  address: string;
  names_department: string;
  name_city: string;
  estado: string;
  roles: string | null;
}
