import { CourseListComponent } from './page-component/admin-panel/course-management/course-list/course-list.component';
import { Routes } from '@angular/router';
import { UserRole } from './constants/commonConstants';
import { HomeComponent } from './home-page-components/home/home.component';
import { DownloadFormComponent } from './page-component/student/download-form/download-form.component';
import { EBookComponent } from './page-component/student/e-book/e-book.component';
import { MarksDivisionComponent } from './page-component/student/marks-division/marks-division.component';
import { NotesComponent } from './page-component/student/notes/notes.component';
import { SoftwareDownloadComponent } from './page-component/student/software-download/software-download.component';
import { NoticeHolidayComponent } from './page-component/student/notice/notice-holiday/notice-holiday.component';
import { NoticeRegistrationComponent } from './page-component/student/notice/notice-registration/notice-registration.component';
import { AboutInstitutionComponent } from './page-component/about/about-institution/about-institution.component';
import { AboutRegistrationComponent } from './page-component/about/about-registration/about-registration.component';
import { CenterVerifyComponent } from './page-component/verification/center-verify/center-verify.component';
import { StudentVerifyComponent } from './page-component/verification/student-verify/student-verify.component';
import { CourseCertificateVerifyComponent } from './page-component/verification/course-certificate-verify/course-certificate-verify.component';
import { GallaryComponent } from './page-component/gallary/gallary.component';
import { ErrorComponent } from './error/error.component';
import { ContactComponent } from './page-component/contact-us/contact/contact.component';
import { FeedbackComponent } from './page-component/contact-us/feedback/feedback.component';
import { RulesComponent } from './page-component/contact-us/rules/rules.component';
import { HomeSlideshowComponent } from './page-component/admin-panel/update-dashboard-details/home-slideshow/home-slideshow.component';
import { LoginComponent } from './page-component/login/login.component';
import { AuthGuard } from './service/auth/Auth.guard';
import { UnAuthorizeComponent } from './un-authorize/un-authorize.component';
import { LogoutComponent } from './logout/logout.component';
import { MasterDetailsComponent } from './page-component/admin-panel/update-dashboard-details/master-details/master-details.component';
import { BackupComponent } from './page-component/admin-panel/data-backup/backup/backup.component';
import { ApplyFranchiesComponent } from './page-component/academic/franchise/apply-franchies/apply-franchies.component';
import { AddSubCourseCategoryComponent } from './page-component/admin-panel/course-management/add-sub-course-category/add-sub-course-category.component';
import { ViewCourseComponent } from './page-component/admin-panel/course-management/view-course/view-course.component';
import { EditSubCourseCategoryComponent } from './page-component/admin-panel/course-management/edit-sub-course-category/edit-sub-course-category.component';
import { ManageCenterComponent } from './page-component/admin-panel/manage-franchise/manage-center/manage-center.component';
import { EditFranchiseComponent } from './page-component/academic/franchise/edit-franchise/edit-franchise.component';
import { ProfileComponent } from './page-component/profile/profile.component';
import { RegisterStudentComponent } from './page-component/academic/student/register-student/register-student.component';
import { EditStudentDetailsComponent } from './page-component/academic/student/edit-student-details/edit-student-details.component';
import { ManageAdminComponent } from './page-component/admin-panel/manage-admin/manage-admin/manage-admin.component';
import { CreateAdminComponent } from './page-component/admin-panel/manage-admin/create-admin/create-admin.component';
import { EditAdminComponent } from './page-component/admin-panel/manage-admin/edit-admin/edit-admin.component';
import { ManageStudentComponent } from './page-component/admin-panel/student-management/manage-student/manage-student.component';
import { ManageWalletComponent } from './page-component/admin-panel/manage-wallet/manage-wallet/manage-wallet.component';
import { PayWalletComponent } from './page-component/admin-panel/manage-wallet/pay-wallet/pay-wallet.component';
import { TransactionHistoryComponent } from './page-component/admin-panel/manage-wallet/transaction-history/transaction-history.component';
import { ManageExamMarksComponent } from './page-component/admin-panel/student-management/manage-exam-marks/manage-exam-marks.component';
import { DownloadExcelToGenerateCertificateComponent } from './page-component/admin-panel/student-management/download-excel-to-generate-certificate/download-excel-to-generate-certificate.component';
import { StudentDashboardComponent } from './page-component/student/student-dashboard/student-dashboard.component';
import { ForgotPasswordComponent } from './page-component/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './page-component/change-password/change-password.component';
import { RequestForCertificateComponent } from './page-component/admin-panel/student-management/request-for-certificate/request-for-certificate.component';
import { CourseOfferedComponent } from './page-component/course-offered/course-offered.component';
import { BrandsManagementComponent } from './page-component/admin-panel/manage-brands/brands-management/brands-management.component';
import { YtlinksManagementComponent } from './page-component/admin-panel/manage-ytlinks/ytlinks-management/ytlinks-management.component';
import { NotificationManagementComponent } from './page-component/admin-panel/manage-notification/notification-management/notification-management.component';
import { BrandsAddComponent } from './page-component/admin-panel/manage-brands/brands-add/brands-add.component';
import { YtlinksAddComponent } from './page-component/admin-panel/manage-ytlinks/ytlinks-add/ytlinks-add.component';
import { NotificationAddComponent } from './page-component/admin-panel/manage-notification/notification-add/notification-add.component';
import { PassoutStudentComponent } from './page-component/admin-panel/student-management/passout-student/passout-student.component';
import { PublishTicketComponent } from './page-component/admin-panel/student-management/publish-ticket/publish-ticket.component';
import { ViewAllNotificationsComponent } from './home-page-components/view-all-notifications/view-all-notifications.component';

export const routes: Routes = [
  // Public routes - no authentication required
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  
  { path: 'verification/certificate', component: CourseCertificateVerifyComponent },
  { path: 'verification/student', component: StudentVerifyComponent },
  { path: 'verification/center', component: CenterVerifyComponent },

  { path: 'academic/apply-franchise', component: ApplyFranchiesComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN, UserRole.COMMON] } },
  { path: 'academic/edit-franchise/:center_id', component: EditFranchiseComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE] } },
  { path: 'academic/register-student', component: RegisterStudentComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE] } },
  { path: 'academic/edit-student-details/:student_id', component: EditStudentDetailsComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE] } },

  { path: 'course-offered', component: CourseOfferedComponent },

  { path: 'student/notice/registration', component: NoticeRegistrationComponent },
  { path: 'student/notice/holiday', component: NoticeHolidayComponent },
  { path: 'student/e-book', component: EBookComponent },
  { path: 'student/notes', component: NotesComponent },
  { path: 'student/marks-division', component: MarksDivisionComponent },
  { path: 'student/download-software', component: SoftwareDownloadComponent },
  { path: 'student/download-form', component: DownloadFormComponent },
  { path: 'student/dashboard', component: StudentDashboardComponent, canActivate: [AuthGuard], data: { role: [UserRole.STUDENT] } },

  { path: 'gallary/:type', component: GallaryComponent },

  { path: 'about/institution', component: AboutInstitutionComponent },
  { path: 'about/registration', component: AboutRegistrationComponent },

  { path: 'contact-us/contact', component: ContactComponent },
  { path: 'contact-us/feedback', component: FeedbackComponent },
  { path: 'contact-us/rules', component: RulesComponent },
  { path: 'view-all-notification', component: ViewAllNotificationsComponent},
  { path: 'control-panel/update-dashboard-details/home-slideshow', component: HomeSlideshowComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER] } },
  { path: 'control-panel/update-dashboard-details/master-details', component: MasterDetailsComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER] } },
  { path: 'control-panel/manage-admin', component: ManageAdminComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER] } },
  { path: 'control-panel/create-admin', component: CreateAdminComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER] } },
  { path: 'control-panel/edit-admin/:adminId', component: EditAdminComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER] } },
  { path: 'control-panel/course-list', component: CourseListComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN] } },
  { path: 'control-panel/add/sub-course', component: AddSubCourseCategoryComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN] } },
  { path: 'control-panel/view-course/:courseCode', component: ViewCourseComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN] } },
  { path: 'control-panel/edit-sub-course', component: EditSubCourseCategoryComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN] } },
  { path: 'control-panel/manage-franchise', component: ManageCenterComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN] } },
  { path: 'control-panel/manage-student', component: ManageStudentComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE] } },
  { path: 'control-panel/passout-student', component: PassoutStudentComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE] } },
  { path: 'control-panel/publish-ticket', component: PublishTicketComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE] } },
  { path: 'control-panel/update-exam-marks/:studentId', component: ManageExamMarksComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE] } },
  { path: 'control-panel/request-for-certificate', component: RequestForCertificateComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE] } },
  { path: 'control-panel/download-excel-for-certificate-generation', component: DownloadExcelToGenerateCertificateComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN] } },
  { path: 'control-panel/wallet/manage', component: ManageWalletComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN] } },
  { path: 'control-panel/wallet/recharge', component: PayWalletComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE] } },
  { path: 'control-panel/wallet/transaction-history', component: TransactionHistoryComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE] } },
  { path: 'control-panel/manage-brand', component: BrandsManagementComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER] } },
  { path: 'control-panel/add-brand', component: BrandsAddComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER] } },
  { path: 'control-panel/manage-youtube-link', component: YtlinksManagementComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER] } },
  { path: 'control-panel/add-youtube-link', component: YtlinksAddComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER] } },
  { path: 'control-panel/manage-notification', component: NotificationManagementComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER] } },
  { path: 'control-panel/add-notification', component: NotificationAddComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER] } },
  { path: 'control-panel/data-backup', component: BackupComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER] } },

  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE] } },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [] },

  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE] } },
  { path: 'un-authorized', component: UnAuthorizeComponent },

  { path: 'login', component: LoginComponent, canActivate: [] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard], data: { role: [UserRole.MASTER, UserRole.ADMIN, UserRole.FRANCHISE, UserRole.STUDENT] } },

  { path: '**', component: ErrorComponent },
];
