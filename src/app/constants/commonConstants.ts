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
}

export const MasterDataType = {
  EMAIL: 'EMAIL',
  PRIMARY_PHONE: 'PRIMARY_PHONE',
  SECONDARY_PHONE: 'SECONDARY_PHONE',
  FACEBOOK: 'FACEBOOK',
  YOUTUBE: 'YOUTUBE',
  WHATSAPP: 'WHATSAPP',
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
}

export const ActiveInactiveStatusDescriptions: Record<ActiveInactiveStatus, string> = {
  [ActiveInactiveStatus.ACTIVE]: 'Active',
  [ActiveInactiveStatus.INACTIVE]: 'Inactive',
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

export type ResponseTypeColor = typeof ResponseTypeColor[keyof typeof ResponseTypeColor];
