export const NavbarInfo = {
    description: "Working Since 2017",
    email: "info@educarecenter.in",
    phone: "+91 9831744911 / 8420922761",
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
}

export const IndexedDBItemKey = {
    dashboard_slideshow_images: "dashboard_slideshow_images",
}

export type ResponseTypeColor = typeof ResponseTypeColor[keyof typeof ResponseTypeColor];
