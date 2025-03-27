export const MenuItems: any[] = [
    {
        id: 1,
        name: 'Home',
        route: "/home"
    },
    {
        id: 2,
        name: 'Verification',
        subMenu: [
            {
                id: 21,
                name: 'Certificate Verify',
                subMenu: [
                    {
                        id: 211,
                        name: 'Course Certificate Verify',
                        route: "/verification/certificate/course"
                    },
                    {
                        id: 212,
                        name: 'Other Certificate Verify',
                        route: "/verification/certificate/other"
                    }
                ]
            },
            {
                id: 22,
                name: 'Student Verify',
                route: "/verification/student"
            },
            {
                id: 23,
                name: 'Center Verify',
                route: "/verification/center"
            },
        ]
    },
    {
        id: 3,
        name: 'Academic',
        subMenu: [
            {
                id: 31,
                name: 'Download Certificate',
                route: "academic/download-certificate"
            },
            {
                id: 32,
                name: 'Download Form',
                route: "/academic/download-form"
            },
            {
                id: 33,
                name: 'Pay Fees',
                route: "/academic/pay-fees"
            },
            {
                id: 34,
                name: 'Apply Franchies',
                route: "/academic/apply-franchies"
            }
        ]
    },
    {
        id: 4,
        name: 'Course Offered',
        subMenu: [
            {
                id: 41,
                name: 'Computer',
                route: "/course-offered/computer"
            },
            {
                id: 42,
                name: 'Drawing',
                route: "/course-offered/drawing"
            },
            {
                id: 43,
                name: 'Dance',
                route: "/course-offered/dance"
            },
            {
                id: 44,
                name: 'Spoken English',
                route: "/course-offered/drawing"
            },
            {
                id: 45,
                name: 'Others',
                route: "/course-offered/others"
            },
        ]
    },
    {
        id: 5,
        name: 'Student',
        subMenu: [
            {
                id: 51,
                name: 'Notice',
                subMenu: [
                    {
                        id: 511,
                        name: 'Reg Notice',
                        route: "/student/notice/registration"
                    },
                    {
                        id: 512,
                        name: 'Holiday Notice',
                        route: "/student/notice/holiday"
                    },
                ]
            },
            {
                id: 52,
                name: 'E-Book',
                route: "/student/e-book"
            },
            {
                id: 53,
                name: 'Notes',
                route: "/student/notes"
            },
            {
                id: 54,
                name: 'Marks Division',
                route: "/student/marks-division"
            },
            {
                id: 55,
                name: 'Software Download',
                route: "/student/software-download"
            },
        ]
    },
    {
        id: 6,
        name: 'Gallery',
        subMenu: [
            {
                id: 61,
                name: 'Photos - 1',
                route: "/gallary/1"
            },
            {
                id: 62,
                name: 'Photos - 2',
                route: "/gallary/2"
            },
            {
                id: 63,
                name: 'Photos - 3',
                route: "/gallary/3"
            },
            {
                id: 64,
                name: 'Others Activity',
                route: "/gallary/others-activity"
            },
        ]
    },
    {
        id: 7,
        name: 'About',
        subMenu: [
            {
                id: 71,
                name: 'About Institution',
                route: "/about/institution"
            },
            {
                id: 72,
                name: 'About Registration',
                route: "/about/registration"
            },
        ]
    },
    {
        id: 8,
        name: 'Contact Us',
        subMenu: [
            {
                id: 81,
                name: 'Contact Us',
                route: "/contact-us/contact"
            },
            {
                id: 82,
                name: 'Feedback',
                route: "/contact-us/feedback"
            },
            {
                id: 83,
                name: 'Rules',
                route: "/contact-us/rules"
            },
        ]
    },
    {
        id: 9,
        name: 'Center Login',
        route: "/center-login"
    },
    {
        id: 10,
        name: 'Admin Panel',
        subMenu: [
            {
                id: 101,
                name: 'Update Dashboard Details',
                route: "/update-dashboard-details"
            },
            {
                id: 102,
                name: 'Create User',
                route: "/create-user"
            },
        ]
    },
];