export type UserType = "viewer" | "organizer";
export type PlanType = "basic" | "standard" | "premium";
export type PerformanceStatus = "active" | "ended" | "cancelled";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export type Region =
  | "東京23区"
  | "多摩エリア"
  | "神奈川"
  | "埼玉"
  | "千葉"
  | "群馬"
  | "栃木"
  | "茨城";

export interface User {
  id: string;
  email: string;
  user_type: UserType;
  organizer_name?: string;
  organizer_profile?: string;
  organizer_website?: string;
  display_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Performance {
  id: string;
  organizer_id: string;
  title: string;
  description: string;
  performance_date: string;
  performance_time: string;
  duration?: string;
  venue_name: string;
  venue_address?: string;
  region: Region;
  performers?: string;
  ticket_price?: string;
  ticket_url?: string;
  image_url?: string;
  plan_type: PlanType;
  status: PerformanceStatus;
  published_at?: string;
  expires_at?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  performance_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  performance_id: string;
  created_at: string;
}

export interface Payment {
  id: string;
  performance_id: string;
  organizer_id: string;
  plan_type: PlanType;
  amount: number;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  status: PaymentStatus;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PerformanceStats {
  id: string;
  title: string;
  organizer_id: string;
  region: Region;
  performance_date: string;
  view_count: number;
  review_count: number;
  average_rating: number;
  favorite_count: number;
}

export interface PerformanceSchedule {
  id: string;
  performance_id: string;
  start_at: string; // ISO String
}

export interface PerformanceWithSchedules extends Performance {
  schedules: PerformanceSchedule[];
}
