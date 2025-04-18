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
    ADMIN: 'ADMIN',
    MASTET: 'MASTER',
    STUDENT: 'STUDENT',
    FRANCHISE: 'FRANCHISE',
    GUEST: 'GUEST'
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


export type ResponseTypeColor = typeof ResponseTypeColor[keyof typeof ResponseTypeColor];
