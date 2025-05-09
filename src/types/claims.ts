// Types for the Claims Management System

export type ClaimStatus =
  // Initial Submission Phase
  | "DRAFT"
  | "SUBMITTED"
  | "REJECTED_DELIVERY"
  // Review Phase
  | "UNDER_REVIEW"
  | "INFORMATION_REQUESTED"
  | "INFORMATION_PROVIDED"
  // Acceptance Phase
  | "ACCEPTANCE_PENDING"
  | "ACCEPTED"
  | "ACCEPTED_EXGRATIA"
  // Payout Approval Phase
  | "APPROVAL_PENDING_L1"
  | "APPROVED_L1"
  | "APPROVAL_PENDING_L2"
  | "APPROVED_L2"
  | "APPROVAL_PENDING_L3"
  | "APPROVED"
  // Payment Phase
  | "PAID"
  // Closure Phase
  | "DECLINED"
  | "WITHDRAWN"
  | "SETTLED";

export type ClaimType = "TRANSPORT" | "WAREHOUSE";

export interface ClaimItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  value: number;
  serialNumber?: string;
  damageType: string;
  faultAllocation?: FaultAllocation[];
}

export interface FaultAllocation {
  costCenterId: string;
  costCenterName: string;
  percentage: number;
}

export interface ClaimInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  amount: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  items: ClaimInvoiceItem[];
  status:
    | "DRAFT"
    | "SUBMITTED"
    | "APPROVED_L1"
    | "APPROVED_L2"
    | "APPROVED"
    | "PAID";
}

export interface ClaimInvoiceItem {
  id: string;
  claimItemId: string;
  description: string;
  amount: number;
  quantity?: number;
  unitPrice?: number;
}

export interface ClaimNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  attachmentUrl?: string;
}

export interface ClaimEvent {
  id: string;
  date: string;
  location: string;
  description: string;
  status: "OPEN" | "CLOSED";
  claims?: Claim[];
}

export interface Claim {
  id: string;
  claimNumber: string;
  accountNumber: string;
  customerName: string;
  consignmentNumber?: string;
  warehouseReference?: string;
  claimType: ClaimType;
  status: ClaimStatus;
  submittedDate?: string;
  deliveryDate?: string;
  claimedAmount: number;
  assignedTo?: string;
  items: ClaimItem[];
  invoices: ClaimInvoice[];
  notes: ClaimNote[];
  eventId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CostCenter {
  id: string;
  name: string;
  code: string;
  associatedUsers: string[];
}

export interface CustomerAccount {
  accountNumber: string;
  name: string;
  vendorNumber?: string;
  emailAddresses: string[];
  rejectedDeliveryNotification: boolean;
}

export interface ClaimTypeConfig {
  id: string;
  name: string;
  description: string;
  validityPeriod: number;
}

export interface DamageType {
  id: string;
  name: string;
  description: string;
}

export interface GSTRate {
  id: string;
  rate: number;
  description: string;
  isDefault: boolean;
}

export interface ApprovalLevel {
  level: number;
  name: string;
  approvers: string[];
  claimTypes?: ClaimType[];
}

export interface WithdrawalReason {
  id: string;
  reason: string;
}

export interface DeclineReason {
  id: string;
  reason: string;
}

export interface SystemSettings {
  rejectedDeliveryAutoCloseDays: number;
  validityPeriodDays: number;
  extendedLodgingPeriodDays: number;
  emailNotificationSender: string;
  emailNotificationRecipient: string;
}
