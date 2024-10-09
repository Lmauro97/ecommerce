//https://app.quicktype.io/
export interface LabelList {
  status: number;
  total: number;
  label: Label[];
}

export interface Label {
  id_label?: number | null;
  nombre: string;
}
