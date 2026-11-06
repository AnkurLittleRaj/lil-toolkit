export interface LilTab {
  label: string;
  value: string;
  disabled?: boolean;
}
export interface LilNavigationItem {
  label: string;
  value: string;
  icon?: string;
}
export interface LilChartDatum {
  label: string;
  value: number;
}
export interface LilCustomer {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: "Active" | "Trial" | "Past due";
  amount: string;
  joined: string;
}
export interface LilActivity {
  title: string;
  description: string;
  icon?: string;
}
export interface LilMenuItem {
  label: string;
  value: string;
  disabled?: boolean;
}
