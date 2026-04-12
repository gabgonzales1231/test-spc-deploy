export interface Ordinance {
  id: string;
  title: string;
  date: string;
  status: string;
  category: string;
  author: string;
  [key: string]: unknown;
}

export interface Resolution {
  id: string;
  title: string;
  date: string;
  status: string;
  category: string;
  urgency: string;
  [key: string]: unknown;
}

export interface ExecutiveOrder {
  id: string;
  title: string;
  date: string;
  department: string;
  implementor: string;
  [key: string]: unknown;
}

export interface BidAward {
  id: string;
  title: string;
  date: string;
  amount: string;
  winner: string;
  status: string;
  type: string;
  [key: string]: unknown;
}

export interface FinancialAid {
  barangay: string;
  quarter: string;
  amount: string;
  purpose: string;
  dateReleased: string;
  status: string;
  [key: string]: unknown;
}