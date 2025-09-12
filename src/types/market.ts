export interface Market {
  id: string;
  name: string;
  date: string;
  loadInTime: string;
  marketStartTime: string;
  marketEndTime: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  fee: number;
  estimatedProfit: number;
  actualRevenue?: number;
  status: "upcoming" | "confirmed" | "pending" | "completed";
  checklist: {
    insurance: boolean;
    permit: boolean;
    inventory: boolean;
    setup: boolean;
  };
  description?: string;
  organizerContact?: string;
  requirements?: string[];
  completed?: boolean;
  completedDate?: string;
}