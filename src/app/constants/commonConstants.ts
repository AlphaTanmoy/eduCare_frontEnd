export const NavbarInfo = {
  description: "Working Since 2017",
  email: "educate@mail.com",
  phone1: "000-000-000",
  phone2: "000-000-001",
  youtube_url: "https://youtube.com/@educarecomputercenterthakd963?si=4qKfLPjDIqxFj7OJ",
  facebook_url: "https://www.facebook.com/2233473143577609/",
  whatsapp_url: "https://api.whatsapp.com/send/?phone=919831744911&text&type=phone_number&app_absent=0"
}

export const DashboardInfo = {
  maximum_slideshow_image_count: 8,
}

export const ResponseTypeColor = {
  SUCCESS: 1,
  WARNING: 2,
  INFO: 3,
  ERROR: 4
}

export const UserRole = {
  MASTER: "MASTER",
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
  FRANCHISE: "FRANCHISE",
  COMMON: "COMMON"
}

export class IndexedDB {
  id: string | undefined;
  value: any | undefined;
  expirationTime: number | undefined;
}

export const IndexedDBItemKey = {
  dashboard_slideshow_images: "dashboard_slideshow_images",
  student_profile_photo: "student_profile_photo",
}

export const MasterDataType = {
  EMAIL: 'EMAIL',
  PRIMARY_PHONE: 'PRIMARY_PHONE',
  SECONDARY_PHONE: 'SECONDARY_PHONE',
  FACEBOOK: 'FACEBOOK',
  YOUTUBE: 'YOUTUBE',
  WHATSAPP: 'WHATSAPP',
}

export enum OTP_TYPE {
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD'
}

export enum ServerStatusType {
  HEALTHY = 'Healthy',
  HIGH_LOAD = 'High Load',
}

export class Dropdown {
  id: string | undefined;
  text: string | undefined;

  constructor(id: string | undefined, text: string | undefined) {
    this.id = id;
    this.text = text;
  }
}

export const Gender = [
  new Dropdown("1", 'Male'),
  new Dropdown("2", 'Female'),
  new Dropdown("3", 'Other'),
]

export const MaritalStatus = [
  new Dropdown("1", 'Unmarried'),
  new Dropdown("2", 'Married'),
  new Dropdown("3", 'Other'),
]

export enum ActiveInactiveStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}

export const ActiveInactiveStatusDescriptions: Record<ActiveInactiveStatus, string> = {
  [ActiveInactiveStatus.ACTIVE]: 'Active',
  [ActiveInactiveStatus.INACTIVE]: 'Inactive',
  [ActiveInactiveStatus.DELETED]: 'Deleted',
};

export enum YesNoStatus {
  YES = 1,
  NO = 0,
}

export const YesNoStatusDescriptions: Record<YesNoStatus, string> = {
  [YesNoStatus.YES]: 'Yes',
  [YesNoStatus.NO]: 'No',
};

export enum ApproveRejectionStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export const ApproveRejectionStatusDescriptions: Record<ApproveRejectionStatus, string> = {
  [ApproveRejectionStatus.PENDING]: 'Pending',
  [ApproveRejectionStatus.APPROVED]: 'Approved',
  [ApproveRejectionStatus.REJECTED]: 'Rejected',
};

export enum FranchiseDocumentName {
  CENTER_HEAD_PHOTO = "center_head_photo",
  CENTER_HEAD_SIGNATURE = "center_head_signature",
  SUPPORTABLE_DOCUMENT = "supportable_document",
}

export enum StudentDocumentName {
  AADHAR_CARD_PHOTO = "aadhar_card_photo",
  PASSPORT_SIZED_PHOTO = "passport_sized_photo",
}

export enum EducareFranchiseWalletRechargeBankDetails {
  ACCOUNT_NAME = "EDUCATION CAREFULLY INSTITUTE",
  ACCOUNT_NUMBER = "43715511652",
  IFSC_CODE = "SBIN0005112",
  BRANCH_NAME = "New Town Rajarhat",
  ACCOUNT_TYPE = "Current Account"
}

export enum WalletAmountStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const WalletAmountStatusDescriptions: Record<WalletAmountStatus, string> = {
  [WalletAmountStatus.PENDING]: 'Pending',
  [WalletAmountStatus.APPROVED]: 'Approved',
  [WalletAmountStatus.REJECTED]: 'Rejected',
};

export enum TransactionType {
  RECHARGE = "RECHARGE",
  APPROVE_RECHARGE = "APPROVE_RECHARGE",
  REJECT_RECHARGE = "REJECT_RECHARGE",
  STUDENT_FEE_REFUND = "STUDENT_FEE_REFUND",
  STUDENT_FEE_PAYMENT = "STUDENT_FEE_PAYMENT",
  BLOCKED_TRANSACTION = "BLOCKED_TRANSACTION",
  UNBLOCKED_TRANSACTION = "UNBLOCKED_TRANSACTION"
}

export const TransactionTypeDescriptions: Record<TransactionType, string> = {
  [TransactionType.RECHARGE]: 'Recharge',
  [TransactionType.APPROVE_RECHARGE]: 'Approved Recharge',
  [TransactionType.REJECT_RECHARGE]: 'Rejected Recharge',
  [TransactionType.STUDENT_FEE_REFUND]: 'Fees Refund',
  [TransactionType.STUDENT_FEE_PAYMENT]: 'Fees Payment',
  [TransactionType.BLOCKED_TRANSACTION]: 'Blocked Transaction',
  [TransactionType.UNBLOCKED_TRANSACTION]: 'Unblocked Transaction',
};

export enum EnrollmentStatus {
  REGISTERED = "REGISTERED",
  FEES_PAID = "FEES_PAID",
  FEES_REFUNDED = "FEES_REFUNDED",
  TICKET_RAISED_FOR_CERTIFICATE = "TICKET_RAISED_FOR_CERTIFICATE",
  CERTIFICATE_PROCESSING = "CERTIFICATE_PROCESSING",
  CERTIFICATE_REQUEST_REJECTED = "CERTIFICATE_REQUEST_REJECTED",
  CERTIFICATE_ISSUED = "CERTIFICATE_ISSUED",
}

export const EnrollmentStatusDescriptions: Record<EnrollmentStatus, string> = {
  [EnrollmentStatus.REGISTERED]: 'Registered',
  [EnrollmentStatus.FEES_PAID]: 'Fees Paid',
  [EnrollmentStatus.FEES_REFUNDED]: 'Fees Refunded',
  [EnrollmentStatus.TICKET_RAISED_FOR_CERTIFICATE]: 'Ticket Raised For Certificate',
  [EnrollmentStatus.CERTIFICATE_PROCESSING]: 'Certificate Processing',
  [EnrollmentStatus.CERTIFICATE_REQUEST_REJECTED]: 'Certificate Request Rejected',
  [EnrollmentStatus.CERTIFICATE_ISSUED]: 'Certificate Issued',
};

export enum CreditDebit {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  NO_EFFECT = "NO_EFFECT"
}

export const CreditDebitDescriptions: Record<CreditDebit, string> = {
  [CreditDebit.CREDIT]: '&#8679; Credit',
  [CreditDebit.DEBIT]: '&#8681; Debit',
  [CreditDebit.NO_EFFECT]: 'No Effect',
};

export enum CertificateTicketStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
}

export const CertificateTicketStatusDescriptions: Record<CertificateTicketStatus, string> = {
  [CertificateTicketStatus.PENDING]: 'Pending',
  [CertificateTicketStatus.ACCEPTED]: 'Accepted',
  [CertificateTicketStatus.REJECTED]: 'Rejected',
  [CertificateTicketStatus.PROCESSING]: 'Processing',
  [CertificateTicketStatus.COMPLETED]: 'Completed',
};

export type ResponseTypeColor = typeof ResponseTypeColor[keyof typeof ResponseTypeColor];
