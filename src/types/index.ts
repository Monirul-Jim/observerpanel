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

export interface PaymentSourceBreakdown {
  payable: number;
  collected: number;
}

export interface PaymentSources {
  feesManagement: PaymentSourceBreakdown;
  onlineAdmission: PaymentSourceBreakdown;
  openPayment: PaymentSourceBreakdown;
}

export interface Institute {
  id: number;
  name: string;
  code: string | number;
  institute_id:string;
  type: string;
  branch: string | null;
  principal: string | null;
  gm: string | null;
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
  paymentSources?: PaymentSources;
  lastTransaction: string | null;
  lastTransactionTime: string | null;
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
