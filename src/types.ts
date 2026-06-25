export interface Service {
  id: string;
  title: string;
  description: string;
  category: 'visa' | 'legal' | 'living';
  costRange: string;
  duration: string;
  fullDetails: string[];
  iconName: string;
  checklists: string[];
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  telegramUsername: string;
  serviceId: string;
  serviceTitle: string;
  date: string;
  timeSlot: string;
  format: 'video' | 'telegram' | 'office';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  rating?: number;
  ratingComment?: string;
  ratedAt?: string;
}

export interface SupportMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: string;
}

export interface DocumentStatus {
  id: string;
  name: string;
  status: 'pending_upload' | 'under_review' | 'submitted' | 'completed' | 'rejected';
  lastUpdated: string;
  notes?: string;
  fileData?: string; // Base64 data URI of the secure document
  fileName?: string; // Uploaded file name
  fileSize?: string; // Formatted file size
}

export interface VisaProgress {
  visaType: string;
  progressPercent: number;
  currentStep: string;
  steps: {
    title: string;
    description: string;
    completed: boolean;
  }[];
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  telegram?: string;
  currentVisa?: string;
  arrivalDate?: string;
  referredBy?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  createdAt: string;
  bookingId?: string;
}
