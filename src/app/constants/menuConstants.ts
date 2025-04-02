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
        visible: true,
        subMenu: [
          {
            id: 211,
            name: 'Course Certificate Verify',
            route: '/verification/certificate/course',
            visible: true,
          },
          {
            id: 212,
            name: 'Other Certificate Verify',
            route: '/verification/certificate/other',
            visible: true,
          },
        ],
      },
      {
        id: 22,
        name: 'Student Verify',
        route: '/verification/student',
        visible: true,
      },
      {
        id: 23,
        name: 'Center Verify',
        route: '/verification/center',
        visible: true,
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
        visible: true,
      },
      {
        id: 32,
        name: 'Download Form',
        route: '/academic/download-form',
        visible: true,
      },
      {
        id: 33,
        name: 'Pay Fees',
        route: '/academic/pay-fees',
        visible: true,
      },
      {
        id: 34,
        name: 'Apply Franchies',
        route: '/registration/register-franchise',
        visible: true,
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
        visible: true,
      },
      {
        id: 42,
        name: 'Drawing',
        route: '/course-offered/drawing',
        visible: true,
      },
      {
        id: 43,
        name: 'Dance',
        route: '/course-offered/dance',
        visible: true,
      },
      {
        id: 44,
        name: 'Spoken English',
        route: '/course-offered/drawing',
        visible: true,
      },
      {
        id: 45,
        name: 'Others',
        route: '/course-offered/others',
        visible: true,
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
        visible: true,
        subMenu: [
          {
            id: 511,
            name: 'Reg Notice',
            route: '/student/notice/registration',
            visible: true,
          },
          {
            id: 512,
            name: 'Holiday Notice',
            route: '/student/notice/holiday',
            visible: true,
          },
          {
            id: 513,
            name: 'Student Login',
            route: '/login',
            visible: true,
          },
        ],
      },
      {
        id: 52,
        name: 'E-Book',
        route: '/student/e-book',
        visible: true,
      },
      {
        id: 53,
        name: 'Notes',
        route: '/student/notes',
        visible: true,
      },
      {
        id: 54,
        name: 'Marks Division',
        route: '/student/marks-division',
        visible: true,
      },
      {
        id: 55,
        name: 'Software Download',
        route: '/student/software-download',
        visible: true,
      },
      {
        id: 56,
        name: 'Student Registration',
        route: '/registration/register-student',
        visible: true,
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
        visible: true,
      },
      {
        id: 62,
        name: 'Photos - 2',
        route: '/gallary/2',
        visible: true,
      },
      {
        id: 63,
        name: 'Photos - 3',
        route: '/gallary/3',
        visible: true,
      },
      {
        id: 64,
        name: 'Others Activity',
        route: '/gallary/others-activity',
        visible: true,
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
        visible: true,
      },
      {
        id: 72,
        name: 'About Registration',
        route: '/about/registration',
        visible: true,
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
        visible: true,
      },
      {
        id: 82,
        name: 'Feedback',
        route: '/contact-us/feedback',
        visible: true,
      },
      {
        id: 83,
        name: 'Rules',
        route: '/contact-us/rules',
        visible: true,
      },
    ],
  },
  {
    id: 9,
    name: 'Admin Panel',
    visible: true,
    subMenu: [
      {
        id: 91,
        name: 'Update Dashboard Details',
        visible: true,
        subMenu: [
          {
            id: 911,
            name: 'Home Slideshow',
            route: '/admin-panel/update-dashboard-details/home-slideshow',
            visible: true,
          },
        ],
      },
      {
        id: 92,
        name: 'Create User',
        route: '/admin-panel/create-user',
        visible: true,
      },
      {
        id: 93,
        name: 'Enums',
        route: '/admin-panel/enum',
        visible: true,
      },
    ],
  },
  {
    id: 10,
    name: 'Login',
    route: '/login',
    showWhenLoggedIn: false,
  },
  {
    id: 11,
    name: 'User',
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
    showWhenLoggedIn: true
  },
];
