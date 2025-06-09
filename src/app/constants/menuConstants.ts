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
        name: 'Certificate Verify',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
        subMenu: [
          {
            id: 211,
            name: 'Course Certificate Verify',
            route: '/verification/certificate/course',
            role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
          },
          {
            id: 212,
            name: 'Other Certificate Verify',
            route: '/verification/certificate/other',
            role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
          },
        ],
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
    name: 'Academic',
    role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
    subMenu: [
      {
        id: 31,
        name: 'Download Certificate',
        route: 'academic/download-certificate',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 32,
        name: 'Download Form',
        route: '/academic/download-form',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 33,
        name: 'Pay Fees',
        route: '/academic/pay-fees',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT],
      },
      {
        id: 33,
        name: 'Apply Franchise',
        route: '/academic/apply-franchise',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.COMMON],
      },
    ],
  },
  {
    id: 4,
    name: 'Course Offered',
    role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
    subMenu: [
      {
        id: 41,
        name: 'Computer',
        route: '/course-offered/computer',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 42,
        name: 'Drawing',
        route: '/course-offered/drawing',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 43,
        name: 'Dance',
        route: '/course-offered/dance',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 44,
        name: 'Spoken English',
        route: '/course-offered/drawing',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 45,
        name: 'Others',
        route: '/course-offered/others',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
    ],
  },
  {
    id: 5,
    name: 'Student',
    role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
    subMenu: [
      {
        id: 51,
        name: 'Notice',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
        subMenu: [
          {
            id: 511,
            name: 'Reg Notice',
            route: '/student/notice/registration',
            role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
          },
          {
            id: 512,
            name: 'Holiday Notice',
            route: '/student/notice/holiday',
            role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
          },
        ],
      },
      {
        id: 52,
        name: 'E-Book',
        route: '/student/e-book',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 53,
        name: 'Notes',
        route: '/student/notes',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 54,
        name: 'Marks Division',
        route: '/student/marks-division',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 55,
        name: 'Software Download',
        route: '/student/software-download',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
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
        name: 'Photos - 1',
        route: '/gallary/1',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 62,
        name: 'Photos - 2',
        route: '/gallary/2',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 63,
        name: 'Photos - 3',
        route: '/gallary/3',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT, UserRole.COMMON],
      },
      {
        id: 64,
        name: 'Others Activity',
        route: '/gallary/others-activity',
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
        name: 'Manage Student',
        route: '/control-panel/manage-student',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE],
      },
      {
        id: 97,
        name: 'Manage Wallet',
        role: [UserRole.MASTER],
        subMenu: [
          {
            id: 971,
            name: 'Recharge Wallet',
            route: '/control-panel/wallet/recharge',
            role: [UserRole.MASTER],
          },
          {
            id: 972,
            name: 'Manage Wallet',
            route: '/control-panel/wallet/manage',
            role: [UserRole.MASTER],
          },
        ],
      },
      {
        id: 98,
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
    role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT],
    subMenu: [
      {
        id: 111,
        name: 'Profile',
        route: '/profile',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT],
      },
      {
        id: 112,
        name: 'Logout',
        route: '/logout',
        role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT],
      },
    ],
  },
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