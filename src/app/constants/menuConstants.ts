export const MenuItems: any[] = [
  {
    id: 1,
    name: 'Home',
    route: '/home',
    visible: true
  },
  {
    id: 2,
    name: 'Verification',
    visible: true,
    subMenu: [
      {
        id: 21,
        name: 'Certificate Verify',
        subMenu: [
          {
            id: 211,
            name: 'Course Certificate Verify',
            route: '/verification/certificate/course',
          },
          {
            id: 212,
            name: 'Other Certificate Verify',
            route: '/verification/certificate/other',
          },
        ],
      },
      {
        id: 22,
        name: 'Student Verify',
        route: '/verification/student',
      },
      {
        id: 23,
        name: 'Center Verify',
        route: '/verification/center',
      },
    ],
  },
  {
    id: 3,
    name: 'Academic',
    visible: true,
    subMenu: [
      {
        id: 31,
        name: 'Download Certificate',
        route: 'academic/download-certificate',
      },
      {
        id: 32,
        name: 'Download Form',
        route: '/academic/download-form',
      },
      {
        id: 33,
        name: 'Pay Fees',
        route: '/academic/pay-fees',
      },
      {
        id: 34,
        name: 'Apply Franchies',
        route: '/registration/register-franchise',
      },
    ],
  },
  {
    id: 4,
    name: 'Course Offered',
    visible: true,
    subMenu: [
      {
        id: 41,
        name: 'Computer',
        route: '/course-offered/computer',
      },
      {
        id: 42,
        name: 'Drawing',
        route: '/course-offered/drawing',
      },
      {
        id: 43,
        name: 'Dance',
        route: '/course-offered/dance',
      },
      {
        id: 44,
        name: 'Spoken English',
        route: '/course-offered/drawing',
      },
      {
        id: 45,
        name: 'Others',
        route: '/course-offered/others',
      },
    ],
  },
  {
    id: 5,
    name: 'Student',
    visible: true,
    subMenu: [
      {
        id: 51,
        name: 'Notice',
        subMenu: [
          {
            id: 511,
            name: 'Reg Notice',
            route: '/student/notice/registration',
          },
          {
            id: 512,
            name: 'Holiday Notice',
            route: '/student/notice/holiday',
          },
          {
            id: 513,
            name: 'Student Login',
            route: '/login',
          },
        ],
      },
      {
        id: 52,
        name: 'E-Book',
        route: '/student/e-book',
      },
      {
        id: 53,
        name: 'Notes',
        route: '/student/notes',
      },
      {
        id: 54,
        name: 'Marks Division',
        route: '/student/marks-division',
      },
      {
        id: 55,
        name: 'Software Download',
        route: '/student/software-download',
      },
      {
        id: 56,
        name: 'Student Registration',
        route: '/registration/register-student',
      }
    ],
  },
  {
    id: 6,
    name: 'Gallery',
    visible: true,
    subMenu: [
      {
        id: 61,
        name: 'Photos - 1',
        route: '/gallary/1',
      },
      {
        id: 62,
        name: 'Photos - 2',
        route: '/gallary/2',
      },
      {
        id: 63,
        name: 'Photos - 3',
        route: '/gallary/3',
      },
      {
        id: 64,
        name: 'Others Activity',
        route: '/gallary/others-activity',
      },
    ],
  },
  {
    id: 7,
    name: 'About',
    visible: true,
    subMenu: [
      {
        id: 71,
        name: 'About Institution',
        route: '/about/institution',
      },
      {
        id: 72,
        name: 'About Registration',
        route: '/about/registration',
      },
    ],
  },
  {
    id: 8,
    name: 'Contact Us',
    visible: true,
    subMenu: [
      {
        id: 81,
        name: 'Contact Us',
        route: '/contact-us/contact',
      },
      {
        id: 82,
        name: 'Feedback',
        route: '/contact-us/feedback',
      },
      {
        id: 83,
        name: 'Rules',
        route: '/contact-us/rules',
      },
    ],
  },
  {
    id: 9,
    name: 'Admin Panel',
    showWhenAdminLoggedIn: true,
    subMenu: [
      {
        id: 91,
        name: 'Update Dashboard Details',
        subMenu: [
          {
            id: 911,
            name: 'Home Slideshow',
            route: '/admin-panel/update-dashboard-details/home-slideshow',
          },
        ],
      },
      {
        id: 92,
        name: 'Create User',
        route: '/admin-panel/create-user',
      },
      {
        id: 93,
        name: 'Enums',
        route: '/admin-panel/enum',
      },
    ],
  },
  {
    id: 10,
    name: 'Login',
    route: '/login',
    showWhenLoggedOut: true,
  },
  {
    id: 11,
    name: 'User',
    showWhenLoggedIn: true,
    subMenu: [
      {
        id: 111,
        name: 'Profile',
        route: '/profile',
      },
      {
        id: 112,
        name: 'Logout',
        action: 'logout',
      },
    ],
  },
];
