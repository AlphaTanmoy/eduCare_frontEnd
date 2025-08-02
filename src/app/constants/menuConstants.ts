import { UserRole } from "./commonConstants";

export const MenuItems: any[] = [
  {
    id: 1,
    name: 'Home',
    route: '/home',
    role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
  },
  {
    id: 2,
    name: 'Verification',
    role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
    subMenu: [
      {
        id: 21,
        name: 'Course Certificate Verify',
        route: '/verification/certificate',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 22,
        name: 'Student Verify',
        route: '/verification/student',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 23,
        name: 'Center Verify',
        route: '/verification/center',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
    ],
  },
  {
    id: 3,
    name: 'Apply Franchise',
    route: '/academic/apply-franchise',
    role: [UserRole.MASTER, UserRole.ADMIN, UserRole.COMMON],
  },
  {
    id: 4,
    name: 'Course Offered',
    route: '/course-offered',
    role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
  },
  {
    id: 5,
    name: 'Student Information',
    role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
    subMenu: [
      {
        id: 51,
        name: 'Notification',
        route: '/view-all-notification',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 52,
        name: 'E-Book',
        route: '/e-pdf',
        role: [UserRole.COMMON],
      },
      {
        id: 53,
        name: 'Marks Division',
        route: '/marks-division',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 54,
        name: 'E-Book View',
        route: '/e-pdf-view',
        role: [UserRole.MASTER, UserRole.ADMIN],
      },
    ],
  },
  {
    id: 6,
    name: 'Gallery',
    role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
    subMenu: [
      {
        id: 61,
        name: 'Our Gallery',
        route: '/gallary',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 62,
        name: 'Others Activity',
        route: '/others-activity',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
    ],
  },
  {
    id: 7,
    name: 'About',
    role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
    subMenu: [
      {
        id: 71,
        name: 'About Institution',
        route: '/about/institution',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 72,
        name: 'About Registration',
        route: '/about/registration',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
    ],
  },
  {
    id: 8,
    name: 'Contact Us',
    role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
    subMenu: [
      {
        id: 81,
        name: 'Contact Us',
        route: '/contact-us/contact',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 82,
        name: 'Feedback',
        route: '/contact-us/feedback',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 83,
        name: 'Rules',
        route: '/contact-us/rules',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 84,
        name: 'View Contact Lists',
        route: '/contact-us/view-contact-lists',
        role: [UserRole.MASTER, UserRole.ADMIN],
      },
    ],
  },
  {
    id: 9,
    name: 'Control Panel',
    role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE],
    subMenu: [
      {
        id: 91,
        name: 'Manage Dashboard Details',
        role: [UserRole.MASTER],
        subMenu: [
          {
            id: 911,
            name: 'Home Slideshow',
            route: '/control-panel/update-dashboard-details/home-slideshow',
            role: [UserRole.MASTER],
          },
          {
            id: 912,
            name: 'Master Details',
            route: '/control-panel/update-dashboard-details/master-details',
            role: [UserRole.MASTER],
          },
          {
            id: 913,
            name: 'Manage Brand',
            route: '/control-panel/manage-brand',
            role: [UserRole.MASTER],
          },
          {
            id: 914,
            name: 'Manage YouTube Link',
            route: '/control-panel/manage-youtube-link',
            role: [UserRole.MASTER],
          },
          {
            id: 915,
            name: 'Manage Notification',
            route: '/control-panel/manage-notification',
            role: [UserRole.MASTER],
          },
          {
            id: 916,
            name: 'Manage Counter',
            route: '/control-panel/manage-counters',
            role: [UserRole.MASTER],
          },
        ],
      },
      {
        id: 92,
        name: 'Manage Admin',
        route: '/control-panel/manage-admin',
        role: [UserRole.MASTER],
      },
      {
        id: 94,
        name: 'Manage Courses',
        route: '/control-panel/course-list',
        role: [UserRole.MASTER, UserRole.ADMIN],
      },
      {
        id: 95,
        name: 'Manage Franchise',
        route: '/control-panel/manage-franchise',
        role: [UserRole.MASTER, UserRole.ADMIN],
      },
      {
        id: 96,
        name: 'Manage Wallet',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE],
        subMenu: [
          {
            id: 961,
            name: 'Recharge Wallet',
            route: '/control-panel/wallet/recharge',
            role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE],
          },
          {
            id: 962,
            name: 'Manage Wallet',
            route: '/control-panel/wallet/manage',
            role: [UserRole.MASTER, UserRole.ADMIN],
          },
          {
            id: 963,
            name: 'Transaction History',
            route: '/control-panel/wallet/transaction-history',
            role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE],
          },
        ],
      },
      {
        id: 97,
        name: 'Manage Student',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE],
        subMenu: [
          {
            id: 971,
            name: 'Active Student',
            route: '/control-panel/manage-student/active-student',
            role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE],
          },
          {
            id: 972,
            name: 'Passout Student',
            route: '/control-panel/manage-student/passout-student',
            role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE],
          },
          {
            id: 973,
            name: 'Raise Ticket For Certificate',
            route: '/control-panel/manage-student/request-for-certificate',
            role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE],
          },
          {
            id: 974,
            name: 'View Certificate Ticket',
            route: '/control-panel/manage-student/download-excel-for-certificate-generation',
            role: [UserRole.MASTER, UserRole.ADMIN],
          },
          {
            id: 975,
            name: 'Re-Enrollment',
            route: '/control-panel/manage-student/student-re-enrollment',
            role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE],
          },
        ],
      },
      {
        id: 104,
        name: 'Data Backup',
        route: '/control-panel/data-backup',
        role: [UserRole.MASTER],
      },
    ],
  },
  {
    id: 10,
    name: 'Login',
    route: '/login',
    role: [UserRole.COMMON],
  },
  {
    id: 11,
    name: 'User',
    role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE],
    subMenu: [
      {
        id: 111,
        name: 'Profile',
        route: '/profile',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE],
      },
      {
        id: 112,
        name: 'Change Password',
        route: '/change-password',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE],
      },
      {
        id: 113,
        name: 'Logout',
        route: '/logout',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE],
      },
    ],
  },
  {
    id: 12,
    name: 'Student',
    role: [UserRole.STUDENT],
    subMenu: [
      {
        id: 121,
        name: 'Student Dashboard',
        route: '/student/dashboard',
        role: [UserRole.STUDENT],
      },
      {
        id: 122,
        name: 'My Study Metarials',
        route: '/student/my-study-materials',
        role: [UserRole.STUDENT],
      },
      {
        id: 123,
        name: 'Logout',
        route: '/logout',
        role: [UserRole.STUDENT],
      },
    ],
  }
];

export function GetMenuItemsAssignedByRole(userRole: string): any[] {
  function filterMenu(items: any[]): any[] {
    return items
      .filter(item => item.role?.includes(userRole))
      .map(item => {
        const newItem = { ...item };

        if (newItem.subMenu) {
          newItem.subMenu = filterMenu(newItem.subMenu);

          if (newItem.subMenu.length === 0) {
            delete newItem.subMenu;
          }
        }

        return newItem;
      });
  }

  return filterMenu(MenuItems);
}