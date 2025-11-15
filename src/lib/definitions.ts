export interface User {
  name: string;
  email: string;
  password?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  timestamp: number;
  paymentMethod: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
