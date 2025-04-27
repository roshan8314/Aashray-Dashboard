export type GuestID = string;

export type IDType = 'Aadhar Card' | 'Passport' | 'Driving License' | 'Voter ID' | 'PAN Card' | 'Other';

export interface Guest {
  id: GuestID;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  idType: IDType;
  idNumber: string;
  notes: string;
}

export interface Stay {
  id: string;
  guestId: GuestID;
  roomNumber: string;
  checkInDate: string; // ISO string
  checkOutDate: string | null; // ISO string or null if not checked out
  adults: number;
  children: number;
  totalAmount: number;
  paymentStatus: 'Pending' | 'Partial' | 'Completed';
  paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Other';
  status: 'Active' | 'Completed' | 'Cancelled';
  createdAt: string; // ISO string
}

export interface Room {
  roomNumber: string;
  type: 'Single' | 'Double' | 'Deluxe' | 'Suite';
  capacity: number;
  pricePerNight: number;
  status: 'Available' | 'Occupied' | 'Maintenance';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'staff';
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}