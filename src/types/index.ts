export type ObserverLevel =
  | 'branch'
  | 'principal'
  | 'gm'
  | 'upazila'
  | 'district'
  | 'division';

export interface Observer {
  name: string;
  designation: string;
  zone: string;
  level: ObserverLevel;
}

export interface FeeData {
  today: number;
  week: number;
  month: number;
  year: number;
}

export interface Institute {
  id: number;
  name: string;
  code: string;
  type: string;
  branch: string;
  principal: string;
  gm: string;
  upazila: string;
  district: string;
  division: string;
  mobile: string;
  email: string;
  totalStudents: number;
  fee: FeeData;
  totalPayable: number;
  totalCollected: number;
  dueAmount: number;
  collectionRate: number;
  lastTransaction: string;
  lastTransactionTime: string;
  status: 'active' | 'inactive';
  [key: string]: unknown;
}

export interface Transaction {
  id: number;
  student: string;
  class: string;
  amount: number;
  date: string;
  time: string;
  type: string;
  method: string;
}

export interface HierarchyItem {
  id: string;
  label: string;
}

export interface LayerFilter {
  level: string;
  value: string;
}
